package handlers

import (
	"lottoportal/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"

	valid "github.com/asaskevich/govalidator"
)

func (handler *EliestFinanceHandler) VerifyNuban(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.VerifyBankPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUESTBODY, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

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
