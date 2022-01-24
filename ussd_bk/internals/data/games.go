package data

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"lottoshared/sharedmodel"
	"os"
	"path/filepath"
)



func AllGames(path string) ([]sharedmodel.Game, error) {
	content, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var loadedGames []sharedmodel.Game
	err = json.Unmarshal(content, &loadedGames)
	if err != nil {
		return []sharedmodel.Game{}, err
	}
	return loadedGames, nil
}

func FindGame(id, path string) (sharedmodel.Game, error) {
	allGames, err := AllGames(path)

	if err != nil {
		return sharedmodel.Game{}, err
	}
	for _, n := range allGames {
		if n.Id == id {
			return n, nil
		}
	}
	return sharedmodel.Game{}, errors.New("Not Found")
}

func UseAllGames() ([]sharedmodel.Game, error) {
	cwd := os.Getenv("WorkStation")
	genFilePath := filepath.Join(cwd, "games.json")
	return AllGames(genFilePath)
}

func UseFindGame(id string) (sharedmodel.Game, error) {
	cwd := os.Getenv("WorkStation")
	genFilePath := filepath.Join(cwd, "games.json")
	return FindGame(id, genFilePath)
}
