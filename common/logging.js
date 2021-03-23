//日志记录  错误信息
const fs = require('fs');

const logging = function(text){
    console.log(text);
    text&&fs.appendFile('log/log.txt','\n'+text,function(err,data){
        if(err){
            console.error(err);
        }
    });
}

module.exports = logging;