import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron-better-ipc'

Vue.use(Vuex)

if (ipcRenderer !== undefined)
  ipcRenderer.addListener(
    'fix-event-79558e00-29ef-5c7f-84bd-0bcd9a0c5cf3',
    () => {}
  )

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
      Vue.set(state.statements, account, statement)
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
    async getToken({ commit }) {
      const token = await ipcRenderer.callMain('getToken')

      commit('setToken', token)
    },
    async getUser({ commit }, token) {
      const { data: user, error } = await ipcRenderer.callMain('getUser', token)

      if (error) throw Error(error.errorDescription)

      commit('setUser', user)
    },
    async getStatement({ commit }, account) {
      const { data: statement, error } = await ipcRenderer.callMain(
        'getStatement',
        account
      )

      if (error) throw Error(error.errorDescription)

      commit('setStatement', { account, statement })
    },
    async getCurrency({ commit }) {
      const { data: currency, error } = await ipcRenderer.callMain(
        'getCurrency'
      )

      if (error) throw Error(error.errorDescription)

      commit('setCurrency', currency)
    },
    async removeUser({ commit }) {
      const { data: removed } = await ipcRenderer.callMain('removeUser')

      if (removed) commit('setUser', null)
    }
  },
  modules: {}
})
