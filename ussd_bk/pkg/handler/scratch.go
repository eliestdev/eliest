package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"lottoussd/models"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Note: This for a player not an agent
func (handler *EliestHandler) ScratchPlayPlayer(w http.ResponseWriter, r *http.Request) {
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

	params := mux.Vars(r)
	id := params["id"]

	gameDetail, err := handler.Db.FindScratchGame(id)
	if err != nil {
		_ = "Invalid entry"
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	balance := 0.00
	var user *sharedmodel.Account

	// Play a game with scratch & Play and return won or lost
	user, err = handler.Db.FindAccount(&sharedmodel.Account{MSISDN: reg.MSISDN})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, UserNotFound)
		return
	}
	balance = user.Balance

	if balance < float64(gameDetail.Amount) {
		helpers.URespondWithError(w, http.StatusNotFound, constants.INSUFFICIENTFUNDS)
		return
	}

	entry := sharedmodel.GameEntry{
		Phone:    reg.MSISDN,
		GuessOne: reg.Guess,
		Amount:   float64(gameDetail.Amount),
		GameId:   gameDetail.ID,
		Time:     time.Now().Unix(),
	}

	handler.GamesLogger.AddGameToCollection(gameDetail.ID, "scratch", entry.String())
	currentCount, err := handler.GamesLogger.CollectionLength(gameDetail.ID, "scratch")

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}

	bal := balance - float64(gameDetail.Amount)
	if bal == 0 {
		bal = 0.1
	}

	err = handler.Db.UpdateUser(user, &sharedmodel.Account{Balance: float64(bal)})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "Could Not complete")
		return
	}

	if int(gameDetail.WinningCount) <= currentCount {
		handler.GamesLogger.ArchiveCollection(gameDetail.ID, "scratch")
		amount := gameDetail.AmountWon

		err = handler.Db.UpdateUserMap(user, map[string]interface{}{"Wins": user.Wins + amount})
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		//handler.Db.UpdateUserMap(user, map[string]interface{}{"Wins", user.Win})
		response := fmt.Sprintf("Congrats! You have won %v. Visit the nearest agent to redeem your winnings from the winning wallet.", amount)
		helpers.RespondWithJSON(w, http.StatusOK, helpers.ResponseData{
			Status: "SUCCESS",
			Message: "YOU WON",
			Data: response,
		})
	} else {
		response := "Whoops! Sorry you didn’t win. Try again"
		helpers.RespondWithJSON(w, http.StatusOK, helpers.ResponseData{
			Status: "SUCCESS",
			Message: "TRY AGAIN",
			Data: response,
		})
		return
	}
}

func (handler *EliestHandler) ScratchPlayAgent(w http.ResponseWriter, r *http.Request) {
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

	params := mux.Vars(r)
	id := params["id"]
	gameDetail, err := handler.Db.FindScratchGame(id)
	balance := 0.00
	var agt *sharedmodel.Agent
	walletId := ""

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

	if balance < float64(gameDetail.Amount) {
		helpers.URespondWithError(w, http.StatusNotFound, constants.INSUFFICIENTFUNDS)
		return
	}

	entry := sharedmodel.GameEntry{
		Phone:    reg.MSISDN,
		GuessOne: reg.Guess,
		Amount:   float64(gameDetail.Amount),
		GameId:   gameDetail.ID,
		Time:     time.Now().Unix(),
	}

	handler.GamesLogger.AddGameToCollection(gameDetail.ID, "scratch", entry.String())

	currentCount, err := handler.GamesLogger.CollectionLength(gameDetail.ID, "scratch")

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}

	bal := balance - float64(gameDetail.Amount)
	if bal == 0 {
		bal = 0.1
	}

	err = operations.CreateDoubleEntryTransaction(float64(gameDetail.Amount), helpers.RandAlpha(7), walletId, constants.EARNEDACCOUNT, constants.GAMEFEEDESC, "")
	if err != nil {
		//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		//return
		log.Println(err)
	}

	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "Could Not complete")
		return
	}

	if int(gameDetail.WinningCount) <= currentCount {
		handler.GamesLogger.ArchiveCollection(gameDetail.ID, "scratch")
		amount := gameDetail.AmountWon

		agentWinWallet, err := findWallet(agt.Id, constants.WINNINGWALLET, "")
		log.Println(agentWinWallet.Wallet.Id)

		err = operations.CreateDoubleEntryTransaction(amount, "Win"+helpers.RandAlpha(4), constants.EARNEDACCOUNT, agentWinWallet.Wallet.Id, constants.WINNINGDECS, "")
		if err != nil {
			//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			//return
			log.Println(err)
		}
		//handler.Db.UpdateUserMap(user, map[string]interface{}{"Wins", user.Win})
		response := fmt.Sprintf("Congrats! You have won %v. Visit the nearest agent to redeem your winnings from the winning wallet.", amount)
		helpers.RespondWithJSON(w, http.StatusOK, helpers.ResponseData{
			Status: "SUCCESS",
			Message: "YOU WON",
			Data: response,
		})
	} else {
		response := "Whoops! Sorry you didn’t win. Try again"
		helpers.RespondWithJSON(w, http.StatusOK, helpers.ResponseData{
			Status: "SUCCESS",
			Message: "TRY AGAIN",
			Data: response,
		})
		return
	}
}
