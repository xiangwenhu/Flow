const ActivityError = require('../error/ActivityError'),
    Item = require('../base/Item'),
    FunctionFactory = require('../factory/FunctionFactory'),
    ActivityStatus = require('../const/ActivityStatus'),
    {
        isFunction,
        isString,
        isBoolean
    } = require('../utils/typeChecker')

class Activity extends Item {
    constructor(context) {
        super()
        // 上下文
        this.context = context
        // build后的执行函数
        this.fn = null
        // 上下文ctx的变量名
        this.ctxName = 'ctx'
        // 执行函数res的变量名
        this.resName = 'res'
        // 全局变量
        this.globalName = '_global_'
        // 基本类型
        this.type = 'activity'
        // Activity的名字
        this.name = '未定义'
        // 父节点
        this.parent = null
        // 前面的节点
        this.pre = null
        // 后面的节点
        this.next = null
        // 状态
        this._status = ActivityStatus.INITIALIZED
        // 根活动
        this.root = this

        // XXX:: Symbol来识别类型
        // this.type 
    }

    /**
     * 设置状态，同时通知
     */
    set status(status) {
        if (this.status != ActivityStatus.EXCEPTION || this.status != ActivityStatus.TERMINATED) {
            this._status = status
            this._commit()
        }
    }

    get status() {
        return this._status
    }

    _commit() {        
        if (this.root && isFunction(this.root._dispatch)) {
            this.root._dispatch(this, this.root)
        }
    }

    beforeBuild() {
        return this
    }

    afterBuild() {
        return this
    }

    /**
     * 执行前的钩子函数
     * @param {上下文} ctx 
   
    beforeExecute(ctx) {
        return true
    }
    */

    /**
     * 执行后的钩子函数
     * @param {上下文} ctx 
     * @param {执行结果} result 
    
    afterExecute(ctx, result) {
        return result
    }
    */

    /**
     * 被父活动添加后
     */
    afterAdded(parent) {}

    params(...args) {
        this._preFn = () => this.build(...args)
        return this
    }

    /**
     * 默认的build函数
     */
    build() {
        this.status = ActivityStatus.BUILDING
        this.fn = ctx => Promise.resolve(ctx)
        this.status = ActivityStatus.BUILDED
    }

    _innerBuild() {
        if (isFunction(this.beforeBuild)) {
            this.beforeBuild.apply(this)
        }
        if (!this._preFn) {
            this._preFn = () => this.build()
        }

        this.status = ActivityStatus.BUILDING
        this._preFn()
        this.status = ActivityStatus.BUILDED

        if (isFunction(this.afterBuild)) {
            this.afterBuild.apply(this)
        }

        return this.fn
    }

    _setParent(parent) {
        this.parent = parent
    }

    /**
     * 
     * @param {代码} code 
     */
    buildWithCode(code) {
        if (isFunction(this.beforeBuild)) {
            this.beforeBuild()
        }
        if (!isString(code) && !isBoolean(code)) {
            throw new ActivityError({
                message: 'buildWithCode方法的code参数必须是字符串',
                type: this.type,
                name: this.name
            })
        }
        this.status = ActivityStatus.BUILDING
        this.fn = FunctionFactory.getPromiseFunction(this.ctxName, this.resName, this.globalName, code)
        this.status = ActivityStatus.BUILDED

        if (isFunction(this.afterBuild)) {
            this.afterBuild()
        }
        return this.fn
    }

    bind(ctx) {
        if (isFunction(this.fn)) {
            this.context = ctx
        }
        return this
    }

    /**
     * 
     * @param {执行上下文} ctx 
     * @param {上一次执行结果} res 
     * @param {其他参数} otherParams 
     */
    execute(ctx, res, ...otherParams) {
        // 如果接受到终止命令
        if (this.needTerminate()) {
            this.status = ActivityStatus.TERMINATED
            return Promise.reject(new ActivityError(this.root._global_.terminateMessage, this.type, this.name, true))
        }
        this._innerBuild()
        if (!isFunction(this.fn)) {
            throw new ActivityError({
                message: 'fn应该为函数，请确保先build然后再execute',
                type: this.type,
                name: this.name
            })
        }

        let realContext = this.context || ctx || {}
        if (isFunction(this.beforeExecute)) {
            this.beforeExecute(realContext, res)
        }
        this.status = ActivityStatus.EXECUTING
        const self = this
        let result = this.fn.apply(realContext, [realContext, res, ...otherParams])
            .then(res => {
                this.status = ActivityStatus.EXECUTED
                //执行完毕后, 可以获得promise对象，最后还要返回promise对象，这里主要提供执行完毕后对promise的操控能力
                if (isFunction(this.afterExecute)) {
                    result = this.afterExecute(realContext, result)
                }
                //XXX:: status = Exception 不是在此设置的，没法知道result的状态  
                return res
            }).catch(err => {
                self.status = ActivityStatus.EXCEPTION
                throw err
            })
        return result
    }

    clone() {
        return null
    }

    /**
     * 
     * @param {待检查的Activity} activity 
     */
    isActivity(activity) {
        return Activity.isActivity(activity)
    }

    needTerminate(activity) {
        const act = activity || this
        return act.root._global_ && act.root._global_.terminateImmediate === true
    }

    isRoot(activity) {
        const act = activity || this
        return act === act.root
    }

    /**
     * 检查是不是Activity实例
     * @param {待检查的Activity实例} activity 
     */
    static isActivity(activity) {
        if (typeof activity === 'object' && activity instanceof Activity) {
            return true
        }
        return false
    }
}

module.exports = Activity