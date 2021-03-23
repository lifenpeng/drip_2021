//捕获系统运行异常
const response_unified_processing = require('./serve_response');
const util = require('util');

const logging = require('./logging');

const error_handling = function(name,code){
    var data  = {};
    try{
        data = code();
    }catch(e){
        data = response_unified_processing(false,null,'系统错误：'+e.name);
        let log = {
            server_name:name,
            err:e.name,
            data:new Date(),
            message:util.inspect(e)//将任意对象转换 为字符串的方法
        }
        //错误信息写入日志
        logging(JSON.stringify(log));
    }finally{
        return data;
    }
}

module.exports = error_handling;