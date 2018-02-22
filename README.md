# 流式任务处理
## 功能
* 配置 + 定制 集合， 让更专业的人做更专业的事。
* 可扩展
* 高复用
* 提供进度展示
* 支持人机交互
* 支持手动终止

## Activity
行为粒度最小单位，最终都是返回Promise

## 内置的Activity： 点击链接查看文档和demo  
* AllActivity   
功能类似Promise.all
* AssertActivity   
断言Activity
* AssertSequenceActivity   
满足某种条件下执行，继承于SequenceActivity
* BreakActivity   
这里的break不是终止while等语句，而是用来终止一个sequence
* CatchActivity   
错误捕捉
* CodeActivity    
代码
* DelayActivity   
延时
* FetchActivity   
类似浏览器的fetch，用的node-fetch实现
* IFElseActivity   
流程控制的if else
* InteractActivity   
人机交互
* RaceActivity  
功能类似Promose.race
* SequenceActivity   
Activity集合的容器
* TerminateActivity   
终结整个流程，现在有一个专门TerminateAction用来终止流程，原理是抛出一个Promise.reject(ActivityError), ActivityError是一层一层往外抛出到达终止流程
    当然也可以通过设置ctx，虽然context||ctx可以自己单独设置，可以合并参数
* WhileActivity
流程控制while

    

## 编码风格参考
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)



