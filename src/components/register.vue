<template>
  <v-container fill-height>
    <siteBar title="Welcome to Beryl's Chat"></siteBar>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 elevation-3>
        <v-card>
          <v-toolbar color="blue darken-1">
            <v-toolbar-title class="white--text">Register</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Please provide username &amp; email for registration.
          </v-card-text>
          <v-form class="px-3" v-model="isValid">
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
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="orange darken-3"
              @click="submitForm">
              Submit
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import siteBar from './siteBar'

export default {
  data() {
    return {
      username: '',
      email: '',
      rules: {
        required: value => !!value || 'Required.',
        lessThanTwentyChar: value => value.length <= 20 || 'no more than 20 characters.',
        email: value => {
          let pattern = /^.+@[^\.].*\.[a-z]{2,}$/;
          return pattern.test(value) || 'Invalid email.'
        }
      },
      isValid: false
    }
  },
  methods:{
    submitForm() {
      if (!this.isValid) {
        return;
      }
      this.axios.post('/api/user/register', {
        username: this.username,
        email: this.email
      })
        .then(response => {
          alert(response.data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  components: {
    siteBar
  }
}
</script>
