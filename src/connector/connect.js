const Activity = require('../activity/Activity')



const resgiter = emitter => {
    return function con(activity) {
        if (activity.type === 'interact') {
            activity.emitter = emitter
        }

        if (Array.isArray(activity.children)) {
            activity.children.forEach(act => {
                if (act.type === 'interact') {
                    act.emitter = emitter
                }
                con(act)
            })
        }
    }
}



module.exports = function connect(activity, emitter) {
    if (!Activity.isActivity(activity)) {
        throw new Error('参数activity必须是有效的Activity')
    }
    resgiter(emitter)(activity)
}