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

const url = require('url');
const checkTypes = require('check-types');
const delay = require('delay');

const logger = require('../logging/LoggerManager').getLogger('ServiceDirectoryProxy');
const microrest = require('../../platform/Microrest');
const client = require('../../platform/Client');

const LOOKUP_ERROR = 'LOOKUP_ERROR';

/**
 * Registers a RunnableService in the service directory.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} runnableService - RunnableService to be registered.
 * @throws an Error if the runnableService parameter is not a valid RunnableService object.
 * @throws an Error if the location of the service is not defined in the context of the runnableService.
 */
module.exports.register = function register(runnableService) {
    if (checkTypes.not.object(runnableService) || checkTypes.emptyObject(runnableService)) {
        throw new Error('The parameter runnableService must be a RunnableService object.');
    }

    const serverPort = microrest.getServerPort();
    const defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();

    const serviceLocation = runnableService.getContext().getLocation();
    if (checkTypes.not.string(serviceLocation) || checkTypes.not.unemptyString(serviceLocation)) {
        throw new Error('The location of the runnableService is not defined in its service context.');
    }

    if (serviceLocation === 'directory') {
        _registerServiceInDirectory(runnableService, serverPort, defaultDirectoryLocation);
    } else if (serviceLocation.substring(0, 12) === 'directory://') {
        const directoryLocation = `https://${serviceLocation.substring(12, serviceLocation.length)}`;
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
 * @return {Promise} - Promise that resolves with the service lookup information and rejects if an error occurs.
 */
module.exports.lookup = function lookup(callableService) {
    return new Promise((resolve, reject) => {
        if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
            const lookupError = new Error('The parameter callableService must be a CallableService object');
            lookupError.code = LOOKUP_ERROR;
            reject(lookupError);
            return;
        }

        const defaultDirectoryLocation = microrest.getDefaultDirectoryLocation();
        const serviceLocation = callableService.getContext().getLocation();
        if (checkTypes.not.string(serviceLocation) || checkTypes.not.unemptyString(serviceLocation)) {
            const lookupError1 = new Error('The location of the callableService is not defined in its service context.');
            lookupError1.code = LOOKUP_ERROR;
            reject(lookupError1);
            return;
        }

        if (serviceLocation === 'directory') {
            resolve(_lookupServiceInDirectory(callableService, defaultDirectoryLocation));
        } else if (serviceLocation.substring(0, 12) === 'directory://') {
            const directoryLocation = `https://${serviceLocation.substring(12, serviceLocation.length)}`;
            resolve(_lookupServiceInDirectory(callableService, directoryLocation));
        } else {
            const serviceLocationInfo = url.parse(serviceLocation);
            const serviceLookupInfo = {
                location: serviceLocationInfo.hostname,
                port: parseInt(serviceLocationInfo.port) || 433
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
            //The host of the server is not checked.
            //Avoid localhost problems
        }
    };

    client.send(request).then((response) => {
        if (checkTypes.not.assigned(response)) {
            delay(1000).then(() => _registerServiceInDirectory(runnableService, serverPort, directoryLocation));
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has not sent a response.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        const statusCode = response.getStatus();
        if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
            delay(1000).then(() => _registerServiceInDirectory(runnableService, serverPort, directoryLocation));
            logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response without status code.', runnableService.getIdentificationName(), directoryLocation);
            return;
        }

        if (statusCode !== 204) {
            delay(1000).then(() => _registerServiceInDirectory(runnableService, serverPort, directoryLocation));

            if (checkTypes.assigned(response.getStatusMessage())) {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s - %s.', runnableService.getIdentificationName(), directoryLocation, statusCode, response.getStatusMessage());
            } else {
                logger.warn('Retrying to register service %s in directory \'%s\', because the service directory has sent a response with status code %s.', runnableService.getIdentificationName(), directoryLocation, statusCode);
            }

            return;
        }

        logger.info('The service %s has been registered successfully in directory \'%s\'.', runnableService.getIdentificationName(), directoryLocation);
    }).catch((error) => {
        delay(1000).then(() => _registerServiceInDirectory(runnableService, serverPort, directoryLocation));
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
 * @return {Promise} - Promise that resolves with the service lookup information and rejects if an error occurs.
 */
function _lookupServiceInDirectory(callableService, directoryLocation) {
    return new Promise((resolve, reject) => {
        const directoryUrl = url.parse(directoryLocation);

        const name = callableService.getContext().getName();
        if (checkTypes.not.string(name) || checkTypes.not.unemptyString(name)) {
            const lookupError = new Error('The name of the callableService is not defined in its service context.');
            lookupError.code = LOOKUP_ERROR;
            reject(lookupError);
            return;
        }

        const api = callableService.getContext().getApi();
        if (checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
            const lookupError1 = new Error('The api of the callableService is not defined in its service context.');
            lookupError1.code = LOOKUP_ERROR;
            reject(lookupError1);
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
                //The host of the server is not checked.
                //Avoid localhost problems
            }
        };

        client.send(request).then((response) => {
            if (checkTypes.not.assigned(response)) {
                const lookupError3 = new Error('The service directory has not sent a response.');
                lookupError3.code = LOOKUP_ERROR;
                reject(lookupError3);
                return;
            }

            const statusCode = response.getStatus();
            if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
                const lookupError4 = new Error('The service directory has sent a response without status code.');
                lookupError4.code = LOOKUP_ERROR;
                reject(lookupError4);
                return;
            }

            if (statusCode !== 200) {
                let lookupError5;

                if (checkTypes.assigned(response.getStatusMessage())) {
                    lookupError5 = new Error(`The service directory has sent a response with status code ${statusCode} - ${response.getStatusMessage()}`);
                } else {
                    lookupError5 = new Error(`The service directory has sent a response with status code ${statusCode}.`);
                }

                lookupError5.code = LOOKUP_ERROR;
                reject(lookupError5);
                return;
            }

            const body = response.getBody();
            if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
                const lookupError6 = new Error('The service directory has sent a correct response, but without any information about the requested service.');
                lookupError6.code = LOOKUP_ERROR;
                reject(lookupError6);
                return;
            }

            if (checkTypes.not.string(body.location) || checkTypes.not.unemptyString(body.location)) {
                const lookupError7 = new Error('The service directory has sent a correct response, but without the location of the requested service.');
                lookupError7.code = LOOKUP_ERROR;
                reject(lookupError7);
                return;
            }

            if (checkTypes.not.integer(body.port) || checkTypes.not.positive(body.port)) {
                const lookupError8 = new Error('The service directory has sent a correct response, but without the port in which the requested service is listening.');
                lookupError8.code = LOOKUP_ERROR;
                reject(lookupError8);
                return;
            }

            resolve(body);
        }).catch((error) => {
            const lookupError2 = new Error(`${error.code} -> ${error.message}`);
            lookupError2.code = LOOKUP_ERROR;
            reject(lookupError2);
        });
    });
}
