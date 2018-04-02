const http = require('../util/http.js').func

exports.required = ['userId']

/**
 * @name currentlyWearing
 * @function
 * 
 * @param {number} userId - The ID of the targetted user
 * @returns {Promise.<Object, Error>} Returns an object containing the assets the user is wearing if the promise resolves, or an `Error`.
 */
exports.func = (args) => {
  const userId = args.userId

  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/currently-wearing',
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      throw new Error('User does not exist')
    }
  })
}
