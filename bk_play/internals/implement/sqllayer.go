package implement

import (
	"errors"
	"fmt"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/url"

	"github.com/mitchellh/mapstructure"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	UssdDb  *gorm.DB
	AgentDb *gorm.DB
}

func NewSqlLayer(ussd, agent string) *SqlLayer {
	ussdDb, err := gorm.Open(mysql.Open(ussd), &gorm.Config{})
	if err != nil {
		log.Printf("FAILED TO OPEN DATABASE: %v", err)
	}

	agtDb, err := gorm.Open(mysql.Open(agent), &gorm.Config{})
	if err != nil {
		log.Printf("FAILED TO OPEN DATABASE: %v", err)
	}
	return &SqlLayer{UssdDb: ussdDb, AgentDb: agtDb}
}

func (sql *SqlLayer) FindAccount(arg *sharedmodel.Account) (sharedmodel.Account, error) {
	session := sql.UssdDb
	var result sharedmodel.Account
	err := session.Where(arg).First(&result).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	if err != nil {
		return result, err
	}
	return result, err
}

func (sql *SqlLayer) CreateAccount(v *sharedmodel.Account) (string, error) {
	session := sql.UssdDb
	err := session.Create(&v).Error
	return v.MSISDN, err
}

func (sql *SqlLayer) FindAgent(arg *sharedmodel.Agent) (*sharedmodel.Agent, error) {
	session := sql.AgentDb
	var dA sharedmodel.Agent
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) UpdateUserMap(arg *sharedmodel.Account, dict map[string]interface{}) error {
	session := sql.UssdDb
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) FindWallet(owner, title, id string) (*sharedmodel.WalletResponse, error) {
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
