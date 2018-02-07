const Activity = require('../activity/Activity')

class AssertActivity extends Activity {
    constructor(context, code) {
        super(context)
        this.type = 'assert'
        this.code = code
    }

    build(code) {
        this.beforeBuild()
        this.code = code || this.code
        this.fn = this.buildWithCode(this.code)
        return this.fn
    }

    // TODO: 语法检查
    beforeBuild() {
        return true
    }
}

module.exports = AssertActivity