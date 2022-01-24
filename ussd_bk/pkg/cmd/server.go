package cmd

import (
	"log"
	"lottoshared/sharedmodel"
	"lottoussd/internals/db"
	"lottoussd/internals/implementation"
	"lottoussd/logger/implement"
	"lottoussd/models"
	"lottoussd/myredis"
	"lottoussd/pkg"
	"os"
)

var port = "0.0.0.0:5001"

// RunServer -
func RunServer() error {
	var eliest = pkg.Eliest{}

	//The Db
	DBConfig := db.InitConfig()
	ADBConfig := db.InitAConfig()
	adminDBConfig := db.InitAdminDatabase()

	sqlDb := implementation.NewSqlLayer((db.Config(&DBConfig)), (db.Config(&ADBConfig)), (db.Config(&adminDBConfig)))
	sqlDb.Session.AutoMigrate(sharedmodel.Account{}, sharedmodel.Winnings{}, sharedmodel.Voucher{}, models.VBatch{}, sharedmodel.GameEntry{})
	err := eliest.InitializeDb(sqlDb)
	if err != nil {
		log.Printf("RunServer() - Failed to initialize db with error %v", err)
		return err
	}

	redisClient := myredis.NewRedisClient(os.Getenv("Redis_Host"), os.Getenv("RedisPass"))

	newLogger := implement.NewGamesFileSystem()
	//The Router
	eliest.SetRoutes(eliest.Db, newLogger, redisClient)

	err = eliest.StartHttp(port)
	return err
}
