const uuid = require('uuid/v4')

class Item {
    constructor() {
        this._id = uuid()
    }
}

module.exports = Item