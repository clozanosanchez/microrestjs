'use strict';

/**
 * Proxy to interact remotely with the service directory.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const url = require('url');
const checkTypes = require('check-types');
const delay = require('delay');

const loggerManager = require('../logging/LoggerManager');

const ServiceContextError = require('../../errors/ServiceContextError');
const LookupError = require('../../errors/LookupError');

/**
 * Registers a RunnableService in the service directory.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} runnableService - RunnableService to be registered.
 * @throws a TypeError if the runnableService parameter is not a valid RunnableService object.
 * @throws a ServiceContextError if the location of the service is not defined in the context of the runnableService.
 */
module.exports.register = function register(runnableService) {
    const RunnableService = require('../../services/RunnableService');
    if (checkTypes.not.object(runnableService) || checkTypes.not.instanceStrict(runnableService, RunnableService)) {
        throw new TypeError('The parameter runnableService must be a RunnableService object.');
    }

    const microrest = require('../../platform/Microrest');
    const serverPort = microrest.getServerPort();
    const defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();

    const serviceLocation = runnableService.getContext().getLocation();
    if (checkTypes.not.string(serviceLocation) || checkTypes.emptyString(serviceLocation)) {
        throw new ServiceContextError('The location of the runnableService is not defined in its service context.');
    }

    if (serviceLocation === 'directory') {
        _registerServiceInDirectory(runnableService, serverPort, defaultDirectoryLocation);
    } else if (serviceLocation.substring(0, 12) === 'directory:// ') {
        const directoryLocation = `https:// ${serviceLocation.substring(12, serviceLocation.length)}`;
        _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
    }
};

/**
 * Looks up a service in the service directory.
 *
 * @public
 * @static
 * @function
 * @param {CallableService} callableService - CallableService to be looked up.
 * @returns {Promise} - Promise that resolves with the service lookup information and rejects if an error occurs.
 */
module.exports.lookup = function lookup(callableService) {
    return new Promise((resolve, reject) => {
        const CallableService = require('../../services/CallableService');
        if (checkTypes.not.object(callableService) || checkTypes.not.instanceStrict(callableService, CallableService)) {
            reject(new TypeError('The parameter callableService must be a CallableService object'));
            return;
        }

        const microrest = require('../../platform/Microrest');
        const defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();
        const serviceLocation = callableService.getContext().getLocation();
        if (checkTypes.not.string(serviceLocation) || checkTypes.emptyString(serviceLocation)) {
            reject(new ServiceContextError('The location of the callableService is not defined in its service context.'));
            return;
        }

        if (serviceLocation === 'directory') {
            resolve(_lookupServiceInDirectory(callableService, defaultDirectoryLocation));
        } else if (serviceLocation.substring(0, 12) === 'directory:// ') {
            const directoryLocation = `https:// ${serviceLocation.substring(12, serviceLocation.length)}`;
            resolve(_lookupServiceInDirectory(callableService, directoryLocation));
        } else {
            const serviceLocationInfo = url.parse(serviceLocation);
            const serviceLookupInfo = {
                location: serviceLocationInfo.hostname,
                port: parseInt(serviceLocationInfo.port, 10) || 433
            };
            resolve(serviceLookupInfo);
        }
    });
};

/**
 * Sends the registration request to the service directory and processes the response.
 *
 * @private
 * @function
 * @param {RunnableService} runnableService - RunnableService to be registered.
 * @param {Integer} serverPort - Port where the server is listening for service requests.
 * @param {String} directoryLocation - Location of the directory where the service must be registered.
 */
function _registerServiceInDirectory(runnableService, serverPort, directoryLocation) {
    const directoryUrl = url.parse(directoryLocation);

    const completePath = `${directoryUrl.path}/register`;

    const registerBody = {
        info: runnableService.getContext().getInfo(),
        port: serverPort
    };

    const jsonBody = JSON.stringify(registerBody);

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(jsonBody, 'utf8')
    };

    const body = new Buffer(jsonBody, 'utf8');

    const request = {
        hostname: directoryUrl.hostname,
        port: directoryUrl.port,
        path: completePath,
        method: 'POST',
        headers: headers,
        body: body,
        rejectUnauthorized: false,
        checkServerIdentity: function _checkServerIdentity(host, cert) {
            // The host of the server is not checked.
            // Avoid localhost problems
        }
    };

    const client = require('../../platform/Client');
    client.send(request).then((response) => {
        const logger = loggerManager.getLogger('ServiceDirectoryProxy');

        if (checkTypes.not.assigned(response)) {
            delay(1000).then(() => {
                _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
            });
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has not sent a response.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        const statusCode = response.getStatus();
        if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
            delay(1000).then(() => {
                _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
            });
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response without status code.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        if (statusCode !== 204) {
            delay(1000).then(() => {
                _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
            });

            if (checkTypes.assigned(response.getStatusMessage())) {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s - %s.', runnableService.getIdentificationName(), directoryLocation, statusCode, response.getStatusMessage());
            } else {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s.', runnableService.getIdentificationName(), directoryLocation, statusCode);
            }

            return;
        }

        logger.info('The service %s has been registered successfully in directory \'%s\'.', runnableService.getIdentificationName(), directoryLocation);
    }).catch((error) => {
        delay(1000).then(() => {
            _registerServiceInDirectory(runnableService, serverPort, directoryLocation);
        });
        const logger = loggerManager.getLogger('ServiceDirectoryProxy');
        logger.warn('Retrying to register service %s in directory \'%s\', because %s -> %s.', runnableService.getIdentificationName(), directoryLocation, error.code, error.message);
    });
}

/**
 * Sends the lookup request to the service directory and preprocesses the response.
 *
 * @private
 * @function
 * @param {CallableService} callableService - CallableService to be looked up.
 * @param {String} directoryLocation - Location of the directory where the service must be looked up.
 * @returns {Promise} - Promise that resolves with the service lookup information and rejects if an error occurs.
 */
function _lookupServiceInDirectory(callableService, directoryLocation) {
    return new Promise((resolve, reject) => {
        const directoryUrl = url.parse(directoryLocation);

        const name = callableService.getContext().getName();
        if (checkTypes.not.string(name) || checkTypes.emptyString(name)) {
            reject(new ServiceContextError('The name of the callableService is not defined in its service context.'));
            return;
        }

        const api = callableService.getContext().getApi();
        if (checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
            reject(new ServiceContextError('The api of the callableService is not defined in its service context.'));
            return;
        }

        const completePath = `${directoryUrl.path}/lookup/${name}/${api}`;

        const request = {
            hostname: directoryUrl.hostname,
            port: directoryUrl.port,
            path: completePath,
            method: 'GET',
            rejectUnauthorized: false,
            checkServerIdentity: function _checkServerIdentity(host, cert) {
                // The host of the server is not checked.
                // Avoid localhost problems
            }
        };

        const client = require('../../platform/Client');
        client.send(request).then((response) => {
            if (checkTypes.not.assigned(response)) {
                reject(new ServiceContextError('The service directory has not sent a response.'));
                return;
            }

            const statusCode = response.getStatus();
            if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
                reject(new LookupError('The service directory has sent a response without status code.'));
                return;
            }

            if (statusCode !== 200) {
                let messageError = '';
                if (checkTypes.assigned(response.getStatusMessage())) {
                    messageError = `The service directory has sent a response with status code ${statusCode} - ${response.getStatusMessage()}`;
                } else {
                    messageError = `The service directory has sent a response with status code ${statusCode}.`;
                }

                reject(new LookupError(messageError));
                return;
            }

            const body = response.getBody();
            if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
                reject(new LookupError('The service directory has sent a correct response, but without any information about the requested service.'));
                return;
            }

            if (checkTypes.not.string(body.location) || checkTypes.emptyString(body.location)) {
                reject(new LookupError('The service directory has sent a correct response, but without the location of the requested service.'));
                return;
            }

            if (checkTypes.not.integer(body.port) || checkTypes.not.positive(body.port)) {
                reject(new LookupError('The service directory has sent a correct response, but without the port in which the requested service is listening.'));
                return;
            }

            resolve(body);
        }).catch((error) => {
            reject(new LookupError(`${error.code} -> ${error.message}`));
        });
    });
}
