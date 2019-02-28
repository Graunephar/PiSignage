// config.js
const config = {
  app: {
    port: 3000,
    timeout: 1000 // should be 36000 in production
  },
  feed: { // TODO: Should be moved to static updatable json file
    url: 'https://jyllands-posten.dk/?service=rssfeed&submode=topnyheder'
  },
  email: {
    to: 'daniel@graungaard.com',
    from: 'no-reply@frontsound.dk'
  }
}

module.exports = config
