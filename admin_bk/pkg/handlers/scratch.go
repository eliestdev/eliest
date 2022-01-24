package handlers

import (
	"lottoadmin/models"
	"lottoshared/helpers"
	"net/http"

	"github.com/gorilla/mux"
)

func (handler *EliestAdminHandler) GetScratchPlayDenominations(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	den, err := handler.Db.GetPlayDenominations()

	if err != nil {
		response := helpers.CreateResponse("error", err.Error(), err)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse("SUCCESS", "done", den)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}

func (handler *EliestAdminHandler) AddScratchPlayDenomination(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var req models.ScratchPlayDenominations
	err := helpers.DecodeJSONBody(w, r, &req)

	if err != nil {
		response := helpers.CreateResponse("error", err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	amounts, err := handler.Db.AddPlayDenominaton(req)

	if err != nil {
		response := helpers.CreateResponse("error", err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse("SUCCESS", "done", amounts)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}

func (handler *EliestAdminHandler) UpdatePlayDenomination(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	var p models.ScratchPlayDenominations
	err := helpers.DecodeJSONBody(w, r, &p)

	req := &models.ScratchPlayDenominations{Amount: p.Amount, WinningCount: p.WinningCount, AmountWon: p.AmountWon, ID: p.ID}

	den, err := handler.Db.UpdatePlayDenomination(*req)

	if err != nil {
		response := helpers.CreateResponse("error", err.Error(), err)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse("SUCCESS", "done", den)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}

func (handler *EliestAdminHandler) DeletePlayDenomination(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}

	params := mux.Vars(r)
	id := params["id"]

	req := &models.ScratchPlayDenominations{ID: id}

	den, err := handler.Db.DeletePlayDenomination(*req)

	if err != nil {
		response := helpers.CreateResponse("error", err.Error(), nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	response := helpers.CreateResponse("SUCCESS", "done", den)
	helpers.RespondWithJSON(w, http.StatusOK, response)
	return
}
