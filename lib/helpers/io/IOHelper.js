'use strict';

/**
 * Provides tools for managing the requests and responses uniformly inside the platform.
 *
 * For requests to RunnableServices (Client -> RunnableService):
 *   - Convert ExpressRequests (from clients) into RunnableServiceRequests
 *
 * For responses from RunnableServices (RunnableService -> Client):
 *   - Create RunnableServiceReponses to facilitate the response to clients
 *   - Send RunnableServiceResponses (to clients) as ExpressResponses
 *
 * For responses from CallableServices (remote CallableService -> this RunnableService):
 *   - Convert HTTPResponses (from remote services) into CallableServiceResponses
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const http = require('http');

const ResponseError = require('../../errors/ResponseError');

/**
 * Converts ExpressRequests, sent by clients to execute one operation,
 * into RunnableServiceRequests.
 *
 * @public
 * @static
 * @function
 * @param {Object} expressRequest - ExpressRequest to be converted.
 * @returns {RunnableServiceRequest} - Equivalent RunnableServiceRequest.
 * @throws a TypeError if the expressRequest parameter is not a valid ExpressResquest object.
 */
module.exports.convertExpressRequestToRunnableServiceRequest = function convertExpressRequestToRunnableServiceRequest(expressRequest) {
    if (checkTypes.not.object(expressRequest) || checkTypes.emptyObject(expressRequest)) {
        throw new TypeError('The parameter expressRequest must be a valid Express Request object.');
    }

    const RunnableServiceRequest = require('../../messages/RunnableServiceRequest');
    const request = new RunnableServiceRequest();

    request.headers = expressRequest.headers;
    request.pathParameters = expressRequest.params;
    request.queryParameters = expressRequest.query;
    request.hostname = expressRequest.hostname || '';
    request.subdomains = expressRequest.subdomains || [];
    request.originalUrl = expressRequest.originalUrl || '';
    request.ip = expressRequest.ip || '';
    request.ips = expressRequest.ips || [];
    request.xhr = expressRequest.xhr || false;
    request.body = expressRequest.body || {};
    request.credentials = expressRequest.credentials || {};
    request.authorizedUser = expressRequest.authorizedUser || '';

    return request;
};

/**
 * Creates a new RunnableServiceResponse in order to respond to a client easily.
 *
 * @public
 * @static
 * @function
 * @returns {RunnableServiceResponse} - a RunnableServiceResponse to respond to a client.
 */
module.exports.createRunnableServiceResponse = function createRunnableServiceResponse() {
    const RunnableServiceResponse = require('../../messages/RunnableServiceResponse');
    return new RunnableServiceResponse();
};

/**
 * Sends a RunnableServiceResponse, to a client, encapsulated within a ExpressResponse.
 *
 * @public
 * @static
 * @function
 * @param {RunnableServiceResponse} runnableServiceResponse - RunnableServiceResponse to be sent
 * @param {Object} expressResponse - ExpressResponse to encapsulate the RunnableServiceResponse that has to be sent.
 * @returns {Boolean | ResponseError} - true, if the response is sent successfully; a ResponseError, otherwise.
 * @throws a TypeError if the runnableServiceResponse is not a valid RunnableServiceResponse object.
 * @throws a TypeError if the expressResponse is not a valid ExpressResponse object.
 */
module.exports.sendRunnableServiceResponseAsExpressResponse = function sendRunnableServiceResponseAsExpressResponse(runnableServiceResponse, expressResponse) {
    const RunnableServiceResponse = require('../../messages/RunnableServiceResponse');
    if (checkTypes.not.object(runnableServiceResponse) || checkTypes.not.instanceStrict(runnableServiceResponse, RunnableServiceResponse)) {
        throw new TypeError('The parameter runnableServiceResponse must be a RunnableServiceResponse object.');
    }

    if (checkTypes.not.object(expressResponse) || checkTypes.emptyObject(expressResponse)) {
        throw new TypeError('The parameter expressResponse must be a valid Express Response object.');
    }

    const status = runnableServiceResponse.getStatus();
    if (checkTypes.not.integer(status) || checkTypes.not.inRange(status, 100, 599)) {
        expressResponse.status(500);
        const errorMessage = 'The invoked service operation has not specified a valid HTTP Status Code.';
        expressResponse.send(`SERVER ERROR: ${errorMessage}`);

        const responseError = new ResponseError(errorMessage);
        return responseError;
    }

    expressResponse.status(status);

    const body = runnableServiceResponse.getBody();
    if (checkTypes.assigned(body)) {
        expressResponse.json(body);
    } else {
        expressResponse.end();
    }

    return true;
};

/**
 * Converts IncomingMessages, received from a CallableService after invoking one operation,
 * into CallableServiceServiceResponses.
 *
 * @public
 * @static
 * @function
 * @param {Object} httpResponse - IncomingMessage to be converted.
 * @param {String} body - Body of the httpResponse
 * @returns {CallableServiceResponse} - Equivalent CallableServiceResponse.
 * @throws a TypeError if the httpResponse parameter is not a valid IncomingMessage object.
 * @throws a TypeError if the body parameter is not a string.
 * @throws an Error if the body is not a JSON and, therefore, it cannot be parsed to an object.
 */
module.exports.convertHttpResponseToCallableServiceResponse = function convertHttpResponseToCallableServiceResponse(httpResponse, body) {
    if (checkTypes.not.object(httpResponse) || checkTypes.not.instanceStrict(httpResponse, http.IncomingMessage)) {
        throw new TypeError('The parameter httpResponse must be a valid IncomingMessage object.');
    }

    if (checkTypes.not.string(body)) {
        throw new TypeError('The parameter body must be a string.');
    }

    const CallableServiceResponse = require('../../messages/CallableServiceResponse');
    const response = new CallableServiceResponse();

    response.status = httpResponse.statusCode;
    response.statusMessage = httpResponse.statusMessage;
    response.headers = httpResponse.headers || {};

    if (checkTypes.emptyString(body)) {
        response.body = {};
    } else {
        response.body = JSON.parse(body);
    }

    return response;
};
