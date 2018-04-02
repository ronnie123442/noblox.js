// Includes
var http = require('../util/http.js').func
var getVerification = require('../util/getVerification.js').func

// Args
exports.required = ['name', 'assetType', 'file']
exports.optional = ['groupId', 'jar']

// Define
/**
 * Upload an image stored in `file` as an `assetType` with `name`.
 * @param {string|Stream} file - The file to upload which should be passed as a stream
 * @param {string} name - The name of the asset that will show when published
 * @param {number} assetType - The type of asset it is. Shirts, pants, and decals are `11`, `12`, `13`, respectively.
 * @param {number} [groupId] - If specified, it will uploaded to this group if the user has permissions.
 * @param {CookieJar} [jar] 
 * @returns {Promise.<number, Error>} - Returns the id of the uploaded image if the promise resolves or an Error
 * @example <caption> Here is an example of uploading a shirt </caption>
 * const fs = require('fs')
 * noblox.uploadImage('Shirt', 11, fs.createReadStream('./Shirt.png'))
 */
function uploadItem(jar, file, name, assetType, groupId) {
  return getVerification({
    url: '//www.roblox.com/build/upload',
    options: {
      jar: jar
    }
  })
    .then(function (ver) {
      var data = {
        name: name,
        assetTypeId: assetType,
        groupId: groupId || '',
        __RequestVerificationToken: ver.inputs.__RequestVerificationToken,
        file: {
          value: file,
          options: {
            filename: 'Image.png',
            contentType: 'image/png'
          }
        }
      }
      return http({
        url: '//www.roblox.com/build/upload',
        options: {
          method: 'POST',
          verification: ver.header,
          formData: data,
          resolveWithFullResponse: true,
          jar: jar
        }
      })
        .then(function (res) {
          if (res.statusCode === 302) {
            var location = res.headers.location
            console.log(location)
            var errMsg = location.match('message=(.*)$')
            var match = location.match(/\d+$/)
            if (match) {
              var id = parseInt(match[0], 10)
              if (location.indexOf('/build/upload') === -1) {
                throw new Error('Unknown redirect: ' + location)
              }
              return id
            } else if (errMsg) {
              throw new Error('Upload error: ' + decodeURI(errMsg[1]))
            } else {
              throw new Error('Match error. Original: ' + location)
            }
          } else {
            throw new Error('Unknown upload error')
          }
        })
    })
}

exports.func = function (args) {
  return uploadItem(args.jar, args.file, args.name, args.assetType, args.groupId)
}
