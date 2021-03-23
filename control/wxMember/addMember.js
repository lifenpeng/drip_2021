const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const https = require('https');

const serve = function(query,path,pool,res){

    const accept = {
        appid:'',
        secret:'',
        js_code:'',
        grant_type:'',
        name:'',
        gender:''
    }

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);
            
            if(!code){
                console.info(query);
                https.get({
                    hostname: 'api.weixin.qq.com',
                    path: `/sns/jscode2session?appid=${query.appid}&secret=${query.secret}&js_code=${query.js_code}&grant_type=${query.grant_type}`
                },function(_res){
                    var content = '';
                    _res.setEncoding('utf-8');
                    _res.on('data', function(chunk) {
                        content += chunk;
                    });
                    _res.on('end',function(){
                        let info = JSON.parse(content);
                        console.log(content);
                        let sql1 = `select * from member where uid='${ info.openid }'`;
                        pool.getConnection(function(err, connection) {
                            
                            connection.query(sql1,function(error, results, fields){
                                if(error){
                                    console.error(error);
                                    res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                }else{
                                    if(JSON.stringify(results)==='[]'){
                                        console.log(JSON.stringify(results));
                                        let sql2 = `INSERT INTO member (uid,date,name,gender,amount,coupon,type) VALUES('${info.openid }','${new Date().getTime()}','${query.name}',${query.gender},0,0,1)`;
                                        connection.query(sql2,function(error,results,fields){
                                            if(error){
                                                console.error(error);
                                                res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                            }else{
                                                res.send(JSON.stringify(response_unified_processing(true,{ status:true,data:content,code:1 })));
                                                connection.release();
                                            }
                                        });
                                    }else{
                                        res.send(JSON.stringify(response_unified_processing(true,{ status:true,data:content,code:1 })));
                                        connection.release();
                                    }
                                }
                            });
                        });
                    });
                });
            }else {
                res.send(JSON.stringify(code));
            } 
        }
    })
}

module.exports = serve;