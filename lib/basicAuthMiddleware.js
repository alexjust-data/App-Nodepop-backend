/**
 * This file is to protect sensitive data
 *
 * $ nodeapp
 * $ npm install basic-auth
 */

const auth = require('basic-auth')

module.exports = (req, res, next) => {
// now it will remove that base64 from the req and transform it
// into an object that has name and pass (it comes in the auth doc)
  const user = auth(req)

  if (!user || user.name !== 'admin' || user.pass !== '1234') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required')
    // res.redirect('/'); // if not authenticated, it redirects back to the root
    res.sendStatus(401) // if not authenticated, it prompts for credentials
    return
  }

  next()
}
