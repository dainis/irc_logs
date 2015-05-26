package server

import (
	"code.google.com/p/go-uuid/uuid"
	"encoding/json"
	"time"
)

type Message struct {
	ID      string    `json:"id"`
	From    string    `json:"from"`
	Type    string    `json:"type"`
	Date    time.Time `json:"date"`
	Message string    `json:"message"`
}

func NewChatMessage(from, message string) *Message {
	m := new(Message)

	m.ID = uuid.New()
	m.From = from
	m.Type = "CHAT_MESSAGE"
	m.Message = message
	m.Date = time.Now()

	return m
}

func (m *Message) Id() string {
	return m.ID
}

func (m *Message) Data() string {
	b, _ := json.Marshal(m)
	return string(b)
}

func (m *Message) Event() string {
	return "message"
}
