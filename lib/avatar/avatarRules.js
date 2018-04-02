const http = require('../util/http.js').func

exports.optional = ['option']

/**
 * @name avatarRules
 * @function
 * 
 * @param {string} [option] - If supplied, returns the avatarRules that fall under the given key
 * @returns {Promise.<Array|Object, Error>}
 */
exports.func = (args) => {
  const option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar-rules',
    options: {
      method: 'GET',
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      const result = (option ? json[option] : json)

      return result
    } else {
      throw new Error('Error fetching avatar rules')
    }
  })
}
