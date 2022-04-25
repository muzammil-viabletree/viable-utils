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

    //
};