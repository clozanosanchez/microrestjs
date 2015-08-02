'use strict';

/**
 * Creates a RunnableService.
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

/**
 * Get a new instance of RunnableService class.
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
    this.callableServices = {};
    this.logger = null;
}

RunnableService.prototype = Object.create(Service.prototype);
RunnableService.prototype.constructor = RunnableService;

/**
 * Registers a new CallableService reference to be used by the RunnableService.
 *
 * @public
 * @function
 * @param {String} callableServiceName - Name of the CallableService to be registered.
 * @param {Object} callableService - CallableService to be registered.
 * @returns {Boolean} - true, if the CallableService was registered; false, otherwise.
 */
RunnableService.prototype.registerCallableService = function registerCallableService(callableServiceName, callableService) {
    if (checkTypes.not.assigned(callableServiceName) || checkTypes.not.string(callableServiceName) || checkTypes.not.unemptyString(callableServiceName)) {
        return false;
    }

    if (checkTypes.not.assigned(callableService) || checkTypes.not.object(callableService)) {
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
 * @returns {Object|null} - The CallableService if it was registered previously; null, otherwise.
 */
RunnableService.prototype.getCallableService = function getCallableService(callableServiceName) {
    if (checkTypes.not.assigned(callableServiceName) || checkTypes.not.string(callableServiceName) || checkTypes.not.unemptyString(callableServiceName)) {
        return null;
    }

    var callableService = this.callableServices[callableServiceName];
    if (checkTypes.not.assigned(callableService) || checkTypes.not.object(callableService)) {
        return null;
    }

    return callableService;
};

/**
 * Gets either the custom logger if it was set previously, or a Winston logger by default.
 *
 * @public
 * @function
 * @returns {Object} - the custom logger, if it was set previously; a new Winston logger, otherwise.
 */
RunnableService.prototype.getLogger = function getLogger() {
    if (checkTypes.not.assigned(this.logger) || checkTypes.not.object(this.logger)) {
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
    if (checkTypes.not.assigned(logger) || checkTypes.not.object(logger)) {
        return false;
    } else {
        this.logger = logger;
        return true;
    }
};
