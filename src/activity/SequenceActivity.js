const ActivityError = require('../error/ActivityError'),
    compose = require('koa-compose'),
    Activity = require('./Activity'),
    logger = require('../common/logger'),
    ActivityFactory = require('../factory/ActivityFactory'),
    ActivityStatus = require('../const/ActivityStatus'),
    {
        isFunction
    } = require('../utils/typeChecker')

class SequenceActivity extends Activity {
    constructor(context, children) {
        if (!(children == undefined || children == null) &&
            typeof children !== 'object' && !Activity.isActivityList(children)) {
            throw new ActivityError({
                message: 'Activity的constructor必须是null,undefined或者有效的Activity实例的集合',
                type: this.type,
                name: this.name
            })
        }
        super(context)
        // 子活动集合
        this._children = children || []
        // 把新添加的Activity实例集合的父节点设置为当前Activity实例   
        this.type = 'sequence'
        // 调整父子关系和兄弟关系
        this._adjust()
    }

    get children() {
        return this._children
    }

    set children(children) {
        this._children = children
        this._adjust()
    }

    _adjust() {
        this._setParents()
        this._setLink()
        // 调整完毕，触发afterAdded事件
        this.children.forEach(act => {
            act.root = this.root
            if (Array.isArray(act.children) && isFunction(act._adjust)) {
                act._adjust()
            }
        })
    }

    /**
     * 设置子Activity的父Activity
     */
    _setParents(parent) {
        parent = parent || this
        this.children.forEach(act => {
            if (!act.parent || this.isActivity(act)) {
                act._setParent(parent)
            }
        })
    }

    /**
     * 设置活动之间的链接关系
     */
    _setLink() {
        if (this.children.length > 1) {
            this.children.reduce((pre, cur) => {
                pre.next = cur
                cur.pre = pre
                return cur
            })
        }
    }

    /**
     * 子活动添加前的钩子函数
     * @param {活动集合} activities 
     */
    beforeChildrenAdd(activities) {
        return true
    }
    /**
     * 子活动添加后的钩子函数
     * @param {活动集合} activities 
     */
    afterChildrenAdded(activities) {
        return true
    }

    /**
     * 有Activity删除后，置空其parent, 返回true，表示删除，其他情况不删除
     * @param {*} id 
     */
    beforeChildRemove(activity) {
        return true
    }

    build() {
        return (this.fn = this.buildChildren())
    }

    /**
     * build子Activity集合
     */
    buildChildren(children) {
        // 不要覆盖this.children
        children = children || this.children
        const activities = this.children

        const _getCatchActivity = function _getCatchActivity(index) {
            return activities.find((act, i) => act.type === 'catch' && i > index)
        }
        const self = this
        return (ctx, res, _global_, ...otherParams) => {
            return new Promise((resolve, reject) => {
                // 如果并没有子活动，直接resolve传递
                if (!children || children.length <= 0) {
                    return resolve(res)
                }
                // 把子活动compse然后依次执行
                compose(children.map((ins, index) =>
                    async (context, next) => {
                        let realContext = ins.context || context || ctx
                        try {
                            if (ins.type === 'catch') {
                                next()
                            } else {
                                // 执行前钩子函数
                                isFunction(ins.beforeExecute) && ins.beforeExecute.apply(ins, realContext, res, _global_, ...otherParams)

                                // 执行                              
                                res = await ins.execute(realContext, res || {})

                                // 需要停止 ?? 转移到 Activity 里面去？
                                if (self.needTerminate(self)) {
                                    self.status = ins.status = ActivityStatus.TERMINATED;
                                    return reject(new ActivityError(self.root._global_.terminateMessage, this.type, this.name, true))
                                }

                                // 如果是BreackActivity结束当前Sequence
                                if (ins.type === 'break') {
                                    return resolve(res)
                                }

                                // 执行后的钩子函数
                                isFunction(ins.afterExecute) && ins.afterExecute.apply(ins, realContext, res, _global_, ...otherParams)

                                // 判断是否结束
                                index === children.length - 1 ? resolve(res) : next()
                            }
                        } catch (err) {
                            self.status = ins.status = ActivityStatus.EXCEPTION
                            // 重写Error
                            if (!ActivityError.isActivityError(err)) {
                                err = ActivityError.fromError(err, {
                                    type: ins.type,
                                    name: ins.name,
                                    terminated: false,
                                    logged: err.logged
                                })
                            }
                            // 防止错误重复记录
                            !err.logged && logger.error(err)
                            // 如果此错误有标记为终止流程，直接往外抛出
                            if (err.terminated === true) {
                                return reject(err)
                            } else {
                                //查找catch Activity，进行进一步的处理
                                const catchActivity = _getCatchActivity(index)
                                // catch能找到表示当前ins肯定不是最后一个，必然能next()
                                if (catchActivity) {
                                    await catchActivity.execute(realContext, res, _global_)
                                    if (catchActivity.ignore) {
                                        return next()
                                    }
                                }
                                return reject(err)
                            }
                        }
                    }
                ))(ctx)
            })
        }
    }

    /**
     * 添加子Activity
     */
    add(...args) {
        if (isFunction(this.beforeChildrenAdd)) {
            if (true !== this.beforeChildrenAdd.apply(this, args)) {
                return null
            }
        }
        const newItems = this._add(...args)
        if (isFunction(this.afterChildrenAdded)) {
            this.afterChildrenAdded.apply(this, newItems)
        }
        return newItems
    }

    /**
     *  添加子Activity
     */
    _add(...args) {
        args = [].concat(args)
        if (args.length === 0) {
            return null
        }
        this.children = this.children.concat(args)
        this._adjust()
        return args
    }

    /**
     * 通过id查找子Activity
     * @param {子Activity的id} id 
     */
    find(id) {
        return this.children.find(it => it._id === id)
    }

    /**
     * 通过id删除子Activity
     * @param {子Activity的id} id 
     */
    remove(id) {
        const index = this.children.findIndex(it => it._id === id)
        if (isFunction(this.beforeChildRemove)) {
            if (true !== this.beforeChildRemove(this.children[index])) {
                return null
            }
        }

        const activity = index > -1 ? this.children.splice(index, 1) : null
        if (activity) {
            activity.parent == null
        }
        this._adjust()
        return activity
    }

    /**
     * 清空子Activity
     */
    clear() {
        this.children = []
    }

    /**
     * 检查是不是Activity实例的集合
     * @param {待检查的Activity实例集合} list 
     */
    static isActivityList(list) {
        return Array.isArray(list) && list.every(a => Activity.isActivity(a))
    }
}

module.exports = SequenceActivity