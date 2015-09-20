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
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');
var cookieParser = require('cookie-parser');

var RunnableServiceRequest = require('./RunnableServiceRequest');
var RunnableServiceResponse = require('./RunnableServiceResponse');
var CallableServiceResponse = require('./CallableServiceResponse');

/**
 * Converts ExpressRequests, sent by clients to execute one operation,
 * into RunnableServiceRequests.
 *
 * @public
 * @static
 * @function
 * @param {Object} expressRequest - ExpressRequest to be converted.
 * @returns {Object} - Equivalent RunnableServiceRequest.
 * @throws an Error if the expressRequest parameter is not a valid ExpressResquest object.
 */
module.exports.convertExpressRequestToRunnableServiceRequest = function convertExpressRequestToRunnableServiceRequest(expressRequest) {
    if (checkTypes.not.object(expressRequest) || checkTypes.emptyObject(expressRequest)) {
        //TODO: Improve condition to check if it is a ExpressRequest
        throw new Error('The parameter expressRequest must be a non-empty object.');
    }

    var request = new RunnableServiceRequest();

    request.cookies = expressRequest.cookies;
    request.pathParameters = expressRequest.params;
    request.queryParameters = expressRequest.query;
    request.body = expressRequest.body;
    request.ip = expressRequest.ip;

    return request;
};

/**
 * Creates a new RunnableServiceResponse in order to respond to a client easily
 *
 * @public
 * @static
 * @function
 * @returns {Object} - a RunnableServiceResponse to respond to a client.
 */
module.exports.createRunnableServiceResponse = function createRunnableServiceResponse() {
    return new RunnableServiceResponse();
};

/**
 * Sends a RunnableServiceResponse, to a client, encapsulated within a ExpressResponse.
 *
 * @public
 * @static
 * @function
 * @param {Object} runnableServiceResponse - RunnableServiceResponse to be sent
 * @param {Object} expressResponse - ExpressResponse to encapsulate the RunnableServiceResponse that has to be sent.
 * @returns {Boolean | Error} - true, if the response is sent successfully; an Error, otherwise.
 * @throws an Error if the runnableServiceResponse is not a valid RunnableServiceResponse object.
 * @throws an Error if the expressResponse is not a valid ExpressResponse object.
 */
module.exports.sendRunnableServiceResponseAsExpressResponse = function sendRunnableServiceResponseAsExpressResponse(runnableServiceResponse, expressResponse) {
    if (checkTypes.not.object(runnableServiceResponse) || checkTypes.emptyObject(runnableServiceResponse)) {
        //TODO: Improve condition to check if it is a RunnableServiceResponse
        throw new Error('The parameter runnableServiceResponse must be a non-empty object.');
    }

    if (checkTypes.not.object(expressResponse) || checkTypes.emptyObject(expressResponse)) {
        //TODO: Improve condition to check if it is a ExpressResponse
        throw new Error('The parameter expressResponse must be a non-empty object.');
    }

    var status = runnableServiceResponse.getStatus();
    if (checkTypes.not.integer(status) || checkTypes.not.between(status, 100, 599)) {
        expressResponse.status(500);
        var errorMessage = 'The invoked service operation has not specified a valid HTTP Status Code.';
        expressResponse.send('SERVER ERROR: ' + errorMessage);

        var sendingError = new Error(errorMessage);
        sendingError.code = 'RESPONSE_ERROR';
        return sendingError;
    } else {
        expressResponse.status(status);
    }

    var cookies = runnableServiceResponse.getCookies();
    for (var cookieName in cookies) {
        var cookie = cookies[cookieName];
        if (checkTypes.object(cookie) && checkTypes.not.emptyObject(cookie) && checkTypes.assigned(cookie.value)) {
            if (checkTypes.object(cookie.options) && checkTypes.not.emptyObject(cookie.options)) {
                var options = cookie.options;
                options.domain = undefined;
                options.path = undefined;
                options.secure = true;
                expressResponse.cookie(cookieName, cookie.value, options);
            } else {
                expressResponse.cookie(cookieName, cookie.value);
            }
        }
    }

    var files = runnableServiceResponse.getFiles();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (checkTypes.string(file) && checkTypes.unemptyString(file)) {
            expressResponse.attachment(file);
        }
    }

    var body = runnableServiceResponse.getBody();
    if (checkTypes.assigned(body)) {
        expressResponse.send(body);
    } else {
        expressResponse.end();
    }

    return true;
};

/**
 * Converts HTTPResponses, received from a CallableService after invoking one operation,
 * into CallableServiceServiceResponses.
 *
 * @public
 * @static
 * @function
 * @param {Object} httpResponse - HTTPResponse to be converted.
 * @returns {Object} - Equivalent CallableServiceResponse.
 * @throws an Error if the httpResponse parameter is not a valid HTTPResponse object.
 */
module.exports.convertHttpResponseToCallableServiceResponse = function convertHttpResponseToCallableServiceResponse(httpResponse, body) {
    if (checkTypes.not.object(httpResponse) || checkTypes.emptyObject(httpResponse)) {
        //TODO: Improve condition to check if it is a HttpResponse
        throw new Error('The parameter httpResponse must be a non-empty object.');
    }

    var response = new CallableServiceResponse();

    response.status = httpResponse.statusCode;
    response.statusMessage = httpResponse.statusMessage;
    var cookies = httpResponse.headers.cookie;
    if (checkTypes.string(cookies) && checkTypes.unemptyString(cookies)) {
        response.cookies = cookieParser.JSONCookies(cookies);
    }

    try {
        response.body = JSON.parse(body);
    } catch (err) {
        response.body = body;
    }

    return response;
};