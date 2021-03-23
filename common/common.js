const gettype = require('./type_code');

const common = {
    router_api_Integration:function(array){ //整合接口数据
        let arr = [];
        function Recursive(data){
            if(gettype.isArray(data)&&data.length>0){
                if(gettype.isArray(data[0])){
                    data.forEach(item => {
                        Recursive(item);
                    });
                }else if(gettype.isObject(data[0])){
                    arr = arr.concat(data);
                }
            }
        }
        Recursive(array);
        return arr;

    },
    type_code:gettype
}

module.exports = common;