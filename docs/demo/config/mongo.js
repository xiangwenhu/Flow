{
    type: 'mongo',
    name: '获取数据',
    auth: {
        ip: '127.0.0.1',
        port: 27017
    },
    commands: [{
        db: 'testDB',
        collection: 'users',
        operation: 'find',
        params: [{
            name: 'job'
        }]
    }]
}