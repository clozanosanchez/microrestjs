'use strict';

/**
 * Loads the configuration of Microrestjs Framework
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const FileSystemError = require('../../errors/FileSystemError');
const SchemaError = require('../../errors/SchemaError');

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

    const checkSchema = require('../schemas/CheckSchema');
    const configurationSchema = require('../schemas/ConfigurationSchema.json');
    try {
        checkSchema.check(configurationSchema, configuration);
    } catch (exception) {
        throw new SchemaError(`The configuration file of Microrestjs does not respect the Microrestjs Configuration Specification because: ${exception}`);
    }

    return configuration;
};
