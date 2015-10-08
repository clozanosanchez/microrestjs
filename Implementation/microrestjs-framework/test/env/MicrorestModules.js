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

var CALLABLE_SERVICE_MODULE = process.cwd() + '/lib/services/CallableService';
var CALLABLE_SERVICE_FACTORY_MODULE = process.cwd() + '/lib/helpers/factories/CallableServiceFactory';
var CONFIGURATION_LOADER_MODULE = process.cwd() + '/lib/helpers/loaders/ConfigurationLoader';
var CONFIGURATION_REAL_FILE = process.cwd() + '/configuration.json';
var CONFIGURATION_TEST_FILE = process.cwd() + '/test/env/configuration.json';
var CONFIGURATION_LOGGER_TEST_FILE = process.cwd() + '/test/env/configurationLogger.json';
var MICROREST_MODULE = process.cwd() + '/lib/platform/Microrest';
var RUNNABLE_SERVICE_MODULE = process.cwd() + '/lib/services/RunnableService';
var RUNNABLE_SERVICE_FACTORY_MODULE = process.cwd() + '/lib/helpers/factories/RunnableServiceFactory';
var SERVER_MODULE = process.cwd() + '/lib/platform/Server';
var SERVICE_MODULE = process.cwd() + '/lib/services/Service';
var SERVICE_CONTEXT = process.cwd() + '/lib/services/ServiceContext';
var SERVICE_CONTEXT_LOADER_MODULE = process.cwd() + '/lib/helpers/loaders/ServiceContextLoader';
var SERVICE_MANAGER_MODULE = process.cwd() + '/lib/platform/ServiceManager';



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
    serviceContext: SERVICE_CONTEXT,
    serviceContextLoader: SERVICE_CONTEXT_LOADER_MODULE,
    serviceManager: SERVICE_MANAGER_MODULE
};
