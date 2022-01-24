package handlers

import (
	"encoding/json"
	ops "lottoadmin/helpers"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
)

func (handler *EliestAdminHandler) GetActivationFee(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.ActivationFee)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}



func (handler *EliestAdminHandler) GetVoucherDiscount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.VoucherDiscount)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}


func (handler *EliestAdminHandler) GetVoucherLength(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.VoucherLength)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}


func (handler *EliestAdminHandler) GetWinningLength(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.WinningLength)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}


func (handler *EliestAdminHandler) GetReferralFee(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.ReferralPercentage1)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetReferralFeeTwo(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.ReferralPercentage2)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}


func (handler *EliestAdminHandler) GetActivationReturn(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters.ActivationVoucherReturn)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}