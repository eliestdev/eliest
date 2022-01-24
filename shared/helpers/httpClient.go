package helpers

import (
	"log"
	"net"
	"net/http"
	"time"
)


var netTransport = &http.Transport{
	Dial: (&net.Dialer{
		Timeout: 15 * time.Second,
	}).Dial,
	TLSHandshakeTimeout: 15 * time.Second,
}

var NetClient = &http.Client{
	Timeout:   time.Second * 15,
	Transport: netTransport,
}

func HttpReq(req *http.Request) (*http.Response, error) {

	var netTransport = &http.Transport{
		Dial: (&net.Dialer{
			Timeout: 30 * time.Second,
		}).Dial,
		TLSHandshakeTimeout: 30 * time.Second,
	}

	var netClient = &http.Client{
		Timeout:   time.Second * 45,
		Transport: netTransport,
	}
	res, err := netClient.Do(req)
	log.Print(res)
	// check for response error
	if err != nil {
		log.Panicln("Error:", err)
		return nil, err
	}
	return res, err
}


