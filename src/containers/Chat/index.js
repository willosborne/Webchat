import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getLastMessageId } from 'selectors/messages'
import { postMessage, pollMessages } from 'actions/messages'

import Header from 'components/Header'
import Live from 'components/Live'
import Input from 'components/Input'

import './style.scss'

@connect(
  state => ({
    token: state.conversation.token,
    chatId: state.conversation.chatId,
    channelId: state.conversation.channelId,
    conversationId: state.conversation.conversationId,
    lastMessageId: getLastMessageId(state),
    messages: state.messages,
  }),
  {
    postMessage,
    pollMessages,
  },
)
class Chat extends Component {
  state = {
    isPolling: false,
  }

  componentDidMount() {
    this.doMessagesPolling()
  }

  sendMessage = attachment => {
    const { token, channelId, chatId } = this.props
    const payload = { message: { attachment }, chatId }

    this.props.postMessage(channelId, token, payload).then(() => {
      if (!this.state.isPolling) {
        this.doMessagesPolling()
      }
    })
  }

  doMessagesPolling = async () => {
    this.setState({ isPolling: true })
    const { token, channelId, conversationId } = this.props
    let shouldPoll = true
    let index = 0

    do {
      const { lastMessageId } = this.props

      try {
        const { waitTime } = await this.props.pollMessages(
          channelId,
          token,
          conversationId,
          lastMessageId,
        )
        shouldPoll = waitTime === 0
      } catch (err) {
        shouldPoll = false
      }
      index++

      if (!shouldPoll && index < 4) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } while (shouldPoll || index < 4)

    this.setState({ isPolling: false })
  }

  render() {
    const { closeWebchat, messages, preferences } = this.props

    return (
      <div className="RecastAppChat">
        <Header closeWebchat={closeWebchat} preferences={preferences} />

        <Live messages={messages} preferences={preferences} sendMessage={this.sendMessage} />
        <div
          className="RecastAppLive--slogan"
          style={{ backgroundColor: preferences.backgroundColor }}
        >
          {'We run with Recast.AI'}
        </div>
        <Input onSubmit={this.sendMessage} />
      </div>
    )
  }
}

Chat.propTypes = {
  postMessage: PropTypes.func,
  closeWebchat: PropTypes.func,
  pollMessages: PropTypes.func,
  chatId: PropTypes.string,
  channelId: PropTypes.string,
  lastMessageId: PropTypes.string,
  conversationId: PropTypes.string,
  messages: PropTypes.array,
  preferences: PropTypes.object,
}

export default Chat
