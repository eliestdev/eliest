package database

import (
	"fmt"
	"play_bk/main/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	dsn := "root:password@tcp(127.0.0.1:3306)/lottoplay?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	} else {
		fmt.Print("Connected to db")
	}

	db.AutoMigrate(&models.Users{})
	return db
}

func CreateAccount(db *gorm.DB, user models.Users) {
	result := db.Create(&user)

	if result.Error != nil {
		panic("An error just occured")
	}
}

func FindUserAccount(db *gorm.DB, user models.Users) []models.Users {
	var u []models.Users
	db.First(&models.Users{Email: user.Email, Password: user.Password}).Find(&u)
	return u
}

func CheckIfAccountExists(db *gorm.DB, email string) bool {
	var u []models.Users
	db.First(&models.Users{Email: email}).Find(&u)

	size := len(u)
	if size == 0 {
		return false
	}

	return true
}
