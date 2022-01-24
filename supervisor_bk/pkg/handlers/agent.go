package handlers

import (
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"

	"github.com/gorilla/mux"
)

func (handler *EliestSuperVisorHandler) GetSupervisorAgents(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	agents, err := findAgents(token.UserId)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	//helpers.RespondWithJSON(w, http.StatusOK, map[string]interface{}{"agents": agents})
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, agents)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) GetAgentDetail(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	agtId := params["id"]

	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	agent, err := findAgent(agtId)
	if err != nil {
		log.Println(1)
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	_wallet, err := findwallet(agtId, constants.FUNDEDWALLET)
	if err != nil {
		log.Println(2)
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	wallet, err := getWallet(_wallet.Wallet.Id)
	if err != nil {
		log.Println(3)

		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	data := map[string]interface{}{"profile": agent.Agent, "transactions": wallet.WalletQuery}

	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) GetAgentPerformance(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	_, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	v := r.URL.Query()
	id := v.Get("id")
	from := v.Get("from")
	to := v.Get("to")

	var arg = map[string]interface{}{"account": id, "from": from, "to": to}

	arg = helpers.ParseQuery(v, arg)

	transactions, err := handler.Db.FindTransactions(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	data := map[string]interface{}{
		"transactions": transactions,
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)

	//_from, _ := strconv.ParseInt(from, 10, 64)
	//_to, _ := strconv.ParseInt(to, 10, 64)

	//Only return this agents transactions
	//transactions, err := handler.Db.FindTransactionsFrom(_from, _to)
	//if err != nil {
	//	helpers.RespondWithError(w, http.StatusUnauthorized, InavalidUser)
	//	return
	//}

	// data := map[string]interface{}{"transactions": nil /*transactions**/}
	// response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)
	// helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestSuperVisorHandler) GetAgentDownline(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	params := mux.Vars(r)
	agtId := params["id"]

	arg := agtId

	dAgents, err := handler.Db.FindAgents(arg)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.ACCOUNTNOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	data := map[string]interface{}{"direct": dAgents}
	response := helpers.CreateResponse(constants.SUCCESS, constants.ACTIVATIONSUCCESS, data)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}
