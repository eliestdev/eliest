package persistence

import (
	"lottoagent/models"
	"lottoshared/sharedmodel"
)

type ServiceDBHandle interface {
	FindAgent(*sharedmodel.Agent) (*sharedmodel.Agent, error)
	FindSupervisor(*sharedmodel.Supervisor) (*sharedmodel.Supervisor, error)
	FindAgents(string) ([]sharedmodel.Agent, error)
	FindVoucher(*sharedmodel.Voucher) (sharedmodel.Voucher, error)
	CreateVoucher(*sharedmodel.Voucher) error
	CreateAgent(*sharedmodel.Agent) (string, error)
	IFindAgents(map[string]interface{}) ([]sharedmodel.Agent, error)
	IFindAgent(map[string]interface{}) (*sharedmodel.Agent, error)

	CreateWallet(*sharedmodel.Wallet) (string, error)
	CreateTransaction(*sharedmodel.Transaction) (string, error)
	FindTransaction(*sharedmodel.Transaction) (sharedmodel.Transaction, error)
	FindTransactions(string) ([]sharedmodel.Transaction, error)
	FindWinningTransactions(string) ([]sharedmodel.Transaction, error)
	UpdateWallet(*sharedmodel.Wallet, map[string]interface{}) error

	UpdateAccountMap(*sharedmodel.Account, map[string]interface{}) error
	UpdateVoucher(*sharedmodel.Voucher, map[string]interface{}) error
	UpdateAgentMap(*sharedmodel.Agent, map[string]interface{}) error
	UpdateAgent(*sharedmodel.Agent, *sharedmodel.Agent) error
	AllAgents() ([]*sharedmodel.Agent, error)
	GenerateVouchers([]int, int, string) ([]sharedmodel.Voucher, string, error)
	CreateVBatch(*models.VBatch) (string, error)
	FindVBatch(string) ([]models.VBatch, error)
	FindBVouchers(string) ([]sharedmodel.Voucher, error)
	UpdateWinning(*sharedmodel.Winnings, map[string]interface{}) error
	FindWinning(*sharedmodel.Winnings) (*sharedmodel.Winnings, error)

	FindAccount(*sharedmodel.Account) (*sharedmodel.Account, error)
	UpdateUser(*sharedmodel.Account, *sharedmodel.Account) error
	UpdateUserMap(*sharedmodel.Account, map[string]interface{}) error

	GetTarget(*sharedmodel.AgentTargetAssignment) (sharedmodel.AgentTargetAssignment, error)
	DeleteTarget(*sharedmodel.AgentTargetAssignment) (sharedmodel.AgentTargetAssignment, error)
	GetTargets(*sharedmodel.AgentTargetAssignment) ([]sharedmodel.AgentTargetAssignment, error)
	CreateTarget(*sharedmodel.AgentTargetAssignment) (uint, error)
	UpdateTarget(*sharedmodel.AgentTargetAssignment, map[string]interface{}) error

	UpdateTargetWithModel(*sharedmodel.AgentTargetAssignment, *sharedmodel.AgentTargetAssignment) error

	CreateReferral(*sharedmodel.AgentReferalls) (uint, error)
	GetReferrals(string, int64, int64) ([]sharedmodel.AgentReferalls, error)

	GetDenominations() ([]models.ScratchPlayDenominations, error)
	FindGlobalTargets() ([]models.AgentsTargetInformation, error)
}
