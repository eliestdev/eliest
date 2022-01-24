start_local_finance: 
	cd cmd && go build -o bin/lottofinance main.go && cd bin && ./lottofinance
build_linux_prod: 
	cd cmd && env GOOS=linux go build -o bin/lottofinance
push_linux_prod:
	cd cmd/bin && scp lottofinance kd@168.61.88.70:/var/www/eliestlotto