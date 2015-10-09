'use strict';

/**
 * Test suite for ServiceFunctionalityLoader module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: ServiceFunctionalityLoader.loadServiceFunctionality()', function loadServiceFunctionalityFunctionalityTest() {
    it('Case 1: The serviceFunctionalityPath parameter is null', function case1() {
        (function() {
            require(microrestModules.serviceFunctionalityLoader).loadServiceFunctionality(null);
        }).should.throw();
    });

    it('Case 2: The serviceFunctionalityPath parameter is undefined', function case2() {
        (function() {
            require(microrestModules.serviceFunctionalityLoader).loadServiceFunctionality();
        }).should.throw();
    });

    it('Case 3: The serviceFunctionalityPath parameter is not a string', function case3() {
        (function() {
            require(microrestModules.serviceFunctionalityLoader).loadServiceFunctionality(1);
        }).should.throw();
    });

    it('Case 4: The serviceFunctionalityPath parameter is an empty string', function case4() {
        (function() {
            require(microrestModules.serviceFunctionalityLoader).loadServiceFunctionality('');
        }).should.throw();
    });

    it('Case 5: The serviceFunctionalityPath parameter is a path that does not exist', function case5() {
        var serviceFunctionalityPath = process.cwd() + '/test/env/serviceFunctionalities/functionalityNotExist.js';

        (function() {
            require(microrestModules.serviceFunctionalityLoader).loadServiceFunctionality(serviceFunctionalityPath);
        }).should.throw();
    });

    it('Case 6: The service description file is completely correct', function case6() {
        var serviceFunctionalityLoader = require(microrestModules.serviceFunctionalityLoader);
        var serviceFunctionalityPath = process.cwd() + '/test/env/serviceFunctionalities/functionalityCase6.js';
        var serviceFunctionality = serviceFunctionalityLoader.loadServiceFunctionality(serviceFunctionalityPath);
        should.exist(serviceFunctionality);
        serviceFunctionality.should.be.instanceof(Object);
        serviceFunctionality.should.have.ownProperty('greet');
    });
});
