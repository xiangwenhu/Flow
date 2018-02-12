const {
    readdir
} = require('../utils/fsex'),
    path = require('path'),
    mapping = require('../activity/.mapping.json')

const props = {},
    factory = {}

// 属性过滤，这里仅仅限制属性，没有进行具体类型检查等等 TODO::属性检查等
const filterProps = act => {
    const map = props[act.type]
    if (!map) {
        return act
    }

    const _act = {}
    for (let p in map) {
        _act[p] = act[p]
    }
    return _act
}

// 加载各种Activity的Factory
const loadFactory = async () => {
    const dir = path.resolve(__dirname, '../activity/factory')
    const fFiles = await readdir(dir)
    fFiles.forEach(file => {
        factory[`get${file.split('.')[0]}`] = require(`${dir}/${file}`)(factory, filterProps)
    })
}

// 加载属性相关
const loadProps = async () => {
    const dir = path.resolve(__dirname, '../activity/props')
    const fFiles = await readdir(dir)
    fFiles.forEach(file => {
        props[file.replace(/Activity.json/, '').toLowerCase()] = require(`${dir}/${file}`)
    })
}

// 注册工厂和属性先关
const register = async (app) => {
    await loadFactory()
    await loadProps()
}

// 获得市级的名字，比如ifelse对象应该是IFElse, assertsequence对应该死AssertSequence
const getName = type => {
    return mapping[type] || `${type[0].toUpperCase()}${type.slice(1)}`
}

const getActivity = act => {
    return factory[`get${getName(act.type)}Activity`](act)
}

const getAllActivities = list => {
    if (!Array.isArray(list)) {
        return null
    }
    return list.map(act => getActivity(act)).filter(act => !!act)
}

factory.getAll = getAllActivities
factory.get = getActivity

register()

module.exports = {
    filterProps,
    factory,
    getAll: getAllActivities,
    get: getActivity
}