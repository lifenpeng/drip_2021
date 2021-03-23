const express = require('express');

const app = express();

const config = require('./config/config');

const router = require('./router/router');

const pool = require('./common/mysql');

const des = require('./common/encryption_decrypt');

const test = require('./test');

var https = require('https');
var http = require('http');
var fs = require('fs');

global.dirName = __dirname;

router(app, pool);

// var options = {
//     key: fs.readFileSync('./k.key'),
//     cert: fs.readFileSync('./p.pem')
// }

// var httpsServer = https.createServer(options,app);
var httpServer = http.createServer(app);


app.use(express.static('static'));

app.get('/video', function (req, res) {
    let code1 = req.url.split("?")[1];
    let code2 = code1.split("=")[1]&&des.decryptByDES(code1.split("=")[1]);
    if (req.url && code1 && code2) {
        console.log(code2);
        fs.exists(__dirname + `/static/video/${code2}.mp4`, function (exists) {
            exists&&res.sendFile(__dirname + `/static/video/${code2}.mp4` );
        });
    }
})

httpServer.listen(config.port, function () {
    console.log('node serve run at: ' + '\n' + 'local: http://127.0.0.1:' + config.port + '\n' + 'time: ' + new Date());
});


