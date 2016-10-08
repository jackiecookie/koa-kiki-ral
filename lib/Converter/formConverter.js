const converter = require('../Base/converter');
const util = require('util');
const urlencode = require('urlencode');

function FormConverter() {}


FormConverter.prototype.unpack = function (config, data) {
    try {
        let object = urlencode.parse(data.toString(), {
            charset: config.encoding
        });
        return object;
    }
    catch (ex) {
        throw ex;
    }
};

FormConverter.prototype.pack = function (config, data) {
    data = data || {};
    let buffer;
    try {
        buffer = urlencode.stringify(data, {
            charset: config.encoding
        });
    }
    catch (e) {
        throw e;
    }
    config.headers = config.headers || {};
    let encoding = config.encoding ? config.encoding : 'utf-8';
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=' + encoding;
    config.headers['Content-Length'] = buffer.length;
    return buffer;
};

FormConverter.prototype.getName = function () {
    return 'form';
};

util.inherits(FormConverter, converter);


module.exports = FormConverter;