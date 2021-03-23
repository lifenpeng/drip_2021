const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const querystring = require('querystring');
const https = require('https');
const md5 = require('md5-node');
const xml2js = require('xml2js');
const axios = require('axios');

axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true}); // xml -> json

const serve = function(query,path,pool,res){

    const accept = {
        appid:'',
        mch_id:'',
        out_trade_no:'',
        key:'',
        order_type:''
    }

    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);
            
            if(!code){

                checkOrder(res,query).then((_res)=>{
                    console.log('..............',_res);
                    if(_res.trade_state=="SUCCESS"){
                        pool.getConnection(function(err, connection) {
                            const sql = `UPDATE orders SET status=${query.order_type==1?2:3}  WHERE orderid='${query.out_trade_no}'`;
                            connection.query(sql,function(error, results, fields){
                                if(error){
                                    console.log(error);
                                    res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                }else{
                                    console.log(results);
                                    //支付成功
                                    res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:true, data:_res })));
                                    connection.release();
                                }
                            });
                        });
                    }else if(_res.trade_state=="NOTPAY"){
                        res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:true, data:_res })));
                    }else{
                        closeOrder().then(function(c_res){
                            console.log('关闭订单信息:',c_res);
                            pool.getConnection(function(err, connection) {
                                const sql = `UPDATE orders SET status=${4}  WHERE orderid='${query.out_trade_no}'`;
                                connection.query(sql,function(error, results, fields){
                                    if(error){
                                        console.log(error);
                                        res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                    }else{
                                        console.log(results);
                                        if(c_res.err_code=='ORDERPAID'){
                                            //支付异常 订单关闭
                                            res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:true, data:_res })));
                                        }else if(c_res.err_code){
                                            //支付异常 订单关闭异常
                                            res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:false, data:_res })));
                                        }else{
                                            //支付异常 无需关闭订单
                                            res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:true, data:_res })));
                                        }
                                        connection.release();
                                    }
                                });
                            });
                        }).catch(function(err){
                            //支付异常
                            res.send(JSON.stringify(response_unified_processing(true,{ status:true, orderClose:true, data:_res })));
                        });
                    }

                }).catch((err)=>{
                    res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'支付失败', code:false })));
                });

            }else {
                res.send(JSON.stringify(code));
            } 
        }

        function checkOrder(_res,query){

            return new Promise(function(p_res,rej){
                axios.post('https://api.mch.weixin.qq.com/pay/orderquery',{
                    timeout: 1000,
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8"
                    },
                    data:detailXml()
                }).then(function(res){
                    xmlParser.parseString(res.data, function (err, result) {
                        console.log(result);
                        if(result.xml.result_code=="SUCCESS"&&result.xml.return_code=="SUCCESS"){
                            p_res(result.xml);
                        }else{
                            rej(result.xml);
                        }
                    });
                });
            });
            
        }

        function closeOrder(_res,query){
            return new Promise(function(p_res,rej){
                axios.post('https://api.mch.weixin.qq.com/pay/closeorder',{
                    timeout: 1000,
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8"
                    },
                    data:detailXml()
                }).then(function(res){
                    xmlParser.parseString(res.data, function (err, result) {
                        console.log(result);
                        if(result.xml.result_code=="SUCCESS"&&result.xml.return_code=="SUCCESS"){
                            p_res(result.xml);
                        }else{
                            rej(result.xml);
                        }
                    });
                });
            });
        }

        function detailXml(){
            var post_data = {
                appid:query.appid,
                mch_id:query.mch_id,
                nonce_str:str(),
                out_trade_no:query.out_trade_no,
            };
            let stringA = "";
            for(let k in post_data){
                stringA = stringA + `${k}=${post_data[k]}&`;
            }
            let stringSignTemp = stringA + "key="+query.key;
            const sign = md5(stringSignTemp).toUpperCase();
            post_data.sign = sign;

            let jsonBuilder = new xml2js.Builder({
               rootName:'xml',
            });

            let json2xml = jsonBuilder.buildObject(post_data);
            let xml = json2xml.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1];

            return xml;
        }

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

    })
}

module.exports = serve;