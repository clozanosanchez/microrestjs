'use strict';

/**
 * Test suite for CheckDirectory module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');
var mockery = require('mockery');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: CheckDirectory.isDirectorySync()', function isDirectorySyncTest() {
    var fs;
    var checkDirectoryModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        fs = require('fs');
        checkDirectoryModule = require(microrestModules.checkDirectory);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: True is returned if the path is a directory', function case1() {
        var path = fs.realpathSync('./test/env');

        var isDirectory = checkDirectoryModule.isDirectorySync(path);

        should.exist(isDirectory);
        isDirectory.should.be.true();
    });

    it('Case 2: False is returned if the path is not a directory', function case2() {
        var path = fs.realpathSync('./test/env') + '/configuration.json';

        var isDirectory = checkDirectoryModule.isDirectorySync(path);

        should.exist(isDirectory);
        isDirectory.should.be.false();
    });

    it('Case 3: Throws an error if the path does not exist', function case3() {
        var path = fs.realpathSync('./test/env') + '/NotExistDirectory';

        (function() {
            checkDirectoryModule.isDirectorySync(path);
        }).should.throw();
    });

    it('Case 4: The path parameter is null', function case4() {
        (function() {
            checkDirectoryModule.isDirectorySync(null);
        }).should.throw();
    });

    it('Case 5: The path parameter is undefined', function case5() {
        (function() {
            checkDirectoryModule.isDirectorySync();
        }).should.throw();
    });

    it('Case 6: The path parameter is not a string', function case6() {
        (function() {
            checkDirectoryModule.isDirectorySync(1);
        }).should.throw();
    });

    it('Case 7: The path parameter is an empty string', function case7() {
        (function() {
            checkDirectoryModule.isDirectorySync('');
        }).should.throw();
    });
});

describe('Functionality: CheckDirectory.isDirectory()', function isDirectoryTest() {
    var fs;
    var checkDirectoryModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        fs = require('fs');
        checkDirectoryModule = require(microrestModules.checkDirectory);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: True is returned if the path is a directory', function case1(done) {
        var path = fs.realpathSync('./test/env');

        checkDirectoryModule.isDirectory(path, function(error, isDirectory) {
            should.not.exist(error);
            should.exist(isDirectory);
            isDirectory.should.be.true();
            done();
        });
    });

    it('Case 2: False is returned if the path is not a directory', function case2(done) {
        var path = fs.realpathSync('./test/env') + '/configuration.json';

        checkDirectoryModule.isDirectory(path, function (error, isDirectory) {
            should.not.exist(error);
            should.exist(isDirectory);
            isDirectory.should.be.false();
            done();
        });
    });

    it('Case 3: An error is returned if the path does not exist', function case3(done) {
        var path = fs.realpathSync('./test/env') + '/NotExistDirectory';

        checkDirectoryModule.isDirectory(path, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 4: The path parameter is null', function case4(done) {
        checkDirectoryModule.isDirectory(null, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 5: The path parameter is undefined', function case5(done) {
        checkDirectoryModule.isDirectory(undefined, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 6: The path parameter is not a string', function case6(done) {
        checkDirectoryModule.isDirectory(1, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 7: The path parameter is an empty string', function case7(done) {
        checkDirectoryModule.isDirectory('', function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 8: The callback parameter is null', function case8() {
        var path = fs.realpathSync('./test/env');

        (function() {
            checkDirectoryModule.isDirectory(path, null);
        }).should.throw();
    });

    it('Case 9: The callback parameter is undefined', function case9() {
        var path = fs.realpathSync('./test/env');

        (function() {
            checkDirectoryModule.isDirectory(path);
        }).should.throw();
    });

    it('Case 10: The callback parameter is not a function', function case10() {
        var path = fs.realpathSync('./test/env');

        (function() {
            checkDirectoryModule.isDirectory(path, 1);
        }).should.throw();
    });
});
