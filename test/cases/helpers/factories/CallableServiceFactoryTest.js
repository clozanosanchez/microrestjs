'use strict';

/**
 * Test suite for CallableServiceFactory module.
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

describe('Functionality: CallableServiceFactory.getService()', function getServiceTest() {
    var callableServiceFactoryModule;
    var ServiceContext;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        callableServiceFactoryModule = require(microrestModules.callableServiceFactory);
        ServiceContext = require(microrestModules.serviceContext);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The factory returns the correct CallableService', function case1() {
        var callableService = callableServiceFactoryModule.getService('serviceTest', 1, 'directory');

        var expectedContext = new ServiceContext({
            info: {
                name: 'serviceTest',
                api: 1
            },
            config: {
                location: 'directory'
            }
        });

        should.exist(callableService);
        callableService.should.be.instanceof(Object);
        callableService.constructor.name.should.be.equal('CallableService');
        should.deepEqual(callableService.getContext(), expectedContext);
    });

    it('Case 2: The factory does not instantiate when the name is null', function case2() {
        (function () {
            callableServiceFactoryModule.getService(null, 1, 'directory');
        }).should.throw();
    });

    it('Case 3: The factory does not instantiate when the name is undefined', function case3() {
        (function () {
            callableServiceFactoryModule.getService(undefined, 1, 'directory');
        }).should.throw();
    });

    it('Case 4: The factory does not instantiate when the name is not a string', function case4() {
        (function () {
            callableServiceFactoryModule.getService(1, 1, 'directory');
        }).should.throw();
    });

    it('Case 5: The factory does not instantiate when the name is an empty string', function case5() {
        (function () {
            callableServiceFactoryModule.getService('', 1, 'directory');
        }).should.throw();
    });

    it('Case 6: The factory does not instantiate when the api is null', function case6() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', null, 'directory');
        }).should.throw();
    });

    it('Case 7: The factory does not instantiate when the api is undefined', function case7() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', undefined, 'directory');
        }).should.throw();
    });

    it('Case 8: The factory does not instantiate when the api is not an integer', function case8() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 'api', 'directory');
        }).should.throw();
    });

    it('Case 9: The factory does not instantiate when the api is not a positive integer', function case9() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 0, 'directory');
        }).should.throw();
    });

    it('Case 10: The factory does not instantiate when the location is null', function case10() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 1, null);
        }).should.throw();
    });

    it('Case 11: The factory does not instantiate when the location is undefined', function case11() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 1, undefined);
        }).should.throw();

        (function () {
            callableServiceFactoryModule.getService('serviceName', 1);
        }).should.throw();
    });

    it('Case 12: The factory does not instantiate when the location is not a string', function case12() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 1, 1);
        }).should.throw();
    });

    it('Case 13: The factory does not instantiate when the location is an empty string', function case13() {
        (function () {
            callableServiceFactoryModule.getService('serviceName', 1, '');
        }).should.throw();
    });
});
