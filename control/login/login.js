const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token = require('../../common/token');
const des = require('../../common/encryption_decrypt');

const login_serve = function(query,path,pool,res){

    const accept = {
        username:'', //用户名
        password:'', //密码
    }

    //异常捕获处理
    error_handling(path,function(){
        
        Login();
        function Login(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);

            if(query.username=="Ykdad01URTNNQT09"){
                query.username = "lfp1170";
            }

            if(!code){
                pool.getConnection(function(err, connection) {
                    connection.query("select * from login where user="+"'"+des.encryptByDES(query.username)+"'",function(error, results, fields){
                        if(error){
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                        }
                        //返回值status 验证登陆状态  1-成功  2-用户名不存在  3-密码错误
                        results.length>0?
                        res.send(login_code(results[0],results[0].id)):
                        res.send(JSON.stringify(response_unified_processing(true,{ status:2 })));
                        connection.release();
                    });
                });

                function login_code(info,id){
                    if(des.encryptByDES(query.password)==info.password){
                        let token_code = token(20);
                        token_insert(id,token_code);
                        code = response_unified_processing(true,{ 
                            status:1,
                            token: token_code, 
                            uname:query.username,
                        });
                    }else{
                        code = response_unified_processing(true,{ status:3 });
                    }

                    return code;

                }

                function token_insert(id,token_code){
                    pool.getConnection(function(err, connection) {
                        let sql = "UPDATE login SET token="+"'"+token_code+"'"+" WHERE id="+"'"+id+"'";
                        connection.query(sql,function(error, results, fields){
                            if(error){
                                throw error;
                            }
                            if(results){
                                connection.release();
                            }
                        });
                    });
                }
        
            }else {
                res.send(JSON.stringify(code));
            }            
        }
    })
}

module.exports = login_serve;