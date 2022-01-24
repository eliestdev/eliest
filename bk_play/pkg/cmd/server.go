package cmd

import (
	"log"
	"lottoportal/internals/implement"
	"lottoportal/internals/persistence"
	"lottoportal/myredis"
	"lottoportal/pkg"
	"os"
)

var port = "0.0.0.0:9069"

// RunServer -
func RunServer() error {
	var eliest = pkg.EliestPortalHandler{}

	//The Db
	UssdConfig := persistence.InitUSSDConfig()
	agtConfig := persistence.InitAgentDBConfig()
	sql := implement.NewSqlLayer(persistence.Config(&UssdConfig), persistence.Config(&agtConfig))
	sql.UssdDb.AutoMigrate()
	err := eliest.InitializeDb(sql)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}

	redisClient := myredis.NewRedisClient(os.Getenv("Redis_Host"), os.Getenv("RedisPass"))

	//The Router
	eliest.SetRoutes(eliest.Db, redisClient)

	err = eliest.StartHttp(port)
	return err
}
