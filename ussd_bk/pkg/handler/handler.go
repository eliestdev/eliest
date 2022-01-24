package handler

import (
	"lottoussd/internals/db"
	"lottoussd/logger/gamelogger"
	"lottoussd/myredis"
	"net/http"
)

type EliestHandler struct {
	Db          db.Handler
	GamesLogger gamelogger.GamesLogger
	RedisClient myredis.RedisClient
}

func NewEliestHandler(db db.Handler, gamelogger gamelogger.GamesLogger, redis myredis.RedisClient) *EliestHandler {

	return &EliestHandler{
		Db:          db,
		GamesLogger: gamelogger,
		RedisClient: redis,
	}
}

func (handler *EliestHandler) Landing(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://www.eliestlotto.biz/", http.StatusPermanentRedirect)
}

var Banks = map[string]string{
	"001": "901",
	"002": "426",
	"003": "326",
	"004": "329",
	"005": "770",
	"006": "894",
	"007": "737",
	"008": "745",
	"009": "7111",
	"010": "7797",
	"011": "909",
	"012": "822",
	"013": "919",
	"014": "826",
	"015": "7799",
	"016": "5037",
	"017": "945",
	"018": "966",
}
