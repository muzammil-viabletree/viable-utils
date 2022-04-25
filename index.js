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

    
};