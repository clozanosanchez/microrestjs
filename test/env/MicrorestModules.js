'use strict';

/**
 * Microrest Framework Modules for testing
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @module
 */

const CALLABLE_SERVICE_FACTORY_MODULE = `${process.cwd()}/lib/helpers/factories/CallableServiceFactory`;
const RUNNABLE_SERVICE_FACTORY_MODULE = `${process.cwd()}/lib/helpers/factories/RunnableServiceFactory`;
const CONFIGURATION_LOADER_MODULE = `${process.cwd()}/lib/helpers/loaders/ConfigurationLoader`;
const SERVICE_CONTEXT_LOADER_MODULE = `${process.cwd()}/lib/helpers/loaders/ServiceContextLoader`;
const SERVICE_FUNCTIONALITY_LOADER_MODULE = `${process.cwd()}/lib/helpers/loaders/ServiceFunctionalityLoader`;
const LOGGER_MANAGER_MODULE = `${process.cwd()}/lib/helpers/logging/LoggerManager`;
const CHECK_SCHEMA_MODULE = `${process.cwd()}/lib/helpers/schemas/CheckSchema`;
const CREDENTIALS_GENERATOR_MODULE = `${process.cwd()}/lib/helpers/security/CredentialsGenerator`;
const CLIENT_MODULE = `${process.cwd()}/lib/platform/Client`;
const MICROREST_MODULE = `${process.cwd()}/lib/platform/Microrest`;
const SERVER_MODULE = `${process.cwd()}/lib/platform/Server`;
const SERVICE_MANAGER_MODULE = `${process.cwd()}/lib/platform/ServiceManager`;
const CALLABLE_SERVICE_MODULE = `${process.cwd()}/lib/services/CallableService`;
const RUNNABLE_SERVICE_MODULE = `${process.cwd()}/lib/services/RunnableService`;
const SERVICE_MODULE = `${process.cwd()}/lib/services/Service`;
const SERVICE_CONTEXT_MODULE = `${process.cwd()}/lib/services/ServiceContext`;

const CONFIGURATION_REAL_FILE = `${process.cwd()}/configuration.json`;
const CONFIGURATION_TEST_FILE = `${process.cwd()}/test/env/configuration.json`;
const CONFIGURATION_LOGGER_TEST_FILE = `${process.cwd()}/test/env/configurationLogger.json`;

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
