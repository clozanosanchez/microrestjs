'use strict';

/**
 * Proxy to retrieve the service information from deployed services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var client = require('./Client');

var RETRIEVE_ERROR = 'RETRIEVE_ERROR';

/**
 * Retrieves the Service Information of a CallableService.
 *
 * @public
 * @static
 * @function
 * @param {CallableService} callableService - CallableService from which its Service Information is desired.
 * @param {retrieveCallback} retrieveServiceInformationCallback - Callback for delegating the response from retrieveServiceInformation operation.
 * @throws an Error if the retrieveServiceInformationCallback parameter is not a valid callback function.
 */
module.exports.retrieveServiceInformation = function retrieveServiceInformation(callableService, retrieveServiceInformationCallback) {
    if (checkTypes.not.function(retrieveServiceInformationCallback)) {
        throw new Error('The parameter retrieveServiceInformationCallback must be a defined function');
    }

    if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
        var retrieveError = new Error('The parameter callableService must be a CallableService object');
        retrieveError.code = RETRIEVE_ERROR;
        retrieveServiceInformationCallback(retrieveError);
        return;
    }

    if (checkTypes.not.object(callableService.realService) || checkTypes.emptyObject(callableService.realService) ||
        checkTypes.not.string(callableService.realService.location) || checkTypes.not.unemptyString(callableService.realService.location) ||
        checkTypes.not.integer(callableService.realService.port) || checkTypes.not.positive(callableService.realService.port)) {
        var retrieveError1 = new Error('Either the location or the port of the service in unknown');
        retrieveError1.code = RETRIEVE_ERROR;
        retrieveServiceInformationCallback(retrieveError1);
        return;
    }

    _retrieveServiceInformation(callableService, retrieveServiceInformationCallback);
};

/**
 * Sends the retrieveServiceInformation request to the CallableService and preprocesses the response.
 *
 * @private
 * @function
 * @param {CallableService} callableService - CallableService from which its Service Information is desired.
 * @param {retrieveCallback} retrieveServiceInformationCallback - Callback for delegating the response from the retriveServiceInformation operation.
 */
function _retrieveServiceInformation(callableService, retrieveServiceInformationCallback) {
    var completePath = '/' + callableService.getIdentificationName();

    var request = {
        hostname: callableService.realService.location,
        port: callableService.realService.port,
        path: completePath,
        method: 'GET',
        rejectUnauthorized: false,
        checkServerIdentity: function _checkServerIdentity(host, cert) {
            //The host of the server is not checked.
            //Avoid localhost problems
        }
    };

    client.send(request, function _sendCallback(error, response) {
        if (checkTypes.assigned(error)) {
            var retrieveError2 = new Error(error.code + ' -> ' + error.message);
            retrieveError2.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError2);
            return;
        }

        if (checkTypes.not.assigned(response)) {
            var retrieveError3 = new Error('The service has not sent a response with its information.');
            retrieveError3.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError3);
            return;
        }

        var statusCode = response.getStatus();
        if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
            var retrieveError4 = new Error('The service has sent a response without status code.');
            retrieveError4.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError4);
            return;
        }

        if (statusCode !== 200) {
            var retrieveError5;

            if (checkTypes.assigned(response.getStatusMessage())) {
                retrieveError5 = new Error('The service has sent a response with status code ' + statusCode + ' - ' + response.getStatusMessage());
            } else {
                retrieveError5 = new Error('The service has sent a response with status code ' + statusCode);
            }

            retrieveError5.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError5);
            return;
        }

        var body = response.body;
        if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
            var retrieveError6 = new Error('The service has sent a correct response, but without any information about itself.');
            retrieveError6.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError6);
            return;
        }

        if (checkTypes.not.object(body.serviceContext) || checkTypes.emptyObject(body.serviceContext)) {
            var retrieveError7 = new Error('The service has sent a correct response, but without its service context.');
            retrieveError7.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError7);
            return;
        }

        if (checkTypes.not.string(body.certificate) || checkTypes.not.unemptyString(body.certificate)) {
            var retrieveError8 = new Error('The service has sent a correct response, but without its certificate.');
            retrieveError8.code = RETRIEVE_ERROR;
            retrieveServiceInformationCallback(retrieveError8);
            return;
        }

        retrieveServiceInformationCallback(null, body);
    });
}

/**
 * Callback declaration for delegating the responses received from retrieving the ServiceInformation.
 *
 * @callback retrieveCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {CallableServiceResponse} response - Represents the received response with the ServiceInformation from the CallableService.
 */
