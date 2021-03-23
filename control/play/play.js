const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const https = require('https');

const serve = function(query,path,pool,res){

    const accept = {
        
    }

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            console.log("play",query);
        }
    })
}

module.exports = serve;