package persistence

import (
	"lottoadmin/models"
	"lottoshared/sharedmodel"
)

type ServiceDBHandle interface {
	CreateAdmin(*sharedmodel.AdminAccount) (string, error)
	AuthenticateAdmin(*sharedmodel.AdminAccount) (*sharedmodel.AdminAccount, error)
	FindWallets(map[string]interface{}) ([]sharedmodel.Wallet, error)

	FindAgent(*sharedmodel.Agent) (*sharedmodel.Agent, error)
	FindTransaction(*sharedmodel.Transaction) (sharedmodel.Transaction, error)
	FindTransactions(string) ([]sharedmodel.Transaction, error)
	AllTransactions(int64, int64) ([]sharedmodel.Transaction, error)
	AllFinTransactions(int64, int64) ([]sharedmodel.Transaction, error)
	AllWalletTransactions(string) ([]sharedmodel.Transaction, error)
	AllIncomeTransactions(string, int64, int64) ([]sharedmodel.Transaction, error)
	AllAgentFundings(string, int64, int64) ([]sharedmodel.Transaction, error)

	DefaultTransactions() ([]sharedmodel.Transaction, error)

	AgentProfile(string) (*sharedmodel.Agent, error)
	SupervisorProfile(string) (*sharedmodel.Supervisor, error)
	AllAgents() ([]sharedmodel.Agent, error)
	FindAgnetWithPhone(string) ([]sharedmodel.Agent, error)

	AllSupervisors() ([]sharedmodel.Supervisor, error)
	AllGames() ([]sharedmodel.GameEntry, error)
	AllFinGames(int64, int64) ([]sharedmodel.GameEntry, error)

	GetAllParnet() ([]sharedmodel.Partner, error)
	GetAllAdmin() ([]sharedmodel.AdminAccount, error)
	GetParnet(*sharedmodel.Partner) (sharedmodel.Partner, error)
	GetAdmin(*sharedmodel.AdminAccount) (sharedmodel.AdminAccount, error)
	AddParnet(*sharedmodel.Partner) (uint64, error)
	UpdatePartnerMap(*sharedmodel.Partner, map[string]interface{}) error
	UpdateParnet(*sharedmodel.Partner, *sharedmodel.Partner) error
	UpdateAdmin(*sharedmodel.AdminAccount, sharedmodel.AdminAccount) error
	UpdateAgentMap(*sharedmodel.Agent, map[string]interface{}) error
	UpdateSupervisorMap(*sharedmodel.Supervisor, map[string]interface{}) error

	CreateTarget(*sharedmodel.SupervisorTarget) (string, error)
	GetAllTargets() ([]sharedmodel.SupervisorTarget, error)
	GetATarget(string) (*sharedmodel.SupervisorTarget, error)

	CreateTargetAssignment(*sharedmodel.TargetAssignment) (string, error)
	GetAgentAssignments(string) ([]sharedmodel.TargetAssignment, error)
	GetAAssignments(string) (*sharedmodel.TargetAssignment, error)
	UpdateAssignmentMap(*sharedmodel.TargetAssignment, map[string]interface{}) error

	AllAssignments() ([]sharedmodel.AssignmentQuery, error)

	SupervisorAgents(string) ([]sharedmodel.Agent, error)
	//GetATarget(string)(*sharedmodel.Voucher, error)

	GetAgentTargets(string) ([]sharedmodel.AgentTargetAssignment, error)
	// UpdateAgentTargets(string, *sharedmodel.AgentTargetAssignment) ([]sharedmodel.AgentTargetAssignment, error)

	AddPlayDenominaton(models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error)
	GetPlayDenominations() ([]models.ScratchPlayDenominations, error)
	DeletePlayDenomination(models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error)
	UpdatePlayDenomination(models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error)

	GetGlobalAgentTargets() ([]models.AgentsTargetInformation, error)
	ChangeGlobalAgentTarget(models.AgentsTargetInformation) ([]models.AgentsTargetInformation, error)

	GetSupervisorAmountCount() ([]models.SupervisorAmountCount, error)
	UpdateSupervisorAmountCount(models.SupervisorAmountCount) ([]models.SupervisorAmountCount, error)
}
