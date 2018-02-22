const Result = require('../common/Result'),
    FlowInstance = require('../flow/FlowInstance')

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

    /**
     * 启动实例
     * @param {实例id} id 
     * @param {执行上下文} context 
     * @param {执行全局上下文} globalContext 
     */
    start(id, context, globalContext = {}) {
        const ins = this._getFlowInstance(id)
        if (ins) {
            ins.start([...[...arguments].slice(1)])
        }
    }

    /**
     * 停止实例
     * @param {实例id} id 
     * @param {消息} message 
     */
    stop(id, message) {
        const ins = this._getFlowInstance(id)
        if (ins) {
            ins.stop(message)
        }
    }

    /**
     * 从FlowManager里面删除，但是FlowInstance还是可以继续使用的
     * @param {实例id} id 
     */
    remove(id) {
        const ins = this._getFlowInstance(id)
        if (ins) {
            delete this.list[id]
        }
    }

    /**
     * 创建FlowInstance实例
     * @param {Activity实例} activity 
     */
    create(activity) {
        const ins = new FlowInstance(activity)
        this.list[ins.id] = ins
        return ins
    }

    /**
     * 注册FlowInstance，托管不是通过FlowManager.create创建的实例
     * @param {FlowInstance实例} instance 
     */
    register(instance) {
        if (instance instanceof FlowInstance) {
            this.list[instance.id] = instance
            return instance
        }
        return null
    }

    /**
     * 通过id获取FlowInstance, 内部使用
     * @param {FlowInstance的id} id 
     */
    _getFlowInstance(id) {
        return this.list[id]
    }

    /**
     * 清除所有的托管实例，但是FlowInstance还是可以继续使用的
     */
    _clear() {       
        this.list = []
    }

    static getInstance() {
        if (instance === null) {
            return new FlowManager()
        }
        return instance
    }
}

module.exports = FlowManager