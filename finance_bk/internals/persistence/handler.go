package persistence

import (
	"lottoshared/sharedmodel"
)

type ServiceDBHandle interface {
	CreateWallet(*sharedmodel.Wallet) (string, error)
	GetWallet(*sharedmodel.Wallet) (sharedmodel.WalletQuery, error)
	FindWallet(*sharedmodel.Wallet) (sharedmodel.Wallet, error)
	FindWallets(map[string]interface{}) ([]sharedmodel.Wallet, error)
	UpdateWallet(*sharedmodel.Wallet, *sharedmodel.Wallet) error
	UpdateWalletMap(*sharedmodel.Wallet, map[string]interface{}) error

	CreateTransaction(*sharedmodel.Transaction) (string, error)
	FindTransaction(*sharedmodel.Transaction) (sharedmodel.Transaction, error)
	FindAllTransactions(*sharedmodel.Transaction) ([]sharedmodel.Transaction, error)
	FindTransactions(map[string]interface{}) ([]sharedmodel.Transaction, error)
	FindRecentTransactions(map[string]interface{}) ([]sharedmodel.Transaction, error)
	UpdateTransaction(*sharedmodel.Transaction, map[string]interface{}) error
}
