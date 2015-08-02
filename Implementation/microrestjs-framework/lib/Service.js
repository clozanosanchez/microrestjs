'use strict';

/**
 * Creates an abstract Service.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * Service represents a microrestjs service.
 *
 * @public
 * @class
 * @param {Object} context - Context of the service
 */
function Service(context) {
    //Initializes the internal state
    this.context = context;
}

/**
 * Gets the context of the service.
 *
 * @public
 * @function
 * @returns {Object} - the context of the service.
 */
Service.prototype.getContext = function getContext() {
    return this.context;
};

/**
 * Gets the name of the service as defined in the context.
 *
 * @public
 * @function
 * @returns {String} - the name of the service as defined in the context.
 */
Service.prototype.getServiceName = function getServiceName() {
    return this.context.info.name;
};

module.exports = Service;
