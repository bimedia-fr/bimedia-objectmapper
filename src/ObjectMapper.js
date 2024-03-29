/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var Transform = require('stream').Transform;
var commonsRules = require('./rules');

// Object Mapper Module
// -----------------

// This module allow to map keys and values from an object to an other. Mapping uses a tranformation rules.
// There are 3 transformation rules types :
// * *identity* : copy the attribute and value to the target object.
// * *alias* : rename the attribute in the target object (value is unchanged).
// * *complex* : apply tranformation rule provided to change attribute name and value.

// ### Mapping rules définitions

// #### Identity Rule
//
// No specific rule is needed. Attribute is copied to target object.

// #### Simple Rule (alias)
//
// Declare a constant as attribute value. Example :
// ```javascript
// var rules = {
//     "trxpvptpv": "trxid"
// };
// ```
// This rule renames *trxpvptpv* attribute in source object, to *trxid*
// in target object.

// #### Complex Rule
//
// Define an object matching the source attribute.
// Example :
// ```javascript
// var rules = {
//      'state' : {
//         name : 'currentState',
//         mapper : function (val) {
//             if (val == 'Y') {
//                 return 'REFUNDED';
//             }
//             return val == 'N' ? 'REFUSED' : 'PENDING';
//         }
//     }
// };
// ```
// This example transforms the *state* attribute in source object to an *currentState*
// attribute in target object. the value is changed using the `mapper` function defined by the rule.
module.exports = function (ruleset, options) {

    var opts = options || { defaults : true};

    function isFunc(obj) {
        return typeof obj == 'function' || false;
    }

    function mapFunc(func, key, source, dest) {
        var res = func(key, source[key]);
        dest[res.key] = res.value;
    }

    var rules = ruleset || {};
    // #### `mapTo` apply transformations on object

    // For each attributes in source object, lookup a matching rule and apply it.

    // Parameters :
    // * `source` is the source object, which we want to map.
    // * `destination` is the result object (optionnal).

    var _mapTo = function (source, destination) {
        if (!source) {
            return source;
        }
        var dest = destination || {};
        Object.keys(source).forEach(function (key) {
            if (rules[key]) {
                var rule = rules[key];
                if (isFunc(rule)) {
                    mapFunc(rule, key, source, dest);
                } else if (rule.name) { // complex mapping
                    dest[rule.name] = rule.mapper ? rule.mapper(source[key]) : source[key];
                } else { //simple mapping
                    dest[rule] =  source[key];
                }
            } else {
                if (opts.defaults) {
                    mapFunc(isFunc(opts.defaults) ? opts.defaults : commonsRules.identity, key, source, dest);
                }
            }
        });
        return dest;
    };

    // #### `map` apply transformations on object

    // For each attributes in source object, lookup a matching rule and apply it.
    // This methods enables array values mapping with `Array.map`.

    // Parameters :
    // * `source` is the source object, which we want to map.

    var _map = function (source) {
        return _mapTo(source, {});
    };

    // view this mapper as transform Stream.
    var _stream = () => new Transform({
        objectMode: true,
        transform(obj, encoding, next) {
            next(null, _map(obj));
        }
    });

    _map.stream = _stream;
    _map.mapTo = _mapTo;
    _map.map = _map;
    return _map;
};
