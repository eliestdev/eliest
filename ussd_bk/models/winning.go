package models

type WinPayload struct {
	Code   string `json:"code"`
	MSISDN string `json:"msisdn"`
}

type WinCodeCheckPayload struct {
	Amount float64 `json:"amount"`
	Status string  `json:"status"`
}

type TransferredCallback struct {
	MSISDN string  `json:"msisdn"`
	Agent  string  `json:"agent"`
	Amount float32 `json:"amount"`
}

type TransferredBankCallback struct {
	MSISDN string  `json:"msisdn"`
	Amount float32 `json:"amount"`
}

type VoucherCallback struct {
	Code   string `json:"code"`
	MSISDN string `json:"msisdn"`
}
