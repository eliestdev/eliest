start_local_admin: 
	cd cmd && go build -o bin/lottoadmin main.go && cd bin && ./lottoadmin
build_linux_ussd: 
	cd cmd && env GOOS=linux go build -o bin/lottoadmin
push_linux_ussd:
	cd cmd/bin && scp lottoadmin kd@168.61.88.70:/var/www/eliestlotto