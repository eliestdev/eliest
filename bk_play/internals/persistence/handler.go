package persistence

import "lottoshared/sharedmodel"

type ServiceDBHandle interface {
	FindAccount(*sharedmodel.Account) (sharedmodel.Account, error)
	CreateAccount(*sharedmodel.Account) (string, error)
	FindAgent(*sharedmodel.Agent) (*sharedmodel.Agent, error)
	UpdateUserMap(*sharedmodel.Account, map[string]interface{}) error

	FindWallet(string, string, string) (*sharedmodel.WalletResponse, error)
}
