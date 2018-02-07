const Koa = require('koa'),
    static = require('koa-static'),
    http = require('http'),
    path = require('path'),
    koaBody = require('koa-body'),
    socketIO = require('socket.io'),
    {
        statusEmitter
    } = require('../src/common/emitter'),
    register = require('./routes'),
    ActivityFactoty = require('../src/factory/ActivityFactory'),
    flowProgress = require('../src/flow/flowProgress')


const app = new Koa()
app.use(static(path.resolve(__dirname + '/../client')))
app.use(koaBody())


/*  flow进度demo:begin   */
const server = http.createServer(app.callback()),
    io = socketIO(server)
io.on('connection', client => {
    // 客服端通知服务开始执行Flow
    client.on('invoke', (data) => {
        const activity = ActivityFactoty.get(data)
        client._aid = activity._id
        client.emit('status', activity._id, flowProgress.getProgress(activity))
        let ctx = {}
        activity.execute(ctx).then(r => {
            client.emit('finish', r, ctx)
        })
    })
})
// 接受到通过后，返回给客户端实时的执行情况    
statusEmitter.on('status', (id, flow) => {
    for (let sid in io.sockets.sockets) {
        // 仅仅传递根activity的flow情况
        if (io.sockets.sockets[sid]._aid === id) {
            io.sockets.sockets[sid].emit('status', id, flow)
        }
    }
})
/*  flow进度demo:end   */

server.listen(3001)