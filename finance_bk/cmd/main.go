package main

import (
	"log"
	"lottofinance/pkg/cmd"
)

func main() {
	err := cmd.RunServer()
	if err != nil {
		log.Fatalf("HTTP Server failed to start %v", err.Error())
	}

}
