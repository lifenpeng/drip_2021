const type = Object.prototype.toString;

const code = function(code,str){
    if(type.call(code)==str){
        return true;
    }else {
        return false;
    }
}

const gettype = {
    isObject:function(data){
        return code(data,'[object Object]');
    },
    isArray:function(data){
        return code(data,'[object Array]');      
    }
}

module.exports = gettype;