'use strict';

/**
 * Provides functions that invoke service operations.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var ioHelper = require('./IOHelper');

/**
 * Gets the function to invoke a service operation.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} service - Service to be invoked.
 * @param {String} operation - Operation to be invoked.
 * @returns {Function} - Function to invoke such service operation.
 */
module.exports.getOperationCall = function getOperationCall(service, operation) {
    return function _operationCall(expressRequest, expressResponse) {
        service.onStartOperation(operation);
        var operationRequest = ioHelper.convertExpressRequestToRunnableServiceRequest(expressRequest);
        var operationResponse = ioHelper.createRunnableServiceResponse();
        service[operation](operationRequest, operationResponse, function _sendResponseFunction() {
            var sendingResult = ioHelper.sendRunnableServiceResponseAsExpressResponse(operationResponse, expressResponse);

            if (checkTypes.boolean(sendingResult) && sendingResult === true) {
                service.onFinishOperation(operation);
            } else {
                service.onFinishOperation(operation, sendingResult);
            }
        });
    };
};
