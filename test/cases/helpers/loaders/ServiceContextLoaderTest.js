'use strict';

/**
 * Test suite for ServiceContextLoader module.
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

describe('Functionality: ServiceContextLoader.loadServiceContext()', function loadServiceContextTest() {
    let serviceContextLoaderModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        serviceContextLoaderModule = require(microrestModules.serviceContextLoader);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The serviceDescriptionPath parameter is null', function case1() {
        (function () {
            serviceContextLoaderModule.loadServiceContext(null);
        }).should.throw();
    });

    it('Case 2: The serviceDescriptionPath parameter is undefined', function case2() {
        (function () {
            serviceContextLoaderModule.loadServiceContext(undefined);
        }).should.throw();
    });

    it('Case 3: The serviceDescriptionPath parameter is not a string', function case3() {
        (function () {
            serviceContextLoaderModule.loadServiceContext(1);
        }).should.throw();

        (function () {
            serviceContextLoaderModule.loadServiceContext(true);
        }).should.throw();

        (function () {
            serviceContextLoaderModule.loadServiceContext({});
        }).should.throw();

        (function () {
            serviceContextLoaderModule.loadServiceContext([]);
        }).should.throw();
    });

    it('Case 4: The serviceDescriptionPath parameter is an empty string', function case4() {
        (function () {
            serviceContextLoaderModule.loadServiceContext('');
        }).should.throw();
    });

    it('Case 5: The serviceDescriptionPath parameter is a path that does not exist', function case5() {
        const serviceContextPath = `${process.cwd()}/test/env/serviceDescriptions/descriptionNotExist.json`;

        (function () {
            serviceContextLoaderModule.loadServiceContext(serviceContextPath);
        }).should.throw();
    });

    it('Case 6: The service description file is completely correct', function case6() {
        const serviceContextPath = `${process.cwd()}/test/env/serviceDescriptions/descriptionCase6.json`;
        const serviceContext = serviceContextLoaderModule.loadServiceContext(serviceContextPath);
        should.exist(serviceContext);
        serviceContext.should.be.instanceof(Object);
        serviceContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 7: The service description file is not valid: A LOT OF CASES');
});
