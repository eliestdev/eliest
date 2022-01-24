package pkg

import (
	"fmt"
	"lottoadmin/internals/persistence"
	"time"

	"github.com/go-co-op/gocron"
)


func StartCron(Db persistence.ServiceDBHandle) {
	S2 := gocron.NewScheduler(time.Now().Location())


    S2 = gocron.NewScheduler(time.Now().Location())

	S2.Every(1).Day().At("10:30").Do(task)
	// stop our first scheduler (it still exists but doesn't run anymore)
	S2.Every(1).Day().At("3:48").Do(payPartners, Db)

	// executes the scheduler and blocks current thread
	S2.StartBlocking()
}

func task() {
	fmt.Println("I am running task.")
}


