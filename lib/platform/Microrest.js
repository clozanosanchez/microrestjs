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

var checkTypes = require('check-types');

var credentialsGenerator = require('../helpers/security/CredentialsGenerator');
var client = require('./Client');

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
    this.configuration = require('../helpers/loaders/ConfigurationLoader').loadConfiguration();
    require('../helpers/logging/LoggerManager').configure(this.configuration.logger);

    port = this.configuration.server.port;
    defaultDirectoryLocation = this.configuration.directory.location;

    //Generates the platform credentials asynchronously.
    this.platformCredentials = null;
    credentialsGenerator.generateCredentials(this._getStoreCredentialsFunction());

    this.server = require('./Server').getInstance();
    this.serviceManager = require('./ServiceManager').getInstance();

    //Initializes, deploys and registers all the services
    this.serviceManager.loadServices(this.configuration.services.path);
    this.serviceManager.deployServices(this.server);
    this.serviceManager.registerServices();
}

/**
 * Gets the function to store the generated credentials as the credentials of the platform.
 *
 * @private
 * @function
 * @returns {Function} - Function that stores the generated credentials of the platform.
 */
Microrest.prototype._getStoreCredentialsFunction = function _getStoreCredentialsFunction() {
    var _this = this;

    return function _storeCredentials(error, credentials) {
        if (checkTypes.assigned(error)) {
            throw new Error('The platform credentials could not be generated, because ' + error.message);
        }

        if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
            checkTypes.not.string(credentials.key) || checkTypes.not.unemptyString(credentials.key) ||
            checkTypes.not.string(credentials.certificate) || checkTypes.not.unemptyString(credentials.certificate)) {
            throw new Error('The generated platform credentials are not correct, because either the key or the certificate is not present.');
        }

        _this.platformCredentials = credentials;
    };
};

/**
 * Publishes the credentials of the platform in:
 *    - the Server to listen SSL requests.
 *    - the Client to make SSL requests.
 *    - the RunnableServices to know their certificate.
 *
 * @private
 * @function
 * @returns {Boolean} - true, if the credentials have been published; false, otherwise.
 */
Microrest.prototype._publishCredentials = function _publishCredentials() {
    if (checkTypes.not.object(this.platformCredentials) || checkTypes.emptyObject(this.platformCredentials) ||
        checkTypes.not.string(this.platformCredentials.key) || checkTypes.not.unemptyString(this.platformCredentials.key) ||
        checkTypes.not.string(this.platformCredentials.certificate) || checkTypes.not.unemptyString(this.platformCredentials.certificate)) {
        return false;
    }

    this.server.addPlatformCredentials(this.platformCredentials);
    this.serviceManager.addCertificateToServices(this.platformCredentials.certificate);
    client.addPlatformCredentials(this.platformCredentials);

    return true;
};

/**
 * Runs the registered services.
 *
 * @public
 * @function
 */
Microrest.prototype.run = function run() {
    var areCredentialsPublished = this._publishCredentials();
    if (areCredentialsPublished !== true) {
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

    client.cleanPlatformCredentials();

    this.configuration = null;
    this.platformCredentials = null;
    this.server = null;
    this.serviceManager = null;

    port = 0;
    defaultDirectoryLocation = '';
};
