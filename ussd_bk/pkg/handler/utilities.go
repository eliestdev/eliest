package handler

import (
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/url"

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


