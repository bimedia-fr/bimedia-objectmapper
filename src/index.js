/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var through = require('through');

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

// export module
module.exports = function (ruleset) {

    function isFunc(obj) {
        return typeof obj == 'function' || false;
    }

    var rules = ruleset;
    // #### `mapTo` apply transformations on object

    // For each attributes in source object, lookup a matching rule and apply it.

    // Parameters :
    // * `source` is the source object, which we want to map.
    // * `destination` is the result object (optionnal). 

    var _mapTo = function (source, destination) {
        var dest = destination || {};
        Object.keys(source).forEach(function (key) {
            if (rules[key]) {
                var rule = rules[key];
                if (rule.name) { // complex mapping
                    dest[rule.name] = rule.mapper ? rule.mapper(source[key]) : source[key];
                } else if (isFunc(rule)) {
                    var res = rule(key, source[key]);
                    dest[res.key] = res.value;
                } else { //simple mapping
                    dest[rule] =  source[key];
                }
            } else { //identity mapping
                dest[key] = source[key];
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
    var _stream = function () {
        return through(function streamMapper(obj) {
            if (typeof obj !== 'object') {
                this.emit('error', new Error('data written is not an Object'));
                return;
            }
            this.queue(_map(obj));
        });
    };

    return {
        rules : {},
        stream : _stream,
        map: _map,
        mapTo : _mapTo
    };
};

// ### Usage
// ```javascript
// var objectMapper = require('bimedia-objectmapper');
// var mapper = objectMapper(rules);
// var result = mapper.map({key:'value'});
// ```
