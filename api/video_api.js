const video_add_serve = require('../control/video/video_add.js');
const video_list_serve = require('../control/video/video_list');
const video_edit_serve = require('../control/video/video_edit');
const video_delete_serve = require('../control/video/video_delete');

const API = [
    {
        url:'/video_add',
        method:'post',
        control:video_add_serve
    },
    {
        url:'/video_list',
        method:'post',
        control:video_list_serve
    },
    {
        url:'/video_edit',
        method:'post',
        control:video_edit_serve
    },
    {
        url:'/video_delete',
        method:'post',
        control:video_delete_serve
    },
]

module.exports = API;