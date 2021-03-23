const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");

const serve = function(query,path,pool,res){

    const accept = { //无参数
    }

    //异常捕获处理
    error_handling(path,function(){
        token_check(query,pool).then(function(status){
            status?even():res.send(JSON.stringify(response_unified_processing(false,null,'服务验证失败')));
        });
        function even(){

            const sql = `select * from video`;
            
            pool.getConnection(function(err, connection) {
                
                connection.query(sql,function(error, results, fields){
                    if(error){
                        res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                    }
                    res.send(response_unified_processing(true,{ status:true, data:results }));
                    connection.release();
                });
            });
        }
    })
}

module.exports = serve;