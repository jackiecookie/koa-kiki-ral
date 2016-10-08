
function merge(source, target) {
    if (isObject(source) && isObject(target)) {
        for (let key in target) {
            let value=target[key];
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

module.exports.merge = merge;
module.exports.clone = clone;
module.exports.isObject = isObject;