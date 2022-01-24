package models

import (
	"github.com/asaskevich/govalidator"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"
)

func init() {
	govalidator.SetFieldsRequiredByDefault(true)
}

type CreateWalletPayload struct {
	Owner string `json:"owner" valid:"type(string)"`
	Title string `json:"title" valid:"type(string)"`
}

type CreateTransactionPayload struct {
	Amount      float64 `json:"amount"valid:"-"`
	Description string  `json:"description" valid:"type(string)"`
	Class       string  `json:"class" valid:"type(string)"`
	Account     string  `json:"account" valid:"type(string)"`
	Source      string  `json:"source" valid:"-"`
	Supervisor  string  `json:"supervisor" valid:"-"`
	Destination string  `json:"destination" valid:"-"`
	Reference   string  `json:"reference" valid:"type(string)"`
}

func WalletPayload(payload *CreateWalletPayload) sharedmodel.Wallet {
	return sharedmodel.Wallet{
		Id:        helpers.GuidId(),
		Owner:     payload.Owner,
		IsActive:  true,
		Title:     payload.Title,
		CreatedAt: helpers.CreatedAt(),
		UpdatedAt: helpers.CreatedAt(),
	}
}
