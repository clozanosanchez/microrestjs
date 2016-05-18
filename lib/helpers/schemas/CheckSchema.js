'use strict';

/**
 * Checks whether JSON objects respect JSON schemata.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015-2016 Carlos Lozano Sánchez
 *
 * @see {@link http:// json-schema.org/} for further information about JSON schemata.
 *
 * @module
 */

const checkTypes = require('check-types');
const Ajv = require('ajv');
const deref = require('json-schema-deref-local');

const SchemaError = require('../../errors/SchemaError');

/**
 * Checks whether the object respects the schema.
 *
 * @public
 * @static
 * @function
 * @param {Object} schema - Schema that must be respected.
 * @param {Object} object - Object that will be checked.
 * @returns {Boolean} - true if the object respects the schema.
 * @throws a TypeError if the schema parameter is not a valid Schema object.
 * @throws a TypeError if the object parameter is not a valid object.
 * @throws a SchemaError if the object does not respect the schema.
 */
module.exports.check = function check(schema, object) {
    if (checkTypes.not.object(schema) || checkTypes.emptyObject(schema)) {
        throw new TypeError('The parameter schema must be a valid schema object');
    }

    if (checkTypes.not.object(object) || checkTypes.emptyObject(object)) {
        throw new TypeError('The parameter object must be a valid object');
    }

    const fullSchema = deref(schema);

    const ajvOptions = {
        format: 'full'
    };
    const ajv = new Ajv(ajvOptions);
    const regExpr = require('./MicrorestRegExpr');
    ajv.addFormat('name', regExpr.name);
    ajv.addFormat('version', regExpr.version);
    ajv.addFormat('full-date', regExpr.fullDate);
    ajv.addFormat('http-url', regExpr.httpUrl);
    ajv.addFormat('email', regExpr.email);
    ajv.addFormat('directory', regExpr.directory);
    ajv.addFormat('url-path', regExpr.urlPath);
    ajv.addFormat('http-method', regExpr.httpMethod);
    ajv.addFormat('url-parameter', regExpr.urlParameter);
    ajv.addFormat('type-url-parameter', regExpr.typeUrlParameter);
    ajv.addFormat('security-scheme', regExpr.securityScheme);

    const valid = ajv.validate(fullSchema, object);
    if (valid === false) {
        throw new SchemaError(ajv.errorsText());
    }

    return valid;
};
