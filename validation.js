var Emailaddresses = require('machinepack-emailaddresses');

module.exports = {
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
  validateEmail(email, callback) {
    // Determine whether or not the provided string is an email address.
    Emailaddresses.validate({
      string: email,
    }).exec({
      // An unexpected error occurred.
      error: (err) => {
        sails.log.error('machinepack-emailaddresses had an error whilst validating email: ', email);
        sails.log.error(err);
        callback(undefined, false);
      },
      // The provided string is not an email address.
      invalid: () => {
        callback(undefined, false);
      },
      // OK.
      success: () => {
        callback(undefined, true);
      },
    });
  },

  validateEmailPromise(email) {
    return new Promise((resolve) => {
      Emailaddresses.validate({
        string: email,
      }).exec({
        // An unexpected error occurred.
        error: () => {
          return resolve(false);
        },
        // The provided string is not an email address.
        invalid: () => {
          return resolve(false);
        },
        // OK.
        success: () => {
          return resolve(true);
        },
      });
    });
  },

  validatePhone(phone, callback) {
    if (typeof phone === 'undefined') {
      return callback('phone must be defined');
    }
    var longForm;
    if (!/(07\d)|(447)/.test(phone.substr(0, 3))) {
      return callback('phone must start 07 or 447');
    }
    if (phone.substr(0, 2) === '07') {
      if (phone.length !== 11) {
        return callback('phone must be valid UK number');
      }
      longForm = '44' + phone.substr(-10, 10);
    }
    if (phone.substr(0, 2) === '44') {
      if (phone.length !== 12) {
        return callback('phone must be valid UK number');
      }
      longForm = phone;
    }
    if (!/^\d{11,12}$/.test(phone)) {
      return callback('phone must be all numerals');
    }
    return callback(undefined, longForm);
  },

  validatePhonePromise(phone) {
    return new Promise((resolve) => {
      if (!phone) return false;
      phone = phone.replace(/ /g, '');
      let mobileNumber = phone.replace('+', '');
      // Number begins with 44
      if (mobileNumber.charAt(0) == '4' && mobileNumber.charAt(1) == '4') {
        mobileNumber = '0' + mobileNumber.slice(2);
      }
      if (
        /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/.test(
          mobileNumber
        )) {
        return resolve(true);
      }
      return resolve(false);

      if (typeof phone === 'undefined') {
        return resolve(false);
      }
      if (!/(07\d)|(447)/.test(phone.substr(0, 3))) {
        return resolve(false);
      }
      if (phone.substr(0, 2) === '07') {
        if (phone.length !== 11) {
          return resolve(false);
        }
      }
      if (phone.substr(0, 2) === '44') {
        if (phone.length !== 12) {
          return resolve(false);
        }
      }
      if (!/^\d{11,12}$/.test(phone)) {
        return resolve(false);
      }
      return resolve(true);
    });
  },

  singleName(name, callback) {
    if (typeof name === 'undefined') {
      return callback('name must be defined');
    }
    if (!/^\w+(['-]?\w+)(['-]?\w+)?$/.test(name)) {
      return callback('Name incorrectly formatted');
    }
    // var capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    // callback(undefined, capitalized);
  },

  continueIfValidPostcodeFormat: (postcode) => {
    return new Promise((resolve, reject) => {
      module.exports.postcodeFormat(postcode)
        .then((isValid) => {
          if (isValid) return resolve(postcode);
          return reject('Postcode format not valid');
        });
    });
  },

  /** callback - (err, isValid) */
  postcodeFormat(postcode) {
    return new Promise((resolve, reject) => {
      if (!postcode) return resolve(false);
      if (typeof postcode !== 'string') {
        sails.log.warn('validation.postcodeFormat called with type that was not string');
        return reject(new TypeError('Postcode must by of type string'));
      }
      if (!/^(\w|\d){2,4}\s?\d{1}\w{2}$/.test(postcode)) return resolve(false);
      return resolve(true);
    });
  }
};
