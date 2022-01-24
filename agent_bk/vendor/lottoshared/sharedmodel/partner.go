package sharedmodel

type Partner struct {
	Id        uint64           `gorm:"primary_key" json:"id"`
	Name      string `json:"name" gorm:"size:255;"`
	Percentage      float64 `json:"percentage" gorm:"size:255;"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
	Status    bool   `json:"status"`
}
