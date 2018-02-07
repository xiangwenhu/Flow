const progressEl = document.querySelector('#progressEl')

const factory = {
    mapping: {
        UNINITIALIZED: '未初始化',
        INITIALIZED: '初始化',
        BUILDING: '构建中',
        BUILDED: '构建完毕',
        EXECUTING: '执行中',
        EXECUTED: '执行完毕',
        EXCEPTION: '异常'
    },
    build(data) {
        let childrenHTML = Array.isArray(data.children) ? this.buildChildren(data.children) : ''
        return `
            <ul>
                <li data-id='${data.id}' class='${data.status}' data-type='${data.type}'>
                ${data.name} - ${this.mapping[data.status]} ${data.status === 'EXECUTING'? '<img src="/img/loading.gif">':''}
                </li>
                ${childrenHTML}
            </ul>
        `
    },
    buildChildren(children) {
        if (!Array.isArray(children)) {
            return ''
        }
        return '<ul>' + children.map(child => {
            return `              
                <li data-id='${child.id}' class='${child.status}' data-type='${child.type}'>
                    ${child.name} - ${this.mapping[child.status]} ${child.status === 'EXECUTING'? '<img src="/img/loading.gif">':''}
                    ${this.buildChildren(child.children)}
                </li>                
            `
        }).join('') + '</ul>'
    }
}


const socket = io()
socket.on('connection', () => {

})

socket.on('status', (id, data) => {
        renderFlow(data)    
})

let areaEl = document.querySelector('#flowArea')
btnExecute.addEventListener('click', function () {
    socket.emit('invoke', eval('(' + areaEl.value.trim() + ')'))
})


function renderFlow(data) {
    const html = factory.build(data)
    progressEl.innerHTML = html
}