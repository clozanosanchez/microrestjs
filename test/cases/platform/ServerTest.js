'use strict';

/**
 * Test suite for Server module.
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

describe('Functionality: Server()', function getInstanceTest() {
    let Server;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Server = require(microrestModules.server);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The returned instance is correct', function case1() {
        const server = new Server();

        should.exist(server);
        server.should.be.instanceof(Object);
        server.constructor.name.should.be.equal('Server');

        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();

        should.exist(server.app);
        server.app.should.be.instanceof(Object);
        server.app.should.not.be.empty();

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.be.empty();

        should.not.exist(server.httpsServer);
        server.should.have.ownProperty('httpsServer');
    });
});

describe('Functionality: Server.addPlatformCredentials()', function addPlatformCredentialsTest() {
    let Server;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Server = require(microrestModules.server);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Add credentials correctly', function case1() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        server.addPlatformCredentials(credentials);

        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.not.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.not.be.empty();
    });

    it('Case 2: The credentials parameter is null', function case2() {
        const server = new Server();

        (function () {
            server.addPlatformCredentials(null);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 3: The credentials parameter is undefined', function case3() {
        const server = new Server();

        (function () {
            server.addPlatformCredentials(undefined);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 4: The credentials parameter is not an object', function case4() {
        const server = new Server();

        (function () {
            server.addPlatformCredentials(1);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 5: The credentials parameter is a empty object', function case5() {
        const server = new Server();

        (function () {
            server.addPlatformCredentials({});
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 6: The key property is not present', function case6() {
        const server = new Server();

        const credentials = {
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 7: The certificate property is not present', function case7() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 8: The key property is null', function case8() {
        const server = new Server();

        const credentials = {
            key: null,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 9: The key property is undefined', function case9() {
        const server = new Server();

        const credentials = {
            key: undefined,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 10: The key property is not a string', function case10() {
        const server = new Server();

        const credentials = {
            key: 1,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 11: The key property is an empty string', function case11() {
        const server = new Server();

        const credentials = {
            key: '',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 12: The certificate property is null', function case12() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: null
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 13: The certificate property is undefined', function case13() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: undefined
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 14: The certificate property is not a string', function case14() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: 1
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });

    it('Case 15: The certificate property is an empty string', function case15() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: ''
        };

        (function () {
            server.addPlatformCredentials(credentials);
        }).should.throw();
        should.exist(server.platformCredentials);
        server.platformCredentials.should.be.Object();
        server.platformCredentials.should.have.ownProperty('key');
        server.platformCredentials.key.should.be.String();
        server.platformCredentials.key.should.be.empty();
        server.platformCredentials.should.have.ownProperty('certificate');
        server.platformCredentials.certificate.should.be.String();
        server.platformCredentials.certificate.should.be.empty();
    });
});

describe('Functionality: Server.listen()', function listenTest() {
    let Server;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Server = require(microrestModules.server);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The server listens correctly without credentials and port=0', function case1() {
        const server = new Server();

        server.listen(0);

        should.exist(server.httpsServer);
        server.httpsServer.should.be.Object();
        server.httpsServer.should.not.be.empty();
    });

    it('Case 2: The server listens correctly with credentials and port=65535', function case2() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        server.addPlatformCredentials(credentials);
        server.listen(65535);

        should.exist(server.httpsServer);
        server.httpsServer.should.be.Object();
        server.httpsServer.should.not.be.empty();
    });

    it('Case 3: The port parameter is null', function case3() {
        const server = new Server();

        (function () {
            server.listen(null);
        }).should.throw();
    });

    it('Case 4: The port parameter is undefined', function case4() {
        const server = new Server();

        (function () {
            server.listen(undefined);
        }).should.throw();
    });

    it('Case 5: The port parameter is not integer', function case5() {
        const server = new Server();

        (function () {
            server.listen('1');
        }).should.throw();
    });

    it('Case 6: The port parameter is less than 0', function case6() {
        const server = new Server();

        (function () {
            server.listen(-1);
        }).should.throw();
    });

    it('Case 7: The port parameter is greater than 65535', function case7() {
        const server = new Server();

        (function () {
            server.listen(65536);
        }).should.throw();
    });
});

describe('Functionality: Server.route()', function routeTest() {
    let fs;
    let Server;
    let runnableServiceFactoryModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        fs = require('fs');
        Server = require(microrestModules.server);
        runnableServiceFactoryModule = require(microrestModules.runnableServiceFactory);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: All the operations are routed correctly (1 out 1)', function case1() {
        const serviceName = 'test1';
        const path = `${fs.realpathSync('./test/env/servicesTest/good/one')}/${serviceName}`;

        const goodRunnableService = runnableServiceFactoryModule.createService(serviceName, path);

        const server = new Server();
        server.route(goodRunnableService);

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(1);
    });

    it('Case 2: All the operations are routed correctly (1 out 2)', function case2() {
        const serviceName = 'test3';
        const path = `${fs.realpathSync('./test/env/servicesTest/bad/others')}/${serviceName}`;

        const badRunnableService = runnableServiceFactoryModule.createService(serviceName, path);

        const server = new Server();
        server.route(badRunnableService);

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(1);
    });

    it('Case 3: The runnableService parameter is null', function case3() {
        const server = new Server();

        (function () {
            server.route(null);
        }).should.throw();

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(0);
    });

    it('Case 4: The runnableService parameter is undefined', function case4() {
        const server = new Server();

        (function () {
            server.route(undefined);
        }).should.throw();

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(0);
    });

    it('Case 5: The runnableService parameter is not a RunnableService object', function case5() {
        const server = new Server();

        (function () {
            server.route(1);
        }).should.throw();

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(0);
    });

    it('Case 6: The runnableService parameter is an empty object', function case6() {
        const server = new Server();

        (function () {
            server.route({});
        }).should.throw();

        should.exist(server.routedServices);
        server.routedServices.should.be.Array();
        server.routedServices.should.have.length(0);
    });
});

describe('Functionality: Server.shutdown()', function shutdownTest() {
    let Server;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Server = require(microrestModules.server);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The Server shutdowns correctly before listening with no credentials', function case1() {
        const server = new Server();

        server.shutdown();

        server.should.have.ownProperty('platformCredentials');
        should.not.exist(server.platformCredentials);

        server.should.have.ownProperty('app');
        should.not.exist(server.app);

        server.should.have.ownProperty('routedServices');
        should.not.exist(server.routedServices);

        server.should.have.ownProperty('httpsServer');
        should.not.exist(server.httpsServer);
    });

    it('Case 2: The Server shutdowns correctly when listening with credentials', function case2() {
        const server = new Server();

        const credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        server.addPlatformCredentials(credentials);
        server.listen(8443);

        server.shutdown();

        server.should.have.ownProperty('platformCredentials');
        should.not.exist(server.platformCredentials);

        server.should.have.ownProperty('app');
        should.not.exist(server.app);

        server.should.have.ownProperty('routedServices');
        should.not.exist(server.routedServices);

        server.should.have.ownProperty('httpsServer');
        should.not.exist(server.httpsServer);
    });

    it('Case 3: Several shutdowns does not cause problems (listening without credentials)', function case3() {
        const server = new Server();

        server.listen(8443);

        server.shutdown();

        server.should.have.ownProperty('platformCredentials');
        should.not.exist(server.platformCredentials);

        server.should.have.ownProperty('app');
        should.not.exist(server.app);

        server.should.have.ownProperty('routedServices');
        should.not.exist(server.routedServices);

        server.should.have.ownProperty('httpsServer');
        should.not.exist(server.httpsServer);

        server.shutdown();

        server.should.have.ownProperty('platformCredentials');
        should.not.exist(server.platformCredentials);

        server.should.have.ownProperty('app');
        should.not.exist(server.app);

        server.should.have.ownProperty('routedServices');
        should.not.exist(server.routedServices);

        server.should.have.ownProperty('httpsServer');
        should.not.exist(server.httpsServer);
    });
});
