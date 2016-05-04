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

var CALLABLE_SERVICE_FACTORY_MODULE = process.cwd() + '/lib/helpers/factories/CallableServiceFactory';
var RUNNABLE_SERVICE_FACTORY_MODULE = process.cwd() + '/lib/helpers/factories/RunnableServiceFactory';
var CHECK_DIRECTORY_MODULE = process.cwd() + '/lib/helpers/fs/CheckDirectory';
var CONFIGURATION_LOADER_MODULE = process.cwd() + '/lib/helpers/loaders/ConfigurationLoader';
var SERVICE_CONTEXT_LOADER_MODULE = process.cwd() + '/lib/helpers/loaders/ServiceContextLoader';
var SERVICE_FUNCTIONALITY_LOADER_MODULE = process.cwd() + '/lib/helpers/loaders/ServiceFunctionalityLoader';
var LOGGER_MANAGER_MODULE = process.cwd() + '/lib/helpers/logging/LoggerManager';
var CHECK_SCHEMA_MODULE = process.cwd() + '/lib/helpers/schemas/CheckSchema';
var CREDENTIALS_GENERATOR_MODULE = process.cwd() + '/lib/helpers/security/CredentialsGenerator'
var CLIENT_MODULE = process.cwd() + '/lib/platform/Client';
var MICROREST_MODULE = process.cwd() + '/lib/platform/Microrest';
var SERVER_MODULE = process.cwd() + '/lib/platform/Server';
var SERVICE_MANAGER_MODULE = process.cwd() + '/lib/platform/ServiceManager';
var CALLABLE_SERVICE_MODULE = process.cwd() + '/lib/services/CallableService';
var RUNNABLE_SERVICE_MODULE = process.cwd() + '/lib/services/RunnableService';
var SERVICE_MODULE = process.cwd() + '/lib/services/Service';
var SERVICE_CONTEXT_MODULE = process.cwd() + '/lib/services/ServiceContext';


var CONFIGURATION_REAL_FILE = process.cwd() + '/configuration.json';
var CONFIGURATION_TEST_FILE = process.cwd() + '/test/env/configuration.json';
var CONFIGURATION_LOGGER_TEST_FILE = process.cwd() + '/test/env/configurationLogger.json';

/**
 * Microrest Framework Modules for testing
 *
 * @public
 * @static
 * @readonly
 * @constant {Object}
 */
module.exports = {
    callableServiceFactory: CALLABLE_SERVICE_FACTORY_MODULE,
    runnableServiceFactory: RUNNABLE_SERVICE_FACTORY_MODULE,
    checkDirectory: CHECK_DIRECTORY_MODULE,
    configurationLoader: CONFIGURATION_LOADER_MODULE,
    serviceContextLoader: SERVICE_CONTEXT_LOADER_MODULE,
    serviceFunctionalityLoader: SERVICE_FUNCTIONALITY_LOADER_MODULE,
    loggerManager: LOGGER_MANAGER_MODULE,
    checkSchema: CHECK_SCHEMA_MODULE,
    credentialsGenerator: CREDENTIALS_GENERATOR_MODULE,
    client: CLIENT_MODULE,
    microrest: MICROREST_MODULE,
    server: SERVER_MODULE,
    serviceManager: SERVICE_MANAGER_MODULE,
    callableService: CALLABLE_SERVICE_MODULE,
    runnableService: RUNNABLE_SERVICE_MODULE,
    service: SERVICE_MODULE,
    serviceContext: SERVICE_CONTEXT_MODULE,


    configurationRealFile: CONFIGURATION_REAL_FILE,
    configurationTestFile: CONFIGURATION_TEST_FILE,
    configurationLoggerTestFile: CONFIGURATION_LOGGER_TEST_FILE
};