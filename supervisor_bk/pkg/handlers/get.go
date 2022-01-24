package handlers

import (
	"errors"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"

	"gorm.io/gorm"
)

func (handler *EliestSuperVisorHandler) FindSupervisor(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	values := r.URL.Query()
	refcode := values.Get("refcode")
	id := values.Get("id")

	var arg sharedmodel.Supervisor
	if refcode != "" {
		arg.RefCode = refcode
	}
	if id != "" {
		arg.Id = id
	}
	supervisor, err := handler.Db.FindSupervisor(&arg)
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
		"supervisor": supervisor,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) FindSupervisors(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var arg = map[string]interface{}{"is_auto_assign": false, "id": "", "refcode": "", "email": "", "reached_target_count": false}
	values := r.URL.Query()
	arg = helpers.ParseQuery(values, arg)
	log.Println(arg)

	supervisors, err := handler.Db.FindSupervisors(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{
		"supervisors": supervisors,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}
