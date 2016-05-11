'use strict';

/**
 * Represents a file system error.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

/**
 * FileSystemError representes a file system error.
 *
 * @public
 * @class
 */
module.exports = class FileSystemError extends Error {
    /**
     * Constructor of FileSystemError.
     *
     * @public
     * @constructor
     * @param {String} message - Description of the error.
     */
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'FileSystemError';
        this.code = 'FILE_SYSTEM_ERROR';
    }
};
