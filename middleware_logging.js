const chalk = require('chalk')
// const vars = require('./vars')

function middleware_logging(req, res, next) {
    let { client } = req
    // console.log(client)
    // vars.coadmin_service.report_every(1,'apicall')
    let from = `[${client.ip}]`

    if (req.method === 'GET')
        console.log(chalk.yellow.inverse(`request ${from}`), chalk.blue.inverse('GET'), chalk.green(`${req.originalUrl}`))
    else
        if (req.method === 'POST')
            console.log(chalk.yellow.inverse(`request ${from}`), chalk.blue.inverse('POST'), chalk.green(`${req.originalUrl}`), JSON.stringify(req.body))
    next()
}

module.exports = middleware_logging
