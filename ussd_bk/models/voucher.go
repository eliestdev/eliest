package models




type VBatch struct {
	ID        string    `json:"id" gorm:"primary_key"`
	Timeline        string    `json:"timeline" gorm:"size:255;"`
	Owner        string    `json:"owner" gorm:"size:255;"`
}
type VoucherPayload struct{
	Code        string    `json:"code"`
	MSISDN        string    `json:"msisdn"`
}

type VoucherCodeCheckPayload struct{
	Amount      float64   `json:"amount"`
	Status      string   `json:"status"`
}
