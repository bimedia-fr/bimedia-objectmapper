/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var vows = require('vows'),
    assert = require('assert'),
    ObjectMapper = require('../src');

var rules = {
    'state' : {
        name : 'currentState',
        mapper : function (val) {
            if (val == 'O') {
                return 'REFUNDED';
            }
            return val == 'N' ? 'REFUSED' : 'PENDING';
        }
    },
    'trxpvptpv' :  'value'
};

var rules2 = {
    'state' : function (name, val) {
        var value;
        if (val == 'O') {
            value = 'REFUNDED';
        } else {
            value = val == 'N' ? 'REFUSED' : 'PENDING';
        }
        return {key: 'currentState', value : value};
    },
    'trxpvptpv' :  'value'
};

var sampleRow = {
    "state": "O",
    "caserie": "2440020831633231",
    "trxfpet": "2010-12-31T14:41:31.515Z",
    "procod": "ORASL10",
    "trxpvptpv": "10.00000000"
};

vows.describe('Object mapper').addBatch({
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
            'returns an mapped object with *simple* attribute mapping ' : function (res) {
                assert.ok(res.value);
                assert.equal(res.value, '10.00000000');
            },
            'returns an mapped object with *identity* attribute mapping ' : function (res) {
                assert.ok(res.procod);
                assert.equal(res.procod, 'ORASL10');
            },
            'returns an mapped object with *complex* attribute mapping ' : function (res) {
                assert.ok(res.currentState);
                assert.equal(res.currentState, 'REFUNDED');
            }
        },
        'when mapping arrays with `Array.map`': {
            topic: function (mapper) {
                return [{state : 'value2'}, {state : 'value2'}, {state : 'O'}].map(mapper.map);
            },
            'returns an mapped array ' : function (tab) {
                assert.equal(tab[0].currentState, 'PENDING');
                assert.equal(tab[1].currentState, 'PENDING');
                assert.equal(tab[2].currentState, 'REFUNDED');
            }
        }
    }
}).addBatch({
    'an `objectMapper`' : {
        topic: function () {
            return new ObjectMapper(rules2);
        },
        'return a ObjectMapper': function (mapper) {
            assert.ok(mapper);
        },
        'when mapping values': {
            topic: function (mapper) {
                return mapper.map(sampleRow);
            },
            'returns an mapped object with *simple* attribute mapping ' : function (res) {
                assert.ok(res.value);
                assert.equal(res.value, '10.00000000');
            },
            'returns an mapped object with *identity* attribute mapping ' : function (res) {
                assert.ok(res.procod);
                assert.equal(res.procod, 'ORASL10');
            },
            'returns an mapped object with *complex* attribute mapping ' : function (res) {
                assert.ok(res.currentState);
                assert.equal(res.currentState, 'REFUNDED');
            }
        },
        'when mapping undefined object': {
            topic: function (mapper) {
                return {result : mapper.map(undefined)};
            },
            'returns *undefined* ' : function (res) {
                assert.isUndefined(res.result);
            }
        },
        'when mapping null object': {
            topic: function (mapper) {
                return {result : mapper.map(null)};
            },
            'returns *null* ' : function (res) {
                assert.isNull(res.result);
            }
        },
        'when mapping arrays with `Array.map` with *ObjectMapper.map*': {
            topic: function (mapper) {
                return [{state : 'value2'}, {state : 'value2'}, {state : 'O'}].map(mapper.map);
            },
            'returns an mapped array ' : function (tab) {
                assert.equal(tab[0].currentState, 'PENDING');
                assert.equal(tab[1].currentState, 'PENDING');
                assert.equal(tab[2].currentState, 'REFUNDED');
            }
        },
        'when mapping arrays with `Array.map` whith *ObjectMapper*': {
            topic: function (mapper) {
                return [{state : 'value2'}, {state : 'value2'}, {state : 'O'}].map(mapper);
            },
            'returns an mapped array ' : function (tab) {
                assert.equal(tab[0].currentState, 'PENDING');
                assert.equal(tab[1].currentState, 'PENDING');
                assert.equal(tab[2].currentState, 'REFUNDED');
            }
        },
        'when mapping arrays with `Array.map` whith *ObjectMapper* and then mapping': {
            topic: function (mapper) {
                return [{state : 'value2'}, {state : 'value2'}, {state : 'O'}].map(mapper).map(function (item) {
                    return item.currentState;
                });
            },
            'returns an mapped array ' : function (tab) {
                assert.equal(tab[0], 'PENDING');
                assert.equal(tab[1], 'PENDING');
                assert.equal(tab[2], 'REFUNDED');
            }
        }
    }
}).exportTo(module);
