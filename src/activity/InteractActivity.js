const Activity = require('./Activity'),
    ActivityError = require('../error/ActivityError'),
    {
        isFunction
    } = require('../utils/typeChecker')

class Interactctivity extends Activity {
    constructor(descriptor, time = 30000, message) {
        super()
        this.type = 'interact'
        this.time = time
        this.interactType = 'default'
        this.message = message
    }

    build(descriptor, time, message) {
        // 设置超时时间
        this.time = time || this.time
        // 参数描述
        this.descriptor = descriptor || this.descriptor
        // 超时消息
        this.message = message || this.message
        this.fn = (ctx, res) => {
            let ticket = null
            return new Promise((resolve, reject) => {
                // 超时处理
                ticket = setTimeout(() => {
                    reject(new ActivityError({
                        message: this.message || `${this.name} 超时`,
                        type: this.type,
                        name: this.name
                    }))
                }, this.time)

                // 通知外界我需要数据
                this._commit('interact-request')

                // 订阅外界数据变化, 需要FlowInstance.dispatch('interact',data)
                this.root.instance.subscribeInteractReponse(function (data) {
                    clearTimeout(ticket)
                    resolve(data || {})
                })            
            })
        }
        return this.fn
    }
}

module.exports = Interactctivity