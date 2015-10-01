'use strict';

/**
 * Creates RunnableService objects.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var loggerManager = require('../helpers/logging/LoggerManager');
var Service = require('./Service');

/**
 * Gets a new instance of RunnableService class.
 *
 * @public
 * @static
 * @function
 * @param {ServiceContext} context - Context of the RunnableService.
 * @returns {RunnableService} - RunnableService instance.
 */
module.exports.getInstance = function getInstance(context) {
    return new RunnableService(context);
};

/**
 * RunnableService executes the operations of the service.
 *
 * @class
 * @param {ServiceContext} context - Context of the RunnableService.
 */
function RunnableService(context) {
    //Initializes the internal state
    Service.call(this, context);
    this.callableServices = {};
    this.logger = null;
}

RunnableService.prototype = Object.create(Service.prototype);
RunnableService.prototype.constructor = RunnableService;

/**
 * Registers a new CallableService to be used by the RunnableService.
 *
 * @public
 * @function
 * @param {String} callableServiceName - Name of the CallableService to be registered.
 * @param {CallableService} callableService - CallableService to be registered.
 * @returns {Boolean} - true, if the CallableService was registered; false, otherwise.
 */
RunnableService.prototype.registerCallableService = function registerCallableService(callableServiceName, callableService) {
    if (checkTypes.not.string(callableServiceName) || checkTypes.not.unemptyString(callableServiceName)) {
        return false;
    }

    if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
        return false;
    }

    this.callableServices[callableServiceName] = callableService;
    return true;
};

/**
 * Gets the reference of a CallableService to be used.
 *
 * @public
 * @function
 * @param {String} callableServiceName - Name of the CallableService.
 * @returns {CallableService|null} - The CallableService if it was registered previously; null, otherwise.
 */
RunnableService.prototype.getCallableService = function getCallableService(callableServiceName) {
    if (checkTypes.not.string(callableServiceName) || checkTypes.not.unemptyString(callableServiceName)) {
        return null;
    }

    var callableService = this.callableServices[callableServiceName];
    if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
        return null;
    }

    return callableService;
};

/**
 * Gets the logger of the service.
 *
 * @public
 * @function
 * @returns {Object} - The logger, if it was set previously; the default logger, otherwise.
 */
RunnableService.prototype.getLogger = function getLogger() {
    if (checkTypes.not.object(this.logger) || checkTypes.emptyObject(this.logger)) {
        this.logger = loggerManager.getLogger(this.getIdentificationName());
    }

    return this.logger;
};

/**
 * Sets the default logger to the service.
 *
 * @public
 * @function
 * @param {Object} loggerOptions - Options of the logger.
 */
RunnableService.prototype.setDefaultLogger = function setDefaultLogger(loggerOptions) {
    this.logger = loggerManager.createLogger(this.getIdentificationName(), loggerOptions);
};

/**
 * Sets a custom logger to the service.
 *
 * @public
 * @function
 * @param {Object} logger - Custom logger to be set.
 */
RunnableService.prototype.setCustomLogger = function setCustomLogger(logger) {
    this.logger = logger;
};

/**
 * Function that is executed when the service is created.
 * It can be used for initialization purposes.
 *
 * @public
 * @function
 */
RunnableService.prototype.onCreateService = function onCreateService() {
};

/**
 * Function that is executed before the execution of every operation.
 *
 * @public
 * @function
 * @param {String} operation - Name of the operation that is going to be executed.
 */
RunnableService.prototype.onStartOperation = function onStartOperation(operation) {
};

/**
 * Function that is executed after the execution of every operation.
 *
 * @public
 * @function
 * @param {String} operation - Name of the operation that has been executed.
 * @param {Error} [sendingError] - (if it is defined) Error that occurred when the response was being sent.
 */
RunnableService.prototype.onFinishOperation = function onFinishOperation(operation, sendingError) {
    if (checkTypes.assigned(sendingError)) {
        this.getLogger().warn('An error has occurred when the operation %s was being sent, because %s.', operation, sendingError.message);
    }
};

/**
 * Function that is executed when the service will be destroyed.
 * It can be used for shutdown purposes.
 *
 * @public
 * @function
 */
RunnableService.prototype.onDestroyService = function onDestroyService() {
};

/**
 * Default SERVICE OPERATION to provide the public information about the service
 * to everyone through the path '/'
 *
 * NOTE: It should NOT BE INVOKED from another function because it is a service operation.
 */
RunnableService.prototype.getServiceInformation = function getServiceInformation(request, response, sendResponse) {
    var serviceInformation = {
        serviceContext: {
            info: this.getContext().getInfo(),
            security: this.getContext().getGlobalSecurity(),
            operations: this.getContext().getOperations()
        },
        certificate: this.certificate
    };

    response.setStatus(200).setBody(serviceInformation);

    sendResponse();
};
