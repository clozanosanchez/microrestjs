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
 * Service represents a Microrestjs service.
 *
 * @public
 * @class
 * @param {Object} context - Context of the service
 */
function Service(context) {
    //Initializes the internal state
    if (checkTypes.not.object(context)) {
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
 * @returns {Object} - The context of the service.
 */
Service.prototype.getContext = function getContext() {
    return this.context;
};

/**
 * Gets the identification name of the service.
 *
 * identificationName = serviceName + '/v' + apiVersion
 *
 * @public
 * @function
 * @returns {String} - The identification name of the service.
 */
Service.prototype.getIdentificationName = function getIdentificationName() {
    if (checkTypes.not.object(this.context) || checkTypes.not.object(this.context.info) || checkTypes.not.string(this.context.info.name) || checkTypes.not.integer(this.context.info.api)) {
        return '';
    }

    return this.context.info.name + '/v' + this.context.info.api;
};

module.exports = Service;
