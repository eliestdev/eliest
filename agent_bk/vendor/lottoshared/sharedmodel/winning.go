package sharedmodel

import (
	"crypto/md5"
	"fmt"
	"io"
	"lottoshared/helpers"
	"time"
)

type Winnings struct {
	Amount      float64 `json:"amount"`
	Hash        string  `json:"hash" gorm:"primary_key"`
	Status      string  `json:"status" gorm:"size:255;"`
	Code        string  `json:"code" gorm:"size:255;"`
	GeneratedBy string  `json:"generated_by" gorm:"size:255;"`
	CreatedAt   int64   `json:"created_at" `
	UpdatedAt   int64   `json:"updated_at"`
}

func GererateWinning(amt float64, gen string) (Winnings, string) {
	pin := helpers.RandInt(3)
	serial := helpers.RandInt(4)
	code := pin + serial

	return Winnings{
		Amount:      amt,
		Status:      "active",
		CreatedAt:   time.Now().Unix(),
		UpdatedAt:   time.Now().Unix(),
		GeneratedBy: gen,
		Code:        code,
		Hash:        DemoWHasher(code, serial),
	}, code
}

func GererateUsedWinning(amt float64, gen string) (Winnings, string) {
	pin := helpers.RandInt(3)
	serial := helpers.RandInt(4)
	code := pin + serial

	return Winnings{
		Amount:      amt,
		Status:      "used",
		CreatedAt:   time.Now().Unix(),
		UpdatedAt:   time.Now().Unix(),
		GeneratedBy: gen,
		Hash:        DemoWHasher(code, serial),
	}, code
}

func WinningHash(validator string, serial string) Winnings {
	return Winnings{
		Hash: DemoWHasher(validator, serial),
	}
}

func DemoWHasher(validator, serial string) string {
	h := md5.New()
	io.WriteString(h, validator)
	io.WriteString(h, serial)
	return fmt.Sprintf("%v", h.Sum(nil))
}
