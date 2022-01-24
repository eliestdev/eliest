package handler

import (
	"encoding/json"
	"errors"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"lottoussd/models"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func (handler *EliestHandler) WinsCode(w http.ResponseWriter, r *http.Request) {

	var winPayload models.WinPayload

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	a := []rune(winPayload.Code)
	pin := string(a[0:3])
	serial := string(a[3:7])
	validator := pin + serial
	hash := sharedmodel.WinningHash(validator, serial)

	win, err := handler.Db.FindWinning(&hash)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		helpers.URespondWithError(w, http.StatusNotFound, "Invalid or used winning code")
		return
	}
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}
	if win.Status != "used" && win.Status == "active" {
		err = handler.Db.UpdateWinningMap(win, map[string]interface{}{"status": "used"})
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
			return
		}
		helpers.URespondWithJSON(w, http.StatusOK, models.WinCodeCheckPayload{Amount: win.Amount, Status: "active"})
		return
	} else {
		helpers.URespondWithError(w, http.StatusBadRequest, "Your entered an invalid code")
		return
	}
}
func (handler *EliestHandler) DepositsFailed(w http.ResponseWriter, r *http.Request) {
	var winPayload models.WinPayload

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	a := []rune(winPayload.Code)
	pin := string(a[0:3])
	serial := string(a[3:7])
	validator := pin + serial
	hash := sharedmodel.WinningHash(validator, serial)

	win, err := handler.Db.FindWinning(&hash)
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, "Invalid winning code")
		return
	}
	if win.Status == "used" {
		err = handler.Db.UpdateWinningMap(win, map[string]interface{}{"status": "active"})
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
			return
		}
		helpers.URespondWithJSON(w, http.StatusOK, "Winning code reversed")
		return
	} else {
		helpers.URespondWithError(w, http.StatusOK, "Invalid request")
		return
	}
}
func (handler *EliestHandler) DepositsSuccess(w http.ResponseWriter, r *http.Request) {

	var winPayload models.TransferredCallback

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, "")
}

func (handler *EliestHandler) TransferCallback(w http.ResponseWriter, r *http.Request) {

	var winPayload models.TransferredBankCallback

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	if winPayload.Amount < 100 {
		helpers.URespondWithError(w, http.StatusBadRequest, "Minimum funds error")
		return
	}

	act, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: winPayload.MSISDN})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	if act.Wins < float64(winPayload.Amount) {
		helpers.URespondWithError(w, http.StatusBadRequest, "Insufficient funds")
		return
	}

	err = handler.Db.UpdateUserMap(act, map[string]interface{}{"Wins": act.Wins - float64(winPayload.Amount)})

	err = operations.CreateDoubleEntryTransaction(act.Wins, helpers.RandAlpha(7), constants.EARNEDACCOUNT, act.MSISDN,  constants.WINWITHDRAWDECS, "")
	if err != nil {
		//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		//return
	}

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, "success")
}

func (handler *EliestHandler) TransferWinToAgent(w http.ResponseWriter, r *http.Request) {

	var winPayload models.TransferredCallback

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	if winPayload.Amount < 100 {
		helpers.URespondWithError(w, http.StatusBadRequest, "Minimum funds error")
		return
	}

	agt, err := handler.Db.FindAgent(&sharedmodel.Agent{Phone: winPayload.Agent})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "Agent not found")
		return
	}

	act, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: winPayload.MSISDN})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	if act.Wins < float64(winPayload.Amount) {
		helpers.URespondWithError(w, http.StatusBadRequest, "Insufficient funds")
		return
	}

	err = handler.Db.UpdateUserMap(act, map[string]interface{}{"Wins": act.Wins - float64(winPayload.Amount)})
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	wallet, err := findWallet(agt.Id, constants.WINNINGWALLET, "")
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = operations.CreateDoubleEntryTransaction(float64(winPayload.Amount), helpers.RandAlpha(7), act.MSISDN, wallet.Wallet.Id, constants.WINTRANSFERDECS, "")
	if err != nil {
		//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		//return
	}

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, "You have successfully transferred your winning")
}

func (handler *EliestHandler) WinValue(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	win := params["code"]

	if len(win) != 7 {
		helpers.URespondWithError(w, http.StatusNotFound, "Invalid or used winning code "+string(len(win)))
		return
	}

	pin := string(win[0:3])
	serial := string(win[3:7])
	validator := pin + serial
	hash := sharedmodel.WinningHash(validator, serial)

	winning, err := handler.Db.FindWinning(&hash)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		helpers.URespondWithError(w, http.StatusNotFound, "Invalid or used winning code")
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, map[string]interface{}{"status": winning.Status, "value": winning.Amount})
}

//9509925
