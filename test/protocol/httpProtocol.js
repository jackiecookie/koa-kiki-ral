const assert = require('assert');
const config = require('../../lib/config');
const Ral = require('../../index');
const http = require('http');

describe('httpProtocol', function () {

    before(function () {
        let self = this;
        let rightPath = 'test/config/';
        self.Ral = new Ral({
            configRoot: rightPath
        })
        http.createServer(function (request, response) {
            response.write(JSON.stringify({data: 'hear you'}));
            response.end();
        }).listen(9032);
    })

    it('#request(config)', function (done) {
        let self = this;
        let service = 'TEST_SERVER';
        self.Ral.request(service).then(function (data) {
            assert.equal(data.data, 'hear you');
            done();
        }).catch(function (error) {
            done(error);
        });
    })
});