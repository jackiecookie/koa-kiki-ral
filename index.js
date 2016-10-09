const config = require('./lib/config');
const util = require('./lib/util');
const path = require('path');
Ral.modules = {};


/*
* todo:1 test index.js.
* todo:2 test converter.
*/

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
    Ral.load('./lib/protocol');
    Ral.load('./lib/Converter');
}

Ral.prototype.request = async function (serviceName, option) {
    option = option || {};
    let self = this;
    let defaultConfig = self.config.getServiceConfig(serviceName);
    let protocol = self.getProtocol(option.protocol || defaultConfig.protocol);
    let pack = self.getConverter(option.pack || defaultConfig.pack);
    protocol.normalizeConfig(defaultConfig);
    protocol.normalizeConfig(option);
    let opt = util.merge(defaultConfig, option);
    opt.payload = pack.pack(opt, opt.data);

    let _data = await protocol.request(opt);
    let unpack = self.getConverter(option.unpack || defaultConfig.unpack);
    return unpack.unpack(opt, _data);
}


Ral.prototype.getProtocol = function (protocolName) {
    return Ral.modules['protocol'][protocolName]
}


Ral.prototype.getConverter = function (converterName) {
    return Ral.modules['converter'][converterName]
}

Ral.prototype.middleware = async function (ctx, next) {
    ctx.ral = this;
    await next();
}


/**
 * load modules from path
 *
 * @param  {string} pathOrModule [description]
 */
Ral.ext = Ral.load = function (pathOrModule) {

    function loadFile(filePath) {
        let ext = path.extname(filePath);
        if (ext === '.js') {
            let ModuleClass = require(filePath);
            if (ModuleClass && typeof ModuleClass === 'function') {
                loadModule(new ModuleClass());
            }
        }
    }

    function loadModule(module) {
        let catagory;
        let name;
        try {
            catagory = module.getCategory();
            name = module.getName();
        }
        catch (e) {
            return;
        }
        Ral.modules[catagory] = Ral.modules[catagory] || {};
        Ral.modules[catagory][name] = module;
    }


    if (pathOrModule.getCategory && pathOrModule.getName) {
        loadModule(pathOrModule);
    }
    else {
        let files = util.readdirSync(pathOrModule);
        files.map(loadFile);
    }

};