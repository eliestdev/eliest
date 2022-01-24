package handlers

import (
	"encoding/json"
	"lottosupervisor/internals/persistence"
	"lottosupervisor/myredis"
	"net/http"
)

type EliestSuperVisorHandler struct {
	Db          persistence.ServiceDBHandle
	RedisClient myredis.RedisClient
}

func NewElliestAgentHandler(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *EliestSuperVisorHandler {
	return &EliestSuperVisorHandler{
		Db:          db,
		RedisClient: redisClient,
	}
}

func getJson(myClient *http.Client, url string, target interface{}) error {
	r, err := myClient.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	return json.NewDecoder(r.Body).Decode(target)
}
