'use strict';

/**
 * Factory to create Runnable Services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');
var logger = require('winston').loggers.get('RunnableServiceFactory');

var checkDirectory = require('./utils/CheckDirectory');
var serviceContextLoader = require('./serviceContextLoader');
var callableServiceFactory = require('./CallableServiceFactory');

/**
 * Creates a RunnableService instance.
 *
 * @public
 * @static
 * @function
 * @param {String} serviceName - Name of the service to be created.
 * @param {String} servicePath - Path that contains the service to be created.
 * @returns {Object|null} - The RunnableService instance, if it could be created; null, otherwise.
 * @throws an Error if the serviceName parameter is not valid.
 * @throws an Error if the servicePath parameter is not valid.
 */
module.exports.createService = function createService(serviceName, servicePath) {
    if (checkTypes.not.assigned(serviceName) || checkTypes.not.string(serviceName) || checkTypes.not.unemptyString(serviceName)) {
        throw new Error('The parameter serviceName must be a non-empty string.');
    }

    if (checkTypes.not.assigned(servicePath) || checkTypes.not.string(servicePath) || checkTypes.not.unemptyString(servicePath)) {
        throw new Error('The parameter servicePath must be a non-empty string.');
    }

    var isServicePathDirectory = checkDirectory.isDirectorySync(servicePath);

    if (!isServicePathDirectory) {
        logger.warn('The service %s cannot be loaded because it is not a directory.', servicePath);
        return null;
    }

    try {
        var serviceContext = serviceContextLoader.loadServiceContext(servicePath + '/' + serviceName + '.json');
        var serviceFunctionality = require(servicePath + '/' + serviceName + '.js');
        var runnableService = _instantiateService(serviceContext, serviceFunctionality);
        _initializeService(runnableService);
        return runnableService;
    } catch (exception) {
        logger.warn('The service %s could not be loaded because: %s', serviceName, exception);
        return null;
    }
};

/**
 * Instantiates a RunnableService.
 *
 * @private
 * @function
 * @param {String} serviceContext - Context of the service to be instantiated
 * @param {String} serviceFunctionality - Functionality of the service to be instantiated.
 * @returns {Object} - The RunnableService instance
 */
function _instantiateService(serviceContext, serviceFunctionality) {
    var runnableService = require('./RunnableService').getInstance(serviceContext);

    if (checkTypes.not.assigned(serviceFunctionality.onCreateService) || checkTypes.not.function(serviceFunctionality.onCreateService)) {
        runnableService.onCreateService = function onCreateService() {};
    } else {
        runnableService.onCreateService = serviceFunctionality.onCreateService;
    }

    if (checkTypes.not.assigned(serviceFunctionality.onStartOperation) || checkTypes.not.function(serviceFunctionality.onStartOperation)) {
        runnableService.onStartOperation = function onStartOperation() {};
    } else {
        runnableService.onStartOperation = serviceFunctionality.onStartOperation;
    }

    if (checkTypes.not.assigned(serviceFunctionality.onFinishOperation) || checkTypes.not.function(serviceFunctionality.onFinishOperation)) {
        runnableService.onFinishOperation = function onFinishOperation() {};
    } else {
        runnableService.onFinishOperation = serviceFunctionality.onFinishOperation;
    }

    if (checkTypes.not.assigned(serviceFunctionality.onDestroyService) || checkTypes.not.function(serviceFunctionality.onDestroyService)) {
        runnableService.onDestroyService = function onDestroyService() {};
    } else {
        runnableService.onDestroyService = serviceFunctionality.onDestroyService;
    }

    for (var operation in serviceContext.operations) {
        if (checkTypes.not.assigned(serviceFunctionality[operation]) || checkTypes.not.function(serviceFunctionality[operation])) {
            logger.warn('The operation %s of the service %s will be not loaded because its implementation has not been found', operation, serviceContext.info.name);
        } else {
            runnableService[operation] = serviceFunctionality[operation];
        }
    }

    return runnableService;
}

/**
 * Initializes the dependencies and the state of the RunnableService
 *
 * @private
 * @function
 * @param {Object} runnableService - Service to be initialized
 */
function _initializeService(runnableService) {
    _registerCallableServices(runnableService);
    Object.getPrototypeOf(runnableService).getLogger.call(runnableService);
    runnableService.onCreateService();
}

/**
 * Registers all the dependencies defined in the context as CallableServices.
 *
 * @private
 * @function
 * @param {Object} runnableService - RunnableService whose dependencies have to be registered.
 */
function _registerCallableServices(runnableService) {
    var serviceContext = runnableService.getContext();
    var dependencies = serviceContext.config.dependencies;

    if (checkTypes.not.assigned(dependencies) || checkTypes.not.object(dependencies)) {
        return;
    }

    for (var dependency in dependencies) {
        if (checkTypes.assigned(dependencies[dependency]) && checkTypes.object(dependencies[dependency])) {
            try {
                var callableService = callableServiceFactory.getService(dependency, dependencies[dependency].api, dependencies[dependency].url);
                Object.getPrototypeOf(runnableService).registerCallableService.call(runnableService, dependency, callableService);
            } catch (exception) {
                logger.warn('The CallableService %s could not be loaded because: %s', dependency, exception.message);
            }
        }
    }
}
