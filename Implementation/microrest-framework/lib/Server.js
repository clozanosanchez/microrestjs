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

var express = require('express');
var checkTypes = require('check-types');

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
    this.app = express();
}

/**
 * Listens HTTP requests from the specified port.
 *
 * @public
 * @param {integer} port - Port to listen the received requests.
 * @throws an Error if the port parameter is not valid.
 */
Server.prototype.listen = function listen(port) {
    if (checkTypes.not.assigned(port) || checkTypes.not.integer(port) || checkTypes.negative(port) || port > 65535) {
        throw new Error('The parameter port must be an integer from 0 to 65535.');
    }

    this.app.listen(port);
};

/**
 * Routes all the HTTP requests of the service.
 *
 * @public
 * @param {Service} service - Service to be routed.
 * @throws an Error if the service parameter is not valid.
 */
Server.prototype.route = function route(service) {
    if (checkTypes.not.assigned(service)) {
        //TODO: Improve the condition. Check if is a Service instance.
        throw new Error('The parameter service must be a Service object');
    }

    //TODO: Implement
};
