package models

import "gorm.io/gorm"

type Users struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	Username  string `json:"username"`
	gorm.Model
	Hash         string `json:"hash"`
	State        string `json:"state"`
	LGA          string `json:"lga"`
	ReferralCode string `json:"refferalcode"`
	Referred     bool   `json:"referred"`
	ReferredCode string `json:"refferedCode"`
	City         string `json:"city"`
	Address      string `json:"address"`
}
