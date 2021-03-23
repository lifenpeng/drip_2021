const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const md5 = require('md5-node');
const xml2js = require('xml2js');
const axios = require('axios');

axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const serve = function(query,path,pool,res){

    const accept = {
        id:''
    }

    console.log(query);

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);

            const sql = `select * from orders where uid='${ query.id }' order by id desc`;
            
            if(!code){
                pool.getConnection(function(err, connection) {
                    
                    connection.query(sql,function(error, results, fields){
                        if(error){
                            console.log(error);
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                        }
                        if(results){
                            console.info(results);
                            connection.release();
                            results.forEach((item)=>{
                                if(item.status==1) {
                                    let outTime = parseInt(item.date) + 1800000;
                                    let currentTime = new Date().getTime();
                                    if(outTime<parseInt(currentTime)){
                                        const sql = `UPDATE orders SET status=${4}  WHERE orderid='${item.orderid}'`;
                                        connection.query(sql,function(error, results, fields){
                                            if(error){
                                                console.log(error);
                                                res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                            }else{
                                                console.log(results);
                                                connection.release();
                                            }
                                        });
                                        item.status = 4;
                                    }
                                }
                            });
                            res.send(JSON.stringify(response_unified_processing(true,{ status:true, code:true, data:results })));
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