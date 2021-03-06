'use strict';

/**
 * Creates RunnableService objects.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

const loggerManager = require('../helpers/logging/LoggerManager');

const Service = require('./Service');

/**
 * RunnableService executes the operations of the service.
 *
 * @public
 * @class
 */
module.exports = class RunnableService extends Service {

    /**
     * Constructor of RunnableService.
     *
     * @public
     * @constructor
     * @param {ServiceContext} context - Context of the RunnableService.
     */
    constructor(context) {
        super(context);

        // Initializes the internal state
        this.callableServices = {};
        this.logger = null;
    }

    /**
     * Registers a new CallableService to be used by the RunnableService.
     *
     * @public
     * @function
     * @param {String} callableServiceName - Name of the CallableService to be registered.
     * @param {CallableService} callableService - CallableService to be registered.
     * @returns {Boolean} - true, if the CallableService was registered; false, otherwise.
     */
    registerCallableService(callableServiceName, callableService) {
        if (checkTypes.not.string(callableServiceName) || checkTypes.emptyString(callableServiceName)) {
            return false;
        }

        const CallableService = require('./CallableService');
        if (checkTypes.not.object(callableService) || checkTypes.not.instanceStrict(callableService, CallableService)) {
            return false;
        }

        this.callableServices[callableServiceName] = callableService;
        return true;
    }

    /**
     * Gets the reference of a CallableService to be used.
     *
     * @public
     * @function
     * @param {String} callableServiceName - Name of the CallableService.
     * @returns {CallableService|null} - The CallableService if it was registered previously; null, otherwise.
     */
    getCallableService(callableServiceName) {
        if (checkTypes.not.string(callableServiceName) || checkTypes.emptyString(callableServiceName)) {
            return null;
        }

        const callableService = this.callableServices[callableServiceName];
        const CallableService = require('./CallableService');
        if (checkTypes.not.object(callableService) || checkTypes.not.instanceStrict(callableService, CallableService)) {
            return null;
        }

        return callableService;
    }

    /**
     * Gets the logger of the service.
     *
     * @public
     * @function
     * @returns {Object} - The logger, if it was set previously; the default logger, otherwise.
     */
    getLogger() {
        if (checkTypes.not.object(this.logger) || checkTypes.emptyObject(this.logger)) {
            this.logger = loggerManager.getLogger(this.getIdentificationName());
        }

        return this.logger;
    }

    /**
     * Sets the default logger to the service.
     *
     * @public
     * @function
     * @param {Object} [loggerOptions] - Options of the logger.
     */
    setDefaultLogger(loggerOptions) {
        this.logger = loggerManager.createLogger(this.getIdentificationName(), loggerOptions);
    }

    /**
     * Sets a custom logger to the service.
     *
     * @public
     * @function
     * @param {Object} logger - Custom logger to be set.
     * @throws a TypeError if the parameter logger is not an object.
     */
    setCustomLogger(logger) {
        if (checkTypes.not.object(logger)) {
            throw new TypeError('The parameter logger must be an object.');
        }

        this.logger = logger;
    }

    /**
     * Function that is executed when the service is created.
     * It can be used for initialization purposes.
     *
     * @public
     * @function
     */
    onCreateService() {
        // Behaviour by default, it can be overwritten
    }

    /**
     * Function that is executed before the execution of every operation.
     *
     * @public
     * @function
     * @param {String} operation - Name of the operation that is going to be executed.
     */
    onStartOperation(operation) {
        // Behaviour by default, it can be overwritten
    }

    /**
     * Function that is executed after the execution of every operation.
     *
     * @public
     * @function
     * @param {String} operation - Name of the operation that has been executed.
     * @param {Error} [sendingError] - (if it is defined) Error that occurred when the response was being sent.
     */
    onFinishOperation(operation, sendingError) {
        // Behaviour by default, it can be overwritten
        if (checkTypes.assigned(sendingError)) {
            this.getLogger().warn('An error has occurred when the operation %s was being sent, because %s.', operation, sendingError.message);
        }
    }

    /**
     * Function that is executed when the service will be destroyed.
     * It can be used for shutdown purposes.
     *
     * @public
     * @function
     */
    onDestroyService() {
        // Behaviour by default, it can be overwritten
    }

    /**
     * Default SERVICE OPERATION to provide the public information about the service
     * to everyone through the path '/'.
     *
     * NOTE: It should NOT BE INVOKED from another function because it is a service operation.
     */
    getServiceInformation(request, response, sendResponse) {
        const serviceInformation = {
            serviceContext: {
                info: this.getContext().getInfo(),
                security: this.getContext().getGlobalSecurity(),
                operations: this.getContext().getOperations()
            },
            certificate: this.certificate
        };

        response.setStatus(200).setBody(serviceInformation);

        sendResponse();
    }
};
