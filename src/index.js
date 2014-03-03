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

// #### Complexe Rule
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
// This example transforme the *state* attribute in source object to an *currentState*
// attribute in target object. the value is changed using the `mapper` function defined by the rule.

// ### API
// #### Contructor.

// Create a new Mapper. `r` is a mapping ruleset.
function RowMapper(r) {
    this.rules = r;
}

// view this mapper as transform Stream.
RowMapper.prototype.stream = function () {
    var mapper = this;
    return through(function streamMapper(obj) {
        if (typeof obj !== 'object') {
            this.emit('error', new Error('data written is not an Object'));
            return;
        }
        this.queue(mapper.map(obj));
    });
};


// #### `map` apply transformations on object

// For each attributes in source object, lookup a matching rule and apply it.

// Parameters :
// * `source` is the source object, which we want to map.
// * `destination` is the result object (optionnel). 

RowMapper.prototype.map = function (source, destination) {
    var self = this;
    var dest = destination || {};
    Object.keys(source).forEach(function (key) {
        if (self.rules[key]) {
            var rule = self.rules[key];
            if (rule.name) { // complex mapping
                dest[rule.name] = rule.mapper ? rule.mapper(source[key]) : source[key];
            } else { //simple mapping
                dest[rule] =  source[key];
            }
        } else { //identity mapping
            dest[key] = source[key];
        }
    });
    return dest;
};

// export module
module.exports = function (rules) {
    return new RowMapper(rules);
};

// ### Usage
// ```javascript
// var ObjectMapper = require('./ObjectMapper');
// var mapper = new ObjectMapper(rules);
// var result = mapper.map({key:'value'});
// ```