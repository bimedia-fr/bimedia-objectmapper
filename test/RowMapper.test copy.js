const assert = require('assert'),
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

describe('Object mapper', () => {
    it('returns an mapped object with *simple* attribute mapping  ', () => {
        let mapper = new ObjectMapper(rules);
        let res = mapper.map(sampleRow);
        assert.ok(res.value);
        assert.equal(res.value, '10.00000000');
    });
    it('returns an mapped object with *identity* attribute mapping ', () => {
        let mapper = new ObjectMapper(rules);
        let res = mapper.map(sampleRow);
        assert.ok(res.procod);
        assert.equal(res.procod, 'ORASL10');
    })
    it('returns an mapped object with *complex* attribute mapping', () => {
        let mapper = new ObjectMapper(rules);
        let res = mapper.map(sampleRow);
        assert.ok(res.currentState);
        assert.equal(res.currentState, 'REFUNDED');
    });

    describe('mapping with `Array.map`', () => {
        it('should return a mapped array', () => {
            let mapper = new ObjectMapper(rules);
            let tab = [{state : 'value2'}, {state : 'value2'}, {state : 'O'}].map(mapper.map)
            assert.equal(tab[0].currentState, 'PENDING');
            assert.equal(tab[1].currentState, 'PENDING');
            assert.equal(tab[2].currentState, 'REFUNDED');
        });
    });
    describe('attribute mapping', () => {
        it('returns an mapped object with *simple* attribute mapping', () => {
            let mapper = new ObjectMapper(rules);
            let res = mapper.map(sampleRow);
            assert.ok(res.value);
            assert.equal(res.value, '10.00000000');
        });
        it('returns an mapped object with *identity* attribute mapping', () => {
            let mapper = new ObjectMapper(rules);
            let res = mapper.map(sampleRow);
            assert.ok(res.procod);
            assert.equal(res.procod, 'ORASL10');
        });
        it('returns an mapped object with *complex* attribute mapping', () => {
            let mapper = new ObjectMapper(rules);
            let res = mapper.map(sampleRow);
            assert.ok(res.currentState);
            assert.equal(res.currentState, 'REFUNDED');
        });
    });
    describe('mapping falsy input value', () => {
        it('returns *undefined* when mapping undefined object', () => {
            let mapper = new ObjectMapper(rules);
            let res = mapper.map(undefined);
            assert.ok(res === undefined);
        });
        it('returns *null* when mapping null object', () => {
            let mapper = new ObjectMapper(rules);
            let res = mapper.map(null);
            assert.ok(res === null);
        });
    });
});
