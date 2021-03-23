const play_serve = require('../control/play/play.js');

const API = [
    {
        url:'/pay',
        method:'post',
        control:play_serve
    },
]

module.exports = API;