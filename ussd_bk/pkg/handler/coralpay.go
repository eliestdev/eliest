package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/logger"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	corallog "lottoussd/logger"
	"lottoussd/models"
	"net/http"
	"time"
)

var (
	logging logger.LogHandler
)

func (handler *EliestHandler) GetDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	var res models.CoralDetailResponse
	res.TraceId = helpers.RandUpperAlpha(9)
	logging = corallog.NewCoralZapLogger()
	username, password, ok := r.BasicAuth()
	bb, _ := ioutil.ReadAll(r.Body)
	body := fmt.Sprintf(" %s - %s - %s - %v", string(bb), r.URL.RequestURI(), r.Host, r.Header)
	r.Body = ioutil.NopCloser(bytes.NewBuffer(bb))
	defer r.Body.Close()
	if !ok {
		w.Header().Add("WWW-Authenticate", `Basic realm="Give username and password"`)
		w.WriteHeader(http.StatusUnauthorized)
		res.ResponseCode = "03"
		res.DisplayMessage = fmt.Sprintf("No basic auth present")
		res.CustomerName = "nil"

		logging.LogError(fmt.Sprintf("No basic auth present %s", body))

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	if !isAuthorised(username, password) {
		w.Header().Add("WWW-Authenticate", `Basic realm="Give username and password"`)
		w.WriteHeader(http.StatusUnauthorized)
		res.ResponseCode = "03"
		res.DisplayMessage = fmt.Sprintf("Invalid username or password")
		res.CustomerName = "nil"
		logging.LogError(fmt.Sprintf("Invalid username or password %s", body))
		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	var req models.CoralDetailPayload

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&req); err != nil {
		res.ResponseCode = "03"
		res.DisplayMessage = fmt.Sprintf("Err processing request - %v", err.Error())
		res.CustomerName = "nil"
		logging.LogError(fmt.Sprintf("Err processing request: %v - %v", err.Error(), body))

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if len(req.CustomerRef) == 0 || len(req.MerchantId) == 0 || req.MerchantId != "4032ELT10000001" {
		res.ResponseCode = "03"
		res.DisplayMessage = "Invalid Reqest payload"
		res.CustomerName = "nil"
		logging.LogError(fmt.Sprintf("Invalid Reqest payload - %v", body))

		w.WriteHeader(http.StatusBadRequest)

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}
	if helpers.StartsWith(req.CustomerRef, "00") {
		agent, err := handler.Db.FindAgent(&sharedmodel.Agent{RefCode: req.CustomerRef})

		if err != nil {
			res.ResponseCode = "03"
			res.DisplayMessage = "Not Found - agent  ref"
			res.CustomerName = "nil"
			logging.LogError(fmt.Sprintf("Not Found - Invalid agent ref - %v -- %v", body, err.Error()))

			w.WriteHeader(http.StatusBadRequest)

			details, err := json.Marshal(res)
			if err != nil {
				panic(err)
			}

			w.Write(details)
			return
		}
		res.ResponseCode = "00"
		res.DisplayMessage = fmt.Sprintf("%s Agent top up", agent.Phone)
		res.CustomerName = agent.Phone

		log.Printf("setting %v", res.TraceId)
		err = handler.RedisClient.Client.Set(res.TraceId, agent.Phone, time.Hour*2).Err()
		log.Println(err)

		logging.LogInfo(fmt.Sprintf("wallet top up - %v", body))

		w.WriteHeader(http.StatusOK)

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return

	} else if helpers.StartsWith(req.CustomerRef, "99") {
		user, err := handler.Db.FindAccount(&sharedmodel.Account{RefCode: req.CustomerRef})

		if err != nil {
			res.ResponseCode = "03"
			res.DisplayMessage = "Not Found - Invalid customer ref"
			res.CustomerName = "nil"
			logging.LogError(fmt.Sprintf("Not Found - Invalid customer ref - %v -- %v", body, err.Error()))

			w.WriteHeader(http.StatusBadRequest)

			details, err := json.Marshal(res)
			if err != nil {
				panic(err)
			}

			w.Write(details)
			return
		}

		res.ResponseCode = "00"
		res.DisplayMessage = fmt.Sprintf("%s wallet top up", user.MSISDN)
		res.CustomerName = user.MSISDN

		logging.LogInfo(fmt.Sprintf("wallet top up - %v", body))

		err = handler.RedisClient.Client.Set(res.TraceId, user.MSISDN, time.Minute*2).Err()
		log.Println(err)

		w.WriteHeader(http.StatusOK)

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
	} else {

		res.ResponseCode = "03"
		res.DisplayMessage = "Invalid ref code"
		res.CustomerName = "nil"
		logging.LogError(fmt.Sprintf("Totally Invalid ref code- %v", body))

		w.WriteHeader(http.StatusBadRequest)

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

}

func (handler *EliestHandler) Notification(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	var res models.CoralNotifResponse
	logging = corallog.NewCoralZapLogger()
	bb, _ := ioutil.ReadAll(r.Body)
	body := fmt.Sprintf(" %s - %s - %s - %v", string(bb), r.URL.RequestURI(), r.Host, r.Header)
	defer r.Body.Close()
	r.Body = ioutil.NopCloser(bytes.NewBuffer(bb))

	username, password, ok := r.BasicAuth()
	if !ok {
		w.Header().Add("WWW-Authenticate", `Basic realm="Give username and password"`)
		w.WriteHeader(http.StatusUnauthorized)
		res.ResponseCode = "03"
		res.ResponseMessage = fmt.Sprintf("No basic auth present")
		logging.LogError(fmt.Sprintf("No basic auth present - %v", body))

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	if !isAuthorised(username, password) {
		w.Header().Add("WWW-Authenticate", `Basic realm="Give username and password"`)
		w.WriteHeader(http.StatusUnauthorized)
		res.ResponseCode = "03"
		res.ResponseMessage = fmt.Sprintf("Invalid username or password")
		logging.LogError(fmt.Sprintf("Invalid username or password - %v", body))

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	var req models.CoralNotifPayload

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&req); err != nil {
		res.ResponseCode = "03"
		res.ResponseMessage = fmt.Sprintf("Err processing request - %v", err.Error())
		logging.LogError(fmt.Sprintf("Err processing request %v - %v", err.Error(), body))

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if len(req.CustomerRef) == 0 || len(req.MerchantId) == 0 || req.Amount < 0 || len(req.Hash) == 0 || len(req.TraceId) == 0 || req.MerchantId != "4032ELT10000001" {
		res.ResponseCode = "03"
		res.ResponseMessage = "Invalid Reqest payload"
		logging.LogError(fmt.Sprintf("Invalid Reqest payload - %v", body))

		w.WriteHeader(http.StatusBadRequest)

		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	hash := req.HashValue()
	fmt.Printf("%s\n%s \n looks equal", hash, req.Hash)

	if hash != req.Hash {
		res.ResponseCode = "03"
		res.ResponseMessage = "Invalid hash sent"

		w.WriteHeader(http.StatusBadRequest)
		logging.LogError(fmt.Sprintf("Invalid hash sent - %v", body))
		details, err := json.Marshal(res)
		if err != nil {
			panic(err)
		}

		w.Write(details)
		return
	}

	log.Println(req.TraceId)
	//TODO
	// Make code testable
	// Handle errors
	ref := handler.RedisClient.Client.Get(req.TraceId).Val()
	log.Println(ref)
	if helpers.StartsWith(req.CustomerRef, "00") {
		agent, err := handler.Db.FindAgent(&sharedmodel.Agent{RefCode: req.CustomerRef})
		if err != nil {

		}
		agentFundedWallet, err := findWallet(agent.Id, constants.FUNDEDWALLET, "")
		if err != nil {

		}
		err = operations.CreateDoubleEntryTransaction(req.Amount, req.TraceId, constants.NOTEARNEDACCOUNT, agentFundedWallet.Wallet.Id, constants.CORALPAYDECS, agent.Supervisor)
		if err != nil {
			//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			//return
		}
	}

	if helpers.StartsWith(req.CustomerRef, "99") {
		user, _ := handler.Db.FindAccount(&sharedmodel.Account{RefCode: req.CustomerRef})
		handler.Db.UpdateUser(user, &sharedmodel.Account{RefCode: req.CustomerRef, Balance: user.Balance + req.Amount})

		err := operations.CreateDoubleEntryTransaction(req.Amount, req.TraceId, constants.NOTEARNEDACCOUNT, user.MSISDN, constants.CORALPAYDECS, "")
		if err != nil {
			//response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
			//helpers.RespondWithJSON(w, http.StatusBadRequest, response)
			//return
		}
	}
	//TODO
	if helpers.StartsWith(req.CustomerRef, "55") {
		operations.ActivateSupervisor(req.CustomerRef)

	}

	res.ResponseCode = "00"
	res.ResponseMessage = fmt.Sprintf("Successful")
	logging.LogInfo(fmt.Sprintf("Successful - %v", body))

	w.WriteHeader(http.StatusOK)

	details, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}

	w.Write(details)
}

var users = map[string]string{
	"Bloomcan_Abingora": "WDsDdnJh___Vfdq86MF",
	"0test":             "0secret",
	"d33Cana":           "z#neh_WqHO^X",
}

func isAuthorised(username, password string) bool {
	pass, ok := users[username]
	if !ok {
		return false
	}
	return password == pass
}
