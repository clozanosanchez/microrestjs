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

const checkTypes = require('check-types');

const client = require('../../platform/Client');

const RETRIEVE_ERROR = 'RETRIEVE_ERROR';

/**
 * Retrieves the Service Information of a CallableService.
 *
 * @public
 * @static
 * @function
 * @param {CallableService} callableService - CallableService from which its Service Information is desired.
 * @return {Promise} - Promise that resolves with the service information of the CallableService and rejects if an error occurs.
 */
module.exports.retrieveServiceInformation = function retrieveServiceInformation(callableService) {
    return new Promise((resolve, reject) => {
        if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
            const retrieveError = new Error('The parameter callableService must be a CallableService object');
            retrieveError.code = RETRIEVE_ERROR;
            reject(retrieveError);
            return;
        }

        if (checkTypes.not.object(callableService.realService) || checkTypes.emptyObject(callableService.realService) ||
            checkTypes.not.string(callableService.realService.location) || checkTypes.not.unemptyString(callableService.realService.location) ||
            checkTypes.not.integer(callableService.realService.port) || checkTypes.not.positive(callableService.realService.port)) {
            const retrieveError1 = new Error('Either the location or the port of the service in unknown');
            retrieveError1.code = RETRIEVE_ERROR;
            reject(retrieveError1);
            return;
        }

        resolve(_retrieveServiceInformation(callableService));
    });
};

/**
 * Sends the retrieveServiceInformation request to the CallableService and preprocesses the response.
 *
 * @private
 * @function
 * @param {CallableService} callableService - CallableService from which its Service Information is desired.
 * @return {Promise} - Promise that resolves with the service information of the CallableService and rejects if an error occurs.
 */
function _retrieveServiceInformation(callableService) {
    return new Promise((resolve, reject) => {
        const completePath = `/${callableService.getIdentificationName()}`;

        const request = {
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

        client.send(request).then((response) => {
            if (checkTypes.not.assigned(response)) {
                const retrieveError3 = new Error('The service has not sent a response with its information.');
                retrieveError3.code = RETRIEVE_ERROR;
                reject(retrieveError3);
                return;
            }

            const statusCode = response.getStatus();
            if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
                const retrieveError4 = new Error('The service has sent a response without status code.');
                retrieveError4.code = RETRIEVE_ERROR;
                reject(retrieveError4);
                return;
            }

            if (statusCode !== 200) {
                let retrieveError5;

                if (checkTypes.assigned(response.getStatusMessage())) {
                    retrieveError5 = new Error(`The service has sent a response with status code ${statusCode} - ${response.getStatusMessage()}`);
                } else {
                    retrieveError5 = new Error(`The service has sent a response with status code ${statusCode}.`);
                }

                retrieveError5.code = RETRIEVE_ERROR;
                reject(retrieveError5);
                return;
            }

            const body = response.body;
            if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
                const retrieveError6 = new Error('The service has sent a correct response, but without any information about itself.');
                retrieveError6.code = RETRIEVE_ERROR;
                reject(retrieveError6);
                return;
            }

            if (checkTypes.not.object(body.serviceContext) || checkTypes.emptyObject(body.serviceContext)) {
                const retrieveError7 = new Error('The service has sent a correct response, but without its service context.');
                retrieveError7.code = RETRIEVE_ERROR;
                reject(retrieveError7);
                return;
            }

            if (checkTypes.not.string(body.certificate) || checkTypes.not.unemptyString(body.certificate)) {
                const retrieveError8 = new Error('The service has sent a correct response, but without its certificate.');
                retrieveError8.code = RETRIEVE_ERROR;
                reject(retrieveError8);
                return;
            }

            resolve(body);
        }).catch((error) => {
            const retrieveError2 = new Error(`${error.code} -> ${error.message}`);
            retrieveError2.code = RETRIEVE_ERROR;
            reject(retrieveError2);
        });
    });
}
