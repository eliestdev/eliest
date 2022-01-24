package main

import (
	"lottoussd/pkg/cmd"
	"log"
)

func main() {
	err := cmd.RunServer()
	if err != nil {
		log.Fatalf("HTTP Server failed to start %v", err.Error())
	}

}
