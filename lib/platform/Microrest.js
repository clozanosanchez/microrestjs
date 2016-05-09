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

const checkTypes = require('check-types');
const delay = require('delay');

const credentialsGenerator = require('../helpers/security/CredentialsGenerator');
const Server = require('./Server').Server;
const ServiceManager = require('./ServiceManager').ServiceManager;
const client = require('./Client');

/**
 * Port where the server is listening.
 *
 * @private
 * @constant
 */
let port = 0;

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
let defaultDirectoryLocation = '';

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
 * Microrest allows configuring and running the Microrestjs Framework.
 *
 * @public
 * @class
 */
module.exports.Microrest = class Microrest {

    /**
     * Constructor of Microrest.
     *
     * @public
     * @constructor
     */
    constructor() {
        //Initializes the internal state
        this.configuration = require('../helpers/loaders/ConfigurationLoader').loadConfiguration();
        require('../helpers/logging/LoggerManager').configure(this.configuration.logger);

        port = this.configuration.server.port;
        defaultDirectoryLocation = this.configuration.directory.location;

        //Generates the platform credentials asynchronously.
        this.platformCredentials = null;
        credentialsGenerator.generateCredentials().then((credentials) => {
            this._storeCredentials(credentials);
        }).catch((error) => {
            throw new Error(`The platform credentials could not be generated, because ${error.message}`);
        });

        this.server = new Server();
        this.serviceManager = new ServiceManager();

        //Initializes, deploys and registers all the services
        this.serviceManager.loadServices(this.configuration.services.path);
        this.serviceManager.deployServices(this.server);
        this.serviceManager.registerServices();
    }

    /**
     * Stores the generated credentials as the credentials of the platform.
     *
     * @private
     * @function
     * @param {Object} credentials - Credentials of the platform to be stored.
     */
    _storeCredentials(credentials) {
        if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
            checkTypes.not.string(credentials.key) || checkTypes.not.unemptyString(credentials.key) ||
            checkTypes.not.string(credentials.certificate) || checkTypes.not.unemptyString(credentials.certificate)) {
            throw new Error('The generated platform credentials are not correct, because either the key or the certificate is not present.');
        }

        this.platformCredentials = credentials;
    }

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
    _publishCredentials() {
        if (checkTypes.not.object(this.platformCredentials) || checkTypes.emptyObject(this.platformCredentials) ||
            checkTypes.not.string(this.platformCredentials.key) || checkTypes.not.unemptyString(this.platformCredentials.key) ||
            checkTypes.not.string(this.platformCredentials.certificate) || checkTypes.not.unemptyString(this.platformCredentials.certificate)) {
            return false;
        }

        this.server.addPlatformCredentials(this.platformCredentials);
        this.serviceManager.addCertificateToServices(this.platformCredentials.certificate);
        client.addPlatformCredentials(this.platformCredentials);

        return true;
    }

    /**
     * Runs the registered services.
     *
     * @public
     * @function
     */
    run() {
        const areCredentialsPublished = this._publishCredentials();
        if (areCredentialsPublished !== true) {
            delay(1000).then(() => this.run());
            return;
        }

        this.server.listen(this.configuration.server.port);
    }

    /**
     * Stops and shuts down the whole platform gracefully.
     *
     * @public
     * @function
     */
    shutdown() {
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
    }
};
