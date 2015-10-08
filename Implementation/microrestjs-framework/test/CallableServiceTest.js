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

var microrestModules = require('./env/MicrorestModules');

describe('Functionality: CallableService.getInstance()', function getInstanceFunctionalityTest() {
    it('Case 1: The returned instance is instance of CallableService', function case1() {
        var callableService = require(microrestModules.callableService).getInstance({});

        should.exist(callableService);
        callableService.should.be.instanceof(Object);
        callableService.constructor.name.should.be.equal('CallableService');
    });

    it('Case 2: The returned instance has the appropriate properties', function case2() {
        var callableService = require(microrestModules.callableService).getInstance({});

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 3: The returned instance has the appropriate properties if context is null', function case3() {
        var callableService = require(microrestModules.callableService).getInstance(null);

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 4: The returned instance has the appropriate properties if context is undefined', function case4() {
        var callableService = require(microrestModules.callableService).getInstance();

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 5: The returned instance has the appropriate properties if context is a ServiceContext object', function case5() {
        var serviceContext = new (require(microrestModules.serviceContext))({});
        var callableService = require(microrestModules.callableService).getInstance(serviceContext);

        callableService.should.have.property('context');
        callableService.context.should.be.instanceof(Object);
        callableService.context.constructor.name.should.be.equal('ServiceContext');
    });
});

describe('Functionality: CallableService.getContext()', function getContextFunctionalityTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: CallableService.getServiceName()', function getServiceNameFunctionalityTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: CallableService.execute()', function executeFunctionalityTest() {
    it('NOT IMPLEMENTED');
});
