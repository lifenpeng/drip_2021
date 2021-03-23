const API = require('../api/index');
const common = require('../common/common');
var bodyParser = require('body-parser');
const emptyObject = require('../common/emptyObject');

// 创建 application/json;charset=UTF-8 编码解析
var jsonParser = bodyParser.json({ extended: false })

const serve = common.router_api_Integration(API);

const router = function(app,pool){
    serve.forEach(function(item){
        app[item.method](item.url,jsonParser,function(req,res){
            item.control(emptyObject(req.body)||emptyObject(req.query)||emptyObject(req.params)||{},req.path,pool,res,req);
        })
    });
} 

module.exports =  router;