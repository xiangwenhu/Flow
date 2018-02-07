module.exports = class Result {
    constructor(status, code, messsage) {
        if (!(this instanceof Result)) {
            return new Result(...arguments)
        }
        this.status = status
        this.code = code
        this.messsage = messsage
    }
}