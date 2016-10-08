
const util = require('../util');

module.exports = Config;


function Config(option) {
    if (!option || !option.configRoot) {
        throw new Error('config and configRoot is required');
    }
    let self = this;

    self.configRoot = option.configRoot;
    self.cache = {};
}


Config.prototype.regist = function () {
    let self = this;
    let files = util.readdirSync(self.configRoot);

    if (files.length <= 0)throw new Error('root file did not have any root files');
    files.forEach(function (configPath) {
        let configObj = require(configPath);
        Object.keys(configObj).forEach(function (serviceName) {
            let serviceConfig = configObj[serviceName];
            self.cache[serviceName] = serviceConfig;
        });
    })
}


Config.prototype.getServiceConfig = function (serviceName) {
    let self = this;
    let serviceConfog = self.cache[serviceName];
    return util.clone(serviceConfog)
}


