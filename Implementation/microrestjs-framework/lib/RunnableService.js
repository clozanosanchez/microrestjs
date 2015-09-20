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
var Logger = require('winston').Logger;

var Service = require('./Service');
var credentialsGenerator = require('./utils/CredentialsGenerator');

/**
 * Gets a new instance of RunnableService class.
 *
 * @public
 * @static
 * @function
 * @param {Object} context - Context of the RunnableService.
 * @returns {RunnableService} - RunnableService instance.
 */
module.exports.getInstance = function getInstance(context) {
    return new RunnableService(context);
};

/**
 * RunnableService executes the operations of the service.
 *
 * @class
 * @param {Object} context - Context of the RunnableService.
 */
function RunnableService(context) {
    //Initializes the internal state
    Service.call(this, context);
    this.credentials = {};
    this.areServiceCredentialsInServer = false;
    this.callableServices = {};
    this.logger = new Logger();

    //Generates the service credentials asynchronously.
    credentialsGenerator.generateCredentials(this.getIdentificationName(), this.credentials);
}

RunnableService.prototype = Object.create(Service.prototype);
RunnableService.prototype.constructor = RunnableService;

/**
 * Checks whether the service credentials have been already generated.
 *
 * @public
 * @function
 * @returns {Boolean} - true, if the service credentials have been already generated; false, otherwise.
 */
RunnableService.prototype.areServiceCredentialsReady = function areServiceCredentialsReady() {
    return checkTypes.object(this.credentials) && checkTypes.not.emptyObject(this.credentials) &&
           checkTypes.string(this.credentials.key) && checkTypes.unemptyString(this.credentials.key) &&
           checkTypes.string(this.credentials.certificate) && checkTypes.unemptyString(this.credentials.certificate) &&
           checkTypes.string(this.credentials.ca) && checkTypes.unemptyString(this.credentials.ca);
};

/**
 * Checks whether the service is ready for being registered and used.
 *
 * @public
 * @function
 * @returns {Boolean} - true, if the service is ready for being registered and used; false, otherwise.
 */
RunnableService.prototype.isServiceReady = function isServiceReady() {
    return this.areServiceCredentialsReady() && this.areServiceCredentialsInServer;
};

/**
 * Adds the service credentials to the server for establishing SSL communications.
 * If the service credentials have not been already generated, it waits and retries later.
 *
 * DESIGN NOTE: The addition is done using a function to hide the server.
 *              The server is a private element of the platform that must
 *              not be accessible from a RunnableService.
 *
 * @public
 * @function
 * @param {Function} addServiceCredentialsFunction - Function to add the service credentials to the server.
 */
RunnableService.prototype.addServiceCredentialsToServer = function addServiceCredentialsToServer(addServiceCredentialsFunction) {
    if (!this.areServiceCredentialsReady()) {
        setTimeout(addServiceCredentialsToServer.bind(this, addServiceCredentialsFunction), 1000);
        return;
    }

    addServiceCredentialsFunction(this.credentials);
    this.areServiceCredentialsInServer = true;
};

/**
 * Registers a new CallableService to be used by the RunnableService.
 *
 * @public
 * @function
 * @param {String} callableServiceName - Name of the CallableService to be registered.
 * @param {Object} callableService - CallableService to be registered.
 * @returns {Boolean} - true, if the CallableService was registered; false, otherwise.
 */
RunnableService.prototype.registerCallableService = function registerCallableService(callableServiceName, callableService) {
    if (checkTypes.not.string(callableServiceName) || checkTypes.not.unemptyString(callableServiceName)) {
        return false;
    }

    if (checkTypes.not.object(callableService) || checkTypes.emptyObject(callableService)) {
        return false;
    }

    callableService.credentials = this.credentials;
    this.callableServices[callableServiceName] = callableService;
    return true;
};

/**
 * Gets the reference of a CallableService to be used.
 *
 * @public
 * @function
 * @param {String} callableServiceName - Name of the CallableService.
 * @returns {Object|null} - The CallableService if it was registered previously; null, otherwise.
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
 * Gets either the custom logger if it was set previously, or a Winston logger by default.
 *
 * @public
 * @function
 * @returns {Object} - The custom logger, if it was set previously; a new Winston logger, otherwise.
 */
RunnableService.prototype.getLogger = function getLogger() {
    if (checkTypes.not.object(this.logger) || checkTypes.emptyObject(this.logger)) {
        this.logger = new Logger();
    }

    return this.logger;
};

/**
 * Sets a custom logger
 *
 * @public
 * @function
 * @param {Object} logger - Custom logger to be set by default.
 * @returns {Boolean} - true, if the custom logger could be set; false, otherwise.
 */
RunnableService.prototype.setLogger = function setLogger(logger) {
    if (checkTypes.not.object(logger) || checkTypes.emptyObject(logger)) {
        return false;
    }

    this.logger = logger;
    return true;
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
 * NOTE: IT SHOULD NOT BE INVOKED FROM OTHER FUNCTION because it is a service operation.
 */
RunnableService.prototype.getServiceInformation = function getServiceInformation(request, response, sendResponse) {
    var serviceInformation = {
        serviceContext: {
            info: this.getContext().info,
            operations: this.getContext().operations
        },
        certificate: this.credentials.certificate
    };

    response.setStatus(200).setBody(serviceInformation);

    sendResponse();
};
