/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var vows = require('vows'),
    assert = require('assert'),
    ObjectMapper = require('../src');

var rules = {
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
            return new ObjectMapper(rules, {defaults: false});
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
            'undefined key is filtered ' : function (res) {
                assert.ok(!res.procod);
            },
            'returns an mapped object with *complex* attribute mapping ' : function (res) {
                assert.ok(res.currentState);
                assert.equal(res.currentState, 'REFUNDED');
            }
        }
    }
}).exportTo(module);
