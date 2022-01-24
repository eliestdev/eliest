package helpers

import (
	"encoding/json"
	"net/http"
)


func URespondWithText(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(code)
	w.Write([]byte(message))
}

func URespondWithError(w http.ResponseWriter, code int, message string) {
	URespondWithJSON(w, code, map[string]string{"error": message})
}

func URespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}