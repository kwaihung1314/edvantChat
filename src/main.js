import Vue from 'vue'
import chatroom from '@/components/chatroom'
import Vuetify from 'vuetify'
import VueAxios from 'vue-axios'
import axios from './services/axios'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import linkify from 'vue-linkify'

Vue.directive('linkified', linkify)

Vue.use(Vuetify)

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: (h) => h(chatroom)
})
