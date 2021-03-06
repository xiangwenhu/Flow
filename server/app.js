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
app.use(static(path.resolve(__dirname + '/../docs')))
app.use(koaBody())

/*  flow进度demo:begin   */
const server = http.createServer(app.callback()),
    io = socketIO(server)
io.on('connection', client => {
    // 客服端通知服务开始执行Flow
    client.on('invoke', (data) => {
        const activity = ActivityFactoty.get(data),
            instance = new FlowInstance(activity)

        // 订阅status  
        instance.subscribe((activity, root) => client.emit('status', activity._id, instance.getProgress()))

        // 订阅context变化，现在的context变化时基于status变化的，
        instance.subscribe('context', context => client.emit('context', context))

        //订阅interact交互
        instance.subscribeInteractRequest((activity, root) => {
            if (root.getInstance() === instance) {
                // 通知我要参数
                client.emit('interact', activity.descriptor)
            }
        })
        //收到交互参数
        client.on('interact', data => {
            instance.dispatchInteractResponse(data)
        })

        // 启动并监听执行和错误
        const ctx = data.context || {}
        instance.start(ctx).then(r => {
            client.emit('finish', r, ctx)
        }).catch(err => {
            client.emit('err', err, instance.getProgress())
            console.log(err)
        })
    })
})
/*  flow进度demo:end   */

server.listen(8003)