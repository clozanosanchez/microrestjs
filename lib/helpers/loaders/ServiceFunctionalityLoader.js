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

const checkTypes = require('check-types');

const FileSystemError = require('../../errors/FileSystemError');

/**
 * Loads the service functionality from a JavaScript file.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceFunctionalityPath - Path where the service functionality file is.
 * @returns {Object} - The loaded service functionality.
 * @throws a TypeError if the serviceFunctionalityPath parameter is not a valid string.
 * @throws a FileSystemError if the service functionality file cannot be found.
 */
module.exports.loadServiceFunctionality = function loadServiceFunctionality(serviceFunctionalityPath) {
    if (checkTypes.not.string(serviceFunctionalityPath) || checkTypes.emptyString(serviceFunctionalityPath)) {
        throw new TypeError('The parameter servicesDescriptionPath must be a non-empty string.');
    }

    let serviceFunctionality = null;

    try {
        serviceFunctionality = require(serviceFunctionalityPath);
    } catch (exception) {
        throw new FileSystemError(`The service functionality file (${serviceFunctionalityPath}) does not exist or not have the correct permissions`);
    }

    return serviceFunctionality;
};
