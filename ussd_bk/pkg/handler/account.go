package handler

import (
	"fmt"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"

	"encoding/json"
	"errors"
	"lottoussd/models"
	"net/http"

	valid "github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

func (handler *EliestHandler) Fund(w http.ResponseWriter, r *http.Request) {
	var reg models.FundingPayload

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

	user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: reg.MSISDN})
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

	err = handler.Db.UpdateUser(user, &sharedmodel.Account{Balance: user.Balance + reg.Amount})
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}

	helpers.URespondWithJSON(w, http.StatusOK, nil)

}

func (handler *EliestHandler) RechargeVoucher(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)

	if r.Method == "OPTIONS" {
		helpers.URespondWithJSON(w, http.StatusOK, "")
		return
	}
	var winPayload models.VoucherCallback

	err := json.NewDecoder(r.Body).Decode(&winPayload)
	defer r.Body.Close()
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	a := []rune(winPayload.Code)
	pin := string(a)
	//serial := string(a[3:7])
	validator := pin
	hash := sharedmodel.VoucherHash(validator)

	win, err := handler.Db.FindVoucher(&hash)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		helpers.URespondWithError(w, http.StatusNotFound, "Invalid or used voucher")
		return
	}
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
		return
	}
	if win.Status != "used" {
		user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: winPayload.MSISDN})
		if err != nil {
			helpers.URespondWithError(w, http.StatusNotFound, UserNotFound)
			return
		}

		err = handler.Db.UpdateVoucherMap(win, map[string]interface{}{"status": "used"})
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
			return
		}

		err = handler.Db.UpdateUser(user, &sharedmodel.Account{Balance: user.Balance + win.Amount})
		//create transaction for agent
		if err != nil {
			helpers.URespondWithError(w, http.StatusBadRequest, GeneralServiceError)
			return
		}
		helpers.URespondWithJSON(w, http.StatusOK, "success")
		return
	} else {
		helpers.URespondWithError(w, http.StatusBadRequest, "Invalid voucher code")
	}

}

func (handler *EliestHandler) FundWithUSSD(w http.ResponseWriter, r *http.Request) {
	var reg models.FundingUSSDPayload

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

	user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: reg.MSISDN})
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

	bank, err := getBank(reg.BankCode)
	if err != nil {
		helpers.URespondWithError(w, http.StatusBadRequest, "Invalid bank code")
		return
	}

	paymentCode := fmt.Sprintf("*%v*000*950+%v+%v#", bank, user.RefCode, reg.Amount)
	response := fmt.Sprintf(`Dial: %v to fund your account`, paymentCode)
	helpers.URespondWithJSON(w, http.StatusOK, response)

}

func getBank(id string) (string, error) {
	bank, ok := Banks[id]
	if !ok {
		return "", errors.New("BANK NOT FOUND")
	}
	return bank, nil
}
