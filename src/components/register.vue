<template>
  <v-container fill-height>
    <siteBar title="Welcome to Beryl's Chat"></siteBar>
    <v-layout align-content-center justify-center wrap>
      <v-flex xs12 class="my-5">
        <v-alert
          :value="alertSuccess"
          type="success"
          icon="check_circle"
          dismissible
          outline>
          {{successMsg}}
        </v-alert>
        <v-alert
          :value="alertFail"
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
            <v-toolbar-title class="white--text">Register</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Please provide username &amp; email for registration.
          </v-card-text>
          <v-form class="px-3" v-model="isValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-icon="face"
              :rules="[rules.required, rules.lessThanTwentyChar]"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              prepend-icon="mail_outline"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
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

export default {
  data () {
    return {
      username: '',
      email: '',
      rules: {
        required: value => !!value || 'Required.',
        lessThanTwentyChar: value => value.length <= 20 || 'no more than 20 characters.',
        email: value => {
          let pattern = /^.+@[^.].*\.[a-z]{2,}$/
          return pattern.test(value) || 'Invalid email.'
        }
      },
      isValid: false,
      alertSuccess: false,
      alertFail: false,
      successMsg: 'Verification email sent to the registering email.',
      failMsg: ''
    }
  },
  methods: {
    submitForm () {
      this.alertFail = this.alertSuccess = false
      if (!this.isValid) {
        return
      }
      this.axios.post('/api/user/register', {
        username: this.username,
        email: this.email
      })
        .then(response => {
          this.alertSuccess = true
        })
        .catch(err => {
          this.failMsg = ''
          for (const key in err.response.data) {
            this.failMsg += ' ' + err.response.data[key]
          }
          this.alertFail = true
        })
    }
  },
  components: {
    siteBar
  }
}
</script>
