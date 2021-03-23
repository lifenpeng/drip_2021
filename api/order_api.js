const order_add_serve = require('../control/wxOrder/addOrder.js');
const check_order_serve = require('../control/wxOrder/checkOrder.js');
const order_list_serve = require('../control/wxOrder/orderList');
const order_set_serve = require('../control/wxOrder/setOrder');

const API = [
    {
        url:'/order_add',
        method:'post',
        control:order_add_serve
    },
    {
        url:'/check_order',
        method:'post',
        control:check_order_serve
    },
    {
    	url:'/order_list',
    	method:'post',
    	control:order_list_serve
    },
        {
        url:'/order_set',
        method:'post',
        control:order_set_serve
    },
]

module.exports = API;