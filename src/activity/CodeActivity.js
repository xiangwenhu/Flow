const Activity = require('../activity/Activity')

class CodeActivity extends Activity {
    constructor(context, code) {
        super(context)
        this.type = 'code'
        this.code = code
    }

    build(code) {
        this.code = code || this.code
        this.fn = this.buildWithCode(this.code)
        return this.fn
    }
}

module.exports = CodeActivity