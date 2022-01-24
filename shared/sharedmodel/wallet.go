package sharedmodel

import (
	"lottoshared/constants"
	"lottoshared/helpers"
)

type Wallet struct {
	Id        string `json:"id"  gorm:"primary_key"`
	Owner     string `json:"owner" gorm:"size:255;"`
	IsActive  bool   `json:"is_active"`
	Title     string `json:"title" gorm:"size:255;"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

type WalletQuery struct {
	Info       Wallet        `json:"info"`
	Transactions []Transaction `json:"transactions"`
	Balance float64 `json:"balance"`
}

func GetWalletQuerySummary(walletQuery *WalletQuery)  {
	balance := 0.0
	for _, transaction := range walletQuery.Transactions {
		if transaction.Class == constants.DEBIT {
			balance -= transaction.Amount
		}
		if transaction.Class == constants.CREDIT {
			balance += transaction.Amount
		}
	}
	walletQuery.Balance = balance
}

func NewWallet(title, owner string) Wallet {
	return Wallet{
		Id:        helpers.GuidId(),
		Owner:     owner,
		IsActive:  false,
		Title:     title,
		CreatedAt: helpers.CreatedAt(),
		UpdatedAt: helpers.CreatedAt(),
	}
}


type WalletsResponse struct {
	Wallets []Wallet `json:"wallets" `
}

type WalletResponse struct {
	Wallet  Wallet `json:"wallet" `
}

type WalletQueriesResponse struct {
	WalletQueries []WalletQuery `json:"wallet_queries" `
}

type WalletQueryResponse struct {
	WalletQuery  WalletQuery `json:"wallet_query" `
}

func CalculateWalletBalance(transactions []Transaction)  float64 {
	balance := 0.0
	for _, transaction := range transactions {
		if transaction.Class == "debit" {
			balance -= transaction.Amount
		}
		if transaction.Class == "credit" {
			balance += transaction.Amount
		}
	}
	return balance
}