'use strict';

var checkTypes = require('check-types');

module.exports.onCreateService = function onCreateService() {
    this.authorizationList = {
        'yellow-pages/v1': {
            users: ['uid294jdxod'],
            operations: {
                search: {
                    users: []
                }
            }
        },
        'yellow-pages-people/v1': {
            users: ['uid294jdxod'],
            operations: {
                search: {
                    users: []
                }
            }
        },
        'yellow-pages-companies/v1': {
            users: ['uid294jdxod'],
            operations: {
                search: {
                    users: []
                }
            }
        }
    };
};

module.exports.onDestroyService = function onDestroyService() {
    this.authorizationList = null;
};

module.exports.authorize = function authorize(request, response, sendResponse) {
    var requestBody = request.getBody();

    if (checkTypes.not.object(requestBody) || checkTypes.emptyObject(requestBody)) {
        response.setStatus(400);
        sendResponse();
        return;
    }

    var authorization = requestBody.authorization;
    if (checkTypes.not.object(authorization) || checkTypes.emptyObject(authorization) ||
        checkTypes.not.string(authorization.userId) || checkTypes.not.unemptyString(authorization.userId) ||
        checkTypes.not.string(authorization.service) || checkTypes.not.unemptyString(authorization.service) ||
        checkTypes.not.string(authorization.operation) || checkTypes.not.unemptyString(authorization.operation)) {
        response.setStatus(400);
        sendResponse();
        return;
    }

    var authorized = _checkAuthorization(authorization.userId, authorization.service, authorization.operation, this.authorizationList);
    if (authorized === false) {
        response.setStatus(403);
        sendResponse();
        return;
    }

    response.setStatus(204);
    sendResponse();
};

function _checkAuthorization(userId, serviceName, operationName, authorizationList) {
    for (var service in authorizationList) {
        if (service === serviceName) {
            return _checkUsers(userId, authorizationList[service].users) ||
                    _checkOperations(userId, operationName, authorizationList[service].operations);
        }
    }

    return false;
}

function _checkOperations(userId, operationName, operationsList) {
    for (var operation in operationsList) {
        if (operation === operationName) {
            return _checkUsers(userId, operationsList[operation].users);
        }
    }

    return false;
}

function _checkUsers(userId, usersList) {
    for (var i = 0; i < usersList.length; i++) {
        if (usersList[i] === userId) {
            return true;
        }
    }

    return false;
}
