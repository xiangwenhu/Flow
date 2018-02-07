const log4js = require('log4js'),
    log4jsConfig = require('../config/log4js.json')

class Logger {
    constructor(config = log4jsConfig) {
        log4js.configure(config)
        this._logger = log4js.getLogger();
        ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(v => {
            this[v] = function (...args) {
                const logStr = args.map(v => JSON.stringify(v)).join(',')
                this._logger[v](logStr)
            }
        })
    }   
}

const logger = new Logger()

module.exports = logger