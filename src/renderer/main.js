import Vue from 'vue'
import vClickOutside from 'v-click-outside'
import VueNumeric from 'vue-numeric'

import { ipcRenderer, clipboard } from 'electron'
import Not from 'node-mac-notifier'

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

// const appId = 'electron-windows-notifications'
// const {ToastNotification, Template} = require('electron-windows-notifications')

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, async(_, token) => {
  console.log('service successfully started', token)
  // betterIpc.callMain('setWebhook', token)
  clipboard.writeText(token)
  /* eslint-disable */
  new Not('TOKEN', {
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
  // betterIpc.callMain('setWebhook', token)
})

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, notification) => {
  console.log('notification', notification)
  try {
    const { data } = JSON.parse(notification.data.body)

    /* eslint-disable */
    new Not(data.statementItem.description, {
      body: data.statementItem.amount
    })
    // const template = new Template({
    //   templateText: '<text>%s</text>'
    // })
    // const notification = new ToastNotification({
    //   appId: appId,
    //   template: template.getXML(),
    //   strings: [data.statementItem.description]
    // })
  
    // notification.show()
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
