'use strict';

/**
 * Test suite for Client module.
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

describe('Functionality: Client.addPlatformCredentials()', function addPlatformCredentialsTest() {
    var clientModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        clientModule = require(microrestModules.client);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Add platform credentials correctly', function case1() {
        var credentials = {
            key: '-- KEY --',
            certificate: '-- CERTIFICATE --'
        };

        clientModule.addPlatformCredentials(credentials);
    });

    it('Case 2: The credentials parameter is null', function case2() {
        (function () {
            clientModule.addPlatformCredentials(null);
        }).should.throw();
    });

    it('Case 3: The credentials parameter is undefined', function case3() {
        (function () {
            clientModule.addPlatformCredentials(undefined);
        }).should.throw();
    });

    it('Case 4: The credentials parameter is not an object', function case4() {
        (function () {
            clientModule.addPlatformCredentials(1);
        }).should.throw();
    });

    it('Case 5: The credentials parameter is a empty object', function case5() {
        (function () {
            clientModule.addPlatformCredentials({});
        }).should.throw();
    });

    it('Case 6: The key property is not present', function case6() {
        var credentials = {
            certificate: '-- CERTIFICATE --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 7: The certificate property is not present', function case7() {
        var credentials = {
            key: '-- KEY --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 8: The key property is null', function case8() {
        var credentials = {
            key: null,
            certificate: '-- CERTIFICATE --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 9: The key property is undefined', function case9() {
        var credentials = {
            key: undefined,
            certificate: '-- CERTIFICATE --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 10: The key property is not a string', function case10() {
        var credentials = {
            key: 1,
            certificate: '-- CERTIFICATE --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 11: The key property is an empty string', function case11() {
        var credentials = {
            key: '',
            certificate: '-- CERTIFICATE --'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 12: The certificate property is null', function case12() {
        var credentials = {
            key: '-- KEY --',
            certificate: null
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 13: The certificate property is undefined', function case13() {
        var credentials = {
            key: '-- KEY --',
            certificate: undefined
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 14: The certificate property is not a string', function case14() {
        var credentials = {
            key: '-- KEY --',
            certificate: 1
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 15: The certificate property is an empty string', function case15() {
        var credentials = {
            key: '-- KEY --',
            certificate: ''
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });
});

describe('Functionality: Client.cleanPlatformCredentials()', function cleanPlatformCredentialsTest() {
    var clientModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        clientModule = require(microrestModules.client);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Clean platform credentials correctly', function case1() {
        clientModule.cleanPlatformCredentials();

        clientModule.cleanPlatformCredentials();
    });
});

describe('Functionality: Client.send()', function sendTest() {
    it('NOT TESTED');
});
