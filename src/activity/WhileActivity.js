const SequenceActivity = require('./SequenceActivity'),
    AssertActivity = require('./AssertActivity')

class WhileActivity extends SequenceActivity {
    constructor(context, condition, children) {
        super(context, children)
        this.condition = condition
        this.assert = this.getAssert(condition)
    }

    build(condition, children) {
        this.condition = condition || this.condition
        // 设置断言
        if (condition) {
            this.assert = this.getAssert(this.condition)
        }
        // 构建子活动
        this.children = children || this.children
        // 检查子活动
        if (!SequenceActivity.isActivityList(this.children)) {
            throw new ActivityError('WhileActivity的children必须是Activity实例集合', this.type, this.name)
        }
        const childrenFn = this.buildChildren()
        // 构建执行函数
        this.fn = (...args) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let r
                    while (await this.assert.execute(...args)) {
                        r = await childrenFn(...args)
                    }
                    return resolve(r || true)
                } catch (err) {
                    return reject(err)
                }
            })
        }
        return this.fn
    }

    getAssert(condition) {
        // 创建断言Activity
        const assert = new AssertActivity(undefined, condition)
        assert.build()
        return assert
    }
}

module.exports = WhileActivity