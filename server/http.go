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
	http.HandleFunc("/stats/histogram", h.getStatsHistogramHandler())
	http.HandleFunc("/stats/top24h", h.getStatsTopHandler("now-24h", "now"))
	http.HandleFunc("/stats/overall", h.getStatsTopHandler("", ""))

	return h
}
func errorResponse(tag string, err error, w http.ResponseWriter) {
	log.Printf("%s : Error %e", tag, err)
	errStr, _ := json.Marshal(map[string]string{"error": "try again"})
	w.WriteHeader(500)
	w.Write(errStr)
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
			errorResponse("getLoadHandler", err, w)
			return
		}

		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(200)
		w.Write(messages)
	}
}

func (h *HTTP) getStatsHistogramHandler() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		res, err := h.history.GetDailyHistogram("now-30d", "now")

		if err != nil {
			errorResponse("getStatsHistogramHandler", err, w)
			return
		}

		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(200)
		w.Write(res)
	}
}

func (h *HTTP) getStatsTopHandler(from, to string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		res, err := h.history.GetUserMessageCount(from, to)

		if err != nil {
			errorResponse("getStatsTopHandler", err, w)
			return
		}

		w.Header().Set("Content-type", "application/json")
		w.WriteHeader(200)
		w.Write(res)
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
