package sharedmodel

type Parameter struct {
	ActivationFee           float64 `json:"101"`
	VoucherDiscount         float64 `json:"103"`
	VoucherLength           int     `json:"104"`
	WinningLength           int     `json:"105"`
	ReferralPercentage1     string  `json:"001"`
	ReferralPercentage2     string  `json:"002"`
	ActivationVoucherReturn int     `json:"102"`
	SupervisorLimit    int     `json:"202"`
	SupervisorActivationFee           float64 `json:"201"`
	Tax           float64 `json:"302"`

}

// ActivationFee 101
// ActivationReturn 102
// VoucherDiscount 103
// VoucherLength 104
// WinningLength
// ReferralPercentage1 001
// ReferralPercentage2 002
// SupervisorLimit 202
// SupervisorActivationFee 201
