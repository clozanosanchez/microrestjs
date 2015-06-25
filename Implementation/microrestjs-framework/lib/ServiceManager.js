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

var checkDirectory = require('./utils/CheckDirectory');
var runnableServiceFactory = require('./RunnableServiceFactory');

/**
 * Get a new instance of ServiceManager class.
 *
 * @public
 * @static
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
 * If any service has a problem to be loaded, such service will be skipt.
 *
 * @public
 * @param {String} servicesRootPath - Path that contains the services to be loaded.
 * @throws an Error if the servicesPath parameter is not valid.
 */
ServiceManager.prototype.loadServices = function loadServices(servicesRootPath) {
    if (checkTypes.not.assigned(servicesRootPath) || checkTypes.not.string(servicesRootPath) || checkTypes.not.unemptyString(servicesRootPath)) {
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
 * First, deploys all the loaded services in a server.
 * Then, registers all of them into the Service Directory.
 *
 * @public
 * @param {Server} server - Server where the services have to be deployed.
 * @throws an Error if the server parameter is not valid.
 */
ServiceManager.prototype.registerServices = function registerServices(server) {
    if (checkTypes.not.assigned(server)) {
        //TODO: Improve the condition. Check if is a Server instance.
        throw new Error('The parameter server must be a Server object');
    }

    //TODO: Implement
};

/**
 * Loads all the services that are specified in the arguments.
 *
 * If any service has a problem to be loaded, such service will be skipt.
 *
 * @private
 * @param {String} servicesRootPath - Path that contains the services to be loaded.
 * @param {String[]} servicesNames - Names of the services to be loaded.
 * @returns {Object} - All the loaded services; {}, if there are not services.
 * @throws an Error if the servicesRootPath parameter is not valid.
 * @throws an Error if the servicesNames parameter is not valid.
 */
function _loadAllServices(servicesRootPath, servicesNames) {
    if (checkTypes.not.assigned(servicesRootPath) || checkTypes.not.string(servicesRootPath) || checkTypes.not.unemptyString(servicesRootPath)) {
        throw new Error('The parameter servicesRootPath must be a non-empty string');
    }

    if (checkTypes.not.assigned(servicesNames) || checkTypes.not.array.of.string(servicesNames)) {
        throw new Error('The parameter servicesNames must be an array of strings');
    }

    var allServices = {};

    for (var i = 0; i < servicesNames.length; i++) {
        var specificServiceName = servicesNames[i];
        var specificServicePath = servicesRootPath + '/' + specificServiceName;

        var specificService = runnableServiceFactory.createService(specificServiceName, specificServicePath);
        if (checkTypes.assigned(specificService) && checkTypes.object(specificService)) {
            console.log('The service \'' + specificServiceName + '\' has been loaded successfully.');
            allServices[specificServiceName] = specificService;
        }
    }

    return allServices;
}
