(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{368:function(e,t,a){"use strict";function n(){}a(394),a(82),a(395);var o=a(396),c=a.n(o),i="".concat(window.location.origin,"/api");t.a=function(e){var t,a=void 0!==(t=e.custom)&&t,o=void 0===(t=e.api)?"":t,r=void 0===(t=e.type)?"POST":t,s=void 0===(t=e.data)?{}:t,u=void 0===(t=e.success)?n:t,l=void 0===(e=e.error)?n:e;return new Promise((function(e,t){c()(r,a?"".concat(o):i+o).timeout(2e5).type("application/json").withCredentials().send(s).end((function(e,a){e||!a.ok?(console.log("not 200 error msg:".concat(e)),l(e),t(e)):(a=a.text.replace(/([^\\])":(\d{15,})/g,'$1":"$2"'),a=JSON.parse(a),u(a.response))}))}))}},397:function(e,t){},647:function(e,t,a){},654:function(e,t,a){"use strict";a.r(t);var n=a(367),o=a.n(n),c=a(108),i=a.n(c),r=a(58),s=a(59),u=a(61),l=a(60),p=a(381),d=a.n(p),v=a(370),f=a.n(v),g=(n=a(425),c=a.n(n),p=a(415),v=a.n(p),n=a(0),a.n(n)),m=a(368),h=(a(379),a(361),a(362),a(647),v.a.TextArea);c.a.Dragger,f.a.Option,d.a.RangePicker,n=function(e){Object(u.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,o=new Array(n),c=0;c<n;c++)o[c]=arguments[c];return(e=t.call.apply(t,[this].concat(o))).state={},e.getData=function(){Object(m.a)({type:"POST",api:"/statistic/getSkuNameTable",data:{},success:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";console.log(t),e.setState({textAreaValue:t||[]})},error:function(){}})},e.updateSkuNameTable=function(){var t=e.state.textAreaValue;Object(m.a)({type:"POST",api:"/statistic/updateSkuNameTable",data:{sku_name:t},success:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";i.a.success("\u64cd\u4f5c\u6210\u529f"),console.log(e)},error:function(){}})},e}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.getData()}},{key:"render",value:function(){var e=this,t=this.state.textAreaValue;return g.a.createElement("div",{className:"sku-table"},g.a.createElement("h1",null,"\u5468\u62a5\u4ea7\u54c1\u8868"),g.a.createElement(h,{style:{height:"500px"},value:t,onChange:function(t){console.log(t.target.value.split(/[\s\n]/)),e.setState({textAreaValue:t.target.value})},rows:8}),g.a.createElement(o.a,{onClick:function(){e.updateSkuNameTable()},style:{marginTop:"16px"},type:"primary"},"\u4fdd\u5b58"))}}]),a}(n.PureComponent||n.Component);t.default=n}}]);
//# sourceMappingURL=13.fafb08bc.chunk.js.map