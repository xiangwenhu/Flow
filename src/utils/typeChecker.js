const toString = Object.prototype.toString,
    checker = {}


function getTag(v) {
    return toString.call(v)
}

function isObjectLike(v) {
    return typeof v == 'object' && v !== null
}

function isLength(v) {
    return typeof v == 'number' &&
        v > -1 && v % 1 == 0 && v <= Number.MAX_SAFE_INTEGER
}

['Function', 'String', 'Number', 'Boolean', 'Object', 'Symbol'].map(function (t) {
    const vlower = t.toLowerCase()
    this[`is${t}`] = function (v) {
        return typeof v === vlower || isObjectLike(v) && getTag(v) === `[object ${t}]`
    }
}, checker);

['RegExp', 'Set', 'WeakSet', 'Map', 'WeakMap', 'Error', 'ArrayBuffer', 'Arguments', 'Promise'].map(function (t) {
    this[`is${t}`] = function (v) {
        return isObjectLike(v) && getTag(v) === `[object ${t}]`
    }
}, checker)

function isArray(v) {
    return Array.isArray(v)
}

function isArrayLike(v) {
    return isObjectLike(v) && isLength(v.length)
}

function isNull(v) {
    return v === null
}

function isUndefined(v) {
    return v === undefined
}

module.exports = Object.assign(checker, {
    isLength,
    isArray,
    isArrayLike,
    isObjectLike,
    isNull,
    isUndefined
})