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

var CONFIGURATION_LOADER_MODULE = '../lib/ConfigurationLoader';
var CONFIGURATION_REAL_FILE = '../configuration.json';
var CONFIGURATION_TEST_FILE = '../test/env/configuration.json';
var MICROREST_MODULE = '../lib/Microrest';
var RUNNABLE_SERVICE_FACTORY = '../lib/RunnableServiceFactory';
var SERVER_MODULE = '../lib/Server';
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
    configurationLoader: CONFIGURATION_LOADER_MODULE,
    configurationRealFile: CONFIGURATION_REAL_FILE,
    configurationTestFile: CONFIGURATION_TEST_FILE,
    microrest: MICROREST_MODULE,
    runnableServiceFactory: RUNNABLE_SERVICE_FACTORY,
    server: SERVER_MODULE,
    serviceContextLoader: SERVICE_CONTEXT_LOADER_MODULE,
    serviceManager: SERVICE_MANAGER_MODULE
};
