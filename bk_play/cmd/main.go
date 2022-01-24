package main

import (
	"log"
	"lottoportal/pkg/cmd"
)

func main() {
	err := cmd.RunServer()
	if err != nil {
		log.Fatalf("HTTP Server failed to start %v", err.Error())
	}
}
