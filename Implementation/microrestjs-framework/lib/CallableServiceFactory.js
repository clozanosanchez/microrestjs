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

var checkTypes = require('check-types');

/**
 * Creates a CallableService instance.
 *
 * @public
 * @static
 * @function
 * @param {String} name - Name of the callable service to be instanciated.
 * @param {Integer} api - API number of the callable service to be instanciated
 * @param {String} url - Location of the callable service to be instanciated
 * @returns {Object} - The CallableService instance.
 * @throws an Error if the name parameter is not valid.
 * @throws an Error if the api parameter is not valid.
 * @throws an Error if the url parameter is not valid.
 */
module.exports.getService = function getService(name, api, url) {
    if (checkTypes.not.assigned(name) || checkTypes.not.string(name) || checkTypes.not.unemptyString(name)) {
        throw new Error('The parameter name must be a non-empty string.');
    }

    if (checkTypes.not.assigned(api) || checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
        throw new Error('The parameter api must be a positive integer number.');
    }

    if (checkTypes.not.assigned(url) || checkTypes.not.string(url) || checkTypes.not.unemptyString(url)) {
        throw new Error('The parameter name must be a non-empty string.');
    }

    var serviceContext = {
        info: {
            name: name,
            api: api
        },
        config: {
            location: url
        }
    };

    var callableService = _instantiateCallableService(serviceContext);

    return callableService;
};

/**
 * Instantiates a CallableService.
 *
 * @private
 * @function
 * @param {Object} serviceContext - Context of the service to be instantiated
 * @returns {Object} - The CallableService instance
 */
function _instantiateCallableService(serviceContext) {
    var callableService = require('./CallableService').getInstance(serviceContext);

    return callableService;
}
