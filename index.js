const config = require('./lib/config');
const util = require('./lib/util');
const protocol = require('./lib/protocol/httpProtocol')();
const conver = require('./lib/Converter/jsonConverter')();


module.exports = Ral;

function Ral(option) {
    if (!(this instanceof Ral)) {
        return new Ral(option);
    }
    let self = this;
    try {
        self.config = new config(option);
    }
    catch (err) {
        throw err;
    }
    self.config.regist();
}

Ral.prototype.request = async function (serviceName, option) {
    option = option || {};
    let self = this;
    let defaultConfig = self.config.getServiceConfig(serviceName);
    protocol.normalizeConfig(defaultConfig);
    protocol.normalizeConfig(option);
    let opt = util.merge(defaultConfig, option);
    opt.payload = conver.pack(opt, opt.data);

    let _data = await protocol.request(opt);
    return conver.unpack(opt, _data);
}





Ral.prototype.middleware = async function (ctx, next) {
    ctx.ral = this;
    await next;
}