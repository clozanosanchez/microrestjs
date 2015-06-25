'use strict';

/**
 * Factory to create Runnable Services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var checkDirectory = require('./utils/CheckDirectory');
var serviceContextLoader = require('./serviceContextLoader');

/**
 * Creates a RunnableService instance.
 *
 * @public
 * @static
 * @param {String} serviceName - Name of the service to be created.
 * @param {String} servicePath - Path that contains the service to be created.
 * @returns {Object|null} - The RunnableService instance, if it could be created; null, otherwise.
 * @throws an Error if the serviceName parameter is not valid.
 * @throws an Error if the servicePath parameter is not valid.
 */
module.exports.createService = function createService(serviceName, servicePath) {
    if (checkTypes.not.assigned(serviceName) || checkTypes.not.string(serviceName) || checkTypes.not.unemptyString(serviceName)) {
        throw new Error('The parameter serviceName must be a non-empty string.');
    }

    if (checkTypes.not.assigned(servicePath) || checkTypes.not.string(servicePath) || checkTypes.not.unemptyString(servicePath)) {
        throw new Error('The parameter servicePath must be a non-empty string.');
    }

    var isServicePathDirectory = checkDirectory.isDirectorySync(servicePath);

    if (!isServicePathDirectory) {
        console.warn('WARNING: The service \'' + servicePath + '\' cannot be loaded because it is not a directory.');
        return null;
    }

    try {
        var serviceContext = serviceContextLoader.loadServiceContext(servicePath + '/' + serviceName + '.json');
        var serviceFunctionality = require(servicePath + '/' + serviceName + '.js');
        var specificService = _instantiateService(serviceContext, serviceFunctionality);
        return specificService;
    } catch (exception) {
        console.warn('WARNING: The service \'' + serviceName + '\' could not be loaded because: ' + exception.message);
        return null;
    }
};

/**
 * Instantiates a RunnableService.
 *
 * @private
 * @param {String} serviceContext - Context of the service to be instantiated
 * @param {String} serviceFunctionality - Functionality of the service to be instantiated.
 * @returns {Object} - The RunnableService instance
 */
function _instantiateService(serviceContext, serviceFunctionality) {
    //TODO: Implement
    return {};
}
