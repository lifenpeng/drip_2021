const request_unified_processing = require('../../common/server_request');
const response_unified_processing = require('../../common/serve_response');
const error_handling = require('../../common/error_handling');
const token_check = require("../../common/token_code");
const des = require('../../common/encryption_decrypt');
let formidable = require('formidable');
let fs = require('fs');
let paths = require('path');

const upload_serve = function (query, path, pool, res, req) {

    const accept = {
        name: '',
    }

    //异常捕获处理
    error_handling(path, function () {

        upload();

        function upload() {
            //参数验证
            let code = request_unified_processing(accept, query, pool, req);

            query.uname = query.u;
            query.token = query.t;

            if (!code) {
                let savePath = null;
                let id = new Date().getTime();

                function saveFile(_res, callback) {
                    // 定义存储文件地址
                    savePath = paths.resolve(__dirname, `../../static/video/${_res.file.name}`)
                    let sourcePath = _res.file.path;

                    // 创建读写流
                    let readStream = fs.createReadStream(sourcePath);
                    let writeStream = fs.createWriteStream(savePath);
                    
                    token_check(query, pool).then(function (status) {
                        if (status) {
                            // 读写进程开始
                            readStream.pipe(writeStream);

                            // 监听读取完成事件
                            readStream.on('end', () => {
                                // 读取完成后，释放读取源文件链接
                                fs.unlinkSync(sourcePath);
                                callback();
                            });
                        } else {
                            res.send(response_unified_processing(false, null, '服务验证失败'));
                        }
                    });
                }

                let form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {

                    // 对于单个文件，这里的files直接是file对象
                    let info = files;
                    saveFile(info, (err) => {
                        if (!err) {
                            let arr = savePath.split("/");
                            arr[arr.length - 1] = `${id}.mp4`;
                            let newPath = arr.join("/");
                            fs.rename(savePath, newPath, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    pool.getConnection(function (err, connection) {
                                        
                                        let sql1 = `INSERT INTO video (id,name,url,label,des) VALUES(${id},'${des.encryptByDES(query.name)}','${des.encryptByDES(id.toString())}','${des.encryptByDES(query.label)}','${des.encryptByDES(query.desc)}')`;

                                        connection.query(sql1, function (error, results, fields) {
                                            if (error) {
                                                console.error(error);
                                                res.send(JSON.stringify(response_unified_processing(false, { status: false, message: 'sql error' })));
                                            } else {
                                                res.send(response_unified_processing(true, { status: true }));
                                                connection.release();
                                            }
                                        });
                                    });
                                }
                            })
                        }
                    })
                });

            } else {
                res.send(JSON.stringify(code));
            }
        }
    })
}

module.exports = upload_serve;