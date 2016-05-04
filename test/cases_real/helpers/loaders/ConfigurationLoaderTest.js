'use strict';

/**
 * Test suite for ConfigurationLoader module with the real configuration file.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');
var mockery = require('mockery');

var microrestModules = require('../../../env/MicrorestModules');

describe('Real: ConfigurationLoader.loadConfiguration()', function loadConfigurationTest() {
    var configurationLoaderModule;

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
        var configuration = configurationLoaderModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.Object();
    });
});