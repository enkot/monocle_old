import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

import axios from '../axios'
import { throttle } from '../../utils'
import createPromiseAction from './promise-action'

Vue.use(Vuex)

async function fetchUser() {
  return axios.get('/personal/client-info')
}

async function fetchStatement(account, from, to) {
  return axios.get(`/personal/statement/${account}/${from}/${to}`)
}

async function fetchCurrency() {
  return axios.get(`/bank/currency`)
}

const throttledFetchUser = throttle(fetchUser, 60 * 1000)
const throttledFetchStatement = throttle(fetchStatement, 60 * 1000)
const throttledFetchCurrency = throttle(fetchCurrency, 60 * 1000)

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    statements: {},
    currency: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUser(state, user) {
      state.user = user
    },
    setStatement(state, { account, statement }) {
      if (account) Vue.set(state.statements, account, statement)
      else state.statements = {}
    },
    setCurrency(state, currency) {
      state.currency = currency
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user
    }
  },
  actions: {
    async setWebhook(_, token) {
      try {
        const res = await axios.post('/personal/webhook', {
          webHookUrl: `https://us-central1-monocle-7ae4c.cloudfunctions.net/api/events?token=${token}`
        })
        console.log('webhook', res)
      } catch (error) {
        return { error: error.response }
      }
    },
    async getUser({ commit, state }, token) {
      try {
        const monocleToken = token || state.token

        axios.defaults.headers.common['X-Token'] = monocleToken

        const monocleUser = (await throttledFetchUser()) || state.user

        console.log('monocleUser', monocleUser)

        commit('setToken', monocleToken)
        commit('setUser', monocleUser)
      } catch (error) {
        throw Error(error.response.data.errorDescription)
      }
    },
    async getStatement({ commit, state }, account) {
      const to = Math.round(new Date().getTime() / 1000)
      const from = Math.round(to - 30 * 24 * 60 * 60)
      let statement = state.statements[account]

      try {
        const response = await throttledFetchStatement(account, from, to)

        if (response) {
          statement = response
          commit('setStatement', { account, statement })
        }
      } catch (error) {
        throw Error(error.response.data.errorDescription)
      }
    },
    async getCurrency({ commit, state }) {
      let currency = state.currency

      try {
        const response = await throttledFetchCurrency()
        if (response) {
          currency = response
          commit('setCurrency', currency)
        }
      } catch (error) {
        throw Error(error.response.data.errorDescription)
      }
    },
    async removeUser({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
    }
  },
  plugins: [
    createPersistedState(),
    createSharedMutations(),
    createPromiseAction()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
