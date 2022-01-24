package handlers

import (
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"
)

func (handler *ElliestAgentHandler) GetScratchDenomination(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	den, err := handler.Db.GetDenominations()

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	response := helpers.CreateResponse(SUCCESS, "data", den)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}
