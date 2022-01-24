package main

import (
	"log"
	"lottosupervisor/pkg/cmd"
)

func main() {
	err := cmd.RunServer()
	if err != nil {
		log.Fatalf("HTTP Server failed to start %v", err.Error())
	}

}
