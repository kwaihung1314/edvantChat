import Vue from 'vue'
import Router from 'vue-router'
import chatroom from '@/components/chatroom'
import chatName from '@/components/chatName'
import register from '@/components/register'

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
    },
    {
      path: '/register',
      name: 'register',
      component: register
    }
  ]
})
