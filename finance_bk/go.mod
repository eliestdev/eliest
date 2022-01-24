module lottofinance

replace lottoshared => ../shared

go 1.14

require (
	github.com/asaskevich/govalidator v0.0.0-20210307081110-f21760c49a8d
	github.com/gorilla/mux v1.8.0
	github.com/joho/godotenv v1.3.0
	gorm.io/driver/mysql v1.1.2
	gorm.io/gorm v1.21.13
	lottoshared v0.0.0-00010101000000-000000000000
)
