package handlers

import (
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"lottosupervisor/models"
	"net/http"
)

// Don't get paid until threshold

// Find agents not performing weekly, monthly, 300 supervisors

func (handler *EliestSuperVisorHandler) AssignNonPayingAgents(w http.ResponseWriter, r *http.Request) {
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

	var agent models.NonPayingSupervisorAgentPayload
	err = helpers.DecodeJSONBody(w, r, &agent)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	agt, err := handler.Db.FindAgent(agent)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	sup, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Id: agt[0].Supervisor})

	if agt[0].Supervisor == sup.Id {
		response := helpers.CreateResponse(constants.ERROR, constants.SUPERVISORASSIGNED, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	if agt[0].Supervisor != "" {
		if err != nil {
			err := handler.Db.UpdateAgent(&agt[0], &sharedmodel.Agent{Supervisor: token.UserId})

			if err != nil {
				response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
				helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
				return
			}

			response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, constants.AGENTASSIGNED)
			helpers.RespondWithJSON(w, http.StatusOK, response)
		}

		response := helpers.CreateResponse(constants.ERROR, constants.SUPERVISORASSIGNED, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	e := handler.Db.UpdateAgent(&agt[0], &sharedmodel.Agent{Supervisor: token.UserId})

	if e != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, constants.AGENTASSIGNED)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}

func (handler *EliestSuperVisorHandler) AssignAutomatically(w http.ResponseWriter, r *http.Request) {
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

	super, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if !super.AccountActivated {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.NOTACTIVATED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if !super.IsAutoAssign {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.NOTPAYINGTYPE, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	adminCount, err := handler.Db.GetSupervisorAdminAssignCount()
	count := adminCount[0].Count

	freeAgts, err := handler.Db.FindUnAssignedAgents(int64(count))
	amountAgts := len(freeAgts)

	for i := 0; i < amountAgts; i++ {
		handler.Db.UpdateAgent(&freeAgts[i], &sharedmodel.Agent{Supervisor: token.UserId})
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, constants.AGENTASSIGNED)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}
