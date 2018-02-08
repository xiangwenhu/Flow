## Activity
行为粒度最小单位，最终都是返回Promise   
1. 并不是所有Activity都有children, sequence,all,ifelse, while有，都继承于sequence
2. 目前的错误捕捉，你可进行简单的代码处理，然后选择继续流程和抛出异常
3. 每个Activity变成子活动后，会有parent，pre,next属性
4. 新开发一个新的Activity需要在ActivityFactory注册，方便json对象转为Activity

## 待解决或者思考
### Level One
* 每个Activity的执行参数应该有两个，一个是ctx,一个是res， ctx表示执行上下文，res表示上一次执行的返回结果
* 错误捕捉   
    有CatchActivity, CatchActivity有一个ignore属性，表示catch是不是继续执行
    catch之后ctx和res均是catch的数据，而下一个Activity操作的执行上下文是自身的context||ctx
* 日志
    引入log4js日志，日志会一直往外抛出，但是只会记录一次
* break
    这里的break不是终止while等语句，而是用来终止一个sequnce
* terminate
    终结整个流程
    现在有一个专门TerminateAction用来终止流程，原理是抛出一个Promise.reject(ActivityError), ActivityError是一层一层往外抛出到达终止流程
    当然也可以通过设置ctx，虽然context||ctx可以自己单独设置，可以合并参数
* 进度视图
* 人机交互 
  **改进为，每次execute或者状态变更时，托管给FlowInstance去处理，处理完毕后，处理结果应该进行某些操作后，return Promise.resolve(res)**
    1. 对外通讯， 通过在Root Activity 挂载了_dispatch防范， _dispatch(activity, root)[应该是一个拷贝？属性的拷贝？]
    2. 人工终止，Root的 _global_ 添加属性
        this.activity._global_.terminateImmediate = true
        this.activity._global_.terminateMessage = message
* 超时处理
    Activity 开始执行的同时，开启计时器？ 
* 遍历死循环 

### Level Two
* 全局，私有上下文？
    1. 通过execute传递，相对麻烦， param专递不方便，改动比较大    
    2. **通过Activoty的root来实现，所有的都挂载根活动上面**
* Activity注册优化，动态注册
* 动态添加Activity的逻辑？
* 比如数据库操作时，需要打开连接，那么频繁的操作，避免每次创建新连接池
* 优化sequence的_adjust方式，通过监听数组变化

### Level Three
* 导入支持
* 类似cmd的实时消息？？


## demo
* 订餐历史查询 够呛
* 收益查询
* 我的面板


## 危险
* code里面有resolve|reject代码
* 输入的数据保密？？

## TODO
1. logger和对外的emmiter都应该已中间件的形式，类似koa或者socket.io的use形式注入， 禁止在Activity里面引入任何与活动本身无关的东西
   TODO::
2. Activity的实例化，应该设计为类似React, vue等那种属性检查的,构造函数第一个参数context, 后面为obj，然后复制到实例上
3. Activity应该提供progress进度的对外接口，利于获得实际的执行的进度？？
   OK
4. FlowManager统一对流程的管理，提供对某个流程的终止功能
5. 全局初始化支持异步，每个活动的执行前的中间件不支持异步
6. 交互处理，应该交给FlowInstance或者其他设计， 每次状态变更，Flow会获得控制权，得到参数 当前的Activity, res，    
    处理完毕后，调用Promose.resolve(res) 或者依据情况，终止流程
    Activity:
    act.execute({}).then( res =>
        return instance.dispatch(this, res)
    )
    FlowInstance:
    dispatch(activity, res){
        // TODO:: 这里可以是中间件或者blabla等等
        //  错误检查？？？
        // 记录日志
        // 对外交互
        // TODO::
        return Promose.resolve(res)
    }



## 其他说明
1. Activity 可能有children和getChildren两个方法， getChildren会优先于children, 因为设计原因，可能children不真实的反应实际的情况



TODO: + 说明：
如果代码中有该标识，说明在标识处有功能代码待编写，待实现的功能在说明中会简略说明。

FIXME: + 说明：
如果代码中有该标识，说明标识处代码需要修正，甚至代码是错误的，不能工作，需要修复，如何修正会在说明中简略说明。

XXX: + 说明：
如果代码中有该标识，说明标识处代码虽然实现了功能，但是实现的方法有待商榷，希望将来能改进，要改进的地方会在说明中简略说明。



