const fs = require('fs');
const path = require('path');
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
    let files = self._findFiles();

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


/*
 * find all files from path
 * @dir {string} path dir
 * @return file dir list
 * */
Config.prototype._findFiles = function () {
    let dir = this.configRoot;
    let result = [];
    if (!path.isAbsolute(dir)) {
        dir = path.join(process.cwd(), dir);
    }
    let stat = fs.lstatSync(dir);
    let files = fs.readdirSync(dir);
    files.forEach(function (part) {
        if (path.extname(part) === '.js') {
            result.push(path.join(dir, part));
        }
    });
    return result;
}
