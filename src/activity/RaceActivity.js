const SequenceActivity = require('../activity/SequenceActivity'),
    ActivityError = require('../error/ActivityError')

class RaceActivity extends SequenceActivity {
    constructor(context, children) {
        super(context, children)
        this.type = 'all'
    }

    build(children) {
        // 构建子活动
        this.children = children || this.children
        this._adjust()

        // 检查子活动
        if (!SequenceActivity.isActivityList(this.children)) {
            throw new ActivityError('AllActivity的children必须是Activity实例集合', this.type, this.name)
        }

        this.beforeBuild()
        this.fn = (ctx, res, ...otherParams) => Promise.race(this.children.map(act => act.execute(ctx, res, ...otherParams)))

        return this.fn
    }
}

module.exports = RaceActivity