package handlers

import (
	"lottoagent/internals/persistence"
	"lottoagent/myredis"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
)

type ElliestAgentHandler struct {
	Db          persistence.ServiceDBHandle
	RedisClient myredis.RedisClient
}

func NewElliestAgentHandler(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *ElliestAgentHandler {
	return &ElliestAgentHandler{
		Db:          db,
		RedisClient: redisClient,
	}
}

//TODO
// Turn this to a service operation
func findReferer(handler *ElliestAgentHandler, refCode string) (string, string) {
	if refCode == "" || refCode == constants.CONDEDEFAULT {
		return constants.CONDEDEFAULT, constants.CONDEDEFAULT
	}
	if helpers.StartsWith(refCode, "55") {
		referer, err := handler.Db.FindSupervisor(&sharedmodel.Supervisor{RefCode: refCode})
		if err != nil {
			return constants.CONDEDEFAULT, constants.CONDEDEFAULT
		}
		wallet, err := operations.FindWallet(referer.Id, constants.SUPERVISORWALLET, "")
		if err != nil {
			return constants.CONDEDEFAULT, constants.CONDEDEFAULT
		}
		return wallet.Wallet.Id, constants.CONDEDEFAULT
	}
	if helpers.StartsWith(refCode, "00") {
		referer, err := handler.Db.FindAgent(&sharedmodel.Agent{RefCode: refCode})
		if err != nil {
			return constants.CONDEDEFAULT, constants.CONDEDEFAULT
		}
		wallet, err := operations.FindWallet(referer.Id, constants.FUNDEDWALLET, "")
		if err != nil {
			return constants.CONDEDEFAULT, constants.CONDEDEFAULT
		}
		return wallet.Wallet.Id, referer.Referrer
	}

	return constants.CONDEDEFAULT, constants.CONDEDEFAULT
}
