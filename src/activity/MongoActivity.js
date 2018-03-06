const Activity = require('./Activity'),
    ActivityError = require('../error/ActivityError'),
    {
        isFunction
    } = require('../utils/typeChecker'),
    MongoClient = require('mongodb').MongoClient

class MongoActivity extends Activity {
    constructor(context, auth, commands) {
        super(context)
        this.auth = auth
        this.commands = commands
    }

    build(commands) {
        this.commands = commands || this.commands
        const cmd = this.commands[0]
        this.fn = (ctx, resObj) => {
            return new Promise(async (resolve, reject) => {
                let client, db, col, result
                try {
                    client = await MongoClient.connect(this.getAuthUrl())

                    cmd.db && (db = client.db(cmd.db))
                    cmd.collection && db && (col = db.collection(cmd.collection))

                    if (cmd.db && cmd.collection) {
                        result = await col[cmd.operation](...cmd.params).toArray()
                    }
                    return resolve(result)
                } catch (err) {
                    return reject(err)
                } finally {
                    client && client.close()
                }
            })
        }
    }

    getAuthUrl() {
        const en = encodeURIComponent,
            au = this.auth
        let url = ''
        if (au && au.ip) {
            au.user && au.password ?
                url = `mongodb://${en(au.user)}:${en(au.password)}@${au.ip||'localhost'}:${au.port||'27017'}/?authMechanism=${au.authMechanism||'DEFAULT'}` :
                url = `mongodb://${au.ip||'localhost'}:${au.port||'27017'}/?authMechanism=${au.authMechanism||'DEFAULT'}`
            return url
        }
        return url
    }

    getCommands() {

    }
}

module.exports = MongoActivity