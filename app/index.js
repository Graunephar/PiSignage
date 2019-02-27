'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const config = require('./config') // The config file
const app = express()
const download = require('download-file')
const filesystem = require('fs')
const videopath = 'videos/'
const staticdir = 'static/'
let videoChanged = false

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

app.use(express.static(staticdir))

app.get('/', (request, response) => {
  console.log(feed)
  response.render('sign', {
    feed: feed // TODO: Could support a list
  })
})

app.get('/down', (req, res) => {
  downloadVideo('file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4', (downloadfilename) => {
    let videoname = 'video.mp4'
    let oldname = './' + staticdir + downloadfilename
    let newname = './' + staticdir + videopath + videoname

    filesystem.rename(oldname, newname)

    videoChanged = true
    res.send({ path: videopath + videoname })
  })
})

app.get('/change', (req, res) => {
  res.send({change: videoChanged})

  if (videoChanged) {
    videoChanged = false
  }
})

app.post('/', (request, response) => {
  response.render('hello', {
    recipient: request.body.recipient,
    message: request.body.message
  })
})

function downloadVideo (url, callbackfunction) {
  let filename = 'nextvideo.mp4'
  let completepath = './' + staticdir + videopath

  console.log(completepath)

  let options = {
    directory: completepath,
    filename: filename,
    timeout: 36000
  }

  download(url, options, function (err) {
    if (err) sendEmail(err)
    callbackfunction(videopath + filename)
  })
}

function sendEmail (error) {
  console.log('Email') // TODO: Impelement proberbliu
  throw error
}

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
