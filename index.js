const config = require('./lib/config');
const util = require('./lib/util');
const protocol = require('./lib/protocol/httpProtocol')();


module.exports = Ral;

function Ral(option) {
    let self = this;
    try {
        self.config = new config(config);
    }
    catch (err) {
        throw err;
    }
}

Ral.prototype.request = async function (serviceName, option) {
    let self = this;
    let defaultConfig = self.config.cache[serviceName];
    let opt = util.merge(defaultConfig, option);
    let Response = await protocol._request(opt);
    return Response;
}


Ral.prototype.middleware = async function (ctx, next) {
    ctx.ral = this;
    await next;
}