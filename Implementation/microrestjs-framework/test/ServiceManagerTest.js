'use strict';

/**
 * Test suite for ServiceManager module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var microrestModules = require('./env/MicrorestModules');

describe('Functionality: ServiceManager.getInstance()', function getInstanceFunctionalityTest() {
    it('Case 1: The returned instance is instance of ServiceManager', function case1() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        should.exist(serviceManager);
        serviceManager.should.be.instanceof(Object);
        serviceManager.constructor.name.should.be.equal('ServiceManager');
    });

    it('Case 2: The returned instance has the appropiate properties', function case2() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        serviceManager.should.have.property('services');
        serviceManager.services.should.be.instanceof(Object);
        serviceManager.services.should.be.empty();
    });
});

describe('Functionality: ServiceManager.loadServices()', function loadServicesFunctionalityTest() {
    it('Case 1: The servicesRootPath parameter is null', function case1() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices(null);
        }).should.throw();
    });

    it('Case 2: The servicesRootPath parameter is undefined', function case2() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices(undefined);
        }).should.throw();
    });

    it('Case 3: The servicesRootPath parameter is not a string', function case3() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices(1);
        }).should.throw();

        (function() {
            serviceManager.loadServices(true);
        }).should.throw();

        (function() {
            serviceManager.loadServices({});
        }).should.throw();

        (function() {
            serviceManager.loadServices([]);
        }).should.throw();
    });

    it('Case 4: The servicesRootPath parameter is an empty string', function case4() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('');
        }).should.throw();
    });

    it('Case 5: The servicesRootPath parameter is a path that does not exist', function case5() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/servicesTest/NotExist');
        }).should.throw();
    });

    it('Case 6: The servicesRootPath parameter is a correct path but it is not a directory', function case6() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/configuration.json');
        }).should.throw();
    });

    it('Case 7: The servicesRootPath parameter is a correct path but the user has not enough permisions.');

    it('Case 8: Loads all the correct services that are in the path (0 out 0)', function case8() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/servicesTest/empty');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.instanceof(Object);
        serviceManager.services.should.be.empty();
    });

    it('Case 9: Loads all the correct services that are in the path (1 out 1)', function case9() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/servicesTest/good/one');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.instanceof(Object);
        Object.keys(serviceManager.services).should.have.length(1);
        serviceManager.services.should.have.properties('test1');
    });

    it('Case 10: Loads all the correct services that are in the path (5 out 5)', function case10() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/servicesTest/good/five');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.instanceof(Object);
        Object.keys(serviceManager.services).should.have.length(5);
        serviceManager.services.should.have.properties('test1', 'test2', 'test3', 'test4', 'test5');
    });

    it('Case 11: Loads all the correct services that are in the path (2 out 5)', function case11() {
        var serviceManager = require(microrestModules.serviceManager).getInstance();

        (function() {
            serviceManager.loadServices('./test/env/servicesTest/bad/five');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.instanceof(Object);
        Object.keys(serviceManager.services).should.have.length(2);
        serviceManager.services.should.have.properties('test1', 'test3');
    });
});

describe('Functionality: ServiceManager.registerServices()', function registerServicesFunctionalityTest() {
    it('NOT IMPLEMENTED');
});
