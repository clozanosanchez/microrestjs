'use strict';

/**
 * Manages the services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const fs = require('fs');
const checkTypes = require('check-types');
const isDirectory = require('is-dir');

const loggerManager = require('../helpers/logging/LoggerManager');

const FileSystemError = require('../errors/FileSystemError');

/**
 * ServiceManager allows managing the services of Microrestjs Framework.
 *
 * @public
 * @class
 */
module.exports = class ServiceManager {
    /**
     * Constructor of ServiceManager.
     *
     * @public
     * @constructor
     */
    constructor() {
        // Initializes the internal state
        this.logger = loggerManager.getLogger('ServiceManager');
        this.services = {};
    }

    /**
     * Loads all the services of the specified path.
     *
     * If any service has a problem to be loaded, such service will be skipped.
     *
     * @public
     * @function
     * @param {String} servicesRootPath - Path that contains the services to be loaded.
     * @throws a TypeError if the servicesRootPath parameter is not a valid string.
     * @throws a FileSystemError if the servicesRootPath does not exist.
     * @throws a FileSystemError if the servicesRootPath is not a directory.
     * @throws a FileSystemError if the servicesRootPath cannot be read.
     */
    loadServices(servicesRootPath) {
        if (checkTypes.not.string(servicesRootPath) || checkTypes.emptyString(servicesRootPath)) {
            throw new TypeError('The parameter servicesPath must be a non-empty string.');
        }

        let realServicesRootPath = '';
        try {
            realServicesRootPath = fs.realpathSync(servicesRootPath);
        } catch (exception) {
            throw new FileSystemError(`The path ('${servicesRootPath}') defined in the property 'services.path' of the configuration file does not exist.`);
        }

        const isRealServicesRoothPathDirectory = isDirectory(realServicesRootPath);
        if (isRealServicesRoothPathDirectory === false) {
            throw new FileSystemError(`The path ('${servicesRootPath}') defined in the property 'services.path' of the configuration file is not a directory.`);
        }

        let servicesNames = [];
        try {
            servicesNames = fs.readdirSync(realServicesRootPath);
        } catch (exception) {
            throw new FileSystemError(`The path ('${servicesRootPath}') defined in the property 'services.path' of the configuration file cannot be read. Check if the permissions are correct.`);
        }

        const services = this._loadAllServices(realServicesRootPath, servicesNames);

        this.services = services;
    }

    /**
     * Deploys all the loaded services in a server.
     *
     * @public
     * @function
     * @param {Server} server - Server where the services have to be deployed.
     * @throws a TypeError if the server parameter is not a valid Server object.
     */
    deployServices(server) {
        const Server = require('./Server');
        if (checkTypes.not.object(server) || checkTypes.not.instanceStrict(server, Server)) {
            throw new TypeError('The parameter server must be a Server object');
        }

        for (const service of Object.keys(this.services)) {
            server.route(this.services[service]);
        }
    }

    /**
     * Registers all of them into the Service Directory.
     *
     * @public
     * @function
     */
    registerServices() {
        for (const service of Object.keys(this.services)) {
            const serviceDirectoryProxy = require('../helpers/proxies/ServiceDirectoryProxy');
            serviceDirectoryProxy.register(this.services[service]);
        }
    }

    /**
     * Add the certificate to all the services.
     *
     * @public
     * @function
     * @param {String} certificate - Certificate to be added.
     * @throws a TypeError if the certificate parameter is not a valid SSL certificate.
     */
    addCertificateToServices(certificate) {
        if (checkTypes.not.string(certificate) || checkTypes.emptyString(certificate)) {
            throw new TypeError('The parameter certificate must be a valid SSL certificate');
        }

        for (const service of Object.keys(this.services)) {
            this.services[service].certificate = certificate;
        }
    }

    /**
     * Stops and shuts down all the services gracefully.
     *
     * @public
     * @function
     */
    shutdown() {
        if (checkTypes.assigned(this.services)) {
            for (const service of Object.keys(this.services)) {
                if (checkTypes.object(this.services[service]) && checkTypes.function(this.services[service].onDestroyService)) {
                    this.services[service].onDestroyService();
                }

                this.services[service].certificate = null;
                this.services[service] = null;
            }
        }

        this.services = null;
    }

    /**
     * Loads all the services that are specified in the arguments.
     *
     * If any service has a problem to be loaded, such service will be skipped.
     *
     * @private
     * @function
     * @param {String} servicesRootPath - Path that contains the services to be loaded.
     * @param {String[]} servicesNames - Names of the services to be loaded.
     * @returns {Object} - All the loaded services; {}, if there are not services.
     */
    _loadAllServices(servicesRootPath, servicesNames) {
        const allServices = {};

        for (const specificServiceName of servicesNames) {
            const specificServicePath = `${servicesRootPath}/${specificServiceName}`;

            const runnableServiceFactory = require('../helpers/factories/RunnableServiceFactory');
            const specificService = runnableServiceFactory.createService(specificServiceName, specificServicePath);
            const RunnableService = require('../services/RunnableService');
            if (checkTypes.assigned(specificService) && checkTypes.object(specificService) && checkTypes.instanceStrict(specificService, RunnableService)) {
                const identificationName = specificService.getIdentificationName();
                allServices[identificationName] = specificService;
                this.logger.info('The service %s has been loaded successfully.', identificationName);
            }
        }

        return allServices;
    }
};
