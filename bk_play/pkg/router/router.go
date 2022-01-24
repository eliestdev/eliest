package router

import (
	"lottoportal/internals/persistence"
	"lottoportal/myredis"
	"lottoportal/pkg/handlers"

	"github.com/gorilla/mux"
)

func InitRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *mux.Router {
	var r = mux.NewRouter()
	portalHandler := handlers.NewEliestFinanceHandler(db, redisClient)
	r.HandleFunc("/login", portalHandler.LoginUser).Methods("POST", "OPTIONS")
	r.HandleFunc("/profile", portalHandler.UserProfile).Methods("GET", "OPTIONS")
	r.HandleFunc("/verify-bank", portalHandler.VerifyNuban).Methods("POST", "OPTIONS")
	r.HandleFunc("/transfer", portalHandler.TransferWinsToAgent).Methods("POST", "OPTIONS")
	r.HandleFunc("/games", portalHandler.GetGames).Methods("GET", "OPTIONS")
	r.HandleFunc("/transfer-bank", portalHandler.TransferToBankAccount).Methods("POST", "OPTIONS")
	return r
}
