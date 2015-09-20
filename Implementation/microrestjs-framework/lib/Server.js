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
    this.servicesCredentials = {
        keys: '',
        certificates: '',
        cas: []
    };

    this.app = express();
    this.app.set('x-powered-by', false);
    this.app.enable('trust proxy');

    var bodyParser = require('body-parser');
    this.app.use(bodyParser.json());

    this.httpsServer = null;
}

/**
 * Listens HTTP requests from the specified port.
 *
 * @public
 * @function
 * @param {integer} port - Port to listen the received requests.
 * @throws an Error if the port parameter is not a valid integer between 0 and 65535.
 */
Server.prototype.listen = function listen(port) {
    if (checkTypes.not.integer(port) || checkTypes.negative(port) || port > 65535) {
        throw new Error('The parameter port must be an integer from 0 to 65535.');
    }

    var serverOptions = {
        key: this.servicesCredentials.keys,
        cert: this.servicesCredentials.certificates,
        ca: this.servicesCredentials.cas,
        rejectUnauthorized: false,
        requestCert: true
    };

    this.httpsServer = https.createServer(serverOptions, this.app).listen(port);
    logger.info('The server is now running and listening request for the deployed services.');
};

/**
 * Adds the service credentials to the server.
 *
 * NOTE: This function must be called before the server starts listening.
 *
 * @public
 * @function
 * @param {Object} credentials - Service credentials to be added.
 */
Server.prototype.addServiceCredentialsToServer = function addServiceCredentialsToServer(credentials) {
    this.servicesCredentials.keys = this.servicesCredentials.keys + '\n' + credentials.key;
    this.servicesCredentials.certificates = this.servicesCredentials.certificates + '\n' + credentials.certificate;
    this.servicesCredentials.cas.push(credentials.ca);
};

/**
 * Routes all the HTTP requests of the service.
 *
 * @public
 * @function
 * @param {Service} runnableService - Service to be routed.
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

    this.servicesCredentials = null;
    this.app = null;
    this.httpsServer = null;
};

/**
 * Creates a new ExpressRouter and routes all the operations of the service.
 *
 * @private
 * @function
 * @param {Object} runnableService - RunnableService to be routed.
 * @returns {Object} - ExpressRouter with all the operations routed.
 */
function _routeOperations(runnableService) {
    var router = express.Router();

    var operations = runnableService.getContext().operations;
    for (var operation in operations) {
        var operationRequest = operations[operation].request;
        var operationPath = operationRequest.path;
        var operationMethod = operationRequest.method.toLowerCase();
        router[operationMethod](operationPath, runnableServiceCaller.getOperationCall(runnableService, operation));
    }

    router.get('/', runnableServiceCaller.getOperationCall(runnableService, 'getServiceInformation'));

    return router;
}
