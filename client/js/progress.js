const progressEl = document.querySelector('#progressEl')

const socket = io()
socket.on('connection', () => {

})
socket.on('status', (id, data) => {
    renderFlow(data)
})
socket.on('finish', (r, ctx) => {
    console.log(r, ctx)
})

let areaEl = document.querySelector('#flowArea')
btnExecute.addEventListener('click', function () {
    socket.emit('invoke', eval('(' + areaEl.value.trim() + ')'))
})


function renderFlow(data) {
    progressFactory.build(data, '#progressEl')
}