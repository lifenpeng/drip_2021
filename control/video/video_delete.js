const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
let fs = require('fs');

const serve = function (query, path, pool, res) {

    const accept = {
        id: '',//记录id
    }

    //异常捕获处理
    error_handling(path, function () {
        token_check(query, pool).then(function (status) {
            status ? even() : res.send(JSON.stringify(response_unified_processing(false, null, '服务验证失败')));
        });

        function even() {
            //参数验证
            let code = request_unified_processing(accept, query, pool);

            const sql = `DELETE FROM video WHERE id='${query.id}'`;

            if (!code) {
                pool.getConnection(function (err, connection) {

                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            res.send(JSON.stringify(response_unified_processing(false, { status: false, message: 'sql error' })));
                        }
                        fs.unlink(`${global.dirName}/static/video/${query.id}.mp4`, function (error) {
                            if (!error) {
                                res.send(JSON.stringify(response_unified_processing(true, { status: true })));
                                connection.release();
                            }
                        })
                    });
                });

            } else {
                res.send(JSON.stringify(code));
            }
        }
    })
}

module.exports = serve;