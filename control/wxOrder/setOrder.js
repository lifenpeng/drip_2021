const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");


const serve = function(query,path,pool,res){

    const accept = {
        order_id:'',
    }

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);
            
            if(!code){

                pool.getConnection(function(err, connection) {
                    const sql = `UPDATE orders SET status=3  WHERE orderid='${query.order_id}'`;
                    connection.query(sql,function(error, results, fields){
                        if(error){
                            console.log(error);
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                        }else{
                            res.send(JSON.stringify(response_unified_processing(true,{ status:true })));
                            connection.release();
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