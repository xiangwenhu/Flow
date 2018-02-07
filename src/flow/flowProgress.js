const {
    isFunction
} = require('../utils/typeChecker')

const getChildren = function getChildren(activity) {
    if (isFunction(activity.getChildren)) {
        return activity.getChildren()
    }
    if (Array.isArray(activity.children)) {
        return activity.children
    }
    return null
}

const getActivity = function getActivity(activity) {
    if (!activity) {
        return null
    }
    const act = {
        type: activity.type,
        name: activity.name,
        status: activity.status,
        id: activity._id,
        children: getActivities(getChildren(activity))
    }
    /*
    if (act.children) {
        // 遍历无限递归引用      
        const clonedParent = {...act}
        delete clonedParent.children
        act.children.map(_activity => _activity.parent = clonedParent) 
    }  */
    return act
}

const getActivities = function getActivities(children) {
    if (!Array.isArray(children)) {
        return null
    }
    const list = children.map(activity => ({
        type: activity.type,
        name: activity.name,
        status: activity.status,
        id: activity._id,
        children: getActivities(getChildren(activity))
    }))

    return list
}

const getProgress = function getProgress(activity) {
    return Array.isArray(activity) ? getActivities(activity) : getActivity(activity)
}




module.exports = {
    getProgress
}