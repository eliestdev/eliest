package handlers

import (
	"fmt"
	"log"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"math/rand"
	"net/url"
	"os"
	"strconv"

	"github.com/mitchellh/mapstructure"
)

func initializeNewAgent(newAgent *sharedmodel.Agent, model models.RegisterAgentPayload) {
	_refCode := helpers.RandInt(5)
	_refCode = helpers.AgentRefCodePrefix + _refCode
	newAgent.RefCode = _refCode

	newAgent.AccountActivated = false
	newAgent.Address = model.Address
	newAgent.City = model.City
	newAgent.CreatedAt = helpers.CreatedAt()
	newAgent.Email = model.Email
	newAgent.Firstname = model.Firstname
	newAgent.Id = helpers.GuidId()
	newAgent.Lastname = model.Lastname
	newAgent.Lg = model.Lg
	newAgent.Phone = model.Phone
	newAgent.Referrer = model.Referer
	newAgent.State = model.State
	newAgent.Status = "active"
	newAgent.Suspended = false
}

func assignToAutoSupervisor(newAgent *sharedmodel.Agent) {
	supervisorsResponse, err := getAutoSupervisors()
	if err != nil {
		log.Println(err)
	}
	supervisors := supervisorsResponse.Supervisors
	randomIndex := rand.Intn(len(supervisors))
	_supervisor := supervisors[randomIndex]
	newAgent.Supervisor = _supervisor.Id
}

func assignToSupervisor(newAgent *sharedmodel.Agent, refCode string) error {
	supervisorResponse, err := findSupervisor(refCode)
	_supervisor := supervisorResponse.Supervisor
	if err != nil {
		return err
	}
	newAgent.Supervisor = _supervisor.Id
	return nil
}

func createNewAgentWallets(agentId string) error {
	var result interface{}
	winningWallet := sharedmodel.NewWallet(constants.WINNINGWALLET, agentId)
	request, err := helpers.BuildHttpRequest("POST", constants.CREATEWALLETLINK, "", helpers.StructToReader(winningWallet))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}

	fundedWallet := sharedmodel.NewWallet(constants.FUNDEDWALLET, agentId)
	request, err = helpers.BuildHttpRequest("POST", constants.CREATEWALLETLINK, "", helpers.StructToReader(fundedWallet))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}
	return err
}

func getAutoSupervisors() (*sharedmodel.SupervisorsResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.SupervisorsResponse
	url := fmt.Sprintf("%v?is_auto_assign=1", constants.FINDSUPERVISORSLINK)
	request, err := helpers.BuildHttpRequest("GET", url, "", nil)
	if err != nil {
		return nil, err
	}
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

func findSupervisor(refcode string) (*sharedmodel.SupervisorResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.SupervisorResponse
	url := fmt.Sprintf("%v?refcode=%v", constants.FINDSUPERVISORLINK, refcode)
	request, err := helpers.BuildHttpRequest("GET", url, "", nil)
	if err != nil {
		return nil, err
	}
	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
		return nil, err
	}
	if response.Status != constants.SUCCESS {
		return nil, fmt.Errorf("%v", response.Message)
	}
	mapstructure.Decode(response.Data, &result)
	return &result, nil
}

func findWallet(owner, title, id string) (*sharedmodel.WalletResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.WalletResponse
	_url := fmt.Sprintf("%v?owner=%v&title=%v&id=%v", constants.FINDWALLETLINK, owner, url.QueryEscape(title), id)
	//_url = url.QueryEscape(_url)
	log.Println(_url)
	request, err := helpers.BuildHttpRequest("GET", _url, "", nil)
	if err != nil {
		return nil, err
	}
	err = helpers.MakeHttpRequest(request, &response)
	log.Println(err)

	if err != nil {
		return nil, err
	}

	if response.Status != constants.SUCCESS {
		return nil, fmt.Errorf("%v", response.Message)
	}
	err = mapstructure.Decode(response.Data, &result)
	if err != nil {
		log.Println(err)

		return nil, err
	}
	return &result, nil
}

func getAgentWallets(agentId string) (*sharedmodel.WalletsResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.WalletsResponse
	url := fmt.Sprintf("%v?owner=%v", constants.FINDWALLETSLINK, agentId)
	request, err := helpers.BuildHttpRequest("GET", url, "", nil)
	if err != nil {
		return nil, err
	}
	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
		return nil, err
	}
	if response.Status != constants.SUCCESS {
		return nil, fmt.Errorf("%v", response.Message)
	}
	err = mapstructure.Decode(response.Data, &result)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return &result, nil
}

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

func StoI(arg string) int {
	i, err := strconv.Atoi(arg)
	if err != nil {
		return 0
	}
	return i
}

func StoF(arg string) float64 {
	i, err := strconv.ParseFloat(arg, 64)
	if err != nil {
		return 0
	}
	return i
}

func StoUnit(s string) (uint, error) {
	u64, err := strconv.ParseUint(s, 10, 32)
	return uint(u64), err
}
