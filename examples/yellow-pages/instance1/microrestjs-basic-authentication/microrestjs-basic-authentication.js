'use strict';

var checkTypes = require('check-types');

module.exports.onCreateService = function onCreateService() {
    this.users = {
        uid294jdxod: {
            username: 'admin',
            password: 'password'
        },
        uid385dgpqs: {
            username: 'noadmin',
            password: 'password'
        }
    };
};

module.exports.onDestroyService = function onDestroyService() {
    this.users = null;
};

module.exports.authenticate = function authenticate(request, response, sendResponse) {
    var requestBody = request.getBody();

    if (checkTypes.not.object(requestBody) || checkTypes.emptyObject(requestBody)) {
        response.setStatus(400);
        sendResponse();
        return;
    }

    var credentials = requestBody.credentials;
    if (checkTypes.not.object(credentials) || checkTypes.emptyObject(credentials) ||
        checkTypes.not.string(credentials.username) || checkTypes.not.string(credentials.password)) {
        response.setStatus(400);
        sendResponse();
        return;
    }

    if (checkTypes.emptyString(credentials.username) || checkTypes.emptyString(credentials.password)) {
        response.setStatus(401);
        sendResponse();
        return;
    }

    var userId = _checkCredentials(credentials.username, credentials.password, this.users);
    if (checkTypes.not.string(userId) || checkTypes.emptyString(userId)) {
        response.setStatus(401);
        sendResponse();
        return;
    }

    var responseBody = {
        userId: userId
    };

    response.setStatus(201).setBody(responseBody);
    sendResponse();
};

function _checkCredentials(username, password, users) {
    for (var user in users) {
        if (users[user].username === username && users[user].password === password) {
            return user;
        }
    }

    return null;
}
