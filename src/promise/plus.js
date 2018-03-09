/**
 * 转换为Promise集合
 * @param {Promise的集合或者之后后返回promise的函数集合} promises 
 * @param {附加参数} args 
 */
function toPromise(promises, ...args) {
    return promises.map(p => typeof p === 'function' ? p(...args) : p)
}

/**
 * 返回Promise.all
 * @param {Promise的集合或者之后后返回promise的函数集合} promises 
 * @param {附加参数} args 
 */
function all(promises, ...args) {
    return Promise.all(toPromise(promises, ...args))
}

/**
 * 返回Promise.race
 * @param {Promise的集合或者之后后返回promise的函数集合} promises 
 * @param {附加参数} args 
 */
function race(promises, ...args) {
    return Promise.race(toPromise(promises, ...args))
}

/**
 * 顺序执行Promise，并返回结果
 * @param {返回promise的函数集合} promises 
 * @param {每一步的回调函数，非异步,可以考虑后期支持} cb 
 * @param {附加参数} args 
 */
function sequence(promises, cb, ...args) {
    const p = Promise.resolve(),
        len = promises.length
    if (len <= 0) {
        return p
    }
    let i = 0
    //如果cb不是函数
    if (typeof cb !== 'function') {
        cb = null
        args = [cb, ...args]
    }

    function callBack(...params) {
        return p.then(r => {
            return promises[i](r, ...params)
        }).then(r => {
            ++i
            cb && cb(r, i, ...params)
            return i > len - 1 ? Promise.resolve(r) : callBack(...params)
        })
    }

    return callBack(...args)
}

/**
 * 顺序执行Promise，并返回结果, 需要主动执行sequence(promises)(6)
 * @param {返回promise的函数集合} promises 
 * @param {附加参数} args 
 */
function delaySequence(promises, cb, ...args) {
    return function (..._args) {
        return sequence(promises, cb, ...[...args, ..._args])
    }
}

const plus = {
    race,
    all,
    sequence,
    delaySequence
}

module.exports = plus