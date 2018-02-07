const Activity = require('./Activity'),
    ActivityError = require('../error/ActivityError')

class TerminateActivity extends Activity {
    constructor(context) {
        super(context)
        this.type = 'terminate'
        this.message = '终止流程'
    }

    build(message) {
        this.message = message || this.message
        this.fn = () => Promise.reject(new ActivityError(this.message, this.type, this.name, true))
        return this.fn
    }
}

module.exports = TerminateActivity