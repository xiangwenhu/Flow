const fs = require('fs')

module.exports = {
    readdir: dir => new Promise((resolve, reject) => fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files)))   
}