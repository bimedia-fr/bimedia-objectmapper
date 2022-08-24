const stream = require('stream');
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

var sampleRow = {
    "state": "O",
    "caserie": "2440020831633231",
    "trxfpet": "2010-12-31T14:41:31.515Z",
    "procod": "ORASL10",
    "trxpvptpv": "10.00000000"
};

describe('Object mapper', () => {

    describe('mapping a stream', () => {
        it('should return a mapped stream', () => {
            const readable = new stream.Readable({objectMode: true});
            const input = [{state : 'value2'}, {state : 'value2'}, {state : 'O'}];
            let mapper = new ObjectMapper(rules);
            const writable = new stream.Writable({objectMode: true})
            let result = [];
            writable._write = (object, encoding, done) => {
                result.push(object);
                done()
            }

            stream.pipeline([readable, mapper.stream(), writable], (err) => {
                assert.equal(result[0].currentState, 'PENDING');
                assert.equal(result[1].currentState, 'PENDING');
                assert.equal(result[2].currentState, 'REFUNDED');
            });
            
            input.forEach(item => readable.push(item))
            readable.push(null); 
        });
    });
    
});
