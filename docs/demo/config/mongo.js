{
    type: 'mongo',
    name: '获取数据',
    auth: {
        ip: '127.0.0.1',
        port: 27017
    },
    mode: 'all',
    context: {
        id1: 1,
        id3: 3
    },
    operations: [{
        db: 'testDB',
        collection: 'users',
        command: 'col.find({id: ${ctx.id1}}).toArray()',
    }, {
        db: 'testDB',
        collection: 'users',
        command: 'col.find({id: ${ctx.id3}}).toArray()',
    }]
}