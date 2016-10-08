const assert = require('assert');
const config = require('../../lib/config');
const Ral = require('../../index');
const http = require('http');
const url = require('url');
const urlencode = require('urlencode');

describe('httpProtocol', function () {

    before(function () {
        let self = this;
        let rightPath = 'test/config/';
        self.Ral = new Ral({
            configRoot: rightPath
        })
        //create server to listening reauest
        http.createServer(function (request, response) {
            let info = url.parse(request.url);
            info.query = urlencode.parse(info.query);
            let responseData = 'hear you'
            if (info.query.returnStr) {
                responseData = info.query.returnStr;
            } else {

            }
            response.write(JSON.stringify({data: responseData}));
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

    it('#request(config,data)', function (done) {
        let self = this;
        let service = 'TEST_SERVER';
        let returnStr = 'hear you Mr.data'
        self.Ral.request(service, {
            query: {
                returnStr: returnStr
            }
        }).then(function (data) {
            assert.equal(data.data, returnStr);
            done();
        }).catch(function (error) {
            done(error);
        });
    })
});