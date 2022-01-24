package models

type VBatch struct {
	ID       string `json:"id" gorm:"primary_key"`
	Timeline int64  `json:"timeline" gorm:"size:255;"`
	Owner    string `json:"owner" gorm:"size:255;"`
}

type Game struct {
	Id          string  `json:"id"  gorm:"primary_key"`
	TagName     string  `json:"tag_name" gorm:"size:255;"`
	TargetCount int64   `json:"target_count" gorm:"size:255;"`
	WinnersCut  float64 `json:"winners_cut" gorm:"size:255;"`
	Cost        int64   `json:"cost"`
	CreatedAt   int64   `json:"created_at" `
	UpdatedAt   int64   `json:"updated_at"`
}

type CleanAgent struct {
	Id               string `json:"id"  gorm:"primary_key"`
	Firstname        string `json:"firstname" gorm:"size:255;"`
	Lastname         string `json:"lastname" gorm:"size:255;"`
	Email            string `json:"email" gorm:"size:255;unique"`
	Status           string `json:"status" gorm:"size:255;"`
	Phone            string `json:"phone" gorm:"size:255;unique"`
	State            string `json:"state" gorm:"size:255;"`
	Lg               string `json:"lg" gorm:"size:255;"`
	Address          string `json:"address" gorm:"size:255;"`
	RefCode          string `json:"refcode" gorm:"size:255;"`
	Referrer         string `json:"referrer" gorm:"size:255;"`
	AccountActivated bool   `json:"account_verified"`
	CreatedAt        int64  `json:"created_at" `
	UpdatedAt        int64  `json:"updated_at" `
	Image            string `json:"image"`
}

type PaystackData struct {
	Status  bool        `json:"status" `
	Message string      `json:"message" `
	Data    interface{} `json:"data" `
}

type PaystackRecipient struct {
	Type          string `json:"type"`
	AccountNumber string `json:"account_number"`
	BankCode      string `json:"bank_code"`
	Currency      string `json:"currency"`
	Name          string `json:"name"`
}

type PaystackTransfer struct {
	Source    string `json:"source"`
	Amount    string `json:"amount"`
	Recipient string `json:"recipient"`
	Reason    string `json:"reason"`
}

type PaystackTransferT struct {
	Source    string `json:"Source"`
	Amount    string `json:"Amount"`
	Recipient string `json:"recipient"`
	Reason    string `json:"reason"`
}

func PaystackTransferNew(amount, recipient string) PaystackTransfer {
	return PaystackTransfer{
		Source:    "balance",
		Amount:    amount,
		Recipient: recipient,
		Reason:    "Eliest Agent Withdrawal",
	}
}

func PaystackTransferNewT(amount, recipient string) PaystackTransferT {
	return PaystackTransferT{
		Source:    "balance",
		Amount:    amount,
		Recipient: recipient,
		Reason:    "Eliest Agent Withdrawal",
	}
}

func PaystackRecipientNew(nuban, bank string) PaystackRecipient {
	return PaystackRecipient{
		Type:          "nuban",
		AccountNumber: nuban,
		BankCode:      bank,
		Currency:      "NGN",
		Name:          "KASSIM DAMILOLA ANJOLA",
	}
}

type PaystackRecipientResponse struct {
	Active        bool   `json:"active"`
	CreatedAt     string `json:"createdAt"`
	Currency      string `json:"currency"`
	Domain        string `json:"domain"`
	ID            int    `json:"id"`
	Integration   int    `json:"integration"`
	Name          string `json:"name"`
	RecipientCode string `json:"recipient_code"`
	Type          string `json:"type"`
	UpdatedAt     string `json:"updatedAt"`
	IsDeleted     bool   `json:"is_deleted"`
}

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
