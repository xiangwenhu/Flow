const progressEl = document.querySelector('#progressEl')

const socket = io()
socket.on('connection', () => {

})
socket.on('status', (id, data) => {
    renderFlow(data)
})
socket.on('finish', (r, ctx) => {  
    console.log('执行结果:', r)
    console.log('执行上下文', ctx)
})
socket.on('context', context => console.log('context:', context))

// 异常时
socket.on('err', (err, data) => {
    const d = progressFactory.markError(err, data)
    progressFactory.fromServer = true
    progressFactory.build(data, '#progressEl')
})

let areaEl = document.querySelector('#flowArea')
btnPreview.addEventListener('click', function () {
    progressFactory.fromServer = false
    progressFactory.build(eval('(' + areaEl.value.trim() + ')'), '#progressEl')
})

btnExecute.addEventListener('click', function () {
    socket.emit('invoke', eval('(' + areaEl.value.trim() + ')'))
})


function renderFlow(data) {
    progressFactory.fromServer = true
    progressFactory.build(data, '#progressEl')
}