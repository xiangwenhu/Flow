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

    set emitter(emitter) {
        this._emitter = emitter
    }

    // FIXME::
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

                if (this._emitter && isFunction(this._emitter.declare)) {
                    // 通知外界我需要参数
                    this._emitter.declare(this._id, this.descriptor, this.time, data => {
                        clearTimeout(ticket)
                        resolve(data || {})
                    })
                }
            })
        }
        return this.fn
    }
}

module.exports = Interactctivity