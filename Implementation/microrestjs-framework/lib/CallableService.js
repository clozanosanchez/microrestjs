'use strict';

/**
 * Creates CallableService objects.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');

var Service = require('./Service');
var serviceDirectoryProxy = require('./ServiceDirectoryProxy');
var serviceInformationRetriever = require('./ServiceInformationRetriever');
var client = require('./Client');

var EXECUTE_ERROR = 'EXECUTE_ERROR';
var SERVICE_INFORMATION_ERROR = 'SERVICE_INFORMATION_ERROR';

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

    this.realService = null;
}

CallableService.prototype = Object.create(Service.prototype);
CallableService.prototype.constructor = CallableService;

/**
 * Executes an operation in the remote service.
 *
 * @public
 * @function
 * @param {Object} request - Request to be executed.
 * @param {responseCallback} responseCallback - Callback for delegating the response received from the remote service.
 * @throws an Error if the responseCallback parameter is not a function.
 */
CallableService.prototype.execute = function execute(request, responseCallback) {
    if (checkTypes.not.function(responseCallback)) {
        throw new Error('The parameter responseCallback must be a defined function');
    }

    if (checkTypes.not.object(request) || checkTypes.emptyObject(request)) {
        var executeError2 = new Error('The parameter request must be a non-empty object');
        executeError2.code = EXECUTE_ERROR;
        responseCallback(executeError2);
        return;
    }

    var _this = this;
    this.getRealServiceInformation(function _processRealServiceInformation(error, realServiceInformation) {
        if (checkTypes.assigned(error)) {
            responseCallback(error);
            return;
        }

        _executeOperation(_this, request, responseCallback);
    });
};

/**
 * Gets the service description of the remote service.
 *
 * @public
 * @function
 * @param {responseCallback} responseCallback - Callback for delegating the response received from the remote service.
 * @throws an Error if the responseCallback parameter is not a function.
 */
CallableService.prototype.getRealServiceInformation = function getRealServiceInformation(responseCallback) {
    if (checkTypes.not.function(responseCallback)) {
        throw new Error('The parameter responseCallback must be a defined function');
    }

    var _this = this;

    if (checkTypes.not.object(this.realService) || checkTypes.emptyObject(this.realService) ||
        checkTypes.not.string(this.realService.location) || checkTypes.not.unemptyString(this.realService.location) ||
        checkTypes.not.integer(this.realService.port) || checkTypes.not.positive(this.realService.port)) {
        serviceDirectoryProxy.lookup(this, function _lookupCallback(lookupError, lookupResponse) {
            if (checkTypes.assigned(lookupError)) {
                _this.realService = {};

                responseCallback(lookupError);
                return;
            }

            _this.realService = {
                location: lookupResponse.location,
                port: lookupResponse.port
            };

            _this.getRealServiceInformation(responseCallback);
        });

        return;
    }

    if (checkTypes.not.object(this.realService.serviceContext) || checkTypes.emptyObject(this.realService.serviceContext) ||
        checkTypes.not.string(this.realService.certificate) || checkTypes.not.unemptyString(this.realService.certificate)) {
        serviceInformationRetriever.retrieveServiceInformation(this, function _retrieveServiceInformationCallback(retrivalError, serviceInformation) {
            if (checkTypes.assigned(retrivalError)) {
                _this.realService = {};

                responseCallback(retrivalError);
                return;
            }

            _this.realService.serviceContext = serviceInformation.serviceContext;
            _this.realService.certificate = serviceInformation.certificate;

            _this.getRealServiceInformation(responseCallback);
        });

        return;
    }

    responseCallback(null, this.realService);
};

/**
 * Sends the request to execute an operation in a remote service.
 *
 * @private
 * @function
 * @param {Object} service - Service that has the operation to be executed.
 * @param {Object} request - Request to be sent.
 * @param {responseCallback} responseCallback - Callback for delegating the response received from the remote service.
 */
function _executeOperation(service, request, responseCallback) {
    var realServiceContext = service.realService.serviceContext;
    if (checkTypes.not.object(realServiceContext) || checkTypes.emptyObject(realServiceContext)) {
        var serviceInformationError1 = new Error('The service context is not defined in the retrieved service information.');
        serviceInformationError1.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError1);
        return;
    }

    var realOperation = realServiceContext.operations[request.operation];
    if (checkTypes.not.object(realOperation) || checkTypes.emptyObject(realOperation)) {
        var executeError3 = new Error('The operation ' + request.operation + ' cannot be executed because it does not defined in the retrieved service information.');
        executeError3.code = EXECUTE_ERROR;
        responseCallback(executeError3);
        return;
    }

    var realOperationRequest = realOperation.request;
    if (checkTypes.not.object(realOperationRequest) || checkTypes.emptyObject(realOperationRequest)) {
        var serviceInformationError2 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: request field is missing.');
        serviceInformationError2.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError2);
        return;
    }

    var realOperationMethod = realOperationRequest.method;
    if (checkTypes.not.string(realOperationMethod) || checkTypes.not.unemptyString(realOperationMethod)) {
        var serviceInformationError3 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: method field is missing.');
        serviceInformationError3.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError3);
        return;
    }

    var realInfo = realServiceContext.info;
    if (checkTypes.not.object(realInfo) || checkTypes.emptyObject(realInfo)) {
        var serviceInformationError4 = new Error('The info data is not defined in the retrieved service information.');
        serviceInformationError4.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError4);
        return;
    }

    var realServicePath = realInfo.name + '/v' + realInfo.api;
    var realOperationPath = realOperationRequest.path;

    var realParameters = realOperationRequest.parameters;
    if (checkTypes.array(realParameters) && checkTypes.not.emptyArray(realParameters)) {
        for (var i = 0; i < realParameters.length; i++) {
            var paramName = realParameters[i].name;
            var paramIn = realParameters[i].in;

            var realParamValue = request.parameters[paramName];

            if (paramIn === 'path' && checkTypes.assigned(realParamValue)) {
                realOperationPath = realOperationPath.replace(':' + paramName, realParamValue);
            }

            //TODO: Complete the query parameters.
        }
    }

    var realCompletePath = '/' + realServicePath + realOperationPath;

    var realLocation = service.realService.location;
    if (checkTypes.not.string(realLocation) || checkTypes.not.unemptyString(realLocation)) {
        var serviceInformationError5 = new Error('The location is not defined in the retrieved service information.');
        serviceInformationError5.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError5);
        return;
    }

    var realPort = service.realService.port;
    if (checkTypes.not.integer(realPort) || checkTypes.not.positive(realPort)) {
        var serviceInformationError6 = new Error('The port is not defined in the retrieved service information.');
        serviceInformationError6.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError6);
        return;
    }

    var realServiceCertificate = service.realService.certificate;
    if (checkTypes.not.string(realServiceCertificate) || checkTypes.not.unemptyString(realServiceCertificate)) {
        var serviceInformationError7 = new Error('The certificate is not defined in the retrieved service information.');
        serviceInformationError7.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError7);
        return;
    }

    var completeRequest = {
        hostname: realLocation,
        port: realPort,
        path: realCompletePath,
        method: realOperationMethod,
        body: request.body,
        credentials: {
            key: service.credentials.key,
            certificate: service.credentials.certificate,
            ca: realServiceCertificate
        },
        rejectUnauthorized: true,
        checkServerIdentity: function _checkServerIdentity(host, cert) {
            //The host of the server is not checked.
            //Avoid localhost problems
        }
    };

    client.send(completeRequest, responseCallback);
}

/**
 * Callback declaration for delegating the responses received from CallableServices.
 *
 * @callback responseCallback
 * @param {Error} error - Specifies the error that occurred if it is defined.
 * @param {CallableServiceResponse} response - Represents the received response of the CallableService.
 */
