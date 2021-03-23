const emptyObject = function(obj){
    let code = true;
    for(let k in obj){
        code = false;
        break;
    }
    if(!code){
        return obj;
    }
}

module.exports = emptyObject;