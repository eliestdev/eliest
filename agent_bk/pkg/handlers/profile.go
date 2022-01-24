package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	ops "lottoagent/helpers"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jinzhu/copier"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (handler *ElliestAgentHandler) ActivateAccount(w http.ResponseWriter, r *http.Request) {
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

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	if agent.AccountActivated {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTALREADYACTIVE, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	_wallet, err := operations.FindWallet(key.UserId, constants.FUNDEDWALLET, "")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	wallet, err := operations.GetWallet(_wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	params, err := GetParameter()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	if wallet.WalletQuery.Balance < params.ActivationFee {
		response := helpers.CreateResponse(constants.ERROR, fmt.Sprintf("%v - %v", constants.INSUFFICIENTFUNDS, params.ActivationFee), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	err = operations.CreateDoubleEntryTransaction(params.ActivationFee, helpers.RandAlpha(7), _wallet.Wallet.Id, constants.EARNEDACCOUNT, constants.ACTIVATIONFEE, "")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	err = handler.Db.UpdateAgent(agent, &sharedmodel.Agent{AccountActivated: true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	// Refund Voucher fee
	err = operations.CreateDoubleEntryTransaction(float64(params.ActivationVoucherReturn), helpers.RandAlpha(7), constants.EARNEDACCOUNT, _wallet.Wallet.Id, constants.ACTIVATIONFEE, "")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	remaining := params.ActivationFee - float64(params.ActivationVoucherReturn)
	firstRef, _ := strconv.ParseFloat(params.ReferralPercentage1, 64)
	firstLevelRef := (firstRef / remaining) * 100
	secondRef, _ := strconv.ParseFloat(params.ReferralPercentage1, 64)
	secondLevelRef := (secondRef / remaining) * 100

	//finalRemainder := remaining - firstLevelRef - secondLevelRef

	firstReferer, firstRefererReferer := findReferer(handler, agent.Referrer)

	err = operations.CreateDoubleEntryTransaction(firstLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, firstReferer, constants.REFERRALBONUSPAYMENT, "")

	// Pay second referrer
	secondReferer, _ := findReferer(handler, firstRefererReferer)
	err = operations.CreateDoubleEntryTransaction(secondLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, secondReferer, constants.REFERRALBONUSPAYMENT, "")

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var registerPayload sharedmodel.Agent
	err := helpers.DecodeJSONBody(w, r, &registerPayload)

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
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

	err = handler.Db.UpdateAgent(agent, &sharedmodel.Agent{Phone: registerPayload.Phone, Address: registerPayload.Address, Image: registerPayload.Image})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, "Profile Updated")
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	key, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
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
	var cleanAgent models.CleanAgent
	copier.Copy(&cleanAgent, &agent)

	data := map[string]interface{}{
		"profile": cleanAgent,
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func GetParameter() (*sharedmodel.Parameter, error) {
	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		return nil, err
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		return nil, err
	}
	return &parameters, nil
}

func (handler *ElliestAgentHandler) GetAgentDownline(w http.ResponseWriter, r *http.Request) {
	agentId := r.URL.Query().Get("aid")

	key, err := ExtractTokenMetadata(r)

	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: key.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	arg := agentId

	if agentId == "" {
		arg = agent.RefCode
	}
	log.Println(arg)

	agents, err := handler.Db.FindAgents(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	data := map[string]interface{}{"direct": agents}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var resetPass models.ResetPasswordPayload
	err := helpers.DecodeJSONBody(w, r, &resetPass)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	defer r.Body.Close()
	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Email: resetPass.Email})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	token := helpers.RandAlpha(7)
	errAccess := handler.RedisClient.Client.Set(agent.Id+constants.RESETPASSWORD, token, 1*time.Hour).Err()
	if errAccess != nil {
		response := helpers.CreateResponse(constants.ERROR, CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	body := fmt.Sprintf("<h3>Hello! %v </h3><p>You recently requested to reset your Eliest Lotto agent password. use the code <b>%v</b> to continue.</p> <br/> Click <a href='https://agents.eliestlotto.biz/auth/setpassword?user=%v'>HERE<a> to complete the process", agent.Lastname, token, agent.Email)
	to := []string{
		resetPass.Email,
	}

	request := helpers.Mail{
		Sender:  os.Getenv("Mailer"),
		To:      to,
		Subject: "Eliest Agent Password Reset Request",
		Body:    body,
	}
	msg := helpers.BuildMessage(request)
	err = helpers.SendEmail(request, msg)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	data := map[string]interface{}{"message": "Check your email to complete the process"}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) SetPassword(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var setPass models.AgentSetPasswordPayload
	err := helpers.DecodeJSONBody(w, r, &setPass)
	defer r.Body.Close()

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Email: setPass.Email})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	stroedToken, err := handler.RedisClient.Client.Get(agent.Id + "Pass").Result()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if stroedToken != setPass.Token {
		response := helpers.CreateResponse(constants.UNAUTHORIZED, CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(setPass.Password), bcrypt.DefaultCost)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	err = handler.Db.UpdateAgent(agent, &sharedmodel.Agent{Password: hashedPass})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	data := map[string]interface{}{"message": "Your Password has been updated"}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}
