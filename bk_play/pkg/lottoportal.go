package pkg

import (
	"context"
	"log"
	"lottoportal/internals/persistence"
	"lottoportal/myredis"
	"lottoportal/pkg/router"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/mux"
)

type EliestPortalHandler struct {
	Db     persistence.ServiceDBHandle
	Router *mux.Router
}

func (e *EliestPortalHandler) InitializeDb(db persistence.ServiceDBHandle) error {
	e.Db = db
	return nil
}

func (e *EliestPortalHandler) SetRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) {
	rr := router.InitRoutes(db, redisClient)
	e.Router = rr
}

func (e *EliestPortalHandler) StartHttp(port string) error {

	server := &http.Server{
		Addr:           port,
		Handler:        e.Router,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	// Run our server in a goroutine so that it doesn't block.
	log.Printf("Saterting server on port: %v", port)
	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)
	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	// SIGKILL, SIGQUIT or SIGTERM (Ctrl+/) will not be caught.
	signal.Notify(c, os.Interrupt)

	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	server.Shutdown(ctx)
	// Optionally, you could run srv.Shutdown in a goroutine and block on
	// <-ctx.Done() if your application should wait for other services
	// to finalize based on context cancellation.
	log.Println("shutting down")
	os.Exit(0)
	return nil
	//http.ListenAndServeTLS("","")
	//e.Logger.LogInfo("Starting HTTP server on port: %v")
	//return (server.ListenAndServe())
}
