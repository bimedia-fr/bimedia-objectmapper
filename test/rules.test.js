const assert = require('assert'),
    ObjectMapper = require('../src/index'),
    commonsRules = require('../src/rules');

var rules = {
    'current-state' : commonsRules.keys.camelCase
};

var sampleRow = {
    "current-state": "O"
};


describe('camelCase rule', () => {
    it('should returns an mapped object with an attribute in *camel Case*', () => {
        let mapper = new ObjectMapper(rules);
        let res = mapper.map(sampleRow);
        assert.ok(res.currentState);
        assert.equal(res.currentState, 'O');
    });
    it('return an object with a `key` attribute and a `value` attribute', () => {
        let res = commonsRules.keys.camelCase('current-state', 'O');
        assert.ok(res);
        assert.ok(res.key);
        assert.ok(res.value);

    });
    it('returns an mapped object with a key in *camel Case* ', () => {
        let res = commonsRules.keys.camelCase('current-state', 'O');
        assert.equal(res.key, 'currentState');
        assert.equal(res.value, 'O');
    });
});

describe('snake rule', () => {
    it('should returns an mapped object with an attribute in *snake Case*', () => {
        let mapper = new ObjectMapper({
            'currentState' : commonsRules.keys.snakeCase
        });
        let res = mapper.map({
            currentState: "O"
        });
        assert.ok(res['current-state']);
        assert.equal(res['current-state'], 'O');
    });
    it('return an object with a `key` attribute and a `value` attribute', () => {
        let res = commonsRules.keys.snakeCase('currentState', 'O');
        assert.ok(res);
        assert.ok(res.key);
        assert.ok(res.value);

    });
    it('returns an mapped object with a key in *snake Case* ', () => {
        let res = commonsRules.keys.snakeCase('currentState', 'O');
        assert.equal(res.key, 'current-state');
        assert.equal(res.value, 'O');
    });
});

describe('lower snake rule', () => {
    it('should returns an mapped object with an attribute in *lower snake Case*', () => {
        let mapper = new ObjectMapper({
            'currentState' : commonsRules.keys.lowerSnakeCase
        });
        let res = mapper.map({
            currentState: "O"
        });
        assert.ok(res['current_state']);
        assert.equal(res['current_state'], 'O');
    });
    it('return an object with a `key` attribute and a `value` attribute', () => {
        let res = commonsRules.keys.lowerSnakeCase('currentState', 'O');
        assert.ok(res);
        assert.ok(res.key);
        assert.ok(res.value);

    });
    it('returns an mapped object with a key in *lower snake Case* ', () => {
        let res = commonsRules.keys.lowerSnakeCase('currentState', 'O');
        assert.equal(res.key, 'current_state');
        assert.equal(res.value, 'O');
    });
});


describe('identity rule', () => {
    it('should returns an mapped object', () => {
        let mapper = new ObjectMapper({
            'currentState' : commonsRules.identity
        });
        let res = mapper.map({
            currentState: "O"
        });
        assert.ok(res['currentState']);
        assert.equal(res['currentState'], 'O');
    });
    it('returns an identity object', () => {
        let res = commonsRules.identity('currentState', 'O');
        assert.equal(res.key, 'currentState');
        assert.equal(res.value, 'O');
    });
});
