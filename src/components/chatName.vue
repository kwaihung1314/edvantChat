<template>
  <v-container grid-list-md>
    <h1 class="app-header mb-3">Edvant Chat</h1>
    <div class="instruction mb-3">Please enter your name</div>
    <input class="mb-3" type="text" v-model="username" @keyup.enter="enterChat">
    <v-btn color="#FFB300" @click="enterChat">chat</v-btn>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      username: ''
    }
  },
  methods: {
    enterChat () {
      this.$router.push({path: `/chat/${this.username}`})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

input {
  border: 1px solid #888;
  border-radius: 2px;
  height: 30px;
}
</style>
