'use strict';

/**
 * Test suite for ServiceFunctionalityLoader module.
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

describe('Functionality: ServiceFunctionalityLoader.loadServiceFunctionality()', function loadServiceFunctionalityTest() {
    let serviceFunctionalityLoaderModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        serviceFunctionalityLoaderModule = require(microrestModules.serviceFunctionalityLoader)
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The serviceFunctionalityPath parameter is null', function case1() {
        (function () {
            serviceFunctionalityLoaderModule.loadServiceFunctionality(null);
        }).should.throw();
    });

    it('Case 2: The serviceFunctionalityPath parameter is undefined', function case2() {
        (function () {
            serviceFunctionalityLoaderModule.loadServiceFunctionality();
        }).should.throw();
    });

    it('Case 3: The serviceFunctionalityPath parameter is not a string', function case3() {
        (function () {
            serviceFunctionalityLoaderModule.loadServiceFunctionality(1);
        }).should.throw();
    });

    it('Case 4: The serviceFunctionalityPath parameter is an empty string', function case4() {
        (function () {
            serviceFunctionalityLoaderModule.loadServiceFunctionality('');
        }).should.throw();
    });

    it('Case 5: The serviceFunctionalityPath parameter is a path that does not exist', function case5() {
        const serviceFunctionalityPath = `${process.cwd()}/test/env/serviceFunctionalities/functionalityNotExist.js`;

        (function () {
            serviceFunctionalityLoaderModule.loadServiceFunctionality(serviceFunctionalityPath);
        }).should.throw();
    });

    it('Case 6: The service description file is completely correct', function case6() {
        const serviceFunctionalityPath = `${process.cwd()}/test/env/serviceFunctionalities/functionalityCase6.js`;
        const serviceFunctionality = serviceFunctionalityLoaderModule.loadServiceFunctionality(serviceFunctionalityPath);
        should.exist(serviceFunctionality);
        serviceFunctionality.should.be.Object();
        serviceFunctionality.should.have.ownProperty('greet');
    });
});
