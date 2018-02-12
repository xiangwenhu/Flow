const IFElseActivity = require('../IFElseActivity')
module.exports = (factory, props) => act => {
    // 验证和过滤属性
    act = props(act)

    //Activity的构造函数
    const activity = new IFElseActivity(act.context)
    if (act.if) {
        activity.if(act.if.name, act.if.assert, factory.getAll(act.if.children))
    }
    // elseif是数组
    if (Array.isArray(act.elseif)) {
        act.elseif.forEach(at => activity.elseif(at.name, at.assert, factory.getAll(at.children)))
    }
    if (act.else) {
        activity.else(act.else.name, act.if.assert, factory.getAll(act.else.children))
    }
    activity.name = act.name || activity.name
    activity.params()
    return activity
}