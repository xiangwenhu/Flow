const FunctionFactory = require('../factory/FunctionFactory'),
    {
        isString,
        isObject
    } = require('../utils/typeChecker')

function Replacer(config) {
    this.config = config
    this._keys = Object.keys(config)
    this._values = Object.values(config)
}

Replacer.prototype.string = function (str) {
    return isString(str) ?
        FunctionFactory.getFunction([...this._keys], `\`${str}\``).apply({}, this._values) : str
}

Replacer.prototype.object = function (obj) {
    for (let p in obj) {
        let v = obj[p]
        if (isString(v)) {
            obj[p] = this.string(obj[p])
        } else if (isObject(v)) {
            obj[p] = this.object(v)
        }
    }
    return obj
}

module.exports = Replacer
