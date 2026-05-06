(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const u of a)if(u.type==="childList")for(const f of u.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&r(f)}).observe(document,{childList:!0,subtree:!0});function n(a){const u={};return a.integrity&&(u.integrity=a.integrity),a.referrerPolicy&&(u.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?u.credentials="include":a.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(a){if(a.ep)return;a.ep=!0;const u=n(a);fetch(a.href,u)}})();function cg(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Zc={exports:{}},Ta={},Qc={exports:{}},wt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $p;function S_(){if($p)return wt;$p=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),u=Symbol.for("react.provider"),f=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),y=Symbol.iterator;function v(F){return F===null||typeof F!="object"?null:(F=y&&F[y]||F["@@iterator"],typeof F=="function"?F:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,T={};function x(F,se,pe){this.props=F,this.context=se,this.refs=T,this.updater=pe||S}x.prototype.isReactComponent={},x.prototype.setState=function(F,se){if(typeof F!="object"&&typeof F!="function"&&F!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,F,se,"setState")},x.prototype.forceUpdate=function(F){this.updater.enqueueForceUpdate(this,F,"forceUpdate")};function _(){}_.prototype=x.prototype;function k(F,se,pe){this.props=F,this.context=se,this.refs=T,this.updater=pe||S}var I=k.prototype=new _;I.constructor=k,E(I,x.prototype),I.isPureReactComponent=!0;var b=Array.isArray,W=Object.prototype.hasOwnProperty,R={current:null},O={key:!0,ref:!0,__self:!0,__source:!0};function j(F,se,pe){var Y,ae={},he=null,_e=null;if(se!=null)for(Y in se.ref!==void 0&&(_e=se.ref),se.key!==void 0&&(he=""+se.key),se)W.call(se,Y)&&!O.hasOwnProperty(Y)&&(ae[Y]=se[Y]);var Re=arguments.length-2;if(Re===1)ae.children=pe;else if(1<Re){for(var Le=Array(Re),Oe=0;Oe<Re;Oe++)Le[Oe]=arguments[Oe+2];ae.children=Le}if(F&&F.defaultProps)for(Y in Re=F.defaultProps,Re)ae[Y]===void 0&&(ae[Y]=Re[Y]);return{$$typeof:s,type:F,key:he,ref:_e,props:ae,_owner:R.current}}function L(F,se){return{$$typeof:s,type:F.type,key:se,ref:F.ref,props:F.props,_owner:F._owner}}function C(F){return typeof F=="object"&&F!==null&&F.$$typeof===s}function P(F){var se={"=":"=0",":":"=2"};return"$"+F.replace(/[=:]/g,function(pe){return se[pe]})}var J=/\/+/g;function q(F,se){return typeof F=="object"&&F!==null&&F.key!=null?P(""+F.key):se.toString(36)}function ce(F,se,pe,Y,ae){var he=typeof F;(he==="undefined"||he==="boolean")&&(F=null);var _e=!1;if(F===null)_e=!0;else switch(he){case"string":case"number":_e=!0;break;case"object":switch(F.$$typeof){case s:case e:_e=!0}}if(_e)return _e=F,ae=ae(_e),F=Y===""?"."+q(_e,0):Y,b(ae)?(pe="",F!=null&&(pe=F.replace(J,"$&/")+"/"),ce(ae,se,pe,"",function(Oe){return Oe})):ae!=null&&(C(ae)&&(ae=L(ae,pe+(!ae.key||_e&&_e.key===ae.key?"":(""+ae.key).replace(J,"$&/")+"/")+F)),se.push(ae)),1;if(_e=0,Y=Y===""?".":Y+":",b(F))for(var Re=0;Re<F.length;Re++){he=F[Re];var Le=Y+q(he,Re);_e+=ce(he,se,pe,Le,ae)}else if(Le=v(F),typeof Le=="function")for(F=Le.call(F),Re=0;!(he=F.next()).done;)he=he.value,Le=Y+q(he,Re++),_e+=ce(he,se,pe,Le,ae);else if(he==="object")throw se=String(F),Error("Objects are not valid as a React child (found: "+(se==="[object Object]"?"object with keys {"+Object.keys(F).join(", ")+"}":se)+"). If you meant to render a collection of children, use an array instead.");return _e}function de(F,se,pe){if(F==null)return F;var Y=[],ae=0;return ce(F,Y,"","",function(he){return se.call(pe,he,ae++)}),Y}function oe(F){if(F._status===-1){var se=F._result;se=se(),se.then(function(pe){(F._status===0||F._status===-1)&&(F._status=1,F._result=pe)},function(pe){(F._status===0||F._status===-1)&&(F._status=2,F._result=pe)}),F._status===-1&&(F._status=0,F._result=se)}if(F._status===1)return F._result.default;throw F._result}var ue={current:null},H={transition:null},fe={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:H,ReactCurrentOwner:R};function ee(){throw Error("act(...) is not supported in production builds of React.")}return wt.Children={map:de,forEach:function(F,se,pe){de(F,function(){se.apply(this,arguments)},pe)},count:function(F){var se=0;return de(F,function(){se++}),se},toArray:function(F){return de(F,function(se){return se})||[]},only:function(F){if(!C(F))throw Error("React.Children.only expected to receive a single React element child.");return F}},wt.Component=x,wt.Fragment=n,wt.Profiler=a,wt.PureComponent=k,wt.StrictMode=r,wt.Suspense=h,wt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fe,wt.act=ee,wt.cloneElement=function(F,se,pe){if(F==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+F+".");var Y=E({},F.props),ae=F.key,he=F.ref,_e=F._owner;if(se!=null){if(se.ref!==void 0&&(he=se.ref,_e=R.current),se.key!==void 0&&(ae=""+se.key),F.type&&F.type.defaultProps)var Re=F.type.defaultProps;for(Le in se)W.call(se,Le)&&!O.hasOwnProperty(Le)&&(Y[Le]=se[Le]===void 0&&Re!==void 0?Re[Le]:se[Le])}var Le=arguments.length-2;if(Le===1)Y.children=pe;else if(1<Le){Re=Array(Le);for(var Oe=0;Oe<Le;Oe++)Re[Oe]=arguments[Oe+2];Y.children=Re}return{$$typeof:s,type:F.type,key:ae,ref:he,props:Y,_owner:_e}},wt.createContext=function(F){return F={$$typeof:f,_currentValue:F,_currentValue2:F,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},F.Provider={$$typeof:u,_context:F},F.Consumer=F},wt.createElement=j,wt.createFactory=function(F){var se=j.bind(null,F);return se.type=F,se},wt.createRef=function(){return{current:null}},wt.forwardRef=function(F){return{$$typeof:c,render:F}},wt.isValidElement=C,wt.lazy=function(F){return{$$typeof:g,_payload:{_status:-1,_result:F},_init:oe}},wt.memo=function(F,se){return{$$typeof:m,type:F,compare:se===void 0?null:se}},wt.startTransition=function(F){var se=H.transition;H.transition={};try{F()}finally{H.transition=se}},wt.unstable_act=ee,wt.useCallback=function(F,se){return ue.current.useCallback(F,se)},wt.useContext=function(F){return ue.current.useContext(F)},wt.useDebugValue=function(){},wt.useDeferredValue=function(F){return ue.current.useDeferredValue(F)},wt.useEffect=function(F,se){return ue.current.useEffect(F,se)},wt.useId=function(){return ue.current.useId()},wt.useImperativeHandle=function(F,se,pe){return ue.current.useImperativeHandle(F,se,pe)},wt.useInsertionEffect=function(F,se){return ue.current.useInsertionEffect(F,se)},wt.useLayoutEffect=function(F,se){return ue.current.useLayoutEffect(F,se)},wt.useMemo=function(F,se){return ue.current.useMemo(F,se)},wt.useReducer=function(F,se,pe){return ue.current.useReducer(F,se,pe)},wt.useRef=function(F){return ue.current.useRef(F)},wt.useState=function(F){return ue.current.useState(F)},wt.useSyncExternalStore=function(F,se,pe){return ue.current.useSyncExternalStore(F,se,pe)},wt.useTransition=function(){return ue.current.useTransition()},wt.version="18.3.1",wt}var Kp;function Cd(){return Kp||(Kp=1,Qc.exports=S_()),Qc.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zp;function M_(){if(Zp)return Ta;Zp=1;var s=Cd(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function f(c,h,m){var g,y={},v=null,S=null;m!==void 0&&(v=""+m),h.key!==void 0&&(v=""+h.key),h.ref!==void 0&&(S=h.ref);for(g in h)r.call(h,g)&&!u.hasOwnProperty(g)&&(y[g]=h[g]);if(c&&c.defaultProps)for(g in h=c.defaultProps,h)y[g]===void 0&&(y[g]=h[g]);return{$$typeof:e,type:c,key:v,ref:S,props:y,_owner:a.current}}return Ta.Fragment=n,Ta.jsx=f,Ta.jsxs=f,Ta}var Qp;function E_(){return Qp||(Qp=1,Zc.exports=M_()),Zc.exports}var Se=E_(),Mt=Cd();const No=cg(Mt);var Jc={exports:{}},$n={},ef={exports:{}},tf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jp;function T_(){return Jp||(Jp=1,(function(s){function e(H,fe){var ee=H.length;H.push(fe);e:for(;0<ee;){var F=ee-1>>>1,se=H[F];if(0<a(se,fe))H[F]=fe,H[ee]=se,ee=F;else break e}}function n(H){return H.length===0?null:H[0]}function r(H){if(H.length===0)return null;var fe=H[0],ee=H.pop();if(ee!==fe){H[0]=ee;e:for(var F=0,se=H.length,pe=se>>>1;F<pe;){var Y=2*(F+1)-1,ae=H[Y],he=Y+1,_e=H[he];if(0>a(ae,ee))he<se&&0>a(_e,ae)?(H[F]=_e,H[he]=ee,F=he):(H[F]=ae,H[Y]=ee,F=Y);else if(he<se&&0>a(_e,ee))H[F]=_e,H[he]=ee,F=he;else break e}}return fe}function a(H,fe){var ee=H.sortIndex-fe.sortIndex;return ee!==0?ee:H.id-fe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var u=performance;s.unstable_now=function(){return u.now()}}else{var f=Date,c=f.now();s.unstable_now=function(){return f.now()-c}}var h=[],m=[],g=1,y=null,v=3,S=!1,E=!1,T=!1,x=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,k=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function I(H){for(var fe=n(m);fe!==null;){if(fe.callback===null)r(m);else if(fe.startTime<=H)r(m),fe.sortIndex=fe.expirationTime,e(h,fe);else break;fe=n(m)}}function b(H){if(T=!1,I(H),!E)if(n(h)!==null)E=!0,oe(W);else{var fe=n(m);fe!==null&&ue(b,fe.startTime-H)}}function W(H,fe){E=!1,T&&(T=!1,_(j),j=-1),S=!0;var ee=v;try{for(I(fe),y=n(h);y!==null&&(!(y.expirationTime>fe)||H&&!P());){var F=y.callback;if(typeof F=="function"){y.callback=null,v=y.priorityLevel;var se=F(y.expirationTime<=fe);fe=s.unstable_now(),typeof se=="function"?y.callback=se:y===n(h)&&r(h),I(fe)}else r(h);y=n(h)}if(y!==null)var pe=!0;else{var Y=n(m);Y!==null&&ue(b,Y.startTime-fe),pe=!1}return pe}finally{y=null,v=ee,S=!1}}var R=!1,O=null,j=-1,L=5,C=-1;function P(){return!(s.unstable_now()-C<L)}function J(){if(O!==null){var H=s.unstable_now();C=H;var fe=!0;try{fe=O(!0,H)}finally{fe?q():(R=!1,O=null)}}else R=!1}var q;if(typeof k=="function")q=function(){k(J)};else if(typeof MessageChannel<"u"){var ce=new MessageChannel,de=ce.port2;ce.port1.onmessage=J,q=function(){de.postMessage(null)}}else q=function(){x(J,0)};function oe(H){O=H,R||(R=!0,q())}function ue(H,fe){j=x(function(){H(s.unstable_now())},fe)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(H){H.callback=null},s.unstable_continueExecution=function(){E||S||(E=!0,oe(W))},s.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):L=0<H?Math.floor(1e3/H):5},s.unstable_getCurrentPriorityLevel=function(){return v},s.unstable_getFirstCallbackNode=function(){return n(h)},s.unstable_next=function(H){switch(v){case 1:case 2:case 3:var fe=3;break;default:fe=v}var ee=v;v=fe;try{return H()}finally{v=ee}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(H,fe){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var ee=v;v=H;try{return fe()}finally{v=ee}},s.unstable_scheduleCallback=function(H,fe,ee){var F=s.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?F+ee:F):ee=F,H){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=ee+se,H={id:g++,callback:fe,priorityLevel:H,startTime:ee,expirationTime:se,sortIndex:-1},ee>F?(H.sortIndex=ee,e(m,H),n(h)===null&&H===n(m)&&(T?(_(j),j=-1):T=!0,ue(b,ee-F))):(H.sortIndex=se,e(h,H),E||S||(E=!0,oe(W))),H},s.unstable_shouldYield=P,s.unstable_wrapCallback=function(H){var fe=v;return function(){var ee=v;v=fe;try{return H.apply(this,arguments)}finally{v=ee}}}})(tf)),tf}var em;function w_(){return em||(em=1,ef.exports=T_()),ef.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tm;function A_(){if(tm)return $n;tm=1;var s=Cd(),e=w_();function n(t){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+t,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+t+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function u(t,i){f(t,i),f(t+"Capture",i)}function f(t,i){for(a[t]=i,t=0;t<i.length;t++)r.add(i[t])}var c=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},y={};function v(t){return h.call(y,t)?!0:h.call(g,t)?!1:m.test(t)?y[t]=!0:(g[t]=!0,!1)}function S(t,i,o,l){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return l?!1:o!==null?!o.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function E(t,i,o,l){if(i===null||typeof i>"u"||S(t,i,o,l))return!0;if(l)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function T(t,i,o,l,d,p,M){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=l,this.attributeNamespace=d,this.mustUseProperty=o,this.propertyName=t,this.type=i,this.sanitizeURL=p,this.removeEmptyString=M}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){x[t]=new T(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var i=t[0];x[i]=new T(i,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){x[t]=new T(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){x[t]=new T(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){x[t]=new T(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){x[t]=new T(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){x[t]=new T(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){x[t]=new T(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){x[t]=new T(t,5,!1,t.toLowerCase(),null,!1,!1)});var _=/[\-:]([a-z])/g;function k(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var i=t.replace(_,k);x[i]=new T(i,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var i=t.replace(_,k);x[i]=new T(i,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var i=t.replace(_,k);x[i]=new T(i,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){x[t]=new T(t,1,!1,t.toLowerCase(),null,!1,!1)}),x.xlinkHref=new T("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){x[t]=new T(t,1,!1,t.toLowerCase(),null,!0,!0)});function I(t,i,o,l){var d=x.hasOwnProperty(i)?x[i]:null;(d!==null?d.type!==0:l||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,o,d,l)&&(o=null),l||d===null?v(i)&&(o===null?t.removeAttribute(i):t.setAttribute(i,""+o)):d.mustUseProperty?t[d.propertyName]=o===null?d.type===3?!1:"":o:(i=d.attributeName,l=d.attributeNamespace,o===null?t.removeAttribute(i):(d=d.type,o=d===3||d===4&&o===!0?"":""+o,l?t.setAttributeNS(l,i,o):t.setAttribute(i,o))))}var b=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,W=Symbol.for("react.element"),R=Symbol.for("react.portal"),O=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),L=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),P=Symbol.for("react.context"),J=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),ce=Symbol.for("react.suspense_list"),de=Symbol.for("react.memo"),oe=Symbol.for("react.lazy"),ue=Symbol.for("react.offscreen"),H=Symbol.iterator;function fe(t){return t===null||typeof t!="object"?null:(t=H&&t[H]||t["@@iterator"],typeof t=="function"?t:null)}var ee=Object.assign,F;function se(t){if(F===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);F=i&&i[1]||""}return`
`+F+t}var pe=!1;function Y(t,i){if(!t||pe)return"";pe=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(le){var l=le}Reflect.construct(t,[],i)}else{try{i.call()}catch(le){l=le}t.call(i.prototype)}else{try{throw Error()}catch(le){l=le}t()}}catch(le){if(le&&l&&typeof le.stack=="string"){for(var d=le.stack.split(`
`),p=l.stack.split(`
`),M=d.length-1,N=p.length-1;1<=M&&0<=N&&d[M]!==p[N];)N--;for(;1<=M&&0<=N;M--,N--)if(d[M]!==p[N]){if(M!==1||N!==1)do if(M--,N--,0>N||d[M]!==p[N]){var V=`
`+d[M].replace(" at new "," at ");return t.displayName&&V.includes("<anonymous>")&&(V=V.replace("<anonymous>",t.displayName)),V}while(1<=M&&0<=N);break}}}finally{pe=!1,Error.prepareStackTrace=o}return(t=t?t.displayName||t.name:"")?se(t):""}function ae(t){switch(t.tag){case 5:return se(t.type);case 16:return se("Lazy");case 13:return se("Suspense");case 19:return se("SuspenseList");case 0:case 2:case 15:return t=Y(t.type,!1),t;case 11:return t=Y(t.type.render,!1),t;case 1:return t=Y(t.type,!0),t;default:return""}}function he(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case O:return"Fragment";case R:return"Portal";case L:return"Profiler";case j:return"StrictMode";case q:return"Suspense";case ce:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case P:return(t.displayName||"Context")+".Consumer";case C:return(t._context.displayName||"Context")+".Provider";case J:var i=t.render;return t=t.displayName,t||(t=i.displayName||i.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case de:return i=t.displayName||null,i!==null?i:he(t.type)||"Memo";case oe:i=t._payload,t=t._init;try{return he(t(i))}catch{}}return null}function _e(t){var i=t.type;switch(t.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=i.render,t=t.displayName||t.name||"",i.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return he(i);case 8:return i===j?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Re(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Le(t){var i=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Oe(t){var i=Le(t)?"checked":"value",o=Object.getOwnPropertyDescriptor(t.constructor.prototype,i),l=""+t[i];if(!t.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var d=o.get,p=o.set;return Object.defineProperty(t,i,{configurable:!0,get:function(){return d.call(this)},set:function(M){l=""+M,p.call(this,M)}}),Object.defineProperty(t,i,{enumerable:o.enumerable}),{getValue:function(){return l},setValue:function(M){l=""+M},stopTracking:function(){t._valueTracker=null,delete t[i]}}}}function pt(t){t._valueTracker||(t._valueTracker=Oe(t))}function Pe(t){if(!t)return!1;var i=t._valueTracker;if(!i)return!0;var o=i.getValue(),l="";return t&&(l=Le(t)?t.checked?"true":"false":t.value),t=l,t!==o?(i.setValue(t),!0):!1}function Qe(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function z(t,i){var o=i.checked;return ee({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??t._wrapperState.initialChecked})}function Ct(t,i){var o=i.defaultValue==null?"":i.defaultValue,l=i.checked!=null?i.checked:i.defaultChecked;o=Re(i.value!=null?i.value:o),t._wrapperState={initialChecked:l,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function mt(t,i){i=i.checked,i!=null&&I(t,"checked",i,!1)}function ct(t,i){mt(t,i);var o=Re(i.value),l=i.type;if(o!=null)l==="number"?(o===0&&t.value===""||t.value!=o)&&(t.value=""+o):t.value!==""+o&&(t.value=""+o);else if(l==="submit"||l==="reset"){t.removeAttribute("value");return}i.hasOwnProperty("value")?vt(t,i.type,o):i.hasOwnProperty("defaultValue")&&vt(t,i.type,Re(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(t.defaultChecked=!!i.defaultChecked)}function Ye(t,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var l=i.type;if(!(l!=="submit"&&l!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+t._wrapperState.initialValue,o||i===t.value||(t.value=i),t.defaultValue=i}o=t.name,o!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,o!==""&&(t.name=o)}function vt(t,i,o){(i!=="number"||Qe(t.ownerDocument)!==t)&&(o==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+o&&(t.defaultValue=""+o))}var ze=Array.isArray;function U(t,i,o,l){if(t=t.options,i){i={};for(var d=0;d<o.length;d++)i["$"+o[d]]=!0;for(o=0;o<t.length;o++)d=i.hasOwnProperty("$"+t[o].value),t[o].selected!==d&&(t[o].selected=d),d&&l&&(t[o].defaultSelected=!0)}else{for(o=""+Re(o),i=null,d=0;d<t.length;d++){if(t[d].value===o){t[d].selected=!0,l&&(t[d].defaultSelected=!0);return}i!==null||t[d].disabled||(i=t[d])}i!==null&&(i.selected=!0)}}function w(t,i){if(i.dangerouslySetInnerHTML!=null)throw Error(n(91));return ee({},i,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function te(t,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(n(92));if(ze(o)){if(1<o.length)throw Error(n(93));o=o[0]}i=o}i==null&&(i=""),o=i}t._wrapperState={initialValue:Re(o)}}function ve(t,i){var o=Re(i.value),l=Re(i.defaultValue);o!=null&&(o=""+o,o!==t.value&&(t.value=o),i.defaultValue==null&&t.defaultValue!==o&&(t.defaultValue=o)),l!=null&&(t.defaultValue=""+l)}function xe(t){var i=t.textContent;i===t._wrapperState.initialValue&&i!==""&&i!==null&&(t.value=i)}function ge(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function $e(t,i){return t==null||t==="http://www.w3.org/1999/xhtml"?ge(i):t==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var De,He=(function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,l,d){MSApp.execUnsafeLocalFunction(function(){return t(i,o,l,d)})}:t})(function(t,i){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=i;else{for(De=De||document.createElement("div"),De.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=De.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;i.firstChild;)t.appendChild(i.firstChild)}});function gt(t,i){if(i){var o=t.firstChild;if(o&&o===t.lastChild&&o.nodeType===3){o.nodeValue=i;return}}t.textContent=i}var Ce={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ge=["Webkit","ms","Moz","O"];Object.keys(Ce).forEach(function(t){Ge.forEach(function(i){i=i+t.charAt(0).toUpperCase()+t.substring(1),Ce[i]=Ce[t]})});function et(t,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||Ce.hasOwnProperty(t)&&Ce[t]?(""+i).trim():i+"px"}function st(t,i){t=t.style;for(var o in i)if(i.hasOwnProperty(o)){var l=o.indexOf("--")===0,d=et(o,i[o],l);o==="float"&&(o="cssFloat"),l?t.setProperty(o,d):t[o]=d}}var We=ee({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function xt(t,i){if(i){if(We[t]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(n(137,t));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(n(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(n(61))}if(i.style!=null&&typeof i.style!="object")throw Error(n(62))}}function it(t,i){if(t.indexOf("-")===-1)return typeof i.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var It=null;function D(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var we=null,ne=null,me=null;function Ne(t){if(t=ua(t)){if(typeof we!="function")throw Error(n(280));var i=t.stateNode;i&&(i=Za(i),we(t.stateNode,t.type,i))}}function Ie(t){ne?me?me.push(t):me=[t]:ne=t}function ot(){if(ne){var t=ne,i=me;if(me=ne=null,Ne(t),i)for(t=0;t<i.length;t++)Ne(i[t])}}function zt(t,i){return t(i)}function en(){}var At=!1;function En(t,i,o){if(At)return t(i,o);At=!0;try{return zt(t,i,o)}finally{At=!1,(ne!==null||me!==null)&&(en(),ot())}}function _n(t,i){var o=t.stateNode;if(o===null)return null;var l=Za(o);if(l===null)return null;o=l[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break e;default:t=!1}if(t)return null;if(o&&typeof o!="function")throw Error(n(231,i,typeof o));return o}var er=!1;if(c)try{var wi={};Object.defineProperty(wi,"passive",{get:function(){er=!0}}),window.addEventListener("test",wi,wi),window.removeEventListener("test",wi,wi)}catch{er=!1}function fi(t,i,o,l,d,p,M,N,V){var le=Array.prototype.slice.call(arguments,3);try{i.apply(o,le)}catch(Me){this.onError(Me)}}var Ai=!1,tr=null,Vi=!1,Ri=null,nr={onError:function(t){Ai=!0,tr=t}};function Qn(t,i,o,l,d,p,M,N,V){Ai=!1,tr=null,fi.apply(nr,arguments)}function ir(t,i,o,l,d,p,M,N,V){if(Qn.apply(this,arguments),Ai){if(Ai){var le=tr;Ai=!1,tr=null}else throw Error(n(198));Vi||(Vi=!0,Ri=le)}}function Gn(t){var i=t,o=t;if(t.alternate)for(;i.return;)i=i.return;else{t=i;do i=t,(i.flags&4098)!==0&&(o=i.return),t=i.return;while(t)}return i.tag===3?o:null}function Rr(t){if(t.tag===13){var i=t.memoizedState;if(i===null&&(t=t.alternate,t!==null&&(i=t.memoizedState)),i!==null)return i.dehydrated}return null}function ls(t){if(Gn(t)!==t)throw Error(n(188))}function Cr(t){var i=t.alternate;if(!i){if(i=Gn(t),i===null)throw Error(n(188));return i!==t?null:t}for(var o=t,l=i;;){var d=o.return;if(d===null)break;var p=d.alternate;if(p===null){if(l=d.return,l!==null){o=l;continue}break}if(d.child===p.child){for(p=d.child;p;){if(p===o)return ls(d),t;if(p===l)return ls(d),i;p=p.sibling}throw Error(n(188))}if(o.return!==l.return)o=d,l=p;else{for(var M=!1,N=d.child;N;){if(N===o){M=!0,o=d,l=p;break}if(N===l){M=!0,l=d,o=p;break}N=N.sibling}if(!M){for(N=p.child;N;){if(N===o){M=!0,o=p,l=d;break}if(N===l){M=!0,l=p,o=d;break}N=N.sibling}if(!M)throw Error(n(189))}}if(o.alternate!==l)throw Error(n(190))}if(o.tag!==3)throw Error(n(188));return o.stateNode.current===o?t:i}function br(t){return t=Cr(t),t!==null?Pr(t):null}function Pr(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var i=Pr(t);if(i!==null)return i;t=t.sibling}return null}var Lr=e.unstable_scheduleCallback,A=e.unstable_cancelCallback,X=e.unstable_shouldYield,ie=e.unstable_requestPaint,K=e.unstable_now,$=e.unstable_getCurrentPriorityLevel,Ee=e.unstable_ImmediatePriority,Ue=e.unstable_UserBlockingPriority,ke=e.unstable_NormalPriority,Ve=e.unstable_LowPriority,rt=e.unstable_IdlePriority,Je=null,je=null;function Et(t){if(je&&typeof je.onCommitFiberRoot=="function")try{je.onCommitFiberRoot(Je,t,void 0,(t.current.flags&128)===128)}catch{}}var ft=Math.clz32?Math.clz32:Rt,jt=Math.log,Gt=Math.LN2;function Rt(t){return t>>>=0,t===0?32:31-(jt(t)/Gt|0)|0}var B=64,Te=4194304;function at(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Nt(t,i){var o=t.pendingLanes;if(o===0)return 0;var l=0,d=t.suspendedLanes,p=t.pingedLanes,M=o&268435455;if(M!==0){var N=M&~d;N!==0?l=at(N):(p&=M,p!==0&&(l=at(p)))}else M=o&~d,M!==0?l=at(M):p!==0&&(l=at(p));if(l===0)return 0;if(i!==0&&i!==l&&(i&d)===0&&(d=l&-l,p=i&-i,d>=p||d===16&&(p&4194240)!==0))return i;if((l&4)!==0&&(l|=o&16),i=t.entangledLanes,i!==0)for(t=t.entanglements,i&=l;0<i;)o=31-ft(i),d=1<<o,l|=t[o],i&=~d;return l}function tn(t,i){switch(t){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nn(t,i){for(var o=t.suspendedLanes,l=t.pingedLanes,d=t.expirationTimes,p=t.pendingLanes;0<p;){var M=31-ft(p),N=1<<M,V=d[M];V===-1?((N&o)===0||(N&l)!==0)&&(d[M]=tn(N,i)):V<=i&&(t.expiredLanes|=N),p&=~N}}function Ft(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function lt(){var t=B;return B<<=1,(B&4194240)===0&&(B=64),t}function St(t){for(var i=[],o=0;31>o;o++)i.push(t);return i}function dt(t,i,o){t.pendingLanes|=i,i!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,i=31-ft(i),t[i]=o}function rn(t,i){var o=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;var l=t.eventTimes;for(t=t.expirationTimes;0<o;){var d=31-ft(o),p=1<<d;i[d]=0,l[d]=-1,t[d]=-1,o&=~p}}function Dt(t,i){var o=t.entangledLanes|=i;for(t=t.entanglements;o;){var l=31-ft(o),d=1<<l;d&i|t[l]&i&&(t[l]|=i),o&=~d}}var ht=0;function vn(t){return t&=-t,1<t?4<t?(t&268435455)!==0?16:536870912:4:1}var cn,Jn,za,ks,rr,Bs=!1,Dr=[],Ci=null,ei=null,di=null,Ur=new Map,Ir=new Map,ti=[],jo="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ha(t,i){switch(t){case"focusin":case"focusout":Ci=null;break;case"dragenter":case"dragleave":ei=null;break;case"mouseover":case"mouseout":di=null;break;case"pointerover":case"pointerout":Ur.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ir.delete(i.pointerId)}}function Tn(t,i,o,l,d,p){return t===null||t.nativeEvent!==p?(t={blockedOn:i,domEventName:o,eventSystemFlags:l,nativeEvent:p,targetContainers:[d]},i!==null&&(i=ua(i),i!==null&&Jn(i)),t):(t.eventSystemFlags|=l,i=t.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),t)}function Yo(t,i,o,l,d){switch(i){case"focusin":return Ci=Tn(Ci,t,i,o,l,d),!0;case"dragenter":return ei=Tn(ei,t,i,o,l,d),!0;case"mouseover":return di=Tn(di,t,i,o,l,d),!0;case"pointerover":var p=d.pointerId;return Ur.set(p,Tn(Ur.get(p)||null,t,i,o,l,d)),!0;case"gotpointercapture":return p=d.pointerId,Ir.set(p,Tn(Ir.get(p)||null,t,i,o,l,d)),!0}return!1}function qo(t){var i=cs(t.target);if(i!==null){var o=Gn(i);if(o!==null){if(i=o.tag,i===13){if(i=Rr(o),i!==null){t.blockedOn=i,rr(t.priority,function(){za(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){t.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}t.blockedOn=null}function zs(t){if(t.blockedOn!==null)return!1;for(var i=t.targetContainers;0<i.length;){var o=Kt(t.domEventName,t.eventSystemFlags,i[0],t.nativeEvent);if(o===null){o=t.nativeEvent;var l=new o.constructor(o.type,o);It=l,o.target.dispatchEvent(l),It=null}else return i=ua(o),i!==null&&Jn(i),t.blockedOn=o,!1;i.shift()}return!0}function $o(t,i,o){zs(t)&&o.delete(i)}function Ko(){Bs=!1,Ci!==null&&zs(Ci)&&(Ci=null),ei!==null&&zs(ei)&&(ei=null),di!==null&&zs(di)&&(di=null),Ur.forEach($o),Ir.forEach($o)}function sr(t,i){t.blockedOn===i&&(t.blockedOn=null,Bs||(Bs=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Ko)))}function Nr(t){function i(d){return sr(d,t)}if(0<Dr.length){sr(Dr[0],t);for(var o=1;o<Dr.length;o++){var l=Dr[o];l.blockedOn===t&&(l.blockedOn=null)}}for(Ci!==null&&sr(Ci,t),ei!==null&&sr(ei,t),di!==null&&sr(di,t),Ur.forEach(i),Ir.forEach(i),o=0;o<ti.length;o++)l=ti[o],l.blockedOn===t&&(l.blockedOn=null);for(;0<ti.length&&(o=ti[0],o.blockedOn===null);)qo(o),o.blockedOn===null&&ti.shift()}var hi=b.ReactCurrentBatchConfig,or=!0;function Gi(t,i,o,l){var d=ht,p=hi.transition;hi.transition=null;try{ht=1,Hs(t,i,o,l)}finally{ht=d,hi.transition=p}}function Va(t,i,o,l){var d=ht,p=hi.transition;hi.transition=null;try{ht=4,Hs(t,i,o,l)}finally{ht=d,hi.transition=p}}function Hs(t,i,o,l){if(or){var d=Kt(t,i,o,l);if(d===null)Hu(t,i,l,Tt,o),Ha(t,l);else if(Yo(d,t,i,o,l))l.stopPropagation();else if(Ha(t,l),i&4&&-1<jo.indexOf(t)){for(;d!==null;){var p=ua(d);if(p!==null&&cn(p),p=Kt(t,i,o,l),p===null&&Hu(t,i,l,Tt,o),p===d)break;d=p}d!==null&&l.stopPropagation()}else Hu(t,i,l,null,o)}}var Tt=null;function Kt(t,i,o,l){if(Tt=null,t=D(l),t=cs(t),t!==null)if(i=Gn(t),i===null)t=null;else if(o=i.tag,o===13){if(t=Rr(i),t!==null)return t;t=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;t=null}else i!==t&&(t=null);return Tt=t,null}function Bt(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch($()){case Ee:return 1;case Ue:return 4;case ke:case Ve:return 16;case rt:return 536870912;default:return 16}default:return 16}}var Wt=null,On=null,ni=null;function ar(){if(ni)return ni;var t,i=On,o=i.length,l,d="value"in Wt?Wt.value:Wt.textContent,p=d.length;for(t=0;t<o&&i[t]===d[t];t++);var M=o-t;for(l=1;l<=M&&i[o-l]===d[p-l];l++);return ni=d.slice(t,1<l?1-l:void 0)}function wn(t){var i=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&i===13&&(t=13)):t=i,t===10&&(t=13),32<=t||t===13?t:0}function ii(){return!0}function us(){return!1}function sn(t){function i(o,l,d,p,M){this._reactName=o,this._targetInst=d,this.type=l,this.nativeEvent=p,this.target=M,this.currentTarget=null;for(var N in t)t.hasOwnProperty(N)&&(o=t[N],this[N]=o?o(p):p[N]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?ii:us,this.isPropagationStopped=us,this}return ee(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=ii)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=ii)},persist:function(){},isPersistent:ii}),i}var Fr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zo=sn(Fr),Qo=ee({},Fr,{view:0,detail:0}),qg=sn(Qo),Ru,Cu,Jo,Ga=ee({},Qo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Pu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Jo&&(Jo&&t.type==="mousemove"?(Ru=t.screenX-Jo.screenX,Cu=t.screenY-Jo.screenY):Cu=Ru=0,Jo=t),Ru)},movementY:function(t){return"movementY"in t?t.movementY:Cu}}),kd=sn(Ga),$g=ee({},Ga,{dataTransfer:0}),Kg=sn($g),Zg=ee({},Qo,{relatedTarget:0}),bu=sn(Zg),Qg=ee({},Fr,{animationName:0,elapsedTime:0,pseudoElement:0}),Jg=sn(Qg),e0=ee({},Fr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),t0=sn(e0),n0=ee({},Fr,{data:0}),Bd=sn(n0),i0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},r0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},s0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function o0(t){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(t):(t=s0[t])?!!i[t]:!1}function Pu(){return o0}var a0=ee({},Qo,{key:function(t){if(t.key){var i=i0[t.key]||t.key;if(i!=="Unidentified")return i}return t.type==="keypress"?(t=wn(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?r0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Pu,charCode:function(t){return t.type==="keypress"?wn(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?wn(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),l0=sn(a0),u0=ee({},Ga,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),zd=sn(u0),c0=ee({},Qo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Pu}),f0=sn(c0),d0=ee({},Fr,{propertyName:0,elapsedTime:0,pseudoElement:0}),h0=sn(d0),p0=ee({},Ga,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),m0=sn(p0),g0=[9,13,27,32],Lu=c&&"CompositionEvent"in window,ea=null;c&&"documentMode"in document&&(ea=document.documentMode);var _0=c&&"TextEvent"in window&&!ea,Hd=c&&(!Lu||ea&&8<ea&&11>=ea),Vd=" ",Gd=!1;function Wd(t,i){switch(t){case"keyup":return g0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Xd(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Vs=!1;function v0(t,i){switch(t){case"compositionend":return Xd(i);case"keypress":return i.which!==32?null:(Gd=!0,Vd);case"textInput":return t=i.data,t===Vd&&Gd?null:t;default:return null}}function x0(t,i){if(Vs)return t==="compositionend"||!Lu&&Wd(t,i)?(t=ar(),ni=On=Wt=null,Vs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Hd&&i.locale!=="ko"?null:i.data;default:return null}}var y0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jd(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i==="input"?!!y0[t.type]:i==="textarea"}function Yd(t,i,o,l){Ie(l),i=qa(i,"onChange"),0<i.length&&(o=new Zo("onChange","change",null,o,l),t.push({event:o,listeners:i}))}var ta=null,na=null;function S0(t){fh(t,0)}function Wa(t){var i=Ys(t);if(Pe(i))return t}function M0(t,i){if(t==="change")return i}var qd=!1;if(c){var Du;if(c){var Uu="oninput"in document;if(!Uu){var $d=document.createElement("div");$d.setAttribute("oninput","return;"),Uu=typeof $d.oninput=="function"}Du=Uu}else Du=!1;qd=Du&&(!document.documentMode||9<document.documentMode)}function Kd(){ta&&(ta.detachEvent("onpropertychange",Zd),na=ta=null)}function Zd(t){if(t.propertyName==="value"&&Wa(na)){var i=[];Yd(i,na,t,D(t)),En(S0,i)}}function E0(t,i,o){t==="focusin"?(Kd(),ta=i,na=o,ta.attachEvent("onpropertychange",Zd)):t==="focusout"&&Kd()}function T0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Wa(na)}function w0(t,i){if(t==="click")return Wa(i)}function A0(t,i){if(t==="input"||t==="change")return Wa(i)}function R0(t,i){return t===i&&(t!==0||1/t===1/i)||t!==t&&i!==i}var bi=typeof Object.is=="function"?Object.is:R0;function ia(t,i){if(bi(t,i))return!0;if(typeof t!="object"||t===null||typeof i!="object"||i===null)return!1;var o=Object.keys(t),l=Object.keys(i);if(o.length!==l.length)return!1;for(l=0;l<o.length;l++){var d=o[l];if(!h.call(i,d)||!bi(t[d],i[d]))return!1}return!0}function Qd(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Jd(t,i){var o=Qd(t);t=0;for(var l;o;){if(o.nodeType===3){if(l=t+o.textContent.length,t<=i&&l>=i)return{node:o,offset:i-t};t=l}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=Qd(o)}}function eh(t,i){return t&&i?t===i?!0:t&&t.nodeType===3?!1:i&&i.nodeType===3?eh(t,i.parentNode):"contains"in t?t.contains(i):t.compareDocumentPosition?!!(t.compareDocumentPosition(i)&16):!1:!1}function th(){for(var t=window,i=Qe();i instanceof t.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)t=i.contentWindow;else break;i=Qe(t.document)}return i}function Iu(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i&&(i==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||i==="textarea"||t.contentEditable==="true")}function C0(t){var i=th(),o=t.focusedElem,l=t.selectionRange;if(i!==o&&o&&o.ownerDocument&&eh(o.ownerDocument.documentElement,o)){if(l!==null&&Iu(o)){if(i=l.start,t=l.end,t===void 0&&(t=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(t,o.value.length);else if(t=(i=o.ownerDocument||document)&&i.defaultView||window,t.getSelection){t=t.getSelection();var d=o.textContent.length,p=Math.min(l.start,d);l=l.end===void 0?p:Math.min(l.end,d),!t.extend&&p>l&&(d=l,l=p,p=d),d=Jd(o,p);var M=Jd(o,l);d&&M&&(t.rangeCount!==1||t.anchorNode!==d.node||t.anchorOffset!==d.offset||t.focusNode!==M.node||t.focusOffset!==M.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),t.removeAllRanges(),p>l?(t.addRange(i),t.extend(M.node,M.offset)):(i.setEnd(M.node,M.offset),t.addRange(i)))}}for(i=[],t=o;t=t.parentNode;)t.nodeType===1&&i.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)t=i[o],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var b0=c&&"documentMode"in document&&11>=document.documentMode,Gs=null,Nu=null,ra=null,Fu=!1;function nh(t,i,o){var l=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Fu||Gs==null||Gs!==Qe(l)||(l=Gs,"selectionStart"in l&&Iu(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),ra&&ia(ra,l)||(ra=l,l=qa(Nu,"onSelect"),0<l.length&&(i=new Zo("onSelect","select",null,i,o),t.push({event:i,listeners:l}),i.target=Gs)))}function Xa(t,i){var o={};return o[t.toLowerCase()]=i.toLowerCase(),o["Webkit"+t]="webkit"+i,o["Moz"+t]="moz"+i,o}var Ws={animationend:Xa("Animation","AnimationEnd"),animationiteration:Xa("Animation","AnimationIteration"),animationstart:Xa("Animation","AnimationStart"),transitionend:Xa("Transition","TransitionEnd")},Ou={},ih={};c&&(ih=document.createElement("div").style,"AnimationEvent"in window||(delete Ws.animationend.animation,delete Ws.animationiteration.animation,delete Ws.animationstart.animation),"TransitionEvent"in window||delete Ws.transitionend.transition);function ja(t){if(Ou[t])return Ou[t];if(!Ws[t])return t;var i=Ws[t],o;for(o in i)if(i.hasOwnProperty(o)&&o in ih)return Ou[t]=i[o];return t}var rh=ja("animationend"),sh=ja("animationiteration"),oh=ja("animationstart"),ah=ja("transitionend"),lh=new Map,uh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Or(t,i){lh.set(t,i),u(i,[t])}for(var ku=0;ku<uh.length;ku++){var Bu=uh[ku],P0=Bu.toLowerCase(),L0=Bu[0].toUpperCase()+Bu.slice(1);Or(P0,"on"+L0)}Or(rh,"onAnimationEnd"),Or(sh,"onAnimationIteration"),Or(oh,"onAnimationStart"),Or("dblclick","onDoubleClick"),Or("focusin","onFocus"),Or("focusout","onBlur"),Or(ah,"onTransitionEnd"),f("onMouseEnter",["mouseout","mouseover"]),f("onMouseLeave",["mouseout","mouseover"]),f("onPointerEnter",["pointerout","pointerover"]),f("onPointerLeave",["pointerout","pointerover"]),u("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),u("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),u("onBeforeInput",["compositionend","keypress","textInput","paste"]),u("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),u("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var sa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),D0=new Set("cancel close invalid load scroll toggle".split(" ").concat(sa));function ch(t,i,o){var l=t.type||"unknown-event";t.currentTarget=o,ir(l,i,void 0,t),t.currentTarget=null}function fh(t,i){i=(i&4)!==0;for(var o=0;o<t.length;o++){var l=t[o],d=l.event;l=l.listeners;e:{var p=void 0;if(i)for(var M=l.length-1;0<=M;M--){var N=l[M],V=N.instance,le=N.currentTarget;if(N=N.listener,V!==p&&d.isPropagationStopped())break e;ch(d,N,le),p=V}else for(M=0;M<l.length;M++){if(N=l[M],V=N.instance,le=N.currentTarget,N=N.listener,V!==p&&d.isPropagationStopped())break e;ch(d,N,le),p=V}}}if(Vi)throw t=Ri,Vi=!1,Ri=null,t}function Yt(t,i){var o=i[Yu];o===void 0&&(o=i[Yu]=new Set);var l=t+"__bubble";o.has(l)||(dh(i,t,2,!1),o.add(l))}function zu(t,i,o){var l=0;i&&(l|=4),dh(o,t,l,i)}var Ya="_reactListening"+Math.random().toString(36).slice(2);function oa(t){if(!t[Ya]){t[Ya]=!0,r.forEach(function(o){o!=="selectionchange"&&(D0.has(o)||zu(o,!1,t),zu(o,!0,t))});var i=t.nodeType===9?t:t.ownerDocument;i===null||i[Ya]||(i[Ya]=!0,zu("selectionchange",!1,i))}}function dh(t,i,o,l){switch(Bt(i)){case 1:var d=Gi;break;case 4:d=Va;break;default:d=Hs}o=d.bind(null,i,o,t),d=void 0,!er||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),l?d!==void 0?t.addEventListener(i,o,{capture:!0,passive:d}):t.addEventListener(i,o,!0):d!==void 0?t.addEventListener(i,o,{passive:d}):t.addEventListener(i,o,!1)}function Hu(t,i,o,l,d){var p=l;if((i&1)===0&&(i&2)===0&&l!==null)e:for(;;){if(l===null)return;var M=l.tag;if(M===3||M===4){var N=l.stateNode.containerInfo;if(N===d||N.nodeType===8&&N.parentNode===d)break;if(M===4)for(M=l.return;M!==null;){var V=M.tag;if((V===3||V===4)&&(V=M.stateNode.containerInfo,V===d||V.nodeType===8&&V.parentNode===d))return;M=M.return}for(;N!==null;){if(M=cs(N),M===null)return;if(V=M.tag,V===5||V===6){l=p=M;continue e}N=N.parentNode}}l=l.return}En(function(){var le=p,Me=D(o),Ae=[];e:{var ye=lh.get(t);if(ye!==void 0){var Be=Zo,qe=t;switch(t){case"keypress":if(wn(o)===0)break e;case"keydown":case"keyup":Be=l0;break;case"focusin":qe="focus",Be=bu;break;case"focusout":qe="blur",Be=bu;break;case"beforeblur":case"afterblur":Be=bu;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Be=kd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Be=Kg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Be=f0;break;case rh:case sh:case oh:Be=Jg;break;case ah:Be=h0;break;case"scroll":Be=qg;break;case"wheel":Be=m0;break;case"copy":case"cut":case"paste":Be=t0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Be=zd}var Ke=(i&4)!==0,ln=!Ke&&t==="scroll",Q=Ke?ye!==null?ye+"Capture":null:ye;Ke=[];for(var G=le,re;G!==null;){re=G;var be=re.stateNode;if(re.tag===5&&be!==null&&(re=be,Q!==null&&(be=_n(G,Q),be!=null&&Ke.push(aa(G,be,re)))),ln)break;G=G.return}0<Ke.length&&(ye=new Be(ye,qe,null,o,Me),Ae.push({event:ye,listeners:Ke}))}}if((i&7)===0){e:{if(ye=t==="mouseover"||t==="pointerover",Be=t==="mouseout"||t==="pointerout",ye&&o!==It&&(qe=o.relatedTarget||o.fromElement)&&(cs(qe)||qe[lr]))break e;if((Be||ye)&&(ye=Me.window===Me?Me:(ye=Me.ownerDocument)?ye.defaultView||ye.parentWindow:window,Be?(qe=o.relatedTarget||o.toElement,Be=le,qe=qe?cs(qe):null,qe!==null&&(ln=Gn(qe),qe!==ln||qe.tag!==5&&qe.tag!==6)&&(qe=null)):(Be=null,qe=le),Be!==qe)){if(Ke=kd,be="onMouseLeave",Q="onMouseEnter",G="mouse",(t==="pointerout"||t==="pointerover")&&(Ke=zd,be="onPointerLeave",Q="onPointerEnter",G="pointer"),ln=Be==null?ye:Ys(Be),re=qe==null?ye:Ys(qe),ye=new Ke(be,G+"leave",Be,o,Me),ye.target=ln,ye.relatedTarget=re,be=null,cs(Me)===le&&(Ke=new Ke(Q,G+"enter",qe,o,Me),Ke.target=re,Ke.relatedTarget=ln,be=Ke),ln=be,Be&&qe)t:{for(Ke=Be,Q=qe,G=0,re=Ke;re;re=Xs(re))G++;for(re=0,be=Q;be;be=Xs(be))re++;for(;0<G-re;)Ke=Xs(Ke),G--;for(;0<re-G;)Q=Xs(Q),re--;for(;G--;){if(Ke===Q||Q!==null&&Ke===Q.alternate)break t;Ke=Xs(Ke),Q=Xs(Q)}Ke=null}else Ke=null;Be!==null&&hh(Ae,ye,Be,Ke,!1),qe!==null&&ln!==null&&hh(Ae,ln,qe,Ke,!0)}}e:{if(ye=le?Ys(le):window,Be=ye.nodeName&&ye.nodeName.toLowerCase(),Be==="select"||Be==="input"&&ye.type==="file")var Ze=M0;else if(jd(ye))if(qd)Ze=A0;else{Ze=T0;var tt=E0}else(Be=ye.nodeName)&&Be.toLowerCase()==="input"&&(ye.type==="checkbox"||ye.type==="radio")&&(Ze=w0);if(Ze&&(Ze=Ze(t,le))){Yd(Ae,Ze,o,Me);break e}tt&&tt(t,ye,le),t==="focusout"&&(tt=ye._wrapperState)&&tt.controlled&&ye.type==="number"&&vt(ye,"number",ye.value)}switch(tt=le?Ys(le):window,t){case"focusin":(jd(tt)||tt.contentEditable==="true")&&(Gs=tt,Nu=le,ra=null);break;case"focusout":ra=Nu=Gs=null;break;case"mousedown":Fu=!0;break;case"contextmenu":case"mouseup":case"dragend":Fu=!1,nh(Ae,o,Me);break;case"selectionchange":if(b0)break;case"keydown":case"keyup":nh(Ae,o,Me)}var nt;if(Lu)e:{switch(t){case"compositionstart":var ut="onCompositionStart";break e;case"compositionend":ut="onCompositionEnd";break e;case"compositionupdate":ut="onCompositionUpdate";break e}ut=void 0}else Vs?Wd(t,o)&&(ut="onCompositionEnd"):t==="keydown"&&o.keyCode===229&&(ut="onCompositionStart");ut&&(Hd&&o.locale!=="ko"&&(Vs||ut!=="onCompositionStart"?ut==="onCompositionEnd"&&Vs&&(nt=ar()):(Wt=Me,On="value"in Wt?Wt.value:Wt.textContent,Vs=!0)),tt=qa(le,ut),0<tt.length&&(ut=new Bd(ut,t,null,o,Me),Ae.push({event:ut,listeners:tt}),nt?ut.data=nt:(nt=Xd(o),nt!==null&&(ut.data=nt)))),(nt=_0?v0(t,o):x0(t,o))&&(le=qa(le,"onBeforeInput"),0<le.length&&(Me=new Bd("onBeforeInput","beforeinput",null,o,Me),Ae.push({event:Me,listeners:le}),Me.data=nt))}fh(Ae,i)})}function aa(t,i,o){return{instance:t,listener:i,currentTarget:o}}function qa(t,i){for(var o=i+"Capture",l=[];t!==null;){var d=t,p=d.stateNode;d.tag===5&&p!==null&&(d=p,p=_n(t,o),p!=null&&l.unshift(aa(t,p,d)),p=_n(t,i),p!=null&&l.push(aa(t,p,d))),t=t.return}return l}function Xs(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function hh(t,i,o,l,d){for(var p=i._reactName,M=[];o!==null&&o!==l;){var N=o,V=N.alternate,le=N.stateNode;if(V!==null&&V===l)break;N.tag===5&&le!==null&&(N=le,d?(V=_n(o,p),V!=null&&M.unshift(aa(o,V,N))):d||(V=_n(o,p),V!=null&&M.push(aa(o,V,N)))),o=o.return}M.length!==0&&t.push({event:i,listeners:M})}var U0=/\r\n?/g,I0=/\u0000|\uFFFD/g;function ph(t){return(typeof t=="string"?t:""+t).replace(U0,`
`).replace(I0,"")}function $a(t,i,o){if(i=ph(i),ph(t)!==i&&o)throw Error(n(425))}function Ka(){}var Vu=null,Gu=null;function Wu(t,i){return t==="textarea"||t==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Xu=typeof setTimeout=="function"?setTimeout:void 0,N0=typeof clearTimeout=="function"?clearTimeout:void 0,mh=typeof Promise=="function"?Promise:void 0,F0=typeof queueMicrotask=="function"?queueMicrotask:typeof mh<"u"?function(t){return mh.resolve(null).then(t).catch(O0)}:Xu;function O0(t){setTimeout(function(){throw t})}function ju(t,i){var o=i,l=0;do{var d=o.nextSibling;if(t.removeChild(o),d&&d.nodeType===8)if(o=d.data,o==="/$"){if(l===0){t.removeChild(d),Nr(i);return}l--}else o!=="$"&&o!=="$?"&&o!=="$!"||l++;o=d}while(o);Nr(i)}function kr(t){for(;t!=null;t=t.nextSibling){var i=t.nodeType;if(i===1||i===3)break;if(i===8){if(i=t.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return t}function gh(t){t=t.previousSibling;for(var i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return t;i--}else o==="/$"&&i++}t=t.previousSibling}return null}var js=Math.random().toString(36).slice(2),Wi="__reactFiber$"+js,la="__reactProps$"+js,lr="__reactContainer$"+js,Yu="__reactEvents$"+js,k0="__reactListeners$"+js,B0="__reactHandles$"+js;function cs(t){var i=t[Wi];if(i)return i;for(var o=t.parentNode;o;){if(i=o[lr]||o[Wi]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(t=gh(t);t!==null;){if(o=t[Wi])return o;t=gh(t)}return i}t=o,o=t.parentNode}return null}function ua(t){return t=t[Wi]||t[lr],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Ys(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(n(33))}function Za(t){return t[la]||null}var qu=[],qs=-1;function Br(t){return{current:t}}function qt(t){0>qs||(t.current=qu[qs],qu[qs]=null,qs--)}function Xt(t,i){qs++,qu[qs]=t.current,t.current=i}var zr={},bn=Br(zr),Wn=Br(!1),fs=zr;function $s(t,i){var o=t.type.contextTypes;if(!o)return zr;var l=t.stateNode;if(l&&l.__reactInternalMemoizedUnmaskedChildContext===i)return l.__reactInternalMemoizedMaskedChildContext;var d={},p;for(p in o)d[p]=i[p];return l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=d),d}function Xn(t){return t=t.childContextTypes,t!=null}function Qa(){qt(Wn),qt(bn)}function _h(t,i,o){if(bn.current!==zr)throw Error(n(168));Xt(bn,i),Xt(Wn,o)}function vh(t,i,o){var l=t.stateNode;if(i=i.childContextTypes,typeof l.getChildContext!="function")return o;l=l.getChildContext();for(var d in l)if(!(d in i))throw Error(n(108,_e(t)||"Unknown",d));return ee({},o,l)}function Ja(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||zr,fs=bn.current,Xt(bn,t),Xt(Wn,Wn.current),!0}function xh(t,i,o){var l=t.stateNode;if(!l)throw Error(n(169));o?(t=vh(t,i,fs),l.__reactInternalMemoizedMergedChildContext=t,qt(Wn),qt(bn),Xt(bn,t)):qt(Wn),Xt(Wn,o)}var ur=null,el=!1,$u=!1;function yh(t){ur===null?ur=[t]:ur.push(t)}function z0(t){el=!0,yh(t)}function Hr(){if(!$u&&ur!==null){$u=!0;var t=0,i=ht;try{var o=ur;for(ht=1;t<o.length;t++){var l=o[t];do l=l(!0);while(l!==null)}ur=null,el=!1}catch(d){throw ur!==null&&(ur=ur.slice(t+1)),Lr(Ee,Hr),d}finally{ht=i,$u=!1}}return null}var Ks=[],Zs=0,tl=null,nl=0,pi=[],mi=0,ds=null,cr=1,fr="";function hs(t,i){Ks[Zs++]=nl,Ks[Zs++]=tl,tl=t,nl=i}function Sh(t,i,o){pi[mi++]=cr,pi[mi++]=fr,pi[mi++]=ds,ds=t;var l=cr;t=fr;var d=32-ft(l)-1;l&=~(1<<d),o+=1;var p=32-ft(i)+d;if(30<p){var M=d-d%5;p=(l&(1<<M)-1).toString(32),l>>=M,d-=M,cr=1<<32-ft(i)+d|o<<d|l,fr=p+t}else cr=1<<p|o<<d|l,fr=t}function Ku(t){t.return!==null&&(hs(t,1),Sh(t,1,0))}function Zu(t){for(;t===tl;)tl=Ks[--Zs],Ks[Zs]=null,nl=Ks[--Zs],Ks[Zs]=null;for(;t===ds;)ds=pi[--mi],pi[mi]=null,fr=pi[--mi],pi[mi]=null,cr=pi[--mi],pi[mi]=null}var ri=null,si=null,$t=!1,Pi=null;function Mh(t,i){var o=xi(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=t,i=t.deletions,i===null?(t.deletions=[o],t.flags|=16):i.push(o)}function Eh(t,i){switch(t.tag){case 5:var o=t.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(t.stateNode=i,ri=t,si=kr(i.firstChild),!0):!1;case 6:return i=t.pendingProps===""||i.nodeType!==3?null:i,i!==null?(t.stateNode=i,ri=t,si=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=ds!==null?{id:cr,overflow:fr}:null,t.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=xi(18,null,null,0),o.stateNode=i,o.return=t,t.child=o,ri=t,si=null,!0):!1;default:return!1}}function Qu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Ju(t){if($t){var i=si;if(i){var o=i;if(!Eh(t,i)){if(Qu(t))throw Error(n(418));i=kr(o.nextSibling);var l=ri;i&&Eh(t,i)?Mh(l,o):(t.flags=t.flags&-4097|2,$t=!1,ri=t)}}else{if(Qu(t))throw Error(n(418));t.flags=t.flags&-4097|2,$t=!1,ri=t}}}function Th(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;ri=t}function il(t){if(t!==ri)return!1;if(!$t)return Th(t),$t=!0,!1;var i;if((i=t.tag!==3)&&!(i=t.tag!==5)&&(i=t.type,i=i!=="head"&&i!=="body"&&!Wu(t.type,t.memoizedProps)),i&&(i=si)){if(Qu(t))throw wh(),Error(n(418));for(;i;)Mh(t,i),i=kr(i.nextSibling)}if(Th(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(n(317));e:{for(t=t.nextSibling,i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="/$"){if(i===0){si=kr(t.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}t=t.nextSibling}si=null}}else si=ri?kr(t.stateNode.nextSibling):null;return!0}function wh(){for(var t=si;t;)t=kr(t.nextSibling)}function Qs(){si=ri=null,$t=!1}function ec(t){Pi===null?Pi=[t]:Pi.push(t)}var H0=b.ReactCurrentBatchConfig;function ca(t,i,o){if(t=o.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(n(309));var l=o.stateNode}if(!l)throw Error(n(147,t));var d=l,p=""+t;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===p?i.ref:(i=function(M){var N=d.refs;M===null?delete N[p]:N[p]=M},i._stringRef=p,i)}if(typeof t!="string")throw Error(n(284));if(!o._owner)throw Error(n(290,t))}return t}function rl(t,i){throw t=Object.prototype.toString.call(i),Error(n(31,t==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":t))}function Ah(t){var i=t._init;return i(t._payload)}function Rh(t){function i(Q,G){if(t){var re=Q.deletions;re===null?(Q.deletions=[G],Q.flags|=16):re.push(G)}}function o(Q,G){if(!t)return null;for(;G!==null;)i(Q,G),G=G.sibling;return null}function l(Q,G){for(Q=new Map;G!==null;)G.key!==null?Q.set(G.key,G):Q.set(G.index,G),G=G.sibling;return Q}function d(Q,G){return Q=$r(Q,G),Q.index=0,Q.sibling=null,Q}function p(Q,G,re){return Q.index=re,t?(re=Q.alternate,re!==null?(re=re.index,re<G?(Q.flags|=2,G):re):(Q.flags|=2,G)):(Q.flags|=1048576,G)}function M(Q){return t&&Q.alternate===null&&(Q.flags|=2),Q}function N(Q,G,re,be){return G===null||G.tag!==6?(G=Xc(re,Q.mode,be),G.return=Q,G):(G=d(G,re),G.return=Q,G)}function V(Q,G,re,be){var Ze=re.type;return Ze===O?Me(Q,G,re.props.children,be,re.key):G!==null&&(G.elementType===Ze||typeof Ze=="object"&&Ze!==null&&Ze.$$typeof===oe&&Ah(Ze)===G.type)?(be=d(G,re.props),be.ref=ca(Q,G,re),be.return=Q,be):(be=Cl(re.type,re.key,re.props,null,Q.mode,be),be.ref=ca(Q,G,re),be.return=Q,be)}function le(Q,G,re,be){return G===null||G.tag!==4||G.stateNode.containerInfo!==re.containerInfo||G.stateNode.implementation!==re.implementation?(G=jc(re,Q.mode,be),G.return=Q,G):(G=d(G,re.children||[]),G.return=Q,G)}function Me(Q,G,re,be,Ze){return G===null||G.tag!==7?(G=Ss(re,Q.mode,be,Ze),G.return=Q,G):(G=d(G,re),G.return=Q,G)}function Ae(Q,G,re){if(typeof G=="string"&&G!==""||typeof G=="number")return G=Xc(""+G,Q.mode,re),G.return=Q,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case W:return re=Cl(G.type,G.key,G.props,null,Q.mode,re),re.ref=ca(Q,null,G),re.return=Q,re;case R:return G=jc(G,Q.mode,re),G.return=Q,G;case oe:var be=G._init;return Ae(Q,be(G._payload),re)}if(ze(G)||fe(G))return G=Ss(G,Q.mode,re,null),G.return=Q,G;rl(Q,G)}return null}function ye(Q,G,re,be){var Ze=G!==null?G.key:null;if(typeof re=="string"&&re!==""||typeof re=="number")return Ze!==null?null:N(Q,G,""+re,be);if(typeof re=="object"&&re!==null){switch(re.$$typeof){case W:return re.key===Ze?V(Q,G,re,be):null;case R:return re.key===Ze?le(Q,G,re,be):null;case oe:return Ze=re._init,ye(Q,G,Ze(re._payload),be)}if(ze(re)||fe(re))return Ze!==null?null:Me(Q,G,re,be,null);rl(Q,re)}return null}function Be(Q,G,re,be,Ze){if(typeof be=="string"&&be!==""||typeof be=="number")return Q=Q.get(re)||null,N(G,Q,""+be,Ze);if(typeof be=="object"&&be!==null){switch(be.$$typeof){case W:return Q=Q.get(be.key===null?re:be.key)||null,V(G,Q,be,Ze);case R:return Q=Q.get(be.key===null?re:be.key)||null,le(G,Q,be,Ze);case oe:var tt=be._init;return Be(Q,G,re,tt(be._payload),Ze)}if(ze(be)||fe(be))return Q=Q.get(re)||null,Me(G,Q,be,Ze,null);rl(G,be)}return null}function qe(Q,G,re,be){for(var Ze=null,tt=null,nt=G,ut=G=0,Sn=null;nt!==null&&ut<re.length;ut++){nt.index>ut?(Sn=nt,nt=null):Sn=nt.sibling;var Ot=ye(Q,nt,re[ut],be);if(Ot===null){nt===null&&(nt=Sn);break}t&&nt&&Ot.alternate===null&&i(Q,nt),G=p(Ot,G,ut),tt===null?Ze=Ot:tt.sibling=Ot,tt=Ot,nt=Sn}if(ut===re.length)return o(Q,nt),$t&&hs(Q,ut),Ze;if(nt===null){for(;ut<re.length;ut++)nt=Ae(Q,re[ut],be),nt!==null&&(G=p(nt,G,ut),tt===null?Ze=nt:tt.sibling=nt,tt=nt);return $t&&hs(Q,ut),Ze}for(nt=l(Q,nt);ut<re.length;ut++)Sn=Be(nt,Q,ut,re[ut],be),Sn!==null&&(t&&Sn.alternate!==null&&nt.delete(Sn.key===null?ut:Sn.key),G=p(Sn,G,ut),tt===null?Ze=Sn:tt.sibling=Sn,tt=Sn);return t&&nt.forEach(function(Kr){return i(Q,Kr)}),$t&&hs(Q,ut),Ze}function Ke(Q,G,re,be){var Ze=fe(re);if(typeof Ze!="function")throw Error(n(150));if(re=Ze.call(re),re==null)throw Error(n(151));for(var tt=Ze=null,nt=G,ut=G=0,Sn=null,Ot=re.next();nt!==null&&!Ot.done;ut++,Ot=re.next()){nt.index>ut?(Sn=nt,nt=null):Sn=nt.sibling;var Kr=ye(Q,nt,Ot.value,be);if(Kr===null){nt===null&&(nt=Sn);break}t&&nt&&Kr.alternate===null&&i(Q,nt),G=p(Kr,G,ut),tt===null?Ze=Kr:tt.sibling=Kr,tt=Kr,nt=Sn}if(Ot.done)return o(Q,nt),$t&&hs(Q,ut),Ze;if(nt===null){for(;!Ot.done;ut++,Ot=re.next())Ot=Ae(Q,Ot.value,be),Ot!==null&&(G=p(Ot,G,ut),tt===null?Ze=Ot:tt.sibling=Ot,tt=Ot);return $t&&hs(Q,ut),Ze}for(nt=l(Q,nt);!Ot.done;ut++,Ot=re.next())Ot=Be(nt,Q,ut,Ot.value,be),Ot!==null&&(t&&Ot.alternate!==null&&nt.delete(Ot.key===null?ut:Ot.key),G=p(Ot,G,ut),tt===null?Ze=Ot:tt.sibling=Ot,tt=Ot);return t&&nt.forEach(function(y_){return i(Q,y_)}),$t&&hs(Q,ut),Ze}function ln(Q,G,re,be){if(typeof re=="object"&&re!==null&&re.type===O&&re.key===null&&(re=re.props.children),typeof re=="object"&&re!==null){switch(re.$$typeof){case W:e:{for(var Ze=re.key,tt=G;tt!==null;){if(tt.key===Ze){if(Ze=re.type,Ze===O){if(tt.tag===7){o(Q,tt.sibling),G=d(tt,re.props.children),G.return=Q,Q=G;break e}}else if(tt.elementType===Ze||typeof Ze=="object"&&Ze!==null&&Ze.$$typeof===oe&&Ah(Ze)===tt.type){o(Q,tt.sibling),G=d(tt,re.props),G.ref=ca(Q,tt,re),G.return=Q,Q=G;break e}o(Q,tt);break}else i(Q,tt);tt=tt.sibling}re.type===O?(G=Ss(re.props.children,Q.mode,be,re.key),G.return=Q,Q=G):(be=Cl(re.type,re.key,re.props,null,Q.mode,be),be.ref=ca(Q,G,re),be.return=Q,Q=be)}return M(Q);case R:e:{for(tt=re.key;G!==null;){if(G.key===tt)if(G.tag===4&&G.stateNode.containerInfo===re.containerInfo&&G.stateNode.implementation===re.implementation){o(Q,G.sibling),G=d(G,re.children||[]),G.return=Q,Q=G;break e}else{o(Q,G);break}else i(Q,G);G=G.sibling}G=jc(re,Q.mode,be),G.return=Q,Q=G}return M(Q);case oe:return tt=re._init,ln(Q,G,tt(re._payload),be)}if(ze(re))return qe(Q,G,re,be);if(fe(re))return Ke(Q,G,re,be);rl(Q,re)}return typeof re=="string"&&re!==""||typeof re=="number"?(re=""+re,G!==null&&G.tag===6?(o(Q,G.sibling),G=d(G,re),G.return=Q,Q=G):(o(Q,G),G=Xc(re,Q.mode,be),G.return=Q,Q=G),M(Q)):o(Q,G)}return ln}var Js=Rh(!0),Ch=Rh(!1),sl=Br(null),ol=null,eo=null,tc=null;function nc(){tc=eo=ol=null}function ic(t){var i=sl.current;qt(sl),t._currentValue=i}function rc(t,i,o){for(;t!==null;){var l=t.alternate;if((t.childLanes&i)!==i?(t.childLanes|=i,l!==null&&(l.childLanes|=i)):l!==null&&(l.childLanes&i)!==i&&(l.childLanes|=i),t===o)break;t=t.return}}function to(t,i){ol=t,tc=eo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&i)!==0&&(jn=!0),t.firstContext=null)}function gi(t){var i=t._currentValue;if(tc!==t)if(t={context:t,memoizedValue:i,next:null},eo===null){if(ol===null)throw Error(n(308));eo=t,ol.dependencies={lanes:0,firstContext:t}}else eo=eo.next=t;return i}var ps=null;function sc(t){ps===null?ps=[t]:ps.push(t)}function bh(t,i,o,l){var d=i.interleaved;return d===null?(o.next=o,sc(i)):(o.next=d.next,d.next=o),i.interleaved=o,dr(t,l)}function dr(t,i){t.lanes|=i;var o=t.alternate;for(o!==null&&(o.lanes|=i),o=t,t=t.return;t!==null;)t.childLanes|=i,o=t.alternate,o!==null&&(o.childLanes|=i),o=t,t=t.return;return o.tag===3?o.stateNode:null}var Vr=!1;function oc(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ph(t,i){t=t.updateQueue,i.updateQueue===t&&(i.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function hr(t,i){return{eventTime:t,lane:i,tag:0,payload:null,callback:null,next:null}}function Gr(t,i,o){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(Ut&2)!==0){var d=l.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),l.pending=i,dr(t,o)}return d=l.interleaved,d===null?(i.next=i,sc(l)):(i.next=d.next,d.next=i),l.interleaved=i,dr(t,o)}function al(t,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Dt(t,o)}}function Lh(t,i){var o=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,o===l)){var d=null,p=null;if(o=o.firstBaseUpdate,o!==null){do{var M={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};p===null?d=p=M:p=p.next=M,o=o.next}while(o!==null);p===null?d=p=i:p=p.next=i}else d=p=i;o={baseState:l.baseState,firstBaseUpdate:d,lastBaseUpdate:p,shared:l.shared,effects:l.effects},t.updateQueue=o;return}t=o.lastBaseUpdate,t===null?o.firstBaseUpdate=i:t.next=i,o.lastBaseUpdate=i}function ll(t,i,o,l){var d=t.updateQueue;Vr=!1;var p=d.firstBaseUpdate,M=d.lastBaseUpdate,N=d.shared.pending;if(N!==null){d.shared.pending=null;var V=N,le=V.next;V.next=null,M===null?p=le:M.next=le,M=V;var Me=t.alternate;Me!==null&&(Me=Me.updateQueue,N=Me.lastBaseUpdate,N!==M&&(N===null?Me.firstBaseUpdate=le:N.next=le,Me.lastBaseUpdate=V))}if(p!==null){var Ae=d.baseState;M=0,Me=le=V=null,N=p;do{var ye=N.lane,Be=N.eventTime;if((l&ye)===ye){Me!==null&&(Me=Me.next={eventTime:Be,lane:0,tag:N.tag,payload:N.payload,callback:N.callback,next:null});e:{var qe=t,Ke=N;switch(ye=i,Be=o,Ke.tag){case 1:if(qe=Ke.payload,typeof qe=="function"){Ae=qe.call(Be,Ae,ye);break e}Ae=qe;break e;case 3:qe.flags=qe.flags&-65537|128;case 0:if(qe=Ke.payload,ye=typeof qe=="function"?qe.call(Be,Ae,ye):qe,ye==null)break e;Ae=ee({},Ae,ye);break e;case 2:Vr=!0}}N.callback!==null&&N.lane!==0&&(t.flags|=64,ye=d.effects,ye===null?d.effects=[N]:ye.push(N))}else Be={eventTime:Be,lane:ye,tag:N.tag,payload:N.payload,callback:N.callback,next:null},Me===null?(le=Me=Be,V=Ae):Me=Me.next=Be,M|=ye;if(N=N.next,N===null){if(N=d.shared.pending,N===null)break;ye=N,N=ye.next,ye.next=null,d.lastBaseUpdate=ye,d.shared.pending=null}}while(!0);if(Me===null&&(V=Ae),d.baseState=V,d.firstBaseUpdate=le,d.lastBaseUpdate=Me,i=d.shared.interleaved,i!==null){d=i;do M|=d.lane,d=d.next;while(d!==i)}else p===null&&(d.shared.lanes=0);_s|=M,t.lanes=M,t.memoizedState=Ae}}function Dh(t,i,o){if(t=i.effects,i.effects=null,t!==null)for(i=0;i<t.length;i++){var l=t[i],d=l.callback;if(d!==null){if(l.callback=null,l=o,typeof d!="function")throw Error(n(191,d));d.call(l)}}}var fa={},Xi=Br(fa),da=Br(fa),ha=Br(fa);function ms(t){if(t===fa)throw Error(n(174));return t}function ac(t,i){switch(Xt(ha,i),Xt(da,t),Xt(Xi,fa),t=i.nodeType,t){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:$e(null,"");break;default:t=t===8?i.parentNode:i,i=t.namespaceURI||null,t=t.tagName,i=$e(i,t)}qt(Xi),Xt(Xi,i)}function no(){qt(Xi),qt(da),qt(ha)}function Uh(t){ms(ha.current);var i=ms(Xi.current),o=$e(i,t.type);i!==o&&(Xt(da,t),Xt(Xi,o))}function lc(t){da.current===t&&(qt(Xi),qt(da))}var Zt=Br(0);function ul(t){for(var i=t;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var uc=[];function cc(){for(var t=0;t<uc.length;t++)uc[t]._workInProgressVersionPrimary=null;uc.length=0}var cl=b.ReactCurrentDispatcher,fc=b.ReactCurrentBatchConfig,gs=0,Qt=null,hn=null,xn=null,fl=!1,pa=!1,ma=0,V0=0;function Pn(){throw Error(n(321))}function dc(t,i){if(i===null)return!1;for(var o=0;o<i.length&&o<t.length;o++)if(!bi(t[o],i[o]))return!1;return!0}function hc(t,i,o,l,d,p){if(gs=p,Qt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,cl.current=t===null||t.memoizedState===null?j0:Y0,t=o(l,d),pa){p=0;do{if(pa=!1,ma=0,25<=p)throw Error(n(301));p+=1,xn=hn=null,i.updateQueue=null,cl.current=q0,t=o(l,d)}while(pa)}if(cl.current=pl,i=hn!==null&&hn.next!==null,gs=0,xn=hn=Qt=null,fl=!1,i)throw Error(n(300));return t}function pc(){var t=ma!==0;return ma=0,t}function ji(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return xn===null?Qt.memoizedState=xn=t:xn=xn.next=t,xn}function _i(){if(hn===null){var t=Qt.alternate;t=t!==null?t.memoizedState:null}else t=hn.next;var i=xn===null?Qt.memoizedState:xn.next;if(i!==null)xn=i,hn=t;else{if(t===null)throw Error(n(310));hn=t,t={memoizedState:hn.memoizedState,baseState:hn.baseState,baseQueue:hn.baseQueue,queue:hn.queue,next:null},xn===null?Qt.memoizedState=xn=t:xn=xn.next=t}return xn}function ga(t,i){return typeof i=="function"?i(t):i}function mc(t){var i=_i(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=hn,d=l.baseQueue,p=o.pending;if(p!==null){if(d!==null){var M=d.next;d.next=p.next,p.next=M}l.baseQueue=d=p,o.pending=null}if(d!==null){p=d.next,l=l.baseState;var N=M=null,V=null,le=p;do{var Me=le.lane;if((gs&Me)===Me)V!==null&&(V=V.next={lane:0,action:le.action,hasEagerState:le.hasEagerState,eagerState:le.eagerState,next:null}),l=le.hasEagerState?le.eagerState:t(l,le.action);else{var Ae={lane:Me,action:le.action,hasEagerState:le.hasEagerState,eagerState:le.eagerState,next:null};V===null?(N=V=Ae,M=l):V=V.next=Ae,Qt.lanes|=Me,_s|=Me}le=le.next}while(le!==null&&le!==p);V===null?M=l:V.next=N,bi(l,i.memoizedState)||(jn=!0),i.memoizedState=l,i.baseState=M,i.baseQueue=V,o.lastRenderedState=l}if(t=o.interleaved,t!==null){d=t;do p=d.lane,Qt.lanes|=p,_s|=p,d=d.next;while(d!==t)}else d===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function gc(t){var i=_i(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=o.dispatch,d=o.pending,p=i.memoizedState;if(d!==null){o.pending=null;var M=d=d.next;do p=t(p,M.action),M=M.next;while(M!==d);bi(p,i.memoizedState)||(jn=!0),i.memoizedState=p,i.baseQueue===null&&(i.baseState=p),o.lastRenderedState=p}return[p,l]}function Ih(){}function Nh(t,i){var o=Qt,l=_i(),d=i(),p=!bi(l.memoizedState,d);if(p&&(l.memoizedState=d,jn=!0),l=l.queue,_c(kh.bind(null,o,l,t),[t]),l.getSnapshot!==i||p||xn!==null&&xn.memoizedState.tag&1){if(o.flags|=2048,_a(9,Oh.bind(null,o,l,d,i),void 0,null),yn===null)throw Error(n(349));(gs&30)!==0||Fh(o,i,d)}return d}function Fh(t,i,o){t.flags|=16384,t={getSnapshot:i,value:o},i=Qt.updateQueue,i===null?(i={lastEffect:null,stores:null},Qt.updateQueue=i,i.stores=[t]):(o=i.stores,o===null?i.stores=[t]:o.push(t))}function Oh(t,i,o,l){i.value=o,i.getSnapshot=l,Bh(i)&&zh(t)}function kh(t,i,o){return o(function(){Bh(i)&&zh(t)})}function Bh(t){var i=t.getSnapshot;t=t.value;try{var o=i();return!bi(t,o)}catch{return!0}}function zh(t){var i=dr(t,1);i!==null&&Ii(i,t,1,-1)}function Hh(t){var i=ji();return typeof t=="function"&&(t=t()),i.memoizedState=i.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ga,lastRenderedState:t},i.queue=t,t=t.dispatch=X0.bind(null,Qt,t),[i.memoizedState,t]}function _a(t,i,o,l){return t={tag:t,create:i,destroy:o,deps:l,next:null},i=Qt.updateQueue,i===null?(i={lastEffect:null,stores:null},Qt.updateQueue=i,i.lastEffect=t.next=t):(o=i.lastEffect,o===null?i.lastEffect=t.next=t:(l=o.next,o.next=t,t.next=l,i.lastEffect=t)),t}function Vh(){return _i().memoizedState}function dl(t,i,o,l){var d=ji();Qt.flags|=t,d.memoizedState=_a(1|i,o,void 0,l===void 0?null:l)}function hl(t,i,o,l){var d=_i();l=l===void 0?null:l;var p=void 0;if(hn!==null){var M=hn.memoizedState;if(p=M.destroy,l!==null&&dc(l,M.deps)){d.memoizedState=_a(i,o,p,l);return}}Qt.flags|=t,d.memoizedState=_a(1|i,o,p,l)}function Gh(t,i){return dl(8390656,8,t,i)}function _c(t,i){return hl(2048,8,t,i)}function Wh(t,i){return hl(4,2,t,i)}function Xh(t,i){return hl(4,4,t,i)}function jh(t,i){if(typeof i=="function")return t=t(),i(t),function(){i(null)};if(i!=null)return t=t(),i.current=t,function(){i.current=null}}function Yh(t,i,o){return o=o!=null?o.concat([t]):null,hl(4,4,jh.bind(null,i,t),o)}function vc(){}function qh(t,i){var o=_i();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&dc(i,l[1])?l[0]:(o.memoizedState=[t,i],t)}function $h(t,i){var o=_i();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&dc(i,l[1])?l[0]:(t=t(),o.memoizedState=[t,i],t)}function Kh(t,i,o){return(gs&21)===0?(t.baseState&&(t.baseState=!1,jn=!0),t.memoizedState=o):(bi(o,i)||(o=lt(),Qt.lanes|=o,_s|=o,t.baseState=!0),i)}function G0(t,i){var o=ht;ht=o!==0&&4>o?o:4,t(!0);var l=fc.transition;fc.transition={};try{t(!1),i()}finally{ht=o,fc.transition=l}}function Zh(){return _i().memoizedState}function W0(t,i,o){var l=Yr(t);if(o={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null},Qh(t))Jh(i,o);else if(o=bh(t,i,o,l),o!==null){var d=Bn();Ii(o,t,l,d),ep(o,i,l)}}function X0(t,i,o){var l=Yr(t),d={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null};if(Qh(t))Jh(i,d);else{var p=t.alternate;if(t.lanes===0&&(p===null||p.lanes===0)&&(p=i.lastRenderedReducer,p!==null))try{var M=i.lastRenderedState,N=p(M,o);if(d.hasEagerState=!0,d.eagerState=N,bi(N,M)){var V=i.interleaved;V===null?(d.next=d,sc(i)):(d.next=V.next,V.next=d),i.interleaved=d;return}}catch{}finally{}o=bh(t,i,d,l),o!==null&&(d=Bn(),Ii(o,t,l,d),ep(o,i,l))}}function Qh(t){var i=t.alternate;return t===Qt||i!==null&&i===Qt}function Jh(t,i){pa=fl=!0;var o=t.pending;o===null?i.next=i:(i.next=o.next,o.next=i),t.pending=i}function ep(t,i,o){if((o&4194240)!==0){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Dt(t,o)}}var pl={readContext:gi,useCallback:Pn,useContext:Pn,useEffect:Pn,useImperativeHandle:Pn,useInsertionEffect:Pn,useLayoutEffect:Pn,useMemo:Pn,useReducer:Pn,useRef:Pn,useState:Pn,useDebugValue:Pn,useDeferredValue:Pn,useTransition:Pn,useMutableSource:Pn,useSyncExternalStore:Pn,useId:Pn,unstable_isNewReconciler:!1},j0={readContext:gi,useCallback:function(t,i){return ji().memoizedState=[t,i===void 0?null:i],t},useContext:gi,useEffect:Gh,useImperativeHandle:function(t,i,o){return o=o!=null?o.concat([t]):null,dl(4194308,4,jh.bind(null,i,t),o)},useLayoutEffect:function(t,i){return dl(4194308,4,t,i)},useInsertionEffect:function(t,i){return dl(4,2,t,i)},useMemo:function(t,i){var o=ji();return i=i===void 0?null:i,t=t(),o.memoizedState=[t,i],t},useReducer:function(t,i,o){var l=ji();return i=o!==void 0?o(i):i,l.memoizedState=l.baseState=i,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},l.queue=t,t=t.dispatch=W0.bind(null,Qt,t),[l.memoizedState,t]},useRef:function(t){var i=ji();return t={current:t},i.memoizedState=t},useState:Hh,useDebugValue:vc,useDeferredValue:function(t){return ji().memoizedState=t},useTransition:function(){var t=Hh(!1),i=t[0];return t=G0.bind(null,t[1]),ji().memoizedState=t,[i,t]},useMutableSource:function(){},useSyncExternalStore:function(t,i,o){var l=Qt,d=ji();if($t){if(o===void 0)throw Error(n(407));o=o()}else{if(o=i(),yn===null)throw Error(n(349));(gs&30)!==0||Fh(l,i,o)}d.memoizedState=o;var p={value:o,getSnapshot:i};return d.queue=p,Gh(kh.bind(null,l,p,t),[t]),l.flags|=2048,_a(9,Oh.bind(null,l,p,o,i),void 0,null),o},useId:function(){var t=ji(),i=yn.identifierPrefix;if($t){var o=fr,l=cr;o=(l&~(1<<32-ft(l)-1)).toString(32)+o,i=":"+i+"R"+o,o=ma++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=V0++,i=":"+i+"r"+o.toString(32)+":";return t.memoizedState=i},unstable_isNewReconciler:!1},Y0={readContext:gi,useCallback:qh,useContext:gi,useEffect:_c,useImperativeHandle:Yh,useInsertionEffect:Wh,useLayoutEffect:Xh,useMemo:$h,useReducer:mc,useRef:Vh,useState:function(){return mc(ga)},useDebugValue:vc,useDeferredValue:function(t){var i=_i();return Kh(i,hn.memoizedState,t)},useTransition:function(){var t=mc(ga)[0],i=_i().memoizedState;return[t,i]},useMutableSource:Ih,useSyncExternalStore:Nh,useId:Zh,unstable_isNewReconciler:!1},q0={readContext:gi,useCallback:qh,useContext:gi,useEffect:_c,useImperativeHandle:Yh,useInsertionEffect:Wh,useLayoutEffect:Xh,useMemo:$h,useReducer:gc,useRef:Vh,useState:function(){return gc(ga)},useDebugValue:vc,useDeferredValue:function(t){var i=_i();return hn===null?i.memoizedState=t:Kh(i,hn.memoizedState,t)},useTransition:function(){var t=gc(ga)[0],i=_i().memoizedState;return[t,i]},useMutableSource:Ih,useSyncExternalStore:Nh,useId:Zh,unstable_isNewReconciler:!1};function Li(t,i){if(t&&t.defaultProps){i=ee({},i),t=t.defaultProps;for(var o in t)i[o]===void 0&&(i[o]=t[o]);return i}return i}function xc(t,i,o,l){i=t.memoizedState,o=o(l,i),o=o==null?i:ee({},i,o),t.memoizedState=o,t.lanes===0&&(t.updateQueue.baseState=o)}var ml={isMounted:function(t){return(t=t._reactInternals)?Gn(t)===t:!1},enqueueSetState:function(t,i,o){t=t._reactInternals;var l=Bn(),d=Yr(t),p=hr(l,d);p.payload=i,o!=null&&(p.callback=o),i=Gr(t,p,d),i!==null&&(Ii(i,t,d,l),al(i,t,d))},enqueueReplaceState:function(t,i,o){t=t._reactInternals;var l=Bn(),d=Yr(t),p=hr(l,d);p.tag=1,p.payload=i,o!=null&&(p.callback=o),i=Gr(t,p,d),i!==null&&(Ii(i,t,d,l),al(i,t,d))},enqueueForceUpdate:function(t,i){t=t._reactInternals;var o=Bn(),l=Yr(t),d=hr(o,l);d.tag=2,i!=null&&(d.callback=i),i=Gr(t,d,l),i!==null&&(Ii(i,t,l,o),al(i,t,l))}};function tp(t,i,o,l,d,p,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,p,M):i.prototype&&i.prototype.isPureReactComponent?!ia(o,l)||!ia(d,p):!0}function np(t,i,o){var l=!1,d=zr,p=i.contextType;return typeof p=="object"&&p!==null?p=gi(p):(d=Xn(i)?fs:bn.current,l=i.contextTypes,p=(l=l!=null)?$s(t,d):zr),i=new i(o,p),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=ml,t.stateNode=i,i._reactInternals=t,l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=d,t.__reactInternalMemoizedMaskedChildContext=p),i}function ip(t,i,o,l){t=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,l),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,l),i.state!==t&&ml.enqueueReplaceState(i,i.state,null)}function yc(t,i,o,l){var d=t.stateNode;d.props=o,d.state=t.memoizedState,d.refs={},oc(t);var p=i.contextType;typeof p=="object"&&p!==null?d.context=gi(p):(p=Xn(i)?fs:bn.current,d.context=$s(t,p)),d.state=t.memoizedState,p=i.getDerivedStateFromProps,typeof p=="function"&&(xc(t,i,p,o),d.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&ml.enqueueReplaceState(d,d.state,null),ll(t,o,d,l),d.state=t.memoizedState),typeof d.componentDidMount=="function"&&(t.flags|=4194308)}function io(t,i){try{var o="",l=i;do o+=ae(l),l=l.return;while(l);var d=o}catch(p){d=`
Error generating stack: `+p.message+`
`+p.stack}return{value:t,source:i,stack:d,digest:null}}function Sc(t,i,o){return{value:t,source:null,stack:o??null,digest:i??null}}function Mc(t,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var $0=typeof WeakMap=="function"?WeakMap:Map;function rp(t,i,o){o=hr(-1,o),o.tag=3,o.payload={element:null};var l=i.value;return o.callback=function(){Ml||(Ml=!0,Oc=l),Mc(t,i)},o}function sp(t,i,o){o=hr(-1,o),o.tag=3;var l=t.type.getDerivedStateFromError;if(typeof l=="function"){var d=i.value;o.payload=function(){return l(d)},o.callback=function(){Mc(t,i)}}var p=t.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(o.callback=function(){Mc(t,i),typeof l!="function"&&(Xr===null?Xr=new Set([this]):Xr.add(this));var M=i.stack;this.componentDidCatch(i.value,{componentStack:M!==null?M:""})}),o}function op(t,i,o){var l=t.pingCache;if(l===null){l=t.pingCache=new $0;var d=new Set;l.set(i,d)}else d=l.get(i),d===void 0&&(d=new Set,l.set(i,d));d.has(o)||(d.add(o),t=u_.bind(null,t,i,o),i.then(t,t))}function ap(t){do{var i;if((i=t.tag===13)&&(i=t.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return t;t=t.return}while(t!==null);return null}function lp(t,i,o,l,d){return(t.mode&1)===0?(t===i?t.flags|=65536:(t.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=hr(-1,1),i.tag=2,Gr(o,i,1))),o.lanes|=1),t):(t.flags|=65536,t.lanes=d,t)}var K0=b.ReactCurrentOwner,jn=!1;function kn(t,i,o,l){i.child=t===null?Ch(i,null,o,l):Js(i,t.child,o,l)}function up(t,i,o,l,d){o=o.render;var p=i.ref;return to(i,d),l=hc(t,i,o,l,p,d),o=pc(),t!==null&&!jn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~d,pr(t,i,d)):($t&&o&&Ku(i),i.flags|=1,kn(t,i,l,d),i.child)}function cp(t,i,o,l,d){if(t===null){var p=o.type;return typeof p=="function"&&!Wc(p)&&p.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=p,fp(t,i,p,l,d)):(t=Cl(o.type,null,l,i,i.mode,d),t.ref=i.ref,t.return=i,i.child=t)}if(p=t.child,(t.lanes&d)===0){var M=p.memoizedProps;if(o=o.compare,o=o!==null?o:ia,o(M,l)&&t.ref===i.ref)return pr(t,i,d)}return i.flags|=1,t=$r(p,l),t.ref=i.ref,t.return=i,i.child=t}function fp(t,i,o,l,d){if(t!==null){var p=t.memoizedProps;if(ia(p,l)&&t.ref===i.ref)if(jn=!1,i.pendingProps=l=p,(t.lanes&d)!==0)(t.flags&131072)!==0&&(jn=!0);else return i.lanes=t.lanes,pr(t,i,d)}return Ec(t,i,o,l,d)}function dp(t,i,o){var l=i.pendingProps,d=l.children,p=t!==null?t.memoizedState:null;if(l.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Xt(so,oi),oi|=o;else{if((o&1073741824)===0)return t=p!==null?p.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:t,cachePool:null,transitions:null},i.updateQueue=null,Xt(so,oi),oi|=t,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},l=p!==null?p.baseLanes:o,Xt(so,oi),oi|=l}else p!==null?(l=p.baseLanes|o,i.memoizedState=null):l=o,Xt(so,oi),oi|=l;return kn(t,i,d,o),i.child}function hp(t,i){var o=i.ref;(t===null&&o!==null||t!==null&&t.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function Ec(t,i,o,l,d){var p=Xn(o)?fs:bn.current;return p=$s(i,p),to(i,d),o=hc(t,i,o,l,p,d),l=pc(),t!==null&&!jn?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~d,pr(t,i,d)):($t&&l&&Ku(i),i.flags|=1,kn(t,i,o,d),i.child)}function pp(t,i,o,l,d){if(Xn(o)){var p=!0;Ja(i)}else p=!1;if(to(i,d),i.stateNode===null)_l(t,i),np(i,o,l),yc(i,o,l,d),l=!0;else if(t===null){var M=i.stateNode,N=i.memoizedProps;M.props=N;var V=M.context,le=o.contextType;typeof le=="object"&&le!==null?le=gi(le):(le=Xn(o)?fs:bn.current,le=$s(i,le));var Me=o.getDerivedStateFromProps,Ae=typeof Me=="function"||typeof M.getSnapshotBeforeUpdate=="function";Ae||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(N!==l||V!==le)&&ip(i,M,l,le),Vr=!1;var ye=i.memoizedState;M.state=ye,ll(i,l,M,d),V=i.memoizedState,N!==l||ye!==V||Wn.current||Vr?(typeof Me=="function"&&(xc(i,o,Me,l),V=i.memoizedState),(N=Vr||tp(i,o,N,l,ye,V,le))?(Ae||typeof M.UNSAFE_componentWillMount!="function"&&typeof M.componentWillMount!="function"||(typeof M.componentWillMount=="function"&&M.componentWillMount(),typeof M.UNSAFE_componentWillMount=="function"&&M.UNSAFE_componentWillMount()),typeof M.componentDidMount=="function"&&(i.flags|=4194308)):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=l,i.memoizedState=V),M.props=l,M.state=V,M.context=le,l=N):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),l=!1)}else{M=i.stateNode,Ph(t,i),N=i.memoizedProps,le=i.type===i.elementType?N:Li(i.type,N),M.props=le,Ae=i.pendingProps,ye=M.context,V=o.contextType,typeof V=="object"&&V!==null?V=gi(V):(V=Xn(o)?fs:bn.current,V=$s(i,V));var Be=o.getDerivedStateFromProps;(Me=typeof Be=="function"||typeof M.getSnapshotBeforeUpdate=="function")||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(N!==Ae||ye!==V)&&ip(i,M,l,V),Vr=!1,ye=i.memoizedState,M.state=ye,ll(i,l,M,d);var qe=i.memoizedState;N!==Ae||ye!==qe||Wn.current||Vr?(typeof Be=="function"&&(xc(i,o,Be,l),qe=i.memoizedState),(le=Vr||tp(i,o,le,l,ye,qe,V)||!1)?(Me||typeof M.UNSAFE_componentWillUpdate!="function"&&typeof M.componentWillUpdate!="function"||(typeof M.componentWillUpdate=="function"&&M.componentWillUpdate(l,qe,V),typeof M.UNSAFE_componentWillUpdate=="function"&&M.UNSAFE_componentWillUpdate(l,qe,V)),typeof M.componentDidUpdate=="function"&&(i.flags|=4),typeof M.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof M.componentDidUpdate!="function"||N===t.memoizedProps&&ye===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||N===t.memoizedProps&&ye===t.memoizedState||(i.flags|=1024),i.memoizedProps=l,i.memoizedState=qe),M.props=l,M.state=qe,M.context=V,l=le):(typeof M.componentDidUpdate!="function"||N===t.memoizedProps&&ye===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||N===t.memoizedProps&&ye===t.memoizedState||(i.flags|=1024),l=!1)}return Tc(t,i,o,l,p,d)}function Tc(t,i,o,l,d,p){hp(t,i);var M=(i.flags&128)!==0;if(!l&&!M)return d&&xh(i,o,!1),pr(t,i,p);l=i.stateNode,K0.current=i;var N=M&&typeof o.getDerivedStateFromError!="function"?null:l.render();return i.flags|=1,t!==null&&M?(i.child=Js(i,t.child,null,p),i.child=Js(i,null,N,p)):kn(t,i,N,p),i.memoizedState=l.state,d&&xh(i,o,!0),i.child}function mp(t){var i=t.stateNode;i.pendingContext?_h(t,i.pendingContext,i.pendingContext!==i.context):i.context&&_h(t,i.context,!1),ac(t,i.containerInfo)}function gp(t,i,o,l,d){return Qs(),ec(d),i.flags|=256,kn(t,i,o,l),i.child}var wc={dehydrated:null,treeContext:null,retryLane:0};function Ac(t){return{baseLanes:t,cachePool:null,transitions:null}}function _p(t,i,o){var l=i.pendingProps,d=Zt.current,p=!1,M=(i.flags&128)!==0,N;if((N=M)||(N=t!==null&&t.memoizedState===null?!1:(d&2)!==0),N?(p=!0,i.flags&=-129):(t===null||t.memoizedState!==null)&&(d|=1),Xt(Zt,d&1),t===null)return Ju(i),t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?((i.mode&1)===0?i.lanes=1:t.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(M=l.children,t=l.fallback,p?(l=i.mode,p=i.child,M={mode:"hidden",children:M},(l&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=M):p=bl(M,l,0,null),t=Ss(t,l,o,null),p.return=i,t.return=i,p.sibling=t,i.child=p,i.child.memoizedState=Ac(o),i.memoizedState=wc,t):Rc(i,M));if(d=t.memoizedState,d!==null&&(N=d.dehydrated,N!==null))return Z0(t,i,M,l,N,d,o);if(p){p=l.fallback,M=i.mode,d=t.child,N=d.sibling;var V={mode:"hidden",children:l.children};return(M&1)===0&&i.child!==d?(l=i.child,l.childLanes=0,l.pendingProps=V,i.deletions=null):(l=$r(d,V),l.subtreeFlags=d.subtreeFlags&14680064),N!==null?p=$r(N,p):(p=Ss(p,M,o,null),p.flags|=2),p.return=i,l.return=i,l.sibling=p,i.child=l,l=p,p=i.child,M=t.child.memoizedState,M=M===null?Ac(o):{baseLanes:M.baseLanes|o,cachePool:null,transitions:M.transitions},p.memoizedState=M,p.childLanes=t.childLanes&~o,i.memoizedState=wc,l}return p=t.child,t=p.sibling,l=$r(p,{mode:"visible",children:l.children}),(i.mode&1)===0&&(l.lanes=o),l.return=i,l.sibling=null,t!==null&&(o=i.deletions,o===null?(i.deletions=[t],i.flags|=16):o.push(t)),i.child=l,i.memoizedState=null,l}function Rc(t,i){return i=bl({mode:"visible",children:i},t.mode,0,null),i.return=t,t.child=i}function gl(t,i,o,l){return l!==null&&ec(l),Js(i,t.child,null,o),t=Rc(i,i.pendingProps.children),t.flags|=2,i.memoizedState=null,t}function Z0(t,i,o,l,d,p,M){if(o)return i.flags&256?(i.flags&=-257,l=Sc(Error(n(422))),gl(t,i,M,l)):i.memoizedState!==null?(i.child=t.child,i.flags|=128,null):(p=l.fallback,d=i.mode,l=bl({mode:"visible",children:l.children},d,0,null),p=Ss(p,d,M,null),p.flags|=2,l.return=i,p.return=i,l.sibling=p,i.child=l,(i.mode&1)!==0&&Js(i,t.child,null,M),i.child.memoizedState=Ac(M),i.memoizedState=wc,p);if((i.mode&1)===0)return gl(t,i,M,null);if(d.data==="$!"){if(l=d.nextSibling&&d.nextSibling.dataset,l)var N=l.dgst;return l=N,p=Error(n(419)),l=Sc(p,l,void 0),gl(t,i,M,l)}if(N=(M&t.childLanes)!==0,jn||N){if(l=yn,l!==null){switch(M&-M){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(l.suspendedLanes|M))!==0?0:d,d!==0&&d!==p.retryLane&&(p.retryLane=d,dr(t,d),Ii(l,t,d,-1))}return Gc(),l=Sc(Error(n(421))),gl(t,i,M,l)}return d.data==="$?"?(i.flags|=128,i.child=t.child,i=c_.bind(null,t),d._reactRetry=i,null):(t=p.treeContext,si=kr(d.nextSibling),ri=i,$t=!0,Pi=null,t!==null&&(pi[mi++]=cr,pi[mi++]=fr,pi[mi++]=ds,cr=t.id,fr=t.overflow,ds=i),i=Rc(i,l.children),i.flags|=4096,i)}function vp(t,i,o){t.lanes|=i;var l=t.alternate;l!==null&&(l.lanes|=i),rc(t.return,i,o)}function Cc(t,i,o,l,d){var p=t.memoizedState;p===null?t.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:l,tail:o,tailMode:d}:(p.isBackwards=i,p.rendering=null,p.renderingStartTime=0,p.last=l,p.tail=o,p.tailMode=d)}function xp(t,i,o){var l=i.pendingProps,d=l.revealOrder,p=l.tail;if(kn(t,i,l.children,o),l=Zt.current,(l&2)!==0)l=l&1|2,i.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=i.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&vp(t,o,i);else if(t.tag===19)vp(t,o,i);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===i)break e;for(;t.sibling===null;){if(t.return===null||t.return===i)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}l&=1}if(Xt(Zt,l),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(o=i.child,d=null;o!==null;)t=o.alternate,t!==null&&ul(t)===null&&(d=o),o=o.sibling;o=d,o===null?(d=i.child,i.child=null):(d=o.sibling,o.sibling=null),Cc(i,!1,d,o,p);break;case"backwards":for(o=null,d=i.child,i.child=null;d!==null;){if(t=d.alternate,t!==null&&ul(t)===null){i.child=d;break}t=d.sibling,d.sibling=o,o=d,d=t}Cc(i,!0,o,null,p);break;case"together":Cc(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function _l(t,i){(i.mode&1)===0&&t!==null&&(t.alternate=null,i.alternate=null,i.flags|=2)}function pr(t,i,o){if(t!==null&&(i.dependencies=t.dependencies),_s|=i.lanes,(o&i.childLanes)===0)return null;if(t!==null&&i.child!==t.child)throw Error(n(153));if(i.child!==null){for(t=i.child,o=$r(t,t.pendingProps),i.child=o,o.return=i;t.sibling!==null;)t=t.sibling,o=o.sibling=$r(t,t.pendingProps),o.return=i;o.sibling=null}return i.child}function Q0(t,i,o){switch(i.tag){case 3:mp(i),Qs();break;case 5:Uh(i);break;case 1:Xn(i.type)&&Ja(i);break;case 4:ac(i,i.stateNode.containerInfo);break;case 10:var l=i.type._context,d=i.memoizedProps.value;Xt(sl,l._currentValue),l._currentValue=d;break;case 13:if(l=i.memoizedState,l!==null)return l.dehydrated!==null?(Xt(Zt,Zt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?_p(t,i,o):(Xt(Zt,Zt.current&1),t=pr(t,i,o),t!==null?t.sibling:null);Xt(Zt,Zt.current&1);break;case 19:if(l=(o&i.childLanes)!==0,(t.flags&128)!==0){if(l)return xp(t,i,o);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Xt(Zt,Zt.current),l)break;return null;case 22:case 23:return i.lanes=0,dp(t,i,o)}return pr(t,i,o)}var yp,bc,Sp,Mp;yp=function(t,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)t.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},bc=function(){},Sp=function(t,i,o,l){var d=t.memoizedProps;if(d!==l){t=i.stateNode,ms(Xi.current);var p=null;switch(o){case"input":d=z(t,d),l=z(t,l),p=[];break;case"select":d=ee({},d,{value:void 0}),l=ee({},l,{value:void 0}),p=[];break;case"textarea":d=w(t,d),l=w(t,l),p=[];break;default:typeof d.onClick!="function"&&typeof l.onClick=="function"&&(t.onclick=Ka)}xt(o,l);var M;o=null;for(le in d)if(!l.hasOwnProperty(le)&&d.hasOwnProperty(le)&&d[le]!=null)if(le==="style"){var N=d[le];for(M in N)N.hasOwnProperty(M)&&(o||(o={}),o[M]="")}else le!=="dangerouslySetInnerHTML"&&le!=="children"&&le!=="suppressContentEditableWarning"&&le!=="suppressHydrationWarning"&&le!=="autoFocus"&&(a.hasOwnProperty(le)?p||(p=[]):(p=p||[]).push(le,null));for(le in l){var V=l[le];if(N=d!=null?d[le]:void 0,l.hasOwnProperty(le)&&V!==N&&(V!=null||N!=null))if(le==="style")if(N){for(M in N)!N.hasOwnProperty(M)||V&&V.hasOwnProperty(M)||(o||(o={}),o[M]="");for(M in V)V.hasOwnProperty(M)&&N[M]!==V[M]&&(o||(o={}),o[M]=V[M])}else o||(p||(p=[]),p.push(le,o)),o=V;else le==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,N=N?N.__html:void 0,V!=null&&N!==V&&(p=p||[]).push(le,V)):le==="children"?typeof V!="string"&&typeof V!="number"||(p=p||[]).push(le,""+V):le!=="suppressContentEditableWarning"&&le!=="suppressHydrationWarning"&&(a.hasOwnProperty(le)?(V!=null&&le==="onScroll"&&Yt("scroll",t),p||N===V||(p=[])):(p=p||[]).push(le,V))}o&&(p=p||[]).push("style",o);var le=p;(i.updateQueue=le)&&(i.flags|=4)}},Mp=function(t,i,o,l){o!==l&&(i.flags|=4)};function va(t,i){if(!$t)switch(t.tailMode){case"hidden":i=t.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?t.tail=null:o.sibling=null;break;case"collapsed":o=t.tail;for(var l=null;o!==null;)o.alternate!==null&&(l=o),o=o.sibling;l===null?i||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function Ln(t){var i=t.alternate!==null&&t.alternate.child===t.child,o=0,l=0;if(i)for(var d=t.child;d!==null;)o|=d.lanes|d.childLanes,l|=d.subtreeFlags&14680064,l|=d.flags&14680064,d.return=t,d=d.sibling;else for(d=t.child;d!==null;)o|=d.lanes|d.childLanes,l|=d.subtreeFlags,l|=d.flags,d.return=t,d=d.sibling;return t.subtreeFlags|=l,t.childLanes=o,i}function J0(t,i,o){var l=i.pendingProps;switch(Zu(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ln(i),null;case 1:return Xn(i.type)&&Qa(),Ln(i),null;case 3:return l=i.stateNode,no(),qt(Wn),qt(bn),cc(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(il(i)?i.flags|=4:t===null||t.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Pi!==null&&(zc(Pi),Pi=null))),bc(t,i),Ln(i),null;case 5:lc(i);var d=ms(ha.current);if(o=i.type,t!==null&&i.stateNode!=null)Sp(t,i,o,l,d),t.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!l){if(i.stateNode===null)throw Error(n(166));return Ln(i),null}if(t=ms(Xi.current),il(i)){l=i.stateNode,o=i.type;var p=i.memoizedProps;switch(l[Wi]=i,l[la]=p,t=(i.mode&1)!==0,o){case"dialog":Yt("cancel",l),Yt("close",l);break;case"iframe":case"object":case"embed":Yt("load",l);break;case"video":case"audio":for(d=0;d<sa.length;d++)Yt(sa[d],l);break;case"source":Yt("error",l);break;case"img":case"image":case"link":Yt("error",l),Yt("load",l);break;case"details":Yt("toggle",l);break;case"input":Ct(l,p),Yt("invalid",l);break;case"select":l._wrapperState={wasMultiple:!!p.multiple},Yt("invalid",l);break;case"textarea":te(l,p),Yt("invalid",l)}xt(o,p),d=null;for(var M in p)if(p.hasOwnProperty(M)){var N=p[M];M==="children"?typeof N=="string"?l.textContent!==N&&(p.suppressHydrationWarning!==!0&&$a(l.textContent,N,t),d=["children",N]):typeof N=="number"&&l.textContent!==""+N&&(p.suppressHydrationWarning!==!0&&$a(l.textContent,N,t),d=["children",""+N]):a.hasOwnProperty(M)&&N!=null&&M==="onScroll"&&Yt("scroll",l)}switch(o){case"input":pt(l),Ye(l,p,!0);break;case"textarea":pt(l),xe(l);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(l.onclick=Ka)}l=d,i.updateQueue=l,l!==null&&(i.flags|=4)}else{M=d.nodeType===9?d:d.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=ge(o)),t==="http://www.w3.org/1999/xhtml"?o==="script"?(t=M.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof l.is=="string"?t=M.createElement(o,{is:l.is}):(t=M.createElement(o),o==="select"&&(M=t,l.multiple?M.multiple=!0:l.size&&(M.size=l.size))):t=M.createElementNS(t,o),t[Wi]=i,t[la]=l,yp(t,i,!1,!1),i.stateNode=t;e:{switch(M=it(o,l),o){case"dialog":Yt("cancel",t),Yt("close",t),d=l;break;case"iframe":case"object":case"embed":Yt("load",t),d=l;break;case"video":case"audio":for(d=0;d<sa.length;d++)Yt(sa[d],t);d=l;break;case"source":Yt("error",t),d=l;break;case"img":case"image":case"link":Yt("error",t),Yt("load",t),d=l;break;case"details":Yt("toggle",t),d=l;break;case"input":Ct(t,l),d=z(t,l),Yt("invalid",t);break;case"option":d=l;break;case"select":t._wrapperState={wasMultiple:!!l.multiple},d=ee({},l,{value:void 0}),Yt("invalid",t);break;case"textarea":te(t,l),d=w(t,l),Yt("invalid",t);break;default:d=l}xt(o,d),N=d;for(p in N)if(N.hasOwnProperty(p)){var V=N[p];p==="style"?st(t,V):p==="dangerouslySetInnerHTML"?(V=V?V.__html:void 0,V!=null&&He(t,V)):p==="children"?typeof V=="string"?(o!=="textarea"||V!=="")&&gt(t,V):typeof V=="number"&&gt(t,""+V):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(a.hasOwnProperty(p)?V!=null&&p==="onScroll"&&Yt("scroll",t):V!=null&&I(t,p,V,M))}switch(o){case"input":pt(t),Ye(t,l,!1);break;case"textarea":pt(t),xe(t);break;case"option":l.value!=null&&t.setAttribute("value",""+Re(l.value));break;case"select":t.multiple=!!l.multiple,p=l.value,p!=null?U(t,!!l.multiple,p,!1):l.defaultValue!=null&&U(t,!!l.multiple,l.defaultValue,!0);break;default:typeof d.onClick=="function"&&(t.onclick=Ka)}switch(o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}}l&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Ln(i),null;case 6:if(t&&i.stateNode!=null)Mp(t,i,t.memoizedProps,l);else{if(typeof l!="string"&&i.stateNode===null)throw Error(n(166));if(o=ms(ha.current),ms(Xi.current),il(i)){if(l=i.stateNode,o=i.memoizedProps,l[Wi]=i,(p=l.nodeValue!==o)&&(t=ri,t!==null))switch(t.tag){case 3:$a(l.nodeValue,o,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&$a(l.nodeValue,o,(t.mode&1)!==0)}p&&(i.flags|=4)}else l=(o.nodeType===9?o:o.ownerDocument).createTextNode(l),l[Wi]=i,i.stateNode=l}return Ln(i),null;case 13:if(qt(Zt),l=i.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if($t&&si!==null&&(i.mode&1)!==0&&(i.flags&128)===0)wh(),Qs(),i.flags|=98560,p=!1;else if(p=il(i),l!==null&&l.dehydrated!==null){if(t===null){if(!p)throw Error(n(318));if(p=i.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(n(317));p[Wi]=i}else Qs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Ln(i),p=!1}else Pi!==null&&(zc(Pi),Pi=null),p=!0;if(!p)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(l=l!==null,l!==(t!==null&&t.memoizedState!==null)&&l&&(i.child.flags|=8192,(i.mode&1)!==0&&(t===null||(Zt.current&1)!==0?pn===0&&(pn=3):Gc())),i.updateQueue!==null&&(i.flags|=4),Ln(i),null);case 4:return no(),bc(t,i),t===null&&oa(i.stateNode.containerInfo),Ln(i),null;case 10:return ic(i.type._context),Ln(i),null;case 17:return Xn(i.type)&&Qa(),Ln(i),null;case 19:if(qt(Zt),p=i.memoizedState,p===null)return Ln(i),null;if(l=(i.flags&128)!==0,M=p.rendering,M===null)if(l)va(p,!1);else{if(pn!==0||t!==null&&(t.flags&128)!==0)for(t=i.child;t!==null;){if(M=ul(t),M!==null){for(i.flags|=128,va(p,!1),l=M.updateQueue,l!==null&&(i.updateQueue=l,i.flags|=4),i.subtreeFlags=0,l=o,o=i.child;o!==null;)p=o,t=l,p.flags&=14680066,M=p.alternate,M===null?(p.childLanes=0,p.lanes=t,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=M.childLanes,p.lanes=M.lanes,p.child=M.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=M.memoizedProps,p.memoizedState=M.memoizedState,p.updateQueue=M.updateQueue,p.type=M.type,t=M.dependencies,p.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),o=o.sibling;return Xt(Zt,Zt.current&1|2),i.child}t=t.sibling}p.tail!==null&&K()>oo&&(i.flags|=128,l=!0,va(p,!1),i.lanes=4194304)}else{if(!l)if(t=ul(M),t!==null){if(i.flags|=128,l=!0,o=t.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),va(p,!0),p.tail===null&&p.tailMode==="hidden"&&!M.alternate&&!$t)return Ln(i),null}else 2*K()-p.renderingStartTime>oo&&o!==1073741824&&(i.flags|=128,l=!0,va(p,!1),i.lanes=4194304);p.isBackwards?(M.sibling=i.child,i.child=M):(o=p.last,o!==null?o.sibling=M:i.child=M,p.last=M)}return p.tail!==null?(i=p.tail,p.rendering=i,p.tail=i.sibling,p.renderingStartTime=K(),i.sibling=null,o=Zt.current,Xt(Zt,l?o&1|2:o&1),i):(Ln(i),null);case 22:case 23:return Vc(),l=i.memoizedState!==null,t!==null&&t.memoizedState!==null!==l&&(i.flags|=8192),l&&(i.mode&1)!==0?(oi&1073741824)!==0&&(Ln(i),i.subtreeFlags&6&&(i.flags|=8192)):Ln(i),null;case 24:return null;case 25:return null}throw Error(n(156,i.tag))}function e_(t,i){switch(Zu(i),i.tag){case 1:return Xn(i.type)&&Qa(),t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 3:return no(),qt(Wn),qt(bn),cc(),t=i.flags,(t&65536)!==0&&(t&128)===0?(i.flags=t&-65537|128,i):null;case 5:return lc(i),null;case 13:if(qt(Zt),t=i.memoizedState,t!==null&&t.dehydrated!==null){if(i.alternate===null)throw Error(n(340));Qs()}return t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 19:return qt(Zt),null;case 4:return no(),null;case 10:return ic(i.type._context),null;case 22:case 23:return Vc(),null;case 24:return null;default:return null}}var vl=!1,Dn=!1,t_=typeof WeakSet=="function"?WeakSet:Set,Xe=null;function ro(t,i){var o=t.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(l){on(t,i,l)}else o.current=null}function Pc(t,i,o){try{o()}catch(l){on(t,i,l)}}var Ep=!1;function n_(t,i){if(Vu=or,t=th(),Iu(t)){if("selectionStart"in t)var o={start:t.selectionStart,end:t.selectionEnd};else e:{o=(o=t.ownerDocument)&&o.defaultView||window;var l=o.getSelection&&o.getSelection();if(l&&l.rangeCount!==0){o=l.anchorNode;var d=l.anchorOffset,p=l.focusNode;l=l.focusOffset;try{o.nodeType,p.nodeType}catch{o=null;break e}var M=0,N=-1,V=-1,le=0,Me=0,Ae=t,ye=null;t:for(;;){for(var Be;Ae!==o||d!==0&&Ae.nodeType!==3||(N=M+d),Ae!==p||l!==0&&Ae.nodeType!==3||(V=M+l),Ae.nodeType===3&&(M+=Ae.nodeValue.length),(Be=Ae.firstChild)!==null;)ye=Ae,Ae=Be;for(;;){if(Ae===t)break t;if(ye===o&&++le===d&&(N=M),ye===p&&++Me===l&&(V=M),(Be=Ae.nextSibling)!==null)break;Ae=ye,ye=Ae.parentNode}Ae=Be}o=N===-1||V===-1?null:{start:N,end:V}}else o=null}o=o||{start:0,end:0}}else o=null;for(Gu={focusedElem:t,selectionRange:o},or=!1,Xe=i;Xe!==null;)if(i=Xe,t=i.child,(i.subtreeFlags&1028)!==0&&t!==null)t.return=i,Xe=t;else for(;Xe!==null;){i=Xe;try{var qe=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(qe!==null){var Ke=qe.memoizedProps,ln=qe.memoizedState,Q=i.stateNode,G=Q.getSnapshotBeforeUpdate(i.elementType===i.type?Ke:Li(i.type,Ke),ln);Q.__reactInternalSnapshotBeforeUpdate=G}break;case 3:var re=i.stateNode.containerInfo;re.nodeType===1?re.textContent="":re.nodeType===9&&re.documentElement&&re.removeChild(re.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(n(163))}}catch(be){on(i,i.return,be)}if(t=i.sibling,t!==null){t.return=i.return,Xe=t;break}Xe=i.return}return qe=Ep,Ep=!1,qe}function xa(t,i,o){var l=i.updateQueue;if(l=l!==null?l.lastEffect:null,l!==null){var d=l=l.next;do{if((d.tag&t)===t){var p=d.destroy;d.destroy=void 0,p!==void 0&&Pc(i,o,p)}d=d.next}while(d!==l)}}function xl(t,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&t)===t){var l=o.create;o.destroy=l()}o=o.next}while(o!==i)}}function Lc(t){var i=t.ref;if(i!==null){var o=t.stateNode;switch(t.tag){case 5:t=o;break;default:t=o}typeof i=="function"?i(t):i.current=t}}function Tp(t){var i=t.alternate;i!==null&&(t.alternate=null,Tp(i)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(i=t.stateNode,i!==null&&(delete i[Wi],delete i[la],delete i[Yu],delete i[k0],delete i[B0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function wp(t){return t.tag===5||t.tag===3||t.tag===4}function Ap(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||wp(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Dc(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(t,i):o.insertBefore(t,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(t,o)):(i=o,i.appendChild(t)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=Ka));else if(l!==4&&(t=t.child,t!==null))for(Dc(t,i,o),t=t.sibling;t!==null;)Dc(t,i,o),t=t.sibling}function Uc(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.insertBefore(t,i):o.appendChild(t);else if(l!==4&&(t=t.child,t!==null))for(Uc(t,i,o),t=t.sibling;t!==null;)Uc(t,i,o),t=t.sibling}var An=null,Di=!1;function Wr(t,i,o){for(o=o.child;o!==null;)Rp(t,i,o),o=o.sibling}function Rp(t,i,o){if(je&&typeof je.onCommitFiberUnmount=="function")try{je.onCommitFiberUnmount(Je,o)}catch{}switch(o.tag){case 5:Dn||ro(o,i);case 6:var l=An,d=Di;An=null,Wr(t,i,o),An=l,Di=d,An!==null&&(Di?(t=An,o=o.stateNode,t.nodeType===8?t.parentNode.removeChild(o):t.removeChild(o)):An.removeChild(o.stateNode));break;case 18:An!==null&&(Di?(t=An,o=o.stateNode,t.nodeType===8?ju(t.parentNode,o):t.nodeType===1&&ju(t,o),Nr(t)):ju(An,o.stateNode));break;case 4:l=An,d=Di,An=o.stateNode.containerInfo,Di=!0,Wr(t,i,o),An=l,Di=d;break;case 0:case 11:case 14:case 15:if(!Dn&&(l=o.updateQueue,l!==null&&(l=l.lastEffect,l!==null))){d=l=l.next;do{var p=d,M=p.destroy;p=p.tag,M!==void 0&&((p&2)!==0||(p&4)!==0)&&Pc(o,i,M),d=d.next}while(d!==l)}Wr(t,i,o);break;case 1:if(!Dn&&(ro(o,i),l=o.stateNode,typeof l.componentWillUnmount=="function"))try{l.props=o.memoizedProps,l.state=o.memoizedState,l.componentWillUnmount()}catch(N){on(o,i,N)}Wr(t,i,o);break;case 21:Wr(t,i,o);break;case 22:o.mode&1?(Dn=(l=Dn)||o.memoizedState!==null,Wr(t,i,o),Dn=l):Wr(t,i,o);break;default:Wr(t,i,o)}}function Cp(t){var i=t.updateQueue;if(i!==null){t.updateQueue=null;var o=t.stateNode;o===null&&(o=t.stateNode=new t_),i.forEach(function(l){var d=f_.bind(null,t,l);o.has(l)||(o.add(l),l.then(d,d))})}}function Ui(t,i){var o=i.deletions;if(o!==null)for(var l=0;l<o.length;l++){var d=o[l];try{var p=t,M=i,N=M;e:for(;N!==null;){switch(N.tag){case 5:An=N.stateNode,Di=!1;break e;case 3:An=N.stateNode.containerInfo,Di=!0;break e;case 4:An=N.stateNode.containerInfo,Di=!0;break e}N=N.return}if(An===null)throw Error(n(160));Rp(p,M,d),An=null,Di=!1;var V=d.alternate;V!==null&&(V.return=null),d.return=null}catch(le){on(d,i,le)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)bp(i,t),i=i.sibling}function bp(t,i){var o=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Ui(i,t),Yi(t),l&4){try{xa(3,t,t.return),xl(3,t)}catch(Ke){on(t,t.return,Ke)}try{xa(5,t,t.return)}catch(Ke){on(t,t.return,Ke)}}break;case 1:Ui(i,t),Yi(t),l&512&&o!==null&&ro(o,o.return);break;case 5:if(Ui(i,t),Yi(t),l&512&&o!==null&&ro(o,o.return),t.flags&32){var d=t.stateNode;try{gt(d,"")}catch(Ke){on(t,t.return,Ke)}}if(l&4&&(d=t.stateNode,d!=null)){var p=t.memoizedProps,M=o!==null?o.memoizedProps:p,N=t.type,V=t.updateQueue;if(t.updateQueue=null,V!==null)try{N==="input"&&p.type==="radio"&&p.name!=null&&mt(d,p),it(N,M);var le=it(N,p);for(M=0;M<V.length;M+=2){var Me=V[M],Ae=V[M+1];Me==="style"?st(d,Ae):Me==="dangerouslySetInnerHTML"?He(d,Ae):Me==="children"?gt(d,Ae):I(d,Me,Ae,le)}switch(N){case"input":ct(d,p);break;case"textarea":ve(d,p);break;case"select":var ye=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!p.multiple;var Be=p.value;Be!=null?U(d,!!p.multiple,Be,!1):ye!==!!p.multiple&&(p.defaultValue!=null?U(d,!!p.multiple,p.defaultValue,!0):U(d,!!p.multiple,p.multiple?[]:"",!1))}d[la]=p}catch(Ke){on(t,t.return,Ke)}}break;case 6:if(Ui(i,t),Yi(t),l&4){if(t.stateNode===null)throw Error(n(162));d=t.stateNode,p=t.memoizedProps;try{d.nodeValue=p}catch(Ke){on(t,t.return,Ke)}}break;case 3:if(Ui(i,t),Yi(t),l&4&&o!==null&&o.memoizedState.isDehydrated)try{Nr(i.containerInfo)}catch(Ke){on(t,t.return,Ke)}break;case 4:Ui(i,t),Yi(t);break;case 13:Ui(i,t),Yi(t),d=t.child,d.flags&8192&&(p=d.memoizedState!==null,d.stateNode.isHidden=p,!p||d.alternate!==null&&d.alternate.memoizedState!==null||(Fc=K())),l&4&&Cp(t);break;case 22:if(Me=o!==null&&o.memoizedState!==null,t.mode&1?(Dn=(le=Dn)||Me,Ui(i,t),Dn=le):Ui(i,t),Yi(t),l&8192){if(le=t.memoizedState!==null,(t.stateNode.isHidden=le)&&!Me&&(t.mode&1)!==0)for(Xe=t,Me=t.child;Me!==null;){for(Ae=Xe=Me;Xe!==null;){switch(ye=Xe,Be=ye.child,ye.tag){case 0:case 11:case 14:case 15:xa(4,ye,ye.return);break;case 1:ro(ye,ye.return);var qe=ye.stateNode;if(typeof qe.componentWillUnmount=="function"){l=ye,o=ye.return;try{i=l,qe.props=i.memoizedProps,qe.state=i.memoizedState,qe.componentWillUnmount()}catch(Ke){on(l,o,Ke)}}break;case 5:ro(ye,ye.return);break;case 22:if(ye.memoizedState!==null){Dp(Ae);continue}}Be!==null?(Be.return=ye,Xe=Be):Dp(Ae)}Me=Me.sibling}e:for(Me=null,Ae=t;;){if(Ae.tag===5){if(Me===null){Me=Ae;try{d=Ae.stateNode,le?(p=d.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(N=Ae.stateNode,V=Ae.memoizedProps.style,M=V!=null&&V.hasOwnProperty("display")?V.display:null,N.style.display=et("display",M))}catch(Ke){on(t,t.return,Ke)}}}else if(Ae.tag===6){if(Me===null)try{Ae.stateNode.nodeValue=le?"":Ae.memoizedProps}catch(Ke){on(t,t.return,Ke)}}else if((Ae.tag!==22&&Ae.tag!==23||Ae.memoizedState===null||Ae===t)&&Ae.child!==null){Ae.child.return=Ae,Ae=Ae.child;continue}if(Ae===t)break e;for(;Ae.sibling===null;){if(Ae.return===null||Ae.return===t)break e;Me===Ae&&(Me=null),Ae=Ae.return}Me===Ae&&(Me=null),Ae.sibling.return=Ae.return,Ae=Ae.sibling}}break;case 19:Ui(i,t),Yi(t),l&4&&Cp(t);break;case 21:break;default:Ui(i,t),Yi(t)}}function Yi(t){var i=t.flags;if(i&2){try{e:{for(var o=t.return;o!==null;){if(wp(o)){var l=o;break e}o=o.return}throw Error(n(160))}switch(l.tag){case 5:var d=l.stateNode;l.flags&32&&(gt(d,""),l.flags&=-33);var p=Ap(t);Uc(t,p,d);break;case 3:case 4:var M=l.stateNode.containerInfo,N=Ap(t);Dc(t,N,M);break;default:throw Error(n(161))}}catch(V){on(t,t.return,V)}t.flags&=-3}i&4096&&(t.flags&=-4097)}function i_(t,i,o){Xe=t,Pp(t)}function Pp(t,i,o){for(var l=(t.mode&1)!==0;Xe!==null;){var d=Xe,p=d.child;if(d.tag===22&&l){var M=d.memoizedState!==null||vl;if(!M){var N=d.alternate,V=N!==null&&N.memoizedState!==null||Dn;N=vl;var le=Dn;if(vl=M,(Dn=V)&&!le)for(Xe=d;Xe!==null;)M=Xe,V=M.child,M.tag===22&&M.memoizedState!==null?Up(d):V!==null?(V.return=M,Xe=V):Up(d);for(;p!==null;)Xe=p,Pp(p),p=p.sibling;Xe=d,vl=N,Dn=le}Lp(t)}else(d.subtreeFlags&8772)!==0&&p!==null?(p.return=d,Xe=p):Lp(t)}}function Lp(t){for(;Xe!==null;){var i=Xe;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:Dn||xl(5,i);break;case 1:var l=i.stateNode;if(i.flags&4&&!Dn)if(o===null)l.componentDidMount();else{var d=i.elementType===i.type?o.memoizedProps:Li(i.type,o.memoizedProps);l.componentDidUpdate(d,o.memoizedState,l.__reactInternalSnapshotBeforeUpdate)}var p=i.updateQueue;p!==null&&Dh(i,p,l);break;case 3:var M=i.updateQueue;if(M!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Dh(i,M,o)}break;case 5:var N=i.stateNode;if(o===null&&i.flags&4){o=N;var V=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":V.autoFocus&&o.focus();break;case"img":V.src&&(o.src=V.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var le=i.alternate;if(le!==null){var Me=le.memoizedState;if(Me!==null){var Ae=Me.dehydrated;Ae!==null&&Nr(Ae)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(n(163))}Dn||i.flags&512&&Lc(i)}catch(ye){on(i,i.return,ye)}}if(i===t){Xe=null;break}if(o=i.sibling,o!==null){o.return=i.return,Xe=o;break}Xe=i.return}}function Dp(t){for(;Xe!==null;){var i=Xe;if(i===t){Xe=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Xe=o;break}Xe=i.return}}function Up(t){for(;Xe!==null;){var i=Xe;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{xl(4,i)}catch(V){on(i,o,V)}break;case 1:var l=i.stateNode;if(typeof l.componentDidMount=="function"){var d=i.return;try{l.componentDidMount()}catch(V){on(i,d,V)}}var p=i.return;try{Lc(i)}catch(V){on(i,p,V)}break;case 5:var M=i.return;try{Lc(i)}catch(V){on(i,M,V)}}}catch(V){on(i,i.return,V)}if(i===t){Xe=null;break}var N=i.sibling;if(N!==null){N.return=i.return,Xe=N;break}Xe=i.return}}var r_=Math.ceil,yl=b.ReactCurrentDispatcher,Ic=b.ReactCurrentOwner,vi=b.ReactCurrentBatchConfig,Ut=0,yn=null,fn=null,Rn=0,oi=0,so=Br(0),pn=0,ya=null,_s=0,Sl=0,Nc=0,Sa=null,Yn=null,Fc=0,oo=1/0,mr=null,Ml=!1,Oc=null,Xr=null,El=!1,jr=null,Tl=0,Ma=0,kc=null,wl=-1,Al=0;function Bn(){return(Ut&6)!==0?K():wl!==-1?wl:wl=K()}function Yr(t){return(t.mode&1)===0?1:(Ut&2)!==0&&Rn!==0?Rn&-Rn:H0.transition!==null?(Al===0&&(Al=lt()),Al):(t=ht,t!==0||(t=window.event,t=t===void 0?16:Bt(t.type)),t)}function Ii(t,i,o,l){if(50<Ma)throw Ma=0,kc=null,Error(n(185));dt(t,o,l),((Ut&2)===0||t!==yn)&&(t===yn&&((Ut&2)===0&&(Sl|=o),pn===4&&qr(t,Rn)),qn(t,l),o===1&&Ut===0&&(i.mode&1)===0&&(oo=K()+500,el&&Hr()))}function qn(t,i){var o=t.callbackNode;nn(t,i);var l=Nt(t,t===yn?Rn:0);if(l===0)o!==null&&A(o),t.callbackNode=null,t.callbackPriority=0;else if(i=l&-l,t.callbackPriority!==i){if(o!=null&&A(o),i===1)t.tag===0?z0(Np.bind(null,t)):yh(Np.bind(null,t)),F0(function(){(Ut&6)===0&&Hr()}),o=null;else{switch(vn(l)){case 1:o=Ee;break;case 4:o=Ue;break;case 16:o=ke;break;case 536870912:o=rt;break;default:o=ke}o=Gp(o,Ip.bind(null,t))}t.callbackPriority=i,t.callbackNode=o}}function Ip(t,i){if(wl=-1,Al=0,(Ut&6)!==0)throw Error(n(327));var o=t.callbackNode;if(ao()&&t.callbackNode!==o)return null;var l=Nt(t,t===yn?Rn:0);if(l===0)return null;if((l&30)!==0||(l&t.expiredLanes)!==0||i)i=Rl(t,l);else{i=l;var d=Ut;Ut|=2;var p=Op();(yn!==t||Rn!==i)&&(mr=null,oo=K()+500,xs(t,i));do try{a_();break}catch(N){Fp(t,N)}while(!0);nc(),yl.current=p,Ut=d,fn!==null?i=0:(yn=null,Rn=0,i=pn)}if(i!==0){if(i===2&&(d=Ft(t),d!==0&&(l=d,i=Bc(t,d))),i===1)throw o=ya,xs(t,0),qr(t,l),qn(t,K()),o;if(i===6)qr(t,l);else{if(d=t.current.alternate,(l&30)===0&&!s_(d)&&(i=Rl(t,l),i===2&&(p=Ft(t),p!==0&&(l=p,i=Bc(t,p))),i===1))throw o=ya,xs(t,0),qr(t,l),qn(t,K()),o;switch(t.finishedWork=d,t.finishedLanes=l,i){case 0:case 1:throw Error(n(345));case 2:ys(t,Yn,mr);break;case 3:if(qr(t,l),(l&130023424)===l&&(i=Fc+500-K(),10<i)){if(Nt(t,0)!==0)break;if(d=t.suspendedLanes,(d&l)!==l){Bn(),t.pingedLanes|=t.suspendedLanes&d;break}t.timeoutHandle=Xu(ys.bind(null,t,Yn,mr),i);break}ys(t,Yn,mr);break;case 4:if(qr(t,l),(l&4194240)===l)break;for(i=t.eventTimes,d=-1;0<l;){var M=31-ft(l);p=1<<M,M=i[M],M>d&&(d=M),l&=~p}if(l=d,l=K()-l,l=(120>l?120:480>l?480:1080>l?1080:1920>l?1920:3e3>l?3e3:4320>l?4320:1960*r_(l/1960))-l,10<l){t.timeoutHandle=Xu(ys.bind(null,t,Yn,mr),l);break}ys(t,Yn,mr);break;case 5:ys(t,Yn,mr);break;default:throw Error(n(329))}}}return qn(t,K()),t.callbackNode===o?Ip.bind(null,t):null}function Bc(t,i){var o=Sa;return t.current.memoizedState.isDehydrated&&(xs(t,i).flags|=256),t=Rl(t,i),t!==2&&(i=Yn,Yn=o,i!==null&&zc(i)),t}function zc(t){Yn===null?Yn=t:Yn.push.apply(Yn,t)}function s_(t){for(var i=t;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var l=0;l<o.length;l++){var d=o[l],p=d.getSnapshot;d=d.value;try{if(!bi(p(),d))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function qr(t,i){for(i&=~Nc,i&=~Sl,t.suspendedLanes|=i,t.pingedLanes&=~i,t=t.expirationTimes;0<i;){var o=31-ft(i),l=1<<o;t[o]=-1,i&=~l}}function Np(t){if((Ut&6)!==0)throw Error(n(327));ao();var i=Nt(t,0);if((i&1)===0)return qn(t,K()),null;var o=Rl(t,i);if(t.tag!==0&&o===2){var l=Ft(t);l!==0&&(i=l,o=Bc(t,l))}if(o===1)throw o=ya,xs(t,0),qr(t,i),qn(t,K()),o;if(o===6)throw Error(n(345));return t.finishedWork=t.current.alternate,t.finishedLanes=i,ys(t,Yn,mr),qn(t,K()),null}function Hc(t,i){var o=Ut;Ut|=1;try{return t(i)}finally{Ut=o,Ut===0&&(oo=K()+500,el&&Hr())}}function vs(t){jr!==null&&jr.tag===0&&(Ut&6)===0&&ao();var i=Ut;Ut|=1;var o=vi.transition,l=ht;try{if(vi.transition=null,ht=1,t)return t()}finally{ht=l,vi.transition=o,Ut=i,(Ut&6)===0&&Hr()}}function Vc(){oi=so.current,qt(so)}function xs(t,i){t.finishedWork=null,t.finishedLanes=0;var o=t.timeoutHandle;if(o!==-1&&(t.timeoutHandle=-1,N0(o)),fn!==null)for(o=fn.return;o!==null;){var l=o;switch(Zu(l),l.tag){case 1:l=l.type.childContextTypes,l!=null&&Qa();break;case 3:no(),qt(Wn),qt(bn),cc();break;case 5:lc(l);break;case 4:no();break;case 13:qt(Zt);break;case 19:qt(Zt);break;case 10:ic(l.type._context);break;case 22:case 23:Vc()}o=o.return}if(yn=t,fn=t=$r(t.current,null),Rn=oi=i,pn=0,ya=null,Nc=Sl=_s=0,Yn=Sa=null,ps!==null){for(i=0;i<ps.length;i++)if(o=ps[i],l=o.interleaved,l!==null){o.interleaved=null;var d=l.next,p=o.pending;if(p!==null){var M=p.next;p.next=d,l.next=M}o.pending=l}ps=null}return t}function Fp(t,i){do{var o=fn;try{if(nc(),cl.current=pl,fl){for(var l=Qt.memoizedState;l!==null;){var d=l.queue;d!==null&&(d.pending=null),l=l.next}fl=!1}if(gs=0,xn=hn=Qt=null,pa=!1,ma=0,Ic.current=null,o===null||o.return===null){pn=1,ya=i,fn=null;break}e:{var p=t,M=o.return,N=o,V=i;if(i=Rn,N.flags|=32768,V!==null&&typeof V=="object"&&typeof V.then=="function"){var le=V,Me=N,Ae=Me.tag;if((Me.mode&1)===0&&(Ae===0||Ae===11||Ae===15)){var ye=Me.alternate;ye?(Me.updateQueue=ye.updateQueue,Me.memoizedState=ye.memoizedState,Me.lanes=ye.lanes):(Me.updateQueue=null,Me.memoizedState=null)}var Be=ap(M);if(Be!==null){Be.flags&=-257,lp(Be,M,N,p,i),Be.mode&1&&op(p,le,i),i=Be,V=le;var qe=i.updateQueue;if(qe===null){var Ke=new Set;Ke.add(V),i.updateQueue=Ke}else qe.add(V);break e}else{if((i&1)===0){op(p,le,i),Gc();break e}V=Error(n(426))}}else if($t&&N.mode&1){var ln=ap(M);if(ln!==null){(ln.flags&65536)===0&&(ln.flags|=256),lp(ln,M,N,p,i),ec(io(V,N));break e}}p=V=io(V,N),pn!==4&&(pn=2),Sa===null?Sa=[p]:Sa.push(p),p=M;do{switch(p.tag){case 3:p.flags|=65536,i&=-i,p.lanes|=i;var Q=rp(p,V,i);Lh(p,Q);break e;case 1:N=V;var G=p.type,re=p.stateNode;if((p.flags&128)===0&&(typeof G.getDerivedStateFromError=="function"||re!==null&&typeof re.componentDidCatch=="function"&&(Xr===null||!Xr.has(re)))){p.flags|=65536,i&=-i,p.lanes|=i;var be=sp(p,N,i);Lh(p,be);break e}}p=p.return}while(p!==null)}Bp(o)}catch(Ze){i=Ze,fn===o&&o!==null&&(fn=o=o.return);continue}break}while(!0)}function Op(){var t=yl.current;return yl.current=pl,t===null?pl:t}function Gc(){(pn===0||pn===3||pn===2)&&(pn=4),yn===null||(_s&268435455)===0&&(Sl&268435455)===0||qr(yn,Rn)}function Rl(t,i){var o=Ut;Ut|=2;var l=Op();(yn!==t||Rn!==i)&&(mr=null,xs(t,i));do try{o_();break}catch(d){Fp(t,d)}while(!0);if(nc(),Ut=o,yl.current=l,fn!==null)throw Error(n(261));return yn=null,Rn=0,pn}function o_(){for(;fn!==null;)kp(fn)}function a_(){for(;fn!==null&&!X();)kp(fn)}function kp(t){var i=Vp(t.alternate,t,oi);t.memoizedProps=t.pendingProps,i===null?Bp(t):fn=i,Ic.current=null}function Bp(t){var i=t;do{var o=i.alternate;if(t=i.return,(i.flags&32768)===0){if(o=J0(o,i,oi),o!==null){fn=o;return}}else{if(o=e_(o,i),o!==null){o.flags&=32767,fn=o;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{pn=6,fn=null;return}}if(i=i.sibling,i!==null){fn=i;return}fn=i=t}while(i!==null);pn===0&&(pn=5)}function ys(t,i,o){var l=ht,d=vi.transition;try{vi.transition=null,ht=1,l_(t,i,o,l)}finally{vi.transition=d,ht=l}return null}function l_(t,i,o,l){do ao();while(jr!==null);if((Ut&6)!==0)throw Error(n(327));o=t.finishedWork;var d=t.finishedLanes;if(o===null)return null;if(t.finishedWork=null,t.finishedLanes=0,o===t.current)throw Error(n(177));t.callbackNode=null,t.callbackPriority=0;var p=o.lanes|o.childLanes;if(rn(t,p),t===yn&&(fn=yn=null,Rn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||El||(El=!0,Gp(ke,function(){return ao(),null})),p=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||p){p=vi.transition,vi.transition=null;var M=ht;ht=1;var N=Ut;Ut|=4,Ic.current=null,n_(t,o),bp(o,t),C0(Gu),or=!!Vu,Gu=Vu=null,t.current=o,i_(o),ie(),Ut=N,ht=M,vi.transition=p}else t.current=o;if(El&&(El=!1,jr=t,Tl=d),p=t.pendingLanes,p===0&&(Xr=null),Et(o.stateNode),qn(t,K()),i!==null)for(l=t.onRecoverableError,o=0;o<i.length;o++)d=i[o],l(d.value,{componentStack:d.stack,digest:d.digest});if(Ml)throw Ml=!1,t=Oc,Oc=null,t;return(Tl&1)!==0&&t.tag!==0&&ao(),p=t.pendingLanes,(p&1)!==0?t===kc?Ma++:(Ma=0,kc=t):Ma=0,Hr(),null}function ao(){if(jr!==null){var t=vn(Tl),i=vi.transition,o=ht;try{if(vi.transition=null,ht=16>t?16:t,jr===null)var l=!1;else{if(t=jr,jr=null,Tl=0,(Ut&6)!==0)throw Error(n(331));var d=Ut;for(Ut|=4,Xe=t.current;Xe!==null;){var p=Xe,M=p.child;if((Xe.flags&16)!==0){var N=p.deletions;if(N!==null){for(var V=0;V<N.length;V++){var le=N[V];for(Xe=le;Xe!==null;){var Me=Xe;switch(Me.tag){case 0:case 11:case 15:xa(8,Me,p)}var Ae=Me.child;if(Ae!==null)Ae.return=Me,Xe=Ae;else for(;Xe!==null;){Me=Xe;var ye=Me.sibling,Be=Me.return;if(Tp(Me),Me===le){Xe=null;break}if(ye!==null){ye.return=Be,Xe=ye;break}Xe=Be}}}var qe=p.alternate;if(qe!==null){var Ke=qe.child;if(Ke!==null){qe.child=null;do{var ln=Ke.sibling;Ke.sibling=null,Ke=ln}while(Ke!==null)}}Xe=p}}if((p.subtreeFlags&2064)!==0&&M!==null)M.return=p,Xe=M;else e:for(;Xe!==null;){if(p=Xe,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:xa(9,p,p.return)}var Q=p.sibling;if(Q!==null){Q.return=p.return,Xe=Q;break e}Xe=p.return}}var G=t.current;for(Xe=G;Xe!==null;){M=Xe;var re=M.child;if((M.subtreeFlags&2064)!==0&&re!==null)re.return=M,Xe=re;else e:for(M=G;Xe!==null;){if(N=Xe,(N.flags&2048)!==0)try{switch(N.tag){case 0:case 11:case 15:xl(9,N)}}catch(Ze){on(N,N.return,Ze)}if(N===M){Xe=null;break e}var be=N.sibling;if(be!==null){be.return=N.return,Xe=be;break e}Xe=N.return}}if(Ut=d,Hr(),je&&typeof je.onPostCommitFiberRoot=="function")try{je.onPostCommitFiberRoot(Je,t)}catch{}l=!0}return l}finally{ht=o,vi.transition=i}}return!1}function zp(t,i,o){i=io(o,i),i=rp(t,i,1),t=Gr(t,i,1),i=Bn(),t!==null&&(dt(t,1,i),qn(t,i))}function on(t,i,o){if(t.tag===3)zp(t,t,o);else for(;i!==null;){if(i.tag===3){zp(i,t,o);break}else if(i.tag===1){var l=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Xr===null||!Xr.has(l))){t=io(o,t),t=sp(i,t,1),i=Gr(i,t,1),t=Bn(),i!==null&&(dt(i,1,t),qn(i,t));break}}i=i.return}}function u_(t,i,o){var l=t.pingCache;l!==null&&l.delete(i),i=Bn(),t.pingedLanes|=t.suspendedLanes&o,yn===t&&(Rn&o)===o&&(pn===4||pn===3&&(Rn&130023424)===Rn&&500>K()-Fc?xs(t,0):Nc|=o),qn(t,i)}function Hp(t,i){i===0&&((t.mode&1)===0?i=1:(i=Te,Te<<=1,(Te&130023424)===0&&(Te=4194304)));var o=Bn();t=dr(t,i),t!==null&&(dt(t,i,o),qn(t,o))}function c_(t){var i=t.memoizedState,o=0;i!==null&&(o=i.retryLane),Hp(t,o)}function f_(t,i){var o=0;switch(t.tag){case 13:var l=t.stateNode,d=t.memoizedState;d!==null&&(o=d.retryLane);break;case 19:l=t.stateNode;break;default:throw Error(n(314))}l!==null&&l.delete(i),Hp(t,o)}var Vp;Vp=function(t,i,o){if(t!==null)if(t.memoizedProps!==i.pendingProps||Wn.current)jn=!0;else{if((t.lanes&o)===0&&(i.flags&128)===0)return jn=!1,Q0(t,i,o);jn=(t.flags&131072)!==0}else jn=!1,$t&&(i.flags&1048576)!==0&&Sh(i,nl,i.index);switch(i.lanes=0,i.tag){case 2:var l=i.type;_l(t,i),t=i.pendingProps;var d=$s(i,bn.current);to(i,o),d=hc(null,i,l,t,d,o);var p=pc();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Xn(l)?(p=!0,Ja(i)):p=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,oc(i),d.updater=ml,i.stateNode=d,d._reactInternals=i,yc(i,l,t,o),i=Tc(null,i,l,!0,p,o)):(i.tag=0,$t&&p&&Ku(i),kn(null,i,d,o),i=i.child),i;case 16:l=i.elementType;e:{switch(_l(t,i),t=i.pendingProps,d=l._init,l=d(l._payload),i.type=l,d=i.tag=h_(l),t=Li(l,t),d){case 0:i=Ec(null,i,l,t,o);break e;case 1:i=pp(null,i,l,t,o);break e;case 11:i=up(null,i,l,t,o);break e;case 14:i=cp(null,i,l,Li(l.type,t),o);break e}throw Error(n(306,l,""))}return i;case 0:return l=i.type,d=i.pendingProps,d=i.elementType===l?d:Li(l,d),Ec(t,i,l,d,o);case 1:return l=i.type,d=i.pendingProps,d=i.elementType===l?d:Li(l,d),pp(t,i,l,d,o);case 3:e:{if(mp(i),t===null)throw Error(n(387));l=i.pendingProps,p=i.memoizedState,d=p.element,Ph(t,i),ll(i,l,null,o);var M=i.memoizedState;if(l=M.element,p.isDehydrated)if(p={element:l,isDehydrated:!1,cache:M.cache,pendingSuspenseBoundaries:M.pendingSuspenseBoundaries,transitions:M.transitions},i.updateQueue.baseState=p,i.memoizedState=p,i.flags&256){d=io(Error(n(423)),i),i=gp(t,i,l,o,d);break e}else if(l!==d){d=io(Error(n(424)),i),i=gp(t,i,l,o,d);break e}else for(si=kr(i.stateNode.containerInfo.firstChild),ri=i,$t=!0,Pi=null,o=Ch(i,null,l,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(Qs(),l===d){i=pr(t,i,o);break e}kn(t,i,l,o)}i=i.child}return i;case 5:return Uh(i),t===null&&Ju(i),l=i.type,d=i.pendingProps,p=t!==null?t.memoizedProps:null,M=d.children,Wu(l,d)?M=null:p!==null&&Wu(l,p)&&(i.flags|=32),hp(t,i),kn(t,i,M,o),i.child;case 6:return t===null&&Ju(i),null;case 13:return _p(t,i,o);case 4:return ac(i,i.stateNode.containerInfo),l=i.pendingProps,t===null?i.child=Js(i,null,l,o):kn(t,i,l,o),i.child;case 11:return l=i.type,d=i.pendingProps,d=i.elementType===l?d:Li(l,d),up(t,i,l,d,o);case 7:return kn(t,i,i.pendingProps,o),i.child;case 8:return kn(t,i,i.pendingProps.children,o),i.child;case 12:return kn(t,i,i.pendingProps.children,o),i.child;case 10:e:{if(l=i.type._context,d=i.pendingProps,p=i.memoizedProps,M=d.value,Xt(sl,l._currentValue),l._currentValue=M,p!==null)if(bi(p.value,M)){if(p.children===d.children&&!Wn.current){i=pr(t,i,o);break e}}else for(p=i.child,p!==null&&(p.return=i);p!==null;){var N=p.dependencies;if(N!==null){M=p.child;for(var V=N.firstContext;V!==null;){if(V.context===l){if(p.tag===1){V=hr(-1,o&-o),V.tag=2;var le=p.updateQueue;if(le!==null){le=le.shared;var Me=le.pending;Me===null?V.next=V:(V.next=Me.next,Me.next=V),le.pending=V}}p.lanes|=o,V=p.alternate,V!==null&&(V.lanes|=o),rc(p.return,o,i),N.lanes|=o;break}V=V.next}}else if(p.tag===10)M=p.type===i.type?null:p.child;else if(p.tag===18){if(M=p.return,M===null)throw Error(n(341));M.lanes|=o,N=M.alternate,N!==null&&(N.lanes|=o),rc(M,o,i),M=p.sibling}else M=p.child;if(M!==null)M.return=p;else for(M=p;M!==null;){if(M===i){M=null;break}if(p=M.sibling,p!==null){p.return=M.return,M=p;break}M=M.return}p=M}kn(t,i,d.children,o),i=i.child}return i;case 9:return d=i.type,l=i.pendingProps.children,to(i,o),d=gi(d),l=l(d),i.flags|=1,kn(t,i,l,o),i.child;case 14:return l=i.type,d=Li(l,i.pendingProps),d=Li(l.type,d),cp(t,i,l,d,o);case 15:return fp(t,i,i.type,i.pendingProps,o);case 17:return l=i.type,d=i.pendingProps,d=i.elementType===l?d:Li(l,d),_l(t,i),i.tag=1,Xn(l)?(t=!0,Ja(i)):t=!1,to(i,o),np(i,l,d),yc(i,l,d,o),Tc(null,i,l,!0,t,o);case 19:return xp(t,i,o);case 22:return dp(t,i,o)}throw Error(n(156,i.tag))};function Gp(t,i){return Lr(t,i)}function d_(t,i,o,l){this.tag=t,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function xi(t,i,o,l){return new d_(t,i,o,l)}function Wc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function h_(t){if(typeof t=="function")return Wc(t)?1:0;if(t!=null){if(t=t.$$typeof,t===J)return 11;if(t===de)return 14}return 2}function $r(t,i){var o=t.alternate;return o===null?(o=xi(t.tag,i,t.key,t.mode),o.elementType=t.elementType,o.type=t.type,o.stateNode=t.stateNode,o.alternate=t,t.alternate=o):(o.pendingProps=i,o.type=t.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=t.flags&14680064,o.childLanes=t.childLanes,o.lanes=t.lanes,o.child=t.child,o.memoizedProps=t.memoizedProps,o.memoizedState=t.memoizedState,o.updateQueue=t.updateQueue,i=t.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=t.sibling,o.index=t.index,o.ref=t.ref,o}function Cl(t,i,o,l,d,p){var M=2;if(l=t,typeof t=="function")Wc(t)&&(M=1);else if(typeof t=="string")M=5;else e:switch(t){case O:return Ss(o.children,d,p,i);case j:M=8,d|=8;break;case L:return t=xi(12,o,i,d|2),t.elementType=L,t.lanes=p,t;case q:return t=xi(13,o,i,d),t.elementType=q,t.lanes=p,t;case ce:return t=xi(19,o,i,d),t.elementType=ce,t.lanes=p,t;case ue:return bl(o,d,p,i);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case C:M=10;break e;case P:M=9;break e;case J:M=11;break e;case de:M=14;break e;case oe:M=16,l=null;break e}throw Error(n(130,t==null?t:typeof t,""))}return i=xi(M,o,i,d),i.elementType=t,i.type=l,i.lanes=p,i}function Ss(t,i,o,l){return t=xi(7,t,l,i),t.lanes=o,t}function bl(t,i,o,l){return t=xi(22,t,l,i),t.elementType=ue,t.lanes=o,t.stateNode={isHidden:!1},t}function Xc(t,i,o){return t=xi(6,t,null,i),t.lanes=o,t}function jc(t,i,o){return i=xi(4,t.children!==null?t.children:[],t.key,i),i.lanes=o,i.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},i}function p_(t,i,o,l,d){this.tag=i,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=St(0),this.expirationTimes=St(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=St(0),this.identifierPrefix=l,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Yc(t,i,o,l,d,p,M,N,V){return t=new p_(t,i,o,N,V),i===1?(i=1,p===!0&&(i|=8)):i=0,p=xi(3,null,null,i),t.current=p,p.stateNode=t,p.memoizedState={element:l,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},oc(p),t}function m_(t,i,o){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:R,key:l==null?null:""+l,children:t,containerInfo:i,implementation:o}}function Wp(t){if(!t)return zr;t=t._reactInternals;e:{if(Gn(t)!==t||t.tag!==1)throw Error(n(170));var i=t;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Xn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(n(171))}if(t.tag===1){var o=t.type;if(Xn(o))return vh(t,o,i)}return i}function Xp(t,i,o,l,d,p,M,N,V){return t=Yc(o,l,!0,t,d,p,M,N,V),t.context=Wp(null),o=t.current,l=Bn(),d=Yr(o),p=hr(l,d),p.callback=i??null,Gr(o,p,d),t.current.lanes=d,dt(t,d,l),qn(t,l),t}function Pl(t,i,o,l){var d=i.current,p=Bn(),M=Yr(d);return o=Wp(o),i.context===null?i.context=o:i.pendingContext=o,i=hr(p,M),i.payload={element:t},l=l===void 0?null:l,l!==null&&(i.callback=l),t=Gr(d,i,M),t!==null&&(Ii(t,d,M,p),al(t,d,M)),M}function Ll(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function jp(t,i){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var o=t.retryLane;t.retryLane=o!==0&&o<i?o:i}}function qc(t,i){jp(t,i),(t=t.alternate)&&jp(t,i)}function g_(){return null}var Yp=typeof reportError=="function"?reportError:function(t){console.error(t)};function $c(t){this._internalRoot=t}Dl.prototype.render=$c.prototype.render=function(t){var i=this._internalRoot;if(i===null)throw Error(n(409));Pl(t,i,null,null)},Dl.prototype.unmount=$c.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var i=t.containerInfo;vs(function(){Pl(null,t,null,null)}),i[lr]=null}};function Dl(t){this._internalRoot=t}Dl.prototype.unstable_scheduleHydration=function(t){if(t){var i=ks();t={blockedOn:null,target:t,priority:i};for(var o=0;o<ti.length&&i!==0&&i<ti[o].priority;o++);ti.splice(o,0,t),o===0&&qo(t)}};function Kc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Ul(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function qp(){}function __(t,i,o,l,d){if(d){if(typeof l=="function"){var p=l;l=function(){var le=Ll(M);p.call(le)}}var M=Xp(i,l,t,0,null,!1,!1,"",qp);return t._reactRootContainer=M,t[lr]=M.current,oa(t.nodeType===8?t.parentNode:t),vs(),M}for(;d=t.lastChild;)t.removeChild(d);if(typeof l=="function"){var N=l;l=function(){var le=Ll(V);N.call(le)}}var V=Yc(t,0,!1,null,null,!1,!1,"",qp);return t._reactRootContainer=V,t[lr]=V.current,oa(t.nodeType===8?t.parentNode:t),vs(function(){Pl(i,V,o,l)}),V}function Il(t,i,o,l,d){var p=o._reactRootContainer;if(p){var M=p;if(typeof d=="function"){var N=d;d=function(){var V=Ll(M);N.call(V)}}Pl(i,M,t,d)}else M=__(o,i,t,d,l);return Ll(M)}cn=function(t){switch(t.tag){case 3:var i=t.stateNode;if(i.current.memoizedState.isDehydrated){var o=at(i.pendingLanes);o!==0&&(Dt(i,o|1),qn(i,K()),(Ut&6)===0&&(oo=K()+500,Hr()))}break;case 13:vs(function(){var l=dr(t,1);if(l!==null){var d=Bn();Ii(l,t,1,d)}}),qc(t,1)}},Jn=function(t){if(t.tag===13){var i=dr(t,134217728);if(i!==null){var o=Bn();Ii(i,t,134217728,o)}qc(t,134217728)}},za=function(t){if(t.tag===13){var i=Yr(t),o=dr(t,i);if(o!==null){var l=Bn();Ii(o,t,i,l)}qc(t,i)}},ks=function(){return ht},rr=function(t,i){var o=ht;try{return ht=t,i()}finally{ht=o}},we=function(t,i,o){switch(i){case"input":if(ct(t,o),i=o.name,o.type==="radio"&&i!=null){for(o=t;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var l=o[i];if(l!==t&&l.form===t.form){var d=Za(l);if(!d)throw Error(n(90));Pe(l),ct(l,d)}}}break;case"textarea":ve(t,o);break;case"select":i=o.value,i!=null&&U(t,!!o.multiple,i,!1)}},zt=Hc,en=vs;var v_={usingClientEntryPoint:!1,Events:[ua,Ys,Za,Ie,ot,Hc]},Ea={findFiberByHostInstance:cs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},x_={bundleType:Ea.bundleType,version:Ea.version,rendererPackageName:Ea.rendererPackageName,rendererConfig:Ea.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:b.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=br(t),t===null?null:t.stateNode},findFiberByHostInstance:Ea.findFiberByHostInstance||g_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Nl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Nl.isDisabled&&Nl.supportsFiber)try{Je=Nl.inject(x_),je=Nl}catch{}}return $n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=v_,$n.createPortal=function(t,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Kc(i))throw Error(n(200));return m_(t,i,null,o)},$n.createRoot=function(t,i){if(!Kc(t))throw Error(n(299));var o=!1,l="",d=Yp;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=Yc(t,1,!1,null,null,o,!1,l,d),t[lr]=i.current,oa(t.nodeType===8?t.parentNode:t),new $c(i)},$n.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var i=t._reactInternals;if(i===void 0)throw typeof t.render=="function"?Error(n(188)):(t=Object.keys(t).join(","),Error(n(268,t)));return t=br(i),t=t===null?null:t.stateNode,t},$n.flushSync=function(t){return vs(t)},$n.hydrate=function(t,i,o){if(!Ul(i))throw Error(n(200));return Il(null,t,i,!0,o)},$n.hydrateRoot=function(t,i,o){if(!Kc(t))throw Error(n(405));var l=o!=null&&o.hydratedSources||null,d=!1,p="",M=Yp;if(o!=null&&(o.unstable_strictMode===!0&&(d=!0),o.identifierPrefix!==void 0&&(p=o.identifierPrefix),o.onRecoverableError!==void 0&&(M=o.onRecoverableError)),i=Xp(i,null,t,1,o??null,d,!1,p,M),t[lr]=i.current,oa(t),l)for(t=0;t<l.length;t++)o=l[t],d=o._getVersion,d=d(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,d]:i.mutableSourceEagerHydrationData.push(o,d);return new Dl(i)},$n.render=function(t,i,o){if(!Ul(i))throw Error(n(200));return Il(null,t,i,!1,o)},$n.unmountComponentAtNode=function(t){if(!Ul(t))throw Error(n(40));return t._reactRootContainer?(vs(function(){Il(null,null,t,!1,function(){t._reactRootContainer=null,t[lr]=null})}),!0):!1},$n.unstable_batchedUpdates=Hc,$n.unstable_renderSubtreeIntoContainer=function(t,i,o,l){if(!Ul(o))throw Error(n(200));if(t==null||t._reactInternals===void 0)throw Error(n(38));return Il(t,i,o,!1,l)},$n.version="18.3.1-next-f1338f8080-20240426",$n}var nm;function fg(){if(nm)return Jc.exports;nm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Jc.exports=A_(),Jc.exports}var R_=fg();const C_=cg(R_);var Fl={},im;function b_(){if(im)return Fl;im=1;var s=fg();return Fl.createRoot=s.createRoot,Fl.hydrateRoot=s.hydrateRoot,Fl}var P_=b_();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const bd="172",L_=0,rm=1,D_=2,dg=1,U_=2,Sr=3,as=0,Zn=1,Bi=2,rs=0,Do=1,Of=2,sm=3,om=4,I_=5,Ls=100,N_=101,F_=102,O_=103,k_=104,B_=200,z_=201,H_=202,V_=203,kf=204,Bf=205,G_=206,W_=207,X_=208,j_=209,Y_=210,q_=211,$_=212,K_=213,Z_=214,zf=0,Hf=1,Vf=2,Fo=3,Gf=4,Wf=5,Xf=6,jf=7,hg=0,Q_=1,J_=2,ss=0,ev=1,tv=2,nv=3,iv=4,rv=5,sv=6,ov=7,pg=300,Oo=301,ko=302,Yf=303,qf=304,Tu=306,$f=1e3,Us=1001,Kf=1002,ui=1003,av=1004,Ol=1005,Ti=1006,nf=1007,Is=1008,wr=1009,mg=1010,gg=1011,Na=1012,Pd=1013,Fs=1014,Qi=1015,Fa=1016,Ld=1017,Dd=1018,Bo=1020,_g=35902,vg=1021,xg=1022,zi=1023,yg=1024,Sg=1025,Uo=1026,zo=1027,Ud=1028,Id=1029,Mg=1030,Nd=1031,Fd=1033,fu=33776,du=33777,hu=33778,pu=33779,Zf=35840,Qf=35841,Jf=35842,ed=35843,td=36196,nd=37492,id=37496,rd=37808,sd=37809,od=37810,ad=37811,ld=37812,ud=37813,cd=37814,fd=37815,dd=37816,hd=37817,pd=37818,md=37819,gd=37820,_d=37821,mu=36492,vd=36494,xd=36495,Eg=36283,yd=36284,Sd=36285,Md=36286,lv=3200,uv=3201,cv=0,fv=1,is="",Si="srgb",Ho="srgb-linear",_u="linear",Ht="srgb",lo=7680,am=519,dv=512,hv=513,pv=514,Tg=515,mv=516,gv=517,_v=518,vv=519,Ed=35044,lm="300 es",Er=2e3,vu=2001;class Go{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(n)===-1&&r[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const u=a.indexOf(n);u!==-1&&a.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let u=0,f=a.length;u<f;u++)a[u].call(this,e);e.target=null}}}const Un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rf=Math.PI/180,Td=180/Math.PI;function os(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Un[s&255]+Un[s>>8&255]+Un[s>>16&255]+Un[s>>24&255]+"-"+Un[e&255]+Un[e>>8&255]+"-"+Un[e>>16&15|64]+Un[e>>24&255]+"-"+Un[n&63|128]+Un[n>>8&255]+"-"+Un[n>>16&255]+Un[n>>24&255]+Un[r&255]+Un[r>>8&255]+Un[r>>16&255]+Un[r>>24&255]).toLowerCase()}function Pt(s,e,n){return Math.max(e,Math.min(n,s))}function xv(s,e){return(s%e+e)%e}function sf(s,e,n){return(1-n)*s+n*e}function Ki(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Vt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Lt{constructor(e=0,n=0){Lt.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,r=this.y,a=e.elements;return this.x=a[0]*n+a[3]*r+a[6],this.y=a[1]*n+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Pt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y;return n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const r=Math.cos(n),a=Math.sin(n),u=this.x-e.x,f=this.y-e.y;return this.x=u*r-f*a+e.x,this.y=u*a+f*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class _t{constructor(e,n,r,a,u,f,c,h,m){_t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,r,a,u,f,c,h,m)}set(e,n,r,a,u,f,c,h,m){const g=this.elements;return g[0]=e,g[1]=a,g[2]=c,g[3]=n,g[4]=u,g[5]=h,g[6]=r,g[7]=f,g[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],this}extractBasis(e,n,r){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,u=this.elements,f=r[0],c=r[3],h=r[6],m=r[1],g=r[4],y=r[7],v=r[2],S=r[5],E=r[8],T=a[0],x=a[3],_=a[6],k=a[1],I=a[4],b=a[7],W=a[2],R=a[5],O=a[8];return u[0]=f*T+c*k+h*W,u[3]=f*x+c*I+h*R,u[6]=f*_+c*b+h*O,u[1]=m*T+g*k+y*W,u[4]=m*x+g*I+y*R,u[7]=m*_+g*b+y*O,u[2]=v*T+S*k+E*W,u[5]=v*x+S*I+E*R,u[8]=v*_+S*b+E*O,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],f=e[4],c=e[5],h=e[6],m=e[7],g=e[8];return n*f*g-n*c*m-r*u*g+r*c*h+a*u*m-a*f*h}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],f=e[4],c=e[5],h=e[6],m=e[7],g=e[8],y=g*f-c*m,v=c*h-g*u,S=m*u-f*h,E=n*y+r*v+a*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const T=1/E;return e[0]=y*T,e[1]=(a*m-g*r)*T,e[2]=(c*r-a*f)*T,e[3]=v*T,e[4]=(g*n-a*h)*T,e[5]=(a*u-c*n)*T,e[6]=S*T,e[7]=(r*h-m*n)*T,e[8]=(f*n-r*u)*T,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,r,a,u,f,c){const h=Math.cos(u),m=Math.sin(u);return this.set(r*h,r*m,-r*(h*f+m*c)+f+e,-a*m,a*h,-a*(-m*f+h*c)+c+n,0,0,1),this}scale(e,n){return this.premultiply(of.makeScale(e,n)),this}rotate(e){return this.premultiply(of.makeRotation(-e)),this}translate(e,n){return this.premultiply(of.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,r,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<9;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<9;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const of=new _t;function wg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function xu(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function yv(){const s=xu("canvas");return s.style.display="block",s}const um={};function Ro(s){s in um||(um[s]=!0,console.warn(s))}function Sv(s,e,n){return new Promise(function(r,a){function u(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(u,n);break;default:r()}}setTimeout(u,n)})}function Mv(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Ev(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const cm=new _t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fm=new _t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tv(){const s={enabled:!0,workingColorSpace:Ho,spaces:{},convert:function(a,u,f){return this.enabled===!1||u===f||!u||!f||(this.spaces[u].transfer===Ht&&(a.r=Tr(a.r),a.g=Tr(a.g),a.b=Tr(a.b)),this.spaces[u].primaries!==this.spaces[f].primaries&&(a.applyMatrix3(this.spaces[u].toXYZ),a.applyMatrix3(this.spaces[f].fromXYZ)),this.spaces[f].transfer===Ht&&(a.r=Io(a.r),a.g=Io(a.g),a.b=Io(a.b))),a},fromWorkingColorSpace:function(a,u){return this.convert(a,this.workingColorSpace,u)},toWorkingColorSpace:function(a,u){return this.convert(a,u,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===is?_u:this.spaces[a].transfer},getLuminanceCoefficients:function(a,u=this.workingColorSpace){return a.fromArray(this.spaces[u].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,u,f){return a.copy(this.spaces[u].toXYZ).multiply(this.spaces[f].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[Ho]:{primaries:e,whitePoint:r,transfer:_u,toXYZ:cm,fromXYZ:fm,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Si},outputColorSpaceConfig:{drawingBufferColorSpace:Si}},[Si]:{primaries:e,whitePoint:r,transfer:Ht,toXYZ:cm,fromXYZ:fm,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Si}}}),s}const kt=Tv();function Tr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Io(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let uo;class wv{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{uo===void 0&&(uo=xu("canvas")),uo.width=e.width,uo.height=e.height;const r=uo.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=uo}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=xu("canvas");n.width=e.width,n.height=e.height;const r=n.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),u=a.data;for(let f=0;f<u.length;f++)u[f]=Tr(u[f]/255)*255;return r.putImageData(a,0,0),n}else if(e.data){const n=e.data.slice(0);for(let r=0;r<n.length;r++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[r]=Math.floor(Tr(n[r]/255)*255):n[r]=Tr(n[r]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Av=0;class Ag{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Av++}),this.uuid=os(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let u;if(Array.isArray(a)){u=[];for(let f=0,c=a.length;f<c;f++)a[f].isDataTexture?u.push(af(a[f].image)):u.push(af(a[f]))}else u=af(a);r.url=u}return n||(e.images[this.uuid]=r),r}}function af(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?wv.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Rv=0;class Fn extends Go{constructor(e=Fn.DEFAULT_IMAGE,n=Fn.DEFAULT_MAPPING,r=Us,a=Us,u=Ti,f=Is,c=zi,h=wr,m=Fn.DEFAULT_ANISOTROPY,g=is){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rv++}),this.uuid=os(),this.name="",this.source=new Ag(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=u,this.minFilter=f,this.anisotropy=m,this.format=c,this.internalFormat=null,this.type=h,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),n||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $f:e.x=e.x-Math.floor(e.x);break;case Us:e.x=e.x<0?0:1;break;case Kf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $f:e.y=e.y-Math.floor(e.y);break;case Us:e.y=e.y<0?0:1;break;case Kf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Fn.DEFAULT_IMAGE=null;Fn.DEFAULT_MAPPING=pg;Fn.DEFAULT_ANISOTROPY=1;class un{constructor(e=0,n=0,r=0,a=1){un.prototype.isVector4=!0,this.x=e,this.y=n,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,r,a){return this.x=e,this.y=n,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,u=this.w,f=e.elements;return this.x=f[0]*n+f[4]*r+f[8]*a+f[12]*u,this.y=f[1]*n+f[5]*r+f[9]*a+f[13]*u,this.z=f[2]*n+f[6]*r+f[10]*a+f[14]*u,this.w=f[3]*n+f[7]*r+f[11]*a+f[15]*u,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,r,a,u;const h=e.elements,m=h[0],g=h[4],y=h[8],v=h[1],S=h[5],E=h[9],T=h[2],x=h[6],_=h[10];if(Math.abs(g-v)<.01&&Math.abs(y-T)<.01&&Math.abs(E-x)<.01){if(Math.abs(g+v)<.1&&Math.abs(y+T)<.1&&Math.abs(E+x)<.1&&Math.abs(m+S+_-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const I=(m+1)/2,b=(S+1)/2,W=(_+1)/2,R=(g+v)/4,O=(y+T)/4,j=(E+x)/4;return I>b&&I>W?I<.01?(r=0,a=.707106781,u=.707106781):(r=Math.sqrt(I),a=R/r,u=O/r):b>W?b<.01?(r=.707106781,a=0,u=.707106781):(a=Math.sqrt(b),r=R/a,u=j/a):W<.01?(r=.707106781,a=.707106781,u=0):(u=Math.sqrt(W),r=O/u,a=j/u),this.set(r,a,u,n),this}let k=Math.sqrt((x-E)*(x-E)+(y-T)*(y-T)+(v-g)*(v-g));return Math.abs(k)<.001&&(k=1),this.x=(x-E)/k,this.y=(y-T)/k,this.z=(v-g)/k,this.w=Math.acos((m+S+_-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this.z=Pt(this.z,e.z,n.z),this.w=Pt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this.z=Pt(this.z,e,n),this.w=Pt(this.w,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this.w=e.w+(n.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cv extends Go{constructor(e=1,n=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new un(0,0,e,n),this.scissorTest=!1,this.viewport=new un(0,0,e,n);const a={width:e,height:n,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ti,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const u=new Fn(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);u.flipY=!1,u.generateMipmaps=r.generateMipmaps,u.internalFormat=r.internalFormat,this.textures=[];const f=r.count;for(let c=0;c<f;c++)this.textures[c]=u.clone(),this.textures[c].isRenderTargetTexture=!0,this.textures[c].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,r=1){if(this.width!==e||this.height!==n||this.depth!==r){this.width=e,this.height=n,this.depth=r;for(let a=0,u=this.textures.length;a<u;a++)this.textures[a].image.width=e,this.textures[a].image.height=n,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;const n=Object.assign({},e.texture.image);return this.texture.source=new Ag(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Os extends Cv{constructor(e=1,n=1,r={}){super(e,n,r),this.isWebGLRenderTarget=!0}}class Rg extends Fn{constructor(e=null,n=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=ui,this.minFilter=ui,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class bv extends Fn{constructor(e=null,n=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=ui,this.minFilter=ui,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oa{constructor(e=0,n=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=r,this._w=a}static slerpFlat(e,n,r,a,u,f,c){let h=r[a+0],m=r[a+1],g=r[a+2],y=r[a+3];const v=u[f+0],S=u[f+1],E=u[f+2],T=u[f+3];if(c===0){e[n+0]=h,e[n+1]=m,e[n+2]=g,e[n+3]=y;return}if(c===1){e[n+0]=v,e[n+1]=S,e[n+2]=E,e[n+3]=T;return}if(y!==T||h!==v||m!==S||g!==E){let x=1-c;const _=h*v+m*S+g*E+y*T,k=_>=0?1:-1,I=1-_*_;if(I>Number.EPSILON){const W=Math.sqrt(I),R=Math.atan2(W,_*k);x=Math.sin(x*R)/W,c=Math.sin(c*R)/W}const b=c*k;if(h=h*x+v*b,m=m*x+S*b,g=g*x+E*b,y=y*x+T*b,x===1-c){const W=1/Math.sqrt(h*h+m*m+g*g+y*y);h*=W,m*=W,g*=W,y*=W}}e[n]=h,e[n+1]=m,e[n+2]=g,e[n+3]=y}static multiplyQuaternionsFlat(e,n,r,a,u,f){const c=r[a],h=r[a+1],m=r[a+2],g=r[a+3],y=u[f],v=u[f+1],S=u[f+2],E=u[f+3];return e[n]=c*E+g*y+h*S-m*v,e[n+1]=h*E+g*v+m*y-c*S,e[n+2]=m*E+g*S+c*v-h*y,e[n+3]=g*E-c*y-h*v-m*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,r,a){return this._x=e,this._y=n,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const r=e._x,a=e._y,u=e._z,f=e._order,c=Math.cos,h=Math.sin,m=c(r/2),g=c(a/2),y=c(u/2),v=h(r/2),S=h(a/2),E=h(u/2);switch(f){case"XYZ":this._x=v*g*y+m*S*E,this._y=m*S*y-v*g*E,this._z=m*g*E+v*S*y,this._w=m*g*y-v*S*E;break;case"YXZ":this._x=v*g*y+m*S*E,this._y=m*S*y-v*g*E,this._z=m*g*E-v*S*y,this._w=m*g*y+v*S*E;break;case"ZXY":this._x=v*g*y-m*S*E,this._y=m*S*y+v*g*E,this._z=m*g*E+v*S*y,this._w=m*g*y-v*S*E;break;case"ZYX":this._x=v*g*y-m*S*E,this._y=m*S*y+v*g*E,this._z=m*g*E-v*S*y,this._w=m*g*y+v*S*E;break;case"YZX":this._x=v*g*y+m*S*E,this._y=m*S*y+v*g*E,this._z=m*g*E-v*S*y,this._w=m*g*y-v*S*E;break;case"XZY":this._x=v*g*y-m*S*E,this._y=m*S*y-v*g*E,this._z=m*g*E+v*S*y,this._w=m*g*y+v*S*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+f)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const r=n/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,r=n[0],a=n[4],u=n[8],f=n[1],c=n[5],h=n[9],m=n[2],g=n[6],y=n[10],v=r+c+y;if(v>0){const S=.5/Math.sqrt(v+1);this._w=.25/S,this._x=(g-h)*S,this._y=(u-m)*S,this._z=(f-a)*S}else if(r>c&&r>y){const S=2*Math.sqrt(1+r-c-y);this._w=(g-h)/S,this._x=.25*S,this._y=(a+f)/S,this._z=(u+m)/S}else if(c>y){const S=2*Math.sqrt(1+c-r-y);this._w=(u-m)/S,this._x=(a+f)/S,this._y=.25*S,this._z=(h+g)/S}else{const S=2*Math.sqrt(1+y-r-c);this._w=(f-a)/S,this._x=(u+m)/S,this._y=(h+g)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let r=e.dot(n)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,n){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,n/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const r=e._x,a=e._y,u=e._z,f=e._w,c=n._x,h=n._y,m=n._z,g=n._w;return this._x=r*g+f*c+a*m-u*h,this._y=a*g+f*h+u*c-r*m,this._z=u*g+f*m+r*h-a*c,this._w=f*g-r*c-a*h-u*m,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const r=this._x,a=this._y,u=this._z,f=this._w;let c=f*e._w+r*e._x+a*e._y+u*e._z;if(c<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,c=-c):this.copy(e),c>=1)return this._w=f,this._x=r,this._y=a,this._z=u,this;const h=1-c*c;if(h<=Number.EPSILON){const S=1-n;return this._w=S*f+n*this._w,this._x=S*r+n*this._x,this._y=S*a+n*this._y,this._z=S*u+n*this._z,this.normalize(),this}const m=Math.sqrt(h),g=Math.atan2(m,c),y=Math.sin((1-n)*g)/m,v=Math.sin(n*g)/m;return this._w=f*y+this._w*v,this._x=r*y+this._x*v,this._y=a*y+this._y*v,this._z=u*y+this._z*v,this._onChangeCallback(),this}slerpQuaternions(e,n,r){return this.copy(e).slerp(n,r)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),u=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),u*Math.sin(n),u*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Z{constructor(e=0,n=0,r=0){Z.prototype.isVector3=!0,this.x=e,this.y=n,this.z=r}set(e,n,r){return r===void 0&&(r=this.z),this.x=e,this.y=n,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(dm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(dm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,r=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[3]*r+u[6]*a,this.y=u[1]*n+u[4]*r+u[7]*a,this.z=u[2]*n+u[5]*r+u[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,u=e.elements,f=1/(u[3]*n+u[7]*r+u[11]*a+u[15]);return this.x=(u[0]*n+u[4]*r+u[8]*a+u[12])*f,this.y=(u[1]*n+u[5]*r+u[9]*a+u[13])*f,this.z=(u[2]*n+u[6]*r+u[10]*a+u[14])*f,this}applyQuaternion(e){const n=this.x,r=this.y,a=this.z,u=e.x,f=e.y,c=e.z,h=e.w,m=2*(f*a-c*r),g=2*(c*n-u*a),y=2*(u*r-f*n);return this.x=n+h*m+f*y-c*g,this.y=r+h*g+c*m-u*y,this.z=a+h*y+u*g-f*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,r=this.y,a=this.z,u=e.elements;return this.x=u[0]*n+u[4]*r+u[8]*a,this.y=u[1]*n+u[5]*r+u[9]*a,this.z=u[2]*n+u[6]*r+u[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Pt(this.x,e.x,n.x),this.y=Pt(this.y,e.y,n.y),this.z=Pt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Pt(this.x,e,n),this.y=Pt(this.y,e,n),this.z=Pt(this.z,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Pt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const r=e.x,a=e.y,u=e.z,f=n.x,c=n.y,h=n.z;return this.x=a*h-u*c,this.y=u*f-r*h,this.z=r*c-a*f,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const r=e.dot(this)/n;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return lf.copy(this).projectOnVector(e),this.sub(lf)}reflect(e){return this.sub(lf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Pt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return n*n+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,r){const a=Math.sin(n)*e;return this.x=a*Math.sin(r),this.y=Math.cos(n)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,r){return this.x=e*Math.sin(n),this.y=r,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=r,this.z=a,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,r=Math.sqrt(1-n*n);return this.x=r*Math.cos(e),this.y=n,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const lf=new Z,dm=new Oa;class ka{constructor(e=new Z(1/0,1/0,1/0),n=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n+=3)this.expandByPoint(Ni.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,r=e.count;n<r;n++)this.expandByPoint(Ni.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const r=Ni.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(n===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let f=0,c=u.count;f<c;f++)e.isMesh===!0?e.getVertexPosition(f,Ni):Ni.fromBufferAttribute(u,f),Ni.applyMatrix4(e.matrixWorld),this.expandByPoint(Ni);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),kl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),kl.copy(r.boundingBox)),kl.applyMatrix4(e.matrixWorld),this.union(kl)}const a=e.children;for(let u=0,f=a.length;u<f;u++)this.expandByObject(a[u],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ni),Ni.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,r;return e.normal.x>0?(n=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),n<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wa),Bl.subVectors(this.max,wa),co.subVectors(e.a,wa),fo.subVectors(e.b,wa),ho.subVectors(e.c,wa),Zr.subVectors(fo,co),Qr.subVectors(ho,fo),Ms.subVectors(co,ho);let n=[0,-Zr.z,Zr.y,0,-Qr.z,Qr.y,0,-Ms.z,Ms.y,Zr.z,0,-Zr.x,Qr.z,0,-Qr.x,Ms.z,0,-Ms.x,-Zr.y,Zr.x,0,-Qr.y,Qr.x,0,-Ms.y,Ms.x,0];return!uf(n,co,fo,ho,Bl)||(n=[1,0,0,0,1,0,0,0,1],!uf(n,co,fo,ho,Bl))?!1:(zl.crossVectors(Zr,Qr),n=[zl.x,zl.y,zl.z],uf(n,co,fo,ho,Bl))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ni).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ni).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const gr=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],Ni=new Z,kl=new ka,co=new Z,fo=new Z,ho=new Z,Zr=new Z,Qr=new Z,Ms=new Z,wa=new Z,Bl=new Z,zl=new Z,Es=new Z;function uf(s,e,n,r,a){for(let u=0,f=s.length-3;u<=f;u+=3){Es.fromArray(s,u);const c=a.x*Math.abs(Es.x)+a.y*Math.abs(Es.y)+a.z*Math.abs(Es.z),h=e.dot(Es),m=n.dot(Es),g=r.dot(Es);if(Math.max(-Math.max(h,m,g),Math.min(h,m,g))>c)return!1}return!0}const Pv=new ka,Aa=new Z,cf=new Z;class wu{constructor(e=new Z,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const r=this.center;n!==void 0?r.copy(n):Pv.setFromPoints(e).getCenter(r);let a=0;for(let u=0,f=e.length;u<f;u++)a=Math.max(a,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const r=this.center.distanceToSquared(e);return n.copy(e),r>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Aa.subVectors(e,this.center);const n=Aa.lengthSq();if(n>this.radius*this.radius){const r=Math.sqrt(n),a=(r-this.radius)*.5;this.center.addScaledVector(Aa,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(cf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Aa.copy(e.center).add(cf)),this.expandByPoint(Aa.copy(e.center).sub(cf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _r=new Z,ff=new Z,Hl=new Z,Jr=new Z,df=new Z,Vl=new Z,hf=new Z;class Cg{constructor(e=new Z,n=new Z(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_r)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const r=n.dot(this.direction);return r<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=_r.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(_r.copy(this.origin).addScaledVector(this.direction,n),_r.distanceToSquared(e))}distanceSqToSegment(e,n,r,a){ff.copy(e).add(n).multiplyScalar(.5),Hl.copy(n).sub(e).normalize(),Jr.copy(this.origin).sub(ff);const u=e.distanceTo(n)*.5,f=-this.direction.dot(Hl),c=Jr.dot(this.direction),h=-Jr.dot(Hl),m=Jr.lengthSq(),g=Math.abs(1-f*f);let y,v,S,E;if(g>0)if(y=f*h-c,v=f*c-h,E=u*g,y>=0)if(v>=-E)if(v<=E){const T=1/g;y*=T,v*=T,S=y*(y+f*v+2*c)+v*(f*y+v+2*h)+m}else v=u,y=Math.max(0,-(f*v+c)),S=-y*y+v*(v+2*h)+m;else v=-u,y=Math.max(0,-(f*v+c)),S=-y*y+v*(v+2*h)+m;else v<=-E?(y=Math.max(0,-(-f*u+c)),v=y>0?-u:Math.min(Math.max(-u,-h),u),S=-y*y+v*(v+2*h)+m):v<=E?(y=0,v=Math.min(Math.max(-u,-h),u),S=v*(v+2*h)+m):(y=Math.max(0,-(f*u+c)),v=y>0?u:Math.min(Math.max(-u,-h),u),S=-y*y+v*(v+2*h)+m);else v=f>0?-u:u,y=Math.max(0,-(f*v+c)),S=-y*y+v*(v+2*h)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,y),a&&a.copy(ff).addScaledVector(Hl,v),S}intersectSphere(e,n){_r.subVectors(e.center,this.origin);const r=_r.dot(this.direction),a=_r.dot(_r)-r*r,u=e.radius*e.radius;if(a>u)return null;const f=Math.sqrt(u-a),c=r-f,h=r+f;return h<0?null:c<0?this.at(h,n):this.at(c,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/n;return r>=0?r:null}intersectPlane(e,n){const r=this.distanceToPlane(e);return r===null?null:this.at(r,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let r,a,u,f,c,h;const m=1/this.direction.x,g=1/this.direction.y,y=1/this.direction.z,v=this.origin;return m>=0?(r=(e.min.x-v.x)*m,a=(e.max.x-v.x)*m):(r=(e.max.x-v.x)*m,a=(e.min.x-v.x)*m),g>=0?(u=(e.min.y-v.y)*g,f=(e.max.y-v.y)*g):(u=(e.max.y-v.y)*g,f=(e.min.y-v.y)*g),r>f||u>a||((u>r||isNaN(r))&&(r=u),(f<a||isNaN(a))&&(a=f),y>=0?(c=(e.min.z-v.z)*y,h=(e.max.z-v.z)*y):(c=(e.max.z-v.z)*y,h=(e.min.z-v.z)*y),r>h||c>a)||((c>r||r!==r)&&(r=c),(h<a||a!==a)&&(a=h),a<0)?null:this.at(r>=0?r:a,n)}intersectsBox(e){return this.intersectBox(e,_r)!==null}intersectTriangle(e,n,r,a,u){df.subVectors(n,e),Vl.subVectors(r,e),hf.crossVectors(df,Vl);let f=this.direction.dot(hf),c;if(f>0){if(a)return null;c=1}else if(f<0)c=-1,f=-f;else return null;Jr.subVectors(this.origin,e);const h=c*this.direction.dot(Vl.crossVectors(Jr,Vl));if(h<0)return null;const m=c*this.direction.dot(df.cross(Jr));if(m<0||h+m>f)return null;const g=-c*Jr.dot(hf);return g<0?null:this.at(g/f,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class an{constructor(e,n,r,a,u,f,c,h,m,g,y,v,S,E,T,x){an.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,r,a,u,f,c,h,m,g,y,v,S,E,T,x)}set(e,n,r,a,u,f,c,h,m,g,y,v,S,E,T,x){const _=this.elements;return _[0]=e,_[4]=n,_[8]=r,_[12]=a,_[1]=u,_[5]=f,_[9]=c,_[13]=h,_[2]=m,_[6]=g,_[10]=y,_[14]=v,_[3]=S,_[7]=E,_[11]=T,_[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new an().fromArray(this.elements)}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],n[9]=r[9],n[10]=r[10],n[11]=r[11],n[12]=r[12],n[13]=r[13],n[14]=r[14],n[15]=r[15],this}copyPosition(e){const n=this.elements,r=e.elements;return n[12]=r[12],n[13]=r[13],n[14]=r[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,r){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,n,r){return this.set(e.x,n.x,r.x,0,e.y,n.y,r.y,0,e.z,n.z,r.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,r=e.elements,a=1/po.setFromMatrixColumn(e,0).length(),u=1/po.setFromMatrixColumn(e,1).length(),f=1/po.setFromMatrixColumn(e,2).length();return n[0]=r[0]*a,n[1]=r[1]*a,n[2]=r[2]*a,n[3]=0,n[4]=r[4]*u,n[5]=r[5]*u,n[6]=r[6]*u,n[7]=0,n[8]=r[8]*f,n[9]=r[9]*f,n[10]=r[10]*f,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,r=e.x,a=e.y,u=e.z,f=Math.cos(r),c=Math.sin(r),h=Math.cos(a),m=Math.sin(a),g=Math.cos(u),y=Math.sin(u);if(e.order==="XYZ"){const v=f*g,S=f*y,E=c*g,T=c*y;n[0]=h*g,n[4]=-h*y,n[8]=m,n[1]=S+E*m,n[5]=v-T*m,n[9]=-c*h,n[2]=T-v*m,n[6]=E+S*m,n[10]=f*h}else if(e.order==="YXZ"){const v=h*g,S=h*y,E=m*g,T=m*y;n[0]=v+T*c,n[4]=E*c-S,n[8]=f*m,n[1]=f*y,n[5]=f*g,n[9]=-c,n[2]=S*c-E,n[6]=T+v*c,n[10]=f*h}else if(e.order==="ZXY"){const v=h*g,S=h*y,E=m*g,T=m*y;n[0]=v-T*c,n[4]=-f*y,n[8]=E+S*c,n[1]=S+E*c,n[5]=f*g,n[9]=T-v*c,n[2]=-f*m,n[6]=c,n[10]=f*h}else if(e.order==="ZYX"){const v=f*g,S=f*y,E=c*g,T=c*y;n[0]=h*g,n[4]=E*m-S,n[8]=v*m+T,n[1]=h*y,n[5]=T*m+v,n[9]=S*m-E,n[2]=-m,n[6]=c*h,n[10]=f*h}else if(e.order==="YZX"){const v=f*h,S=f*m,E=c*h,T=c*m;n[0]=h*g,n[4]=T-v*y,n[8]=E*y+S,n[1]=y,n[5]=f*g,n[9]=-c*g,n[2]=-m*g,n[6]=S*y+E,n[10]=v-T*y}else if(e.order==="XZY"){const v=f*h,S=f*m,E=c*h,T=c*m;n[0]=h*g,n[4]=-y,n[8]=m*g,n[1]=v*y+T,n[5]=f*g,n[9]=S*y-E,n[2]=E*y-S,n[6]=c*g,n[10]=T*y+v}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Lv,e,Dv)}lookAt(e,n,r){const a=this.elements;return ai.subVectors(e,n),ai.lengthSq()===0&&(ai.z=1),ai.normalize(),es.crossVectors(r,ai),es.lengthSq()===0&&(Math.abs(r.z)===1?ai.x+=1e-4:ai.z+=1e-4,ai.normalize(),es.crossVectors(r,ai)),es.normalize(),Gl.crossVectors(ai,es),a[0]=es.x,a[4]=Gl.x,a[8]=ai.x,a[1]=es.y,a[5]=Gl.y,a[9]=ai.y,a[2]=es.z,a[6]=Gl.z,a[10]=ai.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,u=this.elements,f=r[0],c=r[4],h=r[8],m=r[12],g=r[1],y=r[5],v=r[9],S=r[13],E=r[2],T=r[6],x=r[10],_=r[14],k=r[3],I=r[7],b=r[11],W=r[15],R=a[0],O=a[4],j=a[8],L=a[12],C=a[1],P=a[5],J=a[9],q=a[13],ce=a[2],de=a[6],oe=a[10],ue=a[14],H=a[3],fe=a[7],ee=a[11],F=a[15];return u[0]=f*R+c*C+h*ce+m*H,u[4]=f*O+c*P+h*de+m*fe,u[8]=f*j+c*J+h*oe+m*ee,u[12]=f*L+c*q+h*ue+m*F,u[1]=g*R+y*C+v*ce+S*H,u[5]=g*O+y*P+v*de+S*fe,u[9]=g*j+y*J+v*oe+S*ee,u[13]=g*L+y*q+v*ue+S*F,u[2]=E*R+T*C+x*ce+_*H,u[6]=E*O+T*P+x*de+_*fe,u[10]=E*j+T*J+x*oe+_*ee,u[14]=E*L+T*q+x*ue+_*F,u[3]=k*R+I*C+b*ce+W*H,u[7]=k*O+I*P+b*de+W*fe,u[11]=k*j+I*J+b*oe+W*ee,u[15]=k*L+I*q+b*ue+W*F,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[4],a=e[8],u=e[12],f=e[1],c=e[5],h=e[9],m=e[13],g=e[2],y=e[6],v=e[10],S=e[14],E=e[3],T=e[7],x=e[11],_=e[15];return E*(+u*h*y-a*m*y-u*c*v+r*m*v+a*c*S-r*h*S)+T*(+n*h*S-n*m*v+u*f*v-a*f*S+a*m*g-u*h*g)+x*(+n*m*y-n*c*S-u*f*y+r*f*S+u*c*g-r*m*g)+_*(-a*c*g-n*h*y+n*c*v+a*f*y-r*f*v+r*h*g)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=n,a[14]=r),this}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],u=e[3],f=e[4],c=e[5],h=e[6],m=e[7],g=e[8],y=e[9],v=e[10],S=e[11],E=e[12],T=e[13],x=e[14],_=e[15],k=y*x*m-T*v*m+T*h*S-c*x*S-y*h*_+c*v*_,I=E*v*m-g*x*m-E*h*S+f*x*S+g*h*_-f*v*_,b=g*T*m-E*y*m+E*c*S-f*T*S-g*c*_+f*y*_,W=E*y*h-g*T*h-E*c*v+f*T*v+g*c*x-f*y*x,R=n*k+r*I+a*b+u*W;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/R;return e[0]=k*O,e[1]=(T*v*u-y*x*u-T*a*S+r*x*S+y*a*_-r*v*_)*O,e[2]=(c*x*u-T*h*u+T*a*m-r*x*m-c*a*_+r*h*_)*O,e[3]=(y*h*u-c*v*u-y*a*m+r*v*m+c*a*S-r*h*S)*O,e[4]=I*O,e[5]=(g*x*u-E*v*u+E*a*S-n*x*S-g*a*_+n*v*_)*O,e[6]=(E*h*u-f*x*u-E*a*m+n*x*m+f*a*_-n*h*_)*O,e[7]=(f*v*u-g*h*u+g*a*m-n*v*m-f*a*S+n*h*S)*O,e[8]=b*O,e[9]=(E*y*u-g*T*u-E*r*S+n*T*S+g*r*_-n*y*_)*O,e[10]=(f*T*u-E*c*u+E*r*m-n*T*m-f*r*_+n*c*_)*O,e[11]=(g*c*u-f*y*u-g*r*m+n*y*m+f*r*S-n*c*S)*O,e[12]=W*O,e[13]=(g*T*a-E*y*a+E*r*v-n*T*v-g*r*x+n*y*x)*O,e[14]=(E*c*a-f*T*a-E*r*h+n*T*h+f*r*x-n*c*x)*O,e[15]=(f*y*a-g*c*a+g*r*h-n*y*h-f*r*v+n*c*v)*O,this}scale(e){const n=this.elements,r=e.x,a=e.y,u=e.z;return n[0]*=r,n[4]*=a,n[8]*=u,n[1]*=r,n[5]*=a,n[9]*=u,n[2]*=r,n[6]*=a,n[10]*=u,n[3]*=r,n[7]*=a,n[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,r,a))}makeTranslation(e,n,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,r,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,n,-r,0,0,r,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,0,r,0,0,1,0,0,-r,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,0,r,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const r=Math.cos(n),a=Math.sin(n),u=1-r,f=e.x,c=e.y,h=e.z,m=u*f,g=u*c;return this.set(m*f+r,m*c-a*h,m*h+a*c,0,m*c+a*h,g*c+r,g*h-a*f,0,m*h-a*c,g*h+a*f,u*h*h+r,0,0,0,0,1),this}makeScale(e,n,r){return this.set(e,0,0,0,0,n,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,n,r,a,u,f){return this.set(1,r,u,0,e,1,f,0,n,a,1,0,0,0,0,1),this}compose(e,n,r){const a=this.elements,u=n._x,f=n._y,c=n._z,h=n._w,m=u+u,g=f+f,y=c+c,v=u*m,S=u*g,E=u*y,T=f*g,x=f*y,_=c*y,k=h*m,I=h*g,b=h*y,W=r.x,R=r.y,O=r.z;return a[0]=(1-(T+_))*W,a[1]=(S+b)*W,a[2]=(E-I)*W,a[3]=0,a[4]=(S-b)*R,a[5]=(1-(v+_))*R,a[6]=(x+k)*R,a[7]=0,a[8]=(E+I)*O,a[9]=(x-k)*O,a[10]=(1-(v+T))*O,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,n,r){const a=this.elements;let u=po.set(a[0],a[1],a[2]).length();const f=po.set(a[4],a[5],a[6]).length(),c=po.set(a[8],a[9],a[10]).length();this.determinant()<0&&(u=-u),e.x=a[12],e.y=a[13],e.z=a[14],Fi.copy(this);const m=1/u,g=1/f,y=1/c;return Fi.elements[0]*=m,Fi.elements[1]*=m,Fi.elements[2]*=m,Fi.elements[4]*=g,Fi.elements[5]*=g,Fi.elements[6]*=g,Fi.elements[8]*=y,Fi.elements[9]*=y,Fi.elements[10]*=y,n.setFromRotationMatrix(Fi),r.x=u,r.y=f,r.z=c,this}makePerspective(e,n,r,a,u,f,c=Er){const h=this.elements,m=2*u/(n-e),g=2*u/(r-a),y=(n+e)/(n-e),v=(r+a)/(r-a);let S,E;if(c===Er)S=-(f+u)/(f-u),E=-2*f*u/(f-u);else if(c===vu)S=-f/(f-u),E=-f*u/(f-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return h[0]=m,h[4]=0,h[8]=y,h[12]=0,h[1]=0,h[5]=g,h[9]=v,h[13]=0,h[2]=0,h[6]=0,h[10]=S,h[14]=E,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,n,r,a,u,f,c=Er){const h=this.elements,m=1/(n-e),g=1/(r-a),y=1/(f-u),v=(n+e)*m,S=(r+a)*g;let E,T;if(c===Er)E=(f+u)*y,T=-2*y;else if(c===vu)E=u*y,T=-1*y;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return h[0]=2*m,h[4]=0,h[8]=0,h[12]=-v,h[1]=0,h[5]=2*g,h[9]=0,h[13]=-S,h[2]=0,h[6]=0,h[10]=T,h[14]=-E,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<16;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<16;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e[n+9]=r[9],e[n+10]=r[10],e[n+11]=r[11],e[n+12]=r[12],e[n+13]=r[13],e[n+14]=r[14],e[n+15]=r[15],e}}const po=new Z,Fi=new an,Lv=new Z(0,0,0),Dv=new Z(1,1,1),es=new Z,Gl=new Z,ai=new Z,hm=new an,pm=new Oa;class Ar{constructor(e=0,n=0,r=0,a=Ar.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,r,a=this._order){return this._x=e,this._y=n,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,r=!0){const a=e.elements,u=a[0],f=a[4],c=a[8],h=a[1],m=a[5],g=a[9],y=a[2],v=a[6],S=a[10];switch(n){case"XYZ":this._y=Math.asin(Pt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-g,S),this._z=Math.atan2(-f,u)):(this._x=Math.atan2(v,m),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(c,S),this._z=Math.atan2(h,m)):(this._y=Math.atan2(-y,u),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-y,S),this._z=Math.atan2(-f,m)):(this._y=0,this._z=Math.atan2(h,u));break;case"ZYX":this._y=Math.asin(-Pt(y,-1,1)),Math.abs(y)<.9999999?(this._x=Math.atan2(v,S),this._z=Math.atan2(h,u)):(this._x=0,this._z=Math.atan2(-f,m));break;case"YZX":this._z=Math.asin(Pt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,m),this._y=Math.atan2(-y,u)):(this._x=0,this._y=Math.atan2(c,S));break;case"XZY":this._z=Math.asin(-Pt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(v,m),this._y=Math.atan2(c,u)):(this._x=Math.atan2(-g,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,r){return hm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hm,n,r)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return pm.setFromEuler(this),this.setFromQuaternion(pm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ar.DEFAULT_ORDER="XYZ";class bg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Uv=0;const mm=new Z,mo=new Oa,vr=new an,Wl=new Z,Ra=new Z,Iv=new Z,Nv=new Oa,gm=new Z(1,0,0),_m=new Z(0,1,0),vm=new Z(0,0,1),xm={type:"added"},Fv={type:"removed"},go={type:"childadded",child:null},pf={type:"childremoved",child:null};class Vn extends Go{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Uv++}),this.uuid=os(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vn.DEFAULT_UP.clone();const e=new Z,n=new Ar,r=new Oa,a=new Z(1,1,1);function u(){r.setFromEuler(n,!1)}function f(){n.setFromQuaternion(r,void 0,!1)}n._onChange(u),r._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new an},normalMatrix:{value:new _t}}),this.matrix=new an,this.matrixWorld=new an,this.matrixAutoUpdate=Vn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return mo.setFromAxisAngle(e,n),this.quaternion.multiply(mo),this}rotateOnWorldAxis(e,n){return mo.setFromAxisAngle(e,n),this.quaternion.premultiply(mo),this}rotateX(e){return this.rotateOnAxis(gm,e)}rotateY(e){return this.rotateOnAxis(_m,e)}rotateZ(e){return this.rotateOnAxis(vm,e)}translateOnAxis(e,n){return mm.copy(e).applyQuaternion(this.quaternion),this.position.add(mm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(gm,e)}translateY(e){return this.translateOnAxis(_m,e)}translateZ(e){return this.translateOnAxis(vm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vr.copy(this.matrixWorld).invert())}lookAt(e,n,r){e.isVector3?Wl.copy(e):Wl.set(e,n,r);const a=this.parent;this.updateWorldMatrix(!0,!1),Ra.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vr.lookAt(Ra,Wl,this.up):vr.lookAt(Wl,Ra,this.up),this.quaternion.setFromRotationMatrix(vr),a&&(vr.extractRotation(a.matrixWorld),mo.setFromRotationMatrix(vr),this.quaternion.premultiply(mo.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xm),go.child=e,this.dispatchEvent(go),go.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Fv),pf.child=e,this.dispatchEvent(pf),pf.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vr.multiply(e.parent.matrixWorld)),e.applyMatrix4(vr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xm),go.child=e,this.dispatchEvent(go),go.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let r=0,a=this.children.length;r<a;r++){const f=this.children[r].getObjectByProperty(e,n);if(f!==void 0)return f}}getObjectsByProperty(e,n,r=[]){this[e]===n&&r.push(this);const a=this.children;for(let u=0,f=a.length;u<f;u++)a[u].getObjectsByProperty(e,n,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ra,e,Iv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ra,Nv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].updateMatrixWorld(e)}updateWorldMatrix(e,n){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const a=this.children;for(let u=0,f=a.length;u<f;u++)a[u].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",r={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(c=>({boxInitialized:c.boxInitialized,boxMin:c.box.min.toArray(),boxMax:c.box.max.toArray(),sphereInitialized:c.sphereInitialized,sphereRadius:c.sphere.radius,sphereCenter:c.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function u(c,h){return c[h.uuid]===void 0&&(c[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=u(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const h=c.shapes;if(Array.isArray(h))for(let m=0,g=h.length;m<g;m++){const y=h[m];u(e.shapes,y)}else u(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let h=0,m=this.material.length;h<m;h++)c.push(u(e.materials,this.material[h]));a.material=c}else a.material=u(e.materials,this.material);if(this.children.length>0){a.children=[];for(let c=0;c<this.children.length;c++)a.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let c=0;c<this.animations.length;c++){const h=this.animations[c];a.animations.push(u(e.animations,h))}}if(n){const c=f(e.geometries),h=f(e.materials),m=f(e.textures),g=f(e.images),y=f(e.shapes),v=f(e.skeletons),S=f(e.animations),E=f(e.nodes);c.length>0&&(r.geometries=c),h.length>0&&(r.materials=h),m.length>0&&(r.textures=m),g.length>0&&(r.images=g),y.length>0&&(r.shapes=y),v.length>0&&(r.skeletons=v),S.length>0&&(r.animations=S),E.length>0&&(r.nodes=E)}return r.object=a,r;function f(c){const h=[];for(const m in c){const g=c[m];delete g.metadata,h.push(g)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}Vn.DEFAULT_UP=new Z(0,1,0);Vn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Oi=new Z,xr=new Z,mf=new Z,yr=new Z,_o=new Z,vo=new Z,ym=new Z,gf=new Z,_f=new Z,vf=new Z,xf=new un,yf=new un,Sf=new un;class Ei{constructor(e=new Z,n=new Z,r=new Z){this.a=e,this.b=n,this.c=r}static getNormal(e,n,r,a){a.subVectors(r,n),Oi.subVectors(e,n),a.cross(Oi);const u=a.lengthSq();return u>0?a.multiplyScalar(1/Math.sqrt(u)):a.set(0,0,0)}static getBarycoord(e,n,r,a,u){Oi.subVectors(a,n),xr.subVectors(r,n),mf.subVectors(e,n);const f=Oi.dot(Oi),c=Oi.dot(xr),h=Oi.dot(mf),m=xr.dot(xr),g=xr.dot(mf),y=f*m-c*c;if(y===0)return u.set(0,0,0),null;const v=1/y,S=(m*h-c*g)*v,E=(f*g-c*h)*v;return u.set(1-S-E,E,S)}static containsPoint(e,n,r,a){return this.getBarycoord(e,n,r,a,yr)===null?!1:yr.x>=0&&yr.y>=0&&yr.x+yr.y<=1}static getInterpolation(e,n,r,a,u,f,c,h){return this.getBarycoord(e,n,r,a,yr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(u,yr.x),h.addScaledVector(f,yr.y),h.addScaledVector(c,yr.z),h)}static getInterpolatedAttribute(e,n,r,a,u,f){return xf.setScalar(0),yf.setScalar(0),Sf.setScalar(0),xf.fromBufferAttribute(e,n),yf.fromBufferAttribute(e,r),Sf.fromBufferAttribute(e,a),f.setScalar(0),f.addScaledVector(xf,u.x),f.addScaledVector(yf,u.y),f.addScaledVector(Sf,u.z),f}static isFrontFacing(e,n,r,a){return Oi.subVectors(r,n),xr.subVectors(e,n),Oi.cross(xr).dot(a)<0}set(e,n,r){return this.a.copy(e),this.b.copy(n),this.c.copy(r),this}setFromPointsAndIndices(e,n,r,a){return this.a.copy(e[n]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,n,r,a){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Oi.subVectors(this.c,this.b),xr.subVectors(this.a,this.b),Oi.cross(xr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ei.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Ei.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,r,a,u){return Ei.getInterpolation(e,this.a,this.b,this.c,n,r,a,u)}containsPoint(e){return Ei.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ei.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const r=this.a,a=this.b,u=this.c;let f,c;_o.subVectors(a,r),vo.subVectors(u,r),gf.subVectors(e,r);const h=_o.dot(gf),m=vo.dot(gf);if(h<=0&&m<=0)return n.copy(r);_f.subVectors(e,a);const g=_o.dot(_f),y=vo.dot(_f);if(g>=0&&y<=g)return n.copy(a);const v=h*y-g*m;if(v<=0&&h>=0&&g<=0)return f=h/(h-g),n.copy(r).addScaledVector(_o,f);vf.subVectors(e,u);const S=_o.dot(vf),E=vo.dot(vf);if(E>=0&&S<=E)return n.copy(u);const T=S*m-h*E;if(T<=0&&m>=0&&E<=0)return c=m/(m-E),n.copy(r).addScaledVector(vo,c);const x=g*E-S*y;if(x<=0&&y-g>=0&&S-E>=0)return ym.subVectors(u,a),c=(y-g)/(y-g+(S-E)),n.copy(a).addScaledVector(ym,c);const _=1/(x+T+v);return f=T*_,c=v*_,n.copy(r).addScaledVector(_o,f).addScaledVector(vo,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Pg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ts={h:0,s:0,l:0},Xl={h:0,s:0,l:0};function Mf(s,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?s+(e-s)*6*n:n<1/2?e:n<2/3?s+(e-s)*6*(2/3-n):s}class bt{constructor(e,n,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,r)}set(e,n,r){if(n===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,n,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Si){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,kt.toWorkingColorSpace(this,n),this}setRGB(e,n,r,a=kt.workingColorSpace){return this.r=e,this.g=n,this.b=r,kt.toWorkingColorSpace(this,a),this}setHSL(e,n,r,a=kt.workingColorSpace){if(e=xv(e,1),n=Pt(n,0,1),r=Pt(r,0,1),n===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+n):r+n-r*n,f=2*r-u;this.r=Mf(f,u,e+1/3),this.g=Mf(f,u,e),this.b=Mf(f,u,e-1/3)}return kt.toWorkingColorSpace(this,a),this}setStyle(e,n=Si){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const f=a[1],c=a[2];switch(f){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,n);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,n);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=a[1],f=u.length;if(f===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,n);if(f===6)return this.setHex(parseInt(u,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Si){const r=Pg[e.toLowerCase()];return r!==void 0?this.setHex(r,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Tr(e.r),this.g=Tr(e.g),this.b=Tr(e.b),this}copyLinearToSRGB(e){return this.r=Io(e.r),this.g=Io(e.g),this.b=Io(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Si){return kt.fromWorkingColorSpace(In.copy(this),e),Math.round(Pt(In.r*255,0,255))*65536+Math.round(Pt(In.g*255,0,255))*256+Math.round(Pt(In.b*255,0,255))}getHexString(e=Si){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=kt.workingColorSpace){kt.fromWorkingColorSpace(In.copy(this),n);const r=In.r,a=In.g,u=In.b,f=Math.max(r,a,u),c=Math.min(r,a,u);let h,m;const g=(c+f)/2;if(c===f)h=0,m=0;else{const y=f-c;switch(m=g<=.5?y/(f+c):y/(2-f-c),f){case r:h=(a-u)/y+(a<u?6:0);break;case a:h=(u-r)/y+2;break;case u:h=(r-a)/y+4;break}h/=6}return e.h=h,e.s=m,e.l=g,e}getRGB(e,n=kt.workingColorSpace){return kt.fromWorkingColorSpace(In.copy(this),n),e.r=In.r,e.g=In.g,e.b=In.b,e}getStyle(e=Si){kt.fromWorkingColorSpace(In.copy(this),e);const n=In.r,r=In.g,a=In.b;return e!==Si?`color(${e} ${n.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,n,r){return this.getHSL(ts),this.setHSL(ts.h+e,ts.s+n,ts.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,r){return this.r=e.r+(n.r-e.r)*r,this.g=e.g+(n.g-e.g)*r,this.b=e.b+(n.b-e.b)*r,this}lerpHSL(e,n){this.getHSL(ts),e.getHSL(Xl);const r=sf(ts.h,Xl.h,n),a=sf(ts.s,Xl.s,n),u=sf(ts.l,Xl.l,n);return this.setHSL(r,a,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,r=this.g,a=this.b,u=e.elements;return this.r=u[0]*n+u[3]*r+u[6]*a,this.g=u[1]*n+u[4]*r+u[7]*a,this.b=u[2]*n+u[5]*r+u[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const In=new bt;bt.NAMES=Pg;let Ov=0;class Wo extends Go{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=os(),this.name="",this.type="Material",this.blending=Do,this.side=as,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kf,this.blendDst=Bf,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=Fo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=am,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lo,this.stencilZFail=lo,this.stencilZPass=lo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const r=e[n];if(r===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const a=this[n];if(a===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[n]=r}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Do&&(r.blending=this.blending),this.side!==as&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==kf&&(r.blendSrc=this.blendSrc),this.blendDst!==Bf&&(r.blendDst=this.blendDst),this.blendEquation!==Ls&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Fo&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==am&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==lo&&(r.stencilFail=this.stencilFail),this.stencilZFail!==lo&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==lo&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(u){const f=[];for(const c in u){const h=u[c];delete h.metadata,f.push(h)}return f}if(n){const u=a(e.textures),f=a(e.images);u.length>0&&(r.textures=u),f.length>0&&(r.images=f)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let r=null;if(n!==null){const a=n.length;r=new Array(a);for(let u=0;u!==a;++u)r[u]=n[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ia extends Wo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ar,this.combine=hg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dn=new Z,jl=new Lt;class ci{constructor(e,n,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=r,this.usage=Ed,this.updateRanges=[],this.gpuType=Qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,r){e*=this.itemSize,r*=n.itemSize;for(let a=0,u=this.itemSize;a<u;a++)this.array[e+a]=n.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,r=this.count;n<r;n++)jl.fromBufferAttribute(this,n),jl.applyMatrix3(e),this.setXY(n,jl.x,jl.y);else if(this.itemSize===3)for(let n=0,r=this.count;n<r;n++)dn.fromBufferAttribute(this,n),dn.applyMatrix3(e),this.setXYZ(n,dn.x,dn.y,dn.z);return this}applyMatrix4(e){for(let n=0,r=this.count;n<r;n++)dn.fromBufferAttribute(this,n),dn.applyMatrix4(e),this.setXYZ(n,dn.x,dn.y,dn.z);return this}applyNormalMatrix(e){for(let n=0,r=this.count;n<r;n++)dn.fromBufferAttribute(this,n),dn.applyNormalMatrix(e),this.setXYZ(n,dn.x,dn.y,dn.z);return this}transformDirection(e){for(let n=0,r=this.count;n<r;n++)dn.fromBufferAttribute(this,n),dn.transformDirection(e),this.setXYZ(n,dn.x,dn.y,dn.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let r=this.array[e*this.itemSize+n];return this.normalized&&(r=Ki(r,this.array)),r}setComponent(e,n,r){return this.normalized&&(r=Vt(r,this.array)),this.array[e*this.itemSize+n]=r,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ki(n,this.array)),n}setX(e,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ki(n,this.array)),n}setY(e,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ki(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ki(n,this.array)),n}setW(e,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,r){return e*=this.itemSize,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array)),this.array[e+0]=n,this.array[e+1]=r,this}setXYZ(e,n,r,a){return e*=this.itemSize,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array),a=Vt(a,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,n,r,a,u){return e*=this.itemSize,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array),a=Vt(a,this.array),u=Vt(u,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ed&&(e.usage=this.usage),e}}class Lg extends ci{constructor(e,n,r){super(new Uint16Array(e),n,r)}}class Dg extends ci{constructor(e,n,r){super(new Uint32Array(e),n,r)}}class Hi extends ci{constructor(e,n,r){super(new Float32Array(e),n,r)}}let kv=0;const yi=new an,Ef=new Vn,xo=new Z,li=new ka,Ca=new ka,Mn=new Z;class Cn extends Go{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:kv++}),this.uuid=os(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wg(e)?Dg:Lg)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,r=0){this.groups.push({start:e,count:n,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new _t().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yi.makeRotationFromQuaternion(e),this.applyMatrix4(yi),this}rotateX(e){return yi.makeRotationX(e),this.applyMatrix4(yi),this}rotateY(e){return yi.makeRotationY(e),this.applyMatrix4(yi),this}rotateZ(e){return yi.makeRotationZ(e),this.applyMatrix4(yi),this}translate(e,n,r){return yi.makeTranslation(e,n,r),this.applyMatrix4(yi),this}scale(e,n,r){return yi.makeScale(e,n,r),this.applyMatrix4(yi),this}lookAt(e){return Ef.lookAt(e),Ef.updateMatrix(),this.applyMatrix4(Ef.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xo).negate(),this.translate(xo.x,xo.y,xo.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const r=[];for(let a=0,u=e.length;a<u;a++){const f=e[a];r.push(f.x,f.y,f.z||0)}this.setAttribute("position",new Hi(r,3))}else{const r=Math.min(e.length,n.count);for(let a=0;a<r;a++){const u=e[a];n.setXYZ(a,u.x,u.y,u.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ka);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const u=n[r];li.setFromBufferAttribute(u),this.morphTargetsRelative?(Mn.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(Mn),Mn.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(Mn)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wu);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(e){const r=this.boundingSphere.center;if(li.setFromBufferAttribute(e),n)for(let u=0,f=n.length;u<f;u++){const c=n[u];Ca.setFromBufferAttribute(c),this.morphTargetsRelative?(Mn.addVectors(li.min,Ca.min),li.expandByPoint(Mn),Mn.addVectors(li.max,Ca.max),li.expandByPoint(Mn)):(li.expandByPoint(Ca.min),li.expandByPoint(Ca.max))}li.getCenter(r);let a=0;for(let u=0,f=e.count;u<f;u++)Mn.fromBufferAttribute(e,u),a=Math.max(a,r.distanceToSquared(Mn));if(n)for(let u=0,f=n.length;u<f;u++){const c=n[u],h=this.morphTargetsRelative;for(let m=0,g=c.count;m<g;m++)Mn.fromBufferAttribute(c,m),h&&(xo.fromBufferAttribute(e,m),Mn.add(xo)),a=Math.max(a,r.distanceToSquared(Mn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=n.position,a=n.normal,u=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ci(new Float32Array(4*r.count),4));const f=this.getAttribute("tangent"),c=[],h=[];for(let j=0;j<r.count;j++)c[j]=new Z,h[j]=new Z;const m=new Z,g=new Z,y=new Z,v=new Lt,S=new Lt,E=new Lt,T=new Z,x=new Z;function _(j,L,C){m.fromBufferAttribute(r,j),g.fromBufferAttribute(r,L),y.fromBufferAttribute(r,C),v.fromBufferAttribute(u,j),S.fromBufferAttribute(u,L),E.fromBufferAttribute(u,C),g.sub(m),y.sub(m),S.sub(v),E.sub(v);const P=1/(S.x*E.y-E.x*S.y);isFinite(P)&&(T.copy(g).multiplyScalar(E.y).addScaledVector(y,-S.y).multiplyScalar(P),x.copy(y).multiplyScalar(S.x).addScaledVector(g,-E.x).multiplyScalar(P),c[j].add(T),c[L].add(T),c[C].add(T),h[j].add(x),h[L].add(x),h[C].add(x))}let k=this.groups;k.length===0&&(k=[{start:0,count:e.count}]);for(let j=0,L=k.length;j<L;++j){const C=k[j],P=C.start,J=C.count;for(let q=P,ce=P+J;q<ce;q+=3)_(e.getX(q+0),e.getX(q+1),e.getX(q+2))}const I=new Z,b=new Z,W=new Z,R=new Z;function O(j){W.fromBufferAttribute(a,j),R.copy(W);const L=c[j];I.copy(L),I.sub(W.multiplyScalar(W.dot(L))).normalize(),b.crossVectors(R,L);const P=b.dot(h[j])<0?-1:1;f.setXYZW(j,I.x,I.y,I.z,P)}for(let j=0,L=k.length;j<L;++j){const C=k[j],P=C.start,J=C.count;for(let q=P,ce=P+J;q<ce;q+=3)O(e.getX(q+0)),O(e.getX(q+1)),O(e.getX(q+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new ci(new Float32Array(n.count*3),3),this.setAttribute("normal",r);else for(let v=0,S=r.count;v<S;v++)r.setXYZ(v,0,0,0);const a=new Z,u=new Z,f=new Z,c=new Z,h=new Z,m=new Z,g=new Z,y=new Z;if(e)for(let v=0,S=e.count;v<S;v+=3){const E=e.getX(v+0),T=e.getX(v+1),x=e.getX(v+2);a.fromBufferAttribute(n,E),u.fromBufferAttribute(n,T),f.fromBufferAttribute(n,x),g.subVectors(f,u),y.subVectors(a,u),g.cross(y),c.fromBufferAttribute(r,E),h.fromBufferAttribute(r,T),m.fromBufferAttribute(r,x),c.add(g),h.add(g),m.add(g),r.setXYZ(E,c.x,c.y,c.z),r.setXYZ(T,h.x,h.y,h.z),r.setXYZ(x,m.x,m.y,m.z)}else for(let v=0,S=n.count;v<S;v+=3)a.fromBufferAttribute(n,v+0),u.fromBufferAttribute(n,v+1),f.fromBufferAttribute(n,v+2),g.subVectors(f,u),y.subVectors(a,u),g.cross(y),r.setXYZ(v+0,g.x,g.y,g.z),r.setXYZ(v+1,g.x,g.y,g.z),r.setXYZ(v+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,r=e.count;n<r;n++)Mn.fromBufferAttribute(e,n),Mn.normalize(),e.setXYZ(n,Mn.x,Mn.y,Mn.z)}toNonIndexed(){function e(c,h){const m=c.array,g=c.itemSize,y=c.normalized,v=new m.constructor(h.length*g);let S=0,E=0;for(let T=0,x=h.length;T<x;T++){c.isInterleavedBufferAttribute?S=h[T]*c.data.stride+c.offset:S=h[T]*g;for(let _=0;_<g;_++)v[E++]=m[S++]}return new ci(v,g,y)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Cn,r=this.index.array,a=this.attributes;for(const c in a){const h=a[c],m=e(h,r);n.setAttribute(c,m)}const u=this.morphAttributes;for(const c in u){const h=[],m=u[c];for(let g=0,y=m.length;g<y;g++){const v=m[g],S=e(v,r);h.push(S)}n.morphAttributes[c]=h}n.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let c=0,h=f.length;c<h;c++){const m=f[c];n.addGroup(m.start,m.count,m.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const m in h)h[m]!==void 0&&(e[m]=h[m]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const r=this.attributes;for(const h in r){const m=r[h];e.data.attributes[h]=m.toJSON(e.data)}const a={};let u=!1;for(const h in this.morphAttributes){const m=this.morphAttributes[h],g=[];for(let y=0,v=m.length;y<v;y++){const S=m[y];g.push(S.toJSON(e.data))}g.length>0&&(a[h]=g,u=!0)}u&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(e.data.groups=JSON.parse(JSON.stringify(f)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere={center:c.center.toArray(),radius:c.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(n));const a=e.attributes;for(const m in a){const g=a[m];this.setAttribute(m,g.clone(n))}const u=e.morphAttributes;for(const m in u){const g=[],y=u[m];for(let v=0,S=y.length;v<S;v++)g.push(y[v].clone(n));this.morphAttributes[m]=g}this.morphTargetsRelative=e.morphTargetsRelative;const f=e.groups;for(let m=0,g=f.length;m<g;m++){const y=f[m];this.addGroup(y.start,y.count,y.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sm=new an,Ts=new Cg,Yl=new wu,Mm=new Z,ql=new Z,$l=new Z,Kl=new Z,Tf=new Z,Zl=new Z,Em=new Z,Ql=new Z;class Kn extends Vn{constructor(e=new Cn,n=new Ia){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,f=a.length;u<f;u++){const c=a[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=u}}}}getVertexPosition(e,n){const r=this.geometry,a=r.attributes.position,u=r.morphAttributes.position,f=r.morphTargetsRelative;n.fromBufferAttribute(a,e);const c=this.morphTargetInfluences;if(u&&c){Zl.set(0,0,0);for(let h=0,m=u.length;h<m;h++){const g=c[h],y=u[h];g!==0&&(Tf.fromBufferAttribute(y,e),f?Zl.addScaledVector(Tf,g):Zl.addScaledVector(Tf.sub(n),g))}n.add(Zl)}return n}raycast(e,n){const r=this.geometry,a=this.material,u=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Yl.copy(r.boundingSphere),Yl.applyMatrix4(u),Ts.copy(e.ray).recast(e.near),!(Yl.containsPoint(Ts.origin)===!1&&(Ts.intersectSphere(Yl,Mm)===null||Ts.origin.distanceToSquared(Mm)>(e.far-e.near)**2))&&(Sm.copy(u).invert(),Ts.copy(e.ray).applyMatrix4(Sm),!(r.boundingBox!==null&&Ts.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,n,Ts)))}_computeIntersections(e,n,r){let a;const u=this.geometry,f=this.material,c=u.index,h=u.attributes.position,m=u.attributes.uv,g=u.attributes.uv1,y=u.attributes.normal,v=u.groups,S=u.drawRange;if(c!==null)if(Array.isArray(f))for(let E=0,T=v.length;E<T;E++){const x=v[E],_=f[x.materialIndex],k=Math.max(x.start,S.start),I=Math.min(c.count,Math.min(x.start+x.count,S.start+S.count));for(let b=k,W=I;b<W;b+=3){const R=c.getX(b),O=c.getX(b+1),j=c.getX(b+2);a=Jl(this,_,e,r,m,g,y,R,O,j),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=x.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),T=Math.min(c.count,S.start+S.count);for(let x=E,_=T;x<_;x+=3){const k=c.getX(x),I=c.getX(x+1),b=c.getX(x+2);a=Jl(this,f,e,r,m,g,y,k,I,b),a&&(a.faceIndex=Math.floor(x/3),n.push(a))}}else if(h!==void 0)if(Array.isArray(f))for(let E=0,T=v.length;E<T;E++){const x=v[E],_=f[x.materialIndex],k=Math.max(x.start,S.start),I=Math.min(h.count,Math.min(x.start+x.count,S.start+S.count));for(let b=k,W=I;b<W;b+=3){const R=b,O=b+1,j=b+2;a=Jl(this,_,e,r,m,g,y,R,O,j),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=x.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),T=Math.min(h.count,S.start+S.count);for(let x=E,_=T;x<_;x+=3){const k=x,I=x+1,b=x+2;a=Jl(this,f,e,r,m,g,y,k,I,b),a&&(a.faceIndex=Math.floor(x/3),n.push(a))}}}}function Bv(s,e,n,r,a,u,f,c){let h;if(e.side===Zn?h=r.intersectTriangle(f,u,a,!0,c):h=r.intersectTriangle(a,u,f,e.side===as,c),h===null)return null;Ql.copy(c),Ql.applyMatrix4(s.matrixWorld);const m=n.ray.origin.distanceTo(Ql);return m<n.near||m>n.far?null:{distance:m,point:Ql.clone(),object:s}}function Jl(s,e,n,r,a,u,f,c,h,m){s.getVertexPosition(c,ql),s.getVertexPosition(h,$l),s.getVertexPosition(m,Kl);const g=Bv(s,e,n,r,ql,$l,Kl,Em);if(g){const y=new Z;Ei.getBarycoord(Em,ql,$l,Kl,y),a&&(g.uv=Ei.getInterpolatedAttribute(a,c,h,m,y,new Lt)),u&&(g.uv1=Ei.getInterpolatedAttribute(u,c,h,m,y,new Lt)),f&&(g.normal=Ei.getInterpolatedAttribute(f,c,h,m,y,new Z),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const v={a:c,b:h,c:m,normal:new Z,materialIndex:0};Ei.getNormal(ql,$l,Kl,v.normal),g.face=v,g.barycoord=y}return g}class Ba extends Cn{constructor(e=1,n=1,r=1,a=1,u=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:r,widthSegments:a,heightSegments:u,depthSegments:f};const c=this;a=Math.floor(a),u=Math.floor(u),f=Math.floor(f);const h=[],m=[],g=[],y=[];let v=0,S=0;E("z","y","x",-1,-1,r,n,e,f,u,0),E("z","y","x",1,-1,r,n,-e,f,u,1),E("x","z","y",1,1,e,r,n,a,f,2),E("x","z","y",1,-1,e,r,-n,a,f,3),E("x","y","z",1,-1,e,n,r,a,u,4),E("x","y","z",-1,-1,e,n,-r,a,u,5),this.setIndex(h),this.setAttribute("position",new Hi(m,3)),this.setAttribute("normal",new Hi(g,3)),this.setAttribute("uv",new Hi(y,2));function E(T,x,_,k,I,b,W,R,O,j,L){const C=b/O,P=W/j,J=b/2,q=W/2,ce=R/2,de=O+1,oe=j+1;let ue=0,H=0;const fe=new Z;for(let ee=0;ee<oe;ee++){const F=ee*P-q;for(let se=0;se<de;se++){const pe=se*C-J;fe[T]=pe*k,fe[x]=F*I,fe[_]=ce,m.push(fe.x,fe.y,fe.z),fe[T]=0,fe[x]=0,fe[_]=R>0?1:-1,g.push(fe.x,fe.y,fe.z),y.push(se/O),y.push(1-ee/j),ue+=1}}for(let ee=0;ee<j;ee++)for(let F=0;F<O;F++){const se=v+F+de*ee,pe=v+F+de*(ee+1),Y=v+(F+1)+de*(ee+1),ae=v+(F+1)+de*ee;h.push(se,pe,ae),h.push(pe,Y,ae),H+=6}c.addGroup(S,H,L),S+=H,v+=ue}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ba(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Vo(s){const e={};for(const n in s){e[n]={};for(const r in s[n]){const a=s[n][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][r]=null):e[n][r]=a.clone():Array.isArray(a)?e[n][r]=a.slice():e[n][r]=a}}return e}function Hn(s){const e={};for(let n=0;n<s.length;n++){const r=Vo(s[n]);for(const a in r)e[a]=r[a]}return e}function zv(s){const e=[];for(let n=0;n<s.length;n++)e.push(s[n].clone());return e}function Ug(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:kt.workingColorSpace}const Hv={clone:Vo,merge:Hn};var Vv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ji extends Wo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vv,this.fragmentShader=Gv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Vo(e.uniforms),this.uniformsGroups=zv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const a in this.uniforms){const f=this.uniforms[a].value;f&&f.isTexture?n.uniforms[a]={type:"t",value:f.toJSON(e).uuid}:f&&f.isColor?n.uniforms[a]={type:"c",value:f.getHex()}:f&&f.isVector2?n.uniforms[a]={type:"v2",value:f.toArray()}:f&&f.isVector3?n.uniforms[a]={type:"v3",value:f.toArray()}:f&&f.isVector4?n.uniforms[a]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?n.uniforms[a]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?n.uniforms[a]={type:"m4",value:f.toArray()}:n.uniforms[a]={value:f}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(n.extensions=r),n}}class Ig extends Vn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new an,this.projectionMatrix=new an,this.projectionMatrixInverse=new an,this.coordinateSystem=Er}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ns=new Z,Tm=new Lt,wm=new Lt;class Mi extends Ig{constructor(e=50,n=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Td*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rf*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Td*2*Math.atan(Math.tan(rf*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,r){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,n){return this.getViewBounds(e,Tm,wm),n.subVectors(wm,Tm)}setViewOffset(e,n,r,a,u,f){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=u,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(rf*.5*this.fov)/this.zoom,r=2*n,a=this.aspect*r,u=-.5*a;const f=this.view;if(this.view!==null&&this.view.enabled){const h=f.fullWidth,m=f.fullHeight;u+=f.offsetX*a/h,n-=f.offsetY*r/m,a*=f.width/h,r*=f.height/m}const c=this.filmOffset;c!==0&&(u+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+a,n,n-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const yo=-90,So=1;class Wv extends Vn{constructor(e,n,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Mi(yo,So,e,n);a.layers=this.layers,this.add(a);const u=new Mi(yo,So,e,n);u.layers=this.layers,this.add(u);const f=new Mi(yo,So,e,n);f.layers=this.layers,this.add(f);const c=new Mi(yo,So,e,n);c.layers=this.layers,this.add(c);const h=new Mi(yo,So,e,n);h.layers=this.layers,this.add(h);const m=new Mi(yo,So,e,n);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[r,a,u,f,c,h]=n;for(const m of n)this.remove(m);if(e===Er)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===vu)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of n)this.add(m),m.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,f,c,h,m,g]=this.children,y=e.getRenderTarget(),v=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const T=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(n,u),e.setRenderTarget(r,1,a),e.render(n,f),e.setRenderTarget(r,2,a),e.render(n,c),e.setRenderTarget(r,3,a),e.render(n,h),e.setRenderTarget(r,4,a),e.render(n,m),r.texture.generateMipmaps=T,e.setRenderTarget(r,5,a),e.render(n,g),e.setRenderTarget(y,v,S),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class Ng extends Fn{constructor(e,n,r,a,u,f,c,h,m,g){e=e!==void 0?e:[],n=n!==void 0?n:Oo,super(e,n,r,a,u,f,c,h,m,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Xv extends Os{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new Ng(a,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Ti}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Ba(5,5,5),u=new Ji({name:"CubemapFromEquirect",uniforms:Vo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Zn,blending:rs});u.uniforms.tEquirect.value=n;const f=new Kn(a,u),c=n.minFilter;return n.minFilter===Is&&(n.minFilter=Ti),new Wv(1,10,this).update(e,f),n.minFilter=c,f.geometry.dispose(),f.material.dispose(),this}clear(e,n,r,a){const u=e.getRenderTarget();for(let f=0;f<6;f++)e.setRenderTarget(this,f),e.clear(n,r,a);e.setRenderTarget(u)}}class jv extends Vn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ar,this.environmentIntensity=1,this.environmentRotation=new Ar,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class Yv{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Ed,this.updateRanges=[],this.version=0,this.uuid=os()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,r){e*=this.stride,r*=n.stride;for(let a=0,u=this.stride;a<u;a++)this.array[e+a]=n.array[r+a];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=os()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=os()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const zn=new Z;class yu{constructor(e,n,r,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=r,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,r=this.data.count;n<r;n++)zn.fromBufferAttribute(this,n),zn.applyMatrix4(e),this.setXYZ(n,zn.x,zn.y,zn.z);return this}applyNormalMatrix(e){for(let n=0,r=this.count;n<r;n++)zn.fromBufferAttribute(this,n),zn.applyNormalMatrix(e),this.setXYZ(n,zn.x,zn.y,zn.z);return this}transformDirection(e){for(let n=0,r=this.count;n<r;n++)zn.fromBufferAttribute(this,n),zn.transformDirection(e),this.setXYZ(n,zn.x,zn.y,zn.z);return this}getComponent(e,n){let r=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(r=Ki(r,this.array)),r}setComponent(e,n,r){return this.normalized&&(r=Vt(r,this.array)),this.data.array[e*this.data.stride+this.offset+n]=r,this}setX(e,n){return this.normalized&&(n=Vt(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=Vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=Vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=Vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=Ki(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=Ki(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=Ki(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=Ki(n,this.array)),n}setXY(e,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=r,this}setXYZ(e,n,r,a){return e=e*this.data.stride+this.offset,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array),a=Vt(a,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=r,this.data.array[e+2]=a,this}setXYZW(e,n,r,a,u){return e=e*this.data.stride+this.offset,this.normalized&&(n=Vt(n,this.array),r=Vt(r,this.array),a=Vt(a,this.array),u=Vt(u,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=r,this.data.array[e+2]=a,this.data.array[e+3]=u,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let r=0;r<this.count;r++){const a=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)n.push(this.data.array[a+u])}return new ci(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new yu(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let r=0;r<this.count;r++){const a=r*this.data.stride+this.offset;for(let u=0;u<this.itemSize;u++)n.push(this.data.array[a+u])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class wd extends Wo{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Mo;const ba=new Z,Eo=new Z,To=new Z,wo=new Lt,Pa=new Lt,Fg=new an,eu=new Z,La=new Z,tu=new Z,Am=new Lt,wf=new Lt,Rm=new Lt;class Cm extends Vn{constructor(e=new wd){if(super(),this.isSprite=!0,this.type="Sprite",Mo===void 0){Mo=new Cn;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),r=new Yv(n,5);Mo.setIndex([0,1,2,0,2,3]),Mo.setAttribute("position",new yu(r,3,0,!1)),Mo.setAttribute("uv",new yu(r,2,3,!1))}this.geometry=Mo,this.material=e,this.center=new Lt(.5,.5)}raycast(e,n){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Eo.setFromMatrixScale(this.matrixWorld),Fg.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),To.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Eo.multiplyScalar(-To.z);const r=this.material.rotation;let a,u;r!==0&&(u=Math.cos(r),a=Math.sin(r));const f=this.center;nu(eu.set(-.5,-.5,0),To,f,Eo,a,u),nu(La.set(.5,-.5,0),To,f,Eo,a,u),nu(tu.set(.5,.5,0),To,f,Eo,a,u),Am.set(0,0),wf.set(1,0),Rm.set(1,1);let c=e.ray.intersectTriangle(eu,La,tu,!1,ba);if(c===null&&(nu(La.set(-.5,.5,0),To,f,Eo,a,u),wf.set(0,1),c=e.ray.intersectTriangle(eu,tu,La,!1,ba),c===null))return;const h=e.ray.origin.distanceTo(ba);h<e.near||h>e.far||n.push({distance:h,point:ba.clone(),uv:Ei.getInterpolation(ba,eu,La,tu,Am,wf,Rm,new Lt),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function nu(s,e,n,r,a,u){wo.subVectors(s,n).addScalar(.5).multiply(r),a!==void 0?(Pa.x=u*wo.x-a*wo.y,Pa.y=a*wo.x+u*wo.y):Pa.copy(wo),s.copy(e),s.x+=Pa.x,s.y+=Pa.y,s.applyMatrix4(Fg)}class qv extends Fn{constructor(e=null,n=1,r=1,a,u,f,c,h,m=ui,g=ui,y,v){super(null,f,c,h,m,g,a,u,y,v),this.isDataTexture=!0,this.image={data:e,width:n,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Af=new Z,$v=new Z,Kv=new _t;class bs{constructor(e=new Z(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,r,a){return this.normal.set(e,n,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,r){const a=Af.subVectors(r,n).cross($v.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const r=e.delta(Af),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/a;return u<0||u>1?null:n.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const n=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return n<0&&r>0||r<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const r=n||Kv.getNormalMatrix(e),a=this.coplanarPoint(Af).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ws=new wu,iu=new Z;class Og{constructor(e=new bs,n=new bs,r=new bs,a=new bs,u=new bs,f=new bs){this.planes=[e,n,r,a,u,f]}set(e,n,r,a,u,f){const c=this.planes;return c[0].copy(e),c[1].copy(n),c[2].copy(r),c[3].copy(a),c[4].copy(u),c[5].copy(f),this}copy(e){const n=this.planes;for(let r=0;r<6;r++)n[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,n=Er){const r=this.planes,a=e.elements,u=a[0],f=a[1],c=a[2],h=a[3],m=a[4],g=a[5],y=a[6],v=a[7],S=a[8],E=a[9],T=a[10],x=a[11],_=a[12],k=a[13],I=a[14],b=a[15];if(r[0].setComponents(h-u,v-m,x-S,b-_).normalize(),r[1].setComponents(h+u,v+m,x+S,b+_).normalize(),r[2].setComponents(h+f,v+g,x+E,b+k).normalize(),r[3].setComponents(h-f,v-g,x-E,b-k).normalize(),r[4].setComponents(h-c,v-y,x-T,b-I).normalize(),n===Er)r[5].setComponents(h+c,v+y,x+T,b+I).normalize();else if(n===vu)r[5].setComponents(c,y,T,I).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),ws.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){return ws.center.set(0,0,0),ws.radius=.7071067811865476,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){const n=this.planes,r=e.center,a=-e.radius;for(let u=0;u<6;u++)if(n[u].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const n=this.planes;for(let r=0;r<6;r++){const a=n[r];if(iu.x=a.normal.x>0?e.max.x:e.min.x,iu.y=a.normal.y>0?e.max.y:e.min.y,iu.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(iu)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let r=0;r<6;r++)if(n[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Co extends Wo{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Su=new Z,Mu=new Z,bm=new an,Da=new Cg,ru=new wu,Rf=new Z,Pm=new Z;class As extends Vn{constructor(e=new Cn,n=new Co){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,r=[0];for(let a=1,u=n.count;a<u;a++)Su.fromBufferAttribute(n,a-1),Mu.fromBufferAttribute(n,a),r[a]=r[a-1],r[a]+=Su.distanceTo(Mu);e.setAttribute("lineDistance",new Hi(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const r=this.geometry,a=this.matrixWorld,u=e.params.Line.threshold,f=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),ru.copy(r.boundingSphere),ru.applyMatrix4(a),ru.radius+=u,e.ray.intersectsSphere(ru)===!1)return;bm.copy(a).invert(),Da.copy(e.ray).applyMatrix4(bm);const c=u/((this.scale.x+this.scale.y+this.scale.z)/3),h=c*c,m=this.isLineSegments?2:1,g=r.index,v=r.attributes.position;if(g!==null){const S=Math.max(0,f.start),E=Math.min(g.count,f.start+f.count);for(let T=S,x=E-1;T<x;T+=m){const _=g.getX(T),k=g.getX(T+1),I=su(this,e,Da,h,_,k);I&&n.push(I)}if(this.isLineLoop){const T=g.getX(E-1),x=g.getX(S),_=su(this,e,Da,h,T,x);_&&n.push(_)}}else{const S=Math.max(0,f.start),E=Math.min(v.count,f.start+f.count);for(let T=S,x=E-1;T<x;T+=m){const _=su(this,e,Da,h,T,T+1);_&&n.push(_)}if(this.isLineLoop){const T=su(this,e,Da,h,E-1,S);T&&n.push(T)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,f=a.length;u<f;u++){const c=a[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=u}}}}}function su(s,e,n,r,a,u){const f=s.geometry.attributes.position;if(Su.fromBufferAttribute(f,a),Mu.fromBufferAttribute(f,u),n.distanceSqToSegment(Su,Mu,Rf,Pm)>r)return;Rf.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Rf);if(!(h<e.near||h>e.far))return{distance:h,point:Pm.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}class ou extends Vn{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Lm extends Fn{constructor(e,n,r,a,u,f,c,h,m){super(e,n,r,a,u,f,c,h,m),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kg extends Fn{constructor(e,n,r,a,u,f,c,h,m,g=Uo){if(g!==Uo&&g!==zo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&g===Uo&&(r=Fs),r===void 0&&g===zo&&(r=Bo),super(null,a,u,f,c,h,g,r,m),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=c!==void 0?c:ui,this.minFilter=h!==void 0?h:ui,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class Eu extends Cn{constructor(e=1,n=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:r,thetaLength:a},n=Math.max(3,n);const u=[],f=[],c=[],h=[],m=new Z,g=new Lt;f.push(0,0,0),c.push(0,0,1),h.push(.5,.5);for(let y=0,v=3;y<=n;y++,v+=3){const S=r+y/n*a;m.x=e*Math.cos(S),m.y=e*Math.sin(S),f.push(m.x,m.y,m.z),c.push(0,0,1),g.x=(f[v]/e+1)/2,g.y=(f[v+1]/e+1)/2,h.push(g.x,g.y)}for(let y=1;y<=n;y++)u.push(y,y+1,0);this.setIndex(u),this.setAttribute("position",new Hi(f,3)),this.setAttribute("normal",new Hi(c,3)),this.setAttribute("uv",new Hi(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Eu(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ns extends Cn{constructor(e=1,n=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:r,heightSegments:a};const u=e/2,f=n/2,c=Math.floor(r),h=Math.floor(a),m=c+1,g=h+1,y=e/c,v=n/h,S=[],E=[],T=[],x=[];for(let _=0;_<g;_++){const k=_*v-f;for(let I=0;I<m;I++){const b=I*y-u;E.push(b,-k,0),T.push(0,0,1),x.push(I/c),x.push(1-_/h)}}for(let _=0;_<h;_++)for(let k=0;k<c;k++){const I=k+m*_,b=k+m*(_+1),W=k+1+m*(_+1),R=k+1+m*_;S.push(I,b,R),S.push(b,W,R)}this.setIndex(S),this.setAttribute("position",new Hi(E,3)),this.setAttribute("normal",new Hi(T,3)),this.setAttribute("uv",new Hi(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ns(e.width,e.height,e.widthSegments,e.heightSegments)}}class Zv extends Wo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Qv extends Wo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Jv extends Ig{constructor(e=-1,n=1,r=1,a=-1,u=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=r,this.bottom=a,this.near=u,this.far=f,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,r,a,u,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=u,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let u=r-e,f=r+e,c=a+n,h=a-n;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=m*this.view.offsetX,f=u+m*this.view.width,c-=g*this.view.offsetY,h=c-g*this.view.height}this.projectionMatrix.makeOrthographic(u,f,c,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class ex extends Mi{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}function Dm(s,e,n,r){const a=tx(r);switch(n){case vg:return s*e;case yg:return s*e;case Sg:return s*e*2;case Ud:return s*e/a.components*a.byteLength;case Id:return s*e/a.components*a.byteLength;case Mg:return s*e*2/a.components*a.byteLength;case Nd:return s*e*2/a.components*a.byteLength;case xg:return s*e*3/a.components*a.byteLength;case zi:return s*e*4/a.components*a.byteLength;case Fd:return s*e*4/a.components*a.byteLength;case fu:case du:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case hu:case pu:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qf:case ed:return Math.max(s,16)*Math.max(e,8)/4;case Zf:case Jf:return Math.max(s,8)*Math.max(e,8)/2;case td:case nd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case id:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case sd:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case od:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case ad:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case ld:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ud:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case cd:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case fd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case dd:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case hd:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case pd:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case md:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case gd:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case _d:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case mu:case vd:case xd:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Eg:case yd:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Sd:case Md:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function tx(s){switch(s){case wr:case mg:return{byteLength:1,components:1};case Na:case gg:case Fa:return{byteLength:2,components:1};case Ld:case Dd:return{byteLength:2,components:4};case Fs:case Pd:case Qi:return{byteLength:4,components:1};case _g:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bd);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Bg(){let s=null,e=!1,n=null,r=null;function a(u,f){n(u,f),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&n!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){n=u},setContext:function(u){s=u}}}function nx(s){const e=new WeakMap;function n(c,h){const m=c.array,g=c.usage,y=m.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,m,g),c.onUploadCallback();let S;if(m instanceof Float32Array)S=s.FLOAT;else if(m instanceof Uint16Array)c.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)S=s.SHORT;else if(m instanceof Uint32Array)S=s.UNSIGNED_INT;else if(m instanceof Int32Array)S=s.INT;else if(m instanceof Int8Array)S=s.BYTE;else if(m instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:v,type:S,bytesPerElement:m.BYTES_PER_ELEMENT,version:c.version,size:y}}function r(c,h,m){const g=h.array,y=h.updateRanges;if(s.bindBuffer(m,c),y.length===0)s.bufferSubData(m,0,g);else{y.sort((S,E)=>S.start-E.start);let v=0;for(let S=1;S<y.length;S++){const E=y[v],T=y[S];T.start<=E.start+E.count+1?E.count=Math.max(E.count,T.start+T.count-E.start):(++v,y[v]=T)}y.length=v+1;for(let S=0,E=y.length;S<E;S++){const T=y[S];s.bufferSubData(m,T.start*g.BYTES_PER_ELEMENT,g,T.start,T.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function u(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=e.get(c);h&&(s.deleteBuffer(h.buffer),e.delete(c))}function f(c,h){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const g=e.get(c);(!g||g.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const m=e.get(c);if(m===void 0)e.set(c,n(c,h));else if(m.version<c.version){if(m.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,c,h),m.version=c.version}}return{get:a,remove:u,update:f}}var ix=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,rx=`#ifdef USE_ALPHAHASH
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
#endif`,sx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ox=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ax=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,lx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ux=`#ifdef USE_AOMAP
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
#endif`,cx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fx=`#ifdef USE_BATCHING
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
#endif`,dx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,px=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gx=`#ifdef USE_IRIDESCENCE
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
#endif`,_x=`#ifdef USE_BUMPMAP
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
#endif`,vx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ex=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ax=`#define PI 3.141592653589793
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
#endif`,Cx=`vec3 transformedNormal = objectNormal;
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
#endif`,bx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Px=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Dx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ux="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ix=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nx=`#ifdef USE_ENVMAP
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
#endif`,Fx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ox=`#ifdef USE_ENVMAP
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
#endif`,Bx=`#ifdef USE_ENVMAP
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
#endif`,zx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wx=`#ifdef USE_GRADIENTMAP
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
}`,Xx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qx=`uniform bool receiveShadow;
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
#endif`,$x=`#ifdef USE_ENVMAP
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
#endif`,Kx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Qx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ey=`PhysicalMaterial material;
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
#endif`,ty=`struct PhysicalMaterial {
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
}`,ny=`
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
#endif`,iy=`#if defined( RE_IndirectDiffuse )
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
#endif`,ry=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,oy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ay=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ly=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,uy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,dy=`#if defined( USE_POINTS_UV )
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
#endif`,hy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,py=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,my=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_y=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vy=`#ifdef USE_MORPHTARGETS
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
#endif`,xy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Sy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,My=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ey=`#ifndef FLAT_SHADED
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
#endif`,wy=`#ifdef USE_NORMALMAP
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
#endif`,Ay=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ry=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,by=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Py=`#ifdef OPAQUE
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
}`,Dy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Uy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Iy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ny=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Oy=`#ifdef USE_ROUGHNESSMAP
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
#endif`,By=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hy=`float getShadowMask() {
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
}`,Vy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gy=`#ifdef USE_SKINNING
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
#endif`,Wy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xy=`#ifdef USE_SKINNING
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
#endif`,jy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$y=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ky=`#ifdef USE_TRANSMISSION
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
#endif`,Zy=`#ifdef USE_TRANSMISSION
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
#endif`,Qy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const nS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iS=`uniform sampler2D t2D;
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
}`,rS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,oS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lS=`#include <common>
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
}`,uS=`#if DEPTH_PACKING == 3200
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
}`,cS=`#define DISTANCE
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
}`,fS=`#define DISTANCE
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
}`,dS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pS=`uniform float scale;
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
}`,mS=`uniform vec3 diffuse;
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
}`,gS=`#include <common>
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
}`,_S=`uniform vec3 diffuse;
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
}`,vS=`#define LAMBERT
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
}`,xS=`#define LAMBERT
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
}`,yS=`#define MATCAP
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
}`,SS=`#define MATCAP
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
}`,MS=`#define NORMAL
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
}`,ES=`#define NORMAL
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
}`,wS=`#define PHONG
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
}`,AS=`#define STANDARD
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
}`,CS=`#define TOON
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
}`,bS=`#define TOON
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
}`,PS=`uniform float size;
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
}`,DS=`#include <common>
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
}`,US=`uniform vec3 color;
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
}`,IS=`uniform float rotation;
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
}`,NS=`uniform vec3 diffuse;
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
}`,yt={alphahash_fragment:ix,alphahash_pars_fragment:rx,alphamap_fragment:sx,alphamap_pars_fragment:ox,alphatest_fragment:ax,alphatest_pars_fragment:lx,aomap_fragment:ux,aomap_pars_fragment:cx,batching_pars_vertex:fx,batching_vertex:dx,begin_vertex:hx,beginnormal_vertex:px,bsdfs:mx,iridescence_fragment:gx,bumpmap_pars_fragment:_x,clipping_planes_fragment:vx,clipping_planes_pars_fragment:xx,clipping_planes_pars_vertex:yx,clipping_planes_vertex:Sx,color_fragment:Mx,color_pars_fragment:Ex,color_pars_vertex:Tx,color_vertex:wx,common:Ax,cube_uv_reflection_fragment:Rx,defaultnormal_vertex:Cx,displacementmap_pars_vertex:bx,displacementmap_vertex:Px,emissivemap_fragment:Lx,emissivemap_pars_fragment:Dx,colorspace_fragment:Ux,colorspace_pars_fragment:Ix,envmap_fragment:Nx,envmap_common_pars_fragment:Fx,envmap_pars_fragment:Ox,envmap_pars_vertex:kx,envmap_physical_pars_fragment:$x,envmap_vertex:Bx,fog_vertex:zx,fog_pars_vertex:Hx,fog_fragment:Vx,fog_pars_fragment:Gx,gradientmap_pars_fragment:Wx,lightmap_pars_fragment:Xx,lights_lambert_fragment:jx,lights_lambert_pars_fragment:Yx,lights_pars_begin:qx,lights_toon_fragment:Kx,lights_toon_pars_fragment:Zx,lights_phong_fragment:Qx,lights_phong_pars_fragment:Jx,lights_physical_fragment:ey,lights_physical_pars_fragment:ty,lights_fragment_begin:ny,lights_fragment_maps:iy,lights_fragment_end:ry,logdepthbuf_fragment:sy,logdepthbuf_pars_fragment:oy,logdepthbuf_pars_vertex:ay,logdepthbuf_vertex:ly,map_fragment:uy,map_pars_fragment:cy,map_particle_fragment:fy,map_particle_pars_fragment:dy,metalnessmap_fragment:hy,metalnessmap_pars_fragment:py,morphinstance_vertex:my,morphcolor_vertex:gy,morphnormal_vertex:_y,morphtarget_pars_vertex:vy,morphtarget_vertex:xy,normal_fragment_begin:yy,normal_fragment_maps:Sy,normal_pars_fragment:My,normal_pars_vertex:Ey,normal_vertex:Ty,normalmap_pars_fragment:wy,clearcoat_normal_fragment_begin:Ay,clearcoat_normal_fragment_maps:Ry,clearcoat_pars_fragment:Cy,iridescence_pars_fragment:by,opaque_fragment:Py,packing:Ly,premultiplied_alpha_fragment:Dy,project_vertex:Uy,dithering_fragment:Iy,dithering_pars_fragment:Ny,roughnessmap_fragment:Fy,roughnessmap_pars_fragment:Oy,shadowmap_pars_fragment:ky,shadowmap_pars_vertex:By,shadowmap_vertex:zy,shadowmask_pars_fragment:Hy,skinbase_vertex:Vy,skinning_pars_vertex:Gy,skinning_vertex:Wy,skinnormal_vertex:Xy,specularmap_fragment:jy,specularmap_pars_fragment:Yy,tonemapping_fragment:qy,tonemapping_pars_fragment:$y,transmission_fragment:Ky,transmission_pars_fragment:Zy,uv_pars_fragment:Qy,uv_pars_vertex:Jy,uv_vertex:eS,worldpos_vertex:tS,background_vert:nS,background_frag:iS,backgroundCube_vert:rS,backgroundCube_frag:sS,cube_vert:oS,cube_frag:aS,depth_vert:lS,depth_frag:uS,distanceRGBA_vert:cS,distanceRGBA_frag:fS,equirect_vert:dS,equirect_frag:hS,linedashed_vert:pS,linedashed_frag:mS,meshbasic_vert:gS,meshbasic_frag:_S,meshlambert_vert:vS,meshlambert_frag:xS,meshmatcap_vert:yS,meshmatcap_frag:SS,meshnormal_vert:MS,meshnormal_frag:ES,meshphong_vert:TS,meshphong_frag:wS,meshphysical_vert:AS,meshphysical_frag:RS,meshtoon_vert:CS,meshtoon_frag:bS,points_vert:PS,points_frag:LS,shadow_vert:DS,shadow_frag:US,sprite_vert:IS,sprite_frag:NS},Fe={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _t}},envmap:{envMap:{value:null},envMapRotation:{value:new _t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _t},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0},uvTransform:{value:new _t}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _t},alphaMap:{value:null},alphaMapTransform:{value:new _t},alphaTest:{value:0}}},$i={basic:{uniforms:Hn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:Hn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:Hn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:Hn([Fe.common,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.roughnessmap,Fe.metalnessmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:Hn([Fe.common,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.gradientmap,Fe.fog,Fe.lights,{emissive:{value:new bt(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:Hn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:Hn([Fe.points,Fe.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:Hn([Fe.common,Fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:Hn([Fe.common,Fe.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:Hn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:Hn([Fe.sprite,Fe.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new _t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _t}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distanceRGBA:{uniforms:Hn([Fe.common,Fe.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distanceRGBA_vert,fragmentShader:yt.distanceRGBA_frag},shadow:{uniforms:Hn([Fe.lights,Fe.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};$i.physical={uniforms:Hn([$i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _t},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _t},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _t},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _t},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _t},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _t}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const au={r:0,b:0,g:0},Rs=new Ar,FS=new an;function OS(s,e,n,r,a,u,f){const c=new bt(0);let h=u===!0?0:1,m,g,y=null,v=0,S=null;function E(I){let b=I.isScene===!0?I.background:null;return b&&b.isTexture&&(b=(I.backgroundBlurriness>0?n:e).get(b)),b}function T(I){let b=!1;const W=E(I);W===null?_(c,h):W&&W.isColor&&(_(W,1),b=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?r.buffers.color.setClear(0,0,0,1,f):R==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,f),(s.autoClear||b)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(I,b){const W=E(b);W&&(W.isCubeTexture||W.mapping===Tu)?(g===void 0&&(g=new Kn(new Ba(1,1,1),new Ji({name:"BackgroundCubeMaterial",uniforms:Vo($i.backgroundCube.uniforms),vertexShader:$i.backgroundCube.vertexShader,fragmentShader:$i.backgroundCube.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(R,O,j){this.matrixWorld.copyPosition(j.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(g)),Rs.copy(b.backgroundRotation),Rs.x*=-1,Rs.y*=-1,Rs.z*=-1,W.isCubeTexture&&W.isRenderTargetTexture===!1&&(Rs.y*=-1,Rs.z*=-1),g.material.uniforms.envMap.value=W,g.material.uniforms.flipEnvMap.value=W.isCubeTexture&&W.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(FS.makeRotationFromEuler(Rs)),g.material.toneMapped=kt.getTransfer(W.colorSpace)!==Ht,(y!==W||v!==W.version||S!==s.toneMapping)&&(g.material.needsUpdate=!0,y=W,v=W.version,S=s.toneMapping),g.layers.enableAll(),I.unshift(g,g.geometry,g.material,0,0,null)):W&&W.isTexture&&(m===void 0&&(m=new Kn(new Ns(2,2),new Ji({name:"BackgroundMaterial",uniforms:Vo($i.background.uniforms),vertexShader:$i.background.vertexShader,fragmentShader:$i.background.fragmentShader,side:as,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=W,m.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,m.material.toneMapped=kt.getTransfer(W.colorSpace)!==Ht,W.matrixAutoUpdate===!0&&W.updateMatrix(),m.material.uniforms.uvTransform.value.copy(W.matrix),(y!==W||v!==W.version||S!==s.toneMapping)&&(m.material.needsUpdate=!0,y=W,v=W.version,S=s.toneMapping),m.layers.enableAll(),I.unshift(m,m.geometry,m.material,0,0,null))}function _(I,b){I.getRGB(au,Ug(s)),r.buffers.color.setClear(au.r,au.g,au.b,b,f)}function k(){g!==void 0&&(g.geometry.dispose(),g.material.dispose()),m!==void 0&&(m.geometry.dispose(),m.material.dispose())}return{getClearColor:function(){return c},setClearColor:function(I,b=1){c.set(I),h=b,_(c,h)},getClearAlpha:function(){return h},setClearAlpha:function(I){h=I,_(c,h)},render:T,addToRenderList:x,dispose:k}}function kS(s,e){const n=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=v(null);let u=a,f=!1;function c(C,P,J,q,ce){let de=!1;const oe=y(q,J,P);u!==oe&&(u=oe,m(u.object)),de=S(C,q,J,ce),de&&E(C,q,J,ce),ce!==null&&e.update(ce,s.ELEMENT_ARRAY_BUFFER),(de||f)&&(f=!1,b(C,P,J,q),ce!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ce).buffer))}function h(){return s.createVertexArray()}function m(C){return s.bindVertexArray(C)}function g(C){return s.deleteVertexArray(C)}function y(C,P,J){const q=J.wireframe===!0;let ce=r[C.id];ce===void 0&&(ce={},r[C.id]=ce);let de=ce[P.id];de===void 0&&(de={},ce[P.id]=de);let oe=de[q];return oe===void 0&&(oe=v(h()),de[q]=oe),oe}function v(C){const P=[],J=[],q=[];for(let ce=0;ce<n;ce++)P[ce]=0,J[ce]=0,q[ce]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:J,attributeDivisors:q,object:C,attributes:{},index:null}}function S(C,P,J,q){const ce=u.attributes,de=P.attributes;let oe=0;const ue=J.getAttributes();for(const H in ue)if(ue[H].location>=0){const ee=ce[H];let F=de[H];if(F===void 0&&(H==="instanceMatrix"&&C.instanceMatrix&&(F=C.instanceMatrix),H==="instanceColor"&&C.instanceColor&&(F=C.instanceColor)),ee===void 0||ee.attribute!==F||F&&ee.data!==F.data)return!0;oe++}return u.attributesNum!==oe||u.index!==q}function E(C,P,J,q){const ce={},de=P.attributes;let oe=0;const ue=J.getAttributes();for(const H in ue)if(ue[H].location>=0){let ee=de[H];ee===void 0&&(H==="instanceMatrix"&&C.instanceMatrix&&(ee=C.instanceMatrix),H==="instanceColor"&&C.instanceColor&&(ee=C.instanceColor));const F={};F.attribute=ee,ee&&ee.data&&(F.data=ee.data),ce[H]=F,oe++}u.attributes=ce,u.attributesNum=oe,u.index=q}function T(){const C=u.newAttributes;for(let P=0,J=C.length;P<J;P++)C[P]=0}function x(C){_(C,0)}function _(C,P){const J=u.newAttributes,q=u.enabledAttributes,ce=u.attributeDivisors;J[C]=1,q[C]===0&&(s.enableVertexAttribArray(C),q[C]=1),ce[C]!==P&&(s.vertexAttribDivisor(C,P),ce[C]=P)}function k(){const C=u.newAttributes,P=u.enabledAttributes;for(let J=0,q=P.length;J<q;J++)P[J]!==C[J]&&(s.disableVertexAttribArray(J),P[J]=0)}function I(C,P,J,q,ce,de,oe){oe===!0?s.vertexAttribIPointer(C,P,J,ce,de):s.vertexAttribPointer(C,P,J,q,ce,de)}function b(C,P,J,q){T();const ce=q.attributes,de=J.getAttributes(),oe=P.defaultAttributeValues;for(const ue in de){const H=de[ue];if(H.location>=0){let fe=ce[ue];if(fe===void 0&&(ue==="instanceMatrix"&&C.instanceMatrix&&(fe=C.instanceMatrix),ue==="instanceColor"&&C.instanceColor&&(fe=C.instanceColor)),fe!==void 0){const ee=fe.normalized,F=fe.itemSize,se=e.get(fe);if(se===void 0)continue;const pe=se.buffer,Y=se.type,ae=se.bytesPerElement,he=Y===s.INT||Y===s.UNSIGNED_INT||fe.gpuType===Pd;if(fe.isInterleavedBufferAttribute){const _e=fe.data,Re=_e.stride,Le=fe.offset;if(_e.isInstancedInterleavedBuffer){for(let Oe=0;Oe<H.locationSize;Oe++)_(H.location+Oe,_e.meshPerAttribute);C.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let Oe=0;Oe<H.locationSize;Oe++)x(H.location+Oe);s.bindBuffer(s.ARRAY_BUFFER,pe);for(let Oe=0;Oe<H.locationSize;Oe++)I(H.location+Oe,F/H.locationSize,Y,ee,Re*ae,(Le+F/H.locationSize*Oe)*ae,he)}else{if(fe.isInstancedBufferAttribute){for(let _e=0;_e<H.locationSize;_e++)_(H.location+_e,fe.meshPerAttribute);C.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let _e=0;_e<H.locationSize;_e++)x(H.location+_e);s.bindBuffer(s.ARRAY_BUFFER,pe);for(let _e=0;_e<H.locationSize;_e++)I(H.location+_e,F/H.locationSize,Y,ee,F*ae,F/H.locationSize*_e*ae,he)}}else if(oe!==void 0){const ee=oe[ue];if(ee!==void 0)switch(ee.length){case 2:s.vertexAttrib2fv(H.location,ee);break;case 3:s.vertexAttrib3fv(H.location,ee);break;case 4:s.vertexAttrib4fv(H.location,ee);break;default:s.vertexAttrib1fv(H.location,ee)}}}}k()}function W(){j();for(const C in r){const P=r[C];for(const J in P){const q=P[J];for(const ce in q)g(q[ce].object),delete q[ce];delete P[J]}delete r[C]}}function R(C){if(r[C.id]===void 0)return;const P=r[C.id];for(const J in P){const q=P[J];for(const ce in q)g(q[ce].object),delete q[ce];delete P[J]}delete r[C.id]}function O(C){for(const P in r){const J=r[P];if(J[C.id]===void 0)continue;const q=J[C.id];for(const ce in q)g(q[ce].object),delete q[ce];delete J[C.id]}}function j(){L(),f=!0,u!==a&&(u=a,m(u.object))}function L(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:c,reset:j,resetDefaultState:L,dispose:W,releaseStatesOfGeometry:R,releaseStatesOfProgram:O,initAttributes:T,enableAttribute:x,disableUnusedAttributes:k}}function BS(s,e,n){let r;function a(m){r=m}function u(m,g){s.drawArrays(r,m,g),n.update(g,r,1)}function f(m,g,y){y!==0&&(s.drawArraysInstanced(r,m,g,y),n.update(g,r,y))}function c(m,g,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,g,0,y);let S=0;for(let E=0;E<y;E++)S+=g[E];n.update(S,r,1)}function h(m,g,y,v){if(y===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let E=0;E<m.length;E++)f(m[E],g[E],v[E]);else{S.multiDrawArraysInstancedWEBGL(r,m,0,g,0,v,0,y);let E=0;for(let T=0;T<y;T++)E+=g[T]*v[T];n.update(E,r,1)}}this.setMode=a,this.render=u,this.renderInstances=f,this.renderMultiDraw=c,this.renderMultiDrawInstances=h}function zS(s,e,n,r){let a;function u(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function f(O){return!(O!==zi&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(O){const j=O===Fa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(O!==wr&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==Qi&&!j)}function h(O){if(O==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=n.precision!==void 0?n.precision:"highp";const g=h(m);g!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",g,"instead."),m=g);const y=n.logarithmicDepthBuffer===!0,v=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),T=s.getParameter(s.MAX_TEXTURE_SIZE),x=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),k=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),I=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),W=E>0,R=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:u,getMaxPrecision:h,textureFormatReadable:f,textureTypeReadable:c,precision:m,logarithmicDepthBuffer:y,reverseDepthBuffer:v,maxTextures:S,maxVertexTextures:E,maxTextureSize:T,maxCubemapSize:x,maxAttributes:_,maxVertexUniforms:k,maxVaryings:I,maxFragmentUniforms:b,vertexTextures:W,maxSamples:R}}function HS(s){const e=this;let n=null,r=0,a=!1,u=!1;const f=new bs,c=new _t,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(y,v){const S=y.length!==0||v||r!==0||a;return a=v,r=y.length,S},this.beginShadows=function(){u=!0,g(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(y,v){n=g(y,v,0)},this.setState=function(y,v,S){const E=y.clippingPlanes,T=y.clipIntersection,x=y.clipShadows,_=s.get(y);if(!a||E===null||E.length===0||u&&!x)u?g(null):m();else{const k=u?0:r,I=k*4;let b=_.clippingState||null;h.value=b,b=g(E,v,I,S);for(let W=0;W!==I;++W)b[W]=n[W];_.clippingState=b,this.numIntersection=T?this.numPlanes:0,this.numPlanes+=k}};function m(){h.value!==n&&(h.value=n,h.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function g(y,v,S,E){const T=y!==null?y.length:0;let x=null;if(T!==0){if(x=h.value,E!==!0||x===null){const _=S+T*4,k=v.matrixWorldInverse;c.getNormalMatrix(k),(x===null||x.length<_)&&(x=new Float32Array(_));for(let I=0,b=S;I!==T;++I,b+=4)f.copy(y[I]).applyMatrix4(k,c),f.normal.toArray(x,b),x[b+3]=f.constant}h.value=x,h.needsUpdate=!0}return e.numPlanes=T,e.numIntersection=0,x}}function VS(s){let e=new WeakMap;function n(f,c){return c===Yf?f.mapping=Oo:c===qf&&(f.mapping=ko),f}function r(f){if(f&&f.isTexture){const c=f.mapping;if(c===Yf||c===qf)if(e.has(f)){const h=e.get(f).texture;return n(h,f.mapping)}else{const h=f.image;if(h&&h.height>0){const m=new Xv(h.height);return m.fromEquirectangularTexture(s,f),e.set(f,m),f.addEventListener("dispose",a),n(m.texture,f.mapping)}else return null}}return f}function a(f){const c=f.target;c.removeEventListener("dispose",a);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}const bo=4,Um=[.125,.215,.35,.446,.526,.582],Ds=20,Cf=new Jv,Im=new bt;let bf=null,Pf=0,Lf=0,Df=!1;const Ps=(1+Math.sqrt(5))/2,Ao=1/Ps,Nm=[new Z(-Ps,Ao,0),new Z(Ps,Ao,0),new Z(-Ao,0,Ps),new Z(Ao,0,Ps),new Z(0,Ps,-Ao),new Z(0,Ps,Ao),new Z(-1,1,-1),new Z(1,1,-1),new Z(-1,1,1),new Z(1,1,1)];class Fm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,r=.1,a=100){bf=this._renderer.getRenderTarget(),Pf=this._renderer.getActiveCubeFace(),Lf=this._renderer.getActiveMipmapLevel(),Df=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,r,a,u),n>0&&this._blur(u,0,0,n),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=km(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(bf,Pf,Lf),this._renderer.xr.enabled=Df,e.scissorTest=!1,lu(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Oo||e.mapping===ko?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bf=this._renderer.getRenderTarget(),Pf=this._renderer.getActiveCubeFace(),Lf=this._renderer.getActiveMipmapLevel(),Df=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=n||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,r={magFilter:Ti,minFilter:Ti,generateMipmaps:!1,type:Fa,format:zi,colorSpace:Ho,depthBuffer:!1},a=Om(e,n,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Om(e,n,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=GS(u)),this._blurMaterial=WS(u,e,n)}return a}_compileMaterial(e){const n=new Kn(this._lodPlanes[0],e);this._renderer.compile(n,Cf)}_sceneToCubeUV(e,n,r,a){const c=new Mi(90,1,n,r),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],g=this._renderer,y=g.autoClear,v=g.toneMapping;g.getClearColor(Im),g.toneMapping=ss,g.autoClear=!1;const S=new Ia({name:"PMREM.Background",side:Zn,depthWrite:!1,depthTest:!1}),E=new Kn(new Ba,S);let T=!1;const x=e.background;x?x.isColor&&(S.color.copy(x),e.background=null,T=!0):(S.color.copy(Im),T=!0);for(let _=0;_<6;_++){const k=_%3;k===0?(c.up.set(0,h[_],0),c.lookAt(m[_],0,0)):k===1?(c.up.set(0,0,h[_]),c.lookAt(0,m[_],0)):(c.up.set(0,h[_],0),c.lookAt(0,0,m[_]));const I=this._cubeSize;lu(a,k*I,_>2?I:0,I,I),g.setRenderTarget(a),T&&g.render(E,c),g.render(e,c)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=v,g.autoClear=y,e.background=x}_textureToCubeUV(e,n){const r=this._renderer,a=e.mapping===Oo||e.mapping===ko;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=km());const u=a?this._cubemapMaterial:this._equirectMaterial,f=new Kn(this._lodPlanes[0],u),c=u.uniforms;c.envMap.value=e;const h=this._cubeSize;lu(n,0,0,3*h,2*h),r.setRenderTarget(n),r.render(f,Cf)}_applyPMREM(e){const n=this._renderer,r=n.autoClear;n.autoClear=!1;const a=this._lodPlanes.length;for(let u=1;u<a;u++){const f=Math.sqrt(this._sigmas[u]*this._sigmas[u]-this._sigmas[u-1]*this._sigmas[u-1]),c=Nm[(a-u-1)%Nm.length];this._blur(e,u-1,u,f,c)}n.autoClear=r}_blur(e,n,r,a,u){const f=this._pingPongRenderTarget;this._halfBlur(e,f,n,r,a,"latitudinal",u),this._halfBlur(f,e,r,r,a,"longitudinal",u)}_halfBlur(e,n,r,a,u,f,c){const h=this._renderer,m=this._blurMaterial;f!=="latitudinal"&&f!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,y=new Kn(this._lodPlanes[a],m),v=m.uniforms,S=this._sizeLods[r]-1,E=isFinite(u)?Math.PI/(2*S):2*Math.PI/(2*Ds-1),T=u/E,x=isFinite(u)?1+Math.floor(g*T):Ds;x>Ds&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Ds}`);const _=[];let k=0;for(let O=0;O<Ds;++O){const j=O/T,L=Math.exp(-j*j/2);_.push(L),O===0?k+=L:O<x&&(k+=2*L)}for(let O=0;O<_.length;O++)_[O]=_[O]/k;v.envMap.value=e.texture,v.samples.value=x,v.weights.value=_,v.latitudinal.value=f==="latitudinal",c&&(v.poleAxis.value=c);const{_lodMax:I}=this;v.dTheta.value=E,v.mipInt.value=I-r;const b=this._sizeLods[a],W=3*b*(a>I-bo?a-I+bo:0),R=4*(this._cubeSize-b);lu(n,W,R,3*b,2*b),h.setRenderTarget(n),h.render(y,Cf)}}function GS(s){const e=[],n=[],r=[];let a=s;const u=s-bo+1+Um.length;for(let f=0;f<u;f++){const c=Math.pow(2,a);n.push(c);let h=1/c;f>s-bo?h=Um[f-s+bo-1]:f===0&&(h=0),r.push(h);const m=1/(c-2),g=-m,y=1+m,v=[g,g,y,g,y,y,g,g,y,y,g,y],S=6,E=6,T=3,x=2,_=1,k=new Float32Array(T*E*S),I=new Float32Array(x*E*S),b=new Float32Array(_*E*S);for(let R=0;R<S;R++){const O=R%3*2/3-1,j=R>2?0:-1,L=[O,j,0,O+2/3,j,0,O+2/3,j+1,0,O,j,0,O+2/3,j+1,0,O,j+1,0];k.set(L,T*E*R),I.set(v,x*E*R);const C=[R,R,R,R,R,R];b.set(C,_*E*R)}const W=new Cn;W.setAttribute("position",new ci(k,T)),W.setAttribute("uv",new ci(I,x)),W.setAttribute("faceIndex",new ci(b,_)),e.push(W),a>bo&&a--}return{lodPlanes:e,sizeLods:n,sigmas:r}}function Om(s,e,n){const r=new Os(s,e,n);return r.texture.mapping=Tu,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function lu(s,e,n,r,a){s.viewport.set(e,n,r,a),s.scissor.set(e,n,r,a)}function WS(s,e,n){const r=new Float32Array(Ds),a=new Z(0,1,0);return new Ji({name:"SphericalGaussianBlur",defines:{n:Ds,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Od(),fragmentShader:`

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
		`,blending:rs,depthTest:!1,depthWrite:!1})}function km(){return new Ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Od(),fragmentShader:`

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
		`,blending:rs,depthTest:!1,depthWrite:!1})}function Bm(){return new Ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Od(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:rs,depthTest:!1,depthWrite:!1})}function Od(){return`

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
	`}function XS(s){let e=new WeakMap,n=null;function r(c){if(c&&c.isTexture){const h=c.mapping,m=h===Yf||h===qf,g=h===Oo||h===ko;if(m||g){let y=e.get(c);const v=y!==void 0?y.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==v)return n===null&&(n=new Fm(s)),y=m?n.fromEquirectangular(c,y):n.fromCubemap(c,y),y.texture.pmremVersion=c.pmremVersion,e.set(c,y),y.texture;if(y!==void 0)return y.texture;{const S=c.image;return m&&S&&S.height>0||g&&S&&a(S)?(n===null&&(n=new Fm(s)),y=m?n.fromEquirectangular(c):n.fromCubemap(c),y.texture.pmremVersion=c.pmremVersion,e.set(c,y),c.addEventListener("dispose",u),y.texture):null}}}return c}function a(c){let h=0;const m=6;for(let g=0;g<m;g++)c[g]!==void 0&&h++;return h===m}function u(c){const h=c.target;h.removeEventListener("dispose",u);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function f(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:f}}function jS(s){const e={};function n(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return n(r)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(r){const a=n(r);return a===null&&Ro("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function YS(s,e,n,r){const a={},u=new WeakMap;function f(y){const v=y.target;v.index!==null&&e.remove(v.index);for(const E in v.attributes)e.remove(v.attributes[E]);v.removeEventListener("dispose",f),delete a[v.id];const S=u.get(v);S&&(e.remove(S),u.delete(v)),r.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,n.memory.geometries--}function c(y,v){return a[v.id]===!0||(v.addEventListener("dispose",f),a[v.id]=!0,n.memory.geometries++),v}function h(y){const v=y.attributes;for(const S in v)e.update(v[S],s.ARRAY_BUFFER)}function m(y){const v=[],S=y.index,E=y.attributes.position;let T=0;if(S!==null){const k=S.array;T=S.version;for(let I=0,b=k.length;I<b;I+=3){const W=k[I+0],R=k[I+1],O=k[I+2];v.push(W,R,R,O,O,W)}}else if(E!==void 0){const k=E.array;T=E.version;for(let I=0,b=k.length/3-1;I<b;I+=3){const W=I+0,R=I+1,O=I+2;v.push(W,R,R,O,O,W)}}else return;const x=new(wg(v)?Dg:Lg)(v,1);x.version=T;const _=u.get(y);_&&e.remove(_),u.set(y,x)}function g(y){const v=u.get(y);if(v){const S=y.index;S!==null&&v.version<S.version&&m(y)}else m(y);return u.get(y)}return{get:c,update:h,getWireframeAttribute:g}}function qS(s,e,n){let r;function a(v){r=v}let u,f;function c(v){u=v.type,f=v.bytesPerElement}function h(v,S){s.drawElements(r,S,u,v*f),n.update(S,r,1)}function m(v,S,E){E!==0&&(s.drawElementsInstanced(r,S,u,v*f,E),n.update(S,r,E))}function g(v,S,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,S,0,u,v,0,E);let x=0;for(let _=0;_<E;_++)x+=S[_];n.update(x,r,1)}function y(v,S,E,T){if(E===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let _=0;_<v.length;_++)m(v[_]/f,S[_],T[_]);else{x.multiDrawElementsInstancedWEBGL(r,S,0,u,v,0,T,0,E);let _=0;for(let k=0;k<E;k++)_+=S[k]*T[k];n.update(_,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=m,this.renderMultiDraw=g,this.renderMultiDrawInstances=y}function $S(s){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,f,c){switch(n.calls++,f){case s.TRIANGLES:n.triangles+=c*(u/3);break;case s.LINES:n.lines+=c*(u/2);break;case s.LINE_STRIP:n.lines+=c*(u-1);break;case s.LINE_LOOP:n.lines+=c*u;break;case s.POINTS:n.points+=c*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",f);break}}function a(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:a,update:r}}function KS(s,e,n){const r=new WeakMap,a=new un;function u(f,c,h){const m=f.morphTargetInfluences,g=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,y=g!==void 0?g.length:0;let v=r.get(c);if(v===void 0||v.count!==y){let C=function(){j.dispose(),r.delete(c),c.removeEventListener("dispose",C)};var S=C;v!==void 0&&v.texture.dispose();const E=c.morphAttributes.position!==void 0,T=c.morphAttributes.normal!==void 0,x=c.morphAttributes.color!==void 0,_=c.morphAttributes.position||[],k=c.morphAttributes.normal||[],I=c.morphAttributes.color||[];let b=0;E===!0&&(b=1),T===!0&&(b=2),x===!0&&(b=3);let W=c.attributes.position.count*b,R=1;W>e.maxTextureSize&&(R=Math.ceil(W/e.maxTextureSize),W=e.maxTextureSize);const O=new Float32Array(W*R*4*y),j=new Rg(O,W,R,y);j.type=Qi,j.needsUpdate=!0;const L=b*4;for(let P=0;P<y;P++){const J=_[P],q=k[P],ce=I[P],de=W*R*4*P;for(let oe=0;oe<J.count;oe++){const ue=oe*L;E===!0&&(a.fromBufferAttribute(J,oe),O[de+ue+0]=a.x,O[de+ue+1]=a.y,O[de+ue+2]=a.z,O[de+ue+3]=0),T===!0&&(a.fromBufferAttribute(q,oe),O[de+ue+4]=a.x,O[de+ue+5]=a.y,O[de+ue+6]=a.z,O[de+ue+7]=0),x===!0&&(a.fromBufferAttribute(ce,oe),O[de+ue+8]=a.x,O[de+ue+9]=a.y,O[de+ue+10]=a.z,O[de+ue+11]=ce.itemSize===4?a.w:1)}}v={count:y,texture:j,size:new Lt(W,R)},r.set(c,v),c.addEventListener("dispose",C)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",f.morphTexture,n);else{let E=0;for(let x=0;x<m.length;x++)E+=m[x];const T=c.morphTargetsRelative?1:1-E;h.getUniforms().setValue(s,"morphTargetBaseInfluence",T),h.getUniforms().setValue(s,"morphTargetInfluences",m)}h.getUniforms().setValue(s,"morphTargetsTexture",v.texture,n),h.getUniforms().setValue(s,"morphTargetsTextureSize",v.size)}return{update:u}}function ZS(s,e,n,r){let a=new WeakMap;function u(h){const m=r.render.frame,g=h.geometry,y=e.get(h,g);if(a.get(y)!==m&&(e.update(y),a.set(y,m)),h.isInstancedMesh&&(h.hasEventListener("dispose",c)===!1&&h.addEventListener("dispose",c),a.get(h)!==m&&(n.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&n.update(h.instanceColor,s.ARRAY_BUFFER),a.set(h,m))),h.isSkinnedMesh){const v=h.skeleton;a.get(v)!==m&&(v.update(),a.set(v,m))}return y}function f(){a=new WeakMap}function c(h){const m=h.target;m.removeEventListener("dispose",c),n.remove(m.instanceMatrix),m.instanceColor!==null&&n.remove(m.instanceColor)}return{update:u,dispose:f}}const zg=new Fn,zm=new kg(1,1),Hg=new Rg,Vg=new bv,Gg=new Ng,Hm=[],Vm=[],Gm=new Float32Array(16),Wm=new Float32Array(9),Xm=new Float32Array(4);function Xo(s,e,n){const r=s[0];if(r<=0||r>0)return s;const a=e*n;let u=Hm[a];if(u===void 0&&(u=new Float32Array(a),Hm[a]=u),e!==0){r.toArray(u,0);for(let f=1,c=0;f!==e;++f)c+=n,s[f].toArray(u,c)}return u}function mn(s,e){if(s.length!==e.length)return!1;for(let n=0,r=s.length;n<r;n++)if(s[n]!==e[n])return!1;return!0}function gn(s,e){for(let n=0,r=e.length;n<r;n++)s[n]=e[n]}function Au(s,e){let n=Vm[e];n===void 0&&(n=new Int32Array(e),Vm[e]=n);for(let r=0;r!==e;++r)n[r]=s.allocateTextureUnit();return n}function QS(s,e){const n=this.cache;n[0]!==e&&(s.uniform1f(this.addr,e),n[0]=e)}function JS(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(mn(n,e))return;s.uniform2fv(this.addr,e),gn(n,e)}}function eM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(mn(n,e))return;s.uniform3fv(this.addr,e),gn(n,e)}}function tM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(mn(n,e))return;s.uniform4fv(this.addr,e),gn(n,e)}}function nM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(mn(n,e))return;s.uniformMatrix2fv(this.addr,!1,e),gn(n,e)}else{if(mn(n,r))return;Xm.set(r),s.uniformMatrix2fv(this.addr,!1,Xm),gn(n,r)}}function iM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(mn(n,e))return;s.uniformMatrix3fv(this.addr,!1,e),gn(n,e)}else{if(mn(n,r))return;Wm.set(r),s.uniformMatrix3fv(this.addr,!1,Wm),gn(n,r)}}function rM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(mn(n,e))return;s.uniformMatrix4fv(this.addr,!1,e),gn(n,e)}else{if(mn(n,r))return;Gm.set(r),s.uniformMatrix4fv(this.addr,!1,Gm),gn(n,r)}}function sM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1i(this.addr,e),n[0]=e)}function oM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(mn(n,e))return;s.uniform2iv(this.addr,e),gn(n,e)}}function aM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(mn(n,e))return;s.uniform3iv(this.addr,e),gn(n,e)}}function lM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(mn(n,e))return;s.uniform4iv(this.addr,e),gn(n,e)}}function uM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1ui(this.addr,e),n[0]=e)}function cM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(mn(n,e))return;s.uniform2uiv(this.addr,e),gn(n,e)}}function fM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(mn(n,e))return;s.uniform3uiv(this.addr,e),gn(n,e)}}function dM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(mn(n,e))return;s.uniform4uiv(this.addr,e),gn(n,e)}}function hM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let u;this.type===s.SAMPLER_2D_SHADOW?(zm.compareFunction=Tg,u=zm):u=zg,n.setTexture2D(e||u,a)}function pM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture3D(e||Vg,a)}function mM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTextureCube(e||Gg,a)}function gM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture2DArray(e||Hg,a)}function _M(s){switch(s){case 5126:return QS;case 35664:return JS;case 35665:return eM;case 35666:return tM;case 35674:return nM;case 35675:return iM;case 35676:return rM;case 5124:case 35670:return sM;case 35667:case 35671:return oM;case 35668:case 35672:return aM;case 35669:case 35673:return lM;case 5125:return uM;case 36294:return cM;case 36295:return fM;case 36296:return dM;case 35678:case 36198:case 36298:case 36306:case 35682:return hM;case 35679:case 36299:case 36307:return pM;case 35680:case 36300:case 36308:case 36293:return mM;case 36289:case 36303:case 36311:case 36292:return gM}}function vM(s,e){s.uniform1fv(this.addr,e)}function xM(s,e){const n=Xo(e,this.size,2);s.uniform2fv(this.addr,n)}function yM(s,e){const n=Xo(e,this.size,3);s.uniform3fv(this.addr,n)}function SM(s,e){const n=Xo(e,this.size,4);s.uniform4fv(this.addr,n)}function MM(s,e){const n=Xo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,n)}function EM(s,e){const n=Xo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,n)}function TM(s,e){const n=Xo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,n)}function wM(s,e){s.uniform1iv(this.addr,e)}function AM(s,e){s.uniform2iv(this.addr,e)}function RM(s,e){s.uniform3iv(this.addr,e)}function CM(s,e){s.uniform4iv(this.addr,e)}function bM(s,e){s.uniform1uiv(this.addr,e)}function PM(s,e){s.uniform2uiv(this.addr,e)}function LM(s,e){s.uniform3uiv(this.addr,e)}function DM(s,e){s.uniform4uiv(this.addr,e)}function UM(s,e,n){const r=this.cache,a=e.length,u=Au(n,a);mn(r,u)||(s.uniform1iv(this.addr,u),gn(r,u));for(let f=0;f!==a;++f)n.setTexture2D(e[f]||zg,u[f])}function IM(s,e,n){const r=this.cache,a=e.length,u=Au(n,a);mn(r,u)||(s.uniform1iv(this.addr,u),gn(r,u));for(let f=0;f!==a;++f)n.setTexture3D(e[f]||Vg,u[f])}function NM(s,e,n){const r=this.cache,a=e.length,u=Au(n,a);mn(r,u)||(s.uniform1iv(this.addr,u),gn(r,u));for(let f=0;f!==a;++f)n.setTextureCube(e[f]||Gg,u[f])}function FM(s,e,n){const r=this.cache,a=e.length,u=Au(n,a);mn(r,u)||(s.uniform1iv(this.addr,u),gn(r,u));for(let f=0;f!==a;++f)n.setTexture2DArray(e[f]||Hg,u[f])}function OM(s){switch(s){case 5126:return vM;case 35664:return xM;case 35665:return yM;case 35666:return SM;case 35674:return MM;case 35675:return EM;case 35676:return TM;case 5124:case 35670:return wM;case 35667:case 35671:return AM;case 35668:case 35672:return RM;case 35669:case 35673:return CM;case 5125:return bM;case 36294:return PM;case 36295:return LM;case 36296:return DM;case 35678:case 36198:case 36298:case 36306:case 35682:return UM;case 35679:case 36299:case 36307:return IM;case 35680:case 36300:case 36308:case 36293:return NM;case 36289:case 36303:case 36311:case 36292:return FM}}class kM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.setValue=_M(n.type)}}class BM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=OM(n.type)}}class zM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,r){const a=this.seq;for(let u=0,f=a.length;u!==f;++u){const c=a[u];c.setValue(e,n[c.id],r)}}}const Uf=/(\w+)(\])?(\[|\.)?/g;function jm(s,e){s.seq.push(e),s.map[e.id]=e}function HM(s,e,n){const r=s.name,a=r.length;for(Uf.lastIndex=0;;){const u=Uf.exec(r),f=Uf.lastIndex;let c=u[1];const h=u[2]==="]",m=u[3];if(h&&(c=c|0),m===void 0||m==="["&&f+2===a){jm(n,m===void 0?new kM(c,s,e):new BM(c,s,e));break}else{let y=n.map[c];y===void 0&&(y=new zM(c),jm(n,y)),n=y}}}class gu{constructor(e,n){this.seq=[],this.map={};const r=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const u=e.getActiveUniform(n,a),f=e.getUniformLocation(n,u.name);HM(u,f,this)}}setValue(e,n,r,a){const u=this.map[n];u!==void 0&&u.setValue(e,r,a)}setOptional(e,n,r){const a=n[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,n,r,a){for(let u=0,f=n.length;u!==f;++u){const c=n[u],h=r[c.id];h.needsUpdate!==!1&&c.setValue(e,h.value,a)}}static seqWithValue(e,n){const r=[];for(let a=0,u=e.length;a!==u;++a){const f=e[a];f.id in n&&r.push(f)}return r}}function Ym(s,e,n){const r=s.createShader(e);return s.shaderSource(r,n),s.compileShader(r),r}const VM=37297;let GM=0;function WM(s,e){const n=s.split(`
`),r=[],a=Math.max(e-6,0),u=Math.min(e+6,n.length);for(let f=a;f<u;f++){const c=f+1;r.push(`${c===e?">":" "} ${c}: ${n[f]}`)}return r.join(`
`)}const qm=new _t;function XM(s){kt._getMatrix(qm,kt.workingColorSpace,s);const e=`mat3( ${qm.elements.map(n=>n.toFixed(4))} )`;switch(kt.getTransfer(s)){case _u:return[e,"LinearTransferOETF"];case Ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function $m(s,e,n){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const u=/ERROR: 0:(\d+)/.exec(a);if(u){const f=parseInt(u[1]);return n.toUpperCase()+`

`+a+`

`+WM(s.getShaderSource(e),f)}else return a}function jM(s,e){const n=XM(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function YM(s,e){let n;switch(e){case ev:n="Linear";break;case tv:n="Reinhard";break;case nv:n="Cineon";break;case iv:n="ACESFilmic";break;case sv:n="AgX";break;case ov:n="Neutral";break;case rv:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+s+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const uu=new Z;function qM(){kt.getLuminanceCoefficients(uu);const s=uu.x.toFixed(4),e=uu.y.toFixed(4),n=uu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $M(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ua).join(`
`)}function KM(s){const e=[];for(const n in s){const r=s[n];r!==!1&&e.push("#define "+n+" "+r)}return e.join(`
`)}function ZM(s,e){const n={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const u=s.getActiveAttrib(e,a),f=u.name;let c=1;u.type===s.FLOAT_MAT2&&(c=2),u.type===s.FLOAT_MAT3&&(c=3),u.type===s.FLOAT_MAT4&&(c=4),n[f]={type:u.type,location:s.getAttribLocation(e,f),locationSize:c}}return n}function Ua(s){return s!==""}function Km(s,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zm(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const QM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ad(s){return s.replace(QM,eE)}const JM=new Map;function eE(s,e){let n=yt[e];if(n===void 0){const r=JM.get(e);if(r!==void 0)n=yt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return Ad(n)}const tE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qm(s){return s.replace(tE,nE)}function nE(s,e,n,r){let a="";for(let u=parseInt(e);u<parseInt(n);u++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return a}function Jm(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function iE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===dg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===U_?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Sr&&(e="SHADOWMAP_TYPE_VSM"),e}function rE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Oo:case ko:e="ENVMAP_TYPE_CUBE";break;case Tu:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ko:e="ENVMAP_MODE_REFRACTION";break}return e}function oE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case hg:e="ENVMAP_BLENDING_MULTIPLY";break;case Q_:e="ENVMAP_BLENDING_MIX";break;case J_:e="ENVMAP_BLENDING_ADD";break}return e}function aE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:r,maxMip:n}}function lE(s,e,n,r){const a=s.getContext(),u=n.defines;let f=n.vertexShader,c=n.fragmentShader;const h=iE(n),m=rE(n),g=sE(n),y=oE(n),v=aE(n),S=$M(n),E=KM(u),T=a.createProgram();let x,_,k=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(x=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter(Ua).join(`
`),x.length>0&&(x+=`
`),_=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter(Ua).join(`
`),_.length>0&&(_+=`
`)):(x=[Jm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+g:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ua).join(`
`),_=[Jm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+m:"",n.envMap?"#define "+g:"",n.envMap?"#define "+y:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==ss?"#define TONE_MAPPING":"",n.toneMapping!==ss?yt.tonemapping_pars_fragment:"",n.toneMapping!==ss?YM("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,jM("linearToOutputTexel",n.outputColorSpace),qM(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ua).join(`
`)),f=Ad(f),f=Km(f,n),f=Zm(f,n),c=Ad(c),c=Km(c,n),c=Zm(c,n),f=Qm(f),c=Qm(c),n.isRawShaderMaterial!==!0&&(k=`#version 300 es
`,x=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,_=["#define varying in",n.glslVersion===lm?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===lm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const I=k+x+f,b=k+_+c,W=Ym(a,a.VERTEX_SHADER,I),R=Ym(a,a.FRAGMENT_SHADER,b);a.attachShader(T,W),a.attachShader(T,R),n.index0AttributeName!==void 0?a.bindAttribLocation(T,0,n.index0AttributeName):n.morphTargets===!0&&a.bindAttribLocation(T,0,"position"),a.linkProgram(T);function O(P){if(s.debug.checkShaderErrors){const J=a.getProgramInfoLog(T).trim(),q=a.getShaderInfoLog(W).trim(),ce=a.getShaderInfoLog(R).trim();let de=!0,oe=!0;if(a.getProgramParameter(T,a.LINK_STATUS)===!1)if(de=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,T,W,R);else{const ue=$m(a,W,"vertex"),H=$m(a,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(T,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+J+`
`+ue+`
`+H)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(q===""||ce==="")&&(oe=!1);oe&&(P.diagnostics={runnable:de,programLog:J,vertexShader:{log:q,prefix:x},fragmentShader:{log:ce,prefix:_}})}a.deleteShader(W),a.deleteShader(R),j=new gu(a,T),L=ZM(a,T)}let j;this.getUniforms=function(){return j===void 0&&O(this),j};let L;this.getAttributes=function(){return L===void 0&&O(this),L};let C=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=a.getProgramParameter(T,VM)),C},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(T),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=GM++,this.cacheKey=e,this.usedTimes=1,this.program=T,this.vertexShader=W,this.fragmentShader=R,this}let uE=0;class cE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(n),u=this._getShaderStage(r),f=this._getShaderCacheForMaterial(e);return f.has(a)===!1&&(f.add(a),a.usedTimes++),f.has(u)===!1&&(f.add(u),u.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const r of n)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let r=n.get(e);return r===void 0&&(r=new Set,n.set(e,r)),r}_getShaderStage(e){const n=this.shaderCache;let r=n.get(e);return r===void 0&&(r=new fE(e),n.set(e,r)),r}}class fE{constructor(e){this.id=uE++,this.code=e,this.usedTimes=0}}function dE(s,e,n,r,a,u,f){const c=new bg,h=new cE,m=new Set,g=[],y=a.logarithmicDepthBuffer,v=a.vertexTextures;let S=a.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function T(L){return m.add(L),L===0?"uv":`uv${L}`}function x(L,C,P,J,q){const ce=J.fog,de=q.geometry,oe=L.isMeshStandardMaterial?J.environment:null,ue=(L.isMeshStandardMaterial?n:e).get(L.envMap||oe),H=ue&&ue.mapping===Tu?ue.image.height:null,fe=E[L.type];L.precision!==null&&(S=a.getMaxPrecision(L.precision),S!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",S,"instead."));const ee=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,F=ee!==void 0?ee.length:0;let se=0;de.morphAttributes.position!==void 0&&(se=1),de.morphAttributes.normal!==void 0&&(se=2),de.morphAttributes.color!==void 0&&(se=3);let pe,Y,ae,he;if(fe){const At=$i[fe];pe=At.vertexShader,Y=At.fragmentShader}else pe=L.vertexShader,Y=L.fragmentShader,h.update(L),ae=h.getVertexShaderID(L),he=h.getFragmentShaderID(L);const _e=s.getRenderTarget(),Re=s.state.buffers.depth.getReversed(),Le=q.isInstancedMesh===!0,Oe=q.isBatchedMesh===!0,pt=!!L.map,Pe=!!L.matcap,Qe=!!ue,z=!!L.aoMap,Ct=!!L.lightMap,mt=!!L.bumpMap,ct=!!L.normalMap,Ye=!!L.displacementMap,vt=!!L.emissiveMap,ze=!!L.metalnessMap,U=!!L.roughnessMap,w=L.anisotropy>0,te=L.clearcoat>0,ve=L.dispersion>0,xe=L.iridescence>0,ge=L.sheen>0,$e=L.transmission>0,De=w&&!!L.anisotropyMap,He=te&&!!L.clearcoatMap,gt=te&&!!L.clearcoatNormalMap,Ce=te&&!!L.clearcoatRoughnessMap,Ge=xe&&!!L.iridescenceMap,et=xe&&!!L.iridescenceThicknessMap,st=ge&&!!L.sheenColorMap,We=ge&&!!L.sheenRoughnessMap,xt=!!L.specularMap,it=!!L.specularColorMap,It=!!L.specularIntensityMap,D=$e&&!!L.transmissionMap,we=$e&&!!L.thicknessMap,ne=!!L.gradientMap,me=!!L.alphaMap,Ne=L.alphaTest>0,Ie=!!L.alphaHash,ot=!!L.extensions;let zt=ss;L.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(zt=s.toneMapping);const en={shaderID:fe,shaderType:L.type,shaderName:L.name,vertexShader:pe,fragmentShader:Y,defines:L.defines,customVertexShaderID:ae,customFragmentShaderID:he,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:S,batching:Oe,batchingColor:Oe&&q._colorsTexture!==null,instancing:Le,instancingColor:Le&&q.instanceColor!==null,instancingMorph:Le&&q.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:_e===null?s.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:Ho,alphaToCoverage:!!L.alphaToCoverage,map:pt,matcap:Pe,envMap:Qe,envMapMode:Qe&&ue.mapping,envMapCubeUVHeight:H,aoMap:z,lightMap:Ct,bumpMap:mt,normalMap:ct,displacementMap:v&&Ye,emissiveMap:vt,normalMapObjectSpace:ct&&L.normalMapType===fv,normalMapTangentSpace:ct&&L.normalMapType===cv,metalnessMap:ze,roughnessMap:U,anisotropy:w,anisotropyMap:De,clearcoat:te,clearcoatMap:He,clearcoatNormalMap:gt,clearcoatRoughnessMap:Ce,dispersion:ve,iridescence:xe,iridescenceMap:Ge,iridescenceThicknessMap:et,sheen:ge,sheenColorMap:st,sheenRoughnessMap:We,specularMap:xt,specularColorMap:it,specularIntensityMap:It,transmission:$e,transmissionMap:D,thicknessMap:we,gradientMap:ne,opaque:L.transparent===!1&&L.blending===Do&&L.alphaToCoverage===!1,alphaMap:me,alphaTest:Ne,alphaHash:Ie,combine:L.combine,mapUv:pt&&T(L.map.channel),aoMapUv:z&&T(L.aoMap.channel),lightMapUv:Ct&&T(L.lightMap.channel),bumpMapUv:mt&&T(L.bumpMap.channel),normalMapUv:ct&&T(L.normalMap.channel),displacementMapUv:Ye&&T(L.displacementMap.channel),emissiveMapUv:vt&&T(L.emissiveMap.channel),metalnessMapUv:ze&&T(L.metalnessMap.channel),roughnessMapUv:U&&T(L.roughnessMap.channel),anisotropyMapUv:De&&T(L.anisotropyMap.channel),clearcoatMapUv:He&&T(L.clearcoatMap.channel),clearcoatNormalMapUv:gt&&T(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ce&&T(L.clearcoatRoughnessMap.channel),iridescenceMapUv:Ge&&T(L.iridescenceMap.channel),iridescenceThicknessMapUv:et&&T(L.iridescenceThicknessMap.channel),sheenColorMapUv:st&&T(L.sheenColorMap.channel),sheenRoughnessMapUv:We&&T(L.sheenRoughnessMap.channel),specularMapUv:xt&&T(L.specularMap.channel),specularColorMapUv:it&&T(L.specularColorMap.channel),specularIntensityMapUv:It&&T(L.specularIntensityMap.channel),transmissionMapUv:D&&T(L.transmissionMap.channel),thicknessMapUv:we&&T(L.thicknessMap.channel),alphaMapUv:me&&T(L.alphaMap.channel),vertexTangents:!!de.attributes.tangent&&(ct||w),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!de.attributes.uv&&(pt||me),fog:!!ce,useFog:L.fog===!0,fogExp2:!!ce&&ce.isFogExp2,flatShading:L.flatShading===!0,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:y,reverseDepthBuffer:Re,skinning:q.isSkinnedMesh===!0,morphTargets:de.morphAttributes.position!==void 0,morphNormals:de.morphAttributes.normal!==void 0,morphColors:de.morphAttributes.color!==void 0,morphTargetsCount:F,morphTextureStride:se,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:f.numPlanes,numClipIntersection:f.numIntersection,dithering:L.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:zt,decodeVideoTexture:pt&&L.map.isVideoTexture===!0&&kt.getTransfer(L.map.colorSpace)===Ht,decodeVideoTextureEmissive:vt&&L.emissiveMap.isVideoTexture===!0&&kt.getTransfer(L.emissiveMap.colorSpace)===Ht,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===Bi,flipSided:L.side===Zn,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:ot&&L.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&L.extensions.multiDraw===!0||Oe)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return en.vertexUv1s=m.has(1),en.vertexUv2s=m.has(2),en.vertexUv3s=m.has(3),m.clear(),en}function _(L){const C=[];if(L.shaderID?C.push(L.shaderID):(C.push(L.customVertexShaderID),C.push(L.customFragmentShaderID)),L.defines!==void 0)for(const P in L.defines)C.push(P),C.push(L.defines[P]);return L.isRawShaderMaterial===!1&&(k(C,L),I(C,L),C.push(s.outputColorSpace)),C.push(L.customProgramCacheKey),C.join()}function k(L,C){L.push(C.precision),L.push(C.outputColorSpace),L.push(C.envMapMode),L.push(C.envMapCubeUVHeight),L.push(C.mapUv),L.push(C.alphaMapUv),L.push(C.lightMapUv),L.push(C.aoMapUv),L.push(C.bumpMapUv),L.push(C.normalMapUv),L.push(C.displacementMapUv),L.push(C.emissiveMapUv),L.push(C.metalnessMapUv),L.push(C.roughnessMapUv),L.push(C.anisotropyMapUv),L.push(C.clearcoatMapUv),L.push(C.clearcoatNormalMapUv),L.push(C.clearcoatRoughnessMapUv),L.push(C.iridescenceMapUv),L.push(C.iridescenceThicknessMapUv),L.push(C.sheenColorMapUv),L.push(C.sheenRoughnessMapUv),L.push(C.specularMapUv),L.push(C.specularColorMapUv),L.push(C.specularIntensityMapUv),L.push(C.transmissionMapUv),L.push(C.thicknessMapUv),L.push(C.combine),L.push(C.fogExp2),L.push(C.sizeAttenuation),L.push(C.morphTargetsCount),L.push(C.morphAttributeCount),L.push(C.numDirLights),L.push(C.numPointLights),L.push(C.numSpotLights),L.push(C.numSpotLightMaps),L.push(C.numHemiLights),L.push(C.numRectAreaLights),L.push(C.numDirLightShadows),L.push(C.numPointLightShadows),L.push(C.numSpotLightShadows),L.push(C.numSpotLightShadowsWithMaps),L.push(C.numLightProbes),L.push(C.shadowMapType),L.push(C.toneMapping),L.push(C.numClippingPlanes),L.push(C.numClipIntersection),L.push(C.depthPacking)}function I(L,C){c.disableAll(),C.supportsVertexTextures&&c.enable(0),C.instancing&&c.enable(1),C.instancingColor&&c.enable(2),C.instancingMorph&&c.enable(3),C.matcap&&c.enable(4),C.envMap&&c.enable(5),C.normalMapObjectSpace&&c.enable(6),C.normalMapTangentSpace&&c.enable(7),C.clearcoat&&c.enable(8),C.iridescence&&c.enable(9),C.alphaTest&&c.enable(10),C.vertexColors&&c.enable(11),C.vertexAlphas&&c.enable(12),C.vertexUv1s&&c.enable(13),C.vertexUv2s&&c.enable(14),C.vertexUv3s&&c.enable(15),C.vertexTangents&&c.enable(16),C.anisotropy&&c.enable(17),C.alphaHash&&c.enable(18),C.batching&&c.enable(19),C.dispersion&&c.enable(20),C.batchingColor&&c.enable(21),L.push(c.mask),c.disableAll(),C.fog&&c.enable(0),C.useFog&&c.enable(1),C.flatShading&&c.enable(2),C.logarithmicDepthBuffer&&c.enable(3),C.reverseDepthBuffer&&c.enable(4),C.skinning&&c.enable(5),C.morphTargets&&c.enable(6),C.morphNormals&&c.enable(7),C.morphColors&&c.enable(8),C.premultipliedAlpha&&c.enable(9),C.shadowMapEnabled&&c.enable(10),C.doubleSided&&c.enable(11),C.flipSided&&c.enable(12),C.useDepthPacking&&c.enable(13),C.dithering&&c.enable(14),C.transmission&&c.enable(15),C.sheen&&c.enable(16),C.opaque&&c.enable(17),C.pointsUvs&&c.enable(18),C.decodeVideoTexture&&c.enable(19),C.decodeVideoTextureEmissive&&c.enable(20),C.alphaToCoverage&&c.enable(21),L.push(c.mask)}function b(L){const C=E[L.type];let P;if(C){const J=$i[C];P=Hv.clone(J.uniforms)}else P=L.uniforms;return P}function W(L,C){let P;for(let J=0,q=g.length;J<q;J++){const ce=g[J];if(ce.cacheKey===C){P=ce,++P.usedTimes;break}}return P===void 0&&(P=new lE(s,C,L,u),g.push(P)),P}function R(L){if(--L.usedTimes===0){const C=g.indexOf(L);g[C]=g[g.length-1],g.pop(),L.destroy()}}function O(L){h.remove(L)}function j(){h.dispose()}return{getParameters:x,getProgramCacheKey:_,getUniforms:b,acquireProgram:W,releaseProgram:R,releaseShaderCache:O,programs:g,dispose:j}}function hE(){let s=new WeakMap;function e(f){return s.has(f)}function n(f){let c=s.get(f);return c===void 0&&(c={},s.set(f,c)),c}function r(f){s.delete(f)}function a(f,c,h){s.get(f)[c]=h}function u(){s=new WeakMap}return{has:e,get:n,remove:r,update:a,dispose:u}}function pE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function eg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function tg(){const s=[];let e=0;const n=[],r=[],a=[];function u(){e=0,n.length=0,r.length=0,a.length=0}function f(y,v,S,E,T,x){let _=s[e];return _===void 0?(_={id:y.id,object:y,geometry:v,material:S,groupOrder:E,renderOrder:y.renderOrder,z:T,group:x},s[e]=_):(_.id=y.id,_.object=y,_.geometry=v,_.material=S,_.groupOrder=E,_.renderOrder=y.renderOrder,_.z=T,_.group=x),e++,_}function c(y,v,S,E,T,x){const _=f(y,v,S,E,T,x);S.transmission>0?r.push(_):S.transparent===!0?a.push(_):n.push(_)}function h(y,v,S,E,T,x){const _=f(y,v,S,E,T,x);S.transmission>0?r.unshift(_):S.transparent===!0?a.unshift(_):n.unshift(_)}function m(y,v){n.length>1&&n.sort(y||pE),r.length>1&&r.sort(v||eg),a.length>1&&a.sort(v||eg)}function g(){for(let y=e,v=s.length;y<v;y++){const S=s[y];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:n,transmissive:r,transparent:a,init:u,push:c,unshift:h,finish:g,sort:m}}function mE(){let s=new WeakMap;function e(r,a){const u=s.get(r);let f;return u===void 0?(f=new tg,s.set(r,[f])):a>=u.length?(f=new tg,u.push(f)):f=u[a],f}function n(){s=new WeakMap}return{get:e,dispose:n}}function gE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new Z,color:new bt};break;case"SpotLight":n={position:new Z,direction:new Z,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new Z,color:new bt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new Z,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":n={color:new bt,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return s[e.id]=n,n}}}function _E(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=n,n}}}let vE=0;function xE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function yE(s){const e=new gE,n=_E(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new Z);const a=new Z,u=new an,f=new an;function c(m){let g=0,y=0,v=0;for(let L=0;L<9;L++)r.probe[L].set(0,0,0);let S=0,E=0,T=0,x=0,_=0,k=0,I=0,b=0,W=0,R=0,O=0;m.sort(xE);for(let L=0,C=m.length;L<C;L++){const P=m[L],J=P.color,q=P.intensity,ce=P.distance,de=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)g+=J.r*q,y+=J.g*q,v+=J.b*q;else if(P.isLightProbe){for(let oe=0;oe<9;oe++)r.probe[oe].addScaledVector(P.sh.coefficients[oe],q);O++}else if(P.isDirectionalLight){const oe=e.get(P);if(oe.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ue=P.shadow,H=n.get(P);H.shadowIntensity=ue.intensity,H.shadowBias=ue.bias,H.shadowNormalBias=ue.normalBias,H.shadowRadius=ue.radius,H.shadowMapSize=ue.mapSize,r.directionalShadow[S]=H,r.directionalShadowMap[S]=de,r.directionalShadowMatrix[S]=P.shadow.matrix,k++}r.directional[S]=oe,S++}else if(P.isSpotLight){const oe=e.get(P);oe.position.setFromMatrixPosition(P.matrixWorld),oe.color.copy(J).multiplyScalar(q),oe.distance=ce,oe.coneCos=Math.cos(P.angle),oe.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),oe.decay=P.decay,r.spot[T]=oe;const ue=P.shadow;if(P.map&&(r.spotLightMap[W]=P.map,W++,ue.updateMatrices(P),P.castShadow&&R++),r.spotLightMatrix[T]=ue.matrix,P.castShadow){const H=n.get(P);H.shadowIntensity=ue.intensity,H.shadowBias=ue.bias,H.shadowNormalBias=ue.normalBias,H.shadowRadius=ue.radius,H.shadowMapSize=ue.mapSize,r.spotShadow[T]=H,r.spotShadowMap[T]=de,b++}T++}else if(P.isRectAreaLight){const oe=e.get(P);oe.color.copy(J).multiplyScalar(q),oe.halfWidth.set(P.width*.5,0,0),oe.halfHeight.set(0,P.height*.5,0),r.rectArea[x]=oe,x++}else if(P.isPointLight){const oe=e.get(P);if(oe.color.copy(P.color).multiplyScalar(P.intensity),oe.distance=P.distance,oe.decay=P.decay,P.castShadow){const ue=P.shadow,H=n.get(P);H.shadowIntensity=ue.intensity,H.shadowBias=ue.bias,H.shadowNormalBias=ue.normalBias,H.shadowRadius=ue.radius,H.shadowMapSize=ue.mapSize,H.shadowCameraNear=ue.camera.near,H.shadowCameraFar=ue.camera.far,r.pointShadow[E]=H,r.pointShadowMap[E]=de,r.pointShadowMatrix[E]=P.shadow.matrix,I++}r.point[E]=oe,E++}else if(P.isHemisphereLight){const oe=e.get(P);oe.skyColor.copy(P.color).multiplyScalar(q),oe.groundColor.copy(P.groundColor).multiplyScalar(q),r.hemi[_]=oe,_++}}x>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Fe.LTC_FLOAT_1,r.rectAreaLTC2=Fe.LTC_FLOAT_2):(r.rectAreaLTC1=Fe.LTC_HALF_1,r.rectAreaLTC2=Fe.LTC_HALF_2)),r.ambient[0]=g,r.ambient[1]=y,r.ambient[2]=v;const j=r.hash;(j.directionalLength!==S||j.pointLength!==E||j.spotLength!==T||j.rectAreaLength!==x||j.hemiLength!==_||j.numDirectionalShadows!==k||j.numPointShadows!==I||j.numSpotShadows!==b||j.numSpotMaps!==W||j.numLightProbes!==O)&&(r.directional.length=S,r.spot.length=T,r.rectArea.length=x,r.point.length=E,r.hemi.length=_,r.directionalShadow.length=k,r.directionalShadowMap.length=k,r.pointShadow.length=I,r.pointShadowMap.length=I,r.spotShadow.length=b,r.spotShadowMap.length=b,r.directionalShadowMatrix.length=k,r.pointShadowMatrix.length=I,r.spotLightMatrix.length=b+W-R,r.spotLightMap.length=W,r.numSpotLightShadowsWithMaps=R,r.numLightProbes=O,j.directionalLength=S,j.pointLength=E,j.spotLength=T,j.rectAreaLength=x,j.hemiLength=_,j.numDirectionalShadows=k,j.numPointShadows=I,j.numSpotShadows=b,j.numSpotMaps=W,j.numLightProbes=O,r.version=vE++)}function h(m,g){let y=0,v=0,S=0,E=0,T=0;const x=g.matrixWorldInverse;for(let _=0,k=m.length;_<k;_++){const I=m[_];if(I.isDirectionalLight){const b=r.directional[y];b.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(x),y++}else if(I.isSpotLight){const b=r.spot[S];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(x),b.direction.setFromMatrixPosition(I.matrixWorld),a.setFromMatrixPosition(I.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(x),S++}else if(I.isRectAreaLight){const b=r.rectArea[E];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(x),f.identity(),u.copy(I.matrixWorld),u.premultiply(x),f.extractRotation(u),b.halfWidth.set(I.width*.5,0,0),b.halfHeight.set(0,I.height*.5,0),b.halfWidth.applyMatrix4(f),b.halfHeight.applyMatrix4(f),E++}else if(I.isPointLight){const b=r.point[v];b.position.setFromMatrixPosition(I.matrixWorld),b.position.applyMatrix4(x),v++}else if(I.isHemisphereLight){const b=r.hemi[T];b.direction.setFromMatrixPosition(I.matrixWorld),b.direction.transformDirection(x),T++}}}return{setup:c,setupView:h,state:r}}function ng(s){const e=new yE(s),n=[],r=[];function a(g){m.camera=g,n.length=0,r.length=0}function u(g){n.push(g)}function f(g){r.push(g)}function c(){e.setup(n)}function h(g){e.setupView(n,g)}const m={lightsArray:n,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:c,setupLightsView:h,pushLight:u,pushShadow:f}}function SE(s){let e=new WeakMap;function n(a,u=0){const f=e.get(a);let c;return f===void 0?(c=new ng(s),e.set(a,[c])):u>=f.length?(c=new ng(s),f.push(c)):c=f[u],c}function r(){e=new WeakMap}return{get:n,dispose:r}}const ME=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,EE=`uniform sampler2D shadow_pass;
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
}`;function TE(s,e,n){let r=new Og;const a=new Lt,u=new Lt,f=new un,c=new Zv({depthPacking:uv}),h=new Qv,m={},g=n.maxTextureSize,y={[as]:Zn,[Zn]:as,[Bi]:Bi},v=new Ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:ME,fragmentShader:EE}),S=v.clone();S.defines.HORIZONTAL_PASS=1;const E=new Cn;E.setAttribute("position",new ci(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const T=new Kn(E,v),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=dg;let _=this.type;this.render=function(R,O,j){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||R.length===0)return;const L=s.getRenderTarget(),C=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),J=s.state;J.setBlending(rs),J.buffers.color.setClear(1,1,1,1),J.buffers.depth.setTest(!0),J.setScissorTest(!1);const q=_!==Sr&&this.type===Sr,ce=_===Sr&&this.type!==Sr;for(let de=0,oe=R.length;de<oe;de++){const ue=R[de],H=ue.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",ue,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;a.copy(H.mapSize);const fe=H.getFrameExtents();if(a.multiply(fe),u.copy(H.mapSize),(a.x>g||a.y>g)&&(a.x>g&&(u.x=Math.floor(g/fe.x),a.x=u.x*fe.x,H.mapSize.x=u.x),a.y>g&&(u.y=Math.floor(g/fe.y),a.y=u.y*fe.y,H.mapSize.y=u.y)),H.map===null||q===!0||ce===!0){const F=this.type!==Sr?{minFilter:ui,magFilter:ui}:{};H.map!==null&&H.map.dispose(),H.map=new Os(a.x,a.y,F),H.map.texture.name=ue.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const ee=H.getViewportCount();for(let F=0;F<ee;F++){const se=H.getViewport(F);f.set(u.x*se.x,u.y*se.y,u.x*se.z,u.y*se.w),J.viewport(f),H.updateMatrices(ue,F),r=H.getFrustum(),b(O,j,H.camera,ue,this.type)}H.isPointLightShadow!==!0&&this.type===Sr&&k(H,j),H.needsUpdate=!1}_=this.type,x.needsUpdate=!1,s.setRenderTarget(L,C,P)};function k(R,O){const j=e.update(T);v.defines.VSM_SAMPLES!==R.blurSamples&&(v.defines.VSM_SAMPLES=R.blurSamples,S.defines.VSM_SAMPLES=R.blurSamples,v.needsUpdate=!0,S.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Os(a.x,a.y)),v.uniforms.shadow_pass.value=R.map.texture,v.uniforms.resolution.value=R.mapSize,v.uniforms.radius.value=R.radius,s.setRenderTarget(R.mapPass),s.clear(),s.renderBufferDirect(O,null,j,v,T,null),S.uniforms.shadow_pass.value=R.mapPass.texture,S.uniforms.resolution.value=R.mapSize,S.uniforms.radius.value=R.radius,s.setRenderTarget(R.map),s.clear(),s.renderBufferDirect(O,null,j,S,T,null)}function I(R,O,j,L){let C=null;const P=j.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)C=P;else if(C=j.isPointLight===!0?h:c,s.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0){const J=C.uuid,q=O.uuid;let ce=m[J];ce===void 0&&(ce={},m[J]=ce);let de=ce[q];de===void 0&&(de=C.clone(),ce[q]=de,O.addEventListener("dispose",W)),C=de}if(C.visible=O.visible,C.wireframe=O.wireframe,L===Sr?C.side=O.shadowSide!==null?O.shadowSide:O.side:C.side=O.shadowSide!==null?O.shadowSide:y[O.side],C.alphaMap=O.alphaMap,C.alphaTest=O.alphaTest,C.map=O.map,C.clipShadows=O.clipShadows,C.clippingPlanes=O.clippingPlanes,C.clipIntersection=O.clipIntersection,C.displacementMap=O.displacementMap,C.displacementScale=O.displacementScale,C.displacementBias=O.displacementBias,C.wireframeLinewidth=O.wireframeLinewidth,C.linewidth=O.linewidth,j.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const J=s.properties.get(C);J.light=j}return C}function b(R,O,j,L,C){if(R.visible===!1)return;if(R.layers.test(O.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&C===Sr)&&(!R.frustumCulled||r.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,R.matrixWorld);const q=e.update(R),ce=R.material;if(Array.isArray(ce)){const de=q.groups;for(let oe=0,ue=de.length;oe<ue;oe++){const H=de[oe],fe=ce[H.materialIndex];if(fe&&fe.visible){const ee=I(R,fe,L,C);R.onBeforeShadow(s,R,O,j,q,ee,H),s.renderBufferDirect(j,null,q,ee,R,H),R.onAfterShadow(s,R,O,j,q,ee,H)}}}else if(ce.visible){const de=I(R,ce,L,C);R.onBeforeShadow(s,R,O,j,q,de,null),s.renderBufferDirect(j,null,q,de,R,null),R.onAfterShadow(s,R,O,j,q,de,null)}}const J=R.children;for(let q=0,ce=J.length;q<ce;q++)b(J[q],O,j,L,C)}function W(R){R.target.removeEventListener("dispose",W);for(const j in m){const L=m[j],C=R.target.uuid;C in L&&(L[C].dispose(),delete L[C])}}}const wE={[zf]:Hf,[Vf]:Xf,[Gf]:jf,[Fo]:Wf,[Hf]:zf,[Xf]:Vf,[jf]:Gf,[Wf]:Fo};function AE(s,e){function n(){let D=!1;const we=new un;let ne=null;const me=new un(0,0,0,0);return{setMask:function(Ne){ne!==Ne&&!D&&(s.colorMask(Ne,Ne,Ne,Ne),ne=Ne)},setLocked:function(Ne){D=Ne},setClear:function(Ne,Ie,ot,zt,en){en===!0&&(Ne*=zt,Ie*=zt,ot*=zt),we.set(Ne,Ie,ot,zt),me.equals(we)===!1&&(s.clearColor(Ne,Ie,ot,zt),me.copy(we))},reset:function(){D=!1,ne=null,me.set(-1,0,0,0)}}}function r(){let D=!1,we=!1,ne=null,me=null,Ne=null;return{setReversed:function(Ie){if(we!==Ie){const ot=e.get("EXT_clip_control");we?ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.ZERO_TO_ONE_EXT):ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.NEGATIVE_ONE_TO_ONE_EXT);const zt=Ne;Ne=null,this.setClear(zt)}we=Ie},getReversed:function(){return we},setTest:function(Ie){Ie?_e(s.DEPTH_TEST):Re(s.DEPTH_TEST)},setMask:function(Ie){ne!==Ie&&!D&&(s.depthMask(Ie),ne=Ie)},setFunc:function(Ie){if(we&&(Ie=wE[Ie]),me!==Ie){switch(Ie){case zf:s.depthFunc(s.NEVER);break;case Hf:s.depthFunc(s.ALWAYS);break;case Vf:s.depthFunc(s.LESS);break;case Fo:s.depthFunc(s.LEQUAL);break;case Gf:s.depthFunc(s.EQUAL);break;case Wf:s.depthFunc(s.GEQUAL);break;case Xf:s.depthFunc(s.GREATER);break;case jf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}me=Ie}},setLocked:function(Ie){D=Ie},setClear:function(Ie){Ne!==Ie&&(we&&(Ie=1-Ie),s.clearDepth(Ie),Ne=Ie)},reset:function(){D=!1,ne=null,me=null,Ne=null,we=!1}}}function a(){let D=!1,we=null,ne=null,me=null,Ne=null,Ie=null,ot=null,zt=null,en=null;return{setTest:function(At){D||(At?_e(s.STENCIL_TEST):Re(s.STENCIL_TEST))},setMask:function(At){we!==At&&!D&&(s.stencilMask(At),we=At)},setFunc:function(At,En,_n){(ne!==At||me!==En||Ne!==_n)&&(s.stencilFunc(At,En,_n),ne=At,me=En,Ne=_n)},setOp:function(At,En,_n){(Ie!==At||ot!==En||zt!==_n)&&(s.stencilOp(At,En,_n),Ie=At,ot=En,zt=_n)},setLocked:function(At){D=At},setClear:function(At){en!==At&&(s.clearStencil(At),en=At)},reset:function(){D=!1,we=null,ne=null,me=null,Ne=null,Ie=null,ot=null,zt=null,en=null}}}const u=new n,f=new r,c=new a,h=new WeakMap,m=new WeakMap;let g={},y={},v=new WeakMap,S=[],E=null,T=!1,x=null,_=null,k=null,I=null,b=null,W=null,R=null,O=new bt(0,0,0),j=0,L=!1,C=null,P=null,J=null,q=null,ce=null;const de=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let oe=!1,ue=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(H)[1]),oe=ue>=1):H.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),oe=ue>=2);let fe=null,ee={};const F=s.getParameter(s.SCISSOR_BOX),se=s.getParameter(s.VIEWPORT),pe=new un().fromArray(F),Y=new un().fromArray(se);function ae(D,we,ne,me){const Ne=new Uint8Array(4),Ie=s.createTexture();s.bindTexture(D,Ie),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ot=0;ot<ne;ot++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(we,0,s.RGBA,1,1,me,0,s.RGBA,s.UNSIGNED_BYTE,Ne):s.texImage2D(we+ot,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ne);return Ie}const he={};he[s.TEXTURE_2D]=ae(s.TEXTURE_2D,s.TEXTURE_2D,1),he[s.TEXTURE_CUBE_MAP]=ae(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[s.TEXTURE_2D_ARRAY]=ae(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),he[s.TEXTURE_3D]=ae(s.TEXTURE_3D,s.TEXTURE_3D,1,1),u.setClear(0,0,0,1),f.setClear(1),c.setClear(0),_e(s.DEPTH_TEST),f.setFunc(Fo),mt(!1),ct(rm),_e(s.CULL_FACE),z(rs);function _e(D){g[D]!==!0&&(s.enable(D),g[D]=!0)}function Re(D){g[D]!==!1&&(s.disable(D),g[D]=!1)}function Le(D,we){return y[D]!==we?(s.bindFramebuffer(D,we),y[D]=we,D===s.DRAW_FRAMEBUFFER&&(y[s.FRAMEBUFFER]=we),D===s.FRAMEBUFFER&&(y[s.DRAW_FRAMEBUFFER]=we),!0):!1}function Oe(D,we){let ne=S,me=!1;if(D){ne=v.get(we),ne===void 0&&(ne=[],v.set(we,ne));const Ne=D.textures;if(ne.length!==Ne.length||ne[0]!==s.COLOR_ATTACHMENT0){for(let Ie=0,ot=Ne.length;Ie<ot;Ie++)ne[Ie]=s.COLOR_ATTACHMENT0+Ie;ne.length=Ne.length,me=!0}}else ne[0]!==s.BACK&&(ne[0]=s.BACK,me=!0);me&&s.drawBuffers(ne)}function pt(D){return E!==D?(s.useProgram(D),E=D,!0):!1}const Pe={[Ls]:s.FUNC_ADD,[N_]:s.FUNC_SUBTRACT,[F_]:s.FUNC_REVERSE_SUBTRACT};Pe[O_]=s.MIN,Pe[k_]=s.MAX;const Qe={[B_]:s.ZERO,[z_]:s.ONE,[H_]:s.SRC_COLOR,[kf]:s.SRC_ALPHA,[Y_]:s.SRC_ALPHA_SATURATE,[X_]:s.DST_COLOR,[G_]:s.DST_ALPHA,[V_]:s.ONE_MINUS_SRC_COLOR,[Bf]:s.ONE_MINUS_SRC_ALPHA,[j_]:s.ONE_MINUS_DST_COLOR,[W_]:s.ONE_MINUS_DST_ALPHA,[q_]:s.CONSTANT_COLOR,[$_]:s.ONE_MINUS_CONSTANT_COLOR,[K_]:s.CONSTANT_ALPHA,[Z_]:s.ONE_MINUS_CONSTANT_ALPHA};function z(D,we,ne,me,Ne,Ie,ot,zt,en,At){if(D===rs){T===!0&&(Re(s.BLEND),T=!1);return}if(T===!1&&(_e(s.BLEND),T=!0),D!==I_){if(D!==x||At!==L){if((_!==Ls||b!==Ls)&&(s.blendEquation(s.FUNC_ADD),_=Ls,b=Ls),At)switch(D){case Do:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Of:s.blendFunc(s.ONE,s.ONE);break;case sm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case om:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Do:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Of:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case sm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case om:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}k=null,I=null,W=null,R=null,O.set(0,0,0),j=0,x=D,L=At}return}Ne=Ne||we,Ie=Ie||ne,ot=ot||me,(we!==_||Ne!==b)&&(s.blendEquationSeparate(Pe[we],Pe[Ne]),_=we,b=Ne),(ne!==k||me!==I||Ie!==W||ot!==R)&&(s.blendFuncSeparate(Qe[ne],Qe[me],Qe[Ie],Qe[ot]),k=ne,I=me,W=Ie,R=ot),(zt.equals(O)===!1||en!==j)&&(s.blendColor(zt.r,zt.g,zt.b,en),O.copy(zt),j=en),x=D,L=!1}function Ct(D,we){D.side===Bi?Re(s.CULL_FACE):_e(s.CULL_FACE);let ne=D.side===Zn;we&&(ne=!ne),mt(ne),D.blending===Do&&D.transparent===!1?z(rs):z(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),f.setFunc(D.depthFunc),f.setTest(D.depthTest),f.setMask(D.depthWrite),u.setMask(D.colorWrite);const me=D.stencilWrite;c.setTest(me),me&&(c.setMask(D.stencilWriteMask),c.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),c.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),vt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?_e(s.SAMPLE_ALPHA_TO_COVERAGE):Re(s.SAMPLE_ALPHA_TO_COVERAGE)}function mt(D){C!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),C=D)}function ct(D){D!==L_?(_e(s.CULL_FACE),D!==P&&(D===rm?s.cullFace(s.BACK):D===D_?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Re(s.CULL_FACE),P=D}function Ye(D){D!==J&&(oe&&s.lineWidth(D),J=D)}function vt(D,we,ne){D?(_e(s.POLYGON_OFFSET_FILL),(q!==we||ce!==ne)&&(s.polygonOffset(we,ne),q=we,ce=ne)):Re(s.POLYGON_OFFSET_FILL)}function ze(D){D?_e(s.SCISSOR_TEST):Re(s.SCISSOR_TEST)}function U(D){D===void 0&&(D=s.TEXTURE0+de-1),fe!==D&&(s.activeTexture(D),fe=D)}function w(D,we,ne){ne===void 0&&(fe===null?ne=s.TEXTURE0+de-1:ne=fe);let me=ee[ne];me===void 0&&(me={type:void 0,texture:void 0},ee[ne]=me),(me.type!==D||me.texture!==we)&&(fe!==ne&&(s.activeTexture(ne),fe=ne),s.bindTexture(D,we||he[D]),me.type=D,me.texture=we)}function te(){const D=ee[fe];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ve(){try{s.compressedTexImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{s.texSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $e(){try{s.texSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function He(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{s.texStorage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(){try{s.texStorage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ge(){try{s.texImage2D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function et(){try{s.texImage3D.apply(s,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function st(D){pe.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),pe.copy(D))}function We(D){Y.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),Y.copy(D))}function xt(D,we){let ne=m.get(we);ne===void 0&&(ne=new WeakMap,m.set(we,ne));let me=ne.get(D);me===void 0&&(me=s.getUniformBlockIndex(we,D.name),ne.set(D,me))}function it(D,we){const me=m.get(we).get(D);h.get(we)!==me&&(s.uniformBlockBinding(we,me,D.__bindingPointIndex),h.set(we,me))}function It(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),f.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),g={},fe=null,ee={},y={},v=new WeakMap,S=[],E=null,T=!1,x=null,_=null,k=null,I=null,b=null,W=null,R=null,O=new bt(0,0,0),j=0,L=!1,C=null,P=null,J=null,q=null,ce=null,pe.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),u.reset(),f.reset(),c.reset()}return{buffers:{color:u,depth:f,stencil:c},enable:_e,disable:Re,bindFramebuffer:Le,drawBuffers:Oe,useProgram:pt,setBlending:z,setMaterial:Ct,setFlipSided:mt,setCullFace:ct,setLineWidth:Ye,setPolygonOffset:vt,setScissorTest:ze,activeTexture:U,bindTexture:w,unbindTexture:te,compressedTexImage2D:ve,compressedTexImage3D:xe,texImage2D:Ge,texImage3D:et,updateUBOMapping:xt,uniformBlockBinding:it,texStorage2D:gt,texStorage3D:Ce,texSubImage2D:ge,texSubImage3D:$e,compressedTexSubImage2D:De,compressedTexSubImage3D:He,scissor:st,viewport:We,reset:It}}function RE(s,e,n,r,a,u,f){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new Lt,g=new WeakMap;let y;const v=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(U,w){return S?new OffscreenCanvas(U,w):xu("canvas")}function T(U,w,te){let ve=1;const xe=ze(U);if((xe.width>te||xe.height>te)&&(ve=te/Math.max(xe.width,xe.height)),ve<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ge=Math.floor(ve*xe.width),$e=Math.floor(ve*xe.height);y===void 0&&(y=E(ge,$e));const De=w?E(ge,$e):y;return De.width=ge,De.height=$e,De.getContext("2d").drawImage(U,0,0,ge,$e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+xe.width+"x"+xe.height+") to ("+ge+"x"+$e+")."),De}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+xe.width+"x"+xe.height+")."),U;return U}function x(U){return U.generateMipmaps}function _(U){s.generateMipmap(U)}function k(U){return U.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?s.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function I(U,w,te,ve,xe=!1){if(U!==null){if(s[U]!==void 0)return s[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ge=w;if(w===s.RED&&(te===s.FLOAT&&(ge=s.R32F),te===s.HALF_FLOAT&&(ge=s.R16F),te===s.UNSIGNED_BYTE&&(ge=s.R8)),w===s.RED_INTEGER&&(te===s.UNSIGNED_BYTE&&(ge=s.R8UI),te===s.UNSIGNED_SHORT&&(ge=s.R16UI),te===s.UNSIGNED_INT&&(ge=s.R32UI),te===s.BYTE&&(ge=s.R8I),te===s.SHORT&&(ge=s.R16I),te===s.INT&&(ge=s.R32I)),w===s.RG&&(te===s.FLOAT&&(ge=s.RG32F),te===s.HALF_FLOAT&&(ge=s.RG16F),te===s.UNSIGNED_BYTE&&(ge=s.RG8)),w===s.RG_INTEGER&&(te===s.UNSIGNED_BYTE&&(ge=s.RG8UI),te===s.UNSIGNED_SHORT&&(ge=s.RG16UI),te===s.UNSIGNED_INT&&(ge=s.RG32UI),te===s.BYTE&&(ge=s.RG8I),te===s.SHORT&&(ge=s.RG16I),te===s.INT&&(ge=s.RG32I)),w===s.RGB_INTEGER&&(te===s.UNSIGNED_BYTE&&(ge=s.RGB8UI),te===s.UNSIGNED_SHORT&&(ge=s.RGB16UI),te===s.UNSIGNED_INT&&(ge=s.RGB32UI),te===s.BYTE&&(ge=s.RGB8I),te===s.SHORT&&(ge=s.RGB16I),te===s.INT&&(ge=s.RGB32I)),w===s.RGBA_INTEGER&&(te===s.UNSIGNED_BYTE&&(ge=s.RGBA8UI),te===s.UNSIGNED_SHORT&&(ge=s.RGBA16UI),te===s.UNSIGNED_INT&&(ge=s.RGBA32UI),te===s.BYTE&&(ge=s.RGBA8I),te===s.SHORT&&(ge=s.RGBA16I),te===s.INT&&(ge=s.RGBA32I)),w===s.RGB&&te===s.UNSIGNED_INT_5_9_9_9_REV&&(ge=s.RGB9_E5),w===s.RGBA){const $e=xe?_u:kt.getTransfer(ve);te===s.FLOAT&&(ge=s.RGBA32F),te===s.HALF_FLOAT&&(ge=s.RGBA16F),te===s.UNSIGNED_BYTE&&(ge=$e===Ht?s.SRGB8_ALPHA8:s.RGBA8),te===s.UNSIGNED_SHORT_4_4_4_4&&(ge=s.RGBA4),te===s.UNSIGNED_SHORT_5_5_5_1&&(ge=s.RGB5_A1)}return(ge===s.R16F||ge===s.R32F||ge===s.RG16F||ge===s.RG32F||ge===s.RGBA16F||ge===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ge}function b(U,w){let te;return U?w===null||w===Fs||w===Bo?te=s.DEPTH24_STENCIL8:w===Qi?te=s.DEPTH32F_STENCIL8:w===Na&&(te=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Fs||w===Bo?te=s.DEPTH_COMPONENT24:w===Qi?te=s.DEPTH_COMPONENT32F:w===Na&&(te=s.DEPTH_COMPONENT16),te}function W(U,w){return x(U)===!0||U.isFramebufferTexture&&U.minFilter!==ui&&U.minFilter!==Ti?Math.log2(Math.max(w.width,w.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?w.mipmaps.length:1}function R(U){const w=U.target;w.removeEventListener("dispose",R),j(w),w.isVideoTexture&&g.delete(w)}function O(U){const w=U.target;w.removeEventListener("dispose",O),C(w)}function j(U){const w=r.get(U);if(w.__webglInit===void 0)return;const te=U.source,ve=v.get(te);if(ve){const xe=ve[w.__cacheKey];xe.usedTimes--,xe.usedTimes===0&&L(U),Object.keys(ve).length===0&&v.delete(te)}r.remove(U)}function L(U){const w=r.get(U);s.deleteTexture(w.__webglTexture);const te=U.source,ve=v.get(te);delete ve[w.__cacheKey],f.memory.textures--}function C(U){const w=r.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),r.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let ve=0;ve<6;ve++){if(Array.isArray(w.__webglFramebuffer[ve]))for(let xe=0;xe<w.__webglFramebuffer[ve].length;xe++)s.deleteFramebuffer(w.__webglFramebuffer[ve][xe]);else s.deleteFramebuffer(w.__webglFramebuffer[ve]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[ve])}else{if(Array.isArray(w.__webglFramebuffer))for(let ve=0;ve<w.__webglFramebuffer.length;ve++)s.deleteFramebuffer(w.__webglFramebuffer[ve]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ve=0;ve<w.__webglColorRenderbuffer.length;ve++)w.__webglColorRenderbuffer[ve]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[ve]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const te=U.textures;for(let ve=0,xe=te.length;ve<xe;ve++){const ge=r.get(te[ve]);ge.__webglTexture&&(s.deleteTexture(ge.__webglTexture),f.memory.textures--),r.remove(te[ve])}r.remove(U)}let P=0;function J(){P=0}function q(){const U=P;return U>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+a.maxTextures),P+=1,U}function ce(U){const w=[];return w.push(U.wrapS),w.push(U.wrapT),w.push(U.wrapR||0),w.push(U.magFilter),w.push(U.minFilter),w.push(U.anisotropy),w.push(U.internalFormat),w.push(U.format),w.push(U.type),w.push(U.generateMipmaps),w.push(U.premultiplyAlpha),w.push(U.flipY),w.push(U.unpackAlignment),w.push(U.colorSpace),w.join()}function de(U,w){const te=r.get(U);if(U.isVideoTexture&&Ye(U),U.isRenderTargetTexture===!1&&U.version>0&&te.__version!==U.version){const ve=U.image;if(ve===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ve.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(te,U,w);return}}n.bindTexture(s.TEXTURE_2D,te.__webglTexture,s.TEXTURE0+w)}function oe(U,w){const te=r.get(U);if(U.version>0&&te.__version!==U.version){Y(te,U,w);return}n.bindTexture(s.TEXTURE_2D_ARRAY,te.__webglTexture,s.TEXTURE0+w)}function ue(U,w){const te=r.get(U);if(U.version>0&&te.__version!==U.version){Y(te,U,w);return}n.bindTexture(s.TEXTURE_3D,te.__webglTexture,s.TEXTURE0+w)}function H(U,w){const te=r.get(U);if(U.version>0&&te.__version!==U.version){ae(te,U,w);return}n.bindTexture(s.TEXTURE_CUBE_MAP,te.__webglTexture,s.TEXTURE0+w)}const fe={[$f]:s.REPEAT,[Us]:s.CLAMP_TO_EDGE,[Kf]:s.MIRRORED_REPEAT},ee={[ui]:s.NEAREST,[av]:s.NEAREST_MIPMAP_NEAREST,[Ol]:s.NEAREST_MIPMAP_LINEAR,[Ti]:s.LINEAR,[nf]:s.LINEAR_MIPMAP_NEAREST,[Is]:s.LINEAR_MIPMAP_LINEAR},F={[dv]:s.NEVER,[vv]:s.ALWAYS,[hv]:s.LESS,[Tg]:s.LEQUAL,[pv]:s.EQUAL,[_v]:s.GEQUAL,[mv]:s.GREATER,[gv]:s.NOTEQUAL};function se(U,w){if(w.type===Qi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Ti||w.magFilter===nf||w.magFilter===Ol||w.magFilter===Is||w.minFilter===Ti||w.minFilter===nf||w.minFilter===Ol||w.minFilter===Is)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(U,s.TEXTURE_WRAP_S,fe[w.wrapS]),s.texParameteri(U,s.TEXTURE_WRAP_T,fe[w.wrapT]),(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)&&s.texParameteri(U,s.TEXTURE_WRAP_R,fe[w.wrapR]),s.texParameteri(U,s.TEXTURE_MAG_FILTER,ee[w.magFilter]),s.texParameteri(U,s.TEXTURE_MIN_FILTER,ee[w.minFilter]),w.compareFunction&&(s.texParameteri(U,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(U,s.TEXTURE_COMPARE_FUNC,F[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===ui||w.minFilter!==Ol&&w.minFilter!==Is||w.type===Qi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||r.get(w).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");s.texParameterf(U,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,a.getMaxAnisotropy())),r.get(w).__currentAnisotropy=w.anisotropy}}}function pe(U,w){let te=!1;U.__webglInit===void 0&&(U.__webglInit=!0,w.addEventListener("dispose",R));const ve=w.source;let xe=v.get(ve);xe===void 0&&(xe={},v.set(ve,xe));const ge=ce(w);if(ge!==U.__cacheKey){xe[ge]===void 0&&(xe[ge]={texture:s.createTexture(),usedTimes:0},f.memory.textures++,te=!0),xe[ge].usedTimes++;const $e=xe[U.__cacheKey];$e!==void 0&&(xe[U.__cacheKey].usedTimes--,$e.usedTimes===0&&L(w)),U.__cacheKey=ge,U.__webglTexture=xe[ge].texture}return te}function Y(U,w,te){let ve=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ve=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ve=s.TEXTURE_3D);const xe=pe(U,w),ge=w.source;n.bindTexture(ve,U.__webglTexture,s.TEXTURE0+te);const $e=r.get(ge);if(ge.version!==$e.__version||xe===!0){n.activeTexture(s.TEXTURE0+te);const De=kt.getPrimaries(kt.workingColorSpace),He=w.colorSpace===is?null:kt.getPrimaries(w.colorSpace),gt=w.colorSpace===is||De===He?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);let Ce=T(w.image,!1,a.maxTextureSize);Ce=vt(w,Ce);const Ge=u.convert(w.format,w.colorSpace),et=u.convert(w.type);let st=I(w.internalFormat,Ge,et,w.colorSpace,w.isVideoTexture);se(ve,w);let We;const xt=w.mipmaps,it=w.isVideoTexture!==!0,It=$e.__version===void 0||xe===!0,D=ge.dataReady,we=W(w,Ce);if(w.isDepthTexture)st=b(w.format===zo,w.type),It&&(it?n.texStorage2D(s.TEXTURE_2D,1,st,Ce.width,Ce.height):n.texImage2D(s.TEXTURE_2D,0,st,Ce.width,Ce.height,0,Ge,et,null));else if(w.isDataTexture)if(xt.length>0){it&&It&&n.texStorage2D(s.TEXTURE_2D,we,st,xt[0].width,xt[0].height);for(let ne=0,me=xt.length;ne<me;ne++)We=xt[ne],it?D&&n.texSubImage2D(s.TEXTURE_2D,ne,0,0,We.width,We.height,Ge,et,We.data):n.texImage2D(s.TEXTURE_2D,ne,st,We.width,We.height,0,Ge,et,We.data);w.generateMipmaps=!1}else it?(It&&n.texStorage2D(s.TEXTURE_2D,we,st,Ce.width,Ce.height),D&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,Ce.width,Ce.height,Ge,et,Ce.data)):n.texImage2D(s.TEXTURE_2D,0,st,Ce.width,Ce.height,0,Ge,et,Ce.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){it&&It&&n.texStorage3D(s.TEXTURE_2D_ARRAY,we,st,xt[0].width,xt[0].height,Ce.depth);for(let ne=0,me=xt.length;ne<me;ne++)if(We=xt[ne],w.format!==zi)if(Ge!==null)if(it){if(D)if(w.layerUpdates.size>0){const Ne=Dm(We.width,We.height,w.format,w.type);for(const Ie of w.layerUpdates){const ot=We.data.subarray(Ie*Ne/We.data.BYTES_PER_ELEMENT,(Ie+1)*Ne/We.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,Ie,We.width,We.height,1,Ge,ot)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,We.width,We.height,Ce.depth,Ge,We.data)}else n.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ne,st,We.width,We.height,Ce.depth,0,We.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else it?D&&n.texSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,We.width,We.height,Ce.depth,Ge,et,We.data):n.texImage3D(s.TEXTURE_2D_ARRAY,ne,st,We.width,We.height,Ce.depth,0,Ge,et,We.data)}else{it&&It&&n.texStorage2D(s.TEXTURE_2D,we,st,xt[0].width,xt[0].height);for(let ne=0,me=xt.length;ne<me;ne++)We=xt[ne],w.format!==zi?Ge!==null?it?D&&n.compressedTexSubImage2D(s.TEXTURE_2D,ne,0,0,We.width,We.height,Ge,We.data):n.compressedTexImage2D(s.TEXTURE_2D,ne,st,We.width,We.height,0,We.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?D&&n.texSubImage2D(s.TEXTURE_2D,ne,0,0,We.width,We.height,Ge,et,We.data):n.texImage2D(s.TEXTURE_2D,ne,st,We.width,We.height,0,Ge,et,We.data)}else if(w.isDataArrayTexture)if(it){if(It&&n.texStorage3D(s.TEXTURE_2D_ARRAY,we,st,Ce.width,Ce.height,Ce.depth),D)if(w.layerUpdates.size>0){const ne=Dm(Ce.width,Ce.height,w.format,w.type);for(const me of w.layerUpdates){const Ne=Ce.data.subarray(me*ne/Ce.data.BYTES_PER_ELEMENT,(me+1)*ne/Ce.data.BYTES_PER_ELEMENT);n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,me,Ce.width,Ce.height,1,Ge,et,Ne)}w.clearLayerUpdates()}else n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ce.width,Ce.height,Ce.depth,Ge,et,Ce.data)}else n.texImage3D(s.TEXTURE_2D_ARRAY,0,st,Ce.width,Ce.height,Ce.depth,0,Ge,et,Ce.data);else if(w.isData3DTexture)it?(It&&n.texStorage3D(s.TEXTURE_3D,we,st,Ce.width,Ce.height,Ce.depth),D&&n.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ce.width,Ce.height,Ce.depth,Ge,et,Ce.data)):n.texImage3D(s.TEXTURE_3D,0,st,Ce.width,Ce.height,Ce.depth,0,Ge,et,Ce.data);else if(w.isFramebufferTexture){if(It)if(it)n.texStorage2D(s.TEXTURE_2D,we,st,Ce.width,Ce.height);else{let ne=Ce.width,me=Ce.height;for(let Ne=0;Ne<we;Ne++)n.texImage2D(s.TEXTURE_2D,Ne,st,ne,me,0,Ge,et,null),ne>>=1,me>>=1}}else if(xt.length>0){if(it&&It){const ne=ze(xt[0]);n.texStorage2D(s.TEXTURE_2D,we,st,ne.width,ne.height)}for(let ne=0,me=xt.length;ne<me;ne++)We=xt[ne],it?D&&n.texSubImage2D(s.TEXTURE_2D,ne,0,0,Ge,et,We):n.texImage2D(s.TEXTURE_2D,ne,st,Ge,et,We);w.generateMipmaps=!1}else if(it){if(It){const ne=ze(Ce);n.texStorage2D(s.TEXTURE_2D,we,st,ne.width,ne.height)}D&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,Ge,et,Ce)}else n.texImage2D(s.TEXTURE_2D,0,st,Ge,et,Ce);x(w)&&_(ve),$e.__version=ge.version,w.onUpdate&&w.onUpdate(w)}U.__version=w.version}function ae(U,w,te){if(w.image.length!==6)return;const ve=pe(U,w),xe=w.source;n.bindTexture(s.TEXTURE_CUBE_MAP,U.__webglTexture,s.TEXTURE0+te);const ge=r.get(xe);if(xe.version!==ge.__version||ve===!0){n.activeTexture(s.TEXTURE0+te);const $e=kt.getPrimaries(kt.workingColorSpace),De=w.colorSpace===is?null:kt.getPrimaries(w.colorSpace),He=w.colorSpace===is||$e===De?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);const gt=w.isCompressedTexture||w.image[0].isCompressedTexture,Ce=w.image[0]&&w.image[0].isDataTexture,Ge=[];for(let me=0;me<6;me++)!gt&&!Ce?Ge[me]=T(w.image[me],!0,a.maxCubemapSize):Ge[me]=Ce?w.image[me].image:w.image[me],Ge[me]=vt(w,Ge[me]);const et=Ge[0],st=u.convert(w.format,w.colorSpace),We=u.convert(w.type),xt=I(w.internalFormat,st,We,w.colorSpace),it=w.isVideoTexture!==!0,It=ge.__version===void 0||ve===!0,D=xe.dataReady;let we=W(w,et);se(s.TEXTURE_CUBE_MAP,w);let ne;if(gt){it&&It&&n.texStorage2D(s.TEXTURE_CUBE_MAP,we,xt,et.width,et.height);for(let me=0;me<6;me++){ne=Ge[me].mipmaps;for(let Ne=0;Ne<ne.length;Ne++){const Ie=ne[Ne];w.format!==zi?st!==null?it?D&&n.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,0,0,Ie.width,Ie.height,st,Ie.data):n.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,xt,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):it?D&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,0,0,Ie.width,Ie.height,st,We,Ie.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne,xt,Ie.width,Ie.height,0,st,We,Ie.data)}}}else{if(ne=w.mipmaps,it&&It){ne.length>0&&we++;const me=ze(Ge[0]);n.texStorage2D(s.TEXTURE_CUBE_MAP,we,xt,me.width,me.height)}for(let me=0;me<6;me++)if(Ce){it?D&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ge[me].width,Ge[me].height,st,We,Ge[me].data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,xt,Ge[me].width,Ge[me].height,0,st,We,Ge[me].data);for(let Ne=0;Ne<ne.length;Ne++){const ot=ne[Ne].image[me].image;it?D&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,0,0,ot.width,ot.height,st,We,ot.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,xt,ot.width,ot.height,0,st,We,ot.data)}}else{it?D&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,st,We,Ge[me]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,xt,st,We,Ge[me]);for(let Ne=0;Ne<ne.length;Ne++){const Ie=ne[Ne];it?D&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,0,0,st,We,Ie.image[me]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ne+1,xt,st,We,Ie.image[me])}}}x(w)&&_(s.TEXTURE_CUBE_MAP),ge.__version=xe.version,w.onUpdate&&w.onUpdate(w)}U.__version=w.version}function he(U,w,te,ve,xe,ge){const $e=u.convert(te.format,te.colorSpace),De=u.convert(te.type),He=I(te.internalFormat,$e,De,te.colorSpace),gt=r.get(w),Ce=r.get(te);if(Ce.__renderTarget=w,!gt.__hasExternalTextures){const Ge=Math.max(1,w.width>>ge),et=Math.max(1,w.height>>ge);xe===s.TEXTURE_3D||xe===s.TEXTURE_2D_ARRAY?n.texImage3D(xe,ge,He,Ge,et,w.depth,0,$e,De,null):n.texImage2D(xe,ge,He,Ge,et,0,$e,De,null)}n.bindFramebuffer(s.FRAMEBUFFER,U),ct(w)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ve,xe,Ce.__webglTexture,0,mt(w)):(xe===s.TEXTURE_2D||xe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&xe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ve,xe,Ce.__webglTexture,ge),n.bindFramebuffer(s.FRAMEBUFFER,null)}function _e(U,w,te){if(s.bindRenderbuffer(s.RENDERBUFFER,U),w.depthBuffer){const ve=w.depthTexture,xe=ve&&ve.isDepthTexture?ve.type:null,ge=b(w.stencilBuffer,xe),$e=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,De=mt(w);ct(w)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,De,ge,w.width,w.height):te?s.renderbufferStorageMultisample(s.RENDERBUFFER,De,ge,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,ge,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,$e,s.RENDERBUFFER,U)}else{const ve=w.textures;for(let xe=0;xe<ve.length;xe++){const ge=ve[xe],$e=u.convert(ge.format,ge.colorSpace),De=u.convert(ge.type),He=I(ge.internalFormat,$e,De,ge.colorSpace),gt=mt(w);te&&ct(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,gt,He,w.width,w.height):ct(w)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,gt,He,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,He,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Re(U,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(s.FRAMEBUFFER,U),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ve=r.get(w.depthTexture);ve.__renderTarget=w,(!ve.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),de(w.depthTexture,0);const xe=ve.__webglTexture,ge=mt(w);if(w.depthTexture.format===Uo)ct(w)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0,ge):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0);else if(w.depthTexture.format===zo)ct(w)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0,ge):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function Le(U){const w=r.get(U),te=U.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==U.depthTexture){const ve=U.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ve){const xe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ve.removeEventListener("dispose",xe)};ve.addEventListener("dispose",xe),w.__depthDisposeCallback=xe}w.__boundDepthTexture=ve}if(U.depthTexture&&!w.__autoAllocateDepthBuffer){if(te)throw new Error("target.depthTexture not supported in Cube render targets");Re(w.__webglFramebuffer,U)}else if(te){w.__webglDepthbuffer=[];for(let ve=0;ve<6;ve++)if(n.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[ve]),w.__webglDepthbuffer[ve]===void 0)w.__webglDepthbuffer[ve]=s.createRenderbuffer(),_e(w.__webglDepthbuffer[ve],U,!1);else{const xe=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ge=w.__webglDepthbuffer[ve];s.bindRenderbuffer(s.RENDERBUFFER,ge),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,ge)}}else if(n.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),_e(w.__webglDepthbuffer,U,!1);else{const ve=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,xe)}n.bindFramebuffer(s.FRAMEBUFFER,null)}function Oe(U,w,te){const ve=r.get(U);w!==void 0&&he(ve.__webglFramebuffer,U,U.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),te!==void 0&&Le(U)}function pt(U){const w=U.texture,te=r.get(U),ve=r.get(w);U.addEventListener("dispose",O);const xe=U.textures,ge=U.isWebGLCubeRenderTarget===!0,$e=xe.length>1;if($e||(ve.__webglTexture===void 0&&(ve.__webglTexture=s.createTexture()),ve.__version=w.version,f.memory.textures++),ge){te.__webglFramebuffer=[];for(let De=0;De<6;De++)if(w.mipmaps&&w.mipmaps.length>0){te.__webglFramebuffer[De]=[];for(let He=0;He<w.mipmaps.length;He++)te.__webglFramebuffer[De][He]=s.createFramebuffer()}else te.__webglFramebuffer[De]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){te.__webglFramebuffer=[];for(let De=0;De<w.mipmaps.length;De++)te.__webglFramebuffer[De]=s.createFramebuffer()}else te.__webglFramebuffer=s.createFramebuffer();if($e)for(let De=0,He=xe.length;De<He;De++){const gt=r.get(xe[De]);gt.__webglTexture===void 0&&(gt.__webglTexture=s.createTexture(),f.memory.textures++)}if(U.samples>0&&ct(U)===!1){te.__webglMultisampledFramebuffer=s.createFramebuffer(),te.__webglColorRenderbuffer=[],n.bindFramebuffer(s.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let De=0;De<xe.length;De++){const He=xe[De];te.__webglColorRenderbuffer[De]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,te.__webglColorRenderbuffer[De]);const gt=u.convert(He.format,He.colorSpace),Ce=u.convert(He.type),Ge=I(He.internalFormat,gt,Ce,He.colorSpace,U.isXRRenderTarget===!0),et=mt(U);s.renderbufferStorageMultisample(s.RENDERBUFFER,et,Ge,U.width,U.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+De,s.RENDERBUFFER,te.__webglColorRenderbuffer[De])}s.bindRenderbuffer(s.RENDERBUFFER,null),U.depthBuffer&&(te.__webglDepthRenderbuffer=s.createRenderbuffer(),_e(te.__webglDepthRenderbuffer,U,!0)),n.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ge){n.bindTexture(s.TEXTURE_CUBE_MAP,ve.__webglTexture),se(s.TEXTURE_CUBE_MAP,w);for(let De=0;De<6;De++)if(w.mipmaps&&w.mipmaps.length>0)for(let He=0;He<w.mipmaps.length;He++)he(te.__webglFramebuffer[De][He],U,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+De,He);else he(te.__webglFramebuffer[De],U,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+De,0);x(w)&&_(s.TEXTURE_CUBE_MAP),n.unbindTexture()}else if($e){for(let De=0,He=xe.length;De<He;De++){const gt=xe[De],Ce=r.get(gt);n.bindTexture(s.TEXTURE_2D,Ce.__webglTexture),se(s.TEXTURE_2D,gt),he(te.__webglFramebuffer,U,gt,s.COLOR_ATTACHMENT0+De,s.TEXTURE_2D,0),x(gt)&&_(s.TEXTURE_2D)}n.unbindTexture()}else{let De=s.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(De=U.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),n.bindTexture(De,ve.__webglTexture),se(De,w),w.mipmaps&&w.mipmaps.length>0)for(let He=0;He<w.mipmaps.length;He++)he(te.__webglFramebuffer[He],U,w,s.COLOR_ATTACHMENT0,De,He);else he(te.__webglFramebuffer,U,w,s.COLOR_ATTACHMENT0,De,0);x(w)&&_(De),n.unbindTexture()}U.depthBuffer&&Le(U)}function Pe(U){const w=U.textures;for(let te=0,ve=w.length;te<ve;te++){const xe=w[te];if(x(xe)){const ge=k(U),$e=r.get(xe).__webglTexture;n.bindTexture(ge,$e),_(ge),n.unbindTexture()}}}const Qe=[],z=[];function Ct(U){if(U.samples>0){if(ct(U)===!1){const w=U.textures,te=U.width,ve=U.height;let xe=s.COLOR_BUFFER_BIT;const ge=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$e=r.get(U),De=w.length>1;if(De)for(let He=0;He<w.length;He++)n.bindFramebuffer(s.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,null),n.bindFramebuffer(s.FRAMEBUFFER,$e.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,null,0);n.bindFramebuffer(s.READ_FRAMEBUFFER,$e.__webglMultisampledFramebuffer),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let He=0;He<w.length;He++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(xe|=s.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(xe|=s.STENCIL_BUFFER_BIT)),De){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,$e.__webglColorRenderbuffer[He]);const gt=r.get(w[He]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,gt,0)}s.blitFramebuffer(0,0,te,ve,0,0,te,ve,xe,s.NEAREST),h===!0&&(Qe.length=0,z.length=0,Qe.push(s.COLOR_ATTACHMENT0+He),U.depthBuffer&&U.resolveDepthBuffer===!1&&(Qe.push(ge),z.push(ge),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,z)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Qe))}if(n.bindFramebuffer(s.READ_FRAMEBUFFER,null),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),De)for(let He=0;He<w.length;He++){n.bindFramebuffer(s.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,$e.__webglColorRenderbuffer[He]);const gt=r.get(w[He]).__webglTexture;n.bindFramebuffer(s.FRAMEBUFFER,$e.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,gt,0)}n.bindFramebuffer(s.DRAW_FRAMEBUFFER,$e.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&h){const w=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function mt(U){return Math.min(a.maxSamples,U.samples)}function ct(U){const w=r.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Ye(U){const w=f.render.frame;g.get(U)!==w&&(g.set(U,w),U.update())}function vt(U,w){const te=U.colorSpace,ve=U.format,xe=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||te!==Ho&&te!==is&&(kt.getTransfer(te)===Ht?(ve!==zi||xe!==wr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",te)),w}function ze(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(m.width=U.naturalWidth||U.width,m.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(m.width=U.displayWidth,m.height=U.displayHeight):(m.width=U.width,m.height=U.height),m}this.allocateTextureUnit=q,this.resetTextureUnits=J,this.setTexture2D=de,this.setTexture2DArray=oe,this.setTexture3D=ue,this.setTextureCube=H,this.rebindTextures=Oe,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=Pe,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=he,this.useMultisampledRTT=ct}function CE(s,e){function n(r,a=is){let u;const f=kt.getTransfer(a);if(r===wr)return s.UNSIGNED_BYTE;if(r===Ld)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Dd)return s.UNSIGNED_SHORT_5_5_5_1;if(r===_g)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===mg)return s.BYTE;if(r===gg)return s.SHORT;if(r===Na)return s.UNSIGNED_SHORT;if(r===Pd)return s.INT;if(r===Fs)return s.UNSIGNED_INT;if(r===Qi)return s.FLOAT;if(r===Fa)return s.HALF_FLOAT;if(r===vg)return s.ALPHA;if(r===xg)return s.RGB;if(r===zi)return s.RGBA;if(r===yg)return s.LUMINANCE;if(r===Sg)return s.LUMINANCE_ALPHA;if(r===Uo)return s.DEPTH_COMPONENT;if(r===zo)return s.DEPTH_STENCIL;if(r===Ud)return s.RED;if(r===Id)return s.RED_INTEGER;if(r===Mg)return s.RG;if(r===Nd)return s.RG_INTEGER;if(r===Fd)return s.RGBA_INTEGER;if(r===fu||r===du||r===hu||r===pu)if(f===Ht)if(u=e.get("WEBGL_compressed_texture_s3tc_srgb"),u!==null){if(r===fu)return u.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===du)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===hu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===pu)return u.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(u=e.get("WEBGL_compressed_texture_s3tc"),u!==null){if(r===fu)return u.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===du)return u.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===hu)return u.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===pu)return u.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Zf||r===Qf||r===Jf||r===ed)if(u=e.get("WEBGL_compressed_texture_pvrtc"),u!==null){if(r===Zf)return u.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Qf)return u.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Jf)return u.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ed)return u.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===td||r===nd||r===id)if(u=e.get("WEBGL_compressed_texture_etc"),u!==null){if(r===td||r===nd)return f===Ht?u.COMPRESSED_SRGB8_ETC2:u.COMPRESSED_RGB8_ETC2;if(r===id)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:u.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===rd||r===sd||r===od||r===ad||r===ld||r===ud||r===cd||r===fd||r===dd||r===hd||r===pd||r===md||r===gd||r===_d)if(u=e.get("WEBGL_compressed_texture_astc"),u!==null){if(r===rd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:u.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===sd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:u.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===od)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:u.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ad)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:u.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ld)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:u.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ud)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:u.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===cd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:u.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===fd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:u.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===dd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:u.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===hd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:u.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===pd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:u.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===md)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:u.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===gd)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:u.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===_d)return f===Ht?u.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:u.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===mu||r===vd||r===xd)if(u=e.get("EXT_texture_compression_bptc"),u!==null){if(r===mu)return f===Ht?u.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:u.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===vd)return u.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===xd)return u.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Eg||r===yd||r===Sd||r===Md)if(u=e.get("EXT_texture_compression_rgtc"),u!==null){if(r===mu)return u.COMPRESSED_RED_RGTC1_EXT;if(r===yd)return u.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Sd)return u.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Md)return u.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Bo?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:n}}const bE={type:"move"};class If{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ou,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ou,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ou,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const r of e.hand.values())this._getHandJoint(n,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,r){let a=null,u=null,f=null;const c=this._targetRay,h=this._grip,m=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(m&&e.hand){f=!0;for(const T of e.hand.values()){const x=n.getJointPose(T,r),_=this._getHandJoint(m,T);x!==null&&(_.matrix.fromArray(x.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=x.radius),_.visible=x!==null}const g=m.joints["index-finger-tip"],y=m.joints["thumb-tip"],v=g.position.distanceTo(y.position),S=.02,E=.005;m.inputState.pinching&&v>S+E?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&v<=S-E&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(u=n.getPose(e.gripSpace,r),u!==null&&(h.matrix.fromArray(u.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,u.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(u.linearVelocity)):h.hasLinearVelocity=!1,u.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(u.angularVelocity)):h.hasAngularVelocity=!1));c!==null&&(a=n.getPose(e.targetRaySpace,r),a===null&&u!==null&&(a=u),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(bE)))}return c!==null&&(c.visible=a!==null),h!==null&&(h.visible=u!==null),m!==null&&(m.visible=f!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const r=new ou;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[n.jointName]=r,e.add(r)}return e.joints[n.jointName]}}const PE=`
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

}`;class DE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,r){if(this.texture===null){const a=new Fn,u=e.properties.get(a);u.__webglTexture=n.texture,(n.depthNear!==r.depthNear||n.depthFar!==r.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,r=new Ji({vertexShader:PE,fragmentShader:LE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Kn(new Ns(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class UE extends Go{constructor(e,n){super();const r=this;let a=null,u=1,f=null,c="local-floor",h=1,m=null,g=null,y=null,v=null,S=null,E=null;const T=new DE,x=n.getContextAttributes();let _=null,k=null;const I=[],b=[],W=new Lt;let R=null;const O=new Mi;O.viewport=new un;const j=new Mi;j.viewport=new un;const L=[O,j],C=new ex;let P=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ae=I[Y];return ae===void 0&&(ae=new If,I[Y]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Y){let ae=I[Y];return ae===void 0&&(ae=new If,I[Y]=ae),ae.getGripSpace()},this.getHand=function(Y){let ae=I[Y];return ae===void 0&&(ae=new If,I[Y]=ae),ae.getHandSpace()};function q(Y){const ae=b.indexOf(Y.inputSource);if(ae===-1)return;const he=I[ae];he!==void 0&&(he.update(Y.inputSource,Y.frame,m||f),he.dispatchEvent({type:Y.type,data:Y.inputSource}))}function ce(){a.removeEventListener("select",q),a.removeEventListener("selectstart",q),a.removeEventListener("selectend",q),a.removeEventListener("squeeze",q),a.removeEventListener("squeezestart",q),a.removeEventListener("squeezeend",q),a.removeEventListener("end",ce),a.removeEventListener("inputsourceschange",de);for(let Y=0;Y<I.length;Y++){const ae=b[Y];ae!==null&&(b[Y]=null,I[Y].disconnect(ae))}P=null,J=null,T.reset(),e.setRenderTarget(_),S=null,v=null,y=null,a=null,k=null,pe.stop(),r.isPresenting=!1,e.setPixelRatio(R),e.setSize(W.width,W.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){u=Y,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){c=Y,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||f},this.setReferenceSpace=function(Y){m=Y},this.getBaseLayer=function(){return v!==null?v:S},this.getBinding=function(){return y},this.getFrame=function(){return E},this.getSession=function(){return a},this.setSession=async function(Y){if(a=Y,a!==null){if(_=e.getRenderTarget(),a.addEventListener("select",q),a.addEventListener("selectstart",q),a.addEventListener("selectend",q),a.addEventListener("squeeze",q),a.addEventListener("squeezestart",q),a.addEventListener("squeezeend",q),a.addEventListener("end",ce),a.addEventListener("inputsourceschange",de),x.xrCompatible!==!0&&await n.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(W),a.enabledFeatures!==void 0&&a.enabledFeatures.includes("layers")){let he=null,_e=null,Re=null;x.depth&&(Re=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,he=x.stencil?zo:Uo,_e=x.stencil?Bo:Fs);const Le={colorFormat:n.RGBA8,depthFormat:Re,scaleFactor:u};y=new XRWebGLBinding(a,n),v=y.createProjectionLayer(Le),a.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),k=new Os(v.textureWidth,v.textureHeight,{format:zi,type:wr,depthTexture:new kg(v.textureWidth,v.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1})}else{const he={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:u};S=new XRWebGLLayer(a,n,he),a.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),k=new Os(S.framebufferWidth,S.framebufferHeight,{format:zi,type:wr,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}k.isXRRenderTarget=!0,this.setFoveation(h),m=null,f=await a.requestReferenceSpace(c),pe.setContext(a),pe.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function de(Y){for(let ae=0;ae<Y.removed.length;ae++){const he=Y.removed[ae],_e=b.indexOf(he);_e>=0&&(b[_e]=null,I[_e].disconnect(he))}for(let ae=0;ae<Y.added.length;ae++){const he=Y.added[ae];let _e=b.indexOf(he);if(_e===-1){for(let Le=0;Le<I.length;Le++)if(Le>=b.length){b.push(he),_e=Le;break}else if(b[Le]===null){b[Le]=he,_e=Le;break}if(_e===-1)break}const Re=I[_e];Re&&Re.connect(he)}}const oe=new Z,ue=new Z;function H(Y,ae,he){oe.setFromMatrixPosition(ae.matrixWorld),ue.setFromMatrixPosition(he.matrixWorld);const _e=oe.distanceTo(ue),Re=ae.projectionMatrix.elements,Le=he.projectionMatrix.elements,Oe=Re[14]/(Re[10]-1),pt=Re[14]/(Re[10]+1),Pe=(Re[9]+1)/Re[5],Qe=(Re[9]-1)/Re[5],z=(Re[8]-1)/Re[0],Ct=(Le[8]+1)/Le[0],mt=Oe*z,ct=Oe*Ct,Ye=_e/(-z+Ct),vt=Ye*-z;if(ae.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(vt),Y.translateZ(Ye),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Re[10]===-1)Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const ze=Oe+Ye,U=pt+Ye,w=mt-vt,te=ct+(_e-vt),ve=Pe*pt/U*ze,xe=Qe*pt/U*ze;Y.projectionMatrix.makePerspective(w,te,ve,xe,ze,U),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function fe(Y,ae){ae===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ae.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(a===null)return;let ae=Y.near,he=Y.far;T.texture!==null&&(T.depthNear>0&&(ae=T.depthNear),T.depthFar>0&&(he=T.depthFar)),C.near=j.near=O.near=ae,C.far=j.far=O.far=he,(P!==C.near||J!==C.far)&&(a.updateRenderState({depthNear:C.near,depthFar:C.far}),P=C.near,J=C.far),O.layers.mask=Y.layers.mask|2,j.layers.mask=Y.layers.mask|4,C.layers.mask=O.layers.mask|j.layers.mask;const _e=Y.parent,Re=C.cameras;fe(C,_e);for(let Le=0;Le<Re.length;Le++)fe(Re[Le],_e);Re.length===2?H(C,O,j):C.projectionMatrix.copy(O.projectionMatrix),ee(Y,C,_e)};function ee(Y,ae,he){he===null?Y.matrix.copy(ae.matrixWorld):(Y.matrix.copy(he.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ae.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Td*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(v===null&&S===null))return h},this.setFoveation=function(Y){h=Y,v!==null&&(v.fixedFoveation=Y),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=Y)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(C)};let F=null;function se(Y,ae){if(g=ae.getViewerPose(m||f),E=ae,g!==null){const he=g.views;S!==null&&(e.setRenderTargetFramebuffer(k,S.framebuffer),e.setRenderTarget(k));let _e=!1;he.length!==C.cameras.length&&(C.cameras.length=0,_e=!0);for(let Le=0;Le<he.length;Le++){const Oe=he[Le];let pt=null;if(S!==null)pt=S.getViewport(Oe);else{const Qe=y.getViewSubImage(v,Oe);pt=Qe.viewport,Le===0&&(e.setRenderTargetTextures(k,Qe.colorTexture,v.ignoreDepthValues?void 0:Qe.depthStencilTexture),e.setRenderTarget(k))}let Pe=L[Le];Pe===void 0&&(Pe=new Mi,Pe.layers.enable(Le),Pe.viewport=new un,L[Le]=Pe),Pe.matrix.fromArray(Oe.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(Oe.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(pt.x,pt.y,pt.width,pt.height),Le===0&&(C.matrix.copy(Pe.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),_e===!0&&C.cameras.push(Pe)}const Re=a.enabledFeatures;if(Re&&Re.includes("depth-sensing")){const Le=y.getDepthInformation(he[0]);Le&&Le.isValid&&Le.texture&&T.init(e,Le,a.renderState)}}for(let he=0;he<I.length;he++){const _e=b[he],Re=I[he];_e!==null&&Re!==void 0&&Re.update(_e,ae,m||f)}F&&F(Y,ae),ae.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:ae}),E=null}const pe=new Bg;pe.setAnimationLoop(se),this.setAnimationLoop=function(Y){F=Y},this.dispose=function(){}}}const Cs=new Ar,IE=new an;function NE(s,e){function n(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function r(x,_){_.color.getRGB(x.fogColor.value,Ug(s)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function a(x,_,k,I,b){_.isMeshBasicMaterial||_.isMeshLambertMaterial?u(x,_):_.isMeshToonMaterial?(u(x,_),y(x,_)):_.isMeshPhongMaterial?(u(x,_),g(x,_)):_.isMeshStandardMaterial?(u(x,_),v(x,_),_.isMeshPhysicalMaterial&&S(x,_,b)):_.isMeshMatcapMaterial?(u(x,_),E(x,_)):_.isMeshDepthMaterial?u(x,_):_.isMeshDistanceMaterial?(u(x,_),T(x,_)):_.isMeshNormalMaterial?u(x,_):_.isLineBasicMaterial?(f(x,_),_.isLineDashedMaterial&&c(x,_)):_.isPointsMaterial?h(x,_,k,I):_.isSpriteMaterial?m(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function u(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,n(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,n(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===Zn&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,n(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===Zn&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,n(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,n(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,n(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const k=e.get(_),I=k.envMap,b=k.envMapRotation;I&&(x.envMap.value=I,Cs.copy(b),Cs.x*=-1,Cs.y*=-1,Cs.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(Cs.y*=-1,Cs.z*=-1),x.envMapRotation.value.setFromMatrix4(IE.makeRotationFromEuler(Cs)),x.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap&&(x.lightMap.value=_.lightMap,x.lightMapIntensity.value=_.lightMapIntensity,n(_.lightMap,x.lightMapTransform)),_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,n(_.aoMap,x.aoMapTransform))}function f(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,n(_.map,x.mapTransform))}function c(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function h(x,_,k,I){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*k,x.scale.value=I*.5,_.map&&(x.map.value=_.map,n(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function m(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,n(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,n(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function g(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function y(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function v(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,n(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,n(_.roughnessMap,x.roughnessMapTransform)),_.envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function S(x,_,k){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,n(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,n(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,n(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,n(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,n(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Zn&&x.clearcoatNormalScale.value.negate())),_.dispersion>0&&(x.dispersion.value=_.dispersion),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,n(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,n(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=k.texture,x.transmissionSamplerSize.value.set(k.width,k.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,n(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,n(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,n(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,n(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,n(_.specularIntensityMap,x.specularIntensityMapTransform))}function E(x,_){_.matcap&&(x.matcap.value=_.matcap)}function T(x,_){const k=e.get(_).light;x.referencePosition.value.setFromMatrixPosition(k.matrixWorld),x.nearDistance.value=k.shadow.camera.near,x.farDistance.value=k.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function FE(s,e,n,r){let a={},u={},f=[];const c=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(k,I){const b=I.program;r.uniformBlockBinding(k,b)}function m(k,I){let b=a[k.id];b===void 0&&(E(k),b=g(k),a[k.id]=b,k.addEventListener("dispose",x));const W=I.program;r.updateUBOMapping(k,W);const R=e.render.frame;u[k.id]!==R&&(v(k),u[k.id]=R)}function g(k){const I=y();k.__bindingPointIndex=I;const b=s.createBuffer(),W=k.__size,R=k.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,W,R),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,I,b),b}function y(){for(let k=0;k<c;k++)if(f.indexOf(k)===-1)return f.push(k),k;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(k){const I=a[k.id],b=k.uniforms,W=k.__cache;s.bindBuffer(s.UNIFORM_BUFFER,I);for(let R=0,O=b.length;R<O;R++){const j=Array.isArray(b[R])?b[R]:[b[R]];for(let L=0,C=j.length;L<C;L++){const P=j[L];if(S(P,R,L,W)===!0){const J=P.__offset,q=Array.isArray(P.value)?P.value:[P.value];let ce=0;for(let de=0;de<q.length;de++){const oe=q[de],ue=T(oe);typeof oe=="number"||typeof oe=="boolean"?(P.__data[0]=oe,s.bufferSubData(s.UNIFORM_BUFFER,J+ce,P.__data)):oe.isMatrix3?(P.__data[0]=oe.elements[0],P.__data[1]=oe.elements[1],P.__data[2]=oe.elements[2],P.__data[3]=0,P.__data[4]=oe.elements[3],P.__data[5]=oe.elements[4],P.__data[6]=oe.elements[5],P.__data[7]=0,P.__data[8]=oe.elements[6],P.__data[9]=oe.elements[7],P.__data[10]=oe.elements[8],P.__data[11]=0):(oe.toArray(P.__data,ce),ce+=ue.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,J,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(k,I,b,W){const R=k.value,O=I+"_"+b;if(W[O]===void 0)return typeof R=="number"||typeof R=="boolean"?W[O]=R:W[O]=R.clone(),!0;{const j=W[O];if(typeof R=="number"||typeof R=="boolean"){if(j!==R)return W[O]=R,!0}else if(j.equals(R)===!1)return j.copy(R),!0}return!1}function E(k){const I=k.uniforms;let b=0;const W=16;for(let O=0,j=I.length;O<j;O++){const L=Array.isArray(I[O])?I[O]:[I[O]];for(let C=0,P=L.length;C<P;C++){const J=L[C],q=Array.isArray(J.value)?J.value:[J.value];for(let ce=0,de=q.length;ce<de;ce++){const oe=q[ce],ue=T(oe),H=b%W,fe=H%ue.boundary,ee=H+fe;b+=fe,ee!==0&&W-ee<ue.storage&&(b+=W-ee),J.__data=new Float32Array(ue.storage/Float32Array.BYTES_PER_ELEMENT),J.__offset=b,b+=ue.storage}}}const R=b%W;return R>0&&(b+=W-R),k.__size=b,k.__cache={},this}function T(k){const I={boundary:0,storage:0};return typeof k=="number"||typeof k=="boolean"?(I.boundary=4,I.storage=4):k.isVector2?(I.boundary=8,I.storage=8):k.isVector3||k.isColor?(I.boundary=16,I.storage=12):k.isVector4?(I.boundary=16,I.storage=16):k.isMatrix3?(I.boundary=48,I.storage=48):k.isMatrix4?(I.boundary=64,I.storage=64):k.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",k),I}function x(k){const I=k.target;I.removeEventListener("dispose",x);const b=f.indexOf(I.__bindingPointIndex);f.splice(b,1),s.deleteBuffer(a[I.id]),delete a[I.id],delete u[I.id]}function _(){for(const k in a)s.deleteBuffer(a[k]);f=[],a={},u={}}return{bind:h,update:m,dispose:_}}class OE{constructor(e={}){const{canvas:n=yv(),context:r=null,depth:a=!0,stencil:u=!1,alpha:f=!1,antialias:c=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:m=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:y=!1,reverseDepthBuffer:v=!1}=e;this.isWebGLRenderer=!0;let S;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=r.getContextAttributes().alpha}else S=f;const E=new Uint32Array(4),T=new Int32Array(4);let x=null,_=null;const k=[],I=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Si,this.toneMapping=ss,this.toneMappingExposure=1;const b=this;let W=!1,R=0,O=0,j=null,L=-1,C=null;const P=new un,J=new un;let q=null;const ce=new bt(0);let de=0,oe=n.width,ue=n.height,H=1,fe=null,ee=null;const F=new un(0,0,oe,ue),se=new un(0,0,oe,ue);let pe=!1;const Y=new Og;let ae=!1,he=!1;this.transmissionResolutionScale=1;const _e=new an,Re=new an,Le=new Z,Oe=new un,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Pe=!1;function Qe(){return j===null?H:1}let z=r;function Ct(A,X){return n.getContext(A,X)}try{const A={alpha:!0,depth:a,stencil:u,antialias:c,premultipliedAlpha:h,preserveDrawingBuffer:m,powerPreference:g,failIfMajorPerformanceCaveat:y};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${bd}`),n.addEventListener("webglcontextlost",me,!1),n.addEventListener("webglcontextrestored",Ne,!1),n.addEventListener("webglcontextcreationerror",Ie,!1),z===null){const X="webgl2";if(z=Ct(X,A),z===null)throw Ct(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let mt,ct,Ye,vt,ze,U,w,te,ve,xe,ge,$e,De,He,gt,Ce,Ge,et,st,We,xt,it,It,D;function we(){mt=new jS(z),mt.init(),it=new CE(z,mt),ct=new zS(z,mt,e,it),Ye=new AE(z,mt),ct.reverseDepthBuffer&&v&&Ye.buffers.depth.setReversed(!0),vt=new $S(z),ze=new hE,U=new RE(z,mt,Ye,ze,ct,it,vt),w=new VS(b),te=new XS(b),ve=new nx(z),It=new kS(z,ve),xe=new YS(z,ve,vt,It),ge=new ZS(z,xe,ve,vt),st=new KS(z,ct,U),Ce=new HS(ze),$e=new dE(b,w,te,mt,ct,It,Ce),De=new NE(b,ze),He=new mE,gt=new SE(mt),et=new OS(b,w,te,Ye,ge,S,h),Ge=new TE(b,ge,ct),D=new FE(z,vt,ct,Ye),We=new BS(z,mt,vt),xt=new qS(z,mt,vt),vt.programs=$e.programs,b.capabilities=ct,b.extensions=mt,b.properties=ze,b.renderLists=He,b.shadowMap=Ge,b.state=Ye,b.info=vt}we();const ne=new UE(b,z);this.xr=ne,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const A=mt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=mt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(A){A!==void 0&&(H=A,this.setSize(oe,ue,!1))},this.getSize=function(A){return A.set(oe,ue)},this.setSize=function(A,X,ie=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}oe=A,ue=X,n.width=Math.floor(A*H),n.height=Math.floor(X*H),ie===!0&&(n.style.width=A+"px",n.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(oe*H,ue*H).floor()},this.setDrawingBufferSize=function(A,X,ie){oe=A,ue=X,H=ie,n.width=Math.floor(A*ie),n.height=Math.floor(X*ie),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(F)},this.setViewport=function(A,X,ie,K){A.isVector4?F.set(A.x,A.y,A.z,A.w):F.set(A,X,ie,K),Ye.viewport(P.copy(F).multiplyScalar(H).round())},this.getScissor=function(A){return A.copy(se)},this.setScissor=function(A,X,ie,K){A.isVector4?se.set(A.x,A.y,A.z,A.w):se.set(A,X,ie,K),Ye.scissor(J.copy(se).multiplyScalar(H).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(A){Ye.setScissorTest(pe=A)},this.setOpaqueSort=function(A){fe=A},this.setTransparentSort=function(A){ee=A},this.getClearColor=function(A){return A.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(A=!0,X=!0,ie=!0){let K=0;if(A){let $=!1;if(j!==null){const Ee=j.texture.format;$=Ee===Fd||Ee===Nd||Ee===Id}if($){const Ee=j.texture.type,Ue=Ee===wr||Ee===Fs||Ee===Na||Ee===Bo||Ee===Ld||Ee===Dd,ke=et.getClearColor(),Ve=et.getClearAlpha(),rt=ke.r,Je=ke.g,je=ke.b;Ue?(E[0]=rt,E[1]=Je,E[2]=je,E[3]=Ve,z.clearBufferuiv(z.COLOR,0,E)):(T[0]=rt,T[1]=Je,T[2]=je,T[3]=Ve,z.clearBufferiv(z.COLOR,0,T))}else K|=z.COLOR_BUFFER_BIT}X&&(K|=z.DEPTH_BUFFER_BIT),ie&&(K|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",me,!1),n.removeEventListener("webglcontextrestored",Ne,!1),n.removeEventListener("webglcontextcreationerror",Ie,!1),et.dispose(),He.dispose(),gt.dispose(),ze.dispose(),w.dispose(),te.dispose(),ge.dispose(),It.dispose(),D.dispose(),$e.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",er),ne.removeEventListener("sessionend",wi),fi.stop()};function me(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),W=!0}function Ne(){console.log("THREE.WebGLRenderer: Context Restored."),W=!1;const A=vt.autoReset,X=Ge.enabled,ie=Ge.autoUpdate,K=Ge.needsUpdate,$=Ge.type;we(),vt.autoReset=A,Ge.enabled=X,Ge.autoUpdate=ie,Ge.needsUpdate=K,Ge.type=$}function Ie(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ot(A){const X=A.target;X.removeEventListener("dispose",ot),zt(X)}function zt(A){en(A),ze.remove(A)}function en(A){const X=ze.get(A).programs;X!==void 0&&(X.forEach(function(ie){$e.releaseProgram(ie)}),A.isShaderMaterial&&$e.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,ie,K,$,Ee){X===null&&(X=pt);const Ue=$.isMesh&&$.matrixWorld.determinant()<0,ke=Rr(A,X,ie,K,$);Ye.setMaterial(K,Ue);let Ve=ie.index,rt=1;if(K.wireframe===!0){if(Ve=xe.getWireframeAttribute(ie),Ve===void 0)return;rt=2}const Je=ie.drawRange,je=ie.attributes.position;let Et=Je.start*rt,ft=(Je.start+Je.count)*rt;Ee!==null&&(Et=Math.max(Et,Ee.start*rt),ft=Math.min(ft,(Ee.start+Ee.count)*rt)),Ve!==null?(Et=Math.max(Et,0),ft=Math.min(ft,Ve.count)):je!=null&&(Et=Math.max(Et,0),ft=Math.min(ft,je.count));const jt=ft-Et;if(jt<0||jt===1/0)return;It.setup($,K,ke,ie,Ve);let Gt,Rt=We;if(Ve!==null&&(Gt=ve.get(Ve),Rt=xt,Rt.setIndex(Gt)),$.isMesh)K.wireframe===!0?(Ye.setLineWidth(K.wireframeLinewidth*Qe()),Rt.setMode(z.LINES)):Rt.setMode(z.TRIANGLES);else if($.isLine){let B=K.linewidth;B===void 0&&(B=1),Ye.setLineWidth(B*Qe()),$.isLineSegments?Rt.setMode(z.LINES):$.isLineLoop?Rt.setMode(z.LINE_LOOP):Rt.setMode(z.LINE_STRIP)}else $.isPoints?Rt.setMode(z.POINTS):$.isSprite&&Rt.setMode(z.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Rt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(mt.get("WEBGL_multi_draw"))Rt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const B=$._multiDrawStarts,Te=$._multiDrawCounts,at=$._multiDrawCount,Nt=Ve?ve.get(Ve).bytesPerElement:1,tn=ze.get(K).currentProgram.getUniforms();for(let nn=0;nn<at;nn++)tn.setValue(z,"_gl_DrawID",nn),Rt.render(B[nn]/Nt,Te[nn])}else if($.isInstancedMesh)Rt.renderInstances(Et,jt,$.count);else if(ie.isInstancedBufferGeometry){const B=ie._maxInstanceCount!==void 0?ie._maxInstanceCount:1/0,Te=Math.min(ie.instanceCount,B);Rt.renderInstances(Et,jt,Te)}else Rt.render(Et,jt)};function At(A,X,ie){A.transparent===!0&&A.side===Bi&&A.forceSinglePass===!1?(A.side=Zn,A.needsUpdate=!0,Qn(A,X,ie),A.side=as,A.needsUpdate=!0,Qn(A,X,ie),A.side=Bi):Qn(A,X,ie)}this.compile=function(A,X,ie=null){ie===null&&(ie=A),_=gt.get(ie),_.init(X),I.push(_),ie.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(_.pushLight($),$.castShadow&&_.pushShadow($))}),A!==ie&&A.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(_.pushLight($),$.castShadow&&_.pushShadow($))}),_.setupLights();const K=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Ee=$.material;if(Ee)if(Array.isArray(Ee))for(let Ue=0;Ue<Ee.length;Ue++){const ke=Ee[Ue];At(ke,ie,$),K.add(ke)}else At(Ee,ie,$),K.add(Ee)}),I.pop(),_=null,K},this.compileAsync=function(A,X,ie=null){const K=this.compile(A,X,ie);return new Promise($=>{function Ee(){if(K.forEach(function(Ue){ze.get(Ue).currentProgram.isReady()&&K.delete(Ue)}),K.size===0){$(A);return}setTimeout(Ee,10)}mt.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let En=null;function _n(A){En&&En(A)}function er(){fi.stop()}function wi(){fi.start()}const fi=new Bg;fi.setAnimationLoop(_n),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(A){En=A,ne.setAnimationLoop(A),A===null?fi.stop():fi.start()},ne.addEventListener("sessionstart",er),ne.addEventListener("sessionend",wi),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(W===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(X),X=ne.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,X,j),_=gt.get(A,I.length),_.init(X),I.push(_),Re.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),Y.setFromProjectionMatrix(Re),he=this.localClippingEnabled,ae=Ce.init(this.clippingPlanes,he),x=He.get(A,k.length),x.init(),k.push(x),ne.enabled===!0&&ne.isPresenting===!0){const Ee=b.xr.getDepthSensingMesh();Ee!==null&&Ai(Ee,X,-1/0,b.sortObjects)}Ai(A,X,0,b.sortObjects),x.finish(),b.sortObjects===!0&&x.sort(fe,ee),Pe=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,Pe&&et.addToRenderList(x,A),this.info.render.frame++,ae===!0&&Ce.beginShadows();const ie=_.state.shadowsArray;Ge.render(ie,A,X),ae===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=x.opaque,$=x.transmissive;if(_.setupLights(),X.isArrayCamera){const Ee=X.cameras;if($.length>0)for(let Ue=0,ke=Ee.length;Ue<ke;Ue++){const Ve=Ee[Ue];Vi(K,$,A,Ve)}Pe&&et.render(A);for(let Ue=0,ke=Ee.length;Ue<ke;Ue++){const Ve=Ee[Ue];tr(x,A,Ve,Ve.viewport)}}else $.length>0&&Vi(K,$,A,X),Pe&&et.render(A),tr(x,A,X);j!==null&&O===0&&(U.updateMultisampleRenderTarget(j),U.updateRenderTargetMipmap(j)),A.isScene===!0&&A.onAfterRender(b,A,X),It.resetDefaultState(),L=-1,C=null,I.pop(),I.length>0?(_=I[I.length-1],ae===!0&&Ce.setGlobalState(b.clippingPlanes,_.state.camera)):_=null,k.pop(),k.length>0?x=k[k.length-1]:x=null};function Ai(A,X,ie,K){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)ie=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)_.pushLight(A),A.castShadow&&_.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Y.intersectsSprite(A)){K&&Oe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Re);const Ue=ge.update(A),ke=A.material;ke.visible&&x.push(A,Ue,ke,ie,Oe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Y.intersectsObject(A))){const Ue=ge.update(A),ke=A.material;if(K&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Oe.copy(A.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),Oe.copy(Ue.boundingSphere.center)),Oe.applyMatrix4(A.matrixWorld).applyMatrix4(Re)),Array.isArray(ke)){const Ve=Ue.groups;for(let rt=0,Je=Ve.length;rt<Je;rt++){const je=Ve[rt],Et=ke[je.materialIndex];Et&&Et.visible&&x.push(A,Ue,Et,ie,Oe.z,je)}}else ke.visible&&x.push(A,Ue,ke,ie,Oe.z,null)}}const Ee=A.children;for(let Ue=0,ke=Ee.length;Ue<ke;Ue++)Ai(Ee[Ue],X,ie,K)}function tr(A,X,ie,K){const $=A.opaque,Ee=A.transmissive,Ue=A.transparent;_.setupLightsView(ie),ae===!0&&Ce.setGlobalState(b.clippingPlanes,ie),K&&Ye.viewport(P.copy(K)),$.length>0&&Ri($,X,ie),Ee.length>0&&Ri(Ee,X,ie),Ue.length>0&&Ri(Ue,X,ie),Ye.buffers.depth.setTest(!0),Ye.buffers.depth.setMask(!0),Ye.buffers.color.setMask(!0),Ye.setPolygonOffset(!1)}function Vi(A,X,ie,K){if((ie.isScene===!0?ie.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[K.id]===void 0&&(_.state.transmissionRenderTarget[K.id]=new Os(1,1,{generateMipmaps:!0,type:mt.has("EXT_color_buffer_half_float")||mt.has("EXT_color_buffer_float")?Fa:wr,minFilter:Is,samples:4,stencilBuffer:u,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:kt.workingColorSpace}));const Ee=_.state.transmissionRenderTarget[K.id],Ue=K.viewport||P;Ee.setSize(Ue.z*b.transmissionResolutionScale,Ue.w*b.transmissionResolutionScale);const ke=b.getRenderTarget();b.setRenderTarget(Ee),b.getClearColor(ce),de=b.getClearAlpha(),de<1&&b.setClearColor(16777215,.5),b.clear(),Pe&&et.render(ie);const Ve=b.toneMapping;b.toneMapping=ss;const rt=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),_.setupLightsView(K),ae===!0&&Ce.setGlobalState(b.clippingPlanes,K),Ri(A,ie,K),U.updateMultisampleRenderTarget(Ee),U.updateRenderTargetMipmap(Ee),mt.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let je=0,Et=X.length;je<Et;je++){const ft=X[je],jt=ft.object,Gt=ft.geometry,Rt=ft.material,B=ft.group;if(Rt.side===Bi&&jt.layers.test(K.layers)){const Te=Rt.side;Rt.side=Zn,Rt.needsUpdate=!0,nr(jt,ie,K,Gt,Rt,B),Rt.side=Te,Rt.needsUpdate=!0,Je=!0}}Je===!0&&(U.updateMultisampleRenderTarget(Ee),U.updateRenderTargetMipmap(Ee))}b.setRenderTarget(ke),b.setClearColor(ce,de),rt!==void 0&&(K.viewport=rt),b.toneMapping=Ve}function Ri(A,X,ie){const K=X.isScene===!0?X.overrideMaterial:null;for(let $=0,Ee=A.length;$<Ee;$++){const Ue=A[$],ke=Ue.object,Ve=Ue.geometry,rt=K===null?Ue.material:K,Je=Ue.group;ke.layers.test(ie.layers)&&nr(ke,X,ie,Ve,rt,Je)}}function nr(A,X,ie,K,$,Ee){A.onBeforeRender(b,X,ie,K,$,Ee),A.modelViewMatrix.multiplyMatrices(ie.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(b,X,ie,K,A,Ee),$.transparent===!0&&$.side===Bi&&$.forceSinglePass===!1?($.side=Zn,$.needsUpdate=!0,b.renderBufferDirect(ie,X,K,$,A,Ee),$.side=as,$.needsUpdate=!0,b.renderBufferDirect(ie,X,K,$,A,Ee),$.side=Bi):b.renderBufferDirect(ie,X,K,$,A,Ee),A.onAfterRender(b,X,ie,K,$,Ee)}function Qn(A,X,ie){X.isScene!==!0&&(X=pt);const K=ze.get(A),$=_.state.lights,Ee=_.state.shadowsArray,Ue=$.state.version,ke=$e.getParameters(A,$.state,Ee,X,ie),Ve=$e.getProgramCacheKey(ke);let rt=K.programs;K.environment=A.isMeshStandardMaterial?X.environment:null,K.fog=X.fog,K.envMap=(A.isMeshStandardMaterial?te:w).get(A.envMap||K.environment),K.envMapRotation=K.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,rt===void 0&&(A.addEventListener("dispose",ot),rt=new Map,K.programs=rt);let Je=rt.get(Ve);if(Je!==void 0){if(K.currentProgram===Je&&K.lightsStateVersion===Ue)return Gn(A,ke),Je}else ke.uniforms=$e.getUniforms(A),A.onBeforeCompile(ke,b),Je=$e.acquireProgram(ke,Ve),rt.set(Ve,Je),K.uniforms=ke.uniforms;const je=K.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(je.clippingPlanes=Ce.uniform),Gn(A,ke),K.needsLights=Cr(A),K.lightsStateVersion=Ue,K.needsLights&&(je.ambientLightColor.value=$.state.ambient,je.lightProbe.value=$.state.probe,je.directionalLights.value=$.state.directional,je.directionalLightShadows.value=$.state.directionalShadow,je.spotLights.value=$.state.spot,je.spotLightShadows.value=$.state.spotShadow,je.rectAreaLights.value=$.state.rectArea,je.ltc_1.value=$.state.rectAreaLTC1,je.ltc_2.value=$.state.rectAreaLTC2,je.pointLights.value=$.state.point,je.pointLightShadows.value=$.state.pointShadow,je.hemisphereLights.value=$.state.hemi,je.directionalShadowMap.value=$.state.directionalShadowMap,je.directionalShadowMatrix.value=$.state.directionalShadowMatrix,je.spotShadowMap.value=$.state.spotShadowMap,je.spotLightMatrix.value=$.state.spotLightMatrix,je.spotLightMap.value=$.state.spotLightMap,je.pointShadowMap.value=$.state.pointShadowMap,je.pointShadowMatrix.value=$.state.pointShadowMatrix),K.currentProgram=Je,K.uniformsList=null,Je}function ir(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=gu.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function Gn(A,X){const ie=ze.get(A);ie.outputColorSpace=X.outputColorSpace,ie.batching=X.batching,ie.batchingColor=X.batchingColor,ie.instancing=X.instancing,ie.instancingColor=X.instancingColor,ie.instancingMorph=X.instancingMorph,ie.skinning=X.skinning,ie.morphTargets=X.morphTargets,ie.morphNormals=X.morphNormals,ie.morphColors=X.morphColors,ie.morphTargetsCount=X.morphTargetsCount,ie.numClippingPlanes=X.numClippingPlanes,ie.numIntersection=X.numClipIntersection,ie.vertexAlphas=X.vertexAlphas,ie.vertexTangents=X.vertexTangents,ie.toneMapping=X.toneMapping}function Rr(A,X,ie,K,$){X.isScene!==!0&&(X=pt),U.resetTextureUnits();const Ee=X.fog,Ue=K.isMeshStandardMaterial?X.environment:null,ke=j===null?b.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Ho,Ve=(K.isMeshStandardMaterial?te:w).get(K.envMap||Ue),rt=K.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,Je=!!ie.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),je=!!ie.morphAttributes.position,Et=!!ie.morphAttributes.normal,ft=!!ie.morphAttributes.color;let jt=ss;K.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(jt=b.toneMapping);const Gt=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,Rt=Gt!==void 0?Gt.length:0,B=ze.get(K),Te=_.state.lights;if(ae===!0&&(he===!0||A!==C)){const rn=A===C&&K.id===L;Ce.setState(K,A,rn)}let at=!1;K.version===B.__version?(B.needsLights&&B.lightsStateVersion!==Te.state.version||B.outputColorSpace!==ke||$.isBatchedMesh&&B.batching===!1||!$.isBatchedMesh&&B.batching===!0||$.isBatchedMesh&&B.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&B.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&B.instancing===!1||!$.isInstancedMesh&&B.instancing===!0||$.isSkinnedMesh&&B.skinning===!1||!$.isSkinnedMesh&&B.skinning===!0||$.isInstancedMesh&&B.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&B.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&B.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&B.instancingMorph===!1&&$.morphTexture!==null||B.envMap!==Ve||K.fog===!0&&B.fog!==Ee||B.numClippingPlanes!==void 0&&(B.numClippingPlanes!==Ce.numPlanes||B.numIntersection!==Ce.numIntersection)||B.vertexAlphas!==rt||B.vertexTangents!==Je||B.morphTargets!==je||B.morphNormals!==Et||B.morphColors!==ft||B.toneMapping!==jt||B.morphTargetsCount!==Rt)&&(at=!0):(at=!0,B.__version=K.version);let Nt=B.currentProgram;at===!0&&(Nt=Qn(K,X,$));let tn=!1,nn=!1,Ft=!1;const lt=Nt.getUniforms(),St=B.uniforms;if(Ye.useProgram(Nt.program)&&(tn=!0,nn=!0,Ft=!0),K.id!==L&&(L=K.id,nn=!0),tn||C!==A){Ye.buffers.depth.getReversed()?(_e.copy(A.projectionMatrix),Mv(_e),Ev(_e),lt.setValue(z,"projectionMatrix",_e)):lt.setValue(z,"projectionMatrix",A.projectionMatrix),lt.setValue(z,"viewMatrix",A.matrixWorldInverse);const Dt=lt.map.cameraPosition;Dt!==void 0&&Dt.setValue(z,Le.setFromMatrixPosition(A.matrixWorld)),ct.logarithmicDepthBuffer&&lt.setValue(z,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&lt.setValue(z,"isOrthographic",A.isOrthographicCamera===!0),C!==A&&(C=A,nn=!0,Ft=!0)}if($.isSkinnedMesh){lt.setOptional(z,$,"bindMatrix"),lt.setOptional(z,$,"bindMatrixInverse");const rn=$.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),lt.setValue(z,"boneTexture",rn.boneTexture,U))}$.isBatchedMesh&&(lt.setOptional(z,$,"batchingTexture"),lt.setValue(z,"batchingTexture",$._matricesTexture,U),lt.setOptional(z,$,"batchingIdTexture"),lt.setValue(z,"batchingIdTexture",$._indirectTexture,U),lt.setOptional(z,$,"batchingColorTexture"),$._colorsTexture!==null&&lt.setValue(z,"batchingColorTexture",$._colorsTexture,U));const dt=ie.morphAttributes;if((dt.position!==void 0||dt.normal!==void 0||dt.color!==void 0)&&st.update($,ie,Nt),(nn||B.receiveShadow!==$.receiveShadow)&&(B.receiveShadow=$.receiveShadow,lt.setValue(z,"receiveShadow",$.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(St.envMap.value=Ve,St.flipEnvMap.value=Ve.isCubeTexture&&Ve.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&X.environment!==null&&(St.envMapIntensity.value=X.environmentIntensity),nn&&(lt.setValue(z,"toneMappingExposure",b.toneMappingExposure),B.needsLights&&ls(St,Ft),Ee&&K.fog===!0&&De.refreshFogUniforms(St,Ee),De.refreshMaterialUniforms(St,K,H,ue,_.state.transmissionRenderTarget[A.id]),gu.upload(z,ir(B),St,U)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(gu.upload(z,ir(B),St,U),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&lt.setValue(z,"center",$.center),lt.setValue(z,"modelViewMatrix",$.modelViewMatrix),lt.setValue(z,"normalMatrix",$.normalMatrix),lt.setValue(z,"modelMatrix",$.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const rn=K.uniformsGroups;for(let Dt=0,ht=rn.length;Dt<ht;Dt++){const vn=rn[Dt];D.update(vn,Nt),D.bind(vn,Nt)}}return Nt}function ls(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function Cr(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(A,X,ie){ze.get(A.texture).__webglTexture=X,ze.get(A.depthTexture).__webglTexture=ie;const K=ze.get(A);K.__hasExternalTextures=!0,K.__autoAllocateDepthBuffer=ie===void 0,K.__autoAllocateDepthBuffer||mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,X){const ie=ze.get(A);ie.__webglFramebuffer=X,ie.__useDefaultFramebuffer=X===void 0};const br=z.createFramebuffer();this.setRenderTarget=function(A,X=0,ie=0){j=A,R=X,O=ie;let K=!0,$=null,Ee=!1,Ue=!1;if(A){const Ve=ze.get(A);if(Ve.__useDefaultFramebuffer!==void 0)Ye.bindFramebuffer(z.FRAMEBUFFER,null),K=!1;else if(Ve.__webglFramebuffer===void 0)U.setupRenderTarget(A);else if(Ve.__hasExternalTextures)U.rebindTextures(A,ze.get(A.texture).__webglTexture,ze.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const je=A.depthTexture;if(Ve.__boundDepthTexture!==je){if(je!==null&&ze.has(je)&&(A.width!==je.image.width||A.height!==je.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(A)}}const rt=A.texture;(rt.isData3DTexture||rt.isDataArrayTexture||rt.isCompressedArrayTexture)&&(Ue=!0);const Je=ze.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Je[X])?$=Je[X][ie]:$=Je[X],Ee=!0):A.samples>0&&U.useMultisampledRTT(A)===!1?$=ze.get(A).__webglMultisampledFramebuffer:Array.isArray(Je)?$=Je[ie]:$=Je,P.copy(A.viewport),J.copy(A.scissor),q=A.scissorTest}else P.copy(F).multiplyScalar(H).floor(),J.copy(se).multiplyScalar(H).floor(),q=pe;if(ie!==0&&($=br),Ye.bindFramebuffer(z.FRAMEBUFFER,$)&&K&&Ye.drawBuffers(A,$),Ye.viewport(P),Ye.scissor(J),Ye.setScissorTest(q),Ee){const Ve=ze.get(A.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ve.__webglTexture,ie)}else if(Ue){const Ve=ze.get(A.texture),rt=X;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ve.__webglTexture,ie,rt)}else if(A!==null&&ie!==0){const Ve=ze.get(A.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Ve.__webglTexture,ie)}L=-1},this.readRenderTargetPixels=function(A,X,ie,K,$,Ee,Ue){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=ze.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ue!==void 0&&(ke=ke[Ue]),ke){Ye.bindFramebuffer(z.FRAMEBUFFER,ke);try{const Ve=A.texture,rt=Ve.format,Je=Ve.type;if(!ct.textureFormatReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-K&&ie>=0&&ie<=A.height-$&&z.readPixels(X,ie,K,$,it.convert(rt),it.convert(Je),Ee)}finally{const Ve=j!==null?ze.get(j).__webglFramebuffer:null;Ye.bindFramebuffer(z.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(A,X,ie,K,$,Ee,Ue){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=ze.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ue!==void 0&&(ke=ke[Ue]),ke){const Ve=A.texture,rt=Ve.format,Je=Ve.type;if(!ct.textureFormatReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=A.width-K&&ie>=0&&ie<=A.height-$){Ye.bindFramebuffer(z.FRAMEBUFFER,ke);const je=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,je),z.bufferData(z.PIXEL_PACK_BUFFER,Ee.byteLength,z.STREAM_READ),z.readPixels(X,ie,K,$,it.convert(rt),it.convert(Je),0);const Et=j!==null?ze.get(j).__webglFramebuffer:null;Ye.bindFramebuffer(z.FRAMEBUFFER,Et);const ft=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Sv(z,ft,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,je),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Ee),z.deleteBuffer(je),z.deleteSync(ft),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,X=null,ie=0){A.isTexture!==!0&&(Ro("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,A=arguments[1]);const K=Math.pow(2,-ie),$=Math.floor(A.image.width*K),Ee=Math.floor(A.image.height*K),Ue=X!==null?X.x:0,ke=X!==null?X.y:0;U.setTexture2D(A,0),z.copyTexSubImage2D(z.TEXTURE_2D,ie,0,0,Ue,ke,$,Ee),Ye.unbindTexture()};const Pr=z.createFramebuffer(),Lr=z.createFramebuffer();this.copyTextureToTexture=function(A,X,ie=null,K=null,$=0,Ee=null){A.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture function signature has changed."),K=arguments[0]||null,A=arguments[1],X=arguments[2],Ee=arguments[3]||0,ie=null),Ee===null&&($!==0?(Ro("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ee=$,$=0):Ee=0);let Ue,ke,Ve,rt,Je,je,Et,ft,jt;const Gt=A.isCompressedTexture?A.mipmaps[Ee]:A.image;if(ie!==null)Ue=ie.max.x-ie.min.x,ke=ie.max.y-ie.min.y,Ve=ie.isBox3?ie.max.z-ie.min.z:1,rt=ie.min.x,Je=ie.min.y,je=ie.isBox3?ie.min.z:0;else{const dt=Math.pow(2,-$);Ue=Math.floor(Gt.width*dt),ke=Math.floor(Gt.height*dt),A.isDataArrayTexture?Ve=Gt.depth:A.isData3DTexture?Ve=Math.floor(Gt.depth*dt):Ve=1,rt=0,Je=0,je=0}K!==null?(Et=K.x,ft=K.y,jt=K.z):(Et=0,ft=0,jt=0);const Rt=it.convert(X.format),B=it.convert(X.type);let Te;X.isData3DTexture?(U.setTexture3D(X,0),Te=z.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(U.setTexture2DArray(X,0),Te=z.TEXTURE_2D_ARRAY):(U.setTexture2D(X,0),Te=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,X.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,X.unpackAlignment);const at=z.getParameter(z.UNPACK_ROW_LENGTH),Nt=z.getParameter(z.UNPACK_IMAGE_HEIGHT),tn=z.getParameter(z.UNPACK_SKIP_PIXELS),nn=z.getParameter(z.UNPACK_SKIP_ROWS),Ft=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,Gt.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Gt.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,rt),z.pixelStorei(z.UNPACK_SKIP_ROWS,Je),z.pixelStorei(z.UNPACK_SKIP_IMAGES,je);const lt=A.isDataArrayTexture||A.isData3DTexture,St=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){const dt=ze.get(A),rn=ze.get(X),Dt=ze.get(dt.__renderTarget),ht=ze.get(rn.__renderTarget);Ye.bindFramebuffer(z.READ_FRAMEBUFFER,Dt.__webglFramebuffer),Ye.bindFramebuffer(z.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let vn=0;vn<Ve;vn++)lt&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,ze.get(A).__webglTexture,$,je+vn),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,ze.get(X).__webglTexture,Ee,jt+vn)),z.blitFramebuffer(rt,Je,Ue,ke,Et,ft,Ue,ke,z.DEPTH_BUFFER_BIT,z.NEAREST);Ye.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ye.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if($!==0||A.isRenderTargetTexture||ze.has(A)){const dt=ze.get(A),rn=ze.get(X);Ye.bindFramebuffer(z.READ_FRAMEBUFFER,Pr),Ye.bindFramebuffer(z.DRAW_FRAMEBUFFER,Lr);for(let Dt=0;Dt<Ve;Dt++)lt?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,dt.__webglTexture,$,je+Dt):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,dt.__webglTexture,$),St?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,rn.__webglTexture,Ee,jt+Dt):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,rn.__webglTexture,Ee),$!==0?z.blitFramebuffer(rt,Je,Ue,ke,Et,ft,Ue,ke,z.COLOR_BUFFER_BIT,z.NEAREST):St?z.copyTexSubImage3D(Te,Ee,Et,ft,jt+Dt,rt,Je,Ue,ke):z.copyTexSubImage2D(Te,Ee,Et,ft,rt,Je,Ue,ke);Ye.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ye.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else St?A.isDataTexture||A.isData3DTexture?z.texSubImage3D(Te,Ee,Et,ft,jt,Ue,ke,Ve,Rt,B,Gt.data):X.isCompressedArrayTexture?z.compressedTexSubImage3D(Te,Ee,Et,ft,jt,Ue,ke,Ve,Rt,Gt.data):z.texSubImage3D(Te,Ee,Et,ft,jt,Ue,ke,Ve,Rt,B,Gt):A.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Ee,Et,ft,Ue,ke,Rt,B,Gt.data):A.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Ee,Et,ft,Gt.width,Gt.height,Rt,Gt.data):z.texSubImage2D(z.TEXTURE_2D,Ee,Et,ft,Ue,ke,Rt,B,Gt);z.pixelStorei(z.UNPACK_ROW_LENGTH,at),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Nt),z.pixelStorei(z.UNPACK_SKIP_PIXELS,tn),z.pixelStorei(z.UNPACK_SKIP_ROWS,nn),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Ft),Ee===0&&X.generateMipmaps&&z.generateMipmap(Te),Ye.unbindTexture()},this.copyTextureToTexture3D=function(A,X,ie=null,K=null,$=0){return A.isTexture!==!0&&(Ro("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ie=arguments[0]||null,K=arguments[1]||null,A=arguments[2],X=arguments[3],$=arguments[4]||0),Ro('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,X,ie,K,$)},this.initRenderTarget=function(A){ze.get(A).__webglFramebuffer===void 0&&U.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?U.setTextureCube(A,0):A.isData3DTexture?U.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?U.setTexture2DArray(A,0):U.setTexture2D(A,0),Ye.unbindTexture()},this.resetState=function(){R=0,O=0,j=null,Ye.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Er}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=kt._getDrawingBufferColorSpace(e),n.unpackColorSpace=kt._getUnpackColorSpace()}}const Zi=-8,Mr=500,ig=320,cu=12,Po=.5;function qi(s,e,n){return Math.max(e,Math.min(n,s))}function Nf(s,e,n){return s+(e-s)*n}function Wg(s,e){if(e<=0)return 1;const n=.5*s*s;if(n<=0)return 0;const r=e-n;if(Math.abs(r)<1e-9)return 1/(1+.5*e*e*Po*Po);if(r>0){const f=Math.sqrt(2*r),c=Math.sinh(f*Po);return 1/(1+e*e*c*c/(4*n*r))}const a=Math.sqrt(-2*r),u=Math.sin(a*Po);return 1/(1+e*e*u*u/(4*n*-r))}function Nn(s,e,n){const r=(s-e)/n;return Math.exp(-.5*r*r)}const Jt={nx:800,nk:100,xmin:-50,xmax:50,xs:null,ks:null,phi:null,psiK:null,psi_re:new Float64Array(800),psi_im:new Float64Array(800),psiF_re:new Float64Array(800),psiF_im:new Float64Array(800),rhoBuf:new Float32Array(800),T_mean:0,tCross:0};function kE(s,e,n){const r=Math.sqrt(2*s),a=s<e;let u,f,c,h,m;if(a){const g=Math.sqrt(2*(e-s)+1e-20),y=Math.cosh(g*n),v=Math.sinh(g*n),S=y,E=.5*(g/r-r/g)*v,T=S*S+E*E,x=Math.cos(r*n),_=-Math.sin(r*n);c=(x*S+_*E)/T,h=(_*S-x*E)/T,m=c*c+h*h;const k=-.5*(g/r+r/g)*v,I=-k*h,b=k*c,W=Math.cos(r*n),R=Math.sin(r*n);return u=I*W-b*R,f=I*R+b*W,{k1:r,kappa:g,tun:!0,T:m,R:1-m,r_re:u,r_im:f,t_re:c,t_im:h}}else{const g=Math.sqrt(2*(s-e)+1e-20),y=Math.cos(g*n),v=Math.sin(g*n),S=y,E=-.5*(g/r+r/g)*v,T=S*S+E*E,x=Math.cos(r*n),_=-Math.sin(r*n);c=(x*S+_*E)/T,h=(_*S-x*E)/T,m=c*c+h*h;const k=.5*(r/g-g/r)*v,I=-k*h,b=k*c,W=Math.cos(r*n),R=Math.sin(r*n);return u=I*W-b*R,f=I*R+b*W,{k1:r,k2:g,tun:!1,T:m,R:1-m,r_re:u,r_im:f,t_re:c,t_im:h}}}function BE(s,e,n){const{k1:r,tun:a,r_re:u,r_im:f,t_re:c,t_im:h}=e,m=a?e.kappa:e.k2;if(s>=n){const E=Math.cos(r*s),T=Math.sin(r*s);return[c*E-h*T,c*T+h*E]}if(s<0){const E=Math.cos(r*s),T=Math.sin(r*s);return[E+u*E-f*-T,T+u*-T+f*E]}const g=c*Math.cos(r*n)-h*Math.sin(r*n),y=c*Math.sin(r*n)+h*Math.cos(r*n),v=-r*y,S=r*g;if(a){const E=m,T=(g+v/E)*.5,x=(y+S/E)*.5,_=(g-v/E)*.5,k=(y-S/E)*.5,I=Math.exp(E*(s-n)),b=Math.exp(-E*(s-n));return[T*I+_*b,x*I+k*b]}else{const E=m,T=(g+S/E)*.5,x=(y-v/E)*.5,_=g-T,k=y-x,I=Math.cos(E*(s-n)),b=Math.sin(E*(s-n));return[T*I-x*b+_*I+k*b,T*b+x*I-_*b+k*I]}}function rg(s,e,n){const{nx:r,nk:a,xmin:u,xmax:f}=Jt,c=2*Po,h=(f-u)/(r-1);Jt.xs=new Float64Array(r);for(let x=0;x<r;x++)Jt.xs[x]=u+x*h;const m=1/(2*n),g=Math.max(.05,s-5*m),v=(s+5*m-g)/(a-1),S=Math.pow(2*Math.PI*n*n,-.25);Jt.ks=new Float64Array(a),Jt.phi=new Float64Array(2*a),Jt.psiK=new Float32Array(a*r*2);let E=0,T=0;for(let x=0;x<a;x++){const _=g+x*v;Jt.ks[x]=_;const I=S*Math.exp(-.5*(_-s)*(_-s)*n*n)*v;Jt.phi[2*x]=I*Math.cos(_*Zi),Jt.phi[2*x+1]=-I*Math.sin(_*Zi);const b=.5*_*_,W=kE(b,e,c);E+=W.T*I*I,T+=I*I;for(let R=0;R<r;R++){const O=BE(Jt.xs[R]+Po,W,c);Jt.psiK[2*(x*r+R)]=O[0],Jt.psiK[2*(x*r+R)+1]=O[1]}}Jt.T_mean=T>0?E/T:0,Jt.tCross=Math.abs(Zi)/s,Xg(0)}function Xg(s){const{nk:e,nx:n,ks:r,phi:a,psiK:u,psi_re:f,psi_im:c,psiF_re:h,psiF_im:m,rhoBuf:g,tCross:y}=Jt;if(!u)return;const v=.5*(1+Math.tanh(3*(s-y)));f.fill(0),c.fill(0),h.fill(0),m.fill(0);for(let S=0;S<e;S++){const E=r[S],T=.5*E*E,x=Math.cos(T*s),_=-Math.sin(T*s),k=a[2*S],I=a[2*S+1],b=k*x-I*_,W=k*_+I*x,R=2*S*n,O=E*(Jt.xmax-Jt.xmin)/(n-1),j=Math.cos(O),L=Math.sin(O);let C=Math.cos(E*Jt.xmin),P=Math.sin(E*Jt.xmin);for(let J=0;J<n;J++){const q=u[R+2*J],ce=u[R+2*J+1];f[J]+=b*q-W*ce,c[J]+=b*ce+W*q,h[J]+=b*C-W*P,m[J]+=b*P+W*C;const de=C*j-P*L;P=C*L+P*j,C=de}}for(let S=0;S<n;S++){const E=f[S]*v+h[S]*(1-v),T=c[S]*v+m[S]*(1-v);f[S]=E,c[S]=T,g[S]=E*E+T*T}}function sg(s,e){if(s>=.9999)return 0;if(s<=1e-4)return 60;let n=0,r=60;for(let a=0;a<64;a++){const u=(n+r)/2;Wg(e,u)>s?n=u:r=u}return(n+r)/2}function zE(s,e,n,r,a,u){const f=Math.abs(Zi)/s,h=(f+9)/Mr,m=u>=0?1:-1;let g=Zi,y=u;const v=[];for(let S=0;S<=Mr;S++){const E=S*h;v.push({x:g,y}),E<f?g+=s*h:(g+=m*s*h,y+=0)}return v}function HE(s,e,n,r,a,u){const f=[];for(let c=0;c<u;c++){const h=a*(Math.random()*2-1),m=zE(s,e,n,r,a,h),g=m[m.length-1].y>0;f.push({pts:m,isTransmit:g})}return f}const VE=`
  varying vec2 vPos;
  void main() { vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,GE=`
  varying vec2 vPos;
  uniform float uBl;              // blend 0→1 (scatter progress)
  uniform float uPT, uPR;
  uniform float uYT, uYR;
  uniform float uSigX, uSigY;
  uniform float uColBranch;       // collapse: 1=kill R, -1=kill T, 0=keep both
  uniform float uColFade;         // 0→1 fade of killed branch
  uniform float uIsPW;            // 1=pilot-wave mode
  uniform float uBY;              // Bohmian pointer Y(t)
  uniform float uXin, uXT, uXR;  // packet x-centres: pre-scatter, T, R

  vec3 inferno(float t) {
    t = clamp(t,0.,1.);
    vec3 c0=vec3(0.000,0.000,0.016), c1=vec3(0.227,0.031,0.384),
         c2=vec3(0.698,0.165,0.322), c3=vec3(0.937,0.490,0.129),
         c4=vec3(0.988,1.000,0.643);
    if(t<.25) return mix(c0,c1,t*4.);
    if(t<.50) return mix(c1,c2,(t-.25)*4.);
    if(t<.75) return mix(c2,c3,(t-.50)*4.);
    return               mix(c3,c4,(t-.75)*4.);
  }

  void main() {
    float x=vPos.x, y=vPos.y;

    // Particle x-Gaussians (analytical — compact, no quantum dispersion widening)
    float gX0 = exp(-0.5 * ((x - uXin) / uSigX) * ((x - uXin) / uSigX));
    float gXT  = exp(-0.5 * ((x - uXT)  / uSigX) * ((x - uXT)  / uSigX));
    float gXR  = exp(-0.5 * ((x - uXR)  / uSigX) * ((x - uXR)  / uSigX));

    // Pointer y-Gaussians
    // Incoming and reflected both sit at uYR (the "not detected" position)
    float gY0 = exp(-0.5 * ((y - uYR) / uSigY) * ((y - uYR) / uSigY));
    float gYT = exp(-0.5 * ((y - uYT) / uSigY) * ((y - uYT) / uSigY));
    float gYR = exp(-0.5 * ((y - uYR) / uSigY) * ((y - uYR) / uSigY));

    // Branch weights — Copenhagen collapses one branch; Pilot-Wave shows both always
    float wT = uPT, wR = uPR;
    if (uIsPW < 0.5) {
      if(uColBranch > 0.5)  wR *= (1. - uColFade);
      if(uColBranch < -0.5) wT *= (1. - uColFade);
    }

    // Pre-scatter: incoming packet approaching barrier, pointer at y=0
    float pre  = gX0 * gY0;

    // Post-scatter: T/R branches, each at its x/y centre
    float post = wT * gXT * gYT + wR * gXR * gYR;

    float dens = mix(pre, post, uBl);
    vec3  col  = inferno(clamp(dens * 2.2, 0., 1.));
    gl_FragColor = vec4(col, 1.0);
  }
`;new bt(2289288);new bt(16737843);new bt(6737151);const WE=`
  varying vec2 vPos;
  void main() { vPos = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,XE=`
  varying vec2 vPos;
  uniform float uSep;       // sepFrac 0→1
  uniform float uSepA;      // y-intercept of branch separator (= yRFixed + lam*dtA)
  uniform float uSepSlope;  // slope (perpendicular bisector of T–R direction)
  void main() {
    float sep = uSepA + uSepSlope * vPos.x;
    float isT = step(sep, vPos.y);  // 1 if in T-branch half
    vec3 tCol = vec3(0.13, 0.93, 0.53);  // green — World T
    vec3 rCol = vec3(1.0,  0.47, 0.27);  // orange — World R
    vec3 color = mix(rCol, tCol, isT);
    float alpha = uSep * 0.13;
    gl_FragColor = vec4(color, alpha);
  }
`,Lo=({text:s,children:e})=>{const[n,r]=No.useState(null),a=No.useRef(),u=()=>{var y;if(!s)return;const g=(y=a.current)==null?void 0:y.getBoundingClientRect();g&&r({x:g.left+g.width/2,yTop:g.top,yBot:g.bottom})},f=()=>r(null),c=260,m=(n?n.yTop:999)>120;return Se.jsxs("span",{ref:a,style:{position:"relative",display:"block"},onMouseEnter:u,onMouseLeave:f,children:[e,n&&s&&C_.createPortal(Se.jsx("span",{style:{position:"fixed",left:Math.min(Math.max(n.x-c/2,8),window.innerWidth-c-8),top:m?n.yTop-8:n.yBot+8,transform:m?"translateY(-100%)":"none",background:"rgba(8,20,55,0.97)",border:"1px solid rgba(80,140,255,0.4)",borderRadius:5,padding:"6px 10px",fontSize:11,color:"#b8d4ff",whiteSpace:"pre-wrap",width:c,lineHeight:1.5,zIndex:99999,pointerEvents:"none",fontFamily:"'JetBrains Mono','Courier New',monospace",boxShadow:"0 4px 16px rgba(0,0,30,0.7)"},children:s}),document.body)]})},ki=({label:s,tip:e,children:n,fullWidth:r})=>Se.jsxs("div",{style:{marginBottom:10,gridColumn:r?"1 / -1":void 0},children:[Se.jsx(Lo,{text:e,children:Se.jsx("div",{style:{fontSize:12,color:"#7ab8ff",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em",cursor:e?"help":"default",borderBottom:e?"1px dotted rgba(100,160,255,0.4)":"none",display:"inline-block"},children:s})}),n]}),Ff=["cpn","pw","mw"],jg={cpn:"Projection Postulate",pw:"Pilot-Wave",mw:"Many Worlds"},Rd={cpn:"#ff9966",pw:"#44ddff",mw:"#cc88ff"},Yg={cpn:`Projection Postulate (von Neumann):
The wavefunction collapses instantly on measurement.
The outcome is random with Born-rule probabilities.
No physical mechanism for collapse is specified —
it is an additional postulate added to the Schrödinger
equation. This is the version routinely taught in
university QM courses, often called 'Copenhagen',
though Copenhagen itself is not a single well-defined
interpretation. Contrast with GRW/CSL, which do
provide an explicit collapse mechanism.`,pw:`Pilot-Wave / de Broglie–Bohm:
The particle always has a definite position, guided
by the wavefunction via the quantum potential.
No collapse occurs; randomness arises solely from
uncertainty in the particle's initial position.`,mw:`Many-Worlds (Everett):
The wavefunction never collapses. Every outcome
occurs — in separate, non-communicating branches
of a universal wavefunction. There is no preferred
outcome and no randomness beyond branch indexing.`},og={cpn:"A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). The 2D canvas shows the full configuration space: x = particle position, y = pointer of the measuring device. When the wave reaches the detector (yellow line), measurement occurs: one branch is selected by the Born rule and the other collapses, while the pointer starts moving with the transmitted outcome.",pw:"A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Same global |Ψ(x,y)|² plus the Bohmian particle (X,Y) that rides one branch. Below: conditional wavefunction ψ_cond(x,Y(t)) and the two marginals.",mw:"A quantum particle hits a potential barrier — it tunnels through (T) or reflects (R). Both branches persist — the universe splits. World 1: particle transmitted. World 2: particle reflected. Neither world 'knows about' the other."};function jE({text:s}){const[e,n]=No.useState(!1);return Se.jsxs("div",{style:{marginTop:3},children:[Se.jsx("button",{onClick:()=>n(r=>!r),style:{background:"none",border:"none",padding:0,cursor:"pointer",fontSize:10,color:"#4a6a9a",fontFamily:"'JetBrains Mono','Courier New',monospace",textDecoration:"underline dotted"},children:e?"▲ hide":"▼ what is this?"}),e&&Se.jsx("div",{style:{fontSize:11,color:"#99b8e8",lineHeight:1.6,marginTop:4},children:s})]})}const YE=No.memo(({interp:s,setInterp:e,tTarget:n,setTTarget:r,tTargetRef:a,lam:u,setLam:f,lamRef:c,xPointer:h,setXPointer:m,xPointerRef:g,sigX:y,setSigX:v,sigXRef:S,sigY:E,setSigY:T,sigYRef:x,regime:_,setRegime:k,speed:I,setSpeed:b,speedRef:W,showWave:R,setShowWave:O,showTraj:j,setShowTraj:L,showProj:C,setShowProj:P,running:J,setRunning:q,barrierOn:ce,setBarrierOn:de,detectorOn:oe,setDetectorOn:ue,Tp:H,Rp:fe,isMobile:ee})=>{const F=Rd[s],se=ee?"8px 8px":"10px 9px";return Se.jsx("div",{style:{display:"flex",flexDirection:"column",width:"100%",fontFamily:"'JetBrains Mono','Courier New',monospace",color:"#e8f2ff",overflowY:"auto"},children:Se.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:ee?6:10,padding:se},children:[Se.jsxs(ki,{label:"Interpretation",tip:`Click to cycle: Projection Postulate → Pilot-Wave → Many Worlds

Projection Postulate: wavefunction collapses on measurement (Born rule). No mechanism specified — the rule is postulated. Used in virtually all university courses.

Pilot-Wave (de Broglie–Bohm): particle has a definite trajectory guided by the wavefunction. No collapse; randomness comes from unknown initial positions.

Many Worlds (Everett): wavefunction never collapses. All outcomes happen in branching worlds.`,children:[Se.jsx(Lo,{text:Yg[s],children:Se.jsxs("button",{onClick:()=>e(Ff[(Ff.indexOf(s)+1)%Ff.length]),style:{display:"block",width:"100%",padding:"7px 10px",marginBottom:5,background:`rgba(${s==="cpn"?"200,80,40":"30,160,220"},0.18)`,border:`2px solid ${F}`,borderRadius:6,color:F,cursor:"pointer",fontSize:13,fontFamily:"'JetBrains Mono','Courier New',monospace",fontWeight:700,textAlign:"center"},children:[">"," ",jg[s]]})}),Se.jsx(jE,{text:s==="cpn"?og.cpn:og[s]})]}),Se.jsxs(ki,{label:`Transmission  ${ce?Math.round(n*100)+"%":"100% (barrier off)"}`,tip:`Fraction of the wave that passes through the barrier.
0% = total reflection,  100% = total transmission.
(Sets the barrier height internally.)`,children:[Se.jsx("input",{type:"range",min:0,max:100,step:1,defaultValue:Math.round(n*100),ref:a,onInput:pe=>r(+pe.target.value/100),disabled:!ce,style:{width:"100%",accentColor:"#5090f0",opacity:ce?1:.35}}),Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[Se.jsx("span",{style:{color:"#ff7744"},children:"← all reflected"}),Se.jsx("span",{style:{color:"#44ee88"},children:"all transmitted →"})]})]}),Se.jsxs(ki,{label:`Coupling  ${oe?Math.round(u/3*100)+"%":"off (detector off)"}`,tip:`How far the pointer deflects after the interaction.
0 = pointer does not move (no measurement).
High = pointer clearly separates the two branches.`,children:[Se.jsx("input",{type:"range",min:0,max:3,step:.05,defaultValue:u,ref:c,onInput:pe=>f(+pe.target.value),disabled:!oe,style:{width:"100%",accentColor:"#44ffaa",opacity:oe?1:.35}}),Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[Se.jsx("span",{children:"off"}),Se.jsx("span",{children:"strong"})]})]}),Se.jsxs(ki,{label:`Detector at x = ${h.toFixed(1)}`,tip:`Position of the detector (yellow line).
The pointer only starts moving when the wave reaches this position.`,children:[Se.jsx("input",{type:"range",min:1,max:9,step:.5,defaultValue:h,ref:g,onInput:pe=>m(+pe.target.value),disabled:!oe,style:{width:"100%",accentColor:"#ffcc44",opacity:oe?1:.35}}),Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[Se.jsx("span",{children:"near"}),Se.jsx("span",{children:"far"})]})]}),Se.jsxs(ki,{label:`σ_x = ${y.toFixed(2)}`,tip:`Particle wavepacket width (Gaussian σ in x).
Also sets the initial pointer width if not overridden.`,children:[Se.jsx("input",{type:"range",min:.2,max:2,step:.05,defaultValue:y,ref:S,onInput:pe=>v(+pe.target.value),style:{width:"100%",accentColor:"#cc88ff"}}),Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[Se.jsx("span",{children:"narrow"}),Se.jsx("span",{children:"wide"})]})]}),Se.jsxs(ki,{label:`σ_pointer = ${E.toFixed(2)}`,tip:`Pointer wavepacket width (Gaussian σ in y).
Small σ_pointer + large coupling → strong measurement: T and R branches clearly resolved.
Large σ_pointer + small coupling → weak measurement: branches overlap, outcome uncertain.`,children:[Se.jsx("input",{type:"range",min:.1,max:2.5,step:.05,defaultValue:E,ref:x,onInput:pe=>T(+pe.target.value),disabled:!oe,style:{width:"100%",accentColor:"#ff88cc",opacity:oe?1:.35}}),Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[Se.jsx("span",{children:"narrow"}),Se.jsx("span",{children:"wide"})]})]}),Se.jsx(ki,{label:"Measurement regime",tip:`Presets for weak and strong measurement.

Strong: high coupling + narrow pointer → T and R branches fully resolved. The detector always gives the right answer.

Weak: low coupling + wide pointer → T and R pointer states overlap. The detector reading is ambiguous — sometimes the wrong branch is indicated.`,children:Se.jsx("div",{style:{display:"flex",gap:6},children:[{id:"weak",label:"≈ Weak",onClick:()=>{f(.6),T(.75),k("weak")},col:"#ffaa44",colBorder:"#cc7722",bgOff:"rgba(80,40,10,0.35)",bgOn:"rgba(160,80,10,0.65)"},{id:"strong",label:"⬛ Strong",onClick:()=>{f(3),T(.3),k("strong")},col:"#44ee88",colBorder:"#228844",bgOff:"rgba(10,60,40,0.35)",bgOn:"rgba(10,120,60,0.65)"}].map(({id:pe,label:Y,onClick:ae,col:he,colBorder:_e,bgOff:Re,bgOn:Le})=>{const Oe=_===pe;return Se.jsxs("button",{onClick:ae,style:{flex:1,padding:"5px 0",background:Oe?Le:Re,border:`2px solid ${Oe?he:_e}`,borderRadius:5,color:Oe?he:he+"99",cursor:"pointer",fontSize:11,fontFamily:"'JetBrains Mono','Courier New',monospace",fontWeight:Oe?700:400,boxShadow:Oe?`0 0 8px ${he}55`:"none",transition:"all 0.15s"},children:[Oe?"● ":"○ ",Y]},pe)})})}),Se.jsxs(ki,{label:"Outcome probabilities",children:[Se.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11},children:[Se.jsxs("span",{style:{color:"#44ee88"},children:["Transmitted ",Math.round(H*100),"%"]}),Se.jsxs("span",{style:{color:"#ff7744"},children:["Reflected ",Math.round(fe*100),"%"]})]}),Se.jsx("div",{style:{height:6,background:"rgba(15,30,70,0.6)",borderRadius:3,overflow:"hidden"},children:Se.jsx("div",{style:{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#22aa44,#44ee88)",width:`${Math.round(H*100)}%`,transition:"width 0.3s"}})})]}),Se.jsxs(ki,{label:"Speed",tip:"Playback speed",children:[Se.jsx("input",{type:"range",min:.1,max:4,step:.05,defaultValue:.5,ref:W,onInput:pe=>b(+pe.target.value),style:{width:"100%",accentColor:"#ffcc44"}}),Se.jsx("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:Se.jsxs("span",{children:["×",I.toFixed(1)]})})]}),Se.jsx(ki,{label:"Physics",children:Se.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:[{key:"barrier",label:"Barrier",on:ce,fn:de,tip:`Toggle the potential barrier.
Off = 100% transmission (free particle).`},{key:"detector",label:"Detector",on:oe,fn:ue,tip:`Toggle the measuring device.
Off = no coupling, pointer stays at rest.`}].map(({key:pe,label:Y,on:ae,fn:he,tip:_e})=>Se.jsx(Lo,{text:_e,children:Se.jsxs("button",{onClick:()=>he(!ae),style:{padding:"5px 10px",background:ae?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(ae?"#5588cc":"#334466"),borderRadius:5,color:ae?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"'JetBrains Mono','Courier New',monospace"},children:[ae?"◉":"○"," ",Y]})},pe))})}),Se.jsx(ki,{label:"Toggles",children:Se.jsxs("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:[[{key:"wave",label:"Wave",on:R,fn:O,tip:"Show/hide 2D |Ψ|² heatmap"},s==="pw"&&{key:"traj",label:"Paths",on:j,fn:L,tip:"Show/hide Bohmian trajectories"},s==="pw"&&{key:"proj",label:"Proj",on:C,fn:P,tip:"Also overlay global projections ρ(x), ρ(y) on the CWF panels"}].filter(Boolean).map(({key:pe,label:Y,on:ae,fn:he,tip:_e})=>Se.jsx(Lo,{text:_e,children:Se.jsxs("button",{onClick:()=>he(!ae),style:{padding:"5px 10px",background:ae?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(ae?"#5588cc":"#334466"),borderRadius:5,color:ae?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"'JetBrains Mono','Courier New',monospace"},children:[ae?"◉":"○"," ",Y]})},pe)),Se.jsx(Lo,{text:"Pause / resume",children:Se.jsx("button",{onClick:()=>q(!J),style:{padding:"5px 10px",background:J?"rgba(20,55,130,0.6)":"rgba(25,80,40,0.6)",border:"1px solid "+(J?"rgba(70,130,255,0.4)":"rgba(60,200,80,0.35)"),borderRadius:5,color:J?"#88bbff":"#66dd88",cursor:"pointer",fontSize:12,fontFamily:"'JetBrains Mono','Courier New',monospace"},children:J?"⏸":"▶"})})]})}),!ee&&Se.jsx("div",{style:{fontSize:10,color:"#506080",borderTop:"1px solid rgba(50,80,180,0.15)",paddingTop:8},children:"Drag: pan"})]})})});function qE(s,{Tp:e,Rp:n,xIn:r,xT:a,xR:u,sigX:f,bl:c,colBranch:h,colFade:m,bX:g,bY:y,bIsTransmit:v,yT:S,yR:E,sigY:T,isPW:x,interp:_,colElapsedMs:k,colPhase:I,sepFrac:b,showProj:W,xLo:R,xHi:O,rho:j,rhoXs:L,V0:C}){if(!s)return;const P=s.getContext("2d");s.clientWidth>0&&(s.width=s.clientWidth),s.clientHeight>0&&(s.height=s.clientHeight);const J=s.width,q=s.height;P.clearRect(0,0,J,q);const ce=_==="mw",de=R,oe=O,ue=Pe=>(Pe-de)/(oe-de)*J,H=h===-1?m:0,fe=h===1?m:0,ee=e*(1-H),F=n*(1-fe),se=350,pe=(q-10)*.66,Y=Pe=>{let Qe=1e-10;for(let z=0;z<=se;z++){const Ct=Pe(de+(oe-de)*z/se);Ct>Qe&&(Qe=Ct)}return Qe},ae=(Pe,Qe,z,Ct,mt)=>{const ct=Ct+mt-3;P.save(),P.beginPath(),P.rect(0,Ct,J,mt),P.clip(),P.beginPath(),P.strokeStyle=Qe,P.fillStyle=Qe+"28",P.lineWidth=2;let Ye=!0;for(let vt=0;vt<=se;vt++){const ze=de+(oe-de)*vt/se,U=ue(ze),w=ct-Pe(ze)*z;Ye?(P.moveTo(U,ct),P.lineTo(U,w),Ye=!1):P.lineTo(U,w)}P.lineTo(ue(oe),ct),P.closePath(),P.fill(),P.beginPath(),Ye=!0;for(let vt=0;vt<=se;vt++){const ze=de+(oe-de)*vt/se,U=ue(ze),w=ct-Pe(ze)*z;Ye?(P.moveTo(U,w),Ye=!1):P.lineTo(U,w)}P.stroke(),P.restore()},he=(Pe,Qe,z=pe)=>ae(Pe,Qe,z,0,q),_e=Pe=>Nn(Pe,r,f),Re=Pe=>Nn(Pe,a,f),Le=Pe=>Nn(Pe,u,f),Oe=Pe=>c*ee*Re(Pe),pt=Pe=>c*F*Le(Pe);if(ce&&c>.05){const Pe=Math.round(q/2),Qe=Math.min(b*1.5,1);P.fillStyle=`rgba(34,238,136,${.07*Qe})`,P.fillRect(0,0,J,Pe),P.fillStyle=`rgba(255,119,68,${.07*Qe})`,P.fillRect(0,Pe,J,q-Pe),P.strokeStyle=`rgba(200,170,255,${.5*Qe})`,P.lineWidth=1,P.setLineDash([4,3]),P.beginPath(),P.moveTo(0,Pe),P.lineTo(J,Pe),P.stroke(),P.setLineDash([]),P.strokeStyle="rgba(60,100,200,0.25)",P.lineWidth=1,P.beginPath(),P.moveTo(0,Pe-1),P.lineTo(J,Pe-1),P.stroke(),P.beginPath(),P.moveTo(0,q-2),P.lineTo(J,q-2),P.stroke(),P.strokeStyle="rgba(0,200,255,0.2)",P.setLineDash([3,3]),P.beginPath(),P.moveTo(ue(0),0),P.lineTo(ue(0),q),P.stroke(),P.setLineDash([]),ee>.001&&ae(Oe,"#22ee88",.75*(Pe-6)/Math.max(Y(Oe),1e-10),0,Pe),F>.001&&ae(pt,"#ff7744",.75*(q-Pe-6)/Math.max(Y(pt),1e-10),Pe,q-Pe);const z=Math.max(7,Math.round(q*.12)),Ct=Math.round(q*.09);P.font=`bold ${z}px 'JetBrains Mono',monospace`,P.fillStyle=`rgba(34,238,136,${.85*Qe})`,P.fillText("World 1  (transmitted)",6,Ct),P.fillStyle=`rgba(255,119,68,${.85*Qe})`,P.fillText("World 2  (reflected)",6,Pe+Ct)}else if(P.fillStyle="#020812",P.fillRect(0,0,J,q),P.strokeStyle="rgba(60,100,200,0.25)",P.lineWidth=1,P.beginPath(),P.moveTo(0,q-2),P.lineTo(J,q-2),P.stroke(),P.strokeStyle="rgba(0,200,255,0.2)",P.setLineDash([3,3]),P.beginPath(),P.moveTo(ue(0),0),P.lineTo(ue(0),q),P.stroke(),P.setLineDash([]),x){const Pe=Nn(y,S,T),Qe=Nn(y,E,T),z=Math.max(Pe,Qe,1e-8);1-c>.01&&he(Ct=>(1-c)*_e(Ct),"#88aaff",pe),c>.05&&ee>.001&&(pe/Math.max(Y(Ct=>c*e*(Pe/z)*Re(Ct)),1e-10)*c*e*(Pe/z),he(Ct=>c*e*(Pe/z)*Re(Ct),"#22ee88",pe)),c>.05&&F>.001&&he(Ct=>c*n*(Qe/z)*Le(Ct),"#ff7744",pe),W&&(ee>.001&&he(Oe,"rgba(34,238,136,0.4)",pe/Y(Oe)),F>.001&&he(pt,"rgba(255,119,68,0.4)",pe/Y(pt)))}else{const Pe=pe,Qe=1-c;Qe>.01&&he(z=>Qe*_e(z),"#88aaff",Pe),c>.01&&ee>.001&&he(Oe,"#22ee88",Pe),c>.01&&F>.001&&he(pt,"#ff7744",Pe)}if(!ce&&x&&g!==void 0){const Pe=ue(g);P.strokeStyle="rgba(255,255,255,0.65)",P.lineWidth=1.5,P.setLineDash([4,3]),P.beginPath(),P.moveTo(Pe,0),P.lineTo(Pe,q-4),P.stroke(),P.setLineDash([]),P.fillStyle="#ffffff",P.beginPath(),P.arc(Pe,q-4-3,3,0,2*Math.PI),P.fill()}if(!ce){const Pe=Math.max(9,Math.round(q*.16)),Qe=Math.round(q*.22);if(P.font=`${Pe}px 'JetBrains Mono', monospace`,x)c<.05?(P.fillStyle="#88aaff",P.fillText("Ψ_in(x)",6,Qe)):(v&&ee>.001&&(P.fillStyle="#22ee88",P.fillText("T",ue(a)-6,Qe)),!v&&F>.001&&(P.fillStyle="#ff7744",P.fillText("R",ue(u)-6,Qe)));else{const z=h>=0,Ct=h<=0;c>.12&&ee>.05&&z&&(P.fillStyle=`rgba(34,238,136,${Math.min(c*1.5,.9)})`,P.fillText("T",Math.min(J-20,ue(a)-6),Qe)),c>.12&&F>.05&&Ct&&(P.fillStyle=`rgba(255,119,68,${Math.min(c*1.5,.9)})`,P.fillText("R",Math.max(6,ue(u)-6),Qe))}}}const $E=No.forwardRef(function(e,n){return Se.jsx("canvas",{ref:n,width:900,height:70,style:{width:"100%",height:"100%",display:"block"}})});function KE(s,{Tp:e,Rp:n,yT:r,yR:a,yRFixed:u,sigY:f,bl:c,colBranch:h,colFade:m,bY:g,bX:y,bIsTransmit:v,xT:S,xR:E,sigX:T,isPW:x,interp:_,sepFrac:k,showProj:I,yLo:b,yHi:W}){if(!s)return;const R=s.getContext("2d");s.clientWidth>0&&(s.width=s.clientWidth),s.clientHeight>0&&(s.height=s.clientHeight);const O=s.width,j=s.height;R.clearRect(0,0,O,j);const L=_==="mw";R.fillStyle="#020812",R.fillRect(0,0,O,j);const C=b,P=W,J=u,q=pe=>(1-(pe-C)/(P-C))*j;R.strokeStyle="rgba(60,100,200,0.25)",R.lineWidth=1,R.beginPath(),R.moveTo(2,0),R.lineTo(2,j),R.stroke(),R.strokeStyle="rgba(0,200,255,0.2)",R.setLineDash([3,3]),R.beginPath(),R.moveTo(0,q(0)),R.lineTo(O,q(0)),R.stroke(),R.setLineDash([]);const ce=h===-1?m:0,de=h===1?m:0,oe=e*(1-ce),ue=n*(1-de),H=350,fe=(O-6)*.88,ee=(pe,Y,ae=4,he=fe)=>{R.beginPath(),R.strokeStyle=Y,R.fillStyle=Y+"28",R.lineWidth=2;let _e=!0;for(let Re=0;Re<=H;Re++){const Le=C+(P-C)*Re/H,Oe=q(Le),pt=ae+pe(Le)*he;_e?(R.moveTo(ae,Oe),R.lineTo(pt,Oe),_e=!1):R.lineTo(pt,Oe)}R.lineTo(ae,q(C)),R.closePath(),R.fill(),R.beginPath(),_e=!0;for(let Re=0;Re<=H;Re++){const Le=C+(P-C)*Re/H,Oe=q(Le),pt=ae+pe(Le)*he;_e?(R.moveTo(pt,Oe),_e=!1):R.lineTo(pt,Oe)}R.stroke()};if(ee(pe=>(1-c)*Nn(pe,u,f),"#88aaff"),L&&c>.05){const pe=Math.min(k*1.5,1),Y=O/2;R.fillStyle=`rgba(34,238,136,${.07*pe})`,R.fillRect(0,0,Y,j),R.fillStyle=`rgba(255,119,68,${.07*pe})`,R.fillRect(Y,0,O-Y,j),R.strokeStyle=`rgba(200,170,255,${.5*pe})`,R.lineWidth=1,R.setLineDash([4,3]),R.beginPath(),R.moveTo(Y,0),R.lineTo(Y,j),R.stroke(),R.setLineDash([]),oe>.001&&(R.save(),R.beginPath(),R.rect(0,0,Y,j),R.clip(),ee(ae=>c*oe*Nn(ae,r,f),"#22ee88",4,(Y-6)*.88),R.restore()),ue>.001&&(R.save(),R.beginPath(),R.rect(Y,0,O-Y,j),R.clip(),ee(ae=>c*ue*Nn(ae,J,f),"#ff7744",Y+2,(O-Y-6)*.88),R.restore())}else if(x&&c>.05){const pe=Nn(y,S,T),Y=Nn(y,E,T),ae=Math.max(pe,Y,1e-8);oe>.001&&ee(he=>c*e*(pe/ae)*Nn(he,r,f),"#22ee88"),ue>.001&&ee(he=>c*n*(Y/ae)*Nn(he,J,f),"#ff7744"),I&&(oe>.001&&ee(he=>c*oe*Nn(he,r,f),"rgba(34,238,136,0.35)"),ue>.001&&ee(he=>c*ue*Nn(he,J,f),"rgba(255,119,68,0.35)"))}else!x&&!L&&(oe>.001&&ee(pe=>c*oe*Nn(pe,r,f),"#22ee88"),ue>.001&&ee(pe=>c*ue*Nn(pe,J,f),"#ff7744"));if(!L&&x&&g!==void 0){const pe=q(g);R.strokeStyle="rgba(255,255,255,0.65)",R.lineWidth=1.5,R.setLineDash([4,3]),R.beginPath(),R.moveTo(4,pe),R.lineTo(O,pe),R.stroke(),R.setLineDash([]),R.fillStyle="#ffffff",R.beginPath(),R.arc(7,pe,3,0,2*Math.PI),R.fill()}if(!L){const pe=Math.max(8,Math.round(O*.17));R.font=`bold ${pe}px 'JetBrains Mono', monospace`,R.textAlign="left";const Y=5,ae=x?c>.05&&v:h>=0,he=x?c>.05&&!v:h<=0;c>.12&&oe>.05&&ae&&(R.fillStyle=`rgba(34,238,136,${Math.min(c*1.5,.9)})`,R.fillText("T",Y,q(r)-4)),c>.12&&ue>.05&&he&&Math.abs(r-J)>f*.5&&(R.fillStyle=`rgba(255,119,68,${Math.min(c*1.5,.9)})`,R.fillText("R",Y,q(J)-4))}R.save(),R.translate(O-4,j/2),R.rotate(-Math.PI/2);const F=Math.max(9,Math.round(O*.16));R.font=`${F}px 'JetBrains Mono', monospace`,R.fillStyle="rgba(100,160,255,0.5)",R.textAlign="center";const se=L?"pointer projection — two worlds":x?"ψ_cond(y|X(t))":"pointer projection  ρ(y) = ∫|Ψ|²dx";R.fillText(se,0,0),R.restore()}const ZE=No.forwardRef(function(e,n){return Se.jsx("canvas",{ref:n,width:70,height:500,style:{width:"100%",height:"100%",display:"block"}})}),ag=[2289288,4521898,52360,8978380],lg=[16737843,16750933,16729088,16755268];function QE({interp:s}){const e=a=>Se.jsx("div",{style:{fontFamily:"'JetBrains Mono','Courier New',monospace",fontSize:13,color:"#d0e8ff",background:"rgba(20,40,100,0.25)",padding:"8px 12px",borderRadius:5,margin:"6px 0",lineHeight:1.8,borderLeft:"3px solid rgba(80,140,255,0.4)",whiteSpace:"pre"},children:a}),n=a=>Se.jsx("div",{style:{color:"#44bbff",fontWeight:700,fontSize:13,marginTop:14,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"},children:a}),r=a=>Se.jsx("div",{style:{fontSize:12,color:"#9ab8dd",lineHeight:1.8,marginBottom:4},children:a});return Se.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"14px 20px",fontFamily:"'JetBrains Mono','Courier New',monospace",background:"#040a1c",color:"#9ab8dd"},children:[n("Initial state"),r("Particle Gaussian wavepacket approaching barrier, pointer at rest:"),e(`Ψ₀(x,y) = ψ₀(x) · χ₀(y)

ψ₀(x) = exp[-(x-x₀)²/4σₓ²] · exp[ik₀x]
χ₀(y) = exp[-y²/4σ_p²]

σₓ     — particle wavepacket width (σ_x slider)
σ_p    — pointer wavepacket width (σ_pointer slider)`),n("After barrier scattering"),r(`The barrier splits the particle into transmitted (T) and reflected (R) branches.
Each branch couples to the pointer via H_int = λ (Π_T - Π_R) P_y:`),e(`Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)
         + √R · ψ_R(x,t) · χ_R(y,t)

ψ_T:  centre → +v₀t   (transmitted)
ψ_R:  centre → -v₀t   (reflected)
χ_T:  centre → +λt    (pointer shifts up)
χ_R:  centre → -λt    (pointer shifts down)`),n("Probabilities"),r("Exact rectangular-barrier transmission (ℏ = m = 1, barrier width a):"),e(`T = 1 / [1 + V₀² sinh²(κa) / (4E(V₀-E))]   (E < V₀)
T = 1 / [1 + V₀² sin²(κa)  / (4E(E-V₀))]   (E > V₀)

E = k₀²/2,   κ = √(2|V₀-E|)`),n("Marginal densities"),r("The x-projection (below) and y-projection (right strip):"),e(`ρ(x,t) = ∫|Ψ(x,y,t)|²dy  ≈  T·|ψ_T(x)|² + R·|ψ_R(x)|²

ρ(y,t) = ∫|Ψ(x,y,t)|²dx  ≈  T·|χ_T(y)|² + R·|χ_R(y)|²`),s==="cpn"&&Se.jsxs(Se.Fragment,{children:[n("Projection Postulate"),r("The 2D canvas shows the full configuration space (x = particle, y = pointer). The yellow detector line marks where measurement begins. When the wave reaches that detector, the global wavefunction collapses to one branch with Born-rule probability:"),e(`Ψ(x,y,t*)  →  ψ_T · χ_T   with prob T
            →  ψ_R · χ_R   with prob R = 1 - T`),r("The mechanism of collapse is not specified by the theory.")]}),s==="mw"&&Se.jsxs(Se.Fragment,{children:[n("Many Worlds — no collapse"),r("The wavefunction evolves unitarily forever. After scattering, the global state is:"),e(`Ψ(x,y,t) = √T · ψ_T(x,t) · χ_T(y,t)
         + √R · ψ_R(x,t) · χ_R(y,t)`),r("Both branches are equally real. There is no collapse and no preferred outcome. The universe 'splits' into two non-interacting worlds:"),e(`World 1:  ψ_T · χ_T   (particle transmitted, pointer up)
World 2:  ψ_R · χ_R   (particle reflected, pointer down)`),r("The diagonal dividing line in the simulation marks where the two branches separate in configuration space. Each half of the 2D canvas belongs to a different world."),r("The x- and y-projection panels are each split in two: the top/green half shows World 1 (transmitted), the bottom/orange half shows World 2 (reflected)."),r("Probabilities emerge from the Born rule applied to the branch amplitudes — but in MW this is a derived (and debated) result, not a postulate."),e(`P(World 1) = ‖√T ψ_T χ_T‖² = T
P(World 2) = ‖√R ψ_R χ_R‖² = R`)]}),s==="pw"&&Se.jsxs(Se.Fragment,{children:[n("Pilot-wave — guidance equation"),r("The particle has a definite position (X,Y) at all times, guided by:"),e(`dX/dt = ℏ/m · Im[Ψ* ∂_x Ψ] / |Ψ|²  |_(X,Y)
dY/dt = ℏ/m · Im[Ψ* ∂_y Ψ] / |Ψ|²  |_(X,Y)`),r("For the two-branch state with non-overlapping lobes, whichever branch contains (X,Y) acts as the effective wavefunction — the other branch is 'empty'."),e("ψ_cond(x,t) = Ψ(x, Y(t), t)  [conditional wavefunction]")]}),n("Measurement strength"),r("The quality of a measurement depends on whether the pointer states for T and R can be distinguished. Define the separation-to-width ratio:"),e(`Δy = 2λt*          — centre-to-centre separation at time t*
σ_p             — pointer wavepacket width

Strong:  Δy ≫ σ_p  →  ⟨χ_T|χ_R⟩ ≈ 0,  outcome unambiguous
Weak:    Δy ≲ σ_p  →  ⟨χ_T|χ_R⟩ > 0,  pointer states overlap`),r("In the weak regime the pointer reading is statistically biased toward the mean position but cannot certify which branch the particle is on. Use the Weak / Strong preset buttons to explore both limits."),n("Animation"),r("Units: ℏ = m = 1. Velocity v₀ = k₀. The simulation rescales physical time to fit the canvas. The barrier occupies |x| < 0.5.")]})}function JE(s,e,n,r){s.clearRect(0,0,e,n);const a=e/2,u=n/2,f=Math.min(a,u)-3,c=2*Math.PI/3;s.beginPath(),s.arc(a,u,f,0,2*Math.PI),s.fillStyle="rgba(8,16,40,0.92)",s.fill(),s.strokeStyle="rgba(180,200,255,0.65)",s.lineWidth=2.5,s.stroke(),s.beginPath(),s.arc(a,u,f-5,-Math.PI/2-c,-Math.PI/2+c),s.strokeStyle="rgba(60,100,200,0.22)",s.lineWidth=5,s.stroke();const h=6;for(let v=0;v<=h;v++){const S=v/h,E=-Math.PI/2+(S-.5)*2*c,T=v===0||v===h||v===h/2,x=T?f*.22:f*.13;s.strokeStyle=T?"rgba(200,210,255,0.8)":"rgba(140,160,210,0.4)",s.lineWidth=T?2:1,s.beginPath(),s.moveTo(a+Math.cos(E)*(f-x-2),u+Math.sin(E)*(f-x-2)),s.lineTo(a+Math.cos(E)*(f-3),u+Math.sin(E)*(f-3)),s.stroke()}const m=f*.67,g=-Math.PI/2-c,y=-Math.PI/2+c;s.font=`bold ${Math.round(f*.28)}px 'JetBrains Mono',monospace`,s.textAlign="center",s.textBaseline="middle",s.fillStyle="rgba(255,110,60,0.85)",s.fillText("R",a+Math.cos(g)*m,u+Math.sin(g)*m),s.fillStyle="rgba(34,238,136,0.85)",s.fillText("T",a+Math.cos(y)*m,u+Math.sin(y)*m),r.forEach(({fraction:v,color:S,alpha:E})=>{if(E<.03)return;const T=-Math.PI/2+(v-.5)*2*c;s.save(),s.globalAlpha=E,s.shadowColor=S,s.shadowBlur=7,s.strokeStyle=S,s.lineWidth=2.5,s.lineCap="round",s.beginPath(),s.moveTo(a+Math.cos(T+Math.PI)*f*.18,u+Math.sin(T+Math.PI)*f*.18),s.lineTo(a+Math.cos(T)*f*.76,u+Math.sin(T)*f*.76),s.stroke(),s.shadowBlur=0,s.fillStyle="rgba(210,225,255,0.95)",s.beginPath(),s.arc(a,u,4,0,2*Math.PI),s.fill(),s.restore()})}function eT(){const s=Mt.useRef(null),e=Mt.useRef(null),n=Mt.useRef(null),r=Mt.useRef(null),a=Mt.useRef(null),u=Mt.useRef(null),f=Mt.useRef(null),c=Mt.useRef(null),h=Mt.useRef(null),m=Mt.useRef(null),g=Mt.useRef(null),[y,v]=Mt.useState(()=>window.innerWidth),[S,E]=Mt.useState(()=>window.innerHeight);Mt.useEffect(()=>{const D=()=>{v(window.innerWidth),E(window.innerHeight)};return window.addEventListener("resize",D),()=>window.removeEventListener("resize",D)},[]);const T=y<=700,x=T&&y>S,_=!T,[k,I]=Mt.useState(()=>Math.round((window.innerHeight-28)/5));Mt.useEffect(()=>{const D=g.current;if(!D)return;const we=new ResizeObserver(()=>{const ne=D.offsetHeight;ne>0&&I(ne)});return we.observe(D),()=>we.disconnect()},[]);const b=T&&!x,W=x?200:T?"100%":240,R=Mt.useRef({interp:"cpn",k0:4,V0:sg(.5,4),tTarget:.5,lam:3,sigX:.5,sigY:.3,xPointer:3,speed:.5,showWave:!0,showTraj:!0,showProj:!1,running:!0,tick:0,dirty:!0,pauseUntil:0,camX:0,camY:0,camZ:14,drag:null,colBranch:0,colFade:0,colTriggered:!1,colYHold:0,colPhase:0,barrierOn:!0,detectorOn:!0,marg:{Tp:.5,Rp:.5,xIn:Zi,xT:0,xR:0,yT:0,yR:0,sigX:.5,sigY:.3,bl:0,colBranch:0,colFade:0,bX:0,bY:0}}),[O,j]=Mt.useState("cpn"),[L,C]=Mt.useState(.5),[P,J]=Mt.useState(3),[q,ce]=Mt.useState(3),[de,oe]=Mt.useState(.5),[ue,H]=Mt.useState(.3),[fe,ee]=Mt.useState("strong"),[F,se]=Mt.useState(.5),[pe,Y]=Mt.useState(!0),[ae,he]=Mt.useState(!0),[_e,Re]=Mt.useState(!1),[Le,Oe]=Mt.useState(!0),[pt,Pe]=Mt.useState(!0),[Qe,z]=Mt.useState(!0),[Ct,mt]=Mt.useState(.5),[ct,Ye]=Mt.useState(.5),[vt,ze]=Mt.useState(0),[U,w]=Mt.useState(0),te=Mt.useRef(null),ve=D=>{R.current.interp=D,j(D),R.current.colBranch=0,R.current.colFade=0,R.current.colTriggered=!1,R.current.colYHold=0,R.current.dirty=!0},xe=D=>{R.current.tTarget=D,R.current.V0=sg(D,R.current.k0),R.current.dirty=!0,C(D),mt(D),Ye(1-D),e.current&&(e.current.value=Math.round(D*100))},ge=D=>{R.current.lam=D,R.current.dirty=!0,J(D),n.current&&(n.current.value=D),ee(null)},$e=D=>{R.current.xPointer=D,ce(D),r.current&&(r.current.value=D)},De=D=>{R.current.sigX=D,R.current.dirty=!0,oe(D),a.current&&(a.current.value=D),ee(null)},He=D=>{R.current.sigY=D,R.current.dirty=!0,H(D),u.current&&(u.current.value=D),ee(null)},gt=D=>{R.current.speed=D,se(D),f.current&&(f.current.value=D)},Ce=D=>{R.current.showWave=D,Y(D)},Ge=D=>{R.current.showTraj=D,he(D)},et=D=>{R.current.showProj=D,Re(D)},st=D=>{R.current.running=D,Oe(D)},We=D=>{R.current.barrierOn=D,R.current.dirty=!0,Pe(D)},xt=D=>{R.current.detectorOn=D,R.current.dirty=!0,z(D)};Mt.useEffect(()=>{const D=s.current;if(!D)return;const we=new OE({antialias:!0});we.setClearColor(4,1),we.domElement.style.cssText="display:block;width:100%;height:100%;touch-action:pan-y;",D.appendChild(we.domElement);const ne=new jv,me=new Mi(52,1,.1,200);function Ne(){const B=D.offsetWidth||D.clientWidth||window.innerWidth,Te=D.offsetHeight||D.clientHeight||window.innerHeight;we.setSize(B,Te,!1),we.setPixelRatio(Math.min(window.devicePixelRatio,2)),me.aspect=B/Te,me.updateProjectionMatrix()}Ne();const Ie=new ResizeObserver(Ne);Ie.observe(D);function ot(){const B=R.current;me.position.set(B.camX,B.camY,B.camZ),me.lookAt(B.camX,B.camY,0)}ot(),rg(R.current.k0,R.current.V0,R.current.sigX);const zt=new qv(Jt.rhoBuf,Jt.nx,1,Ud,Qi);zt.minFilter=Ti,zt.magFilter=Ti,zt.needsUpdate=!0;const en={uBl:{value:0},uPT:{value:.5},uPR:{value:.5},uYT:{value:0},uYR:{value:0},uSigX:{value:1},uSigY:{value:.6},uColBranch:{value:0},uColFade:{value:0},uIsPW:{value:0},uBY:{value:0},uXin:{value:Zi},uXT:{value:0},uXR:{value:0}},At=new Kn(new Ns(60,40),new Ji({vertexShader:VE,fragmentShader:GE,uniforms:en,side:Bi,depthWrite:!1}));At.position.z=-.1,ne.add(At);const En=new Co({color:1718894,transparent:!0,opacity:.45});ne.add(new As(new Cn().setFromPoints([new Z(-14,0,0),new Z(14,0,0)]),En)),ne.add(new As(new Cn().setFromPoints([new Z(0,-10,0),new Z(0,10,0)]),En));const _n=new Co({color:52479,transparent:!0,opacity:.5}),er=new As(new Cn().setFromPoints([new Z(-.5,-10,0),new Z(-.5,10,0)]),_n);ne.add(er);const wi=new As(new Cn().setFromPoints([new Z(.5,-10,0),new Z(.5,10,0)]),_n);ne.add(wi);const fi=new Kn(new Ns(1,20),new Ia({color:8772,transparent:!0,opacity:.15,side:Bi}));ne.add(fi);const Ai=new Co({color:16763972,transparent:!0,opacity:.7}),tr=new Cn().setFromPoints([new Z(3,-10,.05),new Z(3,10,.05)]),Vi=new As(tr,Ai);ne.add(Vi);const Ri="700 24px 'JetBrains Mono','Courier New',monospace",nr=Qn("detector","#ffcc44",Ri);nr.scale.set(4.6,1.05,1),nr.position.set(3,9,.2),ne.add(nr);function Qn(B,Te,at="700 16px 'JetBrains Mono','Courier New',monospace"){const Nt=document.createElement("canvas");Nt.width=300,Nt.height=52;const tn=Nt.getContext("2d");tn.font=at,tn.fillStyle=Te,tn.textAlign="center",tn.textBaseline="middle",tn.fillText(B,150,26);const nn=new Lm(Nt),Ft=new Cm(new wd({map:nn,transparent:!0,opacity:.85}));return Ft.scale.set(5.2,.9,1),Ft}const ir=Qn("barrier V0","#00dcff",Ri);ir.scale.set(4.6,1.05,1),ir.position.set(0,9,.2),ne.add(ir);const Gn=Qn("T-branch  (x>0,  y>0)","#44ee88"),Rr=Qn("R-branch  (x<0,  y<0)","#ff8844");Gn.position.set(6.5,5.5,.2),ne.add(Gn),Rr.position.set(-6.5,-5.5,.2),ne.add(Rr);const ls={uSep:{value:0},uSepA:{value:0},uSepSlope:{value:-1}},Cr=new Kn(new Ns(60,40),new Ji({vertexShader:WE,fragmentShader:XE,uniforms:ls,transparent:!0,depthWrite:!1}));Cr.position.z=0,Cr.visible=!1,ne.add(Cr);const br=new As(new Cn().setFromPoints([new Z(-15,0,.1),new Z(15,0,.1)]),new Co({color:13413119,transparent:!0,opacity:0}));br.visible=!1,ne.add(br);const Pr=Qn("World 1  (transmitted)","#44ee88"),Lr=Qn("World 2  (reflected)","#ff8844");Pr.visible=!1,Lr.visible=!1,ne.add(Pr),ne.add(Lr);const A=Array.from({length:cu},()=>{const B=new Float32Array((Mr+1)*3),Te=new Float32Array((Mr+1)*3),at=new Cn;at.setAttribute("position",new ci(B,3)),at.setAttribute("color",new ci(Te,3));const Nt=new As(at,new Co({vertexColors:!0,transparent:!0,opacity:.7}));return ne.add(Nt),{geo:at,pos:B,col:Te,line:Nt}}),X=Array.from({length:cu},()=>{const B=new Kn(new Eu(.18,16),new Ia({transparent:!0,opacity:0,depthWrite:!1}));return ne.add(B),B}),ie=Array.from({length:cu},()=>{const B=new Kn(new Eu(.42,16),new Ia({transparent:!0,opacity:0,depthWrite:!1,blending:Of}));return ne.add(B),B});let K=[];function $(){const B=R.current,Te=B.barrierOn?B.V0:0,at=B.detectorOn?B.lam:0;if(rg(B.k0,Te,B.sigX),B.interp==="cpn"){K=[],A.forEach(Ft=>Ft.line.visible=!1),X.forEach(Ft=>Ft.visible=!1),ie.forEach(Ft=>Ft.visible=!1);return}K=HE(B.k0,Te,at,B.sigX,B.sigY,1);const Nt=Math.abs(Zi)/B.k0,tn=(Nt+9)/Mr,nn=Math.round(Mr*.4);K.forEach(({pts:Ft,isTransmit:lt},St)=>{const dt=A[St],rn=lt?ag:lg,Dt=new bt(rn[St%rn.length]),ht=new bt(3368601);dt.rawY=new Float32Array(Ft.length),dt.dtAs=new Float32Array(Ft.length),Ft.forEach((vn,cn)=>{dt.rawY[cn]=vn.y,dt.dtAs[cn]=Math.max(0,cn*tn-Nt)}),Ft.forEach((vn,cn)=>{dt.pos[cn*3]=vn.x,dt.pos[cn*3+1]=vn.y,dt.pos[cn*3+2]=.05;const Jn=qi((cn-nn)/20,0,1);dt.col[cn*3]=Nf(ht.r,Dt.r,Jn),dt.col[cn*3+1]=Nf(ht.g,Dt.g,Jn),dt.col[cn*3+2]=Nf(ht.b,Dt.b,Jn)}),dt.geo.attributes.position.needsUpdate=!0,dt.geo.attributes.color.needsUpdate=!0,dt.geo.setDrawRange(0,Ft.length),dt.line.visible=!1});for(let Ft=1;Ft<cu;Ft++)A[Ft].line.visible=!1,X[Ft].visible=!1,ie[Ft].visible=!1}$();function Ee(B){B.pointerType!=="touch"&&(R.current.drag={x:B.clientX,y:B.clientY},D.setPointerCapture(B.pointerId))}function Ue(B){const Te=R.current;if(!Te.drag)return;const at=B.clientX-Te.drag.x,Nt=B.clientY-Te.drag.y;Te.drag.x=B.clientX,Te.drag.y=B.clientY;const tn=Te.camZ/14*.016;Te.camX-=at*tn,Te.camY+=Nt*tn,ot()}function ke(B){R.current.drag=null,D.hasPointerCapture(B.pointerId)&&D.releasePointerCapture(B.pointerId)}function Ve(B){B.preventDefault()}const rt=B=>B.preventDefault();D.addEventListener("pointerdown",Ee),D.addEventListener("pointermove",Ue),D.addEventListener("pointerup",ke),D.addEventListener("wheel",Ve,{passive:!1}),D.addEventListener("contextmenu",rt);const Je=document.createElement("canvas");Je.width=128,Je.height=128;const je=Je.getContext("2d"),Et=new Lm(Je),ft=new Cm(new wd({map:Et,transparent:!0,depthWrite:!1}));ne.add(ft),c.current={scene:ne,camera:me,renderer:we,heatUni:en,heatMesh:At,fLines:A,fDots:X,fGlows:ie,lblT:Gn,lblR:Rr,mwOverlay:Cr,mwUni:ls,mwDivLine:br,lblMW1:Pr,lblMW2:Lr,ptrLine:Vi,lblPointer:nr,lblBarrier:ir,bLine1:er,bLine2:wi,bFill:fi,gaugeCanvas:Je,gCtx:je,gaugeTex:Et,gaugeSprite:ft,rebuild:$,trajs:()=>K,updateCam:ot};let jt,Gt=0;function Rt(){jt=requestAnimationFrame(Rt);const B=R.current,Te=c.current;if(!Te)return;B.dirty&&(Te.rebuild(),B.dirty=!1);const at=performance.now();B.running&&(B.pauseUntil>0?at>=B.pauseUntil&&(B.tick=0,B.pauseUntil=0,B.colTriggered=!1,B.colBranch=0,B.colFade=0,B.colYHold=0,B.dirty=!0):B.tick+=B.speed),ot();const Nt=Math.tan(26*Math.PI/180),tn=Te.renderer.domElement.clientWidth,nn=Te.renderer.domElement.clientHeight,Ft=tn===0||nn===0;let lt,St;if(Ft)if(B._halfW)lt=B._halfW,St=B._halfH;else{const Tt=h.current,Kt=Tt?Tt.clientWidth/Math.max(Tt.clientHeight,1):4;St=7/Math.max(Kt,.1),lt=Kt*St,B._halfW=lt,B._halfH=St}else{const Tt=tn/nn,Kt=7/(Tt*Nt),Bt=Math.max(B.camZ,Kt);Bt>B.camZ&&(me.position.z=Bt),St=Nt*Bt,lt=Tt*St,B._halfW=lt,B._halfH=St}const dt=B.camY-St*.6,rn=B.barrierOn?B.V0:0,Dt=B.detectorOn?B.lam:0,ht=qi(Wg(B.k0,rn),0,1),vn=1-ht,cn=B.k0,Jn=Math.abs(Zi)/cn,za=Jn+9,ks=Math.min(B.tick%ig/ig,1),rr=ks*za,Bs=qi(.5*(1+Math.tanh(10*(rr-Jn))),0,1),Dr=Math.max(0,rr-Jn),Ci=Zi+cn*Math.min(rr,Jn),ei=cn*Dr,di=-cn*Dr,Ur=Jn+B.xPointer/cn,Ir=Math.max(0,rr-Ur),ti=B.interp==="cpn"&&B.colTriggered&&B.colBranch>0?B.colYHold:Ir,jo=dt+2*Dt*ti,Ha=dt,Tn=Dt>0?qi(ti/3,0,1):0,Yo=qi(Math.round(ks*Mr),0,Mr),qo=Math.min(lt-1.5,9);B.running&&B.pauseUntil===0&&ei>qo&&(B.pauseUntil=performance.now()+500),B.interp==="cpn"&&B.detectorOn&&Dt>0?(ks<.02&&B.colTriggered&&(B.colTriggered=!1,B.colBranch=0,B.colFade=0,B.colYHold=0),!B.colTriggered&&rr>=Ur&&(B.colTriggered=!0,B.colBranch=Math.random()<ht?1:-1,B.colYHold=Math.max(Ir,1),B.colFade=0,B.colStartMs=performance.now(),B.colPhase=0,B._flashPending=!0),B.colTriggered&&(B.colFade=Math.min(B.colFade+.08,1))):(B.colBranch=0,B.colFade=0,B.colTriggered=!1,B.colYHold=0);const zs=Te.trajs();let $o=0,Ko=0,sr=!1;if(zs.forEach(({pts:Tt,isTransmit:Kt},Bt)=>{const Wt=A[Bt];if(Bt>=1||B.interp!=="pw"){Wt.line.visible=!1,X[Bt].visible=!1,ie[Bt].visible=!1;return}if(Wt.line.visible=B.showTraj,B.showTraj&&Wt.geo.setDrawRange(0,Yo+1),Wt.rawY&&Wt.dtAs){const us=B.xPointer/B.k0;for(let sn=0;sn<=Mr;sn++){const Fr=Math.max(0,Wt.dtAs[sn]-us),Zo=Kt?2*Dt*Fr:0;Wt.pos[sn*3+1]=dt+Wt.rawY[sn]+Zo}Wt.geo.attributes.position.needsUpdate=!0}const On=Tt[Yo],ni=B.xPointer/B.k0,ar=Math.max(0,(Wt.dtAs?Wt.dtAs[Yo]:0)-ni),wn=Kt?2*Dt*ar:0,ii=dt+On.y+wn;if(Bt===0&&($o=On.x,Ko=ii,sr=Kt),X[Bt].visible=B.showTraj,ie[Bt].visible=B.showTraj,B.showTraj){X[Bt].position.set(On.x,ii,.15),ie[Bt].position.set(On.x,ii,.12);const us=Kt?ag:lg,sn=new bt(us[Bt%us.length]);X[Bt].material.color.copy(sn),ie[Bt].material.color.copy(sn),X[Bt].material.opacity=.93,ie[Bt].material.opacity=.2*Tn}}),Te.ptrLine&&(Te.ptrLine.geometry.setFromPoints([new Z(B.xPointer,-20,.05),new Z(B.xPointer,20,.05)]),Te.ptrLine.visible=B.detectorOn),Te.lblPointer&&(Te.lblPointer.position.set(B.xPointer,B.camY+St-.8,.2),Te.lblPointer.visible=B.detectorOn),Te.lblBarrier&&(Te.lblBarrier.position.set(0,B.camY+St-.8,.2),Te.lblBarrier.visible=B.barrierOn),Te.bLine1&&(Te.bLine1.visible=B.barrierOn),Te.bLine2&&(Te.bLine2.visible=B.barrierOn),Te.bFill&&(Te.bFill.visible=B.barrierOn),Xg(rr),zt.needsUpdate=!0,Te.heatMesh.visible=B.showWave,B.showWave){const Tt=Te.heatUni;Tt.uBl.value=Bs,Tt.uPT.value=ht,Tt.uPR.value=vn,Tt.uXin.value=Ci,Tt.uXT.value=ei,Tt.uXR.value=di,Tt.uYT.value=jo,Tt.uYR.value=dt,Tt.uSigX.value=B.sigX,Tt.uSigY.value=B.sigY,Tt.uColBranch.value=B.colBranch,Tt.uColFade.value=B.colFade,Tt.uIsPW.value=B.interp==="pw"?1:0,Tt.uBY.value=Ko}Te.lblT.visible=Tn>.3,Te.lblR.visible=Tn>.3;const Nr=Math.min(6.5,lt-2.2),hi=Math.min(5.2,lt*.68),or=hi*(52/300),Gi=B.interp==="mw";if(Te.lblT.visible=!Gi&&Tn>.3,Te.lblR.visible=!Gi&&Tn>.3,Te.lblT.position.set(Nr,5.5,.2),Te.lblR.position.set(-Nr,-5.5,.2),Te.lblT.scale.set(hi,or,1),Te.lblR.scale.set(hi,or,1),Te.mwOverlay.visible=Gi,Te.mwDivLine.visible=Gi&&Tn>.05,Te.lblMW1.visible=Gi&&Tn>.3,Te.lblMW2.visible=Gi&&Tn>.3,Gi){const Tt=dt+Dt*Dr,Kt=Dt>0?-B.k0/(2*Dt):0;Te.mwUni.uSep.value=Tn,Te.mwUni.uSepA.value=Tt,Te.mwUni.uSepSlope.value=Kt,Te.mwDivLine.geometry.setFromPoints([new Z(-lt,Tt+Kt*-lt,.1),new Z(lt,Tt+Kt*lt,.1)]),Te.mwDivLine.material.opacity=Math.min(Tn*1.5,.65);const Bt=2.5,Wt=qi(ei*.7,-(lt-Bt),lt-Bt),On=qi(jo*.7+dt*.3,B.camY-St+1,B.camY+St-1),ni=qi(di*.7,-(lt-Bt),lt-Bt),ar=qi(dt-St*.28,B.camY-St+1,B.camY+St-1);Te.lblMW1.position.set(Wt,On,.2),Te.lblMW1.scale.set(hi,or,1),Te.lblMW2.position.set(ni,ar,.2),Te.lblMW2.scale.set(hi,or,1)}const Va=performance.now();if(Va-Gt>80&&(Gt=Va,B._flashPending)){B._flashPending=!1;const Tt=B.colBranch;ze(Tt),w(1);let Kt=null;const Bt=Wt=>{Kt||(Kt=Wt);const On=Math.max(0,1-(Wt-Kt)/1400);w(On),On>0?te.current=requestAnimationFrame(Bt):ze(0)};te.current&&cancelAnimationFrame(te.current),te.current=requestAnimationFrame(Bt)}const Hs={Tp:ht,Rp:vn,xIn:Ci,xT:ei,xR:di,yT:jo,yR:Ha,yRFixed:dt,sigX:B.sigX,sigY:B.sigY,bl:Bs,colBranch:B.colBranch,colFade:B.colFade,bX:$o,bY:Ko,bIsTransmit:sr,isPW:B.interp==="pw",interp:B.interp,colElapsedMs:B.colTriggered?performance.now()-(B.colStartMs||0):0,colPhase:B.colPhase,sepFrac:Tn,showProj:B.showProj,xLo:B.camX-lt,xHi:B.camX+lt,yLo:B.camY-St,yHi:B.camY+St,rho:Jt.rhoBuf,rhoXs:Jt.xs,V0:B.V0};if(qE(h.current,Hs),KE(m.current,Hs),Te.gaugeSprite&&B.detectorOn){const Tt=Math.min(St*.4,2.2);Te.gaugeSprite.scale.set(Tt,Tt,1),Te.gaugeSprite.position.set(B.xPointer,B.camY+St-Tt*.5-1.15,.4),Te.gaugeSprite.visible=!0;const Kt=ti>.02&&Dt>0,Bt=Math.max(qo-B.xPointer,.3)/B.k0,On=Dt/3,ni=Dt>0?qi(ti/Bt,0,1)*On:0,ar=ht*ni,wn=[];if(!Kt)wn.push({fraction:0,color:"#88aaff",alpha:.55});else if(Gi){const ii=Math.min(ni*2,1);wn.push({fraction:ni,color:"#22ee88",alpha:ii*.88}),wn.push({fraction:0,color:"#ff7744",alpha:ii*.88})}else if(B.interp==="pw"){const ii=sr?ni:0;wn.push({fraction:ii,color:"#ffffff",alpha:.92})}else B.colTriggered?B.colBranch>0?(wn.push({fraction:1,color:"#22ee88",alpha:.95}),wn.push({fraction:0,color:"#ff7744",alpha:(1-B.colFade)*.55})):(wn.push({fraction:0,color:"#ff7744",alpha:.95}),wn.push({fraction:ar,color:"#22ee88",alpha:(1-B.colFade)*.55})):wn.push({fraction:ar,color:"#88aaff",alpha:.82});JE(Te.gCtx,128,128,wn),Te.gaugeTex.needsUpdate=!0}else Te.gaugeSprite&&(Te.gaugeSprite.visible=!1);Te.renderer.render(Te.scene,Te.camera)}return Rt(),()=>{cancelAnimationFrame(jt),Ie.disconnect(),D.removeEventListener("pointerdown",Ee),D.removeEventListener("pointermove",Ue),D.removeEventListener("pointerup",ke),D.removeEventListener("wheel",Ve),D.removeEventListener("contextmenu",rt),we.dispose(),D.contains(we.domElement)&&D.removeChild(we.domElement),c.current=null}},[]);const[it,It]=Mt.useState("sim");return Se.jsxs("div",{style:{display:"flex",flexDirection:b?"column":"row",width:"100%",maxWidth:"100vw",minHeight:b?"100dvh":"100%",background:"#040a1c",overflowX:"hidden",overflowY:b?"auto":"hidden"},children:[Se.jsxs("div",{style:{flex:1,minWidth:0,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",height:b?void 0:"100%",minHeight:b?Math.min(y,500)*1.25+28:0},children:[Se.jsx("div",{style:{display:"flex",flexShrink:0,background:"rgba(4,10,30,0.9)",borderBottom:"1px solid rgba(40,80,180,0.35)",height:28},children:[["sim","Simulation"],["math","Math"],["about","About"]].map(([D,we])=>Se.jsx("button",{onClick:()=>It(D),style:{padding:"0 16px",fontSize:11,cursor:"pointer",border:"none",fontFamily:"'JetBrains Mono','Courier New',monospace",textTransform:"uppercase",letterSpacing:"0.08em",background:it===D?"rgba(40,80,200,0.3)":"transparent",color:it===D?"#88bbff":"#4a6a9a",borderBottom:it===D?"2px solid #5588ff":"2px solid transparent"},children:we},D))}),Se.jsxs("div",{style:{display:it==="sim"?"flex":"none",flex:1,flexDirection:"column",overflow:"hidden"},children:[Se.jsxs("div",{style:{flex:4,minHeight:0,display:"flex",flexDirection:"row",overflow:"hidden"},children:[Se.jsxs("div",{ref:s,style:{flex:1,position:"relative",overflow:"hidden",touchAction:"pan-y"},children:[vt!==0&&U>0&&(()=>{const D=vt===1?"#22ee88":"#ff7744";return Se.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:10,boxShadow:`inset 0 0 ${50*U}px ${D}88`,border:`2px solid ${D}`,display:"flex",alignItems:"center",justifyContent:"center",opacity:U},children:Se.jsx("div",{style:{fontSize:T?18:28,fontWeight:700,color:D,letterSpacing:"0.18em",fontFamily:"'JetBrains Mono','Courier New',monospace",textShadow:`0 0 30px ${D}, 0 0 60px ${D}66`},children:"COLLAPSE"})})})(),Se.jsx("div",{style:{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",color:"rgba(100,160,255,0.5)",fontSize:T?9:11,pointerEvents:"none",fontFamily:"'JetBrains Mono','Courier New',monospace"},children:T?"x — position →":"x — particle position →"}),!T&&Se.jsx("div",{style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%) rotate(-90deg)",color:"rgba(100,160,255,0.5)",fontSize:11,pointerEvents:"none",fontFamily:"'JetBrains Mono','Courier New',monospace"},children:"y — pointer"}),Se.jsx("div",{style:{position:"absolute",top:10,right:12},children:Se.jsx(Lo,{text:Yg[O],children:Se.jsx("div",{style:{color:Rd[O],fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono','Courier New',monospace",background:"rgba(4,10,30,0.7)",padding:"3px 8px",borderRadius:4,border:`1px solid ${Rd[O]}55`,cursor:"help"},children:jg[O]})})})]}),_&&Se.jsx("div",{style:{width:k,flexShrink:0,borderLeft:"1px solid rgba(40,80,180,0.3)",background:"#020812"},children:Se.jsx(ZE,{ref:m})})]}),Se.jsxs("div",{ref:g,style:{flex:1,minHeight:0,display:"flex",flexDirection:"row",borderTop:"1px solid rgba(40,80,180,0.3)",position:"relative"},children:[Se.jsx("div",{style:{flex:1,background:"#020812",overflow:"hidden"},children:Se.jsx($E,{ref:h})}),_&&Se.jsx("div",{style:{width:k,flexShrink:0,background:"#020812",borderLeft:"1px solid rgba(40,80,180,0.3)"}})]})]}),it==="math"&&Se.jsx(QE,{interp:O}),it==="about"&&Se.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"28px 36px",fontFamily:"Georgia,'Times New Roman',serif",background:"#040a1c",color:"#c8d8f0",lineHeight:1.9,fontSize:15},children:[["What does it mean to measure a quantum particle?","This simulation shows a quantum particle — say, an electron — approaching a potential barrier from the left. The horizontal axis is the particle's position x. The vertical axis is the pointer of a measuring device: a needle that deflects upward if the particle transmits, and stays at rest if it reflects. The yellow vertical line marks the detector position where coupling begins.","Before the particle hits the barrier, the two-dimensional wavefunction is a single blob moving diagonally. The particle and pointer are not yet entangled.","At the barrier, the wavefunction splits into two branches. The transmitted branch moves to the upper right — the particle passes through and the pointer deflects upward. The reflected branch moves to the left while the pointer stays at its resting position — the particle bounces back, and the device registers nothing. The marginal projections on the sides show the two distinct outcomes.","What happens next depends on your interpretation of quantum mechanics. This simulation lets you switch between three.","In the Projection Postulate interpretation, measurement collapses the wavefunction onto one of its eigenstates. One branch survives; the other vanishes. The outcome is random, governed by the Born rule — the probability of each result is set by how much of the wavefunction sits in that branch. The pointer lands at a definite value. No mechanism is given for when or why collapse occurs — it is simply postulated as a rule of the theory. This is what is assumed in most university physics courses, and it correctly predicts all experimental outcomes.","In the Many-Worlds interpretation, the wavefunction never collapses and nothing is ever discarded. Both branches continue to exist — but in separate, non-communicating worlds. In one world the particle transmits and the pointer deflects; in the other it reflects and the pointer stays put. The universe itself has split, and each copy of the observer sees a definite outcome. There is no randomness in the dynamics — only the appearance of it, from inside one branch.","In the Pilot-Wave interpretation — also called Bohmian mechanics — the wavefunction never collapses either. Both branches persist, but the particle follows a single definite trajectory, guided by the wave. The white dot traces that path. It enters one branch and stays there, guided deterministically by its initial position. The other branch becomes empty: it still exists mathematically, but carries no particle and has no further physical effect. This is the empty wave.","The side panels show the conditional wavefunction: a slice of the full two-dimensional state at the particle's actual position. Unlike the global projection — which always shows two peaks — the conditional wavefunction has a single peak, localised on the occupied branch. This is the effective wavefunction the particle actually rides.","All three interpretations give identical experimental predictions. The difference is not in what we measure — it is in what we believe is really happening.","Not every measurement is equally decisive. A strong measurement uses a narrow pointer wavepacket and a large coupling so that the pointer states corresponding to transmission and reflection end up well separated — the device always gives the right answer. A weak measurement uses a wide pointer wavepacket and a small coupling: the two pointer states overlap significantly, and the device reading is ambiguous. The pointer still shifts slightly in the direction of the more probable outcome, but it cannot reliably identify which branch the particle actually took. This simulation lets you explore both regimes using the σ_pointer and Coupling sliders, or the Weak / Strong preset buttons."].map((D,we)=>Se.jsx("p",{style:{marginBottom:"1.2em",fontWeight:we===0?700:400,fontSize:we===0?18:15,color:we===0?"#88ccff":"#c8d8f0"},children:D},we)),Se.jsxs("p",{style:{marginTop:"2em",fontSize:11,color:"#2a4060",fontFamily:"'JetBrains Mono','Courier New',monospace"},children:["Bohmian Measurement · v","1.2.0"]})]})]}),Se.jsx("div",{style:{width:b?"100%":W,flexShrink:0,background:"rgba(4,10,30,0.92)",borderLeft:b?"none":"1px solid rgba(40,80,180,0.35)",borderTop:b?"1px solid rgba(40,80,180,0.35)":"none",overflowY:"auto",maxHeight:b?"none":void 0},children:Se.jsx(YE,{interp:O,setInterp:ve,tTarget:L,setTTarget:xe,tTargetRef:e,lam:P,setLam:ge,lamRef:n,xPointer:q,setXPointer:$e,xPointerRef:r,sigX:de,setSigX:De,sigXRef:a,sigY:ue,setSigY:He,sigYRef:u,regime:fe,setRegime:ee,speed:F,setSpeed:gt,speedRef:f,showWave:pe,setShowWave:Ce,showTraj:ae,setShowTraj:Ge,showProj:_e,setShowProj:et,running:Le,setRunning:st,barrierOn:pt,setBarrierOn:We,detectorOn:Qe,setDetectorOn:xt,Tp:Ct,Rp:ct,isMobile:T})})]})}const ug=document.getElementById("root");ug&&P_.createRoot(ug).render(Se.jsx(eT,{}));
