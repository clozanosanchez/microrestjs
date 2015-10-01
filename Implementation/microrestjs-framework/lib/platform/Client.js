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

var checkTypes = require('check-types');
var https = require('https');

var ioHelper = require('../helpers/io/IOHelper');

/**
 * Credentials of the platform for SSL communications.
 *
 * @private
 * @constant
 */
var platformCredentials = {
    key: '',
    certificate: ''
};

/**
 * Adds the credentials of the platform for SSL communications.
 *
 * @public
 * @static
 * @function
 * @param {Object} credentials - Credentials of the platform.
 */
module.exports.addPlatformCredentials = function addPlatformCredentials(credentials) {
    if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
        checkTypes.not.string(credentials.key) || checkTypes.not.unemptyString(credentials.key) ||
        checkTypes.not.string(credentials.certificate) || checkTypes.not.unemptyString(credentials.certificate)) {
        throw new Error('The parameter credentials must be a valid credentials object.');
    }

    platformCredentials.key = credentials.key;
    platformCredentials.certificate = credentials.certificate;
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
           checkTypes.string(platformCredentials.key) && checkTypes.unemptyString(platformCredentials.key) &&
           checkTypes.string(platformCredentials.certificate) && checkTypes.unemptyString(platformCredentials.certificate);
}

/**
 * Sends a HTTPS request
 *
 * @public
 * @static
 * @function
 * @param {Object} request - The data request to be sent.
 * @param {responseCallback} responseCallback - Callback for delegating the response received from the remote service.
 * @throws an Error if the responseCallback parameter is not a function.
 */
module.exports.send = function send(request, responseCallback) {
    if (!_areCredentialsReady()) {
        setTimeout(send, 1000, request, responseCallback);
        return;
    }

    if (checkTypes.not.function(responseCallback)) {
        throw new Error('The parameter responseCallback must be a defined function');
    }

    if (checkTypes.not.object(request) || checkTypes.emptyObject(request)) {
        var clientError = new Error('The parameter request must be a non-empty object');
        clientError.code = 'CLIENT_ERROR';
        responseCallback(clientError);
        return;
    }

    var options = {
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

    var httpRequest = https.request(options);

    httpRequest.on('response', function _responseCallback(httpResponse) {
        httpResponse.setEncoding('utf8');
        var bufferBody = '';

        httpResponse.on('data', function _dataCallback(chunk) {
            bufferBody += chunk;
        });

        httpResponse.on('end', function _endCallback() {
            try {
                var response = ioHelper.convertHttpResponseToCallableServiceResponse(httpResponse, bufferBody);
                responseCallback(null, response);
            } catch (err) {
                var clientError1 = new Error('The response body cannot be parsed to an object because -> ' + err);
                clientError1.code = 'CLIENT_ERROR';
                responseCallback(clientError1);
            }
        });
    });

    httpRequest.on('error', function _errorCallback(error) {
        responseCallback(error);
    });

    if (checkTypes.assigned(request.body)) {
        httpRequest.write(request.body);
    }

    httpRequest.end();
};

/**
 * Callback declaration for delegating the responses received from remote services.
 *
 * @callback responseCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {CallableServiceResponse} response - Represents the received response of the CallableService.
 */
