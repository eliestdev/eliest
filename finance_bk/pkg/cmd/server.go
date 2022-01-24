package cmd

import (
	"log"
	"lottofinance/internals/implement"
	"lottofinance/internals/persistence"
	"lottofinance/pkg"
	"lottoshared/sharedmodel"
)

var port = "0.0.0.0:9019"

// RunServer -
func RunServer() error {
	var eliest = pkg.EliestFinanceHandler{}

	//The Db
	FinanceConfig := persistence.InitFinanceConfig()
	sql := implement.NewSqlLayer(persistence.Config(&FinanceConfig))
	sql.FinanceDb.AutoMigrate(sharedmodel.Transaction{}, sharedmodel.Wallet{})
	err := eliest.InitializeDb(sql)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}

	//The Router
	eliest.SetRoutes(eliest.Db)

	err = eliest.StartHttp(port)
	return err
}
