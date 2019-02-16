'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const config = require('./config') // The config file
const app = express()
const port = config.app.port
const feed = config.feed.url

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('static'))

app.get('/', (request, response) => {
  console.log(feed)
  response.render('sign', {
    feed: feed // TODO: Could support a list
  })
})
app.post('/', (request, response) => {
  response.render('hello', {
    recipient: request.body.recipient,
    message: request.body.message
  })
})
app.get('/hello', (request, response) => {
  response.render('hello', {
    recipient: request.query.recipient,
    message: request.query.message
  })
})
app.listen(port, (err) => {
  if (err) return console.error(`An error occurred: ${err}`)
  console.log(`Listening on http://localhost:${port}/`)
})
