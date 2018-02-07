const Result = require('../common/Result')

const instance = null

class FlowManager {
    constructor() {
        if (!(this instanceof FlowManager)) {
            return new FlowManager()
        }
        if (instance) {
            return instance
        }
        this.list = {}
    }

    start(activity, context, globalContext) {
        activity._global_ = globalContext
        this.list[activity._id] = activity

        return new Promise(async (resolve, reject) => {

            try {
                activity.execute(context).then(result => {
                    delete this.list[activity._id]
                    return resolve(result)
                }).catch(err => {
                    delete this.list[activity._id]
                    return reject(err)
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    stop(instanceId) {
        return new Promise((resolve, reject) => {
            const ins = this.list[instanceId]
            if (!ins) {
                return reject(new Result(false, 401, `未找到id为${instanceId}的实例`))
            }
            ins._global_.stopimmediate = true
        })
    }

    delete(instanceId) {

    }


    _clear() {

    }

    _isEnded() {

    }


    static getInstance() {
        if (instance === null) {
            return new FlowManager()
        }
        return instance
    }
}



module.exports = FlowManager