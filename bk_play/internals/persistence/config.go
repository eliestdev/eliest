package persistence

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	if os.Getenv("Environment") != "production" {
		LoadEnv()
	}
}

type DBConfig struct {
	Hosts    string
	Database string
	Username string
	Password string
	Port     string
}

func Config(db *DBConfig) string {

	db.Hosts = os.Getenv("DBHost")
	db.Password = os.Getenv("DBPassword")
	db.Port = os.Getenv("DBPort")
	db.Username = os.Getenv("DBUser")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		db.Username,
		db.Password,
		db.Hosts,
		db.Port,
		db.Database)
	return dsn
}

func InitUSSDConfig() DBConfig {
	var dBConfig DBConfig
	dBConfig.Database = os.Getenv("USSDDatabase")
	return dBConfig
}

func InitAgentDBConfig() DBConfig {
	var dBConfig DBConfig
	dBConfig.Database = os.Getenv("AgentDatabase")
	return dBConfig
}

func LoadEnv() {
	log.Println("env loading...")
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file %v", err)
	}
}
