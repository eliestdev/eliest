package pkg

import (
	"context"
	"fmt"
	"log"
	"lottoadmin/internals/persistence"
	"lottoadmin/myredis"
	"lottoadmin/pkg/handlers"
	"lottoadmin/pkg/router"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/operations"
	"lottoshared/sharedmodel"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/mux"
)


type EliestAdminHandler struct {
	Db persistence.ServiceDBHandle
	Router *mux.Router

}

func (e *EliestAdminHandler) InitializeDb(db persistence.ServiceDBHandle) error {
	e.Db = db
	return nil
}

func (e *EliestAdminHandler) SetRoutes(db persistence.ServiceDBHandle, redisClient myredis.RedisClient) {
	rr := router.InitRoutes(db,  redisClient)
	e.Router = rr
}



func (e *EliestAdminHandler) StartHttp(port string) error {



	server := &http.Server{
		Addr:           port,
		Handler:        e.Router,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	 // Run our server in a goroutine so that it doesn't block.
	 log.Printf("Saterting server on port: %v", port )
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
    ctx, cancel := context.WithTimeout(context.Background(), 15 * time.Second)
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



func  payPartners(Db persistence.ServiceDBHandle)  {
	fmt.Println("Started cron")
	// Get list of all partners
	partners, err :=  Db.GetAllParnet()

	if err != nil {
		return 
	}

	// Get the profit or yesterday
	transactions, err := Db.AllTransactions(helpers.YesterdayStartUnix(), helpers.YesterdayEndUnix())
	if err != nil {
		return 

	}
	var gameplay []sharedmodel.Transaction
	var payouts []sharedmodel.Transaction

	for _, v := range transactions {
		if v.Description == constants.WINNINGDECS {
			payouts = append(payouts, v)
		}
		if v.Description == constants.GAMEFEEDESC {
			gameplay = append(gameplay, v)
		}
	}
	tax := handlers.GetParameter().Tax
	fmt.Println(tax)

	if tax == 0 {
		return 
	}

	profitBt := sharedmodel.TransactionTotal(gameplay) - sharedmodel.TransactionTotal(payouts)
	profitAt := profitBt - percentage(tax, profitBt)
	fmt.Println(profitAt)

	// calculate each partners share and aCreate transactions  

	for _, v := range partners {
		share := percentage(profitAt, v.Percentage)
		err = operations.CreateDoubleEntryTransaction(float64(share), "PRT"+helpers.RandAlpha(4), constants.EARNEDACCOUNT, v.WalletId, fmt.Sprintf("Partner Daily profile - for %v based on  %v percentage owned on %v", v.Name, v.Percentage, time.Now().String()), "")
		if err != nil {
			return 
		}
	}

}

func percentage(percent, total float64) float64{
	return ((percent / 100) * total)
}