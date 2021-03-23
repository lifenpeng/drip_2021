//接口返回参数统一处理 
const response_unified_processing = function(code,data,message){

    //成功处理
    function success(data){
        return {
            status:true,
            info:data //返回数据
        }
    }

    //错误处理
    function err(message){
        return {
            status:false,
            message:message||'未知错误！'  //错误信息
        }
    }

    if(code){
        return success(data);
    }else {
        return err(message);
    }
}

module.exports = response_unified_processing;