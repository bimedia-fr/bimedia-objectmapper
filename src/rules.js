/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

// Commons rules Module
// -----------------

// This module exports commons mapping rules.

// export module
module.exports = {
    'keys': {
        'camelCase': function (key, val) {
            var re = /(?:[\-|_| ])(\w)/g;
            var camelized = key.replace(re, function (_, c) {
                return c ? c.toUpperCase() : '';
            });
            return {
                key: camelized,
                value: val
            };
        },
        'lowerSnakeCase': function (key, val) {
            let snakized = key.replace(/([A-Z])/g, ($1) => '_' + $1.toLowerCase());
            return {
                key: snakized,
                value: val
            };
        },
        'snakeCase': function (key, val) {
            let snakized = key.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase());
            return {
                key: snakized,
                value: val
            };
        }
    },
    'identity': function (oldkey, oldvalue) {
        return {
            key: oldkey,
            value: oldvalue
        };
    }
};
