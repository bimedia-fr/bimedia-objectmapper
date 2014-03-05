bimedia-objectmapper
==================

object mapper for node


Object Mapper Module
-----------------

This module allow to map keys and values from an object to an other. Mapping uses a tranformation rules. 
There are 3 transformation rules types : 
* *identity* : copy the attribute and value to the target object.
* *alias* : rename the attribute in the target object (value is unchanged).
* *complex* : apply tranformation rule provided to change attribute name and value.

### Installation

`npm install --save bimedia-objectmapper`


### Usage

#### Simple usecase
```javascript
var ObjectMapper = require('bimedia-objectmapper');
var mapper = objectMapper({'key':'clé'});
var result = mapper.map({key:'value'});
// {'clé': 'value'}
```

#### Streams
```javascript
var objectMapper = require('bimedia-objectmapper'), 
  fs = require('fs'), 
  JSONStream = require('JSONStream');
  
var mapper = objectMapper(rules);
fs.createReadStream('package.json')
  .pipe(JSONStream.parse())
  .pipe(mapper.stream())
  .pipe(process.stdout);
```

#### Arrays
```javascript
var objectMapper = require('bimedia-objectmapper');
var mapper = objectMapper({'key':'clé'});
var sources = [{key:'value1'}, {key:'value2'}, {key:'value3'}];
var result = sources.map(mapper.map);
//[ { 'clé': 'value1' },
//  { 'clé': 'value2' },
//  { 'clé': 'value3' } ]
```

### Mapping rules définitions

#### Identity Rule
//
No specific rule is needed. Attribute is copied to target object.

#### Simple Rule (alias) 
//
Declare a constant as attribute value. Example :
```javascript
var rules = {
    "trxpvptpv": "trxid"
};
```
This rule renames *trxpvptpv* attribute in source object, to *trxid*
in target object. 

#### Complexe Rule
//
Define an object matching the source attribute. 
Example :
```javascript
var rules = {
     'state' : {
        name : 'currentState',
        mapper : function (val) {
            if (val == 'Y') {
                return 'REFUNDED';
            }
            return val == 'N' ? 'REFUSED' : 'PENDING';
        }
    }
};
```
This example transforme the *state* attribute in source object to an *currentState*
attribute in target object. the value is changed using the `mapper` function defined by the rule.

