const Koa = require('koa'),
    static = require('koa-static'),
    http = require('http'),
    path = require('path'),
    koaBody = require('koa-body'),
    socketIO = require('socket.io'),
    register = require('./routes'),
    ActivityFactoty = require('../src/factory/ActivityFactory'),
    getProgress = require('../src/flow/getProgress'),
    FlowManager = require('../src/flow/FlowManager'),
    FlowInstance = require('../src/flow/FlowInstance')

const app = new Koa()
app.use(static(path.resolve(__dirname + '/../client')))
app.use(koaBody())

/*  flow进度demo:begin   */
const server = http.createServer(app.callback()),
    io = socketIO(server)
io.on('connection', client => {
    // 客服端通知服务开始执行Flow
    client.on('invoke', (data) => {
        const activity = ActivityFactoty.get(data),
            instance = new FlowInstance(activity)

        // 订阅消息   
        instance.subscribe(function (activity, root) {
            client.emit('status', activity._id, instance.getProgress())
        })

        // 处理完毕后
        const ctx = {}
        instance.start(ctx).then(r => {
            client.emit('finish', r, ctx)
        })    
    })
})
/*  flow进度demo:end   */

server.listen(3001)