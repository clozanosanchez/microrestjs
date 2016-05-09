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

const checkTypes = require('check-types');

const Service = require('./Service');
const serviceDirectoryProxy = require('../helpers/proxies/ServiceDirectoryProxy');
const serviceInformationRetriever = require('../helpers/proxies/ServiceInformationRetriever');
const ServiceContext = require('./ServiceContext').ServiceContext;
const client = require('../platform/Client');

const EXECUTE_ERROR = 'EXECUTE_ERROR';
const SERVICE_INFORMATION_ERROR = 'SERVICE_INFORMATION_ERROR';

/**
 * CallableService allows executing operations of a remote service.
 *
 * @public
 * @class
 */
module.exports.CallableService = class CallableService extends Service {

    /**
     * Constructor of CallableService.
     *
     * @public
     * @constructor
     * @param {ServiceContext} context - Context of the CallableService.
     */
    constructor(context) {
        super(context);

        //Initializes the internal state
        this.realService = null;
    }

    /**
     * Executes an operation in the remote service.
     *
     * @public
     * @function
     * @param {Object} request - Request to be executed.
     * @return {Promise} - Promise that resolves with the response received from the remote service and rejects if an error occurs.
     */
    execute(request) {
        return new Promise((resolve, reject) => {
            if (checkTypes.not.object(request) || checkTypes.emptyObject(request)) {
                const executeError2 = new Error('The parameter request must be a non-empty object');
                executeError2.code = EXECUTE_ERROR;
                reject(executeError2);
                return;
            }

            this.getRealServiceInformation().then((realServiceInformation) => {
                return _executeOperation(this, request);
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Gets the service description of the remote service.
     *
     * @public
     * @function
     * @returns {Promise} - Promise that resolves with the real service information and rejects if an error occurs.
     */
    getRealServiceInformation() {
        return new Promise((resolve, reject) => {
            if (checkTypes.not.object(this.realService) || checkTypes.emptyObject(this.realService) ||
                checkTypes.not.string(this.realService.location) || checkTypes.not.unemptyString(this.realService.location) ||
                checkTypes.not.integer(this.realService.port) || checkTypes.not.positive(this.realService.port)) {
                serviceDirectoryProxy.lookup(this).then((lookupResponse) => {
                    this.realService = {
                        location: lookupResponse.location,
                        port: lookupResponse.port
                    };

                    resolve(this.getRealServiceInformation());
                }).catch((lookupError) => {
                    this.realService = {};

                    reject(lookupError);
                });

                return;
            }

            if (checkTypes.not.object(this.realService.serviceContext) || checkTypes.emptyObject(this.realService.serviceContext) ||
                checkTypes.not.string(this.realService.certificate) || checkTypes.not.unemptyString(this.realService.certificate)) {
                serviceInformationRetriever.retrieveServiceInformation(this).then((serviceInformation) => {
                    this.realService.serviceContext = new ServiceContext(serviceInformation.serviceContext);
                    this.realService.certificate = serviceInformation.certificate;

                    resolve(this.getRealServiceInformation());
                }).catch((retrivalError) => {
                    this.realService = {};

                    reject(retrivalError);
                });

                return;
            }

            resolve(this.realService);
        });
    }

}

/**
 * Sends the request to execute an operation in a remote service.
 *
 * @private
 * @function
 * @param {Object} service - Service that has the operation to be executed.
 * @param {Object} request - Request to be sent.
 * @return {Promise} - Promise that resolves with the response received from the remote service and rejects if an error occurs.
 */
function _executeOperation(service, request) {
    return new Promise((resolve, reject) => {
        const realServiceContext = service.realService.serviceContext;
        if (checkTypes.not.object(realServiceContext) || checkTypes.emptyObject(realServiceContext)) {
            const serviceInformationError1 = new Error('The service context is not defined in the retrieved service information.');
            serviceInformationError1.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError1);
            return;
        }

        const realName = realServiceContext.getName();
        if (checkTypes.not.string(realName) || checkTypes.not.unemptyString(realName)) {
            const serviceInformationError2 = new Error('The name data is not defined in the retrieved service information.');
            serviceInformationError2.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError2);
            return;
        }

        const realApi = realServiceContext.getApi();
        if (checkTypes.not.integer(realApi) || checkTypes.not.positive(realApi)) {
            const serviceInformationError3 = new Error('The API data is not defined in the retrieved service information.');
            serviceInformationError3.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError3);
            return;
        }

        const realOperation = realServiceContext.getOperation(request.operation);
        if (checkTypes.not.object(realOperation) || checkTypes.emptyObject(realOperation)) {
            const executeError1 = new Error(`The operation ${request.operation} cannot be executed because it does not defined in the retrieved service information.`);
            executeError1.code = EXECUTE_ERROR;
            reject(executeError1);
            return;
        }

        const realOperationSecurity = realServiceContext.getSecurity(request.operation);
        if (checkTypes.not.object(realOperationSecurity) || checkTypes.emptyObject(realOperationSecurity)) {
            const serviceInformationError4 = new Error(`The operation ${request.operation} is not well defined in the retrieved service information: security field is missing.`);
            serviceInformationError4.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError4);
            return;
        }

        let authorization = undefined;
        if (realOperationSecurity.scheme !== 'none') {
            if (checkTypes.not.object(request.credentials) || checkTypes.emptyObject(request.credentials)) {
                const executeError2 = new Error(`The operation ${request.operation} cannot be executed because the credentials have not been defined for authorization.`);
                executeError2.code = EXECUTE_ERROR;
                reject(executeError2);
                return;
            }

            if (realOperationSecurity.scheme === 'basic') {
                authorization = `${request.credentials.username}:${request.credentials.password}`;
            } else {
                const executeError3 = new Error(`The operation ${request.operation} cannot be executed because ${realOperationSecurity.scheme} authorization scheme is not supported by the current Microrestjs version.`);
                executeError3.code = EXECUTE_ERROR;
                reject(executeError3);
                return;
            }
        }

        const realOperationRequest = realOperation.request;
        if (checkTypes.not.object(realOperationRequest) || checkTypes.emptyObject(realOperationRequest)) {
            const serviceInformationError5 = new Error(`The operation ${request.operation} is not well defined in the retrieved service information: request field is missing.`);
            serviceInformationError5.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError5);
            return;
        }

        const realOperationMethod = realOperationRequest.method;
        if (checkTypes.not.string(realOperationMethod) || checkTypes.not.unemptyString(realOperationMethod)) {
            const serviceInformationError6 = new Error(`The operation ${request.operation} is not well defined in the retrieved service information: method field is missing.`);
            serviceInformationError6.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError6);
            return;
        }

        let realOperationPath = realOperationRequest.path;
        if (checkTypes.not.string(realOperationPath) || checkTypes.not.unemptyString(realOperationPath)) {
            const serviceInformationError7 = new Error(`The operation ${request.operation} is not well defined in the retrieved service information: path field is missing.`);
            serviceInformationError7.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError7);
            return;
        }

        let realQueryString = '';
        const realParameters = realOperationRequest.parameters;
        if (checkTypes.object(realParameters) && checkTypes.not.emptyObject(realParameters)) {
            const parametersNames = Object.keys(realParameters);
            for (let i = 0; i < parametersNames.length; i++) {
                const paramName = parametersNames[i];
                const paramIn = realParameters[paramName].in;
                const paramType = realParameters[paramName].type;
                const paramRequired = realParameters[paramName].required;

                const realParamValue = request.parameters[paramName];
                if (paramRequired === true && checkTypes.not.assigned(realParamValue)) {
                    const executeError4 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} is required.`);
                    executeError4.code = EXECUTE_ERROR;
                    reject(executeError4);
                    return;
                }

                if (paramType !== 'string' && paramType !== 'integer' && paramType !== 'number' && paramType !== 'boolean') {
                    const executeError5 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has not a type supported by the current Microrestjs version.`);
                    executeError5.code = EXECUTE_ERROR;
                    reject(executeError5);
                    return;
                }

                if (paramType === 'string' && checkTypes.not.string(realParamValue)) {
                    const executeError6 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a string.`);
                    executeError6.code = EXECUTE_ERROR;
                    reject(executeError6);
                    return;
                } else if (paramType === 'integer' && checkTypes.not.integer(realParamValue)) {
                    const executeError7 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be an integer.`);
                    executeError7.code = EXECUTE_ERROR;
                    reject(executeError7);
                    return;
                } else if (paramType === 'number' && checkTypes.not.number(realParamValue)) {
                    const executeError8 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a number.`);
                    executeError8.code = EXECUTE_ERROR;
                    reject(executeError8);
                    return;
                } else if (paramType === 'boolean' && checkTypes.not.boolean(realParamValue)) {
                    const executeError9 = new Error(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a boolean.`);
                    executeError9.code = EXECUTE_ERROR;
                    reject(executeError9);
                    return;
                }

                if (paramIn === 'path') {
                    realOperationPath = realOperationPath.replace(`:${paramName}`, realParamValue);
                } else if (paramIn === 'query') {
                    if (checkTypes.not.unemptyString(realQueryString)) {
                        realQueryString = `?${paramName}=${realParamValue}`;
                    } else {
                        realQueryString = `${realQueryString}&${paramName}=${realParamValue}`;
                    }
                } else {
                    const executeError10 = new Error(`The operation ${request.operation} cannot be executed because ${paramIn} parameters are not supported by the current Microrestjs version.`);
                    executeError10.code = EXECUTE_ERROR;
                    reject(executeError10);
                    return;
                }
            }
        }

        const realServicePath = `${realName}/v${realApi}`;
        const realCompletePath = `/${realServicePath}${realOperationPath}${realQueryString}`;

        const realLocation = service.realService.location;
        if (checkTypes.not.string(realLocation) || checkTypes.not.unemptyString(realLocation)) {
            const serviceInformationError8 = new Error('The location is not defined in the retrieved service information.');
            serviceInformationError8.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError8);
            return;
        }

        const realPort = service.realService.port;
        if (checkTypes.not.integer(realPort) || checkTypes.not.positive(realPort) || realPort > 65535) {
            const serviceInformationError9 = new Error('The port is not well defined in the retrieved service information.');
            serviceInformationError9.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError9);
            return;
        }

        const realServiceCertificate = service.realService.certificate;
        if (checkTypes.not.string(realServiceCertificate) || checkTypes.not.unemptyString(realServiceCertificate)) {
            const serviceInformationError10 = new Error('The certificate is not defined in the retrieved service information.');
            serviceInformationError10.code = SERVICE_INFORMATION_ERROR;
            reject(serviceInformationError10);
            return;
        }

        let headers = undefined;
        let body = undefined;
        if (checkTypes.assigned(request.body)) {
            if (checkTypes.not.object(request.body)) {
                const executeError11 = new Error(`The operation ${request.operation} cannot be executed because the request body is not an object.`);
                executeError11.code = EXECUTE_ERROR;
                reject(executeError11);
                return;
            }

            const jsonBody = JSON.stringify(request.body);

            headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(jsonBody, 'utf8')
            };

            body = new Buffer(jsonBody, 'utf8');
        }

        const completeRequest = {
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

        client.send(completeRequest).then((callableServiceResponse) => {
            if (callableServiceResponse.getStatus() === 503) {
                service.realService = {};
            }

            resolve(callableServiceResponse);
        }).catch((error) => {
            service.realService = {};
            reject(error);
        });
    });
}
