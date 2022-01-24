package helpers

import (
	"fmt"
	"io/ioutil"
	"os"
)


func ReadFile(filename string) ([]byte, error) {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/%s", runPath, filename)
	content, err := ioutil.ReadFile(filepath)
	if err != nil {
		return nil, err
	}
	return content, nil
}




func UpdateFile(filename, _content string) ( error) {
	runPath := os.Getenv("WorkStation")
	filepath := fmt.Sprintf("%s/%s.json", runPath, filename)

	 
	err := ioutil.WriteFile(filepath, []byte(_content), 0644)
	
	return err
}

