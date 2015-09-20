'use strict';

/**
 * Loads the service context from the service description file.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var serviceDescriptionSchema = require('./schemas/ServiceDescriptionSchema.json');
var checkSchema = require('./utils/CheckSchema');

/**
 * Loads the service context from the service description file.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceDescriptionPath - Path where the service description file is.
 * @returns {Object} - The loaded service context.
 * @throws an Error if the serviceDescriptionPath parameter is not a valid string.
 * @throws an Error if the service description file cannot be found.
 * @throws an Error if the service description file does not respect the Microrestjs Service Description Specification.
 */
module.exports.loadServiceContext = function loadServiceContext(serviceDescriptionPath) {
    if (checkTypes.not.string(serviceDescriptionPath) || checkTypes.not.unemptyString(serviceDescriptionPath)) {
        throw new Error('The parameter servicesDescriptionPath must be a non-empty string.');
    }

    var serviceContext = null;

    try {
        serviceContext = require(serviceDescriptionPath);
    } catch (exception) {
        throw new Error('The service description file (' + serviceDescriptionPath +
                        ') does not exist or not have the correct permissions');
    }

    try {
        checkSchema.check(serviceDescriptionSchema, serviceContext);
    } catch (exception) {
        throw new Error('The service description file (' + serviceDescriptionPath + ') does not respect ' +
                        'the Service Description Specification because: ' + exception);
    }

    return serviceContext;
};
