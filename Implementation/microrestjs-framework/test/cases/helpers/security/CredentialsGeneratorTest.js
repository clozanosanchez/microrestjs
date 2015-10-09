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

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: CredentialsGenerator.generateCredentials()', function generateCredentialsFunctionalityTest() {
    it('Case 1: The credentials are generated correctly', function case1(done) {
        var credentialsGeneratorModule = require(microrestModules.credentialsGenerator);

        credentialsGeneratorModule.generateCredentials(function (error, credentials) {
            should.not.exist(error);
            should.exist(credentials);
            credentials.should.be.instanceof(Object);
            credentials.should.have.property('key');
            credentials.key.should.be.String();
            credentials.should.have.property('certificate');
            credentials.certificate.should.be.String();
            done();
        });
    });

    it('Case 2: The callback parameter is null', function case2() {
        var credentialsGeneratorModule = require(microrestModules.credentialsGenerator);

        (function () {
            credentialsGeneratorModule.generateCredentials(null);
        }).should.throw();
    });

    it('Case 3: The callback parameter is undefined', function case3() {
        var credentialsGeneratorModule = require(microrestModules.credentialsGenerator);

        (function () {
            credentialsGeneratorModule.generateCredentials();
        }).should.throw();
    });

    it('Case 4: The callback parameter is not a function', function case4() {
        var credentialsGeneratorModule = require(microrestModules.credentialsGenerator);

        (function () {
            credentialsGeneratorModule.generateCredentials(1);
        }).should.throw();
    });
});
