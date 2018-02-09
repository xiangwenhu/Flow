const AllActivity = require('../activity/AllActivity'),
    BreakActivity = require('../activity/BreakActivity'),
    CatchActivity = require('../activity/CatchActivity'),
    AssertActivity = require('../activity/AssertActivity'),
    AssertSequenceActivity = require('../activity/AssertSequenceActivity'),
    CodeActivity = require('../activity/CodeActivity'),
    DelayActivity = require('../activity/DelayActivity'),
    FetchActivity = require('../activity/FetchActivity'),
    IFElseActivity = require('../activity/IFElseActivity'),
    InteractActivity = require('../activity/InteractActivity'),
    SequenceActivity = require('../activity/SequenceActivity'),
    TerminateActivity = require('../activity/TerminateActivity'),
    WhileActivity = require('../activity/WhileActivity'),
    RaceActivity = require('../activity/RaceActivity')

const getActivity = function getActivity(act) {
    let activity = null,
        children = null
    switch (act.type) {
        case 'all':
            if (Array.isArray(act.children)) {
                children = getAllActivity(act.children)
            }
            activity = new AllActivity(act.context, children)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'assert':
            activity = new AssertActivity(act.context, act.code)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'assertsequence':
            activity = new AssertSequenceActivity(act.context)
            if (Array.isArray(act.children)) {
                children = getAllActivity(act.children)
            }
            activity.name = act.name || activity.name
            activity.set(act.assert, children)
            return activity
        case 'break':
            activity = new BreakActivity(act.context)
            activity.name = act.name || activity.name
            activity.params(act.message)
            return activity
        case 'catch':
            activity = new CatchActivity(act.context)
            activity.params(act.message, act.code, act.ignore)
            activity.name = act.name || activity.name
            return activity
        case 'code':
            activity = new CodeActivity(act.context, act.code)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'delay':
            activity = new DelayActivity()
            activity.name = act.name || activity.name
            activity.params(act.time)
            return activity
        case 'fetch':
            activity = new FetchActivity(act.context)
            activity.name = act.name || activity.name
            activity.params(act.url, act.options, act.withHeaders)
            return activity
        case 'ifelse':
            activity = new IFElseActivity(act.context)
            if (act.if) {
                activity.if(act.if.name, act.if.assert, getAllActivity(act.if.children))
            }
            // elseif是数组
            if (Array.isArray(act.elseif)) {
                act.elseif.forEach(at => activity.elseif(at.name, at.assert, getAllActivity(at.children)))
            }
            if (act.else) {
                activity.else(act.else.name, act.if.assert, getAllActivity(act.else.children))
            }
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'interact':
            activity = new InteractActivity(act.descriptor, act.time, act.message)
            activity.name = act.name
            activity.descriptor = act.descriptor
            return activity
        case 'race':
            if (Array.isArray(act.children)) {
                children = getAllActivity(act.children)
            }
            activity = new RaceActivity(act.context, children)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'sequence':
            if (Array.isArray(act.children)) {
                children = getAllActivity(act.children)
            }
            activity = new SequenceActivity(act.context, children)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'terminate':
            activity = new TerminateActivity(act.context)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        case 'while':
            if (Array.isArray(act.children)) {
                children = getAllActivity(act.children)
            }
            activity = new WhileActivity(act.context, act.assert, children)
            activity.name = act.name || activity.name
            activity.params()
            return activity
        default:
            return null
    }
}

const getAllActivity = function getAllActivity(list) {
    if (!Array.isArray(list)) {
        return null
    }
    return list.map(act => getActivity(act)).filter(act => !!act)
}

module.exports = {
    get(act) {
        return getActivity(act)
    },
    getAll(list) {
        return getAllActivity(list)
    },
    registerInteract() {

    },
    registerInteracts() {

    },
    getAllActivity(context, children) {
        !children && (children = context, context = undefined)
        return getActivity({
            context,
            type: 'all',
            children
        })
    },
    getTerminateActivity(context, message) {
        !message && (message = context, context = undefined)
        return getActivity({
            context,
            type: 'terminate',
            message
        })
    },
    getCodeActivity(context, code) {
        !code && (code = context, context = undefined)
        return getActivity({
            context,
            type: 'code',
            code
        })
    },
    getDelayActivity(time) {
        return getActivity({
            type: 'delay',
            time
        })
    },
    getFetchActivity(context, url, options) {
        !options && (options = url, url = context, context = undefined)
        return getActivity({
            context,
            type: 'fetch',
            url,
            options
        })
    },
    getSequenceActivity(context, children) {
        !children && (children = context, context = undefined)
        return getActivity({
            context,
            type: 'sequence',
            children
        })
    }
}