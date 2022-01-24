package implement

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"time"
)

type GamesFile struct {
	FilePath string
	DumpPath string
	Type string
}

func NewGamesFileSystem() *GamesFile {
	return &GamesFile{
	}
}

func (gf *GamesFile) CreateNewCollection(game_id , t string) error {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/gameplay/%s/%s.txt", runPath, game_id, t)

	_, err := os.Create(filepath)
	return err
}

func (gf *GamesFile) ArchiveCollection(game_id , t string) error {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/gameplay/%s/%s.txt", runPath, game_id, t)

	dumpPath := fmt.Sprintf("%s/gameplay/%s/%s%s.log", runPath, game_id, t , time.Now().String())

	err := os.Rename(filepath, dumpPath)
	return err
}

func (gf *GamesFile) CollectionLength(game_id , t string) (int, error) {

	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/gameplay/%s/%s.txt", runPath, game_id, t )

	file, err := os.Open(filepath)

	if os.IsNotExist(err) {
		if err != nil {
			return 0, nil
		}
	}

	defer file.Close()

	if err != nil {
		return 0, err
	}

	buf := make([]byte, 1024)
	lines := 0

	for {
		readBytes, err := file.Read(buf)

		if err != nil {
			if readBytes == 0 && err == io.EOF {
				err = nil
			}
			return lines, err
		}

		lines += bytes.Count(buf[:readBytes], []byte{'\n'})
	}
}

func (gf *GamesFile) AddGameToCollection(game_id, t, text string) error {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/gameplay/%s/%s.txt", runPath, game_id, t)
	file, err := os.OpenFile(filepath, os.O_APPEND|os.O_CREATE|os.O_SYNC|os.O_WRONLY, 0600)

	if os.IsNotExist(err) {
		err := gf.CreateNewCollection(game_id, t)
		if err != nil {
			return err
		}
	}
	if err != nil && os.IsNotExist(err) == false {
		return err
	}

	defer file.Close()
	_, err = file.WriteString(fmt.Sprintf("%s", text))
	err = file.Sync()
	if err != nil {
		return err
	}
	return nil
}
