package main

import (
	"log"
	"lottoadmin/pkg/cmd"
)

func main() {
	err := cmd.RunServer()
	if err != nil {
		log.Fatalf("HTTP Server failed to start %v", err.Error())
	}

}
