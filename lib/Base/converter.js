var util = require('util');

function Converter() {
}


/**
 * pack data to stream
 *
 * @param  {Object} config [description]
 * @param  {Object} data   [description]
 */
Converter.prototype.pack = function (config, data) {
    throw new Error('Not Implemented');
};

/**
 * unpack stream to data
 *
 * @param  {Object} config [description]
 */
Converter.prototype.unpack = function (config) {
    throw new Error('Not Implemented');
};

Converter.prototype.getCategory = function () {
    return 'converter';
};

Converter.prototype.isStreamify = false;

module.exports = Converter;