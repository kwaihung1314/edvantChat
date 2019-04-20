<template>
  <v-container fill-height>
    <siteBar title="Welcome to Beryl's Chat"></siteBar>
    <v-layout align-content-center justify-center wrap>
      <v-flex xs12 class="my-5">
        <v-alert
          v-model="alertFail"
          type="error"
          icon="warning"
          dismissible
          outline>
          {{failMsg}}
        </v-alert>
      </v-flex>
      <v-flex xs12 sm8 md4 elevation-3>
        <v-card>
          <v-toolbar color="blue darken-1">
            <v-toolbar-title class="white--text">Login</v-toolbar-title>
          </v-toolbar>
          <v-form class="px-3 pt-3" v-model="isValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-icon="face"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              prepend-icon="lock"
              :rules="[rules.required]"
              type="password"
            ></v-text-field>
            <v-card-text class="py-0"><a @click.prevent="$router.push({name: 'register'})">Register now!</a></v-card-text>
            <v-layout row justify-center class="py-2">
              <v-btn flat color="orange darken-3" type="submit">Submit</v-btn>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import siteBar from './siteBar'
import jwt from 'jsonwebtoken'

export default {
  data () {
    return {
      username: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.'
      },
      isValid: false,
      alertFail: false,
      failMsg: ''
    }
  },
  methods: {
    submitForm () {
      this.alertFail = false
      if (!this.isValid) {
        return
      }
      this.axios.post('/api/user/login', {
        username: this.username,
        password: this.password
      })
        .then(response => {
          // console.log(response.data)
          localStorage.setItem('token', response.data.token)
          window.location.replace('/main.html')
        })
        .catch(err => {
          this.failMsg = ''
          if (err.response.status === 403) {
            this.failMsg = err.response.data
          }
          if (err.response.status === 401) {
            this.failMsg = 'User unauthorized'
          }
          this.alertFail = true
        })
    },
    checkTokenExist () {
      if (localStorage.token) {
        let user = jwt.decode(localStorage.token)
        if (user.exp > (Date.now() / 1000)) {
          window.location.replace('/main.html')
        }
      }
    }
  },
  components: {
    siteBar
  },
  beforeMount () {
    this.checkTokenExist()
  }
}
</script>
