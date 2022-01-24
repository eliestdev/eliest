module lottosupervisor

replace lottoshared => ../shared

go 1.16

require (
	github.com/asaskevich/govalidator v0.0.0-20210307081110-f21760c49a8d
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-redis/redis/v7 v7.4.1
	github.com/gorilla/mux v1.8.0
	github.com/joho/godotenv v1.3.0
	github.com/mitchellh/mapstructure v1.4.1 // indirect
	github.com/twinj/uuid v1.0.0
	golang.org/x/crypto v0.0.0-20210711020723-a769d52b0f97
	gorm.io/driver/mysql v1.1.1
	gorm.io/gorm v1.21.12
	lottoshared v0.0.0-00010101000000-000000000000
)
