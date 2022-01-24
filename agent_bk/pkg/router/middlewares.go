package router

import (
	"lottoagent/pkg/handlers"
	"lottoshared/constants"
	"lottoshared/helpers"
	"net/http"
)

func authBearer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		helpers.SetupCors(&w, r)
		if r.Method == "OPTIONS"{
			return
		}
		// Do stuff here
		err := handlers.TokenValid(r)
		if err == nil {
			next.ServeHTTP(w, r)
		} else {
			response := helpers.CreateResponse(constants.ERROR, constants.FORBIDDEN, nil)
			helpers.RespondWithJSON(w, http.StatusForbidden, response)
		}
	})
}
