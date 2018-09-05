import Vue from 'vue'
import Router from 'vue-router'
import chatroom from '@/components/chatroom'
import chatName from '@/components/chatName'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chat/:name',
      name: 'chatroom',
      component: chatroom
    },
    {
      path: '/',
      name: 'chatName',
      component: chatName
    }
  ]
})
