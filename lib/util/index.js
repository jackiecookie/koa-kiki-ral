
const _ = require('underscore');

module.exports.merge = function (source, target) {
    if (_.isObject(source) && _.isObject(target)) {
        _.map(target, function (value, key) {
            source[key] = util.merge(source[key], value);
        });
    }
    else {
        source = target;
    }
    return source;
};