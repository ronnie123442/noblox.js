// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['asset']

// Define
/**
 * Gets `info` of `asset` and caches according to settings
 * @param {number} asset - The ID of the asset you're looking to get information on. 
 * @returns {Promise.<Object, Error>} Returns `info` if it resolves which is formatted as 
 * ```json 
 * {
 *  "TargetId":12999,
 *  "ProductType":"User Product",
 *  "AssetId":12999,
 *  "ProductId":17551979,
 *  "Name":"Figure1",
 *  "Description":"",
 *  "AssetTypeId":10,
 *  "Creator":{
 *    "Id":5746,
 *    "Name":"firefeind1",
 *    "CreatorType":"User",
 *    "CreatorTargetId":5746
 *  },
 *  "IconImageAssetId":0,
 *  "Created":"2006-10-15T01:59:36.373Z",
 *  "Updated":"2006-10-15T01:59:36.373Z",
 *  "PriceInRobux":null,
 *  "PriceInTickets":null,
 *  "Sales":1,
 *  "IsNew":false,
 *  "IsForSale":false,
 *  "IsPublicDomain":true,
 *  "IsLimited":false,
 *  "IsLimitedUnique":false,
 *  "Remaining":null,
 *  "MinimumMembershipLevel":0,
 *  "ContentRatingTypeId":0
 * }
 * ``` 
 * or an Error
 */
function getProductInfo (asset) {
  var httpOpt = {
    url: '//api.roblox.com/marketplace/productinfo?assetId=' + asset,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        return JSON.parse(res.body)
      } else {
        throw new Error('Asset does not exist')
      }
    })
}

exports.func = function (args) {
  var asset = args.asset
  return cache.wrap('Product', asset, function () {
    return getProductInfo(asset)
  })
}
