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
var checkTypes = require('check-types');

/**
 * Port where the server is listening.
 *
 * @private
 * @constant
 */
var port = 0;

/**
 * Gets the port where the server is listening.
 *
 * @public
 * @static
 * @function
 * @returns {Integer} - Port where the server is listening.
 */
module.exports.getServerPort = function getServerPort() {
    return port;
};

/**
 * Location of the default service directory
 *
 * @private
 * @constant
 */
var defaultDirectoryLocation = '';

/**
 * Gets the location of the default service directory.
 *
 * @public
 * @static
 * @function
 * @returns {String} - Location of the default service directory.
 */
module.exports.getDefaultDirectoryLocation = function getDefaultDirectoryLocation() {
    return defaultDirectoryLocation;
};

/**
 * Gets a new instance of Microrest class.
 *
 * @public
 * @static
 * @function
 * @returns {Microrest} - Microrest instance.
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

    port = this.configuration.server.port;
    defaultDirectoryLocation = this.configuration.directory.location;

    this.server = require('./Server').getInstance();
    this.serviceManager = require('./ServiceManager').getInstance();

    //Initializes, deploys and registers all the services
    this.serviceManager.loadServices(this.configuration.services.path);
    this.serviceManager.deployServices(this.server);
    this.serviceManager.registerServices();
}

/**
 * Runs the registered services.
 *
 * @public
 * @function
 */
Microrest.prototype.run = function run() {
    if (!this.serviceManager.areAllServicesReady()) {
        setTimeout(run.bind(this), 1000);
        return;
    }

    this.server.listen(this.configuration.server.port);
};

/**
 * Stops and shuts down the whole platform gracefully.
 *
 * @public
 * @function
 */
Microrest.prototype.shutdown = function shutdown() {
    if (checkTypes.assigned(this.server)) {
        this.server.shutdown();
    }

    if (checkTypes.assigned(this.serviceManager)) {
        this.serviceManager.shutdown();
    }

    this.configuration = null;
    this.server = null;
    this.serviceManager = null;

    port = 0;
    defaultDirectoryLocation = '';
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
