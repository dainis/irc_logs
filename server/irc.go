package server

import (
	"github.com/thoj/go-ircevent"
	"log"
	"time"
)

type IrcHandler struct {
	ircBot         *irc.Connection
	channel        string
	botName        string
	user           string
	server         string
	pushChannels   []chan *Message
	naughtyChannel chan string
}

func NewIrcHandler(server, channel, botName, user string) *IrcHandler {
	handler := new(IrcHandler)

	handler.botName = botName
	handler.channel = channel
	handler.server = server
	handler.user = user
	handler.naughtyChannel = make(chan string)

	go handler.naugthyHandler()

	handler.initBot()

	return handler
}

func (handler *IrcHandler) Verbose(verbose bool) {
	handler.ircBot.Debug = verbose
}

func (handler *IrcHandler) initBot() {
	handler.ircBot = irc.IRC(handler.botName, handler.user)

	handler.ircBot.AddCallback("001", func(event *irc.Event) {
		handler.ircBot.Join(handler.channel)
	})

	handler.ircBot.AddCallback("PRIVMSG", func(e *irc.Event) {
		if len(e.Arguments) == 0 {
			log.Println("Got weird message")
			return
		}

		if e.Arguments[0] != handler.channel {
			go func() {
				log.Println("%s is a naughty boy", e.Nick)
				handler.naughtyChannel <- e.Nick
			}()

			return
		}

		message := NewChatMessage(e.Nick, e.Message())

		for i := 0; i < len(handler.pushChannels); i++ {
			go func(i int) {
				handler.pushChannels[i] <- message
			}(i)
		}
	})

	//@TODO handle disconnect
}

func (handler *IrcHandler) naugthyHandler() {
	for {
		naughty := <-handler.naughtyChannel
		handler.ircBot.Noticef(handler.channel, "%s is a naughty naughty boy", naughty)
		time.Sleep(1 * time.Second)
	}
}

func (handler *IrcHandler) AddSubscriber(channel chan *Message) {
	handler.pushChannels = append(handler.pushChannels, channel)
}

func (handler *IrcHandler) Connect() error {
	err := handler.ircBot.Connect(handler.server)
	if err != nil {
		return err
	}

	go handler.ircBot.Loop()

	return nil
}
