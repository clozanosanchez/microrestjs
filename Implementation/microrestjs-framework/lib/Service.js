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

var checkTypes = require('check-types');

/**
 * Service represents a microrestjs service.
 *
 * @public
 * @class
 * @param {Object} context - Context of the service
 */
function Service(context) {
    //Initializes the internal state
    if (checkTypes.not.assigned(context)) {
        this.context = {};
    } else {
        this.context = context;
    }
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
    if (checkTypes.not.assigned(this.context) || checkTypes.not.assigned(this.context.info) || checkTypes.not.assigned(this.context.info.name)) {
        return '';
    }

    return this.context.info.name;
};

module.exports = Service;
