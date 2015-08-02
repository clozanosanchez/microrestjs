'use strict';

/**
 * Checks whether a path is a directory
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var fs = require('fs');
var checkTypes = require('check-types');

/**
 * Checks synchronously whether a path is a directory.
 *
 * @public
 * @static
 * @function
 * @param {String} path - Path to be checked.
 * @returns {Boolean} - true, if the path is a directory; false, otherwise.
 * @throws an Error if the path parameter is not valid.
 */
module.exports.isDirectorySync = function isDirectorySync(path) {
    if (checkTypes.not.assigned(path) || checkTypes.not.string(path) || checkTypes.not.unemptyString(path)) {
        throw new Error('The parameter path must be a non-empty string.');
    }

    var stats = fs.statSync(path);
    return stats.isDirectory();
};

/**
 * Checks asynchronously whether a path is a directory.
 *
 * @public
 * @static
 * @function
 * @param {String} path - Path to be checked.
 * @param {isDirectoryCallback} callback - Callback to receive the error or the result of the operation.
 */
module.exports.isDirectory = function isDirectory(path, callback) {
    if (checkTypes.not.assigned(path) || checkTypes.not.string(path) || checkTypes.not.unemptyString(path)) {
        callback(new Error('The parameter path must be a non-empty string.'));
        return;
    }

    fs.stat(path, function _statCallback(err, stats) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, stats.isDirectory);
    });
};

/**
 * Callback declaration for asynchronous isDirectory method.
 *
 * @callback isDirectoryCallback
 * @param {Error} err - Specifies the error that occurred if it is defined.
 * @param {Boolean} isDirectory - true, if the path is a directory; false, otherwise.
 */
