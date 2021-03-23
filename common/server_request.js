//接收参数统一处理
const response_unified_processing = require('../common/serve_response');

//验证接口参数是否与接受参数一致
const request_unified_processing = function(sys_param,accept,pool){
    for(let v in sys_param){
        if(!accept.hasOwnProperty(v)){
            return response_unified_processing(false,null,'参数错误！');
        }
    }
}

module.exports = request_unified_processing;