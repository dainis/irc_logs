SERVER_SRC=$(wildcard server/*)
WEB_SRC=$(wildcard web_app/*)

bin/irc_logs: $(SERVER_SRC) main.go
	go build -o bin/irc_logs .

build_webapp: $(WEB_SRC)
	cd web_app;	grunt build

docker: bin/irc_logs build_webapp dockerfiles/server_Dockerfile dockerfiles/static_Dockerfile
	docker build -t dainis/irc_logs_server -f dockerfiles/server_Dockerfile ./
	docker build -t dainis/irc_logs_static -f dockerfiles/static_Dockerfile ./

push: docker
	docker push dainis/irc_logs_server
	docker push dainis/irc_logs_static

updatedeps:
	go list ./... \
		| go list -f '{{join .Deps "\n"}}' \
		| grep -v github.com/dainis/irc_logs \
		| xargs go get -f -u -v

.PHONY: build_webapp docker push updatedeps

