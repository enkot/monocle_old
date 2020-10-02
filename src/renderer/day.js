import Vue from 'vue'
import dayjs from 'dayjs'

require('dayjs/locale/uk')
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('uk')

Object.defineProperties(Vue.prototype, {
  $date: {
    get() {
      return dayjs
    }
  }
})
