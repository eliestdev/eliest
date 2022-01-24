package models

import (
	"github.com/asaskevich/govalidator"
)

func init() {
	govalidator.SetFieldsRequiredByDefault(true)
}

type AgentLoginPayload struct {
	Email    string `json:"email" valid:"email"`
	Password string `json:"password" valid:"type(string)"`
}

type AgentActivationPayload struct {
	Wallet string `json:"wallet" valid:"type(string)"`
}

type RegisterAgentPayload struct {
	Email     string `json:"email" valid:"email"`
	Firstname string `json:"firstname" valid:"type(string)"`
	Referer   string `json:"referer" valid:"-"`
	Lastname  string `json:"lastname" valid:"type(string)"`
	Phone     string `json:"phone" valid:"type(string); length(11)~Enter a valid phone number. Example (08033445566)"`
	Address   string `json:"address" valid:"type(string)"`
	State     string `json:"state" valid:"type(string)"`
	Lg        string `json:"lg" valid:"type(string)"`
	City      string `json:"city" valid:"type(string)"`
	Cpassword string `json:"cpassword" valid:"type(string)"`
	Password  string `json:"password" valid:"length(7|255)~Your password should not be less than seven characters"`
	Image     string `json:"image"`
}

type AgentUpdatePayload struct {
	Firstname string `json:"firstname" valid:"type(string)"`
	Lastname  string `json:"lastname" valid:"type(string)"`
	Phone     string `json:"phone" valid:"type(string)"`
	Address   string `json:"address" valid:"type(string)"`
	Password  string `json:"password" valid:"length(7|255)~Your password should not be less than seven characters"`
}

type ResendValidationPayload struct {
	Id string `json:"id"`
}

type ResetPasswordPayload struct {
	Email string `json:"email"`
}

type ValidateEmailPayload struct {
	Id    string `json:"id"`
	Token string `json:"token"`
}

type AgentSetPasswordPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

type GenerateVoucherPayload struct {
	Wallet string `json:"wallet" valid:"type(string)"`
	Length int    `json:"length" valid:"type(int)"`
	V50    int    `json:"50" valid:"-"`
	V100   int    `json:"100" valid:"-"`
	V200   int    `json:"200" valid:"-"`
	V400   int    `json:"400" valid:"-"`
	V1000  int    `json:"1000" valid:"-"`
	V2000  int    `json:"2000" valid:"-"`
}

type GenerateVtuPayload struct {
	Wallet string  `json:"wallet" valid:"type(string)"`
	Phone  string  `json:"phone" valid:"type(string)"`
	Amount float64 `json:"amount" valid:"-"`
	Class  string  `json:"class" valid:"type(string)"`
}

type WinningCodePayload struct {
	Code string `json:"code" valid:"type(string)"`
}

type PlayersVtuPayload struct {
	From   string  `json:"from" valid:"type(string)"`
	To     string  `json:"to" valid:"type(string)"`
	Amount float64 `json:"amount" valid:"type(float64)"`
}

type WithdrawPayload struct {
	Bank  string `json:"bank" valid:"type(string)"`
	Nuban string `json:"nuban" valid:"type(string)"`
}

type TransferPayload struct {
	Amount    string `json:"amount" valid:"type(string)"`
	Wallet    string `json:"wallet" valid:"type(string)"`
	Recipient string `json:"recipient" valid:"type(string)"`
}

type CreateTargetPayload struct {
	DownLine int `json:"downline" valid:"type(int)"`
	TimeLine int `json:"timeline" valid:"type(int)"`
}

type UpdateTargetPayload struct {
	Status bool `json:"status" `
}

type TargetWithdrawalPayload struct {
	Amount    string `json:"amount" valid:"type(string)"`
	Wallet    string `json:"wallet" valid:"type(string)"`
	Recipient string `json:"recipient" valid:"type(string)"`
	Target    string `json:"target" valid:"type(string)"`
}

type DownlineWalletPayload struct {
	DownlineId string `json:"id"`
	Amount     int64  `json:"amount"`
}

type DownlineBankPayload struct {
	DownlineId string `json:"id"`
	Amount     string `json:"amount"`
	Recipient  string `json:"recipient"`
}
