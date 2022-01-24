package sharedmodel

import (
	"fmt"
	"time"
)

type Game struct {
	Id            string    `json:"id"  gorm:"primary_key"`
	TagName       string    `json:"test" gorm:"size:255;"`
	TargetCount   int64     `json:"count" gorm:"size:255;"`
	WinnersCut    float64   `json:"cut" gorm:"size:255;"`
	Cost          int64     `json:"cost"`
	WinningAmount float64   `json:"winningAmount"`
	CreatedAt     time.Time `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"default:CURRENT_TIMESTAMP"`
}

type GameEntry struct {
	Phone    string  `json:"phone"`
	Amount   float64 `json:"amount"`
	GuessOne string  `json:"guess_one"`
	GuessTwo string  `json:"guess_two"`
	GameId   string  `json:"game_id"`
	Time     int64   `json:"time"`
}

func (ge *GameEntry) String() string {
	t := time.Now().String()
	return fmt.Sprintf("%s %s %s %v -- %v\n", ge.Phone, ge.GuessOne, ge.GuessTwo, ge.GameId, t)
}
