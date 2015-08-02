'use strict';

/**
 * Configures and runs the Microrestjs Framework.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var winston = require('winston');

/**
 * Gets a new instance of Microrest class.
 *
 * @public
 * @static
 * @function
 * @returns {Microrest} - Micorest instance.
 */
module.exports.getInstance = function getInstance() {
    return new Microrest();
};

/**
 * Microrest allows configuring and running the Microrestjs Framework.
 *
 * @class
 */
function Microrest() {
    //Initializes the internal state
    this.configuration = require('./ConfigurationLoader').loadConfiguration();
    _configureLogger(this.configuration.logger);

    this.server = require('./Server').getInstance();
    this.serviceManager = require('./ServiceManager').getInstance();

    //Initializes and deploy all the services
    this.serviceManager.loadServices(this.configuration.services.path);
    this.serviceManager.registerServices(this.server);
}

/**
 * Runs the registered services.
 *
 * @public
 * @function
 */
Microrest.prototype.run = function run() {
    this.server.listen(this.configuration.server.port);
};

/**
 * Configures the Winston logger used by the Microrestjs Framework
 *
 * @private
 * @function
 */
function _configureLogger(loggerConfiguration) {
    if (loggerConfiguration.enable === false) {
        winston.loggers.options.transports = [
            new (winston.transports.Console)({
                level: 'none'
            })
        ];
    } else {
        winston.loggers.options.transports = [
            new (winston.transports.Console)({
                level: loggerConfiguration.level
            })
        ];
    }
}
