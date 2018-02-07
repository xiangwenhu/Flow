const Activity = require('./Activity')

class BreakActivity extends Activity {
    constructor(context) {
        super(context)
        this.type = 'break'
        this.message = '跳出当前流程'
    }

    build(message) {
        this.message = message || this.message
        this.fn = (ctx, res) => Promise.resolve(res)
        return this.fn
    }
}

module.exports = BreakActivity