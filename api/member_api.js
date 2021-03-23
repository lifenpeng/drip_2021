const add_member_serve = require('../control/wxMember/addMember');
const member_info_serve = require('../control/wxMember/memberInfo');
const set_member_serve = require('../control/wxMember/setMember');

const API = [
    {
        url:'/add_member',
        method:'post',
        control:add_member_serve
    },
    {
        url:'/member_info',
        method:'post',
        control:member_info_serve
    },
    {
        url:'/set_member',
        method:'post',
        control:set_member_serve
    },      
]

module.exports = API;