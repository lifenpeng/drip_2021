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


app.use(express.static('static/h5'));

app.get('/video', function (req, res) {
    let code1 = req.url.split("?")[1];
    let code2 = code1&&code1.substring(2);
    if (code2) {
        fs.exists(__dirname + `/static/video/${code2}`, function (exists) {
            exists&&res.sendFile(__dirname + `/static/video/${code2}` );
        });
    }
})

app.get('/home', function (req, res) {
    res.sendFile(__dirname + `/static/h5/index.html` );
})

httpServer.listen(config.port, function () {
    console.log('node serve run at: ' + '\n' + 'local: http://127.0.0.1:' + config.port + '\n' + 'time: ' + new Date());
});


