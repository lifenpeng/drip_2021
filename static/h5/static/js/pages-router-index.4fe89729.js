(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-router-index"],{"0e77":function(n,t,e){var i=e("24fb");t=i(!1),t.push([n.i,".content[data-v-b4a93798]{width:100%;height:100%}",""]),n.exports=t},"1c54":function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i={data:function(){return{navList:[{name:"视频",path:"video",icon:e("29c8")}]}},onLoad:function(){},methods:{click:function(n){uni.navigateTo({url:n+"/index",fail:function(n){console.log(n)}})}}};t.default=i},"29c8":function(n,t,e){n.exports=e.p+"static/img/video.c75e4f89.png"},"404f":function(n,t,e){"use strict";var i;e.d(t,"b",(function(){return a})),e.d(t,"c",(function(){return c})),e.d(t,"a",(function(){return i}));var a=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"content"},[e("van-grid",{attrs:{"column-num":3}},n._l(n.navList,(function(t,i){return e("van-grid-item",{key:i,attrs:{icon:t.icon,text:t.name},on:{click:function(e){arguments[0]=e=n.$handleEvent(e),n.click(t.path)}}})})),1)],1)},c=[]},"7b7f":function(n,t,e){"use strict";var i=e("f81e"),a=e.n(i);a.a},"8cfa":function(n,t,e){"use strict";e.r(t);var i=e("404f"),a=e("b027");for(var c in a)"default"!==c&&function(n){e.d(t,n,(function(){return a[n]}))}(c);e("7b7f");var o,u=e("f0c5"),r=Object(u["a"])(a["default"],i["b"],i["c"],!1,null,"b4a93798",null,!1,i["a"],o);t["default"]=r.exports},b027:function(n,t,e){"use strict";e.r(t);var i=e("1c54"),a=e.n(i);for(var c in i)"default"!==c&&function(n){e.d(t,n,(function(){return i[n]}))}(c);t["default"]=a.a},f81e:function(n,t,e){var i=e("0e77");"string"===typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);var a=e("4f06").default;a("36957d16",i,!0,{sourceMap:!1,shadowMode:!1})}}]);