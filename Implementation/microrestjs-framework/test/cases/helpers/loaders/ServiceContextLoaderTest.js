'use strict';

/**
 * Test suite for ServiceContextLoader module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: ServiceContextLoader.loadServiceContext()', function loadServiceContextFunctionalityTest() {
    it('Case 1: The serviceDescriptionPath parameter is null', function case1() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);

        (function() {
            serviceContextLoader.loadServiceContext(null);
        }).should.throw();
    });

    it('Case 2: The serviceDescriptionPath parameter is undefined', function case2() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);

        (function() {
            serviceContextLoader.loadServiceContext(undefined);
        }).should.throw();
    });

    it('Case 3: The serviceDescriptionPath parameter is not a string', function case3() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);

        (function() {
            serviceContextLoader.loadServiceContext(1);
        }).should.throw();

        (function() {
            serviceContextLoader.loadServiceContext(true);
        }).should.throw();

        (function() {
            serviceContextLoader.loadServiceContext({});
        }).should.throw();

        (function() {
            serviceContextLoader.loadServiceContext([]);
        }).should.throw();
    });

    it('Case 4: The serviceDescriptionPath parameter is an empty string', function case4() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);

        (function() {
            serviceContextLoader.loadServiceContext('');
        }).should.throw();
    });

    it('Case 5: The serviceDescriptionPath parameter is a path that does not exist', function case5() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);
        var serviceContextPath = process.cwd() + '/test/env/serviceDescriptions/descriptionNotExist.json';

        (function() {
            serviceContextLoader.loadServiceContext(serviceContextPath);
        }).should.throw();
    });

    it('Case 6: The service description file is completely correct', function case6() {
        var serviceContextLoader = require(microrestModules.serviceContextLoader);
        var serviceContextPath = process.cwd() + '/test/env/serviceDescriptions/descriptionCase6.json';
        var serviceContext = serviceContextLoader.loadServiceContext(serviceContextPath);
        should.exist(serviceContext);
        serviceContext.should.be.instanceof(Object);
        serviceContext.constructor.name.should.be.equal('ServiceContext');
    });

    it('Case 7: The service description file is not valid: A LOT OF CASES');
});
