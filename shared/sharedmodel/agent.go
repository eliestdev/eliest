package sharedmodel

type Agent struct {
	Id               string `json:"id"  gorm:"primary_key"`
	Firstname        string `json:"firstname" gorm:"size:255;"`
	Lastname         string `json:"lastname" gorm:"size:255;"`
	Password         []byte `json:"-"`
	Email            string `json:"email" gorm:"size:255;unique"`
	Status           string `json:"status" gorm:"size:255;"`
	Phone            string `json:"phone" gorm:"size:255;unique"`
	State            string `json:"state" gorm:"size:255;"`
	City             string `json:"city" gorm:"size:255;"`
	Lg               string `json:"lg" gorm:"size:255;"`
	Address          string `json:"address" gorm:"size:255;"`
	RefCode          string `json:"refcode" gorm:"size:255;"`
	Referrer         string `json:"referrer" gorm:"size:255;"`
	Supervisor       string `json:"supervisor" gorm:"size:255;"`
	AccountActivated bool   `json:"account_verified"`
	Suspended        bool   `json:"suspended"`
	CreatedAt        int64  `json:"created_at" `
	UpdatedAt        int64  `json:"updated_at" `
}

type AgentsResponse struct {
	Agents []Agent `json:"agents" `
}

type AgentResponse struct {
	Agent Agent `json:"agent" `
}

type AgentTargetAssignment struct {
	ID        uint
	AgentId   string `json:"agent" `
	DownLine  int    `json:"downline" `
	TimeLine  int64  `json:"timeline" `
	Claimed   bool   `json:"claimed" `
	CreatedAt int64  `json:"created_at" `
	UpdatedAt int64  `json:"updated_at" `
	Reward    int64  `json:"reward"`
	Duration  int64  `json:"duration"`
}

type AgentTargetStatusResponse struct {
	Target             AgentTargetAssignment `json:"target" `
	ActivatedDownLines []Agent               `json:"active" `
	InActiveDownLines  []Agent               `json:"inactive" `
}

type AgentReferalls struct {
	ID        uint
	RefCode   string `json:"ref_code" `
	NewAgent  string `json:"agent" `
	Activated bool   `json:"activated" `
	CreatedAt int64  `json:"created_at" `
	UpdatedAt int64  `json:"updated_at" `
}
