'use strict';

/**
 * Test suite for RunnableServiceFactory module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var fs = require('fs');
var should = require('should');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: RunnableServiceFactory.createService()', function createServiceFunctionalityTest() {
    it('Case 1: The factory returns the correct RunnableService', function case1() {
        var serviceName = 'test1';
        var path = fs.realpathSync('./test/env/servicesTest/good/one') + '/' + serviceName;

        var runnableService = require(microrestModules.runnableServiceFactory).createService(serviceName, path);

        //Check that the returned object is a RunnableService
        should.exist(runnableService);
        runnableService.should.be.instanceof(Object);
        runnableService.constructor.name.should.be.equal('RunnableService');

        //Check that it has a ServiceContext not empty
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');
        runnableService.context.should.not.be.empty();

        //Check that it has the corresponding functions.
        should.exist(runnableService.greet);
        runnableService.greet.should.be.Function();

        //Check that the lifecycle functions have been overridden.
        runnableService.should.have.ownProperty('onCreateService');
        runnableService.should.have.ownProperty('onStartOperation');
        runnableService.should.have.ownProperty('onFinishOperation');
        runnableService.should.have.ownProperty('onDestroyService');

        //Check that it has a CallableService registered
        runnableService.callableServices.should.have.property('callableServiceTest');
        runnableService.callableServices.callableServiceTest.should.be.instanceof(Object);
        runnableService.callableServices.callableServiceTest.constructor.name.should.be.equal('CallableService');
    });

    it('Case 2: The factory tries to return the most correct RunnableService', function case2() {
        var serviceName = 'test1';
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        var runnableService = require(microrestModules.runnableServiceFactory).createService(serviceName, path);

        //Check that the returned object is a RunnableService
        should.exist(runnableService);
        runnableService.should.be.instanceof(Object);
        runnableService.constructor.name.should.be.equal('RunnableService');

        //Check that it has a ServiceContext not empty
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');
        runnableService.context.should.not.be.empty();

        //Check that it does not have bad defined functions
        should.not.exist(runnableService.greetNull);
        should.not.exist(runnableService.greetUndefined);
        should.not.exist(runnableService.greetNotFunction);

        //Check that the lifecycle functions have not been overridden.
        runnableService.should.not.have.ownProperty('onCreateService');
        runnableService.should.not.have.ownProperty('onStartOperation');
        runnableService.should.not.have.ownProperty('onFinishOperation');
        runnableService.should.not.have.ownProperty('onDestroyService');
        runnableService.should.have.property('onCreateService');
        runnableService.should.have.property('onStartOperation');
        runnableService.should.have.property('onFinishOperation');
        runnableService.should.have.property('onDestroyService');

        //Check that it has a CallableService registered
        runnableService.callableServices.should.be.empty();
    });

    it('Case 3: The factory returns null if the service description is wrong', function case3() {
        var serviceName = 'test2';
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        var runnableService = require(microrestModules.runnableServiceFactory).createService(serviceName, path);

        should.not.exist(runnableService);
        should.equal(runnableService, null);
    });

    it('Case 4: The factory does not instantiate if the serviceName is null', function case4() {
        var serviceName = null;
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 5: The factory does not instantiate if the serviceName is undefined', function case5() {
        var serviceName = undefined;
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 6: The factory does not instantiate if the serviceName is not a string', function case6() {
        var serviceName = 1;
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 7: The factory does not instantiate if the serviceName is an empty string', function case7() {
        var serviceName = '';
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 8: The factory does not instantiate if the servicePath is null', function case8() {
        var serviceName = 'test1';
        var path = null;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 9: The factory does not instantiate if the servicePath is undefined', function case9() {
        var serviceName = 'test1';
        var path = undefined;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 10: The factory does not instantiate if the servicePath is not a string', function case10() {
        var serviceName = 'test1';
        var path = 1;

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 11: The factory does not instantiate if the servicePath is a empty string', function case11() {
        var serviceName = 'test1';
        var path = '';

        (function() {
            require(microrestModules.runnableServiceFactory).createService(serviceName, path);
        }).should.throw();
    });

    it('Case 12: The factory does not instantiate if the servicePath is not a directory', function case12() {
        var serviceName = 'test1';
        var path = fs.realpathSync('./test/env/servicesTest/bad/others') + '/' + serviceName + '/test1.js';

        var runnableService = require(microrestModules.runnableServiceFactory).createService(serviceName, path);

        should.not.exist(runnableService);
        should.equal(runnableService, null);
    });
});
