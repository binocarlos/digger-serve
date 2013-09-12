/* SockJS client, version 0.3.4, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()

SockJS=function(){var a=document,b=window,c={},d=function(){};d.prototype.addEventListener=function(a,b){this._listeners||(this._listeners={}),a in this._listeners||(this._listeners[a]=[]);var d=this._listeners[a];c.arrIndexOf(d,b)===-1&&d.push(b);return},d.prototype.removeEventListener=function(a,b){if(!(this._listeners&&a in this._listeners))return;var d=this._listeners[a],e=c.arrIndexOf(d,b);if(e!==-1){d.length>1?this._listeners[a]=d.slice(0,e).concat(d.slice(e+1)):delete this._listeners[a];return}return},d.prototype.dispatchEvent=function(a){var b=a.type,c=Array.prototype.slice.call(arguments,0);this["on"+b]&&this["on"+b].apply(this,c);if(this._listeners&&b in this._listeners)for(var d=0;d<this._listeners[b].length;d++)this._listeners[b][d].apply(this,c)};var e=function(a,b){this.type=a;if(typeof b!="undefined")for(var c in b){if(!b.hasOwnProperty(c))continue;this[c]=b[c]}};e.prototype.toString=function(){var a=[];for(var b in this){if(!this.hasOwnProperty(b))continue;var c=this[b];typeof c=="function"&&(c="[function]"),a.push(b+"="+c)}return"SimpleEvent("+a.join(", ")+")"};var f=function(a){var b=this;b._events=a||[],b._listeners={}};f.prototype.emit=function(a){var b=this;b._verifyType(a);if(b._nuked)return;var c=Array.prototype.slice.call(arguments,1);b["on"+a]&&b["on"+a].apply(b,c);if(a in b._listeners)for(var d=0;d<b._listeners[a].length;d++)b._listeners[a][d].apply(b,c)},f.prototype.on=function(a,b){var c=this;c._verifyType(a);if(c._nuked)return;a in c._listeners||(c._listeners[a]=[]),c._listeners[a].push(b)},f.prototype._verifyType=function(a){var b=this;c.arrIndexOf(b._events,a)===-1&&c.log("Event "+JSON.stringify(a)+" not listed "+JSON.stringify(b._events)+" in "+b)},f.prototype.nuke=function(){var a=this;a._nuked=!0;for(var b=0;b<a._events.length;b++)delete a[a._events[b]];a._listeners={}};var g="abcdefghijklmnopqrstuvwxyz0123456789_";c.random_string=function(a,b){b=b||g.length;var c,d=[];for(c=0;c<a;c++)d.push(g.substr(Math.floor(Math.random()*b),1));return d.join("")},c.random_number=function(a){return Math.floor(Math.random()*a)},c.random_number_string=function(a){var b=(""+(a-1)).length,d=Array(b+1).join("0");return(d+c.random_number(a)).slice(-b)},c.getOrigin=function(a){a+="/";var b=a.split("/").slice(0,3);return b.join("/")},c.isSameOriginUrl=function(a,c){return c||(c=b.location.href),a.split("/").slice(0,3).join("/")===c.split("/").slice(0,3).join("/")},c.getParentDomain=function(a){if(/^[0-9.]*$/.test(a))return a;if(/^\[/.test(a))return a;if(!/[.]/.test(a))return a;var b=a.split(".").slice(1);return b.join(".")},c.objectExtend=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a};var h="_jp";c.polluteGlobalNamespace=function(){h in b||(b[h]={})},c.closeFrame=function(a,b){return"c"+JSON.stringify([a,b])},c.userSetCode=function(a){return a===1e3||a>=3e3&&a<=4999},c.countRTO=function(a){var b;return a>100?b=3*a:b=a+200,b},c.log=function(){b.console&&console.log&&console.log.apply&&console.log.apply(console,arguments)},c.bind=function(a,b){return a.bind?a.bind(b):function(){return a.apply(b,arguments)}},c.flatUrl=function(a){return a.indexOf("?")===-1&&a.indexOf("#")===-1},c.amendUrl=function(b){var d=a.location;if(!b)throw new Error("Wrong url for SockJS");if(!c.flatUrl(b))throw new Error("Only basic urls are supported in SockJS");return b.indexOf("//")===0&&(b=d.protocol+b),b.indexOf("/")===0&&(b=d.protocol+"//"+d.host+b),b=b.replace(/[/]+$/,""),b},c.arrIndexOf=function(a,b){for(var c=0;c<a.length;c++)if(a[c]===b)return c;return-1},c.arrSkip=function(a,b){var d=c.arrIndexOf(a,b);if(d===-1)return a.slice();var e=a.slice(0,d);return e.concat(a.slice(d+1))},c.isArray=Array.isArray||function(a){return{}.toString.call(a).indexOf("Array")>=0},c.delay=function(a,b){return typeof a=="function"&&(b=a,a=0),setTimeout(b,a)};var i=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,j={"\0":"\\u0000","\x01":"\\u0001","\x02":"\\u0002","\x03":"\\u0003","\x04":"\\u0004","\x05":"\\u0005","\x06":"\\u0006","\x07":"\\u0007","\b":"\\b","\t":"\\t","\n":"\\n","\x0b":"\\u000b","\f":"\\f","\r":"\\r","\x0e":"\\u000e","\x0f":"\\u000f","\x10":"\\u0010","\x11":"\\u0011","\x12":"\\u0012","\x13":"\\u0013","\x14":"\\u0014","\x15":"\\u0015","\x16":"\\u0016","\x17":"\\u0017","\x18":"\\u0018","\x19":"\\u0019","\x1a":"\\u001a","\x1b":"\\u001b","\x1c":"\\u001c","\x1d":"\\u001d","\x1e":"\\u001e","\x1f":"\\u001f",'"':'\\"',"\\":"\\\\","\x7f":"\\u007f","\x80":"\\u0080","\x81":"\\u0081","\x82":"\\u0082","\x83":"\\u0083","\x84":"\\u0084","\x85":"\\u0085","\x86":"\\u0086","\x87":"\\u0087","\x88":"\\u0088","\x89":"\\u0089","\x8a":"\\u008a","\x8b":"\\u008b","\x8c":"\\u008c","\x8d":"\\u008d","\x8e":"\\u008e","\x8f":"\\u008f","\x90":"\\u0090","\x91":"\\u0091","\x92":"\\u0092","\x93":"\\u0093","\x94":"\\u0094","\x95":"\\u0095","\x96":"\\u0096","\x97":"\\u0097","\x98":"\\u0098","\x99":"\\u0099","\x9a":"\\u009a","\x9b":"\\u009b","\x9c":"\\u009c","\x9d":"\\u009d","\x9e":"\\u009e","\x9f":"\\u009f","\xad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601","\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f","\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d","\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029","\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d","\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061","\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065","\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069","\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d","\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0","\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4","\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8","\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc","\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"},k=/[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,l,m=JSON&&JSON.stringify||function(a){return i.lastIndex=0,i.test(a)&&(a=a.replace(i,function(a){return j[a]})),'"'+a+'"'},n=function(a){var b,c={},d=[];for(b=0;b<65536;b++)d.push(String.fromCharCode(b));return a.lastIndex=0,d.join("").replace(a,function(a){return c[a]="\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4),""}),a.lastIndex=0,c};c.quote=function(a){var b=m(a);return k.lastIndex=0,k.test(b)?(l||(l=n(k)),b.replace(k,function(a){return l[a]})):b};var o=["websocket","xdr-streaming","xhr-streaming","iframe-eventsource","iframe-htmlfile","xdr-polling","xhr-polling","iframe-xhr-polling","jsonp-polling"];c.probeProtocols=function(){var a={};for(var b=0;b<o.length;b++){var c=o[b];a[c]=y[c]&&y[c].enabled()}return a},c.detectProtocols=function(a,b,c){var d={},e=[];b||(b=o);for(var f=0;f<b.length;f++){var g=b[f];d[g]=a[g]}var h=function(a){var b=a.shift();d[b]?e.push(b):a.length>0&&h(a)};return c.websocket!==!1&&h(["websocket"]),d["xhr-streaming"]&&!c.null_origin?e.push("xhr-streaming"):d["xdr-streaming"]&&!c.cookie_needed&&!c.null_origin?e.push("xdr-streaming"):h(["iframe-eventsource","iframe-htmlfile"]),d["xhr-polling"]&&!c.null_origin?e.push("xhr-polling"):d["xdr-polling"]&&!c.cookie_needed&&!c.null_origin?e.push("xdr-polling"):h(["iframe-xhr-polling","jsonp-polling"]),e};var p="_sockjs_global";c.createHook=function(){var a="a"+c.random_string(8);if(!(p in b)){var d={};b[p]=function(a){return a in d||(d[a]={id:a,del:function(){delete d[a]}}),d[a]}}return b[p](a)},c.attachMessage=function(a){c.attachEvent("message",a)},c.attachEvent=function(c,d){typeof b.addEventListener!="undefined"?b.addEventListener(c,d,!1):(a.attachEvent("on"+c,d),b.attachEvent("on"+c,d))},c.detachMessage=function(a){c.detachEvent("message",a)},c.detachEvent=function(c,d){typeof b.addEventListener!="undefined"?b.removeEventListener(c,d,!1):(a.detachEvent("on"+c,d),b.detachEvent("on"+c,d))};var q={},r=!1,s=function(){for(var a in q)q[a](),delete q[a]},t=function(){if(r)return;r=!0,s()};c.attachEvent("unload",t),c.unload_add=function(a){var b=c.random_string(8);return q[b]=a,r&&c.delay(s),b},c.unload_del=function(a){a in q&&delete q[a]},c.createIframe=function(b,d){var e=a.createElement("iframe"),f,g,h=function(){clearTimeout(f);try{e.onload=null}catch(a){}e.onerror=null},i=function(){e&&(h(),setTimeout(function(){e&&e.parentNode.removeChild(e),e=null},0),c.unload_del(g))},j=function(a){e&&(i(),d(a))},k=function(a,b){try{e&&e.contentWindow&&e.contentWindow.postMessage(a,b)}catch(c){}};return e.src=b,e.style.display="none",e.style.position="absolute",e.onerror=function(){j("onerror")},e.onload=function(){clearTimeout(f),f=setTimeout(function(){j("onload timeout")},2e3)},a.body.appendChild(e),f=setTimeout(function(){j("timeout")},15e3),g=c.unload_add(i),{post:k,cleanup:i,loaded:h}},c.createHtmlfile=function(a,d){var e=new ActiveXObject("htmlfile"),f,g,i,j=function(){clearTimeout(f)},k=function(){e&&(j(),c.unload_del(g),i.parentNode.removeChild(i),i=e=null,CollectGarbage())},l=function(a){e&&(k(),d(a))},m=function(a,b){try{i&&i.contentWindow&&i.contentWindow.postMessage(a,b)}catch(c){}};e.open(),e.write('<html><script>document.domain="'+document.domain+'";'+"</s"+"cript></html>"),e.close(),e.parentWindow[h]=b[h];var n=e.createElement("div");return e.body.appendChild(n),i=e.createElement("iframe"),n.appendChild(i),i.src=a,f=setTimeout(function(){l("timeout")},15e3),g=c.unload_add(k),{post:m,cleanup:k,loaded:j}};var u=function(){};u.prototype=new f(["chunk","finish"]),u.prototype._start=function(a,d,e,f){var g=this;try{g.xhr=new XMLHttpRequest}catch(h){}if(!g.xhr)try{g.xhr=new b.ActiveXObject("Microsoft.XMLHTTP")}catch(h){}if(b.ActiveXObject||b.XDomainRequest)d+=(d.indexOf("?")===-1?"?":"&")+"t="+ +(new Date);g.unload_ref=c.unload_add(function(){g._cleanup(!0)});try{g.xhr.open(a,d,!0)}catch(i){g.emit("finish",0,""),g._cleanup();return}if(!f||!f.no_credentials)g.xhr.withCredentials="true";if(f&&f.headers)for(var j in f.headers)g.xhr.setRequestHeader(j,f.headers[j]);g.xhr.onreadystatechange=function(){if(g.xhr){var a=g.xhr;switch(a.readyState){case 3:try{var b=a.status,c=a.responseText}catch(a){}b===1223&&(b=204),c&&c.length>0&&g.emit("chunk",b,c);break;case 4:var b=a.status;b===1223&&(b=204),g.emit("finish",b,a.responseText),g._cleanup(!1)}}},g.xhr.send(e)},u.prototype._cleanup=function(a){var b=this;if(!b.xhr)return;c.unload_del(b.unload_ref),b.xhr.onreadystatechange=function(){};if(a)try{b.xhr.abort()}catch(d){}b.unload_ref=b.xhr=null},u.prototype.close=function(){var a=this;a.nuke(),a._cleanup(!0)};var v=c.XHRCorsObject=function(){var a=this,b=arguments;c.delay(function(){a._start.apply(a,b)})};v.prototype=new u;var w=c.XHRLocalObject=function(a,b,d){var e=this;c.delay(function(){e._start(a,b,d,{no_credentials:!0})})};w.prototype=new u;var x=c.XDRObject=function(a,b,d){var e=this;c.delay(function(){e._start(a,b,d)})};x.prototype=new f(["chunk","finish"]),x.prototype._start=function(a,b,d){var e=this,f=new XDomainRequest;b+=(b.indexOf("?")===-1?"?":"&")+"t="+ +(new Date);var g=f.ontimeout=f.onerror=function(){e.emit("finish",0,""),e._cleanup(!1)};f.onprogress=function(){e.emit("chunk",200,f.responseText)},f.onload=function(){e.emit("finish",200,f.responseText),e._cleanup(!1)},e.xdr=f,e.unload_ref=c.unload_add(function(){e._cleanup(!0)});try{e.xdr.open(a,b),e.xdr.send(d)}catch(h){g()}},x.prototype._cleanup=function(a){var b=this;if(!b.xdr)return;c.unload_del(b.unload_ref),b.xdr.ontimeout=b.xdr.onerror=b.xdr.onprogress=b.xdr.onload=null;if(a)try{b.xdr.abort()}catch(d){}b.unload_ref=b.xdr=null},x.prototype.close=function(){var a=this;a.nuke(),a._cleanup(!0)},c.isXHRCorsCapable=function(){return b.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest?1:b.XDomainRequest&&a.domain?2:L.enabled()?3:4};var y=function(a,d,e){if(this===b)return new y(a,d,e);var f=this,g;f._options={devel:!1,debug:!1,protocols_whitelist:[],info:undefined,rtt:undefined},e&&c.objectExtend(f._options,e),f._base_url=c.amendUrl(a),f._server=f._options.server||c.random_number_string(1e3),f._options.protocols_whitelist&&f._options.protocols_whitelist.length?g=f._options.protocols_whitelist:(typeof d=="string"&&d.length>0?g=[d]:c.isArray(d)?g=d:g=null,g&&f._debug('Deprecated API: Use "protocols_whitelist" option instead of supplying protocol list as a second parameter to SockJS constructor.')),f._protocols=[],f.protocol=null,f.readyState=y.CONNECTING,f._ir=S(f._base_url),f._ir.onfinish=function(a,b){f._ir=null,a?(f._options.info&&(a=c.objectExtend(a,f._options.info)),f._options.rtt&&(b=f._options.rtt),f._applyInfo(a,b,g),f._didClose()):f._didClose(1002,"Can't connect to server",!0)}};y.prototype=new d,y.version="0.3.4",y.CONNECTING=0,y.OPEN=1,y.CLOSING=2,y.CLOSED=3,y.prototype._debug=function(){this._options.debug&&c.log.apply(c,arguments)},y.prototype._dispatchOpen=function(){var a=this;a.readyState===y.CONNECTING?(a._transport_tref&&(clearTimeout(a._transport_tref),a._transport_tref=null),a.readyState=y.OPEN,a.dispatchEvent(new e("open"))):a._didClose(1006,"Server lost session")},y.prototype._dispatchMessage=function(a){var b=this;if(b.readyState!==y.OPEN)return;b.dispatchEvent(new e("message",{data:a}))},y.prototype._dispatchHeartbeat=function(a){var b=this;if(b.readyState!==y.OPEN)return;b.dispatchEvent(new e("heartbeat",{}))},y.prototype._didClose=function(a,b,d){var f=this;if(f.readyState!==y.CONNECTING&&f.readyState!==y.OPEN&&f.readyState!==y.CLOSING)throw new Error("INVALID_STATE_ERR");f._ir&&(f._ir.nuke(),f._ir=null),f._transport&&(f._transport.doCleanup(),f._transport=null);var g=new e("close",{code:a,reason:b,wasClean:c.userSetCode(a)});if(!c.userSetCode(a)&&f.readyState===y.CONNECTING&&!d){if(f._try_next_protocol(g))return;g=new e("close",{code:2e3,reason:"All transports failed",wasClean:!1,last_event:g})}f.readyState=y.CLOSED,c.delay(function(){f.dispatchEvent(g)})},y.prototype._didMessage=function(a){var b=this,c=a.slice(0,1);switch(c){case"o":b._dispatchOpen();break;case"a":var d=JSON.parse(a.slice(1)||"[]");for(var e=0;e<d.length;e++)b._dispatchMessage(d[e]);break;case"m":var d=JSON.parse(a.slice(1)||"null");b._dispatchMessage(d);break;case"c":var d=JSON.parse(a.slice(1)||"[]");b._didClose(d[0],d[1]);break;case"h":b._dispatchHeartbeat()}},y.prototype._try_next_protocol=function(b){var d=this;d.protocol&&(d._debug("Closed transport:",d.protocol,""+b),d.protocol=null),d._transport_tref&&(clearTimeout(d._transport_tref),d._transport_tref=null);for(;;){var e=d.protocol=d._protocols.shift();if(!e)return!1;if(y[e]&&y[e].need_body===!0&&(!a.body||typeof a.readyState!="undefined"&&a.readyState!=="complete"))return d._protocols.unshift(e),d.protocol="waiting-for-load",c.attachEvent("load",function(){d._try_next_protocol()}),!0;if(!!y[e]&&!!y[e].enabled(d._options)){var f=y[e].roundTrips||1,g=(d._options.rto||0)*f||5e3;d._transport_tref=c.delay(g,function(){d.readyState===y.CONNECTING&&d._didClose(2007,"Transport timeouted")});var h=c.random_string(8),i=d._base_url+"/"+d._server+"/"+h;return d._debug("Opening transport:",e," url:"+i," RTO:"+d._options.rto),d._transport=new y[e](d,i,d._base_url),!0}d._debug("Skipping transport:",e)}},y.prototype.close=function(a,b){var d=this;if(a&&!c.userSetCode(a))throw new Error("INVALID_ACCESS_ERR");return d.readyState!==y.CONNECTING&&d.readyState!==y.OPEN?!1:(d.readyState=y.CLOSING,d._didClose(a||1e3,b||"Normal closure"),!0)},y.prototype.send=function(a){var b=this;if(b.readyState===y.CONNECTING)throw new Error("INVALID_STATE_ERR");return b.readyState===y.OPEN&&b._transport.doSend(c.quote(""+a)),!0},y.prototype._applyInfo=function(b,d,e){var f=this;f._options.info=b,f._options.rtt=d,f._options.rto=c.countRTO(d),f._options.info.null_origin=!a.domain;var g=c.probeProtocols();f._protocols=c.detectProtocols(g,e,b)};var z=y.websocket=function(a,d){var e=this,f=d+"/websocket";f.slice(0,5)==="https"?f="wss"+f.slice(5):f="ws"+f.slice(4),e.ri=a,e.url=f;var g=b.WebSocket||b.MozWebSocket;e.ws=new g(e.url),e.ws.onmessage=function(a){e.ri._didMessage(a.data)},e.unload_ref=c.unload_add(function(){e.ws.close()}),e.ws.onclose=function(){e.ri._didMessage(c.closeFrame(1006,"WebSocket connection broken"))}};z.prototype.doSend=function(a){this.ws.send("["+a+"]")},z.prototype.doCleanup=function(){var a=this,b=a.ws;b&&(b.onmessage=b.onclose=null,b.close(),c.unload_del(a.unload_ref),a.unload_ref=a.ri=a.ws=null)},z.enabled=function(){return!!b.WebSocket||!!b.MozWebSocket},z.roundTrips=2;var A=function(){};A.prototype.send_constructor=function(a){var b=this;b.send_buffer=[],b.sender=a},A.prototype.doSend=function(a){var b=this;b.send_buffer.push(a),b.send_stop||b.send_schedule()},A.prototype.send_schedule_wait=function(){var a=this,b;a.send_stop=function(){a.send_stop=null,clearTimeout(b)},b=c.delay(25,function(){a.send_stop=null,a.send_schedule()})},A.prototype.send_schedule=function(){var a=this;if(a.send_buffer.length>0){var b="["+a.send_buffer.join(",")+"]";a.send_stop=a.sender(a.trans_url,b,function(b,c){a.send_stop=null,b===!1?a.ri._didClose(1006,"Sending error "+c):a.send_schedule_wait()}),a.send_buffer=[]}},A.prototype.send_destructor=function(){var a=this;a._send_stop&&a._send_stop(),a._send_stop=null};var B=function(b,d,e){var f=this;if(!("_send_form"in f)){var g=f._send_form=a.createElement("form"),h=f._send_area=a.createElement("textarea");h.name="d",g.style.display="none",g.style.position="absolute",g.method="POST",g.enctype="application/x-www-form-urlencoded",g.acceptCharset="UTF-8",g.appendChild(h),a.body.appendChild(g)}var g=f._send_form,h=f._send_area,i="a"+c.random_string(8);g.target=i,g.action=b+"/jsonp_send?i="+i;var j;try{j=a.createElement('<iframe name="'+i+'">')}catch(k){j=a.createElement("iframe"),j.name=i}j.id=i,g.appendChild(j),j.style.display="none";try{h.value=d}catch(l){c.log("Your browser is seriously broken. Go home! "+l.message)}g.submit();var m=function(a){if(!j.onerror)return;j.onreadystatechange=j.onerror=j.onload=null,c.delay(500,function(){j.parentNode.removeChild(j),j=null}),h.value="",e(!0)};return j.onerror=j.onload=m,j.onreadystatechange=function(a){j.readyState=="complete"&&m()},m},C=function(a){return function(b,c,d){var e=new a("POST",b+"/xhr_send",c);return e.onfinish=function(a,b){d(a===200||a===204,"http status "+a)},function(a){d(!1,a)}}},D=function(b,d){var e,f=a.createElement("script"),g,h=function(a){g&&(g.parentNode.removeChild(g),g=null),f&&(clearTimeout(e),f.parentNode.removeChild(f),f.onreadystatechange=f.onerror=f.onload=f.onclick=null,f=null,d(a),d=null)},i=!1,j=null;f.id="a"+c.random_string(8),f.src=b,f.type="text/javascript",f.charset="UTF-8",f.onerror=function(a){j||(j=setTimeout(function(){i||h(c.closeFrame(1006,"JSONP script loaded abnormally (onerror)"))},1e3))},f.onload=function(a){h(c.closeFrame(1006,"JSONP script loaded abnormally (onload)"))},f.onreadystatechange=function(a){if(/loaded|closed/.test(f.readyState)){if(f&&f.htmlFor&&f.onclick){i=!0;try{f.onclick()}catch(b){}}f&&h(c.closeFrame(1006,"JSONP script loaded abnormally (onreadystatechange)"))}};if(typeof f.async=="undefined"&&a.attachEvent)if(!/opera/i.test(navigator.userAgent)){try{f.htmlFor=f.id,f.event="onclick"}catch(k){}f.async=!0}else g=a.createElement("script"),g.text="try{var a = document.getElementById('"+f.id+"'); if(a)a.onerror();}catch(x){};",f.async=g.async=!1;typeof f.async!="undefined"&&(f.async=!0),e=setTimeout(function(){h(c.closeFrame(1006,"JSONP script loaded abnormally (timeout)"))},35e3);var l=a.getElementsByTagName("head")[0];return l.insertBefore(f,l.firstChild),g&&l.insertBefore(g,l.firstChild),h},E=y["jsonp-polling"]=function(a,b){c.polluteGlobalNamespace();var d=this;d.ri=a,d.trans_url=b,d.send_constructor(B),d._schedule_recv()};E.prototype=new A,E.prototype._schedule_recv=function(){var a=this,b=function(b){a._recv_stop=null,b&&(a._is_closing||a.ri._didMessage(b)),a._is_closing||a._schedule_recv()};a._recv_stop=F(a.trans_url+"/jsonp",D,b)},E.enabled=function(){return!0},E.need_body=!0,E.prototype.doCleanup=function(){var a=this;a._is_closing=!0,a._recv_stop&&a._recv_stop(),a.ri=a._recv_stop=null,a.send_destructor()};var F=function(a,d,e){var f="a"+c.random_string(6),g=a+"?c="+escape(h+"."+f),i=0,j=function(a){switch(i){case 0:delete b[h][f],e(a);break;case 1:e(a),i=2;break;case 2:delete b[h][f]}},k=d(g,j);b[h][f]=k;var l=function(){b[h][f]&&(i=1,b[h][f](c.closeFrame(1e3,"JSONP user aborted read")))};return l},G=function(){};G.prototype=new A,G.prototype.run=function(a,b,c,d,e){var f=this;f.ri=a,f.trans_url=b,f.send_constructor(C(e)),f.poll=new $(a,d,b+c,e)},G.prototype.doCleanup=function(){var a=this;a.poll&&(a.poll.abort(),a.poll=null)};var H=y["xhr-streaming"]=function(a,b){this.run(a,b,"/xhr_streaming",bd,c.XHRCorsObject)};H.prototype=new G,H.enabled=function(){return b.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest&&!/opera/i.test(navigator.userAgent)},H.roundTrips=2,H.need_body=!0;var I=y["xdr-streaming"]=function(a,b){this.run(a,b,"/xhr_streaming",bd,c.XDRObject)};I.prototype=new G,I.enabled=function(){return!!b.XDomainRequest},I.roundTrips=2;var J=y["xhr-polling"]=function(a,b){this.run(a,b,"/xhr",bd,c.XHRCorsObject)};J.prototype=new G,J.enabled=H.enabled,J.roundTrips=2;var K=y["xdr-polling"]=function(a,b){this.run(a,b,"/xhr",bd,c.XDRObject)};K.prototype=new G,K.enabled=I.enabled,K.roundTrips=2;var L=function(){};L.prototype.i_constructor=function(a,b,d){var e=this;e.ri=a,e.origin=c.getOrigin(d),e.base_url=d,e.trans_url=b;var f=d+"/iframe.html";e.ri._options.devel&&(f+="?t="+ +(new Date)),e.window_id=c.random_string(8),f+="#"+e.window_id,e.iframeObj=c.createIframe(f,function(a){e.ri._didClose(1006,"Unable to load an iframe ("+a+")")}),e.onmessage_cb=c.bind(e.onmessage,e),c.attachMessage(e.onmessage_cb)},L.prototype.doCleanup=function(){var a=this;if(a.iframeObj){c.detachMessage(a.onmessage_cb);try{a.iframeObj.iframe.contentWindow&&a.postMessage("c")}catch(b){}a.iframeObj.cleanup(),a.iframeObj=null,a.onmessage_cb=a.iframeObj=null}},L.prototype.onmessage=function(a){var b=this;if(a.origin!==b.origin)return;var c=a.data.slice(0,8),d=a.data.slice(8,9),e=a.data.slice(9);if(c!==b.window_id)return;switch(d){case"s":b.iframeObj.loaded(),b.postMessage("s",JSON.stringify([y.version,b.protocol,b.trans_url,b.base_url]));break;case"t":b.ri._didMessage(e)}},L.prototype.postMessage=function(a,b){var c=this;c.iframeObj.post(c.window_id+a+(b||""),c.origin)},L.prototype.doSend=function(a){this.postMessage("m",a)},L.enabled=function(){var a=navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Konqueror")!==-1;return(typeof b.postMessage=="function"||typeof b.postMessage=="object")&&!a};var M,N=function(a,d){parent!==b?parent.postMessage(M+a+(d||""),"*"):c.log("Can't postMessage, no parent window.",a,d)},O=function(){};O.prototype._didClose=function(a,b){N("t",c.closeFrame(a,b))},O.prototype._didMessage=function(a){N("t",a)},O.prototype._doSend=function(a){this._transport.doSend(a)},O.prototype._doCleanup=function(){this._transport.doCleanup()},c.parent_origin=undefined,y.bootstrap_iframe=function(){var d;M=a.location.hash.slice(1);var e=function(a){if(a.source!==parent)return;typeof c.parent_origin=="undefined"&&(c.parent_origin=a.origin);if(a.origin!==c.parent_origin)return;var e=a.data.slice(0,8),f=a.data.slice(8,9),g=a.data.slice(9);if(e!==M)return;switch(f){case"s":var h=JSON.parse(g),i=h[0],j=h[1],k=h[2],l=h[3];i!==y.version&&c.log('Incompatibile SockJS! Main site uses: "'+i+'", the iframe:'+' "'+y.version+'".');if(!c.flatUrl(k)||!c.flatUrl(l)){c.log("Only basic urls are supported in SockJS");return}if(!c.isSameOriginUrl(k)||!c.isSameOriginUrl(l)){c.log("Can't connect to different domain from within an iframe. ("+JSON.stringify([b.location.href,k,l])+")");return}d=new O,d._transport=new O[j](d,k,l);break;case"m":d._doSend(g);break;case"c":d&&d._doCleanup(),d=null}};c.attachMessage(e),N("s")};var P=function(a,b){var d=this;c.delay(function(){d.doXhr(a,b)})};P.prototype=new f(["finish"]),P.prototype.doXhr=function(a,b){var d=this,e=(new Date).getTime(),f=new b("GET",a+"/info"),g=c.delay(8e3,function(){f.ontimeout()});f.onfinish=function(a,b){clearTimeout(g),g=null;if(a===200){var c=(new Date).getTime()-e,f=JSON.parse(b);typeof f!="object"&&(f={}),d.emit("finish",f,c)}else d.emit("finish")},f.ontimeout=function(){f.close(),d.emit("finish")}};var Q=function(b){var d=this,e=function(){var a=new L;a.protocol="w-iframe-info-receiver";var c=function(b){if(typeof b=="string"&&b.substr(0,1)==="m"){var c=JSON.parse(b.substr(1)),e=c[0],f=c[1];d.emit("finish",e,f)}else d.emit("finish");a.doCleanup(),a=null},e={_options:{},_didClose:c,_didMessage:c};a.i_constructor(e,b,b)};a.body?e():c.attachEvent("load",e)};Q.prototype=new f(["finish"]);var R=function(){var a=this;c.delay(function(){a.emit("finish",{},2e3)})};R.prototype=new f(["finish"]);var S=function(a){if(c.isSameOriginUrl(a))return new P(a,c.XHRLocalObject);switch(c.isXHRCorsCapable()){case 1:return new P(a,c.XHRLocalObject);case 2:return new P(a,c.XDRObject);case 3:return new Q(a);default:return new R}},T=O["w-iframe-info-receiver"]=function(a,b,d){var e=new P(d,c.XHRLocalObject);e.onfinish=function(b,c){a._didMessage("m"+JSON.stringify([b,c])),a._didClose()}};T.prototype.doCleanup=function(){};var U=y["iframe-eventsource"]=function(){var a=this;a.protocol="w-iframe-eventsource",a.i_constructor.apply(a,arguments)};U.prototype=new L,U.enabled=function(){return"EventSource"in b&&L.enabled()},U.need_body=!0,U.roundTrips=3;var V=O["w-iframe-eventsource"]=function(a,b){this.run(a,b,"/eventsource",_,c.XHRLocalObject)};V.prototype=new G;var W=y["iframe-xhr-polling"]=function(){var a=this;a.protocol="w-iframe-xhr-polling",a.i_constructor.apply(a,arguments)};W.prototype=new L,W.enabled=function(){return b.XMLHttpRequest&&L.enabled()},W.need_body=!0,W.roundTrips=3;var X=O["w-iframe-xhr-polling"]=function(a,b){this.run(a,b,"/xhr",bd,c.XHRLocalObject)};X.prototype=new G;var Y=y["iframe-htmlfile"]=function(){var a=this;a.protocol="w-iframe-htmlfile",a.i_constructor.apply(a,arguments)};Y.prototype=new L,Y.enabled=function(){return L.enabled()},Y.need_body=!0,Y.roundTrips=3;var Z=O["w-iframe-htmlfile"]=function(a,b){this.run(a,b,"/htmlfile",bc,c.XHRLocalObject)};Z.prototype=new G;var $=function(a,b,c,d){var e=this;e.ri=a,e.Receiver=b,e.recv_url=c,e.AjaxObject=d,e._scheduleRecv()};$.prototype._scheduleRecv=function(){var a=this,b=a.poll=new a.Receiver(a.recv_url,a.AjaxObject),c=0;b.onmessage=function(b){c+=1,a.ri._didMessage(b.data)},b.onclose=function(c){a.poll=b=b.onmessage=b.onclose=null,a.poll_is_closing||(c.reason==="permanent"?a.ri._didClose(1006,"Polling error ("+c.reason+")"):a._scheduleRecv())}},$.prototype.abort=function(){var a=this;a.poll_is_closing=!0,a.poll&&a.poll.abort()};var _=function(a){var b=this,d=new EventSource(a);d.onmessage=function(a){b.dispatchEvent(new e("message",{data:unescape(a.data)}))},b.es_close=d.onerror=function(a,f){var g=f?"user":d.readyState!==2?"network":"permanent";b.es_close=d.onmessage=d.onerror=null,d.close(),d=null,c.delay(200,function(){b.dispatchEvent(new e("close",{reason:g}))})}};_.prototype=new d,_.prototype.abort=function(){var a=this;a.es_close&&a.es_close({},!0)};var ba,bb=function(){if(ba===undefined)if("ActiveXObject"in b)try{ba=!!(new ActiveXObject("htmlfile"))}catch(a){}else ba=!1;return ba},bc=function(a){var d=this;c.polluteGlobalNamespace(),d.id="a"+c.random_string(6,26),a+=(a.indexOf("?")===-1?"?":"&")+"c="+escape(h+"."+d.id);var f=bb()?c.createHtmlfile:c.createIframe,g;b[h][d.id]={start:function(){g.loaded()},message:function(a){d.dispatchEvent(new e("message",{data:a}))},stop:function(){d.iframe_close({},"network")}},d.iframe_close=function(a,c){g.cleanup(),d.iframe_close=g=null,delete b[h][d.id],d.dispatchEvent(new e("close",{reason:c}))},g=f(a,function(a){d.iframe_close({},"permanent")})};bc.prototype=new d,bc.prototype.abort=function(){var a=this;a.iframe_close&&a.iframe_close({},"user")};var bd=function(a,b){var c=this,d=0;c.xo=new b("POST",a,null),c.xo.onchunk=function(a,b){if(a!==200)return;for(;;){var f=b.slice(d),g=f.indexOf("\n");if(g===-1)break;d+=g+1;var h=f.slice(0,g);c.dispatchEvent(new e("message",{data:h}))}},c.xo.onfinish=function(a,b){c.xo.onchunk(a,b),c.xo=null;var d=a===200?"network":"permanent";c.dispatchEvent(new e("close",{reason:d}))}};return bd.prototype=new d,bd.prototype.abort=function(){var a=this;a.xo&&(a.xo.close(),a.dispatchEvent(new e("close",{reason:"user"})),a.xo=null)},y.getUtils=function(){return c},y.getIframeTransport=function(){return L},y}(),"_sockjs_onload"in window&&setTimeout(_sockjs_onload,1),typeof define=="function"&&define.amd&&define("sockjs",[],function(){return SockJS})

//^^^ Sockets - Digger


require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;

function isPlainObject(obj) {
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval)
		return false;

	var has_own_constructor = hasOwnProperty.call(obj, 'constructor');
	var has_is_property_of_method = hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method)
		return false;

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
	    target = arguments[0] || {},
	    i = 1,
	    length = arguments.length,
	    deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],2:[function(require,module,exports){
var hat = module.exports = function (bits, base) {
    if (!base) base = 16;
    if (bits === undefined) bits = 128;
    if (bits <= 0) return '0';
    
    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }
    
    var rem = digits - Math.floor(digits);
    
    var res = '';
    
    for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }
    
    if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }
    
    var parsed = parseInt(res, base);
    if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base)
    }
    else return res;
};

hat.rack = function (bits, base, expandBy) {
    var fn = function (data) {
        var iters = 0;
        do {
            if (iters ++ > 10) {
                if (expandBy) bits += expandBy;
                else throw new Error('too many ID collisions, use more bits')
            }
            
            var id = hat(bits, base);
        } while (Object.hasOwnProperty.call(hats, id));
        
        hats[id] = data;
        return id;
    };
    var hats = fn.hats = {};
    
    fn.get = function (id) {
        return fn.hats[id];
    };
    
    fn.set = function (id, value) {
        fn.hats[id] = value;
        return fn;
    };
    
    fn.bits = bits || 128;
    fn.base = base || 16;
    return fn;
};

},{}],3:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var extend = require('extend');
var hat = require('hat');
var utils = module.exports = {};

/**
 * generate a new global id
 */

utils.diggerid = function(){
  return hat();
}

utils.littleid = function(chars){

  chars = chars || 6;

  var pattern = '';

  for(var i=0; i<chars; i++){
    pattern += 'x';
  }
  
  return pattern.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * takes a string and prepares it to be used in a RegExp itself
 */

utils.escapeRegexp = function(search){
  return search.replace(/([\!\$\(\)\*\+\.\/\:\=\?\[\\\]\^\{\|\}])/g, "\\$1");
}

/*

  return a pure JS version of a HTTP request
  
*/
utils.json_request = function(req){
  return {
    method:req.method.toLowerCase(),
    url:req.url,
    body:req.body,
    headers:req.headers
  }
}

/*

  is arr actually an array
  
*/
utils.isArray = function(arr){
  return Object.prototype.toString.call(arr) == '[object Array]';
}

/*

  return an array version of arguments
  
*/
utils.toArray = function(args){
  return Array.prototype.slice.call(args, 0);
}

/**
 * jQuery Deep extend
 */

utils.extend = extend;
},{"extend":1,"hat":2}],4:[function(require,module,exports){
//
// Dotty makes it easy to programmatically access arbitrarily nested objects and
// their properties.
//

//
// `object` is an object, `path` is the path to the property you want to check
// for existence of.
//
// `path` can be provided as either a `"string.separated.with.dots"` or as
// `["an", "array"]`.
//
// Returns `true` if the path can be completely resolved, `false` otherwise.
//

var exists = module.exports.exists = function exists(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    return Object.hasOwnProperty.apply(object, [key]);
  } else {
    return exists(object[key], path);
  }
};

//
// These arguments are the same as those for `exists`.
//
// The return value, however, is the property you're trying to access, or
// `undefined` if it can't be found. This means you won't be able to tell
// the difference between an unresolved path and an undefined property, so you 
// should not use `get` to check for the existence of a property. Use `exists`
// instead.
//

var get = module.exports.get = function get(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return;
  }

  if (path.length === 0) {
    return object[key];
  }

  if (path.length) {
    return get(object[key], path);
  }
};

//
// Arguments are similar to `exists` and `get`, with the exception that path
// components are regexes with some special cases. If a path component is `"*"`
// on its own, it'll be converted to `/.*/`.
//
// The return value is an array of values where the key path matches the
// specified criterion. If none match, an empty array will be returned.
//

var search = module.exports.search = function search(object, path) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return;
  }

  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return;
  }

  if (key === "*") {
    key = ".*";
  }

  if (typeof key === "string") {
    key = new RegExp(key);
  }

  if (path.length === 0) {
    return Object.keys(object).filter(key.test.bind(key)).map(function(k) { return object[k]; });
  } else {
    return Array.prototype.concat.apply([], Object.keys(object).filter(key.test.bind(key)).map(function(k) { return search(object[k], path); }));
  }
};

//
// The first two arguments for `put` are the same as `exists` and `get`.
//
// The third argument is a value to `put` at the `path` of the `object`.
// Objects in the middle will be created if they don't exist, or added to if
// they do. If a value is encountered in the middle of the path that is *not*
// an object, it will not be overwritten.
//
// The return value is `true` in the case that the value was `put`
// successfully, or `false` otherwise.
//

var put = module.exports.put = function put(object, path, value) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }
  
  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    object[key] = value;
  } else {
    if (typeof object[key] === "undefined") {
      object[key] = {};
    }

    if (typeof object[key] !== "object" || object[key] === null) {
      return false;
    }

    return put(object[key], path, value);
  }
};

//
// `remove` is like `put` in reverse!
//
// The return value is `true` in the case that the value existed and was removed
// successfully, or `false` otherwise.
//

var remove = module.exports.remove = function remove(object, path, value) {
  if (typeof path === "string") {
    path = path.split(".");
  }

  if (!(path instanceof Array) || path.length === 0) {
    return false;
  }
  
  path = path.slice();

  var key = path.shift();

  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (path.length === 0) {
    if (!Object.hasOwnProperty.call(object, key)) {
      return false;
    }

    delete object[key];

    return true;
  } else {
    return remove(object[key], path, value);
  }
};

//
// `deepKeys` creates a list of all possible key paths for a given object.
//
// The return value is always an array, the members of which are paths in array
// format. If you want them in dot-notation format, do something like this:
//
// ```js
// dotty.deepKeys(obj).map(function(e) {
//   return e.join(".");
// });
// ```
//
// *Note: this will probably explode on recursive objects. Be careful.*
//

var deepKeys = module.exports.deepKeys = function deepKeys(object, prefix) {
  if (typeof prefix === "undefined") {
    prefix = [];
  }

  var keys = [];

  for (var k in object) {
    if (!Object.hasOwnProperty.call(object, k)) {
      continue;
    }

    keys.push(prefix.concat([k]));

    if (typeof object[k] === "object" && object[k] !== null) {
      keys = keys.concat(deepKeys(object[k], prefix.concat([k])));
    }
  }

  return keys;
};

},{}],5:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var Proto = require('./proto');

module.exports = function(tag, data){
	return Proto.factory(tag, data);
}

module.exports.proto = Proto;

/*

	add extra functions to the container prototype

	this means we can create different browser builds capable of different things
	
*/
module.exports.augment_prototype = function(api){
	for(var prop in api){
		Proto.prototype[prop] = api[prop];
	}
}
},{"./proto":6}],6:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/
var EventEmitter = require('events').EventEmitter;
var dotty = require('dotty');
var util = require('util');
var utils = require('digger-utils');

function Container(){}

/*

	Factory for new containers
	
*/
function factory(){

	/*
  
    first let's extract the model data
    
  */
  var models = [];

  if(typeof(arguments[0])==='string'){
    var string = arguments[0];
    var c = string.charAt(0);
    if(c==='{' || c==='['){
      var data = JSON.parse(string);
      if(c==='{'){
        data = [data];
      }
      models = data;
    }
    else{
      var model = arguments[1] || {};
      var digger = model._digger || {};
      digger.tag = string;
      model._digger = digger;
      models = [model];  
    }
    
  }
  else if(Object.prototype.toString.call(arguments[0]) == '[object Array]'){  
    models = arguments[0];
  }
  else if(typeof arguments[0]==='object'){
    models = [arguments[0]];
  }

  if(models[0]===undefined || models[0]===null){
    models = [];
  }

  var instance = function container(){
    if(!instance.select){
      throw new Error('there is no select method attached to this container');
    }
    var args = [arguments[0]];
    if(arguments.length>1){
      args.push(arguments[1]);
    }
    return instance.select.apply(instance, args);
  }

  /*
  
    ensure each model has a _digger property and an id
    
  */
  function process_model(model){

  }

  instance.__proto__ = Container.prototype;
  instance.build(models);
  
  return instance;
}

/*

	expose
	
*/
Container.factory = factory;

util.inherits(Container, EventEmitter);

module.exports = Container;


/*

	prototype
	
*/
Container.prototype.build = function(models){

	this.models = models || [];

  function process_model(model){
    if(!model._digger){
      model._digger = {};
    }
    if(!model._digger.diggerid){
      model._digger.diggerid = utils.diggerid();
    }
    if(model._children){
      model._children.forEach(process_model);
    }
  }

  this.models.forEach(process_model);

  return this;
}

Container.prototype.toJSON = function(){
  return this.models;
}

/*

	iterators

*/

Container.prototype.spawn = function(models){
  models = models || [];
	var container = Container.factory(models);
  if(this.supplychain){
    container.supplychain = this.supplychain;  
  }
	return container;
}

Container.prototype.clone = function(){
  var data = JSON.parse(JSON.stringify(this.models));

  var ret = this.spawn(data);

  ret.recurse(function(des){
  	var model = des.get(0);
  	var digger = model._digger || {};
  	digger.diggerid = utils.diggerid();
  	model._digger = digger;
  })
  ret.ensure_parent_ids();
  return ret;
}

Container.prototype.ensure_parent_ids = function(parent){

  var self = this;

  if(parent){
  	this.each(function(c){
  		c.diggerparentid(parent.diggerid());
  	})
  }

  this.children().each(function(child){
    child.ensure_parent_ids(self);
  })
}

Container.prototype.inject_paths = function(basepath){

  this.diggerpath(basepath);

  this.children().each(function(child, index){
    child.inject_paths(basepath.concat([index]));
  })

}

Container.prototype.ensure_meta = function(done){
  if(!this.diggerid()){
    this.diggerid(utils.diggerid());
  }

  var topcounter = 0;
  if(this.diggerpath().length<=0){
    this.inject_paths([topcounter]);
    topcounter++;
  }

  this.ensure_parent_ids();
  return this;
}


Container.prototype.children = function(){
  var models = [];
  var self = this;
  this.each(function(container){
    models = models.concat(container.get(0)._children || []);
  })
	return this.spawn(models);
}

Container.prototype.recurse = function(fn){
  this.descendents().each(fn);
  return this;
}

Container.prototype.descendents = function(){
  var ret = [];

  function scoopmodels(container){
    ret = ret.concat(container.models);
    container.children().each(scoopmodels);
  }

  scoopmodels(this);

  return this.spawn(ret);
}

Container.prototype.containers = function(){
  var self = this;
  return this.models.map(function(model){
    var ret = self.spawn([model]);
    ret['$$hashKey'] = model._digger.diggerid;
    return ret;
  })
}

Container.prototype.skeleton = function(){
  return this.models.map(function(model){
    return model._digger || {};
  })
}

Container.prototype.add = function(container){
  var self = this;
  
  if(!container){
    return this;
  }
  
  if(Object.prototype.toString.call(container) == '[object Array]'){
    container.forEach(function(c){
      self.add(c);
    })
    
  }
  else{
    this.models = this.models.concat(container.models);
  }
  return this;
}


Container.prototype.each = function(fn){
	this.containers().forEach(fn);
	return this;
}

Container.prototype.map = function(fn){
	return this.containers().map(fn);
}

Container.prototype.count = function(){
	return this.models.length;
}

Container.prototype.first = function(){
	return this.eq(0);
}

Container.prototype.last = function(){
	return this.eq(this.count()-1);
}

Container.prototype.eq = function(index){
	return this.spawn(this.get(index));
}

Container.prototype.get = function(index){
	return this.models[index];
}

/*

	properties
	
*/


function valuereader(model, name){
  if(!name){
  	return model;
  }
  return dotty.get(model, name);
}

function valuesetter(model, value, name){
	if(!name){
  	return value;
  }
  dotty.put(model, name, value);
  return value;
}

function makepath(path, base){
	var parts = [path];
	if(base){
		parts.unshift(base);
	}
	return parts.join('.');
}

function wrapper(basepath){
	return function(path, val){
		var self = this;
		if(arguments.length<=0){
      if(self.isEmpty()){
        return null;
      }
			return valuereader(self.get(0), basepath);
		}
		else if(arguments.length===1 && typeof(path)==='string'){
      if(self.isEmpty()){
        return null;
      }
			return valuereader(self.get(0), makepath(path, basepath));
		}
		else if(arguments.length===1){
			self.models.forEach(function(model){
				valuesetter(model, val, basepath);
			})
			return self;
		}
		else if(arguments.length>1){
			var usepath = makepath(path, basepath);
			self.models.forEach(function(model){
				valuesetter(model, val, usepath);
			})
			return self;
		}
	}
}

function property_wrapper(basepath, property){
	return function(val){

		var self = this;
		if(arguments.length<=0){
      if(self.isEmpty()){
        return null;
      }
			var model = dotty.get(self.get(0), basepath);
			return model[property];
		}
		else{
      if(!self.isEmpty()){
        self.models.forEach(function(model){
          var basemodel = dotty.get(model, basepath);
          basemodel[property] = val;
        })  
      }
			
			return self;
		}
	}
}

function remove_wrapper(basepath){
	return function(path){
		var self = this;
		var usepath = makepath(path, basepath);
		self.models.forEach(function(model){
			dotty.remove(model, usepath);
		})	
		return self;
	}	
}


Container.prototype.attr = wrapper();
Container.prototype.digger = wrapper('_digger');
Container.prototype.data = wrapper('_digger.data');

// a symlink means we always replace
// we add a symlink header which replaces this container with
// another in the contract resolve chain
Container.prototype.symlink = function(target, selector){
  var links = this.digger('symlinks') || {};
  var hasselector = arguments.length>1;

  // target is a warehouse string
  // selector is an optional selector
  if(typeof(target)==='string'){
    links['symlink:' + target + (selector ? '/' + selector : '')] = {
      type:'symlink',
      warehouse:target,
      selector:selector
    }
  }
  else{
    target.each(function(t){
      links['symlink:' + t.diggerwarehouse() + '/' + t.diggerid() + (selector ? '/' + selector : '')] = {
        type:'symlink',
        warehouse:t.diggerwarehouse(),
        diggerid:t.diggerid(),
        selector:selector
      }
    })  
  }
  
  this.digger('symlinks', links);
  return this;
}

function attrlink(listmode){
  return function(field, target, selector){
    var links = this.digger('symlinks') || {};
    var hasselector = arguments.length>1;

    // target is a warehouse string
    // selector is an optional selector
    if(typeof(target)==='string'){
      links['attr:' + target + (selector ? '/' + selector : '') + ':' + field] = {
        type:'attr',
        field:field,
        listmode:listmode,
        warehouse:target,
        selector:selector
      }
    }
    else{
      target.each(function(t){
        links['attr:' + t.diggerwarehouse() + '/' + t.diggerid() + (selector ? '/' + selector : '') + ':' + field] = {
          type:'attr',
          field:field,
          listmode:listmode,
          warehouse:t.diggerwarehouse(),
          diggerid:t.diggerid(),
          selector:selector
        }
      })  
    }
    
    this.digger('symlinks', links);
    return this;
  }
}

Container.prototype.attrlink = attrlink();
Container.prototype.attrlistlink = attrlink(true);

Container.prototype.diggerid = property_wrapper('_digger', 'diggerid');
Container.prototype.diggerparentid = property_wrapper('_digger', 'diggerparentid');
Container.prototype.diggerwarehouse = property_wrapper('_digger', 'diggerwarehouse');
var pathwrapper = property_wrapper('_digger', 'diggerpath');
Container.prototype.diggerpath = function(){
  var ret = pathwrapper.apply(this, utils.toArray(arguments));

  if(!utils.isArray(ret)){
    ret = [];
  }

  return ret;
}


var headerwrapper = property_wrapper('_digger', 'diggerbranch');
Container.prototype.diggerbranch = function(){
  var ret = branchwrapper.apply(this, utils.toArray(arguments));

  if(!utils.isArray(ret)){
    ret = [];
  }

  return ret;
}

Container.prototype.addBranch = function(where){
  var self = this;
  var branches = this.diggerbranch();
  where.each(function(container){
    branches.push(container.diggerurl());
  })
  this.diggerbranch(branches);
  return this;
}

Container.prototype.removeBranch = function(where){
  var self = this;
  var branches = this.diggerbranch();

  where.each(function(container){

    var newbranches = [];
    for(var i=0; i<branches.length; i++){
      if(branches[i]!=container.diggerurl()){
        newbranches.push(branches[i]);
      }
    }
    branches = newbranches;
  })
  this.diggerbranch(branches);
  return this;
}

Container.prototype.id = property_wrapper('_digger', 'id');
Container.prototype.tag = property_wrapper('_digger', 'tag');
Container.prototype.classnames = property_wrapper('_digger', 'class');

Container.prototype.removeAttr = remove_wrapper();
Container.prototype.removeDigger = remove_wrapper('_digger');
Container.prototype.removeData = remove_wrapper('_digger.data');

Container.prototype.is = function(tag){
  return this.tag()==tag;
}

Container.prototype.addClass = function(classname){
  var self = this;
  this.models.forEach(function(model){
    var classnames = model._digger.class || [];
    var found = false;
    classnames.forEach(function(c){
    	if(c==classname){
    		found = true;
    	}
    })
    if(!found){
    	classnames.push(classname);	
    }
    model._digger.class = classnames;
  })
  return this;
}

Container.prototype.removeClass = function(classname){
  var self = this;
  this.models.forEach(function(model){
    var classnames = model._digger.class || [];
    var newclassnames = [];
    classnames.forEach(function(c){
    	if(c!=classname){
    		newclassnames.push(c);
    	}
    })
    model._digger.class = newclassnames;
  })
  return this;
}

Container.prototype.hasClass = function(classname){
	var found = false;
	(this.classnames() || []).forEach(function(c){
		if(c==classname){
			found = true;
		}
	})
  return found;
}

Container.prototype.hasAttr = function(name){
	var prop = this.attr(name);
	return prop!==null;
}

Container.prototype.isEmpty = function(){
  return this.count()===0;
}

Container.prototype.inject_data = function(data){
	this.models.forEach(function(model){
		utils.extend(model, data);
	})
  return this;
}


Container.prototype.diggerurl = function(){
  var warehouse = this.diggerwarehouse();
  var id = this.diggerid();

  var url = warehouse || '/';

  if(id && this.tag()!='_supplychain'){
    if(warehouse!='/'){
      url += '/';
    }

    url += id;
  }
  
  return url.replace(/\/\//g, '/');
}

/*

	summary methods
	
*/

Container.prototype.title = function(){
  var name = this.attr('name');
  if(!name){
    name = this.attr('title');
  }
  if(!name){
    name = this.tag();
  }
  return name;
}

Container.prototype.summary = function(options){

  options = options || {};

  var parts = [];

  var title = (this.attr('name') || this.attr('title') || '')
  if(title.length>0 && options.title!==false){
    parts.push(title + ': ');
  }

  parts.push(this.tag());

  var id = this.id() || '';
  if(id.length>0){
    parts.push('#' + id);
  }

  var classnames = this.classnames() || [];
  if(classnames.length>0){
    classnames.forEach(function(classname){
      if(classname.match(/\w/)){
        parts.push('.' + classname.replace(/^\s+/, '').replace(/\s+$/, ''));
      }
    })
  }

  // have each summary unique
  parts.push('=' + this.diggerid().substr(0,6) + '...');

  return parts.join('');
}

Container.prototype.toString = function(){
  return this.summary();
}

// assumes the models are actually a flat list of what
// could become a tree
// we use the utils.combine_tree_results to do this
// and return the spawned result
Container.prototype.combine_tree = function(){
  this.models = utils.combine_tree_results(this.models);
  return this;
}
},{"digger-utils":3,"dotty":4,"events":36,"util":37}],7:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

module.exports = parse;
module.exports.mini = miniparse;

/*
  Quarry.io Selector
  -------------------

  Represents a CSS selector that will be passed off to selectors or perform in-memory search

 */

/***********************************************************************************
 ***********************************************************************************
  Here is the  data structure:

  "selector": " > * product.onsale[price<100] > img caption.red, friend",
  "phases":
    [
      [
          {
              "splitter": ">",
              "tag": "*"
          },
          {
              "splitter": "",
              "tag": "product",
              "classnames": {
                  "onsale": true
              },
              "attr": [
                  {
                      "field": "price",
                      "operator": "<",
                      "value": "100"
                  }
              ]
          },
          {
              "splitter": ">",
              "tag": "img"
          },
          {
              "splitter": "",
              "tag": "caption",
              "classnames": {
                  "red": true
              }
          }
      ],
      [
          {
              "tag": "friend"
          }
      ]
    ]

 */

/*
  Regular Expressions for each chunk
*/

var chunkers = [
  // the 'type' selector
  {
    name:'tag',
    regexp:/^(\*|\w+)/,
    mapper:function(val, map){
      map.tag = val;
    }
  },
  // the '.classname' selector
  {
    name:'class',
    regexp:/^\.\w+/,
    mapper:function(val, map){
      map.class = map.class || {};
      map.class[val.replace(/^\./, '')] = true;
    }
  },
  // the '#id' selector
  {
    name:'id',
    regexp:/^#\w+/,
    mapper:function(val, map){
      map.id = val.replace(/^#/, '');
    }
  },
  // the '=diggerid' selector
  {
    name:'diggerid',
    regexp:/^=[\w-]+/,
    mapper:function(val, map){
      map.diggerid = val.replace(/^=/, '');
    }
  },
  // the ':modifier' selector
  {
    name:'modifier',
    regexp:/^:\w+(\(.*?\))?/,
    mapper:function(val, map){
      map.modifier = map.modifier || {};
      var parts = val.split('(');
      var key = parts[0];
      val = parts[1];

      if(val){
        val = val.replace(/\)$/, '');

        if(val.match(/^[\d\.-]+$/)){
          val = JSON.parse(val);
        }

      }
      else{
        val = true;
      }

      map.modifier[key.replace(/^:/, '')] = val;
    }
  },
  // the '[attr<100]' selector
  {
    name:'attr',
    regexp:/^\[.*?["']?.*?["']?\]/,
    mapper:function(val, map){
      map.attr = map.attr || [];
      var match = val.match(/\[(.*?)([=><\^\|\*\~\$\!]+)["']?(.*?)["']?\]/);
      if(match){
        map.attr.push({
          field:match[1],
          operator:match[2],
          value:match[3]
        });
      }
      else {
        map.attr.push({
          field:val.replace(/^\[/, '').replace(/\]$/, '')
        });
      }
    }
  },
  // the ' ' or ' > ' splitter
  {
    name:'splitter',
    regexp:/^[ ,<>]+/,
    mapper:function(val, map){
      map.splitter = val.replace(/\s+/g, '');
    }

  }
];


/*
  Parse selector string into flat array of chunks
 
  Example in: product.onsale[price<100]
 */
function parseChunks(selector){

  var lastMatch = null;
  var workingString = selector ? selector : '';
  var lastString = '';

  // this is a flat array of type, string pairs
  var chunks = [];

  var matchNextChunk = function(){

    lastMatch = null;

    for(var i in chunkers){
      var chunker = chunkers[i];

      if(lastMatch = workingString.match(chunker.regexp)){

        // merge the value into the chunker data
        var data = {
          value:lastMatch[0]
        }
        for(prop in chunker){
          data[prop] = chunker[prop];
        }
        data.string = lastMatch[0];
        chunks.push(data);

        workingString = workingString.replace(lastMatch[0], '');

        return true;
      }
    }
    
    return false;

  }
  
  // the main chunking loop happens here
  while(matchNextChunk()){
    
    // this is the sanity check in case we match nothing
    if(lastString==workingString){
      break;
    }
  }

  return chunks;
}

function new_selector(){
  return {
    string:'',
    class:{},
    attr:[],
    modifier:{}
  }
}

/*

  turns a selector string into an array of arrays (phases) of selector objects
 
 */
function parse(selector_string){

  if(typeof(selector_string)!='string'){
    return selector_string;
  }

  var chunks = parseChunks(selector_string);

  var phases = [];
  var currentPhase = [];
  var currentSelector = new_selector();

  var addCurrentPhase = function(){
    if(currentPhase.length>0){
      phases.push(currentPhase);
    }
    currentPhase = [];
  }

  var addCurrentSelector = function(){

    if(Object.keys(currentSelector).length>0){
      currentPhase.push(currentSelector);
    }
    currentSelector = new_selector();
  }

  var addChunkToSelector = function(chunk, selector){
    chunk.mapper.apply(null, [chunk.value, selector]);
    selector.string += chunk.string;
  }

  chunks.forEach(function(chunk, index){

    if(chunk.name=='splitter' && chunk.value.match(/,/)){
      addCurrentSelector();
      addCurrentPhase();
    }
    else{

      if(chunk.name=='splitter' && index>0){
        addCurrentSelector();
      }

      addChunkToSelector(chunk, currentSelector);

    }
  })

  addCurrentSelector();
  addCurrentPhase();

  return {
    string:selector_string,
    phases:phases
  }
}

function miniparse(selector_string){

  if(typeof(selector_string)!=='string'){
    return selector_string;
  }
  selector_string = selector_string || '';
  var selector = {
    class:{},
    modifier:{}
  }
  selector_string = selector_string.replace(/_(\w+)/, function(match, id){
    selector.id = id;
    return '';
  })
  selector_string = selector_string.replace(/\.(\w+)/g, function(match, classname){
    selector.class[classname] = true;
    return '';
  })
  if(selector_string.match(/\d/)){
    selector.diggerid = selector_string;
  }
  else{
    selector.tag = selector_string;
  }
  return selector;
}
},{}],8:[function(require,module,exports){
module.exports=require(1)
},{}],9:[function(require,module,exports){
module.exports=require(2)
},{}],10:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var extend = require('extend');
var hat = require('hat');
var utils = module.exports = {};

/**
 * generate a new global id
 */

utils.diggerid = function(){
  return hat();
}

utils.littleid = function(chars){

  chars = chars || 6;

  var pattern = '';

  for(var i=0; i<chars; i++){
    pattern += 'x';
  }
  
  return pattern.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * takes a string and prepares it to be used in a RegExp itself
 */

utils.escapeRegexp = function(search){
  return search.replace(/([\!\$\(\)\*\+\.\/\:\=\?\[\\\]\^\{\|\}])/g, "\\$1");
}

/*

  return a pure JS version of a HTTP request
  
*/
utils.json_request = function(req){
  return {
    method:req.method.toLowerCase(),
    url:req.url,
    body:req.body,
    headers:req.headers
  }
}

/*

  is arr actually an array
  
*/
utils.isArray = function(arr){
  return Object.prototype.toString.call(arr) == '[object Array]';
}

/*

  return an array version of arguments
  
*/
utils.toArray = function(args){
  return Array.prototype.slice.call(args, 0);
}

/*

  turn a digger url string into an object with:

    * action (read | write)
    * supplier_method (select | append | save | remove)
    * diggerid (a digger context extracted from the url)
    * selector (a single phase of selectors extracted from the url)
  
*/
utils.parse_request = function(method, url){

}

/*

  exports a user object but removing its private fields first
  
*/
utils.export_user = function(user){
  var ret = {};

  for(var prop in user){
    if(prop.charAt(0)!='_'){
      ret[prop] = user[prop];
    }
  }

  return ret;
}

/**
 * jQuery Deep extend
 */

utils.extend = extend;
},{"extend":8,"hat":9}],11:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var Selector = require('digger-selector');
var utils = require('digger-utils');

module.exports = {
  request:request,
  select:select,
  append:append,
  save:save,
  remove:remove
}

/*

  return either the first array object
  or if length > 1 then wrapper.body = list and return wrapper
  
*/
function multiple_branch(list, wrapper){
  if(list.length<=1){
    return list[0];
  }
  else{
    wrapper.body = list;
    return wrapper;
  }
}

/*

  REQUEST

  send a plain JavaScript request object back to a warehouse

  if we are at supplychain level then the url will be the warehouse

  if we have a container then the url will be +/<id>
  
*/
function request(req){
  var self = this;
  if(this.count()<=0){
    throw new Error('there is nothing to delete');
  }

  var requests = [];

  this.each(function(container){
    var parts = [container.diggerwarehouse()];
    if(container.tag()!='_supplychain'){
      parts.push(container.diggerid());
    }
    parts.push(req.url.replace(/\//, ''));
    var clone = JSON.parse(JSON.stringify(req));
    clone.url = parts.join('/');
    requests.push(clone);
  })

  var raw;

  if(requests.length>1){
    raw = {
      method:'post',
      url:'/reception',
      headers:{
        'Content-Type':'application/json',
        'x-contract-type':'merge',
        'x-contract-id':utils.diggerid()
      },
      body:requests
    }
  }
  else{
    raw = requests[0];
  }

  return this.supplychain ? this.supplychain.contract(raw, self) : raw;
}

/*

  SELECT 
  turns an array of selector strings into a pipe contract

  the strings are reversed as in:

    "selector", "context"

  becomes

    context selector

  in the actual search (this is just how jQuery works)
  
*/
function select(selector_string, context_string){

  var self = this;
  if(this.count()<=0){
    throw new Error('attempting a select on an empty container');
  }

  /*
  
    first get an array of selector objects

    we make a pipe contract out of these

    then duplicate that pipe contract for each different diggerwarehouse

    
  */
  var strings = [selector_string];
  if(arguments.length>1){
    strings.push(context_string);
  }
  
  var selectors = strings.map(function(selector){
    return Selector(selector);
  })

  /*
  
    the 'context' are the models inside 'this' container

    the _digger objects will be sent as the body of the select request
    for each supplier to use as the context (i.e. starting point for the query)

    
  */

  var context = this.containers();

  /*
  
    split out the current context into their warehouse origins
    
  */
  var groups = {};

  this.each(function(container){
    var warehouse = container.diggerwarehouse() || '/';
    var arr = groups[warehouse] || [];
    arr.push(container);
    groups[warehouse] = arr;
  })
  
  var warehouseurls = Object.keys(groups);

  /*
  
    the top level contract - this will be resolved in the holdingbay

    it is a merge of the various warehouse targets
    
  */

  /*
  
    if there is only a single warehouse url then we do the pipe at the top level

    otherwise we merge all the individual warehouse pipe contracts
    
  */

  var topcontract = {};

  function basic_contract(type){
    return {
      method:'post',
      url:'/reception',
      headers:{
        'Content-Type':'application/json',
        'x-contract-type':type,
        'x-contract-id':utils.diggerid()
      }
    }
  }

  // (warehouseurl + '/resolve').replace(/\/\//g, '/'),
  function create_warehouse_pipe_contract(warehouseurl){
    /*
    
      create a pipe contract out of the selectors
      
    */
    // this is the skeleton to POST to the start of the chain per phase
    var skeleton = groups[warehouseurl].map(function(c){
      return c.get(0)._digger;
    }).filter(function(digger){
      return digger.tag!='_supplychain';
    })

    /*
    
      the top level selectors are phases to be merged
      
    */
    var phase_contracts = selectors.reverse().map(function(selector_phase){

      /*
      
        a single selector chain

        the first step is posted the skeleton from the client container

        each step is piped the results of the previous

        the reception looks after detecting branches in the results
        
      */
      var selector_contracts = selector_phase.phases.map(function(selector_stages){

        var last_selector = selector_stages[selector_stages.length-1];
        var modifier = last_selector.modifier || {};
        modifier.laststep = true;
        last_selector.modifier = modifier;
        
        var selector_requests = selector_stages.map(function(selector){
          return {
            method:'post',
            url:(warehouseurl + '/select').replace(/\/\//g, '/'),
            headers:{
              'Content-Type':'application/json',
              'x-json-selector':selector
            }
          }  
        })

        selector_requests[0].body = skeleton;

        return multiple_branch(selector_requests, basic_contract('pipe'));
      })

      return multiple_branch(selector_contracts, basic_contract('merge'));
    })

    return multiple_branch(phase_contracts, basic_contract('pipe'))
  }

  /*
  
    the top level warehouse grouped contracts

    either a single set of selector resolvers or an array of merges across warehouses
    
  */
  var warehouse_pipe_contracts = warehouseurls.map(create_warehouse_pipe_contract);
  var topcontract = multiple_branch(warehouse_pipe_contracts,  {
    method:'post',
    url:'/reception',
    headers:{
      'Content-Type':'application/json',
      'x-contract-type':'merge',
      'x-contract-id':utils.diggerid()
    }
  })

  return this.supplychain ? this.supplychain.contract(topcontract, self).expect('containers') : topcontract;
}

/*

  POST
  
*/
function append(appendcontainer){

  var self = this;
  
  if(arguments.length<=0 || appendcontainer.count()<=0){
    throw new Error('there is nothing to append');
  }

  if(this.count()<=0){
    throw new Error('there is nothing to append to');
  }

  var appendmodels = appendcontainer.models;
  
  var appendto = this.eq(0);
  var appendtomodel = this.get(0);

  appendtomodel._children = (appendtomodel._children || []).concat(appendmodels);

  /*
  
    this is a direct request not a contract
    
  */
  var raw = {
    method:'post',
    headers:{
      'Content-Type':'application/json',
      'x-contract-type':'merge',
      'x-contract-id':utils.diggerid()
    },
    url:'/reception',
    body:[{
      method:'post',
      headers:{
        'Content-Type':'application/json',
        'x-contract-id':utils.diggerid()
      },
      url:appendto.diggerurl(),
      body:appendmodels
    }]
  }

  appendcontainer.supplychain = this.supplychain;

  return this.supplychain ? this.supplychain.contract(raw, self).after(function(results){
    var map = {};
    appendmodels.forEach(function(model){
      map[model._digger.diggerid] = model;
    })
    results.forEach(function(result){
      var model = map[result._digger.diggerid];
      if(model){
        for(var prop in result){
          model[prop] = result[prop];
        }
      }
    })
    return self.spawn(results);
  }) : raw;
}

/*

  PUT
  
*/
function save(){

  var self = this;
  if(this.count()<=0){
    throw new Error('there is nothing to save');
  }


  var raw = {
    method:'post',
    headers:{
      'Content-Type':'application/json',
      'x-contract-type':'merge',
      'x-contract-id':utils.diggerid()
    },
    url:'/reception',
    body:this.map(function(container){
      var model = container.get(0);
      var savemodel = JSON.parse(JSON.stringify(model));
      delete(savemodel._children);
      delete(savemodel._digger.data);

      // remove the linked attributes we don't want to save those
      var links = container.digger('symlinks') || {};

      for(var linkid in links){
        var link = links[linkid];

        if(link.type=='attr'){
          delete(savemodel[link.field]);
        }
      }


      return {
        method:'put',
        headers:{
          'Content-Type':'application/json',
          'x-contract-id':utils.diggerid()
        },
        url:container.diggerurl(),
        body:savemodel
      }
    })
  }

  return this.supplychain ? this.supplychain.contract(raw, self) : raw;
}

/*

  DELETE
  
*/
function remove(){

  var self = this;
  if(this.count()<=0){
    throw new Error('there is nothing to delete');
  }

  var raw = {
    method:'post',
    url:'/reception',
    headers:{
      'Content-Type':'application/json',
      'x-contract-type':'merge',
      'x-contract-id':utils.diggerid()
    },
    body:this.map(function(container){
      return {
        method:'delete',
        headers:{
          'Content-Type':'application/json',
          'x-contract-id':utils.diggerid()
        },
        url:container.diggerurl()
      }
    })
  }

  return this.supplychain ? this.supplychain.contract(raw, self) : raw;
}
},{"digger-selector":7,"digger-utils":10}],12:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

module.exports = parse;
module.exports.mini = miniparse;

/*
  Quarry.io Selector
  -------------------

  Represents a CSS selector that will be passed off to selectors or perform in-memory search

 */

/***********************************************************************************
 ***********************************************************************************
  Here is the  data structure:

  "selector": " > * product.onsale[price<100] > img caption.red, friend",
  "phases":
    [
      [
          {
              "splitter": ">",
              "tag": "*"
          },
          {
              "splitter": "",
              "tag": "product",
              "classnames": {
                  "onsale": true
              },
              "attr": [
                  {
                      "field": "price",
                      "operator": "<",
                      "value": "100"
                  }
              ]
          },
          {
              "splitter": ">",
              "tag": "img"
          },
          {
              "splitter": "",
              "tag": "caption",
              "classnames": {
                  "red": true
              }
          }
      ],
      [
          {
              "tag": "friend"
          }
      ]
    ]

 */

/*
  Regular Expressions for each chunk
*/

var chunkers = [
  // the 'type' selector
  {
    name:'tag',
    regexp:/^(\*|\w+)/,
    mapper:function(val, map){
      map.tag = val;
    }
  },
  // the '.classname' selector
  {
    name:'class',
    regexp:/^\.\w+/,
    mapper:function(val, map){
      map.class = map.class || {};
      map.class[val.replace(/^\./, '')] = true;
    }
  },
  // the '#id' selector
  {
    name:'id',
    regexp:/^#\w+/,
    mapper:function(val, map){
      map.id = val.replace(/^#/, '');
    }
  },
  // the '=diggerid' selector
  {
    name:'diggerid',
    regexp:/^=[\w-]+/,
    mapper:function(val, map){
      map.diggerid = val.replace(/^=/, '');
    }
  },
  // the ':modifier' selector
  {
    name:'modifier',
    regexp:/^:\w+(\(.*?\))?/,
    mapper:function(val, map){
      map.modifier = map.modifier || {};
      var parts = val.split('(');
      var key = parts[0];
      val = parts[1];

      if(val){
        val = val.replace(/\)$/, '');

        if(val.match(/^[\d\.-]+$/)){
          val = JSON.parse(val);
        }

      }
      else{
        val = true;
      }

      map.modifier[key.replace(/^:/, '')] = val;
    }
  },
  // the '[attr<100]' selector
  {
    name:'attr',
    regexp:/^\[.*?["']?.*?["']?\]/,
    mapper:function(val, map){
      map.attr = map.attr || [];
      var match = val.match(/\[(.*?)([=><\^\|\*\~\$\!]+)["']?(.*?)["']?\]/);
      if(match){
        map.attr.push({
          field:match[1],
          operator:match[2],
          value:match[3]
        });
      }
      else {
        map.attr.push({
          field:val.replace(/^\[/, '').replace(/\]$/, '')
        });
      }
    }
  },
  // the ' ' or ' > ' splitter
  {
    name:'splitter',
    regexp:/^[ ,<>]+/,
    mapper:function(val, map){
      map.splitter = val.replace(/\s+/g, '');
    }

  }
];


/*
  Parse selector string into flat array of chunks
 
  Example in: product.onsale[price<100]
 */
function parseChunks(selector){

  var lastMatch = null;
  var workingString = selector ? selector : '';
  var lastString = '';

  // this is a flat array of type, string pairs
  var chunks = [];

  var matchNextChunk = function(){

    lastMatch = null;

    for(var i in chunkers){
      var chunker = chunkers[i];

      if(lastMatch = workingString.match(chunker.regexp)){

        // merge the value into the chunker data
        var data = {
          value:lastMatch[0]
        }
        for(prop in chunker){
          data[prop] = chunker[prop];
        }
        chunks.push(data);

        workingString = workingString.replace(lastMatch[0], '');

        return true;
      }
    }
    
    return false;

  }
  
  // the main chunking loop happens here
  while(matchNextChunk()){
    
    // this is the sanity check in case we match nothing
    if(lastString==workingString){
      break;
    }
  }

  return chunks;
}

function new_selector(){
  return {
    class:{},
    attr:[],
    modifier:{}
  }
}

/*

  turns a selector string into an array of arrays (phases) of selector objects
 
 */
function parse(selector_string){

  if(typeof(selector_string)!='string'){
    return selector_string;
  }

  var chunks = parseChunks(selector_string);

  var phases = [];
  var currentPhase = [];
  var currentSelector = new_selector();

  var addCurrentPhase = function(){
    if(currentPhase.length>0){
      phases.push(currentPhase);
    }
    currentPhase = [];
  }

  var addCurrentSelector = function(){

    if(Object.keys(currentSelector).length>0){
      currentPhase.push(currentSelector);
    }
    currentSelector = new_selector();
  }

  var addChunkToSelector = function(chunk, selector){
    
    chunk.mapper.apply(null, [chunk.value, selector]);
  }


  chunks.forEach(function(chunk, index){

    if(chunk.name=='splitter' && chunk.value.match(/,/)){
      addCurrentSelector();
      addCurrentPhase();
    }
    else{

      if(chunk.name=='splitter' && index>0){
        addCurrentSelector();
      }

      addChunkToSelector(chunk, currentSelector);

    }
  })

  addCurrentSelector();
  addCurrentPhase();

  return {
    string:selector_string,
    phases:phases
  }
}

function miniparse(selector_string){

  if(typeof(selector_string)!=='string'){
    return selector_string;
  }
  selector_string = selector_string || '';
  var selector = {
    class:{},
    modifier:{}
  }
  selector_string = selector_string.replace(/_(\w+)/, function(match, id){
    selector.id = id;
    return '';
  })
  selector_string = selector_string.replace(/\.(\w+)/g, function(match, classname){
    selector.class[classname] = true;
    return '';
  })
  if(selector_string.match(/\d/)){
    selector.diggerid = selector_string;
  }
  else{
    selector.tag = selector_string;
  }
  return selector;
}
},{}],13:[function(require,module,exports){
module.exports=require(1)
},{}],14:[function(require,module,exports){
module.exports=require(2)
},{}],15:[function(require,module,exports){
module.exports=require(3)
},{"extend":13,"hat":14}],16:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

/*
  digger - Find
  ----------------

  A sync version of the selector resolver for use with already loaded containers

  This is used for container.find() to return the results right away jQuery style




 */

module.exports = factory;

function State(arr){
  this.count = arr.length;
  this.index = 0;
  this.finished = false;
}

State.prototype.next = function(){
  this.index++;
  if(this.index>=this.count){
    this.finished = true;
  }
}

/*

  search is the function that accepts a single container and the single selector to resolve
  
*/
function factory(searchfn){

  /*
  
    context is the container to search from

    selectors is the top level array of indivudally processed selector strings
    
  */

  return function(selectors, context){

    var final_state = new State(selectors);
    var final_results = context.spawn();

    /*
    
      loop over each of the seperate selector strings

      container("selectorA", "selectorB")

      B -> A
      
    */
    selectors.reverse().forEach(function(stage){

      final_state.next();

      /*
      
        this is a merge of the phase results

        the last iteration of this becomes the final results
        
      */
      var stage_results = context.spawn();

      /*
      
        now we have the phases - these can be done in parallel
        
      */
      stage.phases.forEach(function(phase){

        
        var phase_context = context;

        var selector_state = new State(phase);

        var cancel = false;

        phase.forEach(function(selector){

          if(cancel){
            return;
          }

          selector_state.next();

          var results = searchfn(selector, phase_context);

          /*
          
            quit the stage loop with no results
            
          */
          if(results.count()<=0){
            cancel = true;
            return false;
          }

          /*
          
            if there is still more to get for this string
            then we update the pipe skeleton
            
          */
          if(!selector_state.finished){
            phase_context = results;
          }
          /*
          
            this
            
          */
          else{
            stage_results.add(results);
          }

          return true;

        })

      

      })

      /*
      
        quit the stages with no results
        
      */
      if(stage_results.count()<=0){
        return false;
      }


      /*
      
        this is the result of a stage - we pipe the results to the next stage
        or call them the final results
        
      */

      if(!final_state.finished){
        context = stage_results;
      }
      else{
        final_results = stage_results;
      }
    })

    return final_results;

  }
}
},{}],17:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var find = require('./find');
var search = require('./search');
var Selector = require('digger-selector');

var finder = find(search.searcher);

var sortfns = {
  title:function(a, b){
    if ( a.title().toLowerCase() < b.title().toLowerCase() )
      return -1;
    if ( a.title().toLowerCase() > b.title().toLowerCase() )
      return 1;
    return 0;
  },
  field:function(name){
    return function(a, b){
      if ( a.attr(name).toLowerCase() < b.attr(name).toLowerCase() )
        return -1;
      if ( a.attr(name).toLowerCase() > b.attr(name).toLowerCase() )
        return 1;
      return 0;
    }
  }
}

/*

  these functions run in the context of a container
  
*/
module.exports = {
  find:function(selector, context){
    var selectors = [selector];
    if(context){
      selectors.push(context);
    }
    selectors = selectors.map(function(string){
      return Selector(string);
    })
    return finder(selectors, this);
  },

  sort:function(fn){
    if(typeof(fn)==='string'){
      fn = sortfns.field(fn);
    }
    else if(!fn){
      fn = sortfns.title;
    }

    this.each(function(container){
      var newchildren = container.children().containers().sort(fn);
      var model = container.get(0);
      model.children = newchildren.map(function(container){
        return container.get(0);
      })
    })

    return this;
  },

  filter:function(filterfn){

    /*
    
      turn anything other than a function into the filter function

      the compiler looks after turning strings into selector objects
      
    */
    if(typeof(filterfn)!='function'){
      if(typeof(filterfn)=='string'){
        filterfn = Selector(filterfn).phases[0][0];
      }
      filterfn = search.compiler(filterfn);
    }

    var matching_container_array = this.containers().filter(filterfn);

    return this.spawn(matching_container_array.map(function(container){
      return container.get(0);
    }))
  },

  match:function(selector){

    if(this.count()<=0){
      return false;
    }

    var results = this.filter(selector);

    return results.count()>0;
  }
}
},{"./find":16,"./search":18,"digger-selector":12}],18:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/


var utils = require('digger-utils');

/*
  Quarry.io - Container Search
  ----------------------------

  Takes a search_from container and an array of strings

  It reverses the strings and does a simulated pipe


 */

module.exports.searcher = search;
module.exports.compiler = compile;

/*
  These functions are used to run attribute selectors over in-memory containers
 */
var attr_compare_functions = {
  "=":function(check, target){
    return check!=null && check==target;
  },
  "!=":function(check, target){
    return check!=null && check!=target;
  },
  ">":function(check, target){
    target = parseFloat(target);
    return check!=null && !isNaN(target) ? check > target : false;
  },
  ">=":function(check, target){
    target = parseFloat(target);
    return check!=null && !isNaN(target) ? check >= target : false;
  },
  "<":function(check, target){
    target = parseFloat(target);
    return check!=null && !isNaN(target) ? check < target : false;
  },
  "<=":function(check, target){
    target = parseFloat(target);
    return check!=null && !isNaN(target) ? check <= target : false;
  },
  "^=":function(check, target){
    return check!=null && check.match(new RegExp('^' + utils.escapeRegexp(target), 'i')) !== null;
  },
  "$=":function(check, target){
    return check!=null && check.match(new RegExp(utils.escapeRegexp(target) + '$', 'i')) !== null;
  },
  "~=":function(check, target){
    return check!=null && check.match(new RegExp('\\W' + utils.escapeRegexp(target) + '\\W', 'i')) !== null;
  },
  "|=":function(check, target){
    return check!=null && check.match(new RegExp('^' + utils.escapeRegexp(target) + '-', 'i')) !== null;
  },
  "*=":function(check, target){
    return check!=null && check.match(new RegExp(utils.escapeRegexp(target), 'i')) !== null;
  }
}

/*

  Turn a selector object into a compiled function to have containers run through
  
 */

function compile(selector){

  // return a function that will return boolean for a container matching this selector
  return function(container){

    var model = container.get(0);
    var digger = model._digger;

    // tells you if the given boolean should actuall be true
    // this allows the :not modifier to negate searches
    function notfilter(val){
      if(!val){
        val = false;
      }
      return selector.modifier && selector.modifier.not ? !val : val;
    }

    function notcountfilter(number){
      var orig = number || 0;
      var opposite = orig==0 ? 1 : 0;
      return selector.modifier && selector.modifier.not ? opposite : orig;
    }

    // we step through one at a time - as soon as something fails we do not match

    // if we have a wildcard then we pass
    if(selector.tag=='*'){
      return notfilter(true);
    }

    // #id
    if(selector.id && notfilter(digger.id!=selector.id)){
      return false;
    }

    // =diggerid
    if(selector.diggerid && notfilter(digger.diggerid!=selector.diggerid)){
      return false;
    }

    // tagname
    if(selector.tag && notfilter(digger.tag!=selector.tag)){
      return false;
    }
  
    // classnames
    if(selector.class){
      var keys = Object.keys(selector.class || {});
      var classcount = 0;
      keys.forEach(function(c){
        classcount += container.hasClass(c) ? notcountfilter(1) : notcountfilter(0);
      })
      if(classcount<keys.length){
        return false;
      }
    }
    
    if(selector.attr){

      var attr_count = 0;

      selector.attr.forEach(function(attr_filter){

        var check_value = container.attr(attr_filter.field);
        var operator_function = attr_compare_functions[attr_filter.operator];

        // [size]
        if(!attr_filter.value){
          attr_count += check_value !== null ? notcountfilter(1) : notcountfilter(0);
        }
        // [size>100]
        else if(operator_function){
          attr_count += operator_function.apply(null, [check_value, attr_filter.value]) ? notcountfilter(1) : notcountfilter(0);
        }
        // no operator function found
      })

      if(attr_count<selector.attr.length){
        return false;
      }
    }

    return true;
      
  }
}

function search(selector, context){

  var selector_filter = compile(selector);

  var search_in = context;

  // we must now turn the search_from container into a flat array of the things to actually search

  // direct child mode
  if(selector.splitter=='>'){
    search_in = context.children();
  }
  // direct parent mode
  else if(selector.splitter=='<'){
    throw new Error('we do not support the parent splitter at the moment');
  }
  // all descendents mode
  else{
    search_in = context.descendents();
  }

  // now we loop each child container piping it via the selector filter
  var ret = search_in.filter(selector_filter);

  var modifier = selector.modifier || {};

  if(modifier.limit){
    var st = '' + modifier.limit;
    if(st.indexOf(',')>=0){
      var parts = st.split(',').map(function(stt){
        return stt.replace(/\D/g, '');
      })
      ret.models = ret.models.slice(parts[0], parts[1]);
    }
    else{
      ret.models = ret.models.slice(0, modifier.limit);
    }
    
  }

  if(modifier.first && ret.models.length>0){
    ret.models = [ret.models[0]];
  }
  else if(modifier.last && ret.models.length>0){
    ret.models = [ret.models[ret.models.length-1]];
  }

  return ret;
}
},{"digger-utils":15}],19:[function(require,module,exports){
module.exports=require(4)
},{}],20:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./proto":21}],21:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var EventEmitter = require('events').EventEmitter;
var dotty = require('dotty');
var util = require('util');
var utils = require('digger-utils');

function Container(){}


/*

	Factory for new containers
	
*/
function factory(){
	/*
  
    first let's extract the model data
    
  */
  var models = [];

  if(typeof(arguments[0])==='string'){
    var string = arguments[0];
    var c = string.charAt(0);
    if(c==='{' || c==='['){
      var data = JSON.parse(string);
      if(c==='{'){
        data = [data];
      }
      models = data;
    }
    else{
      var model = arguments[1] || {};
      var digger = model._digger || {};
      digger.tag = string;
      model._digger = digger;
      models = [model];  
    }
    
  }
  else if(Object.prototype.toString.call(arguments[0]) == '[object Array]'){  
    models = arguments[0];
  }
  else if(typeof arguments[0]==='object'){
    models = [arguments[0]];
  }

  if(models[0]===undefined || models[0]===null){
    models = [];
  }

  var instance = function container(){
    if(!instance.select){
      throw new Error('there is no select method attached to this container');
    }
    var args = [arguments[0]];
    if(arguments.length>1){
      args.push(arguments[1]);
    }
    return instance.select.apply(instance, args);
  }

  instance.__proto__ = new Container;
  instance.build(models);
  
  return instance;
}

/*

	expose
	
*/
Container.factory = factory;

util.inherits(Container, EventEmitter);

module.exports = Container;


/*

	prototype
	
*/
Container.prototype.build = function(models){

	this.models = models || [];
	for(var i in models){
    var model = models[i];
    if(!model._digger){
      model._digger = {};
    }
		if(!model._digger.diggerid){
			model._digger.diggerid = utils.diggerid();
		}
	}
  return this;
}

Container.prototype.toJSON = function(){
  return this.models;
}

/*

	iterators

*/

Container.prototype.spawn = function(models){
  models = models || [];
	var container = Container.factory(models);
  if(this.supplychain){
    container.supplychain = this.supplychain;  
  }
	return container;
}

Container.prototype.clone = function(){
  var data = JSON.parse(JSON.stringify(this.models));

  var ret = this.spawn(data);

  ret.recurse(function(des){
  	var model = des.get(0);
  	var digger = model._digger || {};
  	digger.diggerid = utils.diggerid();
  	model._digger = digger;
  })
  ret.ensure_parent_ids();
  return ret;
}

Container.prototype.ensure_parent_ids = function(parent){

  var self = this;

  if(parent){
  	this.each(function(c){
  		c.diggerparentid(parent.diggerid());
  	})
  }

  this.children().each(function(child){
    child.ensure_parent_ids(self);
  })
}

Container.prototype.inject_paths = function(basepath){

  this.diggerpath(basepath);

  this.children().each(function(child, index){
    child.inject_paths(basepath.concat([index]));
  })

}

Container.prototype.ensure_meta = function(done){
  if(!this.diggerid()){
    this.diggerid(utils.diggerid());
  }

  var topcounter = 0;
  if(this.diggerpath().length<=0){
    this.inject_paths([topcounter]);
    topcounter++;
  }

  this.ensure_parent_ids();
  return this;
}


Container.prototype.children = function(){
  var models = [];
  var self = this;
  this.each(function(container){
    models = models.concat(container.get(0)._children || []);
  })
	return this.spawn(models);
}

Container.prototype.recurse = function(fn){
  this.descendents().each(fn);
  return this;
}

Container.prototype.descendents = function(){
  var ret = [];

  function scoopmodels(container){
    ret = ret.concat(container.models);
    container.children().each(scoopmodels);
  }

  scoopmodels(this);

  return this.spawn(ret);
}

Container.prototype.containers = function(){
  var self = this;
  return this.models.map(function(model){
    return self.spawn([model]);
  })
}

Container.prototype.skeleton = function(){
  return this.models.map(function(model){
    return model._digger || {};
  })
}

Container.prototype.add = function(container){
  var self = this;
  
  if(!container){
    return this;
  }
  
  if(Object.prototype.toString.call(container) == '[object Array]'){
    container.forEach(function(c){
      self.add(c);
    })
    
  }
  else{
    this.models = this.models.concat(container.models);
  }
  return this;
}


Container.prototype.each = function(fn){
	this.containers().forEach(fn);
	return this;
}

Container.prototype.map = function(fn){
	return this.containers().map(fn);
}

Container.prototype.count = function(){
	return this.models.length;
}

Container.prototype.first = function(){
	return this.eq(0);
}

Container.prototype.last = function(){
	return this.eq(this.count()-1);
}

Container.prototype.eq = function(index){
	return this.spawn(this.get(index));
}

Container.prototype.get = function(index){
	return this.models[index];
}

/*

	properties
	
*/


function valuereader(model, name){
  if(!name){
  	return model;
  }
  return dotty.get(model, name);
}

function valuesetter(model, value, name){
	if(!name){
  	return value;
  }
  dotty.put(model, name, value);
  return value;
}

function makepath(path, base){
	var parts = [path];
	if(base){
		parts.unshift(base);
	}
	return parts.join('.');
}

function wrapper(basepath){
	return function(path, val){
		var self = this;
		if(arguments.length<=0){
      if(self.isEmpty()){
        return null;
      }
			return valuereader(self.get(0), basepath);
		}
		else if(arguments.length===1 && typeof(path)==='string'){
      if(self.isEmpty()){
        return null;
      }
			return valuereader(self.get(0), makepath(path, basepath));
		}
		else if(arguments.length===1){
			self.models.forEach(function(model){
				valuesetter(model, val, basepath);
			})
			return self;
		}
		else if(arguments.length>1){
			var usepath = makepath(path, basepath);
			self.models.forEach(function(model){
				valuesetter(model, val, usepath);
			})
			return self;
		}
	}
}

function property_wrapper(basepath, property){
	return function(val){

		var self = this;
		if(arguments.length<=0){
      if(self.isEmpty()){
        return null;
      }
			var model = dotty.get(self.get(0), basepath);
			return model[property];
		}
		else{
      if(!self.isEmpty()){
        self.models.forEach(function(model){
          var basemodel = dotty.get(model, basepath);
          basemodel[property] = val;
        })  
      }
			
			return self;
		}
	}
}

function remove_wrapper(basepath){
	return function(path){
		var self = this;
		var usepath = makepath(path, basepath);
		self.models.forEach(function(model){
			dotty.remove(model, usepath);
		})	
		return self;
	}	
}


Container.prototype.attr = wrapper();
Container.prototype.digger = wrapper('_digger');
Container.prototype.data = wrapper('_digger.data');

Container.prototype.diggerid = property_wrapper('_digger', 'diggerid');
Container.prototype.diggerparentid = property_wrapper('_digger', 'diggerparentid');
Container.prototype.diggerwarehouse = property_wrapper('_digger', 'diggerwarehouse');
var pathwrapper = property_wrapper('_digger', 'diggerpath');
Container.prototype.diggerpath = function(){
  var ret = pathwrapper.apply(this, utils.toArray(arguments));

  if(!utils.isArray(ret)){
    ret = [];
  }

  return ret;
}


var branchwrapper = property_wrapper('_digger', 'diggerbranch');
Container.prototype.diggerbranch = function(){
  var ret = branchwrapper.apply(this, utils.toArray(arguments));

  if(!utils.isArray(ret)){
    ret = [];
  }

  return ret;
}

Container.prototype.addBranch = function(where){
  var self = this;
  var branches = this.diggerbranch();
  where.each(function(container){
    branches.push(container.diggerurl());
  })
  this.diggerbranch(branches);
  return this;
}

Container.prototype.removeBranch = function(where){
  var self = this;
  var branches = this.diggerbranch();

  where.each(function(container){

    var newbranches = [];
    for(var i=0; i<branches.length; i++){
      if(branches[i]!=container.diggerurl()){
        newbranches.push(branches[i]);
      }
    }
    branches = newbranches;
  })
  this.diggerbranch(branches);
  return this;
}

Container.prototype.id = property_wrapper('_digger', 'id');
Container.prototype.tag = property_wrapper('_digger', 'tag');
Container.prototype.classnames = property_wrapper('_digger', 'class');

Container.prototype.removeAttr = remove_wrapper();
Container.prototype.removeDigger = remove_wrapper('_digger');
Container.prototype.removeData = remove_wrapper('_digger.data');

Container.prototype.is = function(tag){
  return this.tag()==tag;
}

Container.prototype.addClass = function(classname){
  var self = this;
  this.models.forEach(function(model){
    var classnames = model._digger.class || [];
    var found = false;
    classnames.forEach(function(c){
    	if(c==classname){
    		found = true;
    	}
    })
    if(!found){
    	classnames.push(classname);	
    }
    model._digger.class = classnames;
  })
  return this;
}

Container.prototype.removeClass = function(classname){
  var self = this;
  this.models.forEach(function(model){
    var classnames = model._digger.class || [];
    var newclassnames = [];
    classnames.forEach(function(c){
    	if(c!=classname){
    		newclassnames.push(c);
    	}
    })
    model._digger.class = newclassnames;
  })
  return this;
}

Container.prototype.hasClass = function(classname){
	var found = false;
	(this.classnames() || []).forEach(function(c){
		if(c==classname){
			found = true;
		}
	})
  return found;
}

Container.prototype.hasAttr = function(name){
	var prop = this.attr(name);
	return prop!==null;
}

Container.prototype.isEmpty = function(){
  return this.count()===0;
}

Container.prototype.inject_data = function(data){
	this.models.forEach(function(model){
		utils.extend(model, data);
	})
  return this;
}


Container.prototype.diggerurl = function(){
  var warehouse = this.diggerwarehouse();
  var id = this.diggerid();

  var url = warehouse || '/';

  if(id && this.tag()!='_supplychain'){
    if(warehouse!='/'){
      url += '/';
    }

    url += id;
  }
  
  return url.replace(/\/\//g, '/');
}

/*

	summary methods
	
*/

Container.prototype.title = function(){
  var name = this.attr('name');
  if(!name){
    name = this.attr('title');
  }
  if(!name){
    name = this.tag();
  }
  return name;
}

Container.prototype.summary = function(options){

  options = options || {};

  var parts = [];

  var title = (this.attr('name') || this.attr('title') || '')
  if(title.length>0 && options.title!==false){
    parts.push(title + ': ');
  }

  parts.push(this.tag());

  var id = this.id() || '';
  if(id.length>0){
    parts.push('#' + id);
  }

  var classnames = this.classnames() || [];
  if(classnames.length>0){
    classnames.forEach(function(classname){
      if(classname.match(/\w/)){
        parts.push('.' + classname.replace(/^\s+/, '').replace(/\s+$/, ''));
      }
    })
  }

  return parts.join('');
}

Container.prototype.toString = function(){
  return this.summary();
}
},{"digger-utils":24,"dotty":19,"events":36,"util":37}],22:[function(require,module,exports){
module.exports=require(1)
},{}],23:[function(require,module,exports){
module.exports=require(2)
},{}],24:[function(require,module,exports){
module.exports=require(3)
},{"extend":22,"hat":23}],25:[function(require,module,exports){
var process=require("__browserify_process");/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */


/*

	supply chain

  the link between a client side container and a back end digger.io database server

  the supplychain is a function that accepts a request object (a pure javascript obj)
  and returns a promise for it to be fulfilled

  you create a supplychain by passing the function that will actualy deal with the request

	
*/

var Container = require('digger-container');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var utils = require('digger-utils');


module.exports = factory;

function factory(handle, use_container){

  var supplychain = new SupplyChain(handle, use_container);

  return supplychain;
}

/*

  create a new supply chain that will pipe a req and res object into the
  provided fn

  
*/

function SupplyChain(handle, use_container){

  // force the request into new references so we are not messing with client
  // data if this is an entirely local setup
  this.handle = handle;
  this.container = use_container || Container;
  this.create = use_container || Container;
}


util.inherits(SupplyChain, EventEmitter);

/*

  the handler function accepts a pure JS req object to be sent to the server as HTTP or socket (but it's basically a HTTP)

  it returns a promise that will resolve once the callback based handle function passed in to the supplychain has returned
  
*/
SupplyChain.prototype.contract = function(req, container){

  var self = this;

  if(!req.headers){
    req.headers = {};
  }
  
  function trigger_request(callback){
    if(!self.handle || typeof(self.handle)!='function'){
      setTimeout(function(){
        callback('There is no handle method attached to this supplychain')
      }, 0)
    }
    else{

      /*
      
        here we serialize the request because we are transporting it
        
      */
      self.handle({
        method:req.method,
        url:req.url,
        headers:req.headers,
        body:req.body
      }, function(error, result){

        if(error){
          callback(error);
          return;
        }
        else{
          if(!result){
            result = [];
          }
          if(!utils.isArray(result) && typeof(result)==='object'){
            if(result.headers){
              result = result.body;
            }
            result = [result];
          }

          if(req.results_processor){
            result = req.results_processor(result);
          }

          callback(null, result);
        }
      })
    }
  }

  req.ship = function(fn){

    process.nextTick(function(){
      trigger_request(function(error, answer){
        if(error){
          if(req._fail){
            req._fail(error);  
          }
          else{
            console.log('a request has an error but the contract has no fail handler');
            console.dir(req.method + ' ' + req.url);
            console.log(error);
          }
        }
        else{
          fn(answer);
          if(req._after){
            req._after(answer);
          }
        }
      })
    })

    return this;
  }
  req.fail = function(fn){
    req._fail = fn;
    return this;
  }
  req.expect = function(type){
    if(type=='containers'){
      req.results_processor = function(results){
        return container.spawn(results);
      }
    }
    return this;
  }
  req.after = function(fn){
    req._after = fn;
    return this;
  }
  req.debug = function(){
    req.headers['x-debug'] = true;
    return this;
  }

  return req;

}

/*

  return a container that uses this supplychain - this means contracts can be run via the container
  and they will travel down the supply chain

  if a diggerid is given then the returned container will not be a _supplychain - this means it's skeleton will
  be sent for selects

  otherwise we are assuming the connect is for a top level warehouse and the tag becomes _supplychain which
  is filtered out from the skeleton in contracts
  
*/
SupplyChain.prototype.connect = function(diggerwarehouse, diggerid){
  var self = this;
  var container = self.container(arguments.length>1 ? 'item' : '_supplychain');
  container.diggerwarehouse(diggerwarehouse || '/');
  if(arguments.length>1){
    container.diggerid(diggerid);
  }
  container.supplychain = this;
  return container;
}

SupplyChain.prototype.contract_group = function(type, contracts){
  var raw = {
    method:'post',
    url:'/reception',
    headers:{
      'content-type':'digger/contract',
      'x-contract-type':type
    },
    body:contracts || []
  }

  // we use this to generate hooked up containers as results
  var stub = self.container();
  stub.supplychain = this;

  return this.contract(raw, stub);
}

/*

  create a merge contract from an array of existing contracts
  
*/
SupplyChain.prototype.merge = function(contracts){
  return this.contract_group('merge', contracts);
}

/*

  create a pipe contract from an array of existing contracts
  
*/
SupplyChain.prototype.pipe = function(contracts){
  return this.contract_group('pipe', contracts);
}
},{"__browserify_process":38,"digger-container":20,"digger-utils":24,"events":36,"util":37}],26:[function(require,module,exports){
/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var SupplyChain = require('digger-supplychain');
var Container = require('digger-container');

/*

	setup the full container api for the client
	
*/
Container.augment_prototype(require('digger-contracts'));
Container.augment_prototype(require('digger-find'));


/*

	the client factory - you pass a handle function for requests and it
	returns a $digger from which you can connect to containers and warehouses
	
*/
module.exports = function(handle){
	var supplychain = SupplyChain(handle, Container);
	return supplychain;
}

module.exports.Container = Container;
},{"digger-container":5,"digger-contracts":11,"digger-find":17,"digger-supplychain":25}],27:[function(require,module,exports){
module.exports=require(1)
},{}],28:[function(require,module,exports){
module.exports=require(2)
},{}],29:[function(require,module,exports){
module.exports=require(10)
},{"extend":27,"hat":28}],30:[function(require,module,exports){
var process=require("__browserify_process");;!function(exports, undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || this._all;
    }
    else {
      return this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if(!this._all) {
      this._all = [];
    }

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return EventEmitter;
    });
  } else {
    exports.EventEmitter2 = EventEmitter;
  }

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);

},{"__browserify_process":38}],31:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*

	BLUEPRINTS
	
*/
var blueprints = {};

module.exports = function(){
	return {
	  add:function(blueprint){
	  	if(!blueprint.fields){
	  		if(typeof(blueprint.find)==='function'){
	  			blueprint.fields = blueprint.find('field').models;		
	  		}
	  		else{
	  			blueprint.fields = [];
	  		}
	  	}

	  	blueprints[blueprint.title()] = blueprint;
	  	
	    return this;
	  },
	  get:function(name){
	    if(arguments.length<=0){
	      return blueprints;
	    }
	    return blueprints[name];
	  },
	  all:function(){
	  	var ret = {};
	  	for(var prop in blueprints){
	  		ret[prop] = blueprints[prop];
	  	}
	  	return ret;
	  },
	  create:function(name){
			var blueprint = this.get(name);
			if(!blueprint){
				return $digger.create(name, {});
			}
			var data = blueprint ? {
				_digger:{
					tag:blueprint.attr('tag') || blueprint.attr('name'),
					class:blueprint.attr('class') || []
				}
			} : {}

			blueprint.find('field').each(function(field){
				var name = field.attr('name');
				var def = field.attr('default');

				if(def){
					data[name] = def;
				}
			})

			var container = $digger.create([data]);
			container.data('new', true);

			return container;
	  }
	}
}
},{}],"digger-sockets":[function(require,module,exports){
module.exports=require('E9YBgr');
},{}],"E9YBgr":[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/**
 * Module dependencies.
 */

var utils = require('digger-utils');
var Client = require('digger-client');
//var Sockets = require('socket.io-client');

var Blueprint = require('./blueprints');
var Template = require('./templates');
var Radio = require('./radio');

/*

	we construct the global $digger using this factory function

	we pass it the environment options such as:

		hostname of the digger server (to connect the socket to)
	
*/
module.exports = function(config){

	config = config || {};

	// the object we return
	var $digger;

	if(config.debug){
		console.log('-------------------------------------------');
		console.log('-------------------------------------------');
		console.log('CONFIG');
		console.dir(config);	
	}
	
	var socket = new SockJS('//' + (config.host || 'localhost') + '/digger/sockets');



	/*
	
		requests issued before we had a socket connection or our other transport was ready
		
	*/
	var request_buffer = [];
	var socketconnected = false;
	var callbacks = {};

	function disconnected_handler(req, reply){
		request_buffer.push({
			req:req,
			reply:reply
		})
	}

	function padding(offset){
		offset = offset || 0;
		var st = '';
		for(var i=0; i<offset; i++){
			st += '    ';
		}
		return st;
	}

	function is_contract(req){
		return req.url=='/reception' && req.method=='post';
	}

	function log_contract(contract, offset){
		console.log(padding(offset) + '-------------------------------------------');
		console.log(padding(offset) + 'contract: ' + contract.headers['x-contract-type']);
		offset++;
		var summary = [];
		(contract.body || []).forEach(function(child){
			summary.push(log_request(child, offset));
		})
		return 'contract: ' + summary.join(' ' + contract.headers['x-contract-type'] + ' ');
	}

	function log_warehouse_request(req, offset){
		var extra = '';
		if(req.headers['x-json-selector']){
			var selector = req.headers['x-json-selector'];
			extra = ' - select: ' + selector.string;
		}
		var summary = 'request: ' + req.method + ' ' + req.url + extra;
		console.log(padding(offset) + '-------------------------------------------');
		console.log(padding(offset) + summary);

		return summary;
	}

	function log_request(packet, offset){
		offset = offset || 0;
		var summary = '';
		if(is_contract(packet)){
			summary = log_contract(packet, offset);
		}
		else{
			summary = log_warehouse_request(packet, offset);
		}
		return summary;
	}

	function log_response_factory(summary){
		return function(answer){
			var extra = '';
			if(answer.error){
				extra = 'ERROR: ' + answer.error;
			}
			else{
				extra = summary;
			}
			console.log('-------------------------------------------');
			console.log('ANSWER');
			console.log(extra);
			console.log('-------------------------------------------');
			console.dir(answer.results);
			console.log('-------------------------------------------');	
		}
	}

	function clear_buffer(){
  	var usebuffer = [].concat(request_buffer);
		usebuffer.forEach(function(buffered_request){
  		run_socket(buffered_request.req, buffered_request.reply);
  	})
  	
  	request_buffer = [];
	}


	function connected_handler(req, reply){

		if(!req || !req.url || !req.method){
			throw new Error('req must have a url and method');
		}
		
		/*
		
			------------------------------------------------------
			------------------------------------------------------
			------------------------------------------------------
			------------------------------------------------------
			------------------------------------------------------

			THIS IS A TERRIBLE HACK

			I have changed to sockjs - defo a good idea coz it aint
			bloatware like socket.io

			However - and another good thing - we have lost the old
			(very hacky) way of accessing the cookie from the handsake
			of the socket

			So - the solution is to have OAuth Access tokens working
			alongside cookie logins

			A session can have the OAuth tokens and so those can be
			written to the page and then they can be submitted to the socket

		*/
		var headers = req.headers || {};

		if(config.user){
			headers['x-json-user'] = config.user;
		}

		var http_req = {
			id:utils.littleid(),
			method:req.method,
			url:req.url,
			headers:headers,
			body:req.body
		}

		var log_response = null;

		if($digger.config.debug){
			log_response = log_response_factory(log_request(req));
		}

		callbacks[http_req.id] = function(answer){

			/*
			
				the socket handler bundles the error and answer into a single object
				
			*/
			var error = answer.error;
			var results = answer.results;

			reply(error, results);

			if($digger.config.debug){
				log_response(answer);
			}

			delete(callbacks[http_req.id]);
		}
		
		socket.send(JSON.stringify({
			type:'request',
			data:http_req
		}))
	}

	function socket_answer(payload){
		payload = payload.toString();
		payload = JSON.parse(payload);

		if(payload.type=='response'){
			var answer = payload.data;
			var id = answer.id;
			var callback = callbacks[id];
			if(callback){
				callback(answer);
			}	
		}
		else if(payload.type=='radio'){

			var packet = payload.data;

			// pipe the packet into the radio
			$digger.radio.receive(packet.channel, packet.body);
		}
		else if(payload.type=='error'){
			console.error('socket error: ' + payload.error);
		}
		else{
			console.error('unknown payload type: ' + payload.type);	
		}
	}

	function run_socket(req, reply){
		if(socketconnected){
			connected_handler(req, reply);
		}
		else{
			disconnected_handler(req, reply);
		}
	};

  socket.onopen = function() {
    if(config.debug){
    	console.log('socket connected');
    }
    socketconnected = true;
    $digger.emit('connect');
    setTimeout(clear_buffer, 10);
  };

  // start off with the message buffer
  socket.onmessage = function(e){
  	if(e.type==='message'){
  		socket_answer(e.data);
  	}
  }
  
  // close
  socket.onclose = function() {
    if(config.debug){
    	console.log('socket disconnected');
    }

    socketconnected = false;
    $digger.emit('disconnect');
  };

	/*
	
		the main handle function that connects the front end supplychain with the backend reception server

		we study the page to see if we have a JQuery or angular on the page

		if we do - then our requests go via the XHR or them

		otherwise we run our requests through the socket

		in all cases the portals run via the socket
		
	*/
	$digger = Client(run_socket);

	$digger.config = config;
	$digger.user = config.user;
	$digger.blueprint = Blueprint();
	$digger.template = Template();
	$digger.radio = Radio();

	/*
	
		write the radio broadcast down the wire

		$digger.radio.recieve(packet.channel, packet.);

		^^^^^^ this is up in the generic socket reciever
		
	*/
	$digger.radio.on('talk', function(channel, payload){
		socket.send(JSON.stringify({
			type:'radio:talk',
			data:{
				channel:channel,
				body:body
			}
		}))
	})

	$digger.radio.on('listen', function(channel, payload){
		socket.send(JSON.stringify({
			type:'radio:listen',
			data:channel
		}))
	})

	$digger.radio.on('cancel', function(channel, payload){
		socket.send(JSON.stringify({
			type:'radio:cancel',
			data:channel
		}))
	})



	/*
	
		we have been given some blueprints to automatically load
		
	
	if(config.blueprints){
		setTimeout(function(){
			var blueprintwarehouse = $digger.connect(config.blueprints);
			blueprintwarehouse('*')
				.ship(function(blueprints){
					blueprints.find('blueprint').each(function(blueprint){
	          $digger.blueprint.add(blueprint);
	        })
				})
		})
	}
	*/
	return $digger;
}
},{"./blueprints":31,"./radio":34,"./templates":35,"digger-client":26,"digger-utils":29}],34:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*

	the channels we are listening to
	
*/
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var util = require('util');

module.exports = function(){
	var radio = new EventEmitter2({
    wildcard: true
  })

  var channels = new EventEmitter2({
    wildcard: true
  })

  radio.talk = function(channel, body){
  	radio.emit('talk', channel, body);
  }

  radio.listen = function(channel, fn){
  	if(!fn){
			fn = channel;
			channel = '*';
		}
		channel = (channel===null || channel==='') ? '*' : channel;
		channels.on(channel==='*' ? '_all' : channel, fn);
  	radio.emit('listen', channel);
  }

  radio.cancel = function(channel, fn){
  	var emitterkey = channel==='*' ? '_all': channel;

		if(fn){
			radio.off(emitterkey, fn);
		}
		else{
			radio.removeAllListeners(emitterkey);	
		}
		var listeners = radio.listeners(emitterkey);
		if(listeners.length<=0){
			radio.emit('cancel', channel.replace(/\*$/, ''));
		}
  }

  radio.receive = function(channel, body){
		channels.emit(channel, body, channel);
		channels.emit('_all', body, channel);
  }

  return radio;

}
},{"eventemitter2":30,"util":37}],35:[function(require,module,exports){
/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*

	TEMPLATES
	
*/
module.exports = function(){
	return {
		templates:{},
		add:function(name, plate){
			this.templates[name] = plate.replace(/^\s+/, '').replace(/\s+$/);
	    return this;
	  },
	  get:function(name){
	    if(arguments.length<=0){
	      return this.templates;
	    }
	    return this.templates[name];
	  }
	}
}
},{}],36:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":38}],37:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\u001b[' + styles[style][0] + 'm' + str +
             '\u001b[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}


function isRegExp(re) {
  typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]';
}


function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":36}],38:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[])
;