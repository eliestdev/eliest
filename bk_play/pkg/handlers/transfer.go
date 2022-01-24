package handlers

import (
	"errors"
	"fmt"
	"lottoportal/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"

	valid "github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

func (handler *EliestFinanceHandler) TransferWinsToAgent(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var payload models.TransferredCallback
	err := helpers.DecodeJSONBody(w, r, &payload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	fmt.Println(token.UserId)

	if payload.Amount < 100 {
		helpers.URespondWithError(w, http.StatusBadRequest, "Minimum funds error")
		return
	}

	agt, err := handler.Db.FindAgent(&sharedmodel.Agent{Phone: payload.Agent})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "Agent not found")
		return
	}

	act, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: payload.MSISDN})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	if act.Wins < float64(payload.Amount) {
		helpers.URespondWithError(w, http.StatusBadRequest, "Insufficient funds")
		return
	}

	err = handler.Db.UpdateUserMap(&act, map[string]interface{}{"Wins": act.Wins - float64(payload.Amount)})
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	wallet, err := handler.Db.FindWallet(agt.Id, constants.WINNINGWALLET, "")
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = operations.CreateDoubleEntryTransaction(float64(payload.Amount), helpers.RandAlpha(7), act.MSISDN, wallet.Wallet.Id, constants.WINTRANSFERDECS, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, "You have successfully transferred your winning")
}

func (handler *EliestFinanceHandler) TransferToBankAccount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	account, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: key.UserId})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	var m models.TransferPayload
	err = helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUESTBODY, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	defer r.Body.Close()

	_amount, err := ParseFloat(m.Amount, 32)

	if account.Balance < _amount {
		response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	// Call verify nuban
	res, err := makeTransfer(m.Amount, m.Recipient)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	err = operations.CreateDoubleEntryTransaction(_amount, helpers.RandAlpha(7), m.Wallet, "PAYSTACK BALANCE", constants.WITHDRAWALPAYOUT, "")
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, res)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
