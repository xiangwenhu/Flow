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




FlowInstance
1. activity生命周期内， Flow Instance能参与，各事件前后插入promise?订阅? 
    TODO:: 
    1. status的订阅，是被动的知晓
    2. 如果干预，允许插入的是promise还是仅仅是普通函数

Activity
1. 交互属性优化，具体数据类型，先一级，多级支持直接写json对象
    这个在于客户的处理，
    ```
    // type: number|string|boolean|object|date
    descriptor:{
        name: '姓名'  // 应该默认为字符串
        age:{
            type: int,
            name: '年龄'
        }
    }
    ```
2. 属性验证，简单做，先白名单，后期升级（ok）
3. 注册，扩展指定Activity文件家，和factory文件夹(ok)
   Activity:Activity的目录
    factory: Activity Factory
    props: 属性验证
    .mapping.json type特殊名字映射映射
4. 订阅返回镜像，而不是activity,只返回数据属性，不返回方法，兄弟，父亲，根等？？？
5. ctx的跟踪?
6. 进度，异常信息，上下文？?传递？?



