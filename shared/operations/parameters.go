package operations

import (
	"fmt"
	"io/ioutil"
)


func ReadFile(workstation, filename string) ([]byte, error) {
	filepath := fmt.Sprintf("%s/%s", workstation, filename)
	content, err := ioutil.ReadFile(filepath)
	if err != nil {
		return nil, err
	}
	return content, nil
}




func UpdateFile(workstation, filename, _content string) ( error) {
	filepath := fmt.Sprintf("%s/%s.json", workstation, filename)
	err := ioutil.WriteFile(filepath, []byte(_content), 0644)
	
	return err
}
