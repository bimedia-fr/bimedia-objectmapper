node-objectmapper
==================

object mapper for node


Object Mapper Module
-----------------

This module allow to map keys and values from an object to an other. Mapping uses a tranformation rules. 
There are 3 transformation rules types : 
* *identity* : copy the attribute and value to the target object.
* *alias* : rename the attribute in the target object (value is unchanged).
* *complex* : apply tranformation rule provided to change attribute name and value.


### Usage

#### Simple usecase
```javascript
var ObjectMapper = require('bimedia-objectmapper');
var mapper = new ObjectMapper(rules);
var result = mapper.map({key:'value'});
```

#### Streams
```javascript
var ObjectMapper = require('bimedia-objectmapper'), fs = require('fs'), JSONStream = require('JSONStream');
var mapper = new ObjectMapper(rules);
fs.createReadStream('package.json')
  .pipe(JSONStream.parse())
  .pipe(mapper.stream())
  .pipe(process.stdout);
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

