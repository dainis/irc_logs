package server

import (
	"encoding/json"
	"github.com/olivere/elastic"
	"log"
	"reflect"
	"strings"
)

const (
	TYPE string = "irc"
)

type ElasticHistory struct {
	host             string
	client           *elastic.Client
	index            string
	incomingMessages chan *Message
}

func NewElasticHistory(host string, index string) *ElasticHistory {
	var err error

	history := new(ElasticHistory)
	history.client, err = elastic.NewClient(elastic.SetURL(host))
	history.incomingMessages = make(chan *Message)
	history.index = strings.Replace(index, "#", "", -1)

	if err != nil {
		log.Panicf("Failed to connect to elasticsearch : %e", err)
	}

	go history.incomingLoop()

	return history
}

func (history *ElasticHistory) GetLastMessages(count int) ([]byte, error) {
	result, err := history.client.Search().
		Index(history.index).
		Type(TYPE).
		Sort("date", false).
		From(0).Size(count).
		Do()

	if err != nil {
		return nil, err
	}

	resultCnt := len(result.Hits.Hits)

	log.Printf("Fetched %d entries\n", resultCnt)

	resultSlice := make([]Message, resultCnt, resultCnt)
	var tmpMessage Message

	for i, m := range result.Each(reflect.TypeOf(tmpMessage)) {
		resultSlice[i] = m.(Message)
	}

	reverseHistory(resultSlice)

	return json.Marshal(resultSlice)
}

func reverseHistory(result []Message) {
	for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
		tmp := result[i]
		result[i] = result[j]
		result[j] = tmp
	}
}

func (history *ElasticHistory) GetChannel() chan *Message {
	return history.incomingMessages
}

func (history *ElasticHistory) incomingLoop() {
	for {
		message := <-history.incomingMessages

		_, err := history.client.Index().
			Index(history.index).
			Type(TYPE).
			BodyJson(message).
			Do()

		if err != nil {
			log.Printf("Error : %e when inserting in elasticsearch\n", err)
		}
	}
}
