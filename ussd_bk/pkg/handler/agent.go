package handler

import (
	"fmt"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"unicode/utf8"

	"github.com/gorilla/mux"
)

func (handler *EliestHandler) FindAgent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agentId := params["id"]
	agt, err := handler.Db.FindAgent(&sharedmodel.Agent{Phone: agentId})
	if err != nil {
		helpers.URespondWithError(w, http.StatusNotFound, err.Error())
		return
	}
	helpers.URespondWithText(w, http.StatusOK, fmt.Sprintf("%s %s", agt.Firstname, agt.Lastname))
}

func trimFirstRune(s string) string {
	_, i := utf8.DecodeRuneInString(s)
	return s[i:]
}
