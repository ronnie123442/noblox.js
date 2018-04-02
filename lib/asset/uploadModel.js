// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['data']
exports.optional = ['itemOptions', 'asset', 'jar']

// Define
/**
 * Uploads `data` to `asset` with `itemOptions`.
 * @param {string|Stream} data 
 * @param {Object} [itemOptions] - Required if making a _new asset_. Optional when updating an old asset.
 * @param {string} itemOptions.name
 * @param {string} itemOptions.description=""
 * @param {boolean} itemOptions.copyLocked=true
 * @param {boolean} itemOptions.allowComments=true
 * @param {number} [itemOptions.groupId]
 * @param {number} asset - If empty, a new asset will be created.
 * @param {CookieJar} [jar]
 * @return {Promise.<Object, Error>} Returns an object, if it resolved, formatted as 
 * ```js
 * {
 *  AssetId: 23991283,
 *  AssetVersionId: 2
 * }
 * ```
 * or an `Error`
 * @example <caption> If uploading a large file, it's better you pass in data as a stream. </caption>
 * const fs = require('fs')
 * rbx.uploadModel(fs.createReadStream('./model'), {name: 'Model'})
 */
function uploadModel(jar, data, itemOptions, asset) {
  var httpOpt = {
    url: '//data.roblox.com/Data/Upload.ashx?json=1&assetid=' + (asset || 0),
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      body: data,
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  }
  if (itemOptions) {
    var copyLocked = itemOptions.copyLocked
    var allowComments = itemOptions.allowComments
    httpOpt.url += '&type=Model&genreTypeId=1&name=' +
      itemOptions.name +
      '&description=' +
      (itemOptions.description || '') +
      '&ispublic=' +
      (copyLocked != null ? !copyLocked : false) +
      '&allowComments=' +
      (allowComments != null ? allowComments : true) +
      '&groupId=' +
      (itemOptions.groupId || '')
  } else if (!asset) {
    throw new Error('ItemOptions is required for new assets.')
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var body = res.body
        var parsed
        try {
          parsed = JSON.parse(body)
        } catch (e) {
          throw new Error('Could not parse JSON, returned body:' + body)
        }
        return parsed
      } else {
        throw new Error('Upload failed, confirm that all item options, asset options, and upload data are valid.')
      }
    })
}

exports.func = function (args) {
  return uploadModel(args.jar, args.data, args.itemOptions, args.asset)
}
