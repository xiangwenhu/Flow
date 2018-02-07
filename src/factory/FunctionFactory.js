module.exports = {
    getFunction(...args) {
        if (args.length < 0) {
            return null
        }
        const code = args.pop()
        return this._getFunction(args, `'return(${code})'`)

    },
    getPromiseFunction(...args) {
        if (args.length < 0) {
            return null
        }
        const code = args.pop()
        return this._getFunction(args, `'return  Promise.resolve( (${code}))'`)
    },

    _getFunction(params, code) {
        code = code.replace(/\r|\n/g, '')
            .replace(/""/, '\\\\""')
            .replace(/''/, "\\\\''")
        params = params.map(c => `'${c}'`).join()
        const funStr = `return new Function(${params}, ${code}) `
        return (new Function(funStr))()
    }
}