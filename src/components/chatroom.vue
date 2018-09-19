<template>
<v-app>
  <v-container>
    <h1 class="app-header">Edvant Chatroom</h1>
    <h2 class="user-header mb-4">Your name: <span class="cyan--text">{{username}}</span></h2>
    <v-layout wrap>
      <v-flex xs12>
        <div class="teal lighten-3 online-box pa-3">
          <div class="header">Currently online</div>
          <v-chip v-for="(user, index) in onlineArr" :key="index">
            <v-avatar class="teal">{{user.name.substr(0,1).toUpperCase()}}</v-avatar>
            {{user.name}}
          </v-chip>
          <div class="typing" v-show="typingPerson">{{typingPerson}} is typing...</div>
        </div>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12>
        <group-chatbox
          ref="group"
          :socket="socket"
          :username="username"/>
      </v-flex>
    </v-layout>
    <v-layout wrap class="mt-4">
      <v-flex xs3>
        <div class="onlineSide teal lighten-3">
          <div class="header teal lighten-4 pa-2">
            <span>Private Chat</span>
          </div>
          <v-list class="teal lighten-3">
            <v-list-tile
              v-for="(user, index) in onlineArr"
              :key="index"
              avatar
              @click="selectChat(index)">
              <v-list-tile-action>
                <v-icon color="#FFB300" v-show="user.flag">priority_high</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="user.name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <v-avatar class="teal" size="40">{{user.name.substr(0,1).toUpperCase()}}</v-avatar>
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </div>
      </v-flex>
      <v-flex xs9>
        <private-chatbox
          v-for="(user, index) in onlineArr"
          :key="index"
          :ref="user.id"
          v-show="selectedChat === index"
          :socket="socket"
          :username="username"
          :boxId="user.id"
          :boxPerson="user.name"/>
        <div class="emptyChat blue lighten-4 px-3" v-show="selectedChat === null">
          <div class="statement">{{emptyChatName}} left the chatroom. Please select from the list to process other chat.</div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</v-app>
</template>

<script>
import io from 'socket.io-client'
import debounce from 'lodash.debounce'
import groupChatbox from '@/components/groupChatbox'
import privateChatbox from '@/components/privateChatbox'
export default {
  data () {
    return {
      onlineArr: [],
      socket: io('http://127.0.0.1:3000'),
      username: '',
      noticeCount: 0,
      inFocus: true,
      docTitle: 'chat_vue',
      typingPerson: null,
      // private chat index, default [0]
      selectedChat: 0,
      emptyChatName: ''
    }
  },
  components: {
    groupChatbox,
    privateChatbox
  },
  methods: {
    updateTitle () {
      if (this.inFocus) {
        document.title = this.docTitle
        this.noticeCount = 0
      } else {
        document.title = `(${this.noticeCount}) ${this.docTitle}`
      }
    },
    delayRemoveTyping: debounce(function () {
      this.typingPerson = null
    }, 500),
    selectChat (index) {
      this.selectedChat = index
      this.onlineArr[index].flag = false
    },
    showEmptyChat (name) {
      this.emptyChatName = name
      this.selectedChat = null
    }
  },
  mounted () {
    this.username = this.$route.params.name
    this.socket.on('connect', () => {
      this.socket.emit('user entered', this.username)
    })
    this.socket.on('online user', (list) => {
      for (let key in list) {
        this.onlineArr.push({
          name: list[key],
          id: key,
          flag: false
        })
      }
    })
    this.socket.on('update users', (user, msg, type) => {
      if (type === 'enter' && user.id !== this.socket.id) {
        this.onlineArr.push({
          name: user.name,
          id: user.id,
          flag: false
        })
      } else {
        for (let i = 0; i < this.onlineArr.length; i++) {
          if (this.onlineArr[i].id === user.id) {
            if (this.selectedChat === i) {
              this.showEmptyChat(this.onlineArr[i].name)
            }
            this.onlineArr.splice(i, 1)
            break
          }
        }
      }
      this.$refs['group'].pushMessage({
        content: msg,
        userId: '',
        username: '',
        type: type
      })
    })
    this.socket.on('new group message', (message) => {
      this.$refs['group'].pushMessage({
        content: message.content,
        userId: message.userId,
        username: message.username,
        type: 'newMsg',
        time: message.time
      })
      this.noticeCount++
      this.updateTitle()
    })
    this.socket.on('whos typing', (user) => {
      this.typingPerson = user
      this.delayRemoveTyping()
    })
    this.socket.on('new group image', (message, buffer) => {
      let file = new Blob([buffer])
      let fileObj = {
        content: '',
        image: window.URL.createObjectURL(file),
        userId: message.userId,
        username: message.username,
        type: 'newMsg',
        time: message.time
      }
      this.$refs['group'].pushImage(fileObj)
      this.noticeCount++
      this.updateTitle()
    })
    // event of ppl sent you private msg
    this.socket.on('new private message', (message) => {
      this.$refs[(message.fromId)][0].pushMessage({
        content: message.content,
        userId: message.fromId,
        type: 'newMsg',
        time: message.time
      })
      for (let i = 0; i < this.onlineArr.length; i++) {
        if (this.onlineArr[i].id === message.fromId) {
          if (this.selectedChat !== i) {
            this.onlineArr[i].flag = true
          }
          break
        }
      }
      this.noticeCount++
      this.updateTitle()
    })
    // event of you private msg other ppl
    this.socket.on('my private message', (message) => {
      this.$refs[(message.toId)][0].pushMessage({
        content: message.content,
        userId: message.fromId,
        type: 'newMsg',
        time: message.time
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
    let self = this
    setInterval(() => {
      self.socket.emit('ping')
      console.log('emit ping')
    }, 10000)
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

.onlineSide {
  height: 100%;
  border-radius: 8px 0px 0px 8px;
  overflow-y: auto;
  .header {
    border-radius: 8px 0px 0px 0px;
    span {
      font-size: 15px;
    }
  }
}

.emptyChat {
  height: 566px;
  border-radius: 0px 8px 8px 0px;
  visibility: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  .statement {
    text-align: center;
  }
}
</style>
