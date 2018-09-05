import Vue from 'vue'
import Router from 'vue-router'
import chatroom from '@/components/chatroom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'chatroom',
      component: chatroom
    }
  ]
})
