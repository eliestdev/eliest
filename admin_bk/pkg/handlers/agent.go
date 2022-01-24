package handlers

import (
	"lottoadmin/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (handler *EliestAdminHandler) GetAgentDetail(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	profile, err := handler.Db.AgentProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallets, err := handler.Db.FindWallets(map[string]interface{}{"owner": agtId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"profile": profile, "wallets": wallets})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetAgentFundings(w http.ResponseWriter, r *http.Request) {

	values := r.URL.Query()
	id := values.Get("id")
	from := values.Get("from")
	to := values.Get("to")
	_from, _ := strconv.ParseInt(from, 10, 64)
	_to, _ := strconv.ParseInt(to, 10, 64)

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	transactions, err := handler.Db.AllAgentFundings(id, _from, _to)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"transactions": transactions})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetWalletTransactions(w http.ResponseWriter, r *http.Request) {

	values := r.URL.Query()
	account := values.Get("account")
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	transactions, err := handler.Db.AllWalletTransactions(account)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"transactions": transactions})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetIncomeTransactions(w http.ResponseWriter, r *http.Request) {
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

	transactions, err := handler.Db.AllIncomeTransactions(constants.EARNEDACCOUNT, _from, _to)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"transactions": transactions})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetSupervisorDetail(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	agents, err := handler.Db.SupervisorAgents(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	profile, err := handler.Db.SupervisorProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"profile": profile, "agents": agents})

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetAgentDownline(w http.ResponseWriter, r *http.Request) {

}

func (handler *EliestAdminHandler) AllAgents(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	agents, err := handler.Db.AllAgents()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, agents)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) AllSupervisors(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	agents, err := handler.Db.AllSupervisors()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, agents)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateSuspendAgent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	if _admin.ReadOnly {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	agent, err := handler.Db.AgentProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	err = handler.Db.UpdateAgentMap(agent, map[string]interface{}{"suspended": true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, err)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateUnSuspendAgent(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	if _admin.ReadOnly {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	agent, err := handler.Db.AgentProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	err = handler.Db.UpdateAgentMap(agent, map[string]interface{}{"suspended": false})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, err)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateSuspendSupervisor(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	if _admin.ReadOnly {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	supervisor, err := handler.Db.SupervisorProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	err = handler.Db.UpdateSupervisorMap(supervisor, map[string]interface{}{"suspended": true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, err)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateUnSuspendSupervisor(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	if _admin.ReadOnly {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	supervisor, err := handler.Db.SupervisorProfile(agtId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	err = handler.Db.UpdateSupervisorMap(supervisor, map[string]interface{}{"suspended": false})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, err)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetGlobalAgentTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	tars, err := handler.Db.GetGlobalAgentTargets()

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, tars)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) ChangeGlobalAgentTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var payload models.AgentsTargetInformation
	err := helpers.DecodeJSONBody(w, r, &payload)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, err.Error())
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	tars, err := handler.Db.ChangeGlobalAgentTarget(payload)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, tars)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
