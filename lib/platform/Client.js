'use strict';

/**
 * Client to send HTTPS requests to other services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const https = require('https');
const delay = require('delay');

const ClientError = require('../errors/ClientError');

/**
 * Credentials of the platform for SSL communications.
 *
 * @private
 * @constant
 */
let platformCredentials = null;

/**
 * Adds the credentials of the platform for SSL communications.
 *
 * @public
 * @static
 * @function
 * @param {Object} credentials - Credentials of the platform.
 * @throws a TypeError if the credentials parameter is not a valid object.
 */
module.exports.addPlatformCredentials = function addPlatformCredentials(credentials) {
    if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
        checkTypes.not.string(credentials.key) || checkTypes.emptyString(credentials.key) ||
        checkTypes.not.string(credentials.certificate) || checkTypes.emptyString(credentials.certificate)) {
        throw new TypeError('The parameter credentials must be a valid credentials object.');
    }

    platformCredentials = {
        key: credentials.key,
        certificate: credentials.certificate
    };
};

/**
 * Cleans the credentials of the platform.
 *
 * @public
 * @static
 * @function
 */
module.exports.cleanPlatformCredentials = function cleanPlatformCredentials() {
    platformCredentials = null;
};

/**
 * Checks whether the credentials of the platform are ready for SSL communications.
 *
 * @private
 * @function
 * @return {Boolean} - true, if the credentials are ready; false, otherwise.
 */
function _areCredentialsReady() {
    return checkTypes.object(platformCredentials) && checkTypes.not.emptyObject(platformCredentials) &&
           checkTypes.string(platformCredentials.key) && checkTypes.nonEmptyString(platformCredentials.key) &&
           checkTypes.string(platformCredentials.certificate) && checkTypes.nonEmptyString(platformCredentials.certificate);
}

/**
 * Sends a HTTPS request.
 *
 * @public
 * @static
 * @function
 * @param {Object} request - The data request to be sent.
 * @return {Promise} - Promise that resolves with the response received from the CallableService and rejects if an error occurs
 */
module.exports.send = function send(request) {
    return new Promise((resolve, reject) => {
        if (!_areCredentialsReady()) {
            delay(1000).then(() => resolve(send(request)));
            return;
        }

        if (checkTypes.not.object(request) || checkTypes.emptyObject(request)) {
            //TODO: Improve condition
            reject(new TypeError('The parameter request must be a non-empty object.'));
            return;
        }

        const options = {
            hostname: request.hostname,
            port: request.port,
            path: request.path,
            method: request.method,
            headers: request.headers,
            auth: request.auth,
            key: platformCredentials.key,
            cert: platformCredentials.certificate,
            ca: request.serviceCertificate,
            rejectUnauthorized: request.rejectUnauthorized,
            checkServerIdentity: request.checkServerIdentity
        };
        options.agent = new https.Agent(options);

        const httpRequest = https.request(options);

        httpRequest.on('response', function _responseCallback(httpResponse) {
            httpResponse.setEncoding('utf8');
            let bufferBody = '';

            httpResponse.on('data', function _dataCallback(chunk) {
                bufferBody += chunk;
            });

            httpResponse.on('end', function _endCallback() {
                try {
                    const ioHelper = require('../helpers/io/IOHelper');
                    const response = ioHelper.convertHttpResponseToCallableServiceResponse(httpResponse, bufferBody);
                    resolve(response);
                } catch (err) {
                    reject(new ClientError(`The response body cannot be parsed to an object because -> ${err}`));
                }
            });
        });

        httpRequest.on('error', function _errorCallback(error) {
            reject(new ClientError(`The request failed because -> ${error}`));
        });

        if (checkTypes.assigned(request.body)) {
            httpRequest.write(request.body);
        }

        httpRequest.end();
    });
};
