package handlers

import (
	"fmt"
	"log"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"

	"github.com/gorilla/mux"
)

func (handler *ElliestAgentHandler) GetDownlineInformation(w http.ResponseWriter, r *http.Request) {
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

	param := mux.Vars(r)
	downlineId := param["id"]

	params, err := GetParameter()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	downline, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: downlineId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	_wallet, err := operations.FindWallet(downline.Id, constants.WINNINGWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallet, err := operations.GetWallet(_wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	trans, err := handler.Db.FindWinningTransactions(wallet.WalletQuery.Info.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.TRANSACTIONNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	// Calculate Commissions
	commission := 0
	_transLength := len(trans)
	totalTransactions := 0

	for i := 0; i < _transLength; i++ {
		totalTransactions = int(trans[i].Amount) + int(totalTransactions)

		if i == _transLength-1 {
			commission = int(StoF(params.ReferralPercentage1)) * totalTransactions / 100
			fmt.Println(commission)
		}
	}

	// 1st Referer
	_downlines, err := handler.Db.FindAgents(downline.RefCode)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	data := map[string]interface{}{
		"agent":        downline,
		"downlines":    _downlines,
		"transactions": trans,
		"second":       agent,
		"commission":   commission,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) MoveToFundedWallet(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var payload models.DownlineWalletPayload
	err := helpers.DecodeJSONBody(w, r, &payload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	params, err := GetParameter()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	_wallet, err := operations.FindWallet(key.UserId, constants.FUNDEDWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallet, err := operations.GetWallet(_wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	_dWallet, err := operations.FindWallet(payload.DownlineId, constants.WINNINGWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	dWallet, err := operations.GetWallet(_dWallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	trans, err := handler.Db.FindWinningTransactions(dWallet.WalletQuery.Info.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.TRANSACTIONNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	commission := 0
	_transLength := len(trans)
	totalTransactions := 0

	for i := 0; i < _transLength; i++ {
		totalTransactions = int(trans[i].Amount) + int(totalTransactions)

		if i == _transLength-1 {
			commission = int(StoF(params.ReferralPercentage1)) * totalTransactions / 100

			if commission < int(payload.Amount) {
				response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
				helpers.RespondWithJSON(w, http.StatusNotFound, response)
				return
			}

			err = operations.CreateDoubleEntryTransaction(float64(commission), "Commission"+helpers.RandAlpha(4), constants.EARNEDACCOUNT, wallet.WalletQuery.Info.Id, constants.COMMISSIONDECS, "")
			if err != nil {
				log.Println(err)
				response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
				helpers.RespondWithJSON(w, http.StatusBadRequest, response)
				return
			}

			response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, "Moved to Funded Wallet")
			helpers.RespondWithJSON(w, http.StatusOK, response)

			// Update the db so this commission won't be used again
		}
	}

}

func (handler *ElliestAgentHandler) MoveToBankAccount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var payload models.DownlineBankPayload
	err := helpers.DecodeJSONBody(w, r, &payload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	params, err := GetParameter()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	_wallet, err := operations.FindWallet(key.UserId, constants.FUNDEDWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallet, err := operations.GetWallet(_wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	_dWallet, err := operations.FindWallet(payload.DownlineId, constants.WINNINGWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	dWallet, err := operations.GetWallet(_dWallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	trans, err := handler.Db.FindWinningTransactions(dWallet.WalletQuery.Info.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.TRANSACTIONNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	commission := 0
	_transLength := len(trans)
	totalTransactions := 0

	for i := 0; i < _transLength; i++ {
		totalTransactions = int(trans[i].Amount) + int(totalTransactions)

		if i == _transLength-1 {
			commission = int(StoF(params.ReferralPercentage1)) * totalTransactions / 100

			if commission < int(StoF(payload.Amount)) {
				response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
				helpers.RespondWithJSON(w, http.StatusNotFound, response)
				return
			}

			res, err := makeTransfer(payload.Amount, payload.Recipient)

			if err != nil {
				response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
				helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
				return
			}

			// Change Wallet Id below...
			err = operations.CreateDoubleEntryTransaction(StoF(payload.Amount), helpers.RandAlpha(7), wallet.WalletQuery.Info.Id, "PAYSTACK BALANCE", constants.WITHDRAWALPAYOUT, "")
			response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, res)
			helpers.RespondWithJSON(w, http.StatusOK, response)

			// Update the db so this commission won't be used again
		}
	}

}
