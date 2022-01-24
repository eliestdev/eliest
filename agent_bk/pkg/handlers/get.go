package handlers

import (
	"errors"
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"

	"gorm.io/gorm"
)

func (handler *ElliestAgentHandler) FindAgents(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var arg = map[string]interface{}{"supervisor": ""}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)

	agents, err := handler.Db.IFindAgents(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"agents": agents,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) FindAgent(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var arg = map[string]interface{}{"id": "", "ref_code":"", "phone":""}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)


	agent, err := handler.Db.IFindAgent(arg)
	if errors.Is(err, gorm.ErrRecordNotFound){
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return	
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"agent": agent,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}