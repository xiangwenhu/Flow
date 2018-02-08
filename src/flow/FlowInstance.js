const {
    isFunction
} = require('../utils/typeChecker'),
    uuid = require('uuid/v4'),
    getProgress = require('../flow/getProgress'),
    logger = require('../common/logger')


module.exports = class FlowInstance {
    constructor(activity) {
        this.listeners = []
        this.id = uuid()
        this.activity = activity
        this.enbaleLogger = true
        this.subscribe((activity, root) => {
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
    dispatch(activity, root) {
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i]
            listener(...arguments)
        }
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
    subscribe(listener) {
        if (!isFunction(listener)) {
            throw new Error('listener应该是一个函数')
        }

        let isSubscribed = true
        this.listeners.push(listener)
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            const index = this.listeners.indexOf(listener)
            this.listeners.splice(index, 1)
        }
    }
}