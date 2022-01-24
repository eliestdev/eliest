package persistence

import (
	"lottoshared/sharedmodel"
	"lottosupervisor/models"
)

type ServiceDBHandle interface {
	CreateSupervisor(*sharedmodel.Supervisor) (string, error)
	FindSupervisor(*sharedmodel.Supervisor) (*sharedmodel.Supervisor, error)
	FindSupervisors(map[string]interface{}) ([]sharedmodel.Supervisor, error)
	UpdateSupervisor(*sharedmodel.Supervisor, *sharedmodel.Supervisor) error
	DeleteSupervisor(*sharedmodel.Supervisor) (*sharedmodel.Supervisor, error)

	GetTarget(*sharedmodel.SupervisorTarget) (*sharedmodel.SupervisorTarget, error)
	GetTargets(map[string]interface{}) ([]sharedmodel.SupervisorTarget, error)

	DeleteTarget(*sharedmodel.SupervisorTarget) (*sharedmodel.SupervisorTarget, error)
	DeleteTargets(map[string]interface{}) ([]sharedmodel.SupervisorTarget, error)

	CreateTargetAssignment(*sharedmodel.TargetAssignment) (string, error)
	GetTargetAssignment(*sharedmodel.TargetAssignment) (*sharedmodel.TargetAssignment, error)
	GetTargetAssignments(map[string]interface{}) ([]sharedmodel.AssignmentQuery, error)
	UpdateTargetAssignment(*sharedmodel.TargetAssignment, *sharedmodel.TargetAssignment) error

	CreateTargetReward(*sharedmodel.TargetReward) (string, error)

	GetAgentDownline(id string) ([]sharedmodel.Agent, error)
	FindAgents(string) ([]sharedmodel.Agent, error)
	FindAgent(models.NonPayingSupervisorAgentPayload) ([]sharedmodel.Agent, error)
	UpdateAgent(*sharedmodel.Agent, *sharedmodel.Agent) error

	GetSupervisorAdminAssignCount() ([]models.SupervisorAmountCount, error)
	FindUnAssignedAgents(int64) ([]sharedmodel.Agent, error)
	FindSupervisorAgents(string) ([]sharedmodel.Agent, error)
	FindTransactions(map[string]interface{}) ([]sharedmodel.Transaction, error)
}
