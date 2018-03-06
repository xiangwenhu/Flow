{
    type: 'sequence',
    name: '天气查询演示',
    children: [{
        type: 'fetch',
        name: '查询天气',
        url: `http://www.sojson.com/open/api/weather/json.shtml?city=${encodeURIComponent('北京')}`,
        withHeaders: true
    },{
        type:'code',
        name:'存储天气数据',
        code:'ctx.data = res'
    } ]
}