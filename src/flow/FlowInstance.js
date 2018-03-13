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
        this.enbaleLogger = true
        this._connectActivity(activity)
        this._isRuning = false
    }

    _connectActivity(activity) {
        this.activity = activity
        // 返回实例
        this.activity.getInstance = () => this
        // 订阅status变化事件      
        this.subscribe('status', (activity, root) => {
            logger.info({
                id: activity._id,
                type: activity.type,
                name: activity.name
            })
            logger.info(this.getProgress())

            // TODO:: 改进context监听机制
            this.dispatch('context', this.context)
        })
    }

    /**
     * z
     * @param {上下文} context 
     * @param {全局上下文} globalContext 
     */
    start(context, globalContext = {}) {
        if (this._isRuning) {
            throw new Error('实例正在运行中')
        }
        this._isRuning = true
        this.context = context
        this.globalContext = globalContext
        return this.activity.execute(this.context).catch(err => {
            // 处理 activity 没有孩子节点， 有孩子节点的error是在SequenceActivity里面处理的
            if (!this.hasChildren()) {
                err.activityId = this.activity._id
                err._stack = err.stack
            }
            throw err
        })
    }


    hasChildren() {
        return !!this.children
    }

    /**
     * 停止实例
     * @param {消息} message 
     */
    stop(message = '用户终止') {
        this.globalContext.terminateImmediate = true
        this.globalContext.terminateMessage = message
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

    /**
     * 分发interact的response，外界通知Activity
     * @param {参数} args 
     */
    dispatchInteractResponse(...args) {
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

    /**
     * 订阅Activity交互请求事件
     * @param {监听事件} listener 
     */
    subscribeInteractRequest(listener) {
        this.subscribe('interact-request', listener)
    }

    /**
     * 订阅外界交互响应事件，外界通知Activity
     * @param {监听事件} listener 
     */
    subscribeInteractReponse(listener) {
        this.subscribe('interact-response', listener)
    }

    _ensureType(type) {
        return this.listeners[type] || (this.listeners[type] = [])
    }
}