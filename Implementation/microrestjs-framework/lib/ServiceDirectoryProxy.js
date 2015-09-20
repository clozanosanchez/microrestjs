'use strict';

/**
 * Proxy to interact remotely with the service directory.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var url = require('url');
var checkTypes = require('check-types');
var logger = require('winston').loggers.get('ServiceDirectoryProxy');

var microrest = require('./Microrest');
var client = require('./Client');

var LOOKUP_ERROR = 'LOOKUP_ERROR';

/**
 * Registers a RunnableService in the service directory
 *
 * @public
 * @static
 * @function
 * @param {Object} runnableService - RunnableService to be registered.
 * @throws an Error if the runnableService parameter is not a valid RunnableService object.
 */
module.exports.register = function register(runnableService) {
    if (checkTypes.not.object(runnableService) || checkTypes.emptyObject(runnableService)) {
        throw new Error('The parameter runnableService must be a RunnableService object');
    }

    var serverPort = microrest.getServerPort();
    var defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();
    var serviceLocation = runnableService.getContext().config.location;

    if (serviceLocation === 'directory') {
        _registerServiceInDirectory(runnableService, serverPort, defaultDirectoryLocation);
    } else if (serviceLocation.substring(0, 12) === 'directory://') {
        var directoryLocation = 'https://' + serviceLocation.substring(12, serviceLocation.length);
        _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
    }
};

/**
 * Looks up a service in the service directory
 *
 * @public
 * @static
 * @function
 * @param {Object} callableService - CallableService to be looked up.
 * @param {lookupCallback} lookupCallback - Callback for delegating the response from lookup operation.
 * @throws an Error if the callableService parameter is not a valid CallableService object.
 * @throws an Error if the lookupCallback parameter is not a valid callback function.
 */
module.exports.lookup = function lookup(callableService, lookupCallback) {
    if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
        throw new Error('The parameter callableService must be a CallableService object');
    }

    if (checkTypes.not.function(lookupCallback)) {
        throw new Error('The parameter lookupCallback must be a defined function');
    }

    var defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();
    var serviceLocation = callableService.getContext().config.location;

    if (serviceLocation === 'directory') {
        _lookupServiceInDirectory(callableService, defaultDirectoryLocation, lookupCallback);
    } else if (serviceLocation.substring(0, 12) === 'directory://') {
        var directoryLocation = 'https://' + serviceLocation.substring(12, serviceLocation.length);
        _lookupServiceInDirectory(callableService, directoryLocation, lookupCallback);
    } else {
        var serviceLocationInfo = url.parse(serviceLocation);
        var serviceLookupInfo = {
            location: serviceLocationInfo.hostname,
            port: parseInt(serviceLocationInfo.port) || 433
        };
        lookupCallback(null, serviceLookupInfo);
    }
};

/**
 * Sends the registration request to the service directory and processes the response.
 *
 * @private
 * @function
 * @param {Object} runnableService - RunnableService to be registered.
 * @param {Integer} serverPort - Port where the server is listening for service requests.
 * @param {String} directoryLocation - Location of the directory where the service must be registered.
 */
function _registerServiceInDirectory(runnableService, serverPort, directoryLocation) {
    if (!runnableService.isServiceReady()) {
        setTimeout(_registerServiceInDirectory, 1000, runnableService, serverPort, directoryLocation);
        return;
    }

    var directoryUrl = url.parse(directoryLocation);

    var completePath = directoryUrl.path + '/register';

    var request = {
        hostname: directoryUrl.hostname,
        port: directoryUrl.port,
        path: completePath,
        method: 'POST',
        body: {
            info: runnableService.getContext().info,
            port: serverPort
        },
        credentials: {
            key: runnableService.credentials.key,
            certificate: runnableService.credentials.certificate,
            ca: runnableService.credentials.ca
        },
        rejectUnauthorized: false,
        checkServerIdentity: function _checkServerIdentity(host, cert) {
            //The host of the server is not checked.
            //Avoid localhost problems
        }
    };

    client.send(request, function _sendCallback(error, response) {
        if (checkTypes.assigned(error)) {
            setTimeout(_registerServiceInDirectory, 1000, runnableService, serverPort, directoryLocation);
            logger.warn('Retrying to register service %s in directory \'%s\', because %s -> %s.', runnableService.getIdentificationName(), directoryLocation, error.code, error.message);
            return;
        }

        if (checkTypes.not.assigned(response)) {
            setTimeout(_registerServiceInDirectory, 1000, runnableService, serverPort, directoryLocation);
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has not sent a response.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        var statusCode = response.getStatus();
        if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
            setTimeout(_registerServiceInDirectory, 1000, runnableService, serverPort, directoryLocation);
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response without status code.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        if (statusCode !== 204) {
            setTimeout(_registerServiceInDirectory, 1000, runnableService, serverPort, directoryLocation);

            if (checkTypes.assigned(response.getStatusMessage())) {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s - %s.', runnableService.getIdentificationName(), directoryLocation, statusCode, response.getStatusMessage());
            } else {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s.', runnableService.getIdentificationName(), directoryLocation, statusCode);
            }

            return;
        }

        logger.info('The service %s has been registered successfully in directory \'%s\'.', runnableService.getIdentificationName(), directoryLocation);
    });
}

/**
 * Sends the lookup request to the service directory and preprocesses the response.
 *
 * @private
 * @function
 * @param {Object} callableService - CallableService to be looked up.
 * @param {String} directoryLocation - Location of the directory where the service must be looked up.
 * @param {lookupCallback} lookupCallback - Callback for delegating the response from lookup operation.
 */
function _lookupServiceInDirectory(callableService, directoryLocation, lookupCallback) {
    var directoryUrl = url.parse(directoryLocation);

    var completePath = directoryUrl.path + '/lookup/' + callableService.getContext().info.name + '/' + callableService.getContext().info.api;

    var request = {
        hostname: directoryUrl.hostname,
        port: directoryUrl.port,
        path: completePath,
        method: 'GET',
        credentials: {
            key: callableService.credentials.key,
            certificate: callableService.credentials.certificate,
            ca: callableService.credentials.ca
        },
        rejectUnauthorized: false,
        checkServerIdentity: function _checkServerIdentity(host, cert) {
            //The host of the server is not checked.
            //Avoid localhost problems
        }
    };

    client.send(request, function _sendCallback(error, response) {
        if (checkTypes.assigned(error)) {
            var lookupError1 = new Error(error.code + ' -> ' + error.message);
            lookupError1.code = LOOKUP_ERROR;
            lookupCallback(lookupError1);
            return;
        }

        if (checkTypes.not.assigned(response)) {
            var lookupError2 = new Error('The service directory has not sent a response.');
            lookupError2.code = LOOKUP_ERROR;
            lookupCallback(lookupError2);
            return;
        }

        var statusCode = response.getStatus();
        if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
            var lookupError3 = new Error('The service directory has sent a response without status code.');
            lookupError3.code = LOOKUP_ERROR;
            lookupCallback(lookupError3);
            return;
        }

        if (statusCode !== 200) {
            var lookupError4;

            if (checkTypes.assigned(response.getStatusMessage())) {
                lookupError4 = new Error('The service directory has sent a response with status code ' + statusCode + ' - ' + response.getStatusMessage());
            } else {
                lookupError4 = new Error('The service directory has sent a response with status code ' + statusCode);
            }

            lookupError4.code = LOOKUP_ERROR;
            lookupCallback(lookupError4);
            return;
        }

        var body = response.getBody();
        if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
            var lookupError5 = new Error('The service directory has sent a correct response, but without any information about the requested service.');
            lookupError5.code = LOOKUP_ERROR;
            lookupCallback(lookupError5);
            return;
        }

        if (checkTypes.not.string(body.location) || checkTypes.not.unemptyString(body.location)) {
            var lookupError6 = new Error('The service directory has sent a correct response, but without the location of the requested service.');
            lookupError6.code = LOOKUP_ERROR;
            lookupCallback(lookupError6);
            return;
        }

        if (checkTypes.not.integer(body.port) || checkTypes.not.positive(body.port)) {
            var lookupError7 = new Error('The service directory has sent a correct response, but without the port in which the requested service is listening.');
            lookupError7.code = LOOKUP_ERROR;
            lookupCallback(lookupError7);
            return;
        }

        lookupCallback(null, body);
    });
}

/**
 * Callback declaration for delegating the responses received from the lookup operation.
 *
 * @callback lookupCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {CallableServiceResponse} response - Represents the received response from the service directory.
 */
