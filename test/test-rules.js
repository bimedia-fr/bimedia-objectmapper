/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var vows = require('vows'),
    assert = require('assert'),
    ObjectMapper = require('../src/index'),
    commonsRules = require('../src/rules');

var rules = {
    'current-state' : commonsRules.keys.camelCase
};

var sampleRow = {
    "current-state": "O"
};

vows.describe('camelCase rule').addBatch({
    'an `objectMapper`' : {
        topic: function () {
            return new ObjectMapper(rules);
        },
        'return a ObjectMapper': function (mapper) {
            assert.ok(mapper);
        },
        'when mapping values': {
            topic: function (mapper) {
                return mapper.map(sampleRow);
            },
            'returns an mapped object with an attribute in *camel Case* ' : function (res) {
                assert.ok(res.currentState);
                assert.equal(res.currentState, 'O');
            }
        }
    }
}).addBatch({
    'the `camelCase` rule' : {
        topic: function () {
            return commonsRules.keys.camelCase('current-state', 'O');
        },
        'return an object with a `key` attribute and a `value` attribute': function (res) {
            assert.ok(res);
            assert.ok(res.key);
            assert.ok(res.value);
        },
        'returns an mapped object with an attribute in *camel Case* ' : function (res) {
            assert.equal(res.key, 'currentState');
            assert.equal(res.value, 'O');
        }
    }
}).exportTo(module);
