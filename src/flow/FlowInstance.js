const {
    isFunction
} = require('../utils/typeChecker'),
    uuid = require('uuid/v4'),
    getProgress = require('../flow/getProgress'),
    logger = require('../common/logger')


module.exports = class FlowInstance {
    constructor(activity) {
        this.listeners = {}
        this.id = uuid()
        this.activity = activity
        this.activity.instance = this
        this.enbaleLogger = true
        this.subscribe('status', (activity, root) => {
            logger.info({
                id: activity._id,
                type: activity.type,
                name: activity.name
            })
            logger.info(this.getProgress())
        })
    }

    /**
     * 启动实例
     * @param {上下文} context 
     * @param {全局上下文} globalContext 
     */
    start(context, globalContext = {}) {
        this.activity._global_ = globalContext
        this.activity._dispatch = (...args) => {
            this.dispatch(...args)
        }
        return this.activity.execute(context)
    }

    /**
     * 停止实例
     * @param {消息} message 
     */
    stop(message = '用户终止') {
        this.activity._global_.terminateImmediate = true
        this.activity._global_.terminateMessage = message
    }

    /**
     * 派发订阅
     * @param {工作流当前状态} status 
     * @param {执行返回结果} res 
     * @param {上下文} context 
     */
    dispatch(type, ...args) {
        if (this.listeners[type]) {
            for (let i = 0; i < this.listeners[type].length; i++) {
                const listener = this.listeners[type][i]
                listener(...args)
            }
        }
    }

    dispatchInteractReponse(...args) {
        this.dispatch('interact-response', ...args)
    }

    /**
     * 获得Activity实例当前进度
     */
    getProgress() {
        return getProgress(this.activity)
    }

    /**
     * 订阅Activity的状态变化等
     * @param {监听} listener 
     */
    subscribe(type, listener) {
        // 未定义type，默认为status
        if (!listener) {
            listener = type
            type = 'status'
        }
        if (!isFunction(listener)) {
            throw new Error('listener应该是一个函数')
        }
        let isSubscribed = true
        this._ensureType(type)
        this.listeners[type].push(listener)
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            const index = this.listeners[type].indexOf(listener)
            this.listeners[type].splice(index, 1)
        }
    }

    subscribeInteractRequest(listener) {
        this.subscribe('interact-request', listener)
    }

    subscribeInteractReponse(listener) {
        this.subscribe('interact-response', listener)
    }

    _ensureType(type) {
        return this.listeners[type] || (this.listeners[type] = [])
    }
}