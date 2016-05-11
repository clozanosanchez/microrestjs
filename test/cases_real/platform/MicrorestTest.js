'use strict';

/**
 * Test suite for Microrest module with the real configuration file and real services.
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

describe('Real: Microrest.getInstance()', function getInstanceTest() {
    let Microrest;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Microrest = require(microrestModules.microrest);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned object is instance of Microrest and has the appropriate properties', function case1() {
        const microrest = new Microrest();

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

describe('Real: Microrest.run()', function runTest() {
    let Microrest;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Microrest = require(microrestModules.microrest);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Microrest listens connections successfully', function case1(done) {
        const microrest = new Microrest();

        microrest.run();

        setTimeout(function () {
            done();
        }, 5000);
    });
});
