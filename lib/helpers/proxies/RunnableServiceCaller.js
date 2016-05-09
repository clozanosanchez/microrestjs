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

const checkTypes = require('check-types');

const ioHelper = require('../io/IOHelper');

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
        const operationRequest = ioHelper.convertExpressRequestToRunnableServiceRequest(expressRequest);
        const operationResponse = ioHelper.createRunnableServiceResponse();
        service[operation](operationRequest, operationResponse, function _sendResponseFunction() {
            const sendingResult = ioHelper.sendRunnableServiceResponseAsExpressResponse(operationResponse, expressResponse);

            if (checkTypes.boolean(sendingResult) && sendingResult === true) {
                service.onFinishOperation(operation);
            } else {
                service.onFinishOperation(operation, sendingResult);
            }
        });
    };
};

/**
 * Gets the function to check if the request satisfies the operation requirements.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} service - Service to be checked.
 * @param {String} operation - Operation to be checked.
 * @returns {Function} - Function to check the request.
 */
module.exports.getCheckOperationRequestCall = function getCheckOperationRequestCall(service, operation) {
    return function _checkOperationRequestCall(expressRequest, expressResponse, next) {
        const operationRequestInfo = service.getContext().getOperation(operation);
        if (checkTypes.emptyObject(operationRequestInfo)) {
            expressResponse.status(500);
            expressResponse.send('SERVER ERROR: The invoked service operation could not be checked automatically.');
            return;
        }

        const parametersOperation = operationRequestInfo.request.parameters;
        if (checkTypes.object(parametersOperation) && checkTypes.not.emptyObject(parametersOperation)) {
            const parametersNames = Object.keys(parametersOperation);
            for (let i = 0; i < parametersNames.length; i++) {
                const paramName = parametersNames[i];
                const paramRequired = parametersOperation[paramName].required;

                if (paramRequired === true) {
                    const paramType = parametersOperation[paramName].type;
                    const paramIn = parametersOperation[paramName].in;

                    const pathParamValue = expressRequest.params[paramName];
                    const queryParamValue = expressRequest.query[paramName];

                    if (paramIn === 'path' && checkTypes.assigned(queryParamValue)) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has been used inappropriately as query string.');
                        return;
                    } else if (paramIn === 'query' && checkTypes.assigned(pathParamValue)) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has been used inappropriately as path parameter.');
                        return;
                    }

                    const paramValue = pathParamValue || queryParamValue;

                    if (checkTypes.not.assigned(paramValue) || checkTypes.not.unemptyString(paramValue)) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' is required.');
                        return;
                    }

                    if (paramType === 'string' && checkTypes.not.string(paramValue)) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has to be a string.');
                        return;
                    } else if (paramType === 'integer' && checkTypes.not.integer(Number(paramValue))) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has to be a integer.');
                        return;
                    } else if (paramType === 'number' && checkTypes.not.number(Number(paramValue))) {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has to be a number.');
                        return;
                    } else if (paramType === 'boolean' && paramValue !== 'true' && paramValue !== 'false') {
                        expressResponse.status(400);
                        expressResponse.send('The parameter ' + paramName + ' has to be a boolean.');
                        return;
                    }

                    if (paramType === 'integer' || paramType === 'number') {
                        if (paramIn === 'path') {
                            expressRequest.params[paramName] = Number(paramValue);
                        } else if (paramIn === 'query') {
                            expressRequest.query[paramName] = Number(paramValue);
                        }
                    } else if (paramType === 'boolean') {
                        if (paramIn === 'path' && paramValue === 'true') {
                            expressRequest.params[paramName] = true;
                        } else if (paramIn === 'path' && paramValue === 'false') {
                            expressRequest.params[paramName] = false;
                        } else if (paramIn === 'query' && paramValue === 'true') {
                            expressRequest.query[paramName] = true;
                        } else if (paramIn === 'query' && paramValue === 'false') {
                            expressRequest.query[paramName] = false;
                        }
                    }
                }
            }
        }

        next();
    };
};

/**
 * Gets the function to send 405 Method Not Allowed.
 *
 * @public
 * @static
 * @function
 * @param {String[]} methodsAllowed - Methods that are allowed.
 * @returns {Function} - Function to send 405 Method Not Allowed.
 */
module.exports.getMethodNotAllowedCall = function getMethodNotAllowedCall(methodsAllowed) {
    return function _methodNotAllowedCall(expressRequest, expressResponse) {
        expressResponse.set('Allow', methodsAllowed.join(', '));
        expressResponse.sendStatus(405);
    };
};
