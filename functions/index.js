const functions = require('firebase-functions')
const admin = require('firebase-admin')

const express = require('express')
const cors = require('cors')
const app = express()

admin.initializeApp()

app.use(cors())

app.post('/events', (request, response) => {
  console.log('token', request.query.token)
  admin.messaging().send({
    token: request.query.token,
    notification: {
      title: 'Test message',
      body: 'Test Body'
    },
    data: {
      body: JSON.stringify(request.body)
    }
  })
  response.send('OK')
})

exports.api = functions.https.onRequest(app)
