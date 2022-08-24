/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var commonsRules = require('./rules');
var ObjectMapper = require('./ObjectMapper');

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
module.exports = ObjectMapper;

Object.keys(commonsRules).forEach(function (k) {
    module.exports[k] = commonsRules[k];
});


// ### Usage
// ```javascript
// var objectMapper = require('bimedia-objectmapper');
// var mapper = objectMapper(rules);
// var result = mapper.map({key:'value'});
// ```
