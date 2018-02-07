const fs = require('../../src/utils/fsex')

let register = async (app) => {
    let r,
        files = await fs.readdir(__dirname)
    files.forEach(file => !file.toLowerCase().endsWith('index.js')
        && (r = require('./' + file))
        && app.use(r.routes()) && app.use(r.allowedMethods())
    )
}
module.exports = register