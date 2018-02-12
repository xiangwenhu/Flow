const Activity = require('./Activity'),
    FunctionFactory = require('../factory/FunctionFactory')

class CatchActivity extends Activity {
    constructor(context) {
        super(context)
        this.type = 'catch'
        this.ignore = false
        this.code = null
        this.message = '未定义错误消息'
    }

    build(message, code = '', ignore = false) {
        this.message = message
        this.code = code
        this.ignore = ignore

        this.fn = FunctionFactory.getPromiseFunction(this.ctxName, this.resName, this.globalName, this.code)
        return this.fn
    }
}

module.exports = CatchActivity