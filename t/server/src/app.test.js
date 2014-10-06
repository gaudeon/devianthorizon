"use strict";

var proxyquire = require('proxyquire'),
    modelsStub = {},
    app        = proxyquire('../../../server/src/app.js', {
                    '../db/models' : modelsStub
    });

// TODO: app.js tests go here
