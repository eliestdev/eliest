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

func (handler *EliestFinanceHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	log.Println("create transaction called " + r.Host)

	var createTransactionPayload models.CreateTransactionPayload
	err := helpers.DecodeJSONBody(w, r, &createTransactionPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}

	_, err = valid.ValidateStruct(createTransactionPayload)
	if err != nil {
		log.Println(err.Error())

		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	defer r.Body.Close()
	_newTransaction := sharedmodel.NewTransaction(createTransactionPayload.Reference, createTransactionPayload.Account, createTransactionPayload.Class, createTransactionPayload.Source, createTransactionPayload.Destination, createTransactionPayload.Description, createTransactionPayload.Supervisor, createTransactionPayload.Amount)
	transactionId, err := handler.Db.CreateTransaction(&_newTransaction)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	data := map[string]string{
		"transaction_id": transactionId,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestFinanceHandler) FindTransaction(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	values := r.URL.Query()
	id := values.Get("id")

	var arg sharedmodel.Transaction
	if id != "" {
		arg.Id = id
	}
	transaction, err := handler.Db.FindTransaction(&arg)
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
		"transaction": transaction,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestFinanceHandler) FindAllTransactions(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	values := r.URL.Query()
	id := values.Get("id")

	var arg sharedmodel.Transaction
	if id != "" {
		arg.Account = id
	}
	transaction, err := handler.Db.FindAllTransactions(&arg)
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
		"transaction": transaction,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) FindTransactions(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	values := r.URL.Query()
	id := values.Get("account")
	from := values.Get("from")
	to := values.Get("to")

	var arg = map[string]interface{}{"account": id, "from": from, "to": to}

	arg = helpers.ParseQuery(values, arg)

	transactions, err := handler.Db.FindTransactions(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"transactions": transactions,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestFinanceHandler) FindHeavierTransactions(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var arg = map[string]interface{}{"account": "", "reference": "", "class": "", "description": "", "supervisor": "", "from": 0, "to": 0}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)

	transactions, err := handler.Db.FindTransactions(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"transactions": transactions,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) FindRecentTransactions(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var arg = map[string]interface{}{"account": "", "reference": "", "class": "", "description": "", "supervisor": "", "from": 0, "to": 0}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)

	transactions, err := handler.Db.FindRecentTransactions(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"transactions": transactions,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}
