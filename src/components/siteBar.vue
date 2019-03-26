<template>
  <v-toolbar color="teal lighten-3"  absolute>
    <v-icon class="white--text">favorite_border</v-icon>
    <v-toolbar-title class="white--text">
      {{title}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-icon class="white--text">favorite</v-icon>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
