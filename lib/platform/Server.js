'use strict';

/**
 * Creates and runs a web server to listen HTTP requests.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const https = require('https');
const constants = require('constants');
const express = require('express');
const bodyParser = require('body-parser');
const checkTypes = require('check-types');

const loggerManager = require('../helpers/logging/LoggerManager');

/**
 * Server allows creating and running a web server to listen HTTP request for the services.
 *
 * @public
 * @class
 */
module.exports = class Server {

    /**
     * Constructor of the Server.
     *
     * @public
     * @constructor
     */
    constructor() {
        // Initializes the internal state
        this.logger = loggerManager.getLogger('Server');
        this.platformCredentials = {
            key: '',
            certificate: ''
        };

        this.app = express();
        this.app.set('x-powered-by', false);
        this.app.enable('trust proxy');
        this.app.use(bodyParser.json());

        this.routedServices = [];
        this.app.all('*', this._getCheckRoutedServicesFunction(this.routedServices));

        this.httpsServer = null;
    }

    /**
     * Adds the credentials of the platform to the server for SSL communication.
     *
     * NOTE: This function must be called before the server starts listening
     *       if SSL capabilities are desired.
     *
     * @public
     * @function
     * @param {Object} credentials - Service credentials to be added.
     * @throws a TypeError if the credentials parameter is not a valid object.
     */
    addPlatformCredentials(credentials) {
        if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
            checkTypes.not.string(credentials.key) || checkTypes.emptyString(credentials.key) ||
            checkTypes.not.string(credentials.certificate) || checkTypes.emptyString(credentials.certificate)) {
            throw new TypeError('The parameter credentials must be a valid credentials object.');
        }

        this.platformCredentials.key = credentials.key;
        this.platformCredentials.certificate = credentials.certificate;
    }

    /**
     * Listens HTTP requests from the specified port.
     *
     * @public
     * @function
     * @param {Integer} port - Port to listen the received requests.
     * @throws a TypeError if the port parameter is not an integer.
     * @throws a RangeError if the port parameter is not a valid integer between 0 and 65535.
     */
    listen(port) {
        if (checkTypes.not.integer(port)) {
            throw new TypeError('The parameter port must be an integer from 0 to 65535.');
        }

        if (checkTypes.not.inRange(port, 0, 65535)) {
            throw new RangeError('The parameter port must be an integer from 0 to 65535.');
        }

        const serverOptions = {
            key: this.platformCredentials.key,
            cert: this.platformCredentials.certificate,
            rejectUnauthorized: false,
            requestCert: true,
            secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1
        };

        this.httpsServer = https.createServer(serverOptions, this.app).listen(port);
        this.logger.info('The server is now running and listening request for the deployed services.');
    }

    /**
     * Routes all the HTTP requests of the service.
     *
     * @public
     * @function
     * @param {RunnableService} runnableService - Service to be routed.
     * @throws a TypeError if the runnableService parameter is not a RunnableService object.
     */
    route(runnableService) {
        const RunnableService = require('../services/RunnableService');
        if (checkTypes.not.object(runnableService) || checkTypes.not.instanceStrict(runnableService, RunnableService)) {
            throw new TypeError('The parameter service must be a RunnableService object');
        }

        const router = this._routeOperations(runnableService);

        const serviceURI = `/${runnableService.getIdentificationName()}`;
        this.app.use(serviceURI, router);
        this.routedServices.push(serviceURI);

        this.logger.info('The service %s has been deployed successfully.', runnableService.getIdentificationName());
    }

    /**
     * Stops and shuts down the HTTP Server gracefully.
     *
     * @public
     * @function
     */
    shutdown() {
        if (checkTypes.assigned(this.httpsServer)) {
            this.httpsServer.close();
        }

        this.platformCredentials = null;
        this.app = null;
        this.routedServices = null;
        this.httpsServer = null;
    }

    /**
     * Creates a new ExpressRouter and routes all the operations of the service.
     *
     * @private
     * @function
     * @param {RunnableService} runnableService - RunnableService to be routed.
     * @returns {Object} - ExpressRouter with all the operations routed.
     */
    _routeOperations(runnableService) {
        const runnableServiceCaller = require('../helpers/proxies/RunnableServiceCaller');
        const router = express.Router();

        const operations = runnableService.getContext().getOperations();
        if (checkTypes.object(operations) && checkTypes.not.emptyObject(operations)) {
            const routedPaths = {};
            for (const operation of Object.keys(operations)) {
                const operationRequest = operations[operation].request;
                const operationPath = operationRequest.path;
                const operationMethod = operationRequest.method.toLowerCase();

                const routedMethods = routedPaths[operationPath] || [];
                if (routedMethods.indexOf(operationRequest.method) > -1) {
                    this.logger.warn('The operation %s could not be routed because the method %s has been already used for the path %s in other operation.', operation, operationRequest.method, operationPath);
                } else {
                    const checkOperationRequestCall = runnableServiceCaller.getCheckOperationRequestCall(runnableService, operation);

                    const authorizationManager = require('../helpers/security/authorization/AuthorizationManager');
                    const authorizationCall = authorizationManager.getAuthorizationCall(runnableService, operation);
                    const operationCall = runnableServiceCaller.getOperationCall(runnableService, operation);

                    router[operationMethod](operationPath, checkOperationRequestCall, authorizationCall, operationCall);

                    routedMethods.push(operationRequest.method);
                    routedPaths[operationPath] = routedMethods;
                }
            }

            for (const routedPath of Object.keys(routedPaths)) {
                router.all(routedPath, runnableServiceCaller.getMethodNotAllowedCall(routedPaths[routedPath]));
            }
        }

        router.get('/', runnableServiceCaller.getOperationCall(runnableService, 'getServiceInformation'));
        router.all('/', runnableServiceCaller.getMethodNotAllowedCall(['GET']));

        return router;
    }

    /**
     * Gets a function to check if the request path corresponds with a routed service.
     *
     * @private
     * @function
     * @param {Array} routedServices - All the services that have been routed.
     * @returns {Function} - Function that checks whether the path corresponds with a routed service.
     */
    _getCheckRoutedServicesFunction(routedServices) {
        return function _checkRoutedServicesFunction(expressRequest, expressResponse, next) {
            const result = routedServices.some((routedService) => {
                return expressRequest.originalUrl.substring(0, routedService.length) === routedService;
            });

            if (result === false) {
                expressResponse.sendStatus(503);
                return;
            }

            next();
        };
    }
};
