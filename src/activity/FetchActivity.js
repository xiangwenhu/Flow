const fetch = require('node-fetch'),
    Activity = require('./Activity'),
    Replacer = require('../utils/DataReplacer')

class FetchActivity extends Activity {
    constructor(context) {
        super(context)
        this.type = 'fetch'
        this.withHeaders = false
    }

    build(url, options = {}, withHeaders) {
        this.withHeaders = withHeaders || this.withHeaders
        this.fn = (ctx, resObj, _global_) => {
            const rp = new Replacer({
                [this.ctxName]: this.context || ctx,
                [this.globalName]: _global_,
                [this.resName]: resObj
            })
            url = rp.string(url || options.url || '')
            options = rp.object(options)
            return fetch(url, options)
                .then(res => {
                    if (this.withHeaders) {
                        ctx.headers = res.headers._headers
                    }
                    return !options.headers ||
                        (options.headers && !options.headers.Accept) ||
                        (options.headers && options.headers.Accept && options.headers.Accept.indexOf('application/json') >= 0) ? res.json() : res.text()
                })
        }
        return this.fn
    }
}

module.exports = FetchActivity