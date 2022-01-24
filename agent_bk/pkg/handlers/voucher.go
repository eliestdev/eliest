package handlers

import (
	"log"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"math"
	"net/http"
	"strconv"

	valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
)

func (handler *ElliestAgentHandler) GenerateVoucher(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.GenerateVoucherPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusNotExtended, response)
		return
	}
	_, err = valid.ValidateStruct(m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	defer r.Body.Close()

	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	wallet, err := getWallet(m.Wallet) 
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	amountList := []int{}
	total := 0.0
	for i := 0; i < m.V50; i++ {
		amountList = append(amountList, 50)
		total += 50
	}
	for i := 0; i < m.V100; i++ {
		amountList = append(amountList, 100)
		total += 100
	}
	for i := 0; i < m.V200; i++ {
		amountList = append(amountList, 200)
		total += 200
	}
	for i := 0; i < m.V400; i++ {
		amountList = append(amountList, 500)
		total += 400
	}
	for i := 0; i < m.V1000; i++ {
		amountList = append(amountList, 1000)
		total += 1000
	}

	for i := 0; i < m.V2000; i++ {
		amountList = append(amountList, 2000)
		total += 2000
	}
	params, _ := GetParameter()
	totalDue := total - (total * params.VoucherDiscount / 100)

	if wallet.WalletQuery.Balance < float64(totalDue) {
		response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	err = operations.CreateDoubleEntryTransaction(totalDue,  helpers.RandAlpha(7), m.Wallet, constants.EARNEDACCOUNT,  constants.VOUCHERGENERATED, "")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	vouchers, batch, err := handler.Db.GenerateVouchers(amountList, m.Length, token.UserId)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	//remaining := params.ActivationFee - float64(params.ActivationVoucherReturn)
	firstRef, _ := strconv.ParseFloat(params.ReferralPercentage1, 64)
	firstLevelRef := (firstRef / total) * 100
	firstLevelRef = math.Round(firstLevelRef*100) / 100
	secondRef, _ := strconv.ParseFloat(params.ReferralPercentage1, 64)
	secondLevelRef := (secondRef / total) * 100
	secondLevelRef = math.Round(secondLevelRef*100) / 100

	// Pay first referer
	firstReferer, firstRefererReferer := findReferer(handler, agent.Referrer)

	err = operations.CreateDoubleEntryTransaction(firstLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, firstReferer,  constants.REFERRALBONUSPAYMENT, "")

	// Pay second referrer
	secondReferer, _ := findReferer(handler, firstRefererReferer)
	err = operations.CreateDoubleEntryTransaction(secondLevelRef, helpers.RandAlpha(7), constants.EARNEDACCOUNT, secondReferer,  constants.REFERRALBONUSPAYMENT, "")

	data := map[string]interface{}{"vouchers": vouchers, "batch": batch}
	response := helpers.CreateResponse(constants.SUCCESS, constants.VOUCHERGENERATED, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *ElliestAgentHandler) GetVouchers(w http.ResponseWriter, r *http.Request) {
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

	batches, err := handler.Db.FindVBatch(token.UserId)

	_data := make(map[string]interface{})

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	result := []VoucherInBranch{}
	for _, v := range batches {
		_data["batch"] = v.Timeline
		vouchers, err := handler.Db.FindBVouchers(v.ID)
		if err != nil {
			log.Println(err)
			_data["vouchers"] = []sharedmodel.Voucher{}
		}
		_data["vouchers"] = vouchers
		result = append(result, VoucherInBranch{ID: v.Timeline, Vs: vouchers, Key: v.ID})
	}
	data:=result
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

type VoucherInBranch struct {
	ID  int64                `json:"id"`
	Key string                `json:"key"`
	Vs  []sharedmodel.Voucher `json:"vs"`
}

func (handler *ElliestAgentHandler) GetBVouchers(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	batchID := params["batch"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	_, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}
	batches, err := handler.Db.FindBVouchers(batchID)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	data := batches
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)

}

func (handler *ElliestAgentHandler) GenerateVTU(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var m models.GenerateVtuPayload
	err := helpers.DecodeJSONBody(w, r, &m)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
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

	_, err = ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	wallet, err := getWallet(m.Wallet)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	if wallet.WalletQuery.Balance < float64(m.Amount) {
		response := helpers.CreateResponse(constants.ERROR, constants.INSUFFICIENTFUNDS, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	receiver := ""
	if m.Class == constants.AGENTTOPLAYER{
		user, err := handler.Db.FindAccount(&sharedmodel.Account{MSISDN: m.Phone})
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
			helpers.RespondWithJSON(w, http.StatusNotFound, response)
			return
		}
		receiver = user.MSISDN

		err = handler.Db.UpdateUser(user, &sharedmodel.Account{Balance: user.Balance + float64(m.Amount)})
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
			return
		}
	}
	if m.Class == constants.AGENTTOAGENT{
		agent, err := handler.Db.FindAgent(&sharedmodel.Agent{Phone: m.Phone})
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.NOTFOUND, nil)
			helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			return
		}
		wallet, err := findWallet(agent.Id, constants.FUNDEDWALLET, "")
		if err != nil {
			response := helpers.CreateResponse(constants.ERROR, constants.WALLETNOTFOUND, nil)
			helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			return
		}
		receiver = wallet.Wallet.Id
	}

	tref:= helpers.RandAlpha(7)
	err = operations.CreateDoubleEntryTransaction(m.Amount, tref, m.Wallet, receiver, constants.VTUTRANSFERDECS, "") 
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	data:= map[string]interface{}{"message": "success"}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response )
}