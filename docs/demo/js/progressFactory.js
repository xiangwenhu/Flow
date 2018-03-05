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
    fromServer: true,
    build(data, selector) {
        if (!this.fromServer) {
            this.adjust(data)
        }
        data.status = data.status || 'UNINITIALIZED'
        let childrenHTML = Array.isArray(data.children) ? this.buildChildren(data.children) : '',
            result = `
            <ul>
                <li data-id='${data.id}' class='${data.status}' data-type='${data.type}'  title = "${ data.error?this.escape(data.error.message + data.error._stack): ''}" >
                ${data.name} - ${this.mapping[data.status]} ${data.status === 'EXECUTING'? '<img src="/demo/img/loading.gif">':''}
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
            child.status = child.status || 'UNINITIALIZED'
            return `              
                <li data-id='${child.id}' class='${child.status}' data-type='${child.type}' title = "${child.error? this.escape(child.error.message + child.error._stack): ''}">
                    ${child.name} - ${this.mapping[child.status]} ${child.status === 'EXECUTING'? '<img src="/demo/img/loading.gif">':''}
                    ${this.buildChildren(child.children)}
                </li>                
            `
        }).join('') + '</ul>'
    },
    markError(err, data) {
        if (err && err.activityId) {
            if (data.id == err.activityId) {
                data.error = err
            }
            if (Array.isArray(data.children)) {
                data.children.forEach(child => {
                    this.markError(err, child)
                })
            }
        }
        return data
    },
    escape(str) {
        if (!str) {
            return str
        }
        return str.replace(/"/g, '\\&quot;')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
    },
    adjust(data) {
        if (this.adjuster[data.type]) {
            this.adjuster[data.type](data)
        }
        if (data.children) {
            data.children.forEach(child => this.adjust(child))
        }
    },
    adjuster: {
        ifelse: function (data) {
            let children = []
            if (data.if) {
                children.push({
                    name: data.if.name,
                    children: data.if.children
                })
            }
            if (data.elseif && Array.isArray(data.elseif)) {
                data.elseif.forEach(v => {
                    children.push({
                        name: v.name,
                        children: v.children
                    })
                })
            }
            if (data.else) {
                children.push({
                    name: data.else.name,
                    children: data.else.children
                })
            }
            data.children = children
        }
    }
}