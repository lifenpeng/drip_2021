const login_serve = require('../control/login/login');

const API = [
    {
        url:'/login',
        method:'post',
        control:login_serve
    }
]

module.exports = API;