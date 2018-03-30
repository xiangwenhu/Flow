## Activity
行为粒度最小单位，最终都是返回Promise   
1. 并不是所有Activity都有children, sequence,all,ifelse, while有，都继承于sequence
2. 每个Activity变成子活动后，会有root,parent,pre,next属性   
    1. root 根节点
    2. 父节点，
    3. 前面的兄弟节点
    4. 后面的兄弟节点

3. 每个Activity的执行参数应该有两个，一个是ctx,一个是res， ctx表示执行上下文，res表示上一次执行的返回结果
4. Activity 可能有children和getChildren两个方法， getChildren会优先于children, 因为设计原因，可能children不真实的反应实际的情况

## FlowInstance
Activity的实例，启动，终止和对外交互的管理者。
1. 全局，私有上下文？
    1. 通过execute传递，相对麻烦， param专递不方便，改动比较大    
    2. **通过Activoty的root来实现，所有的都挂载根活动上面**
2. 【待处理】交互处理，应该交给FlowInstance或者其他设计， 每次状态变更，Flow会获得控制权，得到参数 当前的Activity, res，    
    处理完毕后，调用Promose.resolve(res) 或者依据情况，终止流程
    Activity:
    ```
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
    ```
3. 交互属性优化，具体数据类型，先一级，多级支持直接写json对象(v1, ok)
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

## 添加新的Activity
1. 【必须】activity目录下写完XXXActivity.js
2. 【必须】activity/factory目下编写对象到Activity的工厂方法
3. 【可选】activity/props目录下XXXActivity.json，属性检查
4. 【可选】activity/.mapping.json Activity的type映射

## 错误捕捉
1. 内置有CatchActivity, CatchActivity有一个ignore属性，表示catch是不是继续执行
catch之后ctx和res均是catch的数据，而下一个Activity操作的执行上下文是自身的context||ctx

## 日志
1. 自带引入log4js日志，日志会一直往外抛出，但是只会记录一次

## 进度视图

## 人机交互

## 超时处理
1. working on it（Activity 开始执行的同时，开启计时器？ ）

## demo
* 订餐历史查询 够呛
* 收益查询
* 我的面板

## 代码中代办标识
TODO: + 说明：
如果代码中有该标识，说明在标识处有功能代码待编写，待实现的功能在说明中会简略说明。

FIXME: + 说明：
如果代码中有该标识，说明标识处代码需要修正，甚至代码是错误的，不能工作，需要修复，如何修正会在说明中简略说明。

XXX: + 说明：
如果代码中有该标识，说明标识处代码虽然实现了功能，但是实现的方法有待商榷，希望将来能改进，要改进的地方会在说明中简略说明。



* ctx的跟踪?
* mongoDB访问的Activity   
* Fetch的升级Activity  
    1. cookie的记录
    2. header的获取

## 待解决或者思考
* 死循环
* 比如数据库操作时，需要打开连接，那么频繁的操作，避免每次创建新连接池
* 优化sequence的_adjust方式，通过监听数组变化
* 导入支持
* 类似cmd的实时消息？？
* code里面有resolve|reject代码
* 输入的数据保密？？
* 订阅返回镜像，而不是activity,只返回数据属性，不返回方法，兄弟，父亲，根等？？？
* ctx的跟踪? (基于status的版本，等待升级为监听context)
* 进度，异常信息，上下文？?传递？?(ok)
* mongoDB访问的Activity 
    1. ES Next http://mongodb.github.io/node-mongodb-native/3.0/reference/ecmascriptnext/crud/
* Fetch的升级Activity  
    1. cookie的记录 ==> 通过withHeaders能获取到
    2. header的获取 ==> 通过withHeaders能获取到
* 执行前预览图 (ok)    
* 便捷的属性拷贝，不用每次添加新属性都去修改factory的方法




## 
1. 去除compose，切换sequence驱动方式为PromisePlus
2. 动态注册Activity，新增不挂机
3. 复杂场景






