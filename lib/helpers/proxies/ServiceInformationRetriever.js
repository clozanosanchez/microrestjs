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

const RetrieveError = require('../../errors/RetrieveError');

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
        const CallableService = require('../../services/CallableService');
        if (checkTypes.not.object(callableService) || checkTypes.not.instanceStrict(callableService, CallableService)) {
            reject(new TypeError('The parameter callableService must be a CallableService object'));
            return;
        }

        if (checkTypes.not.object(callableService.realService) || checkTypes.emptyObject(callableService.realService) ||
            checkTypes.not.string(callableService.realService.location) || checkTypes.emptyString(callableService.realService.location) ||
            checkTypes.not.integer(callableService.realService.port) || checkTypes.not.positive(callableService.realService.port)) {
            reject(new RetrieveError('Either the location or the port of the service in unknown'));
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

        const client = require('../../platform/Client');
        client.send(request).then((response) => {
            if (checkTypes.not.assigned(response)) {
                reject(new RetrieveError('The service has not sent a response with its information.'));
                return;
            }

            const statusCode = response.getStatus();
            if (checkTypes.not.integer(statusCode) || checkTypes.not.positive(statusCode)) {
                reject(new RetrieveError('The service has sent a response without status code.'));
                return;
            }

            if (statusCode !== 200) {
                let messageError = '';
                if (checkTypes.assigned(response.getStatusMessage())) {
                    messageError = `The service has sent a response with status code ${statusCode} - ${response.getStatusMessage()}`;
                } else {
                    messageError = `The service has sent a response with status code ${statusCode}.`;
                }

                reject(new RetrieveError(messageError));
                return;
            }

            const body = response.body;
            if (checkTypes.not.object(body) || checkTypes.emptyObject(body)) {
                reject(new RetrieveError('The service has sent a correct response, but without any information about itself.'));
                return;
            }

            if (checkTypes.not.object(body.serviceContext) || checkTypes.emptyObject(body.serviceContext)) {
                reject(new RetrieveError('The service has sent a correct response, but without its service context.'));
                return;
            }

            if (checkTypes.not.string(body.certificate) || checkTypes.emptyString(body.certificate)) {
                reject(new RetrieveError('The service has sent a correct response, but without its certificate.'));
                return;
            }

            resolve(body);
        }).catch((error) => {
            reject(new RetrieveError(`${error.code} -> ${error.message}`));
        });
    });
}
