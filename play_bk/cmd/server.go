package cmd

import (
	"net/http"
	"play_bk/main/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/gorm"
)

func StartServerWithRoutes(db *gorm.DB) {
	router := mux.NewRouter()

	postR := router.PathPrefix("/v1").Subrouter()

	postR.HandleFunc("/auth/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(w, r, db)
	}).Methods("POST")
	postR.HandleFunc("/auth/register",
		func(w http.ResponseWriter, r *http.Request) {
			handlers.SignUp(w, r, db)
		}).Methods("POST")

	// Remember to change origin in production
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	http.ListenAndServe(":8030", handler)
}
