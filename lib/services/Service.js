'use strict';

/**
 * Creates an abstract Service.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

/**
 * Service represents a Microrestjs service.
 *
 * @public
 * @class
 */
module.exports = class Service {

    /**
     * Constructor of Service.
     *
     * @public
     * @constructor
     * @param {ServiceContext} context - Context of the service
     */
    constructor(context) {
        // Initializes the internal state
        const ServiceContext = require('./ServiceContext');
        if (checkTypes.not.object(context) || checkTypes.not.instanceStrict(context, ServiceContext)) {
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
    getContext() {
        return this.context;
    }

    /**
     * Gets the identification name of the service.
     *
     * identificationName = serviceName + '/v' + apiVersion
     *
     * @public
     * @function
     * @returns {String} - The identification name of the service.
     */
    getIdentificationName() {
        const name = this.context.getName();
        const api = this.context.getApi();
        if (checkTypes.not.string(name) || checkTypes.emptyString(name) ||
            checkTypes.not.integer(api) || checkTypes.not.positive(api)) {
            return '';
        }

        return `${name}/v${api}`;
    }
};
