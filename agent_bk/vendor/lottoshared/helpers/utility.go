package helpers

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/smtp"
	"net/url"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/twinj/uuid"
)

func StartsWith(text, prefix string) bool {
	return strings.HasPrefix(text, prefix)
}

// Contains tells whether a contains x.
func Contains(a []string, x string) bool {
	for _, n := range a {
		if x == n {
			return true
		}
	}
	return false
}

func TrimFirstRune(s string) string {
	_, i := utf8.DecodeRuneInString(s)
	return s[i:]
}

const (
	AgentRefCodePrefix = "00"
)

func CreatedAt() int64 {
	return time.Now().Unix()
}

func GuidId() string {
	return uuid.NewV4().String()
}

func BuildHttpRequest(method, url, token string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	return req, nil
}

func MakeHttpRequest(request *http.Request, dst interface{}) error {

	result, err := HttpReq(request)
	if err != nil {
		return err
	}
	defer result.Body.Close()
	dec := json.NewDecoder(result.Body)
	err = dec.Decode(&dst)
	if err != nil {
		return err
	}
	return nil
}

func ParseQuery(values url.Values, arg map[string]interface{}) map[string]interface{} {
	for key, _ := range arg {
		query := values.Get(key)
		if query != "" {
			if key == "from" || key == "to" {
				i, _ := strconv.ParseInt(query, 10, 64)
				arg[key] = i
			}else{
				arg[key] = query
			}
		} else {
			delete(arg, key)
		}
	}
	return arg
}

type Mail struct {
	Sender  string
	To      []string
	Subject string
	Body    string
}

func BuildMessage(mail Mail) string {
	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s\r\n", mail.Sender)
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)

	return msg
}

func SendEmail(mail Mail, msg string) error {
	host := "smtp.gmail.com"
	pass := "hunnypinne"
	auth := smtp.PlainAuth("", mail.Sender, pass, host)
	err := smtp.SendMail("smtp.gmail.com:587", auth, mail.Sender, mail.To, []byte(msg))
	return err
}

func StructToReader(arg interface{}) io.Reader {
	_request, _ := json.Marshal(&arg)
	body := string(_request)
	return ioutil.NopCloser(strings.NewReader(body))
}


