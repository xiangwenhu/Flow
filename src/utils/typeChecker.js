const checker = {};

['Function', 'String', 'Number', 'Boolean', 'Object', 'Undefined'].map(function (v) {
    const vlower = v.toLowerCase()
    this[`is${v}`] = function (val) {
        return typeof val === vlower
    }
}, checker)

module.exports = checker