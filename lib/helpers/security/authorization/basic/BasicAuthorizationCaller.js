'use strict';

/**
 * Provides functions for basic authorizations.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const basicAuthParser = require('basic-auth-parser');

const loggerManager = require('../../../logging/LoggerManager');

/**
 * Gets the function that authorize the execution of the operation though basic authorization.
 *
 * @public
 * @static
 * @function
 * @param {RunnableService} service - Service to be authorized.
 * @param {String} operation - Operation to be authorized.
 * @returns {Function} - Function that authorizes the execution of the operation.
 */
module.exports.getAuthorizationCall = function gatAuthorizationCall(service, operation) {
    return function _authorizorizationCall(expressRequest, expressResponse, next) {
        const authorizationHeader = expressRequest.get('Authorization');

        if (checkTypes.not.string(authorizationHeader) || checkTypes.emptyString(authorizationHeader)) {
            expressResponse.set('WWW-Authenticate', `Basic realm="${service.getIdentificationName()}/${operation}"`);
            expressResponse.sendStatus(401);
            return;
        }

        const authorizationObject = basicAuthParser(authorizationHeader);
        if (checkTypes.not.object(authorizationObject) || checkTypes.emptyObject(authorizationObject) ||
            checkTypes.not.string(authorizationObject.scheme) || authorizationObject.scheme !== 'Basic' ||
            checkTypes.not.string(authorizationObject.username) || checkTypes.not.string(authorizationObject.password)) {
            expressResponse.set('WWW-Authenticate', `Basic realm="${service.getIdentificationName()}/${operation}"`);
            expressResponse.sendStatus(401);
            return;
        }

        const basicAuthenticationServiceProxy = require('./BasicAuthenticationServiceProxy');
        basicAuthenticationServiceProxy.authenticate(authorizationObject.username, authorizationObject.password, service).then((authenticationResponse) => {
            if (authenticationResponse.getStatus() !== 201) {
                expressResponse.set('WWW-Authenticate', `Basic realm="${service.getIdentificationName()}/${operation}"`);
                expressResponse.sendStatus(401);
                return;
            }

            const userId = authenticationResponse.getBody().userId;
            if (checkTypes.not.string(userId) || checkTypes.emptyString(userId)) {
                expressResponse.set('WWW-Authenticate', `Basic realm="${service.getIdentificationName()}/${operation}"`);
                expressResponse.sendStatus(401);
                return;
            }

            const basicAuthorizationServiceProxy = require('./BasicAuthorizationServiceProxy');
            basicAuthorizationServiceProxy.authorize(userId, service, operation).then((authorizationResponse) => {
                if (authorizationResponse.getStatus() !== 204) {
                    expressResponse.sendStatus(403);
                    return;
                }

                expressRequest.credentials = authorizationObject;
                expressRequest.authorizedUser = userId;

                next();
            }).catch((authorizationError) => {
                const logger = loggerManager.getLogger('BasicAuthorizationCaller');
                const authorizationErrorMessage = `The authorization failed because -> ${authorizationError.message}`;
                logger.warn(authorizationErrorMessage);

                expressResponse.status(500);
                expressResponse.send(`SERVER ERROR: ${authorizationErrorMessage}`);
            });
        }).catch((authenticationError) => {
            const logger = loggerManager.getLogger('BasicAuthorizationCaller');
            const authenticationErrorMessage = `The authentication failed because -> ${authenticationError.message}`;
            logger.warn(authenticationErrorMessage);
            expressResponse.status(500);
            expressResponse.send(`SERVER ERROR: ${authenticationErrorMessage}`);
        });
    };
};
