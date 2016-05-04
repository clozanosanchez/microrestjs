'use strict';

/**
 * Test suite for Client module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @testsuite
 */

var should = require('should');
var mockery = require('mockery');

var microrestModules = require('../../env/MicrorestModules');

describe('Functionality: Client.addPlatformCredentials()', function addPlatformCredentialsTest() {
    var clientModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        clientModule = require(microrestModules.client);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Add platform credentials correctly', function case1() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        clientModule.addPlatformCredentials(credentials);
    });

    it('Case 2: The credentials parameter is null', function case2() {
        (function () {
            clientModule.addPlatformCredentials(null);
        }).should.throw();
    });

    it('Case 3: The credentials parameter is undefined', function case3() {
        (function () {
            clientModule.addPlatformCredentials(undefined);
        }).should.throw();
    });

    it('Case 4: The credentials parameter is not an object', function case4() {
        (function () {
            clientModule.addPlatformCredentials(1);
        }).should.throw();
    });

    it('Case 5: The credentials parameter is a empty object', function case5() {
        (function () {
            clientModule.addPlatformCredentials({});
        }).should.throw();
    });

    it('Case 6: The key property is not present', function case6() {
        var credentials = {
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 7: The certificate property is not present', function case7() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 8: The key property is null', function case8() {
        var credentials = {
            key: null,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 9: The key property is undefined', function case9() {
        var credentials = {
            key: undefined,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 10: The key property is not a string', function case10() {
        var credentials = {
            key: 1,
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 11: The key property is an empty string', function case11() {
        var credentials = {
            key: '',
            certificate: '-----BEGIN CERTIFICATE-----\nMIIDVDCCAjwCCQDYy5p1p0QlhDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJF\nUzEPMA0GA1UECAwGTWFkcmlkMQ8wDQYDVQQHDAZNYWRyaWQxFDASBgNVBAoMC01p\nY3JvcmVzdGpzMREwDwYDVQQLDAhzZWN1cml0eTESMBAGA1UEAwwJbG9jYWxob3N0\nMB4XDTE1MTAxMTE5MDU1OVoXDTE1MTAxMjE5MDU1OVowbDELMAkGA1UEBhMCRVMx\nDzANBgNVBAgMBk1hZHJpZDEPMA0GA1UEBwwGTWFkcmlkMRQwEgYDVQQKDAtNaWNy\nb3Jlc3RqczERMA8GA1UECwwIc2VjdXJpdHkxEjAQBgNVBAMMCWxvY2FsaG9zdDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFMIkyr902tRqMdbq8Y2TUf\nocO9PDiklD9VELEIJ1mZetsnNNKj2QSGD/8YyPPinBFXsJb6w8pGDj4sSHvvxebt\nS15nf6FeAIzJXKiDzXogKdjtbT5WS6B4ypKdYDJQ1gA3ggo/3dJJPkqMFCzpXwpT\n0vuxJHYJcNb1AV6xY3/Y+7g8XPPoOXD7GHSN3kx1Rm1Pk1+fkNezjqcxfrQBDqO0\npptVSiuC+u5UxWv6DGrZ3g77wFd58aiu/UX1cEaawzdcb3Td4dvStkkZyT5LY+aO\nJwy90UCurgYV2LHzotJOk2+n8pgXHMI2/iEgOT0/sOzBv5kv+uJ2RCPH9W79VbMC\nAwEAATANBgkqhkiG9w0BAQsFAAOCAQEApYdBOk/lX2CgkEC9g1DCasYiczYGZMK3\nvlMq8uN5fPYqrKAulyRfrjEKwH9oQ2H9BVQ9e9am68gtowlTBosPttHV11/BJd/9\n9+R4XE9+NnAvcSdPoBgZPiVs7lnqkvN+7ZPam2NDS15LTjRYMHu8oVy93Qs1k48Y\nW091WbHGEnF3T2e2hf9RrKQZSEv17LlesvuxX41u4LWFckkTgjtF33IYI+ybjSmY\ng9eOYw1xwfvA3E5o0/DYv0bxcMMBQpjnvpS10JBqdR58d2LvzYOhGXeKO/ZQmUwe\nEEhlJ5gtiMt6BKalNCN3cpjq1dXHirGV+85LEdsYBNxgPInw7wQbIg==\n-----END CERTIFICATE-----'
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 12: The certificate property is null', function case12() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: null
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 13: The certificate property is undefined', function case13() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: undefined
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 14: The certificate property is not a string', function case14() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: 1
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });

    it('Case 15: The certificate property is an empty string', function case15() {
        var credentials = {
            key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAsUwiTKv3Ta1Gox1urxjZNR+hw708OKSUP1UQsQgnWZl62yc0\n0qPZBIYP/xjI8+KcEVewlvrDykYOPixIe+/F5u1LXmd/oV4AjMlcqIPNeiAp2O1t\nPlZLoHjKkp1gMlDWADeCCj/d0kk+SowULOlfClPS+7Ekdglw1vUBXrFjf9j7uDxc\n8+g5cPsYdI3eTHVGbU+TX5+Q17OOpzF+tAEOo7Smm1VKK4L67lTFa/oMatneDvvA\nV3nxqK79RfVwRprDN1xvdN3h29K2SRnJPktj5o4nDL3RQK6uBhXYsfOi0k6Tb6fy\nmBccwjb+ISA5PT+w7MG/mS/64nZEI8f1bv1VswIDAQABAoIBACPenlXauMbbVp4r\nlzgPk+o+gxDB2UwwZ9nEUQMv/h4Pgh6SeQpgochbgyL+FbHZ1+9eSVjSVQg4Uitb\n9DI22VgWDBiGYfj4tq3FE1z4hXq+xRihOGfTN6u4pGszMcIcPp9+m22NbEheDx8v\n5ekMMfE58kZ/mTvUPyMOIH/S7alwm2lZbo37F7uQIvrClqqjI3lYJBhrvyebe3Z0\nmYfHMGzijxava0XaCa+AEYgRcU83KtsJHWzSdwufGy5onIO1l76ApKbMYSOTwcR5\nnDkVs9dLlFO8MJHHrPwAt6BwB/B/LJJt4U3NoAO4gHaR04jUHMImjgh2OVGf50GM\nuTDKz+ECgYEA4hMpFz6kUI7Catg0g2E1+jWswtOvjarFJoGaRQdrHoPm4arAkDKU\nAmUQvqYtYy9fCKlTsiwegaRgmcJJdhGx2VsMiJwu1zyVd9ImE6s/IEWfx5isQ7i3\nKujSFZ84NvFQ2aZ9GCd8R4kd7rsffx2V7H3TBsPk8LvhLeL2SlrKUkMCgYEAyMQW\nHMSVQiFXMW0NvPpjYa2YA19vvZpukdBdl54rFehpFJkvTeIMRPvrU5hZiqfYKlPW\nCYloJQFFoHpZpqz2cH2tinNqIjxxrUk5ZXkPrt0CJrPBJmPqLNWtf29+HMPpX8gA\nDatNKWq/RqzCfxtdR0aweHsBcXMTL/tF9pTEz9ECgYApeyyJ+FN7+IXRxvPzu02F\nKH4XjXHjw5bDFvqwecj842TkuUj17GHeAp9M6/7d+R4t36vcwF2kmf2jmNOT13FT\nmXI2SroJgjNGtgeIil5d1IiZvfi1wFnThL6vevR8mFCmbvb7DJuwIIeeezUvRMVy\njC/BSQZj6YVKvx9Dy17eMwKBgHkoTKfjwqd782CyjT3kZSFHX5t5dreXgO6iLjkX\njKzV6sQxhaicqAbheKykHjVdAUjZ+ysaLy1VzS0BaST68GYGkjohWIV8sKWAsRCZ\ntGs0mN2+UOvYFDQmZ2OmZxb469ePnOii3hgGgZQnIeEPJIWlFU4//Sj35zZnj1s1\ngGhhAoGAd87r0W8VF7tVgMJkYBk7Os5rmggxQvdoqk0NdS/yAbdRIA77RQ+LpECG\nZiKDdg3y+yKbY+geBzG5aRYWuBTz0u61Ex9QME/uyCnXX42CBwldeBQcO2wirNiD\ngir0kAtVECGqy5W1j7GlnXlLdfzfwvS3L/Zq99y/GdOKaOHHxpE=\n-----END RSA PRIVATE KEY-----',
            certificate: ''
        };

        (function () {
            clientModule.addPlatformCredentials(credentials);
        }).should.throw();
    });
});

describe('Functionality: Client.cleanPlatformCredentials()', function cleanPlatformCredentialsTest() {
    var clientModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        clientModule = require(microrestModules.client);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: Clean platform credentials correctly', function case1() {
        clientModule.cleanPlatformCredentials();

        clientModule.cleanPlatformCredentials();
    });
});

describe('Functionality: Client.send()', function sendTest() {
    it('NOT TESTED');
});
