import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.monobank.ua/',
  timeout: 1000
})

instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if ([400, 401, 403].includes(error.response.status)) {
      // browser.runtime.sendMessage({ type: 'logout' })
    }
    return Promise.reject(error)
  }
)

export default instance
