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

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../env/MicrorestModules');

describe('Functionality: ServiceManager', function getInstanceTest() {
    let ServiceManager;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        ServiceManager = require(microrestModules.serviceManager);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is instance of ServiceManager', function case1() {
        const serviceManager = new ServiceManager();

        should.exist(serviceManager);
        serviceManager.should.be.instanceof(Object);
        serviceManager.constructor.name.should.be.equal('ServiceManager');
    });

    it('Case 2: The returned instance has the appropriate properties', function case2() {
        const serviceManager = new ServiceManager();

        should.exist(serviceManager);
        serviceManager.should.have.ownProperty('services');
        should.exist(serviceManager.services);
        serviceManager.services.should.be.Object();
        serviceManager.services.should.be.empty();
    });
});

describe('Functionality: ServiceManager.loadServices()', function loadServicesTest() {
    let ServiceManager;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        ServiceManager = require(microrestModules.serviceManager);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The servicesRootPath parameter is null', function case1() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices(null);
        }).should.throw();
    });

    it('Case 2: The servicesRootPath parameter is undefined', function case2() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices(undefined);
        }).should.throw();
    });

    it('Case 3: The servicesRootPath parameter is not a string', function case3() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices(1);
        }).should.throw();

        (function () {
            serviceManager.loadServices(true);
        }).should.throw();

        (function () {
            serviceManager.loadServices({});
        }).should.throw();

        (function () {
            serviceManager.loadServices([]);
        }).should.throw();
    });

    it('Case 4: The servicesRootPath parameter is an empty string', function case4() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('');
        }).should.throw();
    });

    it('Case 5: The servicesRootPath parameter is a path that does not exist', function case5() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('./test/env/servicesTest/NotExist');
        }).should.throw();
    });

    it('Case 6: The servicesRootPath parameter is a correct path but it is not a directory', function case6() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('./test/env/configuration.json');
        }).should.throw();
    });

    it('Case 7: The servicesRootPath parameter is a correct path but the user has not enough permissions.');

    it('Case 8: Loads all the correct services that are in the path (0 out 0)', function case8() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('./test/env/servicesTest/empty');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.Object();
        serviceManager.services.should.be.empty();
    });

    it('Case 9: Loads all the correct services that are in the path (1 out 1)', function case9() {
        const serviceManager = new ServiceManager();
        (function () {
            serviceManager.loadServices('./test/env/servicesTest/good/one');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.Object();
        Object.keys(serviceManager.services).should.have.length(1);
        serviceManager.services.should.have.properties('test1/v1');
    });

    it('Case 10: Loads all the correct services that are in the path (5 out 5)', function case10() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('./test/env/servicesTest/good/five');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.Object();
        Object.keys(serviceManager.services).should.have.length(5);
        serviceManager.services.should.have.properties('test1/v1', 'test2/v1', 'test3/v1', 'test4/v1', 'test5/v1');
    });

    it('Case 11: Loads all the correct services that are in the path (2 out 5)', function case11() {
        const serviceManager = new ServiceManager();

        (function () {
            serviceManager.loadServices('./test/env/servicesTest/bad/five');
        }).should.not.throw();
        should.exist(serviceManager.services);
        serviceManager.services.should.be.Object();
        Object.keys(serviceManager.services).should.have.length(2);
        serviceManager.services.should.have.properties('test1/v1', 'test3/v1');
    });
});

describe('Functionality: ServiceManager.deployServices()', function deployServicesTest() {
    let ServiceManager;
    let Server;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        ServiceManager = require(microrestModules.serviceManager);
        Server = require(microrestModules.server);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Deploy all the services correctly (0 out 0)', function case1() {
        const server = new Server();

        const serviceManager = new ServiceManager();
        serviceManager.deployServices(server);

        server.routedServices.should.have.length(0);
    });

    it('Case 2: Deploy all the services correctly (5 out 5)', function case2() {
        const server = new Server();

        const serviceManager = new ServiceManager();
        serviceManager.loadServices('./test/env/servicesTest/good/five');
        serviceManager.deployServices(server);

        server.routedServices.should.have.length(5);
    });

    it('Case 3: The server parameter is null', function case3() {
        const serviceManager = new ServiceManager();

        (function () {
           serviceManager.deployServices(null);
       }).should.throw();
    });

    it('Case 4: The server parameter is undefined', function case4() {
        const serviceManager = new ServiceManager();

        (function () {
           serviceManager.deployServices(undefined);
       }).should.throw();
    });

    it('Case 5: The server parameter is not a Server sobject', function case5() {
        const serviceManager = new ServiceManager();

        (function () {
           serviceManager.deployServices('Server');
       }).should.throw();
    });

    it('Case 6: The server parameter is an empty object', function case6() {
        const serviceManager = new ServiceManager();

        (function () {
           serviceManager.deployServices({});
       }).should.throw();
    });
});

describe('Functionality: ServiceManager.registerServices()', function registerServicesTest() {
    it('NOT TESTED');
});

describe('Functionality: ServiceManager.addCertificateToServices()', function addCertificateToServicesTest() {
    let ServiceManager;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        ServiceManager = require(microrestModules.serviceManager);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Add certificate correctly (0 out 0)', function case1() {
        const certificate = '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----';

        const serviceManager = new ServiceManager();
        serviceManager.addCertificateToServices(certificate);

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            service.certificate.should.be.String();
            service.certificate.should.not.be.empty();
        }

        i.should.be.equal(0);
    });

    it('Case 2: Add certificate correctly (5 out 5)', function case2() {
        const certificate = '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----';

        const serviceManager = new ServiceManager();

        serviceManager.loadServices('./test/env/servicesTest/good/five');
        serviceManager.addCertificateToServices(certificate);

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            service.certificate.should.be.String();
            service.certificate.should.not.be.empty();
        }

        i.should.be.equal(5);
    });

    it('Case 3: The certificate parameter is null', function case3() {
        const serviceManager = new ServiceManager();

        serviceManager.loadServices('./test/env/servicesTest/good/five');
        (function () {
            serviceManager.addCertificateToServices(null);
        }).should.throw();

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            should.not.exist(service.certificate);
        }

        i.should.be.equal(5);
    });

    it('Case 4: The certificate parameter is undefined', function case4() {
        const serviceManager = new ServiceManager();

        serviceManager.loadServices('./test/env/servicesTest/good/five');
        (function () {
            serviceManager.addCertificateToServices(undefined);
        }).should.throw();

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            should.not.exist(service.certificate);
        }

        i.should.be.equal(5);
    });

    it('Case 5: The certificate parameter is not string', function case5() {
        const serviceManager = new ServiceManager();

        serviceManager.loadServices('./test/env/servicesTest/good/five');
        (function () {
            serviceManager.addCertificateToServices(1);
        }).should.throw();

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            should.not.exist(service.certificate);
        }

        i.should.be.equal(5);
    });

    it('Case 6: The certificate parameter is an empty string', function case6() {
        const serviceManager = new ServiceManager();

        serviceManager.loadServices('./test/env/servicesTest/good/five');
        (function () {
            serviceManager.addCertificateToServices('');
        }).should.throw();

        const servicesNames = Object.keys(serviceManager.services);
        let i;
        for (i = 0; i < servicesNames.length; i++) {
            const service = serviceManager.services[servicesNames[i]];
            should.exist(service);
            should.not.exist(service.certificate);
        }

        i.should.be.equal(5);
    });
});

describe('Functionality: ServiceManager.shutdown()', function shutdownTest() {
    let ServiceManager;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        ServiceManager = require(microrestModules.serviceManager);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The ServiceManager shutdowns correctly without services', function case1() {
        const serviceManager = new ServiceManager();

        serviceManager.shutdown();

        serviceManager.should.have.ownProperty('services');
        should.not.exist(serviceManager.services);
    });

    it('Case 2: The ServiceManager shutdowns correctly with five services with certificates', function case2() {
        const certificate = '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----';

        const serviceManager = new ServiceManager();
        serviceManager.loadServices('./test/env/servicesTest/good/five');
        serviceManager.addCertificateToServices(certificate);
        serviceManager.shutdown();

        serviceManager.should.have.ownProperty('services');
        should.not.exist(serviceManager.services);
    });

    it('Case 3: Several shutdowns does not cause problems (five services without certificates)', function case3() {
        const serviceManager = new ServiceManager();
        serviceManager.loadServices('./test/env/servicesTest/good/five');

        serviceManager.shutdown();

        serviceManager.should.have.ownProperty('services');
        should.not.exist(serviceManager.services);

        serviceManager.shutdown();

        serviceManager.should.have.ownProperty('services');
        should.not.exist(serviceManager.services);
    });
});
