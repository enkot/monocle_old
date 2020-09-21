import Store from 'electron-store'
import axios from './axios'
import { ipcMain } from 'electron-better-ipc'

const store = new Store()

if (ipcMain !== undefined)
  ipcMain.addListener(
    'fix-event-798e09ad-0ec6-5877-a214-d552934468ff',
    () => {}
  )

ipcMain.answerRenderer('getToken', getToken)
ipcMain.answerRenderer('getUser', getUser)
ipcMain.answerRenderer('removeUser', removeUser)
ipcMain.answerRenderer('getStatement', getStatement)
ipcMain.answerRenderer('getCurrency', getCurrency)
ipcMain.answerRenderer('setWebhook', setWebhook)

async function getToken() {
  return store.get('monocleToken')
}

async function fetchUser() {
  return await axios.get('/personal/client-info')
}

async function setWebhook(token) {
  try {
    return await axios.post('/personal/webhook', {
      webHookUrl: `https://us-central1-monocle-7ae4c.cloudfunctions.net/api/events?token=${token}`
    })
  } catch (error) {
    return { error: error.response }
  }
}

const throttledFetchUser = throttle(fetchUser, 60 * 1000)

async function getUser(token) {
  try {
    const monocleToken = token || store.get('monocleToken')

    axios.defaults.headers.common['X-Token'] = monocleToken

    const monocleUser = (await throttledFetchUser()) || store.get('monocleUser')

    store.set({ monocleToken, monocleUser })

    return { data: monocleUser }
  } catch (error) {
    return { error: error.response }
  }
}

async function removeUser() {
  try {
    store.delete('monocleToken')
    store.delete('monocleUser')
    return { data: true }
  } catch (error) {
    return { data: false }
  }
}

async function fetchStatement(account, from, to) {
  return await axios.get(`/personal/statement/${account}/${from}/${to}`)
}

const throttledFetchStatement = throttle(fetchStatement, 60 * 1000)

async function getStatement(account) {
  const to = Math.round(new Date().getTime() / 1000)
  const from = Math.round(to - 30 * 24 * 60 * 60)
  let data = store.get(`statement_${account}`)
  try {
    const response = await throttledFetchStatement(account, from, to)
    if (response) {
      data = response
      store.set({ [`statement_${account}`]: data })
    }
    return { data }
  } catch (error) {
    return { data, error: error.response.data }
  }
}

async function fetchCurrency() {
  return await axios.get(`/bank/currency`)
}

const throttledFetchCurrency = throttle(fetchCurrency, 60 * 1000)

async function getCurrency() {
  let data = store.get(`currency`)

  try {
    const response = await throttledFetchCurrency()
    if (response) {
      data = response
      store.set({ currency: data })
    }
    return { data }
  } catch (error) {
    return { data, error: error.response.data }
  }
}

function throttle(func, limit) {
  let inThrottle

  return function(...args) {
    const context = this

    if (!inThrottle) {
      return func.apply(context, args).catch(error => {
        if (error.response.status === 429) {
          inThrottle = true
          setTimeout(() => {
            inThrottle = false
          }, limit)
        }
      })
    }
  }
}
