var util = require('util');

function Procotol() {
}


Procotol.prototype.normalizeConfig = Procotol.normalizeConfig = function (context) {
    return context;
};


Procotol.prototype.talk = function (config, callback) {
    return this._request(config, callback);
};

Procotol.prototype.getCategory = function () {
    return 'protocol';
};


Procotol.prototype._request = function (config, callback) {
    throw new Error('Not Implemented');
};


module.exports = Procotol;


