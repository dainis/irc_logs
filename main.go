package main

import (
	"flag"
	"github.com/dainis/irc_logs/server"
	"time"
)

var verbose bool
var port int
var channel, nick, esHost string

func init() {
	flag.BoolVar(&verbose, "verbose", false, "Set to true to use verbose logging")
	flag.IntVar(&port, "port", 8080, "Port used by http")
	flag.StringVar(&channel, "channel", "#developerslv", "Channel to join")
	flag.StringVar(&nick, "nick", "S_A_B", "Nick to join with")
	flag.StringVar(&esHost, "es", "http://localhost:9200", "Elasticsearch host")
}

func main() {

	flag.Parse()

	irc := server.NewIrcHandler("irc.freenode.net:8001", channel, nick, nick)
	history := server.NewElasticHistory(esHost, channel)
	http := server.NewHTTP(history, port)

	irc.Verbose(verbose)

	irc.AddSubscriber(history.GetChannel())
	irc.AddSubscriber(http.GetChannel())
	irc.Connect()

	http.Listen()

	loop()
}

func loop() {
	for {
		time.Sleep(24 * time.Hour)
	}
}
