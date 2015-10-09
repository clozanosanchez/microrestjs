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

var microrestModules = require('../../env/MicrorestModules');

describe('Functionality: RunnableService.getInstance()', function getInstanceFunctionalityTest() {
    it('Case 1: The returned instance is instance of RunnableService', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        should.exist(runnableService);
        runnableService.should.be.instanceof(Object);
        runnableService.constructor.name.should.be.equal('RunnableService');
    });

    it('Case 2: The returned instance has the appropriate properties', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 3: The returned instance has the appropriate properties if context is null', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance(null);

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 4: The returned instance has the appropriate properties if context is undefined', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance();

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 5: The returned instance has the appropriate properties if context is a ServiceContext object', function case5() {
        var serviceContext = new (require(microrestModules.serviceContext))({});
        var runnableService = require(microrestModules.runnableService).getInstance(serviceContext);

        runnableService.should.have.property('context');
        runnableService.context.should.be.instanceof(Object);
        runnableService.context.constructor.name.should.be.equal('ServiceContext');

        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.empty();

        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
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
        var callableService = require(microrestModules.callableService).getInstance({});

        var runnableService = require(microrestModules.runnableService).getInstance({});

        var registered = runnableService.registerCallableService('serviceName', callableService);
        registered.should.be.true();
        runnableService.should.have.property('callableServices');
        runnableService.callableServices.should.be.instanceof(Object);
        runnableService.callableServices.should.be.not.empty();
        runnableService.callableServices.should.have.property('serviceName');
        runnableService.callableServices.serviceName.should.be.instanceof(Object);
        runnableService.callableServices.serviceName.constructor.name.should.be.equal('CallableService');
        should.deepEqual(runnableService.callableServices.serviceName, callableService);
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
        var callableService = require(microrestModules.callableService).getInstance({});

        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.registerCallableService('serviceName', callableService);

        var callableServiceRetrieved = runnableService.getCallableService('serviceName');
        should.exist(callableServiceRetrieved);
        callableServiceRetrieved.should.be.instanceof(Object);
        callableServiceRetrieved.constructor.name.should.be.equal('CallableService');
        should.deepEqual(callableServiceRetrieved, callableService);
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
        var runnableService = require(microrestModules.runnableService).getInstance({info: {name:'hello-world', api:1}});

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
        var runnableService = require(microrestModules.runnableService).getInstance({info: {name:'hello-world', api:1}});

        var Logger = require('winston').Logger;
        runnableService.logger = null;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 4: A default logger is retrieved correctly if it was manually changed by undefined', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({info: {name:'hello-world', api:1}});

        var Logger = require('winston').Logger;
        runnableService.logger = undefined;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });

    it('Case 5: A default logger is retrieved correctly if it was manually changed by a non-object', function case5() {
        var runnableService = require(microrestModules.runnableService).getInstance({info: {name:'hello-world', api:1}});

        var Logger = require('winston').Logger;
        runnableService.logger = 1;

        var retrievedLogger = runnableService.getLogger();
        should.exist(retrievedLogger);
        retrievedLogger.should.be.instanceof(Logger);
    });
});

describe('Functionality: RunnableService.setCustomLogger()', function setCustomLoggerFunctionalityTest() {
    it('Case 1: A custom logger is set correctly', function case1() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        var Logger = require('winston').Logger;
        var customLogger = new Logger();

        runnableService.setCustomLogger(customLogger);
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.instanceof(Logger);
        runnableService.logger.should.be.equal(customLogger);
    });

    it('Case 2: A custom logger is not set if it is null', function case2() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.setCustomLogger(null);
        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 3: A custom logger is not set if it is undefined', function case3() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.setCustomLogger(undefined);
        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);

        runnableService.setCustomLogger();
        runnableService.should.have.property('logger');
        should.not.exist(runnableService.logger);
    });

    it('Case 4: A custom logger is not set if it is not an object', function case4() {
        var runnableService = require(microrestModules.runnableService).getInstance({});

        runnableService.setCustomLogger(1);
        runnableService.should.have.property('logger');
        runnableService.logger.should.be.equal(1);
    });
});
