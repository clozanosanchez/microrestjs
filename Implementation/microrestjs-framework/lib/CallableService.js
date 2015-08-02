'use strict';

/**
 * Creates a CallableService.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var Service = require('./Service');

/**
 * Get a new instance of CallableService class.
 *
 * @public
 * @static
 * @function
 * @param {Object} context - Context of the CallableService.
 * @returns {CallableService} - CallableService instance.
 */
module.exports.getInstance = function getInstance(context) {
    return new CallableService(context);
};

/**
 * CallableService allows executing operations of a remote service.
 *
 * @class
 * @param {Object} context - Context of the CallableService.
 */
function CallableService(context) {
    //Initializes the internal state
    Service.call(this, context);
}

CallableService.prototype = Object.create(Service.prototype);
CallableService.prototype.constructor = CallableService;

/**
 * Executes the operation in the remote service.
 *
 * @public
 * @function
 * @param {Object} operation - Operation to be executed.
 */
CallableService.prototype.execute = function execute(operation) {
    //TODO: Implement
};
