package handlers

import (
	"errors"
	"log"

	// "log"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"strings"

	valid "github.com/asaskevich/govalidator"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (handler *ElliestAgentHandler) AgentRegister(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var registerPayload models.RegisterAgentPayload
	err := helpers.DecodeJSONBody(w, r, &registerPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, InvalidRequestBody, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(registerPayload)
	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	registerPayload.Phone = strings.ReplaceAll(registerPayload.Phone, " ", "")
	defer r.Body.Close()

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Email: registerPayload.Email})

	if errors.Is(err, gorm.ErrRecordNotFound) && agent == nil {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(registerPayload.Password), bcrypt.DefaultCost)
		if err != nil {
			// response := helpers.CreateResponse(ERROR, CouldNotComplete, nil)
			response := helpers.CreateResponse(ERROR, "Account not Found", nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		var newAgent sharedmodel.Agent
		newAgent.Password = hashedPass
		initializeNewAgent(&newAgent, registerPayload)

		if !helpers.StartsWith(registerPayload.Referer, "55") {
			assignToAutoSupervisor(&newAgent)
		} else {
			err := assignToSupervisor(&newAgent, registerPayload.Referer)
			log.Println(err)
			if err != nil {
				assignToAutoSupervisor(&newAgent)
			}
		}

		_agent, err := handler.Db.CreateAgent(&newAgent)
		if err != nil {
			response := helpers.CreateResponse(ERROR, err.Error(), nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}

		// Todo
		// Move to background
		_, err = handler.Db.CreateReferral(&sharedmodel.AgentReferalls{RefCode: registerPayload.Referer, NewAgent: _agent, Activated: false})
		if err != nil {
			//log error
		}
		//Todo
		// Move to background
		err = createNewAgentWallets(_agent)
		if err != nil {
			//log error
		}

		//Todo
		//Background task to check if supervisor is complete or not and proceed to update

		ts, err := CreateToken(_agent)
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		saveErr := CreateAuth(_agent, ts, handler.RedisClient)
		if saveErr != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}

		tokens := map[string]string{
			"data":          _agent,
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}
		//
		response := helpers.CreateResponse(SUCCESS, RegSuccessful, tokens)
		helpers.RespondWithJSON(w, http.StatusOK, response)
		return
	}

	if agent != nil {
		response := helpers.CreateResponse(ERROR, DuplicateAccount, nil)
		helpers.RespondWithJSON(w, http.StatusOK, response)
		return
	}

	if err != nil {
		response := helpers.CreateResponse(ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
}
