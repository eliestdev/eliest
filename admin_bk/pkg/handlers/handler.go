package handlers

import (
	"lottoadmin/internals/persistence"
		"lottoadmin/myredis"
)


type EliestAdminHandler struct {
	Db persistence.ServiceDBHandle
	RedisClient myredis.RedisClient
}

func NewElliestAgentHandler(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *EliestAdminHandler {
	return &EliestAdminHandler{
		Db: db,
		RedisClient: redisClient,

	}
}
