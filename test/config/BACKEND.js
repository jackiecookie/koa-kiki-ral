module.exports.TEST_SERVER = {
    protocol: 'http',
    pack: 'form',
    unpack: 'string',
    method: 'POST',
    encoding: 'uft-8',
    timeout: 5000,
    retry: 0,
    path: '/',
    server: [{
        host: '127.0.0.1',
        port: 9032
    }]
};