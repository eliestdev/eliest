package handlers

import (
	"errors"
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"

	"gorm.io/gorm"
)

func (handler *EliestSuperVisorHandler) MyTargets(w http.ResponseWriter, r *http.Request) {
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

	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Id: token.UserId})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	//v := r.URL.Query()
	//phone := v.Get("phone")

	targets, err := handler.Db.GetTargetAssignments(map[string]interface{}{"supervisor": supervisor.Phone})
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	//helpers.RespondWithJSON(w, http.StatusOK, map[string]interface{}{"targets": targets})

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, targets)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) GetTargetDetail(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	//params := mux.Vars(r)
	//targetId := params["id"]

	//target, err := handler.Db.GetATarget(targetId)
	//if err != nil {
	//	helpers.RespondWithError(w, http.StatusBadRequest, err.Error())
	//	return
	//}
	//helpers.RespondWithJSON(w, http.StatusOK, map[string]interface{}{"target": target})

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) ClaimTargetReward(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	//message := ""
	total := 0.0
	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	v := r.URL.Query()
	targetId := v.Get("tid")
	log.Println(targetId)


	//get the target
	assignment, err := handler.Db.GetTargetAssignment(&sharedmodel.TargetAssignment{Id: targetId})
	// find transactions that happened during that time
	transactions, err := operations.FindTransactions("", "", constants.CORALPAYDECS, "", token.UserId, assignment.Start, assignment.Deadline)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	// get the sum of his agents
	//TODO
	//THERE HAS TO BE A BETTER IMPLEMENTATION
	for _, transaction := range transactions.Transactions {
			total += transaction.Amount
	}
	log.Println(total)
	log.Println(assignment.TargetAmount)
	if total >= assignment.TargetAmount {
		_, err = handler.Db.CreateTargetReward(&sharedmodel.TargetReward{Id: fmt.Sprintf("%v-%v", assignment.Id, token.UserId), Target: assignment.Id, Supervisor: token.UserId, Reward: assignment.Reward, CreatedAt: helpers.CreatedAt(), UpdatedAt: helpers.CreatedAt()})
		if err != nil {	
			response := helpers.CreateResponse(constants.SUCCESS, constants.TARGETDUPLICATION, nil)
			helpers.RespondWithJSON(w, http.StatusOK, response)
			return
		}
		
		wallet, err := findwallet(token.UserId, constants.SUPERVISORWALLET)
		if err != nil {	
		}
		err = operations.CreateDoubleEntryTransaction(assignment.Reward, helpers.RandAlpha(7), constants.EARNEDACCOUNT, wallet.Wallet.Id, constants.SUPERVISORREWARD, "")
		if err != nil {	
		}
		
	}

	if total < assignment.TargetAmount {
			response := helpers.CreateResponse(constants.SUCCESS, constants.TARGETFAILED, nil)
			helpers.RespondWithJSON(w, http.StatusOK, response)
			return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.TARGETSUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
