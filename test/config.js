const assert = require('assert');
const config = require('../lib/config');
var should = require('should');

describe('config', function () {
    it('#ctor()', function () {
        (function () {
            new config();
        }).should.throw(/config and configRoot is required/);
    })

    it('#ctor(rightPath)', function () {
        (function () {
            let rightPath = 'test/config/';
            new config({
                configRoot:rightPath
            });
        }).should.not.throw();
    })


    it('#regist()', function () {
        let rightPath = 'test/config/';
        new config({
            configRoot:rightPath
        }).regist();
    })
})
