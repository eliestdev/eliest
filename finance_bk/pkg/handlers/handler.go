package handlers

import (
	"lottofinance/internals/persistence"
)

type EliestFinanceHandler struct {
	Db persistence.ServiceDBHandle
}

func NewEliestFinanceHandler(db persistence.ServiceDBHandle) *EliestFinanceHandler {
	return &EliestFinanceHandler{
		Db: db,
	}
}
