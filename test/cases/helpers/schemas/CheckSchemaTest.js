'use strict';

/**
 * Test suite for CheckSchema module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: CheckSchema.check()', function checkTest() {
    let checkSchemaModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        checkSchemaModule = require(microrestModules.checkSchema);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The schema parameter is null', function case1() {
        (function () {
            checkSchemaModule.check(null, {});
        }).should.throw();
    });

    it('Case 2: The schema parameter is undefined', function case2() {
        (function () {
            checkSchemaModule.check(undefined, {});
        }).should.throw();
    });

    it('Case 3: The schema parameter is not an object', function case3() {
        (function () {
            checkSchemaModule.check(1, {});
        }).should.throw();
    });

    it('Case 4: The object parameter is null', function case4() {
        (function () {
            checkSchemaModule.check({}, null);
        }).should.throw();
    });

    it('Case 5: The object parameter is undefined', function case5() {
        (function () {
            checkSchemaModule.check({}, undefined);
        }).should.throw();
    });

    it('Case 6: The object parameter is not an object', function case6() {
        (function () {
            checkSchemaModule.check({}, 1);
        }).should.throw();
    });

    it('Case 7: The schema and object parameter are empty objects', function case7() {
        (function () {
            checkSchemaModule.check({}, {});
        }).should.not.throw();
    });
});
