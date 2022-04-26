const randomstring = require('randomstring');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
   /**
     * 
     * @returns 4 digit random number
     */
    generateOtp: function () {
      return randomstring.generate({
          length: 4,
          charset: 'numeric',
      });
  },

  /**
   * 
   * @returns random string
   */
  generateRandomString: function () {
      return randomstring.generate();
  },


  /**
   * 
   * @param {alphanumeric} password 
   * @return {String} encrypted password
   */
  generateEncryptedPassword: function(password) {
      return new Promise(((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if(err) {
            sails.log.error('error generating salt', err);
            return reject(err);
          }
          bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) {
              sails.log.error('error encrypting password', err);
              return reject(err);
            }
  
  
            return resolve(hash);
          });
        });
  
      }));
    },
  parseLocaleMessage: function(req,message)
  {
    if ( _.isArray(message) ){
      const a = message;
      const m = a[0];
      a.shift();
      return req.i18n.__(m,a);
    }
    return req.i18n.__(message);
  },
  mysql_real_escape_string: function (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0':
          return '\\0';
        case '\x08':
          return '\\b';
        case '\x09':
          return '\\t';
        case '\x1a':
          return '\\z';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '"':
        case '\'':
        case '\\':
        case '%':
          return '\\'+char; // prepends a backslash to backslash, percent,
          // and double/single quotes
        default:
          return char;
      }
    });
  },
  /**
   * Check if cordiantes are valid
   * @param {number} lat
   * @param {number} lon
   * @return {boolean}
   */
  validateCoodinates(lat, lon) {
    const ck_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const ck_lon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    var validLat = ck_lat.test(lat);
    var validLon = ck_lon.test(lon);
    if (validLat && validLon) {
      return true;
    } else {
      return false;
    }
  },
  validateURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
  },
};
