SERVER_SRC=$(wildcard server/*)
WEB_SRC=$(wildcard web_app/*)

bin/irc_logs: $(SERVER_SRC) main.go
	go build -o bin/irc_logs .

build_webapp: $(WEB_SRC)
	cd web_app;	grunt build

docker: bin/irc_logs build_webapp server_Dockerfile static_Dockerfile
	docker build -t dainis/irc_logs_server -f server_Dockerfile ./
	docker build -t dainis/irc_logs_static -f static_Dockerfile ./

push: docker
	docker push dainis/irc_logs_server
	docker push dainis/irc_logs_static

.PHONY: build_webapp docker push

