const converter = require('../Base/converter');
const FormConverter = require('./formConverter.js');
const util = require('util');
const ralUtil = require('../util');

function QuertStringConverter() {}

QuertStringConverter.prototype.unpack = FormConverter.prototype.unpack;

QuertStringConverter.prototype.pack = function (config, data) {
    data = data || {};
    config.query = config.query || {};
    ralUtil.merge(config.query, data);
    return null;
};

QuertStringConverter.prototype.getName = function () {
    return 'querystring';
};
util.inherits(QuertStringConverter, converter);
module.exports = QuertStringConverter;