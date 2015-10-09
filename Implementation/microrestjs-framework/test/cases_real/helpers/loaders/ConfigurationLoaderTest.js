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

var microrestModules = require('../../../env/MicrorestModules');

describe('Real: ConfigurationLoader.loadConfiguration()', function loadConfigurationRealTest() {
    it('Case 1: The real configuration file is loaded successfully without errors', function case1() {
        var configurationModule = require(microrestModules.configurationLoader);

        var configuration = configurationModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.instanceof(Object);
    });
});
