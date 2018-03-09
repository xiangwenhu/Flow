const Activity = require('./Activity'),
    ActivityError = require('../error/ActivityError'),
    {
        isFunction
    } = require('../utils/typeChecker'),
    {
        getFunction
    } = require('../factory/FunctionFactory'),
    promisePlus = require('../promise/plus'),
    MongoClient = require('mongodb').MongoClient,
    Replacer = require('../utils/DataReplacer')

class MongoActivity extends Activity {
    constructor(context, auth, operations) {
        super(context)
        this.auth = auth
        this.mode = 'all'
        this.operations = operations
    }

    build(operations) {
        this.operations = operations || this.operations
        this.fn = (ctx, resObj) => {
            let client
            return new Promise(async (resolve, reject) => {
                try {
                    client = await MongoClient.connect(this.getAuthUrl())
                    return resolve(promisePlus[this.mode](this.getOperations(ctx, client, this.operations)))
                } catch (err) {
                    client && client.close()
                    return reject(err)
                }
            }).then(r => {
                client && client.close()
                return r
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

    getOperations(ctx, client, operations) {
        if (!Array.isArray(operations)) {
            return null
        }
        return operations.map(c => (col, db) => this.getPromiseOperation(ctx, client, c))
    }

    getPromiseOperation(ctx, client, operation) {
        const db = client.db(operation.db),
            col = db.collection(operation.collection),
            collectionKeyName = operation.colllectionKeyName || 'col',
            dbKeyName = operation.dbKeyName || 'db',
            rp = new Replacer({
                [this.ctxName]: this.context || ctx,
                [collectionKeyName]: col,
                [dbKeyName]: db

            }),
            sqlText = rp.string(operation.command)
        return getFunction(collectionKeyName, dbKeyName, sqlText)(col, db)
    }
}

module.exports = MongoActivity