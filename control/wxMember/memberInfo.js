const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const https = require('https');

const serve = function(query,path,pool,res){

    const accept = {
        openid :'',
    }

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);
            
            if(!code){
                let sql1 = `select * from member where uid='${ query.openid }'`;
                    pool.getConnection(function(err, connection) {
                        
                        connection.query(sql1,function(error, results, fields){
                            if(error){
                                console.error(error);
                                res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                            }else{
                                console.log(results[0]);
                                res.send(JSON.stringify(response_unified_processing(true,{ status:true,data:{ amount:results[0].amount,coupon:results[0].coupon?results[0].coupon.split(','):[],type:results[0].type,admin:results[0].admin?results[0].admin:0 } })));                
                            }
                        });
                    });
            }else {
                res.send(JSON.stringify(code));
            } 
        }
    })
}

module.exports = serve;