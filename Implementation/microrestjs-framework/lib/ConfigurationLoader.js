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

var configurationSchema = require('./schemas/ConfigurationSchema.json');
var checkSchema = require('./utils/CheckSchema');

/**
 * Loads the configuration file of Microrestjs Framework.
 *
 * @public
 * @static
 * @returns {Object} - The configuration as an object.
 * @throws an Error if the configuration file cannot be found.
 * @throws an Error if the configuration is not valid because the Microrestjs Configuration Specification
 *         is not respected.
 */
module.exports.loadConfiguration = function loadConfiguration() {
    var configuration = null;

    try {
        configuration = require('../configuration.json');
    } catch (exception) {
        throw new Error('The configuration file of microrestjs does not exist' +
                        'or not have the correct permissions');
    }

    try {
        checkSchema.check(configurationSchema, configuration);
    } catch (exception) {
        throw new Error('The configuration file of microrestjs does not respect the ' +
                        'Microrestjs Configuration Specification bacause: ' + exception);
    }

    return configuration;
};
