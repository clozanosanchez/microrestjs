'use strict';

/**
 * Factory that creates RunnableServices.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var logger = require('../logging/LoggerManager').getLogger('RunnableServiceFactory');
var checkDirectory = require('../fs/CheckDirectory');
var serviceContextLoader = require('../loaders/ServiceContextLoader');
var serviceFunctionalityLoader = require('../loaders/ServiceFunctionalityLoader');
var callableServiceFactory = require('./CallableServiceFactory');

/**
 * Creates a RunnableService instance.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceName - Name of the service to be created.
 * @param {String} servicePath - Path that contains the service to be created.
 * @returns {RunnableService|null} - The RunnableService instance, if it could be created; null, otherwise.
 * @throws an Error if the serviceName parameter is an empty string.
 * @throws an Error if the servicePath parameter is an empty string.
 */
module.exports.createService = function createService(serviceName, servicePath) {
    if (checkTypes.not.string(serviceName) || checkTypes.not.unemptyString(serviceName)) {
        throw new Error('The parameter serviceName must be a non-empty string.');
    }

    if (checkTypes.not.string(servicePath) || checkTypes.not.unemptyString(servicePath)) {
        throw new Error('The parameter servicePath must be a non-empty string.');
    }

    var isServicePathDirectory = checkDirectory.isDirectorySync(servicePath);

    if (!isServicePathDirectory) {
        logger.warn('The service %s cannot be loaded because it is not a directory.', servicePath);
        return null;
    }

    try {
        var serviceContext = serviceContextLoader.loadServiceContext(servicePath + '/' + serviceName + '.json');
        var serviceFunctionality = serviceFunctionalityLoader.loadServiceFunctionality(servicePath + '/' + serviceName + '.js');
        var runnableService = _instantiateService(serviceContext, serviceFunctionality);
        _initializeService(runnableService);
        return runnableService;
    } catch (exception) {
        logger.warn('The service %s could not be loaded because: %s', serviceName, exception.message);
        return null;
    }
};

/**
 * Instantiates a RunnableService.
 *
 * @private
 * @function
 * @param {ServiceContext} serviceContext - Context of the service to be instantiated
 * @param {Object} serviceFunctionality - Functionality of the service to be instantiated.
 * @returns {RunnableService} - The RunnableService instance
 */
function _instantiateService(serviceContext, serviceFunctionality) {
    var runnableService = require('../../services/RunnableService').getInstance(serviceContext);

    if (checkTypes.function(serviceFunctionality.onCreateService)) {
        runnableService.onCreateService = serviceFunctionality.onCreateService;
    }

    if (checkTypes.function(serviceFunctionality.onStartOperation)) {
        runnableService.onStartOperation = serviceFunctionality.onStartOperation;
    }

    if (checkTypes.function(serviceFunctionality.onFinishOperation)) {
        runnableService.onFinishOperation = serviceFunctionality.onFinishOperation;
    }

    if (checkTypes.function(serviceFunctionality.onDestroyService)) {
        runnableService.onDestroyService = serviceFunctionality.onDestroyService;
    }

    var operations = serviceContext.getOperations();
    if (checkTypes.object(operations) && checkTypes.not.emptyObject(operations)) {
        var operationsNames = Object.keys(operations);
        for (var i = 0; i < operationsNames.length; i++) {
            var operation = operationsNames[i];
            if (checkTypes.not.function(serviceFunctionality[operation])) {
                logger.warn('The operation %s of the service %s will be not loaded because its implementation has not been found', operation, serviceContext.getName());
            } else {
                runnableService[operation] = serviceFunctionality[operation];
            }
        }
    }

    return runnableService;
}

/**
 * Initializes the CallableServices dependencies and invoke onCreateService() of the RunnableService
 *
 * @private
 * @function
 * @param {RunnableService} runnableService - Service to be initialized
 */
function _initializeService(runnableService) {
    _registerCallableServices(runnableService);
    runnableService.onCreateService();
}

/**
 * Registers all the dependencies defined in the context as CallableServices.
 *
 * @private
 * @function
 * @param {RunnableService} runnableService - RunnableService whose dependencies have to be registered.
 */
function _registerCallableServices(runnableService) {
    var dependencies = runnableService.getContext().getDependencies();
    if (checkTypes.not.object(dependencies) || checkTypes.emptyObject(dependencies)) {
        return;
    }

    var dependenciesNames = Object.keys(dependencies);
    for (var i = 0; i < dependenciesNames.length; i++) {
        var dependency = dependenciesNames[i];
        if (checkTypes.object(dependencies[dependency])) {
            try {
                var callableService = callableServiceFactory.getService(dependency, dependencies[dependency].api, dependencies[dependency].url);
                Object.getPrototypeOf(runnableService).registerCallableService.call(runnableService, dependency, callableService);
            } catch (exception) {
                logger.warn('The CallableService %s could not be loaded because: %s', dependency, exception.message);
            }
        }
    }
}
