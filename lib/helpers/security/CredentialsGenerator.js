'use strict';

/**
 * Generates secure credentials.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var pem = require('pem');
var checkTypes = require('check-types');

/**
 * Generates secure credentials asynchronously:
 *   - Private key (credentials.key)
 *   - Certificate (credentials.certificate)
 *
 * @public
 * @static
 * @function
 * @param {generateCredentialsCallback} callback - Callback for delegating the generated credentials.
 * @throws an Error if the callback parameter is not a valid callback function.
 */
module.exports.generateCredentials = function generateCredentials(callback) {
    if (checkTypes.not.function(callback)) {
        throw new Error('The parameter callback must be a defined function.');
    }

    var pemOptions = {
        keyBitsize: 2048,
        hash: 'sha256',
        country: 'ES',
        state: 'Madrid',
        locality: 'Madrid',
        organization: 'Microrestjs',
        organizationUnit: 'security',
        selfSigned: true,
        days: 1
    };

    pem.createCertificate(pemOptions, function _getCredentials(error, privateCredentials) {
        if (checkTypes.assigned(error)) {
            callback(error);
            return;
        }

        var credentials = {
            key: privateCredentials.clientKey,
            certificate: privateCredentials.certificate
        };

        callback(null, credentials);
    });
};

/**
 * Callback declaration for delegating the generated credentials.
 *
 * @callback generateCredentialsCallback
 * @param {Error} error - Specifies the error that occurred, if it is defined.
 * @param {Object} credentials - Represents the generated credentials.
 */
