'use strict';

/**
 * Test suite for Microrest module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');
var mockery = require('mockery');

var microrestModules = require('../../env/MicrorestModules');

describe('Functionality: Microrest.getInstance() with logger enabled', function getInstanceFunctionalityTest(){
    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationLoggerTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of Microrest', function case1() {
        var microrest = require(microrestModules.microrest).getInstance();

        should.exist(microrest);
        microrest.should.be.instanceof(Object);
        microrest.constructor.name.should.be.equal('Microrest');
    });

    it('Case 2: The returned instance has the appropiate properties', function case2() {
        var microrest = require(microrestModules.microrest).getInstance();

        microrest.should.have.property('configuration');
        microrest.configuration.should.be.instanceof(Object);

        microrest.should.have.property('server');
        microrest.server.should.be.instanceof(Object);
        microrest.server.constructor.name.should.be.equal('Server');

        microrest.should.have.property('serviceManager');
        microrest.serviceManager.should.be.instanceof(Object);
        microrest.serviceManager.constructor.name.should.be.equal('ServiceManager');
    });
});

describe('Functionality: Microrest.getInstance() with logger disabled', function getInstanceFunctionalityTest(){
    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of Microrest', function case1() {
        var microrest = require(microrestModules.microrest).getInstance();

        should.exist(microrest);
        microrest.should.be.instanceof(Object);
        microrest.constructor.name.should.be.equal('Microrest');
    });

    it('Case 2: The returned instance has the appropiate properties', function case2() {
        var microrest = require(microrestModules.microrest).getInstance();

        microrest.should.have.property('configuration');
        microrest.configuration.should.be.instanceof(Object);

        microrest.should.have.property('server');
        microrest.server.should.be.instanceof(Object);
        microrest.server.constructor.name.should.be.equal('Server');

        microrest.should.have.property('serviceManager');
        microrest.serviceManager.should.be.instanceof(Object);
        microrest.serviceManager.constructor.name.should.be.equal('ServiceManager');
    });
});
