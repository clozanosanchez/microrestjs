'use strict';

/**
 * Test suite for RunnableService module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');

var microrestModules = require('./env/MicrorestModules');

describe('Functionality: RunnableService.getInstance()', function getInstanceFunctionalityTest() {
    it('Case 1: The returned instance is instance of RunnableService', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        should.exist(runnableService);
        runnableService.should.be.instanceof(Object);
        runnableService.constructor.name.should.be.equal('RunnableService');
    });

    it('Case 2: The returned instance has the appropiate properties', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.should.be.empty();

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Object);
        runnableService.logger.should.be.not.empty();
    });

    it('Case 3: The returned instance has the appropiate properties if context is null', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance(null);

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.should.be.empty();

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Object);
        runnableService.logger.should.be.not.empty();
    });

    it('Case 4: The returned instance has the appropiate properties if context is undefined', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance();

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.should.be.empty();

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Object);
        runnableService.logger.should.be.not.empty();
    });
});

describe('Functionality: RunnableService.getContext()', function getContextFunctionalityTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: RunnableService.getServiceName()', function getServiceNameFunctionalityTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: RunnableService.registerCallableService()', function registerCallableServiceFunctionalityTest() {
    it('Case 1: The CallableService is registered correctly', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('serviceName', {});
        registered.should.be.true();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.not.empty();
        runnableService.callableServices.should.have.property('serviceName');
        runnableService.callableServices.serviceName.should.be.instanceof(Object);
        runnableService.callableServices.serviceName.should.be.empty();
    });

    it('Case 2: The CallableService is not registered if the serviceName is null', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService(null, {});
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
    });

    it('Case 3: The CallableService is not registered if the serviceName is undefined', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService(undefined, {});
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
    });

    it('Case 4: The CallableService is not registered if the serviceName is not a string', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService(1, {});
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
    });

    it('Case 5: The CallableService is not registered if the serviceName is an empty string', function case5() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('', {});
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
    });

    it('Case 6: The CallableService is not registered if the callableService is null', function case6() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('serviceName', null);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceName');
    });

    it('Case 7: The CallableService is not registered if the callableService is undefined', function case7() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('serviceName', undefined);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceName');
    });

    it('Case 8: The CallableService is not registered if the callableService is not an object', function case8() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('serviceName', 1);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceName');
    });
});

describe('Functionality: RunnableService.getCallableService()', function getCallableServiceFunctionalityTest() {
    it('Case 1: There is a CallableService registered that is retrieved correctly', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService('serviceName');
        should.exist(callableService);
        callableService.should.be.instanceof(Object);
        callableService.should.be.empty();
    });

    it('Case 2: Null is retrieved when the serviceName is null', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService(null);
        should.not.exist(callableService);
        should.equal(callableService, null);
    });

    it('Case 3: Null is retrieved when the serviceName is undefined', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService(undefined);
        should.not.exist(callableService);
        should.equal(callableService, null);

        callableService = runnableService.getCallableService();
        should.not.exist(callableService);
        should.equal(callableService, null);
    });

    it('Case 4: Null is retrieved when the serviceName is not a string', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService(1);
        should.not.exist(callableService);
        should.equal(callableService, null);
    });

    it('Case 5: Null is retrieved when the serviceName is an empty stringg', function case5() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService('');
        should.not.exist(callableService);
        should.equal(callableService, null);
    });

    it('Case 6: Null is retrieved when the callableService has not been registered previously', function case6() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: {}
        };

        var callableService = runnableService.getCallableService('otherName');
        should.not.exist(callableService);
        should.equal(callableService, null);
    });

    it('Case 7: Null is retrieved when the callableService has been registered previously but it is not an object', function case7() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.callableServices = {
            serviceName: 1
        };

        var callableService = runnableService.getCallableService('serviceName');
        should.not.exist(callableService);
        should.equal(callableService, null);
    });
});

describe('Functionality: RunnableService.getLogger()', function getLoggerFunctionalityTest() {
    it('Case 1: The default logger is retrieved correctly', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 2: The custom logger is retrieved correctly when it is changed', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        runnableService.logger = new Logger();

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 3: A default logger is retrieved correctly if it was manually changed by null', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        runnableService.logger = null;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 4: A default logger is retrieved correctly if it was manually changed by undefined', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        runnableService.logger = undefined;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 5: A default logger is retrieved correctly if it was manually changed by a non-object', function case5() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        runnableService.logger = 1;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });
});

describe('Functionality: RunnableService.setLogger()', function setLoggerFunctionalityTest() {
    it('Case 1: A custom logger is set correctly', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        var defaultLogger = runnableService.logger;
        var customLogger = new Logger();

        var setLogger = runnableService.setLogger(customLogger);
        setLogger.should.be.true();
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.not.equal(defaultLogger);
        runnableService.logger.should.be.equal(customLogger);
    });

    it('Case 2: A custom logger is not set if it is null', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        var defaultLogger = runnableService.logger;

        var setLogger = runnableService.setLogger(null);
        setLogger.should.be.false();
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(defaultLogger);
    });

    it('Case 3: A custom logger is not set if it is undefined', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        var defaultLogger = runnableService.logger;

        var setLogger = runnableService.setLogger(undefined);
        setLogger.should.be.false();
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(defaultLogger);

        setLogger = runnableService.setLogger();
        setLogger.should.be.false();
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(defaultLogger);
    });

    it('Case 4: A custom logger is not set if it is not an object', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        var defaultLogger = runnableService.logger;

        var setLogger = runnableService.setLogger(1);
        setLogger.should.be.false();
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(defaultLogger);
    });
});
