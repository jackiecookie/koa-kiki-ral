const iconv = require('iconv-lite');


module.exports = JsonConverter;

function JsonConverter() {
    if (!(this instanceof JsonConverter)) {
        return new JsonConverter();
    }
}


JsonConverter.prototype.unpack = function (config, data) {
    try {
        var str = iconv.decode(data, config.encoding);
        var obj = JSON.parse(str);
        return obj;
    }
    catch (ex) {
        throw ex;
    }
};

JsonConverter.prototype.pack = function (config, data) {
    data = data || {};
    var buffer;
    try {
        buffer = iconv.encode(JSON.stringify(data), config.encoding);
        if (!config.skipContentLength) {
            config.headers = config.headers || {};
            config.headers['Content-Length'] = buffer.length;
        }
    }
    catch (ex) {
        throw ex;
    }
    return buffer;
};