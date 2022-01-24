package db

import (
	"lottoshared/sharedmodel"
	"lottoussd/models"
)

type Handler interface {
	FindAccount(*sharedmodel.Account) (*sharedmodel.Account, error)
	FindAgent(*sharedmodel.Agent) (*sharedmodel.Agent, error)
	CreateAccount(*sharedmodel.Account) (string, error)
	UpdateUser(*sharedmodel.Account, *sharedmodel.Account) error
	UpdateUserMap(*sharedmodel.Account, map[string]interface{}) error
	FindAgentWallet(*sharedmodel.Wallet) (*sharedmodel.Wallet, error)
	CreateTransaction(*sharedmodel.Transaction) (string, error)
	CreateGameLog(*sharedmodel.GameEntry) error

	UpdateAgent(*sharedmodel.Agent, *sharedmodel.Agent) error
	UpdateAgentMap(*sharedmodel.Agent, map[string]interface{}) error

	CreateWinning(*sharedmodel.Winnings) (string, error)
	FindWinning(*sharedmodel.Winnings) (*sharedmodel.Winnings, error)
	UpdateWinning(*sharedmodel.Winnings, *sharedmodel.Winnings) error
	UpdateWinningMap(*sharedmodel.Winnings, map[string]interface{}) error

	CreateVoucher(*sharedmodel.Voucher) (string, error)
	CreateVBatch(*models.VBatch) (string, error)
	FindVoucher(*sharedmodel.Voucher) (*sharedmodel.Voucher, error)
	UpdateVoucher(*sharedmodel.Voucher, *sharedmodel.Voucher) error
	UpdateVoucherMap(*sharedmodel.Voucher, map[string]interface{}) error
	FindScratchGame(id string) (*models.ScratchPlayDenominations, error)
}
