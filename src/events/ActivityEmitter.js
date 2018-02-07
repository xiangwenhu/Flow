const EventEmitter = require('events'),
    flowProgress = require('../flow/flowProgress'),
    logger = require('../common/logger')


module.exports = class ActivityEmitter {
    constructor() {
        this.logger = logger
        this.emitter = new EventEmitter()

        this.emitter.on('status', (id, activity) => {
            const flow = flowProgress.getProgress(activity)
            this.logger.info(JSON.stringify(flow))

            for (let f in this.fn) {
                this.fn[f](id, flow)
            }
        })
        this.fn = {}
    }

    statusChanged(activity) {
        this.emitter.emit('status', activity._id, activity)
    }

    on(name, fn) {
        this.fn[name] = fn
    }
}