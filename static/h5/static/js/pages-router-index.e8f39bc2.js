(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-router-index"],{"1c54":function(t,n,e){"use strict";e("ac1f"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{navList:[{name:"视频",path:"video",icon:e("29c8")}],height:0}},mounted:function(){var t=this,n=uni.createSelectorQuery().in(this);n.select(".content").boundingClientRect((function(n){t.height=n.width/3})).exec()},methods:{click:function(t){uni.navigateTo({url:t+"/index",fail:function(t){console.log(t)}})}}};n.default=i},"29c8":function(t,n,e){t.exports=e.p+"static/img/video.c75e4f89.png"},"353a":function(t,n,e){"use strict";var i;e.d(n,"b",(function(){return c})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return i}));var c=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"content"},[e("van-grid",{attrs:{"column-num":3}},t._l(t.navList,(function(n,i){return e("van-grid-item",{key:i,style:"height:"+t.height+"px;",attrs:{icon:n.icon,text:n.name},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.click(n.path)}}})})),1)],1)},a=[]},"4b10":function(t,n,e){var i=e("24fb");n=i(!1),n.push([t.i,".content[data-v-26a2fefd]{width:100%;height:100%}",""]),t.exports=n},6502:function(t,n,e){var i=e("4b10");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var c=e("4f06").default;c("cb675fcc",i,!0,{sourceMap:!1,shadowMode:!1})},"8cfa":function(t,n,e){"use strict";e.r(n);var i=e("353a"),c=e("b027");for(var a in c)"default"!==a&&function(t){e.d(n,t,(function(){return c[t]}))}(a);e("9af2");var o,u=e("f0c5"),r=Object(u["a"])(c["default"],i["b"],i["c"],!1,null,"26a2fefd",null,!1,i["a"],o);n["default"]=r.exports},"9af2":function(t,n,e){"use strict";var i=e("6502"),c=e.n(i);c.a},b027:function(t,n,e){"use strict";e.r(n);var i=e("1c54"),c=e.n(i);for(var a in i)"default"!==a&&function(t){e.d(n,t,(function(){return i[t]}))}(a);n["default"]=c.a}}]);