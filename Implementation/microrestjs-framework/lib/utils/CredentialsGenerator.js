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
 *   - Certificate (credentials.certificate / credentials.ca)
 *
 * @public
 * @static
 * @function
 * @param {String} name - Name for the credential.
 * @param {Object} credentials - Object where the credentials will be stored.
 * @throws an Error if the name parameter is an empty string.
 * @throws an Error if the credentials parameter is not an empty object.
 */
module.exports.generateCredentials = function generateCredentials(name, credentials) {
    if (checkTypes.not.string(name) || checkTypes.not.unemptyString(name)) {
        throw new Error('The parameter name must be a non-empty string.');
    }

    if (checkTypes.not.object(credentials) || checkTypes.not.emptyObject(credentials)) {
        throw new Error('The parameter credentials must be an empty object.');
    }

    var pemOptions = {
        keyBitsize: 2048,
        hash: 'sha256',
        country: 'ES',
        state: 'Madrid',
        locality: 'Madrid',
        organization: 'Microrestjs',
        organizationUnit: 'security',
        commonName: name,
        selfSigned: true,
        days: 1
    };

    pem.createCertificate(pemOptions, function _storeCredentials(err, privateCredentials) {
        if (checkTypes.assigned(err)) {
            //TODO: Decide how to control this error
            return;
        }

        credentials.key = privateCredentials.clientKey;
        credentials.certificate = privateCredentials.certificate;
        credentials.ca = privateCredentials.certificate;
    });
};
