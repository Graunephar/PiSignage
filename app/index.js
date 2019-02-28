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
const Emailer = require('./Emailer')

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
  let emailer = new Emailer()
  emailer.sendEmail(config.email.to, config.email.from, 'test', 'HEJ')
})

app.get('/down', (req, res) => {
  // let videourl = 'file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4'
  // let videourl = 'http://vjs.zencdn.net/v/oceans.mp4'
  let videourl = 'http://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4'
  getVideo(videourl)
})

app.get('/change', (req, res) => {
  res.send({ change: videoChanged })

  if (videoChanged === true) {
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

    filesystem.rename(oldname, newname, (err) => {
      if (err) {
        getVideo(url) // Retry
        console.log('Retrying')
      } else {
        videoChanged = true
      }
    })

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

  let waserror = false

  downloader(url, options, function (err) {
    if (err) {
      waserror = true
      let connectivitychecker = new ConnectivityChecker()
      connectivitychecker.handleConnectivity(() => {
        downloadVideo(url, callbackfunction)
      })
      // let emailer = new Emailer()
      // emailer.sendEmail(config.email.to, config.email.from, 'test', 'HEJ')
      console.log('Download error')
    } else {
      if (waserror === false) {
        callbackfunction(videopath + filename)
        console.log('Download success')
      }
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
