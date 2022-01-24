package models

type ScratchPlayDenominations struct {
	ID           string  `json:"id" gorm:"primaryKey"`
	Amount       float64 `json:"amount"`
	WinningCount float64 `json:"count"`
	AmountWon    float64 `json:"won"`
}

type AgentsTargetInformation struct {
	ID      int64   `json:"id" gorm:"primaryKey"`
	Minimum float64 `json:"minimum"`
	Reward  float64 `json:"reward"`
}

type AssignAgentPayload struct {
	AgentId      string `json:"agent" valid:"type(string)"`
	SupervisorId string `json:"supervisor" valid:"type(string)"`
}

type CreateTargetPayload struct {
	Title               string  `json:"title"`
	Description         string  `json:"description"`
	AgentSpendingTarget float64 `json:"target"`
	//AgentDownlineTarget int     `json:"lineTarget"`
}

type CreateAssignmentPayload struct {
	Target     string  `json:"target"`
	Amount     float64 `json:"amount"`
	Supervisor string  `json:"supervisor"`
	Start      int64   `json:"start"`
	Reward     float64 `json:"reward"`
	Deadline   int64   `json:"deadline"`
	//AgentDownlineTarget int     `json:"lineTarget"`
}

type PayloadAdminLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type PayloadPartnerLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreatePartner struct {
	Name       string  `json:"name" `
	Email      string  `json:"email" `
	Percentage float64 `json:"percentage" `
	Password   string  `json:"password"`
}

type RegisterAdminPayload struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Name     string `json:"name"`
	Status   string `json:"status"`
	ReadOnly bool   `json:"read_only"`
	Password string `json:"password"`
}

type UpdateAdminAccountPayload struct {
	Email    string `json:"email" gorm:"type:varchar(255);not null"`
	Phone    string `json:"phone"`
	ReadOnly bool   `json:"read_only"`
	Name     string `json:"name" gorm:"size:255;"`
	Status   bool   `json:"status"`
	Password string `json:"password"`
}

type AgentTargetPayload struct {
	AgentId   string `json:"agent" `
	DownLine  int    `json:"downline" `
	TimeLine  int64  `json:"timeline" `
	Claimed   bool   `json:"claimed" `
	CreatedAt int64  `json:"created_at" `
	UpdatedAt int64  `json:"updated_at" `
	Reward    int64  `json:"reward"`
	Duration  int64  `json:"duration"`
}

type SupervisorAmountCount struct {
	Id    string `json:"id"`
	Count int64  `json:"count"`
}
