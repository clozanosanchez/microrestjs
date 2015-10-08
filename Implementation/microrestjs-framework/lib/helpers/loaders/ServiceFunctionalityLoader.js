'use strict';

/**
 * Loads the service functionality from a JavaScript file.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

/**
 * Loads the service functionality from a JavaScript file.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceFunctionalityPath - Path where the service functionality file is.
 * @returns {Object} - The loaded service functionality.
 * @throws an Error if the serviceFunctionalityPath parameter is not a valid string.
 * @throws an Error if the service functionality file cannot be found.
 */
module.exports.loadServiceFunctionality = function loadServiceFunctionality(serviceFunctionalityPath) {
    if (checkTypes.not.string(serviceFunctionalityPath) || checkTypes.not.unemptyString(serviceFunctionalityPath)) {
        throw new Error('The parameter servicesDescriptionPath must be a non-empty string.');
    }

    var serviceFunctionality = null;

    try {
        serviceFunctionality = require(serviceFunctionalityPath);
    } catch (exception) {
        throw new Error('The service functionality file (' + serviceFunctionalityPath +
                        ') does not exist or not have the correct permissions');
    }

    return serviceFunctionality;
};