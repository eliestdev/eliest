package operations

import (
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/url"

	"github.com/mitchellh/mapstructure"
)

func CreateNewTransaction(reference, account, class, source, destination, description, supervisor string, types int, amount float64) error {
	var result interface{}
	transaction := sharedmodel.NewTransaction(reference, account, class, source, destination, description, supervisor, amount)
	request, err := helpers.BuildHttpRequest("POST", constants.CREATETRANSACTIONLINK, "", helpers.StructToReader(transaction))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}
	return err
}

func CreateDoubleEntryTransaction(amount float64, reference, accountToDebit, accountToCredit, description, supervisor string) error {
	var result interface{}
	
	debitTransaction := sharedmodel.NewTransaction(reference, accountToDebit, constants.DEBIT, "", accountToCredit, description,"", amount)
	request, err := helpers.BuildHttpRequest("POST", constants.CREATETRANSACTIONLINK, "", helpers.StructToReader(debitTransaction))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}

	creditTransaction :=sharedmodel.NewTransaction(reference, accountToCredit, constants.CREDIT, accountToDebit, "", description,supervisor, amount)
	request, err = helpers.BuildHttpRequest("POST", constants.CREATETRANSACTIONLINK, "", helpers.StructToReader(creditTransaction))
	if err != nil {
		return err
	}
	err = helpers.MakeHttpRequest(request, &result)
	if err != nil {
		return err
	}
	return err
}



func GetAgentWallets(agentId string) (*sharedmodel.WalletsResponse, error) {
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

func GetWallet(id string) (*sharedmodel.WalletQueryResponse, error) {
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



func FindWallet(owner, title, id string) (*sharedmodel.WalletResponse, error) {
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

func FindTransactions(account, reference, description, class, supervisor string, from, to int64) (*sharedmodel.TransactionsResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.TransactionsResponse
	url := fmt.Sprintf("%v?account=%v&reference=%v&description=%v&class=%v&supervisor=%v&from=%v&to=%v", constants.FINDTRANSACTIONSLINK, account, reference, url.QueryEscape(description) ,class, supervisor, from, to)
	log.Println(url)
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


func GetWalletTransactions(walletId string) (*sharedmodel.TransactionsResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.TransactionsResponse
	url := fmt.Sprintf("%v?account=%v", constants.FINDTRANSACTIONSLINK, walletId)
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

//TODO 
// Move to separate file
func FindAgent(agentId, reference, phone string) (*sharedmodel.AgentResponse, error) {
	var response helpers.ResponseData
	var result sharedmodel.AgentResponse

	url := fmt.Sprintf("%v?id=%v&ref_code=%v&phone=%v", constants.FINDAGENTLINK, agentId, reference, phone)
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


// TODO 
// Handle Reporting possible error to admin 
func ActivateSupervisor(reference string)  {
	var response helpers.ResponseData
	url := fmt.Sprintf("%v?key=%v&ref=%v", constants.ACTIVATESUPERVISORLINK, constants.KEY, reference)
	request, err := helpers.BuildHttpRequest("POST", url, "", nil)
	if err != nil {
	}
	err = helpers.MakeHttpRequest(request, &response)
	if err != nil {
	}
}