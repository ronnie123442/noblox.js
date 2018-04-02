const http = require('../util/http.js').func

exports.required = ['userId']

/**
 * Returns back an object containing data about the user's avatar
 * @param {number} userId - The ID of the target user
 * @returns {Promise.<Object, Error>} 
 */
const getAvatar = (userId) => {
  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/avatar',
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

exports.func = (args) => {
  const userId = args.userId
  return getAvatar(userId)
}
