package handlers

import (
	"lottoportal/internals/persistence"
	"lottoportal/myredis"
)

type EliestFinanceHandler struct {
	Db persistence.ServiceDBHandle
	RedisClient myredis.RedisClient
}

func NewEliestFinanceHandler(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) *EliestFinanceHandler {
	return &EliestFinanceHandler{
		Db: db,
		RedisClient: redisClient,

	}
}
