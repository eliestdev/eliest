package handlers

import (
	"encoding/json"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	ops "lottosupervisor/helpers"
	"net/http"
)

func (handler *EliestSuperVisorHandler) GetParameters(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	content, err := ops.ReadFile("parameters.json")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := parameters
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}
