const sendmail = require('sendmail')()

// TODO A new method could be added to use connectivitychecker and only send email when done.
// Abondoned for now, as email was to complicated, compared to the benefits for this sprint

class Emailer {
  sendEmail (toadress, fromadress, subject, html) {
    sendmail({
      from: fromadress,
      to: toadress,
      subject: subject,
      html: html
    }, function (err, reply) {
      console.log(err && err.stack)
      console.dir(reply)
    })
  }
}

module.exports = Emailer
