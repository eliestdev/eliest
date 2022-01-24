package handlers

import (
	"errors"
	"lottoagent/models"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (handler *ElliestAgentHandler) AgentLogin(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var loginPayload models.AgentLoginPayload

	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	defer r.Body.Close()

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Email: loginPayload.Email})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(ERROR, "That specific agent Account does not exist", nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	if agent.Suspended == true {
		response := helpers.CreateResponse(ERROR, AccountSuspended, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	err = bcrypt.CompareHashAndPassword(agent.Password, []byte(loginPayload.Password))
	if err != nil {
		response := helpers.CreateResponse(ERROR, InavalidUser, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	ts, err := CreateToken(agent.Id)
	if err != nil {
		response := helpers.CreateResponse(ERROR, CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	saveErr := CreateAuth(agent.Id, ts, handler.RedisClient)
	if saveErr != nil {
		response := helpers.CreateResponse(ERROR, CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	tokens := map[string]string{
		"data":          agent.Id,
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	response := helpers.CreateResponse(SUCCESS, LoginSuccessful, tokens)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
