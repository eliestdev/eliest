package sharedmodel

type Supervisor struct {
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
	AccountActivated bool   `json:"account_verified"`
	ReachedTargetCount bool   `json:"reached_target_count"`
	IsAutoAssign bool   `json:"is_auto_assign"`
	Suspended bool   `json:"suspended"`

	CreatedAt        int64  `json:"created_at" `
	UpdatedAt        int64  `json:"updated_at" `
}


type SupervisorsResponse struct {
	Supervisors []Supervisor `json:"supervisors" `
}

type SupervisorResponse struct {
	Supervisor  Supervisor `json:"supervisor" `
}