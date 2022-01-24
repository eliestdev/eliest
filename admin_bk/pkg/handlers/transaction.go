package handlers

import (
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"
	"strconv"
)

func (handler *EliestAdminHandler) GetAllTransactions(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	values := r.URL.Query()
	from := values.Get("from")
	to := values.Get("to")
	_from, _ := strconv.ParseInt(from, 10, 64)
	_to, _ := strconv.ParseInt(to, 10, 64)

	transactions, err := handler.Db.AllTransactions(_from, _to)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, transactions)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

