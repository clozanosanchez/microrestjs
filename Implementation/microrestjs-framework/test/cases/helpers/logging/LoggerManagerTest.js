'use strict';

/**
 * Test suite for LoggerManager module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var winston = require('winston');

var microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: LoggerManager.configure()', function configureFunctionalityTest() {
    it('Case 1: The loggerConfiguration parameter is completely correct with enable=true', function case1() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true,
            level: 'info'
        };

        loggerManagerModule.configure(loggerConfiguration);
    });

    it('Case 2: The loggerConfiguration parameter is completely correct with enable=false', function case2() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: false,
            level: 'info'
        };

        loggerManagerModule.configure(loggerConfiguration);
    });

    it('Case 3: The loggerConfiguration is null', function case3() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = null;

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 4: The loggerConfiguration is undefined', function case4() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = undefined;

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 5: The loggerConfiguration is not an object', function case5() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = 1;

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 6: The loggerConfiguration is a empty object', function case6() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {};

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 7: The loggerConfiguration does not have the property enable', function case7() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            level: 'info'
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 8: The loggerConfiguration does not have the property level', function case8() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 9: The property enable is null', function case9() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: null,
            level: 'info'
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 10: The property enable is undefined', function case10() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: undefined,
            level: 'info'
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 11: The property enable is not boolean', function case11() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: 1,
            level: 'info'
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 12: The property info is null', function case12() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true,
            level: null
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 13: The property info is undefined', function case13() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true,
            level: undefined
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 14: The property info is not a string', function case14() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true,
            level: 1
        };

        (function() {
            loggerManagerModule.configure(loggerConfiguration);
        }).should.throw();
    });

    it('Case 15: The property info is an empty string', function case15() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerConfiguration = {
            enable: true,
            level: ''
        };

        loggerManagerModule.configure(loggerConfiguration);
    });
});

describe('Functionality: LoggerManager.getLogger()', function getLoggerFunctionalityTest() {
    it('Case 1: A default logger is created correctly', function case1() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.getLogger('getLoggerCase1');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
    });

    it('Case 2: A existing logger is retrieved correctly', function case2() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.getLogger('getLoggerCase2');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);

        var loggerAgain = loggerManagerModule.getLogger('getLoggerCase2');
        should.exist(loggerAgain);
        loggerAgain.should.be.instanceof(winston.Logger);
        loggerAgain.should.be.deepEqual(logger);
    });

    it('Case 3: A custom logger is created correctly', function case3() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var logger = loggerManagerModule.getLogger('getLoggerCase3', loggerOptions);
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('warn');
        logger.transports.should.have.property('console');
    });

    it('Case 4: A custom logger is retrieved correctly', function case4() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var logger = loggerManagerModule.getLogger('getLoggerCase4', loggerOptions);
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('warn');
        logger.transports.should.have.property('console');

        var loggerAgain = loggerManagerModule.getLogger('getLoggerCase4');
        should.exist(loggerAgain);
        loggerAgain.should.be.instanceof(winston.Logger);
        loggerAgain.should.be.deepEqual(logger);
    });

    it('Case 5: A existing logger is not replace', function case5() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.getLogger('getLoggerCase5');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('info');
        logger.transports.should.have.property('console');

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var sameLogger = loggerManagerModule.getLogger('getLoggerCase5', loggerOptions);
        should.exist(sameLogger);
        sameLogger.should.be.instanceof(winston.Logger);
        sameLogger.level.should.be.equal('info');
        sameLogger.transports.should.have.property('console');
        sameLogger.should.be.deepEqual(logger);
    });

    it('Case 6: The parameter loggerName is null', function case6() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.getLogger(null);
        }).should.throw();
    });

    it('Case 7: The parameter loggerName is undefined', function case7() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.getLogger(undefined);
        }).should.throw();
    });

    it('Case 8: The parameter loggerName is not a string', function case8() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.getLogger(1);
        }).should.throw();
    });

    it('Case 9: The parameter loggerName is an empty string', function case9() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.getLogger('');
        }).should.throw();
    });
});

describe('Functionality: LoggerManager.createLogger()', function createLoggerFunctionalityTest() {
    it('Case 1: A default logger is created correctly', function case1() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.createLogger('createLoggerCase1');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
    });

    it('Case 2: A default logger is created and can be retrieved correctly', function case2() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.createLogger('createLoggerCase2');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);

        var loggerAgain = loggerManagerModule.getLogger('createLoggerCase2');
        should.exist(loggerAgain);
        loggerAgain.should.be.instanceof(winston.Logger);
        loggerAgain.should.be.deepEqual(logger);
    });

    it('Case 3: A custom logger is created correctly', function case3() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var logger = loggerManagerModule.createLogger('createLoggerCase3', loggerOptions);
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('warn');
        logger.transports.should.have.property('console');
    });

    it('Case 4: A custom logger is retrieved correctly', function case4() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var logger = loggerManagerModule.createLogger('createLoggerCase4', loggerOptions);
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('warn');
        logger.transports.should.have.property('console');

        var loggerAgain = loggerManagerModule.getLogger('createLoggerCase4');
        should.exist(loggerAgain);
        loggerAgain.should.be.instanceof(winston.Logger);
        loggerAgain.should.be.deepEqual(logger);
    });

    it('Case 5: A existing logger is replace', function case5() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        var logger = loggerManagerModule.createLogger('createLoggerCase5');
        should.exist(logger);
        logger.should.be.instanceof(winston.Logger);
        logger.level.should.be.equal('info');
        logger.transports.should.have.property('console');

        var loggerOptions = {
            level: 'warn',
            transports: ['console']
        };

        var newLogger = loggerManagerModule.createLogger('createLoggerCase5', loggerOptions);
        should.exist(newLogger);
        newLogger.should.be.instanceof(winston.Logger);
        newLogger.level.should.be.equal('warn');
        newLogger.transports.should.have.property('console');

        var loggerAgain = loggerManagerModule.getLogger('createLoggerCase5');
        should.exist(loggerAgain);
        loggerAgain.should.be.instanceof(winston.Logger);
        loggerAgain.should.not.be.deepEqual(logger);
        loggerAgain.should.be.deepEqual(newLogger);
    });

    it('Case 6: The parameter loggerName is null', function case6() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.createLogger(null);
        }).should.throw();
    });

    it('Case 7: The parameter loggerName is undefined', function case7() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.createLogger(undefined);
        }).should.throw();
    });

    it('Case 8: The parameter loggerName is not a string', function case8() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.createLogger(1);
        }).should.throw();
    });

    it('Case 9: The parameter loggerName is an empty string', function case9() {
        var loggerManagerModule = require(microrestModules.loggerManager);

        (function() {
            loggerManagerModule.createLogger('');
        }).should.throw();
    });
});
