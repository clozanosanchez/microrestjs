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
var ServiceContext = require('./ServiceContext');
var client = require('./Client');

var EXECUTE_ERROR = 'EXECUTE_ERROR';
var SERVICE_INFORMATION_ERROR = 'SERVICE_INFORMATION_ERROR';

/**
 * Get a new instance of CallableService class.
 *
 * @public
 * @static
 * @function
 * @param {ServiceContext} context - Context of the CallableService.
 * @returns {CallableService} - CallableService instance.
 */
module.exports.getInstance = function getInstance(context) {
    return new CallableService(context);
};

/**
 * CallableService allows executing operations of a remote service.
 *
 * @class
 * @param {ServiceContext} context - Context of the CallableService.
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

            _this.realService.serviceContext = new ServiceContext(serviceInformation.serviceContext);
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

    var realName = realServiceContext.getName();
    if (checkTypes.not.string(realName) || checkTypes.not.unemptyString(realName)) {
        var serviceInformationError2 = new Error('The name data is not defined in the retrieved service information.');
        serviceInformationError2.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError2);
        return;
    }

    var realApi = realServiceContext.getApi();
    if (checkTypes.not.integer(realApi) || checkTypes.not.positive(realApi)) {
        var serviceInformationError3 = new Error('The API data is not defined in the retrieved service information.');
        serviceInformationError3.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError3);
        return;
    }

    var realOperation = realServiceContext.getOperation(request.operation);
    if (checkTypes.not.object(realOperation) || checkTypes.emptyObject(realOperation)) {
        var executeError1 = new Error('The operation ' + request.operation + ' cannot be executed because it does not defined in the retrieved service information.');
        executeError1.code = EXECUTE_ERROR;
        responseCallback(executeError1);
        return;
    }

    var realOperationSecurity = realServiceContext.getSecurity(request.operation);
    if (checkTypes.not.object(realOperationSecurity) || checkTypes.emptyObject(realOperationSecurity)) {
        var serviceInformationError4 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: security field is missing.');
        serviceInformationError4.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError4);
        return;
    }

    var authorization = undefined;
    if (realOperationSecurity.scheme !== 'none') {
        if (checkTypes.not.object(request.credentials) || checkTypes.emptyObject(request.credentials)) {
            var executeError2 = new Error('The operation ' + request.operation + ' cannot be executed because the credentials have not been defined for authorization.');
            executeError2.code = EXECUTE_ERROR;
            responseCallback(executeError2);
            return;
        }

        if (realOperationSecurity.scheme === 'basic') {
            authorization = request.credentials.username + ':' + request.credentials.password;
        } else {
            var executeError3 = new Error('The operation ' + request.operation + ' cannot be executed because ' + realOperationSecurity.scheme + ' authorization scheme is not supported by the current Microrestjs version.');
            executeError3.code = EXECUTE_ERROR;
            responseCallback(executeError3);
            return;
        }
    }

    var realOperationRequest = realOperation.request;
    if (checkTypes.not.object(realOperationRequest) || checkTypes.emptyObject(realOperationRequest)) {
        var serviceInformationError5 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: request field is missing.');
        serviceInformationError5.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError5);
        return;
    }

    var realOperationMethod = realOperationRequest.method;
    if (checkTypes.not.string(realOperationMethod) || checkTypes.not.unemptyString(realOperationMethod)) {
        var serviceInformationError6 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: method field is missing.');
        serviceInformationError6.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError6);
        return;
    }

    var realOperationPath = realOperationRequest.path;
    if (checkTypes.not.string(realOperationPath) || checkTypes.not.unemptyString(realOperationPath)) {
        var serviceInformationError7 = new Error('The operation ' + request.operation + ' is not well defined in the retrieved service information: path field is missing.');
        serviceInformationError7.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError7);
        return;
    }

    var realQueryString = '';
    var realParameters = realOperationRequest.parameters;
    if (checkTypes.object(realParameters) && checkTypes.not.emptyObject(realParameters)) {
        var parametersNames = Object.keys(realParameters);
        for (var i = 0; i < parametersNames.length; i++) {
            var paramName = parametersNames[i];
            var paramIn = realParameters[paramName].in;
            var paramType = realParameters[paramName].type;
            var paramRequired = realParameters[paramName].required;

            var realParamValue = request.parameters[paramName];
            if (paramRequired === true && checkTypes.not.assigned(realParamValue)) {
                var executeError4 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' is required.');
                executeError4.code = EXECUTE_ERROR;
                responseCallback(executeError4);
                return;
            }

            if (paramType !== 'string' && paramType !== 'integer' && paramType !== 'number' && paramType !== 'boolean') {
                var executeError5 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' has not a type supported by the current Microrestjs version.');
                executeError5.code = EXECUTE_ERROR;
                responseCallback(executeError5);
                return;
            }

            if (paramType === 'string' && checkTypes.not.string(realParamValue)) {
                var executeError6 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' has to be a string.');
                executeError6.code = EXECUTE_ERROR;
                responseCallback(executeError6);
                return;
            } else if (paramType === 'integer' && checkTypes.not.integer(realParamValue)) {
                var executeError7 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' has to be an integer.');
                executeError7.code = EXECUTE_ERROR;
                responseCallback(executeError7);
                return;
            } else if (paramType === 'number' && checkTypes.not.number(realParamValue)) {
                var executeError8 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' has to be a number.');
                executeError8.code = EXECUTE_ERROR;
                responseCallback(executeError8);
                return;
            } else if (paramType === 'boolean' && checkTypes.not.boolean(realParamValue)) {
                var executeError9 = new Error('The operation ' + request.operation + ' cannot be executed because the parameter ' + paramName + ' has to be a boolean.');
                executeError9.code = EXECUTE_ERROR;
                responseCallback(executeError9);
                return;
            }

            if (paramIn === 'path') {
                realOperationPath = realOperationPath.replace(':' + paramName, realParamValue);
            } else if (paramIn === 'query') {
                if (checkTypes.not.unemptyString(realQueryString)) {
                    realQueryString = '?' + paramName + '=' + realParamValue;
                } else {
                    realQueryString = realQueryString + '&' + paramName + '=' + realParamValue;
                }
            } else {
                var executeError10 = new Error('The operation ' + request.operation + ' cannot be executed because ' + paramIn + ' parameters are not supported by the current Microrestjs version.');
                executeError10.code = EXECUTE_ERROR;
                responseCallback(executeError10);
                return;
            }
        }
    }

    var realServicePath = realName + '/v' + realApi;
    var realCompletePath = '/' + realServicePath + realOperationPath + realQueryString;

    var realLocation = service.realService.location;
    if (checkTypes.not.string(realLocation) || checkTypes.not.unemptyString(realLocation)) {
        var serviceInformationError8 = new Error('The location is not defined in the retrieved service information.');
        serviceInformationError8.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError8);
        return;
    }

    var realPort = service.realService.port;
    if (checkTypes.not.integer(realPort) || checkTypes.not.positive(realPort) || realPort > 65535) {
        var serviceInformationError9 = new Error('The port is not well defined in the retrieved service information.');
        serviceInformationError9.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError9);
        return;
    }

    var realServiceCertificate = service.realService.certificate;
    if (checkTypes.not.string(realServiceCertificate) || checkTypes.not.unemptyString(realServiceCertificate)) {
        var serviceInformationError10 = new Error('The certificate is not defined in the retrieved service information.');
        serviceInformationError10.code = SERVICE_INFORMATION_ERROR;
        responseCallback(serviceInformationError10);
        return;
    }

    var headers = undefined;
    var body = undefined;
    if (checkTypes.assigned(request.body)) {
        if (checkTypes.not.object(request.body)) {
            var executeError11 = new Error('The operation ' + request.operation + ' cannot be executed because the request body is not an object.');
            executeError11.code = EXECUTE_ERROR;
            responseCallback(executeError11);
            return;
        }

        var jsonBody = JSON.stringify(request.body);

        headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(jsonBody, 'utf8')
        };

        body = new Buffer(jsonBody, 'utf8');
    }

    var completeRequest = {
        hostname: realLocation,
        port: realPort,
        path: realCompletePath,
        method: realOperationMethod,
        auth: authorization,
        headers: headers,
        body: body,
        serviceCertificate: realServiceCertificate,
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
