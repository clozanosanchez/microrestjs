'use strict';

/**
 * Manages the platform loggers based on Winston.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var checkTypes = require('check-types');
var winston = require('winston');

var defaultLoggerConfiguration = {
    transports: [],
    level: 'none'
};

var loggers = {};

/**
 * Configures the default options of the LoggerManager.
 *
 * @public
 * @static
 * @function
 * @param {Object} loggerConfiguration - Configuration to be set as default.
 * @throws an Error if the loggerConfiguration parameter is not a valid object.
 */
module.exports.configure = function configure(loggerConfiguration) {
    if (checkTypes.not.object(loggerConfiguration) || checkTypes.emptyObject(loggerConfiguration) ||
        checkTypes.not.boolean(loggerConfiguration.enable) || checkTypes.not.string(loggerConfiguration.level)) {
        throw new Error('The parameter loggerConfiguration must be a valid logger configuration object.');
    }

    if (loggerConfiguration.enable === false) {
        defaultLoggerConfiguration.level = 'none';
    } else {
        defaultLoggerConfiguration.level = loggerConfiguration.level;
    }

    defaultLoggerConfiguration.transports = ['console'];
};

/**
 * Gets a specific logger by name.
 *
 * NOTE: If the logger has not been created previously, a new logger is created.
 *
 * @public
 * @static
 * @function
 * @param {String} loggerName - Name of the logger to be retrieved.
 * @param {Object} [loggerOptions] - Options of the logger to be created.
 * @returns {Object} - The specific logger.
 * @throws an Error if loggerName parameter is not a non-empty string.
 */
module.exports.getLogger = function getLogger(loggerName, loggerOptions) {
    if (checkTypes.not.string(loggerName) || checkTypes.not.unemptyString(loggerName)) {
        throw new Error('The parameter loggerName must be a non-empty string.');
    }

    if (checkTypes.not.object(loggers[loggerName]) || checkTypes.emptyObject(loggers[loggerName])) {
        return module.exports.createLogger(loggerName, loggerOptions);
    }

    return loggers[loggerName];
};

/**
 * Creates a specific logger by name.
 *
 * NOTE: If the logger has been already created, it will be overwritten.
 *
 * @public
 * @static
 * @function
 * @param {String} loggerName - Name of the logger to be created.
 * @param {Object} [loggerOptions] - Options of the logger to be created.
 * @returns {Object} - The created logger.
 * @throws an Error if the parameter loggerName is not a non-empty string.
 */
module.exports.createLogger = function createLogger(loggerName, loggerOptions) {
    if (checkTypes.not.string(loggerName) || checkTypes.not.unemptyString(loggerName)) {
        throw new Error('The parameter loggerName must be a non-empty string.');
    }

    var level;
    if (checkTypes.assigned(loggerOptions) && checkTypes.string(loggerOptions.level)) {
        level = loggerOptions.level;
    } else {
        level = defaultLoggerConfiguration.level;
    }

    var transports = [];
    if (checkTypes.assigned(loggerOptions) && checkTypes.array.of.string(loggerOptions.transports)) {
        transports = loggerOptions.transports;
    } else {
        transports = defaultLoggerConfiguration.transports;
    }

    var winstonOptions = {
        level: level,
        transports: []
    };

    for (var i = 0; i < transports.length; i++) {
        if (transports[i] === 'console') {
            winstonOptions.transports.push(new (winston.transports.Console)({level: level}));
        }
    }

    var logger = new winston.Logger(winstonOptions);
    loggers[loggerName] = logger;

    return logger;
};
