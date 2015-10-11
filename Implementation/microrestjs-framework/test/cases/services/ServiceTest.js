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
var mockery = require('mockery');

var microrestModules = require('../../env/MicrorestModules');

describe('Functionality: Service.getContext()', function getContextTest() {
    var Service;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Service = require(microrestModules.service);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The context is correct if an empty object is assigned', function case1() {
        var context = {};
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 2: The context is correct if a non-empty object is assigned', function case2() {
        var context = {
            info: {
                name: 'test'
            }
        };
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 3: The context is correct if an string (or a different object) is assigned', function case3() {
        var context = 'test';
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 4: The context is an empty object if null is assigned', function case4() {
        var context = null;
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 5: The context is an empty object if undefined is assigned', function case5() {
        var service = new Service(context);
        var returnContext = service.getContext();

        should.exist(returnContext);
        returnContext.should.be.instanceof(Object);
        returnContext.constructor.name.should.be.equal('ServiceContext');
    });
});

describe('Functionality: Service.getIdentificationName()', function getIdentificationNameTest() {
    var Service;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Service = require(microrestModules.service);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The identification name is correct if the context is defined properly', function case1() {
        var context = {
            info: {
                name: 'test',
                api: 1
            }
        };
        var service = new Service(context);
        var identificationName = service.getIdentificationName();

        should.exist(identificationName);
        identificationName.should.be.instanceof(String);
        identificationName.should.be.not.empty();
        identificationName.should.equal(context.info.name + '/v' + context.info.api);
    });

    it('Case 2: The identification name is empty if the context is not defined properly', function case2() {
        var context = {};
        var service = new Service(context);
        var identificationName = service.getIdentificationName();

        should.exist(identificationName);
        identificationName.should.be.instanceof(String);
        identificationName.should.be.empty();
    });
});
