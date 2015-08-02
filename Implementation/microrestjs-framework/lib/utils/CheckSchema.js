'use strict';

/**
 * Checks whether JSON objects respect JSON schemas.
 *
 * @author Carlos Lozano Sánchez
 * @license MIT
 * @copyright 2015 Carlos Lozano Sánchez
 *
 * @see {@link http://json-schema.org/} for further information about JSON schemas.
 *
 * @module
 */

var checkTypes = require('check-types');
var Ajv = require('ajv');
var deref = require('json-schema-deref-local');

var regExpr = require('./MicrorestRegExpr');

/**
 * Checks whether the object respects the schema.
 *
 * @public
 * @static
 * @function
 * @param {Object} schema - Schema that must be respected.
 * @param {Object} object - Object that will be checked.
 * @returns {Boolean} - true if the object respects the schema.
 * @throws an Error if the schema parameter is not valid.
 * @throws an Error if the object parameter is not valid.
 * @throws an Error if the object does not respect the schema.
 */
module.exports.check = function check(schema, object) {
    if (checkTypes.not.assigned(schema) || checkTypes.not.object(schema)) {
        //TODO: Improve the condition.
        throw new Error('The parameter schema must be a non-null object');
    }

    if (checkTypes.not.assigned(object) || checkTypes.not.object(object)) {
        //TODO: Improve the condition.
        throw new Error('The parameter schema must be a non-null object');
    }

    var fullSchema = deref(schema);

    var validatorOptions = {
        format: 'full'
    };
    var validator = new Ajv(validatorOptions);
    validator.addFormat('name', regExpr.name);
    validator.addFormat('version', regExpr.version);
    validator.addFormat('full-date', regExpr.fullDate);
    validator.addFormat('url', regExpr.url);
    validator.addFormat('email', regExpr.email);
    validator.addFormat('directory', regExpr.directory);
    validator.addFormat('url-path', regExpr.urlPath);
    validator.addFormat('http-method', regExpr.httpMethod);
    validator.addFormat('url-parameter', regExpr.urlParameter);
    validator.addFormat('type-url-parameter', regExpr.typeUrlParameter);
    var valid = validator.validate(fullSchema, object);

    if (!valid) {
        throw new Error(validator.errorsText());
    }

    return valid;
};
