'use strict';

/**
 * Manages the services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var fs = require('fs');
var checkTypes = require('check-types');
var logger = require('winston').loggers.get('ServiceManager');

var checkDirectory = require('./utils/CheckDirectory');
var runnableServiceFactory = require('./RunnableServiceFactory');
var serviceDirectoryProxy = require('./ServiceDirectoryProxy');

/**
 * Get a new instance of ServiceManager class.
 *
 * @public
 * @static
 * @function
 * @returns {ServiceManager} - ServiceManager instance.
 */
module.exports.getInstance = function getInstance() {
    return new ServiceManager();
};

/**
 * ServiceManager allows managing the services of Microrestjs Framework.
 *
 * @class
 */
function ServiceManager() {
    //Initializes the internal state
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
 * @throws an Error if the servicesRootPath parameter is not a valid string.
 * @throws an Error if the servicesRootPath does not exist.
 * @throws an Error if the servicesRootPath is not a directory.
 * @throws an Error if the servicesRootPath cannot be read. 
 */
ServiceManager.prototype.loadServices = function loadServices(servicesRootPath) {
    if (checkTypes.not.string(servicesRootPath) || checkTypes.not.unemptyString(servicesRootPath)) {
        throw new Error('The parameter servicesPath must be a non-empty string.');
    }

    var realServicesRootPath = '';
    try {
        realServicesRootPath = fs.realpathSync(servicesRootPath);
    } catch (exception) {
        throw new Error('The path (\'' + servicesRootPath + '\') defined in the property \'services.path\' of the configuration file does not exist.');
    }

    var isRealServicesRoothPathDirectory = checkDirectory.isDirectorySync(realServicesRootPath);
    if (!isRealServicesRoothPathDirectory) {
        throw new Error('The path (\'' + servicesRootPath + '\') defined in the property \'services.path\' of the configuration file is not a directory.');
    }

    var servicesNames = [];
    try {
        servicesNames = fs.readdirSync(realServicesRootPath);
    } catch (exception) {
        throw new Error('The path (\'' + servicesRootPath + '\') defined in the property \'services.path\' of the configuration file cannot be read. Check if the permissions are correct.');
    }

    var services = _loadAllServices(realServicesRootPath, servicesNames);

    this.services = services;
};

/**
 * Deploys all the loaded services in a server.
 *
 * @public
 * @function
 * @param {Server} server - Server where the services have to be deployed.
 * @throws an Error if the server parameter is not a valid Server object.
 */
ServiceManager.prototype.deployServices = function deployServices(server) {
    if (checkTypes.not.object(server) || checkTypes.emptyObject(server)) {
        //TODO: Improve the condition. Check if is a Server instance.
        throw new Error('The parameter server must be a Server object');
    }

    var services = this.services;
    for (var service in services) {
        //Delegates, in the service, the addition of its certificates to the server
        services[service].addServiceCredentialsToServer(server.addServiceCredentialsToServer.bind(server));

        //Delegates, in the server, the routing of the service
        server.route(services[service]);
    }
};

/**
 * Registers all of them into the Service Directory.
 *
 * @public
 * @function
 */
ServiceManager.prototype.registerServices = function registerServices() {
    var services = this.services;
    for (var service in services) {
        serviceDirectoryProxy.register(services[service]);
    }
};

/**
 * Stops and shuts down all the services gracefully.
 *
 * @public
 * @function
 */
ServiceManager.prototype.shutdown = function shutdown() {
    var services = this.services;
    for (var service in services) {
        if (checkTypes.object(services[service]) && checkTypes.function(services[service].onDestroyService)) {
            services[service].onDestroyService();
        }

        services[service] = null;
    }

    this.services = null;
};

/**
 * Checks whether all the services are ready for being registered and used.
 *
 * @public
 * @function
 * @returns {Boolean} - true, if all the services are ready; false, otherwise.
 */
ServiceManager.prototype.areAllServicesReady = function areAllServicesReady() {
    var services = this.services;
    for (var service in services) {
        if (services[service].isServiceReady() === false) {
            return false;
        }
    }

    return true;
};

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
 * @throws an Error if the servicesRootPath parameter is not a valid string.
 * @throws an Error if the servicesNames parameter is not a valid array of strings.
 */
function _loadAllServices(servicesRootPath, servicesNames) {
    if (checkTypes.not.string(servicesRootPath) || checkTypes.not.unemptyString(servicesRootPath)) {
        throw new Error('The parameter servicesRootPath must be a non-empty string');
    }

    if (checkTypes.not.array.of.string(servicesNames)) {
        throw new Error('The parameter servicesNames must be an array of strings');
    }

    var allServices = {};

    for (var i = 0; i < servicesNames.length; i++) {
        var specificServiceName = servicesNames[i];
        var specificServicePath = servicesRootPath + '/' + specificServiceName;

        var specificService = runnableServiceFactory.createService(specificServiceName, specificServicePath);
        if (checkTypes.assigned(specificService) && checkTypes.object(specificService)) {
            var identificationName = specificService.getIdentificationName();
            allServices[identificationName] = specificService;
            logger.info('The service %s has been loaded successfully.', identificationName);
        }
    }

    return allServices;
}