## Action 
行为粒度最小单位，最终都是返回Promise   
要考虑break终止

## Process
流程控制, 有一个Action(assert)   
assert成功，会执行对应的Flow     
assert失败，会继续父Flow的下一个环节

## Flow 
容器，里面可以添加Action和Process


## 待解决或者思考
### Level One
* 错误捕捉   
    已经有基本处理，
* 超时处理
* 如果break Flow
    现在有一个专门BreakAction用来终止流程，原理是抛出一个Promise.reject(err), Error是一层一层往外抛出到达终止流程
* Flow和Process文件相互引用的问题
* 日志
    引入bunyan日志，日志会一直往外抛出，但是只会记录一次
* 遍历死循环 

### Level Two
* 全局，私有上下文？
* Action,Process注册优化，动态注册
* 动态添加Action，Process的逻辑？
* 比如数据库操作时，需要打开连接，那么频繁的操作，避免每次创建新连接池

### Level Three
* 导入支持
* 实时的交互



