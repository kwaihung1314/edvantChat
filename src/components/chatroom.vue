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
              <div class="message-block others-message">
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
              </div>
            </div>
          </div>
          <div class="typing-box blue lighten-4">
            <v-layout wrap>
              <v-flex xs10 class="input-box pa-3">
                <input type="text" placeholder="Enter message">
              </v-flex>
              <v-flex xs2 d-flex align-center justify-center class="send-box">
                <v-btn color="#FFB300">Send</v-btn>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import io from 'socket.io-client'
export default {
  data () {
    return {
      onlineList: [],
      messageList: [],
      socket: io('http://localhost:3000'),
      username: ''
    }
  },
  mounted () {
    this.username = this.$route.params.name
    this.socket.emit('user entered', this.username)
    this.socket.on('update users', (userList) => {
      console.log('update user')
      for (let key in userList) {
        this.onlineList.push(userList[key])
      }
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  font-family: monospace, 'Courier New', Courier;
}

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
    .message-window {
      height: 100%;
    }
  }
  .typing-box {
    border-radius: 0px 0px 8px 8px;
    .input-box {
      input{
        width: 100%;
        height: 30px;
        outline: none;
        background-color: #fff;
        border-radius: 10px;
        padding: 0 8px;
      }
    }
    .send-box {
      width: 60px;
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
  }
  .senderName {
    color: #9f9f9f;
    font-weight: 500;
    margin-bottom: 5px;
    font-size: 15px;
  }
}
</style>
