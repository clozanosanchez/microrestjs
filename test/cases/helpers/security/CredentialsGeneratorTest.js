'use strict';

/**
 * Test suite for CredentialsGenerator module.
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

describe('Functionality: CredentialsGenerator.generateCredentials()', function generateCredentialsTest() {
    let credentialsGeneratorModule;

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
        credentialsGeneratorModule.generateCredentials().then((credentials) => {
            should.exist(credentials);
            credentials.should.be.Object();
            credentials.should.have.property('key');
            credentials.key.should.be.String();
            credentials.should.have.property('certificate');
            credentials.certificate.should.be.String();
            done();
        }).catch((error) => {
            should.not.exist(error);
        });
    });
});
