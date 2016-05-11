'use strict';

/**
 * Creates ServiceContext objects.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

/**
 * ServiceContext stores the context of one service.
 *
 * NOTE: Respects the Microrestjs Service Description Specification.
 *
 * @public
 * @class
 */
module.exports = class ServiceContext {

    /**
     * Constructor of ServiceContext.
     *
     * @public
     * @constructor
     * @param {Object} context - Data of the service to be stored.
     */
    constructor(context) {
        if (checkTypes.not.object(context)) {
            this.context = {};
        } else {
            this.context = Object.assign({}, context);
        }
    }

    /**
     * Gets the information of the service.
     *
     * @public
     * @function
     * @returns {Object} - The information, if it is defined; {}, otherwise.
     */
    getInfo() {
        if (checkTypes.not.object(this.context) || checkTypes.emptyObject(this.context) ||
            checkTypes.not.object(this.context.info)) {
            return {};
        }

        return Object.assign({}, this.context.info);
    }

    /**
     * Gets the name of the service.
     *
     * @public
     * @function
     * @returns {String} - The service name, if it is defined; '', otherwise.
     */
    getName() {
        const info = this.getInfo();
        if (checkTypes.emptyObject(info) || checkTypes.not.string(info.name)) {
            return '';
        }

        return info.name;
    }

    /**
     * Gets the API version of the service.
     *
     * @public
     * @function
     * @returns {Integer} - The API version, if it is defined; 0, otherwise.
     */
    getApi() {
        const info = this.getInfo();
        if (checkTypes.emptyObject(info) ||
            checkTypes.not.integer(info.api) || checkTypes.not.positive(info.api)) {
            return 0;
        }

        return info.api;
    }

    /**
     * Gets the configuration of the service.
     *
     * @public
     * @function
     * @returns {Object} - The configuration, if it is defined; {}, otherwise.
     */
    getConfig() {
        if (checkTypes.not.object(this.context) || checkTypes.emptyObject(this.context) ||
            checkTypes.not.object(this.context.config)) {
            return {};
        }

        return Object.assign({}, this.context.config);
    }

    /**
     * Gets the location of the service.
     *
     * @public
     * @function
     * @returns {String} - The location, if it is defined; '', otherwise.
     */
    getLocation() {
        const config = this.getConfig();
        if (checkTypes.emptyObject(config) || checkTypes.not.string(config.location)) {
            return '';
        }

        return config.location;
    }

    /**
     * Gets the dependencies of the service.
     *
     * @public
     * @function
     * @returns {Object} - The dependencies, if it is defined; {}, otherwise.
     */
    getDependencies() {
        const config = this.getConfig();
        if (checkTypes.emptyObject(config) || checkTypes.not.object(config.dependencies)) {
            return {};
        }

        return config.dependencies;
    }

    /**
     * Gets the global security of the service.
     *
     * @public
     * @function
     * @returns {Object} - The global security, if it is defined; {}, otherwise.
     */
    getGlobalSecurity() {
        if (checkTypes.not.object(this.context) || checkTypes.emptyObject(this.context) ||
            checkTypes.not.object(this.context.security)) {
            return {};
        }

        return Object.assign({}, this.context.security);
    }

    /**
     * Gets the operations of the service.
     *
     * @public
     * @function
     * @returns {Object} - The operations, if it is defined; {}, otherwise.
     */
    getOperations() {
        if (checkTypes.not.object(this.context) || checkTypes.emptyObject(this.context) ||
            checkTypes.not.object(this.context.operations)) {
            return {};
        }

        return Object.assign({}, this.context.operations);
    }

    /**
     * Gets an operation of the service.
     *
     * @public
     * @function
     * @param {String} operationName - Name of the operation to be obtained.
     * @returns {Object} - The operation, if it is defined; {}, otherwise.
     */
    getOperation(operationName) {
        const operations = this.getOperations();
        if (checkTypes.emptyObject(operations) || checkTypes.not.object(operations[operationName])) {
            return {};
        }

        return operations[operationName];
    }

    /**
     * Gets the security of an operation of the service.
     *
     * NOTE: If the operation does not define any security,
     *       the global security will be returned.
     *
     * @public
     * @function
     * @param {String} operationName - Name of the operation to be obtained its security.
     * @returns {Object} - The security, if it is defined; {}, otherwise.
     */
    getSecurity(operationName) {
        const operation = this.getOperation(operationName);
        if (checkTypes.not.emptyObject(operation) &&
            checkTypes.object(operation.security) && checkTypes.not.emptyObject(operation.security)) {
            return operation.security;
        }

        return this.getGlobalSecurity();
    }
};
