/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

// Commons rules Module
// -----------------

// This module exports commons mapping rules.

// export module
module.exports = {
    'identity' : function (oldkey, oldvalue) {
        return {key: oldkey, value : oldvalue};
    }
};
