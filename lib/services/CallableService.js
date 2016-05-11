'use strict';

/**
 * Creates CallableService objects.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');

const Service = require('./Service');

const ServiceContextError = require('../errors/ServiceContextError');
const ExecuteError = require('../errors/ExecuteError');

/**
 * CallableService allows executing operations of a remote service.
 *
 * @public
 * @class
 */
module.exports = class CallableService extends Service {

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
                reject(new TypeError('The parameter request must be a non-empty object'));
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
                checkTypes.not.string(this.realService.location) || checkTypes.emptyString(this.realService.location) ||
                checkTypes.not.integer(this.realService.port) || checkTypes.not.positive(this.realService.port)) {
                const serviceDirectoryProxy = require('../helpers/proxies/ServiceDirectoryProxy');
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
                checkTypes.not.string(this.realService.certificate) || checkTypes.emptyString(this.realService.certificate)) {
                const serviceInformationRetriever = require('../helpers/proxies/ServiceInformationRetriever');
                serviceInformationRetriever.retrieveServiceInformation(this).then((serviceInformation) => {
                    const ServiceContext = require('./ServiceContext');
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

};

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
            reject(new ServiceContextError('The service context is not defined in the retrieved service information.'));
            return;
        }

        const realName = realServiceContext.getName();
        if (checkTypes.not.string(realName) || checkTypes.emptyString(realName)) {
            reject(new ServiceContextError('The name data is not defined in the retrieved service information.'));
            return;
        }

        const realApi = realServiceContext.getApi();
        if (checkTypes.not.integer(realApi) || checkTypes.not.positive(realApi)) {
            reject(new ServiceContextError('The API data is not defined in the retrieved service information.'));
            return;
        }

        const realOperation = realServiceContext.getOperation(request.operation);
        if (checkTypes.not.object(realOperation) || checkTypes.emptyObject(realOperation)) {
            reject(new ExecuteError(`The operation ${request.operation} cannot be executed because it does not defined in the retrieved service information.`));
            return;
        }

        const realOperationSecurity = realServiceContext.getSecurity(request.operation);
        if (checkTypes.not.object(realOperationSecurity) || checkTypes.emptyObject(realOperationSecurity)) {
            reject(new ServiceContextError(`The operation ${request.operation} is not well defined in the retrieved service information: security field is missing.`));
            return;
        }

        let authorization = undefined;
        if (realOperationSecurity.scheme !== 'none') {
            if (checkTypes.not.object(request.credentials) || checkTypes.emptyObject(request.credentials)) {
                reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the credentials have not been defined for authorization.`));
                return;
            }

            if (realOperationSecurity.scheme === 'basic') {
                authorization = `${request.credentials.username}:${request.credentials.password}`;
            } else {
                reject(new ExecuteError(`The operation ${request.operation} cannot be executed because ${realOperationSecurity.scheme} authorization scheme is not supported by the current Microrestjs version.`));
                return;
            }
        }

        const realOperationRequest = realOperation.request;
        if (checkTypes.not.object(realOperationRequest) || checkTypes.emptyObject(realOperationRequest)) {
            reject(new ServiceContextError(`The operation ${request.operation} is not well defined in the retrieved service information: request field is missing.`));
            return;
        }

        const realOperationMethod = realOperationRequest.method;
        if (checkTypes.not.string(realOperationMethod) || checkTypes.emptyString(realOperationMethod)) {
            reject(new ServiceContextError(`The operation ${request.operation} is not well defined in the retrieved service information: method field is missing.`));
            return;
        }

        let realOperationPath = realOperationRequest.path;
        if (checkTypes.not.string(realOperationPath) || checkTypes.emptyString(realOperationPath)) {
            reject(new ServiceContextError(`The operation ${request.operation} is not well defined in the retrieved service information: path field is missing.`));
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
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} is required.`));
                    return;
                }

                if (paramType !== 'string' && paramType !== 'integer' && paramType !== 'number' && paramType !== 'boolean') {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has not a type supported by the current Microrestjs version.`));
                    return;
                }

                if (paramType === 'string' && checkTypes.not.string(realParamValue)) {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a string.`));
                    return;
                } else if (paramType === 'integer' && checkTypes.not.integer(realParamValue)) {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be an integer.`));
                    return;
                } else if (paramType === 'number' && checkTypes.not.number(realParamValue)) {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a number.`));
                    return;
                } else if (paramType === 'boolean' && checkTypes.not.boolean(realParamValue)) {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the parameter ${paramName} has to be a boolean.`));
                    return;
                }

                if (paramIn === 'path') {
                    realOperationPath = realOperationPath.replace(`:${paramName}`, realParamValue);
                } else if (paramIn === 'query') {
                    if (checkTypes.emptyString(realQueryString)) {
                        realQueryString = `?${paramName}=${realParamValue}`;
                    } else {
                        realQueryString = `${realQueryString}&${paramName}=${realParamValue}`;
                    }
                } else {
                    reject(new ExecuteError(`The operation ${request.operation} cannot be executed because ${paramIn} parameters are not supported by the current Microrestjs version.`));
                    return;
                }
            }
        }

        const realServicePath = `${realName}/v${realApi}`;
        const realCompletePath = `/${realServicePath}${realOperationPath}${realQueryString}`;

        const realLocation = service.realService.location;
        if (checkTypes.not.string(realLocation) || checkTypes.emptyString(realLocation)) {
            reject(new ServiceContextError('The location is not defined in the retrieved service information.'));
            return;
        }

        const realPort = service.realService.port;
        if (checkTypes.not.integer(realPort) || checkTypes.not.inRange(realPort, 1, 65535)) {
            reject(new ServiceContextError('The port is not well defined in the retrieved service information.'));
            return;
        }

        const realServiceCertificate = service.realService.certificate;
        if (checkTypes.not.string(realServiceCertificate) || checkTypes.emptyString(realServiceCertificate)) {
            reject(new ServiceContextError('The certificate is not defined in the retrieved service information.'));
            return;
        }

        let headers = undefined;
        let body = undefined;
        if (checkTypes.assigned(request.body)) {
            if (checkTypes.not.object(request.body)) {
                reject(new ExecuteError(`The operation ${request.operation} cannot be executed because the request body is not an object.`));
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

        const client = require('../platform/Client');
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
