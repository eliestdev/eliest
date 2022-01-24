package handler

import (
	"encoding/json"
	"errors"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"lottoussd/models"
	"net/http"
	"strings"
	"time"

	valid "github.com/asaskevich/govalidator"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func (handler *EliestHandler) Register(w http.ResponseWriter, r *http.Request) {

	var reg models.RegistrationPayload

	err := json.NewDecoder(r.Body).Decode(&reg)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err = valid.ValidateStruct(reg)
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	if len(reg.YOB) != 4{
		helpers.URespondWithError(w, http.StatusBadRequest, "Enter a valid year of birth: eg: 1960")
		return
	}

	user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: reg.MSISDN})
	if user != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, DoubleRegistration)
	}


	if errors.Is(err, gorm.ErrRecordNotFound) {
		id, err := handler.Db.CreateAccount(&sharedmodel.Account{
			MSISDN:    reg.MSISDN,
			YOB:       strings.ReplaceAll(reg.YOB, " " , "") ,
			Balance:   0.00,
			Wins:      0.00,
			RefCode:   "99" + helpers.RandInt(5),
			Status:    "active",
			CreatedAt: time.Now().Unix(),
			UpdatedAt: time.Now().Unix(),
		})
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
			return
		}
		helpers.URespondWithJSON(w, http.StatusOK, id)
		return
	}
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}
}

func (handler *EliestHandler) Details(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	msisdn := params["msisdn"]

	user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: msisdn})
	if user == nil {
		helpers.URespondWithError(w, http.StatusNotFound, UserNotFound)
		return
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		helpers.URespondWithError(w, http.StatusNotFound, UserNotFound)
		return
	}
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, user)
}
