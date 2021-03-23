const code = require('./test');

const list = [ code ];

const test = function(){
    list.forEach((event)=>{
        event();
    })
}

module.exports = test;