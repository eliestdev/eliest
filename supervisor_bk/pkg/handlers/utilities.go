package handlers

import (
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/url"

	"github.com/mitchellh/mapstructure"
)

func findAgent(agentId string) (*sharedmodel.AgentResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.AgentResponse

	url := fmt.Sprintf("%v?id=%v", constants.FINDAGENTLINK, agentId)
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

func findAgents(supervisorId string) (*sharedmodel.AgentsResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.AgentsResponse

	url := fmt.Sprintf("%v?supervisor=%v", constants.FINDAGENTSLINK, supervisorId)
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


func createSupervisorWallet(supervisorId string) error {
	var result interface{}
	supervisorWallet := sharedmodel.NewWallet(constants.SUPERVISORWALLET, supervisorId)
	request, err := helpers.BuildHttpRequest("POST", constants.CREATEWALLETLINK, "", helpers.StructToReader(supervisorWallet))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}

	return err
}

func findwallet(owner, title  string) (*sharedmodel.WalletResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.WalletResponse
	_url := fmt.Sprintf("%v?owner=%v&title=%v", constants.FINDWALLETLINK, owner, url.QueryEscape(title))
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


