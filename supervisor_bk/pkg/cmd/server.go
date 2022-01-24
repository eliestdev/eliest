package cmd

import (
	"log"
	"lottoshared/sharedmodel"
	"lottosupervisor/internals/implement"
	"lottosupervisor/internals/persistence"
	"lottosupervisor/myredis"
	"lottosupervisor/pkg"

	"os"
)

var port = "0.0.0.0:6601"

// RunServer -
func RunServer() error {
	var eliest = pkg.EliestAdminHandler{}

	//The Db
	supervisorConfig := persistence.InitSupervisorConfig()
	agentConfig := persistence.InitAgentConfig()
	adminConfig := persistence.InitAdminConfig()
	financeConfig := persistence.InitFinanceConfig()

	sql := implement.NewSqlLayer(persistence.Config(supervisorConfig), persistence.Config(agentConfig), persistence.Config(adminConfig), persistence.Config(financeConfig))
	err := eliest.InitializeDb(sql)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}
	sql.SupervisorDb.AutoMigrate(sharedmodel.Supervisor{}, sharedmodel.SupervisorTarget{}, sharedmodel.TargetAssignment{})

	//Redis
	redisClient := myredis.NewRedisClient(os.Getenv("Redis_Host"), os.Getenv("RedisPass"))

	//The Router
	eliest.SetRoutes(eliest.Db, redisClient)
	err = eliest.StartHttp(port)
	return err
}
