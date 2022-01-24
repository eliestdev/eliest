package handlers

import (
	"lottoadmin/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"
)

func (handler *EliestAdminHandler) GetSupervisorAmountCount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	amounts, err := handler.Db.GetSupervisorAmountCount()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, amounts)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}

func (handler *EliestAdminHandler) UpdateSupervisorAmountCount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var registerPayload models.SupervisorAmountCount
	err := helpers.DecodeJSONBody(w, r, &registerPayload)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	counts, err := handler.Db.UpdateSupervisorAmountCount(registerPayload)

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, counts)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}
