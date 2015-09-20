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

var ioHelper = require('./IOHelper');

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
    if (checkTypes.not.function(responseCallback)) {
        throw new Error('The parameter responseCallback must be a defined function');
    }

    if (checkTypes.not.object(request) || checkTypes.emptyObject(request)) {
        //TODO: Improve the condition to check if it is a good request
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
        headers: {
            'Content-Type': 'application/json'
        },
        key: request.credentials.key,
        cert: request.credentials.certificate,
        ca: request.credentials.ca,
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
            var response = ioHelper.convertHttpResponseToCallableServiceResponse(httpResponse, bufferBody);
            responseCallback(null, response);
        });
    });

    httpRequest.on('error', function _errorCallback(error) {
        responseCallback(error);
    });

    if (checkTypes.assigned(request.body)) {
        if (checkTypes.string(request.body)) {
            httpRequest.write(request.body);
        } else {
            httpRequest.write(JSON.stringify(request.body));
        }
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
