const SequenceActivity = require('../activity/SequenceActivity'),
    AssertActivity = require('../activity/AssertActivity'),
    ActivityError = require('../error/ActivityError'),
    ActivityStatus = require('../const/ActivityStatus')


class AssertSequenceActivity extends SequenceActivity {
    constructor(context) {
        super(context)
        this.type = 'assertsequence'
        this.assert = null
    }

    getChildren(){
        return this.children.slice(1)
    }

    executeAssert(...args) {
        return this.assert.execute(...args)
    }

    build(condition, children) {
        if (condition && Array.isArray(children)) {
            this.set(condition, children)
        }
        this.beforeBuild()
        this.fn = (...args) => {
            const f = this.children[0]
            return f.type === 'assert' && f.status === ActivityStatus.EXECUTED ?
                this.buildChildren(this.children.slice(1))(...args) : this.buildChildren(this.children)(...args)

        }
        return this.fn
    }

    set(condition, children) {
        const assert = new AssertActivity()
        assert.build(condition)
        assert.name = this.name
        this.assert = assert        
        this.children = [assert, ...children]
    }
}

module.exports = AssertSequenceActivity