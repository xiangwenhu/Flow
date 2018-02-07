const Activity = require('./Activity')

class DelayActivity extends Activity {
    constructor(time = 5000) {
        super()
        this.type = 'delay'
        this.time = time
    }

    build(time) {
        this.time = time || this.time
        this.fn = () => {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve(true)
                }, this.time)
            })
        }
        return this.fn
    }
}

module.exports = DelayActivity