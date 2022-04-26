const randomstring = require('randomstring');
const bcrypt = require('bcrypt-nodejs');

const util = require('./util');
const thumbnail =  require('./thumbnail')
const validation = require('./validation')


module.exports = {

   generateOTP : util.generateOtp,
   generateEncryptedPassword : util.generateEncryptedPassword,
   generateRandomString : util.generateRandomString,
   parseLocaleMessage :  util.parseLocaleMessage,
   mysql_real_escape_string : util.mysql_real_escape_string,
   validateCoodinates : util.validateCoodinates,
   validateURL : util.validateURL,

   generateVideoThumbnail: thumbnail.generateVideoThumbnail,
   updateVideoThumbnails : thumbnail.updateVideoThumbnails,

   validateEmail: validation.validateEmail,
   validateEmailPromise : validation.validateEmailPromise,
   validatePhone : validation.validatePhone,

   validatePhonePromise : validation.validatePhonePromise,
   singleName : validation.singleName,
   continueIfValidPostcodeFormat : validation.continueIfValidPostcodeFormat,

   postcodeFormat : validation.postcodeFormat
    
};