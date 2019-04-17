<template>
  <v-container fill-height>
    <siteBar title="Welcome to Beryl's Chat"></siteBar>
    <v-layout align-content-center justify-center wrap>
      <v-flex xs12 class="my-5">
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
            <v-toolbar-title class="white--text">Login</v-toolbar-title>
          </v-toolbar>
          <v-form class="px-3" v-model="isValid" @submit.prevent="submitForm">
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
      alert('hihi')
      // this.axios.post('/api/user/login', {
      //   username: this.username,
      //   password: this.email
      // })
      //   .then(response => {
      //     this.alertSuccess = true;
      //   })
      //   .catch(err => {
      //     this.failMsg = '';
      //     for (const key in err.response.data) {
      //       this.failMsg += ' ' + err.response.data[key];
      //     }
      //     this.alertFail = true;
      //   })
    }
  },
  components: {
    siteBar
  }
}
</script>
