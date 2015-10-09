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

var fs = require('fs');
var should = require('should');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: CheckDirectory.isDirectorySync()', function isDirectorySyncTest() {
    it('Case 1: True is returned if the path is a directory', function case1() {
        var path = fs.realpathSync('./test/env');

        var isDirectory = require(microrestModules.checkDirectory).isDirectorySync(path);

        should.exist(isDirectory);
        isDirectory.should.be.true();
    });

    it('Case 2: False is returned if the path is not a directory', function case2() {
        var path = fs.realpathSync('./test/env') + '/configuration.json';

        var isDirectory = require(microrestModules.checkDirectory).isDirectorySync(path);

        should.exist(isDirectory);
        isDirectory.should.be.false();
    });

    it('Case 3: Throws an error if the path does not exist', function case3() {
        var path = fs.realpathSync('./test/env') + '/NotExistDirectory';

        (function() {
            require(microrestModules.checkDirectory).isDirectorySync(path);
        }).should.throw();
    });

    it('Case 4: The path parameter is null', function case4() {
        (function() {
            require(microrestModules.checkDirectory).isDirectorySync(null);
        }).should.throw();
    });

    it('Case 5: The path parameter is undefined', function case5() {
        (function() {
            require(microrestModules.checkDirectory).isDirectorySync();
        }).should.throw();
    });

    it('Case 6: The path parameter is not a string', function case6() {
        (function() {
            require(microrestModules.checkDirectory).isDirectorySync(1);
        }).should.throw();
    });

    it('Case 7: The path parameter is an empty string', function case7() {
        (function() {
            require(microrestModules.checkDirectory).isDirectorySync('');
        }).should.throw();
    });
});

describe('Functionality: CheckDirectory.isDirectory()', function isDirectoryTest() {
    it('Case 1: True is returned if the path is a directory', function case1(done) {
        var path = fs.realpathSync('./test/env');

        require(microrestModules.checkDirectory).isDirectory(path, function(error, isDirectory) {
            should.not.exist(error);
            should.exist(isDirectory);
            isDirectory.should.be.true();
            done();
        });
    });

    it('Case 2: False is returned if the path is not a directory', function case2(done) {
        var path = fs.realpathSync('./test/env') + '/configuration.json';

        require(microrestModules.checkDirectory).isDirectory(path, function (error, isDirectory) {
            should.not.exist(error);
            should.exist(isDirectory);
            isDirectory.should.be.false();
            done();
        });
    });

    it('Case 3: An error is returned if the path does not exist', function case3(done) {
        var path = fs.realpathSync('./test/env') + '/NotExistDirectory';

        require(microrestModules.checkDirectory).isDirectory(path, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 4: The path parameter is null', function case4(done) {
        require(microrestModules.checkDirectory).isDirectory(null, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 5: The path parameter is undefined', function case5(done) {
        require(microrestModules.checkDirectory).isDirectory(undefined, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 6: The path parameter is not a string', function case6(done) {
        require(microrestModules.checkDirectory).isDirectory(1, function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 7: The path parameter is an empty string', function case7(done) {
        require(microrestModules.checkDirectory).isDirectory('', function (error, isDirectory) {
            should.exist(error);
            error.should.be.instanceof(Error);
            should.not.exist(isDirectory);
            done();
        });
    });

    it('Case 8: The callback parameter is null', function case8() {
        var path = fs.realpathSync('./test/env');

        (function() {
            require(microrestModules.checkDirectory).isDirectory(path, null);
        }).should.throw();
    });

    it('Case 9: The callback parameter is undefined', function case9() {
        var path = fs.realpathSync('./test/env');

        (function() {
            require(microrestModules.checkDirectory).isDirectory(path);
        }).should.throw();
    });

    it('Case 10: The callback parameter is not a function', function case10() {
        var path = fs.realpathSync('./test/env');

        (function() {
            require(microrestModules.checkDirectory).isDirectory(path, 1);
        }).should.throw();
    });
});
