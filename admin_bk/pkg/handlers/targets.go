package handlers

import (
	"log"
	"lottoadmin/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/twinj/uuid"
)

func (handler *EliestAdminHandler) CreateTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}
	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	log.Println(_admin)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	log.Println(10)

	if _admin.ReadOnly {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	var m models.CreateTargetPayload
	err = helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = handler.Db.CreateTarget(&sharedmodel.SupervisorTarget{
		Id:                  uuid.NewV4().String(),
		Title:               m.Title,
		Description:         m.Description,
		AgentSpendingTarget: m.AgentSpendingTarget,
		AgentDownlineTarget: 0.0,
		CreatedAt:           time.Now().Unix(),
		UpdatedAt:           time.Now().Unix(),
	})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"message": "successful"})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestAdminHandler) GetTargetAssignment(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	assignments, err := handler.Db.AllAssignments()

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, assignments)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) CreateTargetAssignment(w http.ResponseWriter, r *http.Request) {
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

	var m models.CreateAssignmentPayload
	err = helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	_, err = handler.Db.CreateTargetAssignment(&sharedmodel.TargetAssignment{
		Id:           uuid.NewV4().String(),
		Target:       m.Target,
		TargetAmount: m.Amount,
		Start:        m.Start,
		Deadline:     m.Deadline,
		Reward:       m.Reward,
		Supervisor:   m.Supervisor,
		CreatedAt:    time.Now().Unix(),
		UpdatedAt:    time.Now().Unix(),
	})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"message": "successful"})

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) AgentTargets(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	params := mux.Vars(r)
	targetId := params["id"]

	targets, err := handler.Db.GetAgentTargets(targetId)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, targets)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) AllTargets(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	targets, err := handler.Db.GetAllTargets()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, targets)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	params := mux.Vars(r)
	targetId := params["id"]

	target, err := handler.Db.GetATarget(targetId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, target)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateCancelTarget(w http.ResponseWriter, r *http.Request) {
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

	params := mux.Vars(r)
	assignId := params["id"]

	assignment, err := handler.Db.GetAAssignments(assignId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	err = handler.Db.UpdateAssignmentMap(assignment, map[string]interface{}{"cancelled": true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, err)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}
