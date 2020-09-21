import { ipcRenderer } from 'electron'
import { ipcRenderer as betterIpc } from 'electron-better-ipc'
import Vue from 'vue'
import vClickOutside from 'v-click-outside'
import VueLoading from 'vue-loading-template'
import VueNumeric from 'vue-numeric'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED
} from 'electron-push-receiver/src/constants'
import './day'
import './components'

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('service successfully started', token)
  betterIpc.callMain('setWebhook', token)
})

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error)
})

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token)
  betterIpc.callMain('setWebhook', token)
})

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, notification) => {
  try {
    const { data } = JSON.parse(notification.data.body)

    new Notification(data.statementItem.description, {
      body: data.statementItem.amount,
      image: 'logo.png'
    })
  } catch (e) {
    console.log(e)
  }
})

ipcRenderer.send(START_NOTIFICATION_SERVICE, '989266014492')

Vue.use(vClickOutside)
Vue.use(VueLoading)
Vue.use(VueNumeric)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
