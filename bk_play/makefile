start_local_portal: 
	cd cmd && go build -o bin/lottoportal main.go && cd bin && ./lottoportal
build_linux_prod: 
	cd cmd && env GOOS=linux go build -o bin/lottoportal
push_linux_prod:
	cd cmd/bin && scp lottoportal kd@168.61.88.70:/var/www/eliestlotto