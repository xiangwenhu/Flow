const SequenceActivity = require('../activity/SequenceActivity'),
    Activity = require('../activity/Activity'),
    AssertActivity = require('../activity/AssertActivity'),
    ActivityError = require('../error/ActivityError'),
    AssertSequenceActivity = require('../activity/AssertSequenceActivity')

class IFElseActivity extends SequenceActivity {
    constructor(context) {
        super(context)
        this.type = 'ifelse'
        this.assert = null
        this._ifAdded = false
        this._elseAdded = false
    }

    build() {
        this.beforeBuild()
        this.fn = (...args) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let r, i = 0
                    while (i < this.children.length) {
                        r = await this.children[i].executeAssert(...args)
                        if (r === true) {
                            r = await this.children[i].execute(...args)
                            return resolve(r)
                        }
                        i += 1
                    }
                    return resolve(r)
                } catch (err) {
                    return reject(err)
                }
            })
        }
        return this.fn
    }

    /**
     * 
     * @param {条件语句} condition 例如 ctx.country === '北京'
     * @param {Activity实例集合} children 
     */
    if (name, condition, children) {
        if (!children) {
            condition = name
            children = condition
        }
        if (!this._ifAdded) {
            this.add(this._getChild(name, condition, children))
            this._ifAdded = true
        }
        return this
    }

    /**
     * 
     * @param {条件语句} condition 例如 ctx.country === '北京'
     * @param {Activity实例集合} children 
     */
    elseif(name, condition, children) {
        if (!children) {
            condition = name
            children = condition
        }
        if (!this._ifAdded) {
            throw new ActivityError('IFElseActivity必须首先添加if语句', this.type, this.name)
        }

        const child = this._getChild(name, condition, children)

        if (this._elseAdded) {
            this.children.splice(this.children.length - 1, 0, child)
            // 主动触发更新父子和兄弟关系
            this._adjust()
            return this
        }
        this.add(child)
        return this
    }

    /**
     * 
     * @param {条件语句} condition 例如 ctx.country === '北京'
     * @param {Activity实例集合} children 
     */
    else(name, condition, children) {
        if (!children) {
            condition = name
            children = condition
        }
        if (!this._elseAdded) {
            const child = this._getChild(name, true, children)
            this.add(child)
            this._elseAdded = true
        }
        return this
    }

    _getChild(name, condition, children) {
        const child = new AssertSequenceActivity()
        child.root = this.root
        child.name = name
        child.set(condition, children)
        return child
    }
}

module.exports = IFElseActivity