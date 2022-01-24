start_local_supervisor: 
	cd cmd && go build -o bin/lottosupervisor main.go && cd bin && ./lottosupervisor
build_linux_prod: 
	cd cmd && env GOOS=linux go build -o bin/lottosupervisor
push_linux_prod:
	cd cmd/bin && scp lottosupervisor kd@168.61.88.70:/var/www/eliestlotto

