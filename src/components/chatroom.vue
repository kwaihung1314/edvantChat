<template>
  <v-container grid-list-md>
    <h1 class="app-header">Edvant Chatroom</h1>
    <h2 class="user-header mb-4">Your name: <span class="cyan--text">{{username}}</span></h2>
    <v-layout wrap>
      <v-flex xs12>
        <div class="teal lighten-3 online-box pa-3">
          <div class="header">Currently online</div>
          <v-chip v-for="(user, index) in onlineList" :key="index">
            <v-avatar class="teal">{{user.substr(0,1)}}</v-avatar>
            {{user}}
          </v-chip>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="chat-box mt-4">
          <div class="message-box pa-4 blue lighten-3">
            <div class="message-window">
              <div v-for="(message, index) in messageList"
                :key="index"
                class="message-block mb-2"
                :class="{'others-message': socket.id !== message.userId}">
                <div class="message">
                  <div class="senderName">{{message.username}}</div><div class="text" v-html="message.content.replace(/\n/g, '<br/>')"></div>
                </div>
              </div>
              <!-- <div class="message-block others-message">
                <div class="message">
                  <div class="senderName">Tony</div>
                  <div class="text">Hello There! Hello There! Hello There! Hello There! Hello There! Hello There! Hello There!</div>
                </div>
              </div>
              <div class="message-block">
                <div class="message">
                  <div class="senderName">Tony</div>
                  <div class="text">Hello There!</div>
                </div>
              </div> -->
            </div>
          </div>
          <div class="typing-box blue lighten-4">
            <form action="" @submit.prevent="sendMessage">
              <v-layout wrap>
                <v-flex xs10 class="input-box pa-3">
                  <!-- <input type="text" placeholder="Enter message" v-model="messageInput"> -->
                  <textarea placeholder="Enter message" v-model="messageInput" @keydown="textareaKeyDown" @keyup="textareaKeyUp"
                    @change="sendTyping"></textarea>
                </v-flex>
                <v-flex xs2 align-center justify-center class="send-box">
                  <v-btn color="#FFB300" type="submit">Send</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import io from 'socket.io-client'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      onlineList: [],
      messageList: [],
      socket: io('http://10.0.1.7:3000'),
      username: '',
      messageInput: '',
      noticeCount: 0,
      inFocus: true,
      docTitle: 'chat_vue',
      textKey: {
        16: false,
        13: false
      }
    }
  },
  methods: {
    sendMessage () {
      this.socket.emit('message', {
        userId: this.socket.id,
        username: this.username,
        content: this.messageInput
      })
      this.messageInput = ''
    },
    sendTyping () {
      this.socket.emit('typing')
    },
    updateTitle () {
      if (this.inFocus) {
        document.title = this.docTitle
      } else {
        document.title = `(${this.noticeCount})${this.docTitle}`
      }
    },
    textareaKeyDown (e) {
      e = e || event
      if (e.keyCode in this.textKey) {
        this.textKey[e.keyCode] = true
        if (this.textKey['16'] && this.textKey['13']) {
          return
        }
        if (this.textKey['13']) {
          e.preventDefault()
          if (this.messageInput) {
            this.sendMessage()
          }
        }
      }
    },
    textareaKeyUp (e) {
      e = e || event
      if (e.keyCode in this.textKey) {
        this.textKey[e.keyCode] = false
      }
    }
  },
  mounted () {
    this.username = this.$route.params.name
    this.socket.on('connect', () => {
      this.socket.emit('user entered', this.username)
    })
    this.socket.on('update users', (userList) => {
      console.log('update user')
      this.onlineList = []
      for (let key in userList) {
        this.onlineList.push(userList[key])
      }
    })
    this.socket.on('new message', (message) => {
      this.messageList.push(message)
      this.$nextTick(() => {
        let messageBox = document.querySelector('.message-box')
        messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight
      })
      this.noticeCount++
      this.updateTitle()
    })
    window.onfocus = () => {
      this.noticeCount = 0
      this.inFocus = true
      this.updateTitle()
    }
    window.onblur = () => {
      this.inFocus = false
    }
  },
  beforeDestroy () {
    this.socket.close()
  }
}
</script>

<style scoped lang="scss">
.app-header, .user-header {
  text-align: center;
}

.online-box {
  border-radius: 8px;
  .header {
    margin-bottom: 10px;
  }
}

.chat-box {
  border-radius: 8px;
  .message-box {
    border-radius: 8px 8px 0px 0px;
    height: 450px;
    overflow-y: auto;
    .message-window {
      height: 100%;
    }
    &::-webkit-scrollbar {
      width: 5px;
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #e1e1e1;
    }
    &::-webkit-scrollbar-thumb {
      background: #afafaf;
      border-radius: 1.5px;
    }
  }
  .typing-box {
    border-radius: 0px 0px 8px 8px;
    .input-box {
      textarea{
        width: 100%;
        height: 40px;
        outline: none;
        background-color: #fff;
        border-radius: 10px;
        padding: 8px;
      }
    }
    .send-box {
      width: 60px;
      display: flex;
    }
  }
}

.message-window {
  .message-block {
    display: flex;
    justify-content: flex-end;
  }
  .others-message {
    justify-content: flex-start;
  }
  .message {
    border-radius: 5px;
    background-color: #fff;
    padding: 5px;
    max-width: 250px;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .senderName {
    color: #9f9f9f;
    font-weight: 500;
    font-size: 15px;
  }
}
</style>
