<template>
  <v-container fill-height>
    <siteBar title="Welcome to Beryl's Chat"></siteBar>
    <v-layout align-content-center justify-center wrap
      v-if="linkValid">
      <v-flex xs12>
        <div class="my-5 text-sm-center">Thank you for registering Beryl's Chatroom, your account will be activated upon you set your password below.</div>
      </v-flex>
      <v-flex xs12 sm8 md4 elevation-3>
        <v-card>
          <v-toolbar color="blue darken-1">
            <v-toolbar-title class="white--text">Set your password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Password should contain at least 8 characters with mix of numbers, lower case and upper case letters.
          </v-card-text>
          <v-form class="px-3" v-model="isValid" @submit.prevent="submitForm">
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              prepend-icon="lock"
              :rules="[rules.required, rules.atleastEightChar, rules.password]"
            ></v-text-field>
            <v-text-field
              v-model="confirm_password"
              type="password"
              label="Confirm password"
              prepend-icon="lock"
              :rules="[rules.required, rules.confirmPassword]"
            ></v-text-field>
            <v-layout row justify-center class="py-2">
              <v-btn flat color="orange darken-3" type="submit">Submit</v-btn>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center v-if="!linkValid">
      <v-card>
        <v-card-title class="headline">Opps! Something wrong..</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          The verification request was expired, please apply for a new request.
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import siteBar from './siteBar'
export default {
  data () {
    return {
      linkValid: true,
      password: '',
      confirm_password: '',
      rules: {
        required: value => !!value || 'Required.',
        atleastEightChar: value => value.length >= 8 || 'Password should contain at least 8 characters.',
        password: value => {
          let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
          return pattern.test(value) || 'Password not strong enough.'
        },
        confirmPassword: value => value === this.password || 'Password not matching.'
      },
      isValid: false,
      code: ''
    }
  },
  methods: {
    submitForm () {
      if (!this.isValid) {
        return
      }
      this.axios.post('/api/user/activate-setpassword', {
        password: this.password,
        confirm_password: this.confirm_password,
        code: this.code
      })
        .then(response => {
          alert(response.data)
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  },
  components: {
    siteBar
  },
  mounted () {
    this.code = this.$route.query.code
  },
  beforeCreate () {
    // TODO: check the code validility before showing the set password page.
    this.axios.get(`/api/user/checkCode?code=${this.$route.query.code}`)
      .catch(() => {
        this.linkValid = false
      })
  }
}
</script>
