package models

type SupervisorAgentLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterSupervisorPayload struct {
	Email     string `json:"email" valid:"email"`
	Firstname string `json:"firstname" valid:"type(string)"`
	Lastname  string `json:"lastname" valid:"type(string)"`
	Phone     string `json:"phone" valid:"type(string); length(11)~Enter a valid phone number. Example (08033445566)"`
	Address   string `json:"address" valid:"type(string)"`
	State     string `json:"state" valid:"type(string)"`
	Lg        string `json:"lg" valid:"type(string)"`
	City      string `json:"city" valid:"type(string)"`
	Cpassword string `json:"cpassword" valid:"type(string)"`
	Password  string `json:"password" valid:"length(7|255)~Your password should not be less than seven characters"`
}

type SupervisorProfile struct {
	Phone   string `json:"phone" valid:"type(string); length(11)~Enter a valid phone number. Example (08033445566)"`
	Address string `json:"address" valid:"type(string)"`
}

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

type NonPayingSupervisorAgentPayload struct {
	// Id      string `json:"id"`
	RefCode string `json:"refcode"`
}

type SupervisorAmountCount struct {
	Id    string  `json:"id"`
	Count float64 `json:"count"`
}

type SupervisorResetPayload struct {
	Email string `json:"email"`
}

type SupervisorSetPasswordPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Token    string `json:"token"`
}
