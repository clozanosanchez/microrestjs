'use strict';

/**
 * Test suite for CallableService module.
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

describe('Functionality: CallableService.getInstance()', function getInstanceTest() {
    var callableServiceModule;
    var ServiceContext;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        callableServiceModule = require(microrestModules.callableService);
        ServiceContext = require(microrestModules.serviceContext);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of CallableService', function case1() {
        var callableService = callableServiceModule.getInstance({});

        should.exist(callableService);
        callableService.should.be.instanceof(Object);
        callableService.constructor.name.should.be.equal('CallableService');
    });

    it('Case 2: The returned instance has the appropriate properties', function case2() {
        var callableService = callableServiceModule.getInstance({});

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 3: The returned instance has the appropriate properties if context is null', function case3() {
        var callableService = callableServiceModule.getInstance(null);

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 4: The returned instance has the appropriate properties if context is undefined', function case4() {
        var callableService = callableServiceModule.getInstance();

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 5: The returned instance has the appropriate properties if context is a ServiceContext object', function case5() {
        var serviceContext = new ServiceContext({});
        var callableService = callableServiceModule.getInstance(serviceContext);

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });
});

describe('Functionality: CallableService.getContext()', function getContextTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: CallableService.getIdentificationName()', function getIdentificationNameTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: CallableService.execute()', function executeTest() {
    it('NOT TESTED');
});
