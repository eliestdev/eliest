package sharedmodel

type SupervisorTarget struct {
	Id                  string  `json:"id"  gorm:"primary_key"`
	Title               string  `json:"title"`
	Description         string  `json:"description"`
	AgentSpendingTarget float64 `json:"spendingTarget"`
	AgentDownlineTarget int     `json:"lineTarget"`
	CreatedAt           int64   `json:"created_at" `
	UpdatedAt           int64   `json:"updated_at" `
}

type TargetAssignment struct {
	Id           string  `json:"id"  gorm:"primary_key"`
	Target       string  `json:"target"`
	TargetAmount float64 `json:"amount"`
	Supervisor   string  `json:"supervisor"`
	Start        int64   `json:"start"`
	Reward       float64 `json:"reward"`
	Cancelled    bool   `json:"cancelled" `
	Deadline     int64   `json:"deadline"`
	CreatedAt    int64   `json:"created_at" `
	UpdatedAt    int64   `json:"updated_at" `
}

type AssignmentQuery struct{
	Target SupervisorTarget `json:"target"`
	Assignment TargetAssignment `json:"assignment"`
}

type TargetReward struct {
	Id         string  `json:"id"  gorm:"primary_key"`
	Target     string  `json:"target"`
	Supervisor string  `json:"supervisor"`
	Reward     float64 `json:"reward"`
	CreatedAt  int64   `json:"created_at" `
	UpdatedAt  int64   `json:"updated_at" `
}
