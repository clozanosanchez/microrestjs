'use strict';

/**
 * Test suite for ConfigurationLoader module with the real configuration file.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @testsuite
 */

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../../env/MicrorestModules');

describe('Real: ConfigurationLoader.loadConfiguration()', function loadConfigurationTest() {
    let configurationLoaderModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        configurationLoaderModule = require(microrestModules.configurationLoader);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The real configuration file is loaded successfully without errors', function case1() {
        const configuration = configurationLoaderModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.Object();
    });
});
