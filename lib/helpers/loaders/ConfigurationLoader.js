'use strict';

/**
 * Loads the configuration of Microrestjs Framework
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const configurationSchema = require('../schemas/ConfigurationSchema.json');
const checkSchema = require('../schemas/CheckSchema');
const FileSystemError = require('../../errors/FileSystemError').FileSystemError;
const SchemaError = require('../../errors/SchemaError').SchemaError;

/**
 * Loads the configuration file of Microrestjs Framework.
 *
 * @public
 * @static
 * @function
 * @returns {Object} - The configuration as an object.
 * @throws a FileSystemError if the configuration file cannot be found.
 * @throws a SchemaError if the configuration does not respect the Microrestjs Configuration Specification.
 */
module.exports.loadConfiguration = function loadConfiguration() {
    let configuration = null;

    try {
        configuration = require(`${process.cwd()}/configuration.json`);
    } catch (exception) {
        throw new FileSystemError('The configuration file of Microrestjs does not exist or not have the correct permissions');
    }

    try {
        checkSchema.check(configurationSchema, configuration);
    } catch (exception) {
        throw new SchemaError(`The configuration file of Microrestjs does not respect the Microrestjs Configuration Specification because: ${exception}`);
    }

    return configuration;
};
