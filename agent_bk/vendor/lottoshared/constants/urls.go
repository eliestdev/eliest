package constants

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



//Finance
var CREATETRANSACTIONLINK= fmt.Sprintf("%v/create-new-transaction", "http://0.0.0.0:9019") 
var CREATEWALLETLINK = fmt.Sprintf("%v/create-new-wallet", "http://0.0.0.0:9019")
var FINDWALLETSLINK = fmt.Sprintf("%v/find-wallets", "http://0.0.0.0:9019")
var FINDWALLETLINK = fmt.Sprintf("%v/find-wallet", "http://0.0.0.0:9019")
var GETWALLETLINK = fmt.Sprintf("%v/get-wallet", "http://0.0.0.0:9019")
var FINDSUPERVISORLINK = fmt.Sprintf("%v/v1/find-supervisor", "http://0.0.0.0:6601")
var FINDSUPERVISORSLINK = fmt.Sprintf("%v/v1/find-supervisors", "http://0.0.0.0:6601")
var FINDAGENTSLINK = fmt.Sprintf("%v/find-agents", "http://0.0.0.0:6001")
var FINDAGENTLINK = fmt.Sprintf("%v/find-agent", "http://0.0.0.0:6001")
var FINDTRANSACTIONSLINK = fmt.Sprintf("%v/get-transactions", "http://0.0.0.0:9019")
var ACTIVATESUPERVISORLINK = fmt.Sprintf("%v/v1/activate", "http://0.0.0.0:6601") 
func LoadEnv() {
	log.Println("env loading...")
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file %v", err)
	}
}
