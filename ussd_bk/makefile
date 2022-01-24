start_local_ussd: 
	cd cmd && go build -o bin/lottoussd main.go && cd bin && ./lottoussd
build_linux_prod: 
	cd cmd && env GOOS=linux go build -o bin/lottoussd
push_linux_prod:
	cd cmd/bin && scp lottoussd kd@168.61.88.70:/var/www/eliestlotto
push_prod_static:
	cd cmd && scp -r landing kd@168.61.88.70:/var/www/eliestlotto