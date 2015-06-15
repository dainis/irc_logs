package server

import (
	"encoding/json"
	"github.com/donovanhide/eventsource"
	"log"
	"net/http"
	"strconv"
)

type HTTP struct {
	history          *ElasticHistory
	incomingMessages chan *Message
	port             int
	eventSrcSrv      *eventsource.Server
}

func NewHTTP(history *ElasticHistory, port int) *HTTP {
	h := new(HTTP)

	h.history = history
	h.incomingMessages = make(chan *Message)
	h.port = port
	h.eventSrcSrv = eventsource.NewServer()

	http.HandleFunc("/subscribe", h.eventSrcSrv.Handler("message"))
	http.HandleFunc("/load", h.getLoadHandler())

	return h
}

func (h *HTTP) getLoadHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		from := r.URL.Query().Get("from")
		to := r.URL.Query().Get("to")

		if from == "" {
			from = "now-24h"
		}

		if to == "" {
			to = "now"
		}

		log.Printf("Will fetch history from : %s to : %s", from, to)

		messages, err := h.history.GetMessagesBetween(from, to)

		if err != nil {
			errStr, _ := json.Marshal(map[string]string{"error": "try again"})
			log.Printf("Error : %e while fetching history from elasticsearch\n", err)
			w.WriteHeader(500)
			w.Write(errStr)
			return
		}

		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(200)
		w.Write(messages)
	}
}

func (h *HTTP) Listen() {
	go http.ListenAndServe(":"+strconv.Itoa(h.port), nil)
	go h.loop()
}

func (h *HTTP) GetChannel() chan *Message {
	return h.incomingMessages
}

func (h *HTTP) loop() {
	for {
		message := <-h.incomingMessages
		h.eventSrcSrv.Publish([]string{"message"}, message)
	}
}
