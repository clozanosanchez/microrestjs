'use strict';

/**
 * Manages the platform loggers based on Winston.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const checkTypes = require('check-types');
const winston = require('winston');

/**
 * LoggerManager allows managing the platform loggers.
 *
 * @public
 * @class
 */
class LoggerManager {
    /**
     * Constructor of LoggerManager.
     *
     * @public
     * @constructor
     */
    constructor() {
        this.defaultLoggerConfiguration = {
            transports: [],
            level: 'none'
        };

        this.loggers = {};
    }

    /**
     * Configures the default options of the LoggerManager.
     *
     * @public
     * @function
     * @param {Object} loggerConfiguration - Configuration to be set as default.
     * @throws an TypeError if the loggerConfiguration parameter is not a valid object.
     */
    configure(loggerConfiguration) {
        if (checkTypes.not.object(loggerConfiguration) || checkTypes.emptyObject(loggerConfiguration) ||
            checkTypes.not.boolean(loggerConfiguration.enable) || checkTypes.not.string(loggerConfiguration.level)) {
            throw new TypeError('The parameter loggerConfiguration must be a valid logger configuration object.');
        }

        if (loggerConfiguration.enable === false) {
            this.defaultLoggerConfiguration.level = 'none';
        } else {
            this.defaultLoggerConfiguration.level = loggerConfiguration.level;
        }

        this.defaultLoggerConfiguration.transports = ['console'];
    }

    /**
     * Gets a specific logger by name.
     *
     * NOTE: If the logger has not been created previously, a new logger is created.
     *
     * @public
     * @function
     * @param {String} loggerName - Name of the logger to be retrieved.
     * @param {Object} [loggerOptions] - Options of the logger to be created.
     * @returns {Object} - The specific logger.
     * @throws a TypeError if loggerName parameter is not a non-empty string.
     */
    getLogger(loggerName, loggerOptions) {
        if (checkTypes.not.string(loggerName) || checkTypes.emptyString(loggerName)) {
            throw new TypeError('The parameter loggerName must be a non-empty string.');
        }

        if (checkTypes.not.object(this.loggers[loggerName]) || checkTypes.emptyObject(this.loggers[loggerName])) {
            return module.exports.createLogger(loggerName, loggerOptions);
        }

        return this.loggers[loggerName];
    }

    /**
     * Creates a specific logger by name.
     *
     * NOTE: If the logger has been already created, it will be overwritten.
     *
     * @public
     * @function
     * @param {String} loggerName - Name of the logger to be created.
     * @param {Object} [loggerOptions] - Options of the logger to be created.
     * @returns {Object} - The created logger.
     * @throws a TypeError if the parameter loggerName is not a non-empty string.
     */
    createLogger(loggerName, loggerOptions) {
        if (checkTypes.not.string(loggerName) || checkTypes.emptyString(loggerName)) {
            throw new TypeError('The parameter loggerName must be a non-empty string.');
        }

        let level;
        if (checkTypes.assigned(loggerOptions) && checkTypes.string(loggerOptions.level)) {
            level = loggerOptions.level;
        } else {
            level = this.defaultLoggerConfiguration.level;
        }

        let transports = [];
        if (checkTypes.assigned(loggerOptions) && checkTypes.array.of.string(loggerOptions.transports)) {
            transports = loggerOptions.transports;
        } else {
            transports = this.defaultLoggerConfiguration.transports;
        }

        const winstonOptions = {
            level: level,
            transports: []
        };

        for (const transport of transports) {
            if (transport === 'console') {
                winstonOptions.transports.push(new winston.transports.Console({level: level}));
            }
        }

        const logger = new winston.Logger(winstonOptions);
        this.loggers[loggerName] = logger;

        return logger;
    }
}

module.exports = new LoggerManager();
