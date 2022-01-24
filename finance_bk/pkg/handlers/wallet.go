package handlers

import (
	"errors"
	"log"
	"lottofinance/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"

	valid "github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

func (handler *EliestFinanceHandler) CreateWallet(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var createWalletPayload models.CreateWalletPayload
	err := helpers.DecodeJSONBody(w, r, &createWalletPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}

	_, err = valid.ValidateStruct(createWalletPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	defer r.Body.Close()
	_newWallet := models.WalletPayload(&createWalletPayload)
	walletId, err := handler.Db.CreateWallet(&_newWallet)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	data := map[string]string{
		"wallet_id": walletId,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.WALLETCREATEDSUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) GetWallet(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	log.Println("get wallet called " + r.Host)
	values := r.URL.Query()
	id := values.Get("id")

	var arg sharedmodel.Wallet
	if id != "" {
		arg.Id = id
	}
	walletQuery, err := handler.Db.GetWallet(&arg)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	sharedmodel.GetWalletQuerySummary(&walletQuery)
	
	data := map[string]interface{}{
		"walletquery": walletQuery,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) FindWallet(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	values := r.URL.Query()
	title := values.Get("title")
	owner := values.Get("owner")
	id := values.Get("id")

	var arg sharedmodel.Wallet
	if owner != "" {
		arg.Owner = owner
	}
	if id != "" {
		arg.Id = id
	}
	if title != "" {
		arg.Title = title
	}
	wallet, err := handler.Db.FindWallet(&arg)
	log.Println("find wallet called " + r.Host)
	log.Println(arg)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"wallet": wallet,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) FindWallets(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var arg = map[string]interface{}{"owner": ""}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)

	wallets, err := handler.Db.FindWallets(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"wallets": wallets,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) UpdateWallet(w http.ResponseWriter, r *http.Request) {

}
