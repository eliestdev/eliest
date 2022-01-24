package handlers

import (
	"errors"
	"fmt"
	"log"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"
	"time"

	valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func (handler *ElliestAgentHandler) CreateTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	var targetPayload models.CreateTargetPayload
	err = helpers.DecodeJSONBody(w, r, &targetPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(targetPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	today := time.Now()
	deadline := today.AddDate(0, 0, targetPayload.TimeLine)

	rew, err := handler.Db.FindGlobalTargets()
	fmt.Println(rew[0].Reward)
	fmt.Println(rew[0].Minimum)
	reward := int64(rew[0].Reward / rew[0].Minimum)
	fmt.Println(reward)
	target, err := handler.Db.CreateTarget(&sharedmodel.AgentTargetAssignment{AgentId: key.UserId, DownLine: targetPayload.DownLine, TimeLine: deadline.Unix(), Claimed: false, Reward: reward * int64(targetPayload.DownLine)})
	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, target)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) GetTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	params := mux.Vars(r)
	targetId := params["id"]
	_targetId, _ := StoUnit(targetId)
	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})

	target, err := handler.Db.GetTarget(&sharedmodel.AgentTargetAssignment{AgentId: key.UserId, ID: _targetId})

	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	status, err := getTargetStatus(handler, agent, target)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, status)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) DeleteTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	params := mux.Vars(r)
	targetId := params["id"]
	_targetId, _ := StoUnit(targetId)
	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	target, err := handler.Db.GetTarget(&sharedmodel.AgentTargetAssignment{AgentId: agent.Id, ID: _targetId})

	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	res, err := handler.Db.DeleteTarget(&target)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, res)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func getTargetStatus(handler *ElliestAgentHandler, agent *sharedmodel.Agent, target sharedmodel.AgentTargetAssignment) (sharedmodel.AgentTargetStatusResponse, error) {
	var targetStatus sharedmodel.AgentTargetStatusResponse
	targetStatus.Target = target
	agents, err := handler.Db.GetReferrals(agent.RefCode, target.CreatedAt, target.TimeLine)
	log.Println(target.CreatedAt, target.TimeLine)
	for _, v := range agents {
		_agent, _ := handler.Db.FindAgent(&sharedmodel.Agent{Id: v.NewAgent})
		if _agent.AccountActivated {
			targetStatus.ActivatedDownLines = append(targetStatus.ActivatedDownLines, *_agent)
		} else {
			targetStatus.InActiveDownLines = append(targetStatus.ActivatedDownLines, *_agent)
		}
	}
	return targetStatus, err
}

func (handler *ElliestAgentHandler) GetTargets(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	targets, err := handler.Db.GetTargets(&sharedmodel.AgentTargetAssignment{AgentId: key.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, targets)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) ClaimTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	var updateTargetPayload models.UpdateTargetPayload
	err = helpers.DecodeJSONBody(w, r, &updateTargetPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(updateTargetPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	params := mux.Vars(r)
	targetId := params["id"]
	_targetId, _ := StoUnit(targetId)
	target, err := handler.Db.GetTarget(&sharedmodel.AgentTargetAssignment{AgentId: key.UserId, ID: _targetId})

	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	if target.TimeLine > helpers.CreatedAt() {
		response := helpers.CreateResponse(constants.SUCCESS, "Target Expired", nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	if target.Claimed {
		response := helpers.CreateResponse(constants.SUCCESS, "You already claimed the target", nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	status, err := getTargetStatus(handler, &sharedmodel.Agent{Id: key.UserId}, target)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	if len(status.ActivatedDownLines) == int(target.DownLine) {
		response := helpers.CreateResponse(constants.SUCCESS, "Congratulations, you hit your set target!!! Your winning wallet has been funded with your reward", nil)
		helpers.RespondWithJSON(w, http.StatusOK, response)
	}

	response := helpers.CreateResponse(constants.ERROR, "You are almost there, check your status below", status)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) GetGlobalTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	tar, err := handler.Db.FindGlobalTargets()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, "data", tar)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) WithdrawTarget(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.TargetWithdrawalPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	defer r.Body.Close()

	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_targetId, _ := StoUnit(m.Target)
	target, err := handler.Db.GetTarget(&sharedmodel.AgentTargetAssignment{AgentId: key.UserId, ID: _targetId})

	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	if target.Claimed {
		response := helpers.CreateResponse(constants.SUCCESS, "You already claimed the target", nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	status, err := getTargetStatus(handler, &sharedmodel.Agent{Id: key.UserId}, target)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	wallet, err := getWallet(m.Wallet)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	fmt.Println("Wallet Exists " + wallet.WalletQuery.Info.Id)

	_amount, err := ParseFloat(m.Amount, 32)

	if len(status.ActivatedDownLines) >= int(target.DownLine) {
		err = handler.Db.UpdateTargetWithModel(&target, &sharedmodel.AgentTargetAssignment{Claimed: true})
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}

		res, err := makeTransfer(m.Amount, m.Recipient)

		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}

		err = operations.CreateDoubleEntryTransaction(_amount, helpers.RandAlpha(7), m.Wallet, "PAYSTACK BALANCE", constants.WITHDRAWALPAYOUT, "")
		response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, res)
		helpers.RespondWithJSON(w, http.StatusOK, response)
	}

	response := helpers.CreateResponse(constants.ERROR, "You are almost there, check your status below", status)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}
