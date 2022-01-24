package cmd

import (
	"log"
	"lottoagent/internals/implement"
	"lottoagent/internals/persistence"
	"lottoagent/myredis"
	"lottoagent/pkg"
	"lottoshared/sharedmodel"
	"os"
)

var port = "0.0.0.0:6001"

// RunServer -
func RunServer() error {
	var eliest = pkg.ElliestAgentHandler{}

	//The Db
	DBConfig := persistence.InitConfig()
	USSDDBConfig := persistence.InitUSSDConfig()
	adminConfig := persistence.InitAdminConfig()
	financeConfig := persistence.InitFinanceConfig()

	sql := implement.NewSqlLayer(persistence.Config(&DBConfig), persistence.Config(&USSDDBConfig), persistence.Config(&adminConfig), persistence.Config(&financeConfig))
	sql.Session.AutoMigrate(sharedmodel.Agent{}, sharedmodel.AgentTargetAssignment{}, sharedmodel.AgentReferalls{})
	err := eliest.InitializeDb(sql)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}

	//Redis

	redisClient := myredis.NewRedisClient(os.Getenv("Redis_Host"), os.Getenv("RedisPass"))

	//The Router
	eliest.SetRoutes(eliest.Db, redisClient)

	err = eliest.StartHttp(port)
	return err
}
