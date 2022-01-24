package handlers

import (
	"log"
	"lottoadmin/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func (handler *EliestAdminHandler) GetAPartner(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	n, err := strconv.ParseUint(agtId, 10, 64)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	partner, err := handler.Db.GetParnet(&sharedmodel.Partner{Id: n})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"partner": partner})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestAdminHandler) GetPartners(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	partner, err := handler.Db.GetAllParnet()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"partner": partner})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdatePartner(w http.ResponseWriter, r *http.Request) {
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

	log.Println(agtId)
	n, err := strconv.ParseUint(agtId, 10, 64)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	partner, err := handler.Db.GetParnet(&sharedmodel.Partner{Id: n})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	var update sharedmodel.Partner
	err = helpers.DecodeJSONBody(w, r, &update)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	err = handler.Db.UpdatePartnerMap(&partner, map[string]interface{}{"status": update.Status, "percentage": update.Percentage})

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"message": "success"})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestAdminHandler) LoginPartner(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var update models.PayloadPartnerLogin 
	err := helpers.DecodeJSONBody(w, r, &update)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	partner, err := handler.Db.GetParnet(&sharedmodel.Partner{Email: update.Email})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	
	err = bcrypt.CompareHashAndPassword(partner.Password, []byte(update.Password))
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDUSER, err.Error())
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"partner": partner})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestAdminHandler) AddPartner(w http.ResponseWriter, r *http.Request) {

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

	var update models.CreatePartner

	err = helpers.DecodeJSONBody(w, r, &update)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	log.Println(update.Password)

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(update.Password), bcrypt.DefaultCost)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	log.Println(string(hashedPass))

	_, err = handler.Db.AddParnet(&sharedmodel.Partner{Name: update.Name, Email: update.Email, Percentage: update.Percentage, Status: true, WalletId: helpers.RandAlpha(7), Password: hashedPass})

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, map[string]interface{}{"message": "success"})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}
