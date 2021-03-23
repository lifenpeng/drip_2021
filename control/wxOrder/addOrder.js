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

const serve = function(query,path,pool,res){

    const accept = {
        openid:'',
        orderList:'',
        price:'',
        appid:'',
        mch_id:'',
        key:'',
        body:'',
        type:''
    }
    console.log(query);
    //异常捕获处理
    error_handling(path,function(){
        even();
        function even(){
            //参数验证
            let code = request_unified_processing(accept,query,pool);

            const sql = `select * from member where uid='${ query.openid }'`;
            
            if(!code){
                pool.getConnection(function(err, connection) {
                    
                    connection.query(sql,function(error, results, fields){
                        if(error){
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                        }
                        createOrder(res,query).then((_res)=>{
                            //console.log(res);
                            if(results[0]){
                                let par = {
                                    uid:query.openid,
                                    amount:query.price,
                                    status:1,
                                    date:new Date().getTime(),
                                    code:_res.prepay_id,
                                    info:query.orderList,
                                    orderid:_res.out_trade_no,
                                    time:_res.time,
                                    type:query.type
                                }
                                const sql1 = "INSERT INTO orders SET ?";
                                connection.query(sql1,par,function(error, results, fields){
                                    if(error){
                                        console.log(error);
                                        res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'sql error' })));
                                    }else{
                                        console.log(results);
                                        res.send(JSON.stringify(response_unified_processing(true,{ status:true, code:true, data:{ prepay_id:_res.prepay_id, out_trade_no:_res.out_trade_no } })));
                                        connection.release();
                                    }
                                });
                            }
                        }).catch((err)=>{
                            res.send(JSON.stringify(response_unified_processing(false,{ status:false, message:'下单失败', code:false })));
                        });
                    });
                });

            }else {
                res.send(JSON.stringify(code));
            } 
        }

        function createOrder(_res,query){
            let  detail = []; 
            JSON.parse(query.orderList).forEach((item)=>{
                detail.push(item.id+"-"+item.name); 
            });
            detailStr = detail.join(",")||'';
            let date = new Date();
            let Y = date.getFullYear();
            let M = (date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1);
            let D = date.getDate()>9?date.getDate():'0'+date.getDate();
            let h = date.getHours()>9?date.getHours():'0'+date.getHours();
            let m = date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
            let s = date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds();
            let time_s = `${Y}${M}${D}${h}${m}${s}`;
            let time_e = null;
            let timeStr = `${Y}-${M}-${D} ${h}:${m}:${s}`;
            if(parseInt(m)+30>59){
                h = parseInt(h) + 1;
                m = (parseInt(m) + 30) - 60;
                time_e = `${Y}${M}${D}${h}${m>9?m:'0'+m}${s}`;
            }else{
                m = parseInt(m) + 30;
                time_e = `${Y}${M}${D}${h}${m}${s}`;
            }
            console.log(time_s,time_e);
            var post_data = {
                appid:query.appid,
                body:query.body,
                detail:detailStr,
                device_info:'WEB',
                mch_id:query.mch_id,
                nonce_str:str(),
                notify_url:'https://www.kabos.cn:9999/play',
                openid:query.openid,
                out_trade_no:str(32),
                spbill_create_ip:'114.241.251.82',
                time_expire:time_e,
                time_start:time_s,
                total_fee:parseInt(query.price*100),
                trade_type:'JSAPI',
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
            let xmlParser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true}); // xml -> json

            let json2xml = jsonBuilder.buildObject(post_data);
            let xml = json2xml.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1];
            return new Promise(function(p_res,rej){
                axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder',{
                    timeout: 1000,
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8"
                    },
                    data:xml
                }).then(function(res){
                    xmlParser.parseString(res.data, function (err, result) {
                        console.log(result);
                        if(result.xml.result_code=="SUCCESS"&&result.xml.return_code=="SUCCESS"){
                            result.xml.out_trade_no = post_data.out_trade_no;
                            result.xml.time = timeStr;
                            p_res(result.xml);
                        }else{
                            rej(result.xml);
                        }
                        //console.info(result);
                       // _res.send(JSON.stringify(response_unified_processing(true,{ status:true,data:result })));
                    });
                });
            });
            
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