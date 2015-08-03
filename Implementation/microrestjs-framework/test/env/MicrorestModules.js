'use strict';

/**
 * Microrest Framework Modules for testing
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var CALLABLE_SERVICE_MODULE = '../lib/CallableService';
var CALLABLE_SERVICE_FACTORY_MODULE = '../lib/CallableServiceFactory';
var CONFIGURATION_LOADER_MODULE = '../lib/ConfigurationLoader';
var CONFIGURATION_REAL_FILE = '../configuration.json';
var CONFIGURATION_TEST_FILE = '../test/env/configuration.json';
var CONFIGURATION_LOGGER_TEST_FILE = '../test/env/configurationLogger.json';
var MICROREST_MODULE = '../lib/Microrest';
var RUNNABLE_SERVICE_MODULE = '../lib/RunnableService';
var RUNNABLE_SERVICE_FACTORY_MODULE = '../lib/RunnableServiceFactory';
var SERVER_MODULE = '../lib/Server';
var SERVICE_MODULE = '../lib/Service';
var SERVICE_CONTEXT_LOADER_MODULE = '../lib/ServiceContextLoader';
var SERVICE_MANAGER_MODULE = '../lib/ServiceManager';



/**
 * Microrest Framework Modules for testing
 *
 * @public
 * @static
 * @readonly
 * @constant {Object}
 */
module.exports = {
    callableService: CALLABLE_SERVICE_MODULE,
    callableServiceFactory: CALLABLE_SERVICE_FACTORY_MODULE,
    configurationLoader: CONFIGURATION_LOADER_MODULE,
    configurationRealFile: CONFIGURATION_REAL_FILE,
    configurationTestFile: CONFIGURATION_TEST_FILE,
    configurationLoggerTestFile: CONFIGURATION_LOGGER_TEST_FILE,
    microrest: MICROREST_MODULE,
    runnableService: RUNNABLE_SERVICE_MODULE,
    runnableServiceFactory: RUNNABLE_SERVICE_FACTORY_MODULE,
    server: SERVER_MODULE,
    service: SERVICE_MODULE,
    serviceContextLoader: SERVICE_CONTEXT_LOADER_MODULE,
    serviceManager: SERVICE_MANAGER_MODULE
};
