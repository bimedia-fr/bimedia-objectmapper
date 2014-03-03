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

var sampleRow = {
    "state": "O",
    "caserie": "2440020831633231",
    "trxfpet": "2010-12-31T14:41:31.515Z",
    "procod": "ORASL10",
    "trxpvptpv": "10.00000000"
};

vows.describe('Object mapper').addBatch({
    'a new `ObjectMapper`' : {
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
        }
    }
}).export(module);