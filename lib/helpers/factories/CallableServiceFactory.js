'use strict';

/**
 * Factory to create Runnable Services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

const ServiceContext = require('../../services/ServiceContext').ServiceContext;
const CallableService = require('../../services/CallableService').CallableService;

/**
 * Creates a CallableService instance.
 *
 * @public
 * @static
 * @function
 * @param {String} name - Name of the callable service to be instantiated.
 * @param {Integer} api - API number of the callable service to be instantiated
 * @param {String} location - Location of the callable service to be instantiated
 * @returns {CallableService} - The CallableService instance.
 * @throws an Error if the name parameter is an empty string.
 * @throws an Error if the api parameter is not a positive integer.
 * @throws an Error if the location parameter is an empty string.
 */
module.exports.getService = function getService(name, api, location) {
    if (checkTypes.not.string(name) || checkTypes.not.unemptyString(name)) {
        throw new Error('The parameter name must be a non-empty string.');
    }

    if (checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
        throw new Error('The parameter api must be a positive integer number.');
    }

    if (checkTypes.not.string(location) || checkTypes.not.unemptyString(location)) {
        throw new Error('The parameter location must be a non-empty string.');
    }

    const serviceContextData = {
        info: {
            name: name,
            api: api
        },
        config: {
            location: location
        }
    };

    const serviceContext = new ServiceContext(serviceContextData);

    const callableService = _instantiateCallableService(serviceContext);

    return callableService;
};

/**
 * Instantiates a CallableService.
 *
 * @private
 * @function
 * @param {ServiceContext} serviceContext - Context of the service to be instantiated
 * @returns {CallableService} - The CallableService instance
 */
function _instantiateCallableService(serviceContext) {
    const callableService = new CallableService(serviceContext);

    return callableService;
}
