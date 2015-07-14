'use strict';

/**
 * Regular Expressions to check properties of Microrestjs Services.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @module
 */

var VERSION_PATTERN = '^\\d+\\.\\d+\\.\\d+$';
var FULL_DATE_PATTERN = '^\\d\\d\\d\\d-\\d\\d-\\d\\d$';
var URL_PATTERN = '^https?:\\/\\/([^/\\n\\r\\s]+\\.[^/\\n\\r\\s]+)(\\/([^\\?#\\n\\r\\s]+)?(\\?([^\\?#\\/\\n\\r\\s]+))?(#([^\\?#\\/\\n\\r\\s]+))?)*$';
var URL_PATH_PATTERN = '^\\/$|^(\\/:?[a-zA-Z0-9_]+)+$';
var EMAIL_PATTERN = "^[a-zA-Z0-9]+(?:(\\.|_)[A-Za-z0-9!#$%&\\'*+\/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$";
var DIRECTORY_PROTOCOL_PATTERN = '^directory:\\/\\/([^/\\n\\r\\s]+\\.[^/\\n\\r\\s]+)(\\/([^\\?#\\n\\r\\s]+)?(\\?([^\\?#\\/\\n\\r\\s]+))?(#([^\\?#\\/\\n\\r\\s]+))?)*$';
var DIRECTORY_PATTERN = '^directory$' + '|' + DIRECTORY_PROTOCOL_PATTERN + '|' + URL_PATTERN;
var HTTP_METHOD_PATTERN = '^GET$|^HEAD$|^POST$|^PUT$|^DELETE$|^PATCH$';
var IN_URL_PARAMETER = '^query$|^path$';
var TYPE_URL_PARAMETER = '^string$|^integer$|^number$|^boolean^$';

/**
 * Regular Expressions to check:
 *   - The version of the services
 *   - Dates
 *   - URLs
 *   - URL Paths
 *   - Emails
 *   - Directories expressions
 *   - HTTP Methods
 *   - URL Parameters
 *
 * @public
 * @static
 * @readonly
 * @constant {Object}
 */
module.exports = {
    version: VERSION_PATTERN,
    fullDate: FULL_DATE_PATTERN,
    url: URL_PATTERN,
    urlPath: URL_PATH_PATTERN,
    email: EMAIL_PATTERN,
    directory: DIRECTORY_PATTERN,
    httpMethod: HTTP_METHOD_PATTERN,
    inUrlParameter: IN_URL_PARAMETER,
    typeUrlParameter: TYPE_URL_PARAMETER
};
