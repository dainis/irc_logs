package server

import (
	"encoding/json"
	"errors"
	"github.com/olivere/elastic"
	"log"
	"reflect"
	"strings"
	"time"
)

const (
	TYPE string = "irc"
)

type histogramResult struct {
	Key      int64  `json:"key"`
	DocCount int64  `json:"docCount"`
	Date     string `json:"date"`
}

type termResult struct {
	Key      string `json:"key"`
	DocCount int64  `json:"docCount"`
}

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

func (history *ElasticHistory) GetMessagesBetween(from, to string) ([]byte, error) {
	rangeQuery := elastic.NewRangeQuery("date").From(from).To(to)

	result, err := history.client.Search().
		Index(history.index).
		Type(TYPE).
		Query(&rangeQuery).
		Sort("date", false).
		From(0).Size(10000). //this is cheating :(
		Do()

	if err != nil {
		return nil, err
	}

	if result.Error != "" {
		return nil, errors.New(result.Error)
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

func (history *ElasticHistory) GetDailyHistogram(from, to string) ([]byte, error) {
	dailyAggregation := elastic.NewDateHistogramAggregation().
		Field("date").
		Interval("day").
		Format("dd.MM.YYYY")

	rangeQuery := elastic.NewRangeQuery("date").From(from).To(to)

	searchResult, err := history.client.Search().
		Index(history.index).
		Type(TYPE).
		Query(rangeQuery).
		Size(0).
		Aggregation("histogram", dailyAggregation).
		Do()

	if err != nil {
		return nil, err
	}

	hist, _ := searchResult.Aggregations.Histogram("histogram")

	log.Printf("In total there are %d buckets", len(hist.Buckets))

	aggRes := make([]histogramResult, 30, 30)
	tDate := time.Now()
	tY, tM, tD := tDate.Date()

	d := time.Date(tY, tM, tD, 0, 0, 0, 0, time.UTC)

	for i := 0; i < 30; i++ { //aggregation results are for last 30days and for frontend they are prefilled
		aggRes[30-i-1] = histogramResult{Key: d.Unix(), DocCount: 0, Date: d.Format("02.01.2006")}
		d = d.Add(-24 * time.Hour)
	}

	for _, agg := range hist.Buckets {
		for i := 0; i < 30; i++ {
			if aggRes[i].Date == *agg.KeyAsString {
				aggRes[i].DocCount = agg.DocCount
				break
			}
		}
	}

	return json.Marshal(aggRes)
}

func (history *ElasticHistory) GetUserMessageCount(from, to string) ([]byte, error) {
	termAggregation := elastic.NewTermsAggregation().Field("from")
	rangeQuery := elastic.NewRangeQuery("date")

	if from != "" && to != "" {
		rangeQuery = rangeQuery.From(from).To(to)
	}

	searchResult, err := history.client.Search().
		Index(history.index).
		Type(TYPE).
		Query(rangeQuery).
		Size(0).
		Aggregation("top", termAggregation).
		Do()

	if err != nil {
		return nil, err
	}

	resultAggr, _ := searchResult.Aggregations.Terms("top")

	outputResult := make([]termResult, len(resultAggr.Buckets), len(resultAggr.Buckets))

	for i, r := range resultAggr.Buckets {
		outputResult[i] = termResult{Key: r.Key.(string), DocCount: r.DocCount}
	}

	return json.Marshal(outputResult)
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
