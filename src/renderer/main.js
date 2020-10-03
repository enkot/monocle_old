import { ipcRenderer } from 'electron'
import Vue from 'vue'
import vClickOutside from 'v-click-outside'
import VueNumeric from 'vue-numeric'

import App from './App'
import axios from './axios'
import router from './router'
import store from './store'

import './day'
import './components'

import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED
} from 'electron-push-receiver/src/constants'

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, async(_, token) => {
  console.log('service successfully started', token)

  // clipboard.writeText(token)
  
  /* eslint-disable */
  new Notification('TOKEN', {
    body: token
  })
  // await store.dispatch('setWebhook', token)
})

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error)
})

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token)
})

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, async(_, notification) => {
  console.log('notification', notification)
  try {
    const { data } = JSON.parse(notification.data.body)

    /* eslint-disable */
    new Notification(data.statementItem.description, {
      body: data.statementItem.amount
    })
  } catch (e) {
    console.log(e)
  }
})

ipcRenderer.send(START_NOTIFICATION_SERVICE, '989266014492')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(vClickOutside)
Vue.use(VueNumeric)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
