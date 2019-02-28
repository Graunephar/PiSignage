'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const config = require('./config') // The config file
const app = express()
const downloader = require('download-file')
const filesystem = require('fs')
const ConnectivityChecker = require('./ConnectivityChecker')

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
  console.log('Starting page with: ' + feed)
  response.render('sign', {
    feed: feed // TODO: Could support a list
  })
})

app.get('/test', (req, res) => {
  let connectivitychecker = new ConnectivityChecker()
  connectivitychecker.test()
})

app.get('/down', (req, res) => {
  // let videourl = 'file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4'
  // let videourl = 'http://vjs.zencdn.net/v/oceans.mp4'
  let videourl = 'http://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4'
  getVideo(videourl)
})

app.get('/change', (req, res) => {
  res.send({ change: videoChanged })

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

function getVideo (url) {
  downloadVideo(url, (downloadfilename) => {
    let videoname = 'video.mp4'
    let oldname = './' + staticdir + downloadfilename
    let newname = './' + staticdir + videopath + videoname

    filesystem.rename(oldname, newname)

    videoChanged = true
    // res.send({ path: videopath + videoname })
  })
}

function downloadVideo (url, callbackfunction) {
  let filename = 'nextvideo.mp4'
  let completepath = './' + staticdir + videopath

  console.log('video download startet')

  let options = {
    directory: completepath,
    filename: filename,
    timeout: config.app.timeout
  }

  downloader(url, options, function (err) {
    if (err) {
      let connectivitychecker = new ConnectivityChecker()
      connectivitychecker.handleConnectivity(() => {
        downloadVideo(url, callbackfunction)
      })
      console.log('Download error')
    } else {
      callbackfunction(videopath + filename)
      console.log('Download success')
    }

    console.log('why am I here')
  })
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
