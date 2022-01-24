package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	ops "lottosupervisor/helpers"
	"lottosupervisor/models"
	"net/http"
	"os"
	"time"

	valid "github.com/asaskevich/govalidator"
	"github.com/twinj/uuid"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (handler *EliestSuperVisorHandler) Login(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var loginPayload models.SupervisorAgentLogin
	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}

	defer r.Body.Close()

	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Email: loginPayload.Email})
	if errors.Is(err, gorm.ErrRecordNotFound) {
		response := helpers.CreateResponse(constants.ERROR, "Supervisor does not exits", nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	if supervisor.Suspended == true {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTSUSPENDED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	err = bcrypt.CompareHashAndPassword(supervisor.Password, []byte(loginPayload.Password))
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	ts, err := CreateToken(supervisor.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	saveErr := CreateAuth(supervisor.Id, ts, handler.RedisClient)
	if saveErr != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	data := map[string]string{
		"data":          supervisor.Id,
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.WALLETCREATEDSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) DeleteSupervisor(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var loginPayload models.SupervisorAgentLogin
	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}

	defer r.Body.Close()

	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Email: loginPayload.Email})
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

	data, err := handler.Db.DeleteSupervisor(supervisor)

	response := helpers.CreateResponse(constants.SUCCESS, "done", data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) Register(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var registerPayload models.RegisterSupervisorPayload
	err := helpers.DecodeJSONBody(w, r, &registerPayload)
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
	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Email: registerPayload.Email})

	if errors.Is(err, gorm.ErrRecordNotFound) && supervisor == nil {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(registerPayload.Password), bcrypt.DefaultCost)
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		ref := helpers.RandInt(4)
		ref = "555" + ref

		_id, err := handler.Db.CreateSupervisor(&sharedmodel.Supervisor{
			Password:         hashedPass,
			Id:               uuid.NewV4().String(),
			Firstname:        registerPayload.Firstname,
			Lastname:         registerPayload.Lastname,
			Email:            registerPayload.Email,
			Status:           "active",
			Phone:            registerPayload.Phone,
			State:            registerPayload.State,
			City:             registerPayload.City,
			Lg:               registerPayload.Lg,
			Address:          registerPayload.Address,
			RefCode:          ref,
			CreatedAt:        time.Now().Unix(),
			UpdatedAt:        time.Now().Unix(),
			AccountActivated: false,
		})

		if err != nil {
			// response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}

		err = createSupervisorWallet(_id)
		if err != nil {
			//log error
		}

		ts, err := CreateToken(_id)
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}
		saveErr := CreateAuth(_id, ts, handler.RedisClient)
		if saveErr != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
			return
		}

		data := map[string]interface{}{
			"data":          _id,
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}
		response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
		helpers.RespondWithJSON(w, http.StatusOK, response)
		return
	}
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if supervisor != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.DUPLICATEACCOUNT, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
}

func (handler *EliestSuperVisorHandler) Profile(w http.ResponseWriter, r *http.Request) {
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
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := supervisor
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) Activate(w http.ResponseWriter, r *http.Request) {
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

	sup, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Id: key.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	if sup.AccountActivated {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTALREADYACTIVE, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	_wallet, err := findwallet(sup.Id, constants.SUPERVISORWALLET)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallet, err := operations.GetWallet(_wallet.Wallet.Id)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	params, err := ops.ReadFile("parameters.json")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(params, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	if wallet.WalletQuery.Balance == 0 {
		response := helpers.CreateResponse(constants.ERROR, fmt.Sprintf("%v - %v", constants.INSUFFICIENTFUNDS, parameters.SupervisorActivationFee), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	if wallet.WalletQuery.Balance < parameters.SupervisorActivationFee {
		response := helpers.CreateResponse(constants.ERROR, fmt.Sprintf("%v - %v", constants.INSUFFICIENTFUNDS, parameters.SupervisorActivationFee), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	err = operations.CreateDoubleEntryTransaction(parameters.SupervisorActivationFee, helpers.RandAlpha(7), _wallet.Wallet.Id, constants.EARNEDACCOUNT, constants.ACTIVATIONFEE, "")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	err = handler.Db.UpdateSupervisor(sup, &sharedmodel.Supervisor{AccountActivated: true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	// Refund Voucher fee
	err = operations.CreateDoubleEntryTransaction(float64(parameters.ActivationVoucherReturn), helpers.RandAlpha(7), constants.EARNEDACCOUNT, _wallet.Wallet.Id, constants.ACTIVATIONFEE, "")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	// Assign free Agents
	handler.AssignAutomatically(w, r)

	// remaining := parameters.SupervisorActivationFee - float64(parameters.ActivationVoucherReturn)
	// firstRef, _ := strconv.ParseFloat(parameters.ReferralPercentage1, 64)
	// firstLevelRef := (firstRef / remaining) * 100
	// secondRef, _ := strconv.ParseFloat(parameters.ReferralPercentage1, 64)
	// secondLevelRef := (secondRef / remaining) * 100

	//finalRemainder := remaining - firstLevelRef - secondLevelRef

	// firstReferer, firstRefererReferer := findReferer(handler, sup.Referrer)

	// err = operations.CreateDoubleEntryTransaction(firstLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, firstReferer, constants.REFERRALBONUSPAYMENT, "")

	// // Pay second referrer
	// secondReferer, _ := findReferer(handler, firstRefererReferer)
	// err = operations.CreateDoubleEntryTransaction(secondLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, secondReferer, constants.REFERRALBONUSPAYMENT, "")

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
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
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"profile": supervisor}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *EliestSuperVisorHandler) ActivateAccount(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	defer r.Body.Close()

	v := r.URL.Query()
	key := v.Get("key")
	ref := v.Get("ref")

	if key != constants.KEY {
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	agent, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{RefCode: ref})
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

	err = handler.Db.UpdateSupervisor(agent, &sharedmodel.Supervisor{AccountActivated: true})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func GetParameter() (*sharedmodel.Parameter, error) {
	content, err := operations.ReadFile(os.Getenv("WorkStation"), "parameters.json")

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

func (handler *EliestSuperVisorHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var registerPayload models.SupervisorProfile
	err := helpers.DecodeJSONBody(w, r, &registerPayload)

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	handler.Db.UpdateSupervisor(supervisor, &sharedmodel.Supervisor{Phone: registerPayload.Phone, Address: registerPayload.Address})

	data := map[string]interface{}{"profile": supervisor}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var registerPayload models.SupervisorResetPayload
	err := helpers.DecodeJSONBody(w, r, &registerPayload)
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

	sup, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Email: registerPayload.Email})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	token := helpers.RandAlpha(7)
	errAccess := handler.RedisClient.Client.Set(sup.Id+constants.RESETPASSWORD, token, 1*time.Hour).Err()
	if errAccess != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	body := fmt.Sprintf("<h3>Hello! %v </h3><p>You recently requested to reset your Eliest Lotto supervisor password. use the code <b>%v</b> to continue.</p> <br/> Click <a href='https://supervisor.eliestlotto.biz/auth/setpassword?user=%v'>HERE<a> to complete the process", sup.Lastname, token, sup.Email)
	to := []string{
		registerPayload.Email,
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

func (handler *EliestSuperVisorHandler) SetPassword(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var setPass models.SupervisorSetPasswordPayload
	err := helpers.DecodeJSONBody(w, r, &setPass)
	defer r.Body.Close()

	sup, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Email: setPass.Email})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}
	stroedToken, err := handler.RedisClient.Client.Get(sup.Id + "Pass").Result()
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	if stroedToken != setPass.Token {
		response := helpers.CreateResponse(constants.UNAUTHORIZED, constants.CouldNotComplete, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(setPass.Password), bcrypt.DefaultCost)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	err = handler.Db.UpdateSupervisor(sup, &sharedmodel.Supervisor{Password: hashedPass})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	data := map[string]interface{}{"message": "Your Password has been updated"}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) DeActivateSupervisor(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	// token, err := ExtractTokenMetadata(r)
	// if err != nil {
	// 	response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
	// 	helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
	// 	return
	// }

	var loginPayload sharedmodel.Supervisor
	err := helpers.DecodeJSONBody(w, r, &loginPayload)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}

	supervisor, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{Phone: loginPayload.Phone})
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

	err = handler.Db.UpdateSupervisor(supervisor, &sharedmodel.Supervisor{AccountActivated: false})

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ERROR, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, "done", "De-activation completed")

	helpers.RespondWithJSON(w, http.StatusOK, response)
}
