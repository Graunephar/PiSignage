// config.js
const config = {
  app: {
    port: 3000,
    timeout: 100 // should be 36000 in production
  },
  feed: { // TODO: Should be moved to static updatable json file
    url: 'https://jyllands-posten.dk/?service=rssfeed&submode=topnyheder'
  }
}

module.exports = config
