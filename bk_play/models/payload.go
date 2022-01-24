package models

import "github.com/asaskevich/govalidator"

func init() {
	govalidator.SetFieldsRequiredByDefault(true)
}

type LoginPayload struct {
	MSISDN string `json:"msisdn" valid:"type(string)"`
	Pin    string `json:"pin" valid:"type(string)"`
}

type RegisterPayload struct {
	MSISDN string `json:"msisdn" valid:"type(string)"`
	Yob    string `json:"yob" valid:"type(string)"`
	Pin    string `json:"pin" valid:"type(string)"`
}

type TransferredCallback struct {
	MSISDN string  `json:"msisdn"`
	Agent  string  `json:"agent"`
	Amount float32 `json:"amount"`
}

type TransferPayload struct {
	Amount    string `json:"amount" valid:"type(string)"`
	Wallet    string `json:"wallet" valid:"type(string)"`
	Recipient string `json:"recipient" valid:"type(string)"`
}

type PaystackTransfer struct {
	Source    string `json:"source"`
	Amount    string `json:"amount"`
	Recipient string `json:"recipient"`
	Reason    string `json:"reason"`
}

func PaystackTransferNew(amount, recipient string) PaystackTransfer {
	return PaystackTransfer{
		Source:    "balance",
		Amount:    amount,
		Recipient: recipient,
		Reason:    "Eliest Agent Withdrawal",
	}
}

type PaystackData struct {
	Status  bool        `json:"status" `
	Message string      `json:"message" `
	Data    interface{} `json:"data" `
}

type PaystackRecipient struct {
	Type          string `json:"type"`
	AccountNumber string `json:"account_number"`
	BankCode      string `json:"bank_code"`
	Currency      string `json:"currency"`
	Name          string `json:"name"`
}

func PaystackRecipientNew(nuban, bank string) PaystackRecipient {
	return PaystackRecipient{
		Type:          "nuban",
		AccountNumber: nuban,
		BankCode:      bank,
		Currency:      "NGN",
		Name:          "KASSIM DAMILOLA ANJOLA",
	}
}

type PaystackRecipientResponse struct {
	Active        bool   `json:"active"`
	CreatedAt     string `json:"createdAt"`
	Currency      string `json:"currency"`
	Domain        string `json:"domain"`
	ID            int    `json:"id"`
	Integration   int    `json:"integration"`
	Name          string `json:"name"`
	RecipientCode string `json:"recipient_code"`
	Type          string `json:"type"`
	UpdatedAt     string `json:"updatedAt"`
	IsDeleted     bool   `json:"is_deleted"`
}

type VerifyBankPayload struct {
	Bank  string `json:"bank" valid:"type(string)"`
	Nuban string `json:"nuban" valid:"type(string)"`
}
