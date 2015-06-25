'use strict';

/**
 * @file Launches the Microrestjs Framework.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 */

/**
 * Launches the Microrestjs Framework.
 *
 * @private
 */
function _main() {
    var microrest = require('./lib/Microrest').getInstance();

    microrest.run();
}

_main();
