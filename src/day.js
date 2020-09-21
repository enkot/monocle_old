import Vue from 'vue'
import VueDayjs from 'vue-dayjs-plugin'
import dayjs from 'dayjs'

require('dayjs/locale/uk')
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('uk')

Vue.use(VueDayjs)
