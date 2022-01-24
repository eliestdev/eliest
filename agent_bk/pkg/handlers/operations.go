package handlers

import (
	"lottoagent/internals/implement"
	"lottoagent/internals/persistence"
	"lottoshared/sharedmodel"
)

func CreateTransaction(transaction *sharedmodel.Transaction) (string, error) {
	DBConfig := persistence.InitConfig()
	USSDDBConfig := persistence.InitConfig()
	ADMINCONFIG := persistence.InitAdminConfig()
	FinCONFIG := persistence.InitFinanceConfig()

	sql := implement.NewSqlLayer(persistence.Config(&DBConfig), persistence.Config(&USSDDBConfig), persistence.Config(&ADMINCONFIG), persistence.Config(&FinCONFIG))
	id, err := sql.CreateTransaction(transaction)
	return id, err
}
