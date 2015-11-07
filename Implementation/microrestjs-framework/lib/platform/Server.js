'use strict';

/**
 * Creates and runs a web server to listen HTTP requests.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var https = require('https');
var constants = require('constants');
var express = require('express');
var bodyParser = require('body-parser');
var checkTypes = require('check-types');

var logger = require('../helpers/logging/LoggerManager').getLogger('Server');
var authorizationManager = require('../helpers/security/authorization/AuthorizationManager');
var runnableServiceCaller = require('../helpers/proxies/RunnableServiceCaller');

/**
 * Get a new instance of Server class.
 *
 * @public
 * @static
 * @function
 * @returns {Server} - Server instance.
 */
module.exports.getInstance = function getInstance() {
    return new Server();
};

/**
 * Server allows creating and running a web server to listen HTTP request for the services.
 *
 * @class
 */
function Server() {
    //Initializes the internal state
    this.platformCredentials = {
        key: '',
        certificate: ''
    };

    this.app = express();
    this.app.set('x-powered-by', false);
    this.app.enable('trust proxy');
    this.app.use(bodyParser.json());

    this.routedServices = [];
    this.app.all('*', _getCheckRoutedServicesFunction(this.routedServices));

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
 */
Server.prototype.addPlatformCredentials = function addPlatformCredentials(credentials) {
    if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
        checkTypes.not.string(credentials.key) || checkTypes.not.unemptyString(credentials.key) ||
        checkTypes.not.string(credentials.certificate) || checkTypes.not.unemptyString(credentials.certificate)) {
        throw new Error('The parameter credentials must be a valid credentials object.');
    }

    this.platformCredentials.key = credentials.key;
    this.platformCredentials.certificate = credentials.certificate;
};

/**
 * Listens HTTP requests from the specified port.
 *
 * @public
 * @function
 * @param {Integer} port - Port to listen the received requests.
 * @throws an Error if the port parameter is not a valid integer between 0 and 65535.
 */
Server.prototype.listen = function listen(port) {
    if (checkTypes.not.integer(port) || checkTypes.negative(port) || port > 65535) {
        throw new Error('The parameter port must be an integer from 0 to 65535.');
    }

    var serverOptions = {
        key: this.platformCredentials.key,
        cert: this.platformCredentials.certificate,
        rejectUnauthorized: false,
        requestCert: true,
        secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1
    };

    this.httpsServer = https.createServer(serverOptions, this.app).listen(port);
    logger.info('The server is now running and listening request for the deployed services.');
};

/**
 * Routes all the HTTP requests of the service.
 *
 * @public
 * @function
 * @param {RunnableService} runnableService - Service to be routed.
 * @throws an Error if the runnableService parameter is not a RunnableService object.
 */
Server.prototype.route = function route(runnableService) {
    if (checkTypes.not.object(runnableService) || checkTypes.emptyObject(runnableService)) {
        //TODO: Improve the condition. Check if is a Service instance.
        throw new Error('The parameter service must be a RunnableService object');
    }

    var router = _routeOperations(runnableService);

    var serviceURI = '/' + runnableService.getIdentificationName();
    this.app.use(serviceURI, router);
    this.routedServices.push(serviceURI);

    logger.info('The service %s has been deployed successfully.', runnableService.getIdentificationName());
};

/**
 * Stops and shuts down the HTTP Server gracefully.
 *
 * @public
 * @function
 */
Server.prototype.shutdown = function shutdown() {
    if (checkTypes.assigned(this.httpsServer)) {
        this.httpsServer.close();
    }

    this.platformCredentials = null;
    this.app = null;
    this.routedServices = null;
    this.httpsServer = null;
};

/**
 * Creates a new ExpressRouter and routes all the operations of the service.
 *
 * @private
 * @function
 * @param {RunnableService} runnableService - RunnableService to be routed.
 * @returns {Object} - ExpressRouter with all the operations routed.
 */
function _routeOperations(runnableService) {
    var router = express.Router();

    var operations = runnableService.getContext().getOperations();
    if (checkTypes.object(operations) && checkTypes.not.emptyObject(operations)) {
        var routedPaths = {};
        var operationsNames = Object.keys(operations);
        for (var i = 0; i < operationsNames.length; i++) {
            var operation = operationsNames[i];
            var operationRequest = operations[operation].request;
            var operationPath = operationRequest.path;
            var operationMethod = operationRequest.method.toLowerCase();

            var routedMethods = routedPaths[operationPath] || [];
            if (routedMethods.indexOf(operationRequest.method) > -1) {
                logger.warn('The operation %s could not be routed because the method %s has been already used for the path %s in other operation.', operation, operationRequest.method, operationPath);
            } else {
                var checkOperationRequestCall = runnableServiceCaller.getCheckOperationRequestCall(runnableService, operation);
                var authorizationCall = authorizationManager.getAuthorizationCall(runnableService, operation);
                var operationCall = runnableServiceCaller.getOperationCall(runnableService, operation);

                router[operationMethod](operationPath, checkOperationRequestCall, authorizationCall, operationCall);

                routedMethods.push(operationRequest.method);
                routedPaths[operationPath] = routedMethods;
            }
        }

        var routedPathsNames = Object.keys(routedPaths);
        for (var j = 0; j < routedPathsNames.length; j++) {
            var routedPath = routedPathsNames[j];
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
 * @returns {Function} - Function that checks whether the path corresponds with a routed service.
 */
function _getCheckRoutedServicesFunction(routedServices) {
    return function _checkRoutedServicesFunction(expressRequest, expressResponse, next) {
        var result = routedServices.some(function _checkRoutedServicesArray(value) {
            return expressRequest.originalUrl.substring(0, value.length) === value;
        });

        if (result === false) {
            expressResponse.sendStatus(503);
            return;
        }

        next();
    };
}
