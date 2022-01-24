package handlers

import (
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"net/http"
	"strconv"

	valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
)

func (handler *ElliestAgentHandler) GetWallets(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	wallets, err := getAgentWallets(token.UserId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"wallets": wallets.Wallets}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) GetWallet(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	_, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	values := r.URL.Query()
	walletId := values.Get("id")

	wallet, err := getWallet(walletId)

	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"walletquery": wallet.WalletQuery}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) WalletTransaction(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	params := mux.Vars(r)
	walletID := params["wallet_id"]

	if walletID == "" {
		response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	wallet, err := getWallet(walletID)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	transactions, err := handler.Db.FindTransactions(wallet.WalletQuery.Info.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.TRANSACTIONNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wins, err := handler.Db.FindWinningTransactions(wallet.WalletQuery.Info.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.TRANSACTIONNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	balance := 0.0
	for _, v := range transactions {
		if v.Class == "debit" {
			balance -= v.Amount
		}
		if v.Class == "credit" {
			balance += v.Amount
		}
	}
	//wallet.Balance = float64(balance)
	data := map[string]interface{}{"transactions": wallet.WalletQuery.Transactions, "wallet": wallet.WalletQuery.Info, "wins": wins}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) VerifyNuban(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.WithdrawPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
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
	// Call verify nuban
	name, recipient, err := verifyNuban(m.Nuban, m.Bank)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"name": name, "recipient": recipient}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) MakeTransferNuban(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.TransferPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
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

	wallet, err := getWallet(m.Wallet)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	_amount, err := ParseFloat(m.Amount, 32)

	if wallet.WalletQuery.Balance < _amount {
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

func ParseFloat(s string, bitSize int) (float64, error) {
	return strconv.ParseFloat(s, bitSize)
}
