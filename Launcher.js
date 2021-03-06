'use strict';

/**
 * @file Launches the Microrestjs Framework.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 */

const Microrest = require('./lib/platform/Microrest');

let microrest = new Microrest();

process.on('SIGINT', _gracefulShutdown);
process.on('SIGTERM', _gracefulShutdown);
function _gracefulShutdown() {
    microrest.shutdown();
    microrest = null;
    process.exit(0);
}

microrest.run();
