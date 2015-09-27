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

var NAME_PATTERN = '^[a-zA-Z0-9]+([_-]*[a-zA-Z0-9])*$';
var VERSION_PATTERN = '^\\d+\\.\\d+\\.\\d+$';
var FULL_DATE_PATTERN = '^\\d\\d\\d\\d-\\d\\d-\\d\\d$';
var GENERAL_URL_PATTERN_NO_PROTOCOL = '([^/\\n\\r\\s]+)(\\/([^\\?#\\n\\r\\s]+)?(\\?([^\\?#\\/\\n\\r\\s]+))?(#([^\\?#\\/\\n\\r\\s]+))?)*$';
var HTTP_URL_PATTERN = '^https?:\\/\\/' + GENERAL_URL_PATTERN_NO_PROTOCOL;
var ONLY_HTTPS_URL_PATTERN = '^https:\\/\\/' + GENERAL_URL_PATTERN_NO_PROTOCOL;
var MICROREST_URL_PATH_PATTERN = '^(\\/:?[a-zA-Z0-9_]+)+$';
var EMAIL_PATTERN = "^[a-zA-Z0-9]+(?:(\\.|_)[A-Za-z0-9!#$%&\\'*+\/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.[a-zA-Z0-9]*\\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$";
var DIRECTORY_URL_PATTERN = '^directory:\\/\\/' + GENERAL_URL_PATTERN_NO_PROTOCOL;
var DIRECTORY_PATTERN = '^directory$' + '|' + DIRECTORY_URL_PATTERN + '|' + ONLY_HTTPS_URL_PATTERN;
var HTTP_METHOD_PATTERN = '^GET$|^HEAD$|^POST$|^PUT$|^DELETE$|^PATCH$';
var IN_URL_PARAMETER = '^query$|^path$';
var TYPE_URL_PARAMETER = '^string$|^integer$|^number$|^boolean^$';
var SECURITY_SCHEME_PATTERN = '^none$|^basic$';

/**
 * Regular Expressions to check:
 *   - The name of the services
 *   - The version of the services
 *   - Dates
 *   - URLs
 *   - URL Paths
 *   - Emails
 *   - Directories expressions
 *   - HTTP Methods
 *   - URL Parameters
 *   - Security Scheme
 *
 * @public
 * @static
 * @readonly
 * @constant {Object}
 */
module.exports = {
    name: NAME_PATTERN,
    version: VERSION_PATTERN,
    fullDate: FULL_DATE_PATTERN,
    httpUrl: HTTP_URL_PATTERN,
    urlPath: MICROREST_URL_PATH_PATTERN,
    email: EMAIL_PATTERN,
    directory: DIRECTORY_PATTERN,
    httpMethod: HTTP_METHOD_PATTERN,
    inUrlParameter: IN_URL_PARAMETER,
    typeUrlParameter: TYPE_URL_PARAMETER,
    securityScheme: SECURITY_SCHEME_PATTERN
};
