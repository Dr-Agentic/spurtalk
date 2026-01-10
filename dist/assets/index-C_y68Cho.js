var sc=Object.defineProperty;var uc=(e,t,n)=>t in e?sc(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var Sl=(e,t,n)=>uc(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerPolicy&&(i.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?i.credentials="include":l.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(l){if(l.ep)return;l.ep=!0;const i=n(l);fetch(l.href,i)}})();function ac(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Xs={exports:{}},nl={},Zs={exports:{}},L={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zn=Symbol.for("react.element"),cc=Symbol.for("react.portal"),dc=Symbol.for("react.fragment"),fc=Symbol.for("react.strict_mode"),pc=Symbol.for("react.profiler"),mc=Symbol.for("react.provider"),hc=Symbol.for("react.context"),gc=Symbol.for("react.forward_ref"),vc=Symbol.for("react.suspense"),yc=Symbol.for("react.memo"),wc=Symbol.for("react.lazy"),Uo=Symbol.iterator;function kc(e){return e===null||typeof e!="object"?null:(e=Uo&&e[Uo]||e["@@iterator"],typeof e=="function"?e:null)}var Js={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},qs=Object.assign,bs={};function an(e,t,n){this.props=e,this.context=t,this.refs=bs,this.updater=n||Js}an.prototype.isReactComponent={};an.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};an.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function eu(){}eu.prototype=an.prototype;function Wi(e,t,n){this.props=e,this.context=t,this.refs=bs,this.updater=n||Js}var Qi=Wi.prototype=new eu;Qi.constructor=Wi;qs(Qi,an.prototype);Qi.isPureReactComponent=!0;var Bo=Array.isArray,tu=Object.prototype.hasOwnProperty,Yi={current:null},nu={key:!0,ref:!0,__self:!0,__source:!0};function ru(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)tu.call(t,r)&&!nu.hasOwnProperty(r)&&(l[r]=t[r]);var s=arguments.length-2;if(s===1)l.children=n;else if(1<s){for(var u=Array(s),d=0;d<s;d++)u[d]=arguments[d+2];l.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)l[r]===void 0&&(l[r]=s[r]);return{$$typeof:Zn,type:e,key:i,ref:o,props:l,_owner:Yi.current}}function xc(e,t){return{$$typeof:Zn,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ki(e){return typeof e=="object"&&e!==null&&e.$$typeof===Zn}function Sc(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var $o=/\/+/g;function Cl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Sc(""+e.key):t.toString(36)}function kr(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Zn:case cc:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+Cl(o,0):r,Bo(l)?(n="",e!=null&&(n=e.replace($o,"$&/")+"/"),kr(l,t,n,"",function(d){return d})):l!=null&&(Ki(l)&&(l=xc(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace($o,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",Bo(e))for(var s=0;s<e.length;s++){i=e[s];var u=r+Cl(i,s);o+=kr(i,t,n,u,l)}else if(u=kc(e),typeof u=="function")for(e=u.call(e),s=0;!(i=e.next()).done;)i=i.value,u=r+Cl(i,s++),o+=kr(i,t,n,u,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function rr(e,t,n){if(e==null)return e;var r=[],l=0;return kr(e,r,"","",function(i){return t.call(n,i,l++)}),r}function Cc(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ue={current:null},xr={transition:null},Ec={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:xr,ReactCurrentOwner:Yi};function lu(){throw Error("act(...) is not supported in production builds of React.")}L.Children={map:rr,forEach:function(e,t,n){rr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return rr(e,function(){t++}),t},toArray:function(e){return rr(e,function(t){return t})||[]},only:function(e){if(!Ki(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};L.Component=an;L.Fragment=dc;L.Profiler=pc;L.PureComponent=Wi;L.StrictMode=fc;L.Suspense=vc;L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ec;L.act=lu;L.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=qs({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Yi.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(u in t)tu.call(t,u)&&!nu.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&s!==void 0?s[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){s=Array(u);for(var d=0;d<u;d++)s[d]=arguments[d+2];r.children=s}return{$$typeof:Zn,type:e.type,key:l,ref:i,props:r,_owner:o}};L.createContext=function(e){return e={$$typeof:hc,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:mc,_context:e},e.Consumer=e};L.createElement=ru;L.createFactory=function(e){var t=ru.bind(null,e);return t.type=e,t};L.createRef=function(){return{current:null}};L.forwardRef=function(e){return{$$typeof:gc,render:e}};L.isValidElement=Ki;L.lazy=function(e){return{$$typeof:wc,_payload:{_status:-1,_result:e},_init:Cc}};L.memo=function(e,t){return{$$typeof:yc,type:e,compare:t===void 0?null:t}};L.startTransition=function(e){var t=xr.transition;xr.transition={};try{e()}finally{xr.transition=t}};L.unstable_act=lu;L.useCallback=function(e,t){return ue.current.useCallback(e,t)};L.useContext=function(e){return ue.current.useContext(e)};L.useDebugValue=function(){};L.useDeferredValue=function(e){return ue.current.useDeferredValue(e)};L.useEffect=function(e,t){return ue.current.useEffect(e,t)};L.useId=function(){return ue.current.useId()};L.useImperativeHandle=function(e,t,n){return ue.current.useImperativeHandle(e,t,n)};L.useInsertionEffect=function(e,t){return ue.current.useInsertionEffect(e,t)};L.useLayoutEffect=function(e,t){return ue.current.useLayoutEffect(e,t)};L.useMemo=function(e,t){return ue.current.useMemo(e,t)};L.useReducer=function(e,t,n){return ue.current.useReducer(e,t,n)};L.useRef=function(e){return ue.current.useRef(e)};L.useState=function(e){return ue.current.useState(e)};L.useSyncExternalStore=function(e,t,n){return ue.current.useSyncExternalStore(e,t,n)};L.useTransition=function(){return ue.current.useTransition()};L.version="18.3.1";Zs.exports=L;var ve=Zs.exports;const Zl=ac(ve);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nc=ve,_c=Symbol.for("react.element"),Tc=Symbol.for("react.fragment"),jc=Object.prototype.hasOwnProperty,Pc=Nc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,zc={key:!0,ref:!0,__self:!0,__source:!0};function iu(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)jc.call(t,r)&&!zc.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:_c,type:e,key:i,ref:o,props:l,_owner:Pc.current}}nl.Fragment=Tc;nl.jsx=iu;nl.jsxs=iu;Xs.exports=nl;var p=Xs.exports,Jl={},ou={exports:{}},xe={},su={exports:{}},uu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,j){var z=T.length;T.push(j);e:for(;0<z;){var Q=z-1>>>1,Z=T[Q];if(0<l(Z,j))T[Q]=j,T[z]=Z,z=Q;else break e}}function n(T){return T.length===0?null:T[0]}function r(T){if(T.length===0)return null;var j=T[0],z=T.pop();if(z!==j){T[0]=z;e:for(var Q=0,Z=T.length,tr=Z>>>1;Q<tr;){var kt=2*(Q+1)-1,xl=T[kt],xt=kt+1,nr=T[xt];if(0>l(xl,z))xt<Z&&0>l(nr,xl)?(T[Q]=nr,T[xt]=z,Q=xt):(T[Q]=xl,T[kt]=z,Q=kt);else if(xt<Z&&0>l(nr,z))T[Q]=nr,T[xt]=z,Q=xt;else break e}}return j}function l(T,j){var z=T.sortIndex-j.sortIndex;return z!==0?z:T.id-j.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var u=[],d=[],v=1,g=null,h=3,k=!1,x=!1,C=!1,R=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function a(T){for(var j=n(d);j!==null;){if(j.callback===null)r(d);else if(j.startTime<=T)r(d),j.sortIndex=j.expirationTime,t(u,j);else break;j=n(d)}}function m(T){if(C=!1,a(T),!x)if(n(u)!==null)x=!0,wt(y);else{var j=n(d);j!==null&&kl(m,j.startTime-T)}}function y(T,j){x=!1,C&&(C=!1,f(_),_=-1),k=!0;var z=h;try{for(a(j),g=n(u);g!==null&&(!(g.expirationTime>j)||T&&!he());){var Q=g.callback;if(typeof Q=="function"){g.callback=null,h=g.priorityLevel;var Z=Q(g.expirationTime<=j);j=e.unstable_now(),typeof Z=="function"?g.callback=Z:g===n(u)&&r(u),a(j)}else r(u);g=n(u)}if(g!==null)var tr=!0;else{var kt=n(d);kt!==null&&kl(m,kt.startTime-j),tr=!1}return tr}finally{g=null,h=z,k=!1}}var S=!1,E=null,_=-1,O=5,P=-1;function he(){return!(e.unstable_now()-P<O)}function yt(){if(E!==null){var T=e.unstable_now();P=T;var j=!0;try{j=E(!0,T)}finally{j?M():(S=!1,E=null)}}else S=!1}var M;if(typeof c=="function")M=function(){c(yt)};else if(typeof MessageChannel<"u"){var Ce=new MessageChannel,wl=Ce.port2;Ce.port1.onmessage=yt,M=function(){wl.postMessage(null)}}else M=function(){R(yt,0)};function wt(T){E=T,S||(S=!0,M())}function kl(T,j){_=R(function(){T(e.unstable_now())},j)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){x||k||(x=!0,wt(y))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):O=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return h},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(T){switch(h){case 1:case 2:case 3:var j=3;break;default:j=h}var z=h;h=j;try{return T()}finally{h=z}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,j){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var z=h;h=T;try{return j()}finally{h=z}},e.unstable_scheduleCallback=function(T,j,z){var Q=e.unstable_now();switch(typeof z=="object"&&z!==null?(z=z.delay,z=typeof z=="number"&&0<z?Q+z:Q):z=Q,T){case 1:var Z=-1;break;case 2:Z=250;break;case 5:Z=1073741823;break;case 4:Z=1e4;break;default:Z=5e3}return Z=z+Z,T={id:v++,callback:j,priorityLevel:T,startTime:z,expirationTime:Z,sortIndex:-1},z>Q?(T.sortIndex=z,t(d,T),n(u)===null&&T===n(d)&&(C?(f(_),_=-1):C=!0,kl(m,z-Q))):(T.sortIndex=Z,t(u,T),x||k||(x=!0,wt(y))),T},e.unstable_shouldYield=he,e.unstable_wrapCallback=function(T){var j=h;return function(){var z=h;h=j;try{return T.apply(this,arguments)}finally{h=z}}}})(uu);su.exports=uu;var Lc=su.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Mc=ve,ke=Lc;function w(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var au=new Set,Dn={};function It(e,t){tn(e,t),tn(e+"Capture",t)}function tn(e,t){for(Dn[e]=t,e=0;e<t.length;e++)au.add(t[e])}var Ke=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ql=Object.prototype.hasOwnProperty,Dc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Vo={},Ho={};function Ic(e){return ql.call(Ho,e)?!0:ql.call(Vo,e)?!1:Dc.test(e)?Ho[e]=!0:(Vo[e]=!0,!1)}function Rc(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Oc(e,t,n,r){if(t===null||typeof t>"u"||Rc(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ae(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var te={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){te[e]=new ae(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];te[t]=new ae(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){te[e]=new ae(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){te[e]=new ae(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){te[e]=new ae(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){te[e]=new ae(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){te[e]=new ae(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){te[e]=new ae(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){te[e]=new ae(e,5,!1,e.toLowerCase(),null,!1,!1)});var Gi=/[\-:]([a-z])/g;function Xi(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Gi,Xi);te[t]=new ae(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Gi,Xi);te[t]=new ae(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Gi,Xi);te[t]=new ae(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){te[e]=new ae(e,1,!1,e.toLowerCase(),null,!1,!1)});te.xlinkHref=new ae("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){te[e]=new ae(e,1,!1,e.toLowerCase(),null,!0,!0)});function Zi(e,t,n,r){var l=te.hasOwnProperty(t)?te[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Oc(t,n,l,r)&&(n=null),r||l===null?Ic(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var Je=Mc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,lr=Symbol.for("react.element"),Ft=Symbol.for("react.portal"),At=Symbol.for("react.fragment"),Ji=Symbol.for("react.strict_mode"),bl=Symbol.for("react.profiler"),cu=Symbol.for("react.provider"),du=Symbol.for("react.context"),qi=Symbol.for("react.forward_ref"),ei=Symbol.for("react.suspense"),ti=Symbol.for("react.suspense_list"),bi=Symbol.for("react.memo"),be=Symbol.for("react.lazy"),fu=Symbol.for("react.offscreen"),Wo=Symbol.iterator;function fn(e){return e===null||typeof e!="object"?null:(e=Wo&&e[Wo]||e["@@iterator"],typeof e=="function"?e:null)}var H=Object.assign,El;function kn(e){if(El===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);El=t&&t[1]||""}return`
`+El+e}var Nl=!1;function _l(e,t){if(!e||Nl)return"";Nl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var l=d.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,s=i.length-1;1<=o&&0<=s&&l[o]!==i[s];)s--;for(;1<=o&&0<=s;o--,s--)if(l[o]!==i[s]){if(o!==1||s!==1)do if(o--,s--,0>s||l[o]!==i[s]){var u=`
`+l[o].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=o&&0<=s);break}}}finally{Nl=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?kn(e):""}function Fc(e){switch(e.tag){case 5:return kn(e.type);case 16:return kn("Lazy");case 13:return kn("Suspense");case 19:return kn("SuspenseList");case 0:case 2:case 15:return e=_l(e.type,!1),e;case 11:return e=_l(e.type.render,!1),e;case 1:return e=_l(e.type,!0),e;default:return""}}function ni(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case At:return"Fragment";case Ft:return"Portal";case bl:return"Profiler";case Ji:return"StrictMode";case ei:return"Suspense";case ti:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case du:return(e.displayName||"Context")+".Consumer";case cu:return(e._context.displayName||"Context")+".Provider";case qi:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case bi:return t=e.displayName||null,t!==null?t:ni(e.type)||"Memo";case be:t=e._payload,e=e._init;try{return ni(e(t))}catch{}}return null}function Ac(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ni(t);case 8:return t===Ji?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function pt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pu(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Uc(e){var t=pu(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ir(e){e._valueTracker||(e._valueTracker=Uc(e))}function mu(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=pu(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Mr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ri(e,t){var n=t.checked;return H({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Qo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=pt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function hu(e,t){t=t.checked,t!=null&&Zi(e,"checked",t,!1)}function li(e,t){hu(e,t);var n=pt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ii(e,t.type,n):t.hasOwnProperty("defaultValue")&&ii(e,t.type,pt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Yo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ii(e,t,n){(t!=="number"||Mr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var xn=Array.isArray;function Xt(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+pt(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function oi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(w(91));return H({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ko(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(w(92));if(xn(n)){if(1<n.length)throw Error(w(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:pt(n)}}function gu(e,t){var n=pt(t.value),r=pt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Go(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function vu(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function si(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?vu(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var or,yu=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(or=or||document.createElement("div"),or.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=or.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function In(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var En={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Bc=["Webkit","ms","Moz","O"];Object.keys(En).forEach(function(e){Bc.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),En[t]=En[e]})});function wu(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||En.hasOwnProperty(e)&&En[e]?(""+t).trim():t+"px"}function ku(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=wu(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var $c=H({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ui(e,t){if(t){if($c[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(w(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(w(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(w(61))}if(t.style!=null&&typeof t.style!="object")throw Error(w(62))}}function ai(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ci=null;function eo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var di=null,Zt=null,Jt=null;function Xo(e){if(e=bn(e)){if(typeof di!="function")throw Error(w(280));var t=e.stateNode;t&&(t=sl(t),di(e.stateNode,e.type,t))}}function xu(e){Zt?Jt?Jt.push(e):Jt=[e]:Zt=e}function Su(){if(Zt){var e=Zt,t=Jt;if(Jt=Zt=null,Xo(e),t)for(e=0;e<t.length;e++)Xo(t[e])}}function Cu(e,t){return e(t)}function Eu(){}var Tl=!1;function Nu(e,t,n){if(Tl)return e(t,n);Tl=!0;try{return Cu(e,t,n)}finally{Tl=!1,(Zt!==null||Jt!==null)&&(Eu(),Su())}}function Rn(e,t){var n=e.stateNode;if(n===null)return null;var r=sl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(w(231,t,typeof n));return n}var fi=!1;if(Ke)try{var pn={};Object.defineProperty(pn,"passive",{get:function(){fi=!0}}),window.addEventListener("test",pn,pn),window.removeEventListener("test",pn,pn)}catch{fi=!1}function Vc(e,t,n,r,l,i,o,s,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(v){this.onError(v)}}var Nn=!1,Dr=null,Ir=!1,pi=null,Hc={onError:function(e){Nn=!0,Dr=e}};function Wc(e,t,n,r,l,i,o,s,u){Nn=!1,Dr=null,Vc.apply(Hc,arguments)}function Qc(e,t,n,r,l,i,o,s,u){if(Wc.apply(this,arguments),Nn){if(Nn){var d=Dr;Nn=!1,Dr=null}else throw Error(w(198));Ir||(Ir=!0,pi=d)}}function Rt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function _u(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Zo(e){if(Rt(e)!==e)throw Error(w(188))}function Yc(e){var t=e.alternate;if(!t){if(t=Rt(e),t===null)throw Error(w(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return Zo(l),e;if(i===r)return Zo(l),t;i=i.sibling}throw Error(w(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,s=l.child;s;){if(s===n){o=!0,n=l,r=i;break}if(s===r){o=!0,r=l,n=i;break}s=s.sibling}if(!o){for(s=i.child;s;){if(s===n){o=!0,n=i,r=l;break}if(s===r){o=!0,r=i,n=l;break}s=s.sibling}if(!o)throw Error(w(189))}}if(n.alternate!==r)throw Error(w(190))}if(n.tag!==3)throw Error(w(188));return n.stateNode.current===n?e:t}function Tu(e){return e=Yc(e),e!==null?ju(e):null}function ju(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ju(e);if(t!==null)return t;e=e.sibling}return null}var Pu=ke.unstable_scheduleCallback,Jo=ke.unstable_cancelCallback,Kc=ke.unstable_shouldYield,Gc=ke.unstable_requestPaint,Y=ke.unstable_now,Xc=ke.unstable_getCurrentPriorityLevel,to=ke.unstable_ImmediatePriority,zu=ke.unstable_UserBlockingPriority,Rr=ke.unstable_NormalPriority,Zc=ke.unstable_LowPriority,Lu=ke.unstable_IdlePriority,rl=null,Be=null;function Jc(e){if(Be&&typeof Be.onCommitFiberRoot=="function")try{Be.onCommitFiberRoot(rl,e,void 0,(e.current.flags&128)===128)}catch{}}var Ie=Math.clz32?Math.clz32:ed,qc=Math.log,bc=Math.LN2;function ed(e){return e>>>=0,e===0?32:31-(qc(e)/bc|0)|0}var sr=64,ur=4194304;function Sn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Or(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var s=o&~l;s!==0?r=Sn(s):(i&=o,i!==0&&(r=Sn(i)))}else o=n&~l,o!==0?r=Sn(o):i!==0&&(r=Sn(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Ie(t),l=1<<n,r|=e[n],t&=~l;return r}function td(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-Ie(i),s=1<<o,u=l[o];u===-1?(!(s&n)||s&r)&&(l[o]=td(s,t)):u<=t&&(e.expiredLanes|=s),i&=~s}}function mi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Mu(){var e=sr;return sr<<=1,!(sr&4194240)&&(sr=64),e}function jl(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Jn(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ie(t),e[t]=n}function rd(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Ie(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function no(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ie(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var I=0;function Du(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Iu,ro,Ru,Ou,Fu,hi=!1,ar=[],it=null,ot=null,st=null,On=new Map,Fn=new Map,tt=[],ld="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qo(e,t){switch(e){case"focusin":case"focusout":it=null;break;case"dragenter":case"dragleave":ot=null;break;case"mouseover":case"mouseout":st=null;break;case"pointerover":case"pointerout":On.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Fn.delete(t.pointerId)}}function mn(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=bn(t),t!==null&&ro(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function id(e,t,n,r,l){switch(t){case"focusin":return it=mn(it,e,t,n,r,l),!0;case"dragenter":return ot=mn(ot,e,t,n,r,l),!0;case"mouseover":return st=mn(st,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return On.set(i,mn(On.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,Fn.set(i,mn(Fn.get(i)||null,e,t,n,r,l)),!0}return!1}function Au(e){var t=Et(e.target);if(t!==null){var n=Rt(t);if(n!==null){if(t=n.tag,t===13){if(t=_u(n),t!==null){e.blockedOn=t,Fu(e.priority,function(){Ru(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Sr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=gi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ci=r,n.target.dispatchEvent(r),ci=null}else return t=bn(n),t!==null&&ro(t),e.blockedOn=n,!1;t.shift()}return!0}function bo(e,t,n){Sr(e)&&n.delete(t)}function od(){hi=!1,it!==null&&Sr(it)&&(it=null),ot!==null&&Sr(ot)&&(ot=null),st!==null&&Sr(st)&&(st=null),On.forEach(bo),Fn.forEach(bo)}function hn(e,t){e.blockedOn===t&&(e.blockedOn=null,hi||(hi=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,od)))}function An(e){function t(l){return hn(l,e)}if(0<ar.length){hn(ar[0],e);for(var n=1;n<ar.length;n++){var r=ar[n];r.blockedOn===e&&(r.blockedOn=null)}}for(it!==null&&hn(it,e),ot!==null&&hn(ot,e),st!==null&&hn(st,e),On.forEach(t),Fn.forEach(t),n=0;n<tt.length;n++)r=tt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<tt.length&&(n=tt[0],n.blockedOn===null);)Au(n),n.blockedOn===null&&tt.shift()}var qt=Je.ReactCurrentBatchConfig,Fr=!0;function sd(e,t,n,r){var l=I,i=qt.transition;qt.transition=null;try{I=1,lo(e,t,n,r)}finally{I=l,qt.transition=i}}function ud(e,t,n,r){var l=I,i=qt.transition;qt.transition=null;try{I=4,lo(e,t,n,r)}finally{I=l,qt.transition=i}}function lo(e,t,n,r){if(Fr){var l=gi(e,t,n,r);if(l===null)Al(e,t,r,Ar,n),qo(e,r);else if(id(l,e,t,n,r))r.stopPropagation();else if(qo(e,r),t&4&&-1<ld.indexOf(e)){for(;l!==null;){var i=bn(l);if(i!==null&&Iu(i),i=gi(e,t,n,r),i===null&&Al(e,t,r,Ar,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else Al(e,t,r,null,n)}}var Ar=null;function gi(e,t,n,r){if(Ar=null,e=eo(r),e=Et(e),e!==null)if(t=Rt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=_u(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ar=e,null}function Uu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Xc()){case to:return 1;case zu:return 4;case Rr:case Zc:return 16;case Lu:return 536870912;default:return 16}default:return 16}}var rt=null,io=null,Cr=null;function Bu(){if(Cr)return Cr;var e,t=io,n=t.length,r,l="value"in rt?rt.value:rt.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return Cr=l.slice(e,1<r?1-r:void 0)}function Er(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function cr(){return!0}function es(){return!1}function Se(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(i):i[s]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?cr:es,this.isPropagationStopped=es,this}return H(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=cr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=cr)},persist:function(){},isPersistent:cr}),t}var cn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},oo=Se(cn),qn=H({},cn,{view:0,detail:0}),ad=Se(qn),Pl,zl,gn,ll=H({},qn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:so,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==gn&&(gn&&e.type==="mousemove"?(Pl=e.screenX-gn.screenX,zl=e.screenY-gn.screenY):zl=Pl=0,gn=e),Pl)},movementY:function(e){return"movementY"in e?e.movementY:zl}}),ts=Se(ll),cd=H({},ll,{dataTransfer:0}),dd=Se(cd),fd=H({},qn,{relatedTarget:0}),Ll=Se(fd),pd=H({},cn,{animationName:0,elapsedTime:0,pseudoElement:0}),md=Se(pd),hd=H({},cn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),gd=Se(hd),vd=H({},cn,{data:0}),ns=Se(vd),yd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},wd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kd={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function xd(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=kd[e])?!!t[e]:!1}function so(){return xd}var Sd=H({},qn,{key:function(e){if(e.key){var t=yd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Er(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?wd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:so,charCode:function(e){return e.type==="keypress"?Er(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Er(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Cd=Se(Sd),Ed=H({},ll,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),rs=Se(Ed),Nd=H({},qn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:so}),_d=Se(Nd),Td=H({},cn,{propertyName:0,elapsedTime:0,pseudoElement:0}),jd=Se(Td),Pd=H({},ll,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),zd=Se(Pd),Ld=[9,13,27,32],uo=Ke&&"CompositionEvent"in window,_n=null;Ke&&"documentMode"in document&&(_n=document.documentMode);var Md=Ke&&"TextEvent"in window&&!_n,$u=Ke&&(!uo||_n&&8<_n&&11>=_n),ls=" ",is=!1;function Vu(e,t){switch(e){case"keyup":return Ld.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ut=!1;function Dd(e,t){switch(e){case"compositionend":return Hu(t);case"keypress":return t.which!==32?null:(is=!0,ls);case"textInput":return e=t.data,e===ls&&is?null:e;default:return null}}function Id(e,t){if(Ut)return e==="compositionend"||!uo&&Vu(e,t)?(e=Bu(),Cr=io=rt=null,Ut=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return $u&&t.locale!=="ko"?null:t.data;default:return null}}var Rd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function os(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Rd[e.type]:t==="textarea"}function Wu(e,t,n,r){xu(r),t=Ur(t,"onChange"),0<t.length&&(n=new oo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Tn=null,Un=null;function Od(e){ta(e,0)}function il(e){var t=Vt(e);if(mu(t))return e}function Fd(e,t){if(e==="change")return t}var Qu=!1;if(Ke){var Ml;if(Ke){var Dl="oninput"in document;if(!Dl){var ss=document.createElement("div");ss.setAttribute("oninput","return;"),Dl=typeof ss.oninput=="function"}Ml=Dl}else Ml=!1;Qu=Ml&&(!document.documentMode||9<document.documentMode)}function us(){Tn&&(Tn.detachEvent("onpropertychange",Yu),Un=Tn=null)}function Yu(e){if(e.propertyName==="value"&&il(Un)){var t=[];Wu(t,Un,e,eo(e)),Nu(Od,t)}}function Ad(e,t,n){e==="focusin"?(us(),Tn=t,Un=n,Tn.attachEvent("onpropertychange",Yu)):e==="focusout"&&us()}function Ud(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return il(Un)}function Bd(e,t){if(e==="click")return il(t)}function $d(e,t){if(e==="input"||e==="change")return il(t)}function Vd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Oe=typeof Object.is=="function"?Object.is:Vd;function Bn(e,t){if(Oe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!ql.call(t,l)||!Oe(e[l],t[l]))return!1}return!0}function as(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function cs(e,t){var n=as(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=as(n)}}function Ku(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ku(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Gu(){for(var e=window,t=Mr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Mr(e.document)}return t}function ao(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Hd(e){var t=Gu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ku(n.ownerDocument.documentElement,n)){if(r!==null&&ao(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=cs(n,i);var o=cs(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Wd=Ke&&"documentMode"in document&&11>=document.documentMode,Bt=null,vi=null,jn=null,yi=!1;function ds(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;yi||Bt==null||Bt!==Mr(r)||(r=Bt,"selectionStart"in r&&ao(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),jn&&Bn(jn,r)||(jn=r,r=Ur(vi,"onSelect"),0<r.length&&(t=new oo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Bt)))}function dr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var $t={animationend:dr("Animation","AnimationEnd"),animationiteration:dr("Animation","AnimationIteration"),animationstart:dr("Animation","AnimationStart"),transitionend:dr("Transition","TransitionEnd")},Il={},Xu={};Ke&&(Xu=document.createElement("div").style,"AnimationEvent"in window||(delete $t.animationend.animation,delete $t.animationiteration.animation,delete $t.animationstart.animation),"TransitionEvent"in window||delete $t.transitionend.transition);function ol(e){if(Il[e])return Il[e];if(!$t[e])return e;var t=$t[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Xu)return Il[e]=t[n];return e}var Zu=ol("animationend"),Ju=ol("animationiteration"),qu=ol("animationstart"),bu=ol("transitionend"),ea=new Map,fs="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ht(e,t){ea.set(e,t),It(t,[e])}for(var Rl=0;Rl<fs.length;Rl++){var Ol=fs[Rl],Qd=Ol.toLowerCase(),Yd=Ol[0].toUpperCase()+Ol.slice(1);ht(Qd,"on"+Yd)}ht(Zu,"onAnimationEnd");ht(Ju,"onAnimationIteration");ht(qu,"onAnimationStart");ht("dblclick","onDoubleClick");ht("focusin","onFocus");ht("focusout","onBlur");ht(bu,"onTransitionEnd");tn("onMouseEnter",["mouseout","mouseover"]);tn("onMouseLeave",["mouseout","mouseover"]);tn("onPointerEnter",["pointerout","pointerover"]);tn("onPointerLeave",["pointerout","pointerover"]);It("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));It("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));It("onBeforeInput",["compositionend","keypress","textInput","paste"]);It("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));It("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));It("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Cn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Kd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Cn));function ps(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Qc(r,t,void 0,e),e.currentTarget=null}function ta(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],u=s.instance,d=s.currentTarget;if(s=s.listener,u!==i&&l.isPropagationStopped())break e;ps(l,s,d),i=u}else for(o=0;o<r.length;o++){if(s=r[o],u=s.instance,d=s.currentTarget,s=s.listener,u!==i&&l.isPropagationStopped())break e;ps(l,s,d),i=u}}}if(Ir)throw e=pi,Ir=!1,pi=null,e}function A(e,t){var n=t[Ci];n===void 0&&(n=t[Ci]=new Set);var r=e+"__bubble";n.has(r)||(na(t,e,2,!1),n.add(r))}function Fl(e,t,n){var r=0;t&&(r|=4),na(n,e,r,t)}var fr="_reactListening"+Math.random().toString(36).slice(2);function $n(e){if(!e[fr]){e[fr]=!0,au.forEach(function(n){n!=="selectionchange"&&(Kd.has(n)||Fl(n,!1,e),Fl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[fr]||(t[fr]=!0,Fl("selectionchange",!1,t))}}function na(e,t,n,r){switch(Uu(t)){case 1:var l=sd;break;case 4:l=ud;break;default:l=lo}n=l.bind(null,t,n,e),l=void 0,!fi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Al(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===l||s.nodeType===8&&s.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===l||u.nodeType===8&&u.parentNode===l))return;o=o.return}for(;s!==null;){if(o=Et(s),o===null)return;if(u=o.tag,u===5||u===6){r=i=o;continue e}s=s.parentNode}}r=r.return}Nu(function(){var d=i,v=eo(n),g=[];e:{var h=ea.get(e);if(h!==void 0){var k=oo,x=e;switch(e){case"keypress":if(Er(n)===0)break e;case"keydown":case"keyup":k=Cd;break;case"focusin":x="focus",k=Ll;break;case"focusout":x="blur",k=Ll;break;case"beforeblur":case"afterblur":k=Ll;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=ts;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=dd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=_d;break;case Zu:case Ju:case qu:k=md;break;case bu:k=jd;break;case"scroll":k=ad;break;case"wheel":k=zd;break;case"copy":case"cut":case"paste":k=gd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=rs}var C=(t&4)!==0,R=!C&&e==="scroll",f=C?h!==null?h+"Capture":null:h;C=[];for(var c=d,a;c!==null;){a=c;var m=a.stateNode;if(a.tag===5&&m!==null&&(a=m,f!==null&&(m=Rn(c,f),m!=null&&C.push(Vn(c,m,a)))),R)break;c=c.return}0<C.length&&(h=new k(h,x,null,n,v),g.push({event:h,listeners:C}))}}if(!(t&7)){e:{if(h=e==="mouseover"||e==="pointerover",k=e==="mouseout"||e==="pointerout",h&&n!==ci&&(x=n.relatedTarget||n.fromElement)&&(Et(x)||x[Ge]))break e;if((k||h)&&(h=v.window===v?v:(h=v.ownerDocument)?h.defaultView||h.parentWindow:window,k?(x=n.relatedTarget||n.toElement,k=d,x=x?Et(x):null,x!==null&&(R=Rt(x),x!==R||x.tag!==5&&x.tag!==6)&&(x=null)):(k=null,x=d),k!==x)){if(C=ts,m="onMouseLeave",f="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(C=rs,m="onPointerLeave",f="onPointerEnter",c="pointer"),R=k==null?h:Vt(k),a=x==null?h:Vt(x),h=new C(m,c+"leave",k,n,v),h.target=R,h.relatedTarget=a,m=null,Et(v)===d&&(C=new C(f,c+"enter",x,n,v),C.target=a,C.relatedTarget=R,m=C),R=m,k&&x)t:{for(C=k,f=x,c=0,a=C;a;a=Ot(a))c++;for(a=0,m=f;m;m=Ot(m))a++;for(;0<c-a;)C=Ot(C),c--;for(;0<a-c;)f=Ot(f),a--;for(;c--;){if(C===f||f!==null&&C===f.alternate)break t;C=Ot(C),f=Ot(f)}C=null}else C=null;k!==null&&ms(g,h,k,C,!1),x!==null&&R!==null&&ms(g,R,x,C,!0)}}e:{if(h=d?Vt(d):window,k=h.nodeName&&h.nodeName.toLowerCase(),k==="select"||k==="input"&&h.type==="file")var y=Fd;else if(os(h))if(Qu)y=$d;else{y=Ud;var S=Ad}else(k=h.nodeName)&&k.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(y=Bd);if(y&&(y=y(e,d))){Wu(g,y,n,v);break e}S&&S(e,h,d),e==="focusout"&&(S=h._wrapperState)&&S.controlled&&h.type==="number"&&ii(h,"number",h.value)}switch(S=d?Vt(d):window,e){case"focusin":(os(S)||S.contentEditable==="true")&&(Bt=S,vi=d,jn=null);break;case"focusout":jn=vi=Bt=null;break;case"mousedown":yi=!0;break;case"contextmenu":case"mouseup":case"dragend":yi=!1,ds(g,n,v);break;case"selectionchange":if(Wd)break;case"keydown":case"keyup":ds(g,n,v)}var E;if(uo)e:{switch(e){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Ut?Vu(e,n)&&(_="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&($u&&n.locale!=="ko"&&(Ut||_!=="onCompositionStart"?_==="onCompositionEnd"&&Ut&&(E=Bu()):(rt=v,io="value"in rt?rt.value:rt.textContent,Ut=!0)),S=Ur(d,_),0<S.length&&(_=new ns(_,e,null,n,v),g.push({event:_,listeners:S}),E?_.data=E:(E=Hu(n),E!==null&&(_.data=E)))),(E=Md?Dd(e,n):Id(e,n))&&(d=Ur(d,"onBeforeInput"),0<d.length&&(v=new ns("onBeforeInput","beforeinput",null,n,v),g.push({event:v,listeners:d}),v.data=E))}ta(g,t)})}function Vn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ur(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=Rn(e,n),i!=null&&r.unshift(Vn(e,i,l)),i=Rn(e,t),i!=null&&r.push(Vn(e,i,l))),e=e.return}return r}function Ot(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ms(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var s=n,u=s.alternate,d=s.stateNode;if(u!==null&&u===r)break;s.tag===5&&d!==null&&(s=d,l?(u=Rn(n,i),u!=null&&o.unshift(Vn(n,u,s))):l||(u=Rn(n,i),u!=null&&o.push(Vn(n,u,s)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Gd=/\r\n?/g,Xd=/\u0000|\uFFFD/g;function hs(e){return(typeof e=="string"?e:""+e).replace(Gd,`
`).replace(Xd,"")}function pr(e,t,n){if(t=hs(t),hs(e)!==t&&n)throw Error(w(425))}function Br(){}var wi=null,ki=null;function xi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Si=typeof setTimeout=="function"?setTimeout:void 0,Zd=typeof clearTimeout=="function"?clearTimeout:void 0,gs=typeof Promise=="function"?Promise:void 0,Jd=typeof queueMicrotask=="function"?queueMicrotask:typeof gs<"u"?function(e){return gs.resolve(null).then(e).catch(qd)}:Si;function qd(e){setTimeout(function(){throw e})}function Ul(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),An(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);An(t)}function ut(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function vs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var dn=Math.random().toString(36).slice(2),Ue="__reactFiber$"+dn,Hn="__reactProps$"+dn,Ge="__reactContainer$"+dn,Ci="__reactEvents$"+dn,bd="__reactListeners$"+dn,ef="__reactHandles$"+dn;function Et(e){var t=e[Ue];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Ge]||n[Ue]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=vs(e);e!==null;){if(n=e[Ue])return n;e=vs(e)}return t}e=n,n=e.parentNode}return null}function bn(e){return e=e[Ue]||e[Ge],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Vt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(w(33))}function sl(e){return e[Hn]||null}var Ei=[],Ht=-1;function gt(e){return{current:e}}function U(e){0>Ht||(e.current=Ei[Ht],Ei[Ht]=null,Ht--)}function F(e,t){Ht++,Ei[Ht]=e.current,e.current=t}var mt={},ie=gt(mt),fe=gt(!1),Pt=mt;function nn(e,t){var n=e.type.contextTypes;if(!n)return mt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function pe(e){return e=e.childContextTypes,e!=null}function $r(){U(fe),U(ie)}function ys(e,t,n){if(ie.current!==mt)throw Error(w(168));F(ie,t),F(fe,n)}function ra(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(w(108,Ac(e)||"Unknown",l));return H({},n,r)}function Vr(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||mt,Pt=ie.current,F(ie,e),F(fe,fe.current),!0}function ws(e,t,n){var r=e.stateNode;if(!r)throw Error(w(169));n?(e=ra(e,t,Pt),r.__reactInternalMemoizedMergedChildContext=e,U(fe),U(ie),F(ie,e)):U(fe),F(fe,n)}var He=null,ul=!1,Bl=!1;function la(e){He===null?He=[e]:He.push(e)}function tf(e){ul=!0,la(e)}function vt(){if(!Bl&&He!==null){Bl=!0;var e=0,t=I;try{var n=He;for(I=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}He=null,ul=!1}catch(l){throw He!==null&&(He=He.slice(e+1)),Pu(to,vt),l}finally{I=t,Bl=!1}}return null}var Wt=[],Qt=0,Hr=null,Wr=0,Ee=[],Ne=0,zt=null,We=1,Qe="";function St(e,t){Wt[Qt++]=Wr,Wt[Qt++]=Hr,Hr=e,Wr=t}function ia(e,t,n){Ee[Ne++]=We,Ee[Ne++]=Qe,Ee[Ne++]=zt,zt=e;var r=We;e=Qe;var l=32-Ie(r)-1;r&=~(1<<l),n+=1;var i=32-Ie(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,We=1<<32-Ie(t)+l|n<<l|r,Qe=i+e}else We=1<<i|n<<l|r,Qe=e}function co(e){e.return!==null&&(St(e,1),ia(e,1,0))}function fo(e){for(;e===Hr;)Hr=Wt[--Qt],Wt[Qt]=null,Wr=Wt[--Qt],Wt[Qt]=null;for(;e===zt;)zt=Ee[--Ne],Ee[Ne]=null,Qe=Ee[--Ne],Ee[Ne]=null,We=Ee[--Ne],Ee[Ne]=null}var we=null,ye=null,B=!1,De=null;function oa(e,t){var n=_e(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ks(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,we=e,ye=ut(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,we=e,ye=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=zt!==null?{id:We,overflow:Qe}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_e(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,we=e,ye=null,!0):!1;default:return!1}}function Ni(e){return(e.mode&1)!==0&&(e.flags&128)===0}function _i(e){if(B){var t=ye;if(t){var n=t;if(!ks(e,t)){if(Ni(e))throw Error(w(418));t=ut(n.nextSibling);var r=we;t&&ks(e,t)?oa(r,n):(e.flags=e.flags&-4097|2,B=!1,we=e)}}else{if(Ni(e))throw Error(w(418));e.flags=e.flags&-4097|2,B=!1,we=e}}}function xs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;we=e}function mr(e){if(e!==we)return!1;if(!B)return xs(e),B=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!xi(e.type,e.memoizedProps)),t&&(t=ye)){if(Ni(e))throw sa(),Error(w(418));for(;t;)oa(e,t),t=ut(t.nextSibling)}if(xs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ye=ut(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ye=null}}else ye=we?ut(e.stateNode.nextSibling):null;return!0}function sa(){for(var e=ye;e;)e=ut(e.nextSibling)}function rn(){ye=we=null,B=!1}function po(e){De===null?De=[e]:De.push(e)}var nf=Je.ReactCurrentBatchConfig;function vn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(w(309));var r=n.stateNode}if(!r)throw Error(w(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var s=l.refs;o===null?delete s[i]:s[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(w(284));if(!n._owner)throw Error(w(290,e))}return e}function hr(e,t){throw e=Object.prototype.toString.call(t),Error(w(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ss(e){var t=e._init;return t(e._payload)}function ua(e){function t(f,c){if(e){var a=f.deletions;a===null?(f.deletions=[c],f.flags|=16):a.push(c)}}function n(f,c){if(!e)return null;for(;c!==null;)t(f,c),c=c.sibling;return null}function r(f,c){for(f=new Map;c!==null;)c.key!==null?f.set(c.key,c):f.set(c.index,c),c=c.sibling;return f}function l(f,c){return f=ft(f,c),f.index=0,f.sibling=null,f}function i(f,c,a){return f.index=a,e?(a=f.alternate,a!==null?(a=a.index,a<c?(f.flags|=2,c):a):(f.flags|=2,c)):(f.flags|=1048576,c)}function o(f){return e&&f.alternate===null&&(f.flags|=2),f}function s(f,c,a,m){return c===null||c.tag!==6?(c=Kl(a,f.mode,m),c.return=f,c):(c=l(c,a),c.return=f,c)}function u(f,c,a,m){var y=a.type;return y===At?v(f,c,a.props.children,m,a.key):c!==null&&(c.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===be&&Ss(y)===c.type)?(m=l(c,a.props),m.ref=vn(f,c,a),m.return=f,m):(m=Lr(a.type,a.key,a.props,null,f.mode,m),m.ref=vn(f,c,a),m.return=f,m)}function d(f,c,a,m){return c===null||c.tag!==4||c.stateNode.containerInfo!==a.containerInfo||c.stateNode.implementation!==a.implementation?(c=Gl(a,f.mode,m),c.return=f,c):(c=l(c,a.children||[]),c.return=f,c)}function v(f,c,a,m,y){return c===null||c.tag!==7?(c=jt(a,f.mode,m,y),c.return=f,c):(c=l(c,a),c.return=f,c)}function g(f,c,a){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Kl(""+c,f.mode,a),c.return=f,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case lr:return a=Lr(c.type,c.key,c.props,null,f.mode,a),a.ref=vn(f,null,c),a.return=f,a;case Ft:return c=Gl(c,f.mode,a),c.return=f,c;case be:var m=c._init;return g(f,m(c._payload),a)}if(xn(c)||fn(c))return c=jt(c,f.mode,a,null),c.return=f,c;hr(f,c)}return null}function h(f,c,a,m){var y=c!==null?c.key:null;if(typeof a=="string"&&a!==""||typeof a=="number")return y!==null?null:s(f,c,""+a,m);if(typeof a=="object"&&a!==null){switch(a.$$typeof){case lr:return a.key===y?u(f,c,a,m):null;case Ft:return a.key===y?d(f,c,a,m):null;case be:return y=a._init,h(f,c,y(a._payload),m)}if(xn(a)||fn(a))return y!==null?null:v(f,c,a,m,null);hr(f,a)}return null}function k(f,c,a,m,y){if(typeof m=="string"&&m!==""||typeof m=="number")return f=f.get(a)||null,s(c,f,""+m,y);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case lr:return f=f.get(m.key===null?a:m.key)||null,u(c,f,m,y);case Ft:return f=f.get(m.key===null?a:m.key)||null,d(c,f,m,y);case be:var S=m._init;return k(f,c,a,S(m._payload),y)}if(xn(m)||fn(m))return f=f.get(a)||null,v(c,f,m,y,null);hr(c,m)}return null}function x(f,c,a,m){for(var y=null,S=null,E=c,_=c=0,O=null;E!==null&&_<a.length;_++){E.index>_?(O=E,E=null):O=E.sibling;var P=h(f,E,a[_],m);if(P===null){E===null&&(E=O);break}e&&E&&P.alternate===null&&t(f,E),c=i(P,c,_),S===null?y=P:S.sibling=P,S=P,E=O}if(_===a.length)return n(f,E),B&&St(f,_),y;if(E===null){for(;_<a.length;_++)E=g(f,a[_],m),E!==null&&(c=i(E,c,_),S===null?y=E:S.sibling=E,S=E);return B&&St(f,_),y}for(E=r(f,E);_<a.length;_++)O=k(E,f,_,a[_],m),O!==null&&(e&&O.alternate!==null&&E.delete(O.key===null?_:O.key),c=i(O,c,_),S===null?y=O:S.sibling=O,S=O);return e&&E.forEach(function(he){return t(f,he)}),B&&St(f,_),y}function C(f,c,a,m){var y=fn(a);if(typeof y!="function")throw Error(w(150));if(a=y.call(a),a==null)throw Error(w(151));for(var S=y=null,E=c,_=c=0,O=null,P=a.next();E!==null&&!P.done;_++,P=a.next()){E.index>_?(O=E,E=null):O=E.sibling;var he=h(f,E,P.value,m);if(he===null){E===null&&(E=O);break}e&&E&&he.alternate===null&&t(f,E),c=i(he,c,_),S===null?y=he:S.sibling=he,S=he,E=O}if(P.done)return n(f,E),B&&St(f,_),y;if(E===null){for(;!P.done;_++,P=a.next())P=g(f,P.value,m),P!==null&&(c=i(P,c,_),S===null?y=P:S.sibling=P,S=P);return B&&St(f,_),y}for(E=r(f,E);!P.done;_++,P=a.next())P=k(E,f,_,P.value,m),P!==null&&(e&&P.alternate!==null&&E.delete(P.key===null?_:P.key),c=i(P,c,_),S===null?y=P:S.sibling=P,S=P);return e&&E.forEach(function(yt){return t(f,yt)}),B&&St(f,_),y}function R(f,c,a,m){if(typeof a=="object"&&a!==null&&a.type===At&&a.key===null&&(a=a.props.children),typeof a=="object"&&a!==null){switch(a.$$typeof){case lr:e:{for(var y=a.key,S=c;S!==null;){if(S.key===y){if(y=a.type,y===At){if(S.tag===7){n(f,S.sibling),c=l(S,a.props.children),c.return=f,f=c;break e}}else if(S.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===be&&Ss(y)===S.type){n(f,S.sibling),c=l(S,a.props),c.ref=vn(f,S,a),c.return=f,f=c;break e}n(f,S);break}else t(f,S);S=S.sibling}a.type===At?(c=jt(a.props.children,f.mode,m,a.key),c.return=f,f=c):(m=Lr(a.type,a.key,a.props,null,f.mode,m),m.ref=vn(f,c,a),m.return=f,f=m)}return o(f);case Ft:e:{for(S=a.key;c!==null;){if(c.key===S)if(c.tag===4&&c.stateNode.containerInfo===a.containerInfo&&c.stateNode.implementation===a.implementation){n(f,c.sibling),c=l(c,a.children||[]),c.return=f,f=c;break e}else{n(f,c);break}else t(f,c);c=c.sibling}c=Gl(a,f.mode,m),c.return=f,f=c}return o(f);case be:return S=a._init,R(f,c,S(a._payload),m)}if(xn(a))return x(f,c,a,m);if(fn(a))return C(f,c,a,m);hr(f,a)}return typeof a=="string"&&a!==""||typeof a=="number"?(a=""+a,c!==null&&c.tag===6?(n(f,c.sibling),c=l(c,a),c.return=f,f=c):(n(f,c),c=Kl(a,f.mode,m),c.return=f,f=c),o(f)):n(f,c)}return R}var ln=ua(!0),aa=ua(!1),Qr=gt(null),Yr=null,Yt=null,mo=null;function ho(){mo=Yt=Yr=null}function go(e){var t=Qr.current;U(Qr),e._currentValue=t}function Ti(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function bt(e,t){Yr=e,mo=Yt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(de=!0),e.firstContext=null)}function je(e){var t=e._currentValue;if(mo!==e)if(e={context:e,memoizedValue:t,next:null},Yt===null){if(Yr===null)throw Error(w(308));Yt=e,Yr.dependencies={lanes:0,firstContext:e}}else Yt=Yt.next=e;return t}var Nt=null;function vo(e){Nt===null?Nt=[e]:Nt.push(e)}function ca(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,vo(t)):(n.next=l.next,l.next=n),t.interleaved=n,Xe(e,r)}function Xe(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var et=!1;function yo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function da(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ye(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function at(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,D&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Xe(e,n)}return l=r.interleaved,l===null?(t.next=t,vo(r)):(t.next=l.next,l.next=t),r.interleaved=t,Xe(e,n)}function Nr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,no(e,n)}}function Cs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Kr(e,t,n,r){var l=e.updateQueue;et=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,s=l.shared.pending;if(s!==null){l.shared.pending=null;var u=s,d=u.next;u.next=null,o===null?i=d:o.next=d,o=u;var v=e.alternate;v!==null&&(v=v.updateQueue,s=v.lastBaseUpdate,s!==o&&(s===null?v.firstBaseUpdate=d:s.next=d,v.lastBaseUpdate=u))}if(i!==null){var g=l.baseState;o=0,v=d=u=null,s=i;do{var h=s.lane,k=s.eventTime;if((r&h)===h){v!==null&&(v=v.next={eventTime:k,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var x=e,C=s;switch(h=t,k=n,C.tag){case 1:if(x=C.payload,typeof x=="function"){g=x.call(k,g,h);break e}g=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=C.payload,h=typeof x=="function"?x.call(k,g,h):x,h==null)break e;g=H({},g,h);break e;case 2:et=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,h=l.effects,h===null?l.effects=[s]:h.push(s))}else k={eventTime:k,lane:h,tag:s.tag,payload:s.payload,callback:s.callback,next:null},v===null?(d=v=k,u=g):v=v.next=k,o|=h;if(s=s.next,s===null){if(s=l.shared.pending,s===null)break;h=s,s=h.next,h.next=null,l.lastBaseUpdate=h,l.shared.pending=null}}while(!0);if(v===null&&(u=g),l.baseState=u,l.firstBaseUpdate=d,l.lastBaseUpdate=v,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);Mt|=o,e.lanes=o,e.memoizedState=g}}function Es(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(w(191,l));l.call(r)}}}var er={},$e=gt(er),Wn=gt(er),Qn=gt(er);function _t(e){if(e===er)throw Error(w(174));return e}function wo(e,t){switch(F(Qn,t),F(Wn,e),F($e,er),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:si(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=si(t,e)}U($e),F($e,t)}function on(){U($e),U(Wn),U(Qn)}function fa(e){_t(Qn.current);var t=_t($e.current),n=si(t,e.type);t!==n&&(F(Wn,e),F($e,n))}function ko(e){Wn.current===e&&(U($e),U(Wn))}var $=gt(0);function Gr(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var $l=[];function xo(){for(var e=0;e<$l.length;e++)$l[e]._workInProgressVersionPrimary=null;$l.length=0}var _r=Je.ReactCurrentDispatcher,Vl=Je.ReactCurrentBatchConfig,Lt=0,V=null,G=null,J=null,Xr=!1,Pn=!1,Yn=0,rf=0;function ne(){throw Error(w(321))}function So(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Oe(e[n],t[n]))return!1;return!0}function Co(e,t,n,r,l,i){if(Lt=i,V=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,_r.current=e===null||e.memoizedState===null?uf:af,e=n(r,l),Pn){i=0;do{if(Pn=!1,Yn=0,25<=i)throw Error(w(301));i+=1,J=G=null,t.updateQueue=null,_r.current=cf,e=n(r,l)}while(Pn)}if(_r.current=Zr,t=G!==null&&G.next!==null,Lt=0,J=G=V=null,Xr=!1,t)throw Error(w(300));return e}function Eo(){var e=Yn!==0;return Yn=0,e}function Ae(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return J===null?V.memoizedState=J=e:J=J.next=e,J}function Pe(){if(G===null){var e=V.alternate;e=e!==null?e.memoizedState:null}else e=G.next;var t=J===null?V.memoizedState:J.next;if(t!==null)J=t,G=e;else{if(e===null)throw Error(w(310));G=e,e={memoizedState:G.memoizedState,baseState:G.baseState,baseQueue:G.baseQueue,queue:G.queue,next:null},J===null?V.memoizedState=J=e:J=J.next=e}return J}function Kn(e,t){return typeof t=="function"?t(e):t}function Hl(e){var t=Pe(),n=t.queue;if(n===null)throw Error(w(311));n.lastRenderedReducer=e;var r=G,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var s=o=null,u=null,d=i;do{var v=d.lane;if((Lt&v)===v)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var g={lane:v,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(s=u=g,o=r):u=u.next=g,V.lanes|=v,Mt|=v}d=d.next}while(d!==null&&d!==i);u===null?o=r:u.next=s,Oe(r,t.memoizedState)||(de=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,V.lanes|=i,Mt|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Wl(e){var t=Pe(),n=t.queue;if(n===null)throw Error(w(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);Oe(i,t.memoizedState)||(de=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function pa(){}function ma(e,t){var n=V,r=Pe(),l=t(),i=!Oe(r.memoizedState,l);if(i&&(r.memoizedState=l,de=!0),r=r.queue,No(va.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||J!==null&&J.memoizedState.tag&1){if(n.flags|=2048,Gn(9,ga.bind(null,n,r,l,t),void 0,null),q===null)throw Error(w(349));Lt&30||ha(n,t,l)}return l}function ha(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ga(e,t,n,r){t.value=n,t.getSnapshot=r,ya(t)&&wa(e)}function va(e,t,n){return n(function(){ya(t)&&wa(e)})}function ya(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Oe(e,n)}catch{return!0}}function wa(e){var t=Xe(e,1);t!==null&&Re(t,e,1,-1)}function Ns(e){var t=Ae();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Kn,lastRenderedState:e},t.queue=e,e=e.dispatch=sf.bind(null,V,e),[t.memoizedState,e]}function Gn(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function ka(){return Pe().memoizedState}function Tr(e,t,n,r){var l=Ae();V.flags|=e,l.memoizedState=Gn(1|t,n,void 0,r===void 0?null:r)}function al(e,t,n,r){var l=Pe();r=r===void 0?null:r;var i=void 0;if(G!==null){var o=G.memoizedState;if(i=o.destroy,r!==null&&So(r,o.deps)){l.memoizedState=Gn(t,n,i,r);return}}V.flags|=e,l.memoizedState=Gn(1|t,n,i,r)}function _s(e,t){return Tr(8390656,8,e,t)}function No(e,t){return al(2048,8,e,t)}function xa(e,t){return al(4,2,e,t)}function Sa(e,t){return al(4,4,e,t)}function Ca(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ea(e,t,n){return n=n!=null?n.concat([e]):null,al(4,4,Ca.bind(null,t,e),n)}function _o(){}function Na(e,t){var n=Pe();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&So(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function _a(e,t){var n=Pe();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&So(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ta(e,t,n){return Lt&21?(Oe(n,t)||(n=Mu(),V.lanes|=n,Mt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,de=!0),e.memoizedState=n)}function lf(e,t){var n=I;I=n!==0&&4>n?n:4,e(!0);var r=Vl.transition;Vl.transition={};try{e(!1),t()}finally{I=n,Vl.transition=r}}function ja(){return Pe().memoizedState}function of(e,t,n){var r=dt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Pa(e))za(t,n);else if(n=ca(e,t,n,r),n!==null){var l=se();Re(n,e,r,l),La(n,t,r)}}function sf(e,t,n){var r=dt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Pa(e))za(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,s=i(o,n);if(l.hasEagerState=!0,l.eagerState=s,Oe(s,o)){var u=t.interleaved;u===null?(l.next=l,vo(t)):(l.next=u.next,u.next=l),t.interleaved=l;return}}catch{}finally{}n=ca(e,t,l,r),n!==null&&(l=se(),Re(n,e,r,l),La(n,t,r))}}function Pa(e){var t=e.alternate;return e===V||t!==null&&t===V}function za(e,t){Pn=Xr=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function La(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,no(e,n)}}var Zr={readContext:je,useCallback:ne,useContext:ne,useEffect:ne,useImperativeHandle:ne,useInsertionEffect:ne,useLayoutEffect:ne,useMemo:ne,useReducer:ne,useRef:ne,useState:ne,useDebugValue:ne,useDeferredValue:ne,useTransition:ne,useMutableSource:ne,useSyncExternalStore:ne,useId:ne,unstable_isNewReconciler:!1},uf={readContext:je,useCallback:function(e,t){return Ae().memoizedState=[e,t===void 0?null:t],e},useContext:je,useEffect:_s,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Tr(4194308,4,Ca.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Tr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Tr(4,2,e,t)},useMemo:function(e,t){var n=Ae();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ae();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=of.bind(null,V,e),[r.memoizedState,e]},useRef:function(e){var t=Ae();return e={current:e},t.memoizedState=e},useState:Ns,useDebugValue:_o,useDeferredValue:function(e){return Ae().memoizedState=e},useTransition:function(){var e=Ns(!1),t=e[0];return e=lf.bind(null,e[1]),Ae().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=V,l=Ae();if(B){if(n===void 0)throw Error(w(407));n=n()}else{if(n=t(),q===null)throw Error(w(349));Lt&30||ha(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,_s(va.bind(null,r,i,e),[e]),r.flags|=2048,Gn(9,ga.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Ae(),t=q.identifierPrefix;if(B){var n=Qe,r=We;n=(r&~(1<<32-Ie(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Yn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=rf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},af={readContext:je,useCallback:Na,useContext:je,useEffect:No,useImperativeHandle:Ea,useInsertionEffect:xa,useLayoutEffect:Sa,useMemo:_a,useReducer:Hl,useRef:ka,useState:function(){return Hl(Kn)},useDebugValue:_o,useDeferredValue:function(e){var t=Pe();return Ta(t,G.memoizedState,e)},useTransition:function(){var e=Hl(Kn)[0],t=Pe().memoizedState;return[e,t]},useMutableSource:pa,useSyncExternalStore:ma,useId:ja,unstable_isNewReconciler:!1},cf={readContext:je,useCallback:Na,useContext:je,useEffect:No,useImperativeHandle:Ea,useInsertionEffect:xa,useLayoutEffect:Sa,useMemo:_a,useReducer:Wl,useRef:ka,useState:function(){return Wl(Kn)},useDebugValue:_o,useDeferredValue:function(e){var t=Pe();return G===null?t.memoizedState=e:Ta(t,G.memoizedState,e)},useTransition:function(){var e=Wl(Kn)[0],t=Pe().memoizedState;return[e,t]},useMutableSource:pa,useSyncExternalStore:ma,useId:ja,unstable_isNewReconciler:!1};function Le(e,t){if(e&&e.defaultProps){t=H({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ji(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:H({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var cl={isMounted:function(e){return(e=e._reactInternals)?Rt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=se(),l=dt(e),i=Ye(r,l);i.payload=t,n!=null&&(i.callback=n),t=at(e,i,l),t!==null&&(Re(t,e,l,r),Nr(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=se(),l=dt(e),i=Ye(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=at(e,i,l),t!==null&&(Re(t,e,l,r),Nr(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=se(),r=dt(e),l=Ye(n,r);l.tag=2,t!=null&&(l.callback=t),t=at(e,l,r),t!==null&&(Re(t,e,r,n),Nr(t,e,r))}};function Ts(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!Bn(n,r)||!Bn(l,i):!0}function Ma(e,t,n){var r=!1,l=mt,i=t.contextType;return typeof i=="object"&&i!==null?i=je(i):(l=pe(t)?Pt:ie.current,r=t.contextTypes,i=(r=r!=null)?nn(e,l):mt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=cl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function js(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&cl.enqueueReplaceState(t,t.state,null)}function Pi(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},yo(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=je(i):(i=pe(t)?Pt:ie.current,l.context=nn(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(ji(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&cl.enqueueReplaceState(l,l.state,null),Kr(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function sn(e,t){try{var n="",r=t;do n+=Fc(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function Ql(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function zi(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var df=typeof WeakMap=="function"?WeakMap:Map;function Da(e,t,n){n=Ye(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){qr||(qr=!0,Bi=r),zi(e,t)},n}function Ia(e,t,n){n=Ye(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){zi(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){zi(e,t),typeof r!="function"&&(ct===null?ct=new Set([this]):ct.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Ps(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new df;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Nf.bind(null,e,t,n),t.then(e,e))}function zs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ls(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Ye(-1,1),t.tag=2,at(n,t,1))),n.lanes|=1),e)}var ff=Je.ReactCurrentOwner,de=!1;function oe(e,t,n,r){t.child=e===null?aa(t,null,n,r):ln(t,e.child,n,r)}function Ms(e,t,n,r,l){n=n.render;var i=t.ref;return bt(t,l),r=Co(e,t,n,r,i,l),n=Eo(),e!==null&&!de?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Ze(e,t,l)):(B&&n&&co(t),t.flags|=1,oe(e,t,r,l),t.child)}function Ds(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!Io(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,Ra(e,t,i,r,l)):(e=Lr(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:Bn,n(o,r)&&e.ref===t.ref)return Ze(e,t,l)}return t.flags|=1,e=ft(i,r),e.ref=t.ref,e.return=t,t.child=e}function Ra(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(Bn(i,r)&&e.ref===t.ref)if(de=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(de=!0);else return t.lanes=e.lanes,Ze(e,t,l)}return Li(e,t,n,r,l)}function Oa(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},F(Gt,ge),ge|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,F(Gt,ge),ge|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,F(Gt,ge),ge|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,F(Gt,ge),ge|=r;return oe(e,t,l,n),t.child}function Fa(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Li(e,t,n,r,l){var i=pe(n)?Pt:ie.current;return i=nn(t,i),bt(t,l),n=Co(e,t,n,r,i,l),r=Eo(),e!==null&&!de?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Ze(e,t,l)):(B&&r&&co(t),t.flags|=1,oe(e,t,n,l),t.child)}function Is(e,t,n,r,l){if(pe(n)){var i=!0;Vr(t)}else i=!1;if(bt(t,l),t.stateNode===null)jr(e,t),Ma(t,n,r),Pi(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,s=t.memoizedProps;o.props=s;var u=o.context,d=n.contextType;typeof d=="object"&&d!==null?d=je(d):(d=pe(n)?Pt:ie.current,d=nn(t,d));var v=n.getDerivedStateFromProps,g=typeof v=="function"||typeof o.getSnapshotBeforeUpdate=="function";g||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==r||u!==d)&&js(t,o,r,d),et=!1;var h=t.memoizedState;o.state=h,Kr(t,r,o,l),u=t.memoizedState,s!==r||h!==u||fe.current||et?(typeof v=="function"&&(ji(t,n,v,r),u=t.memoizedState),(s=et||Ts(t,n,s,r,h,u,d))?(g||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),o.props=r,o.state=u,o.context=d,r=s):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,da(e,t),s=t.memoizedProps,d=t.type===t.elementType?s:Le(t.type,s),o.props=d,g=t.pendingProps,h=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=je(u):(u=pe(n)?Pt:ie.current,u=nn(t,u));var k=n.getDerivedStateFromProps;(v=typeof k=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==g||h!==u)&&js(t,o,r,u),et=!1,h=t.memoizedState,o.state=h,Kr(t,r,o,l);var x=t.memoizedState;s!==g||h!==x||fe.current||et?(typeof k=="function"&&(ji(t,n,k,r),x=t.memoizedState),(d=et||Ts(t,n,d,r,h,x,u)||!1)?(v||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,x,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,x,u)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=x),o.props=r,o.state=x,o.context=u,r=d):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),r=!1)}return Mi(e,t,n,r,i,l)}function Mi(e,t,n,r,l,i){Fa(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&ws(t,n,!1),Ze(e,t,i);r=t.stateNode,ff.current=t;var s=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=ln(t,e.child,null,i),t.child=ln(t,null,s,i)):oe(e,t,s,i),t.memoizedState=r.state,l&&ws(t,n,!0),t.child}function Aa(e){var t=e.stateNode;t.pendingContext?ys(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ys(e,t.context,!1),wo(e,t.containerInfo)}function Rs(e,t,n,r,l){return rn(),po(l),t.flags|=256,oe(e,t,n,r),t.child}var Di={dehydrated:null,treeContext:null,retryLane:0};function Ii(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ua(e,t,n){var r=t.pendingProps,l=$.current,i=!1,o=(t.flags&128)!==0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(l&2)!==0),s?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),F($,l&1),e===null)return _i(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=pl(o,r,0,null),e=jt(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=Ii(n),t.memoizedState=Di,e):To(t,o));if(l=e.memoizedState,l!==null&&(s=l.dehydrated,s!==null))return pf(e,t,o,r,s,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,s=l.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=ft(l,u),r.subtreeFlags=l.subtreeFlags&14680064),s!==null?i=ft(s,i):(i=jt(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?Ii(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=Di,r}return i=e.child,e=i.sibling,r=ft(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function To(e,t){return t=pl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function gr(e,t,n,r){return r!==null&&po(r),ln(t,e.child,null,n),e=To(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function pf(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=Ql(Error(w(422))),gr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=pl({mode:"visible",children:r.children},l,0,null),i=jt(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&ln(t,e.child,null,o),t.child.memoizedState=Ii(o),t.memoizedState=Di,i);if(!(t.mode&1))return gr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var s=r.dgst;return r=s,i=Error(w(419)),r=Ql(i,r,void 0),gr(e,t,o,r)}if(s=(o&e.childLanes)!==0,de||s){if(r=q,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,Xe(e,l),Re(r,e,l,-1))}return Do(),r=Ql(Error(w(421))),gr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=_f.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,ye=ut(l.nextSibling),we=t,B=!0,De=null,e!==null&&(Ee[Ne++]=We,Ee[Ne++]=Qe,Ee[Ne++]=zt,We=e.id,Qe=e.overflow,zt=t),t=To(t,r.children),t.flags|=4096,t)}function Os(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ti(e.return,t,n)}function Yl(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Ba(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(oe(e,t,r.children,n),r=$.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Os(e,n,t);else if(e.tag===19)Os(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(F($,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Gr(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Yl(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Gr(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Yl(t,!0,n,null,i);break;case"together":Yl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function jr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ze(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Mt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(w(153));if(t.child!==null){for(e=t.child,n=ft(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ft(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function mf(e,t,n){switch(t.tag){case 3:Aa(t),rn();break;case 5:fa(t);break;case 1:pe(t.type)&&Vr(t);break;case 4:wo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;F(Qr,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(F($,$.current&1),t.flags|=128,null):n&t.child.childLanes?Ua(e,t,n):(F($,$.current&1),e=Ze(e,t,n),e!==null?e.sibling:null);F($,$.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Ba(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),F($,$.current),r)break;return null;case 22:case 23:return t.lanes=0,Oa(e,t,n)}return Ze(e,t,n)}var $a,Ri,Va,Ha;$a=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ri=function(){};Va=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,_t($e.current);var i=null;switch(n){case"input":l=ri(e,l),r=ri(e,r),i=[];break;case"select":l=H({},l,{value:void 0}),r=H({},r,{value:void 0}),i=[];break;case"textarea":l=oi(e,l),r=oi(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Br)}ui(n,r);var o;n=null;for(d in l)if(!r.hasOwnProperty(d)&&l.hasOwnProperty(d)&&l[d]!=null)if(d==="style"){var s=l[d];for(o in s)s.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Dn.hasOwnProperty(d)?i||(i=[]):(i=i||[]).push(d,null));for(d in r){var u=r[d];if(s=l!=null?l[d]:void 0,r.hasOwnProperty(d)&&u!==s&&(u!=null||s!=null))if(d==="style")if(s){for(o in s)!s.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&s[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(i||(i=[]),i.push(d,n)),n=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,s=s?s.__html:void 0,u!=null&&s!==u&&(i=i||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(i=i||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Dn.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&A("scroll",e),i||s===u||(i=[])):(i=i||[]).push(d,u))}n&&(i=i||[]).push("style",n);var d=i;(t.updateQueue=d)&&(t.flags|=4)}};Ha=function(e,t,n,r){n!==r&&(t.flags|=4)};function yn(e,t){if(!B)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function re(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function hf(e,t,n){var r=t.pendingProps;switch(fo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return re(t),null;case 1:return pe(t.type)&&$r(),re(t),null;case 3:return r=t.stateNode,on(),U(fe),U(ie),xo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(mr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,De!==null&&(Hi(De),De=null))),Ri(e,t),re(t),null;case 5:ko(t);var l=_t(Qn.current);if(n=t.type,e!==null&&t.stateNode!=null)Va(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(w(166));return re(t),null}if(e=_t($e.current),mr(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Ue]=t,r[Hn]=i,e=(t.mode&1)!==0,n){case"dialog":A("cancel",r),A("close",r);break;case"iframe":case"object":case"embed":A("load",r);break;case"video":case"audio":for(l=0;l<Cn.length;l++)A(Cn[l],r);break;case"source":A("error",r);break;case"img":case"image":case"link":A("error",r),A("load",r);break;case"details":A("toggle",r);break;case"input":Qo(r,i),A("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},A("invalid",r);break;case"textarea":Ko(r,i),A("invalid",r)}ui(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var s=i[o];o==="children"?typeof s=="string"?r.textContent!==s&&(i.suppressHydrationWarning!==!0&&pr(r.textContent,s,e),l=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(i.suppressHydrationWarning!==!0&&pr(r.textContent,s,e),l=["children",""+s]):Dn.hasOwnProperty(o)&&s!=null&&o==="onScroll"&&A("scroll",r)}switch(n){case"input":ir(r),Yo(r,i,!0);break;case"textarea":ir(r),Go(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=Br)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=vu(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Ue]=t,e[Hn]=r,$a(e,t,!1,!1),t.stateNode=e;e:{switch(o=ai(n,r),n){case"dialog":A("cancel",e),A("close",e),l=r;break;case"iframe":case"object":case"embed":A("load",e),l=r;break;case"video":case"audio":for(l=0;l<Cn.length;l++)A(Cn[l],e);l=r;break;case"source":A("error",e),l=r;break;case"img":case"image":case"link":A("error",e),A("load",e),l=r;break;case"details":A("toggle",e),l=r;break;case"input":Qo(e,r),l=ri(e,r),A("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=H({},r,{value:void 0}),A("invalid",e);break;case"textarea":Ko(e,r),l=oi(e,r),A("invalid",e);break;default:l=r}ui(n,l),s=l;for(i in s)if(s.hasOwnProperty(i)){var u=s[i];i==="style"?ku(e,u):i==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&yu(e,u)):i==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&In(e,u):typeof u=="number"&&In(e,""+u):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(Dn.hasOwnProperty(i)?u!=null&&i==="onScroll"&&A("scroll",e):u!=null&&Zi(e,i,u,o))}switch(n){case"input":ir(e),Yo(e,r,!1);break;case"textarea":ir(e),Go(e);break;case"option":r.value!=null&&e.setAttribute("value",""+pt(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?Xt(e,!!r.multiple,i,!1):r.defaultValue!=null&&Xt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Br)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return re(t),null;case 6:if(e&&t.stateNode!=null)Ha(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(w(166));if(n=_t(Qn.current),_t($e.current),mr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ue]=t,(i=r.nodeValue!==n)&&(e=we,e!==null))switch(e.tag){case 3:pr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&pr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ue]=t,t.stateNode=r}return re(t),null;case 13:if(U($),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(B&&ye!==null&&t.mode&1&&!(t.flags&128))sa(),rn(),t.flags|=98560,i=!1;else if(i=mr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(w(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(w(317));i[Ue]=t}else rn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;re(t),i=!1}else De!==null&&(Hi(De),De=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||$.current&1?X===0&&(X=3):Do())),t.updateQueue!==null&&(t.flags|=4),re(t),null);case 4:return on(),Ri(e,t),e===null&&$n(t.stateNode.containerInfo),re(t),null;case 10:return go(t.type._context),re(t),null;case 17:return pe(t.type)&&$r(),re(t),null;case 19:if(U($),i=t.memoizedState,i===null)return re(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)yn(i,!1);else{if(X!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Gr(e),o!==null){for(t.flags|=128,yn(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return F($,$.current&1|2),t.child}e=e.sibling}i.tail!==null&&Y()>un&&(t.flags|=128,r=!0,yn(i,!1),t.lanes=4194304)}else{if(!r)if(e=Gr(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),yn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!B)return re(t),null}else 2*Y()-i.renderingStartTime>un&&n!==1073741824&&(t.flags|=128,r=!0,yn(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=Y(),t.sibling=null,n=$.current,F($,r?n&1|2:n&1),t):(re(t),null);case 22:case 23:return Mo(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ge&1073741824&&(re(t),t.subtreeFlags&6&&(t.flags|=8192)):re(t),null;case 24:return null;case 25:return null}throw Error(w(156,t.tag))}function gf(e,t){switch(fo(t),t.tag){case 1:return pe(t.type)&&$r(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return on(),U(fe),U(ie),xo(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return ko(t),null;case 13:if(U($),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(w(340));rn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return U($),null;case 4:return on(),null;case 10:return go(t.type._context),null;case 22:case 23:return Mo(),null;case 24:return null;default:return null}}var vr=!1,le=!1,vf=typeof WeakSet=="function"?WeakSet:Set,N=null;function Kt(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){W(e,t,r)}else n.current=null}function Oi(e,t,n){try{n()}catch(r){W(e,t,r)}}var Fs=!1;function yf(e,t){if(wi=Fr,e=Gu(),ao(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,s=-1,u=-1,d=0,v=0,g=e,h=null;t:for(;;){for(var k;g!==n||l!==0&&g.nodeType!==3||(s=o+l),g!==i||r!==0&&g.nodeType!==3||(u=o+r),g.nodeType===3&&(o+=g.nodeValue.length),(k=g.firstChild)!==null;)h=g,g=k;for(;;){if(g===e)break t;if(h===n&&++d===l&&(s=o),h===i&&++v===r&&(u=o),(k=g.nextSibling)!==null)break;g=h,h=g.parentNode}g=k}n=s===-1||u===-1?null:{start:s,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(ki={focusedElem:e,selectionRange:n},Fr=!1,N=t;N!==null;)if(t=N,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,N=e;else for(;N!==null;){t=N;try{var x=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var C=x.memoizedProps,R=x.memoizedState,f=t.stateNode,c=f.getSnapshotBeforeUpdate(t.elementType===t.type?C:Le(t.type,C),R);f.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var a=t.stateNode.containerInfo;a.nodeType===1?a.textContent="":a.nodeType===9&&a.documentElement&&a.removeChild(a.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(w(163))}}catch(m){W(t,t.return,m)}if(e=t.sibling,e!==null){e.return=t.return,N=e;break}N=t.return}return x=Fs,Fs=!1,x}function zn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&Oi(t,n,i)}l=l.next}while(l!==r)}}function dl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Fi(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Wa(e){var t=e.alternate;t!==null&&(e.alternate=null,Wa(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ue],delete t[Hn],delete t[Ci],delete t[bd],delete t[ef])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Qa(e){return e.tag===5||e.tag===3||e.tag===4}function As(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Qa(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ai(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Br));else if(r!==4&&(e=e.child,e!==null))for(Ai(e,t,n),e=e.sibling;e!==null;)Ai(e,t,n),e=e.sibling}function Ui(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ui(e,t,n),e=e.sibling;e!==null;)Ui(e,t,n),e=e.sibling}var b=null,Me=!1;function qe(e,t,n){for(n=n.child;n!==null;)Ya(e,t,n),n=n.sibling}function Ya(e,t,n){if(Be&&typeof Be.onCommitFiberUnmount=="function")try{Be.onCommitFiberUnmount(rl,n)}catch{}switch(n.tag){case 5:le||Kt(n,t);case 6:var r=b,l=Me;b=null,qe(e,t,n),b=r,Me=l,b!==null&&(Me?(e=b,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):b.removeChild(n.stateNode));break;case 18:b!==null&&(Me?(e=b,n=n.stateNode,e.nodeType===8?Ul(e.parentNode,n):e.nodeType===1&&Ul(e,n),An(e)):Ul(b,n.stateNode));break;case 4:r=b,l=Me,b=n.stateNode.containerInfo,Me=!0,qe(e,t,n),b=r,Me=l;break;case 0:case 11:case 14:case 15:if(!le&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&Oi(n,t,o),l=l.next}while(l!==r)}qe(e,t,n);break;case 1:if(!le&&(Kt(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){W(n,t,s)}qe(e,t,n);break;case 21:qe(e,t,n);break;case 22:n.mode&1?(le=(r=le)||n.memoizedState!==null,qe(e,t,n),le=r):qe(e,t,n);break;default:qe(e,t,n)}}function Us(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new vf),t.forEach(function(r){var l=Tf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function ze(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,s=o;e:for(;s!==null;){switch(s.tag){case 5:b=s.stateNode,Me=!1;break e;case 3:b=s.stateNode.containerInfo,Me=!0;break e;case 4:b=s.stateNode.containerInfo,Me=!0;break e}s=s.return}if(b===null)throw Error(w(160));Ya(i,o,l),b=null,Me=!1;var u=l.alternate;u!==null&&(u.return=null),l.return=null}catch(d){W(l,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ka(t,e),t=t.sibling}function Ka(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(ze(t,e),Fe(e),r&4){try{zn(3,e,e.return),dl(3,e)}catch(C){W(e,e.return,C)}try{zn(5,e,e.return)}catch(C){W(e,e.return,C)}}break;case 1:ze(t,e),Fe(e),r&512&&n!==null&&Kt(n,n.return);break;case 5:if(ze(t,e),Fe(e),r&512&&n!==null&&Kt(n,n.return),e.flags&32){var l=e.stateNode;try{In(l,"")}catch(C){W(e,e.return,C)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,s=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{s==="input"&&i.type==="radio"&&i.name!=null&&hu(l,i),ai(s,o);var d=ai(s,i);for(o=0;o<u.length;o+=2){var v=u[o],g=u[o+1];v==="style"?ku(l,g):v==="dangerouslySetInnerHTML"?yu(l,g):v==="children"?In(l,g):Zi(l,v,g,d)}switch(s){case"input":li(l,i);break;case"textarea":gu(l,i);break;case"select":var h=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var k=i.value;k!=null?Xt(l,!!i.multiple,k,!1):h!==!!i.multiple&&(i.defaultValue!=null?Xt(l,!!i.multiple,i.defaultValue,!0):Xt(l,!!i.multiple,i.multiple?[]:"",!1))}l[Hn]=i}catch(C){W(e,e.return,C)}}break;case 6:if(ze(t,e),Fe(e),r&4){if(e.stateNode===null)throw Error(w(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(C){W(e,e.return,C)}}break;case 3:if(ze(t,e),Fe(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{An(t.containerInfo)}catch(C){W(e,e.return,C)}break;case 4:ze(t,e),Fe(e);break;case 13:ze(t,e),Fe(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(zo=Y())),r&4&&Us(e);break;case 22:if(v=n!==null&&n.memoizedState!==null,e.mode&1?(le=(d=le)||v,ze(t,e),le=d):ze(t,e),Fe(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!v&&e.mode&1)for(N=e,v=e.child;v!==null;){for(g=N=v;N!==null;){switch(h=N,k=h.child,h.tag){case 0:case 11:case 14:case 15:zn(4,h,h.return);break;case 1:Kt(h,h.return);var x=h.stateNode;if(typeof x.componentWillUnmount=="function"){r=h,n=h.return;try{t=r,x.props=t.memoizedProps,x.state=t.memoizedState,x.componentWillUnmount()}catch(C){W(r,n,C)}}break;case 5:Kt(h,h.return);break;case 22:if(h.memoizedState!==null){$s(g);continue}}k!==null?(k.return=h,N=k):$s(g)}v=v.sibling}e:for(v=null,g=e;;){if(g.tag===5){if(v===null){v=g;try{l=g.stateNode,d?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(s=g.stateNode,u=g.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,s.style.display=wu("display",o))}catch(C){W(e,e.return,C)}}}else if(g.tag===6){if(v===null)try{g.stateNode.nodeValue=d?"":g.memoizedProps}catch(C){W(e,e.return,C)}}else if((g.tag!==22&&g.tag!==23||g.memoizedState===null||g===e)&&g.child!==null){g.child.return=g,g=g.child;continue}if(g===e)break e;for(;g.sibling===null;){if(g.return===null||g.return===e)break e;v===g&&(v=null),g=g.return}v===g&&(v=null),g.sibling.return=g.return,g=g.sibling}}break;case 19:ze(t,e),Fe(e),r&4&&Us(e);break;case 21:break;default:ze(t,e),Fe(e)}}function Fe(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Qa(n)){var r=n;break e}n=n.return}throw Error(w(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(In(l,""),r.flags&=-33);var i=As(e);Ui(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,s=As(e);Ai(e,s,o);break;default:throw Error(w(161))}}catch(u){W(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function wf(e,t,n){N=e,Ga(e)}function Ga(e,t,n){for(var r=(e.mode&1)!==0;N!==null;){var l=N,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||vr;if(!o){var s=l.alternate,u=s!==null&&s.memoizedState!==null||le;s=vr;var d=le;if(vr=o,(le=u)&&!d)for(N=l;N!==null;)o=N,u=o.child,o.tag===22&&o.memoizedState!==null?Vs(l):u!==null?(u.return=o,N=u):Vs(l);for(;i!==null;)N=i,Ga(i),i=i.sibling;N=l,vr=s,le=d}Bs(e)}else l.subtreeFlags&8772&&i!==null?(i.return=l,N=i):Bs(e)}}function Bs(e){for(;N!==null;){var t=N;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:le||dl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!le)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Le(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Es(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Es(t,o,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var v=d.memoizedState;if(v!==null){var g=v.dehydrated;g!==null&&An(g)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(w(163))}le||t.flags&512&&Fi(t)}catch(h){W(t,t.return,h)}}if(t===e){N=null;break}if(n=t.sibling,n!==null){n.return=t.return,N=n;break}N=t.return}}function $s(e){for(;N!==null;){var t=N;if(t===e){N=null;break}var n=t.sibling;if(n!==null){n.return=t.return,N=n;break}N=t.return}}function Vs(e){for(;N!==null;){var t=N;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{dl(4,t)}catch(u){W(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(u){W(t,l,u)}}var i=t.return;try{Fi(t)}catch(u){W(t,i,u)}break;case 5:var o=t.return;try{Fi(t)}catch(u){W(t,o,u)}}}catch(u){W(t,t.return,u)}if(t===e){N=null;break}var s=t.sibling;if(s!==null){s.return=t.return,N=s;break}N=t.return}}var kf=Math.ceil,Jr=Je.ReactCurrentDispatcher,jo=Je.ReactCurrentOwner,Te=Je.ReactCurrentBatchConfig,D=0,q=null,K=null,ee=0,ge=0,Gt=gt(0),X=0,Xn=null,Mt=0,fl=0,Po=0,Ln=null,ce=null,zo=0,un=1/0,Ve=null,qr=!1,Bi=null,ct=null,yr=!1,lt=null,br=0,Mn=0,$i=null,Pr=-1,zr=0;function se(){return D&6?Y():Pr!==-1?Pr:Pr=Y()}function dt(e){return e.mode&1?D&2&&ee!==0?ee&-ee:nf.transition!==null?(zr===0&&(zr=Mu()),zr):(e=I,e!==0||(e=window.event,e=e===void 0?16:Uu(e.type)),e):1}function Re(e,t,n,r){if(50<Mn)throw Mn=0,$i=null,Error(w(185));Jn(e,n,r),(!(D&2)||e!==q)&&(e===q&&(!(D&2)&&(fl|=n),X===4&&nt(e,ee)),me(e,r),n===1&&D===0&&!(t.mode&1)&&(un=Y()+500,ul&&vt()))}function me(e,t){var n=e.callbackNode;nd(e,t);var r=Or(e,e===q?ee:0);if(r===0)n!==null&&Jo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Jo(n),t===1)e.tag===0?tf(Hs.bind(null,e)):la(Hs.bind(null,e)),Jd(function(){!(D&6)&&vt()}),n=null;else{switch(Du(r)){case 1:n=to;break;case 4:n=zu;break;case 16:n=Rr;break;case 536870912:n=Lu;break;default:n=Rr}n=nc(n,Xa.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Xa(e,t){if(Pr=-1,zr=0,D&6)throw Error(w(327));var n=e.callbackNode;if(en()&&e.callbackNode!==n)return null;var r=Or(e,e===q?ee:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=el(e,r);else{t=r;var l=D;D|=2;var i=Ja();(q!==e||ee!==t)&&(Ve=null,un=Y()+500,Tt(e,t));do try{Cf();break}catch(s){Za(e,s)}while(!0);ho(),Jr.current=i,D=l,K!==null?t=0:(q=null,ee=0,t=X)}if(t!==0){if(t===2&&(l=mi(e),l!==0&&(r=l,t=Vi(e,l))),t===1)throw n=Xn,Tt(e,0),nt(e,r),me(e,Y()),n;if(t===6)nt(e,r);else{if(l=e.current.alternate,!(r&30)&&!xf(l)&&(t=el(e,r),t===2&&(i=mi(e),i!==0&&(r=i,t=Vi(e,i))),t===1))throw n=Xn,Tt(e,0),nt(e,r),me(e,Y()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(w(345));case 2:Ct(e,ce,Ve);break;case 3:if(nt(e,r),(r&130023424)===r&&(t=zo+500-Y(),10<t)){if(Or(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){se(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Si(Ct.bind(null,e,ce,Ve),t);break}Ct(e,ce,Ve);break;case 4:if(nt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-Ie(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=Y()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*kf(r/1960))-r,10<r){e.timeoutHandle=Si(Ct.bind(null,e,ce,Ve),r);break}Ct(e,ce,Ve);break;case 5:Ct(e,ce,Ve);break;default:throw Error(w(329))}}}return me(e,Y()),e.callbackNode===n?Xa.bind(null,e):null}function Vi(e,t){var n=Ln;return e.current.memoizedState.isDehydrated&&(Tt(e,t).flags|=256),e=el(e,t),e!==2&&(t=ce,ce=n,t!==null&&Hi(t)),e}function Hi(e){ce===null?ce=e:ce.push.apply(ce,e)}function xf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!Oe(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function nt(e,t){for(t&=~Po,t&=~fl,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ie(t),r=1<<n;e[n]=-1,t&=~r}}function Hs(e){if(D&6)throw Error(w(327));en();var t=Or(e,0);if(!(t&1))return me(e,Y()),null;var n=el(e,t);if(e.tag!==0&&n===2){var r=mi(e);r!==0&&(t=r,n=Vi(e,r))}if(n===1)throw n=Xn,Tt(e,0),nt(e,t),me(e,Y()),n;if(n===6)throw Error(w(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ct(e,ce,Ve),me(e,Y()),null}function Lo(e,t){var n=D;D|=1;try{return e(t)}finally{D=n,D===0&&(un=Y()+500,ul&&vt())}}function Dt(e){lt!==null&&lt.tag===0&&!(D&6)&&en();var t=D;D|=1;var n=Te.transition,r=I;try{if(Te.transition=null,I=1,e)return e()}finally{I=r,Te.transition=n,D=t,!(D&6)&&vt()}}function Mo(){ge=Gt.current,U(Gt)}function Tt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Zd(n)),K!==null)for(n=K.return;n!==null;){var r=n;switch(fo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&$r();break;case 3:on(),U(fe),U(ie),xo();break;case 5:ko(r);break;case 4:on();break;case 13:U($);break;case 19:U($);break;case 10:go(r.type._context);break;case 22:case 23:Mo()}n=n.return}if(q=e,K=e=ft(e.current,null),ee=ge=t,X=0,Xn=null,Po=fl=Mt=0,ce=Ln=null,Nt!==null){for(t=0;t<Nt.length;t++)if(n=Nt[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}Nt=null}return e}function Za(e,t){do{var n=K;try{if(ho(),_r.current=Zr,Xr){for(var r=V.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Xr=!1}if(Lt=0,J=G=V=null,Pn=!1,Yn=0,jo.current=null,n===null||n.return===null){X=1,Xn=t,K=null;break}e:{var i=e,o=n.return,s=n,u=t;if(t=ee,s.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,v=s,g=v.tag;if(!(v.mode&1)&&(g===0||g===11||g===15)){var h=v.alternate;h?(v.updateQueue=h.updateQueue,v.memoizedState=h.memoizedState,v.lanes=h.lanes):(v.updateQueue=null,v.memoizedState=null)}var k=zs(o);if(k!==null){k.flags&=-257,Ls(k,o,s,i,t),k.mode&1&&Ps(i,d,t),t=k,u=d;var x=t.updateQueue;if(x===null){var C=new Set;C.add(u),t.updateQueue=C}else x.add(u);break e}else{if(!(t&1)){Ps(i,d,t),Do();break e}u=Error(w(426))}}else if(B&&s.mode&1){var R=zs(o);if(R!==null){!(R.flags&65536)&&(R.flags|=256),Ls(R,o,s,i,t),po(sn(u,s));break e}}i=u=sn(u,s),X!==4&&(X=2),Ln===null?Ln=[i]:Ln.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var f=Da(i,u,t);Cs(i,f);break e;case 1:s=u;var c=i.type,a=i.stateNode;if(!(i.flags&128)&&(typeof c.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(ct===null||!ct.has(a)))){i.flags|=65536,t&=-t,i.lanes|=t;var m=Ia(i,s,t);Cs(i,m);break e}}i=i.return}while(i!==null)}ba(n)}catch(y){t=y,K===n&&n!==null&&(K=n=n.return);continue}break}while(!0)}function Ja(){var e=Jr.current;return Jr.current=Zr,e===null?Zr:e}function Do(){(X===0||X===3||X===2)&&(X=4),q===null||!(Mt&268435455)&&!(fl&268435455)||nt(q,ee)}function el(e,t){var n=D;D|=2;var r=Ja();(q!==e||ee!==t)&&(Ve=null,Tt(e,t));do try{Sf();break}catch(l){Za(e,l)}while(!0);if(ho(),D=n,Jr.current=r,K!==null)throw Error(w(261));return q=null,ee=0,X}function Sf(){for(;K!==null;)qa(K)}function Cf(){for(;K!==null&&!Kc();)qa(K)}function qa(e){var t=tc(e.alternate,e,ge);e.memoizedProps=e.pendingProps,t===null?ba(e):K=t,jo.current=null}function ba(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=gf(n,t),n!==null){n.flags&=32767,K=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{X=6,K=null;return}}else if(n=hf(n,t,ge),n!==null){K=n;return}if(t=t.sibling,t!==null){K=t;return}K=t=e}while(t!==null);X===0&&(X=5)}function Ct(e,t,n){var r=I,l=Te.transition;try{Te.transition=null,I=1,Ef(e,t,n,r)}finally{Te.transition=l,I=r}return null}function Ef(e,t,n,r){do en();while(lt!==null);if(D&6)throw Error(w(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(w(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(rd(e,i),e===q&&(K=q=null,ee=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||yr||(yr=!0,nc(Rr,function(){return en(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Te.transition,Te.transition=null;var o=I;I=1;var s=D;D|=4,jo.current=null,yf(e,n),Ka(n,e),Hd(ki),Fr=!!wi,ki=wi=null,e.current=n,wf(n),Gc(),D=s,I=o,Te.transition=i}else e.current=n;if(yr&&(yr=!1,lt=e,br=l),i=e.pendingLanes,i===0&&(ct=null),Jc(n.stateNode),me(e,Y()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(qr)throw qr=!1,e=Bi,Bi=null,e;return br&1&&e.tag!==0&&en(),i=e.pendingLanes,i&1?e===$i?Mn++:(Mn=0,$i=e):Mn=0,vt(),null}function en(){if(lt!==null){var e=Du(br),t=Te.transition,n=I;try{if(Te.transition=null,I=16>e?16:e,lt===null)var r=!1;else{if(e=lt,lt=null,br=0,D&6)throw Error(w(331));var l=D;for(D|=4,N=e.current;N!==null;){var i=N,o=i.child;if(N.flags&16){var s=i.deletions;if(s!==null){for(var u=0;u<s.length;u++){var d=s[u];for(N=d;N!==null;){var v=N;switch(v.tag){case 0:case 11:case 15:zn(8,v,i)}var g=v.child;if(g!==null)g.return=v,N=g;else for(;N!==null;){v=N;var h=v.sibling,k=v.return;if(Wa(v),v===d){N=null;break}if(h!==null){h.return=k,N=h;break}N=k}}}var x=i.alternate;if(x!==null){var C=x.child;if(C!==null){x.child=null;do{var R=C.sibling;C.sibling=null,C=R}while(C!==null)}}N=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,N=o;else e:for(;N!==null;){if(i=N,i.flags&2048)switch(i.tag){case 0:case 11:case 15:zn(9,i,i.return)}var f=i.sibling;if(f!==null){f.return=i.return,N=f;break e}N=i.return}}var c=e.current;for(N=c;N!==null;){o=N;var a=o.child;if(o.subtreeFlags&2064&&a!==null)a.return=o,N=a;else e:for(o=c;N!==null;){if(s=N,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:dl(9,s)}}catch(y){W(s,s.return,y)}if(s===o){N=null;break e}var m=s.sibling;if(m!==null){m.return=s.return,N=m;break e}N=s.return}}if(D=l,vt(),Be&&typeof Be.onPostCommitFiberRoot=="function")try{Be.onPostCommitFiberRoot(rl,e)}catch{}r=!0}return r}finally{I=n,Te.transition=t}}return!1}function Ws(e,t,n){t=sn(n,t),t=Da(e,t,1),e=at(e,t,1),t=se(),e!==null&&(Jn(e,1,t),me(e,t))}function W(e,t,n){if(e.tag===3)Ws(e,e,n);else for(;t!==null;){if(t.tag===3){Ws(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ct===null||!ct.has(r))){e=sn(n,e),e=Ia(t,e,1),t=at(t,e,1),e=se(),t!==null&&(Jn(t,1,e),me(t,e));break}}t=t.return}}function Nf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=se(),e.pingedLanes|=e.suspendedLanes&n,q===e&&(ee&n)===n&&(X===4||X===3&&(ee&130023424)===ee&&500>Y()-zo?Tt(e,0):Po|=n),me(e,t)}function ec(e,t){t===0&&(e.mode&1?(t=ur,ur<<=1,!(ur&130023424)&&(ur=4194304)):t=1);var n=se();e=Xe(e,t),e!==null&&(Jn(e,t,n),me(e,n))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ec(e,n)}function Tf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(w(314))}r!==null&&r.delete(t),ec(e,n)}var tc;tc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||fe.current)de=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return de=!1,mf(e,t,n);de=!!(e.flags&131072)}else de=!1,B&&t.flags&1048576&&ia(t,Wr,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;jr(e,t),e=t.pendingProps;var l=nn(t,ie.current);bt(t,n),l=Co(null,t,r,e,l,n);var i=Eo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,pe(r)?(i=!0,Vr(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,yo(t),l.updater=cl,t.stateNode=l,l._reactInternals=t,Pi(t,r,e,n),t=Mi(null,t,r,!0,i,n)):(t.tag=0,B&&i&&co(t),oe(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(jr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Pf(r),e=Le(r,e),l){case 0:t=Li(null,t,r,e,n);break e;case 1:t=Is(null,t,r,e,n);break e;case 11:t=Ms(null,t,r,e,n);break e;case 14:t=Ds(null,t,r,Le(r.type,e),n);break e}throw Error(w(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Le(r,l),Li(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Le(r,l),Is(e,t,r,l,n);case 3:e:{if(Aa(t),e===null)throw Error(w(387));r=t.pendingProps,i=t.memoizedState,l=i.element,da(e,t),Kr(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=sn(Error(w(423)),t),t=Rs(e,t,r,n,l);break e}else if(r!==l){l=sn(Error(w(424)),t),t=Rs(e,t,r,n,l);break e}else for(ye=ut(t.stateNode.containerInfo.firstChild),we=t,B=!0,De=null,n=aa(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(rn(),r===l){t=Ze(e,t,n);break e}oe(e,t,r,n)}t=t.child}return t;case 5:return fa(t),e===null&&_i(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,xi(r,l)?o=null:i!==null&&xi(r,i)&&(t.flags|=32),Fa(e,t),oe(e,t,o,n),t.child;case 6:return e===null&&_i(t),null;case 13:return Ua(e,t,n);case 4:return wo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=ln(t,null,r,n):oe(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Le(r,l),Ms(e,t,r,l,n);case 7:return oe(e,t,t.pendingProps,n),t.child;case 8:return oe(e,t,t.pendingProps.children,n),t.child;case 12:return oe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,F(Qr,r._currentValue),r._currentValue=o,i!==null)if(Oe(i.value,o)){if(i.children===l.children&&!fe.current){t=Ze(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var s=i.dependencies;if(s!==null){o=i.child;for(var u=s.firstContext;u!==null;){if(u.context===r){if(i.tag===1){u=Ye(-1,n&-n),u.tag=2;var d=i.updateQueue;if(d!==null){d=d.shared;var v=d.pending;v===null?u.next=u:(u.next=v.next,v.next=u),d.pending=u}}i.lanes|=n,u=i.alternate,u!==null&&(u.lanes|=n),Ti(i.return,n,t),s.lanes|=n;break}u=u.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(w(341));o.lanes|=n,s=o.alternate,s!==null&&(s.lanes|=n),Ti(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}oe(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,bt(t,n),l=je(l),r=r(l),t.flags|=1,oe(e,t,r,n),t.child;case 14:return r=t.type,l=Le(r,t.pendingProps),l=Le(r.type,l),Ds(e,t,r,l,n);case 15:return Ra(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Le(r,l),jr(e,t),t.tag=1,pe(r)?(e=!0,Vr(t)):e=!1,bt(t,n),Ma(t,r,l),Pi(t,r,l,n),Mi(null,t,r,!0,e,n);case 19:return Ba(e,t,n);case 22:return Oa(e,t,n)}throw Error(w(156,t.tag))};function nc(e,t){return Pu(e,t)}function jf(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _e(e,t,n,r){return new jf(e,t,n,r)}function Io(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Pf(e){if(typeof e=="function")return Io(e)?1:0;if(e!=null){if(e=e.$$typeof,e===qi)return 11;if(e===bi)return 14}return 2}function ft(e,t){var n=e.alternate;return n===null?(n=_e(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Lr(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")Io(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case At:return jt(n.children,l,i,t);case Ji:o=8,l|=8;break;case bl:return e=_e(12,n,t,l|2),e.elementType=bl,e.lanes=i,e;case ei:return e=_e(13,n,t,l),e.elementType=ei,e.lanes=i,e;case ti:return e=_e(19,n,t,l),e.elementType=ti,e.lanes=i,e;case fu:return pl(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case cu:o=10;break e;case du:o=9;break e;case qi:o=11;break e;case bi:o=14;break e;case be:o=16,r=null;break e}throw Error(w(130,e==null?e:typeof e,""))}return t=_e(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function jt(e,t,n,r){return e=_e(7,e,r,t),e.lanes=n,e}function pl(e,t,n,r){return e=_e(22,e,r,t),e.elementType=fu,e.lanes=n,e.stateNode={isHidden:!1},e}function Kl(e,t,n){return e=_e(6,e,null,t),e.lanes=n,e}function Gl(e,t,n){return t=_e(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function zf(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=jl(0),this.expirationTimes=jl(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=jl(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Ro(e,t,n,r,l,i,o,s,u){return e=new zf(e,t,n,s,u),t===1?(t=1,i===!0&&(t|=8)):t=0,i=_e(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},yo(i),e}function Lf(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ft,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function rc(e){if(!e)return mt;e=e._reactInternals;e:{if(Rt(e)!==e||e.tag!==1)throw Error(w(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(pe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(w(171))}if(e.tag===1){var n=e.type;if(pe(n))return ra(e,n,t)}return t}function lc(e,t,n,r,l,i,o,s,u){return e=Ro(n,r,!0,e,l,i,o,s,u),e.context=rc(null),n=e.current,r=se(),l=dt(n),i=Ye(r,l),i.callback=t??null,at(n,i,l),e.current.lanes=l,Jn(e,l,r),me(e,r),e}function ml(e,t,n,r){var l=t.current,i=se(),o=dt(l);return n=rc(n),t.context===null?t.context=n:t.pendingContext=n,t=Ye(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=at(l,t,o),e!==null&&(Re(e,l,o,i),Nr(e,l,o)),o}function tl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Qs(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Oo(e,t){Qs(e,t),(e=e.alternate)&&Qs(e,t)}function Mf(){return null}var ic=typeof reportError=="function"?reportError:function(e){console.error(e)};function Fo(e){this._internalRoot=e}hl.prototype.render=Fo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(w(409));ml(e,t,null,null)};hl.prototype.unmount=Fo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Dt(function(){ml(null,e,null,null)}),t[Ge]=null}};function hl(e){this._internalRoot=e}hl.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ou();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tt.length&&t!==0&&t<tt[n].priority;n++);tt.splice(n,0,e),n===0&&Au(e)}};function Ao(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function gl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ys(){}function Df(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var d=tl(o);i.call(d)}}var o=lc(t,r,e,0,null,!1,!1,"",Ys);return e._reactRootContainer=o,e[Ge]=o.current,$n(e.nodeType===8?e.parentNode:e),Dt(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var s=r;r=function(){var d=tl(u);s.call(d)}}var u=Ro(e,0,!1,null,null,!1,!1,"",Ys);return e._reactRootContainer=u,e[Ge]=u.current,$n(e.nodeType===8?e.parentNode:e),Dt(function(){ml(t,u,n,r)}),u}function vl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var s=l;l=function(){var u=tl(o);s.call(u)}}ml(t,o,e,l)}else o=Df(n,t,e,l,r);return tl(o)}Iu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Sn(t.pendingLanes);n!==0&&(no(t,n|1),me(t,Y()),!(D&6)&&(un=Y()+500,vt()))}break;case 13:Dt(function(){var r=Xe(e,1);if(r!==null){var l=se();Re(r,e,1,l)}}),Oo(e,1)}};ro=function(e){if(e.tag===13){var t=Xe(e,134217728);if(t!==null){var n=se();Re(t,e,134217728,n)}Oo(e,134217728)}};Ru=function(e){if(e.tag===13){var t=dt(e),n=Xe(e,t);if(n!==null){var r=se();Re(n,e,t,r)}Oo(e,t)}};Ou=function(){return I};Fu=function(e,t){var n=I;try{return I=e,t()}finally{I=n}};di=function(e,t,n){switch(t){case"input":if(li(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=sl(r);if(!l)throw Error(w(90));mu(r),li(r,l)}}}break;case"textarea":gu(e,n);break;case"select":t=n.value,t!=null&&Xt(e,!!n.multiple,t,!1)}};Cu=Lo;Eu=Dt;var If={usingClientEntryPoint:!1,Events:[bn,Vt,sl,xu,Su,Lo]},wn={findFiberByHostInstance:Et,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Rf={bundleType:wn.bundleType,version:wn.version,rendererPackageName:wn.rendererPackageName,rendererConfig:wn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Je.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Tu(e),e===null?null:e.stateNode},findFiberByHostInstance:wn.findFiberByHostInstance||Mf,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var wr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!wr.isDisabled&&wr.supportsFiber)try{rl=wr.inject(Rf),Be=wr}catch{}}xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=If;xe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ao(t))throw Error(w(200));return Lf(e,t,null,n)};xe.createRoot=function(e,t){if(!Ao(e))throw Error(w(299));var n=!1,r="",l=ic;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Ro(e,1,!1,null,null,n,!1,r,l),e[Ge]=t.current,$n(e.nodeType===8?e.parentNode:e),new Fo(t)};xe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(w(188)):(e=Object.keys(e).join(","),Error(w(268,e)));return e=Tu(t),e=e===null?null:e.stateNode,e};xe.flushSync=function(e){return Dt(e)};xe.hydrate=function(e,t,n){if(!gl(t))throw Error(w(200));return vl(null,e,t,!0,n)};xe.hydrateRoot=function(e,t,n){if(!Ao(e))throw Error(w(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=ic;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=lc(t,null,e,1,n??null,l,!1,i,o),e[Ge]=t.current,$n(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new hl(t)};xe.render=function(e,t,n){if(!gl(t))throw Error(w(200));return vl(null,e,t,!1,n)};xe.unmountComponentAtNode=function(e){if(!gl(e))throw Error(w(40));return e._reactRootContainer?(Dt(function(){vl(null,null,e,!1,function(){e._reactRootContainer=null,e[Ge]=null})}),!0):!1};xe.unstable_batchedUpdates=Lo;xe.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!gl(n))throw Error(w(200));if(e==null||e._reactInternals===void 0)throw Error(w(38));return vl(e,t,n,!1,r)};xe.version="18.3.1-next-f1338f8080-20240426";function oc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(oc)}catch(e){console.error(e)}}oc(),ou.exports=xe;var Of=ou.exports,Ks=Of;Jl.createRoot=Ks.createRoot,Jl.hydrateRoot=Ks.hydrateRoot;function Ff(e){return Af(e).map((n,r)=>({id:`step-${Date.now()}-${r}`,title:n.title,description:n.description,estimatedTime:n.estimatedTime,isCompleted:!1,createdAt:new Date}))}function Af(e){const t=e.toLowerCase();return t.includes("write")||t.includes("research")?[{title:"Gather research materials",estimatedTime:5},{title:"Create outline or structure",estimatedTime:3},{title:"Write first paragraph/section",estimatedTime:10},{title:"Review and edit initial content",estimatedTime:5},{title:"Add supporting details",estimatedTime:10}]:t.includes("organize")||t.includes("clean")?[{title:"Clear workspace surface",estimatedTime:2},{title:"Sort items into categories",estimatedTime:5},{title:"Put away misplaced items",estimatedTime:5},{title:"Wipe down surfaces",estimatedTime:3},{title:"Organize remaining items",estimatedTime:5}]:t.includes("learn")||t.includes("study")?[{title:"Find learning resources",estimatedTime:3},{title:"Read introduction/overview",estimatedTime:10},{title:"Take notes on key concepts",estimatedTime:10},{title:"Practice with examples",estimatedTime:15},{title:"Review and summarize learning",estimatedTime:5}]:t.includes("plan")||t.includes("prepare")?[{title:"Define clear objectives",estimatedTime:3},{title:"Research requirements",estimatedTime:5},{title:"Create detailed checklist",estimatedTime:5},{title:"Gather necessary materials",estimatedTime:5},{title:"Set up workspace",estimatedTime:2}]:t.includes("call")||t.includes("email")?[{title:"Prepare talking points/notes",estimatedTime:3},{title:"Draft message or script",estimatedTime:5},{title:"Make the call/send email",estimatedTime:5},{title:"Follow up if needed",estimatedTime:3},{title:"Log the interaction",estimatedTime:2}]:[{title:"Understand the task requirements",estimatedTime:3},{title:"Break down into smaller actions",estimatedTime:5},{title:"Start with the easiest part",estimatedTime:5},{title:"Continue with next steps",estimatedTime:10},{title:"Review and complete",estimatedTime:5}]}function Uf(){return new Promise(e=>{setTimeout(e,1e3+Math.random()*2e3)})}function yl(){const[e,t]=ve.useState(()=>{const a=localStorage.getItem("spurtalk-state");if(a)try{const m=JSON.parse(a);return{...m,tasks:m.tasks.map(y=>({...y,createdAt:new Date(y.createdAt)})),breakdowns:m.breakdowns.map(y=>({...y,createdAt:new Date(y.createdAt),microSteps:y.microSteps.map(S=>({...S,createdAt:new Date(S.createdAt)}))})),progress:m.progress||{totalStepsCompleted:0,currentStreak:0,longestStreak:0,lastActiveDate:null,achievements:[],dailyStats:[]},timer:m.timer||{isActive:!1,startTime:null,duration:0,currentTaskId:null,currentStepId:null},isPerfectionismMode:m.isPerfectionismMode??!1}}catch{console.warn("Failed to parse saved state, using defaults")}return{tasks:[],breakdowns:[],currentStep:null,progress:{totalStepsCompleted:0,currentStreak:0,longestStreak:0,lastActiveDate:null,achievements:[],dailyStats:[]},timer:{isActive:!1,startTime:null,duration:0,currentTaskId:null,currentStepId:null},isPerfectionismMode:!1}});ve.useEffect(()=>{localStorage.setItem("spurtalk-state",JSON.stringify(e))},[e]);const n=(a,m)=>{const y={id:`task-${Date.now()}`,title:a,description:m,createdAt:new Date,isCompleted:!1};t(S=>({...S,tasks:[...S.tasks,y]}))},r=a=>{t(m=>({...m,tasks:m.tasks.filter(y=>y.id!==a),breakdowns:m.breakdowns.filter(y=>y.taskId!==a)}))},l=async a=>{const m=e.tasks.find(E=>E.id===a);if(!m)return;await Uf();const y=Ff(m.title),S={taskId:a,originalTask:m.title,microSteps:y,createdAt:new Date,isAccepted:!1};t(E=>({...E,breakdowns:[...E.breakdowns,S]}))},i=a=>{t(m=>({...m,breakdowns:m.breakdowns.map(y=>y.taskId===a?{...y,isAccepted:!0}:y)}))},o=a=>{t(m=>({...m,breakdowns:m.breakdowns.filter(y=>y.taskId!==a)}))},s=(a,m)=>{t(y=>({...y,breakdowns:y.breakdowns.map(S=>S.taskId===a?{...S,microSteps:m}:S)}))},u=(a,m)=>{t(y=>{const S={...y,breakdowns:y.breakdowns.map(_=>_.taskId===a?{..._,microSteps:_.microSteps.map(O=>O.id===m?{...O,isCompleted:!O.isCompleted}:O)}:_)},E=S.breakdowns.flatMap(_=>_.microSteps).filter(_=>_.isCompleted).length;return{...S,progress:Bf(S.progress,E)}})},d=a=>e.breakdowns.find(m=>m.taskId===a),v=(a,m)=>{const y=new Date;t(S=>({...S,timer:{isActive:!0,startTime:y,duration:2*60*1e3,currentTaskId:a,currentStepId:m||null}}))},g=()=>{t(a=>({...a,timer:{...a.timer,isActive:!1,startTime:null}}))},h=()=>{t(a=>({...a,timer:{...a.timer,isActive:!1}}))},k=()=>{e.timer.currentTaskId&&t(a=>({...a,timer:{...a.timer,isActive:!0,startTime:new Date}}))},x=()=>{if(!e.timer.isActive||!e.timer.startTime)return 0;const a=Date.now()-e.timer.startTime.getTime();return Math.min(a/e.timer.duration,1)},C=()=>{if(!e.timer.startTime)return e.timer.duration;const a=Date.now()-e.timer.startTime.getTime();return Math.max(0,e.timer.duration-a)};return{state:e,addTask:n,deleteTask:r,generateBreakdown:l,acceptBreakdown:i,rejectBreakdown:o,modifyBreakdown:s,toggleStepCompletion:u,getCurrentBreakdown:d,startTwoMinuteTimer:v,stopTimer:g,pauseTimer:h,resumeTimer:k,getTimerProgress:x,getRemainingTime:C,isTimerFinished:()=>C()===0,resetTimer:()=>{t(a=>({...a,timer:{isActive:!1,startTime:null,duration:0,currentTaskId:null,currentStepId:null}}))},togglePerfectionismMode:()=>{t(a=>({...a,isPerfectionismMode:!a.isPerfectionismMode}))}}}function Bf(e,t){const n=new Date().toISOString().split("T")[0],r=new Date(Date.now()-864e5).toISOString().split("T")[0];let l=[...e.dailyStats];const i=l.findIndex(d=>d.date===n);i>=0?l[i]={...l[i],stepsCompleted:t}:l.push({date:n,stepsCompleted:t,timeSpent:0,tasksStarted:[]});let o=e.currentStreak,s=e.longestStreak;e.lastActiveDate===r?(o+=1,o>s&&(s=o)):e.lastActiveDate!==n&&(o=1);const u=$f({...e,currentStreak:o});return{...e,totalStepsCompleted:t,currentStreak:o,longestStreak:s,lastActiveDate:n,achievements:u,dailyStats:l}}function $f(e){const t=e.achievements,n=[];return e.totalStepsCompleted>=5&&!t.some(r=>r.id==="five_steps")&&n.push({id:"five_steps",title:"5 First Steps",description:"Complete 5 micro-steps",icon:"👟",unlockedAt:new Date,isUnlocked:!0}),e.currentStreak>=3&&!t.some(r=>r.id==="morning_warrior")&&n.push({id:"morning_warrior",title:"Morning Warrior",description:"3 consecutive days of progress",icon:"🌅",unlockedAt:new Date,isUnlocked:!0}),[...t,...n]}const Vf=({taskId:e,stepId:t,onCompletion:n})=>{const{state:r,stopTimer:l,pauseTimer:i,getRemainingTime:o,getTimerProgress:s,isTimerFinished:u}=yl(),[d,v]=ve.useState(!1),g=f=>{const c=Math.ceil(f/1e3),a=Math.floor(c/60),m=c%60;return`${a}:${m.toString().padStart(2,"0")}`};ve.useEffect(()=>{const f=setInterval(()=>{u()&&(v(!0),l())},1e3);return()=>clearInterval(f)},[u,l]);const h=()=>{v(!1),n(!0)},k=()=>{v(!1),n(!1)},x=s(),C=o();return r.timer.currentTaskId===e&&(t?r.timer.currentStepId===t:!0)?p.jsxs("div",{className:"two-minute-timer",children:[d?p.jsxs("div",{className:"completion-prompt",children:[p.jsx("h3",{children:"Time's up! 🎉"}),p.jsx("p",{children:"Great job completing 2 minutes! How would you like to proceed?"}),p.jsxs("div",{className:"completion-actions",children:[p.jsx("button",{onClick:h,className:"keep-going-btn",children:"Keep going! I'm in the zone"}),p.jsx("button",{onClick:k,className:"done-btn",children:"Great job! Done for now"})]})]}):p.jsxs("div",{className:"timer-display",children:[p.jsxs("div",{className:"timer-circle",children:[p.jsxs("svg",{width:"200",height:"200",viewBox:"0 0 200 200",children:[p.jsx("circle",{cx:"100",cy:"100",r:"90",fill:"none",stroke:"#e5e7eb",strokeWidth:"10"}),p.jsx("circle",{cx:"100",cy:"100",r:"90",fill:"none",stroke:"#10b981",strokeWidth:"10",strokeDasharray:`${2*Math.PI*90}`,strokeDashoffset:`${2*Math.PI*90*(1-x)}`,strokeLinecap:"round",transform:"rotate(-90 100 100)"})]}),p.jsxs("div",{className:"timer-text",children:[p.jsx("div",{className:"time",children:g(C)}),p.jsx("div",{className:"label",children:"Just 2 minutes"})]})]}),p.jsxs("div",{className:"timer-controls",children:[p.jsx("button",{onClick:i,className:"control-btn pause-btn",children:"Pause"}),p.jsx("button",{onClick:l,className:"control-btn stop-btn",children:"Stop"})]}),p.jsxs("div",{className:"encouragement",children:[p.jsx("p",{children:"You've got this! Just focus for these 2 minutes."}),p.jsx("p",{style:{fontSize:"0.8rem",color:"#6b7280"},children:"No pressure - even stopping after 2 minutes is a win! 🌟"})]})]}),p.jsx("style",{children:`
        .two-minute-timer {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 2px solid #10b981;
          max-width: 400px;
          margin: 0 auto;
        }

        .completion-prompt {
          animation: fadeIn 0.3s ease-in;
        }

        .completion-prompt h3 {
          margin: 0 0 0.5rem 0;
          color: #10b981;
          font-size: 1.5rem;
        }

        .completion-prompt p {
          margin: 0 0 1.5rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .completion-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .keep-going-btn {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .keep-going-btn:hover {
          transform: translateY(-2px);
        }

        .done-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .done-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        .timer-display {
          animation: fadeIn 0.3s ease-in;
        }

        .timer-circle {
          position: relative;
          margin-bottom: 2rem;
        }

        .timer-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .time {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          font-family: 'Courier New', monospace;
        }

        .label {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .control-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          background: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .pause-btn:hover {
          background: #fef3c7;
          border-color: #f59e0b;
        }

        .stop-btn:hover {
          background: #fee2e2;
          border-color: #ef4444;
        }

        .encouragement {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 12px;
          padding: 1rem;
          color: #166534;
        }

        .encouragement p {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .encouragement p:last-child {
          margin-bottom: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .two-minute-timer {
            padding: 1.5rem;
            margin: 0 1rem;
          }

          .timer-circle svg {
            width: 150px;
            height: 150px;
          }

          .timer-text .time {
            font-size: 1.5rem;
          }

          .completion-actions {
            gap: 0.75rem;
          }

          .keep-going-btn, .done-btn {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }
      `})]}):null};class Hf{constructor(){Sl(this,"audioContext",null);Sl(this,"isInitialized",!1);typeof window<"u"&&(this.audioContext=new(window.AudioContext||window.webkitAudioContext))}async initAudio(){if(this.audioContext&&!this.isInitialized)try{await this.audioContext.resume(),this.isInitialized=!0}catch(t){console.warn("Audio context initialization failed:",t)}}playTone(t,n,r="sine"){if(!this.audioContext)return;const l=this.audioContext.createOscillator(),i=this.audioContext.createGain();l.connect(i),i.connect(this.audioContext.destination),l.frequency.setValueAtTime(t,this.audioContext.currentTime),l.type=r,i.gain.setValueAtTime(.1,this.audioContext.currentTime),i.gain.exponentialRampToValueAtTime(.01,this.audioContext.currentTime+n),l.start(this.audioContext.currentTime),l.stop(this.audioContext.currentTime+n)}async playSuccess(){if(await this.initAudio(),!this.audioContext)return;[523.25,659.25,783.99,1046.5].forEach((n,r)=>{setTimeout(()=>{this.playTone(n,.2)},r*150)})}async playProgress(){await this.initAudio(),this.audioContext&&this.playTone(440,.3,"triangle")}async playLevelUp(){if(await this.initAudio(),!this.audioContext)return;[392,493.88,587.33].forEach((n,r)=>{setTimeout(()=>{this.playTone(n,.5,"sawtooth")},r*50)})}}const Wf=new Hf,Gs=[{id:"imperfect_001",text:"Perfect is the enemy of good.",author:"Voltaire",category:"imperfect_action"},{id:"imperfect_002",text:"Done is better than perfect.",author:"Sheryl Sandberg",category:"done_is_better"},{id:"imperfect_003",text:"The best way to get something done is to begin.",author:"Ernest Hemingway",category:"imperfect_action"},{id:"progress_001",text:"Progress, not perfection.",category:"progress_over_perfection"},{id:"progress_002",text:"It's better to do something imperfectly than to do nothing perfectly.",author:"Robert Schuller",category:"imperfect_action"},{id:"progress_003",text:"Small steps in the right direction can turn out to be the biggest step of your life.",category:"progress_over_perfection"},{id:"done_001",text:"A professional is someone who does a job well even when they don't like it.",author:"Jodie Foster",category:"done_is_better"},{id:"done_002",text:"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",author:"Steve Jobs",category:"learning_mindset"},{id:"learning_001",text:"Done is better than perfect. Perfect is a myth.",category:"done_is_better"},{id:"learning_002",text:"Every expert was once a beginner. Every professional was once an amateur.",category:"learning_mindset"},{id:"learning_003",text:"The only real mistake is the one from which we learn nothing.",author:"Henry Ford",category:"learning_mindset"},{id:"learning_004",text:"Don't let perfect be the enemy of the good enough.",category:"progress_over_perfection"}];function Xl(){const e=Math.floor(Math.random()*Gs.length);return Gs[e]}function Qf(){return["Great job getting started!","Progress is progress, no matter how small.","You're moving forward - that's what matters!","Imperfect action beats perfect planning.","Every step counts toward your goal.","Done is better than perfect!","You're building momentum - keep going!"]}function Yf(){const e=Qf();return e[Math.floor(Math.random()*e.length)]}const Kf=({task:e})=>{const{state:t,generateBreakdown:n,acceptBreakdown:r,rejectBreakdown:l,modifyBreakdown:i,getCurrentBreakdown:o,startTwoMinuteTimer:s,toggleStepCompletion:u}=yl(),[d,v]=ve.useState(!1),[g,h]=ve.useState(!1),[k,x]=ve.useState(!1),[C,R]=ve.useState(null),f=o(e.id),c=M=>{R(M||null),x(!0),s(e.id,M)},a=M=>{x(!1),M&&setTimeout(()=>{c(C||void 0)},1e3)},m=(M,Ce)=>{u(M,Ce),Wf.playSuccess(),t.isPerfectionismMode&&console.log("🎉",Yf())},y=async()=>{v(!0),await n(e.id),v(!1),h(!0)},S=()=>{r(e.id),h(!1)},E=()=>{l(e.id),h(!1)},_=()=>{if(!f)return;const M={id:`step-${Date.now()}`,title:"New step",estimatedTime:5,isCompleted:!1,createdAt:new Date};i(e.id,[...f.microSteps,M])},O=M=>{f&&i(e.id,f.microSteps.filter(Ce=>Ce.id!==M))},P=(M,Ce,wl)=>{f&&i(e.id,f.microSteps.map(wt=>wt.id===M?{...wt,[Ce]:wl}:wt))},he=()=>t.isPerfectionismMode?"🚀 Just 2 Minutes - Start Anywhere!":"⏱️ 2-Minute Start",yt=()=>t.isPerfectionismMode?"Good enough is good enough! Pick any step and just start. 🌟":"Pick the easiest step and commit to just 2 minutes. No pressure, just progress! 🌟";return f&&f.isAccepted?p.jsxs("div",{className:"breakdown-display",children:[p.jsx("h3",{children:"Task Breakdown"}),p.jsx("div",{className:"steps-list",children:f.microSteps.map(M=>p.jsxs("div",{className:`step-item ${M.isCompleted?"completed":""}`,children:[p.jsx("input",{type:"checkbox",checked:M.isCompleted,onChange:()=>m(e.id,M.id),className:"step-checkbox"}),p.jsx("span",{className:`step-title ${M.isCompleted?"completed":""}`,children:M.title}),p.jsxs("span",{className:"step-time",children:["(~",M.estimatedTime," min)"]}),p.jsx("button",{onClick:()=>c(M.id),className:"two-minute-btn",children:he()})]},M.id))}),p.jsxs("div",{className:"global-two-minute",children:[p.jsx("button",{onClick:()=>c(),className:"global-two-minute-btn",children:"🚀 Just 2 Minutes - Start Anywhere!"}),p.jsx("p",{className:"global-two-minute-subtitle",children:yt()})]})]}):p.jsxs("div",{className:"task-breakdown-assistant",children:[p.jsxs("div",{className:"assistant-header",children:[p.jsx("h3",{children:"AI Task Breakdown Assistant"}),p.jsxs("p",{children:['Break down "',e.title,'" into tiny, achievable steps']})]}),!g&&!f?p.jsx("button",{onClick:y,disabled:d,className:"generate-btn",children:d?"Analyzing...":"Break this down"}):null,d&&p.jsxs("div",{className:"loading",children:[p.jsx("div",{className:"spinner"}),p.jsx("p",{children:"AI is breaking down your task into manageable steps..."})]}),f&&g&&p.jsxs("div",{className:"breakdown-suggestions",children:[p.jsxs("h4",{children:[`Here's how you can tackle "`,e.title,'":']}),p.jsx("div",{className:"steps-list",children:f.microSteps.map(M=>p.jsxs("div",{className:"step-item",children:[p.jsx("input",{type:"text",value:M.title,onChange:Ce=>P(M.id,"title",Ce.target.value),className:"step-input"}),p.jsx("input",{type:"number",value:M.estimatedTime,onChange:Ce=>P(M.id,"estimatedTime",parseInt(Ce.target.value)),className:"time-input",min:"1",max:"60"}),p.jsx("button",{onClick:()=>O(M.id),className:"remove-btn",children:"✕"})]},M.id))}),p.jsxs("div",{className:"breakdown-actions",children:[p.jsx("button",{onClick:_,className:"add-step-btn",children:"+ Add Step"}),p.jsxs("div",{className:"action-buttons",children:[p.jsx("button",{onClick:E,className:"reject-btn",children:"Not helpful"}),p.jsx("button",{onClick:S,className:"accept-btn",children:"Looks good!"})]})]})]}),k&&p.jsx("div",{className:"timer-section",children:p.jsx(Vf,{taskId:e.id,stepId:C||void 0,onCompletion:a})}),p.jsx("style",{children:`
        .task-breakdown-assistant {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }

        .assistant-header h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .assistant-header p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .generate-btn {
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .breakdown-suggestions {
          margin-top: 1.5rem;
        }

        .breakdown-suggestions h4 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .steps-list {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .step-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
        }

        .time-input {
          width: 80px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          text-align: center;
        }

        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .breakdown-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-step-btn {
          background: #e0e7ff;
          color: #4f46e5;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .reject-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .accept-btn {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .accept-btn:hover {
          transform: translateY(-1px);
        }

        .breakdown-display h3 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .steps-list {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
        }

        .step-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .step-item.completed {
          background: #f0fdf4;
          border-color: #10b981;
          animation: fadeIn 0.3s ease;
        }

        .step-checkbox {
          width: 20px;
          height: 20px;
          margin-right: 1rem;
          cursor: pointer;
        }

        .step-title {
          font-weight: 500;
          color: #374151;
          flex: 1;
        }

        .step-title.completed {
          text-decoration: line-through;
          color: #6b7280;
          opacity: 0.7;
        }

        .step-title {
          font-weight: 500;
          color: #374151;
        }

        .step-time {
          color: #6b7280;
          font-size: 0.875rem;
          background: #eef2ff;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
        }

        .two-minute-btn {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .two-minute-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
        }

        .global-two-minute {
          margin-top: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          text-align: center;
        }

        .global-two-minute-btn {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.25rem;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .global-two-minute-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.6);
        }

        .global-two-minute-subtitle {
          margin: 1rem 0 0 0;
          color: #92400e;
          font-weight: 600;
          font-size: 1rem;
        }

        .timer-section {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .step-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .global-two-minute {
            padding: 1rem;
          }

          .global-two-minute-btn {
            font-size: 1rem;
            padding: 0.75rem 1.5rem;
          }
        }
      `})]})},Gf=({progress:e,className:t=""})=>{var i;const n=e.totalStepsCompleted,r=Math.max(10,n+1),l=Math.min(n/r*100,100);return p.jsxs("div",{className:`progress-bar-container ${t}`,children:[p.jsxs("div",{className:"progress-header",children:[p.jsx("h3",{children:"Your Progress Journey"}),p.jsxs("div",{className:"progress-stats",children:[p.jsxs("span",{className:"stat-item",children:[p.jsx("span",{className:"stat-label",children:"Today:"}),p.jsx("span",{className:"stat-value",children:((i=e.dailyStats[e.dailyStats.length-1])==null?void 0:i.stepsCompleted)||0})]}),p.jsxs("span",{className:"stat-item",children:[p.jsx("span",{className:"stat-label",children:"Streak:"}),p.jsx("span",{className:"stat-value streak-value",children:e.currentStreak})]}),p.jsxs("span",{className:"stat-item",children:[p.jsx("span",{className:"stat-label",children:"Total:"}),p.jsx("span",{className:"stat-value",children:n})]})]})]}),p.jsx("div",{className:"progress-track",children:p.jsx("div",{className:"progress-fill",style:{width:`${l}%`,transition:"width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"}})}),p.jsxs("div",{className:"progress-labels",children:[p.jsx("span",{className:"label-left",children:"Small Steps"}),p.jsx("span",{className:"label-right",children:"Big Wins"})]}),p.jsx("style",{children:`
        .progress-bar-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .progress-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 8px;
          background: #f9fafb;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .streak-value {
          color: #22c55e;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .progress-track {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          margin: 1rem 0;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          border-radius: 999px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .label-left {
          font-weight: 500;
        }

        .label-right {
          font-weight: 600;
          color: #1f2937;
        }
      `})]})},Xf=({achievements:e})=>{const t=e.filter(n=>n.isUnlocked);return t.length===0?p.jsx("div",{className:"achievement-container",children:p.jsxs("div",{className:"achievement-prompt",children:[p.jsx("h4",{children:"Ready for Your First Badge?"}),p.jsx("p",{children:"Complete 5 micro-steps to unlock your first achievement!"}),p.jsxs("div",{className:"progress-hint",children:[p.jsx("span",{className:"progress-dot",children:"•"}),p.jsx("span",{className:"progress-dot",children:"•"}),p.jsx("span",{className:"progress-dot",children:"•"}),p.jsx("span",{className:"progress-dot",children:"•"}),p.jsx("span",{className:"progress-dot",children:"•"})]})]})}):p.jsxs("div",{className:"achievement-container",children:[p.jsxs("div",{className:"achievement-header",children:[p.jsx("h4",{children:"Your Achievements"}),p.jsxs("p",{className:"achievement-count",children:["You've unlocked ",t.length," badge",t.length>1?"s":"","!"]})]}),p.jsx("div",{className:"achievement-grid",children:t.map(n=>p.jsxs("div",{className:"achievement-card",children:[p.jsx("div",{className:"achievement-icon",children:p.jsx("span",{className:"icon-emoji",children:n.icon})}),p.jsxs("div",{className:"achievement-content",children:[p.jsx("h5",{className:"achievement-title",children:n.title}),p.jsx("p",{className:"achievement-desc",children:n.description}),p.jsxs("span",{className:"achievement-date",children:["Unlocked ",Zf(n.unlockedAt)]})]}),p.jsx("div",{className:"achievement-celebration",children:p.jsx("span",{className:"celebration-text",children:"🎉"})})]},n.id))}),p.jsx("style",{children:`
        .achievement-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .achievement-prompt {
          text-align: center;
          padding: 2rem;
        }

        .achievement-prompt h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: #374151;
        }

        .achievement-prompt p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .progress-hint {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .progress-dot {
          font-size: 1.5rem;
          opacity: 0.3;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .achievement-header {
          margin-bottom: 1.5rem;
        }

        .achievement-header h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .achievement-count {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .achievement-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .achievement-card {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .achievement-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .achievement-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          opacity: 0.8;
        }

        .achievement-icon {
          margin-right: 1rem;
          background: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .icon-emoji {
          font-size: 2rem;
          line-height: 1;
        }

        .achievement-content {
          flex: 1;
          min-width: 0;
        }

        .achievement-title {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .achievement-desc {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .achievement-date {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .achievement-celebration {
          margin-left: 1rem;
          font-size: 1.5rem;
          opacity: 0.8;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `})]})};function Zf(e){const n=Math.abs(new Date().getTime()-e.getTime()),r=Math.ceil(n/(1e3*60*60*24));return r===1?"yesterday":r<7?`${r} days ago`:r<30?`${Math.floor(r/7)} weeks ago`:e.toLocaleDateString()}const Jf=({progress:e,className:t=""})=>p.jsxs("div",{className:`progress-dashboard ${t}`,children:[p.jsx(Gf,{progress:e}),p.jsx(Xf,{achievements:e.achievements}),p.jsx("style",{children:`
        .progress-dashboard {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          grid-template-columns: 2fr 1fr;
        }
      `})]}),qf=({className:e=""})=>{const{state:t,togglePerfectionismMode:n}=yl(),[r,l]=Zl.useState(Xl());Zl.useEffect(()=>{if(t.isPerfectionismMode){const d=setInterval(()=>{l(Xl())},3e4);return()=>clearInterval(d)}},[t.isPerfectionismMode]);const i=()=>t.isPerfectionismMode?"Anti-Perfectionism Mode: ON":"Anti-Perfectionism Mode: OFF",o=()=>t.isPerfectionismMode?"Focus on progress, not perfection. Good enough is good enough!":"Toggle on to reduce perfectionism and focus on action.",u=t.isPerfectionismMode?{bg:"#fef3c7",text:"#92400e",border:"#f59e0b"}:{bg:"#f3f4f6",text:"#374151",border:"#d1d5db"};return p.jsxs("div",{className:`anti-perfectionism-mode ${e}`,style:{borderColor:u.border},children:[p.jsxs("div",{className:"mode-header",children:[p.jsxs("div",{className:"mode-toggle",children:[p.jsx("button",{className:"toggle-switch",onClick:n,"aria-pressed":t.isPerfectionismMode,"aria-label":"Toggle Anti-Perfectionism Mode",children:p.jsx("span",{className:"toggle-track",children:p.jsx("span",{className:"toggle-thumb",style:{transform:t.isPerfectionismMode?"translateX(22px)":"translateX(2px)",backgroundColor:t.isPerfectionismMode?"#f59e0b":"#9ca3af"}})})}),p.jsxs("div",{className:"mode-info",children:[p.jsx("h3",{style:{color:u.text},children:i()}),p.jsx("p",{style:{color:u.text},children:o()})]})]}),t.isPerfectionismMode&&p.jsx("button",{className:"get-quote-btn",onClick:()=>l(Xl()),style:{backgroundColor:u.bg,color:u.text},children:"🎲 New Mantra"})]}),t.isPerfectionismMode&&p.jsxs("div",{className:"motivational-quote",children:[p.jsxs("div",{className:"quote-content",children:[p.jsxs("blockquote",{children:['"',r.text,'"']}),r.author&&p.jsxs("cite",{children:["— ",r.author]})]}),p.jsx("div",{className:"quote-category",children:p.jsx("span",{className:"category-badge",children:bf(r.category)})})]}),p.jsx("style",{children:`
        .anti-perfectionism-mode {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .mode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-switch {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: 50px;
          height: 30px;
          position: relative;
        }

        .toggle-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #e5e7eb;
          border-radius: 999px;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: background-color 0.2s;
        }

        .toggle-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch:hover .toggle-track {
          background: #d1d5db;
        }

        .mode-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .mode-info p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .get-quote-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 2px solid;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          font-size: 0.875rem;
        }

        .get-quote-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .motivational-quote {
          background: #fffbeb;
          border: 1px solid #f59e0b;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
          border-left: 4px solid #f59e0b;
        }

        .quote-content {
          text-align: center;
        }

        .quote-content blockquote {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-style: italic;
          color: #92400e;
          line-height: 1.5;
        }

        .quote-content cite {
          font-style: normal;
          font-size: 0.875rem;
          color: #d97706;
          font-weight: 600;
        }

        .quote-category {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .category-badge {
          background: #fde68a;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .mode-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .get-quote-btn {
            align-self: flex-end;
          }
        }
      `})]})};function bf(e){return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}const ep=()=>{const{state:e,addTask:t,deleteTask:n}=yl(),[r,l]=ve.useState(""),[i,o]=ve.useState(""),s=d=>{d.preventDefault(),r.trim()&&(t(r.trim(),i.trim()||void 0),l(""),o(""))},u=d=>{d.key==="Enter"&&!d.shiftKey&&s(d)};return p.jsxs("div",{className:"dashboard",children:[p.jsx(qf,{className:"anti-perfectionism-section"}),p.jsx(Jf,{progress:e.progress}),p.jsxs("div",{className:"add-task-section",children:[p.jsx("h2",{children:"Add a task to break down"}),p.jsx("p",{children:"Enter any overwhelming task and our AI will help you break it into tiny, manageable steps."}),p.jsxs("form",{onSubmit:s,className:"task-form",children:[p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"task-title",children:"What do you need to do?"}),p.jsx("input",{id:"task-title",type:"text",value:r,onChange:d=>l(d.target.value),onKeyPress:u,placeholder:"e.g., Write research paper, Organize closet, Learn to cook",className:"task-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"task-description",children:"Any details? (optional)"}),p.jsx("textarea",{id:"task-description",value:i,onChange:d=>o(d.target.value),onKeyPress:u,placeholder:"Additional context or requirements...",className:"task-textarea",rows:3})]}),p.jsx("button",{type:"submit",className:"add-task-btn",disabled:!r.trim(),children:"Add Task"})]})]}),e.tasks.length>0&&p.jsxs("div",{className:"tasks-section",children:[p.jsx("h2",{children:"Your Tasks"}),p.jsx("div",{className:"tasks-grid",children:e.tasks.map(d=>p.jsxs("div",{className:"task-card",children:[p.jsxs("div",{className:"task-header",children:[p.jsx("h3",{children:d.title}),d.description&&p.jsx("p",{className:"task-description",children:d.description}),p.jsxs("div",{className:"task-meta",children:[p.jsxs("span",{className:"task-date",children:["Added ",d.createdAt.toLocaleDateString()]}),p.jsx("button",{onClick:()=>n(d.id),className:"delete-btn","aria-label":"Delete task",children:"Delete"})]})]}),p.jsx(Kf,{task:d})]},d.id))})]}),p.jsx("style",{children:`
        .dashboard {
          max-width: 800px;
          margin: 0 auto;
        }

        .anti-perfectionism-section {
      margin-bottom: 2rem;
    }

    .add-task-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .add-task-section h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .add-task-section p {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 1.1rem;
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .task-input, .task-textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .task-input:focus, .task-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .add-task-btn {
          align-self: flex-start;
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-task-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .add-task-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tasks-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tasks-section h2 {
          margin: 0 0 2rem 0;
          color: #1f2937;
        }

        .tasks-grid {
          display: grid;
          gap: 1.5rem;
        }

        .task-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }

        .task-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .task-header h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .task-description {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .task-date {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .delete-btn:hover {
          background: #fecaca;
        }
      `})]})};function tp(){return p.jsxs("div",{className:"App",children:[p.jsxs("div",{className:"app-container",children:[p.jsxs("div",{className:"header",children:[p.jsx("h1",{children:"SpurTalk"}),p.jsx("p",{children:"Your AI-powered procrastination companion"})]}),p.jsx(ep,{})]}),p.jsx("style",{children:`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }

        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #6366f1, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          color: #64748b;
          font-size: 1.1rem;
        }
      `})]})}Jl.createRoot(document.getElementById("root")).render(p.jsx(Zl.StrictMode,{children:p.jsx(tp,{})}));
