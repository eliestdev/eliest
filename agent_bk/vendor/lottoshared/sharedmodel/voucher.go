package sharedmodel

import (
	"crypto/md5"
	"fmt"
	"io"
	"lottoshared/helpers"
	"time"
)

type Voucher struct {
	Amount      float64   `json:"amount"`
	Hash        string    `json:"hash" gorm:"primary_key"`
	Status      string    `json:"status" gorm:"size:255;"`
	Code      string    `json:"code" gorm:"size:255;"`
	Batch      string    `json:"batch" gorm:"size:255;"`
	GeneratedBy string    `json:"generated_by" gorm:"size:255;"`
	CreatedAt int64 `json:"created_at" `
	UpdatedAt int64 `json:"updated_at" `
}

func GererateVoucher(amt float64, gen , batch string, length int ) (Voucher) {
	pin := helpers.RandInt(length)
	//serial := helpers.RandInt(4)
	code := pin 

	return Voucher{
		Amount:      amt,
		Status:      "active",
		CreatedAt:   time.Now().Unix(),
		UpdatedAt:   time.Now().Unix(),
		Code:   code,
		Batch:   batch,
		GeneratedBy: gen,
		Hash:        DemoVHasher(code),
	}
}

func VoucherHash(validator string) Voucher {
	return Voucher{
		Hash: DemoVHasher(validator),
	}
}

func DemoVHasher(validator string) string {
	h := md5.New()
	io.WriteString(h, validator)
	//io.WriteString(h, serial)
	return fmt.Sprintf("%v", h.Sum(nil))
}
