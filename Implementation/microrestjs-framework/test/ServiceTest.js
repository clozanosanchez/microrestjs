'use strict';

/**
 * Test suite for Service module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var microrestModules = require('./env/MicrorestModules');

describe('Functionality: Service.getContext()', function getContextFunctionalityTest() {
    it('Case 1: The context is correct if an empty object is assigned', function case1() {
        var Service = require(microrestModules.service);

        var context = {};
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.should.be.empty();
        returnContext.should.equal(context);
    });

    it('Case 2: The context is correct if a non-empty object is assigned', function case2() {
        var Service = require(microrestModules.service);

        var context = {
            info: {
                name: 'test'
            }
        };
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.should.be.not.empty();
        returnContext.should.equal(context);
    });

    it('Case 3: The context is correct if an string (or a different object) is assigned', function case3() {
        var Service = require(microrestModules.service);

        var context = 'test';
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(String);
        returnContext.should.be.not.empty();
        returnContext.should.equal(context);
    });

    it('Case 4: The context is an empty object if null is assigned', function case4() {
        var Service = require(microrestModules.service);

        var context = null;
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.should.be.empty();
    });

    it('Case 5: The context is an empty object if undefined is assigned', function case5() {
        var Service = require(microrestModules.service);

        var context = undefined;
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.should.be.empty();
    });
});

describe('Functionality: Service.getServiceName()', function getServiceNameFunctionalityTest() {
    it('Case 1: The service name is correct if the context is defined properly', function case1() {
        var Service = require(microrestModules.service);

        var context = {
            info: {
                name: 'test'
            }
        };
        var service = new Service(context);
        var serviceName = service.getServiceName();

        should.exist(serviceName);
        serviceName.should.be.instanceof(String);
        serviceName.should.be.not.empty();
        serviceName.should.equal(context.info.name);
    });

    it('Case 2: The service name is empty if the context is not defined properly', function case2() {
        var Service = require(microrestModules.service);

        var context = {};
        var service = new Service(context);
        var serviceName = service.getServiceName();

        should.exist(serviceName);
        serviceName.should.be.instanceof(String);
        serviceName.should.be.empty();
    });
});
