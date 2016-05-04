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

var ServiceContext = require('./ServiceContext');

/**
 * Service represents a Microrestjs service.
 *
 * @public
 * @class
 * @param {ServiceContext} context - Context of the service
 */
function Service(context) {
    //Initializes the internal state
    if (checkTypes.not.object(context) || checkTypes.not.instance(context, ServiceContext)) {
        this.context = new ServiceContext(context);
    } else {
        this.context = context;
    }
}

/**
 * Gets the context of the service.
 *
 * @public
 * @function
 * @returns {ServiceContext} - The context of the service.
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
    var name = this.context.getName();
    var api = this.context.getApi();
    if (checkTypes.not.string(name) || checkTypes.not.unemptyString(name) ||
        checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
        return '';
    }

    return name + '/v' + api;
};

module.exports = Service;
