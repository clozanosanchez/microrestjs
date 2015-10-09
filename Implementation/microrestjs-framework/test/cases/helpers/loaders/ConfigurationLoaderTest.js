'use strict';

/**
 * Test suite for ConfigurationLoader module.
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

describe('Functionality: ConfigurationLoader.loadConfiguration()', function loadConfigurationFunctionalityTest() {
    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnUnregistered: false
        });
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The configuration is completely correct', function case1() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'info'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        var configuration = configurationModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.instanceof(Object);
    });

    it('Case 2: The configuration is completely correct with server.port=0', function case2() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 0
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: false,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        var configuration = configurationModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.instanceof(Object);
    });

    it('Case 3: The configuration is completely correct with server.port=65535', function case3() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 65535
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        var configuration = configurationModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.instanceof(Object);
    });

    it('Case 4: The configuration cannot be loaded because the file does not exist', function case4() {
        var configurationModule = require(microrestModules.configurationLoader);

        mockery.registerSubstitute(microrestModules.configurationRealFile, '../configurationNotExist.json');

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 5: The configuration is empty', function case5() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {};

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 6: The configuration has not the property services', function case6() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 7: The configuration has not the property server', function case7() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 8: The configuration has not the property directory', function case8() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 9: The configuration has not the property logger', function case9() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 10: The property services.path is empty', function case10() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: ''
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 11: The property services.path is not a string', function case11() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: 1
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 12: The property server.port is lower than 0', function case12() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: -1
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 13: The property server.port is greater than 65535', function case13() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 65536
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 14: The property server.port is not an integer', function case14() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 2.3
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 15: The property directory.location is empty', function case15() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: ''
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 16: The property directory.location is not a string', function case16() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 1
            }, logger: {
                enable: true,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 17: The property logger.enable is not defined', function case17() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 18: The property logger.enable is not a boolean', function case18() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: 1,
                level: 'warn'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 19: The property logger.level is not defined', function case19() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });

    it('Case 20: The property logger.level is empty', function case20() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: ''
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.not.throw();
    });

    it('Case 21: The property logger.level is not a string', function case21() {
        var configurationModule = require(microrestModules.configurationLoader);

        var testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }, logger: {
                enable: true,
                level: 1
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationModule.loadConfiguration.should.throw();
    });
});

describe('Real: ConfigurationLoader.loadConfiguration()', function loadConfigurationRealTest() {
    it('Case 1: The real configuration file is loaded successfully without errors', function case1() {
        var configurationModule = require(microrestModules.configurationLoader);

        var configuration = configurationModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.instanceof(Object);
    });
});
