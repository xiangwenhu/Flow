const AssertSequenceActivity = require('../AssertSequenceActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)
    
    let children = null
    const activity = new AssertSequenceActivity(act.context)
    if (Array.isArray(act.children)) {
        children = factory.getAll(act.children)
    }
    activity.name = act.name || activity.name
    activity.set(act.assert, children)
    return activity
}