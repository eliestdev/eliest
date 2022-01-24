package handlers

import (
	"fmt"
	"log"
	"lottoportal/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"os"
	"strconv"

	"github.com/mitchellh/mapstructure"
)

func getWallet(id string) (*sharedmodel.WalletQueryResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.WalletQueryResponse
	url := fmt.Sprintf("%v?id=%v", constants.GETWALLETLINK, id)
	request, err := helpers.BuildHttpRequest("GET", url, "", nil)
	if err != nil {
		return nil, err
	}
	log.Println(request.URL)

	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
		return nil, err
	}

	if response.Status != constants.SUCCESS {
		return nil, fmt.Errorf("%v", response.Message)
	}
	err = mapstructure.Decode(response.Data, &result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func verifyNuban(nuban, bank string) (string, string, error) {
	var response models.PaystackData
	var result models.PaystackRecipientResponse
	url := "https://api.paystack.co/transferrecipient"
	recipient := models.PaystackRecipientNew(nuban, bank)
	request, err := helpers.BuildHttpRequest("POST", url, os.Getenv(("payStalk_key")), helpers.StructToReader(recipient))
	if err != nil {
		return "", "", err
	}

	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
		return "", "", err
	}

	if !response.Status {
		return "", "", fmt.Errorf("%v", response.Message)
	}
	log.Println(response.Data)

	v, ok := response.Data.(map[string]interface{})
	if !ok {
		return "", "", fmt.Errorf("INVALID RESPONSE")
	}
	err = mapstructure.Decode(response.Data, &result)
	if err != nil {
		return "", "", err
	}
	vv, ok := v["details"].(map[string]interface{})
	if !ok {
		return "", "", fmt.Errorf("INVALID RESPONSE")
	}
	err = mapstructure.Decode(v["details"], &result)
	if err != nil {
		return "", "", err
	}

	code := fmt.Sprintf("%v", v["recipient_code"])
	name := fmt.Sprintf("%v", vv["account_name"])
	if name == "" {
		name = "VERIFIED"
	}

	return name, code, nil
}

func makeTransfer(amount, recipient string) (string, error) {
	var response models.PaystackData
	url := "https://api.paystack.co/transfer"
	transfer := models.PaystackTransferNew(amount, recipient)
	request, err := helpers.BuildHttpRequest("POST", url, os.Getenv(("payStalk_key")), helpers.StructToReader(transfer))
	if err != nil {
		return "", err
	}

	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
		return "", err
	}

	if !response.Status {
		return "", fmt.Errorf("%v", response.Message)
	}

	return constants.SUCCESS, nil
}

func ParseFloat(s string, bitSize int) (float64, error) {
	return strconv.ParseFloat(s, bitSize)
}
