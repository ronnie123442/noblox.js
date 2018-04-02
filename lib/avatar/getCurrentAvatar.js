const http = require('../util/http.js').func

exports.optional = ['option', 'jar']

/**
 * @name getCurrentAvatar
 * @function
 * @summary Gets the logged in user's avatar
 * 
 * @param {string} [option]
 * @param {CookieJar} [jar]
 * 
 * @returns {Promise.<Object, Error>} Returns an object containing information regarding the logged in user's avatar if it resolves, or an `Error`.
 */

exports.func = (args) => {
  let jar = args.jar
  let option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar',
    options: {
      method: 'GET',
      jar: jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      let json = JSON.parse(res.body)
      let result = (option ? json[option] : json)

      return result
    }
  })
}
