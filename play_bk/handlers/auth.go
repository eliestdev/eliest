package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"play_bk/main/database"
	"play_bk/main/models"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"
)

var jwtKey = []byte("secret_key")

func SignUp(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var user models.Users
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		BadRequest(w)
	}

	database.CreateAccount(db, user)
	expirationTime := time.Now().Add(time.Minute * 30)
	claims := &models.Claims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		InternalServerError(w)
	}

	http.SetCookie(w, &http.Cookie{Name: "token", Value: tokenString, Expires: expirationTime})
	json.NewEncoder(w).Encode(map[string]string{"status": "OK", "token": tokenString})
}

func Login(w http.ResponseWriter, r *http.Request, db *gorm.DB) {
	var user models.Users
	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		BadRequest(w)
	}

	res := database.FindUserAccount(db, user)
	if len(res) < 1 {
		json.NewEncoder(w).Encode(map[string]string{"status": "ERROR", "message": "The Account does not exist"})
	}

	userAccount := res[0]

	expirationTime := time.Now().Add(time.Minute * 60)
	claims := &models.Claims{
		Username: userAccount.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		InternalServerError(w)
	}

	http.SetCookie(w, &http.Cookie{Name: "token", Value: tokenString, Expires: expirationTime})
	json.NewEncoder(w).Encode(map[string]string{"status": "OK", "token": tokenString})
}

func GetCurrentUser(w http.ResponseWriter, r http.Request) {
	cookie, err := r.Cookie("token")

	if err != nil {
		if err == http.ErrNoCookie {
			UnAuthorized(w)
		}

		BadRequest(w)
		return
	}

	tokenString := cookie.Value
	claims := &models.Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			UnAuthorized(w)
		}

		BadRequest(w)
	}

	if !token.Valid {
		UnAuthorized(w)
	}

	w.Write([]byte(fmt.Sprintf("Hello %s", claims.Username)))
}

func Refresh(w http.ResponseWriter, r http.Request) {
	cookie, err := r.Cookie("token")

	if err != nil {
		if err == http.ErrNoCookie {
			UnAuthorized(w)
		}

		BadRequest(w)
		return
	}

	tokenStr := cookie.Value
	claims := &models.Claims{}

	tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte("secret_key"), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			UnAuthorized(w)
		}

		BadRequest(w)
	}

	if !tkn.Valid {
		UnAuthorized(w)
	}

	if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 30*time.Second {
		BadRequest(w)
	}

	expirationTime := time.Now().Add(time.Minute * 60)
	claims.ExpiresAt = expirationTime.Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		InternalServerError(w)
	}

	http.SetCookie(w, &http.Cookie{Name: "refresh_token", Value: tokenString, Expires: expirationTime})

}

func SignOut() {}
