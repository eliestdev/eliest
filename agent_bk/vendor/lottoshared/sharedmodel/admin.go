package sharedmodel

type AdminAccount struct {
	Id        string `json:"id" gorm:"primary_key;unique;not null"`
	Email     string `json:"email" gorm:"type:varchar(255);not null"`
	Phone     string `json:"phone"`
	ReadOnly bool `json:"read_only"`
	Name  string `json:"name" gorm:"size:255;"`
	Status    bool `json:"status"`
	Reference    string `json:"reference" gorm:"size:255;"`
	Password  []byte `json:"-"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}


type AdminPermissions struct {
	Id        string `json:"id" gorm:"primary_key;unique;not null"`
	Statement     string `json:"statement" gorm:"type:varchar(10);not null"`
	Phone     string `json:"phone"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName" gorm:"size:255;"`
	Status    string `json:"status" gorm:"size:255;"`
	Password  string `json:"password" gorm:"size:255;"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}
