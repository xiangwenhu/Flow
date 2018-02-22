const progressFactory = {
    mapping: {
        UNINITIALIZED: '未初始化',
        INITIALIZED: '初始化',
        BUILDING: '构建中',
        BUILDED: '构建完毕',
        EXECUTING: '执行中',
        EXECUTED: '执行完毕',
        EXCEPTION: '异常'
    },
    build(data, selector) {
        let childrenHTML = Array.isArray(data.children) ? this.buildChildren(data.children) : '',
            result = `
            <ul>
                <li data-id='${data.id}' class='${data.status}' data-type='${data.type}'>
                ${data.name} - ${this.mapping[data.status]} ${data.status === 'EXECUTING'? '<img src="img/loading.gif">':''}
                </li>
                ${childrenHTML}
            </ul>
        `
        if (selector) {
            document.querySelector(selector).innerHTML = result
        }
        return result
    },
    buildChildren(children) {
        if (!Array.isArray(children)) {
            return ''
        }
        return '<ul>' + children.map(child => {
            return `              
                <li data-id='${child.id}' class='${child.status}' data-type='${child.type}'>
                    ${child.name} - ${this.mapping[child.status]} ${child.status === 'EXECUTING'? '<img src="img/loading.gif">':''}
                    ${this.buildChildren(child.children)}
                </li>                
            `
        }).join('') + '</ul>'
    }
}