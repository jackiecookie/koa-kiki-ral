const http = require('http');
const Stream = require('stream').Stream;
const util = require('util');
const zlib = require('zlib');
const urlencode = require('urlencode');
const url = require('url');
const urlParse = url.parse;
const protocol = require('../Base/protocol');


function HttpProtocol() {
    if (!(this instanceof HttpProtocol)) {
        return new HttpProtocol();
    }
}


HttpProtocol.prototype.request = function (config) {
    if (!config)throw new Error('config is required');
    let self = this;
    return new Promise(function (resolve, reject) {
        self._request(config, function (res) {
            res.on('error', function (err) {
                reject(err);
            })
            res.on('end', function (data) {
                resolve(data);
            });
        })
    });
};


HttpProtocol.prototype._request = function (config, callback) {
    let response = new ResponseStream();
    let piped = false;
    let opt;

    if (!config.requestPrepared) {
        opt = this._prepareRequest(config);
    } else {
        opt = config.requestOpt;
    }

    let request;

    if (config.https) {
        request = require('https');
    } else {
        request = require('http');
    }
    let req = request.request(opt, (res)=> {
        if (res.statusCode >= 300 && !config.ignoreStatusCode) {
            let statusCodeError = new Error('Server Status Error: ' + res.statusCode);
            statusCodeError.statusCode = res.statusCode;
            req.emit('error', statusCodeError);
        }
        let stream;
        let contentEncoding = res.headers['content-encoding'];
        if (contentEncoding === 'gzip') {
            stream = zlib.createGunzip();
        } else if (contentEncoding === 'deflate') {
            stream = zlib.createInflate();
        }
        if (stream) {
            stream.on('error', function (error) {
                response.emit('error', error);
            });
            res.pipe(stream);
        } else {
            stream = res;
        }
        stream.pipe(response);
        response.emit('extras', {
            headers: res.headers,
            statusCode: res.statusCode
        });
    });
    callback && callback(response);

    if (config.payload) {
        req.write(config.payload);
        req.end();
    } else {
        // auto end if no pipe
        setImmediate(function () {
            piped || req.end();
        });
    }
    req.on('pipe', function () {
        piped = true;
    });
    req.on('error', function (error) {
        response.emit('error', error);
    });
    return req;
}

HttpProtocol.prototype._prepareRequest = function (config) {
    config.requestPrepared = true;
    let path;

    let query = urlencode.stringify(config.query, {
        charset: config.encoding
    });

    if (query) {
        // didn't handle # situation since backend should not get a hash tag
        if (config.path.indexOf('?') === -1) {
            path = config.path + '?' + query;
        } else {
            path = config.path + '&' + query;
        }
    } else {
        path = config.path;
    }

    if (config.disableGzip) {
        if (config.headers && config.headers['accept-encoding']) {
            config.headers['accept-encoding'] = '';
        }
    }

    // detect if there is empty value in headers
    if (config.headers) {
        let keys = Object.keys(config.headers);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (config.headers[key] === undefined || config.headers[key] === null) {
                config.headers[key] = '';
            }
        }
    }

    if (config.url) {
        let urlparsed = urlParse(config.url);
        if (urlparsed.protocol) {
            config.https = urlparsed.protocol === 'https:';
            config.server = {
                host: urlparsed.hostname,
                port: parseInt(urlparsed.port, 10)
            };
            config.server.port = config.server.port || (config.https ? 443 : 80);
            path = urlparsed.path;
        }
    }

    config.realPath = path;

    let opt = {
        host: config.server.host,
        port: config.server.port,
        path: config.realPath,
        method: config.method,
        headers: config.headers,
        // disable http pool to avoid connect problem https://github.com/mikeal/request/issues/465
        agent: false
    };

    if (config.https) {
        opt.key = config.key;
        opt.cert = config.cert;
        opt.protocol = 'https:';
        opt.rejectUnauthorized = config.rejectUnauthorized;
    } else {
        opt.protocol = 'http:';
    }


    config.requestOpt = opt;
    return opt;
}


HttpProtocol.prototype.normalizeConfig = function (config) {
    if (config.disableGzip === undefined) {
        config.disableGzip = true;
    }
    if (typeof config.query !== 'object') {
        config.query = urlencode.parse(config.query, {
            charset: config.encoding
        });
    }
    if (config.path) {
        // auto replace spaces in path
        config.path = config.path.replace(/ /g, '%20');
        if (config.path[0] !== '/') {
            config.path = '/' + config.path;
        }
    }
    // support idc proxy
    if (config.proxy && config.proxy instanceof Array) {
        var defaultProxy = null;
        var idcProxyFounded = false;
        for (var i = 0; i < config.proxy.length; i++) {
            var proxy = config.proxy[i];
            if (proxy.idc === 'default') {
                defaultProxy = proxy.uri;
            }
            if (proxy.idc === ctx.currentIDC) {
                idcProxyFounded = true;
                config.proxy = proxy.uri;
                break;
            }
        }
        if (defaultProxy && !idcProxyFounded) {
            config.proxy = defaultProxy;
        }
        if (!defaultProxy && !idcProxyFounded && config.proxy[0]) {
            config.proxy = config.proxy[0].uri;
        }
    }
    return config;
};

HttpProtocol.prototype.getName=function () {
    return 'http';
}



function ResponseStream() {
    this.writable = true;
    this.data = null;
    this.chunks = [];
}

util.inherits(ResponseStream, Stream);

ResponseStream.prototype.write = function (chunk) {
    // store the data
    this.chunks.push(chunk);
};

ResponseStream.prototype.end = function () {
    let data = null;
    try {
        data = Buffer.concat(this.chunks);
        this.chunks = [];
    } catch (ex) {
        this.emit('error', ex);
        return;
    }
    // emit data at once
    this.emit('data', data);
    this.emit('end', data);
};

util.inherits(HttpProtocol, protocol);
module.exports = HttpProtocol;
