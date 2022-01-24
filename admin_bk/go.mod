module lottoadmin

replace lottoshared => ../shared

go 1.16

require (
	github.com/asaskevich/govalidator v0.0.0-20210307081110-f21760c49a8d
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-co-op/gocron v1.11.0
	github.com/go-redis/redis/v7 v7.4.1
	github.com/gorilla/mux v1.8.0
	github.com/joho/godotenv v1.3.0
	github.com/robfig/cron v1.2.0
	github.com/twinj/uuid v1.0.0
	golang.org/x/crypto v0.0.0-20210817164053-32db794688a5
	gorm.io/driver/mysql v1.1.2
	gorm.io/gorm v1.21.14
	lottoshared v0.0.0-00010101000000-000000000000
)
