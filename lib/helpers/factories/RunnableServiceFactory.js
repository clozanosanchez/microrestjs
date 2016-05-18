'use strict';

/**
 * Factory that creates RunnableServices.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const isDirectory = require('is-dir');

const loggerManager = require('../logging/LoggerManager');

/**
 * Creates a RunnableService instance.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceName - Name of the service to be created.
 * @param {String} servicePath - Path that contains the service to be created.
 * @returns {RunnableService|null} - The RunnableService instance, if it could be created; null, otherwise.
 * @throws a TypeError if the serviceName parameter is an empty string.
 * @throws a TypeError if the servicePath parameter is an empty string.
 */
module.exports.createService = function createService(serviceName, servicePath) {
    if (checkTypes.not.string(serviceName) || checkTypes.emptyString(serviceName)) {
        throw new TypeError('The parameter serviceName must be a non-empty string.');
    }

    if (checkTypes.not.string(servicePath) || checkTypes.emptyString(servicePath)) {
        throw new TypeError('The parameter servicePath must be a non-empty string.');
    }

    const isServicePathDirectory = isDirectory(servicePath);

    if (isServicePathDirectory === false) {
        const logger = loggerManager.getLogger('RunnableServiceFactory');
        logger.warn('The service %s cannot be loaded because it is not a directory.', servicePath);
        return null;
    }

    try {
        const serviceContextLoader = require('../loaders/ServiceContextLoader');
        const serviceContext = serviceContextLoader.loadServiceContext(`${servicePath}/${serviceName}.json`);
        const serviceFunctionalityLoader = require('../loaders/ServiceFunctionalityLoader');
        const serviceFunctionality = serviceFunctionalityLoader.loadServiceFunctionality(`${servicePath}/${serviceName}.js`);
        const runnableService = _instantiateService(serviceContext, serviceFunctionality);
        _initializeService(runnableService);
        return runnableService;
    } catch (exception) {
        const logger = loggerManager.getLogger('RunnableServiceFactory');
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
    const RunnableService = require('../../services/RunnableService');
    const runnableService = new RunnableService(serviceContext);

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

    const operations = serviceContext.getOperations();
    if (checkTypes.object(operations) && checkTypes.not.emptyObject(operations)) {
        const operationsNames = Object.keys(operations);
        for (let i = 0; i < operationsNames.length; i++) {
            const operation = operationsNames[i];
            if (checkTypes.not.function(serviceFunctionality[operation])) {
                const logger = loggerManager.getLogger('RunnableServiceFactory');
                logger.warn('The operation %s of the service %s will be not loaded because its implementation has not been found', operation, serviceContext.getName());
            } else {
                runnableService[operation] = serviceFunctionality[operation];
            }
        }
    }

    return runnableService;
}

/**
 * Initializes the CallableServices dependencies and invoke onCreateService() of the RunnableService.
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
    const dependencies = runnableService.getContext().getDependencies();
    if (checkTypes.not.object(dependencies) || checkTypes.emptyObject(dependencies)) {
        return;
    }

    const dependenciesNames = Object.keys(dependencies);
    for (let i = 0; i < dependenciesNames.length; i++) {
        const dependency = dependenciesNames[i];
        if (checkTypes.object(dependencies[dependency])) {
            try {
                const callableServiceFactory = require('./CallableServiceFactory');
                const callableService = callableServiceFactory.getService(dependency, dependencies[dependency].api, dependencies[dependency].url);
                runnableService.registerCallableService(dependency, callableService);
            } catch (exception) {
                const logger = loggerManager.getLogger('RunnableServiceFactory');
                logger.warn('The CallableService %s could not be loaded because: %s', dependency, exception.message);
            }
        }
    }
}
