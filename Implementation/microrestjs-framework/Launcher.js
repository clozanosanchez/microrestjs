'use strict';

/**
 * @file Launches the Microrestjs Framework.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 */

var microrest = require('./lib/Microrest').getInstance();

process.on('SIGINT', function _gracefulShutdown() {
    microrest.shutdown();
    microrest = null;
    process.exit(0);
});

process.on('SIGTERM', function _gracefulShutdown() {
    microrest.shutdown();
    microrest = null;
    process.exit(0);
});

microrest.run();
