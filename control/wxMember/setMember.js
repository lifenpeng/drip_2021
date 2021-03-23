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
        id:'',
        amount:''
    }

    console.log(query);

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);

            const sql = `select * from member where uid='${ query.id }'`;
            
            if(!code){
                pool.getConnection(function(err, connection) {
                    
                    connection.query(sql,function(error, _results, fields){
                        if(error){
                            console.log(error);
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                        }
                        if(_results){
                            console.info(_results[0]);
                            const sql1 = `UPDATE member SET amount=${parseInt(query.amount)+parseInt(_results[0].amount)},type=2  WHERE uid='${query.id}'`;;
                            connection.query(sql1,function(error, results1, fields){
                                if(error){
                                    console.log(error);
                                    res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                }
                                if(results1){
                                    if(query.orderCreate){
                                        let date = new Date();
                                        let Y = date.getFullYear();
                                        let M = (date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
                                        let D = date.getDate()>9?date.getDate():'0'+date.getDate();
                                        let h = date.getHours()>9?date.getHours():'0'+date.getHours();
                                        let m = date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
                                        let s = date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds();
                                        let timeStr = `${Y}-${M}-${D} ${h}:${m}:${s}`;
                                        let par = {
                                            uid:query.id,
                                            amount:query.amount*-1,
                                            status:2,
                                            date:new Date().getTime(),
                                            code:str(32),
                                            info:query.orderList,
                                            orderid:str(32),
                                            time:timeStr,
                                            type:1
                                        }
                                        const sql1 = "INSERT INTO orders SET ?";
                                        connection.query(sql1,par,function(error, results2, fields){
                                            if(error){
                                                console.log(error);
                                                res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                            }else{
                                                console.log(results2);
                                                res.send(JSON.stringify(response_unified_processing(true,{ status:true, code:true, amount:parseInt(query.amount)+parseInt(_results[0].amount)})));
                                                connection.release();
                                            }
                                        });
                                    }else{
                                        res.send(JSON.stringify(response_unified_processing(true,{ status:true, code:true, amount:parseInt(query.amount)+parseInt(_results[0].amount)})));
                                        connection.release();
                                    }
                                }
                            });
                        }
                    });
                });

                function str(code){
                    let str1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    let str2 = 'abcdefghijklmnopqrstuvwxyz';
                    let str3 = '123456789';
                    let str4 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    let s = '';
                    if(code==32){
                        for (var i = 0; i < 8; i++) {
                            s = s + str1[Math.floor(Math.random()*25)] + str2[Math.floor(Math.random()*25)] + str3[Math.floor(Math.random()*9)] +str4[Math.floor(Math.random()*51)];
                        }
                        return s;
                    }else{
                        for (var i = 0; i < 8; i++) {
                            s = s + str1[Math.floor(Math.random()*25)] + str2[Math.floor(Math.random()*25)] + str3[Math.floor(Math.random()*9)];
                        }
                        return s;
                    }
                }

            }else {
                res.send(JSON.stringify(code));
            } 
        }

    })
}

module.exports = serve;