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
var express = require('express');
var checkTypes = require('check-types');
var logger = require('winston').loggers.get('Server');

var authorizationManager = require('./helpers/authorization/AuthorizationManager');
var runnableServiceCaller = require('./RunnableServiceCaller');

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
    this.credentials = {
        key: '',
        certificate: ''
    };

    this.app = express();
    this.app.set('x-powered-by', false);
    this.app.enable('trust proxy');

    var bodyParser = require('body-parser');
    this.app.use(bodyParser.json());

    this.httpsServer = null;
}

/**
 * Adds the credentials to the server for SSL communication.
 *
 * NOTE: This function must be called before the server starts listening
 *       if SSL capabilities are desired.
 *
 * @public
 * @function
 * @param {Object} credentials - Service credentials to be added.
 */
Server.prototype.addCredentials = function addCredentials(credentials) {
    if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
        checkTypes.not.string(credentials.key) || checkTypes.not.unemptyString(credentials.key) ||
        checkTypes.not.string(credentials.certificate) || checkTypes.not.unemptyString(credentials.certificate)) {
        throw new Error('The parameter credentials must be a valid credentials object.');
    }

    this.credentials.key = credentials.key;
    this.credentials.certificate = credentials.certificate;
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
        key: this.credentials.key,
        cert: this.credentials.certificate,
        rejectUnauthorized: false,
        requestCert: true
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
        throw new Error('The parameter service must be a Service object');
    }

    var router = _routeOperations(runnableService);

    var serviceURI = '/' + runnableService.getIdentificationName();
    this.app.use(serviceURI, router);
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

    this.credentials = null;
    this.app = null;
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
        for (var operation in operations) {
            var operationRequest = operations[operation].request;
            var operationPath = operationRequest.path;
            var operationMethod = operationRequest.method.toLowerCase();

            var authorizationCall = authorizationManager.getAuthorizationCall(runnableService, operation);

            router[operationMethod](operationPath, authorizationCall, runnableServiceCaller.getOperationCall(runnableService, operation));
        }
    }

    router.get('/', runnableServiceCaller.getOperationCall(runnableService, 'getServiceInformation'));

    return router;
}
