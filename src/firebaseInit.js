import firebase from 'firebase/app'
import 'firebase/messaging'

const config = {
  apiKey: 'AIzaSyAsCV9mr1HEEGNB8_kZcnO0nbxIsA75ELI',
  authDomain: 'monocle-7ae4c.firebaseapp.com',
  databaseURL: 'https://monocle-7ae4c.firebaseio.com',
  projectId: 'monocle-7ae4c',
  storageBucket: 'monocle-7ae4c.appspot.com',
  messagingSenderId: '989266014492',
  appId: '1:989266014492:web:c035dee020b8e463eb8ad9',
  measurementId: 'G-YMFDZHJ9QB'
}

export default () => {
  if (firebase.apps.length) return firebase.app()

  firebase.initializeApp(config)

  const messaging = firebase.messaging()

  messaging.usePublicVapidKey(
    'BKH_Q69F7OYg0gMnfINwUF35LRXERBLM-LdZm0evDzjDjsZkMQkrZNf45HU5KLYBa2yioQw94J74Ws_fv5kCv8o'
  )

  messaging
    .requestPermission()
    .then(function() {
      console.log('=== have permission ===')
      return messaging.getToken()
    })
    .then(function(currentToken) {
      console.log('== f_token ==', currentToken)
    })
    .catch(function(err) {
      console.log('==== error ====', err)
    })

  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log('== f_token ==', refreshedToken)
      })
      .catch(err => {
        console.log('Unable to retrieve refreshed token ', err)
      })
  })

  messaging.onMessage(payload => {
    console.log('Message received. ', payload)
    // ...
  })
}
