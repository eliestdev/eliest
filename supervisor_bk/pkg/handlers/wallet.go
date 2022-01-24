package handlers

import (
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"net/http"
)

func (handler *EliestSuperVisorHandler) MyWallet(w http.ResponseWriter, r *http.Request) {
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

	wallet, err := findwallet(token.UserId, constants.SUPERVISORWALLET)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	_wallet, err := operations.GetWallet(wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"walletquery": _wallet.WalletQuery}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
