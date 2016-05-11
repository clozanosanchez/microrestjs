'use strict';

/**
 * Configures and runs the Microrestjs Framework.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const delay = require('delay');

const loggerManager = require('../helpers/logging/LoggerManager');

/**
 * Port where the server is listening.
 *
 * @private
 * @constant
 */
let port = 0;

/**
 * Location of the default service directory
 *
 * @private
 * @constant
 */
let defaultDirectoryLocation = '';

/**
 * Microrest allows configuring and running the Microrestjs Framework.
 *
 * @public
 * @class
 */
module.exports = class Microrest {

    /**
     * Constructor of Microrest.
     *
     * @public
     * @constructor
     */
    constructor() {
        //Initializes the internal state
        this.configuration = require('../helpers/loaders/ConfigurationLoader').loadConfiguration();
        loggerManager.configure(this.configuration.logger);

        port = this.configuration.server.port;
        defaultDirectoryLocation = this.configuration.directory.location;

        //Generates the platform credentials asynchronously.
        this.platformCredentials = null;
        const credentialsGenerator = require('../helpers/security/CredentialsGenerator');
        credentialsGenerator.generateCredentials().then((credentials) => {
            this._storeCredentials(credentials);
        }).catch((error) => {
            console.error(new Error(`The platform credentials could not be generated, because ${error.message}`));
            this.shutdown();
            process.exit(0);
        });

        const Server = require('./Server');
        this.server = new Server();

        const ServiceManager = require('./ServiceManager');
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
     * @throws a TypeError if the credentials parameter is not a valid object.
     */
    _storeCredentials(credentials) {
        if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
            checkTypes.not.string(credentials.key) || checkTypes.emptyString(credentials.key) ||
            checkTypes.not.string(credentials.certificate) || checkTypes.emptyString(credentials.certificate)) {
            throw new TypeError('The generated platform credentials are not correct, because either the key or the certificate is not present.');
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
            checkTypes.not.string(this.platformCredentials.key) || checkTypes.emptyString(this.platformCredentials.key) ||
            checkTypes.not.string(this.platformCredentials.certificate) || checkTypes.emptyString(this.platformCredentials.certificate)) {
            return false;
        }

        this.server.addPlatformCredentials(this.platformCredentials);
        this.serviceManager.addCertificateToServices(this.platformCredentials.certificate);

        const client = require('./Client');
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

        const client = require('./Client');
        client.cleanPlatformCredentials();

        this.configuration = null;
        this.platformCredentials = null;
        this.server = null;
        this.serviceManager = null;

        port = 0;
        defaultDirectoryLocation = '';
    }

    /**
     * Gets the port where the server is listening.
     *
     * @public
     * @static
     * @function
     * @returns {Integer} - Port where the server is listening.
     */
    static getServerPort() {
        return port;
    }

    /**
     * Gets the location of the default service directory.
     *
     * @public
     * @static
     * @function
     * @returns {String} - Location of the default service directory.
     */
    static getDefaultDirectoryLocation() {
        return defaultDirectoryLocation;
    }
};
