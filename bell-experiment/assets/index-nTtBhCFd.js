(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const u of a)if(u.type==="childList")for(const c of u.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(a){const u={};return a.integrity&&(u.integrity=a.integrity),a.referrerPolicy&&(u.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?u.credentials="include":a.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(a){if(a.ep)return;a.ep=!0;const u=n(a);fetch(a.href,u)}})();function x_(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Wc={exports:{}},Ma={},Xc={exports:{}},Tt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qp;function y_(){if(qp)return Tt;qp=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),c=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),v=Symbol.iterator;function x(I){return I===null||typeof I!="object"?null:(I=v&&I[v]||I["@@iterator"],typeof I=="function"?I:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,T={};function y(I,re,Ge){this.props=I,this.context=re,this.refs=T,this.updater=Ge||S}y.prototype.isReactComponent={},y.prototype.setState=function(I,re){if(typeof I!="object"&&typeof I!="function"&&I!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,I,re,"setState")},y.prototype.forceUpdate=function(I){this.updater.enqueueForceUpdate(this,I,"forceUpdate")};function g(){}g.prototype=y.prototype;function U(I,re,Ge){this.props=I,this.context=re,this.refs=T,this.updater=Ge||S}var D=U.prototype=new g;D.constructor=U,E(D,y.prototype),D.isPureReactComponent=!0;var b=Array.isArray,V=Object.prototype.hasOwnProperty,F={current:null},N={key:!0,ref:!0,__self:!0,__source:!0};function W(I,re,Ge){var ee,me={},Ce=null,Ee=null;if(re!=null)for(ee in re.ref!==void 0&&(Ee=re.ref),re.key!==void 0&&(Ce=""+re.key),re)V.call(re,ee)&&!N.hasOwnProperty(ee)&&(me[ee]=re[ee]);var De=arguments.length-2;if(De===1)me.children=Ge;else if(1<De){for(var ze=Array(De),st=0;st<De;st++)ze[st]=arguments[st+2];me.children=ze}if(I&&I.defaultProps)for(ee in De=I.defaultProps,De)me[ee]===void 0&&(me[ee]=De[ee]);return{$$typeof:s,type:I,key:Ce,ref:Ee,props:me,_owner:F.current}}function R(I,re){return{$$typeof:s,type:I.type,key:re,ref:I.ref,props:I.props,_owner:I._owner}}function C(I){return typeof I=="object"&&I!==null&&I.$$typeof===s}function B(I){var re={"=":"=0",":":"=2"};return"$"+I.replace(/[=:]/g,function(Ge){return re[Ge]})}var ie=/\/+/g;function Q(I,re){return typeof I=="object"&&I!==null&&I.key!=null?B(""+I.key):re.toString(36)}function ue(I,re,Ge,ee,me){var Ce=typeof I;(Ce==="undefined"||Ce==="boolean")&&(I=null);var Ee=!1;if(I===null)Ee=!0;else switch(Ce){case"string":case"number":Ee=!0;break;case"object":switch(I.$$typeof){case s:case e:Ee=!0}}if(Ee)return Ee=I,me=me(Ee),I=ee===""?"."+Q(Ee,0):ee,b(me)?(Ge="",I!=null&&(Ge=I.replace(ie,"$&/")+"/"),ue(me,re,Ge,"",function(st){return st})):me!=null&&(C(me)&&(me=R(me,Ge+(!me.key||Ee&&Ee.key===me.key?"":(""+me.key).replace(ie,"$&/")+"/")+I)),re.push(me)),1;if(Ee=0,ee=ee===""?".":ee+":",b(I))for(var De=0;De<I.length;De++){Ce=I[De];var ze=ee+Q(Ce,De);Ee+=ue(Ce,re,Ge,ze,me)}else if(ze=x(I),typeof ze=="function")for(I=ze.call(I),De=0;!(Ce=I.next()).done;)Ce=Ce.value,ze=ee+Q(Ce,De++),Ee+=ue(Ce,re,Ge,ze,me);else if(Ce==="object")throw re=String(I),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(I).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.");return Ee}function de(I,re,Ge){if(I==null)return I;var ee=[],me=0;return ue(I,ee,"","",function(Ce){return re.call(Ge,Ce,me++)}),ee}function le(I){if(I._status===-1){var re=I._result;re=re(),re.then(function(Ge){(I._status===0||I._status===-1)&&(I._status=1,I._result=Ge)},function(Ge){(I._status===0||I._status===-1)&&(I._status=2,I._result=Ge)}),I._status===-1&&(I._status=0,I._result=re)}if(I._status===1)return I._result.default;throw I._result}var fe={current:null},z={transition:null},ce={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:z,ReactCurrentOwner:F};function ae(){throw Error("act(...) is not supported in production builds of React.")}return Tt.Children={map:de,forEach:function(I,re,Ge){de(I,function(){re.apply(this,arguments)},Ge)},count:function(I){var re=0;return de(I,function(){re++}),re},toArray:function(I){return de(I,function(re){return re})||[]},only:function(I){if(!C(I))throw Error("React.Children.only expected to receive a single React element child.");return I}},Tt.Component=y,Tt.Fragment=n,Tt.Profiler=a,Tt.PureComponent=U,Tt.StrictMode=r,Tt.Suspense=p,Tt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ce,Tt.act=ae,Tt.cloneElement=function(I,re,Ge){if(I==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+I+".");var ee=E({},I.props),me=I.key,Ce=I.ref,Ee=I._owner;if(re!=null){if(re.ref!==void 0&&(Ce=re.ref,Ee=F.current),re.key!==void 0&&(me=""+re.key),I.type&&I.type.defaultProps)var De=I.type.defaultProps;for(ze in re)V.call(re,ze)&&!N.hasOwnProperty(ze)&&(ee[ze]=re[ze]===void 0&&De!==void 0?De[ze]:re[ze])}var ze=arguments.length-2;if(ze===1)ee.children=Ge;else if(1<ze){De=Array(ze);for(var st=0;st<ze;st++)De[st]=arguments[st+2];ee.children=De}return{$$typeof:s,type:I.type,key:me,ref:Ce,props:ee,_owner:Ee}},Tt.createContext=function(I){return I={$$typeof:c,_currentValue:I,_currentValue2:I,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},I.Provider={$$typeof:u,_context:I},I.Consumer=I},Tt.createElement=W,Tt.createFactory=function(I){var re=W.bind(null,I);return re.type=I,re},Tt.createRef=function(){return{current:null}},Tt.forwardRef=function(I){return{$$typeof:d,render:I}},Tt.isValidElement=C,Tt.lazy=function(I){return{$$typeof:_,_payload:{_status:-1,_result:I},_init:le}},Tt.memo=function(I,re){return{$$typeof:m,type:I,compare:re===void 0?null:re}},Tt.startTransition=function(I){var re=z.transition;z.transition={};try{I()}finally{z.transition=re}},Tt.unstable_act=ae,Tt.useCallback=function(I,re){return fe.current.useCallback(I,re)},Tt.useContext=function(I){return fe.current.useContext(I)},Tt.useDebugValue=function(){},Tt.useDeferredValue=function(I){return fe.current.useDeferredValue(I)},Tt.useEffect=function(I,re){return fe.current.useEffect(I,re)},Tt.useId=function(){return fe.current.useId()},Tt.useImperativeHandle=function(I,re,Ge){return fe.current.useImperativeHandle(I,re,Ge)},Tt.useInsertionEffect=function(I,re){return fe.current.useInsertionEffect(I,re)},Tt.useLayoutEffect=function(I,re){return fe.current.useLayoutEffect(I,re)},Tt.useMemo=function(I,re){return fe.current.useMemo(I,re)},Tt.useReducer=function(I,re,Ge){return fe.current.useReducer(I,re,Ge)},Tt.useRef=function(I){return fe.current.useRef(I)},Tt.useState=function(I){return fe.current.useState(I)},Tt.useSyncExternalStore=function(I,re,Ge){return fe.current.useSyncExternalStore(I,re,Ge)},Tt.useTransition=function(){return fe.current.useTransition()},Tt.version="18.3.1",Tt}var $p;function yd(){return $p||($p=1,Xc.exports=y_()),Xc.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yp;function S_(){if(Yp)return Ma;Yp=1;var s=yd(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function c(d,p,m){var _,v={},x=null,S=null;m!==void 0&&(x=""+m),p.key!==void 0&&(x=""+p.key),p.ref!==void 0&&(S=p.ref);for(_ in p)r.call(p,_)&&!u.hasOwnProperty(_)&&(v[_]=p[_]);if(d&&d.defaultProps)for(_ in p=d.defaultProps,p)v[_]===void 0&&(v[_]=p[_]);return{$$typeof:e,type:d,key:x,ref:S,props:v,_owner:a.current}}return Ma.Fragment=n,Ma.jsx=c,Ma.jsxs=c,Ma}var Kp;function M_(){return Kp||(Kp=1,Wc.exports=S_()),Wc.exports}var ve=M_(),kt=yd();const E_=x_(kt);var bl={},jc={exports:{}},ni={},qc={exports:{}},$c={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zp;function w_(){return Zp||(Zp=1,(function(s){function e(z,ce){var ae=z.length;z.push(ce);e:for(;0<ae;){var I=ae-1>>>1,re=z[I];if(0<a(re,ce))z[I]=ce,z[ae]=re,ae=I;else break e}}function n(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var ce=z[0],ae=z.pop();if(ae!==ce){z[0]=ae;e:for(var I=0,re=z.length,Ge=re>>>1;I<Ge;){var ee=2*(I+1)-1,me=z[ee],Ce=ee+1,Ee=z[Ce];if(0>a(me,ae))Ce<re&&0>a(Ee,me)?(z[I]=Ee,z[Ce]=ae,I=Ce):(z[I]=me,z[ee]=ae,I=ee);else if(Ce<re&&0>a(Ee,ae))z[I]=Ee,z[Ce]=ae,I=Ce;else break e}}return ce}function a(z,ce){var ae=z.sortIndex-ce.sortIndex;return ae!==0?ae:z.id-ce.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;s.unstable_now=function(){return u.now()}}else{var c=Date,d=c.now();s.unstable_now=function(){return c.now()-d}}var p=[],m=[],_=1,v=null,x=3,S=!1,E=!1,T=!1,y=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,U=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function D(z){for(var ce=n(m);ce!==null;){if(ce.callback===null)r(m);else if(ce.startTime<=z)r(m),ce.sortIndex=ce.expirationTime,e(p,ce);else break;ce=n(m)}}function b(z){if(T=!1,D(z),!E)if(n(p)!==null)E=!0,le(V);else{var ce=n(m);ce!==null&&fe(b,ce.startTime-z)}}function V(z,ce){E=!1,T&&(T=!1,g(W),W=-1),S=!0;var ae=x;try{for(D(ce),v=n(p);v!==null&&(!(v.expirationTime>ce)||z&&!B());){var I=v.callback;if(typeof I=="function"){v.callback=null,x=v.priorityLevel;var re=I(v.expirationTime<=ce);ce=s.unstable_now(),typeof re=="function"?v.callback=re:v===n(p)&&r(p),D(ce)}else r(p);v=n(p)}if(v!==null)var Ge=!0;else{var ee=n(m);ee!==null&&fe(b,ee.startTime-ce),Ge=!1}return Ge}finally{v=null,x=ae,S=!1}}var F=!1,N=null,W=-1,R=5,C=-1;function B(){return!(s.unstable_now()-C<R)}function ie(){if(N!==null){var z=s.unstable_now();C=z;var ce=!0;try{ce=N(!0,z)}finally{ce?Q():(F=!1,N=null)}}else F=!1}var Q;if(typeof U=="function")Q=function(){U(ie)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,de=ue.port2;ue.port1.onmessage=ie,Q=function(){de.postMessage(null)}}else Q=function(){y(ie,0)};function le(z){N=z,F||(F=!0,Q())}function fe(z,ce){W=y(function(){z(s.unstable_now())},ce)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(z){z.callback=null},s.unstable_continueExecution=function(){E||S||(E=!0,le(V))},s.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<z?Math.floor(1e3/z):5},s.unstable_getCurrentPriorityLevel=function(){return x},s.unstable_getFirstCallbackNode=function(){return n(p)},s.unstable_next=function(z){switch(x){case 1:case 2:case 3:var ce=3;break;default:ce=x}var ae=x;x=ce;try{return z()}finally{x=ae}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(z,ce){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var ae=x;x=z;try{return ce()}finally{x=ae}},s.unstable_scheduleCallback=function(z,ce,ae){var I=s.unstable_now();switch(typeof ae=="object"&&ae!==null?(ae=ae.delay,ae=typeof ae=="number"&&0<ae?I+ae:I):ae=I,z){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=ae+re,z={id:_++,callback:ce,priorityLevel:z,startTime:ae,expirationTime:re,sortIndex:-1},ae>I?(z.sortIndex=ae,e(m,z),n(p)===null&&z===n(m)&&(T?(g(W),W=-1):T=!0,fe(b,ae-I))):(z.sortIndex=re,e(p,z),E||S||(E=!0,le(V))),z},s.unstable_shouldYield=B,s.unstable_wrapCallback=function(z){var ce=x;return function(){var ae=x;x=ce;try{return z.apply(this,arguments)}finally{x=ae}}}})($c)),$c}var Qp;function T_(){return Qp||(Qp=1,qc.exports=w_()),qc.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jp;function A_(){if(Jp)return ni;Jp=1;var s=yd(),e=T_();function n(t){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+t,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+t+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function u(t,i){c(t,i),c(t+"Capture",i)}function c(t,i){for(a[t]=i,t=0;t<i.length;t++)r.add(i[t])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},v={};function x(t){return p.call(v,t)?!0:p.call(_,t)?!1:m.test(t)?v[t]=!0:(_[t]=!0,!1)}function S(t,i,o,l){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return l?!1:o!==null?!o.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function E(t,i,o,l){if(i===null||typeof i>"u"||S(t,i,o,l))return!0;if(l)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function T(t,i,o,l,f,h,M){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=l,this.attributeNamespace=f,this.mustUseProperty=o,this.propertyName=t,this.type=i,this.sanitizeURL=h,this.removeEmptyString=M}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){y[t]=new T(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var i=t[0];y[i]=new T(i,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){y[t]=new T(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){y[t]=new T(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){y[t]=new T(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){y[t]=new T(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){y[t]=new T(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){y[t]=new T(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){y[t]=new T(t,5,!1,t.toLowerCase(),null,!1,!1)});var g=/[\-:]([a-z])/g;function U(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var i=t.replace(g,U);y[i]=new T(i,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var i=t.replace(g,U);y[i]=new T(i,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var i=t.replace(g,U);y[i]=new T(i,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){y[t]=new T(t,1,!1,t.toLowerCase(),null,!1,!1)}),y.xlinkHref=new T("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){y[t]=new T(t,1,!1,t.toLowerCase(),null,!0,!0)});function D(t,i,o,l){var f=y.hasOwnProperty(i)?y[i]:null;(f!==null?f.type!==0:l||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,o,f,l)&&(o=null),l||f===null?x(i)&&(o===null?t.removeAttribute(i):t.setAttribute(i,""+o)):f.mustUseProperty?t[f.propertyName]=o===null?f.type===3?!1:"":o:(i=f.attributeName,l=f.attributeNamespace,o===null?t.removeAttribute(i):(f=f.type,o=f===3||f===4&&o===!0?"":""+o,l?t.setAttributeNS(l,i,o):t.setAttribute(i,o))))}var b=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,V=Symbol.for("react.element"),F=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),W=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),B=Symbol.for("react.context"),ie=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),ue=Symbol.for("react.suspense_list"),de=Symbol.for("react.memo"),le=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),z=Symbol.iterator;function ce(t){return t===null||typeof t!="object"?null:(t=z&&t[z]||t["@@iterator"],typeof t=="function"?t:null)}var ae=Object.assign,I;function re(t){if(I===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);I=i&&i[1]||""}return`
`+I+t}var Ge=!1;function ee(t,i){if(!t||Ge)return"";Ge=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(ne){var l=ne}Reflect.construct(t,[],i)}else{try{i.call()}catch(ne){l=ne}t.call(i.prototype)}else{try{throw Error()}catch(ne){l=ne}t()}}catch(ne){if(ne&&l&&typeof ne.stack=="string"){for(var f=ne.stack.split(`
`),h=l.stack.split(`
`),M=f.length-1,L=h.length-1;1<=M&&0<=L&&f[M]!==h[L];)L--;for(;1<=M&&0<=L;M--,L--)if(f[M]!==h[L]){if(M!==1||L!==1)do if(M--,L--,0>L||f[M]!==h[L]){var k=`
`+f[M].replace(" at new "," at ");return t.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",t.displayName)),k}while(1<=M&&0<=L);break}}}finally{Ge=!1,Error.prepareStackTrace=o}return(t=t?t.displayName||t.name:"")?re(t):""}function me(t){switch(t.tag){case 5:return re(t.type);case 16:return re("Lazy");case 13:return re("Suspense");case 19:return re("SuspenseList");case 0:case 2:case 15:return t=ee(t.type,!1),t;case 11:return t=ee(t.type.render,!1),t;case 1:return t=ee(t.type,!0),t;default:return""}}function Ce(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case N:return"Fragment";case F:return"Portal";case R:return"Profiler";case W:return"StrictMode";case Q:return"Suspense";case ue:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case B:return(t.displayName||"Context")+".Consumer";case C:return(t._context.displayName||"Context")+".Provider";case ie:var i=t.render;return t=t.displayName,t||(t=i.displayName||i.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case de:return i=t.displayName||null,i!==null?i:Ce(t.type)||"Memo";case le:i=t._payload,t=t._init;try{return Ce(t(i))}catch{}}return null}function Ee(t){var i=t.type;switch(t.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=i.render,t=t.displayName||t.name||"",i.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ce(i);case 8:return i===W?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function De(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function ze(t){var i=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function st(t){var i=ze(t)?"checked":"value",o=Object.getOwnPropertyDescriptor(t.constructor.prototype,i),l=""+t[i];if(!t.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var f=o.get,h=o.set;return Object.defineProperty(t,i,{configurable:!0,get:function(){return f.call(this)},set:function(M){l=""+M,h.call(this,M)}}),Object.defineProperty(t,i,{enumerable:o.enumerable}),{getValue:function(){return l},setValue:function(M){l=""+M},stopTracking:function(){t._valueTracker=null,delete t[i]}}}}function Ot(t){t._valueTracker||(t._valueTracker=st(t))}function St(t){if(!t)return!1;var i=t._valueTracker;if(!i)return!0;var o=i.getValue(),l="";return t&&(l=ze(t)?t.checked?"true":"false":t.value),t=l,t!==o?(i.setValue(t),!0):!1}function Se(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function O(t,i){var o=i.checked;return ae({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??t._wrapperState.initialChecked})}function Rt(t,i){var o=i.defaultValue==null?"":i.defaultValue,l=i.checked!=null?i.checked:i.defaultChecked;o=De(i.value!=null?i.value:o),t._wrapperState={initialChecked:l,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function nt(t,i){i=i.checked,i!=null&&D(t,"checked",i,!1)}function ot(t,i){nt(t,i);var o=De(i.value),l=i.type;if(o!=null)l==="number"?(o===0&&t.value===""||t.value!=o)&&(t.value=""+o):t.value!==""+o&&(t.value=""+o);else if(l==="submit"||l==="reset"){t.removeAttribute("value");return}i.hasOwnProperty("value")?It(t,i.type,o):i.hasOwnProperty("defaultValue")&&It(t,i.type,De(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(t.defaultChecked=!!i.defaultChecked)}function Je(t,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var l=i.type;if(!(l!=="submit"&&l!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+t._wrapperState.initialValue,o||i===t.value||(t.value=i),t.defaultValue=i}o=t.name,o!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,o!==""&&(t.name=o)}function It(t,i,o){(i!=="number"||Se(t.ownerDocument)!==t)&&(o==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+o&&(t.defaultValue=""+o))}var qe=Array.isArray;function P(t,i,o,l){if(t=t.options,i){i={};for(var f=0;f<o.length;f++)i["$"+o[f]]=!0;for(o=0;o<t.length;o++)f=i.hasOwnProperty("$"+t[o].value),t[o].selected!==f&&(t[o].selected=f),f&&l&&(t[o].defaultSelected=!0)}else{for(o=""+De(o),i=null,f=0;f<t.length;f++){if(t[f].value===o){t[f].selected=!0,l&&(t[f].defaultSelected=!0);return}i!==null||t[f].disabled||(i=t[f])}i!==null&&(i.selected=!0)}}function w(t,i){if(i.dangerouslySetInnerHTML!=null)throw Error(n(91));return ae({},i,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function J(t,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(n(92));if(qe(o)){if(1<o.length)throw Error(n(93));o=o[0]}i=o}i==null&&(i=""),o=i}t._wrapperState={initialValue:De(o)}}function ge(t,i){var o=De(i.value),l=De(i.defaultValue);o!=null&&(o=""+o,o!==t.value&&(t.value=o),i.defaultValue==null&&t.defaultValue!==o&&(t.defaultValue=o)),l!=null&&(t.defaultValue=""+l)}function xe(t){var i=t.textContent;i===t._wrapperState.initialValue&&i!==""&&i!==null&&(t.value=i)}function he(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ze(t,i){return t==null||t==="http://www.w3.org/1999/xhtml"?he(i):t==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ue,He=(function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,l,f){MSApp.execUnsafeLocalFunction(function(){return t(i,o,l,f)})}:t})(function(t,i){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=i;else{for(Ue=Ue||document.createElement("div"),Ue.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Ue.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;i.firstChild;)t.appendChild(i.firstChild)}});function mt(t,i){if(i){var o=t.firstChild;if(o&&o===t.lastChild&&o.nodeType===3){o.nodeValue=i;return}}t.textContent=i}var Te={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},je=["Webkit","ms","Moz","O"];Object.keys(Te).forEach(function(t){je.forEach(function(i){i=i+t.charAt(0).toUpperCase()+t.substring(1),Te[i]=Te[t]})});function it(t,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||Te.hasOwnProperty(t)&&Te[t]?(""+i).trim():i+"px"}function ft(t,i){t=t.style;for(var o in i)if(i.hasOwnProperty(o)){var l=o.indexOf("--")===0,f=it(o,i[o],l);o==="float"&&(o="cssFloat"),l?t.setProperty(o,f):t[o]=f}}var We=ae({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function gt(t,i){if(i){if(We[t]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(n(137,t));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(n(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(n(61))}if(i.style!=null&&typeof i.style!="object")throw Error(n(62))}}function dt(t,i){if(t.indexOf("-")===-1)return typeof i.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Dt=null;function X(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Le=null,oe=null,pe=null;function Oe(t){if(t=aa(t)){if(typeof Le!="function")throw Error(n(280));var i=t.stateNode;i&&(i=Wa(i),Le(t.stateNode,t.type,i))}}function Ne(t){oe?pe?pe.push(t):pe=[t]:oe=t}function ht(){if(oe){var t=oe,i=pe;if(pe=oe=null,Oe(t),i)for(t=0;t<i.length;t++)Oe(i[t])}}function Bt(t,i){return t(i)}function Kt(){}var Ct=!1;function Rn(t,i,o){if(Ct)return t(i,o);Ct=!0;try{return Bt(t,i,o)}finally{Ct=!1,(oe!==null||pe!==null)&&(Kt(),ht())}}function bn(t,i){var o=t.stateNode;if(o===null)return null;var l=Wa(o);if(l===null)return null;o=l[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break e;default:t=!1}if(t)return null;if(o&&typeof o!="function")throw Error(n(231,i,typeof o));return o}var Fr=!1;if(d)try{var Wi={};Object.defineProperty(Wi,"passive",{get:function(){Fr=!0}}),window.addEventListener("test",Wi,Wi),window.removeEventListener("test",Wi,Wi)}catch{Fr=!1}function Ri(t,i,o,l,f,h,M,L,k){var ne=Array.prototype.slice.call(arguments,3);try{i.apply(o,ne)}catch(Me){this.onError(Me)}}var bi=!1,Xi=null,ji=!1,Pi=null,fs={onError:function(t){bi=!0,Xi=t}};function lr(t,i,o,l,f,h,M,L,k){bi=!1,Xi=null,Ri.apply(fs,arguments)}function Or(t,i,o,l,f,h,M,L,k){if(lr.apply(this,arguments),bi){if(bi){var ne=Xi;bi=!1,Xi=null}else throw Error(n(198));ji||(ji=!0,Pi=ne)}}function $n(t){var i=t,o=t;if(t.alternate)for(;i.return;)i=i.return;else{t=i;do i=t,(i.flags&4098)!==0&&(o=i.return),t=i.return;while(t)}return i.tag===3?o:null}function qi(t){if(t.tag===13){var i=t.memoizedState;if(i===null&&(t=t.alternate,t!==null&&(i=t.memoizedState)),i!==null)return i.dehydrated}return null}function $i(t){if($n(t)!==t)throw Error(n(188))}function Yi(t){var i=t.alternate;if(!i){if(i=$n(t),i===null)throw Error(n(188));return i!==t?null:t}for(var o=t,l=i;;){var f=o.return;if(f===null)break;var h=f.alternate;if(h===null){if(l=f.return,l!==null){o=l;continue}break}if(f.child===h.child){for(h=f.child;h;){if(h===o)return $i(f),t;if(h===l)return $i(f),i;h=h.sibling}throw Error(n(188))}if(o.return!==l.return)o=f,l=h;else{for(var M=!1,L=f.child;L;){if(L===o){M=!0,o=f,l=h;break}if(L===l){M=!0,l=f,o=h;break}L=L.sibling}if(!M){for(L=h.child;L;){if(L===o){M=!0,o=h,l=f;break}if(L===l){M=!0,l=h,o=f;break}L=L.sibling}if(!M)throw Error(n(189))}}if(o.alternate!==l)throw Error(n(190))}if(o.tag!==3)throw Error(n(188));return o.stateNode.current===o?t:i}function ds(t){return t=Yi(t),t!==null?hs(t):null}function hs(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var i=hs(t);if(i!==null)return i;t=t.sibling}return null}var ps=e.unstable_scheduleCallback,A=e.unstable_cancelCallback,q=e.unstable_shouldYield,te=e.unstable_requestPaint,Y=e.unstable_now,$=e.unstable_getCurrentPriorityLevel,we=e.unstable_ImmediatePriority,Ie=e.unstable_UserBlockingPriority,ke=e.unstable_NormalPriority,Xe=e.unstable_LowPriority,ct=e.unstable_IdlePriority,at=null,$e=null;function H(t){if($e&&typeof $e.onCommitFiberRoot=="function")try{$e.onCommitFiberRoot(at,t,void 0,(t.current.flags&128)===128)}catch{}}var se=Math.clz32?Math.clz32:Pe,Be=Math.log,be=Math.LN2;function Pe(t){return t>>>=0,t===0?32:31-(Be(t)/be|0)|0}var _e=64,rt=4194304;function et(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Et(t,i){var o=t.pendingLanes;if(o===0)return 0;var l=0,f=t.suspendedLanes,h=t.pingedLanes,M=o&268435455;if(M!==0){var L=M&~f;L!==0?l=et(L):(h&=M,h!==0&&(l=et(h)))}else M=o&~f,M!==0?l=et(M):h!==0&&(l=et(h));if(l===0)return 0;if(i!==0&&i!==l&&(i&f)===0&&(f=l&-l,h=i&-i,f>=h||f===16&&(h&4194240)!==0))return i;if((l&4)!==0&&(l|=o&16),i=t.entangledLanes,i!==0)for(t=t.entanglements,i&=l;0<i;)o=31-se(i),f=1<<o,l|=t[o],i&=~f;return l}function Pn(t,i){switch(t){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vt(t,i){for(var o=t.suspendedLanes,l=t.pingedLanes,f=t.expirationTimes,h=t.pendingLanes;0<h;){var M=31-se(h),L=1<<M,k=f[M];k===-1?((L&o)===0||(L&l)!==0)&&(f[M]=Pn(L,i)):k<=i&&(t.expiredLanes|=L),h&=~L}}function un(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function wt(){var t=_e;return _e<<=1,(_e&4194240)===0&&(_e=64),t}function bt(t){for(var i=[],o=0;31>o;o++)i.push(t);return i}function At(t,i,o){t.pendingLanes|=i,i!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,i=31-se(i),t[i]=o}function jt(t,i){var o=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;var l=t.eventTimes;for(t=t.expirationTimes;0<o;){var f=31-se(o),h=1<<f;i[f]=0,l[f]=-1,t[f]=-1,o&=~h}}function Zt(t,i){var o=t.entangledLanes|=i;for(t=t.entanglements;o;){var l=31-se(o),f=1<<l;f&i|t[l]&i&&(t[l]|=i),o&=~f}}var Mt=0;function Gt(t){return t&=-t,1<t?4<t?(t&268435455)!==0?16:536870912:4:1}var yn,zt,Nn,cn,Fn,Yn=!1,ur=[],ai=null,li=null,Kn=null,cr=new Map,mn=new Map,ui=[],Xs="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ms(t,i){switch(t){case"focusin":case"focusout":ai=null;break;case"dragenter":case"dragleave":li=null;break;case"mouseover":case"mouseout":Kn=null;break;case"pointerover":case"pointerout":cr.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":mn.delete(i.pointerId)}}function mi(t,i,o,l,f,h){return t===null||t.nativeEvent!==h?(t={blockedOn:i,domEventName:o,eventSystemFlags:l,nativeEvent:h,targetContainers:[f]},i!==null&&(i=aa(i),i!==null&&zt(i)),t):(t.eventSystemFlags|=l,i=t.targetContainers,f!==null&&i.indexOf(f)===-1&&i.push(f),t)}function gi(t,i,o,l,f){switch(i){case"focusin":return ai=mi(ai,t,i,o,l,f),!0;case"dragenter":return li=mi(li,t,i,o,l,f),!0;case"mouseover":return Kn=mi(Kn,t,i,o,l,f),!0;case"pointerover":var h=f.pointerId;return cr.set(h,mi(cr.get(h)||null,t,i,o,l,f)),!0;case"gotpointercapture":return h=f.pointerId,mn.set(h,mi(mn.get(h)||null,t,i,o,l,f)),!0}return!1}function Wt(t){var i=vs(t.target);if(i!==null){var o=$n(i);if(o!==null){if(i=o.tag,i===13){if(i=qi(o),i!==null){t.blockedOn=i,Fn(t.priority,function(){Nn(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){t.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}t.blockedOn=null}function xt(t){if(t.blockedOn!==null)return!1;for(var i=t.targetContainers;0<i.length;){var o=Zi(t.domEventName,t.eventSystemFlags,i[0],t.nativeEvent);if(o===null){o=t.nativeEvent;var l=new o.constructor(o.type,o);Dt=l,o.target.dispatchEvent(l),Dt=null}else return i=aa(o),i!==null&&zt(i),t.blockedOn=o,!1;i.shift()}return!0}function qt(t,i,o){xt(t)&&o.delete(i)}function Qt(){Yn=!1,ai!==null&&xt(ai)&&(ai=null),li!==null&&xt(li)&&(li=null),Kn!==null&&xt(Kn)&&(Kn=null),cr.forEach(qt),mn.forEach(qt)}function tn(t,i){t.blockedOn===i&&(t.blockedOn=null,Yn||(Yn=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Qt)))}function Dn(t){function i(f){return tn(f,t)}if(0<ur.length){tn(ur[0],t);for(var o=1;o<ur.length;o++){var l=ur[o];l.blockedOn===t&&(l.blockedOn=null)}}for(ai!==null&&tn(ai,t),li!==null&&tn(li,t),Kn!==null&&tn(Kn,t),cr.forEach(i),mn.forEach(i),o=0;o<ui.length;o++)l=ui[o],l.blockedOn===t&&(l.blockedOn=null);for(;0<ui.length&&(o=ui[0],o.blockedOn===null);)Wt(o),o.blockedOn===null&&ui.shift()}var Ki=b.ReactCurrentBatchConfig,fr=!0;function js(t,i,o,l){var f=Mt,h=Ki.transition;Ki.transition=null;try{Mt=1,gs(t,i,o,l)}finally{Mt=f,Ki.transition=h}}function qs(t,i,o,l){var f=Mt,h=Ki.transition;Ki.transition=null;try{Mt=4,gs(t,i,o,l)}finally{Mt=f,Ki.transition=h}}function gs(t,i,o,l){if(fr){var f=Zi(t,i,o,l);if(f===null)Iu(t,i,l,Di,o),ms(t,l);else if(gi(f,t,i,o,l))l.stopPropagation();else if(ms(t,l),i&4&&-1<Xs.indexOf(t)){for(;f!==null;){var h=aa(f);if(h!==null&&yn(h),h=Zi(t,i,o,l),h===null&&Iu(t,i,l,Di,o),h===f)break;f=h}f!==null&&l.stopPropagation()}else Iu(t,i,l,null,o)}}var Di=null;function Zi(t,i,o,l){if(Di=null,t=X(l),t=vs(t),t!==null)if(i=$n(t),i===null)t=null;else if(o=i.tag,o===13){if(t=qi(i),t!==null)return t;t=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;t=null}else i!==t&&(t=null);return Di=t,null}function Br(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch($()){case we:return 1;case Ie:return 4;case ke:case Xe:return 16;case ct:return 536870912;default:return 16}default:return 16}}var Gn=null,$s=null,Qi=null;function Ko(){if(Qi)return Qi;var t,i=$s,o=i.length,l,f="value"in Gn?Gn.value:Gn.textContent,h=f.length;for(t=0;t<o&&i[t]===f[t];t++);var M=o-t;for(l=1;l<=M&&i[o-l]===f[h-l];l++);return Qi=f.slice(t,1<l?1-l:void 0)}function Ji(t){var i=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&i===13&&(t=13)):t=i,t===10&&(t=13),32<=t||t===13?t:0}function er(){return!0}function _s(){return!1}function Sn(t){function i(o,l,f,h,M){this._reactName=o,this._targetInst=f,this.type=l,this.nativeEvent=h,this.target=M,this.currentTarget=null;for(var L in t)t.hasOwnProperty(L)&&(o=t[L],this[L]=o?o(h):h[L]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?er:_s,this.isPropagationStopped=_s,this}return ae(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=er)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=er)},persist:function(){},isPersistent:er}),i}var dr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ys=Sn(dr),hr=ae({},dr,{view:0,detail:0}),Mn=Sn(hr),yu,Su,Zo,Fa=ae({},hr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Eu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Zo&&(Zo&&t.type==="mousemove"?(yu=t.screenX-Zo.screenX,Su=t.screenY-Zo.screenY):Su=yu=0,Zo=t),yu)},movementY:function(t){return"movementY"in t?t.movementY:Su}}),Fd=Sn(Fa),qg=ae({},Fa,{dataTransfer:0}),$g=Sn(qg),Yg=ae({},hr,{relatedTarget:0}),Mu=Sn(Yg),Kg=ae({},dr,{animationName:0,elapsedTime:0,pseudoElement:0}),Zg=Sn(Kg),Qg=ae({},dr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Jg=Sn(Qg),e0=ae({},dr,{data:0}),Od=Sn(e0),t0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},n0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},i0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function r0(t){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(t):(t=i0[t])?!!i[t]:!1}function Eu(){return r0}var s0=ae({},hr,{key:function(t){if(t.key){var i=t0[t.key]||t.key;if(i!=="Unidentified")return i}return t.type==="keypress"?(t=Ji(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?n0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Eu,charCode:function(t){return t.type==="keypress"?Ji(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ji(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),o0=Sn(s0),a0=ae({},Fa,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Bd=Sn(a0),l0=ae({},hr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Eu}),u0=Sn(l0),c0=ae({},dr,{propertyName:0,elapsedTime:0,pseudoElement:0}),f0=Sn(c0),d0=ae({},Fa,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),h0=Sn(d0),p0=[9,13,27,32],wu=d&&"CompositionEvent"in window,Qo=null;d&&"documentMode"in document&&(Qo=document.documentMode);var m0=d&&"TextEvent"in window&&!Qo,kd=d&&(!wu||Qo&&8<Qo&&11>=Qo),zd=" ",Hd=!1;function Vd(t,i){switch(t){case"keyup":return p0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Gd(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ks=!1;function g0(t,i){switch(t){case"compositionend":return Gd(i);case"keypress":return i.which!==32?null:(Hd=!0,zd);case"textInput":return t=i.data,t===zd&&Hd?null:t;default:return null}}function _0(t,i){if(Ks)return t==="compositionend"||!wu&&Vd(t,i)?(t=Ko(),Qi=$s=Gn=null,Ks=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return kd&&i.locale!=="ko"?null:i.data;default:return null}}var v0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wd(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i==="input"?!!v0[t.type]:i==="textarea"}function Xd(t,i,o,l){Ne(l),i=Ha(i,"onChange"),0<i.length&&(o=new Ys("onChange","change",null,o,l),t.push({event:o,listeners:i}))}var Jo=null,ea=null;function x0(t){uh(t,0)}function Oa(t){var i=to(t);if(St(i))return t}function y0(t,i){if(t==="change")return i}var jd=!1;if(d){var Tu;if(d){var Au="oninput"in document;if(!Au){var qd=document.createElement("div");qd.setAttribute("oninput","return;"),Au=typeof qd.oninput=="function"}Tu=Au}else Tu=!1;jd=Tu&&(!document.documentMode||9<document.documentMode)}function $d(){Jo&&(Jo.detachEvent("onpropertychange",Yd),ea=Jo=null)}function Yd(t){if(t.propertyName==="value"&&Oa(ea)){var i=[];Xd(i,ea,t,X(t)),Rn(x0,i)}}function S0(t,i,o){t==="focusin"?($d(),Jo=i,ea=o,Jo.attachEvent("onpropertychange",Yd)):t==="focusout"&&$d()}function M0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Oa(ea)}function E0(t,i){if(t==="click")return Oa(i)}function w0(t,i){if(t==="input"||t==="change")return Oa(i)}function T0(t,i){return t===i&&(t!==0||1/t===1/i)||t!==t&&i!==i}var Li=typeof Object.is=="function"?Object.is:T0;function ta(t,i){if(Li(t,i))return!0;if(typeof t!="object"||t===null||typeof i!="object"||i===null)return!1;var o=Object.keys(t),l=Object.keys(i);if(o.length!==l.length)return!1;for(l=0;l<o.length;l++){var f=o[l];if(!p.call(i,f)||!Li(t[f],i[f]))return!1}return!0}function Kd(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Zd(t,i){var o=Kd(t);t=0;for(var l;o;){if(o.nodeType===3){if(l=t+o.textContent.length,t<=i&&l>=i)return{node:o,offset:i-t};t=l}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=Kd(o)}}function Qd(t,i){return t&&i?t===i?!0:t&&t.nodeType===3?!1:i&&i.nodeType===3?Qd(t,i.parentNode):"contains"in t?t.contains(i):t.compareDocumentPosition?!!(t.compareDocumentPosition(i)&16):!1:!1}function Jd(){for(var t=window,i=Se();i instanceof t.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)t=i.contentWindow;else break;i=Se(t.document)}return i}function Cu(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i&&(i==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||i==="textarea"||t.contentEditable==="true")}function A0(t){var i=Jd(),o=t.focusedElem,l=t.selectionRange;if(i!==o&&o&&o.ownerDocument&&Qd(o.ownerDocument.documentElement,o)){if(l!==null&&Cu(o)){if(i=l.start,t=l.end,t===void 0&&(t=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(t,o.value.length);else if(t=(i=o.ownerDocument||document)&&i.defaultView||window,t.getSelection){t=t.getSelection();var f=o.textContent.length,h=Math.min(l.start,f);l=l.end===void 0?h:Math.min(l.end,f),!t.extend&&h>l&&(f=l,l=h,h=f),f=Zd(o,h);var M=Zd(o,l);f&&M&&(t.rangeCount!==1||t.anchorNode!==f.node||t.anchorOffset!==f.offset||t.focusNode!==M.node||t.focusOffset!==M.offset)&&(i=i.createRange(),i.setStart(f.node,f.offset),t.removeAllRanges(),h>l?(t.addRange(i),t.extend(M.node,M.offset)):(i.setEnd(M.node,M.offset),t.addRange(i)))}}for(i=[],t=o;t=t.parentNode;)t.nodeType===1&&i.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)t=i[o],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var C0=d&&"documentMode"in document&&11>=document.documentMode,Zs=null,Ru=null,na=null,bu=!1;function eh(t,i,o){var l=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;bu||Zs==null||Zs!==Se(l)||(l=Zs,"selectionStart"in l&&Cu(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),na&&ta(na,l)||(na=l,l=Ha(Ru,"onSelect"),0<l.length&&(i=new Ys("onSelect","select",null,i,o),t.push({event:i,listeners:l}),i.target=Zs)))}function Ba(t,i){var o={};return o[t.toLowerCase()]=i.toLowerCase(),o["Webkit"+t]="webkit"+i,o["Moz"+t]="moz"+i,o}var Qs={animationend:Ba("Animation","AnimationEnd"),animationiteration:Ba("Animation","AnimationIteration"),animationstart:Ba("Animation","AnimationStart"),transitionend:Ba("Transition","TransitionEnd")},Pu={},th={};d&&(th=document.createElement("div").style,"AnimationEvent"in window||(delete Qs.animationend.animation,delete Qs.animationiteration.animation,delete Qs.animationstart.animation),"TransitionEvent"in window||delete Qs.transitionend.transition);function ka(t){if(Pu[t])return Pu[t];if(!Qs[t])return t;var i=Qs[t],o;for(o in i)if(i.hasOwnProperty(o)&&o in th)return Pu[t]=i[o];return t}var nh=ka("animationend"),ih=ka("animationiteration"),rh=ka("animationstart"),sh=ka("transitionend"),oh=new Map,ah="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function kr(t,i){oh.set(t,i),u(i,[t])}for(var Du=0;Du<ah.length;Du++){var Lu=ah[Du],R0=Lu.toLowerCase(),b0=Lu[0].toUpperCase()+Lu.slice(1);kr(R0,"on"+b0)}kr(nh,"onAnimationEnd"),kr(ih,"onAnimationIteration"),kr(rh,"onAnimationStart"),kr("dblclick","onDoubleClick"),kr("focusin","onFocus"),kr("focusout","onBlur"),kr(sh,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ia="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),P0=new Set("cancel close invalid load scroll toggle".split(" ").concat(ia));function lh(t,i,o){var l=t.type||"unknown-event";t.currentTarget=o,Or(l,i,void 0,t),t.currentTarget=null}function uh(t,i){i=(i&4)!==0;for(var o=0;o<t.length;o++){var l=t[o],f=l.event;l=l.listeners;e:{var h=void 0;if(i)for(var M=l.length-1;0<=M;M--){var L=l[M],k=L.instance,ne=L.currentTarget;if(L=L.listener,k!==h&&f.isPropagationStopped())break e;lh(f,L,ne),h=k}else for(M=0;M<l.length;M++){if(L=l[M],k=L.instance,ne=L.currentTarget,L=L.listener,k!==h&&f.isPropagationStopped())break e;lh(f,L,ne),h=k}}}if(ji)throw t=Pi,ji=!1,Pi=null,t}function $t(t,i){var o=i[zu];o===void 0&&(o=i[zu]=new Set);var l=t+"__bubble";o.has(l)||(ch(i,t,2,!1),o.add(l))}function Uu(t,i,o){var l=0;i&&(l|=4),ch(o,t,l,i)}var za="_reactListening"+Math.random().toString(36).slice(2);function ra(t){if(!t[za]){t[za]=!0,r.forEach(function(o){o!=="selectionchange"&&(P0.has(o)||Uu(o,!1,t),Uu(o,!0,t))});var i=t.nodeType===9?t:t.ownerDocument;i===null||i[za]||(i[za]=!0,Uu("selectionchange",!1,i))}}function ch(t,i,o,l){switch(Br(i)){case 1:var f=js;break;case 4:f=qs;break;default:f=gs}o=f.bind(null,i,o,t),f=void 0,!Fr||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(f=!0),l?f!==void 0?t.addEventListener(i,o,{capture:!0,passive:f}):t.addEventListener(i,o,!0):f!==void 0?t.addEventListener(i,o,{passive:f}):t.addEventListener(i,o,!1)}function Iu(t,i,o,l,f){var h=l;if((i&1)===0&&(i&2)===0&&l!==null)e:for(;;){if(l===null)return;var M=l.tag;if(M===3||M===4){var L=l.stateNode.containerInfo;if(L===f||L.nodeType===8&&L.parentNode===f)break;if(M===4)for(M=l.return;M!==null;){var k=M.tag;if((k===3||k===4)&&(k=M.stateNode.containerInfo,k===f||k.nodeType===8&&k.parentNode===f))return;M=M.return}for(;L!==null;){if(M=vs(L),M===null)return;if(k=M.tag,k===5||k===6){l=h=M;continue e}L=L.parentNode}}l=l.return}Rn(function(){var ne=h,Me=X(o),Ae=[];e:{var ye=oh.get(t);if(ye!==void 0){var Ve=Ys,Ke=t;switch(t){case"keypress":if(Ji(o)===0)break e;case"keydown":case"keyup":Ve=o0;break;case"focusin":Ke="focus",Ve=Mu;break;case"focusout":Ke="blur",Ve=Mu;break;case"beforeblur":case"afterblur":Ve=Mu;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Ve=Fd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Ve=$g;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Ve=u0;break;case nh:case ih:case rh:Ve=Zg;break;case sh:Ve=f0;break;case"scroll":Ve=Mn;break;case"wheel":Ve=h0;break;case"copy":case"cut":case"paste":Ve=Jg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Ve=Bd}var Qe=(i&4)!==0,fn=!Qe&&t==="scroll",K=Qe?ye!==null?ye+"Capture":null:ye;Qe=[];for(var G=ne,Z;G!==null;){Z=G;var Re=Z.stateNode;if(Z.tag===5&&Re!==null&&(Z=Re,K!==null&&(Re=bn(G,K),Re!=null&&Qe.push(sa(G,Re,Z)))),fn)break;G=G.return}0<Qe.length&&(ye=new Ve(ye,Ke,null,o,Me),Ae.push({event:ye,listeners:Qe}))}}if((i&7)===0){e:{if(ye=t==="mouseover"||t==="pointerover",Ve=t==="mouseout"||t==="pointerout",ye&&o!==Dt&&(Ke=o.relatedTarget||o.fromElement)&&(vs(Ke)||Ke[pr]))break e;if((Ve||ye)&&(ye=Me.window===Me?Me:(ye=Me.ownerDocument)?ye.defaultView||ye.parentWindow:window,Ve?(Ke=o.relatedTarget||o.toElement,Ve=ne,Ke=Ke?vs(Ke):null,Ke!==null&&(fn=$n(Ke),Ke!==fn||Ke.tag!==5&&Ke.tag!==6)&&(Ke=null)):(Ve=null,Ke=ne),Ve!==Ke)){if(Qe=Fd,Re="onMouseLeave",K="onMouseEnter",G="mouse",(t==="pointerout"||t==="pointerover")&&(Qe=Bd,Re="onPointerLeave",K="onPointerEnter",G="pointer"),fn=Ve==null?ye:to(Ve),Z=Ke==null?ye:to(Ke),ye=new Qe(Re,G+"leave",Ve,o,Me),ye.target=fn,ye.relatedTarget=Z,Re=null,vs(Me)===ne&&(Qe=new Qe(K,G+"enter",Ke,o,Me),Qe.target=Z,Qe.relatedTarget=fn,Re=Qe),fn=Re,Ve&&Ke)t:{for(Qe=Ve,K=Ke,G=0,Z=Qe;Z;Z=Js(Z))G++;for(Z=0,Re=K;Re;Re=Js(Re))Z++;for(;0<G-Z;)Qe=Js(Qe),G--;for(;0<Z-G;)K=Js(K),Z--;for(;G--;){if(Qe===K||K!==null&&Qe===K.alternate)break t;Qe=Js(Qe),K=Js(K)}Qe=null}else Qe=null;Ve!==null&&fh(Ae,ye,Ve,Qe,!1),Ke!==null&&fn!==null&&fh(Ae,fn,Ke,Qe,!0)}}e:{if(ye=ne?to(ne):window,Ve=ye.nodeName&&ye.nodeName.toLowerCase(),Ve==="select"||Ve==="input"&&ye.type==="file")var tt=y0;else if(Wd(ye))if(jd)tt=w0;else{tt=M0;var lt=S0}else(Ve=ye.nodeName)&&Ve.toLowerCase()==="input"&&(ye.type==="checkbox"||ye.type==="radio")&&(tt=E0);if(tt&&(tt=tt(t,ne))){Xd(Ae,tt,o,Me);break e}lt&&lt(t,ye,ne),t==="focusout"&&(lt=ye._wrapperState)&&lt.controlled&&ye.type==="number"&&It(ye,"number",ye.value)}switch(lt=ne?to(ne):window,t){case"focusin":(Wd(lt)||lt.contentEditable==="true")&&(Zs=lt,Ru=ne,na=null);break;case"focusout":na=Ru=Zs=null;break;case"mousedown":bu=!0;break;case"contextmenu":case"mouseup":case"dragend":bu=!1,eh(Ae,o,Me);break;case"selectionchange":if(C0)break;case"keydown":case"keyup":eh(Ae,o,Me)}var ut;if(wu)e:{switch(t){case"compositionstart":var pt="onCompositionStart";break e;case"compositionend":pt="onCompositionEnd";break e;case"compositionupdate":pt="onCompositionUpdate";break e}pt=void 0}else Ks?Vd(t,o)&&(pt="onCompositionEnd"):t==="keydown"&&o.keyCode===229&&(pt="onCompositionStart");pt&&(kd&&o.locale!=="ko"&&(Ks||pt!=="onCompositionStart"?pt==="onCompositionEnd"&&Ks&&(ut=Ko()):(Gn=Me,$s="value"in Gn?Gn.value:Gn.textContent,Ks=!0)),lt=Ha(ne,pt),0<lt.length&&(pt=new Od(pt,t,null,o,Me),Ae.push({event:pt,listeners:lt}),ut?pt.data=ut:(ut=Gd(o),ut!==null&&(pt.data=ut)))),(ut=m0?g0(t,o):_0(t,o))&&(ne=Ha(ne,"onBeforeInput"),0<ne.length&&(Me=new Od("onBeforeInput","beforeinput",null,o,Me),Ae.push({event:Me,listeners:ne}),Me.data=ut))}uh(Ae,i)})}function sa(t,i,o){return{instance:t,listener:i,currentTarget:o}}function Ha(t,i){for(var o=i+"Capture",l=[];t!==null;){var f=t,h=f.stateNode;f.tag===5&&h!==null&&(f=h,h=bn(t,o),h!=null&&l.unshift(sa(t,h,f)),h=bn(t,i),h!=null&&l.push(sa(t,h,f))),t=t.return}return l}function Js(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function fh(t,i,o,l,f){for(var h=i._reactName,M=[];o!==null&&o!==l;){var L=o,k=L.alternate,ne=L.stateNode;if(k!==null&&k===l)break;L.tag===5&&ne!==null&&(L=ne,f?(k=bn(o,h),k!=null&&M.unshift(sa(o,k,L))):f||(k=bn(o,h),k!=null&&M.push(sa(o,k,L)))),o=o.return}M.length!==0&&t.push({event:i,listeners:M})}var D0=/\r\n?/g,L0=/\u0000|\uFFFD/g;function dh(t){return(typeof t=="string"?t:""+t).replace(D0,`
`).replace(L0,"")}function Va(t,i,o){if(i=dh(i),dh(t)!==i&&o)throw Error(n(425))}function Ga(){}var Nu=null,Fu=null;function Ou(t,i){return t==="textarea"||t==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Bu=typeof setTimeout=="function"?setTimeout:void 0,U0=typeof clearTimeout=="function"?clearTimeout:void 0,hh=typeof Promise=="function"?Promise:void 0,I0=typeof queueMicrotask=="function"?queueMicrotask:typeof hh<"u"?function(t){return hh.resolve(null).then(t).catch(N0)}:Bu;function N0(t){setTimeout(function(){throw t})}function ku(t,i){var o=i,l=0;do{var f=o.nextSibling;if(t.removeChild(o),f&&f.nodeType===8)if(o=f.data,o==="/$"){if(l===0){t.removeChild(f),Dn(i);return}l--}else o!=="$"&&o!=="$?"&&o!=="$!"||l++;o=f}while(o);Dn(i)}function zr(t){for(;t!=null;t=t.nextSibling){var i=t.nodeType;if(i===1||i===3)break;if(i===8){if(i=t.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return t}function ph(t){t=t.previousSibling;for(var i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return t;i--}else o==="/$"&&i++}t=t.previousSibling}return null}var eo=Math.random().toString(36).slice(2),tr="__reactFiber$"+eo,oa="__reactProps$"+eo,pr="__reactContainer$"+eo,zu="__reactEvents$"+eo,F0="__reactListeners$"+eo,O0="__reactHandles$"+eo;function vs(t){var i=t[tr];if(i)return i;for(var o=t.parentNode;o;){if(i=o[pr]||o[tr]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(t=ph(t);t!==null;){if(o=t[tr])return o;t=ph(t)}return i}t=o,o=t.parentNode}return null}function aa(t){return t=t[tr]||t[pr],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function to(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(n(33))}function Wa(t){return t[oa]||null}var Hu=[],no=-1;function Hr(t){return{current:t}}function Yt(t){0>no||(t.current=Hu[no],Hu[no]=null,no--)}function Xt(t,i){no++,Hu[no]=t.current,t.current=i}var Vr={},On=Hr(Vr),Zn=Hr(!1),xs=Vr;function io(t,i){var o=t.type.contextTypes;if(!o)return Vr;var l=t.stateNode;if(l&&l.__reactInternalMemoizedUnmaskedChildContext===i)return l.__reactInternalMemoizedMaskedChildContext;var f={},h;for(h in o)f[h]=i[h];return l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=f),f}function Qn(t){return t=t.childContextTypes,t!=null}function Xa(){Yt(Zn),Yt(On)}function mh(t,i,o){if(On.current!==Vr)throw Error(n(168));Xt(On,i),Xt(Zn,o)}function gh(t,i,o){var l=t.stateNode;if(i=i.childContextTypes,typeof l.getChildContext!="function")return o;l=l.getChildContext();for(var f in l)if(!(f in i))throw Error(n(108,Ee(t)||"Unknown",f));return ae({},o,l)}function ja(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Vr,xs=On.current,Xt(On,t),Xt(Zn,Zn.current),!0}function _h(t,i,o){var l=t.stateNode;if(!l)throw Error(n(169));o?(t=gh(t,i,xs),l.__reactInternalMemoizedMergedChildContext=t,Yt(Zn),Yt(On),Xt(On,t)):Yt(Zn),Xt(Zn,o)}var mr=null,qa=!1,Vu=!1;function vh(t){mr===null?mr=[t]:mr.push(t)}function B0(t){qa=!0,vh(t)}function Gr(){if(!Vu&&mr!==null){Vu=!0;var t=0,i=Mt;try{var o=mr;for(Mt=1;t<o.length;t++){var l=o[t];do l=l(!0);while(l!==null)}mr=null,qa=!1}catch(f){throw mr!==null&&(mr=mr.slice(t+1)),ps(we,Gr),f}finally{Mt=i,Vu=!1}}return null}var ro=[],so=0,$a=null,Ya=0,_i=[],vi=0,ys=null,gr=1,_r="";function Ss(t,i){ro[so++]=Ya,ro[so++]=$a,$a=t,Ya=i}function xh(t,i,o){_i[vi++]=gr,_i[vi++]=_r,_i[vi++]=ys,ys=t;var l=gr;t=_r;var f=32-se(l)-1;l&=~(1<<f),o+=1;var h=32-se(i)+f;if(30<h){var M=f-f%5;h=(l&(1<<M)-1).toString(32),l>>=M,f-=M,gr=1<<32-se(i)+f|o<<f|l,_r=h+t}else gr=1<<h|o<<f|l,_r=t}function Gu(t){t.return!==null&&(Ss(t,1),xh(t,1,0))}function Wu(t){for(;t===$a;)$a=ro[--so],ro[so]=null,Ya=ro[--so],ro[so]=null;for(;t===ys;)ys=_i[--vi],_i[vi]=null,_r=_i[--vi],_i[vi]=null,gr=_i[--vi],_i[vi]=null}var ci=null,fi=null,Jt=!1,Ui=null;function yh(t,i){var o=Mi(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=t,i=t.deletions,i===null?(t.deletions=[o],t.flags|=16):i.push(o)}function Sh(t,i){switch(t.tag){case 5:var o=t.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(t.stateNode=i,ci=t,fi=zr(i.firstChild),!0):!1;case 6:return i=t.pendingProps===""||i.nodeType!==3?null:i,i!==null?(t.stateNode=i,ci=t,fi=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=ys!==null?{id:gr,overflow:_r}:null,t.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=Mi(18,null,null,0),o.stateNode=i,o.return=t,t.child=o,ci=t,fi=null,!0):!1;default:return!1}}function Xu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function ju(t){if(Jt){var i=fi;if(i){var o=i;if(!Sh(t,i)){if(Xu(t))throw Error(n(418));i=zr(o.nextSibling);var l=ci;i&&Sh(t,i)?yh(l,o):(t.flags=t.flags&-4097|2,Jt=!1,ci=t)}}else{if(Xu(t))throw Error(n(418));t.flags=t.flags&-4097|2,Jt=!1,ci=t}}}function Mh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;ci=t}function Ka(t){if(t!==ci)return!1;if(!Jt)return Mh(t),Jt=!0,!1;var i;if((i=t.tag!==3)&&!(i=t.tag!==5)&&(i=t.type,i=i!=="head"&&i!=="body"&&!Ou(t.type,t.memoizedProps)),i&&(i=fi)){if(Xu(t))throw Eh(),Error(n(418));for(;i;)yh(t,i),i=zr(i.nextSibling)}if(Mh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(n(317));e:{for(t=t.nextSibling,i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="/$"){if(i===0){fi=zr(t.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}t=t.nextSibling}fi=null}}else fi=ci?zr(t.stateNode.nextSibling):null;return!0}function Eh(){for(var t=fi;t;)t=zr(t.nextSibling)}function oo(){fi=ci=null,Jt=!1}function qu(t){Ui===null?Ui=[t]:Ui.push(t)}var k0=b.ReactCurrentBatchConfig;function la(t,i,o){if(t=o.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(n(309));var l=o.stateNode}if(!l)throw Error(n(147,t));var f=l,h=""+t;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===h?i.ref:(i=function(M){var L=f.refs;M===null?delete L[h]:L[h]=M},i._stringRef=h,i)}if(typeof t!="string")throw Error(n(284));if(!o._owner)throw Error(n(290,t))}return t}function Za(t,i){throw t=Object.prototype.toString.call(i),Error(n(31,t==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":t))}function wh(t){var i=t._init;return i(t._payload)}function Th(t){function i(K,G){if(t){var Z=K.deletions;Z===null?(K.deletions=[G],K.flags|=16):Z.push(G)}}function o(K,G){if(!t)return null;for(;G!==null;)i(K,G),G=G.sibling;return null}function l(K,G){for(K=new Map;G!==null;)G.key!==null?K.set(G.key,G):K.set(G.index,G),G=G.sibling;return K}function f(K,G){return K=Zr(K,G),K.index=0,K.sibling=null,K}function h(K,G,Z){return K.index=Z,t?(Z=K.alternate,Z!==null?(Z=Z.index,Z<G?(K.flags|=2,G):Z):(K.flags|=2,G)):(K.flags|=1048576,G)}function M(K){return t&&K.alternate===null&&(K.flags|=2),K}function L(K,G,Z,Re){return G===null||G.tag!==6?(G=Bc(Z,K.mode,Re),G.return=K,G):(G=f(G,Z),G.return=K,G)}function k(K,G,Z,Re){var tt=Z.type;return tt===N?Me(K,G,Z.props.children,Re,Z.key):G!==null&&(G.elementType===tt||typeof tt=="object"&&tt!==null&&tt.$$typeof===le&&wh(tt)===G.type)?(Re=f(G,Z.props),Re.ref=la(K,G,Z),Re.return=K,Re):(Re=Sl(Z.type,Z.key,Z.props,null,K.mode,Re),Re.ref=la(K,G,Z),Re.return=K,Re)}function ne(K,G,Z,Re){return G===null||G.tag!==4||G.stateNode.containerInfo!==Z.containerInfo||G.stateNode.implementation!==Z.implementation?(G=kc(Z,K.mode,Re),G.return=K,G):(G=f(G,Z.children||[]),G.return=K,G)}function Me(K,G,Z,Re,tt){return G===null||G.tag!==7?(G=bs(Z,K.mode,Re,tt),G.return=K,G):(G=f(G,Z),G.return=K,G)}function Ae(K,G,Z){if(typeof G=="string"&&G!==""||typeof G=="number")return G=Bc(""+G,K.mode,Z),G.return=K,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case V:return Z=Sl(G.type,G.key,G.props,null,K.mode,Z),Z.ref=la(K,null,G),Z.return=K,Z;case F:return G=kc(G,K.mode,Z),G.return=K,G;case le:var Re=G._init;return Ae(K,Re(G._payload),Z)}if(qe(G)||ce(G))return G=bs(G,K.mode,Z,null),G.return=K,G;Za(K,G)}return null}function ye(K,G,Z,Re){var tt=G!==null?G.key:null;if(typeof Z=="string"&&Z!==""||typeof Z=="number")return tt!==null?null:L(K,G,""+Z,Re);if(typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case V:return Z.key===tt?k(K,G,Z,Re):null;case F:return Z.key===tt?ne(K,G,Z,Re):null;case le:return tt=Z._init,ye(K,G,tt(Z._payload),Re)}if(qe(Z)||ce(Z))return tt!==null?null:Me(K,G,Z,Re,null);Za(K,Z)}return null}function Ve(K,G,Z,Re,tt){if(typeof Re=="string"&&Re!==""||typeof Re=="number")return K=K.get(Z)||null,L(G,K,""+Re,tt);if(typeof Re=="object"&&Re!==null){switch(Re.$$typeof){case V:return K=K.get(Re.key===null?Z:Re.key)||null,k(G,K,Re,tt);case F:return K=K.get(Re.key===null?Z:Re.key)||null,ne(G,K,Re,tt);case le:var lt=Re._init;return Ve(K,G,Z,lt(Re._payload),tt)}if(qe(Re)||ce(Re))return K=K.get(Z)||null,Me(G,K,Re,tt,null);Za(G,Re)}return null}function Ke(K,G,Z,Re){for(var tt=null,lt=null,ut=G,pt=G=0,Tn=null;ut!==null&&pt<Z.length;pt++){ut.index>pt?(Tn=ut,ut=null):Tn=ut.sibling;var Nt=ye(K,ut,Z[pt],Re);if(Nt===null){ut===null&&(ut=Tn);break}t&&ut&&Nt.alternate===null&&i(K,ut),G=h(Nt,G,pt),lt===null?tt=Nt:lt.sibling=Nt,lt=Nt,ut=Tn}if(pt===Z.length)return o(K,ut),Jt&&Ss(K,pt),tt;if(ut===null){for(;pt<Z.length;pt++)ut=Ae(K,Z[pt],Re),ut!==null&&(G=h(ut,G,pt),lt===null?tt=ut:lt.sibling=ut,lt=ut);return Jt&&Ss(K,pt),tt}for(ut=l(K,ut);pt<Z.length;pt++)Tn=Ve(ut,K,pt,Z[pt],Re),Tn!==null&&(t&&Tn.alternate!==null&&ut.delete(Tn.key===null?pt:Tn.key),G=h(Tn,G,pt),lt===null?tt=Tn:lt.sibling=Tn,lt=Tn);return t&&ut.forEach(function(Qr){return i(K,Qr)}),Jt&&Ss(K,pt),tt}function Qe(K,G,Z,Re){var tt=ce(Z);if(typeof tt!="function")throw Error(n(150));if(Z=tt.call(Z),Z==null)throw Error(n(151));for(var lt=tt=null,ut=G,pt=G=0,Tn=null,Nt=Z.next();ut!==null&&!Nt.done;pt++,Nt=Z.next()){ut.index>pt?(Tn=ut,ut=null):Tn=ut.sibling;var Qr=ye(K,ut,Nt.value,Re);if(Qr===null){ut===null&&(ut=Tn);break}t&&ut&&Qr.alternate===null&&i(K,ut),G=h(Qr,G,pt),lt===null?tt=Qr:lt.sibling=Qr,lt=Qr,ut=Tn}if(Nt.done)return o(K,ut),Jt&&Ss(K,pt),tt;if(ut===null){for(;!Nt.done;pt++,Nt=Z.next())Nt=Ae(K,Nt.value,Re),Nt!==null&&(G=h(Nt,G,pt),lt===null?tt=Nt:lt.sibling=Nt,lt=Nt);return Jt&&Ss(K,pt),tt}for(ut=l(K,ut);!Nt.done;pt++,Nt=Z.next())Nt=Ve(ut,K,pt,Nt.value,Re),Nt!==null&&(t&&Nt.alternate!==null&&ut.delete(Nt.key===null?pt:Nt.key),G=h(Nt,G,pt),lt===null?tt=Nt:lt.sibling=Nt,lt=Nt);return t&&ut.forEach(function(v_){return i(K,v_)}),Jt&&Ss(K,pt),tt}function fn(K,G,Z,Re){if(typeof Z=="object"&&Z!==null&&Z.type===N&&Z.key===null&&(Z=Z.props.children),typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case V:e:{for(var tt=Z.key,lt=G;lt!==null;){if(lt.key===tt){if(tt=Z.type,tt===N){if(lt.tag===7){o(K,lt.sibling),G=f(lt,Z.props.children),G.return=K,K=G;break e}}else if(lt.elementType===tt||typeof tt=="object"&&tt!==null&&tt.$$typeof===le&&wh(tt)===lt.type){o(K,lt.sibling),G=f(lt,Z.props),G.ref=la(K,lt,Z),G.return=K,K=G;break e}o(K,lt);break}else i(K,lt);lt=lt.sibling}Z.type===N?(G=bs(Z.props.children,K.mode,Re,Z.key),G.return=K,K=G):(Re=Sl(Z.type,Z.key,Z.props,null,K.mode,Re),Re.ref=la(K,G,Z),Re.return=K,K=Re)}return M(K);case F:e:{for(lt=Z.key;G!==null;){if(G.key===lt)if(G.tag===4&&G.stateNode.containerInfo===Z.containerInfo&&G.stateNode.implementation===Z.implementation){o(K,G.sibling),G=f(G,Z.children||[]),G.return=K,K=G;break e}else{o(K,G);break}else i(K,G);G=G.sibling}G=kc(Z,K.mode,Re),G.return=K,K=G}return M(K);case le:return lt=Z._init,fn(K,G,lt(Z._payload),Re)}if(qe(Z))return Ke(K,G,Z,Re);if(ce(Z))return Qe(K,G,Z,Re);Za(K,Z)}return typeof Z=="string"&&Z!==""||typeof Z=="number"?(Z=""+Z,G!==null&&G.tag===6?(o(K,G.sibling),G=f(G,Z),G.return=K,K=G):(o(K,G),G=Bc(Z,K.mode,Re),G.return=K,K=G),M(K)):o(K,G)}return fn}var ao=Th(!0),Ah=Th(!1),Qa=Hr(null),Ja=null,lo=null,$u=null;function Yu(){$u=lo=Ja=null}function Ku(t){var i=Qa.current;Yt(Qa),t._currentValue=i}function Zu(t,i,o){for(;t!==null;){var l=t.alternate;if((t.childLanes&i)!==i?(t.childLanes|=i,l!==null&&(l.childLanes|=i)):l!==null&&(l.childLanes&i)!==i&&(l.childLanes|=i),t===o)break;t=t.return}}function uo(t,i){Ja=t,$u=lo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&i)!==0&&(Jn=!0),t.firstContext=null)}function xi(t){var i=t._currentValue;if($u!==t)if(t={context:t,memoizedValue:i,next:null},lo===null){if(Ja===null)throw Error(n(308));lo=t,Ja.dependencies={lanes:0,firstContext:t}}else lo=lo.next=t;return i}var Ms=null;function Qu(t){Ms===null?Ms=[t]:Ms.push(t)}function Ch(t,i,o,l){var f=i.interleaved;return f===null?(o.next=o,Qu(i)):(o.next=f.next,f.next=o),i.interleaved=o,vr(t,l)}function vr(t,i){t.lanes|=i;var o=t.alternate;for(o!==null&&(o.lanes|=i),o=t,t=t.return;t!==null;)t.childLanes|=i,o=t.alternate,o!==null&&(o.childLanes|=i),o=t,t=t.return;return o.tag===3?o.stateNode:null}var Wr=!1;function Ju(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Rh(t,i){t=t.updateQueue,i.updateQueue===t&&(i.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function xr(t,i){return{eventTime:t,lane:i,tag:0,payload:null,callback:null,next:null}}function Xr(t,i,o){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(Ut&2)!==0){var f=l.pending;return f===null?i.next=i:(i.next=f.next,f.next=i),l.pending=i,vr(t,o)}return f=l.interleaved,f===null?(i.next=i,Qu(l)):(i.next=f.next,f.next=i),l.interleaved=i,vr(t,o)}function el(t,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Zt(t,o)}}function bh(t,i){var o=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,o===l)){var f=null,h=null;if(o=o.firstBaseUpdate,o!==null){do{var M={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};h===null?f=h=M:h=h.next=M,o=o.next}while(o!==null);h===null?f=h=i:h=h.next=i}else f=h=i;o={baseState:l.baseState,firstBaseUpdate:f,lastBaseUpdate:h,shared:l.shared,effects:l.effects},t.updateQueue=o;return}t=o.lastBaseUpdate,t===null?o.firstBaseUpdate=i:t.next=i,o.lastBaseUpdate=i}function tl(t,i,o,l){var f=t.updateQueue;Wr=!1;var h=f.firstBaseUpdate,M=f.lastBaseUpdate,L=f.shared.pending;if(L!==null){f.shared.pending=null;var k=L,ne=k.next;k.next=null,M===null?h=ne:M.next=ne,M=k;var Me=t.alternate;Me!==null&&(Me=Me.updateQueue,L=Me.lastBaseUpdate,L!==M&&(L===null?Me.firstBaseUpdate=ne:L.next=ne,Me.lastBaseUpdate=k))}if(h!==null){var Ae=f.baseState;M=0,Me=ne=k=null,L=h;do{var ye=L.lane,Ve=L.eventTime;if((l&ye)===ye){Me!==null&&(Me=Me.next={eventTime:Ve,lane:0,tag:L.tag,payload:L.payload,callback:L.callback,next:null});e:{var Ke=t,Qe=L;switch(ye=i,Ve=o,Qe.tag){case 1:if(Ke=Qe.payload,typeof Ke=="function"){Ae=Ke.call(Ve,Ae,ye);break e}Ae=Ke;break e;case 3:Ke.flags=Ke.flags&-65537|128;case 0:if(Ke=Qe.payload,ye=typeof Ke=="function"?Ke.call(Ve,Ae,ye):Ke,ye==null)break e;Ae=ae({},Ae,ye);break e;case 2:Wr=!0}}L.callback!==null&&L.lane!==0&&(t.flags|=64,ye=f.effects,ye===null?f.effects=[L]:ye.push(L))}else Ve={eventTime:Ve,lane:ye,tag:L.tag,payload:L.payload,callback:L.callback,next:null},Me===null?(ne=Me=Ve,k=Ae):Me=Me.next=Ve,M|=ye;if(L=L.next,L===null){if(L=f.shared.pending,L===null)break;ye=L,L=ye.next,ye.next=null,f.lastBaseUpdate=ye,f.shared.pending=null}}while(!0);if(Me===null&&(k=Ae),f.baseState=k,f.firstBaseUpdate=ne,f.lastBaseUpdate=Me,i=f.shared.interleaved,i!==null){f=i;do M|=f.lane,f=f.next;while(f!==i)}else h===null&&(f.shared.lanes=0);Ts|=M,t.lanes=M,t.memoizedState=Ae}}function Ph(t,i,o){if(t=i.effects,i.effects=null,t!==null)for(i=0;i<t.length;i++){var l=t[i],f=l.callback;if(f!==null){if(l.callback=null,l=o,typeof f!="function")throw Error(n(191,f));f.call(l)}}}var ua={},nr=Hr(ua),ca=Hr(ua),fa=Hr(ua);function Es(t){if(t===ua)throw Error(n(174));return t}function ec(t,i){switch(Xt(fa,i),Xt(ca,t),Xt(nr,ua),t=i.nodeType,t){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ze(null,"");break;default:t=t===8?i.parentNode:i,i=t.namespaceURI||null,t=t.tagName,i=Ze(i,t)}Yt(nr),Xt(nr,i)}function co(){Yt(nr),Yt(ca),Yt(fa)}function Dh(t){Es(fa.current);var i=Es(nr.current),o=Ze(i,t.type);i!==o&&(Xt(ca,t),Xt(nr,o))}function tc(t){ca.current===t&&(Yt(nr),Yt(ca))}var nn=Hr(0);function nl(t){for(var i=t;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var nc=[];function ic(){for(var t=0;t<nc.length;t++)nc[t]._workInProgressVersionPrimary=null;nc.length=0}var il=b.ReactCurrentDispatcher,rc=b.ReactCurrentBatchConfig,ws=0,rn=null,gn=null,En=null,rl=!1,da=!1,ha=0,z0=0;function Bn(){throw Error(n(321))}function sc(t,i){if(i===null)return!1;for(var o=0;o<i.length&&o<t.length;o++)if(!Li(t[o],i[o]))return!1;return!0}function oc(t,i,o,l,f,h){if(ws=h,rn=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,il.current=t===null||t.memoizedState===null?W0:X0,t=o(l,f),da){h=0;do{if(da=!1,ha=0,25<=h)throw Error(n(301));h+=1,En=gn=null,i.updateQueue=null,il.current=j0,t=o(l,f)}while(da)}if(il.current=al,i=gn!==null&&gn.next!==null,ws=0,En=gn=rn=null,rl=!1,i)throw Error(n(300));return t}function ac(){var t=ha!==0;return ha=0,t}function ir(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return En===null?rn.memoizedState=En=t:En=En.next=t,En}function yi(){if(gn===null){var t=rn.alternate;t=t!==null?t.memoizedState:null}else t=gn.next;var i=En===null?rn.memoizedState:En.next;if(i!==null)En=i,gn=t;else{if(t===null)throw Error(n(310));gn=t,t={memoizedState:gn.memoizedState,baseState:gn.baseState,baseQueue:gn.baseQueue,queue:gn.queue,next:null},En===null?rn.memoizedState=En=t:En=En.next=t}return En}function pa(t,i){return typeof i=="function"?i(t):i}function lc(t){var i=yi(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=gn,f=l.baseQueue,h=o.pending;if(h!==null){if(f!==null){var M=f.next;f.next=h.next,h.next=M}l.baseQueue=f=h,o.pending=null}if(f!==null){h=f.next,l=l.baseState;var L=M=null,k=null,ne=h;do{var Me=ne.lane;if((ws&Me)===Me)k!==null&&(k=k.next={lane:0,action:ne.action,hasEagerState:ne.hasEagerState,eagerState:ne.eagerState,next:null}),l=ne.hasEagerState?ne.eagerState:t(l,ne.action);else{var Ae={lane:Me,action:ne.action,hasEagerState:ne.hasEagerState,eagerState:ne.eagerState,next:null};k===null?(L=k=Ae,M=l):k=k.next=Ae,rn.lanes|=Me,Ts|=Me}ne=ne.next}while(ne!==null&&ne!==h);k===null?M=l:k.next=L,Li(l,i.memoizedState)||(Jn=!0),i.memoizedState=l,i.baseState=M,i.baseQueue=k,o.lastRenderedState=l}if(t=o.interleaved,t!==null){f=t;do h=f.lane,rn.lanes|=h,Ts|=h,f=f.next;while(f!==t)}else f===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function uc(t){var i=yi(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=o.dispatch,f=o.pending,h=i.memoizedState;if(f!==null){o.pending=null;var M=f=f.next;do h=t(h,M.action),M=M.next;while(M!==f);Li(h,i.memoizedState)||(Jn=!0),i.memoizedState=h,i.baseQueue===null&&(i.baseState=h),o.lastRenderedState=h}return[h,l]}function Lh(){}function Uh(t,i){var o=rn,l=yi(),f=i(),h=!Li(l.memoizedState,f);if(h&&(l.memoizedState=f,Jn=!0),l=l.queue,cc(Fh.bind(null,o,l,t),[t]),l.getSnapshot!==i||h||En!==null&&En.memoizedState.tag&1){if(o.flags|=2048,ma(9,Nh.bind(null,o,l,f,i),void 0,null),wn===null)throw Error(n(349));(ws&30)!==0||Ih(o,i,f)}return f}function Ih(t,i,o){t.flags|=16384,t={getSnapshot:i,value:o},i=rn.updateQueue,i===null?(i={lastEffect:null,stores:null},rn.updateQueue=i,i.stores=[t]):(o=i.stores,o===null?i.stores=[t]:o.push(t))}function Nh(t,i,o,l){i.value=o,i.getSnapshot=l,Oh(i)&&Bh(t)}function Fh(t,i,o){return o(function(){Oh(i)&&Bh(t)})}function Oh(t){var i=t.getSnapshot;t=t.value;try{var o=i();return!Li(t,o)}catch{return!0}}function Bh(t){var i=vr(t,1);i!==null&&Oi(i,t,1,-1)}function kh(t){var i=ir();return typeof t=="function"&&(t=t()),i.memoizedState=i.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:pa,lastRenderedState:t},i.queue=t,t=t.dispatch=G0.bind(null,rn,t),[i.memoizedState,t]}function ma(t,i,o,l){return t={tag:t,create:i,destroy:o,deps:l,next:null},i=rn.updateQueue,i===null?(i={lastEffect:null,stores:null},rn.updateQueue=i,i.lastEffect=t.next=t):(o=i.lastEffect,o===null?i.lastEffect=t.next=t:(l=o.next,o.next=t,t.next=l,i.lastEffect=t)),t}function zh(){return yi().memoizedState}function sl(t,i,o,l){var f=ir();rn.flags|=t,f.memoizedState=ma(1|i,o,void 0,l===void 0?null:l)}function ol(t,i,o,l){var f=yi();l=l===void 0?null:l;var h=void 0;if(gn!==null){var M=gn.memoizedState;if(h=M.destroy,l!==null&&sc(l,M.deps)){f.memoizedState=ma(i,o,h,l);return}}rn.flags|=t,f.memoizedState=ma(1|i,o,h,l)}function Hh(t,i){return sl(8390656,8,t,i)}function cc(t,i){return ol(2048,8,t,i)}function Vh(t,i){return ol(4,2,t,i)}function Gh(t,i){return ol(4,4,t,i)}function Wh(t,i){if(typeof i=="function")return t=t(),i(t),function(){i(null)};if(i!=null)return t=t(),i.current=t,function(){i.current=null}}function Xh(t,i,o){return o=o!=null?o.concat([t]):null,ol(4,4,Wh.bind(null,i,t),o)}function fc(){}function jh(t,i){var o=yi();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&sc(i,l[1])?l[0]:(o.memoizedState=[t,i],t)}function qh(t,i){var o=yi();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&sc(i,l[1])?l[0]:(t=t(),o.memoizedState=[t,i],t)}function $h(t,i,o){return(ws&21)===0?(t.baseState&&(t.baseState=!1,Jn=!0),t.memoizedState=o):(Li(o,i)||(o=wt(),rn.lanes|=o,Ts|=o,t.baseState=!0),i)}function H0(t,i){var o=Mt;Mt=o!==0&&4>o?o:4,t(!0);var l=rc.transition;rc.transition={};try{t(!1),i()}finally{Mt=o,rc.transition=l}}function Yh(){return yi().memoizedState}function V0(t,i,o){var l=Yr(t);if(o={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null},Kh(t))Zh(i,o);else if(o=Ch(t,i,o,l),o!==null){var f=Xn();Oi(o,t,l,f),Qh(o,i,l)}}function G0(t,i,o){var l=Yr(t),f={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null};if(Kh(t))Zh(i,f);else{var h=t.alternate;if(t.lanes===0&&(h===null||h.lanes===0)&&(h=i.lastRenderedReducer,h!==null))try{var M=i.lastRenderedState,L=h(M,o);if(f.hasEagerState=!0,f.eagerState=L,Li(L,M)){var k=i.interleaved;k===null?(f.next=f,Qu(i)):(f.next=k.next,k.next=f),i.interleaved=f;return}}catch{}finally{}o=Ch(t,i,f,l),o!==null&&(f=Xn(),Oi(o,t,l,f),Qh(o,i,l))}}function Kh(t){var i=t.alternate;return t===rn||i!==null&&i===rn}function Zh(t,i){da=rl=!0;var o=t.pending;o===null?i.next=i:(i.next=o.next,o.next=i),t.pending=i}function Qh(t,i,o){if((o&4194240)!==0){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Zt(t,o)}}var al={readContext:xi,useCallback:Bn,useContext:Bn,useEffect:Bn,useImperativeHandle:Bn,useInsertionEffect:Bn,useLayoutEffect:Bn,useMemo:Bn,useReducer:Bn,useRef:Bn,useState:Bn,useDebugValue:Bn,useDeferredValue:Bn,useTransition:Bn,useMutableSource:Bn,useSyncExternalStore:Bn,useId:Bn,unstable_isNewReconciler:!1},W0={readContext:xi,useCallback:function(t,i){return ir().memoizedState=[t,i===void 0?null:i],t},useContext:xi,useEffect:Hh,useImperativeHandle:function(t,i,o){return o=o!=null?o.concat([t]):null,sl(4194308,4,Wh.bind(null,i,t),o)},useLayoutEffect:function(t,i){return sl(4194308,4,t,i)},useInsertionEffect:function(t,i){return sl(4,2,t,i)},useMemo:function(t,i){var o=ir();return i=i===void 0?null:i,t=t(),o.memoizedState=[t,i],t},useReducer:function(t,i,o){var l=ir();return i=o!==void 0?o(i):i,l.memoizedState=l.baseState=i,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},l.queue=t,t=t.dispatch=V0.bind(null,rn,t),[l.memoizedState,t]},useRef:function(t){var i=ir();return t={current:t},i.memoizedState=t},useState:kh,useDebugValue:fc,useDeferredValue:function(t){return ir().memoizedState=t},useTransition:function(){var t=kh(!1),i=t[0];return t=H0.bind(null,t[1]),ir().memoizedState=t,[i,t]},useMutableSource:function(){},useSyncExternalStore:function(t,i,o){var l=rn,f=ir();if(Jt){if(o===void 0)throw Error(n(407));o=o()}else{if(o=i(),wn===null)throw Error(n(349));(ws&30)!==0||Ih(l,i,o)}f.memoizedState=o;var h={value:o,getSnapshot:i};return f.queue=h,Hh(Fh.bind(null,l,h,t),[t]),l.flags|=2048,ma(9,Nh.bind(null,l,h,o,i),void 0,null),o},useId:function(){var t=ir(),i=wn.identifierPrefix;if(Jt){var o=_r,l=gr;o=(l&~(1<<32-se(l)-1)).toString(32)+o,i=":"+i+"R"+o,o=ha++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=z0++,i=":"+i+"r"+o.toString(32)+":";return t.memoizedState=i},unstable_isNewReconciler:!1},X0={readContext:xi,useCallback:jh,useContext:xi,useEffect:cc,useImperativeHandle:Xh,useInsertionEffect:Vh,useLayoutEffect:Gh,useMemo:qh,useReducer:lc,useRef:zh,useState:function(){return lc(pa)},useDebugValue:fc,useDeferredValue:function(t){var i=yi();return $h(i,gn.memoizedState,t)},useTransition:function(){var t=lc(pa)[0],i=yi().memoizedState;return[t,i]},useMutableSource:Lh,useSyncExternalStore:Uh,useId:Yh,unstable_isNewReconciler:!1},j0={readContext:xi,useCallback:jh,useContext:xi,useEffect:cc,useImperativeHandle:Xh,useInsertionEffect:Vh,useLayoutEffect:Gh,useMemo:qh,useReducer:uc,useRef:zh,useState:function(){return uc(pa)},useDebugValue:fc,useDeferredValue:function(t){var i=yi();return gn===null?i.memoizedState=t:$h(i,gn.memoizedState,t)},useTransition:function(){var t=uc(pa)[0],i=yi().memoizedState;return[t,i]},useMutableSource:Lh,useSyncExternalStore:Uh,useId:Yh,unstable_isNewReconciler:!1};function Ii(t,i){if(t&&t.defaultProps){i=ae({},i),t=t.defaultProps;for(var o in t)i[o]===void 0&&(i[o]=t[o]);return i}return i}function dc(t,i,o,l){i=t.memoizedState,o=o(l,i),o=o==null?i:ae({},i,o),t.memoizedState=o,t.lanes===0&&(t.updateQueue.baseState=o)}var ll={isMounted:function(t){return(t=t._reactInternals)?$n(t)===t:!1},enqueueSetState:function(t,i,o){t=t._reactInternals;var l=Xn(),f=Yr(t),h=xr(l,f);h.payload=i,o!=null&&(h.callback=o),i=Xr(t,h,f),i!==null&&(Oi(i,t,f,l),el(i,t,f))},enqueueReplaceState:function(t,i,o){t=t._reactInternals;var l=Xn(),f=Yr(t),h=xr(l,f);h.tag=1,h.payload=i,o!=null&&(h.callback=o),i=Xr(t,h,f),i!==null&&(Oi(i,t,f,l),el(i,t,f))},enqueueForceUpdate:function(t,i){t=t._reactInternals;var o=Xn(),l=Yr(t),f=xr(o,l);f.tag=2,i!=null&&(f.callback=i),i=Xr(t,f,l),i!==null&&(Oi(i,t,l,o),el(i,t,l))}};function Jh(t,i,o,l,f,h,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,h,M):i.prototype&&i.prototype.isPureReactComponent?!ta(o,l)||!ta(f,h):!0}function ep(t,i,o){var l=!1,f=Vr,h=i.contextType;return typeof h=="object"&&h!==null?h=xi(h):(f=Qn(i)?xs:On.current,l=i.contextTypes,h=(l=l!=null)?io(t,f):Vr),i=new i(o,h),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=ll,t.stateNode=i,i._reactInternals=t,l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=f,t.__reactInternalMemoizedMaskedChildContext=h),i}function tp(t,i,o,l){t=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,l),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,l),i.state!==t&&ll.enqueueReplaceState(i,i.state,null)}function hc(t,i,o,l){var f=t.stateNode;f.props=o,f.state=t.memoizedState,f.refs={},Ju(t);var h=i.contextType;typeof h=="object"&&h!==null?f.context=xi(h):(h=Qn(i)?xs:On.current,f.context=io(t,h)),f.state=t.memoizedState,h=i.getDerivedStateFromProps,typeof h=="function"&&(dc(t,i,h,o),f.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(i=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),i!==f.state&&ll.enqueueReplaceState(f,f.state,null),tl(t,o,f,l),f.state=t.memoizedState),typeof f.componentDidMount=="function"&&(t.flags|=4194308)}function fo(t,i){try{var o="",l=i;do o+=me(l),l=l.return;while(l);var f=o}catch(h){f=`
Error generating stack: `+h.message+`
`+h.stack}return{value:t,source:i,stack:f,digest:null}}function pc(t,i,o){return{value:t,source:null,stack:o??null,digest:i??null}}function mc(t,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var q0=typeof WeakMap=="function"?WeakMap:Map;function np(t,i,o){o=xr(-1,o),o.tag=3,o.payload={element:null};var l=i.value;return o.callback=function(){ml||(ml=!0,Pc=l),mc(t,i)},o}function ip(t,i,o){o=xr(-1,o),o.tag=3;var l=t.type.getDerivedStateFromError;if(typeof l=="function"){var f=i.value;o.payload=function(){return l(f)},o.callback=function(){mc(t,i)}}var h=t.stateNode;return h!==null&&typeof h.componentDidCatch=="function"&&(o.callback=function(){mc(t,i),typeof l!="function"&&(qr===null?qr=new Set([this]):qr.add(this));var M=i.stack;this.componentDidCatch(i.value,{componentStack:M!==null?M:""})}),o}function rp(t,i,o){var l=t.pingCache;if(l===null){l=t.pingCache=new q0;var f=new Set;l.set(i,f)}else f=l.get(i),f===void 0&&(f=new Set,l.set(i,f));f.has(o)||(f.add(o),t=a_.bind(null,t,i,o),i.then(t,t))}function sp(t){do{var i;if((i=t.tag===13)&&(i=t.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return t;t=t.return}while(t!==null);return null}function op(t,i,o,l,f){return(t.mode&1)===0?(t===i?t.flags|=65536:(t.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=xr(-1,1),i.tag=2,Xr(o,i,1))),o.lanes|=1),t):(t.flags|=65536,t.lanes=f,t)}var $0=b.ReactCurrentOwner,Jn=!1;function Wn(t,i,o,l){i.child=t===null?Ah(i,null,o,l):ao(i,t.child,o,l)}function ap(t,i,o,l,f){o=o.render;var h=i.ref;return uo(i,f),l=oc(t,i,o,l,h,f),o=ac(),t!==null&&!Jn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,yr(t,i,f)):(Jt&&o&&Gu(i),i.flags|=1,Wn(t,i,l,f),i.child)}function lp(t,i,o,l,f){if(t===null){var h=o.type;return typeof h=="function"&&!Oc(h)&&h.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=h,up(t,i,h,l,f)):(t=Sl(o.type,null,l,i,i.mode,f),t.ref=i.ref,t.return=i,i.child=t)}if(h=t.child,(t.lanes&f)===0){var M=h.memoizedProps;if(o=o.compare,o=o!==null?o:ta,o(M,l)&&t.ref===i.ref)return yr(t,i,f)}return i.flags|=1,t=Zr(h,l),t.ref=i.ref,t.return=i,i.child=t}function up(t,i,o,l,f){if(t!==null){var h=t.memoizedProps;if(ta(h,l)&&t.ref===i.ref)if(Jn=!1,i.pendingProps=l=h,(t.lanes&f)!==0)(t.flags&131072)!==0&&(Jn=!0);else return i.lanes=t.lanes,yr(t,i,f)}return gc(t,i,o,l,f)}function cp(t,i,o){var l=i.pendingProps,f=l.children,h=t!==null?t.memoizedState:null;if(l.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Xt(po,di),di|=o;else{if((o&1073741824)===0)return t=h!==null?h.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:t,cachePool:null,transitions:null},i.updateQueue=null,Xt(po,di),di|=t,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},l=h!==null?h.baseLanes:o,Xt(po,di),di|=l}else h!==null?(l=h.baseLanes|o,i.memoizedState=null):l=o,Xt(po,di),di|=l;return Wn(t,i,f,o),i.child}function fp(t,i){var o=i.ref;(t===null&&o!==null||t!==null&&t.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function gc(t,i,o,l,f){var h=Qn(o)?xs:On.current;return h=io(i,h),uo(i,f),o=oc(t,i,o,l,h,f),l=ac(),t!==null&&!Jn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,yr(t,i,f)):(Jt&&l&&Gu(i),i.flags|=1,Wn(t,i,o,f),i.child)}function dp(t,i,o,l,f){if(Qn(o)){var h=!0;ja(i)}else h=!1;if(uo(i,f),i.stateNode===null)cl(t,i),ep(i,o,l),hc(i,o,l,f),l=!0;else if(t===null){var M=i.stateNode,L=i.memoizedProps;M.props=L;var k=M.context,ne=o.contextType;typeof ne=="object"&&ne!==null?ne=xi(ne):(ne=Qn(o)?xs:On.current,ne=io(i,ne));var Me=o.getDerivedStateFromProps,Ae=typeof Me=="function"||typeof M.getSnapshotBeforeUpdate=="function";Ae||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(L!==l||k!==ne)&&tp(i,M,l,ne),Wr=!1;var ye=i.memoizedState;M.state=ye,tl(i,l,M,f),k=i.memoizedState,L!==l||ye!==k||Zn.current||Wr?(typeof Me=="function"&&(dc(i,o,Me,l),k=i.memoizedState),(L=Wr||Jh(i,o,L,l,ye,k,ne))?(Ae||typeof M.UNSAFE_componentWillMount!="function"&&typeof M.componentWillMount!="function"||(typeof M.componentWillMount=="function"&&M.componentWillMount(),typeof M.UNSAFE_componentWillMount=="function"&&M.UNSAFE_componentWillMount()),typeof M.componentDidMount=="function"&&(i.flags|=4194308)):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=l,i.memoizedState=k),M.props=l,M.state=k,M.context=ne,l=L):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),l=!1)}else{M=i.stateNode,Rh(t,i),L=i.memoizedProps,ne=i.type===i.elementType?L:Ii(i.type,L),M.props=ne,Ae=i.pendingProps,ye=M.context,k=o.contextType,typeof k=="object"&&k!==null?k=xi(k):(k=Qn(o)?xs:On.current,k=io(i,k));var Ve=o.getDerivedStateFromProps;(Me=typeof Ve=="function"||typeof M.getSnapshotBeforeUpdate=="function")||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(L!==Ae||ye!==k)&&tp(i,M,l,k),Wr=!1,ye=i.memoizedState,M.state=ye,tl(i,l,M,f);var Ke=i.memoizedState;L!==Ae||ye!==Ke||Zn.current||Wr?(typeof Ve=="function"&&(dc(i,o,Ve,l),Ke=i.memoizedState),(ne=Wr||Jh(i,o,ne,l,ye,Ke,k)||!1)?(Me||typeof M.UNSAFE_componentWillUpdate!="function"&&typeof M.componentWillUpdate!="function"||(typeof M.componentWillUpdate=="function"&&M.componentWillUpdate(l,Ke,k),typeof M.UNSAFE_componentWillUpdate=="function"&&M.UNSAFE_componentWillUpdate(l,Ke,k)),typeof M.componentDidUpdate=="function"&&(i.flags|=4),typeof M.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof M.componentDidUpdate!="function"||L===t.memoizedProps&&ye===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||L===t.memoizedProps&&ye===t.memoizedState||(i.flags|=1024),i.memoizedProps=l,i.memoizedState=Ke),M.props=l,M.state=Ke,M.context=k,l=ne):(typeof M.componentDidUpdate!="function"||L===t.memoizedProps&&ye===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||L===t.memoizedProps&&ye===t.memoizedState||(i.flags|=1024),l=!1)}return _c(t,i,o,l,h,f)}function _c(t,i,o,l,f,h){fp(t,i);var M=(i.flags&128)!==0;if(!l&&!M)return f&&_h(i,o,!1),yr(t,i,h);l=i.stateNode,$0.current=i;var L=M&&typeof o.getDerivedStateFromError!="function"?null:l.render();return i.flags|=1,t!==null&&M?(i.child=ao(i,t.child,null,h),i.child=ao(i,null,L,h)):Wn(t,i,L,h),i.memoizedState=l.state,f&&_h(i,o,!0),i.child}function hp(t){var i=t.stateNode;i.pendingContext?mh(t,i.pendingContext,i.pendingContext!==i.context):i.context&&mh(t,i.context,!1),ec(t,i.containerInfo)}function pp(t,i,o,l,f){return oo(),qu(f),i.flags|=256,Wn(t,i,o,l),i.child}var vc={dehydrated:null,treeContext:null,retryLane:0};function xc(t){return{baseLanes:t,cachePool:null,transitions:null}}function mp(t,i,o){var l=i.pendingProps,f=nn.current,h=!1,M=(i.flags&128)!==0,L;if((L=M)||(L=t!==null&&t.memoizedState===null?!1:(f&2)!==0),L?(h=!0,i.flags&=-129):(t===null||t.memoizedState!==null)&&(f|=1),Xt(nn,f&1),t===null)return ju(i),t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?((i.mode&1)===0?i.lanes=1:t.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(M=l.children,t=l.fallback,h?(l=i.mode,h=i.child,M={mode:"hidden",children:M},(l&1)===0&&h!==null?(h.childLanes=0,h.pendingProps=M):h=Ml(M,l,0,null),t=bs(t,l,o,null),h.return=i,t.return=i,h.sibling=t,i.child=h,i.child.memoizedState=xc(o),i.memoizedState=vc,t):yc(i,M));if(f=t.memoizedState,f!==null&&(L=f.dehydrated,L!==null))return Y0(t,i,M,l,L,f,o);if(h){h=l.fallback,M=i.mode,f=t.child,L=f.sibling;var k={mode:"hidden",children:l.children};return(M&1)===0&&i.child!==f?(l=i.child,l.childLanes=0,l.pendingProps=k,i.deletions=null):(l=Zr(f,k),l.subtreeFlags=f.subtreeFlags&14680064),L!==null?h=Zr(L,h):(h=bs(h,M,o,null),h.flags|=2),h.return=i,l.return=i,l.sibling=h,i.child=l,l=h,h=i.child,M=t.child.memoizedState,M=M===null?xc(o):{baseLanes:M.baseLanes|o,cachePool:null,transitions:M.transitions},h.memoizedState=M,h.childLanes=t.childLanes&~o,i.memoizedState=vc,l}return h=t.child,t=h.sibling,l=Zr(h,{mode:"visible",children:l.children}),(i.mode&1)===0&&(l.lanes=o),l.return=i,l.sibling=null,t!==null&&(o=i.deletions,o===null?(i.deletions=[t],i.flags|=16):o.push(t)),i.child=l,i.memoizedState=null,l}function yc(t,i){return i=Ml({mode:"visible",children:i},t.mode,0,null),i.return=t,t.child=i}function ul(t,i,o,l){return l!==null&&qu(l),ao(i,t.child,null,o),t=yc(i,i.pendingProps.children),t.flags|=2,i.memoizedState=null,t}function Y0(t,i,o,l,f,h,M){if(o)return i.flags&256?(i.flags&=-257,l=pc(Error(n(422))),ul(t,i,M,l)):i.memoizedState!==null?(i.child=t.child,i.flags|=128,null):(h=l.fallback,f=i.mode,l=Ml({mode:"visible",children:l.children},f,0,null),h=bs(h,f,M,null),h.flags|=2,l.return=i,h.return=i,l.sibling=h,i.child=l,(i.mode&1)!==0&&ao(i,t.child,null,M),i.child.memoizedState=xc(M),i.memoizedState=vc,h);if((i.mode&1)===0)return ul(t,i,M,null);if(f.data==="$!"){if(l=f.nextSibling&&f.nextSibling.dataset,l)var L=l.dgst;return l=L,h=Error(n(419)),l=pc(h,l,void 0),ul(t,i,M,l)}if(L=(M&t.childLanes)!==0,Jn||L){if(l=wn,l!==null){switch(M&-M){case 4:f=2;break;case 16:f=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:f=32;break;case 536870912:f=268435456;break;default:f=0}f=(f&(l.suspendedLanes|M))!==0?0:f,f!==0&&f!==h.retryLane&&(h.retryLane=f,vr(t,f),Oi(l,t,f,-1))}return Fc(),l=pc(Error(n(421))),ul(t,i,M,l)}return f.data==="$?"?(i.flags|=128,i.child=t.child,i=l_.bind(null,t),f._reactRetry=i,null):(t=h.treeContext,fi=zr(f.nextSibling),ci=i,Jt=!0,Ui=null,t!==null&&(_i[vi++]=gr,_i[vi++]=_r,_i[vi++]=ys,gr=t.id,_r=t.overflow,ys=i),i=yc(i,l.children),i.flags|=4096,i)}function gp(t,i,o){t.lanes|=i;var l=t.alternate;l!==null&&(l.lanes|=i),Zu(t.return,i,o)}function Sc(t,i,o,l,f){var h=t.memoizedState;h===null?t.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:l,tail:o,tailMode:f}:(h.isBackwards=i,h.rendering=null,h.renderingStartTime=0,h.last=l,h.tail=o,h.tailMode=f)}function _p(t,i,o){var l=i.pendingProps,f=l.revealOrder,h=l.tail;if(Wn(t,i,l.children,o),l=nn.current,(l&2)!==0)l=l&1|2,i.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=i.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&gp(t,o,i);else if(t.tag===19)gp(t,o,i);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===i)break e;for(;t.sibling===null;){if(t.return===null||t.return===i)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}l&=1}if(Xt(nn,l),(i.mode&1)===0)i.memoizedState=null;else switch(f){case"forwards":for(o=i.child,f=null;o!==null;)t=o.alternate,t!==null&&nl(t)===null&&(f=o),o=o.sibling;o=f,o===null?(f=i.child,i.child=null):(f=o.sibling,o.sibling=null),Sc(i,!1,f,o,h);break;case"backwards":for(o=null,f=i.child,i.child=null;f!==null;){if(t=f.alternate,t!==null&&nl(t)===null){i.child=f;break}t=f.sibling,f.sibling=o,o=f,f=t}Sc(i,!0,o,null,h);break;case"together":Sc(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function cl(t,i){(i.mode&1)===0&&t!==null&&(t.alternate=null,i.alternate=null,i.flags|=2)}function yr(t,i,o){if(t!==null&&(i.dependencies=t.dependencies),Ts|=i.lanes,(o&i.childLanes)===0)return null;if(t!==null&&i.child!==t.child)throw Error(n(153));if(i.child!==null){for(t=i.child,o=Zr(t,t.pendingProps),i.child=o,o.return=i;t.sibling!==null;)t=t.sibling,o=o.sibling=Zr(t,t.pendingProps),o.return=i;o.sibling=null}return i.child}function K0(t,i,o){switch(i.tag){case 3:hp(i),oo();break;case 5:Dh(i);break;case 1:Qn(i.type)&&ja(i);break;case 4:ec(i,i.stateNode.containerInfo);break;case 10:var l=i.type._context,f=i.memoizedProps.value;Xt(Qa,l._currentValue),l._currentValue=f;break;case 13:if(l=i.memoizedState,l!==null)return l.dehydrated!==null?(Xt(nn,nn.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?mp(t,i,o):(Xt(nn,nn.current&1),t=yr(t,i,o),t!==null?t.sibling:null);Xt(nn,nn.current&1);break;case 19:if(l=(o&i.childLanes)!==0,(t.flags&128)!==0){if(l)return _p(t,i,o);i.flags|=128}if(f=i.memoizedState,f!==null&&(f.rendering=null,f.tail=null,f.lastEffect=null),Xt(nn,nn.current),l)break;return null;case 22:case 23:return i.lanes=0,cp(t,i,o)}return yr(t,i,o)}var vp,Mc,xp,yp;vp=function(t,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)t.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},Mc=function(){},xp=function(t,i,o,l){var f=t.memoizedProps;if(f!==l){t=i.stateNode,Es(nr.current);var h=null;switch(o){case"input":f=O(t,f),l=O(t,l),h=[];break;case"select":f=ae({},f,{value:void 0}),l=ae({},l,{value:void 0}),h=[];break;case"textarea":f=w(t,f),l=w(t,l),h=[];break;default:typeof f.onClick!="function"&&typeof l.onClick=="function"&&(t.onclick=Ga)}gt(o,l);var M;o=null;for(ne in f)if(!l.hasOwnProperty(ne)&&f.hasOwnProperty(ne)&&f[ne]!=null)if(ne==="style"){var L=f[ne];for(M in L)L.hasOwnProperty(M)&&(o||(o={}),o[M]="")}else ne!=="dangerouslySetInnerHTML"&&ne!=="children"&&ne!=="suppressContentEditableWarning"&&ne!=="suppressHydrationWarning"&&ne!=="autoFocus"&&(a.hasOwnProperty(ne)?h||(h=[]):(h=h||[]).push(ne,null));for(ne in l){var k=l[ne];if(L=f!=null?f[ne]:void 0,l.hasOwnProperty(ne)&&k!==L&&(k!=null||L!=null))if(ne==="style")if(L){for(M in L)!L.hasOwnProperty(M)||k&&k.hasOwnProperty(M)||(o||(o={}),o[M]="");for(M in k)k.hasOwnProperty(M)&&L[M]!==k[M]&&(o||(o={}),o[M]=k[M])}else o||(h||(h=[]),h.push(ne,o)),o=k;else ne==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,L=L?L.__html:void 0,k!=null&&L!==k&&(h=h||[]).push(ne,k)):ne==="children"?typeof k!="string"&&typeof k!="number"||(h=h||[]).push(ne,""+k):ne!=="suppressContentEditableWarning"&&ne!=="suppressHydrationWarning"&&(a.hasOwnProperty(ne)?(k!=null&&ne==="onScroll"&&$t("scroll",t),h||L===k||(h=[])):(h=h||[]).push(ne,k))}o&&(h=h||[]).push("style",o);var ne=h;(i.updateQueue=ne)&&(i.flags|=4)}},yp=function(t,i,o,l){o!==l&&(i.flags|=4)};function ga(t,i){if(!Jt)switch(t.tailMode){case"hidden":i=t.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?t.tail=null:o.sibling=null;break;case"collapsed":o=t.tail;for(var l=null;o!==null;)o.alternate!==null&&(l=o),o=o.sibling;l===null?i||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function kn(t){var i=t.alternate!==null&&t.alternate.child===t.child,o=0,l=0;if(i)for(var f=t.child;f!==null;)o|=f.lanes|f.childLanes,l|=f.subtreeFlags&14680064,l|=f.flags&14680064,f.return=t,f=f.sibling;else for(f=t.child;f!==null;)o|=f.lanes|f.childLanes,l|=f.subtreeFlags,l|=f.flags,f.return=t,f=f.sibling;return t.subtreeFlags|=l,t.childLanes=o,i}function Z0(t,i,o){var l=i.pendingProps;switch(Wu(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return kn(i),null;case 1:return Qn(i.type)&&Xa(),kn(i),null;case 3:return l=i.stateNode,co(),Yt(Zn),Yt(On),ic(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(Ka(i)?i.flags|=4:t===null||t.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Ui!==null&&(Uc(Ui),Ui=null))),Mc(t,i),kn(i),null;case 5:tc(i);var f=Es(fa.current);if(o=i.type,t!==null&&i.stateNode!=null)xp(t,i,o,l,f),t.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!l){if(i.stateNode===null)throw Error(n(166));return kn(i),null}if(t=Es(nr.current),Ka(i)){l=i.stateNode,o=i.type;var h=i.memoizedProps;switch(l[tr]=i,l[oa]=h,t=(i.mode&1)!==0,o){case"dialog":$t("cancel",l),$t("close",l);break;case"iframe":case"object":case"embed":$t("load",l);break;case"video":case"audio":for(f=0;f<ia.length;f++)$t(ia[f],l);break;case"source":$t("error",l);break;case"img":case"image":case"link":$t("error",l),$t("load",l);break;case"details":$t("toggle",l);break;case"input":Rt(l,h),$t("invalid",l);break;case"select":l._wrapperState={wasMultiple:!!h.multiple},$t("invalid",l);break;case"textarea":J(l,h),$t("invalid",l)}gt(o,h),f=null;for(var M in h)if(h.hasOwnProperty(M)){var L=h[M];M==="children"?typeof L=="string"?l.textContent!==L&&(h.suppressHydrationWarning!==!0&&Va(l.textContent,L,t),f=["children",L]):typeof L=="number"&&l.textContent!==""+L&&(h.suppressHydrationWarning!==!0&&Va(l.textContent,L,t),f=["children",""+L]):a.hasOwnProperty(M)&&L!=null&&M==="onScroll"&&$t("scroll",l)}switch(o){case"input":Ot(l),Je(l,h,!0);break;case"textarea":Ot(l),xe(l);break;case"select":case"option":break;default:typeof h.onClick=="function"&&(l.onclick=Ga)}l=f,i.updateQueue=l,l!==null&&(i.flags|=4)}else{M=f.nodeType===9?f:f.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=he(o)),t==="http://www.w3.org/1999/xhtml"?o==="script"?(t=M.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof l.is=="string"?t=M.createElement(o,{is:l.is}):(t=M.createElement(o),o==="select"&&(M=t,l.multiple?M.multiple=!0:l.size&&(M.size=l.size))):t=M.createElementNS(t,o),t[tr]=i,t[oa]=l,vp(t,i,!1,!1),i.stateNode=t;e:{switch(M=dt(o,l),o){case"dialog":$t("cancel",t),$t("close",t),f=l;break;case"iframe":case"object":case"embed":$t("load",t),f=l;break;case"video":case"audio":for(f=0;f<ia.length;f++)$t(ia[f],t);f=l;break;case"source":$t("error",t),f=l;break;case"img":case"image":case"link":$t("error",t),$t("load",t),f=l;break;case"details":$t("toggle",t),f=l;break;case"input":Rt(t,l),f=O(t,l),$t("invalid",t);break;case"option":f=l;break;case"select":t._wrapperState={wasMultiple:!!l.multiple},f=ae({},l,{value:void 0}),$t("invalid",t);break;case"textarea":J(t,l),f=w(t,l),$t("invalid",t);break;default:f=l}gt(o,f),L=f;for(h in L)if(L.hasOwnProperty(h)){var k=L[h];h==="style"?ft(t,k):h==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&He(t,k)):h==="children"?typeof k=="string"?(o!=="textarea"||k!=="")&&mt(t,k):typeof k=="number"&&mt(t,""+k):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(a.hasOwnProperty(h)?k!=null&&h==="onScroll"&&$t("scroll",t):k!=null&&D(t,h,k,M))}switch(o){case"input":Ot(t),Je(t,l,!1);break;case"textarea":Ot(t),xe(t);break;case"option":l.value!=null&&t.setAttribute("value",""+De(l.value));break;case"select":t.multiple=!!l.multiple,h=l.value,h!=null?P(t,!!l.multiple,h,!1):l.defaultValue!=null&&P(t,!!l.multiple,l.defaultValue,!0);break;default:typeof f.onClick=="function"&&(t.onclick=Ga)}switch(o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}}l&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return kn(i),null;case 6:if(t&&i.stateNode!=null)yp(t,i,t.memoizedProps,l);else{if(typeof l!="string"&&i.stateNode===null)throw Error(n(166));if(o=Es(fa.current),Es(nr.current),Ka(i)){if(l=i.stateNode,o=i.memoizedProps,l[tr]=i,(h=l.nodeValue!==o)&&(t=ci,t!==null))switch(t.tag){case 3:Va(l.nodeValue,o,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Va(l.nodeValue,o,(t.mode&1)!==0)}h&&(i.flags|=4)}else l=(o.nodeType===9?o:o.ownerDocument).createTextNode(l),l[tr]=i,i.stateNode=l}return kn(i),null;case 13:if(Yt(nn),l=i.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Jt&&fi!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Eh(),oo(),i.flags|=98560,h=!1;else if(h=Ka(i),l!==null&&l.dehydrated!==null){if(t===null){if(!h)throw Error(n(318));if(h=i.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(n(317));h[tr]=i}else oo(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;kn(i),h=!1}else Ui!==null&&(Uc(Ui),Ui=null),h=!0;if(!h)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(l=l!==null,l!==(t!==null&&t.memoizedState!==null)&&l&&(i.child.flags|=8192,(i.mode&1)!==0&&(t===null||(nn.current&1)!==0?_n===0&&(_n=3):Fc())),i.updateQueue!==null&&(i.flags|=4),kn(i),null);case 4:return co(),Mc(t,i),t===null&&ra(i.stateNode.containerInfo),kn(i),null;case 10:return Ku(i.type._context),kn(i),null;case 17:return Qn(i.type)&&Xa(),kn(i),null;case 19:if(Yt(nn),h=i.memoizedState,h===null)return kn(i),null;if(l=(i.flags&128)!==0,M=h.rendering,M===null)if(l)ga(h,!1);else{if(_n!==0||t!==null&&(t.flags&128)!==0)for(t=i.child;t!==null;){if(M=nl(t),M!==null){for(i.flags|=128,ga(h,!1),l=M.updateQueue,l!==null&&(i.updateQueue=l,i.flags|=4),i.subtreeFlags=0,l=o,o=i.child;o!==null;)h=o,t=l,h.flags&=14680066,M=h.alternate,M===null?(h.childLanes=0,h.lanes=t,h.child=null,h.subtreeFlags=0,h.memoizedProps=null,h.memoizedState=null,h.updateQueue=null,h.dependencies=null,h.stateNode=null):(h.childLanes=M.childLanes,h.lanes=M.lanes,h.child=M.child,h.subtreeFlags=0,h.deletions=null,h.memoizedProps=M.memoizedProps,h.memoizedState=M.memoizedState,h.updateQueue=M.updateQueue,h.type=M.type,t=M.dependencies,h.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),o=o.sibling;return Xt(nn,nn.current&1|2),i.child}t=t.sibling}h.tail!==null&&Y()>mo&&(i.flags|=128,l=!0,ga(h,!1),i.lanes=4194304)}else{if(!l)if(t=nl(M),t!==null){if(i.flags|=128,l=!0,o=t.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),ga(h,!0),h.tail===null&&h.tailMode==="hidden"&&!M.alternate&&!Jt)return kn(i),null}else 2*Y()-h.renderingStartTime>mo&&o!==1073741824&&(i.flags|=128,l=!0,ga(h,!1),i.lanes=4194304);h.isBackwards?(M.sibling=i.child,i.child=M):(o=h.last,o!==null?o.sibling=M:i.child=M,h.last=M)}return h.tail!==null?(i=h.tail,h.rendering=i,h.tail=i.sibling,h.renderingStartTime=Y(),i.sibling=null,o=nn.current,Xt(nn,l?o&1|2:o&1),i):(kn(i),null);case 22:case 23:return Nc(),l=i.memoizedState!==null,t!==null&&t.memoizedState!==null!==l&&(i.flags|=8192),l&&(i.mode&1)!==0?(di&1073741824)!==0&&(kn(i),i.subtreeFlags&6&&(i.flags|=8192)):kn(i),null;case 24:return null;case 25:return null}throw Error(n(156,i.tag))}function Q0(t,i){switch(Wu(i),i.tag){case 1:return Qn(i.type)&&Xa(),t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 3:return co(),Yt(Zn),Yt(On),ic(),t=i.flags,(t&65536)!==0&&(t&128)===0?(i.flags=t&-65537|128,i):null;case 5:return tc(i),null;case 13:if(Yt(nn),t=i.memoizedState,t!==null&&t.dehydrated!==null){if(i.alternate===null)throw Error(n(340));oo()}return t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 19:return Yt(nn),null;case 4:return co(),null;case 10:return Ku(i.type._context),null;case 22:case 23:return Nc(),null;case 24:return null;default:return null}}var fl=!1,zn=!1,J0=typeof WeakSet=="function"?WeakSet:Set,Ye=null;function ho(t,i){var o=t.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(l){on(t,i,l)}else o.current=null}function Ec(t,i,o){try{o()}catch(l){on(t,i,l)}}var Sp=!1;function e_(t,i){if(Nu=fr,t=Jd(),Cu(t)){if("selectionStart"in t)var o={start:t.selectionStart,end:t.selectionEnd};else e:{o=(o=t.ownerDocument)&&o.defaultView||window;var l=o.getSelection&&o.getSelection();if(l&&l.rangeCount!==0){o=l.anchorNode;var f=l.anchorOffset,h=l.focusNode;l=l.focusOffset;try{o.nodeType,h.nodeType}catch{o=null;break e}var M=0,L=-1,k=-1,ne=0,Me=0,Ae=t,ye=null;t:for(;;){for(var Ve;Ae!==o||f!==0&&Ae.nodeType!==3||(L=M+f),Ae!==h||l!==0&&Ae.nodeType!==3||(k=M+l),Ae.nodeType===3&&(M+=Ae.nodeValue.length),(Ve=Ae.firstChild)!==null;)ye=Ae,Ae=Ve;for(;;){if(Ae===t)break t;if(ye===o&&++ne===f&&(L=M),ye===h&&++Me===l&&(k=M),(Ve=Ae.nextSibling)!==null)break;Ae=ye,ye=Ae.parentNode}Ae=Ve}o=L===-1||k===-1?null:{start:L,end:k}}else o=null}o=o||{start:0,end:0}}else o=null;for(Fu={focusedElem:t,selectionRange:o},fr=!1,Ye=i;Ye!==null;)if(i=Ye,t=i.child,(i.subtreeFlags&1028)!==0&&t!==null)t.return=i,Ye=t;else for(;Ye!==null;){i=Ye;try{var Ke=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Ke!==null){var Qe=Ke.memoizedProps,fn=Ke.memoizedState,K=i.stateNode,G=K.getSnapshotBeforeUpdate(i.elementType===i.type?Qe:Ii(i.type,Qe),fn);K.__reactInternalSnapshotBeforeUpdate=G}break;case 3:var Z=i.stateNode.containerInfo;Z.nodeType===1?Z.textContent="":Z.nodeType===9&&Z.documentElement&&Z.removeChild(Z.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(n(163))}}catch(Re){on(i,i.return,Re)}if(t=i.sibling,t!==null){t.return=i.return,Ye=t;break}Ye=i.return}return Ke=Sp,Sp=!1,Ke}function _a(t,i,o){var l=i.updateQueue;if(l=l!==null?l.lastEffect:null,l!==null){var f=l=l.next;do{if((f.tag&t)===t){var h=f.destroy;f.destroy=void 0,h!==void 0&&Ec(i,o,h)}f=f.next}while(f!==l)}}function dl(t,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&t)===t){var l=o.create;o.destroy=l()}o=o.next}while(o!==i)}}function wc(t){var i=t.ref;if(i!==null){var o=t.stateNode;switch(t.tag){case 5:t=o;break;default:t=o}typeof i=="function"?i(t):i.current=t}}function Mp(t){var i=t.alternate;i!==null&&(t.alternate=null,Mp(i)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(i=t.stateNode,i!==null&&(delete i[tr],delete i[oa],delete i[zu],delete i[F0],delete i[O0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Ep(t){return t.tag===5||t.tag===3||t.tag===4}function wp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Ep(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Tc(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(t,i):o.insertBefore(t,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(t,o)):(i=o,i.appendChild(t)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=Ga));else if(l!==4&&(t=t.child,t!==null))for(Tc(t,i,o),t=t.sibling;t!==null;)Tc(t,i,o),t=t.sibling}function Ac(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.insertBefore(t,i):o.appendChild(t);else if(l!==4&&(t=t.child,t!==null))for(Ac(t,i,o),t=t.sibling;t!==null;)Ac(t,i,o),t=t.sibling}var Ln=null,Ni=!1;function jr(t,i,o){for(o=o.child;o!==null;)Tp(t,i,o),o=o.sibling}function Tp(t,i,o){if($e&&typeof $e.onCommitFiberUnmount=="function")try{$e.onCommitFiberUnmount(at,o)}catch{}switch(o.tag){case 5:zn||ho(o,i);case 6:var l=Ln,f=Ni;Ln=null,jr(t,i,o),Ln=l,Ni=f,Ln!==null&&(Ni?(t=Ln,o=o.stateNode,t.nodeType===8?t.parentNode.removeChild(o):t.removeChild(o)):Ln.removeChild(o.stateNode));break;case 18:Ln!==null&&(Ni?(t=Ln,o=o.stateNode,t.nodeType===8?ku(t.parentNode,o):t.nodeType===1&&ku(t,o),Dn(t)):ku(Ln,o.stateNode));break;case 4:l=Ln,f=Ni,Ln=o.stateNode.containerInfo,Ni=!0,jr(t,i,o),Ln=l,Ni=f;break;case 0:case 11:case 14:case 15:if(!zn&&(l=o.updateQueue,l!==null&&(l=l.lastEffect,l!==null))){f=l=l.next;do{var h=f,M=h.destroy;h=h.tag,M!==void 0&&((h&2)!==0||(h&4)!==0)&&Ec(o,i,M),f=f.next}while(f!==l)}jr(t,i,o);break;case 1:if(!zn&&(ho(o,i),l=o.stateNode,typeof l.componentWillUnmount=="function"))try{l.props=o.memoizedProps,l.state=o.memoizedState,l.componentWillUnmount()}catch(L){on(o,i,L)}jr(t,i,o);break;case 21:jr(t,i,o);break;case 22:o.mode&1?(zn=(l=zn)||o.memoizedState!==null,jr(t,i,o),zn=l):jr(t,i,o);break;default:jr(t,i,o)}}function Ap(t){var i=t.updateQueue;if(i!==null){t.updateQueue=null;var o=t.stateNode;o===null&&(o=t.stateNode=new J0),i.forEach(function(l){var f=u_.bind(null,t,l);o.has(l)||(o.add(l),l.then(f,f))})}}function Fi(t,i){var o=i.deletions;if(o!==null)for(var l=0;l<o.length;l++){var f=o[l];try{var h=t,M=i,L=M;e:for(;L!==null;){switch(L.tag){case 5:Ln=L.stateNode,Ni=!1;break e;case 3:Ln=L.stateNode.containerInfo,Ni=!0;break e;case 4:Ln=L.stateNode.containerInfo,Ni=!0;break e}L=L.return}if(Ln===null)throw Error(n(160));Tp(h,M,f),Ln=null,Ni=!1;var k=f.alternate;k!==null&&(k.return=null),f.return=null}catch(ne){on(f,i,ne)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Cp(i,t),i=i.sibling}function Cp(t,i){var o=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Fi(i,t),rr(t),l&4){try{_a(3,t,t.return),dl(3,t)}catch(Qe){on(t,t.return,Qe)}try{_a(5,t,t.return)}catch(Qe){on(t,t.return,Qe)}}break;case 1:Fi(i,t),rr(t),l&512&&o!==null&&ho(o,o.return);break;case 5:if(Fi(i,t),rr(t),l&512&&o!==null&&ho(o,o.return),t.flags&32){var f=t.stateNode;try{mt(f,"")}catch(Qe){on(t,t.return,Qe)}}if(l&4&&(f=t.stateNode,f!=null)){var h=t.memoizedProps,M=o!==null?o.memoizedProps:h,L=t.type,k=t.updateQueue;if(t.updateQueue=null,k!==null)try{L==="input"&&h.type==="radio"&&h.name!=null&&nt(f,h),dt(L,M);var ne=dt(L,h);for(M=0;M<k.length;M+=2){var Me=k[M],Ae=k[M+1];Me==="style"?ft(f,Ae):Me==="dangerouslySetInnerHTML"?He(f,Ae):Me==="children"?mt(f,Ae):D(f,Me,Ae,ne)}switch(L){case"input":ot(f,h);break;case"textarea":ge(f,h);break;case"select":var ye=f._wrapperState.wasMultiple;f._wrapperState.wasMultiple=!!h.multiple;var Ve=h.value;Ve!=null?P(f,!!h.multiple,Ve,!1):ye!==!!h.multiple&&(h.defaultValue!=null?P(f,!!h.multiple,h.defaultValue,!0):P(f,!!h.multiple,h.multiple?[]:"",!1))}f[oa]=h}catch(Qe){on(t,t.return,Qe)}}break;case 6:if(Fi(i,t),rr(t),l&4){if(t.stateNode===null)throw Error(n(162));f=t.stateNode,h=t.memoizedProps;try{f.nodeValue=h}catch(Qe){on(t,t.return,Qe)}}break;case 3:if(Fi(i,t),rr(t),l&4&&o!==null&&o.memoizedState.isDehydrated)try{Dn(i.containerInfo)}catch(Qe){on(t,t.return,Qe)}break;case 4:Fi(i,t),rr(t);break;case 13:Fi(i,t),rr(t),f=t.child,f.flags&8192&&(h=f.memoizedState!==null,f.stateNode.isHidden=h,!h||f.alternate!==null&&f.alternate.memoizedState!==null||(bc=Y())),l&4&&Ap(t);break;case 22:if(Me=o!==null&&o.memoizedState!==null,t.mode&1?(zn=(ne=zn)||Me,Fi(i,t),zn=ne):Fi(i,t),rr(t),l&8192){if(ne=t.memoizedState!==null,(t.stateNode.isHidden=ne)&&!Me&&(t.mode&1)!==0)for(Ye=t,Me=t.child;Me!==null;){for(Ae=Ye=Me;Ye!==null;){switch(ye=Ye,Ve=ye.child,ye.tag){case 0:case 11:case 14:case 15:_a(4,ye,ye.return);break;case 1:ho(ye,ye.return);var Ke=ye.stateNode;if(typeof Ke.componentWillUnmount=="function"){l=ye,o=ye.return;try{i=l,Ke.props=i.memoizedProps,Ke.state=i.memoizedState,Ke.componentWillUnmount()}catch(Qe){on(l,o,Qe)}}break;case 5:ho(ye,ye.return);break;case 22:if(ye.memoizedState!==null){Pp(Ae);continue}}Ve!==null?(Ve.return=ye,Ye=Ve):Pp(Ae)}Me=Me.sibling}e:for(Me=null,Ae=t;;){if(Ae.tag===5){if(Me===null){Me=Ae;try{f=Ae.stateNode,ne?(h=f.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none"):(L=Ae.stateNode,k=Ae.memoizedProps.style,M=k!=null&&k.hasOwnProperty("display")?k.display:null,L.style.display=it("display",M))}catch(Qe){on(t,t.return,Qe)}}}else if(Ae.tag===6){if(Me===null)try{Ae.stateNode.nodeValue=ne?"":Ae.memoizedProps}catch(Qe){on(t,t.return,Qe)}}else if((Ae.tag!==22&&Ae.tag!==23||Ae.memoizedState===null||Ae===t)&&Ae.child!==null){Ae.child.return=Ae,Ae=Ae.child;continue}if(Ae===t)break e;for(;Ae.sibling===null;){if(Ae.return===null||Ae.return===t)break e;Me===Ae&&(Me=null),Ae=Ae.return}Me===Ae&&(Me=null),Ae.sibling.return=Ae.return,Ae=Ae.sibling}}break;case 19:Fi(i,t),rr(t),l&4&&Ap(t);break;case 21:break;default:Fi(i,t),rr(t)}}function rr(t){var i=t.flags;if(i&2){try{e:{for(var o=t.return;o!==null;){if(Ep(o)){var l=o;break e}o=o.return}throw Error(n(160))}switch(l.tag){case 5:var f=l.stateNode;l.flags&32&&(mt(f,""),l.flags&=-33);var h=wp(t);Ac(t,h,f);break;case 3:case 4:var M=l.stateNode.containerInfo,L=wp(t);Tc(t,L,M);break;default:throw Error(n(161))}}catch(k){on(t,t.return,k)}t.flags&=-3}i&4096&&(t.flags&=-4097)}function t_(t,i,o){Ye=t,Rp(t)}function Rp(t,i,o){for(var l=(t.mode&1)!==0;Ye!==null;){var f=Ye,h=f.child;if(f.tag===22&&l){var M=f.memoizedState!==null||fl;if(!M){var L=f.alternate,k=L!==null&&L.memoizedState!==null||zn;L=fl;var ne=zn;if(fl=M,(zn=k)&&!ne)for(Ye=f;Ye!==null;)M=Ye,k=M.child,M.tag===22&&M.memoizedState!==null?Dp(f):k!==null?(k.return=M,Ye=k):Dp(f);for(;h!==null;)Ye=h,Rp(h),h=h.sibling;Ye=f,fl=L,zn=ne}bp(t)}else(f.subtreeFlags&8772)!==0&&h!==null?(h.return=f,Ye=h):bp(t)}}function bp(t){for(;Ye!==null;){var i=Ye;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:zn||dl(5,i);break;case 1:var l=i.stateNode;if(i.flags&4&&!zn)if(o===null)l.componentDidMount();else{var f=i.elementType===i.type?o.memoizedProps:Ii(i.type,o.memoizedProps);l.componentDidUpdate(f,o.memoizedState,l.__reactInternalSnapshotBeforeUpdate)}var h=i.updateQueue;h!==null&&Ph(i,h,l);break;case 3:var M=i.updateQueue;if(M!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Ph(i,M,o)}break;case 5:var L=i.stateNode;if(o===null&&i.flags&4){o=L;var k=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&o.focus();break;case"img":k.src&&(o.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var ne=i.alternate;if(ne!==null){var Me=ne.memoizedState;if(Me!==null){var Ae=Me.dehydrated;Ae!==null&&Dn(Ae)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(n(163))}zn||i.flags&512&&wc(i)}catch(ye){on(i,i.return,ye)}}if(i===t){Ye=null;break}if(o=i.sibling,o!==null){o.return=i.return,Ye=o;break}Ye=i.return}}function Pp(t){for(;Ye!==null;){var i=Ye;if(i===t){Ye=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Ye=o;break}Ye=i.return}}function Dp(t){for(;Ye!==null;){var i=Ye;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{dl(4,i)}catch(k){on(i,o,k)}break;case 1:var l=i.stateNode;if(typeof l.componentDidMount=="function"){var f=i.return;try{l.componentDidMount()}catch(k){on(i,f,k)}}var h=i.return;try{wc(i)}catch(k){on(i,h,k)}break;case 5:var M=i.return;try{wc(i)}catch(k){on(i,M,k)}}}catch(k){on(i,i.return,k)}if(i===t){Ye=null;break}var L=i.sibling;if(L!==null){L.return=i.return,Ye=L;break}Ye=i.return}}var n_=Math.ceil,hl=b.ReactCurrentDispatcher,Cc=b.ReactCurrentOwner,Si=b.ReactCurrentBatchConfig,Ut=0,wn=null,dn=null,Un=0,di=0,po=Hr(0),_n=0,va=null,Ts=0,pl=0,Rc=0,xa=null,ei=null,bc=0,mo=1/0,Sr=null,ml=!1,Pc=null,qr=null,gl=!1,$r=null,_l=0,ya=0,Dc=null,vl=-1,xl=0;function Xn(){return(Ut&6)!==0?Y():vl!==-1?vl:vl=Y()}function Yr(t){return(t.mode&1)===0?1:(Ut&2)!==0&&Un!==0?Un&-Un:k0.transition!==null?(xl===0&&(xl=wt()),xl):(t=Mt,t!==0||(t=window.event,t=t===void 0?16:Br(t.type)),t)}function Oi(t,i,o,l){if(50<ya)throw ya=0,Dc=null,Error(n(185));At(t,o,l),((Ut&2)===0||t!==wn)&&(t===wn&&((Ut&2)===0&&(pl|=o),_n===4&&Kr(t,Un)),ti(t,l),o===1&&Ut===0&&(i.mode&1)===0&&(mo=Y()+500,qa&&Gr()))}function ti(t,i){var o=t.callbackNode;Vt(t,i);var l=Et(t,t===wn?Un:0);if(l===0)o!==null&&A(o),t.callbackNode=null,t.callbackPriority=0;else if(i=l&-l,t.callbackPriority!==i){if(o!=null&&A(o),i===1)t.tag===0?B0(Up.bind(null,t)):vh(Up.bind(null,t)),I0(function(){(Ut&6)===0&&Gr()}),o=null;else{switch(Gt(l)){case 1:o=we;break;case 4:o=Ie;break;case 16:o=ke;break;case 536870912:o=ct;break;default:o=ke}o=Hp(o,Lp.bind(null,t))}t.callbackPriority=i,t.callbackNode=o}}function Lp(t,i){if(vl=-1,xl=0,(Ut&6)!==0)throw Error(n(327));var o=t.callbackNode;if(go()&&t.callbackNode!==o)return null;var l=Et(t,t===wn?Un:0);if(l===0)return null;if((l&30)!==0||(l&t.expiredLanes)!==0||i)i=yl(t,l);else{i=l;var f=Ut;Ut|=2;var h=Np();(wn!==t||Un!==i)&&(Sr=null,mo=Y()+500,Cs(t,i));do try{s_();break}catch(L){Ip(t,L)}while(!0);Yu(),hl.current=h,Ut=f,dn!==null?i=0:(wn=null,Un=0,i=_n)}if(i!==0){if(i===2&&(f=un(t),f!==0&&(l=f,i=Lc(t,f))),i===1)throw o=va,Cs(t,0),Kr(t,l),ti(t,Y()),o;if(i===6)Kr(t,l);else{if(f=t.current.alternate,(l&30)===0&&!i_(f)&&(i=yl(t,l),i===2&&(h=un(t),h!==0&&(l=h,i=Lc(t,h))),i===1))throw o=va,Cs(t,0),Kr(t,l),ti(t,Y()),o;switch(t.finishedWork=f,t.finishedLanes=l,i){case 0:case 1:throw Error(n(345));case 2:Rs(t,ei,Sr);break;case 3:if(Kr(t,l),(l&130023424)===l&&(i=bc+500-Y(),10<i)){if(Et(t,0)!==0)break;if(f=t.suspendedLanes,(f&l)!==l){Xn(),t.pingedLanes|=t.suspendedLanes&f;break}t.timeoutHandle=Bu(Rs.bind(null,t,ei,Sr),i);break}Rs(t,ei,Sr);break;case 4:if(Kr(t,l),(l&4194240)===l)break;for(i=t.eventTimes,f=-1;0<l;){var M=31-se(l);h=1<<M,M=i[M],M>f&&(f=M),l&=~h}if(l=f,l=Y()-l,l=(120>l?120:480>l?480:1080>l?1080:1920>l?1920:3e3>l?3e3:4320>l?4320:1960*n_(l/1960))-l,10<l){t.timeoutHandle=Bu(Rs.bind(null,t,ei,Sr),l);break}Rs(t,ei,Sr);break;case 5:Rs(t,ei,Sr);break;default:throw Error(n(329))}}}return ti(t,Y()),t.callbackNode===o?Lp.bind(null,t):null}function Lc(t,i){var o=xa;return t.current.memoizedState.isDehydrated&&(Cs(t,i).flags|=256),t=yl(t,i),t!==2&&(i=ei,ei=o,i!==null&&Uc(i)),t}function Uc(t){ei===null?ei=t:ei.push.apply(ei,t)}function i_(t){for(var i=t;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var l=0;l<o.length;l++){var f=o[l],h=f.getSnapshot;f=f.value;try{if(!Li(h(),f))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function Kr(t,i){for(i&=~Rc,i&=~pl,t.suspendedLanes|=i,t.pingedLanes&=~i,t=t.expirationTimes;0<i;){var o=31-se(i),l=1<<o;t[o]=-1,i&=~l}}function Up(t){if((Ut&6)!==0)throw Error(n(327));go();var i=Et(t,0);if((i&1)===0)return ti(t,Y()),null;var o=yl(t,i);if(t.tag!==0&&o===2){var l=un(t);l!==0&&(i=l,o=Lc(t,l))}if(o===1)throw o=va,Cs(t,0),Kr(t,i),ti(t,Y()),o;if(o===6)throw Error(n(345));return t.finishedWork=t.current.alternate,t.finishedLanes=i,Rs(t,ei,Sr),ti(t,Y()),null}function Ic(t,i){var o=Ut;Ut|=1;try{return t(i)}finally{Ut=o,Ut===0&&(mo=Y()+500,qa&&Gr())}}function As(t){$r!==null&&$r.tag===0&&(Ut&6)===0&&go();var i=Ut;Ut|=1;var o=Si.transition,l=Mt;try{if(Si.transition=null,Mt=1,t)return t()}finally{Mt=l,Si.transition=o,Ut=i,(Ut&6)===0&&Gr()}}function Nc(){di=po.current,Yt(po)}function Cs(t,i){t.finishedWork=null,t.finishedLanes=0;var o=t.timeoutHandle;if(o!==-1&&(t.timeoutHandle=-1,U0(o)),dn!==null)for(o=dn.return;o!==null;){var l=o;switch(Wu(l),l.tag){case 1:l=l.type.childContextTypes,l!=null&&Xa();break;case 3:co(),Yt(Zn),Yt(On),ic();break;case 5:tc(l);break;case 4:co();break;case 13:Yt(nn);break;case 19:Yt(nn);break;case 10:Ku(l.type._context);break;case 22:case 23:Nc()}o=o.return}if(wn=t,dn=t=Zr(t.current,null),Un=di=i,_n=0,va=null,Rc=pl=Ts=0,ei=xa=null,Ms!==null){for(i=0;i<Ms.length;i++)if(o=Ms[i],l=o.interleaved,l!==null){o.interleaved=null;var f=l.next,h=o.pending;if(h!==null){var M=h.next;h.next=f,l.next=M}o.pending=l}Ms=null}return t}function Ip(t,i){do{var o=dn;try{if(Yu(),il.current=al,rl){for(var l=rn.memoizedState;l!==null;){var f=l.queue;f!==null&&(f.pending=null),l=l.next}rl=!1}if(ws=0,En=gn=rn=null,da=!1,ha=0,Cc.current=null,o===null||o.return===null){_n=1,va=i,dn=null;break}e:{var h=t,M=o.return,L=o,k=i;if(i=Un,L.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var ne=k,Me=L,Ae=Me.tag;if((Me.mode&1)===0&&(Ae===0||Ae===11||Ae===15)){var ye=Me.alternate;ye?(Me.updateQueue=ye.updateQueue,Me.memoizedState=ye.memoizedState,Me.lanes=ye.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var Ve=sp(M);if(Ve!==null){Ve.flags&=-257,op(Ve,M,L,h,i),Ve.mode&1&&rp(h,ne,i),i=Ve,k=ne;var Ke=i.updateQueue;if(Ke===null){var Qe=new Set;Qe.add(k),i.updateQueue=Qe}else Ke.add(k);break e}else{if((i&1)===0){rp(h,ne,i),Fc();break e}k=Error(n(426))}}else if(Jt&&L.mode&1){var fn=sp(M);if(fn!==null){(fn.flags&65536)===0&&(fn.flags|=256),op(fn,M,L,h,i),qu(fo(k,L));break e}}h=k=fo(k,L),_n!==4&&(_n=2),xa===null?xa=[h]:xa.push(h),h=M;do{switch(h.tag){case 3:h.flags|=65536,i&=-i,h.lanes|=i;var K=np(h,k,i);bh(h,K);break e;case 1:L=k;var G=h.type,Z=h.stateNode;if((h.flags&128)===0&&(typeof G.getDerivedStateFromError=="function"||Z!==null&&typeof Z.componentDidCatch=="function"&&(qr===null||!qr.has(Z)))){h.flags|=65536,i&=-i,h.lanes|=i;var Re=ip(h,L,i);bh(h,Re);break e}}h=h.return}while(h!==null)}Op(o)}catch(tt){i=tt,dn===o&&o!==null&&(dn=o=o.return);continue}break}while(!0)}function Np(){var t=hl.current;return hl.current=al,t===null?al:t}function Fc(){(_n===0||_n===3||_n===2)&&(_n=4),wn===null||(Ts&268435455)===0&&(pl&268435455)===0||Kr(wn,Un)}function yl(t,i){var o=Ut;Ut|=2;var l=Np();(wn!==t||Un!==i)&&(Sr=null,Cs(t,i));do try{r_();break}catch(f){Ip(t,f)}while(!0);if(Yu(),Ut=o,hl.current=l,dn!==null)throw Error(n(261));return wn=null,Un=0,_n}function r_(){for(;dn!==null;)Fp(dn)}function s_(){for(;dn!==null&&!q();)Fp(dn)}function Fp(t){var i=zp(t.alternate,t,di);t.memoizedProps=t.pendingProps,i===null?Op(t):dn=i,Cc.current=null}function Op(t){var i=t;do{var o=i.alternate;if(t=i.return,(i.flags&32768)===0){if(o=Z0(o,i,di),o!==null){dn=o;return}}else{if(o=Q0(o,i),o!==null){o.flags&=32767,dn=o;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{_n=6,dn=null;return}}if(i=i.sibling,i!==null){dn=i;return}dn=i=t}while(i!==null);_n===0&&(_n=5)}function Rs(t,i,o){var l=Mt,f=Si.transition;try{Si.transition=null,Mt=1,o_(t,i,o,l)}finally{Si.transition=f,Mt=l}return null}function o_(t,i,o,l){do go();while($r!==null);if((Ut&6)!==0)throw Error(n(327));o=t.finishedWork;var f=t.finishedLanes;if(o===null)return null;if(t.finishedWork=null,t.finishedLanes=0,o===t.current)throw Error(n(177));t.callbackNode=null,t.callbackPriority=0;var h=o.lanes|o.childLanes;if(jt(t,h),t===wn&&(dn=wn=null,Un=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||gl||(gl=!0,Hp(ke,function(){return go(),null})),h=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||h){h=Si.transition,Si.transition=null;var M=Mt;Mt=1;var L=Ut;Ut|=4,Cc.current=null,e_(t,o),Cp(o,t),A0(Fu),fr=!!Nu,Fu=Nu=null,t.current=o,t_(o),te(),Ut=L,Mt=M,Si.transition=h}else t.current=o;if(gl&&(gl=!1,$r=t,_l=f),h=t.pendingLanes,h===0&&(qr=null),H(o.stateNode),ti(t,Y()),i!==null)for(l=t.onRecoverableError,o=0;o<i.length;o++)f=i[o],l(f.value,{componentStack:f.stack,digest:f.digest});if(ml)throw ml=!1,t=Pc,Pc=null,t;return(_l&1)!==0&&t.tag!==0&&go(),h=t.pendingLanes,(h&1)!==0?t===Dc?ya++:(ya=0,Dc=t):ya=0,Gr(),null}function go(){if($r!==null){var t=Gt(_l),i=Si.transition,o=Mt;try{if(Si.transition=null,Mt=16>t?16:t,$r===null)var l=!1;else{if(t=$r,$r=null,_l=0,(Ut&6)!==0)throw Error(n(331));var f=Ut;for(Ut|=4,Ye=t.current;Ye!==null;){var h=Ye,M=h.child;if((Ye.flags&16)!==0){var L=h.deletions;if(L!==null){for(var k=0;k<L.length;k++){var ne=L[k];for(Ye=ne;Ye!==null;){var Me=Ye;switch(Me.tag){case 0:case 11:case 15:_a(8,Me,h)}var Ae=Me.child;if(Ae!==null)Ae.return=Me,Ye=Ae;else for(;Ye!==null;){Me=Ye;var ye=Me.sibling,Ve=Me.return;if(Mp(Me),Me===ne){Ye=null;break}if(ye!==null){ye.return=Ve,Ye=ye;break}Ye=Ve}}}var Ke=h.alternate;if(Ke!==null){var Qe=Ke.child;if(Qe!==null){Ke.child=null;do{var fn=Qe.sibling;Qe.sibling=null,Qe=fn}while(Qe!==null)}}Ye=h}}if((h.subtreeFlags&2064)!==0&&M!==null)M.return=h,Ye=M;else e:for(;Ye!==null;){if(h=Ye,(h.flags&2048)!==0)switch(h.tag){case 0:case 11:case 15:_a(9,h,h.return)}var K=h.sibling;if(K!==null){K.return=h.return,Ye=K;break e}Ye=h.return}}var G=t.current;for(Ye=G;Ye!==null;){M=Ye;var Z=M.child;if((M.subtreeFlags&2064)!==0&&Z!==null)Z.return=M,Ye=Z;else e:for(M=G;Ye!==null;){if(L=Ye,(L.flags&2048)!==0)try{switch(L.tag){case 0:case 11:case 15:dl(9,L)}}catch(tt){on(L,L.return,tt)}if(L===M){Ye=null;break e}var Re=L.sibling;if(Re!==null){Re.return=L.return,Ye=Re;break e}Ye=L.return}}if(Ut=f,Gr(),$e&&typeof $e.onPostCommitFiberRoot=="function")try{$e.onPostCommitFiberRoot(at,t)}catch{}l=!0}return l}finally{Mt=o,Si.transition=i}}return!1}function Bp(t,i,o){i=fo(o,i),i=np(t,i,1),t=Xr(t,i,1),i=Xn(),t!==null&&(At(t,1,i),ti(t,i))}function on(t,i,o){if(t.tag===3)Bp(t,t,o);else for(;i!==null;){if(i.tag===3){Bp(i,t,o);break}else if(i.tag===1){var l=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(qr===null||!qr.has(l))){t=fo(o,t),t=ip(i,t,1),i=Xr(i,t,1),t=Xn(),i!==null&&(At(i,1,t),ti(i,t));break}}i=i.return}}function a_(t,i,o){var l=t.pingCache;l!==null&&l.delete(i),i=Xn(),t.pingedLanes|=t.suspendedLanes&o,wn===t&&(Un&o)===o&&(_n===4||_n===3&&(Un&130023424)===Un&&500>Y()-bc?Cs(t,0):Rc|=o),ti(t,i)}function kp(t,i){i===0&&((t.mode&1)===0?i=1:(i=rt,rt<<=1,(rt&130023424)===0&&(rt=4194304)));var o=Xn();t=vr(t,i),t!==null&&(At(t,i,o),ti(t,o))}function l_(t){var i=t.memoizedState,o=0;i!==null&&(o=i.retryLane),kp(t,o)}function u_(t,i){var o=0;switch(t.tag){case 13:var l=t.stateNode,f=t.memoizedState;f!==null&&(o=f.retryLane);break;case 19:l=t.stateNode;break;default:throw Error(n(314))}l!==null&&l.delete(i),kp(t,o)}var zp;zp=function(t,i,o){if(t!==null)if(t.memoizedProps!==i.pendingProps||Zn.current)Jn=!0;else{if((t.lanes&o)===0&&(i.flags&128)===0)return Jn=!1,K0(t,i,o);Jn=(t.flags&131072)!==0}else Jn=!1,Jt&&(i.flags&1048576)!==0&&xh(i,Ya,i.index);switch(i.lanes=0,i.tag){case 2:var l=i.type;cl(t,i),t=i.pendingProps;var f=io(i,On.current);uo(i,o),f=oc(null,i,l,t,f,o);var h=ac();return i.flags|=1,typeof f=="object"&&f!==null&&typeof f.render=="function"&&f.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Qn(l)?(h=!0,ja(i)):h=!1,i.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,Ju(i),f.updater=ll,i.stateNode=f,f._reactInternals=i,hc(i,l,t,o),i=_c(null,i,l,!0,h,o)):(i.tag=0,Jt&&h&&Gu(i),Wn(null,i,f,o),i=i.child),i;case 16:l=i.elementType;e:{switch(cl(t,i),t=i.pendingProps,f=l._init,l=f(l._payload),i.type=l,f=i.tag=f_(l),t=Ii(l,t),f){case 0:i=gc(null,i,l,t,o);break e;case 1:i=dp(null,i,l,t,o);break e;case 11:i=ap(null,i,l,t,o);break e;case 14:i=lp(null,i,l,Ii(l.type,t),o);break e}throw Error(n(306,l,""))}return i;case 0:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Ii(l,f),gc(t,i,l,f,o);case 1:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Ii(l,f),dp(t,i,l,f,o);case 3:e:{if(hp(i),t===null)throw Error(n(387));l=i.pendingProps,h=i.memoizedState,f=h.element,Rh(t,i),tl(i,l,null,o);var M=i.memoizedState;if(l=M.element,h.isDehydrated)if(h={element:l,isDehydrated:!1,cache:M.cache,pendingSuspenseBoundaries:M.pendingSuspenseBoundaries,transitions:M.transitions},i.updateQueue.baseState=h,i.memoizedState=h,i.flags&256){f=fo(Error(n(423)),i),i=pp(t,i,l,o,f);break e}else if(l!==f){f=fo(Error(n(424)),i),i=pp(t,i,l,o,f);break e}else for(fi=zr(i.stateNode.containerInfo.firstChild),ci=i,Jt=!0,Ui=null,o=Ah(i,null,l,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(oo(),l===f){i=yr(t,i,o);break e}Wn(t,i,l,o)}i=i.child}return i;case 5:return Dh(i),t===null&&ju(i),l=i.type,f=i.pendingProps,h=t!==null?t.memoizedProps:null,M=f.children,Ou(l,f)?M=null:h!==null&&Ou(l,h)&&(i.flags|=32),fp(t,i),Wn(t,i,M,o),i.child;case 6:return t===null&&ju(i),null;case 13:return mp(t,i,o);case 4:return ec(i,i.stateNode.containerInfo),l=i.pendingProps,t===null?i.child=ao(i,null,l,o):Wn(t,i,l,o),i.child;case 11:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Ii(l,f),ap(t,i,l,f,o);case 7:return Wn(t,i,i.pendingProps,o),i.child;case 8:return Wn(t,i,i.pendingProps.children,o),i.child;case 12:return Wn(t,i,i.pendingProps.children,o),i.child;case 10:e:{if(l=i.type._context,f=i.pendingProps,h=i.memoizedProps,M=f.value,Xt(Qa,l._currentValue),l._currentValue=M,h!==null)if(Li(h.value,M)){if(h.children===f.children&&!Zn.current){i=yr(t,i,o);break e}}else for(h=i.child,h!==null&&(h.return=i);h!==null;){var L=h.dependencies;if(L!==null){M=h.child;for(var k=L.firstContext;k!==null;){if(k.context===l){if(h.tag===1){k=xr(-1,o&-o),k.tag=2;var ne=h.updateQueue;if(ne!==null){ne=ne.shared;var Me=ne.pending;Me===null?k.next=k:(k.next=Me.next,Me.next=k),ne.pending=k}}h.lanes|=o,k=h.alternate,k!==null&&(k.lanes|=o),Zu(h.return,o,i),L.lanes|=o;break}k=k.next}}else if(h.tag===10)M=h.type===i.type?null:h.child;else if(h.tag===18){if(M=h.return,M===null)throw Error(n(341));M.lanes|=o,L=M.alternate,L!==null&&(L.lanes|=o),Zu(M,o,i),M=h.sibling}else M=h.child;if(M!==null)M.return=h;else for(M=h;M!==null;){if(M===i){M=null;break}if(h=M.sibling,h!==null){h.return=M.return,M=h;break}M=M.return}h=M}Wn(t,i,f.children,o),i=i.child}return i;case 9:return f=i.type,l=i.pendingProps.children,uo(i,o),f=xi(f),l=l(f),i.flags|=1,Wn(t,i,l,o),i.child;case 14:return l=i.type,f=Ii(l,i.pendingProps),f=Ii(l.type,f),lp(t,i,l,f,o);case 15:return up(t,i,i.type,i.pendingProps,o);case 17:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:Ii(l,f),cl(t,i),i.tag=1,Qn(l)?(t=!0,ja(i)):t=!1,uo(i,o),ep(i,l,f),hc(i,l,f,o),_c(null,i,l,!0,t,o);case 19:return _p(t,i,o);case 22:return cp(t,i,o)}throw Error(n(156,i.tag))};function Hp(t,i){return ps(t,i)}function c_(t,i,o,l){this.tag=t,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Mi(t,i,o,l){return new c_(t,i,o,l)}function Oc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function f_(t){if(typeof t=="function")return Oc(t)?1:0;if(t!=null){if(t=t.$$typeof,t===ie)return 11;if(t===de)return 14}return 2}function Zr(t,i){var o=t.alternate;return o===null?(o=Mi(t.tag,i,t.key,t.mode),o.elementType=t.elementType,o.type=t.type,o.stateNode=t.stateNode,o.alternate=t,t.alternate=o):(o.pendingProps=i,o.type=t.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=t.flags&14680064,o.childLanes=t.childLanes,o.lanes=t.lanes,o.child=t.child,o.memoizedProps=t.memoizedProps,o.memoizedState=t.memoizedState,o.updateQueue=t.updateQueue,i=t.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=t.sibling,o.index=t.index,o.ref=t.ref,o}function Sl(t,i,o,l,f,h){var M=2;if(l=t,typeof t=="function")Oc(t)&&(M=1);else if(typeof t=="string")M=5;else e:switch(t){case N:return bs(o.children,f,h,i);case W:M=8,f|=8;break;case R:return t=Mi(12,o,i,f|2),t.elementType=R,t.lanes=h,t;case Q:return t=Mi(13,o,i,f),t.elementType=Q,t.lanes=h,t;case ue:return t=Mi(19,o,i,f),t.elementType=ue,t.lanes=h,t;case fe:return Ml(o,f,h,i);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case C:M=10;break e;case B:M=9;break e;case ie:M=11;break e;case de:M=14;break e;case le:M=16,l=null;break e}throw Error(n(130,t==null?t:typeof t,""))}return i=Mi(M,o,i,f),i.elementType=t,i.type=l,i.lanes=h,i}function bs(t,i,o,l){return t=Mi(7,t,l,i),t.lanes=o,t}function Ml(t,i,o,l){return t=Mi(22,t,l,i),t.elementType=fe,t.lanes=o,t.stateNode={isHidden:!1},t}function Bc(t,i,o){return t=Mi(6,t,null,i),t.lanes=o,t}function kc(t,i,o){return i=Mi(4,t.children!==null?t.children:[],t.key,i),i.lanes=o,i.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},i}function d_(t,i,o,l,f){this.tag=i,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=bt(0),this.expirationTimes=bt(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=bt(0),this.identifierPrefix=l,this.onRecoverableError=f,this.mutableSourceEagerHydrationData=null}function zc(t,i,o,l,f,h,M,L,k){return t=new d_(t,i,o,L,k),i===1?(i=1,h===!0&&(i|=8)):i=0,h=Mi(3,null,null,i),t.current=h,h.stateNode=t,h.memoizedState={element:l,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ju(h),t}function h_(t,i,o){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:F,key:l==null?null:""+l,children:t,containerInfo:i,implementation:o}}function Vp(t){if(!t)return Vr;t=t._reactInternals;e:{if($n(t)!==t||t.tag!==1)throw Error(n(170));var i=t;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Qn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(n(171))}if(t.tag===1){var o=t.type;if(Qn(o))return gh(t,o,i)}return i}function Gp(t,i,o,l,f,h,M,L,k){return t=zc(o,l,!0,t,f,h,M,L,k),t.context=Vp(null),o=t.current,l=Xn(),f=Yr(o),h=xr(l,f),h.callback=i??null,Xr(o,h,f),t.current.lanes=f,At(t,f,l),ti(t,l),t}function El(t,i,o,l){var f=i.current,h=Xn(),M=Yr(f);return o=Vp(o),i.context===null?i.context=o:i.pendingContext=o,i=xr(h,M),i.payload={element:t},l=l===void 0?null:l,l!==null&&(i.callback=l),t=Xr(f,i,M),t!==null&&(Oi(t,f,M,h),el(t,f,M)),M}function wl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Wp(t,i){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var o=t.retryLane;t.retryLane=o!==0&&o<i?o:i}}function Hc(t,i){Wp(t,i),(t=t.alternate)&&Wp(t,i)}function p_(){return null}var Xp=typeof reportError=="function"?reportError:function(t){console.error(t)};function Vc(t){this._internalRoot=t}Tl.prototype.render=Vc.prototype.render=function(t){var i=this._internalRoot;if(i===null)throw Error(n(409));El(t,i,null,null)},Tl.prototype.unmount=Vc.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var i=t.containerInfo;As(function(){El(null,t,null,null)}),i[pr]=null}};function Tl(t){this._internalRoot=t}Tl.prototype.unstable_scheduleHydration=function(t){if(t){var i=cn();t={blockedOn:null,target:t,priority:i};for(var o=0;o<ui.length&&i!==0&&i<ui[o].priority;o++);ui.splice(o,0,t),o===0&&Wt(t)}};function Gc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Al(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function jp(){}function m_(t,i,o,l,f){if(f){if(typeof l=="function"){var h=l;l=function(){var ne=wl(M);h.call(ne)}}var M=Gp(i,l,t,0,null,!1,!1,"",jp);return t._reactRootContainer=M,t[pr]=M.current,ra(t.nodeType===8?t.parentNode:t),As(),M}for(;f=t.lastChild;)t.removeChild(f);if(typeof l=="function"){var L=l;l=function(){var ne=wl(k);L.call(ne)}}var k=zc(t,0,!1,null,null,!1,!1,"",jp);return t._reactRootContainer=k,t[pr]=k.current,ra(t.nodeType===8?t.parentNode:t),As(function(){El(i,k,o,l)}),k}function Cl(t,i,o,l,f){var h=o._reactRootContainer;if(h){var M=h;if(typeof f=="function"){var L=f;f=function(){var k=wl(M);L.call(k)}}El(i,M,t,f)}else M=m_(o,i,t,f,l);return wl(M)}yn=function(t){switch(t.tag){case 3:var i=t.stateNode;if(i.current.memoizedState.isDehydrated){var o=et(i.pendingLanes);o!==0&&(Zt(i,o|1),ti(i,Y()),(Ut&6)===0&&(mo=Y()+500,Gr()))}break;case 13:As(function(){var l=vr(t,1);if(l!==null){var f=Xn();Oi(l,t,1,f)}}),Hc(t,1)}},zt=function(t){if(t.tag===13){var i=vr(t,134217728);if(i!==null){var o=Xn();Oi(i,t,134217728,o)}Hc(t,134217728)}},Nn=function(t){if(t.tag===13){var i=Yr(t),o=vr(t,i);if(o!==null){var l=Xn();Oi(o,t,i,l)}Hc(t,i)}},cn=function(){return Mt},Fn=function(t,i){var o=Mt;try{return Mt=t,i()}finally{Mt=o}},Le=function(t,i,o){switch(i){case"input":if(ot(t,o),i=o.name,o.type==="radio"&&i!=null){for(o=t;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var l=o[i];if(l!==t&&l.form===t.form){var f=Wa(l);if(!f)throw Error(n(90));St(l),ot(l,f)}}}break;case"textarea":ge(t,o);break;case"select":i=o.value,i!=null&&P(t,!!o.multiple,i,!1)}},Bt=Ic,Kt=As;var g_={usingClientEntryPoint:!1,Events:[aa,to,Wa,Ne,ht,Ic]},Sa={findFiberByHostInstance:vs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},__={bundleType:Sa.bundleType,version:Sa.version,rendererPackageName:Sa.rendererPackageName,rendererConfig:Sa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:b.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=ds(t),t===null?null:t.stateNode},findFiberByHostInstance:Sa.findFiberByHostInstance||p_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Rl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Rl.isDisabled&&Rl.supportsFiber)try{at=Rl.inject(__),$e=Rl}catch{}}return ni.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=g_,ni.createPortal=function(t,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Gc(i))throw Error(n(200));return h_(t,i,null,o)},ni.createRoot=function(t,i){if(!Gc(t))throw Error(n(299));var o=!1,l="",f=Xp;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onRecoverableError!==void 0&&(f=i.onRecoverableError)),i=zc(t,1,!1,null,null,o,!1,l,f),t[pr]=i.current,ra(t.nodeType===8?t.parentNode:t),new Vc(i)},ni.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var i=t._reactInternals;if(i===void 0)throw typeof t.render=="function"?Error(n(188)):(t=Object.keys(t).join(","),Error(n(268,t)));return t=ds(i),t=t===null?null:t.stateNode,t},ni.flushSync=function(t){return As(t)},ni.hydrate=function(t,i,o){if(!Al(i))throw Error(n(200));return Cl(null,t,i,!0,o)},ni.hydrateRoot=function(t,i,o){if(!Gc(t))throw Error(n(405));var l=o!=null&&o.hydratedSources||null,f=!1,h="",M=Xp;if(o!=null&&(o.unstable_strictMode===!0&&(f=!0),o.identifierPrefix!==void 0&&(h=o.identifierPrefix),o.onRecoverableError!==void 0&&(M=o.onRecoverableError)),i=Gp(i,null,t,1,o??null,f,!1,h,M),t[pr]=i.current,ra(t),l)for(t=0;t<l.length;t++)o=l[t],f=o._getVersion,f=f(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,f]:i.mutableSourceEagerHydrationData.push(o,f);return new Tl(i)},ni.render=function(t,i,o){if(!Al(i))throw Error(n(200));return Cl(null,t,i,!1,o)},ni.unmountComponentAtNode=function(t){if(!Al(t))throw Error(n(40));return t._reactRootContainer?(As(function(){Cl(null,null,t,!1,function(){t._reactRootContainer=null,t[pr]=null})}),!0):!1},ni.unstable_batchedUpdates=Ic,ni.unstable_renderSubtreeIntoContainer=function(t,i,o,l){if(!Al(o))throw Error(n(200));if(t==null||t._reactInternals===void 0)throw Error(n(38));return Cl(t,i,o,!1,l)},ni.version="18.3.1-next-f1338f8080-20240426",ni}var em;function C_(){if(em)return jc.exports;em=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),jc.exports=A_(),jc.exports}var tm;function R_(){if(tm)return bl;tm=1;var s=C_();return bl.createRoot=s.createRoot,bl.hydrateRoot=s.hydrateRoot,bl}var b_=R_();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sd="172",P_=0,nm=1,D_=2,pg=1,L_=2,Cr=3,cs=0,si=1,ri=2,ls=0,Fo=1,Df=2,im=3,rm=4,U_=5,Bs=100,I_=101,N_=102,F_=103,O_=104,B_=200,k_=201,z_=202,H_=203,Lf=204,Uf=205,V_=206,G_=207,W_=208,X_=209,j_=210,q_=211,$_=212,Y_=213,K_=214,If=0,Nf=1,Ff=2,ko=3,Of=4,Bf=5,kf=6,zf=7,Md=0,Z_=1,Q_=2,us=0,J_=1,ev=2,tv=3,nv=4,iv=5,rv=6,sv=7,mg=300,zo=301,Ho=302,Hf=303,Vf=304,_u=306,Gf=1e3,zs=1001,Wf=1002,Gi=1003,ov=1004,Pl=1005,or=1006,Yc=1007,Hs=1008,Ir=1009,gg=1010,_g=1011,Da=1012,Ed=1013,Vs=1014,Dr=1015,La=1016,wd=1017,Td=1018,Vo=1020,vg=35902,xg=1021,yg=1022,Vi=1023,Sg=1024,Mg=1025,Oo=1026,Go=1027,Eg=1028,Ad=1029,wg=1030,Cd=1031,Rd=1033,ru=33776,su=33777,ou=33778,au=33779,Xf=35840,jf=35841,qf=35842,$f=35843,Yf=36196,Kf=37492,Zf=37496,Qf=37808,Jf=37809,ed=37810,td=37811,nd=37812,id=37813,rd=37814,sd=37815,od=37816,ad=37817,ld=37818,ud=37819,cd=37820,fd=37821,lu=36492,dd=36494,hd=36495,Tg=36283,pd=36284,md=36285,gd=36286,av=3200,lv=3201,Ag=0,uv=1,as="",Ti="srgb",Wo="srgb-linear",du="linear",Ht="srgb",_o=7680,sm=519,cv=512,fv=513,dv=514,Cg=515,hv=516,pv=517,mv=518,gv=519,om=35044,am="300 es",Lr=2e3,hu=2001;class qo{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(n)===-1&&r[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const u=a.indexOf(n);u!==-1&&a.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let u=0,c=a.length;u<c;u++)a[u].call(this,e);e.target=null}}}const Hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uu=Math.PI/180,_d=180/Math.PI;function Ua(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Hn[s&255]+Hn[s>>8&255]+Hn[s>>16&255]+Hn[s>>24&255]+"-"+Hn[e&255]+Hn[e>>8&255]+"-"+Hn[e>>16&15|64]+Hn[e>>24&255]+"-"+Hn[n&63|128]+Hn[n>>8&255]+"-"+Hn[n>>16&255]+Hn[n>>24&255]+Hn[r&255]+Hn[r>>8&255]+Hn[r>>16&255]+Hn[r>>24&255]).toLowerCase()}function Pt(s,e,n){return Math.max(e,Math.min(n,s))}function _v(s,e){return(s%e+e)%e}function Kc(s,e,n){return(1-n)*s+n*e}function Ea(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ii(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Lt{constructor(e=0,n=0){Lt.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,r=this.y,a=e.elements;return this.x=a[0]*n+a[3]*r+a[6],this.y=a[1]*n+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Pt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y;return n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const r=Math.cos(n),a=Math.sin(n),u=this.x-e.x,c=this.y-e.y;return this.x=u*r-c*a+e.x,this.y=u*a+c*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class vt{constructor(e,n,r,a,u,c,d,p,m){vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,r,a,u,c,d,p,m)}set(e,n,r,a,u,c,d,p,m){const _=this.elements;return _[0]=e,_[1]=a,_[2]=d,_[3]=n,_[4]=u,_[5]=p,_[6]=r,_[7]=c,_[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],this}extractBasis(e,n,r){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,u=this.elements,c=r[0],d=r[3],p=r[6],m=r[1],_=r[4],v=r[7],x=r[2],S=r[5],E=r[8],T=a[0],y=a[3],g=a[6],U=a[1],D=a[4],b=a[7],V=a[2],F=a[5],N=a[8];return u[0]=c*T+d*U+p*V,u[3]=c*y+d*D+p*F,u[6]=c*g+d*b+p*N,u[1]=m*T+_*U+v*V,u[4]=m*y+_*D+v*F,u[7]=m*g+_*b+v*N,u[2]=x*T+S*U+E*V,u[5]=x*y+S*D+E*F,u[8]=x*g+S*b+E*N,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],c=e[4],d=e[5],p=e[6],m=e[7],_=e[8];return n*c*_-n*d*m-r*u*_+r*d*p+a*u*m-a*c*p}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],c=e[4],d=e[5],p=e[6],m=e[7],_=e[8],v=_*c-d*m,x=d*p-_*u,S=m*u-c*p,E=n*v+r*x+a*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/E;return e[0]=v*T,e[1]=(a*m-_*r)*T,e[2]=(d*r-a*c)*T,e[3]=x*T,e[4]=(_*n-a*p)*T,e[5]=(a*u-d*n)*T,e[6]=S*T,e[7]=(r*p-m*n)*T,e[8]=(c*n-r*u)*T,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,r,a,u,c,d){const p=Math.cos(u),m=Math.sin(u);return this.set(r*p,r*m,-r*(p*c+m*d)+c+e,-a*m,a*p,-a*(-m*c+p*d)+d+n,0,0,1),this}scale(e,n){return this.premultiply(Zc.makeScale(e,n)),this}rotate(e){return this.premultiply(Zc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Zc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,r,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<9;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<9;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Zc=new vt;function Rg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function pu(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function vv(){const s=pu("canvas");return s.style.display="block",s}const lm={};function Lo(s){s in lm||(lm[s]=!0,console.warn(s))}function xv(s,e,n){return new Promise(function(r,a){function u(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(u,n);break;default:r()}}setTimeout(u,n)})}function yv(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Sv(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const um=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cm=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mv(){const s={enabled:!0,workingColorSpace:Wo,spaces:{},convert:function(a,u,c){return this.enabled===!1||u===c||!u||!c||(this.spaces[u].transfer===Ht&&(a.r=Ur(a.r),a.g=Ur(a.g),a.b=Ur(a.b)),this.spaces[u].primaries!==this.spaces[c].primaries&&(a.applyMatrix3(this.spaces[u].toXYZ),a.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===Ht&&(a.r=Bo(a.r),a.g=Bo(a.g),a.b=Bo(a.b))),a},fromWorkingColorSpace:function(a,u){return this.convert(a,this.workingColorSpace,u)},toWorkingColorSpace:function(a,u){return this.convert(a,u,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===as?du:this.spaces[a].transfer},getLuminanceCoefficients:function(a,u=this.workingColorSpace){return a.fromArray(this.spaces[u].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,u,c){return a.copy(this.spaces[u].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[Wo]:{primaries:e,whitePoint:r,transfer:du,toXYZ:um,fromXYZ:cm,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ti},outputColorSpaceConfig:{drawingBufferColorSpace:Ti}},[Ti]:{primaries:e,whitePoint:r,transfer:Ht,toXYZ:um,fromXYZ:cm,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ti}}}),s}const Ft=Mv();function Ur(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Bo(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let vo;class Ev{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vo===void 0&&(vo=pu("canvas")),vo.width=e.width,vo.height=e.height;const r=vo.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=vo}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=pu("canvas");n.width=e.width,n.height=e.height;const r=n.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),u=a.data;for(let c=0;c<u.length;c++)u[c]=Ur(u[c]/255)*255;return r.putImageData(a,0,0),n}else if(e.data){const n=e.data.slice(0);for(let r=0;r<n.length;r++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[r]=Math.floor(Ur(n[r]/255)*255):n[r]=Ur(n[r]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let wv=0;class bg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wv++}),this.uuid=Ua(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let u;if(Array.isArray(a)){u=[];for(let c=0,d=a.length;c<d;c++)a[c].isDataTexture?u.push(Qc(a[c].image)):u.push(Qc(a[c]))}else u=Qc(a);r.url=u}return n||(e.images[this.uuid]=r),r}}function Qc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ev.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Tv=0;class oi extends qo{constructor(e=oi.DEFAULT_IMAGE,n=oi.DEFAULT_MAPPING,r=zs,a=zs,u=or,c=Hs,d=Vi,p=Ir,m=oi.DEFAULT_ANISOTROPY,_=as){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tv++}),this.uuid=Ua(),this.name="",this.source=new bg(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=u,this.minFilter=c,this.anisotropy=m,this.format=d,this.internalFormat=null,this.type=p,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),n||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Gf:e.x=e.x-Math.floor(e.x);break;case zs:e.x=e.x<0?0:1;break;case Wf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Gf:e.y=e.y-Math.floor(e.y);break;case zs:e.y=e.y<0?0:1;break;case Wf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}oi.DEFAULT_IMAGE=null;oi.DEFAULT_MAPPING=mg;oi.DEFAULT_ANISOTROPY=1;class ln{constructor(e=0,n=0,r=0,a=1){ln.prototype.isVector4=!0,this.x=e,this.y=n,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,r,a){return this.x=e,this.y=n,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,u=this.w,c=e.elements;return this.x=c[0]*n+c[4]*r+c[8]*a+c[12]*u,this.y=c[1]*n+c[5]*r+c[9]*a+c[13]*u,this.z=c[2]*n+c[6]*r+c[10]*a+c[14]*u,this.w=c[3]*n+c[7]*r+c[11]*a+c[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,r,a,u;const p=e.elements,m=p[0],_=p[4],v=p[8],x=p[1],S=p[5],E=p[9],T=p[2],y=p[6],g=p[10];if(Math.abs(_-x)<.01&&Math.abs(v-T)<.01&&Math.abs(E-y)<.01){if(Math.abs(_+x)<.1&&Math.abs(v+T)<.1&&Math.abs(E+y)<.1&&Math.abs(m+S+g-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const D=(m+1)/2,b=(S+1)/2,V=(g+1)/2,F=(_+x)/4,N=(v+T)/4,W=(E+y)/4;return D>b&&D>V?D<.01?(r=0,a=.707106781,u=.707106781):(r=Math.sqrt(D),a=F/r,u=N/r):b>V?b<.01?(r=.707106781,a=0,u=.707106781):(a=Math.sqrt(b),r=F/a,u=W/a):V<.01?(r=.707106781,a=.707106781,u=0):(u=Math.sqrt(V),r=N/u,a=W/u),this.set(r,a,u,n),this}let U=Math.sqrt((y-E)*(y-E)+(v-T)*(v-T)+(x-_)*(x-_));return Math.abs(U)<.001&&(U=1),this.x=(y-E)/U,this.y=(v-T)/U,this.z=(x-_)/U,this.w=Math.acos((m+S+g-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this.z=Pt(this.z,e.z,n.z),this.w=Pt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this.z=Pt(this.z,e,n),this.w=Pt(this.w,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this.w=e.w+(n.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Av extends qo{constructor(e=1,n=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new ln(0,0,e,n),this.scissorTest=!1,this.viewport=new ln(0,0,e,n);const a={width:e,height:n,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:or,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const u=new oi(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);u.flipY=!1,u.generateMipmaps=r.generateMipmaps,u.internalFormat=r.internalFormat,this.textures=[];const c=r.count;for(let d=0;d<c;d++)this.textures[d]=u.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,r=1){if(this.width!==e||this.height!==n||this.depth!==r){this.width=e,this.height=n,this.depth=r;for(let a=0,u=this.textures.length;a<u;a++)this.textures[a].image.width=e,this.textures[a].image.height=n,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;const n=Object.assign({},e.texture.image);return this.texture.source=new bg(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gs extends Av{constructor(e=1,n=1,r={}){super(e,n,r),this.isWebGLRenderTarget=!0}}class Pg extends oi{constructor(e=null,n=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=Gi,this.minFilter=Gi,this.wrapR=zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cv extends oi{constructor(e=null,n=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=Gi,this.minFilter=Gi,this.wrapR=zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ia{constructor(e=0,n=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=r,this._w=a}static slerpFlat(e,n,r,a,u,c,d){let p=r[a+0],m=r[a+1],_=r[a+2],v=r[a+3];const x=u[c+0],S=u[c+1],E=u[c+2],T=u[c+3];if(d===0){e[n+0]=p,e[n+1]=m,e[n+2]=_,e[n+3]=v;return}if(d===1){e[n+0]=x,e[n+1]=S,e[n+2]=E,e[n+3]=T;return}if(v!==T||p!==x||m!==S||_!==E){let y=1-d;const g=p*x+m*S+_*E+v*T,U=g>=0?1:-1,D=1-g*g;if(D>Number.EPSILON){const V=Math.sqrt(D),F=Math.atan2(V,g*U);y=Math.sin(y*F)/V,d=Math.sin(d*F)/V}const b=d*U;if(p=p*y+x*b,m=m*y+S*b,_=_*y+E*b,v=v*y+T*b,y===1-d){const V=1/Math.sqrt(p*p+m*m+_*_+v*v);p*=V,m*=V,_*=V,v*=V}}e[n]=p,e[n+1]=m,e[n+2]=_,e[n+3]=v}static multiplyQuaternionsFlat(e,n,r,a,u,c){const d=r[a],p=r[a+1],m=r[a+2],_=r[a+3],v=u[c],x=u[c+1],S=u[c+2],E=u[c+3];return e[n]=d*E+_*v+p*S-m*x,e[n+1]=p*E+_*x+m*v-d*S,e[n+2]=m*E+_*S+d*x-p*v,e[n+3]=_*E-d*v-p*x-m*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,r,a){return this._x=e,this._y=n,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const r=e._x,a=e._y,u=e._z,c=e._order,d=Math.cos,p=Math.sin,m=d(r/2),_=d(a/2),v=d(u/2),x=p(r/2),S=p(a/2),E=p(u/2);switch(c){case"XYZ":this._x=x*_*v+m*S*E,this._y=m*S*v-x*_*E,this._z=m*_*E+x*S*v,this._w=m*_*v-x*S*E;break;case"YXZ":this._x=x*_*v+m*S*E,this._y=m*S*v-x*_*E,this._z=m*_*E-x*S*v,this._w=m*_*v+x*S*E;break;case"ZXY":this._x=x*_*v-m*S*E,this._y=m*S*v+x*_*E,this._z=m*_*E+x*S*v,this._w=m*_*v-x*S*E;break;case"ZYX":this._x=x*_*v-m*S*E,this._y=m*S*v+x*_*E,this._z=m*_*E-x*S*v,this._w=m*_*v+x*S*E;break;case"YZX":this._x=x*_*v+m*S*E,this._y=m*S*v+x*_*E,this._z=m*_*E-x*S*v,this._w=m*_*v-x*S*E;break;case"XZY":this._x=x*_*v-m*S*E,this._y=m*S*v-x*_*E,this._z=m*_*E+x*S*v,this._w=m*_*v+x*S*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+c)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const r=n/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,r=n[0],a=n[4],u=n[8],c=n[1],d=n[5],p=n[9],m=n[2],_=n[6],v=n[10],x=r+d+v;if(x>0){const S=.5/Math.sqrt(x+1);this._w=.25/S,this._x=(_-p)*S,this._y=(u-m)*S,this._z=(c-a)*S}else if(r>d&&r>v){const S=2*Math.sqrt(1+r-d-v);this._w=(_-p)/S,this._x=.25*S,this._y=(a+c)/S,this._z=(u+m)/S}else if(d>v){const S=2*Math.sqrt(1+d-r-v);this._w=(u-m)/S,this._x=(a+c)/S,this._y=.25*S,this._z=(p+_)/S}else{const S=2*Math.sqrt(1+v-r-d);this._w=(c-a)/S,this._x=(u+m)/S,this._y=(p+_)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let r=e.dot(n)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,n){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,n/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const r=e._x,a=e._y,u=e._z,c=e._w,d=n._x,p=n._y,m=n._z,_=n._w;return this._x=r*_+c*d+a*m-u*p,this._y=a*_+c*p+u*d-r*m,this._z=u*_+c*m+r*p-a*d,this._w=c*_-r*d-a*p-u*m,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const r=this._x,a=this._y,u=this._z,c=this._w;let d=c*e._w+r*e._x+a*e._y+u*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=c,this._x=r,this._y=a,this._z=u,this;const p=1-d*d;if(p<=Number.EPSILON){const S=1-n;return this._w=S*c+n*this._w,this._x=S*r+n*this._x,this._y=S*a+n*this._y,this._z=S*u+n*this._z,this.normalize(),this}const m=Math.sqrt(p),_=Math.atan2(m,d),v=Math.sin((1-n)*_)/m,x=Math.sin(n*_)/m;return this._w=c*v+this._w*x,this._x=r*v+this._x*x,this._y=a*v+this._y*x,this._z=u*v+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,n,r){return this.copy(e).slerp(n,r)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),u=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),u*Math.sin(n),u*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,n=0,r=0){j.prototype.isVector3=!0,this.x=e,this.y=n,this.z=r}set(e,n,r){return r===void 0&&(r=this.z),this.x=e,this.y=n,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(fm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(fm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,r=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[3]*r+u[6]*a,this.y=u[1]*n+u[4]*r+u[7]*a,this.z=u[2]*n+u[5]*r+u[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,u=e.elements,c=1/(u[3]*n+u[7]*r+u[11]*a+u[15]);return this.x=(u[0]*n+u[4]*r+u[8]*a+u[12])*c,this.y=(u[1]*n+u[5]*r+u[9]*a+u[13])*c,this.z=(u[2]*n+u[6]*r+u[10]*a+u[14])*c,this}applyQuaternion(e){const n=this.x,r=this.y,a=this.z,u=e.x,c=e.y,d=e.z,p=e.w,m=2*(c*a-d*r),_=2*(d*n-u*a),v=2*(u*r-c*n);return this.x=n+p*m+c*v-d*_,this.y=r+p*_+d*m-u*v,this.z=a+p*v+u*_-c*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,r=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[4]*r+u[8]*a,this.y=u[1]*n+u[5]*r+u[9]*a,this.z=u[2]*n+u[6]*r+u[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this.z=Pt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this.z=Pt(this.z,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const r=e.x,a=e.y,u=e.z,c=n.x,d=n.y,p=n.z;return this.x=a*p-u*d,this.y=u*c-r*p,this.z=r*d-a*c,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const r=e.dot(this)/n;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Jc.copy(this).projectOnVector(e),this.sub(Jc)}reflect(e){return this.sub(Jc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Pt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return n*n+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,r){const a=Math.sin(n)*e;return this.x=a*Math.sin(r),this.y=Math.cos(n)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,r){return this.x=e*Math.sin(n),this.y=r,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=r,this.z=a,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,r=Math.sqrt(1-n*n);return this.x=r*Math.cos(e),this.y=n,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jc=new j,fm=new Ia;class Na{constructor(e=new j(1/0,1/0,1/0),n=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n+=3)this.expandByPoint(Bi.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,r=e.count;n<r;n++)this.expandByPoint(Bi.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const r=Bi.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(n===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let c=0,d=u.count;c<d;c++)e.isMesh===!0?e.getVertexPosition(c,Bi):Bi.fromBufferAttribute(u,c),Bi.applyMatrix4(e.matrixWorld),this.expandByPoint(Bi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Dl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Dl.copy(r.boundingBox)),Dl.applyMatrix4(e.matrixWorld),this.union(Dl)}const a=e.children;for(let u=0,c=a.length;u<c;u++)this.expandByObject(a[u],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bi),Bi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,r;return e.normal.x>0?(n=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),n<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wa),Ll.subVectors(this.max,wa),xo.subVectors(e.a,wa),yo.subVectors(e.b,wa),So.subVectors(e.c,wa),Jr.subVectors(yo,xo),es.subVectors(So,yo),Ps.subVectors(xo,So);let n=[0,-Jr.z,Jr.y,0,-es.z,es.y,0,-Ps.z,Ps.y,Jr.z,0,-Jr.x,es.z,0,-es.x,Ps.z,0,-Ps.x,-Jr.y,Jr.x,0,-es.y,es.x,0,-Ps.y,Ps.x,0];return!ef(n,xo,yo,So,Ll)||(n=[1,0,0,0,1,0,0,0,1],!ef(n,xo,yo,So,Ll))?!1:(Ul.crossVectors(Jr,es),n=[Ul.x,Ul.y,Ul.z],ef(n,xo,yo,So,Ll))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mr=[new j,new j,new j,new j,new j,new j,new j,new j],Bi=new j,Dl=new Na,xo=new j,yo=new j,So=new j,Jr=new j,es=new j,Ps=new j,wa=new j,Ll=new j,Ul=new j,Ds=new j;function ef(s,e,n,r,a){for(let u=0,c=s.length-3;u<=c;u+=3){Ds.fromArray(s,u);const d=a.x*Math.abs(Ds.x)+a.y*Math.abs(Ds.y)+a.z*Math.abs(Ds.z),p=e.dot(Ds),m=n.dot(Ds),_=r.dot(Ds);if(Math.max(-Math.max(p,m,_),Math.min(p,m,_))>d)return!1}return!0}const Rv=new Na,Ta=new j,tf=new j;class vu{constructor(e=new j,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const r=this.center;n!==void 0?r.copy(n):Rv.setFromPoints(e).getCenter(r);let a=0;for(let u=0,c=e.length;u<c;u++)a=Math.max(a,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const r=this.center.distanceToSquared(e);return n.copy(e),r>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ta.subVectors(e,this.center);const n=Ta.lengthSq();if(n>this.radius*this.radius){const r=Math.sqrt(n),a=(r-this.radius)*.5;this.center.addScaledVector(Ta,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(tf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ta.copy(e.center).add(tf)),this.expandByPoint(Ta.copy(e.center).sub(tf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Er=new j,nf=new j,Il=new j,ts=new j,rf=new j,Nl=new j,sf=new j;class bd{constructor(e=new j,n=new j(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Er)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const r=n.dot(this.direction);return r<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Er.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Er.copy(this.origin).addScaledVector(this.direction,n),Er.distanceToSquared(e))}distanceSqToSegment(e,n,r,a){nf.copy(e).add(n).multiplyScalar(.5),Il.copy(n).sub(e).normalize(),ts.copy(this.origin).sub(nf);const u=e.distanceTo(n)*.5,c=-this.direction.dot(Il),d=ts.dot(this.direction),p=-ts.dot(Il),m=ts.lengthSq(),_=Math.abs(1-c*c);let v,x,S,E;if(_>0)if(v=c*p-d,x=c*d-p,E=u*_,v>=0)if(x>=-E)if(x<=E){const T=1/_;v*=T,x*=T,S=v*(v+c*x+2*d)+x*(c*v+x+2*p)+m}else x=u,v=Math.max(0,-(c*x+d)),S=-v*v+x*(x+2*p)+m;else x=-u,v=Math.max(0,-(c*x+d)),S=-v*v+x*(x+2*p)+m;else x<=-E?(v=Math.max(0,-(-c*u+d)),x=v>0?-u:Math.min(Math.max(-u,-p),u),S=-v*v+x*(x+2*p)+m):x<=E?(v=0,x=Math.min(Math.max(-u,-p),u),S=x*(x+2*p)+m):(v=Math.max(0,-(c*u+d)),x=v>0?u:Math.min(Math.max(-u,-p),u),S=-v*v+x*(x+2*p)+m);else x=c>0?-u:u,v=Math.max(0,-(c*x+d)),S=-v*v+x*(x+2*p)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,v),a&&a.copy(nf).addScaledVector(Il,x),S}intersectSphere(e,n){Er.subVectors(e.center,this.origin);const r=Er.dot(this.direction),a=Er.dot(Er)-r*r,u=e.radius*e.radius;if(a>u)return null;const c=Math.sqrt(u-a),d=r-c,p=r+c;return p<0?null:d<0?this.at(p,n):this.at(d,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/n;return r>=0?r:null}intersectPlane(e,n){const r=this.distanceToPlane(e);return r===null?null:this.at(r,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let r,a,u,c,d,p;const m=1/this.direction.x,_=1/this.direction.y,v=1/this.direction.z,x=this.origin;return m>=0?(r=(e.min.x-x.x)*m,a=(e.max.x-x.x)*m):(r=(e.max.x-x.x)*m,a=(e.min.x-x.x)*m),_>=0?(u=(e.min.y-x.y)*_,c=(e.max.y-x.y)*_):(u=(e.max.y-x.y)*_,c=(e.min.y-x.y)*_),r>c||u>a||((u>r||isNaN(r))&&(r=u),(c<a||isNaN(a))&&(a=c),v>=0?(d=(e.min.z-x.z)*v,p=(e.max.z-x.z)*v):(d=(e.max.z-x.z)*v,p=(e.min.z-x.z)*v),r>p||d>a)||((d>r||r!==r)&&(r=d),(p<a||a!==a)&&(a=p),a<0)?null:this.at(r>=0?r:a,n)}intersectsBox(e){return this.intersectBox(e,Er)!==null}intersectTriangle(e,n,r,a,u){rf.subVectors(n,e),Nl.subVectors(r,e),sf.crossVectors(rf,Nl);let c=this.direction.dot(sf),d;if(c>0){if(a)return null;d=1}else if(c<0)d=-1,c=-c;else return null;ts.subVectors(this.origin,e);const p=d*this.direction.dot(Nl.crossVectors(ts,Nl));if(p<0)return null;const m=d*this.direction.dot(rf.cross(ts));if(m<0||p+m>c)return null;const _=-d*ts.dot(sf);return _<0?null:this.at(_/c,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class en{constructor(e,n,r,a,u,c,d,p,m,_,v,x,S,E,T,y){en.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,r,a,u,c,d,p,m,_,v,x,S,E,T,y)}set(e,n,r,a,u,c,d,p,m,_,v,x,S,E,T,y){const g=this.elements;return g[0]=e,g[4]=n,g[8]=r,g[12]=a,g[1]=u,g[5]=c,g[9]=d,g[13]=p,g[2]=m,g[6]=_,g[10]=v,g[14]=x,g[3]=S,g[7]=E,g[11]=T,g[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new en().fromArray(this.elements)}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],n[9]=r[9],n[10]=r[10],n[11]=r[11],n[12]=r[12],n[13]=r[13],n[14]=r[14],n[15]=r[15],this}copyPosition(e){const n=this.elements,r=e.elements;return n[12]=r[12],n[13]=r[13],n[14]=r[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,r){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,n,r){return this.set(e.x,n.x,r.x,0,e.y,n.y,r.y,0,e.z,n.z,r.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,r=e.elements,a=1/Mo.setFromMatrixColumn(e,0).length(),u=1/Mo.setFromMatrixColumn(e,1).length(),c=1/Mo.setFromMatrixColumn(e,2).length();return n[0]=r[0]*a,n[1]=r[1]*a,n[2]=r[2]*a,n[3]=0,n[4]=r[4]*u,n[5]=r[5]*u,n[6]=r[6]*u,n[7]=0,n[8]=r[8]*c,n[9]=r[9]*c,n[10]=r[10]*c,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,r=e.x,a=e.y,u=e.z,c=Math.cos(r),d=Math.sin(r),p=Math.cos(a),m=Math.sin(a),_=Math.cos(u),v=Math.sin(u);if(e.order==="XYZ"){const x=c*_,S=c*v,E=d*_,T=d*v;n[0]=p*_,n[4]=-p*v,n[8]=m,n[1]=S+E*m,n[5]=x-T*m,n[9]=-d*p,n[2]=T-x*m,n[6]=E+S*m,n[10]=c*p}else if(e.order==="YXZ"){const x=p*_,S=p*v,E=m*_,T=m*v;n[0]=x+T*d,n[4]=E*d-S,n[8]=c*m,n[1]=c*v,n[5]=c*_,n[9]=-d,n[2]=S*d-E,n[6]=T+x*d,n[10]=c*p}else if(e.order==="ZXY"){const x=p*_,S=p*v,E=m*_,T=m*v;n[0]=x-T*d,n[4]=-c*v,n[8]=E+S*d,n[1]=S+E*d,n[5]=c*_,n[9]=T-x*d,n[2]=-c*m,n[6]=d,n[10]=c*p}else if(e.order==="ZYX"){const x=c*_,S=c*v,E=d*_,T=d*v;n[0]=p*_,n[4]=E*m-S,n[8]=x*m+T,n[1]=p*v,n[5]=T*m+x,n[9]=S*m-E,n[2]=-m,n[6]=d*p,n[10]=c*p}else if(e.order==="YZX"){const x=c*p,S=c*m,E=d*p,T=d*m;n[0]=p*_,n[4]=T-x*v,n[8]=E*v+S,n[1]=v,n[5]=c*_,n[9]=-d*_,n[2]=-m*_,n[6]=S*v+E,n[10]=x-T*v}else if(e.order==="XZY"){const x=c*p,S=c*m,E=d*p,T=d*m;n[0]=p*_,n[4]=-v,n[8]=m*_,n[1]=x*v+T,n[5]=c*_,n[9]=S*v-E,n[2]=E*v-S,n[6]=d*_,n[10]=T*v+x}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bv,e,Pv)}lookAt(e,n,r){const a=this.elements;return hi.subVectors(e,n),hi.lengthSq()===0&&(hi.z=1),hi.normalize(),ns.crossVectors(r,hi),ns.lengthSq()===0&&(Math.abs(r.z)===1?hi.x+=1e-4:hi.z+=1e-4,hi.normalize(),ns.crossVectors(r,hi)),ns.normalize(),Fl.crossVectors(hi,ns),a[0]=ns.x,a[4]=Fl.x,a[8]=hi.x,a[1]=ns.y,a[5]=Fl.y,a[9]=hi.y,a[2]=ns.z,a[6]=Fl.z,a[10]=hi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,u=this.elements,c=r[0],d=r[4],p=r[8],m=r[12],_=r[1],v=r[5],x=r[9],S=r[13],E=r[2],T=r[6],y=r[10],g=r[14],U=r[3],D=r[7],b=r[11],V=r[15],F=a[0],N=a[4],W=a[8],R=a[12],C=a[1],B=a[5],ie=a[9],Q=a[13],ue=a[2],de=a[6],le=a[10],fe=a[14],z=a[3],ce=a[7],ae=a[11],I=a[15];return u[0]=c*F+d*C+p*ue+m*z,u[4]=c*N+d*B+p*de+m*ce,u[8]=c*W+d*ie+p*le+m*ae,u[12]=c*R+d*Q+p*fe+m*I,u[1]=_*F+v*C+x*ue+S*z,u[5]=_*N+v*B+x*de+S*ce,u[9]=_*W+v*ie+x*le+S*ae,u[13]=_*R+v*Q+x*fe+S*I,u[2]=E*F+T*C+y*ue+g*z,u[6]=E*N+T*B+y*de+g*ce,u[10]=E*W+T*ie+y*le+g*ae,u[14]=E*R+T*Q+y*fe+g*I,u[3]=U*F+D*C+b*ue+V*z,u[7]=U*N+D*B+b*de+V*ce,u[11]=U*W+D*ie+b*le+V*ae,u[15]=U*R+D*Q+b*fe+V*I,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[4],a=e[8],u=e[12],c=e[1],d=e[5],p=e[9],m=e[13],_=e[2],v=e[6],x=e[10],S=e[14],E=e[3],T=e[7],y=e[11],g=e[15];return E*(+u*p*v-a*m*v-u*d*x+r*m*x+a*d*S-r*p*S)+T*(+n*p*S-n*m*x+u*c*x-a*c*S+a*m*_-u*p*_)+y*(+n*m*v-n*d*S-u*c*v+r*c*S+u*d*_-r*m*_)+g*(-a*d*_-n*p*v+n*d*x+a*c*v-r*c*x+r*p*_)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=n,a[14]=r),this}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],c=e[4],d=e[5],p=e[6],m=e[7],_=e[8],v=e[9],x=e[10],S=e[11],E=e[12],T=e[13],y=e[14],g=e[15],U=v*y*m-T*x*m+T*p*S-d*y*S-v*p*g+d*x*g,D=E*x*m-_*y*m-E*p*S+c*y*S+_*p*g-c*x*g,b=_*T*m-E*v*m+E*d*S-c*T*S-_*d*g+c*v*g,V=E*v*p-_*T*p-E*d*x+c*T*x+_*d*y-c*v*y,F=n*U+r*D+a*b+u*V;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/F;return e[0]=U*N,e[1]=(T*x*u-v*y*u-T*a*S+r*y*S+v*a*g-r*x*g)*N,e[2]=(d*y*u-T*p*u+T*a*m-r*y*m-d*a*g+r*p*g)*N,e[3]=(v*p*u-d*x*u-v*a*m+r*x*m+d*a*S-r*p*S)*N,e[4]=D*N,e[5]=(_*y*u-E*x*u+E*a*S-n*y*S-_*a*g+n*x*g)*N,e[6]=(E*p*u-c*y*u-E*a*m+n*y*m+c*a*g-n*p*g)*N,e[7]=(c*x*u-_*p*u+_*a*m-n*x*m-c*a*S+n*p*S)*N,e[8]=b*N,e[9]=(E*v*u-_*T*u-E*r*S+n*T*S+_*r*g-n*v*g)*N,e[10]=(c*T*u-E*d*u+E*r*m-n*T*m-c*r*g+n*d*g)*N,e[11]=(_*d*u-c*v*u-_*r*m+n*v*m+c*r*S-n*d*S)*N,e[12]=V*N,e[13]=(_*T*a-E*v*a+E*r*x-n*T*x-_*r*y+n*v*y)*N,e[14]=(E*d*a-c*T*a-E*r*p+n*T*p+c*r*y-n*d*y)*N,e[15]=(c*v*a-_*d*a+_*r*p-n*v*p-c*r*x+n*d*x)*N,this}scale(e){const n=this.elements,r=e.x,a=e.y,u=e.z;return n[0]*=r,n[4]*=a,n[8]*=u,n[1]*=r,n[5]*=a,n[9]*=u,n[2]*=r,n[6]*=a,n[10]*=u,n[3]*=r,n[7]*=a,n[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,r,a))}makeTranslation(e,n,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,r,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,n,-r,0,0,r,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,0,r,0,0,1,0,0,-r,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,0,r,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const r=Math.cos(n),a=Math.sin(n),u=1-r,c=e.x,d=e.y,p=e.z,m=u*c,_=u*d;return this.set(m*c+r,m*d-a*p,m*p+a*d,0,m*d+a*p,_*d+r,_*p-a*c,0,m*p-a*d,_*p+a*c,u*p*p+r,0,0,0,0,1),this}makeScale(e,n,r){return this.set(e,0,0,0,0,n,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,n,r,a,u,c){return this.set(1,r,u,0,e,1,c,0,n,a,1,0,0,0,0,1),this}compose(e,n,r){const a=this.elements,u=n._x,c=n._y,d=n._z,p=n._w,m=u+u,_=c+c,v=d+d,x=u*m,S=u*_,E=u*v,T=c*_,y=c*v,g=d*v,U=p*m,D=p*_,b=p*v,V=r.x,F=r.y,N=r.z;return a[0]=(1-(T+g))*V,a[1]=(S+b)*V,a[2]=(E-D)*V,a[3]=0,a[4]=(S-b)*F,a[5]=(1-(x+g))*F,a[6]=(y+U)*F,a[7]=0,a[8]=(E+D)*N,a[9]=(y-U)*N,a[10]=(1-(x+T))*N,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,n,r){const a=this.elements;let u=Mo.set(a[0],a[1],a[2]).length();const c=Mo.set(a[4],a[5],a[6]).length(),d=Mo.set(a[8],a[9],a[10]).length();this.determinant()<0&&(u=-u),e.x=a[12],e.y=a[13],e.z=a[14],ki.copy(this);const m=1/u,_=1/c,v=1/d;return ki.elements[0]*=m,ki.elements[1]*=m,ki.elements[2]*=m,ki.elements[4]*=_,ki.elements[5]*=_,ki.elements[6]*=_,ki.elements[8]*=v,ki.elements[9]*=v,ki.elements[10]*=v,n.setFromRotationMatrix(ki),r.x=u,r.y=c,r.z=d,this}makePerspective(e,n,r,a,u,c,d=Lr){const p=this.elements,m=2*u/(n-e),_=2*u/(r-a),v=(n+e)/(n-e),x=(r+a)/(r-a);let S,E;if(d===Lr)S=-(c+u)/(c-u),E=-2*c*u/(c-u);else if(d===hu)S=-c/(c-u),E=-c*u/(c-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=m,p[4]=0,p[8]=v,p[12]=0,p[1]=0,p[5]=_,p[9]=x,p[13]=0,p[2]=0,p[6]=0,p[10]=S,p[14]=E,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,n,r,a,u,c,d=Lr){const p=this.elements,m=1/(n-e),_=1/(r-a),v=1/(c-u),x=(n+e)*m,S=(r+a)*_;let E,T;if(d===Lr)E=(c+u)*v,T=-2*v;else if(d===hu)E=u*v,T=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=2*m,p[4]=0,p[8]=0,p[12]=-x,p[1]=0,p[5]=2*_,p[9]=0,p[13]=-S,p[2]=0,p[6]=0,p[10]=T,p[14]=-E,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<16;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<16;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e[n+9]=r[9],e[n+10]=r[10],e[n+11]=r[11],e[n+12]=r[12],e[n+13]=r[13],e[n+14]=r[14],e[n+15]=r[15],e}}const Mo=new j,ki=new en,bv=new j(0,0,0),Pv=new j(1,1,1),ns=new j,Fl=new j,hi=new j,dm=new en,hm=new Ia;class ar{constructor(e=0,n=0,r=0,a=ar.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,r,a=this._order){return this._x=e,this._y=n,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,r=!0){const a=e.elements,u=a[0],c=a[4],d=a[8],p=a[1],m=a[5],_=a[9],v=a[2],x=a[6],S=a[10];switch(n){case"XYZ":this._y=Math.asin(Pt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,S),this._z=Math.atan2(-c,u)):(this._x=Math.atan2(x,m),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,S),this._z=Math.atan2(p,m)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-v,S),this._z=Math.atan2(-c,m)):(this._y=0,this._z=Math.atan2(p,u));break;case"ZYX":this._y=Math.asin(-Pt(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(x,S),this._z=Math.atan2(p,u)):(this._x=0,this._z=Math.atan2(-c,m));break;case"YZX":this._z=Math.asin(Pt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,m),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(d,S));break;case"XZY":this._z=Math.asin(-Pt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(x,m),this._y=Math.atan2(d,u)):(this._x=Math.atan2(-_,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,r){return dm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dm,n,r)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return hm.setFromEuler(this),this.setFromQuaternion(hm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ar.DEFAULT_ORDER="XYZ";class Pd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Dv=0;const pm=new j,Eo=new Ia,wr=new en,Ol=new j,Aa=new j,Lv=new j,Uv=new Ia,mm=new j(1,0,0),gm=new j(0,1,0),_m=new j(0,0,1),vm={type:"added"},Iv={type:"removed"},wo={type:"childadded",child:null},of={type:"childremoved",child:null};class Cn extends qo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dv++}),this.uuid=Ua(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Cn.DEFAULT_UP.clone();const e=new j,n=new ar,r=new Ia,a=new j(1,1,1);function u(){r.setFromEuler(n,!1)}function c(){n.setFromQuaternion(r,void 0,!1)}n._onChange(u),r._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new en},normalMatrix:{value:new vt}}),this.matrix=new en,this.matrixWorld=new en,this.matrixAutoUpdate=Cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Eo.setFromAxisAngle(e,n),this.quaternion.multiply(Eo),this}rotateOnWorldAxis(e,n){return Eo.setFromAxisAngle(e,n),this.quaternion.premultiply(Eo),this}rotateX(e){return this.rotateOnAxis(mm,e)}rotateY(e){return this.rotateOnAxis(gm,e)}rotateZ(e){return this.rotateOnAxis(_m,e)}translateOnAxis(e,n){return pm.copy(e).applyQuaternion(this.quaternion),this.position.add(pm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(mm,e)}translateY(e){return this.translateOnAxis(gm,e)}translateZ(e){return this.translateOnAxis(_m,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wr.copy(this.matrixWorld).invert())}lookAt(e,n,r){e.isVector3?Ol.copy(e):Ol.set(e,n,r);const a=this.parent;this.updateWorldMatrix(!0,!1),Aa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wr.lookAt(Aa,Ol,this.up):wr.lookAt(Ol,Aa,this.up),this.quaternion.setFromRotationMatrix(wr),a&&(wr.extractRotation(a.matrixWorld),Eo.setFromRotationMatrix(wr),this.quaternion.premultiply(Eo.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vm),wo.child=e,this.dispatchEvent(wo),wo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Iv),of.child=e,this.dispatchEvent(of),of.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wr.multiply(e.parent.matrixWorld)),e.applyMatrix4(wr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vm),wo.child=e,this.dispatchEvent(wo),wo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let r=0,a=this.children.length;r<a;r++){const c=this.children[r].getObjectByProperty(e,n);if(c!==void 0)return c}}getObjectsByProperty(e,n,r=[]){this[e]===n&&r.push(this);const a=this.children;for(let u=0,c=a.length;u<c;u++)a[u].getObjectsByProperty(e,n,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Aa,e,Lv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Aa,Uv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].updateMatrixWorld(e)}updateWorldMatrix(e,n){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const a=this.children;for(let u=0,c=a.length;u<c;u++)a[u].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",r={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function u(d,p){return d[p.uuid]===void 0&&(d[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=u(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const p=d.shapes;if(Array.isArray(p))for(let m=0,_=p.length;m<_;m++){const v=p[m];u(e.shapes,v)}else u(e.shapes,p)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let p=0,m=this.material.length;p<m;p++)d.push(u(e.materials,this.material[p]));a.material=d}else a.material=u(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const p=this.animations[d];a.animations.push(u(e.animations,p))}}if(n){const d=c(e.geometries),p=c(e.materials),m=c(e.textures),_=c(e.images),v=c(e.shapes),x=c(e.skeletons),S=c(e.animations),E=c(e.nodes);d.length>0&&(r.geometries=d),p.length>0&&(r.materials=p),m.length>0&&(r.textures=m),_.length>0&&(r.images=_),v.length>0&&(r.shapes=v),x.length>0&&(r.skeletons=x),S.length>0&&(r.animations=S),E.length>0&&(r.nodes=E)}return r.object=a,r;function c(d){const p=[];for(const m in d){const _=d[m];delete _.metadata,p.push(_)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}Cn.DEFAULT_UP=new j(0,1,0);Cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zi=new j,Tr=new j,af=new j,Ar=new j,To=new j,Ao=new j,xm=new j,lf=new j,uf=new j,cf=new j,ff=new ln,df=new ln,hf=new ln;class Ci{constructor(e=new j,n=new j,r=new j){this.a=e,this.b=n,this.c=r}static getNormal(e,n,r,a){a.subVectors(r,n),zi.subVectors(e,n),a.cross(zi);const u=a.lengthSq();return u>0?a.multiplyScalar(1/Math.sqrt(u)):a.set(0,0,0)}static getBarycoord(e,n,r,a,u){zi.subVectors(a,n),Tr.subVectors(r,n),af.subVectors(e,n);const c=zi.dot(zi),d=zi.dot(Tr),p=zi.dot(af),m=Tr.dot(Tr),_=Tr.dot(af),v=c*m-d*d;if(v===0)return u.set(0,0,0),null;const x=1/v,S=(m*p-d*_)*x,E=(c*_-d*p)*x;return u.set(1-S-E,E,S)}static containsPoint(e,n,r,a){return this.getBarycoord(e,n,r,a,Ar)===null?!1:Ar.x>=0&&Ar.y>=0&&Ar.x+Ar.y<=1}static getInterpolation(e,n,r,a,u,c,d,p){return this.getBarycoord(e,n,r,a,Ar)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(u,Ar.x),p.addScaledVector(c,Ar.y),p.addScaledVector(d,Ar.z),p)}static getInterpolatedAttribute(e,n,r,a,u,c){return ff.setScalar(0),df.setScalar(0),hf.setScalar(0),ff.fromBufferAttribute(e,n),df.fromBufferAttribute(e,r),hf.fromBufferAttribute(e,a),c.setScalar(0),c.addScaledVector(ff,u.x),c.addScaledVector(df,u.y),c.addScaledVector(hf,u.z),c}static isFrontFacing(e,n,r,a){return zi.subVectors(r,n),Tr.subVectors(e,n),zi.cross(Tr).dot(a)<0}set(e,n,r){return this.a.copy(e),this.b.copy(n),this.c.copy(r),this}setFromPointsAndIndices(e,n,r,a){return this.a.copy(e[n]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,n,r,a){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zi.subVectors(this.c,this.b),Tr.subVectors(this.a,this.b),zi.cross(Tr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ci.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Ci.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,r,a,u){return Ci.getInterpolation(e,this.a,this.b,this.c,n,r,a,u)}containsPoint(e){return Ci.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ci.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const r=this.a,a=this.b,u=this.c;let c,d;To.subVectors(a,r),Ao.subVectors(u,r),lf.subVectors(e,r);const p=To.dot(lf),m=Ao.dot(lf);if(p<=0&&m<=0)return n.copy(r);uf.subVectors(e,a);const _=To.dot(uf),v=Ao.dot(uf);if(_>=0&&v<=_)return n.copy(a);const x=p*v-_*m;if(x<=0&&p>=0&&_<=0)return c=p/(p-_),n.copy(r).addScaledVector(To,c);cf.subVectors(e,u);const S=To.dot(cf),E=Ao.dot(cf);if(E>=0&&S<=E)return n.copy(u);const T=S*m-p*E;if(T<=0&&m>=0&&E<=0)return d=m/(m-E),n.copy(r).addScaledVector(Ao,d);const y=_*E-S*v;if(y<=0&&v-_>=0&&S-E>=0)return xm.subVectors(u,a),d=(v-_)/(v-_+(S-E)),n.copy(a).addScaledVector(xm,d);const g=1/(y+T+x);return c=T*g,d=x*g,n.copy(r).addScaledVector(To,c).addScaledVector(Ao,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},is={h:0,s:0,l:0},Bl={h:0,s:0,l:0};function pf(s,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?s+(e-s)*6*n:n<1/2?e:n<2/3?s+(e-s)*6*(2/3-n):s}class _t{constructor(e,n,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,r)}set(e,n,r){if(n===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,n,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ti){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ft.toWorkingColorSpace(this,n),this}setRGB(e,n,r,a=Ft.workingColorSpace){return this.r=e,this.g=n,this.b=r,Ft.toWorkingColorSpace(this,a),this}setHSL(e,n,r,a=Ft.workingColorSpace){if(e=_v(e,1),n=Pt(n,0,1),r=Pt(r,0,1),n===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+n):r+n-r*n,c=2*r-u;this.r=pf(c,u,e+1/3),this.g=pf(c,u,e),this.b=pf(c,u,e-1/3)}return Ft.toWorkingColorSpace(this,a),this}setStyle(e,n=Ti){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const c=a[1],d=a[2];switch(c){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,n);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,n);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=a[1],c=u.length;if(c===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,n);if(c===6)return this.setHex(parseInt(u,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ti){const r=Dg[e.toLowerCase()];return r!==void 0?this.setHex(r,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ur(e.r),this.g=Ur(e.g),this.b=Ur(e.b),this}copyLinearToSRGB(e){return this.r=Bo(e.r),this.g=Bo(e.g),this.b=Bo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ti){return Ft.fromWorkingColorSpace(Vn.copy(this),e),Math.round(Pt(Vn.r*255,0,255))*65536+Math.round(Pt(Vn.g*255,0,255))*256+Math.round(Pt(Vn.b*255,0,255))}getHexString(e=Ti){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ft.workingColorSpace){Ft.fromWorkingColorSpace(Vn.copy(this),n);const r=Vn.r,a=Vn.g,u=Vn.b,c=Math.max(r,a,u),d=Math.min(r,a,u);let p,m;const _=(d+c)/2;if(d===c)p=0,m=0;else{const v=c-d;switch(m=_<=.5?v/(c+d):v/(2-c-d),c){case r:p=(a-u)/v+(a<u?6:0);break;case a:p=(u-r)/v+2;break;case u:p=(r-a)/v+4;break}p/=6}return e.h=p,e.s=m,e.l=_,e}getRGB(e,n=Ft.workingColorSpace){return Ft.fromWorkingColorSpace(Vn.copy(this),n),e.r=Vn.r,e.g=Vn.g,e.b=Vn.b,e}getStyle(e=Ti){Ft.fromWorkingColorSpace(Vn.copy(this),e);const n=Vn.r,r=Vn.g,a=Vn.b;return e!==Ti?`color(${e} ${n.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,n,r){return this.getHSL(is),this.setHSL(is.h+e,is.s+n,is.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,r){return this.r=e.r+(n.r-e.r)*r,this.g=e.g+(n.g-e.g)*r,this.b=e.b+(n.b-e.b)*r,this}lerpHSL(e,n){this.getHSL(is),e.getHSL(Bl);const r=Kc(is.h,Bl.h,n),a=Kc(is.s,Bl.s,n),u=Kc(is.l,Bl.l,n);return this.setHSL(r,a,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,r=this.g,a=this.b,u=e.elements;return this.r=u[0]*n+u[3]*r+u[6]*a,this.g=u[1]*n+u[4]*r+u[7]*a,this.b=u[2]*n+u[5]*r+u[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vn=new _t;_t.NAMES=Dg;let Nv=0;class $o extends qo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nv++}),this.uuid=Ua(),this.name="",this.type="Material",this.blending=Fo,this.side=cs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lf,this.blendDst=Uf,this.blendEquation=Bs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=ko,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_o,this.stencilZFail=_o,this.stencilZPass=_o,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const r=e[n];if(r===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const a=this[n];if(a===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[n]=r}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Fo&&(r.blending=this.blending),this.side!==cs&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Lf&&(r.blendSrc=this.blendSrc),this.blendDst!==Uf&&(r.blendDst=this.blendDst),this.blendEquation!==Bs&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==ko&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_o&&(r.stencilFail=this.stencilFail),this.stencilZFail!==_o&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==_o&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(u){const c=[];for(const d in u){const p=u[d];delete p.metadata,c.push(p)}return c}if(n){const u=a(e.textures),c=a(e.images);u.length>0&&(r.textures=u),c.length>0&&(r.images=c)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let r=null;if(n!==null){const a=n.length;r=new Array(a);for(let u=0;u!==a;++u)r[u]=n[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class br extends $o{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ar,this.combine=Md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hn=new j,kl=new Lt;class qn{constructor(e,n,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=r,this.usage=om,this.updateRanges=[],this.gpuType=Dr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,r){e*=this.itemSize,r*=n.itemSize;for(let a=0,u=this.itemSize;a<u;a++)this.array[e+a]=n.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,r=this.count;n<r;n++)kl.fromBufferAttribute(this,n),kl.applyMatrix3(e),this.setXY(n,kl.x,kl.y);else if(this.itemSize===3)for(let n=0,r=this.count;n<r;n++)hn.fromBufferAttribute(this,n),hn.applyMatrix3(e),this.setXYZ(n,hn.x,hn.y,hn.z);return this}applyMatrix4(e){for(let n=0,r=this.count;n<r;n++)hn.fromBufferAttribute(this,n),hn.applyMatrix4(e),this.setXYZ(n,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let n=0,r=this.count;n<r;n++)hn.fromBufferAttribute(this,n),hn.applyNormalMatrix(e),this.setXYZ(n,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let n=0,r=this.count;n<r;n++)hn.fromBufferAttribute(this,n),hn.transformDirection(e),this.setXYZ(n,hn.x,hn.y,hn.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let r=this.array[e*this.itemSize+n];return this.normalized&&(r=Ea(r,this.array)),r}setComponent(e,n,r){return this.normalized&&(r=ii(r,this.array)),this.array[e*this.itemSize+n]=r,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ea(n,this.array)),n}setX(e,n){return this.normalized&&(n=ii(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ea(n,this.array)),n}setY(e,n){return this.normalized&&(n=ii(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ea(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ii(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ea(n,this.array)),n}setW(e,n){return this.normalized&&(n=ii(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,r){return e*=this.itemSize,this.normalized&&(n=ii(n,this.array),r=ii(r,this.array)),this.array[e+0]=n,this.array[e+1]=r,this}setXYZ(e,n,r,a){return e*=this.itemSize,this.normalized&&(n=ii(n,this.array),r=ii(r,this.array),a=ii(a,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,n,r,a,u){return e*=this.itemSize,this.normalized&&(n=ii(n,this.array),r=ii(r,this.array),a=ii(a,this.array),u=ii(u,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==om&&(e.usage=this.usage),e}}class Lg extends qn{constructor(e,n,r){super(new Uint16Array(e),n,r)}}class Ug extends qn{constructor(e,n,r){super(new Uint32Array(e),n,r)}}class sn extends qn{constructor(e,n,r){super(new Float32Array(e),n,r)}}let Fv=0;const Ei=new en,mf=new Cn,Co=new j,pi=new Na,Ca=new Na,An=new j;class an extends qo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fv++}),this.uuid=Ua(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rg(e)?Ug:Lg)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,r=0){this.groups.push({start:e,count:n,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new vt().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ei.makeRotationFromQuaternion(e),this.applyMatrix4(Ei),this}rotateX(e){return Ei.makeRotationX(e),this.applyMatrix4(Ei),this}rotateY(e){return Ei.makeRotationY(e),this.applyMatrix4(Ei),this}rotateZ(e){return Ei.makeRotationZ(e),this.applyMatrix4(Ei),this}translate(e,n,r){return Ei.makeTranslation(e,n,r),this.applyMatrix4(Ei),this}scale(e,n,r){return Ei.makeScale(e,n,r),this.applyMatrix4(Ei),this}lookAt(e){return mf.lookAt(e),mf.updateMatrix(),this.applyMatrix4(mf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Co).negate(),this.translate(Co.x,Co.y,Co.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const r=[];for(let a=0,u=e.length;a<u;a++){const c=e[a];r.push(c.x,c.y,c.z||0)}this.setAttribute("position",new sn(r,3))}else{const r=Math.min(e.length,n.count);for(let a=0;a<r;a++){const u=e[a];n.setXYZ(a,u.x,u.y,u.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Na);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const u=n[r];pi.setFromBufferAttribute(u),this.morphTargetsRelative?(An.addVectors(this.boundingBox.min,pi.min),this.boundingBox.expandByPoint(An),An.addVectors(this.boundingBox.max,pi.max),this.boundingBox.expandByPoint(An)):(this.boundingBox.expandByPoint(pi.min),this.boundingBox.expandByPoint(pi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vu);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const r=this.boundingSphere.center;if(pi.setFromBufferAttribute(e),n)for(let u=0,c=n.length;u<c;u++){const d=n[u];Ca.setFromBufferAttribute(d),this.morphTargetsRelative?(An.addVectors(pi.min,Ca.min),pi.expandByPoint(An),An.addVectors(pi.max,Ca.max),pi.expandByPoint(An)):(pi.expandByPoint(Ca.min),pi.expandByPoint(Ca.max))}pi.getCenter(r);let a=0;for(let u=0,c=e.count;u<c;u++)An.fromBufferAttribute(e,u),a=Math.max(a,r.distanceToSquared(An));if(n)for(let u=0,c=n.length;u<c;u++){const d=n[u],p=this.morphTargetsRelative;for(let m=0,_=d.count;m<_;m++)An.fromBufferAttribute(d,m),p&&(Co.fromBufferAttribute(e,m),An.add(Co)),a=Math.max(a,r.distanceToSquared(An))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=n.position,a=n.normal,u=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qn(new Float32Array(4*r.count),4));const c=this.getAttribute("tangent"),d=[],p=[];for(let W=0;W<r.count;W++)d[W]=new j,p[W]=new j;const m=new j,_=new j,v=new j,x=new Lt,S=new Lt,E=new Lt,T=new j,y=new j;function g(W,R,C){m.fromBufferAttribute(r,W),_.fromBufferAttribute(r,R),v.fromBufferAttribute(r,C),x.fromBufferAttribute(u,W),S.fromBufferAttribute(u,R),E.fromBufferAttribute(u,C),_.sub(m),v.sub(m),S.sub(x),E.sub(x);const B=1/(S.x*E.y-E.x*S.y);isFinite(B)&&(T.copy(_).multiplyScalar(E.y).addScaledVector(v,-S.y).multiplyScalar(B),y.copy(v).multiplyScalar(S.x).addScaledVector(_,-E.x).multiplyScalar(B),d[W].add(T),d[R].add(T),d[C].add(T),p[W].add(y),p[R].add(y),p[C].add(y))}let U=this.groups;U.length===0&&(U=[{start:0,count:e.count}]);for(let W=0,R=U.length;W<R;++W){const C=U[W],B=C.start,ie=C.count;for(let Q=B,ue=B+ie;Q<ue;Q+=3)g(e.getX(Q+0),e.getX(Q+1),e.getX(Q+2))}const D=new j,b=new j,V=new j,F=new j;function N(W){V.fromBufferAttribute(a,W),F.copy(V);const R=d[W];D.copy(R),D.sub(V.multiplyScalar(V.dot(R))).normalize(),b.crossVectors(F,R);const B=b.dot(p[W])<0?-1:1;c.setXYZW(W,D.x,D.y,D.z,B)}for(let W=0,R=U.length;W<R;++W){const C=U[W],B=C.start,ie=C.count;for(let Q=B,ue=B+ie;Q<ue;Q+=3)N(e.getX(Q+0)),N(e.getX(Q+1)),N(e.getX(Q+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new qn(new Float32Array(n.count*3),3),this.setAttribute("normal",r);else for(let x=0,S=r.count;x<S;x++)r.setXYZ(x,0,0,0);const a=new j,u=new j,c=new j,d=new j,p=new j,m=new j,_=new j,v=new j;if(e)for(let x=0,S=e.count;x<S;x+=3){const E=e.getX(x+0),T=e.getX(x+1),y=e.getX(x+2);a.fromBufferAttribute(n,E),u.fromBufferAttribute(n,T),c.fromBufferAttribute(n,y),_.subVectors(c,u),v.subVectors(a,u),_.cross(v),d.fromBufferAttribute(r,E),p.fromBufferAttribute(r,T),m.fromBufferAttribute(r,y),d.add(_),p.add(_),m.add(_),r.setXYZ(E,d.x,d.y,d.z),r.setXYZ(T,p.x,p.y,p.z),r.setXYZ(y,m.x,m.y,m.z)}else for(let x=0,S=n.count;x<S;x+=3)a.fromBufferAttribute(n,x+0),u.fromBufferAttribute(n,x+1),c.fromBufferAttribute(n,x+2),_.subVectors(c,u),v.subVectors(a,u),_.cross(v),r.setXYZ(x+0,_.x,_.y,_.z),r.setXYZ(x+1,_.x,_.y,_.z),r.setXYZ(x+2,_.x,_.y,_.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,r=e.count;n<r;n++)An.fromBufferAttribute(e,n),An.normalize(),e.setXYZ(n,An.x,An.y,An.z)}toNonIndexed(){function e(d,p){const m=d.array,_=d.itemSize,v=d.normalized,x=new m.constructor(p.length*_);let S=0,E=0;for(let T=0,y=p.length;T<y;T++){d.isInterleavedBufferAttribute?S=p[T]*d.data.stride+d.offset:S=p[T]*_;for(let g=0;g<_;g++)x[E++]=m[S++]}return new qn(x,_,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new an,r=this.index.array,a=this.attributes;for(const d in a){const p=a[d],m=e(p,r);n.setAttribute(d,m)}const u=this.morphAttributes;for(const d in u){const p=[],m=u[d];for(let _=0,v=m.length;_<v;_++){const x=m[_],S=e(x,r);p.push(S)}n.morphAttributes[d]=p}n.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let d=0,p=c.length;d<p;d++){const m=c[d];n.addGroup(m.start,m.count,m.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const m in p)p[m]!==void 0&&(e[m]=p[m]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const r=this.attributes;for(const p in r){const m=r[p];e.data.attributes[p]=m.toJSON(e.data)}const a={};let u=!1;for(const p in this.morphAttributes){const m=this.morphAttributes[p],_=[];for(let v=0,x=m.length;v<x;v++){const S=m[v];_.push(S.toJSON(e.data))}_.length>0&&(a[p]=_,u=!0)}u&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(n));const a=e.attributes;for(const m in a){const _=a[m];this.setAttribute(m,_.clone(n))}const u=e.morphAttributes;for(const m in u){const _=[],v=u[m];for(let x=0,S=v.length;x<S;x++)_.push(v[x].clone(n));this.morphAttributes[m]=_}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let m=0,_=c.length;m<_;m++){const v=c[m];this.addGroup(v.start,v.count,v.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ym=new en,Ls=new bd,zl=new vu,Sm=new j,Hl=new j,Vl=new j,Gl=new j,gf=new j,Wl=new j,Mm=new j,Xl=new j;class pn extends Cn{constructor(e=new an,n=new br){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,c=a.length;u<c;u++){const d=a[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}getVertexPosition(e,n){const r=this.geometry,a=r.attributes.position,u=r.morphAttributes.position,c=r.morphTargetsRelative;n.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(u&&d){Wl.set(0,0,0);for(let p=0,m=u.length;p<m;p++){const _=d[p],v=u[p];_!==0&&(gf.fromBufferAttribute(v,e),c?Wl.addScaledVector(gf,_):Wl.addScaledVector(gf.sub(n),_))}n.add(Wl)}return n}raycast(e,n){const r=this.geometry,a=this.material,u=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),zl.copy(r.boundingSphere),zl.applyMatrix4(u),Ls.copy(e.ray).recast(e.near),!(zl.containsPoint(Ls.origin)===!1&&(Ls.intersectSphere(zl,Sm)===null||Ls.origin.distanceToSquared(Sm)>(e.far-e.near)**2))&&(ym.copy(u).invert(),Ls.copy(e.ray).applyMatrix4(ym),!(r.boundingBox!==null&&Ls.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,n,Ls)))}_computeIntersections(e,n,r){let a;const u=this.geometry,c=this.material,d=u.index,p=u.attributes.position,m=u.attributes.uv,_=u.attributes.uv1,v=u.attributes.normal,x=u.groups,S=u.drawRange;if(d!==null)if(Array.isArray(c))for(let E=0,T=x.length;E<T;E++){const y=x[E],g=c[y.materialIndex],U=Math.max(y.start,S.start),D=Math.min(d.count,Math.min(y.start+y.count,S.start+S.count));for(let b=U,V=D;b<V;b+=3){const F=d.getX(b),N=d.getX(b+1),W=d.getX(b+2);a=jl(this,g,e,r,m,_,v,F,N,W),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),T=Math.min(d.count,S.start+S.count);for(let y=E,g=T;y<g;y+=3){const U=d.getX(y),D=d.getX(y+1),b=d.getX(y+2);a=jl(this,c,e,r,m,_,v,U,D,b),a&&(a.faceIndex=Math.floor(y/3),n.push(a))}}else if(p!==void 0)if(Array.isArray(c))for(let E=0,T=x.length;E<T;E++){const y=x[E],g=c[y.materialIndex],U=Math.max(y.start,S.start),D=Math.min(p.count,Math.min(y.start+y.count,S.start+S.count));for(let b=U,V=D;b<V;b+=3){const F=b,N=b+1,W=b+2;a=jl(this,g,e,r,m,_,v,F,N,W),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),T=Math.min(p.count,S.start+S.count);for(let y=E,g=T;y<g;y+=3){const U=y,D=y+1,b=y+2;a=jl(this,c,e,r,m,_,v,U,D,b),a&&(a.faceIndex=Math.floor(y/3),n.push(a))}}}}function Ov(s,e,n,r,a,u,c,d){let p;if(e.side===si?p=r.intersectTriangle(c,u,a,!0,d):p=r.intersectTriangle(a,u,c,e.side===cs,d),p===null)return null;Xl.copy(d),Xl.applyMatrix4(s.matrixWorld);const m=n.ray.origin.distanceTo(Xl);return m<n.near||m>n.far?null:{distance:m,point:Xl.clone(),object:s}}function jl(s,e,n,r,a,u,c,d,p,m){s.getVertexPosition(d,Hl),s.getVertexPosition(p,Vl),s.getVertexPosition(m,Gl);const _=Ov(s,e,n,r,Hl,Vl,Gl,Mm);if(_){const v=new j;Ci.getBarycoord(Mm,Hl,Vl,Gl,v),a&&(_.uv=Ci.getInterpolatedAttribute(a,d,p,m,v,new Lt)),u&&(_.uv1=Ci.getInterpolatedAttribute(u,d,p,m,v,new Lt)),c&&(_.normal=Ci.getInterpolatedAttribute(c,d,p,m,v,new j),_.normal.dot(r.direction)>0&&_.normal.multiplyScalar(-1));const x={a:d,b:p,c:m,normal:new j,materialIndex:0};Ci.getNormal(Hl,Vl,Gl,x.normal),_.face=x,_.barycoord=v}return _}class Ws extends an{constructor(e=1,n=1,r=1,a=1,u=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:r,widthSegments:a,heightSegments:u,depthSegments:c};const d=this;a=Math.floor(a),u=Math.floor(u),c=Math.floor(c);const p=[],m=[],_=[],v=[];let x=0,S=0;E("z","y","x",-1,-1,r,n,e,c,u,0),E("z","y","x",1,-1,r,n,-e,c,u,1),E("x","z","y",1,1,e,r,n,a,c,2),E("x","z","y",1,-1,e,r,-n,a,c,3),E("x","y","z",1,-1,e,n,r,a,u,4),E("x","y","z",-1,-1,e,n,-r,a,u,5),this.setIndex(p),this.setAttribute("position",new sn(m,3)),this.setAttribute("normal",new sn(_,3)),this.setAttribute("uv",new sn(v,2));function E(T,y,g,U,D,b,V,F,N,W,R){const C=b/N,B=V/W,ie=b/2,Q=V/2,ue=F/2,de=N+1,le=W+1;let fe=0,z=0;const ce=new j;for(let ae=0;ae<le;ae++){const I=ae*B-Q;for(let re=0;re<de;re++){const Ge=re*C-ie;ce[T]=Ge*U,ce[y]=I*D,ce[g]=ue,m.push(ce.x,ce.y,ce.z),ce[T]=0,ce[y]=0,ce[g]=F>0?1:-1,_.push(ce.x,ce.y,ce.z),v.push(re/N),v.push(1-ae/W),fe+=1}}for(let ae=0;ae<W;ae++)for(let I=0;I<N;I++){const re=x+I+de*ae,Ge=x+I+de*(ae+1),ee=x+(I+1)+de*(ae+1),me=x+(I+1)+de*ae;p.push(re,Ge,me),p.push(Ge,ee,me),z+=6}d.addGroup(S,z,R),S+=z,x+=fe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ws(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xo(s){const e={};for(const n in s){e[n]={};for(const r in s[n]){const a=s[n][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][r]=null):e[n][r]=a.clone():Array.isArray(a)?e[n][r]=a.slice():e[n][r]=a}}return e}function jn(s){const e={};for(let n=0;n<s.length;n++){const r=Xo(s[n]);for(const a in r)e[a]=r[a]}return e}function Bv(s){const e=[];for(let n=0;n<s.length;n++)e.push(s[n].clone());return e}function Ig(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ft.workingColorSpace}const Ng={clone:Xo,merge:jn};var kv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nr extends $o{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kv,this.fragmentShader=zv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xo(e.uniforms),this.uniformsGroups=Bv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const a in this.uniforms){const c=this.uniforms[a].value;c&&c.isTexture?n.uniforms[a]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?n.uniforms[a]={type:"c",value:c.getHex()}:c&&c.isVector2?n.uniforms[a]={type:"v2",value:c.toArray()}:c&&c.isVector3?n.uniforms[a]={type:"v3",value:c.toArray()}:c&&c.isVector4?n.uniforms[a]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?n.uniforms[a]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?n.uniforms[a]={type:"m4",value:c.toArray()}:n.uniforms[a]={value:c}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(n.extensions=r),n}}class Fg extends Cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new en,this.projectionMatrix=new en,this.projectionMatrixInverse=new en,this.coordinateSystem=Lr}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const rs=new j,Em=new Lt,wm=new Lt;class Ai extends Fg{constructor(e=50,n=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=_d*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(uu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _d*2*Math.atan(Math.tan(uu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,r){rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(rs.x,rs.y).multiplyScalar(-e/rs.z),rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(rs.x,rs.y).multiplyScalar(-e/rs.z)}getViewSize(e,n){return this.getViewBounds(e,Em,wm),n.subVectors(wm,Em)}setViewOffset(e,n,r,a,u,c){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=u,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(uu*.5*this.fov)/this.zoom,r=2*n,a=this.aspect*r,u=-.5*a;const c=this.view;if(this.view!==null&&this.view.enabled){const p=c.fullWidth,m=c.fullHeight;u+=c.offsetX*a/p,n-=c.offsetY*r/m,a*=c.width/p,r*=c.height/m}const d=this.filmOffset;d!==0&&(u+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+a,n,n-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Ro=-90,bo=1;class Hv extends Cn{constructor(e,n,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Ai(Ro,bo,e,n);a.layers=this.layers,this.add(a);const u=new Ai(Ro,bo,e,n);u.layers=this.layers,this.add(u);const c=new Ai(Ro,bo,e,n);c.layers=this.layers,this.add(c);const d=new Ai(Ro,bo,e,n);d.layers=this.layers,this.add(d);const p=new Ai(Ro,bo,e,n);p.layers=this.layers,this.add(p);const m=new Ai(Ro,bo,e,n);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[r,a,u,c,d,p]=n;for(const m of n)this.remove(m);if(e===Lr)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===hu)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of n)this.add(m),m.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,c,d,p,m,_]=this.children,v=e.getRenderTarget(),x=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const T=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(n,u),e.setRenderTarget(r,1,a),e.render(n,c),e.setRenderTarget(r,2,a),e.render(n,d),e.setRenderTarget(r,3,a),e.render(n,p),e.setRenderTarget(r,4,a),e.render(n,m),r.texture.generateMipmaps=T,e.setRenderTarget(r,5,a),e.render(n,_),e.setRenderTarget(v,x,S),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class Og extends oi{constructor(e,n,r,a,u,c,d,p,m,_){e=e!==void 0?e:[],n=n!==void 0?n:zo,super(e,n,r,a,u,c,d,p,m,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Vv extends Gs{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new Og(a,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:or}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new Ws(5,5,5),u=new Nr({name:"CubemapFromEquirect",uniforms:Xo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:si,blending:ls});u.uniforms.tEquirect.value=n;const c=new pn(a,u),d=n.minFilter;return n.minFilter===Hs&&(n.minFilter=or),new Hv(1,10,this).update(e,c),n.minFilter=d,c.geometry.dispose(),c.material.dispose(),this}clear(e,n,r,a){const u=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(n,r,a);e.setRenderTarget(u)}}class Gv extends Cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ar,this.environmentIntensity=1,this.environmentRotation=new ar,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const _f=new j,Wv=new j,Xv=new vt;class Fs{constructor(e=new j(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,r,a){return this.normal.set(e,n,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,r){const a=_f.subVectors(r,n).cross(Wv.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const r=e.delta(_f),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/a;return u<0||u>1?null:n.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const n=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return n<0&&r>0||r<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const r=n||Xv.getNormalMatrix(e),a=this.coplanarPoint(_f).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Us=new vu,ql=new j;class Dd{constructor(e=new Fs,n=new Fs,r=new Fs,a=new Fs,u=new Fs,c=new Fs){this.planes=[e,n,r,a,u,c]}set(e,n,r,a,u,c){const d=this.planes;return d[0].copy(e),d[1].copy(n),d[2].copy(r),d[3].copy(a),d[4].copy(u),d[5].copy(c),this}copy(e){const n=this.planes;for(let r=0;r<6;r++)n[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,n=Lr){const r=this.planes,a=e.elements,u=a[0],c=a[1],d=a[2],p=a[3],m=a[4],_=a[5],v=a[6],x=a[7],S=a[8],E=a[9],T=a[10],y=a[11],g=a[12],U=a[13],D=a[14],b=a[15];if(r[0].setComponents(p-u,x-m,y-S,b-g).normalize(),r[1].setComponents(p+u,x+m,y+S,b+g).normalize(),r[2].setComponents(p+c,x+_,y+E,b+U).normalize(),r[3].setComponents(p-c,x-_,y-E,b-U).normalize(),r[4].setComponents(p-d,x-v,y-T,b-D).normalize(),n===Lr)r[5].setComponents(p+d,x+v,y+T,b+D).normalize();else if(n===hu)r[5].setComponents(d,v,T,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Us)}intersectsSprite(e){return Us.center.set(0,0,0),Us.radius=.7071067811865476,Us.applyMatrix4(e.matrixWorld),this.intersectsSphere(Us)}intersectsSphere(e){const n=this.planes,r=e.center,a=-e.radius;for(let u=0;u<6;u++)if(n[u].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const n=this.planes;for(let r=0;r<6;r++){const a=n[r];if(ql.x=a.normal.x>0?e.max.x:e.min.x,ql.y=a.normal.y>0?e.max.y:e.min.y,ql.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(ql)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let r=0;r<6;r++)if(n[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Hi extends $o{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const mu=new j,gu=new j,Tm=new en,Ra=new bd,$l=new vu,vf=new j,Am=new j;class Pr extends Cn{constructor(e=new an,n=new Hi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,r=[0];for(let a=1,u=n.count;a<u;a++)mu.fromBufferAttribute(n,a-1),gu.fromBufferAttribute(n,a),r[a]=r[a-1],r[a]+=mu.distanceTo(gu);e.setAttribute("lineDistance",new sn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const r=this.geometry,a=this.matrixWorld,u=e.params.Line.threshold,c=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),$l.copy(r.boundingSphere),$l.applyMatrix4(a),$l.radius+=u,e.ray.intersectsSphere($l)===!1)return;Tm.copy(a).invert(),Ra.copy(e.ray).applyMatrix4(Tm);const d=u/((this.scale.x+this.scale.y+this.scale.z)/3),p=d*d,m=this.isLineSegments?2:1,_=r.index,x=r.attributes.position;if(_!==null){const S=Math.max(0,c.start),E=Math.min(_.count,c.start+c.count);for(let T=S,y=E-1;T<y;T+=m){const g=_.getX(T),U=_.getX(T+1),D=Yl(this,e,Ra,p,g,U);D&&n.push(D)}if(this.isLineLoop){const T=_.getX(E-1),y=_.getX(S),g=Yl(this,e,Ra,p,T,y);g&&n.push(g)}}else{const S=Math.max(0,c.start),E=Math.min(x.count,c.start+c.count);for(let T=S,y=E-1;T<y;T+=m){const g=Yl(this,e,Ra,p,T,T+1);g&&n.push(g)}if(this.isLineLoop){const T=Yl(this,e,Ra,p,E-1,S);T&&n.push(T)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,c=a.length;u<c;u++){const d=a[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}}function Yl(s,e,n,r,a,u){const c=s.geometry.attributes.position;if(mu.fromBufferAttribute(c,a),gu.fromBufferAttribute(c,u),n.distanceSqToSegment(mu,gu,vf,Am)>r)return;vf.applyMatrix4(s.matrixWorld);const p=e.ray.origin.distanceTo(vf);if(!(p<e.near||p>e.far))return{distance:p,point:Am.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const Cm=new j,Rm=new j;class bm extends Pr{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,r=[];for(let a=0,u=n.count;a<u;a+=2)Cm.fromBufferAttribute(n,a),Rm.fromBufferAttribute(n,a+1),r[a]=a===0?0:r[a-1],r[a+1]=r[a]+Cm.distanceTo(Rm);e.setAttribute("lineDistance",new sn(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jv extends Pr{constructor(e,n){super(e,n),this.isLineLoop=!0,this.type="LineLoop"}}class Io extends Cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Bg extends oi{constructor(e,n,r,a,u,c,d,p,m,_=Oo){if(_!==Oo&&_!==Go)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&_===Oo&&(r=Vs),r===void 0&&_===Go&&(r=Vo),super(null,a,u,c,d,p,_,r,m),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=d!==void 0?d:Gi,this.minFilter=p!==void 0?p:Gi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class Ld extends an{constructor(e=1,n=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:r,thetaLength:a},n=Math.max(3,n);const u=[],c=[],d=[],p=[],m=new j,_=new Lt;c.push(0,0,0),d.push(0,0,1),p.push(.5,.5);for(let v=0,x=3;v<=n;v++,x+=3){const S=r+v/n*a;m.x=e*Math.cos(S),m.y=e*Math.sin(S),c.push(m.x,m.y,m.z),d.push(0,0,1),_.x=(c[x]/e+1)/2,_.y=(c[x+1]/e+1)/2,p.push(_.x,_.y)}for(let v=1;v<=n;v++)u.push(v,v+1,0);this.setIndex(u),this.setAttribute("position",new sn(c,3)),this.setAttribute("normal",new sn(d,3)),this.setAttribute("uv",new sn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ld(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ud extends an{constructor(e=1,n=1,r=1,a=32,u=1,c=!1,d=0,p=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:r,radialSegments:a,heightSegments:u,openEnded:c,thetaStart:d,thetaLength:p};const m=this;a=Math.floor(a),u=Math.floor(u);const _=[],v=[],x=[],S=[];let E=0;const T=[],y=r/2;let g=0;U(),c===!1&&(e>0&&D(!0),n>0&&D(!1)),this.setIndex(_),this.setAttribute("position",new sn(v,3)),this.setAttribute("normal",new sn(x,3)),this.setAttribute("uv",new sn(S,2));function U(){const b=new j,V=new j;let F=0;const N=(n-e)/r;for(let W=0;W<=u;W++){const R=[],C=W/u,B=C*(n-e)+e;for(let ie=0;ie<=a;ie++){const Q=ie/a,ue=Q*p+d,de=Math.sin(ue),le=Math.cos(ue);V.x=B*de,V.y=-C*r+y,V.z=B*le,v.push(V.x,V.y,V.z),b.set(de,N,le).normalize(),x.push(b.x,b.y,b.z),S.push(Q,1-C),R.push(E++)}T.push(R)}for(let W=0;W<a;W++)for(let R=0;R<u;R++){const C=T[R][W],B=T[R+1][W],ie=T[R+1][W+1],Q=T[R][W+1];(e>0||R!==0)&&(_.push(C,B,Q),F+=3),(n>0||R!==u-1)&&(_.push(B,ie,Q),F+=3)}m.addGroup(g,F,0),g+=F}function D(b){const V=E,F=new Lt,N=new j;let W=0;const R=b===!0?e:n,C=b===!0?1:-1;for(let ie=1;ie<=a;ie++)v.push(0,y*C,0),x.push(0,C,0),S.push(.5,.5),E++;const B=E;for(let ie=0;ie<=a;ie++){const ue=ie/a*p+d,de=Math.cos(ue),le=Math.sin(ue);N.x=R*le,N.y=y*C,N.z=R*de,v.push(N.x,N.y,N.z),x.push(0,C,0),F.x=de*.5+.5,F.y=le*.5*C+.5,S.push(F.x,F.y),E++}for(let ie=0;ie<a;ie++){const Q=V+ie,ue=B+ie;b===!0?_.push(ue,ue+1,Q):_.push(ue+1,ue,Q),W+=3}m.addGroup(g,W,b===!0?1:2),g+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ud(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Kl=new j,Zl=new j,xf=new j,Ql=new Ci;class Pm extends an{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const a=Math.pow(10,4),u=Math.cos(uu*n),c=e.getIndex(),d=e.getAttribute("position"),p=c?c.count:d.count,m=[0,0,0],_=["a","b","c"],v=new Array(3),x={},S=[];for(let E=0;E<p;E+=3){c?(m[0]=c.getX(E),m[1]=c.getX(E+1),m[2]=c.getX(E+2)):(m[0]=E,m[1]=E+1,m[2]=E+2);const{a:T,b:y,c:g}=Ql;if(T.fromBufferAttribute(d,m[0]),y.fromBufferAttribute(d,m[1]),g.fromBufferAttribute(d,m[2]),Ql.getNormal(xf),v[0]=`${Math.round(T.x*a)},${Math.round(T.y*a)},${Math.round(T.z*a)}`,v[1]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,v[2]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,!(v[0]===v[1]||v[1]===v[2]||v[2]===v[0]))for(let U=0;U<3;U++){const D=(U+1)%3,b=v[U],V=v[D],F=Ql[_[U]],N=Ql[_[D]],W=`${b}_${V}`,R=`${V}_${b}`;R in x&&x[R]?(xf.dot(x[R].normal)<=u&&(S.push(F.x,F.y,F.z),S.push(N.x,N.y,N.z)),x[R]=null):W in x||(x[W]={index0:m[U],index1:m[D],normal:xf.clone()})}}for(const E in x)if(x[E]){const{index0:T,index1:y}=x[E];Kl.fromBufferAttribute(d,T),Zl.fromBufferAttribute(d,y),S.push(Kl.x,Kl.y,Kl.z),S.push(Zl.x,Zl.y,Zl.z)}this.setAttribute("position",new sn(S,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class jo extends an{constructor(e=1,n=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:r,heightSegments:a};const u=e/2,c=n/2,d=Math.floor(r),p=Math.floor(a),m=d+1,_=p+1,v=e/d,x=n/p,S=[],E=[],T=[],y=[];for(let g=0;g<_;g++){const U=g*x-c;for(let D=0;D<m;D++){const b=D*v-u;E.push(b,-U,0),T.push(0,0,1),y.push(D/d),y.push(1-g/p)}}for(let g=0;g<p;g++)for(let U=0;U<d;U++){const D=U+m*g,b=U+m*(g+1),V=U+1+m*(g+1),F=U+1+m*g;S.push(D,b,F),S.push(b,V,F)}this.setIndex(S),this.setAttribute("position",new sn(E,3)),this.setAttribute("normal",new sn(T,3)),this.setAttribute("uv",new sn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jo(e.width,e.height,e.widthSegments,e.heightSegments)}}class Id extends an{constructor(e=.5,n=1,r=32,a=1,u=0,c=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:r,phiSegments:a,thetaStart:u,thetaLength:c},r=Math.max(3,r),a=Math.max(1,a);const d=[],p=[],m=[],_=[];let v=e;const x=(n-e)/a,S=new j,E=new Lt;for(let T=0;T<=a;T++){for(let y=0;y<=r;y++){const g=u+y/r*c;S.x=v*Math.cos(g),S.y=v*Math.sin(g),p.push(S.x,S.y,S.z),m.push(0,0,1),E.x=(S.x/n+1)/2,E.y=(S.y/n+1)/2,_.push(E.x,E.y)}v+=x}for(let T=0;T<a;T++){const y=T*(r+1);for(let g=0;g<r;g++){const U=g+y,D=U,b=U+r+1,V=U+r+2,F=U+1;d.push(D,b,F),d.push(b,V,F)}}this.setIndex(d),this.setAttribute("position",new sn(p,3)),this.setAttribute("normal",new sn(m,3)),this.setAttribute("uv",new sn(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Id(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Pa extends an{constructor(e=1,n=32,r=16,a=0,u=Math.PI*2,c=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:r,phiStart:a,phiLength:u,thetaStart:c,thetaLength:d},n=Math.max(3,Math.floor(n)),r=Math.max(2,Math.floor(r));const p=Math.min(c+d,Math.PI);let m=0;const _=[],v=new j,x=new j,S=[],E=[],T=[],y=[];for(let g=0;g<=r;g++){const U=[],D=g/r;let b=0;g===0&&c===0?b=.5/n:g===r&&p===Math.PI&&(b=-.5/n);for(let V=0;V<=n;V++){const F=V/n;v.x=-e*Math.cos(a+F*u)*Math.sin(c+D*d),v.y=e*Math.cos(c+D*d),v.z=e*Math.sin(a+F*u)*Math.sin(c+D*d),E.push(v.x,v.y,v.z),x.copy(v).normalize(),T.push(x.x,x.y,x.z),y.push(F+b,1-D),U.push(m++)}_.push(U)}for(let g=0;g<r;g++)for(let U=0;U<n;U++){const D=_[g][U+1],b=_[g][U],V=_[g+1][U],F=_[g+1][U+1];(g!==0||c>0)&&S.push(D,b,F),(g!==r-1||p<Math.PI)&&S.push(b,V,F)}this.setIndex(S),this.setAttribute("position",new sn(E,3)),this.setAttribute("normal",new sn(T,3)),this.setAttribute("uv",new sn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pa(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class yf extends $o{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ag,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ar,this.combine=Md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qv extends $o{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=av,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $v extends $o{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class kg extends Cn{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const Sf=new en,Dm=new j,Lm=new j;class Yv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new en,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dd,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new ln(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,r=this.matrix;Dm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Dm),Lm.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Lm),n.updateMatrixWorld(),Sf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sf),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Sf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class zg extends Fg{constructor(e=-1,n=1,r=1,a=-1,u=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=r,this.bottom=a,this.near=u,this.far=c,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,r,a,u,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=u,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let u=r-e,c=r+e,d=a+n,p=a-n;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=m*this.view.offsetX,c=u+m*this.view.width,d-=_*this.view.offsetY,p=d-_*this.view.height}this.projectionMatrix.makeOrthographic(u,c,d,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class Kv extends Yv{constructor(){super(new zg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Zv extends kg{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Cn.DEFAULT_UP),this.updateMatrix(),this.target=new Cn,this.shadow=new Kv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Qv extends kg{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class Jv extends Ai{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}const Um=new en;class ex{constructor(e,n,r=0,a=1/0){this.ray=new bd(e,n),this.near=r,this.far=a,this.camera=null,this.layers=new Pd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return Um.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Um),this}intersectObject(e,n=!0,r=[]){return vd(e,this,r,n),r.sort(Im),r}intersectObjects(e,n=!0,r=[]){for(let a=0,u=e.length;a<u;a++)vd(e[a],this,r,n);return r.sort(Im),r}}function Im(s,e){return s.distance-e.distance}function vd(s,e,n,r){let a=!0;if(s.layers.test(e.layers)&&s.raycast(e,n)===!1&&(a=!1),a===!0&&r===!0){const u=s.children;for(let c=0,d=u.length;c<d;c++)vd(u[c],e,n,!0)}}const Nm=new j;let Jl,Mf;class tx extends Cn{constructor(e=new j(0,0,1),n=new j(0,0,0),r=1,a=16776960,u=r*.2,c=u*.2){super(),this.type="ArrowHelper",Jl===void 0&&(Jl=new an,Jl.setAttribute("position",new sn([0,0,0,0,1,0],3)),Mf=new Ud(0,.5,1,5,1),Mf.translate(0,-.5,0)),this.position.copy(n),this.line=new Pr(Jl,new Hi({color:a,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new pn(Mf,new br({color:a,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(r,u,c)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Nm.set(e.z,0,-e.x).normalize();const n=Math.acos(e.y);this.quaternion.setFromAxisAngle(Nm,n)}}setLength(e,n=e*.2,r=n*.2){this.line.scale.set(1,Math.max(1e-4,e-n),1),this.line.updateMatrix(),this.cone.scale.set(r,n,r),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}function Fm(s,e,n,r){const a=nx(r);switch(n){case xg:return s*e;case Sg:return s*e;case Mg:return s*e*2;case Eg:return s*e/a.components*a.byteLength;case Ad:return s*e/a.components*a.byteLength;case wg:return s*e*2/a.components*a.byteLength;case Cd:return s*e*2/a.components*a.byteLength;case yg:return s*e*3/a.components*a.byteLength;case Vi:return s*e*4/a.components*a.byteLength;case Rd:return s*e*4/a.components*a.byteLength;case ru:case su:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ou:case au:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case jf:case $f:return Math.max(s,16)*Math.max(e,8)/4;case Xf:case qf:return Math.max(s,8)*Math.max(e,8)/2;case Yf:case Kf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Zf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Jf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ed:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case td:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case nd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case id:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case rd:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case sd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case od:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ad:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case ld:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ud:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case cd:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case fd:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case lu:case dd:case hd:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Tg:case pd:return Math.ceil(s/4)*Math.ceil(e/4)*8;case md:case gd:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function nx(s){switch(s){case Ir:case gg:return{byteLength:1,components:1};case Da:case _g:case La:return{byteLength:2,components:1};case wd:case Td:return{byteLength:2,components:4};case Vs:case Ed:case Dr:return{byteLength:4,components:1};case vg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sd);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hg(){let s=null,e=!1,n=null,r=null;function a(u,c){n(u,c),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&n!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){n=u},setContext:function(u){s=u}}}function ix(s){const e=new WeakMap;function n(d,p){const m=d.array,_=d.usage,v=m.byteLength,x=s.createBuffer();s.bindBuffer(p,x),s.bufferData(p,m,_),d.onUploadCallback();let S;if(m instanceof Float32Array)S=s.FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)S=s.SHORT;else if(m instanceof Uint32Array)S=s.UNSIGNED_INT;else if(m instanceof Int32Array)S=s.INT;else if(m instanceof Int8Array)S=s.BYTE;else if(m instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:x,type:S,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:v}}function r(d,p,m){const _=p.array,v=p.updateRanges;if(s.bindBuffer(m,d),v.length===0)s.bufferSubData(m,0,_);else{v.sort((S,E)=>S.start-E.start);let x=0;for(let S=1;S<v.length;S++){const E=v[x],T=v[S];T.start<=E.start+E.count+1?E.count=Math.max(E.count,T.start+T.count-E.start):(++x,v[x]=T)}v.length=x+1;for(let S=0,E=v.length;S<E;S++){const T=v[S];s.bufferSubData(m,T.start*_.BYTES_PER_ELEMENT,_,T.start,T.count)}p.clearUpdateRanges()}p.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function u(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=e.get(d);p&&(s.deleteBuffer(p.buffer),e.delete(d))}function c(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=e.get(d);(!_||_.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=e.get(d);if(m===void 0)e.set(d,n(d,p));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,d,p),m.version=d.version}}return{get:a,remove:u,update:c}}var rx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ox=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ax=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ux=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,hx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,px=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_x=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,xx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,yx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ex=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ax=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Cx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Rx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Px=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ux=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ix="gl_FragColor = linearToOutputTexel( gl_FragColor );",Nx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ox=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,kx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Hx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,jx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$x=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Kx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Zx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ey=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ty=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ny=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,iy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ry=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,sy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,oy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ay=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ly=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,py=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,my=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_y=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,My=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ey=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ty=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ay=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Cy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ry=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,by=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Py=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ly=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Uy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Iy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ny=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Oy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,By=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ky=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,zy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Hy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Vy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Gy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wy=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Xy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jy=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$y=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ky=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zy=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Qy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Jy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,eS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,nS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const iS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,dS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,hS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,pS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_S=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,vS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,SS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,MS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ES=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,wS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,TS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,AS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,CS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,RS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,LS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,US=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,IS=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,NS=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,FS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yt={alphahash_fragment:rx,alphahash_pars_fragment:sx,alphamap_fragment:ox,alphamap_pars_fragment:ax,alphatest_fragment:lx,alphatest_pars_fragment:ux,aomap_fragment:cx,aomap_pars_fragment:fx,batching_pars_vertex:dx,batching_vertex:hx,begin_vertex:px,beginnormal_vertex:mx,bsdfs:gx,iridescence_fragment:_x,bumpmap_pars_fragment:vx,clipping_planes_fragment:xx,clipping_planes_pars_fragment:yx,clipping_planes_pars_vertex:Sx,clipping_planes_vertex:Mx,color_fragment:Ex,color_pars_fragment:wx,color_pars_vertex:Tx,color_vertex:Ax,common:Cx,cube_uv_reflection_fragment:Rx,defaultnormal_vertex:bx,displacementmap_pars_vertex:Px,displacementmap_vertex:Dx,emissivemap_fragment:Lx,emissivemap_pars_fragment:Ux,colorspace_fragment:Ix,colorspace_pars_fragment:Nx,envmap_fragment:Fx,envmap_common_pars_fragment:Ox,envmap_pars_fragment:Bx,envmap_pars_vertex:kx,envmap_physical_pars_fragment:Kx,envmap_vertex:zx,fog_vertex:Hx,fog_pars_vertex:Vx,fog_fragment:Gx,fog_pars_fragment:Wx,gradientmap_pars_fragment:Xx,lightmap_pars_fragment:jx,lights_lambert_fragment:qx,lights_lambert_pars_fragment:$x,lights_pars_begin:Yx,lights_toon_fragment:Zx,lights_toon_pars_fragment:Qx,lights_phong_fragment:Jx,lights_phong_pars_fragment:ey,lights_physical_fragment:ty,lights_physical_pars_fragment:ny,lights_fragment_begin:iy,lights_fragment_maps:ry,lights_fragment_end:sy,logdepthbuf_fragment:oy,logdepthbuf_pars_fragment:ay,logdepthbuf_pars_vertex:ly,logdepthbuf_vertex:uy,map_fragment:cy,map_pars_fragment:fy,map_particle_fragment:dy,map_particle_pars_fragment:hy,metalnessmap_fragment:py,metalnessmap_pars_fragment:my,morphinstance_vertex:gy,morphcolor_vertex:_y,morphnormal_vertex:vy,morphtarget_pars_vertex:xy,morphtarget_vertex:yy,normal_fragment_begin:Sy,normal_fragment_maps:My,normal_pars_fragment:Ey,normal_pars_vertex:wy,normal_vertex:Ty,normalmap_pars_fragment:Ay,clearcoat_normal_fragment_begin:Cy,clearcoat_normal_fragment_maps:Ry,clearcoat_pars_fragment:by,iridescence_pars_fragment:Py,opaque_fragment:Dy,packing:Ly,premultiplied_alpha_fragment:Uy,project_vertex:Iy,dithering_fragment:Ny,dithering_pars_fragment:Fy,roughnessmap_fragment:Oy,roughnessmap_pars_fragment:By,shadowmap_pars_fragment:ky,shadowmap_pars_vertex:zy,shadowmap_vertex:Hy,shadowmask_pars_fragment:Vy,skinbase_vertex:Gy,skinning_pars_vertex:Wy,skinning_vertex:Xy,skinnormal_vertex:jy,specularmap_fragment:qy,specularmap_pars_fragment:$y,tonemapping_fragment:Yy,tonemapping_pars_fragment:Ky,transmission_fragment:Zy,transmission_pars_fragment:Qy,uv_pars_fragment:Jy,uv_pars_vertex:eS,uv_vertex:tS,worldpos_vertex:nS,background_vert:iS,background_frag:rS,backgroundCube_vert:sS,backgroundCube_frag:oS,cube_vert:aS,cube_frag:lS,depth_vert:uS,depth_frag:cS,distanceRGBA_vert:fS,distanceRGBA_frag:dS,equirect_vert:hS,equirect_frag:pS,linedashed_vert:mS,linedashed_frag:gS,meshbasic_vert:_S,meshbasic_frag:vS,meshlambert_vert:xS,meshlambert_frag:yS,meshmatcap_vert:SS,meshmatcap_frag:MS,meshnormal_vert:ES,meshnormal_frag:wS,meshphong_vert:TS,meshphong_frag:AS,meshphysical_vert:CS,meshphysical_frag:RS,meshtoon_vert:bS,meshtoon_frag:PS,points_vert:DS,points_frag:LS,shadow_vert:US,shadow_frag:IS,sprite_vert:NS,sprite_frag:FS},Fe={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},sr={basic:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new _t(0)}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:jn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:jn([Fe.common,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.roughnessmap,Fe.metalnessmap,Fe.fog,Fe.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:jn([Fe.common,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.gradientmap,Fe.fog,Fe.lights,{emissive:{value:new _t(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:jn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:jn([Fe.points,Fe.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:jn([Fe.common,Fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:jn([Fe.common,Fe.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:jn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:jn([Fe.sprite,Fe.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distanceRGBA:{uniforms:jn([Fe.common,Fe.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distanceRGBA_vert,fragmentShader:yt.distanceRGBA_frag},shadow:{uniforms:jn([Fe.lights,Fe.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};sr.physical={uniforms:jn([sr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const eu={r:0,b:0,g:0},Is=new ar,OS=new en;function BS(s,e,n,r,a,u,c){const d=new _t(0);let p=u===!0?0:1,m,_,v=null,x=0,S=null;function E(D){let b=D.isScene===!0?D.background:null;return b&&b.isTexture&&(b=(D.backgroundBlurriness>0?n:e).get(b)),b}function T(D){let b=!1;const V=E(D);V===null?g(d,p):V&&V.isColor&&(g(V,1),b=!0);const F=s.xr.getEnvironmentBlendMode();F==="additive"?r.buffers.color.setClear(0,0,0,1,c):F==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,c),(s.autoClear||b)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(D,b){const V=E(b);V&&(V.isCubeTexture||V.mapping===_u)?(_===void 0&&(_=new pn(new Ws(1,1,1),new Nr({name:"BackgroundCubeMaterial",uniforms:Xo(sr.backgroundCube.uniforms),vertexShader:sr.backgroundCube.vertexShader,fragmentShader:sr.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(F,N,W){this.matrixWorld.copyPosition(W.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(_)),Is.copy(b.backgroundRotation),Is.x*=-1,Is.y*=-1,Is.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(Is.y*=-1,Is.z*=-1),_.material.uniforms.envMap.value=V,_.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,_.material.uniforms.backgroundRotation.value.setFromMatrix4(OS.makeRotationFromEuler(Is)),_.material.toneMapped=Ft.getTransfer(V.colorSpace)!==Ht,(v!==V||x!==V.version||S!==s.toneMapping)&&(_.material.needsUpdate=!0,v=V,x=V.version,S=s.toneMapping),_.layers.enableAll(),D.unshift(_,_.geometry,_.material,0,0,null)):V&&V.isTexture&&(m===void 0&&(m=new pn(new jo(2,2),new Nr({name:"BackgroundMaterial",uniforms:Xo(sr.background.uniforms),vertexShader:sr.background.vertexShader,fragmentShader:sr.background.fragmentShader,side:cs,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=V,m.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,m.material.toneMapped=Ft.getTransfer(V.colorSpace)!==Ht,V.matrixAutoUpdate===!0&&V.updateMatrix(),m.material.uniforms.uvTransform.value.copy(V.matrix),(v!==V||x!==V.version||S!==s.toneMapping)&&(m.material.needsUpdate=!0,v=V,x=V.version,S=s.toneMapping),m.layers.enableAll(),D.unshift(m,m.geometry,m.material,0,0,null))}function g(D,b){D.getRGB(eu,Ig(s)),r.buffers.color.setClear(eu.r,eu.g,eu.b,b,c)}function U(){_!==void 0&&(_.geometry.dispose(),_.material.dispose()),m!==void 0&&(m.geometry.dispose(),m.material.dispose())}return{getClearColor:function(){return d},setClearColor:function(D,b=1){d.set(D),p=b,g(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(D){p=D,g(d,p)},render:T,addToRenderList:y,dispose:U}}function kS(s,e){const n=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=x(null);let u=a,c=!1;function d(C,B,ie,Q,ue){let de=!1;const le=v(Q,ie,B);u!==le&&(u=le,m(u.object)),de=S(C,Q,ie,ue),de&&E(C,Q,ie,ue),ue!==null&&e.update(ue,s.ELEMENT_ARRAY_BUFFER),(de||c)&&(c=!1,b(C,B,ie,Q),ue!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ue).buffer))}function p(){return s.createVertexArray()}function m(C){return s.bindVertexArray(C)}function _(C){return s.deleteVertexArray(C)}function v(C,B,ie){const Q=ie.wireframe===!0;let ue=r[C.id];ue===void 0&&(ue={},r[C.id]=ue);let de=ue[B.id];de===void 0&&(de={},ue[B.id]=de);let le=de[Q];return le===void 0&&(le=x(p()),de[Q]=le),le}function x(C){const B=[],ie=[],Q=[];for(let ue=0;ue<n;ue++)B[ue]=0,ie[ue]=0,Q[ue]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:ie,attributeDivisors:Q,object:C,attributes:{},index:null}}function S(C,B,ie,Q){const ue=u.attributes,de=B.attributes;let le=0;const fe=ie.getAttributes();for(const z in fe)if(fe[z].location>=0){const ae=ue[z];let I=de[z];if(I===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(I=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(I=C.instanceColor)),ae===void 0||ae.attribute!==I||I&&ae.data!==I.data)return!0;le++}return u.attributesNum!==le||u.index!==Q}function E(C,B,ie,Q){const ue={},de=B.attributes;let le=0;const fe=ie.getAttributes();for(const z in fe)if(fe[z].location>=0){let ae=de[z];ae===void 0&&(z==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),z==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor));const I={};I.attribute=ae,ae&&ae.data&&(I.data=ae.data),ue[z]=I,le++}u.attributes=ue,u.attributesNum=le,u.index=Q}function T(){const C=u.newAttributes;for(let B=0,ie=C.length;B<ie;B++)C[B]=0}function y(C){g(C,0)}function g(C,B){const ie=u.newAttributes,Q=u.enabledAttributes,ue=u.attributeDivisors;ie[C]=1,Q[C]===0&&(s.enableVertexAttribArray(C),Q[C]=1),ue[C]!==B&&(s.vertexAttribDivisor(C,B),ue[C]=B)}function U(){const C=u.newAttributes,B=u.enabledAttributes;for(let ie=0,Q=B.length;ie<Q;ie++)B[ie]!==C[ie]&&(s.disableVertexAttribArray(ie),B[ie]=0)}function D(C,B,ie,Q,ue,de,le){le===!0?s.vertexAttribIPointer(C,B,ie,ue,de):s.vertexAttribPointer(C,B,ie,Q,ue,de)}function b(C,B,ie,Q){T();const ue=Q.attributes,de=ie.getAttributes(),le=B.defaultAttributeValues;for(const fe in de){const z=de[fe];if(z.location>=0){let ce=ue[fe];if(ce===void 0&&(fe==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),fe==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor)),ce!==void 0){const ae=ce.normalized,I=ce.itemSize,re=e.get(ce);if(re===void 0)continue;const Ge=re.buffer,ee=re.type,me=re.bytesPerElement,Ce=ee===s.INT||ee===s.UNSIGNED_INT||ce.gpuType===Ed;if(ce.isInterleavedBufferAttribute){const Ee=ce.data,De=Ee.stride,ze=ce.offset;if(Ee.isInstancedInterleavedBuffer){for(let st=0;st<z.locationSize;st++)g(z.location+st,Ee.meshPerAttribute);C.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=Ee.meshPerAttribute*Ee.count)}else for(let st=0;st<z.locationSize;st++)y(z.location+st);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let st=0;st<z.locationSize;st++)D(z.location+st,I/z.locationSize,ee,ae,De*me,(ze+I/z.locationSize*st)*me,Ce)}else{if(ce.isInstancedBufferAttribute){for(let Ee=0;Ee<z.locationSize;Ee++)g(z.location+Ee,ce.meshPerAttribute);C.isInstancedMesh!==!0&&Q._maxInstanceCount===void 0&&(Q._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ee=0;Ee<z.locationSize;Ee++)y(z.location+Ee);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let Ee=0;Ee<z.locationSize;Ee++)D(z.location+Ee,I/z.locationSize,ee,ae,I*me,I/z.locationSize*Ee*me,Ce)}}else if(le!==void 0){const ae=le[fe];if(ae!==void 0)switch(ae.length){case 2:s.vertexAttrib2fv(z.location,ae);break;case 3:s.vertexAttrib3fv(z.location,ae);break;case 4:s.vertexAttrib4fv(z.location,ae);break;default:s.vertexAttrib1fv(z.location,ae)}}}}U()}function V(){W();for(const C in r){const B=r[C];for(const ie in B){const Q=B[ie];for(const ue in Q)_(Q[ue].object),delete Q[ue];delete B[ie]}delete r[C]}}function F(C){if(r[C.id]===void 0)return;const B=r[C.id];for(const ie in B){const Q=B[ie];for(const ue in Q)_(Q[ue].object),delete Q[ue];delete B[ie]}delete r[C.id]}function N(C){for(const B in r){const ie=r[B];if(ie[C.id]===void 0)continue;const Q=ie[C.id];for(const ue in Q)_(Q[ue].object),delete Q[ue];delete ie[C.id]}}function W(){R(),c=!0,u!==a&&(u=a,m(u.object))}function R(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:W,resetDefaultState:R,dispose:V,releaseStatesOfGeometry:F,releaseStatesOfProgram:N,initAttributes:T,enableAttribute:y,disableUnusedAttributes:U}}function zS(s,e,n){let r;function a(m){r=m}function u(m,_){s.drawArrays(r,m,_),n.update(_,r,1)}function c(m,_,v){v!==0&&(s.drawArraysInstanced(r,m,_,v),n.update(_,r,v))}function d(m,_,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,_,0,v);let S=0;for(let E=0;E<v;E++)S+=_[E];n.update(S,r,1)}function p(m,_,v,x){if(v===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let E=0;E<m.length;E++)c(m[E],_[E],x[E]);else{S.multiDrawArraysInstancedWEBGL(r,m,0,_,0,x,0,v);let E=0;for(let T=0;T<v;T++)E+=_[T]*x[T];n.update(E,r,1)}}this.setMode=a,this.render=u,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function HS(s,e,n,r){let a;function u(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const N=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function c(N){return!(N!==Vi&&r.convert(N)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(N){const W=N===La&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(N!==Ir&&r.convert(N)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==Dr&&!W)}function p(N){if(N==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=n.precision!==void 0?n.precision:"highp";const _=p(m);_!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",_,"instead."),m=_);const v=n.logarithmicDepthBuffer===!0,x=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),y=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),U=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),D=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),V=E>0,F=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:p,textureFormatReadable:c,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:v,reverseDepthBuffer:x,maxTextures:S,maxVertexTextures:E,maxTextureSize:T,maxCubemapSize:y,maxAttributes:g,maxVertexUniforms:U,maxVaryings:D,maxFragmentUniforms:b,vertexTextures:V,maxSamples:F}}function VS(s){const e=this;let n=null,r=0,a=!1,u=!1;const c=new Fs,d=new vt,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(v,x){const S=v.length!==0||x||r!==0||a;return a=x,r=v.length,S},this.beginShadows=function(){u=!0,_(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,x){n=_(v,x,0)},this.setState=function(v,x,S){const E=v.clippingPlanes,T=v.clipIntersection,y=v.clipShadows,g=s.get(v);if(!a||E===null||E.length===0||u&&!y)u?_(null):m();else{const U=u?0:r,D=U*4;let b=g.clippingState||null;p.value=b,b=_(E,x,D,S);for(let V=0;V!==D;++V)b[V]=n[V];g.clippingState=b,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=U}};function m(){p.value!==n&&(p.value=n,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function _(v,x,S,E){const T=v!==null?v.length:0;let y=null;if(T!==0){if(y=p.value,E!==!0||y===null){const g=S+T*4,U=x.matrixWorldInverse;d.getNormalMatrix(U),(y===null||y.length<g)&&(y=new Float32Array(g));for(let D=0,b=S;D!==T;++D,b+=4)c.copy(v[D]).applyMatrix4(U,d),c.normal.toArray(y,b),y[b+3]=c.constant}p.value=y,p.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,y}}function GS(s){let e=new WeakMap;function n(c,d){return d===Hf?c.mapping=zo:d===Vf&&(c.mapping=Ho),c}function r(c){if(c&&c.isTexture){const d=c.mapping;if(d===Hf||d===Vf)if(e.has(c)){const p=e.get(c).texture;return n(p,c.mapping)}else{const p=c.image;if(p&&p.height>0){const m=new Vv(p.height);return m.fromEquirectangularTexture(s,c),e.set(c,m),c.addEventListener("dispose",a),n(m.texture,c.mapping)}else return null}}return c}function a(c){const d=c.target;d.removeEventListener("dispose",a);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}const No=4,Om=[.125,.215,.35,.446,.526,.582],ks=20,Ef=new zg,Bm=new _t;let wf=null,Tf=0,Af=0,Cf=!1;const Os=(1+Math.sqrt(5))/2,Po=1/Os,km=[new j(-Os,Po,0),new j(Os,Po,0),new j(-Po,0,Os),new j(Po,0,Os),new j(0,Os,-Po),new j(0,Os,Po),new j(-1,1,-1),new j(1,1,-1),new j(-1,1,1),new j(1,1,1)];class zm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,r=.1,a=100){wf=this._renderer.getRenderTarget(),Tf=this._renderer.getActiveCubeFace(),Af=this._renderer.getActiveMipmapLevel(),Cf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,r,a,u),n>0&&this._blur(u,0,0,n),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wf,Tf,Af),this._renderer.xr.enabled=Cf,e.scissorTest=!1,tu(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===zo||e.mapping===Ho?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wf=this._renderer.getRenderTarget(),Tf=this._renderer.getActiveCubeFace(),Af=this._renderer.getActiveMipmapLevel(),Cf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=n||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,r={magFilter:or,minFilter:or,generateMipmaps:!1,type:La,format:Vi,colorSpace:Wo,depthBuffer:!1},a=Hm(e,n,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hm(e,n,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=WS(u)),this._blurMaterial=XS(u,e,n)}return a}_compileMaterial(e){const n=new pn(this._lodPlanes[0],e);this._renderer.compile(n,Ef)}_sceneToCubeUV(e,n,r,a){const d=new Ai(90,1,n,r),p=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],_=this._renderer,v=_.autoClear,x=_.toneMapping;_.getClearColor(Bm),_.toneMapping=us,_.autoClear=!1;const S=new br({name:"PMREM.Background",side:si,depthWrite:!1,depthTest:!1}),E=new pn(new Ws,S);let T=!1;const y=e.background;y?y.isColor&&(S.color.copy(y),e.background=null,T=!0):(S.color.copy(Bm),T=!0);for(let g=0;g<6;g++){const U=g%3;U===0?(d.up.set(0,p[g],0),d.lookAt(m[g],0,0)):U===1?(d.up.set(0,0,p[g]),d.lookAt(0,m[g],0)):(d.up.set(0,p[g],0),d.lookAt(0,0,m[g]));const D=this._cubeSize;tu(a,U*D,g>2?D:0,D,D),_.setRenderTarget(a),T&&_.render(E,d),_.render(e,d)}E.geometry.dispose(),E.material.dispose(),_.toneMapping=x,_.autoClear=v,e.background=y}_textureToCubeUV(e,n){const r=this._renderer,a=e.mapping===zo||e.mapping===Ho;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vm());const u=a?this._cubemapMaterial:this._equirectMaterial,c=new pn(this._lodPlanes[0],u),d=u.uniforms;d.envMap.value=e;const p=this._cubeSize;tu(n,0,0,3*p,2*p),r.setRenderTarget(n),r.render(c,Ef)}_applyPMREM(e){const n=this._renderer,r=n.autoClear;n.autoClear=!1;const a=this._lodPlanes.length;for(let u=1;u<a;u++){const c=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),d=km[(a-u-1)%km.length];this._blur(e,u-1,u,c,d)}n.autoClear=r}_blur(e,n,r,a,u){const c=this._pingPongRenderTarget;this._halfBlur(e,c,n,r,a,"latitudinal",u),this._halfBlur(c,e,r,r,a,"longitudinal",u)}_halfBlur(e,n,r,a,u,c,d){const p=this._renderer,m=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const _=3,v=new pn(this._lodPlanes[a],m),x=m.uniforms,S=this._sizeLods[r]-1,E=isFinite(u)?Math.PI/(2*S):2*Math.PI/(2*ks-1),T=u/E,y=isFinite(u)?1+Math.floor(_*T):ks;y>ks&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${ks}`);const g=[];let U=0;for(let N=0;N<ks;++N){const W=N/T,R=Math.exp(-W*W/2);g.push(R),N===0?U+=R:N<y&&(U+=2*R)}for(let N=0;N<g.length;N++)g[N]=g[N]/U;x.envMap.value=e.texture,x.samples.value=y,x.weights.value=g,x.latitudinal.value=c==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:D}=this;x.dTheta.value=E,x.mipInt.value=D-r;const b=this._sizeLods[a],V=3*b*(a>D-No?a-D+No:0),F=4*(this._cubeSize-b);tu(n,V,F,3*b,2*b),p.setRenderTarget(n),p.render(v,Ef)}}function WS(s){const e=[],n=[],r=[];let a=s;const u=s-No+1+Om.length;for(let c=0;c<u;c++){const d=Math.pow(2,a);n.push(d);let p=1/d;c>s-No?p=Om[c-s+No-1]:c===0&&(p=0),r.push(p);const m=1/(d-2),_=-m,v=1+m,x=[_,_,v,_,v,v,_,_,v,v,_,v],S=6,E=6,T=3,y=2,g=1,U=new Float32Array(T*E*S),D=new Float32Array(y*E*S),b=new Float32Array(g*E*S);for(let F=0;F<S;F++){const N=F%3*2/3-1,W=F>2?0:-1,R=[N,W,0,N+2/3,W,0,N+2/3,W+1,0,N,W,0,N+2/3,W+1,0,N,W+1,0];U.set(R,T*E*F),D.set(x,y*E*F);const C=[F,F,F,F,F,F];b.set(C,g*E*F)}const V=new an;V.setAttribute("position",new qn(U,T)),V.setAttribute("uv",new qn(D,y)),V.setAttribute("faceIndex",new qn(b,g)),e.push(V),a>No&&a--}return{lodPlanes:e,sizeLods:n,sigmas:r}}function Hm(s,e,n){const r=new Gs(s,e,n);return r.texture.mapping=_u,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function tu(s,e,n,r,a){s.viewport.set(e,n,r,a),s.scissor.set(e,n,r,a)}function XS(s,e,n){const r=new Float32Array(ks),a=new j(0,1,0);return new Nr({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ls,depthTest:!1,depthWrite:!1})}function Vm(){return new Nr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ls,depthTest:!1,depthWrite:!1})}function Gm(){return new Nr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ls,depthTest:!1,depthWrite:!1})}function Nd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function jS(s){let e=new WeakMap,n=null;function r(d){if(d&&d.isTexture){const p=d.mapping,m=p===Hf||p===Vf,_=p===zo||p===Ho;if(m||_){let v=e.get(d);const x=v!==void 0?v.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return n===null&&(n=new zm(s)),v=m?n.fromEquirectangular(d,v):n.fromCubemap(d,v),v.texture.pmremVersion=d.pmremVersion,e.set(d,v),v.texture;if(v!==void 0)return v.texture;{const S=d.image;return m&&S&&S.height>0||_&&S&&a(S)?(n===null&&(n=new zm(s)),v=m?n.fromEquirectangular(d):n.fromCubemap(d),v.texture.pmremVersion=d.pmremVersion,e.set(d,v),d.addEventListener("dispose",u),v.texture):null}}}return d}function a(d){let p=0;const m=6;for(let _=0;_<m;_++)d[_]!==void 0&&p++;return p===m}function u(d){const p=d.target;p.removeEventListener("dispose",u);const m=e.get(p);m!==void 0&&(e.delete(p),m.dispose())}function c(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:c}}function qS(s){const e={};function n(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return n(r)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(r){const a=n(r);return a===null&&Lo("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function $S(s,e,n,r){const a={},u=new WeakMap;function c(v){const x=v.target;x.index!==null&&e.remove(x.index);for(const E in x.attributes)e.remove(x.attributes[E]);x.removeEventListener("dispose",c),delete a[x.id];const S=u.get(x);S&&(e.remove(S),u.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,n.memory.geometries--}function d(v,x){return a[x.id]===!0||(x.addEventListener("dispose",c),a[x.id]=!0,n.memory.geometries++),x}function p(v){const x=v.attributes;for(const S in x)e.update(x[S],s.ARRAY_BUFFER)}function m(v){const x=[],S=v.index,E=v.attributes.position;let T=0;if(S!==null){const U=S.array;T=S.version;for(let D=0,b=U.length;D<b;D+=3){const V=U[D+0],F=U[D+1],N=U[D+2];x.push(V,F,F,N,N,V)}}else if(E!==void 0){const U=E.array;T=E.version;for(let D=0,b=U.length/3-1;D<b;D+=3){const V=D+0,F=D+1,N=D+2;x.push(V,F,F,N,N,V)}}else return;const y=new(Rg(x)?Ug:Lg)(x,1);y.version=T;const g=u.get(v);g&&e.remove(g),u.set(v,y)}function _(v){const x=u.get(v);if(x){const S=v.index;S!==null&&x.version<S.version&&m(v)}else m(v);return u.get(v)}return{get:d,update:p,getWireframeAttribute:_}}function YS(s,e,n){let r;function a(x){r=x}let u,c;function d(x){u=x.type,c=x.bytesPerElement}function p(x,S){s.drawElements(r,S,u,x*c),n.update(S,r,1)}function m(x,S,E){E!==0&&(s.drawElementsInstanced(r,S,u,x*c,E),n.update(S,r,E))}function _(x,S,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,S,0,u,x,0,E);let y=0;for(let g=0;g<E;g++)y+=S[g];n.update(y,r,1)}function v(x,S,E,T){if(E===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let g=0;g<x.length;g++)m(x[g]/c,S[g],T[g]);else{y.multiDrawElementsInstancedWEBGL(r,S,0,u,x,0,T,0,E);let g=0;for(let U=0;U<E;U++)g+=S[U]*T[U];n.update(g,r,1)}}this.setMode=a,this.setIndex=d,this.render=p,this.renderInstances=m,this.renderMultiDraw=_,this.renderMultiDrawInstances=v}function KS(s){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,c,d){switch(n.calls++,c){case s.TRIANGLES:n.triangles+=d*(u/3);break;case s.LINES:n.lines+=d*(u/2);break;case s.LINE_STRIP:n.lines+=d*(u-1);break;case s.LINE_LOOP:n.lines+=d*u;break;case s.POINTS:n.points+=d*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",c);break}}function a(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:a,update:r}}function ZS(s,e,n){const r=new WeakMap,a=new ln;function u(c,d,p){const m=c.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,v=_!==void 0?_.length:0;let x=r.get(d);if(x===void 0||x.count!==v){let C=function(){W.dispose(),r.delete(d),d.removeEventListener("dispose",C)};var S=C;x!==void 0&&x.texture.dispose();const E=d.morphAttributes.position!==void 0,T=d.morphAttributes.normal!==void 0,y=d.morphAttributes.color!==void 0,g=d.morphAttributes.position||[],U=d.morphAttributes.normal||[],D=d.morphAttributes.color||[];let b=0;E===!0&&(b=1),T===!0&&(b=2),y===!0&&(b=3);let V=d.attributes.position.count*b,F=1;V>e.maxTextureSize&&(F=Math.ceil(V/e.maxTextureSize),V=e.maxTextureSize);const N=new Float32Array(V*F*4*v),W=new Pg(N,V,F,v);W.type=Dr,W.needsUpdate=!0;const R=b*4;for(let B=0;B<v;B++){const ie=g[B],Q=U[B],ue=D[B],de=V*F*4*B;for(let le=0;le<ie.count;le++){const fe=le*R;E===!0&&(a.fromBufferAttribute(ie,le),N[de+fe+0]=a.x,N[de+fe+1]=a.y,N[de+fe+2]=a.z,N[de+fe+3]=0),T===!0&&(a.fromBufferAttribute(Q,le),N[de+fe+4]=a.x,N[de+fe+5]=a.y,N[de+fe+6]=a.z,N[de+fe+7]=0),y===!0&&(a.fromBufferAttribute(ue,le),N[de+fe+8]=a.x,N[de+fe+9]=a.y,N[de+fe+10]=a.z,N[de+fe+11]=ue.itemSize===4?a.w:1)}}x={count:v,texture:W,size:new Lt(V,F)},r.set(d,x),d.addEventListener("dispose",C)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",c.morphTexture,n);else{let E=0;for(let y=0;y<m.length;y++)E+=m[y];const T=d.morphTargetsRelative?1:1-E;p.getUniforms().setValue(s,"morphTargetBaseInfluence",T),p.getUniforms().setValue(s,"morphTargetInfluences",m)}p.getUniforms().setValue(s,"morphTargetsTexture",x.texture,n),p.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}return{update:u}}function QS(s,e,n,r){let a=new WeakMap;function u(p){const m=r.render.frame,_=p.geometry,v=e.get(p,_);if(a.get(v)!==m&&(e.update(v),a.set(v,m)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),a.get(p)!==m&&(n.update(p.instanceMatrix,s.ARRAY_BUFFER),p.instanceColor!==null&&n.update(p.instanceColor,s.ARRAY_BUFFER),a.set(p,m))),p.isSkinnedMesh){const x=p.skeleton;a.get(x)!==m&&(x.update(),a.set(x,m))}return v}function c(){a=new WeakMap}function d(p){const m=p.target;m.removeEventListener("dispose",d),n.remove(m.instanceMatrix),m.instanceColor!==null&&n.remove(m.instanceColor)}return{update:u,dispose:c}}const Vg=new oi,Wm=new Bg(1,1),Gg=new Pg,Wg=new Cv,Xg=new Og,Xm=[],jm=[],qm=new Float32Array(16),$m=new Float32Array(9),Ym=new Float32Array(4);function Yo(s,e,n){const r=s[0];if(r<=0||r>0)return s;const a=e*n;let u=Xm[a];if(u===void 0&&(u=new Float32Array(a),Xm[a]=u),e!==0){r.toArray(u,0);for(let c=1,d=0;c!==e;++c)d+=n,s[c].toArray(u,d)}return u}function vn(s,e){if(s.length!==e.length)return!1;for(let n=0,r=s.length;n<r;n++)if(s[n]!==e[n])return!1;return!0}function xn(s,e){for(let n=0,r=e.length;n<r;n++)s[n]=e[n]}function xu(s,e){let n=jm[e];n===void 0&&(n=new Int32Array(e),jm[e]=n);for(let r=0;r!==e;++r)n[r]=s.allocateTextureUnit();return n}function JS(s,e){const n=this.cache;n[0]!==e&&(s.uniform1f(this.addr,e),n[0]=e)}function eM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(vn(n,e))return;s.uniform2fv(this.addr,e),xn(n,e)}}function tM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(vn(n,e))return;s.uniform3fv(this.addr,e),xn(n,e)}}function nM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(vn(n,e))return;s.uniform4fv(this.addr,e),xn(n,e)}}function iM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(vn(n,e))return;s.uniformMatrix2fv(this.addr,!1,e),xn(n,e)}else{if(vn(n,r))return;Ym.set(r),s.uniformMatrix2fv(this.addr,!1,Ym),xn(n,r)}}function rM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(vn(n,e))return;s.uniformMatrix3fv(this.addr,!1,e),xn(n,e)}else{if(vn(n,r))return;$m.set(r),s.uniformMatrix3fv(this.addr,!1,$m),xn(n,r)}}function sM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(vn(n,e))return;s.uniformMatrix4fv(this.addr,!1,e),xn(n,e)}else{if(vn(n,r))return;qm.set(r),s.uniformMatrix4fv(this.addr,!1,qm),xn(n,r)}}function oM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1i(this.addr,e),n[0]=e)}function aM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(vn(n,e))return;s.uniform2iv(this.addr,e),xn(n,e)}}function lM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(vn(n,e))return;s.uniform3iv(this.addr,e),xn(n,e)}}function uM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(vn(n,e))return;s.uniform4iv(this.addr,e),xn(n,e)}}function cM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1ui(this.addr,e),n[0]=e)}function fM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(vn(n,e))return;s.uniform2uiv(this.addr,e),xn(n,e)}}function dM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(vn(n,e))return;s.uniform3uiv(this.addr,e),xn(n,e)}}function hM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(vn(n,e))return;s.uniform4uiv(this.addr,e),xn(n,e)}}function pM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let u;this.type===s.SAMPLER_2D_SHADOW?(Wm.compareFunction=Cg,u=Wm):u=Vg,n.setTexture2D(e||u,a)}function mM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture3D(e||Wg,a)}function gM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTextureCube(e||Xg,a)}function _M(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture2DArray(e||Gg,a)}function vM(s){switch(s){case 5126:return JS;case 35664:return eM;case 35665:return tM;case 35666:return nM;case 35674:return iM;case 35675:return rM;case 35676:return sM;case 5124:case 35670:return oM;case 35667:case 35671:return aM;case 35668:case 35672:return lM;case 35669:case 35673:return uM;case 5125:return cM;case 36294:return fM;case 36295:return dM;case 36296:return hM;case 35678:case 36198:case 36298:case 36306:case 35682:return pM;case 35679:case 36299:case 36307:return mM;case 35680:case 36300:case 36308:case 36293:return gM;case 36289:case 36303:case 36311:case 36292:return _M}}function xM(s,e){s.uniform1fv(this.addr,e)}function yM(s,e){const n=Yo(e,this.size,2);s.uniform2fv(this.addr,n)}function SM(s,e){const n=Yo(e,this.size,3);s.uniform3fv(this.addr,n)}function MM(s,e){const n=Yo(e,this.size,4);s.uniform4fv(this.addr,n)}function EM(s,e){const n=Yo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,n)}function wM(s,e){const n=Yo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,n)}function TM(s,e){const n=Yo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,n)}function AM(s,e){s.uniform1iv(this.addr,e)}function CM(s,e){s.uniform2iv(this.addr,e)}function RM(s,e){s.uniform3iv(this.addr,e)}function bM(s,e){s.uniform4iv(this.addr,e)}function PM(s,e){s.uniform1uiv(this.addr,e)}function DM(s,e){s.uniform2uiv(this.addr,e)}function LM(s,e){s.uniform3uiv(this.addr,e)}function UM(s,e){s.uniform4uiv(this.addr,e)}function IM(s,e,n){const r=this.cache,a=e.length,u=xu(n,a);vn(r,u)||(s.uniform1iv(this.addr,u),xn(r,u));for(let c=0;c!==a;++c)n.setTexture2D(e[c]||Vg,u[c])}function NM(s,e,n){const r=this.cache,a=e.length,u=xu(n,a);vn(r,u)||(s.uniform1iv(this.addr,u),xn(r,u));for(let c=0;c!==a;++c)n.setTexture3D(e[c]||Wg,u[c])}function FM(s,e,n){const r=this.cache,a=e.length,u=xu(n,a);vn(r,u)||(s.uniform1iv(this.addr,u),xn(r,u));for(let c=0;c!==a;++c)n.setTextureCube(e[c]||Xg,u[c])}function OM(s,e,n){const r=this.cache,a=e.length,u=xu(n,a);vn(r,u)||(s.uniform1iv(this.addr,u),xn(r,u));for(let c=0;c!==a;++c)n.setTexture2DArray(e[c]||Gg,u[c])}function BM(s){switch(s){case 5126:return xM;case 35664:return yM;case 35665:return SM;case 35666:return MM;case 35674:return EM;case 35675:return wM;case 35676:return TM;case 5124:case 35670:return AM;case 35667:case 35671:return CM;case 35668:case 35672:return RM;case 35669:case 35673:return bM;case 5125:return PM;case 36294:return DM;case 36295:return LM;case 36296:return UM;case 35678:case 36198:case 36298:case 36306:case 35682:return IM;case 35679:case 36299:case 36307:return NM;case 35680:case 36300:case 36308:case 36293:return FM;case 36289:case 36303:case 36311:case 36292:return OM}}class kM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.setValue=vM(n.type)}}class zM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=BM(n.type)}}class HM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,r){const a=this.seq;for(let u=0,c=a.length;u!==c;++u){const d=a[u];d.setValue(e,n[d.id],r)}}}const Rf=/(\w+)(\])?(\[|\.)?/g;function Km(s,e){s.seq.push(e),s.map[e.id]=e}function VM(s,e,n){const r=s.name,a=r.length;for(Rf.lastIndex=0;;){const u=Rf.exec(r),c=Rf.lastIndex;let d=u[1];const p=u[2]==="]",m=u[3];if(p&&(d=d|0),m===void 0||m==="["&&c+2===a){Km(n,m===void 0?new kM(d,s,e):new zM(d,s,e));break}else{let v=n.map[d];v===void 0&&(v=new HM(d),Km(n,v)),n=v}}}class cu{constructor(e,n){this.seq=[],this.map={};const r=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const u=e.getActiveUniform(n,a),c=e.getUniformLocation(n,u.name);VM(u,c,this)}}setValue(e,n,r,a){const u=this.map[n];u!==void 0&&u.setValue(e,r,a)}setOptional(e,n,r){const a=n[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,n,r,a){for(let u=0,c=n.length;u!==c;++u){const d=n[u],p=r[d.id];p.needsUpdate!==!1&&d.setValue(e,p.value,a)}}static seqWithValue(e,n){const r=[];for(let a=0,u=e.length;a!==u;++a){const c=e[a];c.id in n&&r.push(c)}return r}}function Zm(s,e,n){const r=s.createShader(e);return s.shaderSource(r,n),s.compileShader(r),r}const GM=37297;let WM=0;function XM(s,e){const n=s.split(`
`),r=[],a=Math.max(e-6,0),u=Math.min(e+6,n.length);for(let c=a;c<u;c++){const d=c+1;r.push(`${d===e?">":" "} ${d}: ${n[c]}`)}return r.join(`
`)}const Qm=new vt;function jM(s){Ft._getMatrix(Qm,Ft.workingColorSpace,s);const e=`mat3( ${Qm.elements.map(n=>n.toFixed(4))} )`;switch(Ft.getTransfer(s)){case du:return[e,"LinearTransferOETF"];case Ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Jm(s,e,n){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const u=/ERROR: 0:(\d+)/.exec(a);if(u){const c=parseInt(u[1]);return n.toUpperCase()+`

`+a+`

`+XM(s.getShaderSource(e),c)}else return a}function qM(s,e){const n=jM(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function $M(s,e){let n;switch(e){case J_:n="Linear";break;case ev:n="Reinhard";break;case tv:n="Cineon";break;case nv:n="ACESFilmic";break;case rv:n="AgX";break;case sv:n="Neutral";break;case iv:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+s+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const nu=new j;function YM(){Ft.getLuminanceCoefficients(nu);const s=nu.x.toFixed(4),e=nu.y.toFixed(4),n=nu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function KM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ba).join(`
`)}function ZM(s){const e=[];for(const n in s){const r=s[n];r!==!1&&e.push("#define "+n+" "+r)}return e.join(`
`)}function QM(s,e){const n={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const u=s.getActiveAttrib(e,a),c=u.name;let d=1;u.type===s.FLOAT_MAT2&&(d=2),u.type===s.FLOAT_MAT3&&(d=3),u.type===s.FLOAT_MAT4&&(d=4),n[c]={type:u.type,location:s.getAttribLocation(e,c),locationSize:d}}return n}function ba(s){return s!==""}function eg(s,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const JM=/^[ \t]*#include +<([\w\d./]+)>/gm;function xd(s){return s.replace(JM,tE)}const eE=new Map;function tE(s,e){let n=yt[e];if(n===void 0){const r=eE.get(e);if(r!==void 0)n=yt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return xd(n)}const nE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ng(s){return s.replace(nE,iE)}function iE(s,e,n,r){let a="";for(let u=parseInt(e);u<parseInt(n);u++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return a}function ig(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function rE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===pg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===L_?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Cr&&(e="SHADOWMAP_TYPE_VSM"),e}function sE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case zo:case Ho:e="ENVMAP_TYPE_CUBE";break;case _u:e="ENVMAP_TYPE_CUBE_UV";break}return e}function oE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ho:e="ENVMAP_MODE_REFRACTION";break}return e}function aE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Md:e="ENVMAP_BLENDING_MULTIPLY";break;case Z_:e="ENVMAP_BLENDING_MIX";break;case Q_:e="ENVMAP_BLENDING_ADD";break}return e}function lE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:r,maxMip:n}}function uE(s,e,n,r){const a=s.getContext(),u=n.defines;let c=n.vertexShader,d=n.fragmentShader;const p=rE(n),m=sE(n),_=oE(n),v=aE(n),x=lE(n),S=KM(n),E=ZM(u),T=a.createProgram();let y,g,U=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(y=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter(ba).join(`
`),y.length>0&&(y+=`
`),g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter(ba).join(`
`),g.length>0&&(g+=`
`)):(y=[ig(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+_:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+p:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ba).join(`
`),g=[ig(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+m:"",n.envMap?"#define "+_:"",n.envMap?"#define "+v:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+p:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==us?"#define TONE_MAPPING":"",n.toneMapping!==us?yt.tonemapping_pars_fragment:"",n.toneMapping!==us?$M("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,qM("linearToOutputTexel",n.outputColorSpace),YM(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ba).join(`
`)),c=xd(c),c=eg(c,n),c=tg(c,n),d=xd(d),d=eg(d,n),d=tg(d,n),c=ng(c),d=ng(d),n.isRawShaderMaterial!==!0&&(U=`#version 300 es
`,y=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",n.glslVersion===am?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===am?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const D=U+y+c,b=U+g+d,V=Zm(a,a.VERTEX_SHADER,D),F=Zm(a,a.FRAGMENT_SHADER,b);a.attachShader(T,V),a.attachShader(T,F),n.index0AttributeName!==void 0?a.bindAttribLocation(T,0,n.index0AttributeName):n.morphTargets===!0&&a.bindAttribLocation(T,0,"position"),a.linkProgram(T);function N(B){if(s.debug.checkShaderErrors){const ie=a.getProgramInfoLog(T).trim(),Q=a.getShaderInfoLog(V).trim(),ue=a.getShaderInfoLog(F).trim();let de=!0,le=!0;if(a.getProgramParameter(T,a.LINK_STATUS)===!1)if(de=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,T,V,F);else{const fe=Jm(a,V,"vertex"),z=Jm(a,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(T,a.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ie+`
`+fe+`
`+z)}else ie!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ie):(Q===""||ue==="")&&(le=!1);le&&(B.diagnostics={runnable:de,programLog:ie,vertexShader:{log:Q,prefix:y},fragmentShader:{log:ue,prefix:g}})}a.deleteShader(V),a.deleteShader(F),W=new cu(a,T),R=QM(a,T)}let W;this.getUniforms=function(){return W===void 0&&N(this),W};let R;this.getAttributes=function(){return R===void 0&&N(this),R};let C=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=a.getProgramParameter(T,GM)),C},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(T),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=WM++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=V,this.fragmentShader=F,this}let cE=0;class fE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(n),u=this._getShaderStage(r),c=this._getShaderCacheForMaterial(e);return c.has(a)===!1&&(c.add(a),a.usedTimes++),c.has(u)===!1&&(c.add(u),u.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const r of n)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let r=n.get(e);return r===void 0&&(r=new Set,n.set(e,r)),r}_getShaderStage(e){const n=this.shaderCache;let r=n.get(e);return r===void 0&&(r=new dE(e),n.set(e,r)),r}}class dE{constructor(e){this.id=cE++,this.code=e,this.usedTimes=0}}function hE(s,e,n,r,a,u,c){const d=new Pd,p=new fE,m=new Set,_=[],v=a.logarithmicDepthBuffer,x=a.vertexTextures;let S=a.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(R){return m.add(R),R===0?"uv":`uv${R}`}function y(R,C,B,ie,Q){const ue=ie.fog,de=Q.geometry,le=R.isMeshStandardMaterial?ie.environment:null,fe=(R.isMeshStandardMaterial?n:e).get(R.envMap||le),z=fe&&fe.mapping===_u?fe.image.height:null,ce=E[R.type];R.precision!==null&&(S=a.getMaxPrecision(R.precision),S!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",S,"instead."));const ae=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,I=ae!==void 0?ae.length:0;let re=0;de.morphAttributes.position!==void 0&&(re=1),de.morphAttributes.normal!==void 0&&(re=2),de.morphAttributes.color!==void 0&&(re=3);let Ge,ee,me,Ce;if(ce){const Ct=sr[ce];Ge=Ct.vertexShader,ee=Ct.fragmentShader}else Ge=R.vertexShader,ee=R.fragmentShader,p.update(R),me=p.getVertexShaderID(R),Ce=p.getFragmentShaderID(R);const Ee=s.getRenderTarget(),De=s.state.buffers.depth.getReversed(),ze=Q.isInstancedMesh===!0,st=Q.isBatchedMesh===!0,Ot=!!R.map,St=!!R.matcap,Se=!!fe,O=!!R.aoMap,Rt=!!R.lightMap,nt=!!R.bumpMap,ot=!!R.normalMap,Je=!!R.displacementMap,It=!!R.emissiveMap,qe=!!R.metalnessMap,P=!!R.roughnessMap,w=R.anisotropy>0,J=R.clearcoat>0,ge=R.dispersion>0,xe=R.iridescence>0,he=R.sheen>0,Ze=R.transmission>0,Ue=w&&!!R.anisotropyMap,He=J&&!!R.clearcoatMap,mt=J&&!!R.clearcoatNormalMap,Te=J&&!!R.clearcoatRoughnessMap,je=xe&&!!R.iridescenceMap,it=xe&&!!R.iridescenceThicknessMap,ft=he&&!!R.sheenColorMap,We=he&&!!R.sheenRoughnessMap,gt=!!R.specularMap,dt=!!R.specularColorMap,Dt=!!R.specularIntensityMap,X=Ze&&!!R.transmissionMap,Le=Ze&&!!R.thicknessMap,oe=!!R.gradientMap,pe=!!R.alphaMap,Oe=R.alphaTest>0,Ne=!!R.alphaHash,ht=!!R.extensions;let Bt=us;R.toneMapped&&(Ee===null||Ee.isXRRenderTarget===!0)&&(Bt=s.toneMapping);const Kt={shaderID:ce,shaderType:R.type,shaderName:R.name,vertexShader:Ge,fragmentShader:ee,defines:R.defines,customVertexShaderID:me,customFragmentShaderID:Ce,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:S,batching:st,batchingColor:st&&Q._colorsTexture!==null,instancing:ze,instancingColor:ze&&Q.instanceColor!==null,instancingMorph:ze&&Q.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:Ee===null?s.outputColorSpace:Ee.isXRRenderTarget===!0?Ee.texture.colorSpace:Wo,alphaToCoverage:!!R.alphaToCoverage,map:Ot,matcap:St,envMap:Se,envMapMode:Se&&fe.mapping,envMapCubeUVHeight:z,aoMap:O,lightMap:Rt,bumpMap:nt,normalMap:ot,displacementMap:x&&Je,emissiveMap:It,normalMapObjectSpace:ot&&R.normalMapType===uv,normalMapTangentSpace:ot&&R.normalMapType===Ag,metalnessMap:qe,roughnessMap:P,anisotropy:w,anisotropyMap:Ue,clearcoat:J,clearcoatMap:He,clearcoatNormalMap:mt,clearcoatRoughnessMap:Te,dispersion:ge,iridescence:xe,iridescenceMap:je,iridescenceThicknessMap:it,sheen:he,sheenColorMap:ft,sheenRoughnessMap:We,specularMap:gt,specularColorMap:dt,specularIntensityMap:Dt,transmission:Ze,transmissionMap:X,thicknessMap:Le,gradientMap:oe,opaque:R.transparent===!1&&R.blending===Fo&&R.alphaToCoverage===!1,alphaMap:pe,alphaTest:Oe,alphaHash:Ne,combine:R.combine,mapUv:Ot&&T(R.map.channel),aoMapUv:O&&T(R.aoMap.channel),lightMapUv:Rt&&T(R.lightMap.channel),bumpMapUv:nt&&T(R.bumpMap.channel),normalMapUv:ot&&T(R.normalMap.channel),displacementMapUv:Je&&T(R.displacementMap.channel),emissiveMapUv:It&&T(R.emissiveMap.channel),metalnessMapUv:qe&&T(R.metalnessMap.channel),roughnessMapUv:P&&T(R.roughnessMap.channel),anisotropyMapUv:Ue&&T(R.anisotropyMap.channel),clearcoatMapUv:He&&T(R.clearcoatMap.channel),clearcoatNormalMapUv:mt&&T(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&T(R.clearcoatRoughnessMap.channel),iridescenceMapUv:je&&T(R.iridescenceMap.channel),iridescenceThicknessMapUv:it&&T(R.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&T(R.sheenColorMap.channel),sheenRoughnessMapUv:We&&T(R.sheenRoughnessMap.channel),specularMapUv:gt&&T(R.specularMap.channel),specularColorMapUv:dt&&T(R.specularColorMap.channel),specularIntensityMapUv:Dt&&T(R.specularIntensityMap.channel),transmissionMapUv:X&&T(R.transmissionMap.channel),thicknessMapUv:Le&&T(R.thicknessMap.channel),alphaMapUv:pe&&T(R.alphaMap.channel),vertexTangents:!!de.attributes.tangent&&(ot||w),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,pointsUvs:Q.isPoints===!0&&!!de.attributes.uv&&(Ot||pe),fog:!!ue,useFog:R.fog===!0,fogExp2:!!ue&&ue.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:v,reverseDepthBuffer:De,skinning:Q.isSkinnedMesh===!0,morphTargets:de.morphAttributes.position!==void 0,morphNormals:de.morphAttributes.normal!==void 0,morphColors:de.morphAttributes.color!==void 0,morphTargetsCount:I,morphTextureStride:re,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:R.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:Bt,decodeVideoTexture:Ot&&R.map.isVideoTexture===!0&&Ft.getTransfer(R.map.colorSpace)===Ht,decodeVideoTextureEmissive:It&&R.emissiveMap.isVideoTexture===!0&&Ft.getTransfer(R.emissiveMap.colorSpace)===Ht,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===ri,flipSided:R.side===si,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:ht&&R.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ht&&R.extensions.multiDraw===!0||st)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return Kt.vertexUv1s=m.has(1),Kt.vertexUv2s=m.has(2),Kt.vertexUv3s=m.has(3),m.clear(),Kt}function g(R){const C=[];if(R.shaderID?C.push(R.shaderID):(C.push(R.customVertexShaderID),C.push(R.customFragmentShaderID)),R.defines!==void 0)for(const B in R.defines)C.push(B),C.push(R.defines[B]);return R.isRawShaderMaterial===!1&&(U(C,R),D(C,R),C.push(s.outputColorSpace)),C.push(R.customProgramCacheKey),C.join()}function U(R,C){R.push(C.precision),R.push(C.outputColorSpace),R.push(C.envMapMode),R.push(C.envMapCubeUVHeight),R.push(C.mapUv),R.push(C.alphaMapUv),R.push(C.lightMapUv),R.push(C.aoMapUv),R.push(C.bumpMapUv),R.push(C.normalMapUv),R.push(C.displacementMapUv),R.push(C.emissiveMapUv),R.push(C.metalnessMapUv),R.push(C.roughnessMapUv),R.push(C.anisotropyMapUv),R.push(C.clearcoatMapUv),R.push(C.clearcoatNormalMapUv),R.push(C.clearcoatRoughnessMapUv),R.push(C.iridescenceMapUv),R.push(C.iridescenceThicknessMapUv),R.push(C.sheenColorMapUv),R.push(C.sheenRoughnessMapUv),R.push(C.specularMapUv),R.push(C.specularColorMapUv),R.push(C.specularIntensityMapUv),R.push(C.transmissionMapUv),R.push(C.thicknessMapUv),R.push(C.combine),R.push(C.fogExp2),R.push(C.sizeAttenuation),R.push(C.morphTargetsCount),R.push(C.morphAttributeCount),R.push(C.numDirLights),R.push(C.numPointLights),R.push(C.numSpotLights),R.push(C.numSpotLightMaps),R.push(C.numHemiLights),R.push(C.numRectAreaLights),R.push(C.numDirLightShadows),R.push(C.numPointLightShadows),R.push(C.numSpotLightShadows),R.push(C.numSpotLightShadowsWithMaps),R.push(C.numLightProbes),R.push(C.shadowMapType),R.push(C.toneMapping),R.push(C.numClippingPlanes),R.push(C.numClipIntersection),R.push(C.depthPacking)}function D(R,C){d.disableAll(),C.supportsVertexTextures&&d.enable(0),C.instancing&&d.enable(1),C.instancingColor&&d.enable(2),C.instancingMorph&&d.enable(3),C.matcap&&d.enable(4),C.envMap&&d.enable(5),C.normalMapObjectSpace&&d.enable(6),C.normalMapTangentSpace&&d.enable(7),C.clearcoat&&d.enable(8),C.iridescence&&d.enable(9),C.alphaTest&&d.enable(10),C.vertexColors&&d.enable(11),C.vertexAlphas&&d.enable(12),C.vertexUv1s&&d.enable(13),C.vertexUv2s&&d.enable(14),C.vertexUv3s&&d.enable(15),C.vertexTangents&&d.enable(16),C.anisotropy&&d.enable(17),C.alphaHash&&d.enable(18),C.batching&&d.enable(19),C.dispersion&&d.enable(20),C.batchingColor&&d.enable(21),R.push(d.mask),d.disableAll(),C.fog&&d.enable(0),C.useFog&&d.enable(1),C.flatShading&&d.enable(2),C.logarithmicDepthBuffer&&d.enable(3),C.reverseDepthBuffer&&d.enable(4),C.skinning&&d.enable(5),C.morphTargets&&d.enable(6),C.morphNormals&&d.enable(7),C.morphColors&&d.enable(8),C.premultipliedAlpha&&d.enable(9),C.shadowMapEnabled&&d.enable(10),C.doubleSided&&d.enable(11),C.flipSided&&d.enable(12),C.useDepthPacking&&d.enable(13),C.dithering&&d.enable(14),C.transmission&&d.enable(15),C.sheen&&d.enable(16),C.opaque&&d.enable(17),C.pointsUvs&&d.enable(18),C.decodeVideoTexture&&d.enable(19),C.decodeVideoTextureEmissive&&d.enable(20),C.alphaToCoverage&&d.enable(21),R.push(d.mask)}function b(R){const C=E[R.type];let B;if(C){const ie=sr[C];B=Ng.clone(ie.uniforms)}else B=R.uniforms;return B}function V(R,C){let B;for(let ie=0,Q=_.length;ie<Q;ie++){const ue=_[ie];if(ue.cacheKey===C){B=ue,++B.usedTimes;break}}return B===void 0&&(B=new uE(s,C,R,u),_.push(B)),B}function F(R){if(--R.usedTimes===0){const C=_.indexOf(R);_[C]=_[_.length-1],_.pop(),R.destroy()}}function N(R){p.remove(R)}function W(){p.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:b,acquireProgram:V,releaseProgram:F,releaseShaderCache:N,programs:_,dispose:W}}function pE(){let s=new WeakMap;function e(c){return s.has(c)}function n(c){let d=s.get(c);return d===void 0&&(d={},s.set(c,d)),d}function r(c){s.delete(c)}function a(c,d,p){s.get(c)[d]=p}function u(){s=new WeakMap}return{has:e,get:n,remove:r,update:a,dispose:u}}function mE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function rg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function sg(){const s=[];let e=0;const n=[],r=[],a=[];function u(){e=0,n.length=0,r.length=0,a.length=0}function c(v,x,S,E,T,y){let g=s[e];return g===void 0?(g={id:v.id,object:v,geometry:x,material:S,groupOrder:E,renderOrder:v.renderOrder,z:T,group:y},s[e]=g):(g.id=v.id,g.object=v,g.geometry=x,g.material=S,g.groupOrder=E,g.renderOrder=v.renderOrder,g.z=T,g.group=y),e++,g}function d(v,x,S,E,T,y){const g=c(v,x,S,E,T,y);S.transmission>0?r.push(g):S.transparent===!0?a.push(g):n.push(g)}function p(v,x,S,E,T,y){const g=c(v,x,S,E,T,y);S.transmission>0?r.unshift(g):S.transparent===!0?a.unshift(g):n.unshift(g)}function m(v,x){n.length>1&&n.sort(v||mE),r.length>1&&r.sort(x||rg),a.length>1&&a.sort(x||rg)}function _(){for(let v=e,x=s.length;v<x;v++){const S=s[v];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:n,transmissive:r,transparent:a,init:u,push:d,unshift:p,finish:_,sort:m}}function gE(){let s=new WeakMap;function e(r,a){const u=s.get(r);let c;return u===void 0?(c=new sg,s.set(r,[c])):a>=u.length?(c=new sg,u.push(c)):c=u[a],c}function n(){s=new WeakMap}return{get:e,dispose:n}}function _E(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new j,color:new _t};break;case"SpotLight":n={position:new j,direction:new j,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new j,color:new _t,distance:0,decay:0};break;case"HemisphereLight":n={direction:new j,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":n={color:new _t,position:new j,halfWidth:new j,halfHeight:new j};break}return s[e.id]=n,n}}}function vE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=n,n}}}let xE=0;function yE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function SE(s){const e=new _E,n=vE(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new j);const a=new j,u=new en,c=new en;function d(m){let _=0,v=0,x=0;for(let R=0;R<9;R++)r.probe[R].set(0,0,0);let S=0,E=0,T=0,y=0,g=0,U=0,D=0,b=0,V=0,F=0,N=0;m.sort(yE);for(let R=0,C=m.length;R<C;R++){const B=m[R],ie=B.color,Q=B.intensity,ue=B.distance,de=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)_+=ie.r*Q,v+=ie.g*Q,x+=ie.b*Q;else if(B.isLightProbe){for(let le=0;le<9;le++)r.probe[le].addScaledVector(B.sh.coefficients[le],Q);N++}else if(B.isDirectionalLight){const le=e.get(B);if(le.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const fe=B.shadow,z=n.get(B);z.shadowIntensity=fe.intensity,z.shadowBias=fe.bias,z.shadowNormalBias=fe.normalBias,z.shadowRadius=fe.radius,z.shadowMapSize=fe.mapSize,r.directionalShadow[S]=z,r.directionalShadowMap[S]=de,r.directionalShadowMatrix[S]=B.shadow.matrix,U++}r.directional[S]=le,S++}else if(B.isSpotLight){const le=e.get(B);le.position.setFromMatrixPosition(B.matrixWorld),le.color.copy(ie).multiplyScalar(Q),le.distance=ue,le.coneCos=Math.cos(B.angle),le.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),le.decay=B.decay,r.spot[T]=le;const fe=B.shadow;if(B.map&&(r.spotLightMap[V]=B.map,V++,fe.updateMatrices(B),B.castShadow&&F++),r.spotLightMatrix[T]=fe.matrix,B.castShadow){const z=n.get(B);z.shadowIntensity=fe.intensity,z.shadowBias=fe.bias,z.shadowNormalBias=fe.normalBias,z.shadowRadius=fe.radius,z.shadowMapSize=fe.mapSize,r.spotShadow[T]=z,r.spotShadowMap[T]=de,b++}T++}else if(B.isRectAreaLight){const le=e.get(B);le.color.copy(ie).multiplyScalar(Q),le.halfWidth.set(B.width*.5,0,0),le.halfHeight.set(0,B.height*.5,0),r.rectArea[y]=le,y++}else if(B.isPointLight){const le=e.get(B);if(le.color.copy(B.color).multiplyScalar(B.intensity),le.distance=B.distance,le.decay=B.decay,B.castShadow){const fe=B.shadow,z=n.get(B);z.shadowIntensity=fe.intensity,z.shadowBias=fe.bias,z.shadowNormalBias=fe.normalBias,z.shadowRadius=fe.radius,z.shadowMapSize=fe.mapSize,z.shadowCameraNear=fe.camera.near,z.shadowCameraFar=fe.camera.far,r.pointShadow[E]=z,r.pointShadowMap[E]=de,r.pointShadowMatrix[E]=B.shadow.matrix,D++}r.point[E]=le,E++}else if(B.isHemisphereLight){const le=e.get(B);le.skyColor.copy(B.color).multiplyScalar(Q),le.groundColor.copy(B.groundColor).multiplyScalar(Q),r.hemi[g]=le,g++}}y>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Fe.LTC_FLOAT_1,r.rectAreaLTC2=Fe.LTC_FLOAT_2):(r.rectAreaLTC1=Fe.LTC_HALF_1,r.rectAreaLTC2=Fe.LTC_HALF_2)),r.ambient[0]=_,r.ambient[1]=v,r.ambient[2]=x;const W=r.hash;(W.directionalLength!==S||W.pointLength!==E||W.spotLength!==T||W.rectAreaLength!==y||W.hemiLength!==g||W.numDirectionalShadows!==U||W.numPointShadows!==D||W.numSpotShadows!==b||W.numSpotMaps!==V||W.numLightProbes!==N)&&(r.directional.length=S,r.spot.length=T,r.rectArea.length=y,r.point.length=E,r.hemi.length=g,r.directionalShadow.length=U,r.directionalShadowMap.length=U,r.pointShadow.length=D,r.pointShadowMap.length=D,r.spotShadow.length=b,r.spotShadowMap.length=b,r.directionalShadowMatrix.length=U,r.pointShadowMatrix.length=D,r.spotLightMatrix.length=b+V-F,r.spotLightMap.length=V,r.numSpotLightShadowsWithMaps=F,r.numLightProbes=N,W.directionalLength=S,W.pointLength=E,W.spotLength=T,W.rectAreaLength=y,W.hemiLength=g,W.numDirectionalShadows=U,W.numPointShadows=D,W.numSpotShadows=b,W.numSpotMaps=V,W.numLightProbes=N,r.version=xE++)}function p(m,_){let v=0,x=0,S=0,E=0,T=0;const y=_.matrixWorldInverse;for(let g=0,U=m.length;g<U;g++){const D=m[g];if(D.isDirectionalLight){const b=r.directional[v];b.direction.setFromMatrixPosition(D.matrixWorld),a.setFromMatrixPosition(D.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),v++}else if(D.isSpotLight){const b=r.spot[S];b.position.setFromMatrixPosition(D.matrixWorld),b.position.applyMatrix4(y),b.direction.setFromMatrixPosition(D.matrixWorld),a.setFromMatrixPosition(D.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),S++}else if(D.isRectAreaLight){const b=r.rectArea[E];b.position.setFromMatrixPosition(D.matrixWorld),b.position.applyMatrix4(y),c.identity(),u.copy(D.matrixWorld),u.premultiply(y),c.extractRotation(u),b.halfWidth.set(D.width*.5,0,0),b.halfHeight.set(0,D.height*.5,0),b.halfWidth.applyMatrix4(c),b.halfHeight.applyMatrix4(c),E++}else if(D.isPointLight){const b=r.point[x];b.position.setFromMatrixPosition(D.matrixWorld),b.position.applyMatrix4(y),x++}else if(D.isHemisphereLight){const b=r.hemi[T];b.direction.setFromMatrixPosition(D.matrixWorld),b.direction.transformDirection(y),T++}}}return{setup:d,setupView:p,state:r}}function og(s){const e=new SE(s),n=[],r=[];function a(_){m.camera=_,n.length=0,r.length=0}function u(_){n.push(_)}function c(_){r.push(_)}function d(){e.setup(n)}function p(_){e.setupView(n,_)}const m={lightsArray:n,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:d,setupLightsView:p,pushLight:u,pushShadow:c}}function ME(s){let e=new WeakMap;function n(a,u=0){const c=e.get(a);let d;return c===void 0?(d=new og(s),e.set(a,[d])):u>=c.length?(d=new og(s),c.push(d)):d=c[u],d}function r(){e=new WeakMap}return{get:n,dispose:r}}const EE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function TE(s,e,n){let r=new Dd;const a=new Lt,u=new Lt,c=new ln,d=new qv({depthPacking:lv}),p=new $v,m={},_=n.maxTextureSize,v={[cs]:si,[si]:cs,[ri]:ri},x=new Nr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:EE,fragmentShader:wE}),S=x.clone();S.defines.HORIZONTAL_PASS=1;const E=new an;E.setAttribute("position",new qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new pn(E,x),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pg;let g=this.type;this.render=function(F,N,W){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||F.length===0)return;const R=s.getRenderTarget(),C=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),ie=s.state;ie.setBlending(ls),ie.buffers.color.setClear(1,1,1,1),ie.buffers.depth.setTest(!0),ie.setScissorTest(!1);const Q=g!==Cr&&this.type===Cr,ue=g===Cr&&this.type!==Cr;for(let de=0,le=F.length;de<le;de++){const fe=F[de],z=fe.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",fe,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;a.copy(z.mapSize);const ce=z.getFrameExtents();if(a.multiply(ce),u.copy(z.mapSize),(a.x>_||a.y>_)&&(a.x>_&&(u.x=Math.floor(_/ce.x),a.x=u.x*ce.x,z.mapSize.x=u.x),a.y>_&&(u.y=Math.floor(_/ce.y),a.y=u.y*ce.y,z.mapSize.y=u.y)),z.map===null||Q===!0||ue===!0){const I=this.type!==Cr?{minFilter:Gi,magFilter:Gi}:{};z.map!==null&&z.map.dispose(),z.map=new Gs(a.x,a.y,I),z.map.texture.name=fe.name+".shadowMap",z.camera.updateProjectionMatrix()}s.setRenderTarget(z.map),s.clear();const ae=z.getViewportCount();for(let I=0;I<ae;I++){const re=z.getViewport(I);c.set(u.x*re.x,u.y*re.y,u.x*re.z,u.y*re.w),ie.viewport(c),z.updateMatrices(fe,I),r=z.getFrustum(),b(N,W,z.camera,fe,this.type)}z.isPointLightShadow!==!0&&this.type===Cr&&U(z,W),z.needsUpdate=!1}g=this.type,y.needsUpdate=!1,s.setRenderTarget(R,C,B)};function U(F,N){const W=e.update(T);x.defines.VSM_SAMPLES!==F.blurSamples&&(x.defines.VSM_SAMPLES=F.blurSamples,S.defines.VSM_SAMPLES=F.blurSamples,x.needsUpdate=!0,S.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new Gs(a.x,a.y)),x.uniforms.shadow_pass.value=F.map.texture,x.uniforms.resolution.value=F.mapSize,x.uniforms.radius.value=F.radius,s.setRenderTarget(F.mapPass),s.clear(),s.renderBufferDirect(N,null,W,x,T,null),S.uniforms.shadow_pass.value=F.mapPass.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,s.setRenderTarget(F.map),s.clear(),s.renderBufferDirect(N,null,W,S,T,null)}function D(F,N,W,R){let C=null;const B=W.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(B!==void 0)C=B;else if(C=W.isPointLight===!0?p:d,s.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0){const ie=C.uuid,Q=N.uuid;let ue=m[ie];ue===void 0&&(ue={},m[ie]=ue);let de=ue[Q];de===void 0&&(de=C.clone(),ue[Q]=de,N.addEventListener("dispose",V)),C=de}if(C.visible=N.visible,C.wireframe=N.wireframe,R===Cr?C.side=N.shadowSide!==null?N.shadowSide:N.side:C.side=N.shadowSide!==null?N.shadowSide:v[N.side],C.alphaMap=N.alphaMap,C.alphaTest=N.alphaTest,C.map=N.map,C.clipShadows=N.clipShadows,C.clippingPlanes=N.clippingPlanes,C.clipIntersection=N.clipIntersection,C.displacementMap=N.displacementMap,C.displacementScale=N.displacementScale,C.displacementBias=N.displacementBias,C.wireframeLinewidth=N.wireframeLinewidth,C.linewidth=N.linewidth,W.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const ie=s.properties.get(C);ie.light=W}return C}function b(F,N,W,R,C){if(F.visible===!1)return;if(F.layers.test(N.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&C===Cr)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,F.matrixWorld);const Q=e.update(F),ue=F.material;if(Array.isArray(ue)){const de=Q.groups;for(let le=0,fe=de.length;le<fe;le++){const z=de[le],ce=ue[z.materialIndex];if(ce&&ce.visible){const ae=D(F,ce,R,C);F.onBeforeShadow(s,F,N,W,Q,ae,z),s.renderBufferDirect(W,null,Q,ae,F,z),F.onAfterShadow(s,F,N,W,Q,ae,z)}}}else if(ue.visible){const de=D(F,ue,R,C);F.onBeforeShadow(s,F,N,W,Q,de,null),s.renderBufferDirect(W,null,Q,de,F,null),F.onAfterShadow(s,F,N,W,Q,de,null)}}const ie=F.children;for(let Q=0,ue=ie.length;Q<ue;Q++)b(ie[Q],N,W,R,C)}function V(F){F.target.removeEventListener("dispose",V);for(const W in m){const R=m[W],C=F.target.uuid;C in R&&(R[C].dispose(),delete R[C])}}}const AE={[If]:Nf,[Ff]:kf,[Of]:zf,[ko]:Bf,[Nf]:If,[kf]:Ff,[zf]:Of,[Bf]:ko};function CE(s,e){function n(){let X=!1;const Le=new ln;let oe=null;const pe=new ln(0,0,0,0);return{setMask:function(Oe){oe!==Oe&&!X&&(s.colorMask(Oe,Oe,Oe,Oe),oe=Oe)},setLocked:function(Oe){X=Oe},setClear:function(Oe,Ne,ht,Bt,Kt){Kt===!0&&(Oe*=Bt,Ne*=Bt,ht*=Bt),Le.set(Oe,Ne,ht,Bt),pe.equals(Le)===!1&&(s.clearColor(Oe,Ne,ht,Bt),pe.copy(Le))},reset:function(){X=!1,oe=null,pe.set(-1,0,0,0)}}}function r(){let X=!1,Le=!1,oe=null,pe=null,Oe=null;return{setReversed:function(Ne){if(Le!==Ne){const ht=e.get("EXT_clip_control");Le?ht.clipControlEXT(ht.LOWER_LEFT_EXT,ht.ZERO_TO_ONE_EXT):ht.clipControlEXT(ht.LOWER_LEFT_EXT,ht.NEGATIVE_ONE_TO_ONE_EXT);const Bt=Oe;Oe=null,this.setClear(Bt)}Le=Ne},getReversed:function(){return Le},setTest:function(Ne){Ne?Ee(s.DEPTH_TEST):De(s.DEPTH_TEST)},setMask:function(Ne){oe!==Ne&&!X&&(s.depthMask(Ne),oe=Ne)},setFunc:function(Ne){if(Le&&(Ne=AE[Ne]),pe!==Ne){switch(Ne){case If:s.depthFunc(s.NEVER);break;case Nf:s.depthFunc(s.ALWAYS);break;case Ff:s.depthFunc(s.LESS);break;case ko:s.depthFunc(s.LEQUAL);break;case Of:s.depthFunc(s.EQUAL);break;case Bf:s.depthFunc(s.GEQUAL);break;case kf:s.depthFunc(s.GREATER);break;case zf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=Ne}},setLocked:function(Ne){X=Ne},setClear:function(Ne){Oe!==Ne&&(Le&&(Ne=1-Ne),s.clearDepth(Ne),Oe=Ne)},reset:function(){X=!1,oe=null,pe=null,Oe=null,Le=!1}}}function a(){let X=!1,Le=null,oe=null,pe=null,Oe=null,Ne=null,ht=null,Bt=null,Kt=null;return{setTest:function(Ct){X||(Ct?Ee(s.STENCIL_TEST):De(s.STENCIL_TEST))},setMask:function(Ct){Le!==Ct&&!X&&(s.stencilMask(Ct),Le=Ct)},setFunc:function(Ct,Rn,bn){(oe!==Ct||pe!==Rn||Oe!==bn)&&(s.stencilFunc(Ct,Rn,bn),oe=Ct,pe=Rn,Oe=bn)},setOp:function(Ct,Rn,bn){(Ne!==Ct||ht!==Rn||Bt!==bn)&&(s.stencilOp(Ct,Rn,bn),Ne=Ct,ht=Rn,Bt=bn)},setLocked:function(Ct){X=Ct},setClear:function(Ct){Kt!==Ct&&(s.clearStencil(Ct),Kt=Ct)},reset:function(){X=!1,Le=null,oe=null,pe=null,Oe=null,Ne=null,ht=null,Bt=null,Kt=null}}}const u=new n,c=new r,d=new a,p=new WeakMap,m=new WeakMap;let _={},v={},x=new WeakMap,S=[],E=null,T=!1,y=null,g=null,U=null,D=null,b=null,V=null,F=null,N=new _t(0,0,0),W=0,R=!1,C=null,B=null,ie=null,Q=null,ue=null;const de=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let le=!1,fe=0;const z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(fe=parseFloat(/^WebGL (\d)/.exec(z)[1]),le=fe>=1):z.indexOf("OpenGL ES")!==-1&&(fe=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),le=fe>=2);let ce=null,ae={};const I=s.getParameter(s.SCISSOR_BOX),re=s.getParameter(s.VIEWPORT),Ge=new ln().fromArray(I),ee=new ln().fromArray(re);function me(X,Le,oe,pe){const Oe=new Uint8Array(4),Ne=s.createTexture();s.bindTexture(X,Ne),s.texParameteri(X,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(X,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ht=0;ht<oe;ht++)X===s.TEXTURE_3D||X===s.TEXTURE_2D_ARRAY?s.texImage3D(Le,0,s.RGBA,1,1,pe,0,s.RGBA,s.UNSIGNED_BYTE,Oe):s.texImage2D(Le+ht,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Oe);return Ne}const Ce={};Ce[s.TEXTURE_2D]=me(s.TEXTURE_2D,s.TEXTURE_2D,1),Ce[s.TEXTURE_CUBE_MAP]=me(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ce[s.TEXTURE_2D_ARRAY]=me(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ce[s.TEXTURE_3D]=me(s.TEXTURE_3D,s.TEXTURE_3D,1,1),u.setClear(0,0,0,1),c.setClear(1),d.setClear(0),Ee(s.DEPTH_TEST),c.setFunc(ko),nt(!1),ot(nm),Ee(s.CULL_FACE),O(ls);function Ee(X){_[X]!==!0&&(s.enable(X),_[X]=!0)}function De(X){_[X]!==!1&&(s.disable(X),_[X]=!1)}function ze(X,Le){return v[X]!==Le?(s.bindFramebuffer(X,Le),v[X]=Le,X===s.DRAW_FRAMEBUFFER&&(v[s.FRAMEBUFFER]=Le),X===s.FRAMEBUFFER&&(v[s.DRAW_FRAMEBUFFER]=Le),!0):!1}function st(X,Le){let oe=S,pe=!1;if(X){oe=x.get(Le),oe===void 0&&(oe=[],x.set(Le,oe));const Oe=X.textures;if(oe.length!==Oe.length||oe[0]!==s.COLOR_ATTACHMENT0){for(let Ne=0,ht=Oe.length;Ne<ht;Ne++)oe[Ne]=s.COLOR_ATTACHMENT0+Ne;oe.length=Oe.length,pe=!0}}else oe[0]!==s.BACK&&(oe[0]=s.BACK,pe=!0);pe&&s.drawBuffers(oe)}function Ot(X){return E!==X?(s.useProgram(X),E=X,!0):!1}const St={[Bs]:s.FUNC_ADD,[I_]:s.FUNC_SUBTRACT,[N_]:s.FUNC_REVERSE_SUBTRACT};St[F_]=s.MIN,St[O_]=s.MAX;const Se={[B_]:s.ZERO,[k_]:s.ONE,[z_]:s.SRC_COLOR,[Lf]:s.SRC_ALPHA,[j_]:s.SRC_ALPHA_SATURATE,[W_]:s.DST_COLOR,[V_]:s.DST_ALPHA,[H_]:s.ONE_MINUS_SRC_COLOR,[Uf]:s.ONE_MINUS_SRC_ALPHA,[X_]:s.ONE_MINUS_DST_COLOR,[G_]:s.ONE_MINUS_DST_ALPHA,[q_]:s.CONSTANT_COLOR,[$_]:s.ONE_MINUS_CONSTANT_COLOR,[Y_]:s.CONSTANT_ALPHA,[K_]:s.ONE_MINUS_CONSTANT_ALPHA};function O(X,Le,oe,pe,Oe,Ne,ht,Bt,Kt,Ct){if(X===ls){T===!0&&(De(s.BLEND),T=!1);return}if(T===!1&&(Ee(s.BLEND),T=!0),X!==U_){if(X!==y||Ct!==R){if((g!==Bs||b!==Bs)&&(s.blendEquation(s.FUNC_ADD),g=Bs,b=Bs),Ct)switch(X){case Fo:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Df:s.blendFunc(s.ONE,s.ONE);break;case im:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case rm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}else switch(X){case Fo:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Df:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case im:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case rm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}U=null,D=null,V=null,F=null,N.set(0,0,0),W=0,y=X,R=Ct}return}Oe=Oe||Le,Ne=Ne||oe,ht=ht||pe,(Le!==g||Oe!==b)&&(s.blendEquationSeparate(St[Le],St[Oe]),g=Le,b=Oe),(oe!==U||pe!==D||Ne!==V||ht!==F)&&(s.blendFuncSeparate(Se[oe],Se[pe],Se[Ne],Se[ht]),U=oe,D=pe,V=Ne,F=ht),(Bt.equals(N)===!1||Kt!==W)&&(s.blendColor(Bt.r,Bt.g,Bt.b,Kt),N.copy(Bt),W=Kt),y=X,R=!1}function Rt(X,Le){X.side===ri?De(s.CULL_FACE):Ee(s.CULL_FACE);let oe=X.side===si;Le&&(oe=!oe),nt(oe),X.blending===Fo&&X.transparent===!1?O(ls):O(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),c.setFunc(X.depthFunc),c.setTest(X.depthTest),c.setMask(X.depthWrite),u.setMask(X.colorWrite);const pe=X.stencilWrite;d.setTest(pe),pe&&(d.setMask(X.stencilWriteMask),d.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),d.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),It(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?Ee(s.SAMPLE_ALPHA_TO_COVERAGE):De(s.SAMPLE_ALPHA_TO_COVERAGE)}function nt(X){C!==X&&(X?s.frontFace(s.CW):s.frontFace(s.CCW),C=X)}function ot(X){X!==P_?(Ee(s.CULL_FACE),X!==B&&(X===nm?s.cullFace(s.BACK):X===D_?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):De(s.CULL_FACE),B=X}function Je(X){X!==ie&&(le&&s.lineWidth(X),ie=X)}function It(X,Le,oe){X?(Ee(s.POLYGON_OFFSET_FILL),(Q!==Le||ue!==oe)&&(s.polygonOffset(Le,oe),Q=Le,ue=oe)):De(s.POLYGON_OFFSET_FILL)}function qe(X){X?Ee(s.SCISSOR_TEST):De(s.SCISSOR_TEST)}function P(X){X===void 0&&(X=s.TEXTURE0+de-1),ce!==X&&(s.activeTexture(X),ce=X)}function w(X,Le,oe){oe===void 0&&(ce===null?oe=s.TEXTURE0+de-1:oe=ce);let pe=ae[oe];pe===void 0&&(pe={type:void 0,texture:void 0},ae[oe]=pe),(pe.type!==X||pe.texture!==Le)&&(ce!==oe&&(s.activeTexture(oe),ce=oe),s.bindTexture(X,Le||Ce[X]),pe.type=X,pe.texture=Le)}function J(){const X=ae[ce];X!==void 0&&X.type!==void 0&&(s.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function ge(){try{s.compressedTexImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function xe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function he(){try{s.texSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ze(){try{s.texSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ue(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function He(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function mt(){try{s.texStorage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Te(){try{s.texStorage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function je(){try{s.texImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function it(){try{s.texImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function ft(X){Ge.equals(X)===!1&&(s.scissor(X.x,X.y,X.z,X.w),Ge.copy(X))}function We(X){ee.equals(X)===!1&&(s.viewport(X.x,X.y,X.z,X.w),ee.copy(X))}function gt(X,Le){let oe=m.get(Le);oe===void 0&&(oe=new WeakMap,m.set(Le,oe));let pe=oe.get(X);pe===void 0&&(pe=s.getUniformBlockIndex(Le,X.name),oe.set(X,pe))}function dt(X,Le){const pe=m.get(Le).get(X);p.get(Le)!==pe&&(s.uniformBlockBinding(Le,pe,X.__bindingPointIndex),p.set(Le,pe))}function Dt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),_={},ce=null,ae={},v={},x=new WeakMap,S=[],E=null,T=!1,y=null,g=null,U=null,D=null,b=null,V=null,F=null,N=new _t(0,0,0),W=0,R=!1,C=null,B=null,ie=null,Q=null,ue=null,Ge.set(0,0,s.canvas.width,s.canvas.height),ee.set(0,0,s.canvas.width,s.canvas.height),u.reset(),c.reset(),d.reset()}return{buffers:{color:u,depth:c,stencil:d},enable:Ee,disable:De,bindFramebuffer:ze,drawBuffers:st,useProgram:Ot,setBlending:O,setMaterial:Rt,setFlipSided:nt,setCullFace:ot,setLineWidth:Je,setPolygonOffset:It,setScissorTest:qe,activeTexture:P,bindTexture:w,unbindTexture:J,compressedTexImage2D:ge,compressedTexImage3D:xe,texImage2D:je,texImage3D:it,updateUBOMapping:gt,uniformBlockBinding:dt,texStorage2D:mt,texStorage3D:Te,texSubImage2D:he,texSubImage3D:Ze,compressedTexSubImage2D:Ue,compressedTexSubImage3D:He,scissor:ft,viewport:We,reset:Dt}}function RE(s,e,n,r,a,u,c){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new Lt,_=new WeakMap;let v;const x=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(P,w){return S?new OffscreenCanvas(P,w):pu("canvas")}function T(P,w,J){let ge=1;const xe=qe(P);if((xe.width>J||xe.height>J)&&(ge=J/Math.max(xe.width,xe.height)),ge<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const he=Math.floor(ge*xe.width),Ze=Math.floor(ge*xe.height);v===void 0&&(v=E(he,Ze));const Ue=w?E(he,Ze):v;return Ue.width=he,Ue.height=Ze,Ue.getContext("2d").drawImage(P,0,0,he,Ze),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+xe.width+"x"+xe.height+") to ("+he+"x"+Ze+")."),Ue}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+xe.width+"x"+xe.height+")."),P;return P}function y(P){return P.generateMipmaps}function g(P){s.generateMipmap(P)}function U(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function D(P,w,J,ge,xe=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he=w;if(w===s.RED&&(J===s.FLOAT&&(he=s.R32F),J===s.HALF_FLOAT&&(he=s.R16F),J===s.UNSIGNED_BYTE&&(he=s.R8)),w===s.RED_INTEGER&&(J===s.UNSIGNED_BYTE&&(he=s.R8UI),J===s.UNSIGNED_SHORT&&(he=s.R16UI),J===s.UNSIGNED_INT&&(he=s.R32UI),J===s.BYTE&&(he=s.R8I),J===s.SHORT&&(he=s.R16I),J===s.INT&&(he=s.R32I)),w===s.RG&&(J===s.FLOAT&&(he=s.RG32F),J===s.HALF_FLOAT&&(he=s.RG16F),J===s.UNSIGNED_BYTE&&(he=s.RG8)),w===s.RG_INTEGER&&(J===s.UNSIGNED_BYTE&&(he=s.RG8UI),J===s.UNSIGNED_SHORT&&(he=s.RG16UI),J===s.UNSIGNED_INT&&(he=s.RG32UI),J===s.BYTE&&(he=s.RG8I),J===s.SHORT&&(he=s.RG16I),J===s.INT&&(he=s.RG32I)),w===s.RGB_INTEGER&&(J===s.UNSIGNED_BYTE&&(he=s.RGB8UI),J===s.UNSIGNED_SHORT&&(he=s.RGB16UI),J===s.UNSIGNED_INT&&(he=s.RGB32UI),J===s.BYTE&&(he=s.RGB8I),J===s.SHORT&&(he=s.RGB16I),J===s.INT&&(he=s.RGB32I)),w===s.RGBA_INTEGER&&(J===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),J===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),J===s.UNSIGNED_INT&&(he=s.RGBA32UI),J===s.BYTE&&(he=s.RGBA8I),J===s.SHORT&&(he=s.RGBA16I),J===s.INT&&(he=s.RGBA32I)),w===s.RGB&&J===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),w===s.RGBA){const Ze=xe?du:Ft.getTransfer(ge);J===s.FLOAT&&(he=s.RGBA32F),J===s.HALF_FLOAT&&(he=s.RGBA16F),J===s.UNSIGNED_BYTE&&(he=Ze===Ht?s.SRGB8_ALPHA8:s.RGBA8),J===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),J===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function b(P,w){let J;return P?w===null||w===Vs||w===Vo?J=s.DEPTH24_STENCIL8:w===Dr?J=s.DEPTH32F_STENCIL8:w===Da&&(J=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Vs||w===Vo?J=s.DEPTH_COMPONENT24:w===Dr?J=s.DEPTH_COMPONENT32F:w===Da&&(J=s.DEPTH_COMPONENT16),J}function V(P,w){return y(P)===!0||P.isFramebufferTexture&&P.minFilter!==Gi&&P.minFilter!==or?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function F(P){const w=P.target;w.removeEventListener("dispose",F),W(w),w.isVideoTexture&&_.delete(w)}function N(P){const w=P.target;w.removeEventListener("dispose",N),C(w)}function W(P){const w=r.get(P);if(w.__webglInit===void 0)return;const J=P.source,ge=x.get(J);if(ge){const xe=ge[w.__cacheKey];xe.usedTimes--,xe.usedTimes===0&&R(P),Object.keys(ge).length===0&&x.delete(J)}r.remove(P)}function R(P){const w=r.get(P);s.deleteTexture(w.__webglTexture);const J=P.source,ge=x.get(J);delete ge[w.__cacheKey],c.memory.textures--}function C(P){const w=r.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),r.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(w.__webglFramebuffer[ge]))for(let xe=0;xe<w.__webglFramebuffer[ge].length;xe++)s.deleteFramebuffer(w.__webglFramebuffer[ge][xe]);else s.deleteFramebuffer(w.__webglFramebuffer[ge]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[ge])}else{if(Array.isArray(w.__webglFramebuffer))for(let ge=0;ge<w.__webglFramebuffer.length;ge++)s.deleteFramebuffer(w.__webglFramebuffer[ge]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ge=0;ge<w.__webglColorRenderbuffer.length;ge++)w.__webglColorRenderbuffer[ge]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[ge]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const J=P.textures;for(let ge=0,xe=J.length;ge<xe;ge++){const he=r.get(J[ge]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),c.memory.textures--),r.remove(J[ge])}r.remove(P)}let B=0;function ie(){B=0}function Q(){const P=B;return P>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+a.maxTextures),B+=1,P}function ue(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function de(P,w){const J=r.get(P);if(P.isVideoTexture&&Je(P),P.isRenderTargetTexture===!1&&P.version>0&&J.__version!==P.version){const ge=P.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(J,P,w);return}}n.bindTexture(s.TEXTURE_2D,J.__webglTexture,s.TEXTURE0+w)}function le(P,w){const J=r.get(P);if(P.version>0&&J.__version!==P.version){ee(J,P,w);return}n.bindTexture(s.TEXTURE_2D_ARRAY,J.__webglTexture,s.TEXTURE0+w)}function fe(P,w){const J=r.get(P);if(P.version>0&&J.__version!==P.version){ee(J,P,w);return}n.bindTexture(s.TEXTURE_3D,J.__webglTexture,s.TEXTURE0+w)}function z(P,w){const J=r.get(P);if(P.version>0&&J.__version!==P.version){me(J,P,w);return}n.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture,s.TEXTURE0+w)}const ce={[Gf]:s.REPEAT,[zs]:s.CLAMP_TO_EDGE,[Wf]:s.MIRRORED_REPEAT},ae={[Gi]:s.NEAREST,[ov]:s.NEAREST_MIPMAP_NEAREST,[Pl]:s.NEAREST_MIPMAP_LINEAR,[or]:s.LINEAR,[Yc]:s.LINEAR_MIPMAP_NEAREST,[Hs]:s.LINEAR_MIPMAP_LINEAR},I={[cv]:s.NEVER,[gv]:s.ALWAYS,[fv]:s.LESS,[Cg]:s.LEQUAL,[dv]:s.EQUAL,[mv]:s.GEQUAL,[hv]:s.GREATER,[pv]:s.NOTEQUAL};function re(P,w){if(w.type===Dr&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===or||w.magFilter===Yc||w.magFilter===Pl||w.magFilter===Hs||w.minFilter===or||w.minFilter===Yc||w.minFilter===Pl||w.minFilter===Hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,ce[w.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,ce[w.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,ce[w.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,ae[w.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,ae[w.minFilter]),w.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,I[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Gi||w.minFilter!==Pl&&w.minFilter!==Hs||w.type===Dr&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||r.get(w).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,a.getMaxAnisotropy())),r.get(w).__currentAnisotropy=w.anisotropy}}}function Ge(P,w){let J=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",F));const ge=w.source;let xe=x.get(ge);xe===void 0&&(xe={},x.set(ge,xe));const he=ue(w);if(he!==P.__cacheKey){xe[he]===void 0&&(xe[he]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,J=!0),xe[he].usedTimes++;const Ze=xe[P.__cacheKey];Ze!==void 0&&(xe[P.__cacheKey].usedTimes--,Ze.usedTimes===0&&R(w)),P.__cacheKey=he,P.__webglTexture=xe[he].texture}return J}function ee(P,w,J){let ge=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ge=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ge=s.TEXTURE_3D);const xe=Ge(P,w),he=w.source;n.bindTexture(ge,P.__webglTexture,s.TEXTURE0+J);const Ze=r.get(he);if(he.version!==Ze.__version||xe===!0){n.activeTexture(s.TEXTURE0+J);const Ue=Ft.getPrimaries(Ft.workingColorSpace),He=w.colorSpace===as?null:Ft.getPrimaries(w.colorSpace),mt=w.colorSpace===as||Ue===He?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);let Te=T(w.image,!1,a.maxTextureSize);Te=It(w,Te);const je=u.convert(w.format,w.colorSpace),it=u.convert(w.type);let ft=D(w.internalFormat,je,it,w.colorSpace,w.isVideoTexture);re(ge,w);let We;const gt=w.mipmaps,dt=w.isVideoTexture!==!0,Dt=Ze.__version===void 0||xe===!0,X=he.dataReady,Le=V(w,Te);if(w.isDepthTexture)ft=b(w.format===Go,w.type),Dt&&(dt?n.texStorage2D(s.TEXTURE_2D,1,ft,Te.width,Te.height):n.texImage2D(s.TEXTURE_2D,0,ft,Te.width,Te.height,0,je,it,null));else if(w.isDataTexture)if(gt.length>0){dt&&Dt&&n.texStorage2D(s.TEXTURE_2D,Le,ft,gt[0].width,gt[0].height);for(let oe=0,pe=gt.length;oe<pe;oe++)We=gt[oe],dt?X&&n.texSubImage2D(s.TEXTURE_2D,oe,0,0,We.width,We.height,je,it,We.data):n.texImage2D(s.TEXTURE_2D,oe,ft,We.width,We.height,0,je,it,We.data);w.generateMipmaps=!1}else dt?(Dt&&n.texStorage2D(s.TEXTURE_2D,Le,ft,Te.width,Te.height),X&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,Te.width,Te.height,je,it,Te.data)):n.texImage2D(s.TEXTURE_2D,0,ft,Te.width,Te.height,0,je,it,Te.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){dt&&Dt&&n.texStorage3D(s.TEXTURE_2D_ARRAY,Le,ft,gt[0].width,gt[0].height,Te.depth);for(let oe=0,pe=gt.length;oe<pe;oe++)if(We=gt[oe],w.format!==Vi)if(je!==null)if(dt){if(X)if(w.layerUpdates.size>0){const Oe=Fm(We.width,We.height,w.format,w.type);for(const Ne of w.layerUpdates){const ht=We.data.subarray(Ne*Oe/We.data.BYTES_PER_ELEMENT,(Ne+1)*Oe/We.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,Ne,We.width,We.height,1,je,ht)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,0,We.width,We.height,Te.depth,je,We.data)}else n.compressedTexImage3D(s.TEXTURE_2D_ARRAY,oe,ft,We.width,We.height,Te.depth,0,We.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else dt?X&&n.texSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,0,We.width,We.height,Te.depth,je,it,We.data):n.texImage3D(s.TEXTURE_2D_ARRAY,oe,ft,We.width,We.height,Te.depth,0,je,it,We.data)}else{dt&&Dt&&n.texStorage2D(s.TEXTURE_2D,Le,ft,gt[0].width,gt[0].height);for(let oe=0,pe=gt.length;oe<pe;oe++)We=gt[oe],w.format!==Vi?je!==null?dt?X&&n.compressedTexSubImage2D(s.TEXTURE_2D,oe,0,0,We.width,We.height,je,We.data):n.compressedTexImage2D(s.TEXTURE_2D,oe,ft,We.width,We.height,0,We.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):dt?X&&n.texSubImage2D(s.TEXTURE_2D,oe,0,0,We.width,We.height,je,it,We.data):n.texImage2D(s.TEXTURE_2D,oe,ft,We.width,We.height,0,je,it,We.data)}else if(w.isDataArrayTexture)if(dt){if(Dt&&n.texStorage3D(s.TEXTURE_2D_ARRAY,Le,ft,Te.width,Te.height,Te.depth),X)if(w.layerUpdates.size>0){const oe=Fm(Te.width,Te.height,w.format,w.type);for(const pe of w.layerUpdates){const Oe=Te.data.subarray(pe*oe/Te.data.BYTES_PER_ELEMENT,(pe+1)*oe/Te.data.BYTES_PER_ELEMENT);n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,pe,Te.width,Te.height,1,je,it,Oe)}w.clearLayerUpdates()}else n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Te.width,Te.height,Te.depth,je,it,Te.data)}else n.texImage3D(s.TEXTURE_2D_ARRAY,0,ft,Te.width,Te.height,Te.depth,0,je,it,Te.data);else if(w.isData3DTexture)dt?(Dt&&n.texStorage3D(s.TEXTURE_3D,Le,ft,Te.width,Te.height,Te.depth),X&&n.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Te.width,Te.height,Te.depth,je,it,Te.data)):n.texImage3D(s.TEXTURE_3D,0,ft,Te.width,Te.height,Te.depth,0,je,it,Te.data);else if(w.isFramebufferTexture){if(Dt)if(dt)n.texStorage2D(s.TEXTURE_2D,Le,ft,Te.width,Te.height);else{let oe=Te.width,pe=Te.height;for(let Oe=0;Oe<Le;Oe++)n.texImage2D(s.TEXTURE_2D,Oe,ft,oe,pe,0,je,it,null),oe>>=1,pe>>=1}}else if(gt.length>0){if(dt&&Dt){const oe=qe(gt[0]);n.texStorage2D(s.TEXTURE_2D,Le,ft,oe.width,oe.height)}for(let oe=0,pe=gt.length;oe<pe;oe++)We=gt[oe],dt?X&&n.texSubImage2D(s.TEXTURE_2D,oe,0,0,je,it,We):n.texImage2D(s.TEXTURE_2D,oe,ft,je,it,We);w.generateMipmaps=!1}else if(dt){if(Dt){const oe=qe(Te);n.texStorage2D(s.TEXTURE_2D,Le,ft,oe.width,oe.height)}X&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,je,it,Te)}else n.texImage2D(s.TEXTURE_2D,0,ft,je,it,Te);y(w)&&g(ge),Ze.__version=he.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function me(P,w,J){if(w.image.length!==6)return;const ge=Ge(P,w),xe=w.source;n.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+J);const he=r.get(xe);if(xe.version!==he.__version||ge===!0){n.activeTexture(s.TEXTURE0+J);const Ze=Ft.getPrimaries(Ft.workingColorSpace),Ue=w.colorSpace===as?null:Ft.getPrimaries(w.colorSpace),He=w.colorSpace===as||Ze===Ue?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);const mt=w.isCompressedTexture||w.image[0].isCompressedTexture,Te=w.image[0]&&w.image[0].isDataTexture,je=[];for(let pe=0;pe<6;pe++)!mt&&!Te?je[pe]=T(w.image[pe],!0,a.maxCubemapSize):je[pe]=Te?w.image[pe].image:w.image[pe],je[pe]=It(w,je[pe]);const it=je[0],ft=u.convert(w.format,w.colorSpace),We=u.convert(w.type),gt=D(w.internalFormat,ft,We,w.colorSpace),dt=w.isVideoTexture!==!0,Dt=he.__version===void 0||ge===!0,X=xe.dataReady;let Le=V(w,it);re(s.TEXTURE_CUBE_MAP,w);let oe;if(mt){dt&&Dt&&n.texStorage2D(s.TEXTURE_CUBE_MAP,Le,gt,it.width,it.height);for(let pe=0;pe<6;pe++){oe=je[pe].mipmaps;for(let Oe=0;Oe<oe.length;Oe++){const Ne=oe[Oe];w.format!==Vi?ft!==null?dt?X&&n.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe,0,0,Ne.width,Ne.height,ft,Ne.data):n.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe,gt,Ne.width,Ne.height,0,Ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):dt?X&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe,0,0,Ne.width,Ne.height,ft,We,Ne.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe,gt,Ne.width,Ne.height,0,ft,We,Ne.data)}}}else{if(oe=w.mipmaps,dt&&Dt){oe.length>0&&Le++;const pe=qe(je[0]);n.texStorage2D(s.TEXTURE_CUBE_MAP,Le,gt,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Te){dt?X&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,je[pe].width,je[pe].height,ft,We,je[pe].data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,gt,je[pe].width,je[pe].height,0,ft,We,je[pe].data);for(let Oe=0;Oe<oe.length;Oe++){const ht=oe[Oe].image[pe].image;dt?X&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe+1,0,0,ht.width,ht.height,ft,We,ht.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe+1,gt,ht.width,ht.height,0,ft,We,ht.data)}}else{dt?X&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,ft,We,je[pe]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,gt,ft,We,je[pe]);for(let Oe=0;Oe<oe.length;Oe++){const Ne=oe[Oe];dt?X&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe+1,0,0,ft,We,Ne.image[pe]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Oe+1,gt,ft,We,Ne.image[pe])}}}y(w)&&g(s.TEXTURE_CUBE_MAP),he.__version=xe.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Ce(P,w,J,ge,xe,he){const Ze=u.convert(J.format,J.colorSpace),Ue=u.convert(J.type),He=D(J.internalFormat,Ze,Ue,J.colorSpace),mt=r.get(w),Te=r.get(J);if(Te.__renderTarget=w,!mt.__hasExternalTextures){const je=Math.max(1,w.width>>he),it=Math.max(1,w.height>>he);xe===s.TEXTURE_3D||xe===s.TEXTURE_2D_ARRAY?n.texImage3D(xe,he,He,je,it,w.depth,0,Ze,Ue,null):n.texImage2D(xe,he,He,je,it,0,Ze,Ue,null)}n.bindFramebuffer(s.FRAMEBUFFER,P),ot(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ge,xe,Te.__webglTexture,0,nt(w)):(xe===s.TEXTURE_2D||xe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&xe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ge,xe,Te.__webglTexture,he),n.bindFramebuffer(s.FRAMEBUFFER,null)}function Ee(P,w,J){if(s.bindRenderbuffer(s.RENDERBUFFER,P),w.depthBuffer){const ge=w.depthTexture,xe=ge&&ge.isDepthTexture?ge.type:null,he=b(w.stencilBuffer,xe),Ze=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ue=nt(w);ot(w)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ue,he,w.width,w.height):J?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ue,he,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,he,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ze,s.RENDERBUFFER,P)}else{const ge=w.textures;for(let xe=0;xe<ge.length;xe++){const he=ge[xe],Ze=u.convert(he.format,he.colorSpace),Ue=u.convert(he.type),He=D(he.internalFormat,Ze,Ue,he.colorSpace),mt=nt(w);J&&ot(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,mt,He,w.width,w.height):ot(w)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,mt,He,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,He,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function De(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(s.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ge=r.get(w.depthTexture);ge.__renderTarget=w,(!ge.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),de(w.depthTexture,0);const xe=ge.__webglTexture,he=nt(w);if(w.depthTexture.format===Oo)ot(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0);else if(w.depthTexture.format===Go)ot(w)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function ze(P){const w=r.get(P),J=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const ge=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ge){const xe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ge.removeEventListener("dispose",xe)};ge.addEventListener("dispose",xe),w.__depthDisposeCallback=xe}w.__boundDepthTexture=ge}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");De(w.__webglFramebuffer,P)}else if(J){w.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)if(n.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[ge]),w.__webglDepthbuffer[ge]===void 0)w.__webglDepthbuffer[ge]=s.createRenderbuffer(),Ee(w.__webglDepthbuffer[ge],P,!1);else{const xe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=w.__webglDepthbuffer[ge];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,he)}}else if(n.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),Ee(w.__webglDepthbuffer,P,!1);else{const ge=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,ge,s.RENDERBUFFER,xe)}n.bindFramebuffer(s.FRAMEBUFFER,null)}function st(P,w,J){const ge=r.get(P);w!==void 0&&Ce(ge.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),J!==void 0&&ze(P)}function Ot(P){const w=P.texture,J=r.get(P),ge=r.get(w);P.addEventListener("dispose",N);const xe=P.textures,he=P.isWebGLCubeRenderTarget===!0,Ze=xe.length>1;if(Ze||(ge.__webglTexture===void 0&&(ge.__webglTexture=s.createTexture()),ge.__version=w.version,c.memory.textures++),he){J.__webglFramebuffer=[];for(let Ue=0;Ue<6;Ue++)if(w.mipmaps&&w.mipmaps.length>0){J.__webglFramebuffer[Ue]=[];for(let He=0;He<w.mipmaps.length;He++)J.__webglFramebuffer[Ue][He]=s.createFramebuffer()}else J.__webglFramebuffer[Ue]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ue=0;Ue<w.mipmaps.length;Ue++)J.__webglFramebuffer[Ue]=s.createFramebuffer()}else J.__webglFramebuffer=s.createFramebuffer();if(Ze)for(let Ue=0,He=xe.length;Ue<He;Ue++){const mt=r.get(xe[Ue]);mt.__webglTexture===void 0&&(mt.__webglTexture=s.createTexture(),c.memory.textures++)}if(P.samples>0&&ot(P)===!1){J.__webglMultisampledFramebuffer=s.createFramebuffer(),J.__webglColorRenderbuffer=[],n.bindFramebuffer(s.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ue=0;Ue<xe.length;Ue++){const He=xe[Ue];J.__webglColorRenderbuffer[Ue]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,J.__webglColorRenderbuffer[Ue]);const mt=u.convert(He.format,He.colorSpace),Te=u.convert(He.type),je=D(He.internalFormat,mt,Te,He.colorSpace,P.isXRRenderTarget===!0),it=nt(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,it,je,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ue,s.RENDERBUFFER,J.__webglColorRenderbuffer[Ue])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(J.__webglDepthRenderbuffer=s.createRenderbuffer(),Ee(J.__webglDepthRenderbuffer,P,!0)),n.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){n.bindTexture(s.TEXTURE_CUBE_MAP,ge.__webglTexture),re(s.TEXTURE_CUBE_MAP,w);for(let Ue=0;Ue<6;Ue++)if(w.mipmaps&&w.mipmaps.length>0)for(let He=0;He<w.mipmaps.length;He++)Ce(J.__webglFramebuffer[Ue][He],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,He);else Ce(J.__webglFramebuffer[Ue],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0);y(w)&&g(s.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ze){for(let Ue=0,He=xe.length;Ue<He;Ue++){const mt=xe[Ue],Te=r.get(mt);n.bindTexture(s.TEXTURE_2D,Te.__webglTexture),re(s.TEXTURE_2D,mt),Ce(J.__webglFramebuffer,P,mt,s.COLOR_ATTACHMENT0+Ue,s.TEXTURE_2D,0),y(mt)&&g(s.TEXTURE_2D)}n.unbindTexture()}else{let Ue=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Ue=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),n.bindTexture(Ue,ge.__webglTexture),re(Ue,w),w.mipmaps&&w.mipmaps.length>0)for(let He=0;He<w.mipmaps.length;He++)Ce(J.__webglFramebuffer[He],P,w,s.COLOR_ATTACHMENT0,Ue,He);else Ce(J.__webglFramebuffer,P,w,s.COLOR_ATTACHMENT0,Ue,0);y(w)&&g(Ue),n.unbindTexture()}P.depthBuffer&&ze(P)}function St(P){const w=P.textures;for(let J=0,ge=w.length;J<ge;J++){const xe=w[J];if(y(xe)){const he=U(P),Ze=r.get(xe).__webglTexture;n.bindTexture(he,Ze),g(he),n.unbindTexture()}}}const Se=[],O=[];function Rt(P){if(P.samples>0){if(ot(P)===!1){const w=P.textures,J=P.width,ge=P.height;let xe=s.COLOR_BUFFER_BIT;const he=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ze=r.get(P),Ue=w.length>1;if(Ue)for(let He=0;He<w.length;He++)n.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,null),n.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,null,0);n.bindFramebuffer(s.READ_FRAMEBUFFER,Ze.__webglMultisampledFramebuffer),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ze.__webglFramebuffer);for(let He=0;He<w.length;He++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(xe|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(xe|=s.STENCIL_BUFFER_BIT)),Ue){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ze.__webglColorRenderbuffer[He]);const mt=r.get(w[He]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,mt,0)}s.blitFramebuffer(0,0,J,ge,0,0,J,ge,xe,s.NEAREST),p===!0&&(Se.length=0,O.length=0,Se.push(s.COLOR_ATTACHMENT0+He),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Se.push(he),O.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,O)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Se))}if(n.bindFramebuffer(s.READ_FRAMEBUFFER,null),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Ue)for(let He=0;He<w.length;He++){n.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,Ze.__webglColorRenderbuffer[He]);const mt=r.get(w[He]).__webglTexture;n.bindFramebuffer(s.FRAMEBUFFER,Ze.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,mt,0)}n.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ze.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&p){const w=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function nt(P){return Math.min(a.maxSamples,P.samples)}function ot(P){const w=r.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Je(P){const w=c.render.frame;_.get(P)!==w&&(_.set(P,w),P.update())}function It(P,w){const J=P.colorSpace,ge=P.format,xe=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||J!==Wo&&J!==as&&(Ft.getTransfer(J)===Ht?(ge!==Vi||xe!==Ir)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),w}function qe(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(m.width=P.naturalWidth||P.width,m.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(m.width=P.displayWidth,m.height=P.displayHeight):(m.width=P.width,m.height=P.height),m}this.allocateTextureUnit=Q,this.resetTextureUnits=ie,this.setTexture2D=de,this.setTexture2DArray=le,this.setTexture3D=fe,this.setTextureCube=z,this.rebindTextures=st,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=ot}function bE(s,e){function n(r,a=as){let u;const c=Ft.getTransfer(a);if(r===Ir)return s.UNSIGNED_BYTE;if(r===wd)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Td)return s.UNSIGNED_SHORT_5_5_5_1;if(r===vg)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===gg)return s.BYTE;if(r===_g)return s.SHORT;if(r===Da)return s.UNSIGNED_SHORT;if(r===Ed)return s.INT;if(r===Vs)return s.UNSIGNED_INT;if(r===Dr)return s.FLOAT;if(r===La)return s.HALF_FLOAT;if(r===xg)return s.ALPHA;if(r===yg)return s.RGB;if(r===Vi)return s.RGBA;if(r===Sg)return s.LUMINANCE;if(r===Mg)return s.LUMINANCE_ALPHA;if(r===Oo)return s.DEPTH_COMPONENT;if(r===Go)return s.DEPTH_STENCIL;if(r===Eg)return s.RED;if(r===Ad)return s.RED_INTEGER;if(r===wg)return s.RG;if(r===Cd)return s.RG_INTEGER;if(r===Rd)return s.RGBA_INTEGER;if(r===ru||r===su||r===ou||r===au)if(c===Ht)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(r===ru)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===su)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ou)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===au)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(r===ru)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===su)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ou)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===au)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Xf||r===jf||r===qf||r===$f)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(r===Xf)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===jf)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===qf)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===$f)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Yf||r===Kf||r===Zf)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(r===Yf||r===Kf)return c===Ht?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(r===Zf)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Qf||r===Jf||r===ed||r===td||r===nd||r===id||r===rd||r===sd||r===od||r===ad||r===ld||r===ud||r===cd||r===fd)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(r===Qf)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Jf)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ed)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===td)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===nd)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===id)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===rd)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===sd)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===od)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===ad)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===ld)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ud)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===cd)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===fd)return c===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===lu||r===dd||r===hd)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(r===lu)return c===Ht?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===dd)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===hd)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Tg||r===pd||r===md||r===gd)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(r===lu)return u.COMPRESSED_RED_RGTC1_EXT;if(r===pd)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===md)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===gd)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Vo?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:n}}const PE={type:"move"};class bf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Io,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Io,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Io,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const r of e.hand.values())this._getHandJoint(n,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,r){let a=null,u=null,c=null;const d=this._targetRay,p=this._grip,m=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(m&&e.hand){c=!0;for(const T of e.hand.values()){const y=n.getJointPose(T,r),g=this._getHandJoint(m,T);y!==null&&(g.matrix.fromArray(y.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=y.radius),g.visible=y!==null}const _=m.joints["index-finger-tip"],v=m.joints["thumb-tip"],x=_.position.distanceTo(v.position),S=.02,E=.005;m.inputState.pinching&&x>S+E?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&x<=S-E&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(u=n.getPose(e.gripSpace,r),u!==null&&(p.matrix.fromArray(u.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,u.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(u.linearVelocity)):p.hasLinearVelocity=!1,u.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(u.angularVelocity)):p.hasAngularVelocity=!1));d!==null&&(a=n.getPose(e.targetRaySpace,r),a===null&&u!==null&&(a=u),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(PE)))}return d!==null&&(d.visible=a!==null),p!==null&&(p.visible=u!==null),m!==null&&(m.visible=c!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const r=new Io;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[n.jointName]=r,e.add(r)}return e.joints[n.jointName]}}const DE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,LE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class UE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,r){if(this.texture===null){const a=new oi,u=e.properties.get(a);u.__webglTexture=n.texture,(n.depthNear!==r.depthNear||n.depthFar!==r.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,r=new Nr({vertexShader:DE,fragmentShader:LE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new pn(new jo(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class IE extends qo{constructor(e,n){super();const r=this;let a=null,u=1,c=null,d="local-floor",p=1,m=null,_=null,v=null,x=null,S=null,E=null;const T=new UE,y=n.getContextAttributes();let g=null,U=null;const D=[],b=[],V=new Lt;let F=null;const N=new Ai;N.viewport=new ln;const W=new Ai;W.viewport=new ln;const R=[N,W],C=new Jv;let B=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let me=D[ee];return me===void 0&&(me=new bf,D[ee]=me),me.getTargetRaySpace()},this.getControllerGrip=function(ee){let me=D[ee];return me===void 0&&(me=new bf,D[ee]=me),me.getGripSpace()},this.getHand=function(ee){let me=D[ee];return me===void 0&&(me=new bf,D[ee]=me),me.getHandSpace()};function Q(ee){const me=b.indexOf(ee.inputSource);if(me===-1)return;const Ce=D[me];Ce!==void 0&&(Ce.update(ee.inputSource,ee.frame,m||c),Ce.dispatchEvent({type:ee.type,data:ee.inputSource}))}function ue(){a.removeEventListener("select",Q),a.removeEventListener("selectstart",Q),a.removeEventListener("selectend",Q),a.removeEventListener("squeeze",Q),a.removeEventListener("squeezestart",Q),a.removeEventListener("squeezeend",Q),a.removeEventListener("end",ue),a.removeEventListener("inputsourceschange",de);for(let ee=0;ee<D.length;ee++){const me=b[ee];me!==null&&(b[ee]=null,D[ee].disconnect(me))}B=null,ie=null,T.reset(),e.setRenderTarget(g),S=null,x=null,v=null,a=null,U=null,Ge.stop(),r.isPresenting=!1,e.setPixelRatio(F),e.setSize(V.width,V.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){u=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){d=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||c},this.setReferenceSpace=function(ee){m=ee},this.getBaseLayer=function(){return x!==null?x:S},this.getBinding=function(){return v},this.getFrame=function(){return E},this.getSession=function(){return a},this.setSession=async function(ee){if(a=ee,a!==null){if(g=e.getRenderTarget(),a.addEventListener("select",Q),a.addEventListener("selectstart",Q),a.addEventListener("selectend",Q),a.addEventListener("squeeze",Q),a.addEventListener("squeezestart",Q),a.addEventListener("squeezeend",Q),a.addEventListener("end",ue),a.addEventListener("inputsourceschange",de),y.xrCompatible!==!0&&await n.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(V),a.enabledFeatures!==void 0&&a.enabledFeatures.includes("layers")){let Ce=null,Ee=null,De=null;y.depth&&(De=y.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Ce=y.stencil?Go:Oo,Ee=y.stencil?Vo:Vs);const ze={colorFormat:n.RGBA8,depthFormat:De,scaleFactor:u};v=new XRWebGLBinding(a,n),x=v.createProjectionLayer(ze),a.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),U=new Gs(x.textureWidth,x.textureHeight,{format:Vi,type:Ir,depthTexture:new Bg(x.textureWidth,x.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,Ce),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1})}else{const Ce={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:u};S=new XRWebGLLayer(a,n,Ce),a.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),U=new Gs(S.framebufferWidth,S.framebufferHeight,{format:Vi,type:Ir,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil})}U.isXRRenderTarget=!0,this.setFoveation(p),m=null,c=await a.requestReferenceSpace(d),Ge.setContext(a),Ge.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function de(ee){for(let me=0;me<ee.removed.length;me++){const Ce=ee.removed[me],Ee=b.indexOf(Ce);Ee>=0&&(b[Ee]=null,D[Ee].disconnect(Ce))}for(let me=0;me<ee.added.length;me++){const Ce=ee.added[me];let Ee=b.indexOf(Ce);if(Ee===-1){for(let ze=0;ze<D.length;ze++)if(ze>=b.length){b.push(Ce),Ee=ze;break}else if(b[ze]===null){b[ze]=Ce,Ee=ze;break}if(Ee===-1)break}const De=D[Ee];De&&De.connect(Ce)}}const le=new j,fe=new j;function z(ee,me,Ce){le.setFromMatrixPosition(me.matrixWorld),fe.setFromMatrixPosition(Ce.matrixWorld);const Ee=le.distanceTo(fe),De=me.projectionMatrix.elements,ze=Ce.projectionMatrix.elements,st=De[14]/(De[10]-1),Ot=De[14]/(De[10]+1),St=(De[9]+1)/De[5],Se=(De[9]-1)/De[5],O=(De[8]-1)/De[0],Rt=(ze[8]+1)/ze[0],nt=st*O,ot=st*Rt,Je=Ee/(-O+Rt),It=Je*-O;if(me.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(It),ee.translateZ(Je),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),De[10]===-1)ee.projectionMatrix.copy(me.projectionMatrix),ee.projectionMatrixInverse.copy(me.projectionMatrixInverse);else{const qe=st+Je,P=Ot+Je,w=nt-It,J=ot+(Ee-It),ge=St*Ot/P*qe,xe=Se*Ot/P*qe;ee.projectionMatrix.makePerspective(w,J,ge,xe,qe,P),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function ce(ee,me){me===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(me.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(a===null)return;let me=ee.near,Ce=ee.far;T.texture!==null&&(T.depthNear>0&&(me=T.depthNear),T.depthFar>0&&(Ce=T.depthFar)),C.near=W.near=N.near=me,C.far=W.far=N.far=Ce,(B!==C.near||ie!==C.far)&&(a.updateRenderState({depthNear:C.near,depthFar:C.far}),B=C.near,ie=C.far),N.layers.mask=ee.layers.mask|2,W.layers.mask=ee.layers.mask|4,C.layers.mask=N.layers.mask|W.layers.mask;const Ee=ee.parent,De=C.cameras;ce(C,Ee);for(let ze=0;ze<De.length;ze++)ce(De[ze],Ee);De.length===2?z(C,N,W):C.projectionMatrix.copy(N.projectionMatrix),ae(ee,C,Ee)};function ae(ee,me,Ce){Ce===null?ee.matrix.copy(me.matrixWorld):(ee.matrix.copy(Ce.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(me.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(me.projectionMatrix),ee.projectionMatrixInverse.copy(me.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=_d*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(x===null&&S===null))return p},this.setFoveation=function(ee){p=ee,x!==null&&(x.fixedFoveation=ee),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=ee)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(C)};let I=null;function re(ee,me){if(_=me.getViewerPose(m||c),E=me,_!==null){const Ce=_.views;S!==null&&(e.setRenderTargetFramebuffer(U,S.framebuffer),e.setRenderTarget(U));let Ee=!1;Ce.length!==C.cameras.length&&(C.cameras.length=0,Ee=!0);for(let ze=0;ze<Ce.length;ze++){const st=Ce[ze];let Ot=null;if(S!==null)Ot=S.getViewport(st);else{const Se=v.getViewSubImage(x,st);Ot=Se.viewport,ze===0&&(e.setRenderTargetTextures(U,Se.colorTexture,x.ignoreDepthValues?void 0:Se.depthStencilTexture),e.setRenderTarget(U))}let St=R[ze];St===void 0&&(St=new Ai,St.layers.enable(ze),St.viewport=new ln,R[ze]=St),St.matrix.fromArray(st.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(st.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),ze===0&&(C.matrix.copy(St.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),Ee===!0&&C.cameras.push(St)}const De=a.enabledFeatures;if(De&&De.includes("depth-sensing")){const ze=v.getDepthInformation(Ce[0]);ze&&ze.isValid&&ze.texture&&T.init(e,ze,a.renderState)}}for(let Ce=0;Ce<D.length;Ce++){const Ee=b[Ce],De=D[Ce];Ee!==null&&De!==void 0&&De.update(Ee,me,m||c)}I&&I(ee,me),me.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:me}),E=null}const Ge=new Hg;Ge.setAnimationLoop(re),this.setAnimationLoop=function(ee){I=ee},this.dispose=function(){}}}const Ns=new ar,NE=new en;function FE(s,e){function n(y,g){y.matrixAutoUpdate===!0&&y.updateMatrix(),g.value.copy(y.matrix)}function r(y,g){g.color.getRGB(y.fogColor.value,Ig(s)),g.isFog?(y.fogNear.value=g.near,y.fogFar.value=g.far):g.isFogExp2&&(y.fogDensity.value=g.density)}function a(y,g,U,D,b){g.isMeshBasicMaterial||g.isMeshLambertMaterial?u(y,g):g.isMeshToonMaterial?(u(y,g),v(y,g)):g.isMeshPhongMaterial?(u(y,g),_(y,g)):g.isMeshStandardMaterial?(u(y,g),x(y,g),g.isMeshPhysicalMaterial&&S(y,g,b)):g.isMeshMatcapMaterial?(u(y,g),E(y,g)):g.isMeshDepthMaterial?u(y,g):g.isMeshDistanceMaterial?(u(y,g),T(y,g)):g.isMeshNormalMaterial?u(y,g):g.isLineBasicMaterial?(c(y,g),g.isLineDashedMaterial&&d(y,g)):g.isPointsMaterial?p(y,g,U,D):g.isSpriteMaterial?m(y,g):g.isShadowMaterial?(y.color.value.copy(g.color),y.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function u(y,g){y.opacity.value=g.opacity,g.color&&y.diffuse.value.copy(g.color),g.emissive&&y.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(y.map.value=g.map,n(g.map,y.mapTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,n(g.alphaMap,y.alphaMapTransform)),g.bumpMap&&(y.bumpMap.value=g.bumpMap,n(g.bumpMap,y.bumpMapTransform),y.bumpScale.value=g.bumpScale,g.side===si&&(y.bumpScale.value*=-1)),g.normalMap&&(y.normalMap.value=g.normalMap,n(g.normalMap,y.normalMapTransform),y.normalScale.value.copy(g.normalScale),g.side===si&&y.normalScale.value.negate()),g.displacementMap&&(y.displacementMap.value=g.displacementMap,n(g.displacementMap,y.displacementMapTransform),y.displacementScale.value=g.displacementScale,y.displacementBias.value=g.displacementBias),g.emissiveMap&&(y.emissiveMap.value=g.emissiveMap,n(g.emissiveMap,y.emissiveMapTransform)),g.specularMap&&(y.specularMap.value=g.specularMap,n(g.specularMap,y.specularMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest);const U=e.get(g),D=U.envMap,b=U.envMapRotation;D&&(y.envMap.value=D,Ns.copy(b),Ns.x*=-1,Ns.y*=-1,Ns.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Ns.y*=-1,Ns.z*=-1),y.envMapRotation.value.setFromMatrix4(NE.makeRotationFromEuler(Ns)),y.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=g.reflectivity,y.ior.value=g.ior,y.refractionRatio.value=g.refractionRatio),g.lightMap&&(y.lightMap.value=g.lightMap,y.lightMapIntensity.value=g.lightMapIntensity,n(g.lightMap,y.lightMapTransform)),g.aoMap&&(y.aoMap.value=g.aoMap,y.aoMapIntensity.value=g.aoMapIntensity,n(g.aoMap,y.aoMapTransform))}function c(y,g){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,g.map&&(y.map.value=g.map,n(g.map,y.mapTransform))}function d(y,g){y.dashSize.value=g.dashSize,y.totalSize.value=g.dashSize+g.gapSize,y.scale.value=g.scale}function p(y,g,U,D){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,y.size.value=g.size*U,y.scale.value=D*.5,g.map&&(y.map.value=g.map,n(g.map,y.uvTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,n(g.alphaMap,y.alphaMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest)}function m(y,g){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,y.rotation.value=g.rotation,g.map&&(y.map.value=g.map,n(g.map,y.mapTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,n(g.alphaMap,y.alphaMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest)}function _(y,g){y.specular.value.copy(g.specular),y.shininess.value=Math.max(g.shininess,1e-4)}function v(y,g){g.gradientMap&&(y.gradientMap.value=g.gradientMap)}function x(y,g){y.metalness.value=g.metalness,g.metalnessMap&&(y.metalnessMap.value=g.metalnessMap,n(g.metalnessMap,y.metalnessMapTransform)),y.roughness.value=g.roughness,g.roughnessMap&&(y.roughnessMap.value=g.roughnessMap,n(g.roughnessMap,y.roughnessMapTransform)),g.envMap&&(y.envMapIntensity.value=g.envMapIntensity)}function S(y,g,U){y.ior.value=g.ior,g.sheen>0&&(y.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),y.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(y.sheenColorMap.value=g.sheenColorMap,n(g.sheenColorMap,y.sheenColorMapTransform)),g.sheenRoughnessMap&&(y.sheenRoughnessMap.value=g.sheenRoughnessMap,n(g.sheenRoughnessMap,y.sheenRoughnessMapTransform))),g.clearcoat>0&&(y.clearcoat.value=g.clearcoat,y.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(y.clearcoatMap.value=g.clearcoatMap,n(g.clearcoatMap,y.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,n(g.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(y.clearcoatNormalMap.value=g.clearcoatNormalMap,n(g.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===si&&y.clearcoatNormalScale.value.negate())),g.dispersion>0&&(y.dispersion.value=g.dispersion),g.iridescence>0&&(y.iridescence.value=g.iridescence,y.iridescenceIOR.value=g.iridescenceIOR,y.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(y.iridescenceMap.value=g.iridescenceMap,n(g.iridescenceMap,y.iridescenceMapTransform)),g.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=g.iridescenceThicknessMap,n(g.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),g.transmission>0&&(y.transmission.value=g.transmission,y.transmissionSamplerMap.value=U.texture,y.transmissionSamplerSize.value.set(U.width,U.height),g.transmissionMap&&(y.transmissionMap.value=g.transmissionMap,n(g.transmissionMap,y.transmissionMapTransform)),y.thickness.value=g.thickness,g.thicknessMap&&(y.thicknessMap.value=g.thicknessMap,n(g.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=g.attenuationDistance,y.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(y.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(y.anisotropyMap.value=g.anisotropyMap,n(g.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=g.specularIntensity,y.specularColor.value.copy(g.specularColor),g.specularColorMap&&(y.specularColorMap.value=g.specularColorMap,n(g.specularColorMap,y.specularColorMapTransform)),g.specularIntensityMap&&(y.specularIntensityMap.value=g.specularIntensityMap,n(g.specularIntensityMap,y.specularIntensityMapTransform))}function E(y,g){g.matcap&&(y.matcap.value=g.matcap)}function T(y,g){const U=e.get(g).light;y.referencePosition.value.setFromMatrixPosition(U.matrixWorld),y.nearDistance.value=U.shadow.camera.near,y.farDistance.value=U.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function OE(s,e,n,r){let a={},u={},c=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(U,D){const b=D.program;r.uniformBlockBinding(U,b)}function m(U,D){let b=a[U.id];b===void 0&&(E(U),b=_(U),a[U.id]=b,U.addEventListener("dispose",y));const V=D.program;r.updateUBOMapping(U,V);const F=e.render.frame;u[U.id]!==F&&(x(U),u[U.id]=F)}function _(U){const D=v();U.__bindingPointIndex=D;const b=s.createBuffer(),V=U.__size,F=U.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,V,F),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,D,b),b}function v(){for(let U=0;U<d;U++)if(c.indexOf(U)===-1)return c.push(U),U;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(U){const D=a[U.id],b=U.uniforms,V=U.__cache;s.bindBuffer(s.UNIFORM_BUFFER,D);for(let F=0,N=b.length;F<N;F++){const W=Array.isArray(b[F])?b[F]:[b[F]];for(let R=0,C=W.length;R<C;R++){const B=W[R];if(S(B,F,R,V)===!0){const ie=B.__offset,Q=Array.isArray(B.value)?B.value:[B.value];let ue=0;for(let de=0;de<Q.length;de++){const le=Q[de],fe=T(le);typeof le=="number"||typeof le=="boolean"?(B.__data[0]=le,s.bufferSubData(s.UNIFORM_BUFFER,ie+ue,B.__data)):le.isMatrix3?(B.__data[0]=le.elements[0],B.__data[1]=le.elements[1],B.__data[2]=le.elements[2],B.__data[3]=0,B.__data[4]=le.elements[3],B.__data[5]=le.elements[4],B.__data[6]=le.elements[5],B.__data[7]=0,B.__data[8]=le.elements[6],B.__data[9]=le.elements[7],B.__data[10]=le.elements[8],B.__data[11]=0):(le.toArray(B.__data,ue),ue+=fe.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ie,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(U,D,b,V){const F=U.value,N=D+"_"+b;if(V[N]===void 0)return typeof F=="number"||typeof F=="boolean"?V[N]=F:V[N]=F.clone(),!0;{const W=V[N];if(typeof F=="number"||typeof F=="boolean"){if(W!==F)return V[N]=F,!0}else if(W.equals(F)===!1)return W.copy(F),!0}return!1}function E(U){const D=U.uniforms;let b=0;const V=16;for(let N=0,W=D.length;N<W;N++){const R=Array.isArray(D[N])?D[N]:[D[N]];for(let C=0,B=R.length;C<B;C++){const ie=R[C],Q=Array.isArray(ie.value)?ie.value:[ie.value];for(let ue=0,de=Q.length;ue<de;ue++){const le=Q[ue],fe=T(le),z=b%V,ce=z%fe.boundary,ae=z+ce;b+=ce,ae!==0&&V-ae<fe.storage&&(b+=V-ae),ie.__data=new Float32Array(fe.storage/Float32Array.BYTES_PER_ELEMENT),ie.__offset=b,b+=fe.storage}}}const F=b%V;return F>0&&(b+=V-F),U.__size=b,U.__cache={},this}function T(U){const D={boundary:0,storage:0};return typeof U=="number"||typeof U=="boolean"?(D.boundary=4,D.storage=4):U.isVector2?(D.boundary=8,D.storage=8):U.isVector3||U.isColor?(D.boundary=16,D.storage=12):U.isVector4?(D.boundary=16,D.storage=16):U.isMatrix3?(D.boundary=48,D.storage=48):U.isMatrix4?(D.boundary=64,D.storage=64):U.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",U),D}function y(U){const D=U.target;D.removeEventListener("dispose",y);const b=c.indexOf(D.__bindingPointIndex);c.splice(b,1),s.deleteBuffer(a[D.id]),delete a[D.id],delete u[D.id]}function g(){for(const U in a)s.deleteBuffer(a[U]);c=[],a={},u={}}return{bind:p,update:m,dispose:g}}class BE{constructor(e={}){const{canvas:n=vv(),context:r=null,depth:a=!0,stencil:u=!1,alpha:c=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:m=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:v=!1,reverseDepthBuffer:x=!1}=e;this.isWebGLRenderer=!0;let S;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=r.getContextAttributes().alpha}else S=c;const E=new Uint32Array(4),T=new Int32Array(4);let y=null,g=null;const U=[],D=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ti,this.toneMapping=us,this.toneMappingExposure=1;const b=this;let V=!1,F=0,N=0,W=null,R=-1,C=null;const B=new ln,ie=new ln;let Q=null;const ue=new _t(0);let de=0,le=n.width,fe=n.height,z=1,ce=null,ae=null;const I=new ln(0,0,le,fe),re=new ln(0,0,le,fe);let Ge=!1;const ee=new Dd;let me=!1,Ce=!1;this.transmissionResolutionScale=1;const Ee=new en,De=new en,ze=new j,st=new ln,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let St=!1;function Se(){return W===null?z:1}let O=r;function Rt(A,q){return n.getContext(A,q)}try{const A={alpha:!0,depth:a,stencil:u,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:m,powerPreference:_,failIfMajorPerformanceCaveat:v};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Sd}`),n.addEventListener("webglcontextlost",pe,!1),n.addEventListener("webglcontextrestored",Oe,!1),n.addEventListener("webglcontextcreationerror",Ne,!1),O===null){const q="webgl2";if(O=Rt(q,A),O===null)throw Rt(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let nt,ot,Je,It,qe,P,w,J,ge,xe,he,Ze,Ue,He,mt,Te,je,it,ft,We,gt,dt,Dt,X;function Le(){nt=new qS(O),nt.init(),dt=new bE(O,nt),ot=new HS(O,nt,e,dt),Je=new CE(O,nt),ot.reverseDepthBuffer&&x&&Je.buffers.depth.setReversed(!0),It=new KS(O),qe=new pE,P=new RE(O,nt,Je,qe,ot,dt,It),w=new GS(b),J=new jS(b),ge=new ix(O),Dt=new kS(O,ge),xe=new $S(O,ge,It,Dt),he=new QS(O,xe,ge,It),ft=new ZS(O,ot,P),Te=new VS(qe),Ze=new hE(b,w,J,nt,ot,Dt,Te),Ue=new FE(b,qe),He=new gE,mt=new ME(nt),it=new BS(b,w,J,Je,he,S,p),je=new TE(b,he,ot),X=new OE(O,It,ot,Je),We=new zS(O,nt,It),gt=new YS(O,nt,It),It.programs=Ze.programs,b.capabilities=ot,b.extensions=nt,b.properties=qe,b.renderLists=He,b.shadowMap=je,b.state=Je,b.info=It}Le();const oe=new IE(b,O);this.xr=oe,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const A=nt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=nt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(A){A!==void 0&&(z=A,this.setSize(le,fe,!1))},this.getSize=function(A){return A.set(le,fe)},this.setSize=function(A,q,te=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}le=A,fe=q,n.width=Math.floor(A*z),n.height=Math.floor(q*z),te===!0&&(n.style.width=A+"px",n.style.height=q+"px"),this.setViewport(0,0,A,q)},this.getDrawingBufferSize=function(A){return A.set(le*z,fe*z).floor()},this.setDrawingBufferSize=function(A,q,te){le=A,fe=q,z=te,n.width=Math.floor(A*te),n.height=Math.floor(q*te),this.setViewport(0,0,A,q)},this.getCurrentViewport=function(A){return A.copy(B)},this.getViewport=function(A){return A.copy(I)},this.setViewport=function(A,q,te,Y){A.isVector4?I.set(A.x,A.y,A.z,A.w):I.set(A,q,te,Y),Je.viewport(B.copy(I).multiplyScalar(z).round())},this.getScissor=function(A){return A.copy(re)},this.setScissor=function(A,q,te,Y){A.isVector4?re.set(A.x,A.y,A.z,A.w):re.set(A,q,te,Y),Je.scissor(ie.copy(re).multiplyScalar(z).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(A){Je.setScissorTest(Ge=A)},this.setOpaqueSort=function(A){ce=A},this.setTransparentSort=function(A){ae=A},this.getClearColor=function(A){return A.copy(it.getClearColor())},this.setClearColor=function(){it.setClearColor.apply(it,arguments)},this.getClearAlpha=function(){return it.getClearAlpha()},this.setClearAlpha=function(){it.setClearAlpha.apply(it,arguments)},this.clear=function(A=!0,q=!0,te=!0){let Y=0;if(A){let $=!1;if(W!==null){const we=W.texture.format;$=we===Rd||we===Cd||we===Ad}if($){const we=W.texture.type,Ie=we===Ir||we===Vs||we===Da||we===Vo||we===wd||we===Td,ke=it.getClearColor(),Xe=it.getClearAlpha(),ct=ke.r,at=ke.g,$e=ke.b;Ie?(E[0]=ct,E[1]=at,E[2]=$e,E[3]=Xe,O.clearBufferuiv(O.COLOR,0,E)):(T[0]=ct,T[1]=at,T[2]=$e,T[3]=Xe,O.clearBufferiv(O.COLOR,0,T))}else Y|=O.COLOR_BUFFER_BIT}q&&(Y|=O.DEPTH_BUFFER_BIT),te&&(Y|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",pe,!1),n.removeEventListener("webglcontextrestored",Oe,!1),n.removeEventListener("webglcontextcreationerror",Ne,!1),it.dispose(),He.dispose(),mt.dispose(),qe.dispose(),w.dispose(),J.dispose(),he.dispose(),Dt.dispose(),X.dispose(),Ze.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Fr),oe.removeEventListener("sessionend",Wi),Ri.stop()};function pe(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function Oe(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const A=It.autoReset,q=je.enabled,te=je.autoUpdate,Y=je.needsUpdate,$=je.type;Le(),It.autoReset=A,je.enabled=q,je.autoUpdate=te,je.needsUpdate=Y,je.type=$}function Ne(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ht(A){const q=A.target;q.removeEventListener("dispose",ht),Bt(q)}function Bt(A){Kt(A),qe.remove(A)}function Kt(A){const q=qe.get(A).programs;q!==void 0&&(q.forEach(function(te){Ze.releaseProgram(te)}),A.isShaderMaterial&&Ze.releaseShaderCache(A))}this.renderBufferDirect=function(A,q,te,Y,$,we){q===null&&(q=Ot);const Ie=$.isMesh&&$.matrixWorld.determinant()<0,ke=qi(A,q,te,Y,$);Je.setMaterial(Y,Ie);let Xe=te.index,ct=1;if(Y.wireframe===!0){if(Xe=xe.getWireframeAttribute(te),Xe===void 0)return;ct=2}const at=te.drawRange,$e=te.attributes.position;let H=at.start*ct,se=(at.start+at.count)*ct;we!==null&&(H=Math.max(H,we.start*ct),se=Math.min(se,(we.start+we.count)*ct)),Xe!==null?(H=Math.max(H,0),se=Math.min(se,Xe.count)):$e!=null&&(H=Math.max(H,0),se=Math.min(se,$e.count));const Be=se-H;if(Be<0||Be===1/0)return;Dt.setup($,Y,ke,te,Xe);let be,Pe=We;if(Xe!==null&&(be=ge.get(Xe),Pe=gt,Pe.setIndex(be)),$.isMesh)Y.wireframe===!0?(Je.setLineWidth(Y.wireframeLinewidth*Se()),Pe.setMode(O.LINES)):Pe.setMode(O.TRIANGLES);else if($.isLine){let _e=Y.linewidth;_e===void 0&&(_e=1),Je.setLineWidth(_e*Se()),$.isLineSegments?Pe.setMode(O.LINES):$.isLineLoop?Pe.setMode(O.LINE_LOOP):Pe.setMode(O.LINE_STRIP)}else $.isPoints?Pe.setMode(O.POINTS):$.isSprite&&Pe.setMode(O.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Pe.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))Pe.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const _e=$._multiDrawStarts,rt=$._multiDrawCounts,et=$._multiDrawCount,Et=Xe?ge.get(Xe).bytesPerElement:1,Pn=qe.get(Y).currentProgram.getUniforms();for(let Vt=0;Vt<et;Vt++)Pn.setValue(O,"_gl_DrawID",Vt),Pe.render(_e[Vt]/Et,rt[Vt])}else if($.isInstancedMesh)Pe.renderInstances(H,Be,$.count);else if(te.isInstancedBufferGeometry){const _e=te._maxInstanceCount!==void 0?te._maxInstanceCount:1/0,rt=Math.min(te.instanceCount,_e);Pe.renderInstances(H,Be,rt)}else Pe.render(H,Be)};function Ct(A,q,te){A.transparent===!0&&A.side===ri&&A.forceSinglePass===!1?(A.side=si,A.needsUpdate=!0,lr(A,q,te),A.side=cs,A.needsUpdate=!0,lr(A,q,te),A.side=ri):lr(A,q,te)}this.compile=function(A,q,te=null){te===null&&(te=A),g=mt.get(te),g.init(q),D.push(g),te.traverseVisible(function($){$.isLight&&$.layers.test(q.layers)&&(g.pushLight($),$.castShadow&&g.pushShadow($))}),A!==te&&A.traverseVisible(function($){$.isLight&&$.layers.test(q.layers)&&(g.pushLight($),$.castShadow&&g.pushShadow($))}),g.setupLights();const Y=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const we=$.material;if(we)if(Array.isArray(we))for(let Ie=0;Ie<we.length;Ie++){const ke=we[Ie];Ct(ke,te,$),Y.add(ke)}else Ct(we,te,$),Y.add(we)}),D.pop(),g=null,Y},this.compileAsync=function(A,q,te=null){const Y=this.compile(A,q,te);return new Promise($=>{function we(){if(Y.forEach(function(Ie){qe.get(Ie).currentProgram.isReady()&&Y.delete(Ie)}),Y.size===0){$(A);return}setTimeout(we,10)}nt.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let Rn=null;function bn(A){Rn&&Rn(A)}function Fr(){Ri.stop()}function Wi(){Ri.start()}const Ri=new Hg;Ri.setAnimationLoop(bn),typeof self<"u"&&Ri.setContext(self),this.setAnimationLoop=function(A){Rn=A,oe.setAnimationLoop(A),A===null?Ri.stop():Ri.start()},oe.addEventListener("sessionstart",Fr),oe.addEventListener("sessionend",Wi),this.render=function(A,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(q),q=oe.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,q,W),g=mt.get(A,D.length),g.init(q),D.push(g),De.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),ee.setFromProjectionMatrix(De),Ce=this.localClippingEnabled,me=Te.init(this.clippingPlanes,Ce),y=He.get(A,U.length),y.init(),U.push(y),oe.enabled===!0&&oe.isPresenting===!0){const we=b.xr.getDepthSensingMesh();we!==null&&bi(we,q,-1/0,b.sortObjects)}bi(A,q,0,b.sortObjects),y.finish(),b.sortObjects===!0&&y.sort(ce,ae),St=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,St&&it.addToRenderList(y,A),this.info.render.frame++,me===!0&&Te.beginShadows();const te=g.state.shadowsArray;je.render(te,A,q),me===!0&&Te.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=y.opaque,$=y.transmissive;if(g.setupLights(),q.isArrayCamera){const we=q.cameras;if($.length>0)for(let Ie=0,ke=we.length;Ie<ke;Ie++){const Xe=we[Ie];ji(Y,$,A,Xe)}St&&it.render(A);for(let Ie=0,ke=we.length;Ie<ke;Ie++){const Xe=we[Ie];Xi(y,A,Xe,Xe.viewport)}}else $.length>0&&ji(Y,$,A,q),St&&it.render(A),Xi(y,A,q);W!==null&&N===0&&(P.updateMultisampleRenderTarget(W),P.updateRenderTargetMipmap(W)),A.isScene===!0&&A.onAfterRender(b,A,q),Dt.resetDefaultState(),R=-1,C=null,D.pop(),D.length>0?(g=D[D.length-1],me===!0&&Te.setGlobalState(b.clippingPlanes,g.state.camera)):g=null,U.pop(),U.length>0?y=U[U.length-1]:y=null};function bi(A,q,te,Y){if(A.visible===!1)return;if(A.layers.test(q.layers)){if(A.isGroup)te=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(q);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ee.intersectsSprite(A)){Y&&st.setFromMatrixPosition(A.matrixWorld).applyMatrix4(De);const Ie=he.update(A),ke=A.material;ke.visible&&y.push(A,Ie,ke,te,st.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ee.intersectsObject(A))){const Ie=he.update(A),ke=A.material;if(Y&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),st.copy(A.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),st.copy(Ie.boundingSphere.center)),st.applyMatrix4(A.matrixWorld).applyMatrix4(De)),Array.isArray(ke)){const Xe=Ie.groups;for(let ct=0,at=Xe.length;ct<at;ct++){const $e=Xe[ct],H=ke[$e.materialIndex];H&&H.visible&&y.push(A,Ie,H,te,st.z,$e)}}else ke.visible&&y.push(A,Ie,ke,te,st.z,null)}}const we=A.children;for(let Ie=0,ke=we.length;Ie<ke;Ie++)bi(we[Ie],q,te,Y)}function Xi(A,q,te,Y){const $=A.opaque,we=A.transmissive,Ie=A.transparent;g.setupLightsView(te),me===!0&&Te.setGlobalState(b.clippingPlanes,te),Y&&Je.viewport(B.copy(Y)),$.length>0&&Pi($,q,te),we.length>0&&Pi(we,q,te),Ie.length>0&&Pi(Ie,q,te),Je.buffers.depth.setTest(!0),Je.buffers.depth.setMask(!0),Je.buffers.color.setMask(!0),Je.setPolygonOffset(!1)}function ji(A,q,te,Y){if((te.isScene===!0?te.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[Y.id]===void 0&&(g.state.transmissionRenderTarget[Y.id]=new Gs(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?La:Ir,minFilter:Hs,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ft.workingColorSpace}));const we=g.state.transmissionRenderTarget[Y.id],Ie=Y.viewport||B;we.setSize(Ie.z*b.transmissionResolutionScale,Ie.w*b.transmissionResolutionScale);const ke=b.getRenderTarget();b.setRenderTarget(we),b.getClearColor(ue),de=b.getClearAlpha(),de<1&&b.setClearColor(16777215,.5),b.clear(),St&&it.render(te);const Xe=b.toneMapping;b.toneMapping=us;const ct=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),g.setupLightsView(Y),me===!0&&Te.setGlobalState(b.clippingPlanes,Y),Pi(A,te,Y),P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we),nt.has("WEBGL_multisampled_render_to_texture")===!1){let at=!1;for(let $e=0,H=q.length;$e<H;$e++){const se=q[$e],Be=se.object,be=se.geometry,Pe=se.material,_e=se.group;if(Pe.side===ri&&Be.layers.test(Y.layers)){const rt=Pe.side;Pe.side=si,Pe.needsUpdate=!0,fs(Be,te,Y,be,Pe,_e),Pe.side=rt,Pe.needsUpdate=!0,at=!0}}at===!0&&(P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we))}b.setRenderTarget(ke),b.setClearColor(ue,de),ct!==void 0&&(Y.viewport=ct),b.toneMapping=Xe}function Pi(A,q,te){const Y=q.isScene===!0?q.overrideMaterial:null;for(let $=0,we=A.length;$<we;$++){const Ie=A[$],ke=Ie.object,Xe=Ie.geometry,ct=Y===null?Ie.material:Y,at=Ie.group;ke.layers.test(te.layers)&&fs(ke,q,te,Xe,ct,at)}}function fs(A,q,te,Y,$,we){A.onBeforeRender(b,q,te,Y,$,we),A.modelViewMatrix.multiplyMatrices(te.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(b,q,te,Y,A,we),$.transparent===!0&&$.side===ri&&$.forceSinglePass===!1?($.side=si,$.needsUpdate=!0,b.renderBufferDirect(te,q,Y,$,A,we),$.side=cs,$.needsUpdate=!0,b.renderBufferDirect(te,q,Y,$,A,we),$.side=ri):b.renderBufferDirect(te,q,Y,$,A,we),A.onAfterRender(b,q,te,Y,$,we)}function lr(A,q,te){q.isScene!==!0&&(q=Ot);const Y=qe.get(A),$=g.state.lights,we=g.state.shadowsArray,Ie=$.state.version,ke=Ze.getParameters(A,$.state,we,q,te),Xe=Ze.getProgramCacheKey(ke);let ct=Y.programs;Y.environment=A.isMeshStandardMaterial?q.environment:null,Y.fog=q.fog,Y.envMap=(A.isMeshStandardMaterial?J:w).get(A.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&A.envMap===null?q.environmentRotation:A.envMapRotation,ct===void 0&&(A.addEventListener("dispose",ht),ct=new Map,Y.programs=ct);let at=ct.get(Xe);if(at!==void 0){if(Y.currentProgram===at&&Y.lightsStateVersion===Ie)return $n(A,ke),at}else ke.uniforms=Ze.getUniforms(A),A.onBeforeCompile(ke,b),at=Ze.acquireProgram(ke,Xe),ct.set(Xe,at),Y.uniforms=ke.uniforms;const $e=Y.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&($e.clippingPlanes=Te.uniform),$n(A,ke),Y.needsLights=Yi(A),Y.lightsStateVersion=Ie,Y.needsLights&&($e.ambientLightColor.value=$.state.ambient,$e.lightProbe.value=$.state.probe,$e.directionalLights.value=$.state.directional,$e.directionalLightShadows.value=$.state.directionalShadow,$e.spotLights.value=$.state.spot,$e.spotLightShadows.value=$.state.spotShadow,$e.rectAreaLights.value=$.state.rectArea,$e.ltc_1.value=$.state.rectAreaLTC1,$e.ltc_2.value=$.state.rectAreaLTC2,$e.pointLights.value=$.state.point,$e.pointLightShadows.value=$.state.pointShadow,$e.hemisphereLights.value=$.state.hemi,$e.directionalShadowMap.value=$.state.directionalShadowMap,$e.directionalShadowMatrix.value=$.state.directionalShadowMatrix,$e.spotShadowMap.value=$.state.spotShadowMap,$e.spotLightMatrix.value=$.state.spotLightMatrix,$e.spotLightMap.value=$.state.spotLightMap,$e.pointShadowMap.value=$.state.pointShadowMap,$e.pointShadowMatrix.value=$.state.pointShadowMatrix),Y.currentProgram=at,Y.uniformsList=null,at}function Or(A){if(A.uniformsList===null){const q=A.currentProgram.getUniforms();A.uniformsList=cu.seqWithValue(q.seq,A.uniforms)}return A.uniformsList}function $n(A,q){const te=qe.get(A);te.outputColorSpace=q.outputColorSpace,te.batching=q.batching,te.batchingColor=q.batchingColor,te.instancing=q.instancing,te.instancingColor=q.instancingColor,te.instancingMorph=q.instancingMorph,te.skinning=q.skinning,te.morphTargets=q.morphTargets,te.morphNormals=q.morphNormals,te.morphColors=q.morphColors,te.morphTargetsCount=q.morphTargetsCount,te.numClippingPlanes=q.numClippingPlanes,te.numIntersection=q.numClipIntersection,te.vertexAlphas=q.vertexAlphas,te.vertexTangents=q.vertexTangents,te.toneMapping=q.toneMapping}function qi(A,q,te,Y,$){q.isScene!==!0&&(q=Ot),P.resetTextureUnits();const we=q.fog,Ie=Y.isMeshStandardMaterial?q.environment:null,ke=W===null?b.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Wo,Xe=(Y.isMeshStandardMaterial?J:w).get(Y.envMap||Ie),ct=Y.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,at=!!te.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),$e=!!te.morphAttributes.position,H=!!te.morphAttributes.normal,se=!!te.morphAttributes.color;let Be=us;Y.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(Be=b.toneMapping);const be=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,Pe=be!==void 0?be.length:0,_e=qe.get(Y),rt=g.state.lights;if(me===!0&&(Ce===!0||A!==C)){const jt=A===C&&Y.id===R;Te.setState(Y,A,jt)}let et=!1;Y.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==rt.state.version||_e.outputColorSpace!==ke||$.isBatchedMesh&&_e.batching===!1||!$.isBatchedMesh&&_e.batching===!0||$.isBatchedMesh&&_e.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&_e.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&_e.instancing===!1||!$.isInstancedMesh&&_e.instancing===!0||$.isSkinnedMesh&&_e.skinning===!1||!$.isSkinnedMesh&&_e.skinning===!0||$.isInstancedMesh&&_e.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&_e.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&_e.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&_e.instancingMorph===!1&&$.morphTexture!==null||_e.envMap!==Xe||Y.fog===!0&&_e.fog!==we||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Te.numPlanes||_e.numIntersection!==Te.numIntersection)||_e.vertexAlphas!==ct||_e.vertexTangents!==at||_e.morphTargets!==$e||_e.morphNormals!==H||_e.morphColors!==se||_e.toneMapping!==Be||_e.morphTargetsCount!==Pe)&&(et=!0):(et=!0,_e.__version=Y.version);let Et=_e.currentProgram;et===!0&&(Et=lr(Y,q,$));let Pn=!1,Vt=!1,un=!1;const wt=Et.getUniforms(),bt=_e.uniforms;if(Je.useProgram(Et.program)&&(Pn=!0,Vt=!0,un=!0),Y.id!==R&&(R=Y.id,Vt=!0),Pn||C!==A){Je.buffers.depth.getReversed()?(Ee.copy(A.projectionMatrix),yv(Ee),Sv(Ee),wt.setValue(O,"projectionMatrix",Ee)):wt.setValue(O,"projectionMatrix",A.projectionMatrix),wt.setValue(O,"viewMatrix",A.matrixWorldInverse);const Zt=wt.map.cameraPosition;Zt!==void 0&&Zt.setValue(O,ze.setFromMatrixPosition(A.matrixWorld)),ot.logarithmicDepthBuffer&&wt.setValue(O,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&wt.setValue(O,"isOrthographic",A.isOrthographicCamera===!0),C!==A&&(C=A,Vt=!0,un=!0)}if($.isSkinnedMesh){wt.setOptional(O,$,"bindMatrix"),wt.setOptional(O,$,"bindMatrixInverse");const jt=$.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),wt.setValue(O,"boneTexture",jt.boneTexture,P))}$.isBatchedMesh&&(wt.setOptional(O,$,"batchingTexture"),wt.setValue(O,"batchingTexture",$._matricesTexture,P),wt.setOptional(O,$,"batchingIdTexture"),wt.setValue(O,"batchingIdTexture",$._indirectTexture,P),wt.setOptional(O,$,"batchingColorTexture"),$._colorsTexture!==null&&wt.setValue(O,"batchingColorTexture",$._colorsTexture,P));const At=te.morphAttributes;if((At.position!==void 0||At.normal!==void 0||At.color!==void 0)&&ft.update($,te,Et),(Vt||_e.receiveShadow!==$.receiveShadow)&&(_e.receiveShadow=$.receiveShadow,wt.setValue(O,"receiveShadow",$.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(bt.envMap.value=Xe,bt.flipEnvMap.value=Xe.isCubeTexture&&Xe.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&q.environment!==null&&(bt.envMapIntensity.value=q.environmentIntensity),Vt&&(wt.setValue(O,"toneMappingExposure",b.toneMappingExposure),_e.needsLights&&$i(bt,un),we&&Y.fog===!0&&Ue.refreshFogUniforms(bt,we),Ue.refreshMaterialUniforms(bt,Y,z,fe,g.state.transmissionRenderTarget[A.id]),cu.upload(O,Or(_e),bt,P)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(cu.upload(O,Or(_e),bt,P),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&wt.setValue(O,"center",$.center),wt.setValue(O,"modelViewMatrix",$.modelViewMatrix),wt.setValue(O,"normalMatrix",$.normalMatrix),wt.setValue(O,"modelMatrix",$.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const jt=Y.uniformsGroups;for(let Zt=0,Mt=jt.length;Zt<Mt;Zt++){const Gt=jt[Zt];X.update(Gt,Et),X.bind(Gt,Et)}}return Et}function $i(A,q){A.ambientLightColor.needsUpdate=q,A.lightProbe.needsUpdate=q,A.directionalLights.needsUpdate=q,A.directionalLightShadows.needsUpdate=q,A.pointLights.needsUpdate=q,A.pointLightShadows.needsUpdate=q,A.spotLights.needsUpdate=q,A.spotLightShadows.needsUpdate=q,A.rectAreaLights.needsUpdate=q,A.hemisphereLights.needsUpdate=q}function Yi(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(A,q,te){qe.get(A.texture).__webglTexture=q,qe.get(A.depthTexture).__webglTexture=te;const Y=qe.get(A);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=te===void 0,Y.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,q){const te=qe.get(A);te.__webglFramebuffer=q,te.__useDefaultFramebuffer=q===void 0};const ds=O.createFramebuffer();this.setRenderTarget=function(A,q=0,te=0){W=A,F=q,N=te;let Y=!0,$=null,we=!1,Ie=!1;if(A){const Xe=qe.get(A);if(Xe.__useDefaultFramebuffer!==void 0)Je.bindFramebuffer(O.FRAMEBUFFER,null),Y=!1;else if(Xe.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(Xe.__hasExternalTextures)P.rebindTextures(A,qe.get(A.texture).__webglTexture,qe.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const $e=A.depthTexture;if(Xe.__boundDepthTexture!==$e){if($e!==null&&qe.has($e)&&(A.width!==$e.image.width||A.height!==$e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const ct=A.texture;(ct.isData3DTexture||ct.isDataArrayTexture||ct.isCompressedArrayTexture)&&(Ie=!0);const at=qe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(at[q])?$=at[q][te]:$=at[q],we=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?$=qe.get(A).__webglMultisampledFramebuffer:Array.isArray(at)?$=at[te]:$=at,B.copy(A.viewport),ie.copy(A.scissor),Q=A.scissorTest}else B.copy(I).multiplyScalar(z).floor(),ie.copy(re).multiplyScalar(z).floor(),Q=Ge;if(te!==0&&($=ds),Je.bindFramebuffer(O.FRAMEBUFFER,$)&&Y&&Je.drawBuffers(A,$),Je.viewport(B),Je.scissor(ie),Je.setScissorTest(Q),we){const Xe=qe.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+q,Xe.__webglTexture,te)}else if(Ie){const Xe=qe.get(A.texture),ct=q;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Xe.__webglTexture,te,ct)}else if(A!==null&&te!==0){const Xe=qe.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Xe.__webglTexture,te)}R=-1},this.readRenderTargetPixels=function(A,q,te,Y,$,we,Ie){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=qe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(ke=ke[Ie]),ke){Je.bindFramebuffer(O.FRAMEBUFFER,ke);try{const Xe=A.texture,ct=Xe.format,at=Xe.type;if(!ot.textureFormatReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ot.textureTypeReadable(at)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=A.width-Y&&te>=0&&te<=A.height-$&&O.readPixels(q,te,Y,$,dt.convert(ct),dt.convert(at),we)}finally{const Xe=W!==null?qe.get(W).__webglFramebuffer:null;Je.bindFramebuffer(O.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(A,q,te,Y,$,we,Ie){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=qe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ie!==void 0&&(ke=ke[Ie]),ke){const Xe=A.texture,ct=Xe.format,at=Xe.type;if(!ot.textureFormatReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ot.textureTypeReadable(at))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(q>=0&&q<=A.width-Y&&te>=0&&te<=A.height-$){Je.bindFramebuffer(O.FRAMEBUFFER,ke);const $e=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,$e),O.bufferData(O.PIXEL_PACK_BUFFER,we.byteLength,O.STREAM_READ),O.readPixels(q,te,Y,$,dt.convert(ct),dt.convert(at),0);const H=W!==null?qe.get(W).__webglFramebuffer:null;Je.bindFramebuffer(O.FRAMEBUFFER,H);const se=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await xv(O,se,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,$e),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,we),O.deleteBuffer($e),O.deleteSync(se),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,q=null,te=0){A.isTexture!==!0&&(Lo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),q=arguments[0]||null,A=arguments[1]);const Y=Math.pow(2,-te),$=Math.floor(A.image.width*Y),we=Math.floor(A.image.height*Y),Ie=q!==null?q.x:0,ke=q!==null?q.y:0;P.setTexture2D(A,0),O.copyTexSubImage2D(O.TEXTURE_2D,te,0,0,Ie,ke,$,we),Je.unbindTexture()};const hs=O.createFramebuffer(),ps=O.createFramebuffer();this.copyTextureToTexture=function(A,q,te=null,Y=null,$=0,we=null){A.isTexture!==!0&&(Lo("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1],q=arguments[2],we=arguments[3]||0,te=null),we===null&&($!==0?(Lo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),we=$,$=0):we=0);let Ie,ke,Xe,ct,at,$e,H,se,Be;const be=A.isCompressedTexture?A.mipmaps[we]:A.image;if(te!==null)Ie=te.max.x-te.min.x,ke=te.max.y-te.min.y,Xe=te.isBox3?te.max.z-te.min.z:1,ct=te.min.x,at=te.min.y,$e=te.isBox3?te.min.z:0;else{const At=Math.pow(2,-$);Ie=Math.floor(be.width*At),ke=Math.floor(be.height*At),A.isDataArrayTexture?Xe=be.depth:A.isData3DTexture?Xe=Math.floor(be.depth*At):Xe=1,ct=0,at=0,$e=0}Y!==null?(H=Y.x,se=Y.y,Be=Y.z):(H=0,se=0,Be=0);const Pe=dt.convert(q.format),_e=dt.convert(q.type);let rt;q.isData3DTexture?(P.setTexture3D(q,0),rt=O.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(P.setTexture2DArray(q,0),rt=O.TEXTURE_2D_ARRAY):(P.setTexture2D(q,0),rt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,q.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,q.unpackAlignment);const et=O.getParameter(O.UNPACK_ROW_LENGTH),Et=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Pn=O.getParameter(O.UNPACK_SKIP_PIXELS),Vt=O.getParameter(O.UNPACK_SKIP_ROWS),un=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,be.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,be.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ct),O.pixelStorei(O.UNPACK_SKIP_ROWS,at),O.pixelStorei(O.UNPACK_SKIP_IMAGES,$e);const wt=A.isDataArrayTexture||A.isData3DTexture,bt=q.isDataArrayTexture||q.isData3DTexture;if(A.isDepthTexture){const At=qe.get(A),jt=qe.get(q),Zt=qe.get(At.__renderTarget),Mt=qe.get(jt.__renderTarget);Je.bindFramebuffer(O.READ_FRAMEBUFFER,Zt.__webglFramebuffer),Je.bindFramebuffer(O.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let Gt=0;Gt<Xe;Gt++)wt&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,qe.get(A).__webglTexture,$,$e+Gt),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,qe.get(q).__webglTexture,we,Be+Gt)),O.blitFramebuffer(ct,at,Ie,ke,H,se,Ie,ke,O.DEPTH_BUFFER_BIT,O.NEAREST);Je.bindFramebuffer(O.READ_FRAMEBUFFER,null),Je.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if($!==0||A.isRenderTargetTexture||qe.has(A)){const At=qe.get(A),jt=qe.get(q);Je.bindFramebuffer(O.READ_FRAMEBUFFER,hs),Je.bindFramebuffer(O.DRAW_FRAMEBUFFER,ps);for(let Zt=0;Zt<Xe;Zt++)wt?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,At.__webglTexture,$,$e+Zt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,At.__webglTexture,$),bt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,jt.__webglTexture,we,Be+Zt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,jt.__webglTexture,we),$!==0?O.blitFramebuffer(ct,at,Ie,ke,H,se,Ie,ke,O.COLOR_BUFFER_BIT,O.NEAREST):bt?O.copyTexSubImage3D(rt,we,H,se,Be+Zt,ct,at,Ie,ke):O.copyTexSubImage2D(rt,we,H,se,ct,at,Ie,ke);Je.bindFramebuffer(O.READ_FRAMEBUFFER,null),Je.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else bt?A.isDataTexture||A.isData3DTexture?O.texSubImage3D(rt,we,H,se,Be,Ie,ke,Xe,Pe,_e,be.data):q.isCompressedArrayTexture?O.compressedTexSubImage3D(rt,we,H,se,Be,Ie,ke,Xe,Pe,be.data):O.texSubImage3D(rt,we,H,se,Be,Ie,ke,Xe,Pe,_e,be):A.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,we,H,se,Ie,ke,Pe,_e,be.data):A.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,we,H,se,be.width,be.height,Pe,be.data):O.texSubImage2D(O.TEXTURE_2D,we,H,se,Ie,ke,Pe,_e,be);O.pixelStorei(O.UNPACK_ROW_LENGTH,et),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Et),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Pn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Vt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,un),we===0&&q.generateMipmaps&&O.generateMipmap(rt),Je.unbindTexture()},this.copyTextureToTexture3D=function(A,q,te=null,Y=null,$=0){return A.isTexture!==!0&&(Lo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),te=arguments[0]||null,Y=arguments[1]||null,A=arguments[2],q=arguments[3],$=arguments[4]||0),Lo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,q,te,Y,$)},this.initRenderTarget=function(A){qe.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),Je.unbindTexture()},this.resetState=function(){F=0,N=0,W=null,Je.reset(),Dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Lr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Ft._getDrawingBufferColorSpace(e),n.unpackColorSpace=Ft._getUnpackColorSpace()}}const ag=0,Rr=7,iu=Rr*2,os=.4,wi=1.6,In=120,lg=260;new _t(2289254);new _t(16733474);new _t(5614335);function fu(s,e,n){return s+(e-s)*n}function ss(s,e,n){return Math.max(e,Math.min(n,s))}const kE="#00ccff",zE="#cc44ff",HE="#88ff44",VE="#ff4422";function Pf(s,e,n){return Math.round(s+(e-s)*n)}function ug(s,e,n){const r=_=>parseInt(_,16),a=r(s.slice(1,3)),u=r(s.slice(3,5)),c=r(s.slice(5,7)),d=r(e.slice(1,3)),p=r(e.slice(3,5)),m=r(e.slice(5,7));return"#"+[Pf(a,d,n),Pf(u,p,n),Pf(c,m,n)].map(_=>_.toString(16).padStart(2,"0")).join("")}function cg(s){const e=Math.sin(s%180*Math.PI/180);return{up:ug(kE,HE,e),dn:ug(zE,VE,e)}}function Uo(s){const e=s*Math.PI/180;return new j(Math.sin(e),Math.cos(e),0)}function jg(s,e){const n=(s-e)*Math.PI/180,r=.5*Math.sin(n/2)**2,a=.5*Math.cos(n/2)**2;return{pp:r,pm:a,mp:a,mm:r}}function fg(s,e,n,r,a,u){const c=Uo(e),d=[];let p=s*c.x,m=s*c.y;const _=a!==void 0;for(let S=0;S<=In;S++){const E=S/In,T=n*fu(0,r,E);if(d.push(new j(p,m,T)),E>=.5&&S<In){const y=(E-.5)/.5,g=y*wi,U=os*(1+y*.5),D=c.x*g,b=c.y*g,V=-c.x*g,F=-c.y*g;let N;if(_&&S>=a)N=(u?1:-1)*wi/In;else{const W=((p-D)**2+(m-b)**2)/U**2,R=((p-V)**2+(m-F)**2)/U**2,C=.5*Math.exp(-W),B=.5*Math.exp(-R);N=(C-B)/(C+B+1e-12)*wi/In}p+=c.x*N,m+=c.y*N}}const v=d[In],x=v.x*c.x+v.y*c.y;return{pts:d,isUp:_?u:x>0}}const GE=({text:s,children:e})=>{const[n,r]=kt.useState(!1);return ve.jsxs("span",{style:{position:"relative",display:"block"},onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:[e,n&&s&&ve.jsx("span",{style:{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:"rgba(8,20,55,0.97)",border:"1px solid rgba(80,140,255,0.4)",borderRadius:5,padding:"5px 9px",fontSize:11,color:"#b8d4ff",whiteSpace:"pre-wrap",maxWidth:220,lineHeight:1.5,zIndex:999,pointerEvents:"none",fontFamily:"'Courier New',monospace",boxShadow:"0 4px 16px rgba(0,0,30,0.7)"},children:s})]})},dg=({vals:s,cur:e,onSel:n})=>ve.jsx("div",{style:{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5},children:s.map(r=>ve.jsxs("button",{onClick:()=>n(r),style:{flex:1,padding:"3px 0",fontSize:11,background:e===r?"rgba(80,140,255,0.25)":"rgba(10,22,55,0.6)",border:"1px solid "+(e===r?"rgba(80,140,255,0.7)":"rgba(60,100,200,0.25)"),borderRadius:4,color:e===r?"#aaccff":"#7090b8",cursor:"pointer",fontFamily:"monospace"},children:[r,"°"]},r))}),Do=({label:s,tip:e,children:n})=>ve.jsxs("div",{style:{marginBottom:10},children:[ve.jsx(GE,{text:e||null,children:ve.jsx("div",{style:{fontSize:13,color:"#7ab8ff",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em",cursor:e?"help":"default",borderBottom:e?"1px dotted rgba(100,160,255,0.4)":"none",display:"inline-block"},children:s})}),n]});function WE({counts:s,phiA:e,phiB:n}){const r=s.pp+s.pm+s.mp+s.mm||1,{pp:a,pm:u,mp:c,mm:d}=jg(e,n),p=(s.pp+s.mm-s.pm-s.mp)/r,m=-Math.cos((e-n)*Math.PI/180),_=Math.abs(e-n),v=s.pp+s.pm+s.mp+s.mm,x=[{label:"▲▼ (+,−)",color:"#55ddaa",count:s.pm,exp:u},{label:"▼▲ (−,+)",color:"#55aadd",count:s.mp,exp:c},{label:"▲▲ (+,+)",color:"#ffaa44",count:s.pp,exp:a},{label:"▼▼ (−,−)",color:"#ff4466",count:s.mm,exp:d}];return ve.jsxs("div",{style:{fontFamily:"'Courier New',monospace",fontSize:11,color:"#b8d4ff",minWidth:168},children:[ve.jsxs("div",{style:{fontSize:10,color:"#7a9ece",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8},children:["Bell Correlation + Coincidences ",ve.jsxs("span",{style:{color:"#8aaedd"},children:["n=",v]})]}),ve.jsxs("div",{style:{background:"rgba(20,50,90,0.45)",border:"1px solid rgba(80,140,255,0.2)",borderRadius:5,padding:"6px 8px",marginBottom:8,fontSize:11},children:[ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[ve.jsx("span",{style:{color:"#7a9ece"},children:"Δφ"}),ve.jsxs("span",{children:[_,"°"]})]}),ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[ve.jsx("span",{style:{color:"#7a9ece"},children:"C(QM) = −cos(Δφ)"}),ve.jsx("span",{style:{color:"#aaddff"},children:m.toFixed(3)})]}),ve.jsx("div",{style:{marginTop:3,color:"#506090"},children:_===0?"Perfect anti-correlation":_===90?"Uncorrelated":_===180?"Perfect correlation":"Partial correlation"})]}),x.map(({label:S,color:E,count:T,exp:y})=>{const g=Math.round(T/r*100),U=Math.round(y*100);return ve.jsxs("div",{style:{marginBottom:7},children:[ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:2},children:[ve.jsx("span",{style:{color:E},children:S}),ve.jsxs("span",{children:[T," · ",g,"%"]})]}),ve.jsxs("div",{style:{height:6,background:"rgba(15,30,70,0.6)",borderRadius:3,position:"relative"},children:[ve.jsx("div",{style:{height:"100%",borderRadius:3,width:g+"%",background:E,opacity:.7}}),ve.jsx("div",{style:{position:"absolute",top:-2,bottom:-2,width:2,borderRadius:1,background:"rgba(200,210,255,0.5)",left:U+"%"}})]})]},S)}),ve.jsxs("div",{style:{borderTop:"1px solid rgba(60,100,200,0.3)",paddingTop:5,marginTop:4},children:[ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[ve.jsx("span",{style:{color:"#7a9ece"},children:"C(observed)"}),ve.jsx("span",{style:{color:v>0?"#e8f2ff":"#405070"},children:v>0?p.toFixed(3):"—"})]}),ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[ve.jsx("span",{style:{color:"#7a9ece"},children:"C(QM) = −cos Δφ"}),ve.jsx("span",{style:{color:"#aaddff"},children:m.toFixed(3)})]})]})]})}const hg=["collapse","bohmian"],XE={collapse:"Collapse/Copenhagen",bohmian:"Pilot-Wave"},jE={collapse:"#ff9966",bohmian:"#44ddff"},qE={collapse:"Measurement collapses the wave function. One branch vanishes instantly on both sides.",bohmian:"Both branches persist. Particle A's position is guided to an outcome; the joint wave function non-locally steers particle B to the correlated branch."},$E=E_.memo(({interp:s,setInterp:e,phiA:n,setPhiA:r,phiARef:a,phiB:u,setPhiB:c,phiBRef:d,speed:p,setSpeed:m,speedRef:_,running:v,setRunning:x,showWave:S,setShowWave:E,waveBrightRef:T,setWaveBright:y,showNLCue:g,setShowNLCue:U,showParticles:D,setShowParticles:b,resetCounts:V,counts:F,phiAVal:N,phiBVal:W})=>{const R=jE[s];return ve.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10,padding:"10px 9px",overflowY:"auto",flex:1,fontFamily:"'Courier New',monospace",color:"#e8f2ff"},children:[ve.jsxs(Do,{label:"Interpretation",tip:"Toggle between quantum interpretations",children:[ve.jsxs("button",{onClick:()=>e(hg[(hg.indexOf(s)+1)%2]),style:{display:"block",width:"100%",padding:"7px 10px",marginBottom:5,background:"rgba("+(s==="collapse"?"200,80,40":"30,160,220")+",0.18)",border:"2px solid "+R,borderRadius:6,color:R,cursor:"pointer",fontSize:13,fontFamily:"monospace",fontWeight:700,textAlign:"center"},children:[">"," ",XE[s]]}),ve.jsx("div",{style:{fontSize:12,color:"#99b8e8",lineHeight:1.6},children:qE[s]})]}),ve.jsxs(Do,{label:"Detector A  φ_A = "+n+"°",tip:`Measurement axis of detector A
(left side, particle flying toward −Z)
φ=0°: measure along +Y
φ=90°: measure along +X`,children:[ve.jsx("input",{type:"range",min:0,max:180,step:1,defaultValue:n,ref:a,onInput:C=>r(+C.target.value),style:{width:"100%",accentColor:"#44ddff",marginBottom:5}}),ve.jsx(dg,{vals:[0,30,60,90,120,150],cur:n,onSel:r})]}),ve.jsxs(Do,{label:"Detector B  φ_B = "+u+"°",tip:`Measurement axis of detector B
(right side, particle flying toward +Z)
φ=0°: measure along +Y
φ=90°: measure along +X`,children:[ve.jsx("input",{type:"range",min:0,max:180,step:1,defaultValue:u,ref:d,onInput:C=>c(+C.target.value),style:{width:"100%",accentColor:"#ff9966",marginBottom:5}}),ve.jsx(dg,{vals:[0,30,60,90,120,150],cur:u,onSel:c})]}),ve.jsxs(Do,{label:"Speed ×"+p.toFixed(1),children:[ve.jsx("input",{type:"range",min:.25,max:4,step:.25,defaultValue:p,ref:_,onInput:C=>m(+C.target.value),style:{width:"100%",accentColor:"#ffcc44"}}),ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[ve.jsx("span",{children:"slow"}),ve.jsx("span",{children:"normal"}),ve.jsx("span",{children:"fast"})]})]}),ve.jsxs(Do,{label:"Controls",children:[ve.jsxs("div",{style:{display:"flex",gap:4,marginBottom:4},children:[ve.jsx("button",{onClick:()=>x(!v),style:{flex:1,padding:"6px 4px",textAlign:"center",background:v?"rgba(20,55,130,0.6)":"rgba(25,80,40,0.6)",border:"1px solid "+(v?"rgba(70,130,255,0.4)":"rgba(60,200,80,0.35)"),borderRadius:5,color:v?"#88bbff":"#66dd88",cursor:"pointer",fontSize:13,fontFamily:"monospace"},children:v?"⏸ Pause":"▶ Play"}),ve.jsx("button",{onClick:V,style:{flex:1,padding:"6px 4px",textAlign:"center",background:"rgba(15,30,70,0.5)",border:"1px solid #334466",borderRadius:5,color:"#b0ccee",cursor:"pointer",fontSize:13,fontFamily:"monospace"},children:"✕ Clear"})]}),ve.jsxs("div",{style:{display:"flex",gap:4},children:[ve.jsxs(Do,{label:"Wave brightness",tip:"Controls the opacity/density of the wave packet visualisation",children:[ve.jsx("input",{type:"range",min:.2,max:4,step:.05,defaultValue:1,ref:T,onInput:C=>y(+C.target.value),style:{width:"100%",accentColor:"#88ccff"}}),ve.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[ve.jsx("span",{children:"dim"}),ve.jsx("span",{children:"default"}),ve.jsx("span",{children:"bright"})]})]}),ve.jsxs("button",{onClick:()=>E(!S),style:{flex:1,padding:"5px 4px",textAlign:"center",background:S?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(S?"#5588cc":"#334466"),borderRadius:5,color:S?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"monospace"},children:[S?"◉":"○"," Wave"]}),ve.jsxs("button",{onClick:()=>U(!g),style:{flex:1,padding:"5px 4px",textAlign:"center",background:g?"rgba(160,120,30,0.45)":"rgba(15,30,70,0.5)",border:"1px solid "+(g?"rgba(255,220,120,0.7)":"#334466"),borderRadius:5,color:g?"#ffeaa0":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"monospace"},children:[g?"◉":"○"," Non-local cue"]}),s==="bohmian"&&ve.jsxs("button",{onClick:()=>b(!D),style:{flex:1,padding:"5px 4px",textAlign:"center",background:D?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(D?"#5588cc":"#334466"),borderRadius:5,color:D?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"monospace"},children:[D?"◉":"○"," Particles"]})]})]}),ve.jsx(WE,{counts:F,phiA:N,phiB:W}),ve.jsx("div",{style:{fontSize:11,color:"#9ab8dd",lineHeight:1.8,marginTop:"auto",borderTop:"1px solid rgba(50,80,180,0.15)",paddingTop:8},children:ve.jsx("div",{style:{color:"#7890b0"},children:"Drag: orbit  Scroll: zoom"})})]})}),YE=`<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:22px 26px;background:#040a1c;color:#cce0ff;
    font-family:'Georgia',serif;font-size:14px;line-height:1.9;}
  h1{font-size:19px;color:#44ddff;margin-bottom:2px;}
  .sub{font-size:12px;color:#336688;margin-bottom:20px;}
  h2{font-size:14px;color:#7ab8ff;font-weight:700;margin:22px 0 8px;
    border-bottom:1px solid rgba(60,120,255,0.25);padding-bottom:5px;}
  p{margin:8px 0 12px;}
  .eq{margin:12px 0;padding:10px 20px;text-align:center;
    background:rgba(20,45,110,0.5);border:1px solid rgba(80,140,255,0.25);
    border-radius:7px;font-size:15px;overflow-x:auto;}
  .step{background:rgba(10,30,65,0.6);border-left:3px solid #44ddff;
    border-radius:0 7px 7px 0;padding:10px 14px;margin:10px 0;}
  .nb{font-size:11px;font-weight:700;color:#44ddff;text-transform:uppercase;
    letter-spacing:.08em;margin-right:8px;}
</style>
<script>
MathJax={tex:{inlineMath:[['$','$']],displayMath:[['$$','$$']]},
  options:{skipHtmlTags:['script','noscript','style','textarea']}};
<\/script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"><\/script>
</head><body>
<h1>Pilot-Wave &mdash; Trajectories</h1>
<div class="sub">de Broglie&ndash;Bohm interpretation &nbsp;&middot;&nbsp; particles always have definite positions, outcomes emerge from dynamics</div>

<h2>1. The Pilot Wave</h2>
<p>The singlet state is a real field &mdash; the <em>pilot wave</em> &mdash; that evolves in the two-particle configuration space:</p>
<div class="eq">$$|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}\\bigl(|{+}\\rangle_A|{-}\\rangle_B - |{-}\\rangle_A|{+}\\rangle_B\\bigr)$$</div>
<p>Each particle has a definite (but unknown) position $\\mathbf{Q}_A(t),\\,\\mathbf{Q}_B(t)$ at every moment. The wave does <em>not</em> collapse &mdash; it guides the particles through the <em>conditional wave function</em> on each side. Uncertainty is epistemic (we don't know the initial positions), not ontological. In the simulation the particle is white before branch selection (entangled packet), then takes the color of the guiding branch once the effective conditional wave has selected a channel.</p>

<h2>2. Guidance Equation</h2>
<p>Each particle's velocity equals the local probability current divided by the density of the joint wave function:</p>
<div class="eq">$$\\dot{\\mathbf{Q}}_k = \\frac{\\hbar}{m}\\,\\operatorname{Im}\\!\\left[\\frac{\\Psi^*(\\mathbf{Q}_A,\\mathbf{Q}_B)\\,\\nabla_{\\mathbf{r}_k}\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)}{|\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)|^2}\\right]_{\\mathbf{r}_k=\\mathbf{Q}_k}$$</div>
<p><strong>B&rsquo;s velocity depends on $\\mathbf{Q}_A$ through the joint wave function.</strong> There is no reduced state for B &mdash; the full entangled $\\Psi$ couples both particles across any distance. This is explicit non-locality, and it is precisely what allows Bohmian mechanics to violate Bell&rsquo;s inequality.</p>

<h2>3. How Outcomes Emerge (step by step)</h2>
<div class="step"><span class="nb">Before flight</span> Both particles start at random transverse positions $Q_k^\\perp$ drawn from the Born distribution $|\\Psi(\\mathbf{Q}_A,\\mathbf{Q}_B)|^2$. <strong>Neither particle is pre-assigned to spin-up or spin-down.</strong> Both colored branches (green &#8593; and orange &#8595;) are active on both sides.</div>
<div class="step"><span class="nb">Branches separate</span> Near the detector the Stern&ndash;Gerlach field pushes the two spin components apart transversely. The guidance equation pushes each particle toward whichever branch it is currently closest to. The outcome is entirely determined by $Q^\\perp$ and the dynamics &mdash; no random event occurs.</div>
<div class="step"><span class="nb">A reaches its detector</span> $\\mathbf{Q}_A$ crosses the critical surface. A&rsquo;s outcome is read from its position: the branch it occupies determines $+$ or $-$. The joint wave function now has one branch dominant for B: the effective wave for B is solely $|{-}\\rangle_B$ (if $A=+$) or $|{+}\\rangle_B$ (if $A=-$).</div>
<div class="step"><span class="nb">Non-local update to B</span> B&rsquo;s guiding field changes <em>instantly</em>: the empty branch of $\\Psi$ no longer contributes to B&rsquo;s velocity. Even though B is still in flight and nothing physically traveled to it, the velocity field it follows shifts. <strong>This is the visible kink in B&rsquo;s trajectory</strong>; at the same moment, B&rsquo;s particle color updates to match the effective conditional guiding branch.</div>
<div class="step"><span class="nb">B reaches its detector</span> Guided by the surviving branch, B lands in the strongly correlated position. The observer reads the outcome. The correlation with A is guaranteed by the guidance equation &mdash; no communication needed.</div>

<h2>4. Simulation Guidance (discretized)</h2>
<p>At each step, the transverse velocity added to particle $k$ is proportional to the density difference at its current position:</p>
<div class="eq">$$v_n = \\frac{\\rho_{\\uparrow}(Q_k^\\perp) - \\rho_{\\downarrow}(Q_k^\\perp)}{\\rho_{\\uparrow}(Q_k^\\perp) + \\rho_{\\downarrow}(Q_k^\\perp)}\\cdot\\frac{\\delta}{N_{\\text{steps}}}$$</div>
<p>where $\\rho_{\\uparrow,\\downarrow}$ are Gaussian densities of the two branches at $Q_k^\\perp$ and $\\delta$ is the total branch separation at the detector. After the collapse step for B, only the surviving branch contributes: the velocity locks to $\\pm\\,\\delta/N_{\\text{steps}}$ &mdash; the trajectory kink.</p>

<h2>5. Equilibrium and Bell Correlations</h2>
<p>Because initial positions are Born-distributed, the simulated statistics reproduce quantum mechanics exactly:</p>
<div class="eq">$$P({+},{-})=P({-},{+})=\\frac{1}{2}\\cos^2\\!\\frac{\\Delta\\varphi}{2}, \\quad P({+},{+})=P({-},{-})=\\frac{1}{2}\\sin^2\\!\\frac{\\Delta\\varphi}{2}$$</div>
<div class="eq">$$C(\\varphi_A,\\varphi_B) = -\\cos(\\Delta\\varphi)$$</div>
<p>This violates the CHSH inequality (classical bound $|S|\\leq 2$) up to $2\\sqrt{2}\\approx 2.83$. Bohmian mechanics achieves this through its explicit non-locality in the guidance equation &mdash; <em>not</em> through pre-assigned hidden variables, which is exactly why it is compatible with Bell&rsquo;s theorem.</p>

<p style="font-size:12px;color:#445566;border-top:1px solid rgba(40,70,140,0.25);
  padding-top:12px;margin-top:20px;">
  <strong style="color:#607090">References:</strong>
  D. Bohm, <em>Phys. Rev.</em> <strong>85</strong>, 166 &amp; 180 (1952). &mdash;
  P.R. Holland, <em>The Quantum Theory of Motion</em> (Cambridge, 1993). &mdash;
  D. D&uuml;rr &amp; S. Teufel, <em>Bohmian Mechanics</em> (Springer, 2009).
</p>
</body></html>`,KE=`<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:22px 26px;background:#040a1c;color:#cce0ff;
    font-family:'Georgia',serif;font-size:14px;line-height:1.9;}
  h1{font-size:19px;color:#ff9966;margin-bottom:2px;}
  .sub{font-size:12px;color:#664433;margin-bottom:20px;}
  h2{font-size:14px;color:#ffbb88;font-weight:700;margin:22px 0 8px;
    border-bottom:1px solid rgba(255,120,60,0.2);padding-bottom:5px;}
  p{margin:8px 0 12px;}
  .eq{margin:12px 0;padding:10px 20px;text-align:center;
    background:rgba(60,20,10,0.5);border:1px solid rgba(255,120,60,0.2);
    border-radius:7px;font-size:15px;overflow-x:auto;}
  .step{background:rgba(50,15,5,0.5);border-left:3px solid #ff9966;
    border-radius:0 7px 7px 0;padding:10px 14px;margin:10px 0;}
  .nb{font-size:11px;font-weight:700;color:#ff9966;text-transform:uppercase;
    letter-spacing:.08em;margin-right:8px;}
</style>
<script>
MathJax={tex:{inlineMath:[['$','$']],displayMath:[['$$','$$']]},
  options:{skipHtmlTags:['script','noscript','style','textarea']}};
<\/script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"><\/script>
</head><body>
<h1>Collapse/Copenhagen &mdash; Wavefunction Collapse</h1>
<div class="sub">Orthodox interpretation &nbsp;&middot;&nbsp; no definite spin value before measurement</div>

<h2>1. Completeness</h2>
<p>In the Copenhagen interpretation the wave function $|\\Psi\\rangle$ is the <em>complete</em> description of reality. Before measurement, spin has no definite value &mdash; &ldquo;particle A is spin-up&rdquo; is simply not true prior to a measurement. In this visualization the packet is shown white while the two spin components are still fully superposed; near the Stern&ndash;Gerlach magnet it splits into two coloured branches (&#8593;/&#8595;), both of which are physically present until collapse.</p>
<div class="eq">$$|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}\\bigl(|{+}\\rangle_A|{-}\\rangle_B - |{-}\\rangle_A|{+}\\rangle_B\\bigr)$$</div>

<h2>2. Measurement Postulate</h2>
<p>When detector A measures spin along $\\hat{n}_A(\\varphi_A)$, only one outcome can be registered. The probability of each outcome is given by Born&rsquo;s rule:</p>
<div class="eq">$$P(A={+}) = \\langle\\Psi^-|\\,\\hat{P}^A_+\\otimes\\mathbf{1}_B\\,|\\Psi^-\\rangle = \\tfrac{1}{2}$$</div>
<p>Once outcome $A=+$ is obtained, the state <em>collapses</em> instantaneously to the correlated product state:</p>
<div class="eq">$$|\\Psi^-\\rangle\\;\\xrightarrow{A\\,\\text{measures }+}\\; |{+}\\rangle_A\\otimes|{-}\\rangle_B$$</div>

<h2>3. Collapse Sequence in the Simulation</h2>
<div class="step"><span class="nb">Before measurement</span> Both spin components are superimposed on each packet. No outcome exists yet. The simulation shows a white packet in this regime; when it reaches the magnet region, the packet splits and the two coloured branches become visible.</div>
<div class="step"><span class="nb">First detector fires</span> A Born-rule random outcome is drawn. Both wave functions collapse simultaneously: the surviving branch on A and the correlated branch on B are kept, the others vanish &mdash; even though B may be far away. This is the non-local collapse.</div>
<div class="step"><span class="nb">Second detector fires (~25% later)</span> B is now in a spin eigenstate of its own detector axis. Its outcome is completely determined by the prior collapse; no second random draw is needed.</div>

<h2>4. Quantum Correlations</h2>
<p>Joint probabilities for measuring along $\\hat{n}_A(\\varphi_A)$ and $\\hat{n}_B(\\varphi_B)$:</p>
<div class="eq">$$P({+},{-})=P({-},{+})=\\frac{1}{2}\\cos^2\\!\\tfrac{\\Delta\\varphi}{2}, \\quad P({+},{+})=P({-},{-})=\\frac{1}{2}\\sin^2\\!\\tfrac{\\Delta\\varphi}{2}$$</div>
<div class="eq">$$C(\\varphi_A,\\varphi_B)=\\langle\\sigma_A\\cdot\\hat{n}_A\\;\\sigma_B\\cdot\\hat{n}_B\\rangle=-\\cos(\\Delta\\varphi)$$</div>

<h2>5. Bell&rsquo;s Inequality and Its Violation</h2>
<p>Bell (1964) proved that <em>any</em> local hidden-variable theory must satisfy:</p>
<div class="eq">$$|E(a,b)-E(a,b')+E(a',b)+E(a',b')|\\leq 2 \\quad (\\text{CHSH})$$</div>
<p>Quantum mechanics predicts a maximum of $2\\sqrt{2}\\approx 2.83$ &mdash; exceeding the classical bound. The canonical Bell angles $a=0°, a'=45°, b=22.5°, b'=67.5°$ saturate this bound. Loophole-free experiments (Hensen 2015, Giustina 2015) confirm the violation unambiguously.</p>
<p>Copenhagen is agnostic about <em>why</em> the non-local correlations arise &mdash; it simply postulates that the joint state $|\\Psi^-\\rangle$ produces them via Born&rsquo;s rule. The collapse itself is an axiom, not a derived result.</p>

<h2>6. No Faster-Than-Light Signaling</h2>
<p>Despite the instantaneous collapse, no information travels faster than light. Observer B&rsquo;s marginal distribution is always $P(B=+)=\\tfrac{1}{2}$ regardless of A&rsquo;s angle choice or timing. Correlations only appear when A and B compare their records classically.</p>

<p style="font-size:12px;color:#445566;border-top:1px solid rgba(120,60,20,0.25);
  padding-top:12px;margin-top:20px;">
  <strong style="color:#607090">References:</strong>
  J.S. Bell, <em>Physics</em> <strong>1</strong>, 195 (1964). &mdash;
  J.F. Clauser et al., <em>Phys. Rev. Lett.</em> <strong>23</strong>, 880 (1969). &mdash;
  A. Aspect et al., <em>Phys. Rev. Lett.</em> <strong>49</strong>, 91 (1982). &mdash;
  B. Hensen et al., <em>Nature</em> <strong>526</strong>, 682 (2015).
</p>
</body></html>`;function ZE(){const s=kt.useRef(null),e=kt.useRef(null),n=kt.useRef(null),r=kt.useRef(null),a=kt.useRef(null),u=kt.useRef(null),c=kt.useRef({phiA:0,phiB:90,speed:1,running:!0,interp:"collapse",measuredSide:"A",showWave:!0,showParticles:!0,waveBright:1,showNLCue:!1,nlFlash:0,nlFrom:"A",tick:0,dirty:!0,camR:24,camTheta:-.3,camPhi:.18,target:new j(0,0,0),drag:null,detDistA:Rr,detDistB:iu,counts:{pp:0,pm:0,mp:0,mm:0},collapsed:!1,outcomeA:null,outcomeB:null,hitFired:[!1,!1]}),[d,p]=kt.useState(0),[m,_]=kt.useState(90),[v,x]=kt.useState(1),[S,E]=kt.useState(!0),[T,y]=kt.useState("collapse"),[g,U]=kt.useState("A"),[D,b]=kt.useState(!0),[V,F]=kt.useState(!1),[N,W]=kt.useState(!0),[R,C]=kt.useState({pp:0,pm:0,mp:0,mm:0}),[B,ie]=kt.useState("sim"),[Q,ue]=kt.useState(270),[de,le]=kt.useState({A:Rr,B:iu}),fe=kt.useRef(null),z=kt.useRef(null),ce=kt.useRef(null),ae=kt.useRef(null),I=kt.useRef(null),re=Se=>{c.current.phiA=Se,c.current.dirty=!0,p(Se),e.current&&(e.current.value=Se),c.current.counts={pp:0,pm:0,mp:0,mm:0},C({pp:0,pm:0,mp:0,mm:0}),I.current&&(I.current.hitsA.clear(),I.current.hitsB.clear())},Ge=Se=>{c.current.phiB=Se,c.current.dirty=!0,_(Se),n.current&&(n.current.value=Se),c.current.counts={pp:0,pm:0,mp:0,mm:0},C({pp:0,pm:0,mp:0,mm:0}),I.current&&(I.current.hitsA.clear(),I.current.hitsB.clear())},ee=Se=>{c.current.speed=Se,x(Se),r.current&&(r.current.value=Se)},me=Se=>{c.current.running=Se,E(Se)},Ce=Se=>{c.current.interp=Se,y(Se),c.current.dirty=!0},Ee=Se=>{c.current.showWave=Se,b(Se)},De=Se=>{c.current.waveBright=Se},ze=Se=>{c.current.showNLCue=Se,F(Se)},st=Se=>{c.current.showParticles=Se,W(Se)},Ot=()=>{c.current.counts={pp:0,pm:0,mp:0,mm:0},C({pp:0,pm:0,mp:0,mm:0}),I.current&&(I.current.hitsA.clear(),I.current.hitsB.clear())},St=kt.useRef(null);return kt.useEffect(()=>{const Se=St.current;if(!Se)return;const O=ot=>ue(Math.max(200,Math.min(500,ot.clientX))),Rt=ot=>{Se.releasePointerCapture(ot.pointerId),Se.removeEventListener("pointermove",O)},nt=ot=>{ot.preventDefault(),Se.setPointerCapture(ot.pointerId),Se.addEventListener("pointermove",O),Se.addEventListener("pointerup",Rt,{once:!0})};return Se.addEventListener("pointerdown",nt),()=>Se.removeEventListener("pointerdown",nt)},[]),kt.useEffect(()=>{const Se=s.current;if(!Se)return;const O=new BE({antialias:!0});O.setClearColor(462878,1),O.domElement.style.cssText="display:block;width:100%;height:100%;",Se.appendChild(O.domElement);const Rt=new Gv,nt=new Ai(44,1,.1,200);Rt.add(new Qv(16777215,.5));const ot=new Zv(8956671,.8);ot.position.set(3,5,3),Rt.add(ot);function Je(){const H=Se.clientWidth||700,se=Se.clientHeight||440;O.setSize(H,se,!1),O.setPixelRatio(Math.min(window.devicePixelRatio,2)),nt.aspect=H/se,nt.updateProjectionMatrix()}Je();const It=new ResizeObserver(Je);It.observe(Se);function qe(){const{camR:H,camTheta:se,camPhi:Be,target:be}=c.current;nt.position.set(be.x+H*Math.sin(se)*Math.cos(Be),be.y+H*Math.sin(Be),be.z+H*Math.cos(se)*Math.cos(Be)),nt.lookAt(be)}qe();const P=new j,w=new j;function J(H,se){if(!H)return;const Be=Se.clientWidth||1,be=8,Pe=H.offsetWidth||150,_e=ss(se-Pe*.5,be,Math.max(be,Be-Pe-be));H.style.left=`${_e}px`,H.style.right="auto"}function ge(){const H=fe.current,se=z.current;if(!H&&!se)return;mt.getWorldPosition(P),Te.getWorldPosition(w);const Be=(P.clone().project(nt).x*.5+.5)*(Se.clientWidth||1),be=(w.clone().project(nt).x*.5+.5)*(Se.clientWidth||1);J(H,Be),J(se,be)}function xe(H,se){const Be=ce.current,be=ae.current;Be&&(Be.textContent=H.toFixed(1)),be&&(be.textContent=`${se>=0?"+":""}${se.toFixed(1)}`)}Rt.add(new Pr(new an().setFromPoints([new j(0,0,-Rr-.5),new j(0,0,Rr+.5)]),new Hi({color:1718894,transparent:!0,opacity:.35})));const he=new pn(new Pa(.18,16,16),new br({color:16777215}));Rt.add(he);const Ze=Array.from({length:65},(H,se)=>{const Be=se/64*Math.PI*2;return new j(Math.cos(Be)*.45,Math.sin(Be)*.45,0)}),Ue=new Pr(new an().setFromPoints(Ze),new Hi({color:11197951,transparent:!0,opacity:.5}));Rt.add(Ue);function He(H,se){const Be=new Io;return Be.position.z=H,Be.add(new pn(new jo(4,4),new br({color:se,transparent:!0,opacity:.1,side:ri,depthWrite:!1}))),Be.add(new jv(new an().setFromPoints([new j(-2,-2,0),new j(2,-2,0),new j(2,2,0),new j(-2,2,0)]),new Hi({color:se,transparent:!0,opacity:.6}))),[[[-1.6,0],[1.6,0]],[[0,-1.6],[0,1.6]]].forEach(([be,Pe])=>{Be.add(new Pr(new an().setFromPoints([new j(...be,0),new j(...Pe,0)]),new Hi({color:se,transparent:!0,opacity:.25})))}),Rt.add(Be),Be}const mt=He(-Rr,4513279),Te=He(Rr,16750950),je=new Float32Array([0,1.8,-Rr,0,1.8,Rr]),it=new an;it.setAttribute("position",new qn(je,3));const ft=new Hi({color:16772744,transparent:!0,opacity:0,depthWrite:!1}),We=new Pr(it,ft);Rt.add(We);const gt=3,dt=new _t(52479),Dt=new _t(13387007),X=new _t(8978244),Le=new _t(16729122);function oe(H){const se=H%180*Math.PI/180,Be=Math.sin(se);return{up:dt.clone().lerp(X,Be),dn:Dt.clone().lerp(Le,Be)}}function pe(H,se,Be){const be=new Io,Pe=1.6,_e=.5,rt=.42,et=.52,Et=et/2+_e/2,Pn=(Gt,yn)=>{const zt=[0,_e/2,-rt/2,-Pe/2,-_e/2,-rt/2,Pe/2,-_e/2,-rt/2,0,_e/2,rt/2,-Pe/2,-_e/2,rt/2,Pe/2,-_e/2,rt/2],Nn=[0,2,1,3,4,5,1,2,5,1,5,4,0,1,4,0,4,3,0,3,5,0,5,2],cn=new an;cn.setAttribute("position",new qn(new Float32Array(zt),3)),cn.setIndex(new qn(new Uint32Array(Nn),1)),cn.computeVertexNormals();const Fn=new pn(cn,new yf({color:Gt,transparent:!0,opacity:.88,side:ri}));Fn.position.y=yn,be.add(Fn);const Yn=new bm(new Pm(cn),new Hi({color:Gt,transparent:!0,opacity:.9,linewidth:2}));return Yn.position.y=yn,be.add(Yn),Fn},Vt=new Ws(Pe*1.05,_e,rt),un=new pn(Vt,new yf({color:se,transparent:!0,opacity:.88}));un.position.y=Et,be.add(un);const wt=new bm(new Pm(Vt),new Hi({color:se,transparent:!0,opacity:.9,linewidth:2}));wt.position.y=Et,be.add(wt),Pn(Be,-Et);const bt=new Ws(.14,et+_e*2.1,rt*.9),At=new yf({color:H,transparent:!0,opacity:.55});[-Pe/2-.14,Pe/2+.14].forEach(Gt=>{const yn=new pn(bt,At);yn.position.x=Gt,be.add(yn)});const jt=new _t(H).multiplyScalar(.65),Zt=.5;for(let Gt=0;Gt<6;Gt++){const yn=-et*.48+Gt/5*et*.96,zt=Pe*.52*(1-.15*Math.abs((Gt-2.5)/2.5)),Nn=[new j(-zt,yn,-rt*.55),new j(zt,yn,-rt*.55)],cn=new an().setFromPoints(Nn),Fn=new Pr(cn,new Hi({color:jt,transparent:!0,opacity:Zt,linewidth:1}));be.add(Fn)}const Mt=new tx(new j(0,1,0),new j(0,Et+_e*.85,0),1.3,H,.32,.18);return be.add(Mt),be.userData.setPoleColors=(Gt,yn)=>{be.children.forEach(zt=>{var Nn,cn,Fn,Yn;zt.isMesh&&((Nn=zt.material)!=null&&Nn.color)&&(((cn=zt.geometry)==null?void 0:cn.type)==="BufferGeometry"&&zt.position.y>0?zt.material.color.set(Gt):((Fn=zt.geometry)==null?void 0:Fn.type)==="BoxGeometry"&&zt.position.y<-.1&&zt.material.color.set(yn)),zt.isLineSegments&&((Yn=zt.material)!=null&&Yn.color)&&(zt.position.y>0&&zt.position.y>.3?zt.material.color.set(Gt):zt.position.y<-.1&&zt.material.color.set(yn))})},Rt.add(be),be}const Oe=pe(4513279,dt.getHex(),Dt.getHex()),Ne=pe(16750950,X.getHex(),Le.getHex());function ht(H,se){const Be=Array.from({length:se},()=>{const _e=new pn(new Id(.05,.2,20),new br({color:16777215,transparent:!0,opacity:0,side:ri,depthWrite:!1}));return H.add(_e),_e}),be=Array.from({length:se},()=>{const _e=new pn(new Ld(.06,14),new br({color:16777215,transparent:!0,opacity:0,side:ri}));return H.add(_e),_e});let Pe=0;return{add(_e,rt,et){const Et=Pe%se;Be[Et].position.set(_e,rt,.01),Be[Et].material.color.set(et),Be[Et].material.opacity=.7,be[Et].position.set(_e,rt,.02),be[Et].material.color.set(et),be[Et].material.opacity=.95,Pe++},clear(){Be.forEach(_e=>_e.material.opacity=0),be.forEach(_e=>_e.material.opacity=0),Pe=0}}}const Bt=ht(mt,60),Kt=ht(Te,60),Ct=36,Rn=2.8,bn=3.2,Fr=`
      varying vec2 vUv; varying vec3 vPos;
      void main(){ vUv=uv; vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,Wi=`
      uniform float uSigXY, uSigZ;
      uniform float uCUpX, uCUpY, uCDnX, uCDnY;  // branch centres
      uniform float uWz, uSlabZ, uPhase;
      uniform float uIsPost;   // 0=superposition, 1=separated, 2=collapsed(+), 3=collapsed(-)
      uniform float uBright, uAlphaMax;
      uniform float uAmpUp, uAmpDown;  // conditional Born-rule weights (0–1) for each branch
      uniform vec3 uPreColor;          // pre-split packet color (white initially)
      uniform vec3 uColorUp;           // ↑-branch color for this side
      uniform vec3 uColorDn;           // ↓-branch color for this side
      varying vec2 vUv; varying vec3 vPos;

      float g2(float x,float y,float cx,float cy,float s){
        float dx=(x-cx)/s, dy=(y-cy)/s;
        return exp(-0.5*(dx*dx+dy*dy));
      }
      float gz(float z,float cz,float sz){ float d=(z-cz)/sz; return exp(-0.5*d*d); }

      void main(){
        float x=vPos.x, y=vPos.y, z=uSlabZ;
        float gzV=gz(z,uWz,uSigZ);
        float phase=cos(${bn.toFixed(1)}*(z-uWz));
        float cp=phase*0.5+0.5;

        vec3 col; float dens;
        vec2 uvC=vUv-0.5;
        float vig=1.0-smoothstep(0.38,0.50,length(uvC));

        if(uIsPost < 0.5){
          // pre-split packet — white initially; in collapse mode the distant
          // packet changes color immediately after the first detector fires.
          float g=g2(x,y,0.0,0.0,uSigXY);
          dens=g*gzV;
          col=uPreColor*mix(0.68,1.0,cp);
        } else if(uIsPost < 1.5){
          // separated: two colored branches, amplitude-weighted by Born probabilities.
          // Before any measurement: uAmpUp=uAmpDown=1 (equal branches).
          // After the other side fires (Copenhagen): branches become unequal;
          //   the branch weights reflect P(this=± | other=outcome).
          float gUp=g2(x,y,uCUpX,uCUpY,uSigXY)*uAmpUp;
          float gDn=g2(x,y,uCDnX,uCDnY,uSigXY)*uAmpDown;
          dens=max(gUp,gDn)*gzV;
          float tp=gUp/(gUp+gDn+1e-6);
          vec3 cUp=mix(uColorUp*0.12, uColorUp, cp);
          vec3 cDn=mix(uColorDn*0.12, uColorDn, cp);
          col=mix(cDn,cUp,tp);
        } else if(uIsPost < 2.5){
          // collapsed to spin-up branch
          float gUp=g2(x,y,uCUpX,uCUpY,uSigXY);
          dens=gUp*gzV;
          col=mix(uColorUp*0.12, uColorUp, cp);
        } else {
          // collapsed to spin-down branch
          float gDn=g2(x,y,uCDnX,uCDnY,uSigXY);
          dens=gDn*gzV;
          col=mix(uColorDn*0.12, uColorDn, cp);
        }

        if(dens<0.08) discard;
        float d2=dens*dens;
        float alpha=d2*vig*uBright*7.0;
        alpha=clamp(alpha,0.0,uAlphaMax);
        if(alpha<0.005) discard;
        gl_FragColor=vec4(col*(0.5+0.5*dens)*uBright, alpha);
      }
    `,Ri={uSigXY:{value:os*1.1},uSigZ:{value:os*1.5},uCUpX:{value:0},uCUpY:{value:0},uCDnX:{value:0},uCDnY:{value:0},uWz:{value:0},uSlabZ:{value:0},uPhase:{value:0},uIsPost:{value:0},uBright:{value:.55},uAlphaMax:{value:.32},uAmpUp:{value:1},uAmpDown:{value:1},uPreColor:{value:new _t(16777215)},uColorUp:{value:new _t(16777215)},uColorDn:{value:new _t(16777215)}},bi=new jo(Rn*2,Rn*2,1,1);function Xi(H,se,Be,be){return Array.from({length:Ct},(Pe,_e)=>{const rt=new Nr({vertexShader:Fr,fragmentShader:Wi,uniforms:Ng.clone(Ri),transparent:!0,depthWrite:!1,blending:Df,side:ri});rt.uniforms.uColorUp.value.copy(Be),rt.uniforms.uColorDn.value.copy(be);const et=new pn(bi,rt),Et=H+(_e+.5)/Ct*(se-H);return et.position.z=Et,rt.uniforms.uSlabZ.value=Et,Rt.add(et),et})}const ji=Xi(-iu,ag-.3,dt,Dt),Pi=Xi(ag+.3,iu,X,Le),fs=1;function lr(H){const se=Array.from({length:H},()=>{const Pe=new pn(new Pa(.1,10,10),new br({color:11197951,transparent:!0,opacity:0}));return Rt.add(Pe),Pe}),Be=Array.from({length:H},()=>{const Pe=new pn(new Pa(.22,10,10),new br({color:11197951,transparent:!0,opacity:0,depthWrite:!1}));return Rt.add(Pe),Pe}),be=Array.from({length:H},()=>{const Pe=new Float32Array((In+1)*3),_e=new Float32Array((In+1)*3),rt=new an;rt.setAttribute("position",new qn(Pe,3)),rt.setAttribute("color",new qn(_e,3));const et=new Pr(rt,new Hi({vertexColors:!0,transparent:!0,opacity:.5}));return Rt.add(et),{geo:rt,pos:Pe,col:_e,line:et}});return{dots:se,glows:Be,lines:be}}const Or=lr(fs),$n=lr(fs);let qi=[],$i=[],Yi=[!1,!1];function ds(){const H=c.current,se=H.measuredSide==="A",Be=oe(H.phiA),be=oe(H.phiB),Pe=H.detDistA,_e=H.detDistB,rt=se?Pe:_e,et=se?_e:Pe,Et=rt/et,Pn=Math.round(In*ss(Et,.05,.95)),Vt=(Math.random()-.5)*os*2,un=se?H.phiA:H.phiB,bt=fg(Vt,un,se?-1:1,rt),At=bt.isUp,jt=(Math.random()-.5)*os*2,Zt=se?H.phiB:H.phiA,Mt=se?1:-1,{pp:Gt,pm:yn}=jg(H.phiA,H.phiB),zt=At?2*Gt:2*yn,Nn=Math.random()<zt,cn=fg(jt,Zt,Mt,et,Pn,Nn);se?(qi=[{pts:bt.pts,isUp:At}],$i=[{pts:cn.pts,isUp:Nn}]):($i=[{pts:bt.pts,isUp:At}],qi=[{pts:cn.pts,isUp:Nn}]),[{trajs:qi,bohm:Or,isSecond:!se,colorUp:[Be.up.r,Be.up.g,Be.up.b],colorDn:[Be.dn.r,Be.dn.g,Be.dn.b]},{trajs:$i,bohm:$n,isSecond:se,colorUp:[be.up.r,be.up.g,be.up.b],colorDn:[be.dn.r,be.dn.g,be.dn.b]}].forEach(({trajs:Fn,bohm:Yn,isSecond:ur,colorUp:ai,colorDn:li})=>{const{pts:Kn,isUp:cr}=Fn[0],mn=Yn.lines[0],[ui,Xs,ms]=cr?ai:li;Kn.forEach((mi,gi)=>{mn.pos[gi*3]=mi.x,mn.pos[gi*3+1]=mi.y,mn.pos[gi*3+2]=mi.z;const Wt=ur?Pn:Math.round(In*.5),xt=ss((gi-Wt)/20,0,1);mn.col[gi*3]=fu(1,ui,xt),mn.col[gi*3+1]=fu(1,Xs,xt),mn.col[gi*3+2]=fu(1,ms,xt)}),mn.geo.attributes.position.needsUpdate=!0,mn.geo.attributes.color.needsUpdate=!0,mn.geo.setDrawRange(0,Kn.length),mn.line.visible=!1}),Yi[0]=Yi[1]=!1}ds();const hs=new ex,ps=new Lt;let A=null,q=0,te=0;function Y(H){const se=new j;se.crossVectors(new j().subVectors(c.current.target,nt.position).normalize(),new j(0,1,0)).normalize();const{clientWidth:Be}=Se,be=c.current.camR,Pe=nt.fov*Math.PI/180,_e=2*be*Math.tan(Pe/2)/Be;return se.z*H*_e*3.5}function $(H){const se=Se.getBoundingClientRect();ps.set((H.clientX-se.left)/se.width*2-1,-((H.clientY-se.top)/se.height)*2+1),hs.setFromCamera(ps,nt);const Be=[...mt.children,...Te.children],be=hs.intersectObjects(Be,!1);if(!be.length)return null;const Pe=be[0].object.parent;return Pe?Pe.position.z<0?"A":"B":null}function we(H){if((H.button??0)===0){const se=$(H);if(se){A=se,q=H.clientX,te=se==="A"?c.current.detDistA:c.current.detDistB,Se.setPointerCapture(H.pointerId),Se.style.cursor="ew-resize";return}}c.current.drag={btn:H.button??0,x:H.clientX,y:H.clientY},Se.setPointerCapture(H.pointerId)}function Ie(H){var Pe;const se=c.current;if(A){const _e=Y(H.clientX-q),et=ss(te+(A==="A"?-1:1)*_e,2,20);A==="A"?se.detDistA=et:se.detDistB=et,se.measuredSide=se.detDistA<=se.detDistB?"A":"B",U(se.measuredSide),se.dirty=!0,(Pe=I.current)==null||Pe.setDetDistsUI({A:se.detDistA,B:se.detDistB});return}if(!se.drag)return;const Be=H.clientX-se.drag.x,be=H.clientY-se.drag.y;if(se.drag.x=H.clientX,se.drag.y=H.clientY,se.drag.btn===0)se.camTheta-=Be*.007,se.camPhi=ss(se.camPhi+be*.007,-1.2,1.2);else{const _e=new j().subVectors(se.target,nt.position).normalize(),rt=new j().crossVectors(_e,new j(0,1,0)).normalize(),et=new j().crossVectors(rt,_e).normalize(),Et=se.camR*.001;se.target.addScaledVector(rt,-Be*Et),se.target.addScaledVector(et,be*Et)}qe()}function ke(H){if(A){A=null,Se.style.cursor="grab",Se.hasPointerCapture(H.pointerId)&&Se.releasePointerCapture(H.pointerId);return}c.current.drag=null,Se.hasPointerCapture(H.pointerId)&&Se.releasePointerCapture(H.pointerId),Se.style.cursor="grab"}function Xe(H){if(A||c.current.drag)return;const se=$(H);Se.style.cursor=se?"ew-resize":"grab"}function ct(H){H.preventDefault(),c.current.camR=ss(c.current.camR*(H.deltaY>0?1.1:.91),3,50),qe()}Se.addEventListener("pointerdown",we),Se.addEventListener("pointermove",Ie),Se.addEventListener("pointermove",Xe),Se.addEventListener("pointerup",ke),Se.addEventListener("wheel",ct,{passive:!1}),Se.addEventListener("contextmenu",H=>H.preventDefault()),I.current={scene:Rt,camera:nt,renderer:O,detA:mt,detB:Te,nlLink:We,magA:Oe,magB:Ne,slabsA:ji,slabsB:Pi,bohmA:Or,bohmB:$n,hitsA:Bt,hitsB:Kt,buildTrajectories:ds,updateCam:qe,setCountsUI:H=>C({...H}),setDetDistsUI:H=>le({...H})};let at;function $e(){var mn,ui,Xs,ms,mi,gi;at=requestAnimationFrame($e);const H=c.current,se=I.current;if(!se)return;H.dirty&&(se.buildTrajectories(),H.dirty=!1),H.running&&(H.tick+=H.speed),qe();const Be=H.tick%lg/lg,be=Math.max(H.detDistA,H.detDistB)*Be,Pe=H.detDistA,_e=H.detDistB,rt=ss(Math.round(Math.min(be,Pe)/Pe*In),0,In),et=ss(Math.round(Math.min(be,_e)/_e*In),0,In);Be<.02&&H.collapsed&&(H.collapsed=!1,H.outcomeA=null,H.outcomeB=null,H.nlFlash=0,Yi[0]=Yi[1]=!1,H.hitFired[0]=H.hitFired[1]=!1,H.dirty=!0);const Et=be>=Math.min(H.detDistA,H.detDistB),Pn=be>=Math.max(H.detDistA,H.detDistB)*.99;if(Et&&!H.collapsed){H.collapsed=!0,H.nlFlash=H.showNLCue?1:0,H.nlFrom=H.measuredSide,H.outcomeA=(mn=qi[0])!=null&&mn.isUp?1:-1,H.outcomeB=(ui=$i[0])!=null&&ui.isUp?1:-1;const Wt=(H.outcomeA===1?"p":"m")+(H.outcomeB===1?"p":"m");H.counts[Wt]++,se.setCountsUI(H.counts)}const Vt=H.collapsed,un=H.outcomeA,wt=H.outcomeB;se.detA.position.z=-Pe,se.detB.position.z=_e,Uo(H.phiA),Uo(H.phiB);const bt=oe(H.phiA),At=oe(H.phiB);if(se.magA.position.z=-(Pe-gt),se.magA.rotation.z=-H.phiA*Math.PI/180,se.magB.position.z=_e-gt,se.magB.rotation.z=-H.phiB*Math.PI/180,(ms=(Xs=se.magA.userData).setPoleColors)==null||ms.call(Xs,bt.up,bt.dn),(gi=(mi=se.magB.userData).setPoleColors)==null||gi.call(mi,At.up,At.dn),ge(),xe(-Pe,_e),se.nlLink){const Wt=H.nlFrom==="A"?-Pe:_e,xt=H.nlFrom==="A"?Math.min(be,_e):-Math.min(be,Pe),qt=se.nlLink.geometry.attributes.position.array;qt[0]=0,qt[1]=1.8,qt[2]=Wt,qt[3]=0,qt[4]=.6,qt[5]=xt,se.nlLink.geometry.attributes.position.needsUpdate=!0,se.nlLink.material.opacity=H.showNLCue?Math.min(.9,H.nlFlash*.8):0}const jt=u.current;if(jt){const Wt=H.nlFrom,xt=Wt==="A"?"B":"A";jt.textContent=`NON-LOCAL UPDATE: ${Wt} measured -> ${xt} wave updates instantly`,jt.style.opacity=H.showNLCue&&H.nlFlash>.02?String(Math.min(.96,H.nlFlash)):"0"}H.nlFlash>0&&(H.nlFlash*=.965);const Zt=H.showWave,Mt=Math.min(be,Pe)/Pe,Gt=Math.min(be,_e)/_e,yn=-Math.min(be,Pe),zt=Math.min(be,_e);function Nn(Wt,xt,qt,Qt,tn,Dn,Ki,fr,js,qs,gs,Di){const Zi=(js-gt)/js,Br=tn>Zi?(tn-Zi)/(1-Zi):0,Gn=Br*wi,$s=os*(1+Br*.4),Qi=Uo(qt),Ko=Qi.x*Gn,Ji=Qi.y*Gn,er=-Qi.x*Gn,_s=-Qi.y*Gn;let Sn=0,dr=1,Ys=1;tn>=Zi&&(Dn&&Qt!==null&&H.interp==="collapse"||Dn&&Qt!==null&&H.interp==="bohmian"?Sn=Qt===1?2:3:(Sn=1,dr=Ki,Ys=fr)),Wt.forEach(hr=>{if(!Zt){hr.visible=!1;return}const Mn=hr.material.uniforms;Mn.uColorUp.value.copy(qs.up),Mn.uColorDn.value.copy(qs.dn),Vt&&!Dn?Mn.uPreColor.value.copy(gs===1?Di.dn:Di.up):Mn.uPreColor.value.setRGB(1,1,1),Mn.uSigXY.value=$s,Mn.uSigZ.value=os*1.5,Mn.uCUpX.value=Ko,Mn.uCUpY.value=Ji,Mn.uCDnX.value=er,Mn.uCDnY.value=_s,Mn.uWz.value=xt,Mn.uIsPost.value=Sn,Mn.uBright.value=.55*H.waveBright,Mn.uAlphaMax.value=Math.min(.32*H.waveBright,.95),Mn.uAmpUp.value=dr,Mn.uAmpDown.value=Ys,hr.visible=!0})}const cn=H.measuredSide==="A",Fn=cn?Vt:Pn,Yn=cn?Pn:Vt;let ur=1,ai=1,li=1,Kn=1;if(Vt&&H.interp==="collapse"){const Wt=cn?un:wt,xt=(H.phiA-H.phiB)*Math.PI/180,qt=Wt===1?Math.sin(xt/2)**2:Math.cos(xt/2)**2,Qt=1-qt;cn?(li=qt,Kn=Qt):(ur=qt,ai=Qt)}Nn(ji,yn,H.phiA,un,Mt,Fn,ur,ai,Pe,bt,wt,At),Nn(Pi,zt,H.phiB,wt,Gt,Yn,li,Kn,_e,At,un,bt);const cr=H.showParticles&&H.interp==="bohmian";if([{trajs:qi,bohm:Or,hitPool:Bt,tIdx:rt,hitKey:0,upHex:bt.up.getHex(),dnHex:bt.dn.getHex(),thisMeasured:Fn,partnerOutcome:wt,partnerUpHex:At.up.getHex(),partnerDnHex:At.dn.getHex()},{trajs:$i,bohm:$n,hitPool:Kt,tIdx:et,hitKey:1,upHex:At.up.getHex(),dnHex:At.dn.getHex(),thisMeasured:Yn,partnerOutcome:un,partnerUpHex:bt.up.getHex(),partnerDnHex:bt.dn.getHex()}].forEach(({trajs:Wt,bohm:xt,hitPool:qt,tIdx:Qt,hitKey:tn,upHex:Dn,dnHex:Ki,thisMeasured:fr,partnerOutcome:js,partnerUpHex:qs,partnerDnHex:gs})=>{const{pts:Di,isUp:Zi}=Wt[0],Br=tn===0?Pe:_e,Gn=Math.round((Br-gt)/Br*In),Ji=Qt>=Gn||fr?Zi?Dn:Ki:Vt&&!fr?js===1?gs:qs:16777215;if(!cr){xt.dots[0].visible=!1,xt.glows[0].visible=!1,xt.lines[0].line.visible=!1;return}const er=Di[Math.min(Qt,Di.length-1)];if(er&&(xt.dots[0].position.copy(er),xt.glows[0].position.copy(er),xt.dots[0].visible=!0,xt.glows[0].visible=!0,xt.dots[0].material.color.set(Ji),xt.glows[0].material.color.set(Ji),xt.dots[0].material.opacity=.95,xt.glows[0].material.opacity=.18,xt.lines[0].line.visible=!0,xt.lines[0].geo.setDrawRange(0,Qt+1),Qt>=In-1&&!Yi[tn])){Yi[tn]=!0;const _s=Di[In];qt.add(_s.x,_s.y,Ji)}}),H.interp==="collapse"){const Wt=()=>(Math.random()-.5)*os*.9,xt=H.measuredSide==="A";if(Vt&&!H.hitFired[0]){H.hitFired[0]=!0;const qt=xt?un:wt,Qt=Uo(xt?H.phiA:H.phiB),tn=qt===1?1:-1,Dn=xt?qt===1?bt.up.getHex():bt.dn.getHex():qt===1?At.up.getHex():At.dn.getHex();xt?Bt.add(Qt.x*wi*tn+Wt(),Qt.y*wi*tn+Wt(),Dn):Kt.add(Qt.x*wi*tn+Wt(),Qt.y*wi*tn+Wt(),Dn)}if(Pn&&!H.hitFired[1]){H.hitFired[1]=!0;const qt=xt?wt:un,Qt=Uo(xt?H.phiB:H.phiA),tn=qt===1?1:-1,Dn=xt?qt===1?At.up.getHex():At.dn.getHex():qt===1?bt.up.getHex():bt.dn.getHex();xt?Kt.add(Qt.x*wi*tn+Wt(),Qt.y*wi*tn+Wt(),Dn):Bt.add(Qt.x*wi*tn+Wt(),Qt.y*wi*tn+Wt(),Dn)}}se.renderer.render(se.scene,se.camera)}return $e(),()=>{cancelAnimationFrame(at),It.disconnect(),Se.removeEventListener("pointerdown",we),Se.removeEventListener("pointermove",Ie),Se.removeEventListener("pointermove",Xe),Se.removeEventListener("pointerup",ke),Se.removeEventListener("wheel",ct),O.dispose(),Se.contains(O.domElement)&&Se.removeChild(O.domElement)}},[]),ve.jsxs("div",{style:{width:"100%",height:"100%",overflow:"hidden",background:"#07101e",display:"flex",flexDirection:"column"},children:[ve.jsx("style",{children:`
        .tbb{padding:8px 18px;cursor:pointer;font-family:monospace;font-size:13px;
          border:none;border-bottom:3px solid transparent;background:transparent;color:#6888aa;}
        .tba{color:#aaddff;border-bottom-color:#4488ff;}
        .tbb:hover{color:#cce0ff;}
        .rh{width:5px;cursor:col-resize;background:rgba(40,80,200,0.15);flex-shrink:0;
          transition:background 0.15s;touch-action:none;user-select:none;}
        .rh:hover,.rh:active{background:rgba(80,140,255,0.4);}
        input[type=range]{touch-action:auto;pointer-events:auto;cursor:pointer;}
      `}),ve.jsxs("div",{style:{display:"flex",alignItems:"center",height:38,flexShrink:0,background:"rgba(4,10,30,0.98)",borderBottom:"1px solid rgba(40,80,180,0.3)",paddingLeft:12,gap:4},children:[ve.jsx("span",{style:{fontSize:11,color:"#4060a0",fontFamily:"monospace",letterSpacing:"0.08em",marginRight:12},children:"BELL EXPERIMENT"}),ve.jsx("button",{className:"tbb"+(B==="sim"?" tba":""),onClick:()=>ie("sim"),children:"Simulation"}),ve.jsx("button",{className:"tbb"+(B==="trajectories"?" tba":""),onClick:()=>ie("trajectories"),children:"Pilot-Wave"}),ve.jsx("button",{className:"tbb"+(B==="collapse"?" tba":""),onClick:()=>ie("collapse"),children:"Collapse/Copenhagen"})]}),ve.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"row",overflow:"hidden",minHeight:0},children:[ve.jsx("div",{style:{width:Q,minWidth:200,flexShrink:0,background:"rgba(8,18,45,0.98)",overflowY:"auto",height:"100%"},children:ve.jsx($E,{interp:T,setInterp:Ce,phiA:d,setPhiA:re,phiARef:e,phiB:m,setPhiB:Ge,phiBRef:n,speed:v,setSpeed:ee,speedRef:r,running:S,setRunning:me,showWave:D,setShowWave:Ee,waveBrightRef:a,setWaveBright:De,showNLCue:V,setShowNLCue:ze,showParticles:N,setShowParticles:st,resetCounts:Ot,counts:R,phiAVal:d,phiBVal:m})}),ve.jsx("div",{className:"rh",ref:St}),ve.jsxs("div",{style:{flex:1,minWidth:0,position:"relative",height:"100%"},children:[ve.jsx("div",{ref:s,style:{width:"100%",height:"100%",cursor:"grab",display:B==="sim"?"block":"none"}}),B==="sim"&&(()=>{const Se=cg(d),O=cg(m),Rt=({color:ot})=>ve.jsx("span",{style:{display:"inline-block",width:9,height:9,borderRadius:2,background:ot,marginRight:3,verticalAlign:"middle"}}),nt=({up:ot,dn:Je})=>ve.jsxs("div",{style:{display:"flex",gap:10,marginTop:4,fontSize:11,color:"#b8d4ff"},children:[ve.jsxs("span",{children:[ve.jsx(Rt,{color:ot}),"↑ spin"]}),ve.jsxs("span",{children:[ve.jsx(Rt,{color:Je}),"↓ spin"]}),ve.jsxs("span",{children:[ve.jsx(Rt,{color:"rgba(255,255,255,0.7)"}),"⊙ entangled"]})]});return ve.jsxs(ve.Fragment,{children:[ve.jsx("div",{ref:u,style:{position:"absolute",top:46,left:"50%",transform:"translateX(-50%)",zIndex:11,opacity:0,pointerEvents:"none",fontFamily:"monospace",fontSize:11,letterSpacing:"0.03em",color:"#ffe688",background:"rgba(35,25,6,0.86)",border:"1px solid rgba(255,230,136,0.55)",borderRadius:5,padding:"4px 10px",boxShadow:"0 0 18px rgba(255,230,136,0.22)"},children:"NON-LOCAL UPDATE"}),ve.jsxs("div",{ref:fe,style:{position:"absolute",top:10,left:12,zIndex:10,fontFamily:"monospace",fontSize:12,color:"#44ddff",background:"rgba(4,10,30,0.80)",borderRadius:6,padding:"5px 9px",border:"1px solid "+(g==="A"?"rgba(68,221,255,0.8)":"rgba(68,221,255,0.3)")},children:[ve.jsxs("div",{children:["← A  φ_A=",d,"°  z=",ve.jsx("span",{ref:ce,children:(-de.A).toFixed(1)}),g==="A"?ve.jsx("span",{style:{marginLeft:6,color:"#ffee44",fontSize:10},children:"★ FIRST"}):ve.jsx("span",{style:{marginLeft:6,color:"#7090b8",fontSize:10},children:"SECOND"})]}),ve.jsx(nt,{up:Se.up,dn:Se.dn})]}),ve.jsxs("div",{ref:z,style:{position:"absolute",top:10,left:220,zIndex:10,fontFamily:"monospace",fontSize:12,color:"#ff9966",background:"rgba(4,10,30,0.80)",borderRadius:6,padding:"5px 9px",border:"1px solid "+(g==="B"?"rgba(255,153,102,0.8)":"rgba(255,153,102,0.3)")},children:[ve.jsxs("div",{children:[g==="B"?ve.jsx("span",{style:{marginRight:6,color:"#ffee44",fontSize:10},children:"★ FIRST"}):ve.jsx("span",{style:{marginRight:6,color:"#7090b8",fontSize:10},children:"SECOND"}),"B  φ_B=",m,"°  z=",ve.jsxs("span",{ref:ae,children:[de.B>=0?"+":"",de.B.toFixed(1)]}),"  →"]}),ve.jsx(nt,{up:O.up,dn:O.dn})]})]})})(),(B==="trajectories"||B==="collapse")&&ve.jsx("div",{style:{position:"absolute",inset:0,overflowY:"auto"},children:ve.jsx("iframe",{srcDoc:B==="trajectories"?YE:KE,style:{width:"100%",height:"100%",border:"none"},title:B==="trajectories"?"Pilot-Wave":"Collapse/Copenhagen"},B)})]})]})]})}b_.createRoot(document.getElementById("root")).render(ve.jsx(ZE,{}));
