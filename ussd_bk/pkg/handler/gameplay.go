package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"lottoussd/internals/data"
	"lottoussd/models"
	"net/http"
	"os"
	"time"
)

type Game struct {
	Id          string `json:"id"`
	Text        string `json:"test"`
	Description string `json:"description"`
}

func (handler *EliestHandler) GameList(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)

	if r.Method == "OPTIONS" {
		helpers.URespondWithJSON(w, http.StatusOK, "")
		return
	}

	resp, err := http.Get(os.Getenv("SettingsRoute") + "Ugames")
	if err != nil {
		log.Fatalln(err)
	}
	//We Read the response body on the line below.
	var u []sharedmodel.Game
	log.Println(resp.Body)
	err = json.NewDecoder(resp.Body).Decode(&u)
	if err != nil {
		log.Fatalln(err)
	}
	//Convert the body to type string
	//sb := string(resp.Body)

	helpers.URespondWithJSON(w, http.StatusOK, u)
}


func (handler *EliestHandler) PlayGame(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)

	if r.Method == "OPTIONS" {
		helpers.URespondWithJSON(w, http.StatusOK, "")
		return
	}
	var reg models.GamePlayPayload

	err := json.NewDecoder(r.Body).Decode(&reg)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	gameDetail, err := data.UseFindGame(reg.GameID)
	if err != nil {
		_ = "Invalid entry"
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	balance := 0.00
	var agt *sharedmodel.Agent
	var user *sharedmodel.Account
	walletId := ""

	if reg.Agent {
		agt, err = handler.Db.FindAgent(&sharedmodel.Agent{Phone: reg.MSISDN})

		if err != nil {
			helpers.URespondWithError(w, http.StatusNotFound, err.Error())
			return
		}

		agentFundedWallet, err := findWallet(agt.Id, constants.FUNDEDWALLET, "")

		if err != nil {
			return
		}

		wall, err := getWallet(agentFundedWallet.Wallet.Id)
		balance = wall.WalletQuery.Balance
		walletId = agentFundedWallet.Wallet.Id
	} else {
		user, err = handler.Db.FindAccount(&sharedmodel.Account{MSISDN: reg.MSISDN})
		if err != nil {
			helpers.URespondWithError(w, http.StatusNotFound, UserNotFound)
			return
		}
		balance = user.Balance
	}

	if balance < float64(gameDetail.Cost) {
		helpers.URespondWithError(w, http.StatusNotFound, constants.INSUFFICIENTFUNDS)
		return
	}

	entry := sharedmodel.GameEntry{
		Phone:    reg.MSISDN,
		GuessOne: reg.Guess,
		Amount:   float64(gameDetail.Cost),
		GameId:   gameDetail.Id,
		Time:     time.Now().Unix(),
	}

	handler.GamesLogger.AddGameToCollection(gameDetail.Id, "game", entry.String())

	currentCount, err := handler.GamesLogger.CollectionLength(gameDetail.Id, "game")

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}

	bal := balance - float64(gameDetail.Cost)
	if bal == 0 {
		bal = 0.1
	}

	if reg.Agent {
		err = operations.CreateDoubleEntryTransaction(float64(gameDetail.Cost), helpers.RandAlpha(7), walletId, constants.EARNEDACCOUNT, constants.GAMEFEEDESC, "")
		if err != nil {
			//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			//return
			log.Println(err)
		}
	} else {
		err = handler.Db.UpdateUser(user, &sharedmodel.Account{Balance: float64(bal)})
	}

	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "Could Not complete")
		return
	}

	if int(gameDetail.TargetCount) <= currentCount {
		handler.GamesLogger.ArchiveCollection(gameDetail.Id, "game")
		amount := gameDetail.WinnersCut

		if reg.Agent {
			agentWinWallet, err := findWallet(agt.Id, constants.WINNINGWALLET, "")
			log.Println(agentWinWallet.Wallet.Id)

			err = operations.CreateDoubleEntryTransaction(amount, "Win"+helpers.RandAlpha(4), constants.EARNEDACCOUNT, agentWinWallet.Wallet.Id, constants.WINNINGDECS, "")
			if err != nil {
				//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
				//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
				//return
				log.Println(err)
			}
		} else {
			err = handler.Db.UpdateUserMap(user, map[string]interface{}{"Wins": user.Wins + amount})
			if err != nil {
				helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
				return
			}
		}

		//handler.Db.UpdateUserMap(user, map[string]interface{}{"Wins", user.Win})
		response := fmt.Sprintf("Congrats! You have won %v. Visit the nearest agent to redeem your winnings from the winning wallet.", amount)
		helpers.URespondWithJSON(w, http.StatusOK, response)
	} else {
		response := "Whoops! Sorry you didn’t win. Try again"
		helpers.URespondWithError(w, http.StatusNotFound, response)
		return
	}

}
