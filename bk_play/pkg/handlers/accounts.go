package handlers

import (
	"errors"
	"lottoportal/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"

	valid "github.com/asaskevich/govalidator"

	"gorm.io/gorm"
)

func (handler *EliestFinanceHandler) LoginUser(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var loginPayload models.LoginPayload

	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, "Fill in your phone number and year of birth", nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	loginPayload.MSISDN = "234" + helpers.TrimFirstRune(loginPayload.MSISDN)

	defer r.Body.Close()

	account, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: loginPayload.MSISDN, YOB: loginPayload.Pin})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.PLAYGETSTARTED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	ts, err := CreateToken(account.MSISDN)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	saveErr := CreateAuth(account.MSISDN, ts, handler.RedisClient)
	if saveErr != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	tokens := map[string]string{
		"data":          account.MSISDN,
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, tokens)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestFinanceHandler) UserProfile(w http.ResponseWriter, r *http.Request) {
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

	account, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: key.UserId})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, account)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
