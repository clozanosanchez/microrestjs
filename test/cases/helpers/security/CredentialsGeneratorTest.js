'use strict';

/**
 * Test suite for CredentialsGenerator module.
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

describe('Functionality: CredentialsGenerator.generateCredentials()', function generateCredentialsTest() {
    var credentialsGeneratorModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        credentialsGeneratorModule = require(microrestModules.credentialsGenerator);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The credentials are generated correctly', function case1(done) {
        credentialsGeneratorModule.generateCredentials(function (error, credentials) {
            should.not.exist(error);
            should.exist(credentials);
            credentials.should.be.Object();
            credentials.should.have.property('key');
            credentials.key.should.be.String();
            credentials.should.have.property('certificate');
            credentials.certificate.should.be.String();
            done();
        });
    });

    it('Case 2: The callback parameter is null', function case2() {
        (function () {
            credentialsGeneratorModule.generateCredentials(null);
        }).should.throw();
    });

    it('Case 3: The callback parameter is undefined', function case3() {
        (function () {
            credentialsGeneratorModule.generateCredentials();
        }).should.throw();
    });

    it('Case 4: The callback parameter is not a function', function case4() {
        (function () {
            credentialsGeneratorModule.generateCredentials(1);
        }).should.throw();
    });
});
