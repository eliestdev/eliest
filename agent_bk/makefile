start_local_agent: 
	cd cmd && go build -o bin/lottoagent main.go && cd bin && ./lottoagent
build_linux_prod: 
	cd cmd && env GOOS=linux go build -o bin/lottoagents
push_linux_prod:
	cd cmd/bin && scp lottoagents kd@168.61.88.70:/var/www/eliestlotto