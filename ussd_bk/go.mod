module lottoussd

replace lottoshared => ../shared

go 1.16

require (
	github.com/asaskevich/govalidator v0.0.0-20210307081110-f21760c49a8d
	github.com/go-redis/redis/v7 v7.4.0
	github.com/gorilla/mux v1.8.0
	github.com/joho/godotenv v1.3.0
	github.com/mitchellh/mapstructure v1.4.1
	github.com/natefinch/lumberjack v2.0.0+incompatible
	github.com/twinj/uuid v1.0.0
	go.uber.org/zap v1.19.0
	gopkg.in/natefinch/lumberjack.v2 v2.0.0 // indirect
	gorm.io/driver/mysql v1.1.0
	gorm.io/gorm v1.21.10
	lottoshared v0.0.0-00010101000000-000000000000
)
