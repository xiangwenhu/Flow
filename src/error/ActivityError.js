const util = require('util'),
    ActivityError = function (message, type, name, terminated) {
        Error.captureStackTrace(this, this.constructor)
        if (typeof message === 'object') {
            this.message = message.message
            this.type = message.type
            this.name = message.name
            this.terminated = message.terminated
        } else {
            // 消息
            this.message = message || 'Error'
            // 类型
            this.type = type
            // 名字
            this.name = name
            // 标记是否期望终止流程
            this.terminated = terminated
        }
    }
util.inherits(ActivityError, Error)
ActivityError.prototype.name = 'ActivityError'
ActivityError.fromError = function (err, options) {
    if (ActivityError.isActivityError(err)) {
        return err
    }
    const er = new ActivityError(options)
    er.stack = err.stack
    return er
}
ActivityError.isActivityError = err => typeof err === 'object' && err instanceof ActivityError



module.exports = ActivityError