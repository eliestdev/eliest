package cmd

import (
	"log"
	"lottoadmin/internals/implement"
	"lottoadmin/internals/persistence"
	"lottoadmin/models"
	"lottoadmin/myredis"
	"lottoadmin/pkg"
	"lottoshared/sharedmodel"
	"os"
)

var port = "0.0.0.0:8001"

// RunServer -
func RunServer() error {
	var eliest = pkg.EliestAdminHandler{}

	

	//The Db
	DBConfig := persistence.InitConfig()
	USSDDBConfig := persistence.InitUSSDConfig()
	supervisorDbConfig := persistence.InitSupervisorConfig()
	adminDbConfig := persistence.InitAdminConfig()
	finDbConfig := persistence.InitFinConfig()
	sql := implement.NewSqlLayer(persistence.Config(&DBConfig), persistence.Config(&USSDDBConfig), persistence.Config(&supervisorDbConfig), persistence.Config(&adminDbConfig), persistence.Config(&finDbConfig))
	sql.AdminDB.AutoMigrate(sharedmodel.AdminAccount{}, sharedmodel.Partner{}, models.AgentsTargetInformation{}, models.SupervisorAmountCount{})

	err := eliest.InitializeDb(sql)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}

	//Redis

	redisClient := myredis.NewRedisClient(os.Getenv("Redis_Host"), os.Getenv("RedisPass"))

	//The Router
	eliest.SetRoutes(eliest.Db, redisClient)

	go func(){
		pkg.StartCron(sql)
	 }()


	err = eliest.StartHttp(port)
	return err
}
