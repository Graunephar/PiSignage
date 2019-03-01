// config.js
const config = {
  app: {
    port: 3000, // Don't touch
    timeout: 36000, // in ms, should be 36000 in production
    updaterate: 10000 // in ms
  },
  feed: { // TODO: Should be moved to static updatable json file
    url: 'https://jyllands-posten.dk/?service=rssfeed&submode=topnyheder'
  },
  email: {
    to: 'daniel@graungaard.com',
    from: 'no-reply@frontsound.dk'
  },
  content: {
    url: 'http://graunephar.lol/json/config.json' // Should always start with http://
  }
}

module.exports = config
