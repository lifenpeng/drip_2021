const token = function(len){
    const str = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM';

    const length = str.length;

    let token = '';

    for(let i = 0; i < len; i++){
        let index = Math.floor(Math.random()*length); 
        token = token + str[index];
    }

    return token;
}

module.exports = token;