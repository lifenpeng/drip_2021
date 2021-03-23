const login_api = require('./login_api');
const video_api = require('./video_api');
const order_api = require('./order_api');
const member_api = require('./member_api');
const play_api = require('./play_api');
const upload = require('./upload');

const API = [
    login_api,//登陆接口
    video_api,//视频记录列表
    order_api,
    member_api,
    play_api,
    upload
];

module.exports = API;