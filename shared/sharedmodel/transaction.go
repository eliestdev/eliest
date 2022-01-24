package sharedmodel

import "lottoshared/helpers"

type TransactionType int
type TransactionClass string

const (
	DEPOSIT  TransactionType = 101
	PAYOUT   TransactionType = 102
	SALES    TransactionType = 103
	TRANSFER TransactionType = 104
)

const (
	CREDIT TransactionClass = "CREDIT"
	DEBIT  TransactionClass = "DEBIT"
)

type Transaction struct {
	Id          string           `json:"id"  gorm:"primary_key"`
	Amount      float64          `json:"amount"`
	Reference   string           `json:"reference"`
	Account     string           `json:"account" gorm:"size:255;"`
	Source      string           `json:"source" gorm:"size:255;"`
	Destination string           `json:"destination" gorm:"size:255;"`
	Description string           `json:"description" gorm:"size:255;"`
	Supervisor string           `json:"supervisor" gorm:"size:255;"`
	Class       TransactionClass `json:"class" gorm:"size:255;"`
	CreatedAt   int64            `json:"created_at" `
	UpdatedAt   int64            `json:"updated_at"`
}

func NewTransaction(reference, account, class, source, destination, description, supervisor string, amount float64) Transaction {
	return Transaction{
		Id:          helpers.GuidId(),
		Amount:      amount,
		Reference:   reference,
		Account:     account,
		Source:      source,
		Destination: destination,
		Description: description,
		Supervisor: supervisor,
		Class:       TransactionClass(class),
		CreatedAt:   helpers.CreatedAt(),
		UpdatedAt:   helpers.CreatedAt(),
	}
}

type TransactionsResponse struct {
	Transactions []Transaction `json:"transactions"`
}


func TransactionTotal(transactions []Transaction) float64 {
	total := 0.0
	for _, v := range transactions {
		total+= v.Amount
	}
	return total
}