'use strict';

module.exports.FileSystemError = class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'FileSystemError';
        this.code = 'FILE_SYSTEM_ERROR';
    }
};
