'use strict';

/**
 * Test suite for RunnableService module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @testsuite
 */

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../env/MicrorestModules');

describe('Functionality: RunnableService()', function getInstanceTest() {
    let RunnableService;
    let ServiceContext;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        ServiceContext = require(microrestModules.serviceContext);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of RunnableService', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        should.exist(runnableService);
        runnableService.should.be.instanceof(Object);
        runnableService.constructor.name.should.be.equal('RunnableService');
    });

    it('Case 2: The returned instance has the appropriate properties', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});
        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 3: The returned instance has the appropriate properties if context is null', function case3() {
        const runnableService = new RunnableService(null);

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 4: The returned instance has the appropriate properties if context is undefined', function case4() {
        const runnableService = new RunnableService();

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 5: The returned instance has the appropriate properties if context is a ServiceContext object', function case5() {
        const serviceContext = new ServiceContext({});
        const runnableService = new RunnableService(serviceContext);

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });
});

describe('Functionality: RunnableService.getContext()', function getContextTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: RunnableService.getIdentificationName()', function getIdentificationNameTest() {
    it('Tested in ServiceTest: no overriding');
});

describe('Functionality: RunnableService.registerCallableService()', function registerCallableServiceTest() {
    let RunnableService;
    let CallableService;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        CallableService = require(microrestModules.callableService);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The CallableService is registered correctly', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});

        const registered = runnableService.registerCallableService('serviceTest1', callableService);
        registered.should.be.true();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.not.empty();
        runnableService.callableServices.should.have.property('serviceTest1');
        runnableService.callableServices.serviceTest1.should.be.instanceof(Object);
        runnableService.callableServices.serviceTest1.constructor.name.should.be.equal('CallableService');
        should.deepEqual(runnableService.callableServices.serviceTest1, callableService);
    });

    it('Case 2: The CallableService is not registered if the serviceName is null', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});

        const registered = runnableService.registerCallableService(null, callableService);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
    });

    it('Case 3: The CallableService is not registered if the serviceName is undefined', function case3() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});

        const registered = runnableService.registerCallableService(undefined, callableService);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
    });

    it('Case 4: The CallableService is not registered if the serviceName is not a string', function case4() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});

        const registered = runnableService.registerCallableService(1, callableService);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
    });

    it('Case 5: The CallableService is not registered if the serviceName is an empty string', function case5() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});

        const registered = runnableService.registerCallableService('', callableService);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
    });

    it('Case 6: The CallableService is not registered if the callableService is null', function case6() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const registered = runnableService.registerCallableService('serviceTest1', null);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceTest1');
    });

    it('Case 7: The CallableService is not registered if the callableService is undefined', function case7() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const registered = runnableService.registerCallableService('serviceTest1', undefined);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceTest1');
    });

    it('Case 8: The CallableService is not registered if the callableService is not an object', function case8() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const registered = runnableService.registerCallableService('serviceTest1', 1);
        registered.should.be.false();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.Object();
        runnableService.callableServices.should.be.empty();
        runnableService.callableServices.should.not.have.property('serviceTest1');
    });
});

describe('Functionality: RunnableService.getCallableService()', function getCallableServiceTest() {
    let RunnableService;
    let CallableService;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        CallableService = require(microrestModules.callableService);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: There is a CallableService registered that is retrieved correctly', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableService = new CallableService({info: {name:'serviceTest1', api:1}});
        runnableService.registerCallableService('serviceTest1', callableService);

        const callableServiceRetrieved = runnableService.getCallableService('serviceTest1');
        should.exist(callableServiceRetrieved);
        callableServiceRetrieved.should.be.instanceof(Object);
        callableServiceRetrieved.constructor.name.should.be.equal('CallableService');
        should.deepEqual(callableServiceRetrieved, callableService);
    });

    it('Case 2: Null is retrieved when the serviceName is null', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableServiceRetrieved = runnableService.getCallableService(null);
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);
    });

    it('Case 3: Null is retrieved when the serviceName is undefined', function case3() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        let callableServiceRetrieved = runnableService.getCallableService(undefined);
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);

        callableServiceRetrieved = runnableService.getCallableService();
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);
    });

    it('Case 4: Null is retrieved when the serviceName is not a string', function case4() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableServiceRetrieved = runnableService.getCallableService(1);
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);
    });

    it('Case 5: Null is retrieved when the serviceName is an empty string', function case5() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableServiceRetrieved = runnableService.getCallableService('');
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);
    });

    it('Case 6: Null is retrieved when the callableService has not been registered previously', function case6() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const callableServiceRetrieved = runnableService.getCallableService('noRegisteredService');
        should.not.exist(callableServiceRetrieved);
        should.equal(callableServiceRetrieved, null);
    });

    it('Case 7: Null is retrieved when the callableService has been registered previously but it is not an object', function case7() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.callableServices = {
            serviceTest1: 1
        };

        const callableService = runnableService.getCallableService('serviceTest1');
        should.not.exist(callableService);
        should.equal(callableService, null);
    });
});

describe('Functionality: RunnableService.getLogger()', function getLoggerTest() {
    let RunnableService;
    let Logger;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        Logger = require('winston').Logger;
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The default logger is retrieved correctly', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 2: The custom logger is retrieved correctly when it is changed', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const logger = new Logger();
        runnableService.logger = logger;

        const retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
        retrievedLogger.should.be.deepEqual(logger);
    });

    it('Case 3: A default logger is retrieved correctly if it was manually changed by null', function case3() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.logger = null;

        const retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 4: A default logger is retrieved correctly if it was manually changed by undefined', function case4() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.logger = undefined;

        const retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 5: A default logger is retrieved correctly if it was manually changed by a non-object', function case5() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.logger = 1;

        const retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });
});

describe('Functionality: RunnableService.setDefaultLogger()', function setDefaultLoggerTest() {
    let RunnableService;
    let loggerManagerModule;
    let Logger;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        loggerManagerModule = require(microrestModules.loggerManager);
        Logger = require('winston').Logger;

        loggerManagerModule.configure({enable: true, level: 'info'});
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: A default logger is set correctly (LoggerOptions is undefined)', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.setDefaultLogger();
        should.exist(runnableService.logger);
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.level.should.be.equal('info');
        runnableService.logger.transports.should.have.property('console');
    });

    it('Case 2: A default logger is set correctly (LoggerOptions is null)', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.setDefaultLogger(null);
        should.exist(runnableService.logger);
        runnableService.logger.level.should.be.equal('info');
        runnableService.logger.transports.should.have.property('console');
    });

    it('Case 3: A default logger is set correctly (LoggerOptions is not an object)', function case3() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.setDefaultLogger(1);
        should.exist(runnableService.logger);
        runnableService.logger.level.should.be.equal('info');
        runnableService.logger.transports.should.have.property('console');
    });

    it('Case 4: A default logger is set correctly with the appropriate options', function case4() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        runnableService.setDefaultLogger({level: 'warn'});
        should.exist(runnableService.logger);
        runnableService.logger.level.should.be.equal('warn');
        runnableService.logger.transports.should.have.property('console');

        runnableService.setDefaultLogger({level: 'info'});
        should.exist(runnableService.logger);
        runnableService.logger.level.should.be.equal('info');
        runnableService.logger.transports.should.have.property('console');
    });
});

describe('Functionality: RunnableService.setCustomLogger()', function setCustomLoggerTest() {
    let RunnableService;
    let loggerManagerModule ;
    let Logger;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        RunnableService = require(microrestModules.runnableService);
        loggerManagerModule = require(microrestModules.loggerManager);
        Logger = require('winston').Logger;
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: A custom logger is set correctly', function case1() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        const customLogger = new Logger();

        runnableService.setCustomLogger(customLogger);
        should.exist(runnableService.logger);
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(customLogger);
    });

    it('Case 2: A custom logger is not set if it is null', function case2() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        (function () {
            runnableService.setCustomLogger(null);
        }).should.throw();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 3: A custom logger is not set if it is undefined', function case3() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        (function () {
            runnableService.setCustomLogger(undefined);
        }).should.throw();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 4: A custom logger is not set if it is not an object', function case4() {
        const runnableService = new RunnableService({info: {name:'serviceTest', api:1}});

        (function () {
            runnableService.setCustomLogger(1);
        }).should.throw();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });
});
