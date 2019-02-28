
const isOnline = require('is-online')

class ConnectivityChecker {
  async handleConnectivity (callback) {
    console.log('Checking connectivity')
    isOnline({
      // Break fOREVER
      timeout: 10000,
      // v4 or v6
      version: 'v4'
    }).then(online => {
      if (online) {
        console.log('We have internet')
        callback()
      } else {
        console.log('Houston we have a problem')
        this.handleConnectivity(callback)
      }
    })
  }

  async test () {
    console.log(await isOnline())
  }
}

module.exports = ConnectivityChecker
