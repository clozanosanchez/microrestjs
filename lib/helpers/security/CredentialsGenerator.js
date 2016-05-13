'use strict';

/**
 * Generates secure credentials.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const pem = require('pem');
const checkTypes = require('check-types');

/**
 * Generates secure credentials asynchronously:
 *   - Private key (credentials.key).
 *   - Certificate (credentials.certificate).
 *
 * @public
 * @static
 * @function
 * @returns {Promise} - Promise that resolves with the generated credentials and rejects if an error occurs.
 */
module.exports.generateCredentials = function generateCredentials() {
    return new Promise((resolve, reject) => {
        const pemOptions = {
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

        pem.createCertificate(pemOptions, (error, privateCredentials) => {
            if (checkTypes.assigned(error)) {
                reject(error);
                return;
            }

            const credentials = {
                key: privateCredentials.clientKey,
                certificate: privateCredentials.certificate
            };

            resolve(credentials);
        });
    });
};
