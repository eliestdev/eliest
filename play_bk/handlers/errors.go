package handlers

import "net/http"

func BadRequest(w http.ResponseWriter) {
	w.WriteHeader(http.StatusBadRequest)
	return
}

func UnAuthorized(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
	return
}

func InternalServerError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	return
}
