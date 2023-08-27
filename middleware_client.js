var { validIp } = require('mybase')

function middleware_client(req, res, next) {
    var headers = req.headers
    let client = {
        ip: false,
        host: false,
    }

    if (!client.ip && headers.hasOwnProperty('x-tha-ip') && validIp(headers['x-tha-ip']))
        client.ip = headers['x-tha-ip']

    if (!client.host && headers.hasOwnProperty('host'))
        client.host = headers['host']

    if (!client.ip && req.clientIp === '::ffff:127.0.0.1') client.ip = '127.0.0.1';
    if (!client.ip) client.ip = req.clientIp

    if (!validIp(client.ip)) client.ip = '0.0.0.0';

    client.useragent = req.useragent

    req.client = client
    res.client = client
    next()
}

module.exports = middleware_client
