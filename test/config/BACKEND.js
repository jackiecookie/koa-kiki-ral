module.exports.TEST_SERVER = {
    protocol: 'http',
    pack: 'form',
    unpack: 'string',
    method: 'POST',
    encoding: 'gbk',
    timeout: 5000,
    retry: 0,
    path: '/',
    server: {
        host: '127.0.0.1',
        port: 9032
    }
};


module.exports.TEST_SERVER1 = {
    protocol: 'http',
    pack: 'form',
    unpack: 'string',
    method: 'POST',
    encoding: 'gbk',
    timeout: 5000,
    retry: 0,
    path: '/User/CheckAccount',
    server: {
        host: '10.10.10.135',
        port: 9191
    }
};