const upload_serve = require('../control/upload/upload.js');

const API = [
    {
        url:'/upload',
        method:'post',
        control:upload_serve
    },
]

module.exports = API;