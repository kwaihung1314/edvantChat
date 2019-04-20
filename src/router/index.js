import Vue from 'vue'
import Router from 'vue-router'
import chatroom from '@/components/chatroom'
import register from '@/components/register'
import activateAndSetPassword from '@/components/activateAndSetPassword'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/chat/:name',
      name: 'chatroom',
      component: chatroom
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/activate-setpassword',
      name: 'activateAndSetPassword',
      component: activateAndSetPassword
    }
  ]
})
