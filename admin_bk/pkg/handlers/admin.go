package handlers

import (
	"errors"
	"log"
	"lottoadmin/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"

	valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
	"github.com/twinj/uuid"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (handler *EliestAdminHandler) GetAdmins(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	admins, err := handler.Db.GetAllAdmin()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"admins": admins})
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) LoginAdmin(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var loginPayload models.PayloadAdminLogin
	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}
	defer r.Body.Close()

	admin, err := handler.Db.AuthenticateAdmin(&sharedmodel.AdminAccount{Email: loginPayload.Email})
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

	if admin.Status != true {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTSUSPENDED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	err = bcrypt.CompareHashAndPassword(admin.Password, []byte(loginPayload.Password))
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDUSER, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	ts, err := CreateToken(admin.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	saveErr := CreateAuth(admin.Id, ts, handler.RedisClient)
	if saveErr != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	data := map[string]string{
		"data":          admin.Id,
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestAdminHandler) CreateAdmin(w http.ResponseWriter, r *http.Request) {

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}


	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	log.Println(_admin)
	if _admin.ReadOnly{
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}



	var registerPayload models.RegisterAdminPayload
	err = helpers.DecodeJSONBody(w, r, &registerPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	_, err = valid.ValidateStruct(registerPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	defer r.Body.Close()
	admin, err := handler.Db.AuthenticateAdmin(&sharedmodel.AdminAccount{Email: registerPayload.Email})

	if errors.Is(err, gorm.ErrRecordNotFound) && admin == nil {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(registerPayload.Password), bcrypt.DefaultCost)
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		ref := helpers.RandInt(4)
		ref = "666" + ref

		_id, err := handler.Db.CreateAdmin(&sharedmodel.AdminAccount{
			Password:         hashedPass,
			Id:               uuid.NewV4().String(),
			Name:        registerPayload.Name,
			ReadOnly: registerPayload.ReadOnly,
			Email:            registerPayload.Email,
			Status:           true,
			Reference: ref,
			Phone:            registerPayload.Phone,
			CreatedAt:        helpers.CreatedAt(),
			UpdatedAt:        helpers.CreatedAt(),
		})

		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}

		data := map[string]interface{}{
			"data":         _id,
		}
		response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
		helpers.RespondWithJSON(w, http.StatusOK, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if admin != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.DUPLICATEACCOUNT, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
}

func (handler *EliestAdminHandler) UpdateAdmin(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	log.Println(agtId)
	
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
	if _admin.ReadOnly{
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}
	
	pdmin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: agtId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	
	var update models.UpdateAdminAccountPayload
	err = helpers.DecodeJSONBody(w, r, &update)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	_update := sharedmodel.AdminAccount{
		Email: update.Email,
		Phone: update.Phone,
		ReadOnly: update.ReadOnly,
		Status: update.Status,
		Name: update.Name,
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(update.Password), bcrypt.DefaultCost)
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		_update.Password = hashedPass
	
		log.Println(update.Password)

	err = handler.Db.UpdateAdmin(&pdmin, _update)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, map[string]interface{}{"message": "success"})

	helpers.RespondWithJSON(w, http.StatusOK, response)

}