package main

import (
	"play_bk/main/cmd"
	"play_bk/main/database"
)

func main() {
	db := database.InitDB()
	cmd.StartServerWithRoutes(db)
}
