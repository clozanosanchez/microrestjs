'use strict';

/**
 * Test suite for ConfigurationLoader module.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @testsuite
 */

const should = require('should');
const mockery = require('mockery');

const microrestModules = require('../../../env/MicrorestModules');

describe('Functionality: ConfigurationLoader.loadConfiguration()', function loadConfigurationTest() {
    let configurationLoaderModule;

    beforeEach(function beforeEach() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        configurationLoaderModule = require(microrestModules.configurationLoader);
    });

    afterEach(function afterEach() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Case 1: The configuration is completely correct', function case1() {
        const testConfiguration = {
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

        const configuration = configurationLoaderModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.Object();
    });

    it('Case 2: The configuration is completely correct with server.port=0', function case2() {
        const testConfiguration = {
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

        const configuration = configurationLoaderModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.Object();
    });

    it('Case 3: The configuration is completely correct with server.port=65535', function case3() {
        const testConfiguration = {
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

        const configuration = configurationLoaderModule.loadConfiguration();
        should.exist(configuration);
        configuration.should.be.Object();
    });

    it('Case 4: The configuration cannot be loaded because the file does not exist', function case4() {
        mockery.registerSubstitute(microrestModules.configurationRealFile, '../configurationNotExist.json');

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 5: The configuration is empty', function case5() {
        const testConfiguration = {};

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 6: The configuration does not have the property services', function case6() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 7: The configuration does not have the property server', function case7() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 8: The configuration does not have the property directory', function case8() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 9: The configuration does not have the property logger', function case9() {
        const testConfiguration = {
            services: {
                path: './services/'
            }, server: {
                port: 8443
            }, directory: {
                location: 'https://localhost:8080/microrestjs-directory/v1'
            }
        };

        mockery.registerMock(microrestModules.configurationRealFile, testConfiguration);

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 10: The property services.path is empty', function case10() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 11: The property services.path is not a string', function case11() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 12: The property server.port is lower than 0', function case12() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 13: The property server.port is greater than 65535', function case13() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 14: The property server.port is not an integer', function case14() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 15: The property directory.location is empty', function case15() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 16: The property directory.location is not a string', function case16() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 17: The property logger.enable is not defined', function case17() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 18: The property logger.enable is not a boolean', function case18() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 19: The property logger.level is not defined', function case19() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });

    it('Case 20: The property logger.level is empty', function case20() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.not.throw();
    });

    it('Case 21: The property logger.level is not a string', function case21() {
        const testConfiguration = {
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

        configurationLoaderModule.loadConfiguration.should.throw();
    });
});
