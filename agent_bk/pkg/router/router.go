package router

import (
	"lottoagent/internals/persistence"
	"lottoagent/myredis"
	"lottoagent/pkg/handlers"

	"github.com/gorilla/mux"
)

func InitRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *mux.Router {
	var r = mux.NewRouter()

	agentHandler := handlers.NewElliestAgentHandler(db, redisClient)

	r.HandleFunc("/login", agentHandler.AgentLogin).Methods("POST", "OPTIONS")
	r.HandleFunc("/register", agentHandler.AgentRegister).Methods("POST", "OPTIONS")
	r.HandleFunc("/resetpassword", agentHandler.ResetPassword).Methods("POST", "OPTIONS")
	r.HandleFunc("/setpassword", agentHandler.SetPassword).Methods("POST", "OPTIONS")
	r.HandleFunc("/find-agents", agentHandler.FindAgents).Methods("GET", "OPTIONS")
	r.HandleFunc("/find-agent", agentHandler.FindAgent).Methods("GET", "OPTIONS")
	r.HandleFunc("/agent/scratch/get", agentHandler.GetScratchDenomination).Methods("GET", "OPTIONS")

	agentroutes := r.PathPrefix("/agent").Subrouter()
	agentroutes.Use(authBearer)
	agentroutes.HandleFunc("/wallets", agentHandler.GetWallets).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/get-wallet", agentHandler.GetWallet).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/profile", agentHandler.GetProfile).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/profile/{id}", agentHandler.UpdateProfile).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/transactions/{wallet_id}", agentHandler.WalletTransaction).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/voucher-batches", agentHandler.GetVouchers).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/batch/vouchers/{batch}", agentHandler.GetBVouchers).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/buyvoucher", agentHandler.GenerateVoucher).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/activate", agentHandler.ActivateAccount).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/vtu", agentHandler.GenerateVTU).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/downline", agentHandler.GetAgentDownline).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/downline/{id}", agentHandler.GetDownlineInformation).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/withdraw", agentHandler.VerifyNuban).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/pay", agentHandler.MakeTransferNuban).Methods("POST", "OPTIONS")

	agentroutes.HandleFunc("/newtarget", agentHandler.CreateTarget).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/mytargets", agentHandler.GetTargets).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/target/{id}", agentHandler.GetTarget).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/target/delete/{id}", agentHandler.DeleteTarget).Methods("GET", "OPTIONS")

	agentroutes.HandleFunc("/claimtarget", agentHandler.ClaimTarget).Methods("PUT", "OPTIONS")
	agentroutes.HandleFunc("/withdrawtarget", agentHandler.WithdrawTarget).Methods("POST", "OPTIONS")

	agentroutes.HandleFunc("/scratch/get", agentHandler.GetScratchDenomination).Methods("GET", "OPTIONS")
	agentroutes.HandleFunc("/globalTarget", agentHandler.GetGlobalTarget).Methods("GET", "OPTIONS")

	agentroutes.HandleFunc("/move-funded", agentHandler.MoveToFundedWallet).Methods("POST", "OPTIONS")
	agentroutes.HandleFunc("/move-bank", agentHandler.MoveToFundedWallet).Methods("POST", "OPTIONS")

	return r
}
