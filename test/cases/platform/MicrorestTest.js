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

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../env/MicrorestModules');

describe('Functionality: Microrest.getInstance() with logger enabled', function getInstanceTest() {
    let microrestModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        microrestModule = require(microrestModules.microrest);

        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationLoggerTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned object is instance of Microrest and has the appropriate properties', function case1() {
        const microrest = microrestModule.getInstance();

        should.exist(microrest);
        microrest.should.be.instanceof(Object);
        microrest.constructor.name.should.be.equal('Microrest');

        microrest.should.have.ownProperty('configuration');
        microrest.configuration.should.be.Object();
        microrest.configuration.should.not.be.empty();

        microrest.should.have.ownProperty('platformCredentials');

        microrest.should.have.ownProperty('server');
        microrest.server.should.be.instanceof(Object);
        microrest.server.constructor.name.should.be.equal('Server');

        microrest.should.have.ownProperty('serviceManager');
        microrest.serviceManager.should.be.instanceof(Object);
        microrest.serviceManager.constructor.name.should.be.equal('ServiceManager');
    });
});

describe('Functionality: Microrest.getInstance() with logger disabled', function getInstanceTest(){
    let microrestModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        microrestModule = require(microrestModules.microrest);

        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of Microrest', function case1() {
        const microrest = microrestModule.getInstance();

        should.exist(microrest);
        microrest.should.be.instanceof(Object);
        microrest.constructor.name.should.be.equal('Microrest');

        microrest.should.have.ownProperty('configuration');
        microrest.configuration.should.be.Object();
        microrest.configuration.should.not.be.empty();

        microrest.should.have.ownProperty('platformCredentials');

        microrest.should.have.ownProperty('server');
        microrest.server.should.be.instanceof(Object);
        microrest.server.constructor.name.should.be.equal('Server');

        microrest.should.have.ownProperty('serviceManager');
        microrest.serviceManager.should.be.instanceof(Object);
        microrest.serviceManager.constructor.name.should.be.equal('ServiceManager');
    });
});

describe('Functionality: Microrest.run() ', function runTest() {
    let microrestModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        microrestModule = require(microrestModules.microrest);

        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The platform runs correctly', function case1(done) {
        const microrest = microrestModule.getInstance();

        microrest.run();

        setTimeout(function () {
            done();
        }, 5000);
    });
});

describe('Functionality: Microrest.shutdown()', function shutdownTest() {
    let microrestModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        microrestModule = require(microrestModules.microrest);

        mockery.registerSubstitute(microrestModules.configurationRealFile, microrestModules.configurationTestFile);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The platform shutdowns correctly before running', function case1() {
        const microrest = microrestModule.getInstance();

        microrest.shutdown();

        microrest.should.have.ownProperty('configuration');
        should.not.exist(microrest.configuration);

        microrest.should.have.ownProperty('platformCredentials');
        should.not.exist(microrest.platformCredentials);

        microrest.should.have.ownProperty('server');
        should.not.exist(microrest.server);

        microrest.should.have.ownProperty('serviceManager');
        should.not.exist(microrest.serviceManager);
    });

    it('Case 2: The platform shutdowns correctly when running', function case2(done) {
        const microrest = microrestModule.getInstance();

        setTimeout(function () {
            microrest.run();

            microrest.shutdown();

            microrest.should.have.ownProperty('configuration');
            should.not.exist(microrest.configuration);

            microrest.should.have.ownProperty('platformCredentials');
            should.not.exist(microrest.platformCredentials);

            microrest.should.have.ownProperty('server');
            should.not.exist(microrest.server);

            microrest.should.have.ownProperty('serviceManager');
            should.not.exist(microrest.serviceManager);

            done();
        }, 5000);
    });

    it('Case 3: Several shutdowns does not cause problems', function case3(done) {
        const microrest = microrestModule.getInstance();

        setTimeout(function () {
            microrest.run();

            microrest.shutdown();

            microrest.should.have.ownProperty('configuration');
            should.not.exist(microrest.configuration);

            microrest.should.have.ownProperty('platformCredentials');
            should.not.exist(microrest.platformCredentials);

            microrest.should.have.ownProperty('server');
            should.not.exist(microrest.server);

            microrest.should.have.ownProperty('serviceManager');
            should.not.exist(microrest.serviceManager);

            microrest.shutdown();

            microrest.should.have.ownProperty('configuration');
            should.not.exist(microrest.configuration);

            microrest.should.have.ownProperty('platformCredentials');
            should.not.exist(microrest.platformCredentials);

            microrest.should.have.ownProperty('server');
            should.not.exist(microrest.server);

            microrest.should.have.ownProperty('serviceManager');
            should.not.exist(microrest.serviceManager);

            done();
        }, 5000);
    });
});
