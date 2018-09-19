<template>
  <div class="chat-box mt-4">
    <div class="box-person blue lighten-4 pa-2">
      <span>{{boxPerson}}</span>
    </div>
    <div class="message-box pa-4 blue lighten-3">
      <div class="message-window">
        <div v-for="(message, index) in messageList"
          :key="index">
          <div class="message-block mb-2"
            v-if="message.type === 'newMsg'"
            :class="{'others-message': socket.id !== message.userId}">
            <div class="message">
              <div class="senderName">{{message.username}}</div><div class="text" v-html="message.content.replace(/\n/g, '<br/>')"></div>
              <img :id="message.image"
                v-if="message.image"
                :src="message.image">
              <div class="time">{{message.time}}</div>
            </div>
          </div>
          <div class="enterLeftMsg-block mb-2"
            v-if="message.type === 'enter' || message.type === 'left'">
            <div class="message"
              :class="{enter: message.type === 'enter'}">{{message.content}}</div>
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
            <input type="file" id="imageInput" accept="image/*" v-show="false" @change="viewSendImage($event)">
            <v-btn fab light small color="#E53935" @click="triggerImage">
              <v-icon color="#ffffff" size="20">photo_library</v-icon>
            </v-btn>
            <v-btn color="#FFB300" type="submit">Send</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </div>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      messageList: [],
      messageInput: '',
      textKey: {
        16: false,
        13: false
      },
      imageSelected: {
        file: '',
        url: ''
      },
      openImageModel: false,
      boxPerson: 'Group Chat'
    }
  },
  props: ['socket', 'username'],
  methods: {
    sendMessage () {
      let msgTime = new Date()
      this.socket.emit('group message', {
        userId: this.socket.id,
        username: this.username,
        content: this.messageInput,
        time: `${msgTime.getHours().toString().length > 1 ? msgTime.getHours() : ('0' + msgTime.getHours())}:${msgTime.getMinutes().toString().length > 1 ? msgTime.getMinutes() : ('0' + msgTime.getMinutes())}`
      })
      this.messageInput = ''
    },
    pushMessage (msgObj) {
      this.messageList.push(msgObj)
      this.$nextTick(() => {
        this.autoscroll()
      })
    },
    sendImage () {
      let msgTime = new Date()
      this.socket.emit('group image', {
        userId: this.socket.id,
        username: this.username,
        time: `${msgTime.getHours().toString().length > 1 ? msgTime.getHours() : ('0' + msgTime.getHours())}:${msgTime.getMinutes().toString().length > 1 ? msgTime.getMinutes() : ('0' + msgTime.getMinutes())}`
      }, this.imageSelected.file)
      this.clearImageModel()
    },
    pushImage (fileObj) {
      this.messageList.push(fileObj)
      this.$nextTick(() => {
        document.getElementById(fileObj.image).onload = this.autoscroll
      })
    },
    sendTyping () {
      this.socket.emit('typing', this.username)
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
    },
    autoscroll () {
      let messageBox = this.$el.querySelector('.message-box')
      messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight
    },
    viewSendImage (e) {
      e = e || event
      this.imageSelected.file = e.target.files[0]
      this.imageSelected.url = window.URL.createObjectURL(e.target.files[0])
      this.openImageModel = true
      this.$el.querySelector('#imageInput').value = ''
    },
    triggerImage () {
      this.$el.querySelector('#imageInput').click()
    },
    clearImageModel () {
      this.openImageModel = false
      window.URL.revokeObjectURL(this.imageSelected.url)
      this.imageSelected.url = ''
      this.imageSelected.file = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-box {
  border-radius: 8px;
  .box-person {
    border-radius: 8px 8px 0px 0px;
    span {
      font-size: 15px;
    }
  }
  .message-box {
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
      &.enter {
        background-color: rgba(247, 201, 64, 0.3)
      }
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
