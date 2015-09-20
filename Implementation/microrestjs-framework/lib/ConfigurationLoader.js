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
 * @function
 * @returns {Object} - The configuration as an object.
 * @throws an Error if the configuration file cannot be found.
 * @throws an Error if the configuration does not respect the Microrestjs Configuration Specification.
 */
module.exports.loadConfiguration = function loadConfiguration() {
    var configuration = null;

    try {
        configuration = require('../configuration.json');
    } catch (exception) {
        throw new Error('The configuration file of Microrestjs does not exist or not have the correct permissions');
    }

    try {
        checkSchema.check(configurationSchema, configuration);
    } catch (exception) {
        throw new Error('The configuration file of Microrestjs does not respect the Microrestjs Configuration Specification because: ' + exception);
    }

    return configuration;
};
