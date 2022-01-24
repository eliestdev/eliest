package router

import (
	"lottofinance/internals/persistence"
	"lottofinance/pkg/handlers"

	"github.com/gorilla/mux"
)

func InitRoutes(db persistence.ServiceDBHandle) *mux.Router {
	var r = mux.NewRouter()
	financeHandler := handlers.NewEliestFinanceHandler(db)
	r.HandleFunc("/create-new-wallet", financeHandler.CreateWallet).Methods("POST", "OPTIONS")
	r.HandleFunc("/get-wallet", financeHandler.GetWallet).Methods("GET", "OPTIONS")
	r.HandleFunc("/find-wallet", financeHandler.FindWallet).Methods("GET", "OPTIONS")
	r.HandleFunc("/find-wallets", financeHandler.FindWallets).Methods("GET", "OPTIONS")
	r.HandleFunc("/update-wallets", financeHandler.UpdateWallet).Methods("PUT", "OPTIONS")

	r.HandleFunc("/create-new-transaction", financeHandler.CreateTransaction).Methods("POST", "OPTIONS")
	r.HandleFunc("/get-transaction", financeHandler.FindTransaction).Methods("GET", "OPTIONS")
	r.HandleFunc("/get-all-transaction", financeHandler.FindAllTransactions).Methods("GET", "OPTIONS")
	r.HandleFunc("/get-transactions", financeHandler.FindTransactions).Methods("GET", "OPTIONS")
	r.HandleFunc("/recent-transactions", financeHandler.FindRecentTransactions).Methods("GET", "OPTIONS")
	r.HandleFunc("/heavier-transactions", financeHandler.FindHeavierTransactions).Methods("GET", "OPTIONS")
	return r
}
