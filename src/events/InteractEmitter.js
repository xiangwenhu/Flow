const EventEmitter = require('events'),
    {
        isFunction
    } = require('../utils/typeChecker')

class InteractEmitter {
    constructor() {
        this._emitter = new EventEmitter()
        this._declareName = 'declare'
    }

    /**
     * Activity对外申明参数
     * @param {Activity唯一标识} uuid 
     * @param {参数描述} descriptor 
     */
    declare(uuid, descriptor, time, callBack) {
        const uidStr = String(uuid),
            ticket = setTimeout(() => {
                this.remove(uidStr)
            }, time)
        // 告诉外界需要参数
        this._emitter.emit(this._declareName, uuid, descriptor)
        // 同时监听_consumer事件
        this._emitter.once(uidStr, data => {
            clearTimeout(ticket)
            if (isFunction(callBack)) {
                callBack(data)
            }
        })
        return this
    }


    /**
     * 
     * @param {回调函数, function(id ,descriptor)} callBack 
     */
    onDeclare(callBack) {
        if (isFunction(callBack)) {
            this._emitter.on(this._declareName, (id, descriptor) => {
                callBack(id, descriptor)
            })
        }
        return this
    }

    /**
     * 外界调用
     * @param {Activity唯一标识} uuid 
     * @param {输入的JSON数据} data 
     */
    consumer(uuid, data) {
        const eventName = String(uuid)
        if (this._emitter._events[eventName]) {
            this._emitter.emit(eventName, data)
        }
        return this
    }

    remove(uuid) {
        if (this._emitter._events[uuid]) {
            this._emitter.removeAllListeners(uuid)
        }
        return this
    }
}

module.exports = InteractEmitter