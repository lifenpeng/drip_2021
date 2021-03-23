const des = require('../common/encryption_decrypt');

const token_code = function(query,pool){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            connection.query("select * from login where user="+"'"+des.encryptByDES(query.uname)+"'",function(error, results, fields){
                if(error){
                    reject(error);
                }
                if(results&&results.length>0&&results[0].token==query.token){
                     resolve(true);
                }else{
                    resolve(false);
                }
                connection.release();
            });
        });        
    });
}

module.exports = token_code;