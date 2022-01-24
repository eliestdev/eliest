package handlers

import (
	"encoding/json"
	"fmt"
	ops "lottoadmin/helpers"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

func (handler *EliestAdminHandler) UGetGames(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	content, err := ops.ReadFile("games.json")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var games []sharedmodel.Game

	err = json.Unmarshal(content, &games)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	helpers.URespondWithJSON(w, http.StatusOK, games)
}

func (handler *EliestAdminHandler) GetGames(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	content, err := ops.ReadFile("games.json")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var games []sharedmodel.Game

	err = json.Unmarshal(content, &games)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}

	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, games)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) GetParameters(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	content, err := ops.ReadFile("parameters.json")

	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.FILENOTFOUND, nil)
		helpers.RespondWithJSON(w, http.StatusNotFound, response)
		return
	}

	var parameters sharedmodel.Parameter

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, parameters)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateParameters(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}


	token, err := ExtractTokenMetadata(r)
	if err != nil {
		response := helpers.CreateResponse(constants.FORBIDDEN, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusUnauthorized, response)
		return
	}

	_admin, err := handler.Db.GetAdmin(&sharedmodel.AdminAccount{Id: token.UserId})
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	if _admin.ReadOnly{
		response := helpers.CreateResponse(constants.ERROR, constants.UNAUTHORIZED, nil)
		helpers.RespondWithJSON(w, http.StatusForbidden, response)
		return
	}

	var parameters sharedmodel.Parameter
	err = helpers.DecodeJSONBody(w, r, &parameters)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	file, err := json.MarshalIndent(parameters, "", " ")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	err = ops.UpdateFile("parameters", string(file))
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) UpdateGames(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	var games []sharedmodel.Game
	err := helpers.DecodeJSONBody(w, r, &games)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}

	file, err := json.MarshalIndent(games, "", " ")
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.INVALIDREQUEST, nil)
		helpers.RespondWithJSON(w, http.StatusBadRequest, response)
		return
	}
	err = ops.UpdateFile("games", string(file))
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, nil)
	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func (handler *EliestAdminHandler) ResetGames(w http.ResponseWriter, r *http.Request) {
	helpers.SetupCors(&w, r)
	if r.Method == "OPTIONS" {
		helpers.RespondWithText(w, http.StatusOK, "")
		return
	}
	params := mux.Vars(r)
	gameID := params["id"]
	err := ArchiveCollection(gameID)
	if err != nil {
		response := helpers.CreateResponse(constants.ERROR, constants.SOMETHINGWENTWRONG, nil)
		helpers.RespondWithJSON(w, http.StatusInternalServerError, response)
		return
	}
	response := helpers.CreateResponse(constants.SUCCESS, constants.SUCCESS, nil)

	helpers.RespondWithJSON(w, http.StatusOK, response)
}

func ArchiveCollection(game_id string) error {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/gameplay/%s/game.txt", runPath, game_id)

	dumpPath := fmt.Sprintf("%s/gameplay/%s/game-cancelled-%v.log", runPath, game_id, time.Now().Unix())

	err := os.Rename(filepath, dumpPath)
	return err
}

func  GetParameter()  sharedmodel.Parameter{
	content, err := ops.ReadFile("parameters.json")
	var parameters sharedmodel.Parameter
	if err != nil {
		return parameters
	}

	err = json.Unmarshal(content, &parameters)
	if err != nil {
		return parameters
	}
	return parameters
}