package router

import (
	"log"
	"lottoadmin/internals/persistence"
	"lottoadmin/myredis"
	"lottoadmin/pkg/handlers"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"

	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func InitRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *mux.Router {
	var r = mux.NewRouter()
	handler := handlers.NewElliestAgentHandler(db, redisClient)

	hashedPass, err := bcrypt.GenerateFromPassword([]byte("golden"), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
	}

	_, err = handler.Db.CreateAdmin(&sharedmodel.AdminAccount{Id: "xxx-default", Email: "email@eliestlotto.biz", Phone: "080", Name: "Golden Email", ReadOnly: false, Status: true, Reference: "666666", Password: hashedPass, CreatedAt: helpers.CreatedAt(), UpdatedAt: helpers.CreatedAt()})
	if err != nil {
		log.Println(err)
	}

	//TODO
	//Implement Read only as middle ware

	v1 := r.PathPrefix("/v1").Subrouter()
	v1.HandleFunc("/parameters", handler.GetParameters).Methods("GET", "OPTIONS")
	v1.HandleFunc("/transactions", handler.GetAllTransactions).Methods("GET", "OPTIONS")
	v1.HandleFunc("/updateparam", handler.UpdateParameters).Methods("PUT", "OPTIONS")
	v1.HandleFunc("/login", handler.LoginAdmin).Methods("POST", "OPTIONS")
	v1.HandleFunc("/create", handler.CreateAdmin).Methods("POST", "OPTIONS")
	v1.HandleFunc("/games", handler.GetGames).Methods("GET", "OPTIONS")
	v1.HandleFunc("/Ugames", handler.UGetGames).Methods("GET", "OPTIONS")
	v1.HandleFunc("/updategames", handler.UpdateGames).Methods("PUT", "OPTIONS")
	v1.HandleFunc("/addpartner", handler.AddPartner).Methods("POST", "OPTIONS")
	v1.HandleFunc("/add-admin", handler.CreateAdmin).Methods("POST", "OPTIONS")
	v1.HandleFunc("/partnerlogin", handler.LoginPartner).Methods("POST", "OPTIONS")
	v1.HandleFunc("/partnerlist", handler.GetPartners).Methods("GET", "OPTIONS")
	v1.HandleFunc("/adminlist", handler.GetAdmins).Methods("GET", "OPTIONS")
	v1.HandleFunc("/apartner", handler.GetAPartner).Methods("GET", "OPTIONS")
	v1.HandleFunc("/updatepartner/{id}", handler.UpdatePartner).Methods("PUT", "OPTIONS")
	v1.HandleFunc("/updateadmin/{id}", handler.UpdateAdmin).Methods("PUT", "OPTIONS")
	v1.HandleFunc("/resetgame/{id}", handler.ResetGames).Methods("GET", "OPTIONS")
	v1.HandleFunc("/agents/{id}", handler.GetAgentDetail).Methods("GET", "OPTIONS")
	v1.HandleFunc("/wallet", handler.GetWalletTransactions).Methods("GET", "OPTIONS")
	v1.HandleFunc("/finance", handler.GetIncomeTransactions).Methods("GET", "OPTIONS")
	v1.HandleFunc("/agent/fundings", handler.GetAgentFundings).Methods("GET", "OPTIONS")
	v1.HandleFunc("/agent/suspend/{id}", handler.UpdateSuspendAgent).Methods("POST", "OPTIONS")
	v1.HandleFunc("/agent/unsuspend/{id}", handler.UpdateUnSuspendAgent).Methods("POST", "OPTIONS")

	v1.HandleFunc("/supervisor/suspend/{id}", handler.UpdateSuspendSupervisor).Methods("POST", "OPTIONS")
	v1.HandleFunc("/supervisor/unsuspend/{id}", handler.UpdateUnSuspendSupervisor).Methods("POST", "OPTIONS")

	v1.HandleFunc("/supervisor/count", handler.GetSupervisorAmountCount).Methods("GET", "OPTIONS")
	v1.HandleFunc("/supervisor/count/change", handler.UpdateSupervisorAmountCount).Methods("POST", "OPTIONS")

	v1.HandleFunc("/supervisors", handler.GetSupervisorDetail).Methods("GET", "OPTIONS")
	v1.HandleFunc("/supervisor/{id}", handler.GetSupervisorDetail).Methods("GET", "OPTIONS")
	v1.HandleFunc("/create-target", handler.CreateTarget).Methods("POST", "OPTIONS")
	v1.HandleFunc("/all-target", handler.AllTargets).Methods("GET", "OPTIONS")
	v1.HandleFunc("/targets/{id}", handler.GetTarget).Methods("GET", "OPTIONS")
	v1.HandleFunc("/all-agents", handler.AllAgents).Methods("GET", "OPTIONS")
	v1.HandleFunc("/all-supervisors", handler.AllSupervisors).Methods("GET", "OPTIONS")
	v1.HandleFunc("/target-assignment", handler.CreateTargetAssignment).Methods("POST", "OPTIONS")
	v1.HandleFunc("/get-assignments", handler.GetTargetAssignment).Methods("GET", "OPTIONS")
	v1.HandleFunc("/target/cancel/{id}", handler.UpdateCancelTarget).Methods("POST", "OPTIONS")

	v1.HandleFunc("/agent/targets/{id}", handler.AgentTargets).Methods("GET", "OPTIONS")
	// v1.HandleFunc("/agent/targets-update/{id}", handler.Upd).Methods("PUT", "OPTIONS")

	scratch := v1.PathPrefix("/scratch").Subrouter()
	scratch.HandleFunc("/addPlayDenominations", handler.AddScratchPlayDenomination).Methods("POST", "OPTIONS")
	scratch.HandleFunc("/updatePlayDenominations", handler.UpdatePlayDenomination).Methods("POST", "OPTIONS")
	scratch.HandleFunc("/getPlayDenominations", handler.GetScratchPlayDenominations).Methods("GET", "OPTIONS")
	scratch.HandleFunc("/delete/{id}", handler.DeletePlayDenomination).Methods("GET", "OPTIONS")

	settings := r.PathPrefix("/settings").Subrouter()
	settings.HandleFunc("/getactivationfee", handler.GetActivationFee).Methods("GET", "OPTIONS")
	settings.HandleFunc("/getvoucherdiscount", handler.GetVoucherDiscount).Methods("GET", "OPTIONS")
	settings.HandleFunc("/getreferralfee", handler.GetReferralFee).Methods("GET", "OPTIONS")
	settings.HandleFunc("/getvoucherlength", handler.GetVoucherLength).Methods("GET", "OPTIONS")
	settings.HandleFunc("/getwinninglength", handler.GetWinningLength).Methods("GET", "OPTIONS")

	agTargets := v1.PathPrefix("/agent").Subrouter()
	agTargets.HandleFunc("/target", handler.GetGlobalAgentTarget).Methods("GET", "OPTIONS")
	agTargets.HandleFunc("/target/change", handler.ChangeGlobalAgentTarget).Methods("POST", "OPTIONS")



	return r
}
