package router

import (
	"lottosupervisor/internals/persistence"
	"lottosupervisor/myredis"
	"lottosupervisor/pkg/handlers"

	"github.com/gorilla/mux"
)

func InitRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *mux.Router {
	var r = mux.NewRouter()
	handler := handlers.NewElliestAgentHandler(db, redisClient)

	r.HandleFunc("/v1/activate", handler.ActivateAccount).Methods("POST", "OPTIONS")

	v1 := r.PathPrefix("/v1").Subrouter()
	v1.HandleFunc("/parameters", handler.GetParameters).Methods("GET", "OPTIONS")
	v1.HandleFunc("/login", handler.Login).Methods("POST", "OPTIONS")
	v1.HandleFunc("/register", handler.Register).Methods("POST", "OPTIONS")
	v1.HandleFunc("/resetpassword", handler.ResetPassword).Methods("POST", "OPTIONS")
	v1.HandleFunc("/setpassword", handler.SetPassword).Methods("POST", "OPTIONS")
	v1.HandleFunc("/activate", handler.Activate).Methods("GET", "OPTIONS")
	v1.HandleFunc("/profile", handler.Profile).Methods("GET", "OPTIONS")
	v1.HandleFunc("/set-profile", handler.UpdateProfile).Methods("POST", "OPTIONS")
	v1.HandleFunc("/find-supervisor", handler.FindSupervisor).Methods("GET", "OPTIONS")
	v1.HandleFunc("/find-supervisors", handler.FindSupervisors).Methods("GET", "OPTIONS")

	v1.HandleFunc("/deactivate", handler.DeActivateSupervisor).Methods("POST", "OPTIONS")

	v1.HandleFunc("/myagents", handler.GetSupervisorAgents).Methods("GET", "OPTIONS")
	v1.HandleFunc("/mytargets", handler.MyTargets).Methods("GET", "OPTIONS")
	v1.HandleFunc("/transactionfilter", handler.GetAgentPerformance).Methods("GET", "OPTIONS")
	v1.HandleFunc("/mywallet", handler.MyWallet).Methods("GET", "OPTIONS")
	v1.HandleFunc("/claimreward", handler.ClaimTargetReward).Methods("GET", "OPTIONS")
	v1.HandleFunc("/mytargets/{id}", handler.GetTargetDetail).Methods("GET", "OPTIONS")
	v1.HandleFunc("/myagents/{id}", handler.GetAgentDetail).Methods("GET", "OPTIONS")
	v1.HandleFunc("/agentdownline/{id}", handler.GetAgentDownline).Methods("GET", "OPTIONS")

	// Assign agents to non-paying supervisors
	assign := v1.PathPrefix("/assign").Subrouter()
	assign.HandleFunc("/non-pay", handler.AssignNonPayingAgents).Methods("POST", "OPTIONS")
	assign.HandleFunc("/automatically", handler.AssignAutomatically).Methods("GET", "OPTIONS")
	return r
}
