const fs = require('fs');
const path = require('path');


function merge(source, target) {
    if (isObject(source) && isObject(target)) {
        for (let key in target) {
            let value = target[key];
            source[key] = merge(source[key], value);
        }
    }
    else {
        source = target;
    }
    return source;
};

function clone(source) {
    if (!isObject(source))return source;
    let result = {};
    for (let key in source) {
        result[key] = source[key];
    }
    return result;
};

function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};


/*
 * find all files from path
 * @dir {string} path dir
 * @return file dir list
 * */
function readdirSync(dir) {
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

module.exports.merge = merge;
module.exports.clone = clone;
module.exports.isObject = isObject;
module.exports.readdirSync = readdirSync;