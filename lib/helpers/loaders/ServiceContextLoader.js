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

const checkTypes = require('check-types');

const FileSystemError = require('../../errors/FileSystemError');
const SchemaError = require('../../errors/SchemaError');

/**
 * Loads the service context from the service description file.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceDescriptionPath - Path where the service description file is.
 * @returns {ServiceContext} - The loaded service context.
 * @throws a TypeError if the serviceDescriptionPath parameter is not a valid string.
 * @throws a FileSystemError if the service description file cannot be found.
 * @throws a SchemaError if the service description file does not respect the Microrestjs Service Description Specification.
 */
module.exports.loadServiceContext = function loadServiceContext(serviceDescriptionPath) {
    if (checkTypes.not.string(serviceDescriptionPath) || checkTypes.emptyString(serviceDescriptionPath)) {
        throw new TypeError('The parameter servicesDescriptionPath must be a non-empty string.');
    }

    let serviceContextData = null;

    try {
        serviceContextData = require(serviceDescriptionPath);
    } catch (exception) {
        throw new FileSystemError(`The service description file (${serviceDescriptionPath}) does not exist or not have the correct permissions`);
    }

    const checkSchema = require('../schemas/CheckSchema');
    const serviceDescriptionSchema = require('../schemas/ServiceDescriptionSchema.json');
    try {
        checkSchema.check(serviceDescriptionSchema, serviceContextData);
    } catch (exception) {
        throw new SchemaError(`The service description file (${serviceDescriptionPath}) does not respect the Service Description Specification because: ${exception}`);
    }

    const ServiceContext = require('../../services/ServiceContext');
    const serviceContext = new ServiceContext(serviceContextData);

    return serviceContext;
};
