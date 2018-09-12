<template>
<v-app>
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
          <div class="typing" v-show="typingPerson">{{typingPerson}} is typing...</div>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="chat-box mt-4">
          <div class="message-box pa-4 blue lighten-3">
            <div class="message-window">
              <div v-for="(message, index) in messageList"
                :key="index">
                <div class="message-block mb-2"
                  v-if="message.type === 'newMsg'"
                  :class="{'others-message': socket.id !== message.userId}">
                  <div class="message">
                    <div class="senderName">{{message.username}}</div><div class="text" v-html="message.content.replace(/\n/g, '<br/>')"></div>
                    <img v-if="message.image" :src="message.image">
                    <div class="time">{{message.time}}</div>
                  </div>
                </div>
                <div class="enterLeftMsg-block mb-2"
                  v-if="message.type === 'Enter/Left'">
                  <div class="message">{{message.content}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="typing-box blue lighten-4">
            <form action="" @submit.prevent="sendMessage">
              <v-layout wrap>
                <v-flex xs8 sm9 md10 class="input-box pa-3">
                  <textarea placeholder="Enter message" v-model="messageInput" @keydown="textareaKeyDown" @keyup="textareaKeyUp"
                    @input="sendTyping"></textarea>
                </v-flex>
                <v-flex xs4 sm3 md2 align-center justify-center class="send-box">
                  <input type="file" id="imageInput" accept="image/*" v-show="false" @input="viewSendImage($event)">
                  <v-btn fab light small color="#E53935" @click="triggerImage">
                    <v-icon color="#ffffff" size="20">photo_library</v-icon>
                  </v-btn>
                  <v-btn color="#FFB300" type="submit">Send</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="openImageModel"
      max-width="500"
      @input="v => v || clearImageModel()">
      <div class="content">
        <img :src="imageSelected.url">
        <v-divider></v-divider>
        <div class="action">
          <v-btn color="#FFB300" @click="sendImage">Send</v-btn>
        </div>
      </div>
    </v-dialog>
  </v-container>
</v-app>
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
      },
      typingPerson: null,
      EnterLeftMsg: '',
      imageSelected: {
        file: '',
        url: ''
      },
      openImageModel: false
    }
  },
  methods: {
    sendMessage () {
      let msgTime = new Date()
      this.socket.emit('message', {
        userId: this.socket.id,
        username: this.username,
        content: this.messageInput,
        time: `${msgTime.getHours().toString().length > 1 ? msgTime.getHours() : ('0' + msgTime.getHours())}:${msgTime.getMinutes().toString().length > 1 ? msgTime.getMinutes() : ('0' + msgTime.getMinutes())}`
      })
      this.messageInput = ''
    },
    sendTyping () {
      this.socket.emit('typing', this.username)
    },
    updateTitle () {
      if (this.inFocus) {
        document.title = this.docTitle
      } else {
        document.title = `(${this.noticeCount})${this.docTitle}`
      }
    },
    delayRemoveTyping: debounce(function () {
      this.typingPerson = null
    }, 500),
    delayRemoveOnline: debounce(function () {
      this.EnterLeftMsg = ''
    }, 1000),
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
    },
    autoscroll () {
      let messageBox = document.querySelector('.message-box')
      messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight
    },
    viewSendImage (e) {
      e = e || event
      this.imageSelected.file = e.target.files[0]
      this.imageSelected.url = window.URL.createObjectURL(e.target.files[0])
      this.openImageModel = true
      document.getElementById('imageInput').value = ''
    },
    triggerImage () {
      document.getElementById('imageInput').click()
    },
    clearImageModel () {
      this.openImageModel = false
      window.URL.revokeObjectURL(this.imageSelected.url)
      this.imageSelected.url = ''
      this.imageSelected.file = ''
    },
    sendImage () {
      let msgTime = new Date()
      this.socket.emit('image', {
        userId: this.socket.id,
        username: this.username,
        time: `${msgTime.getHours().toString().length > 1 ? msgTime.getHours() : ('0' + msgTime.getHours())}:${msgTime.getMinutes().toString().length > 1 ? msgTime.getMinutes() : ('0' + msgTime.getMinutes())}`
      }, this.imageSelected.file)
      this.clearImageModel()
    }
  },
  mounted () {
    this.username = this.$route.params.name
    this.socket.on('connect', () => {
      this.socket.emit('user entered', this.username)
    })
    this.socket.on('update users', (userList, msg) => {
      this.onlineList = []
      for (let key in userList) {
        this.onlineList.push(userList[key])
      }
      this.messageList.push({
        content: msg,
        userId: '',
        username: '',
        type: 'Enter/Left'
      })
      this.$nextTick(() => {
        this.autoscroll()
      })
    })
    this.socket.on('new message', (message) => {
      this.messageList.push({
        content: message.content,
        userId: message.userId,
        username: message.username,
        type: 'newMsg',
        time: message.time
      })
      this.$nextTick(() => {
        this.autoscroll()
      })
      this.noticeCount++
      this.updateTitle()
    })
    this.socket.on('whos typing', (user) => {
      this.typingPerson = user
      this.delayRemoveTyping()
    })
    this.socket.on('new image', (message, buffer) => {
      let file = new Blob([buffer])
      this.messageList.push({
        content: '',
        image: window.URL.createObjectURL(file),
        userId: message.userId,
        username: message.username,
        type: 'newMsg',
        time: message.time
      })
      this.$nextTick(() => {
        this.autoscroll()
      })
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
  position: relative;
  .header {
    margin-bottom: 10px;
  }
  .typing {
    position: absolute;
    left: 10px;
    bottom: -24px;
    font-size: 14px;
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
    .message {
      border-radius: 5px;
      background-color: #fff;
      padding: 5px;
      max-width: 250px;
      word-break: break-all;
      white-space: pre-wrap;
      img {
        width: 100%;
      }
      .time {
        float: right;
        font-size: 10px;
        color: #9f9f9f;
        margin-top: 5px;
      }
    }
  }
  .enterLeftMsg-block {
    display: flex;
    justify-content: center;
    .message {
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.1);
      color: #888;
      padding: 5px;
    }
  }
  .others-message {
    justify-content: flex-start;
  }
  .senderName {
    color: #9f9f9f;
    font-weight: 500;
    font-size: 15px;
  }
}

.v-dialog {
  .content {
    background-color: #fafafa;
    padding: 10px;
    img {
      width: 480px;
      margin-bottom: 10px;
    }
    .action {
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>
