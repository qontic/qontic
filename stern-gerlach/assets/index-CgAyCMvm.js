(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();function Lv(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var gf={exports:{}},za={},vf={exports:{}},_t={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pm;function Dv(){if(pm)return _t;pm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),u=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.iterator;function x(U){return U===null||typeof U!="object"?null:(U=_&&U[_]||U["@@iterator"],typeof U=="function"?U:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,w={};function y(U,se,Fe){this.props=U,this.context=se,this.refs=w,this.updater=Fe||S}y.prototype.isReactComponent={},y.prototype.setState=function(U,se){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,se,"setState")},y.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function v(){}v.prototype=y.prototype;function I(U,se,Fe){this.props=U,this.context=se,this.refs=w,this.updater=Fe||S}var L=I.prototype=new v;L.constructor=I,E(L,y.prototype),L.isPureReactComponent=!0;var b=Array.isArray,H=Object.prototype.hasOwnProperty,F={current:null},N={key:!0,ref:!0,__self:!0,__source:!0};function G(U,se,Fe){var te,pe={},we=null,xe=null;if(se!=null)for(te in se.ref!==void 0&&(xe=se.ref),se.key!==void 0&&(we=""+se.key),se)H.call(se,te)&&!N.hasOwnProperty(te)&&(pe[te]=se[te]);var Le=arguments.length-2;if(Le===1)pe.children=Fe;else if(1<Le){for(var ve=Array(Le),Ze=0;Ze<Le;Ze++)ve[Ze]=arguments[Ze+2];pe.children=ve}if(U&&U.defaultProps)for(te in Le=U.defaultProps,Le)pe[te]===void 0&&(pe[te]=Le[te]);return{$$typeof:s,type:U,key:we,ref:xe,props:pe,_owner:F.current}}function R(U,se){return{$$typeof:s,type:U.type,key:se,ref:U.ref,props:U.props,_owner:U._owner}}function C(U){return typeof U=="object"&&U!==null&&U.$$typeof===s}function z(U){var se={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(Fe){return se[Fe]})}var ie=/\/+/g;function Z(U,se){return typeof U=="object"&&U!==null&&U.key!=null?z(""+U.key):se.toString(36)}function ue(U,se,Fe,te,pe){var we=typeof U;(we==="undefined"||we==="boolean")&&(U=null);var xe=!1;if(U===null)xe=!0;else switch(we){case"string":case"number":xe=!0;break;case"object":switch(U.$$typeof){case s:case e:xe=!0}}if(xe)return xe=U,pe=pe(xe),U=te===""?"."+Z(xe,0):te,b(pe)?(Fe="",U!=null&&(Fe=U.replace(ie,"$&/")+"/"),ue(pe,se,Fe,"",function(Ze){return Ze})):pe!=null&&(C(pe)&&(pe=R(pe,Fe+(!pe.key||xe&&xe.key===pe.key?"":(""+pe.key).replace(ie,"$&/")+"/")+U)),se.push(pe)),1;if(xe=0,te=te===""?".":te+":",b(U))for(var Le=0;Le<U.length;Le++){we=U[Le];var ve=te+Z(we,Le);xe+=ue(we,se,Fe,ve,pe)}else if(ve=x(U),typeof ve=="function")for(U=ve.call(U),Le=0;!(we=U.next()).done;)we=we.value,ve=te+Z(we,Le++),xe+=ue(we,se,Fe,ve,pe);else if(we==="object")throw se=String(U),Error("Objects are not valid as a React child (found: "+(se==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":se)+"). If you meant to render a collection of children, use an array instead.");return xe}function me(U,se,Fe){if(U==null)return U;var te=[],pe=0;return ue(U,te,"","",function(we){return se.call(Fe,we,pe++)}),te}function ae(U){if(U._status===-1){var se=U._result;se=se(),se.then(function(Fe){(U._status===0||U._status===-1)&&(U._status=1,U._result=Fe)},function(Fe){(U._status===0||U._status===-1)&&(U._status=2,U._result=Fe)}),U._status===-1&&(U._status=0,U._result=se)}if(U._status===1)return U._result.default;throw U._result}var he={current:null},k={transition:null},de={ReactCurrentDispatcher:he,ReactCurrentBatchConfig:k,ReactCurrentOwner:F};function oe(){throw Error("act(...) is not supported in production builds of React.")}return _t.Children={map:me,forEach:function(U,se,Fe){me(U,function(){se.apply(this,arguments)},Fe)},count:function(U){var se=0;return me(U,function(){se++}),se},toArray:function(U){return me(U,function(se){return se})||[]},only:function(U){if(!C(U))throw Error("React.Children.only expected to receive a single React element child.");return U}},_t.Component=y,_t.Fragment=n,_t.Profiler=a,_t.PureComponent=I,_t.StrictMode=r,_t.Suspense=h,_t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=de,_t.act=oe,_t.cloneElement=function(U,se,Fe){if(U==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+U+".");var te=E({},U.props),pe=U.key,we=U.ref,xe=U._owner;if(se!=null){if(se.ref!==void 0&&(we=se.ref,xe=F.current),se.key!==void 0&&(pe=""+se.key),U.type&&U.type.defaultProps)var Le=U.type.defaultProps;for(ve in se)H.call(se,ve)&&!N.hasOwnProperty(ve)&&(te[ve]=se[ve]===void 0&&Le!==void 0?Le[ve]:se[ve])}var ve=arguments.length-2;if(ve===1)te.children=Fe;else if(1<ve){Le=Array(ve);for(var Ze=0;Ze<ve;Ze++)Le[Ze]=arguments[Ze+2];te.children=Le}return{$$typeof:s,type:U.type,key:pe,ref:we,props:te,_owner:xe}},_t.createContext=function(U){return U={$$typeof:u,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},U.Provider={$$typeof:c,_context:U},U.Consumer=U},_t.createElement=G,_t.createFactory=function(U){var se=G.bind(null,U);return se.type=U,se},_t.createRef=function(){return{current:null}},_t.forwardRef=function(U){return{$$typeof:d,render:U}},_t.isValidElement=C,_t.lazy=function(U){return{$$typeof:g,_payload:{_status:-1,_result:U},_init:ae}},_t.memo=function(U,se){return{$$typeof:m,type:U,compare:se===void 0?null:se}},_t.startTransition=function(U){var se=k.transition;k.transition={};try{U()}finally{k.transition=se}},_t.unstable_act=oe,_t.useCallback=function(U,se){return he.current.useCallback(U,se)},_t.useContext=function(U){return he.current.useContext(U)},_t.useDebugValue=function(){},_t.useDeferredValue=function(U){return he.current.useDeferredValue(U)},_t.useEffect=function(U,se){return he.current.useEffect(U,se)},_t.useId=function(){return he.current.useId()},_t.useImperativeHandle=function(U,se,Fe){return he.current.useImperativeHandle(U,se,Fe)},_t.useInsertionEffect=function(U,se){return he.current.useInsertionEffect(U,se)},_t.useLayoutEffect=function(U,se){return he.current.useLayoutEffect(U,se)},_t.useMemo=function(U,se){return he.current.useMemo(U,se)},_t.useReducer=function(U,se,Fe){return he.current.useReducer(U,se,Fe)},_t.useRef=function(U){return he.current.useRef(U)},_t.useState=function(U){return he.current.useState(U)},_t.useSyncExternalStore=function(U,se,Fe){return he.current.useSyncExternalStore(U,se,Fe)},_t.useTransition=function(){return he.current.useTransition()},_t.version="18.3.1",_t}var mm;function Gd(){return mm||(mm=1,vf.exports=Dv()),vf.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gm;function Iv(){if(gm)return za;gm=1;var s=Gd(),e=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function u(d,h,m){var g,_={},x=null,S=null;m!==void 0&&(x=""+m),h.key!==void 0&&(x=""+h.key),h.ref!==void 0&&(S=h.ref);for(g in h)r.call(h,g)&&!c.hasOwnProperty(g)&&(_[g]=h[g]);if(d&&d.defaultProps)for(g in h=d.defaultProps,h)_[g]===void 0&&(_[g]=h[g]);return{$$typeof:e,type:d,key:x,ref:S,props:_,_owner:a.current}}return za.Fragment=n,za.jsx=u,za.jsxs=u,za}var vm;function Uv(){return vm||(vm=1,gf.exports=Iv()),gf.exports}var fe=Uv(),yt=Gd();const qa=Lv(yt);var Zl={},_f={exports:{}},ii={},xf={exports:{}},yf={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _m;function Nv(){return _m||(_m=1,(function(s){function e(k,de){var oe=k.length;k.push(de);e:for(;0<oe;){var U=oe-1>>>1,se=k[U];if(0<a(se,de))k[U]=de,k[oe]=se,oe=U;else break e}}function n(k){return k.length===0?null:k[0]}function r(k){if(k.length===0)return null;var de=k[0],oe=k.pop();if(oe!==de){k[0]=oe;e:for(var U=0,se=k.length,Fe=se>>>1;U<Fe;){var te=2*(U+1)-1,pe=k[te],we=te+1,xe=k[we];if(0>a(pe,oe))we<se&&0>a(xe,pe)?(k[U]=xe,k[we]=oe,U=we):(k[U]=pe,k[te]=oe,U=te);else if(we<se&&0>a(xe,oe))k[U]=xe,k[we]=oe,U=we;else break e}}return de}function a(k,de){var oe=k.sortIndex-de.sortIndex;return oe!==0?oe:k.id-de.id}if(typeof performance=="object"&&typeof performance.now=="function"){var c=performance;s.unstable_now=function(){return c.now()}}else{var u=Date,d=u.now();s.unstable_now=function(){return u.now()-d}}var h=[],m=[],g=1,_=null,x=3,S=!1,E=!1,w=!1,y=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function L(k){for(var de=n(m);de!==null;){if(de.callback===null)r(m);else if(de.startTime<=k)r(m),de.sortIndex=de.expirationTime,e(h,de);else break;de=n(m)}}function b(k){if(w=!1,L(k),!E)if(n(h)!==null)E=!0,ae(H);else{var de=n(m);de!==null&&he(b,de.startTime-k)}}function H(k,de){E=!1,w&&(w=!1,v(G),G=-1),S=!0;var oe=x;try{for(L(de),_=n(h);_!==null&&(!(_.expirationTime>de)||k&&!z());){var U=_.callback;if(typeof U=="function"){_.callback=null,x=_.priorityLevel;var se=U(_.expirationTime<=de);de=s.unstable_now(),typeof se=="function"?_.callback=se:_===n(h)&&r(h),L(de)}else r(h);_=n(h)}if(_!==null)var Fe=!0;else{var te=n(m);te!==null&&he(b,te.startTime-de),Fe=!1}return Fe}finally{_=null,x=oe,S=!1}}var F=!1,N=null,G=-1,R=5,C=-1;function z(){return!(s.unstable_now()-C<R)}function ie(){if(N!==null){var k=s.unstable_now();C=k;var de=!0;try{de=N(!0,k)}finally{de?Z():(F=!1,N=null)}}else F=!1}var Z;if(typeof I=="function")Z=function(){I(ie)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,me=ue.port2;ue.port1.onmessage=ie,Z=function(){me.postMessage(null)}}else Z=function(){y(ie,0)};function ae(k){N=k,F||(F=!0,Z())}function he(k,de){G=y(function(){k(s.unstable_now())},de)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(k){k.callback=null},s.unstable_continueExecution=function(){E||S||(E=!0,ae(H))},s.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):R=0<k?Math.floor(1e3/k):5},s.unstable_getCurrentPriorityLevel=function(){return x},s.unstable_getFirstCallbackNode=function(){return n(h)},s.unstable_next=function(k){switch(x){case 1:case 2:case 3:var de=3;break;default:de=x}var oe=x;x=de;try{return k()}finally{x=oe}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(k,de){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var oe=x;x=k;try{return de()}finally{x=oe}},s.unstable_scheduleCallback=function(k,de,oe){var U=s.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?U+oe:U):oe=U,k){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=oe+se,k={id:g++,callback:de,priorityLevel:k,startTime:oe,expirationTime:se,sortIndex:-1},oe>U?(k.sortIndex=oe,e(m,k),n(h)===null&&k===n(m)&&(w?(v(G),G=-1):w=!0,he(b,oe-U))):(k.sortIndex=se,e(h,k),E||S||(E=!0,ae(H))),k},s.unstable_shouldYield=z,s.unstable_wrapCallback=function(k){var de=x;return function(){var oe=x;x=de;try{return k.apply(this,arguments)}finally{x=oe}}}})(yf)),yf}var xm;function Fv(){return xm||(xm=1,xf.exports=Nv()),xf.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ym;function Ov(){if(ym)return ii;ym=1;var s=Gd(),e=Fv();function n(t){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+t,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+t+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function c(t,i){u(t,i),u(t+"Capture",i)}function u(t,i){for(a[t]=i,t=0;t<i.length;t++)r.add(i[t])}var d=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},_={};function x(t){return h.call(_,t)?!0:h.call(g,t)?!1:m.test(t)?_[t]=!0:(g[t]=!0,!1)}function S(t,i,o,l){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return l?!1:o!==null?!o.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function E(t,i,o,l){if(i===null||typeof i>"u"||S(t,i,o,l))return!0;if(l)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(t,i,o,l,f,p,M){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=l,this.attributeNamespace=f,this.mustUseProperty=o,this.propertyName=t,this.type=i,this.sanitizeURL=p,this.removeEmptyString=M}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){y[t]=new w(t,0,!1,t,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var i=t[0];y[i]=new w(i,1,!1,t[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(t){y[t]=new w(t,2,!1,t.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){y[t]=new w(t,2,!1,t,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){y[t]=new w(t,3,!1,t.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(t){y[t]=new w(t,3,!0,t,null,!1,!1)}),["capture","download"].forEach(function(t){y[t]=new w(t,4,!1,t,null,!1,!1)}),["cols","rows","size","span"].forEach(function(t){y[t]=new w(t,6,!1,t,null,!1,!1)}),["rowSpan","start"].forEach(function(t){y[t]=new w(t,5,!1,t.toLowerCase(),null,!1,!1)});var v=/[\-:]([a-z])/g;function I(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var i=t.replace(v,I);y[i]=new w(i,1,!1,t,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var i=t.replace(v,I);y[i]=new w(i,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(t){var i=t.replace(v,I);y[i]=new w(i,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(t){y[t]=new w(t,1,!1,t.toLowerCase(),null,!1,!1)}),y.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(t){y[t]=new w(t,1,!1,t.toLowerCase(),null,!0,!0)});function L(t,i,o,l){var f=y.hasOwnProperty(i)?y[i]:null;(f!==null?f.type!==0:l||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,o,f,l)&&(o=null),l||f===null?x(i)&&(o===null?t.removeAttribute(i):t.setAttribute(i,""+o)):f.mustUseProperty?t[f.propertyName]=o===null?f.type===3?!1:"":o:(i=f.attributeName,l=f.attributeNamespace,o===null?t.removeAttribute(i):(f=f.type,o=f===3||f===4&&o===!0?"":""+o,l?t.setAttributeNS(l,i,o):t.setAttribute(i,o))))}var b=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,H=Symbol.for("react.element"),F=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),G=Symbol.for("react.strict_mode"),R=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),z=Symbol.for("react.context"),ie=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),ue=Symbol.for("react.suspense_list"),me=Symbol.for("react.memo"),ae=Symbol.for("react.lazy"),he=Symbol.for("react.offscreen"),k=Symbol.iterator;function de(t){return t===null||typeof t!="object"?null:(t=k&&t[k]||t["@@iterator"],typeof t=="function"?t:null)}var oe=Object.assign,U;function se(t){if(U===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);U=i&&i[1]||""}return`
`+U+t}var Fe=!1;function te(t,i){if(!t||Fe)return"";Fe=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(re){var l=re}Reflect.construct(t,[],i)}else{try{i.call()}catch(re){l=re}t.call(i.prototype)}else{try{throw Error()}catch(re){l=re}t()}}catch(re){if(re&&l&&typeof re.stack=="string"){for(var f=re.stack.split(`
`),p=l.stack.split(`
`),M=f.length-1,D=p.length-1;1<=M&&0<=D&&f[M]!==p[D];)D--;for(;1<=M&&0<=D;M--,D--)if(f[M]!==p[D]){if(M!==1||D!==1)do if(M--,D--,0>D||f[M]!==p[D]){var O=`
`+f[M].replace(" at new "," at ");return t.displayName&&O.includes("<anonymous>")&&(O=O.replace("<anonymous>",t.displayName)),O}while(1<=M&&0<=D);break}}}finally{Fe=!1,Error.prepareStackTrace=o}return(t=t?t.displayName||t.name:"")?se(t):""}function pe(t){switch(t.tag){case 5:return se(t.type);case 16:return se("Lazy");case 13:return se("Suspense");case 19:return se("SuspenseList");case 0:case 2:case 15:return t=te(t.type,!1),t;case 11:return t=te(t.type.render,!1),t;case 1:return t=te(t.type,!0),t;default:return""}}function we(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case N:return"Fragment";case F:return"Portal";case R:return"Profiler";case G:return"StrictMode";case Z:return"Suspense";case ue:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case z:return(t.displayName||"Context")+".Consumer";case C:return(t._context.displayName||"Context")+".Provider";case ie:var i=t.render;return t=t.displayName,t||(t=i.displayName||i.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case me:return i=t.displayName||null,i!==null?i:we(t.type)||"Memo";case ae:i=t._payload,t=t._init;try{return we(t(i))}catch{}}return null}function xe(t){var i=t.type;switch(t.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=i.render,t=t.displayName||t.name||"",i.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(i);case 8:return i===G?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Le(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function ve(t){var i=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Ze(t){var i=ve(t)?"checked":"value",o=Object.getOwnPropertyDescriptor(t.constructor.prototype,i),l=""+t[i];if(!t.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var f=o.get,p=o.set;return Object.defineProperty(t,i,{configurable:!0,get:function(){return f.call(this)},set:function(M){l=""+M,p.call(this,M)}}),Object.defineProperty(t,i,{enumerable:o.enumerable}),{getValue:function(){return l},setValue:function(M){l=""+M},stopTracking:function(){t._valueTracker=null,delete t[i]}}}}function bt(t){t._valueTracker||(t._valueTracker=Ze(t))}function gt(t){if(!t)return!1;var i=t._valueTracker;if(!i)return!0;var o=i.getValue(),l="";return t&&(l=ve(t)?t.checked?"true":"false":t.value),t=l,t!==o?(i.setValue(t),!0):!1}function zt(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function B(t,i){var o=i.checked;return oe({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??t._wrapperState.initialChecked})}function Cn(t,i){var o=i.defaultValue==null?"":i.defaultValue,l=i.checked!=null?i.checked:i.defaultChecked;o=Le(i.value!=null?i.value:o),t._wrapperState={initialChecked:l,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function mt(t,i){i=i.checked,i!=null&&L(t,"checked",i,!1)}function dt(t,i){mt(t,i);var o=Le(i.value),l=i.type;if(o!=null)l==="number"?(o===0&&t.value===""||t.value!=o)&&(t.value=""+o):t.value!==""+o&&(t.value=""+o);else if(l==="submit"||l==="reset"){t.removeAttribute("value");return}i.hasOwnProperty("value")?It(t,i.type,o):i.hasOwnProperty("defaultValue")&&It(t,i.type,Le(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(t.defaultChecked=!!i.defaultChecked)}function Ye(t,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var l=i.type;if(!(l!=="submit"&&l!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+t._wrapperState.initialValue,o||i===t.value||(t.value=i),t.defaultValue=i}o=t.name,o!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,o!==""&&(t.name=o)}function It(t,i,o){(i!=="number"||zt(t.ownerDocument)!==t)&&(o==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+o&&(t.defaultValue=""+o))}var Xe=Array.isArray;function P(t,i,o,l){if(t=t.options,i){i={};for(var f=0;f<o.length;f++)i["$"+o[f]]=!0;for(o=0;o<t.length;o++)f=i.hasOwnProperty("$"+t[o].value),t[o].selected!==f&&(t[o].selected=f),f&&l&&(t[o].defaultSelected=!0)}else{for(o=""+Le(o),i=null,f=0;f<t.length;f++){if(t[f].value===o){t[f].selected=!0,l&&(t[f].defaultSelected=!0);return}i!==null||t[f].disabled||(i=t[f])}i!==null&&(i.selected=!0)}}function T(t,i){if(i.dangerouslySetInnerHTML!=null)throw Error(n(91));return oe({},i,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function ee(t,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(n(92));if(Xe(o)){if(1<o.length)throw Error(n(93));o=o[0]}i=o}i==null&&(i=""),o=i}t._wrapperState={initialValue:Le(o)}}function _e(t,i){var o=Le(i.value),l=Le(i.defaultValue);o!=null&&(o=""+o,o!==t.value&&(t.value=o),i.defaultValue==null&&t.defaultValue!==o&&(t.defaultValue=o)),l!=null&&(t.defaultValue=""+l)}function Se(t){var i=t.textContent;i===t._wrapperState.initialValue&&i!==""&&i!==null&&(t.value=i)}function ge(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function je(t,i){return t==null||t==="http://www.w3.org/1999/xhtml"?ge(i):t==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ie,ze=(function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,l,f){MSApp.execUnsafeLocalFunction(function(){return t(i,o,l,f)})}:t})(function(t,i){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=i;else{for(Ie=Ie||document.createElement("div"),Ie.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Ie.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;i.firstChild;)t.appendChild(i.firstChild)}});function ct(t,i){if(i){var o=t.firstChild;if(o&&o===t.lastChild&&o.nodeType===3){o.nodeValue=i;return}}t.textContent=i}var Ce={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ke=["Webkit","ms","Moz","O"];Object.keys(Ce).forEach(function(t){ke.forEach(function(i){i=i+t.charAt(0).toUpperCase()+t.substring(1),Ce[i]=Ce[t]})});function Qe(t,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||Ce.hasOwnProperty(t)&&Ce[t]?(""+i).trim():i+"px"}function rt(t,i){t=t.style;for(var o in i)if(i.hasOwnProperty(o)){var l=o.indexOf("--")===0,f=Qe(o,i[o],l);o==="float"&&(o="cssFloat"),l?t.setProperty(o,f):t[o]=f}}var He=oe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ht(t,i){if(i){if(He[t]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(n(137,t));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(n(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(n(61))}if(i.style!=null&&typeof i.style!="object")throw Error(n(62))}}function at(t,i){if(t.indexOf("-")===-1)return typeof i.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Pt=null;function W(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Y=null,Q=null,le=null;function be(t){if(t=Ea(t)){if(typeof Y!="function")throw Error(n(280));var i=t.stateNode;i&&(i=dl(i),Y(t.stateNode,t.type,i))}}function Pe(t){Q?le?le.push(t):le=[t]:Q=t}function st(){if(Q){var t=Q,i=le;if(le=Q=null,be(t),i)for(t=0;t<i.length;t++)be(i[t])}}function Bt(t,i){return t(i)}function Ht(){}var Et=!1;function Rn(t,i,o){if(Et)return t(i,o);Et=!0;try{return Bt(t,i,o)}finally{Et=!1,(Q!==null||le!==null)&&(Ht(),st())}}function Zt(t,i){var o=t.stateNode;if(o===null)return null;var l=dl(o);if(l===null)return null;o=l[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break e;default:t=!1}if(t)return null;if(o&&typeof o!="function")throw Error(n(231,i,typeof o));return o}var Fr=!1;if(d)try{var vi={};Object.defineProperty(vi,"passive",{get:function(){Fr=!0}}),window.addEventListener("test",vi,vi),window.removeEventListener("test",vi,vi)}catch{Fr=!1}function $n(t,i,o,l,f,p,M,D,O){var re=Array.prototype.slice.call(arguments,3);try{i.apply(o,re)}catch(Ee){this.onError(Ee)}}var qn=!1,Pi=null,fr=!1,Ki=null,dr={onError:function(t){qn=!0,Pi=t}};function Or(t,i,o,l,f,p,M,D,O){qn=!1,Pi=null,$n.apply(dr,arguments)}function io(t,i,o,l,f,p,M,D,O){if(Or.apply(this,arguments),qn){if(qn){var re=Pi;qn=!1,Pi=null}else throw Error(n(198));fr||(fr=!0,Ki=re)}}function ai(t){var i=t,o=t;if(t.alternate)for(;i.return;)i=i.return;else{t=i;do i=t,(i.flags&4098)!==0&&(o=i.return),t=i.return;while(t)}return i.tag===3?o:null}function _s(t){if(t.tag===13){var i=t.memoizedState;if(i===null&&(t=t.alternate,t!==null&&(i=t.memoizedState)),i!==null)return i.dehydrated}return null}function xs(t){if(ai(t)!==t)throw Error(n(188))}function ua(t){var i=t.alternate;if(!i){if(i=ai(t),i===null)throw Error(n(188));return i!==t?null:t}for(var o=t,l=i;;){var f=o.return;if(f===null)break;var p=f.alternate;if(p===null){if(l=f.return,l!==null){o=l;continue}break}if(f.child===p.child){for(p=f.child;p;){if(p===o)return xs(f),t;if(p===l)return xs(f),i;p=p.sibling}throw Error(n(188))}if(o.return!==l.return)o=f,l=p;else{for(var M=!1,D=f.child;D;){if(D===o){M=!0,o=f,l=p;break}if(D===l){M=!0,l=f,o=p;break}D=D.sibling}if(!M){for(D=p.child;D;){if(D===o){M=!0,o=p,l=f;break}if(D===l){M=!0,l=p,o=f;break}D=D.sibling}if(!M)throw Error(n(189))}}if(o.alternate!==l)throw Error(n(190))}if(o.tag!==3)throw Error(n(188));return o.stateNode.current===o?t:i}function ys(t){return t=ua(t),t!==null?zr(t):null}function zr(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var i=zr(t);if(i!==null)return i;t=t.sibling}return null}var ro=e.unstable_scheduleCallback,A=e.unstable_cancelCallback,X=e.unstable_shouldYield,ne=e.unstable_requestPaint,q=e.unstable_now,$=e.unstable_getCurrentPriorityLevel,Te=e.unstable_ImmediatePriority,De=e.unstable_UserBlockingPriority,Ne=e.unstable_NormalPriority,Be=e.unstable_LowPriority,it=e.unstable_IdlePriority,Je=null,Ge=null;function xt(t){if(Ge&&typeof Ge.onCommitFiberRoot=="function")try{Ge.onCommitFiberRoot(Je,t,void 0,(t.current.flags&128)===128)}catch{}}var lt=Math.clz32?Math.clz32:Mt,$t=Math.log,Vt=Math.LN2;function Mt(t){return t>>>=0,t===0?32:31-($t(t)/Vt|0)|0}var Ke=64,qt=4194304;function vt(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function fn(t,i){var o=t.pendingLanes;if(o===0)return 0;var l=0,f=t.suspendedLanes,p=t.pingedLanes,M=o&268435455;if(M!==0){var D=M&~f;D!==0?l=vt(D):(p&=M,p!==0&&(l=vt(p)))}else M=o&~f,M!==0?l=vt(M):p!==0&&(l=vt(p));if(l===0)return 0;if(i!==0&&i!==l&&(i&f)===0&&(f=l&-l,p=i&-i,f>=p||f===16&&(p&4194240)!==0))return i;if((l&4)!==0&&(l|=o&16),i=t.entangledLanes,i!==0)for(t=t.entanglements,i&=l;0<i;)o=31-lt(i),f=1<<o,l|=t[o],i&=~f;return l}function Zi(t,i){switch(t){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bn(t,i){for(var o=t.suspendedLanes,l=t.pingedLanes,f=t.expirationTimes,p=t.pendingLanes;0<p;){var M=31-lt(p),D=1<<M,O=f[M];O===-1?((D&o)===0||(D&l)!==0)&&(f[M]=Zi(D,i)):O<=i&&(t.expiredLanes|=D),p&=~D}}function Li(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Ft(){var t=Ke;return Ke<<=1,(Ke&4194240)===0&&(Ke=64),t}function dn(t){for(var i=[],o=0;31>o;o++)i.push(t);return i}function on(t,i,o){t.pendingLanes|=i,i!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,i=31-lt(i),t[i]=o}function ln(t,i){var o=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;var l=t.eventTimes;for(t=t.expirationTimes;0<o;){var f=31-lt(o),p=1<<f;i[f]=0,l[f]=-1,t[f]=-1,o&=~p}}function Yt(t,i){var o=t.entangledLanes|=i;for(t=t.entanglements;o;){var l=31-lt(o),f=1<<l;f&i|t[l]&i&&(t[l]|=i),o&=~f}}var wt=0;function li(t){return t&=-t,1<t?4<t?(t&268435455)!==0?16:536870912:4:1}var tl,so,fa,oo,Ss,ao=!1,Br=[],Di=null,Ii=null,Ui=null,kr=new Map,Hr=new Map,Ni=[],hr="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Vr(t,i){switch(t){case"focusin":case"focusout":Di=null;break;case"dragenter":case"dragleave":Ii=null;break;case"mouseover":case"mouseout":Ui=null;break;case"pointerover":case"pointerout":kr.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":Hr.delete(i.pointerId)}}function Gr(t,i,o,l,f,p){return t===null||t.nativeEvent!==p?(t={blockedOn:i,domEventName:o,eventSystemFlags:l,nativeEvent:p,targetContainers:[f]},i!==null&&(i=Ea(i),i!==null&&so(i)),t):(t.eventSystemFlags|=l,i=t.targetContainers,f!==null&&i.indexOf(f)===-1&&i.push(f),t)}function nl(t,i,o,l,f){switch(i){case"focusin":return Di=Gr(Di,t,i,o,l,f),!0;case"dragenter":return Ii=Gr(Ii,t,i,o,l,f),!0;case"mouseover":return Ui=Gr(Ui,t,i,o,l,f),!0;case"pointerover":var p=f.pointerId;return kr.set(p,Gr(kr.get(p)||null,t,i,o,l,f)),!0;case"gotpointercapture":return p=f.pointerId,Hr.set(p,Gr(Hr.get(p)||null,t,i,o,l,f)),!0}return!1}function da(t){var i=As(t.target);if(i!==null){var o=ai(i);if(o!==null){if(i=o.tag,i===13){if(i=_s(o),i!==null){t.blockedOn=i,Ss(t.priority,function(){fa(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){t.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ms(t){if(t.blockedOn!==null)return!1;for(var i=t.targetContainers;0<i.length;){var o=nn(t.domEventName,t.eventSystemFlags,i[0],t.nativeEvent);if(o===null){o=t.nativeEvent;var l=new o.constructor(o.type,o);Pt=l,o.target.dispatchEvent(l),Pt=null}else return i=Ea(o),i!==null&&so(i),t.blockedOn=o,!1;i.shift()}return!0}function ha(t,i,o){Ms(t)&&o.delete(i)}function ce(){ao=!1,Di!==null&&Ms(Di)&&(Di=null),Ii!==null&&Ms(Ii)&&(Ii=null),Ui!==null&&Ms(Ui)&&(Ui=null),kr.forEach(ha),Hr.forEach(ha)}function ye(t,i){t.blockedOn===i&&(t.blockedOn=null,ao||(ao=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,ce)))}function et(t){function i(f){return ye(f,t)}if(0<Br.length){ye(Br[0],t);for(var o=1;o<Br.length;o++){var l=Br[o];l.blockedOn===t&&(l.blockedOn=null)}}for(Di!==null&&ye(Di,t),Ii!==null&&ye(Ii,t),Ui!==null&&ye(Ui,t),kr.forEach(i),Hr.forEach(i),o=0;o<Ni.length;o++)l=Ni[o],l.blockedOn===t&&(l.blockedOn=null);for(;0<Ni.length&&(o=Ni[0],o.blockedOn===null);)da(o),o.blockedOn===null&&Ni.shift()}var ut=b.ReactCurrentBatchConfig,Ut=!0;function Fi(t,i,o,l){var f=wt,p=ut.transition;ut.transition=null;try{wt=1,hn(t,i,o,l)}finally{wt=f,ut.transition=p}}function Ot(t,i,o,l){var f=wt,p=ut.transition;ut.transition=null;try{wt=4,hn(t,i,o,l)}finally{wt=f,ut.transition=p}}function hn(t,i,o,l){if(Ut){var f=nn(t,i,o,l);if(f===null)su(t,i,l,pn,o),Vr(t,l);else if(nl(f,t,i,o,l))l.stopPropagation();else if(Vr(t,l),i&4&&-1<hr.indexOf(t)){for(;f!==null;){var p=Ea(f);if(p!==null&&tl(p),p=nn(t,i,o,l),p===null&&su(t,i,l,pn,o),p===f)break;f=p}f!==null&&l.stopPropagation()}else su(t,i,l,null,o)}}var pn=null;function nn(t,i,o,l){if(pn=null,t=W(l),t=As(t),t!==null)if(i=ai(t),i===null)t=null;else if(o=i.tag,o===13){if(t=_s(i),t!==null)return t;t=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;t=null}else i!==t&&(t=null);return pn=t,null}function pr(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch($()){case Te:return 1;case De:return 4;case Ne:case Be:return 16;case it:return 536870912;default:return 16}default:return 16}}var Hn=null,Es=null,_i=null;function mr(){if(_i)return _i;var t,i=Es,o=i.length,l,f="value"in Hn?Hn.value:Hn.textContent,p=f.length;for(t=0;t<o&&i[t]===f[t];t++);var M=o-t;for(l=1;l<=M&&i[o-l]===f[p-l];l++);return _i=f.slice(t,1<l?1-l:void 0)}function Yn(t){var i=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&i===13&&(t=13)):t=i,t===10&&(t=13),32<=t||t===13?t:0}function Qi(){return!0}function il(){return!1}function In(t){function i(o,l,f,p,M){this._reactName=o,this._targetInst=f,this.type=l,this.nativeEvent=p,this.target=M,this.currentTarget=null;for(var D in t)t.hasOwnProperty(D)&&(o=t[D],this[D]=o?o(p):p[D]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?Qi:il,this.isPropagationStopped=il,this}return oe(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Qi)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Qi)},persist:function(){},isPersistent:Qi}),i}var Wr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Nt=In(Wr),Sn=oe({},Wr,{view:0,detail:0}),At=In(Sn),Vn,Gn,Pn,Oi=oe({},Sn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ts,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Pn&&(Pn&&t.type==="mousemove"?(Vn=t.screenX-Pn.screenX,Gn=t.screenY-Pn.screenY):Gn=Vn=0,Pn=t),Vn)},movementY:function(t){return"movementY"in t?t.movementY:Gn}}),Ji=In(Oi),lo=oe({},Oi,{dataTransfer:0}),Kn=In(lo),er=oe({},Sn,{relatedTarget:0}),xi=In(er),gr=oe({},Wr,{animationName:0,elapsedTime:0,pseudoElement:0}),Zn=In(gr),ws=oe({},Wr,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Xc=In(ws),jc=oe({},Wr,{data:0}),rl=In(jc),$c={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},qc={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},co={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function mn(t){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(t):(t=co[t])?!!i[t]:!1}function Ts(){return mn}var uo=oe({},Sn,{key:function(t){if(t.key){var i=$c[t.key]||t.key;if(i!=="Unidentified")return i}return t.type==="keypress"?(t=Yn(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?qc[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ts,charCode:function(t){return t.type==="keypress"?Yn(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Yn(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),_0=In(uo),x0=oe({},Oi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),sh=In(x0),y0=oe({},Sn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ts}),S0=In(y0),M0=oe({},Wr,{propertyName:0,elapsedTime:0,pseudoElement:0}),E0=In(M0),w0=oe({},Oi,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),T0=In(w0),A0=[9,13,27,32],Yc=d&&"CompositionEvent"in window,pa=null;d&&"documentMode"in document&&(pa=document.documentMode);var C0=d&&"TextEvent"in window&&!pa,oh=d&&(!Yc||pa&&8<pa&&11>=pa),ah=" ",lh=!1;function ch(t,i){switch(t){case"keyup":return A0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function uh(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var fo=!1;function R0(t,i){switch(t){case"compositionend":return uh(i);case"keypress":return i.which!==32?null:(lh=!0,ah);case"textInput":return t=i.data,t===ah&&lh?null:t;default:return null}}function b0(t,i){if(fo)return t==="compositionend"||!Yc&&ch(t,i)?(t=mr(),_i=Es=Hn=null,fo=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return oh&&i.locale!=="ko"?null:i.data;default:return null}}var P0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fh(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i==="input"?!!P0[t.type]:i==="textarea"}function dh(t,i,o,l){Pe(l),i=cl(i,"onChange"),0<i.length&&(o=new Nt("onChange","change",null,o,l),t.push({event:o,listeners:i}))}var ma=null,ga=null;function L0(t){Ph(t,0)}function sl(t){var i=vo(t);if(gt(i))return t}function D0(t,i){if(t==="change")return i}var hh=!1;if(d){var Kc;if(d){var Zc="oninput"in document;if(!Zc){var ph=document.createElement("div");ph.setAttribute("oninput","return;"),Zc=typeof ph.oninput=="function"}Kc=Zc}else Kc=!1;hh=Kc&&(!document.documentMode||9<document.documentMode)}function mh(){ma&&(ma.detachEvent("onpropertychange",gh),ga=ma=null)}function gh(t){if(t.propertyName==="value"&&sl(ga)){var i=[];dh(i,ga,t,W(t)),Rn(L0,i)}}function I0(t,i,o){t==="focusin"?(mh(),ma=i,ga=o,ma.attachEvent("onpropertychange",gh)):t==="focusout"&&mh()}function U0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return sl(ga)}function N0(t,i){if(t==="click")return sl(i)}function F0(t,i){if(t==="input"||t==="change")return sl(i)}function O0(t,i){return t===i&&(t!==0||1/t===1/i)||t!==t&&i!==i}var zi=typeof Object.is=="function"?Object.is:O0;function va(t,i){if(zi(t,i))return!0;if(typeof t!="object"||t===null||typeof i!="object"||i===null)return!1;var o=Object.keys(t),l=Object.keys(i);if(o.length!==l.length)return!1;for(l=0;l<o.length;l++){var f=o[l];if(!h.call(i,f)||!zi(t[f],i[f]))return!1}return!0}function vh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function _h(t,i){var o=vh(t);t=0;for(var l;o;){if(o.nodeType===3){if(l=t+o.textContent.length,t<=i&&l>=i)return{node:o,offset:i-t};t=l}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=vh(o)}}function xh(t,i){return t&&i?t===i?!0:t&&t.nodeType===3?!1:i&&i.nodeType===3?xh(t,i.parentNode):"contains"in t?t.contains(i):t.compareDocumentPosition?!!(t.compareDocumentPosition(i)&16):!1:!1}function yh(){for(var t=window,i=zt();i instanceof t.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)t=i.contentWindow;else break;i=zt(t.document)}return i}function Qc(t){var i=t&&t.nodeName&&t.nodeName.toLowerCase();return i&&(i==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||i==="textarea"||t.contentEditable==="true")}function z0(t){var i=yh(),o=t.focusedElem,l=t.selectionRange;if(i!==o&&o&&o.ownerDocument&&xh(o.ownerDocument.documentElement,o)){if(l!==null&&Qc(o)){if(i=l.start,t=l.end,t===void 0&&(t=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(t,o.value.length);else if(t=(i=o.ownerDocument||document)&&i.defaultView||window,t.getSelection){t=t.getSelection();var f=o.textContent.length,p=Math.min(l.start,f);l=l.end===void 0?p:Math.min(l.end,f),!t.extend&&p>l&&(f=l,l=p,p=f),f=_h(o,p);var M=_h(o,l);f&&M&&(t.rangeCount!==1||t.anchorNode!==f.node||t.anchorOffset!==f.offset||t.focusNode!==M.node||t.focusOffset!==M.offset)&&(i=i.createRange(),i.setStart(f.node,f.offset),t.removeAllRanges(),p>l?(t.addRange(i),t.extend(M.node,M.offset)):(i.setEnd(M.node,M.offset),t.addRange(i)))}}for(i=[],t=o;t=t.parentNode;)t.nodeType===1&&i.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)t=i[o],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var B0=d&&"documentMode"in document&&11>=document.documentMode,ho=null,Jc=null,_a=null,eu=!1;function Sh(t,i,o){var l=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;eu||ho==null||ho!==zt(l)||(l=ho,"selectionStart"in l&&Qc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),_a&&va(_a,l)||(_a=l,l=cl(Jc,"onSelect"),0<l.length&&(i=new Nt("onSelect","select",null,i,o),t.push({event:i,listeners:l}),i.target=ho)))}function ol(t,i){var o={};return o[t.toLowerCase()]=i.toLowerCase(),o["Webkit"+t]="webkit"+i,o["Moz"+t]="moz"+i,o}var po={animationend:ol("Animation","AnimationEnd"),animationiteration:ol("Animation","AnimationIteration"),animationstart:ol("Animation","AnimationStart"),transitionend:ol("Transition","TransitionEnd")},tu={},Mh={};d&&(Mh=document.createElement("div").style,"AnimationEvent"in window||(delete po.animationend.animation,delete po.animationiteration.animation,delete po.animationstart.animation),"TransitionEvent"in window||delete po.transitionend.transition);function al(t){if(tu[t])return tu[t];if(!po[t])return t;var i=po[t],o;for(o in i)if(i.hasOwnProperty(o)&&o in Mh)return tu[t]=i[o];return t}var Eh=al("animationend"),wh=al("animationiteration"),Th=al("animationstart"),Ah=al("transitionend"),Ch=new Map,Rh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xr(t,i){Ch.set(t,i),c(i,[t])}for(var nu=0;nu<Rh.length;nu++){var iu=Rh[nu],k0=iu.toLowerCase(),H0=iu[0].toUpperCase()+iu.slice(1);Xr(k0,"on"+H0)}Xr(Eh,"onAnimationEnd"),Xr(wh,"onAnimationIteration"),Xr(Th,"onAnimationStart"),Xr("dblclick","onDoubleClick"),Xr("focusin","onFocus"),Xr("focusout","onBlur"),Xr(Ah,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),c("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),c("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),c("onBeforeInput",["compositionend","keypress","textInput","paste"]),c("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),c("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),c("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var xa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),V0=new Set("cancel close invalid load scroll toggle".split(" ").concat(xa));function bh(t,i,o){var l=t.type||"unknown-event";t.currentTarget=o,io(l,i,void 0,t),t.currentTarget=null}function Ph(t,i){i=(i&4)!==0;for(var o=0;o<t.length;o++){var l=t[o],f=l.event;l=l.listeners;e:{var p=void 0;if(i)for(var M=l.length-1;0<=M;M--){var D=l[M],O=D.instance,re=D.currentTarget;if(D=D.listener,O!==p&&f.isPropagationStopped())break e;bh(f,D,re),p=O}else for(M=0;M<l.length;M++){if(D=l[M],O=D.instance,re=D.currentTarget,D=D.listener,O!==p&&f.isPropagationStopped())break e;bh(f,D,re),p=O}}}if(fr)throw t=Ki,fr=!1,Ki=null,t}function Wt(t,i){var o=i[fu];o===void 0&&(o=i[fu]=new Set);var l=t+"__bubble";o.has(l)||(Lh(i,t,2,!1),o.add(l))}function ru(t,i,o){var l=0;i&&(l|=4),Lh(o,t,l,i)}var ll="_reactListening"+Math.random().toString(36).slice(2);function ya(t){if(!t[ll]){t[ll]=!0,r.forEach(function(o){o!=="selectionchange"&&(V0.has(o)||ru(o,!1,t),ru(o,!0,t))});var i=t.nodeType===9?t:t.ownerDocument;i===null||i[ll]||(i[ll]=!0,ru("selectionchange",!1,i))}}function Lh(t,i,o,l){switch(pr(i)){case 1:var f=Fi;break;case 4:f=Ot;break;default:f=hn}o=f.bind(null,i,o,t),f=void 0,!Fr||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(f=!0),l?f!==void 0?t.addEventListener(i,o,{capture:!0,passive:f}):t.addEventListener(i,o,!0):f!==void 0?t.addEventListener(i,o,{passive:f}):t.addEventListener(i,o,!1)}function su(t,i,o,l,f){var p=l;if((i&1)===0&&(i&2)===0&&l!==null)e:for(;;){if(l===null)return;var M=l.tag;if(M===3||M===4){var D=l.stateNode.containerInfo;if(D===f||D.nodeType===8&&D.parentNode===f)break;if(M===4)for(M=l.return;M!==null;){var O=M.tag;if((O===3||O===4)&&(O=M.stateNode.containerInfo,O===f||O.nodeType===8&&O.parentNode===f))return;M=M.return}for(;D!==null;){if(M=As(D),M===null)return;if(O=M.tag,O===5||O===6){l=p=M;continue e}D=D.parentNode}}l=l.return}Rn(function(){var re=p,Ee=W(o),Ae=[];e:{var Me=Ch.get(t);if(Me!==void 0){var Oe=Nt,We=t;switch(t){case"keypress":if(Yn(o)===0)break e;case"keydown":case"keyup":Oe=_0;break;case"focusin":We="focus",Oe=xi;break;case"focusout":We="blur",Oe=xi;break;case"beforeblur":case"afterblur":Oe=xi;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Oe=Ji;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Oe=Kn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Oe=S0;break;case Eh:case wh:case Th:Oe=Zn;break;case Ah:Oe=E0;break;case"scroll":Oe=At;break;case"wheel":Oe=T0;break;case"copy":case"cut":case"paste":Oe=Xc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Oe=sh}var $e=(i&4)!==0,an=!$e&&t==="scroll",K=$e?Me!==null?Me+"Capture":null:Me;$e=[];for(var V=re,J;V!==null;){J=V;var Re=J.stateNode;if(J.tag===5&&Re!==null&&(J=Re,K!==null&&(Re=Zt(V,K),Re!=null&&$e.push(Sa(V,Re,J)))),an)break;V=V.return}0<$e.length&&(Me=new Oe(Me,We,null,o,Ee),Ae.push({event:Me,listeners:$e}))}}if((i&7)===0){e:{if(Me=t==="mouseover"||t==="pointerover",Oe=t==="mouseout"||t==="pointerout",Me&&o!==Pt&&(We=o.relatedTarget||o.fromElement)&&(As(We)||We[vr]))break e;if((Oe||Me)&&(Me=Ee.window===Ee?Ee:(Me=Ee.ownerDocument)?Me.defaultView||Me.parentWindow:window,Oe?(We=o.relatedTarget||o.toElement,Oe=re,We=We?As(We):null,We!==null&&(an=ai(We),We!==an||We.tag!==5&&We.tag!==6)&&(We=null)):(Oe=null,We=re),Oe!==We)){if($e=Ji,Re="onMouseLeave",K="onMouseEnter",V="mouse",(t==="pointerout"||t==="pointerover")&&($e=sh,Re="onPointerLeave",K="onPointerEnter",V="pointer"),an=Oe==null?Me:vo(Oe),J=We==null?Me:vo(We),Me=new $e(Re,V+"leave",Oe,o,Ee),Me.target=an,Me.relatedTarget=J,Re=null,As(Ee)===re&&($e=new $e(K,V+"enter",We,o,Ee),$e.target=J,$e.relatedTarget=an,Re=$e),an=Re,Oe&&We)t:{for($e=Oe,K=We,V=0,J=$e;J;J=mo(J))V++;for(J=0,Re=K;Re;Re=mo(Re))J++;for(;0<V-J;)$e=mo($e),V--;for(;0<J-V;)K=mo(K),J--;for(;V--;){if($e===K||K!==null&&$e===K.alternate)break t;$e=mo($e),K=mo(K)}$e=null}else $e=null;Oe!==null&&Dh(Ae,Me,Oe,$e,!1),We!==null&&an!==null&&Dh(Ae,an,We,$e,!0)}}e:{if(Me=re?vo(re):window,Oe=Me.nodeName&&Me.nodeName.toLowerCase(),Oe==="select"||Oe==="input"&&Me.type==="file")var qe=D0;else if(fh(Me))if(hh)qe=F0;else{qe=U0;var tt=I0}else(Oe=Me.nodeName)&&Oe.toLowerCase()==="input"&&(Me.type==="checkbox"||Me.type==="radio")&&(qe=N0);if(qe&&(qe=qe(t,re))){dh(Ae,qe,o,Ee);break e}tt&&tt(t,Me,re),t==="focusout"&&(tt=Me._wrapperState)&&tt.controlled&&Me.type==="number"&&It(Me,"number",Me.value)}switch(tt=re?vo(re):window,t){case"focusin":(fh(tt)||tt.contentEditable==="true")&&(ho=tt,Jc=re,_a=null);break;case"focusout":_a=Jc=ho=null;break;case"mousedown":eu=!0;break;case"contextmenu":case"mouseup":case"dragend":eu=!1,Sh(Ae,o,Ee);break;case"selectionchange":if(B0)break;case"keydown":case"keyup":Sh(Ae,o,Ee)}var nt;if(Yc)e:{switch(t){case"compositionstart":var ot="onCompositionStart";break e;case"compositionend":ot="onCompositionEnd";break e;case"compositionupdate":ot="onCompositionUpdate";break e}ot=void 0}else fo?ch(t,o)&&(ot="onCompositionEnd"):t==="keydown"&&o.keyCode===229&&(ot="onCompositionStart");ot&&(oh&&o.locale!=="ko"&&(fo||ot!=="onCompositionStart"?ot==="onCompositionEnd"&&fo&&(nt=mr()):(Hn=Ee,Es="value"in Hn?Hn.value:Hn.textContent,fo=!0)),tt=cl(re,ot),0<tt.length&&(ot=new rl(ot,t,null,o,Ee),Ae.push({event:ot,listeners:tt}),nt?ot.data=nt:(nt=uh(o),nt!==null&&(ot.data=nt)))),(nt=C0?R0(t,o):b0(t,o))&&(re=cl(re,"onBeforeInput"),0<re.length&&(Ee=new rl("onBeforeInput","beforeinput",null,o,Ee),Ae.push({event:Ee,listeners:re}),Ee.data=nt))}Ph(Ae,i)})}function Sa(t,i,o){return{instance:t,listener:i,currentTarget:o}}function cl(t,i){for(var o=i+"Capture",l=[];t!==null;){var f=t,p=f.stateNode;f.tag===5&&p!==null&&(f=p,p=Zt(t,o),p!=null&&l.unshift(Sa(t,p,f)),p=Zt(t,i),p!=null&&l.push(Sa(t,p,f))),t=t.return}return l}function mo(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Dh(t,i,o,l,f){for(var p=i._reactName,M=[];o!==null&&o!==l;){var D=o,O=D.alternate,re=D.stateNode;if(O!==null&&O===l)break;D.tag===5&&re!==null&&(D=re,f?(O=Zt(o,p),O!=null&&M.unshift(Sa(o,O,D))):f||(O=Zt(o,p),O!=null&&M.push(Sa(o,O,D)))),o=o.return}M.length!==0&&t.push({event:i,listeners:M})}var G0=/\r\n?/g,W0=/\u0000|\uFFFD/g;function Ih(t){return(typeof t=="string"?t:""+t).replace(G0,`
`).replace(W0,"")}function ul(t,i,o){if(i=Ih(i),Ih(t)!==i&&o)throw Error(n(425))}function fl(){}var ou=null,au=null;function lu(t,i){return t==="textarea"||t==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var cu=typeof setTimeout=="function"?setTimeout:void 0,X0=typeof clearTimeout=="function"?clearTimeout:void 0,Uh=typeof Promise=="function"?Promise:void 0,j0=typeof queueMicrotask=="function"?queueMicrotask:typeof Uh<"u"?function(t){return Uh.resolve(null).then(t).catch($0)}:cu;function $0(t){setTimeout(function(){throw t})}function uu(t,i){var o=i,l=0;do{var f=o.nextSibling;if(t.removeChild(o),f&&f.nodeType===8)if(o=f.data,o==="/$"){if(l===0){t.removeChild(f),et(i);return}l--}else o!=="$"&&o!=="$?"&&o!=="$!"||l++;o=f}while(o);et(i)}function jr(t){for(;t!=null;t=t.nextSibling){var i=t.nodeType;if(i===1||i===3)break;if(i===8){if(i=t.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return t}function Nh(t){t=t.previousSibling;for(var i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return t;i--}else o==="/$"&&i++}t=t.previousSibling}return null}var go=Math.random().toString(36).slice(2),tr="__reactFiber$"+go,Ma="__reactProps$"+go,vr="__reactContainer$"+go,fu="__reactEvents$"+go,q0="__reactListeners$"+go,Y0="__reactHandles$"+go;function As(t){var i=t[tr];if(i)return i;for(var o=t.parentNode;o;){if(i=o[vr]||o[tr]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(t=Nh(t);t!==null;){if(o=t[tr])return o;t=Nh(t)}return i}t=o,o=t.parentNode}return null}function Ea(t){return t=t[tr]||t[vr],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function vo(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(n(33))}function dl(t){return t[Ma]||null}var du=[],_o=-1;function $r(t){return{current:t}}function Xt(t){0>_o||(t.current=du[_o],du[_o]=null,_o--)}function Gt(t,i){_o++,du[_o]=t.current,t.current=i}var qr={},Un=$r(qr),Qn=$r(!1),Cs=qr;function xo(t,i){var o=t.type.contextTypes;if(!o)return qr;var l=t.stateNode;if(l&&l.__reactInternalMemoizedUnmaskedChildContext===i)return l.__reactInternalMemoizedMaskedChildContext;var f={},p;for(p in o)f[p]=i[p];return l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=f),f}function Jn(t){return t=t.childContextTypes,t!=null}function hl(){Xt(Qn),Xt(Un)}function Fh(t,i,o){if(Un.current!==qr)throw Error(n(168));Gt(Un,i),Gt(Qn,o)}function Oh(t,i,o){var l=t.stateNode;if(i=i.childContextTypes,typeof l.getChildContext!="function")return o;l=l.getChildContext();for(var f in l)if(!(f in i))throw Error(n(108,xe(t)||"Unknown",f));return oe({},o,l)}function pl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||qr,Cs=Un.current,Gt(Un,t),Gt(Qn,Qn.current),!0}function zh(t,i,o){var l=t.stateNode;if(!l)throw Error(n(169));o?(t=Oh(t,i,Cs),l.__reactInternalMemoizedMergedChildContext=t,Xt(Qn),Xt(Un),Gt(Un,t)):Xt(Qn),Gt(Qn,o)}var _r=null,ml=!1,hu=!1;function Bh(t){_r===null?_r=[t]:_r.push(t)}function K0(t){ml=!0,Bh(t)}function Yr(){if(!hu&&_r!==null){hu=!0;var t=0,i=wt;try{var o=_r;for(wt=1;t<o.length;t++){var l=o[t];do l=l(!0);while(l!==null)}_r=null,ml=!1}catch(f){throw _r!==null&&(_r=_r.slice(t+1)),ro(Te,Yr),f}finally{wt=i,hu=!1}}return null}var yo=[],So=0,gl=null,vl=0,yi=[],Si=0,Rs=null,xr=1,yr="";function bs(t,i){yo[So++]=vl,yo[So++]=gl,gl=t,vl=i}function kh(t,i,o){yi[Si++]=xr,yi[Si++]=yr,yi[Si++]=Rs,Rs=t;var l=xr;t=yr;var f=32-lt(l)-1;l&=~(1<<f),o+=1;var p=32-lt(i)+f;if(30<p){var M=f-f%5;p=(l&(1<<M)-1).toString(32),l>>=M,f-=M,xr=1<<32-lt(i)+f|o<<f|l,yr=p+t}else xr=1<<p|o<<f|l,yr=t}function pu(t){t.return!==null&&(bs(t,1),kh(t,1,0))}function mu(t){for(;t===gl;)gl=yo[--So],yo[So]=null,vl=yo[--So],yo[So]=null;for(;t===Rs;)Rs=yi[--Si],yi[Si]=null,yr=yi[--Si],yi[Si]=null,xr=yi[--Si],yi[Si]=null}var ci=null,ui=null,Kt=!1,Bi=null;function Hh(t,i){var o=Ti(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=t,i=t.deletions,i===null?(t.deletions=[o],t.flags|=16):i.push(o)}function Vh(t,i){switch(t.tag){case 5:var o=t.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(t.stateNode=i,ci=t,ui=jr(i.firstChild),!0):!1;case 6:return i=t.pendingProps===""||i.nodeType!==3?null:i,i!==null?(t.stateNode=i,ci=t,ui=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Rs!==null?{id:xr,overflow:yr}:null,t.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=Ti(18,null,null,0),o.stateNode=i,o.return=t,t.child=o,ci=t,ui=null,!0):!1;default:return!1}}function gu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function vu(t){if(Kt){var i=ui;if(i){var o=i;if(!Vh(t,i)){if(gu(t))throw Error(n(418));i=jr(o.nextSibling);var l=ci;i&&Vh(t,i)?Hh(l,o):(t.flags=t.flags&-4097|2,Kt=!1,ci=t)}}else{if(gu(t))throw Error(n(418));t.flags=t.flags&-4097|2,Kt=!1,ci=t}}}function Gh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;ci=t}function _l(t){if(t!==ci)return!1;if(!Kt)return Gh(t),Kt=!0,!1;var i;if((i=t.tag!==3)&&!(i=t.tag!==5)&&(i=t.type,i=i!=="head"&&i!=="body"&&!lu(t.type,t.memoizedProps)),i&&(i=ui)){if(gu(t))throw Wh(),Error(n(418));for(;i;)Hh(t,i),i=jr(i.nextSibling)}if(Gh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(n(317));e:{for(t=t.nextSibling,i=0;t;){if(t.nodeType===8){var o=t.data;if(o==="/$"){if(i===0){ui=jr(t.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}t=t.nextSibling}ui=null}}else ui=ci?jr(t.stateNode.nextSibling):null;return!0}function Wh(){for(var t=ui;t;)t=jr(t.nextSibling)}function Mo(){ui=ci=null,Kt=!1}function _u(t){Bi===null?Bi=[t]:Bi.push(t)}var Z0=b.ReactCurrentBatchConfig;function wa(t,i,o){if(t=o.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(n(309));var l=o.stateNode}if(!l)throw Error(n(147,t));var f=l,p=""+t;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===p?i.ref:(i=function(M){var D=f.refs;M===null?delete D[p]:D[p]=M},i._stringRef=p,i)}if(typeof t!="string")throw Error(n(284));if(!o._owner)throw Error(n(290,t))}return t}function xl(t,i){throw t=Object.prototype.toString.call(i),Error(n(31,t==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":t))}function Xh(t){var i=t._init;return i(t._payload)}function jh(t){function i(K,V){if(t){var J=K.deletions;J===null?(K.deletions=[V],K.flags|=16):J.push(V)}}function o(K,V){if(!t)return null;for(;V!==null;)i(K,V),V=V.sibling;return null}function l(K,V){for(K=new Map;V!==null;)V.key!==null?K.set(V.key,V):K.set(V.index,V),V=V.sibling;return K}function f(K,V){return K=is(K,V),K.index=0,K.sibling=null,K}function p(K,V,J){return K.index=J,t?(J=K.alternate,J!==null?(J=J.index,J<V?(K.flags|=2,V):J):(K.flags|=2,V)):(K.flags|=1048576,V)}function M(K){return t&&K.alternate===null&&(K.flags|=2),K}function D(K,V,J,Re){return V===null||V.tag!==6?(V=uf(J,K.mode,Re),V.return=K,V):(V=f(V,J),V.return=K,V)}function O(K,V,J,Re){var qe=J.type;return qe===N?Ee(K,V,J.props.children,Re,J.key):V!==null&&(V.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===ae&&Xh(qe)===V.type)?(Re=f(V,J.props),Re.ref=wa(K,V,J),Re.return=K,Re):(Re=Gl(J.type,J.key,J.props,null,K.mode,Re),Re.ref=wa(K,V,J),Re.return=K,Re)}function re(K,V,J,Re){return V===null||V.tag!==4||V.stateNode.containerInfo!==J.containerInfo||V.stateNode.implementation!==J.implementation?(V=ff(J,K.mode,Re),V.return=K,V):(V=f(V,J.children||[]),V.return=K,V)}function Ee(K,V,J,Re,qe){return V===null||V.tag!==7?(V=Os(J,K.mode,Re,qe),V.return=K,V):(V=f(V,J),V.return=K,V)}function Ae(K,V,J){if(typeof V=="string"&&V!==""||typeof V=="number")return V=uf(""+V,K.mode,J),V.return=K,V;if(typeof V=="object"&&V!==null){switch(V.$$typeof){case H:return J=Gl(V.type,V.key,V.props,null,K.mode,J),J.ref=wa(K,null,V),J.return=K,J;case F:return V=ff(V,K.mode,J),V.return=K,V;case ae:var Re=V._init;return Ae(K,Re(V._payload),J)}if(Xe(V)||de(V))return V=Os(V,K.mode,J,null),V.return=K,V;xl(K,V)}return null}function Me(K,V,J,Re){var qe=V!==null?V.key:null;if(typeof J=="string"&&J!==""||typeof J=="number")return qe!==null?null:D(K,V,""+J,Re);if(typeof J=="object"&&J!==null){switch(J.$$typeof){case H:return J.key===qe?O(K,V,J,Re):null;case F:return J.key===qe?re(K,V,J,Re):null;case ae:return qe=J._init,Me(K,V,qe(J._payload),Re)}if(Xe(J)||de(J))return qe!==null?null:Ee(K,V,J,Re,null);xl(K,J)}return null}function Oe(K,V,J,Re,qe){if(typeof Re=="string"&&Re!==""||typeof Re=="number")return K=K.get(J)||null,D(V,K,""+Re,qe);if(typeof Re=="object"&&Re!==null){switch(Re.$$typeof){case H:return K=K.get(Re.key===null?J:Re.key)||null,O(V,K,Re,qe);case F:return K=K.get(Re.key===null?J:Re.key)||null,re(V,K,Re,qe);case ae:var tt=Re._init;return Oe(K,V,J,tt(Re._payload),qe)}if(Xe(Re)||de(Re))return K=K.get(J)||null,Ee(V,K,Re,qe,null);xl(V,Re)}return null}function We(K,V,J,Re){for(var qe=null,tt=null,nt=V,ot=V=0,wn=null;nt!==null&&ot<J.length;ot++){nt.index>ot?(wn=nt,nt=null):wn=nt.sibling;var Lt=Me(K,nt,J[ot],Re);if(Lt===null){nt===null&&(nt=wn);break}t&&nt&&Lt.alternate===null&&i(K,nt),V=p(Lt,V,ot),tt===null?qe=Lt:tt.sibling=Lt,tt=Lt,nt=wn}if(ot===J.length)return o(K,nt),Kt&&bs(K,ot),qe;if(nt===null){for(;ot<J.length;ot++)nt=Ae(K,J[ot],Re),nt!==null&&(V=p(nt,V,ot),tt===null?qe=nt:tt.sibling=nt,tt=nt);return Kt&&bs(K,ot),qe}for(nt=l(K,nt);ot<J.length;ot++)wn=Oe(nt,K,ot,J[ot],Re),wn!==null&&(t&&wn.alternate!==null&&nt.delete(wn.key===null?ot:wn.key),V=p(wn,V,ot),tt===null?qe=wn:tt.sibling=wn,tt=wn);return t&&nt.forEach(function(rs){return i(K,rs)}),Kt&&bs(K,ot),qe}function $e(K,V,J,Re){var qe=de(J);if(typeof qe!="function")throw Error(n(150));if(J=qe.call(J),J==null)throw Error(n(151));for(var tt=qe=null,nt=V,ot=V=0,wn=null,Lt=J.next();nt!==null&&!Lt.done;ot++,Lt=J.next()){nt.index>ot?(wn=nt,nt=null):wn=nt.sibling;var rs=Me(K,nt,Lt.value,Re);if(rs===null){nt===null&&(nt=wn);break}t&&nt&&rs.alternate===null&&i(K,nt),V=p(rs,V,ot),tt===null?qe=rs:tt.sibling=rs,tt=rs,nt=wn}if(Lt.done)return o(K,nt),Kt&&bs(K,ot),qe;if(nt===null){for(;!Lt.done;ot++,Lt=J.next())Lt=Ae(K,Lt.value,Re),Lt!==null&&(V=p(Lt,V,ot),tt===null?qe=Lt:tt.sibling=Lt,tt=Lt);return Kt&&bs(K,ot),qe}for(nt=l(K,nt);!Lt.done;ot++,Lt=J.next())Lt=Oe(nt,K,ot,Lt.value,Re),Lt!==null&&(t&&Lt.alternate!==null&&nt.delete(Lt.key===null?ot:Lt.key),V=p(Lt,V,ot),tt===null?qe=Lt:tt.sibling=Lt,tt=Lt);return t&&nt.forEach(function(Pv){return i(K,Pv)}),Kt&&bs(K,ot),qe}function an(K,V,J,Re){if(typeof J=="object"&&J!==null&&J.type===N&&J.key===null&&(J=J.props.children),typeof J=="object"&&J!==null){switch(J.$$typeof){case H:e:{for(var qe=J.key,tt=V;tt!==null;){if(tt.key===qe){if(qe=J.type,qe===N){if(tt.tag===7){o(K,tt.sibling),V=f(tt,J.props.children),V.return=K,K=V;break e}}else if(tt.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===ae&&Xh(qe)===tt.type){o(K,tt.sibling),V=f(tt,J.props),V.ref=wa(K,tt,J),V.return=K,K=V;break e}o(K,tt);break}else i(K,tt);tt=tt.sibling}J.type===N?(V=Os(J.props.children,K.mode,Re,J.key),V.return=K,K=V):(Re=Gl(J.type,J.key,J.props,null,K.mode,Re),Re.ref=wa(K,V,J),Re.return=K,K=Re)}return M(K);case F:e:{for(tt=J.key;V!==null;){if(V.key===tt)if(V.tag===4&&V.stateNode.containerInfo===J.containerInfo&&V.stateNode.implementation===J.implementation){o(K,V.sibling),V=f(V,J.children||[]),V.return=K,K=V;break e}else{o(K,V);break}else i(K,V);V=V.sibling}V=ff(J,K.mode,Re),V.return=K,K=V}return M(K);case ae:return tt=J._init,an(K,V,tt(J._payload),Re)}if(Xe(J))return We(K,V,J,Re);if(de(J))return $e(K,V,J,Re);xl(K,J)}return typeof J=="string"&&J!==""||typeof J=="number"?(J=""+J,V!==null&&V.tag===6?(o(K,V.sibling),V=f(V,J),V.return=K,K=V):(o(K,V),V=uf(J,K.mode,Re),V.return=K,K=V),M(K)):o(K,V)}return an}var Eo=jh(!0),$h=jh(!1),yl=$r(null),Sl=null,wo=null,xu=null;function yu(){xu=wo=Sl=null}function Su(t){var i=yl.current;Xt(yl),t._currentValue=i}function Mu(t,i,o){for(;t!==null;){var l=t.alternate;if((t.childLanes&i)!==i?(t.childLanes|=i,l!==null&&(l.childLanes|=i)):l!==null&&(l.childLanes&i)!==i&&(l.childLanes|=i),t===o)break;t=t.return}}function To(t,i){Sl=t,xu=wo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&i)!==0&&(ei=!0),t.firstContext=null)}function Mi(t){var i=t._currentValue;if(xu!==t)if(t={context:t,memoizedValue:i,next:null},wo===null){if(Sl===null)throw Error(n(308));wo=t,Sl.dependencies={lanes:0,firstContext:t}}else wo=wo.next=t;return i}var Ps=null;function Eu(t){Ps===null?Ps=[t]:Ps.push(t)}function qh(t,i,o,l){var f=i.interleaved;return f===null?(o.next=o,Eu(i)):(o.next=f.next,f.next=o),i.interleaved=o,Sr(t,l)}function Sr(t,i){t.lanes|=i;var o=t.alternate;for(o!==null&&(o.lanes|=i),o=t,t=t.return;t!==null;)t.childLanes|=i,o=t.alternate,o!==null&&(o.childLanes|=i),o=t,t=t.return;return o.tag===3?o.stateNode:null}var Kr=!1;function wu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Yh(t,i){t=t.updateQueue,i.updateQueue===t&&(i.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Mr(t,i){return{eventTime:t,lane:i,tag:0,payload:null,callback:null,next:null}}function Zr(t,i,o){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(Rt&2)!==0){var f=l.pending;return f===null?i.next=i:(i.next=f.next,f.next=i),l.pending=i,Sr(t,o)}return f=l.interleaved,f===null?(i.next=i,Eu(l)):(i.next=f.next,f.next=i),l.interleaved=i,Sr(t,o)}function Ml(t,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Yt(t,o)}}function Kh(t,i){var o=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,o===l)){var f=null,p=null;if(o=o.firstBaseUpdate,o!==null){do{var M={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};p===null?f=p=M:p=p.next=M,o=o.next}while(o!==null);p===null?f=p=i:p=p.next=i}else f=p=i;o={baseState:l.baseState,firstBaseUpdate:f,lastBaseUpdate:p,shared:l.shared,effects:l.effects},t.updateQueue=o;return}t=o.lastBaseUpdate,t===null?o.firstBaseUpdate=i:t.next=i,o.lastBaseUpdate=i}function El(t,i,o,l){var f=t.updateQueue;Kr=!1;var p=f.firstBaseUpdate,M=f.lastBaseUpdate,D=f.shared.pending;if(D!==null){f.shared.pending=null;var O=D,re=O.next;O.next=null,M===null?p=re:M.next=re,M=O;var Ee=t.alternate;Ee!==null&&(Ee=Ee.updateQueue,D=Ee.lastBaseUpdate,D!==M&&(D===null?Ee.firstBaseUpdate=re:D.next=re,Ee.lastBaseUpdate=O))}if(p!==null){var Ae=f.baseState;M=0,Ee=re=O=null,D=p;do{var Me=D.lane,Oe=D.eventTime;if((l&Me)===Me){Ee!==null&&(Ee=Ee.next={eventTime:Oe,lane:0,tag:D.tag,payload:D.payload,callback:D.callback,next:null});e:{var We=t,$e=D;switch(Me=i,Oe=o,$e.tag){case 1:if(We=$e.payload,typeof We=="function"){Ae=We.call(Oe,Ae,Me);break e}Ae=We;break e;case 3:We.flags=We.flags&-65537|128;case 0:if(We=$e.payload,Me=typeof We=="function"?We.call(Oe,Ae,Me):We,Me==null)break e;Ae=oe({},Ae,Me);break e;case 2:Kr=!0}}D.callback!==null&&D.lane!==0&&(t.flags|=64,Me=f.effects,Me===null?f.effects=[D]:Me.push(D))}else Oe={eventTime:Oe,lane:Me,tag:D.tag,payload:D.payload,callback:D.callback,next:null},Ee===null?(re=Ee=Oe,O=Ae):Ee=Ee.next=Oe,M|=Me;if(D=D.next,D===null){if(D=f.shared.pending,D===null)break;Me=D,D=Me.next,Me.next=null,f.lastBaseUpdate=Me,f.shared.pending=null}}while(!0);if(Ee===null&&(O=Ae),f.baseState=O,f.firstBaseUpdate=re,f.lastBaseUpdate=Ee,i=f.shared.interleaved,i!==null){f=i;do M|=f.lane,f=f.next;while(f!==i)}else p===null&&(f.shared.lanes=0);Is|=M,t.lanes=M,t.memoizedState=Ae}}function Zh(t,i,o){if(t=i.effects,i.effects=null,t!==null)for(i=0;i<t.length;i++){var l=t[i],f=l.callback;if(f!==null){if(l.callback=null,l=o,typeof f!="function")throw Error(n(191,f));f.call(l)}}}var Ta={},nr=$r(Ta),Aa=$r(Ta),Ca=$r(Ta);function Ls(t){if(t===Ta)throw Error(n(174));return t}function Tu(t,i){switch(Gt(Ca,i),Gt(Aa,t),Gt(nr,Ta),t=i.nodeType,t){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:je(null,"");break;default:t=t===8?i.parentNode:i,i=t.namespaceURI||null,t=t.tagName,i=je(i,t)}Xt(nr),Gt(nr,i)}function Ao(){Xt(nr),Xt(Aa),Xt(Ca)}function Qh(t){Ls(Ca.current);var i=Ls(nr.current),o=je(i,t.type);i!==o&&(Gt(Aa,t),Gt(nr,o))}function Au(t){Aa.current===t&&(Xt(nr),Xt(Aa))}var Qt=$r(0);function wl(t){for(var i=t;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Cu=[];function Ru(){for(var t=0;t<Cu.length;t++)Cu[t]._workInProgressVersionPrimary=null;Cu.length=0}var Tl=b.ReactCurrentDispatcher,bu=b.ReactCurrentBatchConfig,Ds=0,Jt=null,gn=null,Mn=null,Al=!1,Ra=!1,ba=0,Q0=0;function Nn(){throw Error(n(321))}function Pu(t,i){if(i===null)return!1;for(var o=0;o<i.length&&o<t.length;o++)if(!zi(t[o],i[o]))return!1;return!0}function Lu(t,i,o,l,f,p){if(Ds=p,Jt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Tl.current=t===null||t.memoizedState===null?nv:iv,t=o(l,f),Ra){p=0;do{if(Ra=!1,ba=0,25<=p)throw Error(n(301));p+=1,Mn=gn=null,i.updateQueue=null,Tl.current=rv,t=o(l,f)}while(Ra)}if(Tl.current=bl,i=gn!==null&&gn.next!==null,Ds=0,Mn=gn=Jt=null,Al=!1,i)throw Error(n(300));return t}function Du(){var t=ba!==0;return ba=0,t}function ir(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Mn===null?Jt.memoizedState=Mn=t:Mn=Mn.next=t,Mn}function Ei(){if(gn===null){var t=Jt.alternate;t=t!==null?t.memoizedState:null}else t=gn.next;var i=Mn===null?Jt.memoizedState:Mn.next;if(i!==null)Mn=i,gn=t;else{if(t===null)throw Error(n(310));gn=t,t={memoizedState:gn.memoizedState,baseState:gn.baseState,baseQueue:gn.baseQueue,queue:gn.queue,next:null},Mn===null?Jt.memoizedState=Mn=t:Mn=Mn.next=t}return Mn}function Pa(t,i){return typeof i=="function"?i(t):i}function Iu(t){var i=Ei(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=gn,f=l.baseQueue,p=o.pending;if(p!==null){if(f!==null){var M=f.next;f.next=p.next,p.next=M}l.baseQueue=f=p,o.pending=null}if(f!==null){p=f.next,l=l.baseState;var D=M=null,O=null,re=p;do{var Ee=re.lane;if((Ds&Ee)===Ee)O!==null&&(O=O.next={lane:0,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null}),l=re.hasEagerState?re.eagerState:t(l,re.action);else{var Ae={lane:Ee,action:re.action,hasEagerState:re.hasEagerState,eagerState:re.eagerState,next:null};O===null?(D=O=Ae,M=l):O=O.next=Ae,Jt.lanes|=Ee,Is|=Ee}re=re.next}while(re!==null&&re!==p);O===null?M=l:O.next=D,zi(l,i.memoizedState)||(ei=!0),i.memoizedState=l,i.baseState=M,i.baseQueue=O,o.lastRenderedState=l}if(t=o.interleaved,t!==null){f=t;do p=f.lane,Jt.lanes|=p,Is|=p,f=f.next;while(f!==t)}else f===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function Uu(t){var i=Ei(),o=i.queue;if(o===null)throw Error(n(311));o.lastRenderedReducer=t;var l=o.dispatch,f=o.pending,p=i.memoizedState;if(f!==null){o.pending=null;var M=f=f.next;do p=t(p,M.action),M=M.next;while(M!==f);zi(p,i.memoizedState)||(ei=!0),i.memoizedState=p,i.baseQueue===null&&(i.baseState=p),o.lastRenderedState=p}return[p,l]}function Jh(){}function ep(t,i){var o=Jt,l=Ei(),f=i(),p=!zi(l.memoizedState,f);if(p&&(l.memoizedState=f,ei=!0),l=l.queue,Nu(ip.bind(null,o,l,t),[t]),l.getSnapshot!==i||p||Mn!==null&&Mn.memoizedState.tag&1){if(o.flags|=2048,La(9,np.bind(null,o,l,f,i),void 0,null),En===null)throw Error(n(349));(Ds&30)!==0||tp(o,i,f)}return f}function tp(t,i,o){t.flags|=16384,t={getSnapshot:i,value:o},i=Jt.updateQueue,i===null?(i={lastEffect:null,stores:null},Jt.updateQueue=i,i.stores=[t]):(o=i.stores,o===null?i.stores=[t]:o.push(t))}function np(t,i,o,l){i.value=o,i.getSnapshot=l,rp(i)&&sp(t)}function ip(t,i,o){return o(function(){rp(i)&&sp(t)})}function rp(t){var i=t.getSnapshot;t=t.value;try{var o=i();return!zi(t,o)}catch{return!0}}function sp(t){var i=Sr(t,1);i!==null&&Gi(i,t,1,-1)}function op(t){var i=ir();return typeof t=="function"&&(t=t()),i.memoizedState=i.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Pa,lastRenderedState:t},i.queue=t,t=t.dispatch=tv.bind(null,Jt,t),[i.memoizedState,t]}function La(t,i,o,l){return t={tag:t,create:i,destroy:o,deps:l,next:null},i=Jt.updateQueue,i===null?(i={lastEffect:null,stores:null},Jt.updateQueue=i,i.lastEffect=t.next=t):(o=i.lastEffect,o===null?i.lastEffect=t.next=t:(l=o.next,o.next=t,t.next=l,i.lastEffect=t)),t}function ap(){return Ei().memoizedState}function Cl(t,i,o,l){var f=ir();Jt.flags|=t,f.memoizedState=La(1|i,o,void 0,l===void 0?null:l)}function Rl(t,i,o,l){var f=Ei();l=l===void 0?null:l;var p=void 0;if(gn!==null){var M=gn.memoizedState;if(p=M.destroy,l!==null&&Pu(l,M.deps)){f.memoizedState=La(i,o,p,l);return}}Jt.flags|=t,f.memoizedState=La(1|i,o,p,l)}function lp(t,i){return Cl(8390656,8,t,i)}function Nu(t,i){return Rl(2048,8,t,i)}function cp(t,i){return Rl(4,2,t,i)}function up(t,i){return Rl(4,4,t,i)}function fp(t,i){if(typeof i=="function")return t=t(),i(t),function(){i(null)};if(i!=null)return t=t(),i.current=t,function(){i.current=null}}function dp(t,i,o){return o=o!=null?o.concat([t]):null,Rl(4,4,fp.bind(null,i,t),o)}function Fu(){}function hp(t,i){var o=Ei();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&Pu(i,l[1])?l[0]:(o.memoizedState=[t,i],t)}function pp(t,i){var o=Ei();i=i===void 0?null:i;var l=o.memoizedState;return l!==null&&i!==null&&Pu(i,l[1])?l[0]:(t=t(),o.memoizedState=[t,i],t)}function mp(t,i,o){return(Ds&21)===0?(t.baseState&&(t.baseState=!1,ei=!0),t.memoizedState=o):(zi(o,i)||(o=Ft(),Jt.lanes|=o,Is|=o,t.baseState=!0),i)}function J0(t,i){var o=wt;wt=o!==0&&4>o?o:4,t(!0);var l=bu.transition;bu.transition={};try{t(!1),i()}finally{wt=o,bu.transition=l}}function gp(){return Ei().memoizedState}function ev(t,i,o){var l=ts(t);if(o={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null},vp(t))_p(i,o);else if(o=qh(t,i,o,l),o!==null){var f=Xn();Gi(o,t,l,f),xp(o,i,l)}}function tv(t,i,o){var l=ts(t),f={lane:l,action:o,hasEagerState:!1,eagerState:null,next:null};if(vp(t))_p(i,f);else{var p=t.alternate;if(t.lanes===0&&(p===null||p.lanes===0)&&(p=i.lastRenderedReducer,p!==null))try{var M=i.lastRenderedState,D=p(M,o);if(f.hasEagerState=!0,f.eagerState=D,zi(D,M)){var O=i.interleaved;O===null?(f.next=f,Eu(i)):(f.next=O.next,O.next=f),i.interleaved=f;return}}catch{}finally{}o=qh(t,i,f,l),o!==null&&(f=Xn(),Gi(o,t,l,f),xp(o,i,l))}}function vp(t){var i=t.alternate;return t===Jt||i!==null&&i===Jt}function _p(t,i){Ra=Al=!0;var o=t.pending;o===null?i.next=i:(i.next=o.next,o.next=i),t.pending=i}function xp(t,i,o){if((o&4194240)!==0){var l=i.lanes;l&=t.pendingLanes,o|=l,i.lanes=o,Yt(t,o)}}var bl={readContext:Mi,useCallback:Nn,useContext:Nn,useEffect:Nn,useImperativeHandle:Nn,useInsertionEffect:Nn,useLayoutEffect:Nn,useMemo:Nn,useReducer:Nn,useRef:Nn,useState:Nn,useDebugValue:Nn,useDeferredValue:Nn,useTransition:Nn,useMutableSource:Nn,useSyncExternalStore:Nn,useId:Nn,unstable_isNewReconciler:!1},nv={readContext:Mi,useCallback:function(t,i){return ir().memoizedState=[t,i===void 0?null:i],t},useContext:Mi,useEffect:lp,useImperativeHandle:function(t,i,o){return o=o!=null?o.concat([t]):null,Cl(4194308,4,fp.bind(null,i,t),o)},useLayoutEffect:function(t,i){return Cl(4194308,4,t,i)},useInsertionEffect:function(t,i){return Cl(4,2,t,i)},useMemo:function(t,i){var o=ir();return i=i===void 0?null:i,t=t(),o.memoizedState=[t,i],t},useReducer:function(t,i,o){var l=ir();return i=o!==void 0?o(i):i,l.memoizedState=l.baseState=i,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},l.queue=t,t=t.dispatch=ev.bind(null,Jt,t),[l.memoizedState,t]},useRef:function(t){var i=ir();return t={current:t},i.memoizedState=t},useState:op,useDebugValue:Fu,useDeferredValue:function(t){return ir().memoizedState=t},useTransition:function(){var t=op(!1),i=t[0];return t=J0.bind(null,t[1]),ir().memoizedState=t,[i,t]},useMutableSource:function(){},useSyncExternalStore:function(t,i,o){var l=Jt,f=ir();if(Kt){if(o===void 0)throw Error(n(407));o=o()}else{if(o=i(),En===null)throw Error(n(349));(Ds&30)!==0||tp(l,i,o)}f.memoizedState=o;var p={value:o,getSnapshot:i};return f.queue=p,lp(ip.bind(null,l,p,t),[t]),l.flags|=2048,La(9,np.bind(null,l,p,o,i),void 0,null),o},useId:function(){var t=ir(),i=En.identifierPrefix;if(Kt){var o=yr,l=xr;o=(l&~(1<<32-lt(l)-1)).toString(32)+o,i=":"+i+"R"+o,o=ba++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=Q0++,i=":"+i+"r"+o.toString(32)+":";return t.memoizedState=i},unstable_isNewReconciler:!1},iv={readContext:Mi,useCallback:hp,useContext:Mi,useEffect:Nu,useImperativeHandle:dp,useInsertionEffect:cp,useLayoutEffect:up,useMemo:pp,useReducer:Iu,useRef:ap,useState:function(){return Iu(Pa)},useDebugValue:Fu,useDeferredValue:function(t){var i=Ei();return mp(i,gn.memoizedState,t)},useTransition:function(){var t=Iu(Pa)[0],i=Ei().memoizedState;return[t,i]},useMutableSource:Jh,useSyncExternalStore:ep,useId:gp,unstable_isNewReconciler:!1},rv={readContext:Mi,useCallback:hp,useContext:Mi,useEffect:Nu,useImperativeHandle:dp,useInsertionEffect:cp,useLayoutEffect:up,useMemo:pp,useReducer:Uu,useRef:ap,useState:function(){return Uu(Pa)},useDebugValue:Fu,useDeferredValue:function(t){var i=Ei();return gn===null?i.memoizedState=t:mp(i,gn.memoizedState,t)},useTransition:function(){var t=Uu(Pa)[0],i=Ei().memoizedState;return[t,i]},useMutableSource:Jh,useSyncExternalStore:ep,useId:gp,unstable_isNewReconciler:!1};function ki(t,i){if(t&&t.defaultProps){i=oe({},i),t=t.defaultProps;for(var o in t)i[o]===void 0&&(i[o]=t[o]);return i}return i}function Ou(t,i,o,l){i=t.memoizedState,o=o(l,i),o=o==null?i:oe({},i,o),t.memoizedState=o,t.lanes===0&&(t.updateQueue.baseState=o)}var Pl={isMounted:function(t){return(t=t._reactInternals)?ai(t)===t:!1},enqueueSetState:function(t,i,o){t=t._reactInternals;var l=Xn(),f=ts(t),p=Mr(l,f);p.payload=i,o!=null&&(p.callback=o),i=Zr(t,p,f),i!==null&&(Gi(i,t,f,l),Ml(i,t,f))},enqueueReplaceState:function(t,i,o){t=t._reactInternals;var l=Xn(),f=ts(t),p=Mr(l,f);p.tag=1,p.payload=i,o!=null&&(p.callback=o),i=Zr(t,p,f),i!==null&&(Gi(i,t,f,l),Ml(i,t,f))},enqueueForceUpdate:function(t,i){t=t._reactInternals;var o=Xn(),l=ts(t),f=Mr(o,l);f.tag=2,i!=null&&(f.callback=i),i=Zr(t,f,l),i!==null&&(Gi(i,t,l,o),Ml(i,t,l))}};function yp(t,i,o,l,f,p,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,p,M):i.prototype&&i.prototype.isPureReactComponent?!va(o,l)||!va(f,p):!0}function Sp(t,i,o){var l=!1,f=qr,p=i.contextType;return typeof p=="object"&&p!==null?p=Mi(p):(f=Jn(i)?Cs:Un.current,l=i.contextTypes,p=(l=l!=null)?xo(t,f):qr),i=new i(o,p),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Pl,t.stateNode=i,i._reactInternals=t,l&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=f,t.__reactInternalMemoizedMaskedChildContext=p),i}function Mp(t,i,o,l){t=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,l),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,l),i.state!==t&&Pl.enqueueReplaceState(i,i.state,null)}function zu(t,i,o,l){var f=t.stateNode;f.props=o,f.state=t.memoizedState,f.refs={},wu(t);var p=i.contextType;typeof p=="object"&&p!==null?f.context=Mi(p):(p=Jn(i)?Cs:Un.current,f.context=xo(t,p)),f.state=t.memoizedState,p=i.getDerivedStateFromProps,typeof p=="function"&&(Ou(t,i,p,o),f.state=t.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(i=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),i!==f.state&&Pl.enqueueReplaceState(f,f.state,null),El(t,o,f,l),f.state=t.memoizedState),typeof f.componentDidMount=="function"&&(t.flags|=4194308)}function Co(t,i){try{var o="",l=i;do o+=pe(l),l=l.return;while(l);var f=o}catch(p){f=`
Error generating stack: `+p.message+`
`+p.stack}return{value:t,source:i,stack:f,digest:null}}function Bu(t,i,o){return{value:t,source:null,stack:o??null,digest:i??null}}function ku(t,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var sv=typeof WeakMap=="function"?WeakMap:Map;function Ep(t,i,o){o=Mr(-1,o),o.tag=3,o.payload={element:null};var l=i.value;return o.callback=function(){Ol||(Ol=!0,tf=l),ku(t,i)},o}function wp(t,i,o){o=Mr(-1,o),o.tag=3;var l=t.type.getDerivedStateFromError;if(typeof l=="function"){var f=i.value;o.payload=function(){return l(f)},o.callback=function(){ku(t,i)}}var p=t.stateNode;return p!==null&&typeof p.componentDidCatch=="function"&&(o.callback=function(){ku(t,i),typeof l!="function"&&(Jr===null?Jr=new Set([this]):Jr.add(this));var M=i.stack;this.componentDidCatch(i.value,{componentStack:M!==null?M:""})}),o}function Tp(t,i,o){var l=t.pingCache;if(l===null){l=t.pingCache=new sv;var f=new Set;l.set(i,f)}else f=l.get(i),f===void 0&&(f=new Set,l.set(i,f));f.has(o)||(f.add(o),t=xv.bind(null,t,i,o),i.then(t,t))}function Ap(t){do{var i;if((i=t.tag===13)&&(i=t.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return t;t=t.return}while(t!==null);return null}function Cp(t,i,o,l,f){return(t.mode&1)===0?(t===i?t.flags|=65536:(t.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=Mr(-1,1),i.tag=2,Zr(o,i,1))),o.lanes|=1),t):(t.flags|=65536,t.lanes=f,t)}var ov=b.ReactCurrentOwner,ei=!1;function Wn(t,i,o,l){i.child=t===null?$h(i,null,o,l):Eo(i,t.child,o,l)}function Rp(t,i,o,l,f){o=o.render;var p=i.ref;return To(i,f),l=Lu(t,i,o,l,p,f),o=Du(),t!==null&&!ei?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,Er(t,i,f)):(Kt&&o&&pu(i),i.flags|=1,Wn(t,i,l,f),i.child)}function bp(t,i,o,l,f){if(t===null){var p=o.type;return typeof p=="function"&&!cf(p)&&p.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=p,Pp(t,i,p,l,f)):(t=Gl(o.type,null,l,i,i.mode,f),t.ref=i.ref,t.return=i,i.child=t)}if(p=t.child,(t.lanes&f)===0){var M=p.memoizedProps;if(o=o.compare,o=o!==null?o:va,o(M,l)&&t.ref===i.ref)return Er(t,i,f)}return i.flags|=1,t=is(p,l),t.ref=i.ref,t.return=i,i.child=t}function Pp(t,i,o,l,f){if(t!==null){var p=t.memoizedProps;if(va(p,l)&&t.ref===i.ref)if(ei=!1,i.pendingProps=l=p,(t.lanes&f)!==0)(t.flags&131072)!==0&&(ei=!0);else return i.lanes=t.lanes,Er(t,i,f)}return Hu(t,i,o,l,f)}function Lp(t,i,o){var l=i.pendingProps,f=l.children,p=t!==null?t.memoizedState:null;if(l.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Gt(bo,fi),fi|=o;else{if((o&1073741824)===0)return t=p!==null?p.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:t,cachePool:null,transitions:null},i.updateQueue=null,Gt(bo,fi),fi|=t,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},l=p!==null?p.baseLanes:o,Gt(bo,fi),fi|=l}else p!==null?(l=p.baseLanes|o,i.memoizedState=null):l=o,Gt(bo,fi),fi|=l;return Wn(t,i,f,o),i.child}function Dp(t,i){var o=i.ref;(t===null&&o!==null||t!==null&&t.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function Hu(t,i,o,l,f){var p=Jn(o)?Cs:Un.current;return p=xo(i,p),To(i,f),o=Lu(t,i,o,l,p,f),l=Du(),t!==null&&!ei?(i.updateQueue=t.updateQueue,i.flags&=-2053,t.lanes&=~f,Er(t,i,f)):(Kt&&l&&pu(i),i.flags|=1,Wn(t,i,o,f),i.child)}function Ip(t,i,o,l,f){if(Jn(o)){var p=!0;pl(i)}else p=!1;if(To(i,f),i.stateNode===null)Dl(t,i),Sp(i,o,l),zu(i,o,l,f),l=!0;else if(t===null){var M=i.stateNode,D=i.memoizedProps;M.props=D;var O=M.context,re=o.contextType;typeof re=="object"&&re!==null?re=Mi(re):(re=Jn(o)?Cs:Un.current,re=xo(i,re));var Ee=o.getDerivedStateFromProps,Ae=typeof Ee=="function"||typeof M.getSnapshotBeforeUpdate=="function";Ae||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(D!==l||O!==re)&&Mp(i,M,l,re),Kr=!1;var Me=i.memoizedState;M.state=Me,El(i,l,M,f),O=i.memoizedState,D!==l||Me!==O||Qn.current||Kr?(typeof Ee=="function"&&(Ou(i,o,Ee,l),O=i.memoizedState),(D=Kr||yp(i,o,D,l,Me,O,re))?(Ae||typeof M.UNSAFE_componentWillMount!="function"&&typeof M.componentWillMount!="function"||(typeof M.componentWillMount=="function"&&M.componentWillMount(),typeof M.UNSAFE_componentWillMount=="function"&&M.UNSAFE_componentWillMount()),typeof M.componentDidMount=="function"&&(i.flags|=4194308)):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=l,i.memoizedState=O),M.props=l,M.state=O,M.context=re,l=D):(typeof M.componentDidMount=="function"&&(i.flags|=4194308),l=!1)}else{M=i.stateNode,Yh(t,i),D=i.memoizedProps,re=i.type===i.elementType?D:ki(i.type,D),M.props=re,Ae=i.pendingProps,Me=M.context,O=o.contextType,typeof O=="object"&&O!==null?O=Mi(O):(O=Jn(o)?Cs:Un.current,O=xo(i,O));var Oe=o.getDerivedStateFromProps;(Ee=typeof Oe=="function"||typeof M.getSnapshotBeforeUpdate=="function")||typeof M.UNSAFE_componentWillReceiveProps!="function"&&typeof M.componentWillReceiveProps!="function"||(D!==Ae||Me!==O)&&Mp(i,M,l,O),Kr=!1,Me=i.memoizedState,M.state=Me,El(i,l,M,f);var We=i.memoizedState;D!==Ae||Me!==We||Qn.current||Kr?(typeof Oe=="function"&&(Ou(i,o,Oe,l),We=i.memoizedState),(re=Kr||yp(i,o,re,l,Me,We,O)||!1)?(Ee||typeof M.UNSAFE_componentWillUpdate!="function"&&typeof M.componentWillUpdate!="function"||(typeof M.componentWillUpdate=="function"&&M.componentWillUpdate(l,We,O),typeof M.UNSAFE_componentWillUpdate=="function"&&M.UNSAFE_componentWillUpdate(l,We,O)),typeof M.componentDidUpdate=="function"&&(i.flags|=4),typeof M.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof M.componentDidUpdate!="function"||D===t.memoizedProps&&Me===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||D===t.memoizedProps&&Me===t.memoizedState||(i.flags|=1024),i.memoizedProps=l,i.memoizedState=We),M.props=l,M.state=We,M.context=O,l=re):(typeof M.componentDidUpdate!="function"||D===t.memoizedProps&&Me===t.memoizedState||(i.flags|=4),typeof M.getSnapshotBeforeUpdate!="function"||D===t.memoizedProps&&Me===t.memoizedState||(i.flags|=1024),l=!1)}return Vu(t,i,o,l,p,f)}function Vu(t,i,o,l,f,p){Dp(t,i);var M=(i.flags&128)!==0;if(!l&&!M)return f&&zh(i,o,!1),Er(t,i,p);l=i.stateNode,ov.current=i;var D=M&&typeof o.getDerivedStateFromError!="function"?null:l.render();return i.flags|=1,t!==null&&M?(i.child=Eo(i,t.child,null,p),i.child=Eo(i,null,D,p)):Wn(t,i,D,p),i.memoizedState=l.state,f&&zh(i,o,!0),i.child}function Up(t){var i=t.stateNode;i.pendingContext?Fh(t,i.pendingContext,i.pendingContext!==i.context):i.context&&Fh(t,i.context,!1),Tu(t,i.containerInfo)}function Np(t,i,o,l,f){return Mo(),_u(f),i.flags|=256,Wn(t,i,o,l),i.child}var Gu={dehydrated:null,treeContext:null,retryLane:0};function Wu(t){return{baseLanes:t,cachePool:null,transitions:null}}function Fp(t,i,o){var l=i.pendingProps,f=Qt.current,p=!1,M=(i.flags&128)!==0,D;if((D=M)||(D=t!==null&&t.memoizedState===null?!1:(f&2)!==0),D?(p=!0,i.flags&=-129):(t===null||t.memoizedState!==null)&&(f|=1),Gt(Qt,f&1),t===null)return vu(i),t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?((i.mode&1)===0?i.lanes=1:t.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(M=l.children,t=l.fallback,p?(l=i.mode,p=i.child,M={mode:"hidden",children:M},(l&1)===0&&p!==null?(p.childLanes=0,p.pendingProps=M):p=Wl(M,l,0,null),t=Os(t,l,o,null),p.return=i,t.return=i,p.sibling=t,i.child=p,i.child.memoizedState=Wu(o),i.memoizedState=Gu,t):Xu(i,M));if(f=t.memoizedState,f!==null&&(D=f.dehydrated,D!==null))return av(t,i,M,l,D,f,o);if(p){p=l.fallback,M=i.mode,f=t.child,D=f.sibling;var O={mode:"hidden",children:l.children};return(M&1)===0&&i.child!==f?(l=i.child,l.childLanes=0,l.pendingProps=O,i.deletions=null):(l=is(f,O),l.subtreeFlags=f.subtreeFlags&14680064),D!==null?p=is(D,p):(p=Os(p,M,o,null),p.flags|=2),p.return=i,l.return=i,l.sibling=p,i.child=l,l=p,p=i.child,M=t.child.memoizedState,M=M===null?Wu(o):{baseLanes:M.baseLanes|o,cachePool:null,transitions:M.transitions},p.memoizedState=M,p.childLanes=t.childLanes&~o,i.memoizedState=Gu,l}return p=t.child,t=p.sibling,l=is(p,{mode:"visible",children:l.children}),(i.mode&1)===0&&(l.lanes=o),l.return=i,l.sibling=null,t!==null&&(o=i.deletions,o===null?(i.deletions=[t],i.flags|=16):o.push(t)),i.child=l,i.memoizedState=null,l}function Xu(t,i){return i=Wl({mode:"visible",children:i},t.mode,0,null),i.return=t,t.child=i}function Ll(t,i,o,l){return l!==null&&_u(l),Eo(i,t.child,null,o),t=Xu(i,i.pendingProps.children),t.flags|=2,i.memoizedState=null,t}function av(t,i,o,l,f,p,M){if(o)return i.flags&256?(i.flags&=-257,l=Bu(Error(n(422))),Ll(t,i,M,l)):i.memoizedState!==null?(i.child=t.child,i.flags|=128,null):(p=l.fallback,f=i.mode,l=Wl({mode:"visible",children:l.children},f,0,null),p=Os(p,f,M,null),p.flags|=2,l.return=i,p.return=i,l.sibling=p,i.child=l,(i.mode&1)!==0&&Eo(i,t.child,null,M),i.child.memoizedState=Wu(M),i.memoizedState=Gu,p);if((i.mode&1)===0)return Ll(t,i,M,null);if(f.data==="$!"){if(l=f.nextSibling&&f.nextSibling.dataset,l)var D=l.dgst;return l=D,p=Error(n(419)),l=Bu(p,l,void 0),Ll(t,i,M,l)}if(D=(M&t.childLanes)!==0,ei||D){if(l=En,l!==null){switch(M&-M){case 4:f=2;break;case 16:f=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:f=32;break;case 536870912:f=268435456;break;default:f=0}f=(f&(l.suspendedLanes|M))!==0?0:f,f!==0&&f!==p.retryLane&&(p.retryLane=f,Sr(t,f),Gi(l,t,f,-1))}return lf(),l=Bu(Error(n(421))),Ll(t,i,M,l)}return f.data==="$?"?(i.flags|=128,i.child=t.child,i=yv.bind(null,t),f._reactRetry=i,null):(t=p.treeContext,ui=jr(f.nextSibling),ci=i,Kt=!0,Bi=null,t!==null&&(yi[Si++]=xr,yi[Si++]=yr,yi[Si++]=Rs,xr=t.id,yr=t.overflow,Rs=i),i=Xu(i,l.children),i.flags|=4096,i)}function Op(t,i,o){t.lanes|=i;var l=t.alternate;l!==null&&(l.lanes|=i),Mu(t.return,i,o)}function ju(t,i,o,l,f){var p=t.memoizedState;p===null?t.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:l,tail:o,tailMode:f}:(p.isBackwards=i,p.rendering=null,p.renderingStartTime=0,p.last=l,p.tail=o,p.tailMode=f)}function zp(t,i,o){var l=i.pendingProps,f=l.revealOrder,p=l.tail;if(Wn(t,i,l.children,o),l=Qt.current,(l&2)!==0)l=l&1|2,i.flags|=128;else{if(t!==null&&(t.flags&128)!==0)e:for(t=i.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Op(t,o,i);else if(t.tag===19)Op(t,o,i);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===i)break e;for(;t.sibling===null;){if(t.return===null||t.return===i)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}l&=1}if(Gt(Qt,l),(i.mode&1)===0)i.memoizedState=null;else switch(f){case"forwards":for(o=i.child,f=null;o!==null;)t=o.alternate,t!==null&&wl(t)===null&&(f=o),o=o.sibling;o=f,o===null?(f=i.child,i.child=null):(f=o.sibling,o.sibling=null),ju(i,!1,f,o,p);break;case"backwards":for(o=null,f=i.child,i.child=null;f!==null;){if(t=f.alternate,t!==null&&wl(t)===null){i.child=f;break}t=f.sibling,f.sibling=o,o=f,f=t}ju(i,!0,o,null,p);break;case"together":ju(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Dl(t,i){(i.mode&1)===0&&t!==null&&(t.alternate=null,i.alternate=null,i.flags|=2)}function Er(t,i,o){if(t!==null&&(i.dependencies=t.dependencies),Is|=i.lanes,(o&i.childLanes)===0)return null;if(t!==null&&i.child!==t.child)throw Error(n(153));if(i.child!==null){for(t=i.child,o=is(t,t.pendingProps),i.child=o,o.return=i;t.sibling!==null;)t=t.sibling,o=o.sibling=is(t,t.pendingProps),o.return=i;o.sibling=null}return i.child}function lv(t,i,o){switch(i.tag){case 3:Up(i),Mo();break;case 5:Qh(i);break;case 1:Jn(i.type)&&pl(i);break;case 4:Tu(i,i.stateNode.containerInfo);break;case 10:var l=i.type._context,f=i.memoizedProps.value;Gt(yl,l._currentValue),l._currentValue=f;break;case 13:if(l=i.memoizedState,l!==null)return l.dehydrated!==null?(Gt(Qt,Qt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?Fp(t,i,o):(Gt(Qt,Qt.current&1),t=Er(t,i,o),t!==null?t.sibling:null);Gt(Qt,Qt.current&1);break;case 19:if(l=(o&i.childLanes)!==0,(t.flags&128)!==0){if(l)return zp(t,i,o);i.flags|=128}if(f=i.memoizedState,f!==null&&(f.rendering=null,f.tail=null,f.lastEffect=null),Gt(Qt,Qt.current),l)break;return null;case 22:case 23:return i.lanes=0,Lp(t,i,o)}return Er(t,i,o)}var Bp,$u,kp,Hp;Bp=function(t,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)t.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},$u=function(){},kp=function(t,i,o,l){var f=t.memoizedProps;if(f!==l){t=i.stateNode,Ls(nr.current);var p=null;switch(o){case"input":f=B(t,f),l=B(t,l),p=[];break;case"select":f=oe({},f,{value:void 0}),l=oe({},l,{value:void 0}),p=[];break;case"textarea":f=T(t,f),l=T(t,l),p=[];break;default:typeof f.onClick!="function"&&typeof l.onClick=="function"&&(t.onclick=fl)}ht(o,l);var M;o=null;for(re in f)if(!l.hasOwnProperty(re)&&f.hasOwnProperty(re)&&f[re]!=null)if(re==="style"){var D=f[re];for(M in D)D.hasOwnProperty(M)&&(o||(o={}),o[M]="")}else re!=="dangerouslySetInnerHTML"&&re!=="children"&&re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&re!=="autoFocus"&&(a.hasOwnProperty(re)?p||(p=[]):(p=p||[]).push(re,null));for(re in l){var O=l[re];if(D=f!=null?f[re]:void 0,l.hasOwnProperty(re)&&O!==D&&(O!=null||D!=null))if(re==="style")if(D){for(M in D)!D.hasOwnProperty(M)||O&&O.hasOwnProperty(M)||(o||(o={}),o[M]="");for(M in O)O.hasOwnProperty(M)&&D[M]!==O[M]&&(o||(o={}),o[M]=O[M])}else o||(p||(p=[]),p.push(re,o)),o=O;else re==="dangerouslySetInnerHTML"?(O=O?O.__html:void 0,D=D?D.__html:void 0,O!=null&&D!==O&&(p=p||[]).push(re,O)):re==="children"?typeof O!="string"&&typeof O!="number"||(p=p||[]).push(re,""+O):re!=="suppressContentEditableWarning"&&re!=="suppressHydrationWarning"&&(a.hasOwnProperty(re)?(O!=null&&re==="onScroll"&&Wt("scroll",t),p||D===O||(p=[])):(p=p||[]).push(re,O))}o&&(p=p||[]).push("style",o);var re=p;(i.updateQueue=re)&&(i.flags|=4)}},Hp=function(t,i,o,l){o!==l&&(i.flags|=4)};function Da(t,i){if(!Kt)switch(t.tailMode){case"hidden":i=t.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?t.tail=null:o.sibling=null;break;case"collapsed":o=t.tail;for(var l=null;o!==null;)o.alternate!==null&&(l=o),o=o.sibling;l===null?i||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function Fn(t){var i=t.alternate!==null&&t.alternate.child===t.child,o=0,l=0;if(i)for(var f=t.child;f!==null;)o|=f.lanes|f.childLanes,l|=f.subtreeFlags&14680064,l|=f.flags&14680064,f.return=t,f=f.sibling;else for(f=t.child;f!==null;)o|=f.lanes|f.childLanes,l|=f.subtreeFlags,l|=f.flags,f.return=t,f=f.sibling;return t.subtreeFlags|=l,t.childLanes=o,i}function cv(t,i,o){var l=i.pendingProps;switch(mu(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Fn(i),null;case 1:return Jn(i.type)&&hl(),Fn(i),null;case 3:return l=i.stateNode,Ao(),Xt(Qn),Xt(Un),Ru(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(_l(i)?i.flags|=4:t===null||t.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Bi!==null&&(sf(Bi),Bi=null))),$u(t,i),Fn(i),null;case 5:Au(i);var f=Ls(Ca.current);if(o=i.type,t!==null&&i.stateNode!=null)kp(t,i,o,l,f),t.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!l){if(i.stateNode===null)throw Error(n(166));return Fn(i),null}if(t=Ls(nr.current),_l(i)){l=i.stateNode,o=i.type;var p=i.memoizedProps;switch(l[tr]=i,l[Ma]=p,t=(i.mode&1)!==0,o){case"dialog":Wt("cancel",l),Wt("close",l);break;case"iframe":case"object":case"embed":Wt("load",l);break;case"video":case"audio":for(f=0;f<xa.length;f++)Wt(xa[f],l);break;case"source":Wt("error",l);break;case"img":case"image":case"link":Wt("error",l),Wt("load",l);break;case"details":Wt("toggle",l);break;case"input":Cn(l,p),Wt("invalid",l);break;case"select":l._wrapperState={wasMultiple:!!p.multiple},Wt("invalid",l);break;case"textarea":ee(l,p),Wt("invalid",l)}ht(o,p),f=null;for(var M in p)if(p.hasOwnProperty(M)){var D=p[M];M==="children"?typeof D=="string"?l.textContent!==D&&(p.suppressHydrationWarning!==!0&&ul(l.textContent,D,t),f=["children",D]):typeof D=="number"&&l.textContent!==""+D&&(p.suppressHydrationWarning!==!0&&ul(l.textContent,D,t),f=["children",""+D]):a.hasOwnProperty(M)&&D!=null&&M==="onScroll"&&Wt("scroll",l)}switch(o){case"input":bt(l),Ye(l,p,!0);break;case"textarea":bt(l),Se(l);break;case"select":case"option":break;default:typeof p.onClick=="function"&&(l.onclick=fl)}l=f,i.updateQueue=l,l!==null&&(i.flags|=4)}else{M=f.nodeType===9?f:f.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=ge(o)),t==="http://www.w3.org/1999/xhtml"?o==="script"?(t=M.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof l.is=="string"?t=M.createElement(o,{is:l.is}):(t=M.createElement(o),o==="select"&&(M=t,l.multiple?M.multiple=!0:l.size&&(M.size=l.size))):t=M.createElementNS(t,o),t[tr]=i,t[Ma]=l,Bp(t,i,!1,!1),i.stateNode=t;e:{switch(M=at(o,l),o){case"dialog":Wt("cancel",t),Wt("close",t),f=l;break;case"iframe":case"object":case"embed":Wt("load",t),f=l;break;case"video":case"audio":for(f=0;f<xa.length;f++)Wt(xa[f],t);f=l;break;case"source":Wt("error",t),f=l;break;case"img":case"image":case"link":Wt("error",t),Wt("load",t),f=l;break;case"details":Wt("toggle",t),f=l;break;case"input":Cn(t,l),f=B(t,l),Wt("invalid",t);break;case"option":f=l;break;case"select":t._wrapperState={wasMultiple:!!l.multiple},f=oe({},l,{value:void 0}),Wt("invalid",t);break;case"textarea":ee(t,l),f=T(t,l),Wt("invalid",t);break;default:f=l}ht(o,f),D=f;for(p in D)if(D.hasOwnProperty(p)){var O=D[p];p==="style"?rt(t,O):p==="dangerouslySetInnerHTML"?(O=O?O.__html:void 0,O!=null&&ze(t,O)):p==="children"?typeof O=="string"?(o!=="textarea"||O!=="")&&ct(t,O):typeof O=="number"&&ct(t,""+O):p!=="suppressContentEditableWarning"&&p!=="suppressHydrationWarning"&&p!=="autoFocus"&&(a.hasOwnProperty(p)?O!=null&&p==="onScroll"&&Wt("scroll",t):O!=null&&L(t,p,O,M))}switch(o){case"input":bt(t),Ye(t,l,!1);break;case"textarea":bt(t),Se(t);break;case"option":l.value!=null&&t.setAttribute("value",""+Le(l.value));break;case"select":t.multiple=!!l.multiple,p=l.value,p!=null?P(t,!!l.multiple,p,!1):l.defaultValue!=null&&P(t,!!l.multiple,l.defaultValue,!0);break;default:typeof f.onClick=="function"&&(t.onclick=fl)}switch(o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}}l&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Fn(i),null;case 6:if(t&&i.stateNode!=null)Hp(t,i,t.memoizedProps,l);else{if(typeof l!="string"&&i.stateNode===null)throw Error(n(166));if(o=Ls(Ca.current),Ls(nr.current),_l(i)){if(l=i.stateNode,o=i.memoizedProps,l[tr]=i,(p=l.nodeValue!==o)&&(t=ci,t!==null))switch(t.tag){case 3:ul(l.nodeValue,o,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ul(l.nodeValue,o,(t.mode&1)!==0)}p&&(i.flags|=4)}else l=(o.nodeType===9?o:o.ownerDocument).createTextNode(l),l[tr]=i,i.stateNode=l}return Fn(i),null;case 13:if(Xt(Qt),l=i.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Kt&&ui!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Wh(),Mo(),i.flags|=98560,p=!1;else if(p=_l(i),l!==null&&l.dehydrated!==null){if(t===null){if(!p)throw Error(n(318));if(p=i.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(n(317));p[tr]=i}else Mo(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Fn(i),p=!1}else Bi!==null&&(sf(Bi),Bi=null),p=!0;if(!p)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(l=l!==null,l!==(t!==null&&t.memoizedState!==null)&&l&&(i.child.flags|=8192,(i.mode&1)!==0&&(t===null||(Qt.current&1)!==0?vn===0&&(vn=3):lf())),i.updateQueue!==null&&(i.flags|=4),Fn(i),null);case 4:return Ao(),$u(t,i),t===null&&ya(i.stateNode.containerInfo),Fn(i),null;case 10:return Su(i.type._context),Fn(i),null;case 17:return Jn(i.type)&&hl(),Fn(i),null;case 19:if(Xt(Qt),p=i.memoizedState,p===null)return Fn(i),null;if(l=(i.flags&128)!==0,M=p.rendering,M===null)if(l)Da(p,!1);else{if(vn!==0||t!==null&&(t.flags&128)!==0)for(t=i.child;t!==null;){if(M=wl(t),M!==null){for(i.flags|=128,Da(p,!1),l=M.updateQueue,l!==null&&(i.updateQueue=l,i.flags|=4),i.subtreeFlags=0,l=o,o=i.child;o!==null;)p=o,t=l,p.flags&=14680066,M=p.alternate,M===null?(p.childLanes=0,p.lanes=t,p.child=null,p.subtreeFlags=0,p.memoizedProps=null,p.memoizedState=null,p.updateQueue=null,p.dependencies=null,p.stateNode=null):(p.childLanes=M.childLanes,p.lanes=M.lanes,p.child=M.child,p.subtreeFlags=0,p.deletions=null,p.memoizedProps=M.memoizedProps,p.memoizedState=M.memoizedState,p.updateQueue=M.updateQueue,p.type=M.type,t=M.dependencies,p.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),o=o.sibling;return Gt(Qt,Qt.current&1|2),i.child}t=t.sibling}p.tail!==null&&q()>Po&&(i.flags|=128,l=!0,Da(p,!1),i.lanes=4194304)}else{if(!l)if(t=wl(M),t!==null){if(i.flags|=128,l=!0,o=t.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Da(p,!0),p.tail===null&&p.tailMode==="hidden"&&!M.alternate&&!Kt)return Fn(i),null}else 2*q()-p.renderingStartTime>Po&&o!==1073741824&&(i.flags|=128,l=!0,Da(p,!1),i.lanes=4194304);p.isBackwards?(M.sibling=i.child,i.child=M):(o=p.last,o!==null?o.sibling=M:i.child=M,p.last=M)}return p.tail!==null?(i=p.tail,p.rendering=i,p.tail=i.sibling,p.renderingStartTime=q(),i.sibling=null,o=Qt.current,Gt(Qt,l?o&1|2:o&1),i):(Fn(i),null);case 22:case 23:return af(),l=i.memoizedState!==null,t!==null&&t.memoizedState!==null!==l&&(i.flags|=8192),l&&(i.mode&1)!==0?(fi&1073741824)!==0&&(Fn(i),i.subtreeFlags&6&&(i.flags|=8192)):Fn(i),null;case 24:return null;case 25:return null}throw Error(n(156,i.tag))}function uv(t,i){switch(mu(i),i.tag){case 1:return Jn(i.type)&&hl(),t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 3:return Ao(),Xt(Qn),Xt(Un),Ru(),t=i.flags,(t&65536)!==0&&(t&128)===0?(i.flags=t&-65537|128,i):null;case 5:return Au(i),null;case 13:if(Xt(Qt),t=i.memoizedState,t!==null&&t.dehydrated!==null){if(i.alternate===null)throw Error(n(340));Mo()}return t=i.flags,t&65536?(i.flags=t&-65537|128,i):null;case 19:return Xt(Qt),null;case 4:return Ao(),null;case 10:return Su(i.type._context),null;case 22:case 23:return af(),null;case 24:return null;default:return null}}var Il=!1,On=!1,fv=typeof WeakSet=="function"?WeakSet:Set,Ve=null;function Ro(t,i){var o=t.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(l){rn(t,i,l)}else o.current=null}function qu(t,i,o){try{o()}catch(l){rn(t,i,l)}}var Vp=!1;function dv(t,i){if(ou=Ut,t=yh(),Qc(t)){if("selectionStart"in t)var o={start:t.selectionStart,end:t.selectionEnd};else e:{o=(o=t.ownerDocument)&&o.defaultView||window;var l=o.getSelection&&o.getSelection();if(l&&l.rangeCount!==0){o=l.anchorNode;var f=l.anchorOffset,p=l.focusNode;l=l.focusOffset;try{o.nodeType,p.nodeType}catch{o=null;break e}var M=0,D=-1,O=-1,re=0,Ee=0,Ae=t,Me=null;t:for(;;){for(var Oe;Ae!==o||f!==0&&Ae.nodeType!==3||(D=M+f),Ae!==p||l!==0&&Ae.nodeType!==3||(O=M+l),Ae.nodeType===3&&(M+=Ae.nodeValue.length),(Oe=Ae.firstChild)!==null;)Me=Ae,Ae=Oe;for(;;){if(Ae===t)break t;if(Me===o&&++re===f&&(D=M),Me===p&&++Ee===l&&(O=M),(Oe=Ae.nextSibling)!==null)break;Ae=Me,Me=Ae.parentNode}Ae=Oe}o=D===-1||O===-1?null:{start:D,end:O}}else o=null}o=o||{start:0,end:0}}else o=null;for(au={focusedElem:t,selectionRange:o},Ut=!1,Ve=i;Ve!==null;)if(i=Ve,t=i.child,(i.subtreeFlags&1028)!==0&&t!==null)t.return=i,Ve=t;else for(;Ve!==null;){i=Ve;try{var We=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(We!==null){var $e=We.memoizedProps,an=We.memoizedState,K=i.stateNode,V=K.getSnapshotBeforeUpdate(i.elementType===i.type?$e:ki(i.type,$e),an);K.__reactInternalSnapshotBeforeUpdate=V}break;case 3:var J=i.stateNode.containerInfo;J.nodeType===1?J.textContent="":J.nodeType===9&&J.documentElement&&J.removeChild(J.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(n(163))}}catch(Re){rn(i,i.return,Re)}if(t=i.sibling,t!==null){t.return=i.return,Ve=t;break}Ve=i.return}return We=Vp,Vp=!1,We}function Ia(t,i,o){var l=i.updateQueue;if(l=l!==null?l.lastEffect:null,l!==null){var f=l=l.next;do{if((f.tag&t)===t){var p=f.destroy;f.destroy=void 0,p!==void 0&&qu(i,o,p)}f=f.next}while(f!==l)}}function Ul(t,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&t)===t){var l=o.create;o.destroy=l()}o=o.next}while(o!==i)}}function Yu(t){var i=t.ref;if(i!==null){var o=t.stateNode;switch(t.tag){case 5:t=o;break;default:t=o}typeof i=="function"?i(t):i.current=t}}function Gp(t){var i=t.alternate;i!==null&&(t.alternate=null,Gp(i)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(i=t.stateNode,i!==null&&(delete i[tr],delete i[Ma],delete i[fu],delete i[q0],delete i[Y0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Wp(t){return t.tag===5||t.tag===3||t.tag===4}function Xp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Wp(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ku(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(t,i):o.insertBefore(t,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(t,o)):(i=o,i.appendChild(t)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=fl));else if(l!==4&&(t=t.child,t!==null))for(Ku(t,i,o),t=t.sibling;t!==null;)Ku(t,i,o),t=t.sibling}function Zu(t,i,o){var l=t.tag;if(l===5||l===6)t=t.stateNode,i?o.insertBefore(t,i):o.appendChild(t);else if(l!==4&&(t=t.child,t!==null))for(Zu(t,i,o),t=t.sibling;t!==null;)Zu(t,i,o),t=t.sibling}var Ln=null,Hi=!1;function Qr(t,i,o){for(o=o.child;o!==null;)jp(t,i,o),o=o.sibling}function jp(t,i,o){if(Ge&&typeof Ge.onCommitFiberUnmount=="function")try{Ge.onCommitFiberUnmount(Je,o)}catch{}switch(o.tag){case 5:On||Ro(o,i);case 6:var l=Ln,f=Hi;Ln=null,Qr(t,i,o),Ln=l,Hi=f,Ln!==null&&(Hi?(t=Ln,o=o.stateNode,t.nodeType===8?t.parentNode.removeChild(o):t.removeChild(o)):Ln.removeChild(o.stateNode));break;case 18:Ln!==null&&(Hi?(t=Ln,o=o.stateNode,t.nodeType===8?uu(t.parentNode,o):t.nodeType===1&&uu(t,o),et(t)):uu(Ln,o.stateNode));break;case 4:l=Ln,f=Hi,Ln=o.stateNode.containerInfo,Hi=!0,Qr(t,i,o),Ln=l,Hi=f;break;case 0:case 11:case 14:case 15:if(!On&&(l=o.updateQueue,l!==null&&(l=l.lastEffect,l!==null))){f=l=l.next;do{var p=f,M=p.destroy;p=p.tag,M!==void 0&&((p&2)!==0||(p&4)!==0)&&qu(o,i,M),f=f.next}while(f!==l)}Qr(t,i,o);break;case 1:if(!On&&(Ro(o,i),l=o.stateNode,typeof l.componentWillUnmount=="function"))try{l.props=o.memoizedProps,l.state=o.memoizedState,l.componentWillUnmount()}catch(D){rn(o,i,D)}Qr(t,i,o);break;case 21:Qr(t,i,o);break;case 22:o.mode&1?(On=(l=On)||o.memoizedState!==null,Qr(t,i,o),On=l):Qr(t,i,o);break;default:Qr(t,i,o)}}function $p(t){var i=t.updateQueue;if(i!==null){t.updateQueue=null;var o=t.stateNode;o===null&&(o=t.stateNode=new fv),i.forEach(function(l){var f=Sv.bind(null,t,l);o.has(l)||(o.add(l),l.then(f,f))})}}function Vi(t,i){var o=i.deletions;if(o!==null)for(var l=0;l<o.length;l++){var f=o[l];try{var p=t,M=i,D=M;e:for(;D!==null;){switch(D.tag){case 5:Ln=D.stateNode,Hi=!1;break e;case 3:Ln=D.stateNode.containerInfo,Hi=!0;break e;case 4:Ln=D.stateNode.containerInfo,Hi=!0;break e}D=D.return}if(Ln===null)throw Error(n(160));jp(p,M,f),Ln=null,Hi=!1;var O=f.alternate;O!==null&&(O.return=null),f.return=null}catch(re){rn(f,i,re)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)qp(i,t),i=i.sibling}function qp(t,i){var o=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Vi(i,t),rr(t),l&4){try{Ia(3,t,t.return),Ul(3,t)}catch($e){rn(t,t.return,$e)}try{Ia(5,t,t.return)}catch($e){rn(t,t.return,$e)}}break;case 1:Vi(i,t),rr(t),l&512&&o!==null&&Ro(o,o.return);break;case 5:if(Vi(i,t),rr(t),l&512&&o!==null&&Ro(o,o.return),t.flags&32){var f=t.stateNode;try{ct(f,"")}catch($e){rn(t,t.return,$e)}}if(l&4&&(f=t.stateNode,f!=null)){var p=t.memoizedProps,M=o!==null?o.memoizedProps:p,D=t.type,O=t.updateQueue;if(t.updateQueue=null,O!==null)try{D==="input"&&p.type==="radio"&&p.name!=null&&mt(f,p),at(D,M);var re=at(D,p);for(M=0;M<O.length;M+=2){var Ee=O[M],Ae=O[M+1];Ee==="style"?rt(f,Ae):Ee==="dangerouslySetInnerHTML"?ze(f,Ae):Ee==="children"?ct(f,Ae):L(f,Ee,Ae,re)}switch(D){case"input":dt(f,p);break;case"textarea":_e(f,p);break;case"select":var Me=f._wrapperState.wasMultiple;f._wrapperState.wasMultiple=!!p.multiple;var Oe=p.value;Oe!=null?P(f,!!p.multiple,Oe,!1):Me!==!!p.multiple&&(p.defaultValue!=null?P(f,!!p.multiple,p.defaultValue,!0):P(f,!!p.multiple,p.multiple?[]:"",!1))}f[Ma]=p}catch($e){rn(t,t.return,$e)}}break;case 6:if(Vi(i,t),rr(t),l&4){if(t.stateNode===null)throw Error(n(162));f=t.stateNode,p=t.memoizedProps;try{f.nodeValue=p}catch($e){rn(t,t.return,$e)}}break;case 3:if(Vi(i,t),rr(t),l&4&&o!==null&&o.memoizedState.isDehydrated)try{et(i.containerInfo)}catch($e){rn(t,t.return,$e)}break;case 4:Vi(i,t),rr(t);break;case 13:Vi(i,t),rr(t),f=t.child,f.flags&8192&&(p=f.memoizedState!==null,f.stateNode.isHidden=p,!p||f.alternate!==null&&f.alternate.memoizedState!==null||(ef=q())),l&4&&$p(t);break;case 22:if(Ee=o!==null&&o.memoizedState!==null,t.mode&1?(On=(re=On)||Ee,Vi(i,t),On=re):Vi(i,t),rr(t),l&8192){if(re=t.memoizedState!==null,(t.stateNode.isHidden=re)&&!Ee&&(t.mode&1)!==0)for(Ve=t,Ee=t.child;Ee!==null;){for(Ae=Ve=Ee;Ve!==null;){switch(Me=Ve,Oe=Me.child,Me.tag){case 0:case 11:case 14:case 15:Ia(4,Me,Me.return);break;case 1:Ro(Me,Me.return);var We=Me.stateNode;if(typeof We.componentWillUnmount=="function"){l=Me,o=Me.return;try{i=l,We.props=i.memoizedProps,We.state=i.memoizedState,We.componentWillUnmount()}catch($e){rn(l,o,$e)}}break;case 5:Ro(Me,Me.return);break;case 22:if(Me.memoizedState!==null){Zp(Ae);continue}}Oe!==null?(Oe.return=Me,Ve=Oe):Zp(Ae)}Ee=Ee.sibling}e:for(Ee=null,Ae=t;;){if(Ae.tag===5){if(Ee===null){Ee=Ae;try{f=Ae.stateNode,re?(p=f.style,typeof p.setProperty=="function"?p.setProperty("display","none","important"):p.display="none"):(D=Ae.stateNode,O=Ae.memoizedProps.style,M=O!=null&&O.hasOwnProperty("display")?O.display:null,D.style.display=Qe("display",M))}catch($e){rn(t,t.return,$e)}}}else if(Ae.tag===6){if(Ee===null)try{Ae.stateNode.nodeValue=re?"":Ae.memoizedProps}catch($e){rn(t,t.return,$e)}}else if((Ae.tag!==22&&Ae.tag!==23||Ae.memoizedState===null||Ae===t)&&Ae.child!==null){Ae.child.return=Ae,Ae=Ae.child;continue}if(Ae===t)break e;for(;Ae.sibling===null;){if(Ae.return===null||Ae.return===t)break e;Ee===Ae&&(Ee=null),Ae=Ae.return}Ee===Ae&&(Ee=null),Ae.sibling.return=Ae.return,Ae=Ae.sibling}}break;case 19:Vi(i,t),rr(t),l&4&&$p(t);break;case 21:break;default:Vi(i,t),rr(t)}}function rr(t){var i=t.flags;if(i&2){try{e:{for(var o=t.return;o!==null;){if(Wp(o)){var l=o;break e}o=o.return}throw Error(n(160))}switch(l.tag){case 5:var f=l.stateNode;l.flags&32&&(ct(f,""),l.flags&=-33);var p=Xp(t);Zu(t,p,f);break;case 3:case 4:var M=l.stateNode.containerInfo,D=Xp(t);Ku(t,D,M);break;default:throw Error(n(161))}}catch(O){rn(t,t.return,O)}t.flags&=-3}i&4096&&(t.flags&=-4097)}function hv(t,i,o){Ve=t,Yp(t)}function Yp(t,i,o){for(var l=(t.mode&1)!==0;Ve!==null;){var f=Ve,p=f.child;if(f.tag===22&&l){var M=f.memoizedState!==null||Il;if(!M){var D=f.alternate,O=D!==null&&D.memoizedState!==null||On;D=Il;var re=On;if(Il=M,(On=O)&&!re)for(Ve=f;Ve!==null;)M=Ve,O=M.child,M.tag===22&&M.memoizedState!==null?Qp(f):O!==null?(O.return=M,Ve=O):Qp(f);for(;p!==null;)Ve=p,Yp(p),p=p.sibling;Ve=f,Il=D,On=re}Kp(t)}else(f.subtreeFlags&8772)!==0&&p!==null?(p.return=f,Ve=p):Kp(t)}}function Kp(t){for(;Ve!==null;){var i=Ve;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:On||Ul(5,i);break;case 1:var l=i.stateNode;if(i.flags&4&&!On)if(o===null)l.componentDidMount();else{var f=i.elementType===i.type?o.memoizedProps:ki(i.type,o.memoizedProps);l.componentDidUpdate(f,o.memoizedState,l.__reactInternalSnapshotBeforeUpdate)}var p=i.updateQueue;p!==null&&Zh(i,p,l);break;case 3:var M=i.updateQueue;if(M!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Zh(i,M,o)}break;case 5:var D=i.stateNode;if(o===null&&i.flags&4){o=D;var O=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":O.autoFocus&&o.focus();break;case"img":O.src&&(o.src=O.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var re=i.alternate;if(re!==null){var Ee=re.memoizedState;if(Ee!==null){var Ae=Ee.dehydrated;Ae!==null&&et(Ae)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(n(163))}On||i.flags&512&&Yu(i)}catch(Me){rn(i,i.return,Me)}}if(i===t){Ve=null;break}if(o=i.sibling,o!==null){o.return=i.return,Ve=o;break}Ve=i.return}}function Zp(t){for(;Ve!==null;){var i=Ve;if(i===t){Ve=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Ve=o;break}Ve=i.return}}function Qp(t){for(;Ve!==null;){var i=Ve;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{Ul(4,i)}catch(O){rn(i,o,O)}break;case 1:var l=i.stateNode;if(typeof l.componentDidMount=="function"){var f=i.return;try{l.componentDidMount()}catch(O){rn(i,f,O)}}var p=i.return;try{Yu(i)}catch(O){rn(i,p,O)}break;case 5:var M=i.return;try{Yu(i)}catch(O){rn(i,M,O)}}}catch(O){rn(i,i.return,O)}if(i===t){Ve=null;break}var D=i.sibling;if(D!==null){D.return=i.return,Ve=D;break}Ve=i.return}}var pv=Math.ceil,Nl=b.ReactCurrentDispatcher,Qu=b.ReactCurrentOwner,wi=b.ReactCurrentBatchConfig,Rt=0,En=null,cn=null,Dn=0,fi=0,bo=$r(0),vn=0,Ua=null,Is=0,Fl=0,Ju=0,Na=null,ti=null,ef=0,Po=1/0,wr=null,Ol=!1,tf=null,Jr=null,zl=!1,es=null,Bl=0,Fa=0,nf=null,kl=-1,Hl=0;function Xn(){return(Rt&6)!==0?q():kl!==-1?kl:kl=q()}function ts(t){return(t.mode&1)===0?1:(Rt&2)!==0&&Dn!==0?Dn&-Dn:Z0.transition!==null?(Hl===0&&(Hl=Ft()),Hl):(t=wt,t!==0||(t=window.event,t=t===void 0?16:pr(t.type)),t)}function Gi(t,i,o,l){if(50<Fa)throw Fa=0,nf=null,Error(n(185));on(t,o,l),((Rt&2)===0||t!==En)&&(t===En&&((Rt&2)===0&&(Fl|=o),vn===4&&ns(t,Dn)),ni(t,l),o===1&&Rt===0&&(i.mode&1)===0&&(Po=q()+500,ml&&Yr()))}function ni(t,i){var o=t.callbackNode;bn(t,i);var l=fn(t,t===En?Dn:0);if(l===0)o!==null&&A(o),t.callbackNode=null,t.callbackPriority=0;else if(i=l&-l,t.callbackPriority!==i){if(o!=null&&A(o),i===1)t.tag===0?K0(em.bind(null,t)):Bh(em.bind(null,t)),j0(function(){(Rt&6)===0&&Yr()}),o=null;else{switch(li(l)){case 1:o=Te;break;case 4:o=De;break;case 16:o=Ne;break;case 536870912:o=it;break;default:o=Ne}o=lm(o,Jp.bind(null,t))}t.callbackPriority=i,t.callbackNode=o}}function Jp(t,i){if(kl=-1,Hl=0,(Rt&6)!==0)throw Error(n(327));var o=t.callbackNode;if(Lo()&&t.callbackNode!==o)return null;var l=fn(t,t===En?Dn:0);if(l===0)return null;if((l&30)!==0||(l&t.expiredLanes)!==0||i)i=Vl(t,l);else{i=l;var f=Rt;Rt|=2;var p=nm();(En!==t||Dn!==i)&&(wr=null,Po=q()+500,Ns(t,i));do try{vv();break}catch(D){tm(t,D)}while(!0);yu(),Nl.current=p,Rt=f,cn!==null?i=0:(En=null,Dn=0,i=vn)}if(i!==0){if(i===2&&(f=Li(t),f!==0&&(l=f,i=rf(t,f))),i===1)throw o=Ua,Ns(t,0),ns(t,l),ni(t,q()),o;if(i===6)ns(t,l);else{if(f=t.current.alternate,(l&30)===0&&!mv(f)&&(i=Vl(t,l),i===2&&(p=Li(t),p!==0&&(l=p,i=rf(t,p))),i===1))throw o=Ua,Ns(t,0),ns(t,l),ni(t,q()),o;switch(t.finishedWork=f,t.finishedLanes=l,i){case 0:case 1:throw Error(n(345));case 2:Fs(t,ti,wr);break;case 3:if(ns(t,l),(l&130023424)===l&&(i=ef+500-q(),10<i)){if(fn(t,0)!==0)break;if(f=t.suspendedLanes,(f&l)!==l){Xn(),t.pingedLanes|=t.suspendedLanes&f;break}t.timeoutHandle=cu(Fs.bind(null,t,ti,wr),i);break}Fs(t,ti,wr);break;case 4:if(ns(t,l),(l&4194240)===l)break;for(i=t.eventTimes,f=-1;0<l;){var M=31-lt(l);p=1<<M,M=i[M],M>f&&(f=M),l&=~p}if(l=f,l=q()-l,l=(120>l?120:480>l?480:1080>l?1080:1920>l?1920:3e3>l?3e3:4320>l?4320:1960*pv(l/1960))-l,10<l){t.timeoutHandle=cu(Fs.bind(null,t,ti,wr),l);break}Fs(t,ti,wr);break;case 5:Fs(t,ti,wr);break;default:throw Error(n(329))}}}return ni(t,q()),t.callbackNode===o?Jp.bind(null,t):null}function rf(t,i){var o=Na;return t.current.memoizedState.isDehydrated&&(Ns(t,i).flags|=256),t=Vl(t,i),t!==2&&(i=ti,ti=o,i!==null&&sf(i)),t}function sf(t){ti===null?ti=t:ti.push.apply(ti,t)}function mv(t){for(var i=t;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var l=0;l<o.length;l++){var f=o[l],p=f.getSnapshot;f=f.value;try{if(!zi(p(),f))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===t)break;for(;i.sibling===null;){if(i.return===null||i.return===t)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function ns(t,i){for(i&=~Ju,i&=~Fl,t.suspendedLanes|=i,t.pingedLanes&=~i,t=t.expirationTimes;0<i;){var o=31-lt(i),l=1<<o;t[o]=-1,i&=~l}}function em(t){if((Rt&6)!==0)throw Error(n(327));Lo();var i=fn(t,0);if((i&1)===0)return ni(t,q()),null;var o=Vl(t,i);if(t.tag!==0&&o===2){var l=Li(t);l!==0&&(i=l,o=rf(t,l))}if(o===1)throw o=Ua,Ns(t,0),ns(t,i),ni(t,q()),o;if(o===6)throw Error(n(345));return t.finishedWork=t.current.alternate,t.finishedLanes=i,Fs(t,ti,wr),ni(t,q()),null}function of(t,i){var o=Rt;Rt|=1;try{return t(i)}finally{Rt=o,Rt===0&&(Po=q()+500,ml&&Yr())}}function Us(t){es!==null&&es.tag===0&&(Rt&6)===0&&Lo();var i=Rt;Rt|=1;var o=wi.transition,l=wt;try{if(wi.transition=null,wt=1,t)return t()}finally{wt=l,wi.transition=o,Rt=i,(Rt&6)===0&&Yr()}}function af(){fi=bo.current,Xt(bo)}function Ns(t,i){t.finishedWork=null,t.finishedLanes=0;var o=t.timeoutHandle;if(o!==-1&&(t.timeoutHandle=-1,X0(o)),cn!==null)for(o=cn.return;o!==null;){var l=o;switch(mu(l),l.tag){case 1:l=l.type.childContextTypes,l!=null&&hl();break;case 3:Ao(),Xt(Qn),Xt(Un),Ru();break;case 5:Au(l);break;case 4:Ao();break;case 13:Xt(Qt);break;case 19:Xt(Qt);break;case 10:Su(l.type._context);break;case 22:case 23:af()}o=o.return}if(En=t,cn=t=is(t.current,null),Dn=fi=i,vn=0,Ua=null,Ju=Fl=Is=0,ti=Na=null,Ps!==null){for(i=0;i<Ps.length;i++)if(o=Ps[i],l=o.interleaved,l!==null){o.interleaved=null;var f=l.next,p=o.pending;if(p!==null){var M=p.next;p.next=f,l.next=M}o.pending=l}Ps=null}return t}function tm(t,i){do{var o=cn;try{if(yu(),Tl.current=bl,Al){for(var l=Jt.memoizedState;l!==null;){var f=l.queue;f!==null&&(f.pending=null),l=l.next}Al=!1}if(Ds=0,Mn=gn=Jt=null,Ra=!1,ba=0,Qu.current=null,o===null||o.return===null){vn=1,Ua=i,cn=null;break}e:{var p=t,M=o.return,D=o,O=i;if(i=Dn,D.flags|=32768,O!==null&&typeof O=="object"&&typeof O.then=="function"){var re=O,Ee=D,Ae=Ee.tag;if((Ee.mode&1)===0&&(Ae===0||Ae===11||Ae===15)){var Me=Ee.alternate;Me?(Ee.updateQueue=Me.updateQueue,Ee.memoizedState=Me.memoizedState,Ee.lanes=Me.lanes):(Ee.updateQueue=null,Ee.memoizedState=null)}var Oe=Ap(M);if(Oe!==null){Oe.flags&=-257,Cp(Oe,M,D,p,i),Oe.mode&1&&Tp(p,re,i),i=Oe,O=re;var We=i.updateQueue;if(We===null){var $e=new Set;$e.add(O),i.updateQueue=$e}else We.add(O);break e}else{if((i&1)===0){Tp(p,re,i),lf();break e}O=Error(n(426))}}else if(Kt&&D.mode&1){var an=Ap(M);if(an!==null){(an.flags&65536)===0&&(an.flags|=256),Cp(an,M,D,p,i),_u(Co(O,D));break e}}p=O=Co(O,D),vn!==4&&(vn=2),Na===null?Na=[p]:Na.push(p),p=M;do{switch(p.tag){case 3:p.flags|=65536,i&=-i,p.lanes|=i;var K=Ep(p,O,i);Kh(p,K);break e;case 1:D=O;var V=p.type,J=p.stateNode;if((p.flags&128)===0&&(typeof V.getDerivedStateFromError=="function"||J!==null&&typeof J.componentDidCatch=="function"&&(Jr===null||!Jr.has(J)))){p.flags|=65536,i&=-i,p.lanes|=i;var Re=wp(p,D,i);Kh(p,Re);break e}}p=p.return}while(p!==null)}rm(o)}catch(qe){i=qe,cn===o&&o!==null&&(cn=o=o.return);continue}break}while(!0)}function nm(){var t=Nl.current;return Nl.current=bl,t===null?bl:t}function lf(){(vn===0||vn===3||vn===2)&&(vn=4),En===null||(Is&268435455)===0&&(Fl&268435455)===0||ns(En,Dn)}function Vl(t,i){var o=Rt;Rt|=2;var l=nm();(En!==t||Dn!==i)&&(wr=null,Ns(t,i));do try{gv();break}catch(f){tm(t,f)}while(!0);if(yu(),Rt=o,Nl.current=l,cn!==null)throw Error(n(261));return En=null,Dn=0,vn}function gv(){for(;cn!==null;)im(cn)}function vv(){for(;cn!==null&&!X();)im(cn)}function im(t){var i=am(t.alternate,t,fi);t.memoizedProps=t.pendingProps,i===null?rm(t):cn=i,Qu.current=null}function rm(t){var i=t;do{var o=i.alternate;if(t=i.return,(i.flags&32768)===0){if(o=cv(o,i,fi),o!==null){cn=o;return}}else{if(o=uv(o,i),o!==null){o.flags&=32767,cn=o;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{vn=6,cn=null;return}}if(i=i.sibling,i!==null){cn=i;return}cn=i=t}while(i!==null);vn===0&&(vn=5)}function Fs(t,i,o){var l=wt,f=wi.transition;try{wi.transition=null,wt=1,_v(t,i,o,l)}finally{wi.transition=f,wt=l}return null}function _v(t,i,o,l){do Lo();while(es!==null);if((Rt&6)!==0)throw Error(n(327));o=t.finishedWork;var f=t.finishedLanes;if(o===null)return null;if(t.finishedWork=null,t.finishedLanes=0,o===t.current)throw Error(n(177));t.callbackNode=null,t.callbackPriority=0;var p=o.lanes|o.childLanes;if(ln(t,p),t===En&&(cn=En=null,Dn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||zl||(zl=!0,lm(Ne,function(){return Lo(),null})),p=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||p){p=wi.transition,wi.transition=null;var M=wt;wt=1;var D=Rt;Rt|=4,Qu.current=null,dv(t,o),qp(o,t),z0(au),Ut=!!ou,au=ou=null,t.current=o,hv(o),ne(),Rt=D,wt=M,wi.transition=p}else t.current=o;if(zl&&(zl=!1,es=t,Bl=f),p=t.pendingLanes,p===0&&(Jr=null),xt(o.stateNode),ni(t,q()),i!==null)for(l=t.onRecoverableError,o=0;o<i.length;o++)f=i[o],l(f.value,{componentStack:f.stack,digest:f.digest});if(Ol)throw Ol=!1,t=tf,tf=null,t;return(Bl&1)!==0&&t.tag!==0&&Lo(),p=t.pendingLanes,(p&1)!==0?t===nf?Fa++:(Fa=0,nf=t):Fa=0,Yr(),null}function Lo(){if(es!==null){var t=li(Bl),i=wi.transition,o=wt;try{if(wi.transition=null,wt=16>t?16:t,es===null)var l=!1;else{if(t=es,es=null,Bl=0,(Rt&6)!==0)throw Error(n(331));var f=Rt;for(Rt|=4,Ve=t.current;Ve!==null;){var p=Ve,M=p.child;if((Ve.flags&16)!==0){var D=p.deletions;if(D!==null){for(var O=0;O<D.length;O++){var re=D[O];for(Ve=re;Ve!==null;){var Ee=Ve;switch(Ee.tag){case 0:case 11:case 15:Ia(8,Ee,p)}var Ae=Ee.child;if(Ae!==null)Ae.return=Ee,Ve=Ae;else for(;Ve!==null;){Ee=Ve;var Me=Ee.sibling,Oe=Ee.return;if(Gp(Ee),Ee===re){Ve=null;break}if(Me!==null){Me.return=Oe,Ve=Me;break}Ve=Oe}}}var We=p.alternate;if(We!==null){var $e=We.child;if($e!==null){We.child=null;do{var an=$e.sibling;$e.sibling=null,$e=an}while($e!==null)}}Ve=p}}if((p.subtreeFlags&2064)!==0&&M!==null)M.return=p,Ve=M;else e:for(;Ve!==null;){if(p=Ve,(p.flags&2048)!==0)switch(p.tag){case 0:case 11:case 15:Ia(9,p,p.return)}var K=p.sibling;if(K!==null){K.return=p.return,Ve=K;break e}Ve=p.return}}var V=t.current;for(Ve=V;Ve!==null;){M=Ve;var J=M.child;if((M.subtreeFlags&2064)!==0&&J!==null)J.return=M,Ve=J;else e:for(M=V;Ve!==null;){if(D=Ve,(D.flags&2048)!==0)try{switch(D.tag){case 0:case 11:case 15:Ul(9,D)}}catch(qe){rn(D,D.return,qe)}if(D===M){Ve=null;break e}var Re=D.sibling;if(Re!==null){Re.return=D.return,Ve=Re;break e}Ve=D.return}}if(Rt=f,Yr(),Ge&&typeof Ge.onPostCommitFiberRoot=="function")try{Ge.onPostCommitFiberRoot(Je,t)}catch{}l=!0}return l}finally{wt=o,wi.transition=i}}return!1}function sm(t,i,o){i=Co(o,i),i=Ep(t,i,1),t=Zr(t,i,1),i=Xn(),t!==null&&(on(t,1,i),ni(t,i))}function rn(t,i,o){if(t.tag===3)sm(t,t,o);else for(;i!==null;){if(i.tag===3){sm(i,t,o);break}else if(i.tag===1){var l=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Jr===null||!Jr.has(l))){t=Co(o,t),t=wp(i,t,1),i=Zr(i,t,1),t=Xn(),i!==null&&(on(i,1,t),ni(i,t));break}}i=i.return}}function xv(t,i,o){var l=t.pingCache;l!==null&&l.delete(i),i=Xn(),t.pingedLanes|=t.suspendedLanes&o,En===t&&(Dn&o)===o&&(vn===4||vn===3&&(Dn&130023424)===Dn&&500>q()-ef?Ns(t,0):Ju|=o),ni(t,i)}function om(t,i){i===0&&((t.mode&1)===0?i=1:(i=qt,qt<<=1,(qt&130023424)===0&&(qt=4194304)));var o=Xn();t=Sr(t,i),t!==null&&(on(t,i,o),ni(t,o))}function yv(t){var i=t.memoizedState,o=0;i!==null&&(o=i.retryLane),om(t,o)}function Sv(t,i){var o=0;switch(t.tag){case 13:var l=t.stateNode,f=t.memoizedState;f!==null&&(o=f.retryLane);break;case 19:l=t.stateNode;break;default:throw Error(n(314))}l!==null&&l.delete(i),om(t,o)}var am;am=function(t,i,o){if(t!==null)if(t.memoizedProps!==i.pendingProps||Qn.current)ei=!0;else{if((t.lanes&o)===0&&(i.flags&128)===0)return ei=!1,lv(t,i,o);ei=(t.flags&131072)!==0}else ei=!1,Kt&&(i.flags&1048576)!==0&&kh(i,vl,i.index);switch(i.lanes=0,i.tag){case 2:var l=i.type;Dl(t,i),t=i.pendingProps;var f=xo(i,Un.current);To(i,o),f=Lu(null,i,l,t,f,o);var p=Du();return i.flags|=1,typeof f=="object"&&f!==null&&typeof f.render=="function"&&f.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Jn(l)?(p=!0,pl(i)):p=!1,i.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,wu(i),f.updater=Pl,i.stateNode=f,f._reactInternals=i,zu(i,l,t,o),i=Vu(null,i,l,!0,p,o)):(i.tag=0,Kt&&p&&pu(i),Wn(null,i,f,o),i=i.child),i;case 16:l=i.elementType;e:{switch(Dl(t,i),t=i.pendingProps,f=l._init,l=f(l._payload),i.type=l,f=i.tag=Ev(l),t=ki(l,t),f){case 0:i=Hu(null,i,l,t,o);break e;case 1:i=Ip(null,i,l,t,o);break e;case 11:i=Rp(null,i,l,t,o);break e;case 14:i=bp(null,i,l,ki(l.type,t),o);break e}throw Error(n(306,l,""))}return i;case 0:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:ki(l,f),Hu(t,i,l,f,o);case 1:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:ki(l,f),Ip(t,i,l,f,o);case 3:e:{if(Up(i),t===null)throw Error(n(387));l=i.pendingProps,p=i.memoizedState,f=p.element,Yh(t,i),El(i,l,null,o);var M=i.memoizedState;if(l=M.element,p.isDehydrated)if(p={element:l,isDehydrated:!1,cache:M.cache,pendingSuspenseBoundaries:M.pendingSuspenseBoundaries,transitions:M.transitions},i.updateQueue.baseState=p,i.memoizedState=p,i.flags&256){f=Co(Error(n(423)),i),i=Np(t,i,l,o,f);break e}else if(l!==f){f=Co(Error(n(424)),i),i=Np(t,i,l,o,f);break e}else for(ui=jr(i.stateNode.containerInfo.firstChild),ci=i,Kt=!0,Bi=null,o=$h(i,null,l,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(Mo(),l===f){i=Er(t,i,o);break e}Wn(t,i,l,o)}i=i.child}return i;case 5:return Qh(i),t===null&&vu(i),l=i.type,f=i.pendingProps,p=t!==null?t.memoizedProps:null,M=f.children,lu(l,f)?M=null:p!==null&&lu(l,p)&&(i.flags|=32),Dp(t,i),Wn(t,i,M,o),i.child;case 6:return t===null&&vu(i),null;case 13:return Fp(t,i,o);case 4:return Tu(i,i.stateNode.containerInfo),l=i.pendingProps,t===null?i.child=Eo(i,null,l,o):Wn(t,i,l,o),i.child;case 11:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:ki(l,f),Rp(t,i,l,f,o);case 7:return Wn(t,i,i.pendingProps,o),i.child;case 8:return Wn(t,i,i.pendingProps.children,o),i.child;case 12:return Wn(t,i,i.pendingProps.children,o),i.child;case 10:e:{if(l=i.type._context,f=i.pendingProps,p=i.memoizedProps,M=f.value,Gt(yl,l._currentValue),l._currentValue=M,p!==null)if(zi(p.value,M)){if(p.children===f.children&&!Qn.current){i=Er(t,i,o);break e}}else for(p=i.child,p!==null&&(p.return=i);p!==null;){var D=p.dependencies;if(D!==null){M=p.child;for(var O=D.firstContext;O!==null;){if(O.context===l){if(p.tag===1){O=Mr(-1,o&-o),O.tag=2;var re=p.updateQueue;if(re!==null){re=re.shared;var Ee=re.pending;Ee===null?O.next=O:(O.next=Ee.next,Ee.next=O),re.pending=O}}p.lanes|=o,O=p.alternate,O!==null&&(O.lanes|=o),Mu(p.return,o,i),D.lanes|=o;break}O=O.next}}else if(p.tag===10)M=p.type===i.type?null:p.child;else if(p.tag===18){if(M=p.return,M===null)throw Error(n(341));M.lanes|=o,D=M.alternate,D!==null&&(D.lanes|=o),Mu(M,o,i),M=p.sibling}else M=p.child;if(M!==null)M.return=p;else for(M=p;M!==null;){if(M===i){M=null;break}if(p=M.sibling,p!==null){p.return=M.return,M=p;break}M=M.return}p=M}Wn(t,i,f.children,o),i=i.child}return i;case 9:return f=i.type,l=i.pendingProps.children,To(i,o),f=Mi(f),l=l(f),i.flags|=1,Wn(t,i,l,o),i.child;case 14:return l=i.type,f=ki(l,i.pendingProps),f=ki(l.type,f),bp(t,i,l,f,o);case 15:return Pp(t,i,i.type,i.pendingProps,o);case 17:return l=i.type,f=i.pendingProps,f=i.elementType===l?f:ki(l,f),Dl(t,i),i.tag=1,Jn(l)?(t=!0,pl(i)):t=!1,To(i,o),Sp(i,l,f),zu(i,l,f,o),Vu(null,i,l,!0,t,o);case 19:return zp(t,i,o);case 22:return Lp(t,i,o)}throw Error(n(156,i.tag))};function lm(t,i){return ro(t,i)}function Mv(t,i,o,l){this.tag=t,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ti(t,i,o,l){return new Mv(t,i,o,l)}function cf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Ev(t){if(typeof t=="function")return cf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===ie)return 11;if(t===me)return 14}return 2}function is(t,i){var o=t.alternate;return o===null?(o=Ti(t.tag,i,t.key,t.mode),o.elementType=t.elementType,o.type=t.type,o.stateNode=t.stateNode,o.alternate=t,t.alternate=o):(o.pendingProps=i,o.type=t.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=t.flags&14680064,o.childLanes=t.childLanes,o.lanes=t.lanes,o.child=t.child,o.memoizedProps=t.memoizedProps,o.memoizedState=t.memoizedState,o.updateQueue=t.updateQueue,i=t.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=t.sibling,o.index=t.index,o.ref=t.ref,o}function Gl(t,i,o,l,f,p){var M=2;if(l=t,typeof t=="function")cf(t)&&(M=1);else if(typeof t=="string")M=5;else e:switch(t){case N:return Os(o.children,f,p,i);case G:M=8,f|=8;break;case R:return t=Ti(12,o,i,f|2),t.elementType=R,t.lanes=p,t;case Z:return t=Ti(13,o,i,f),t.elementType=Z,t.lanes=p,t;case ue:return t=Ti(19,o,i,f),t.elementType=ue,t.lanes=p,t;case he:return Wl(o,f,p,i);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case C:M=10;break e;case z:M=9;break e;case ie:M=11;break e;case me:M=14;break e;case ae:M=16,l=null;break e}throw Error(n(130,t==null?t:typeof t,""))}return i=Ti(M,o,i,f),i.elementType=t,i.type=l,i.lanes=p,i}function Os(t,i,o,l){return t=Ti(7,t,l,i),t.lanes=o,t}function Wl(t,i,o,l){return t=Ti(22,t,l,i),t.elementType=he,t.lanes=o,t.stateNode={isHidden:!1},t}function uf(t,i,o){return t=Ti(6,t,null,i),t.lanes=o,t}function ff(t,i,o){return i=Ti(4,t.children!==null?t.children:[],t.key,i),i.lanes=o,i.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},i}function wv(t,i,o,l,f){this.tag=i,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=dn(0),this.expirationTimes=dn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=dn(0),this.identifierPrefix=l,this.onRecoverableError=f,this.mutableSourceEagerHydrationData=null}function df(t,i,o,l,f,p,M,D,O){return t=new wv(t,i,o,D,O),i===1?(i=1,p===!0&&(i|=8)):i=0,p=Ti(3,null,null,i),t.current=p,p.stateNode=t,p.memoizedState={element:l,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},wu(p),t}function Tv(t,i,o){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:F,key:l==null?null:""+l,children:t,containerInfo:i,implementation:o}}function cm(t){if(!t)return qr;t=t._reactInternals;e:{if(ai(t)!==t||t.tag!==1)throw Error(n(170));var i=t;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Jn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(n(171))}if(t.tag===1){var o=t.type;if(Jn(o))return Oh(t,o,i)}return i}function um(t,i,o,l,f,p,M,D,O){return t=df(o,l,!0,t,f,p,M,D,O),t.context=cm(null),o=t.current,l=Xn(),f=ts(o),p=Mr(l,f),p.callback=i??null,Zr(o,p,f),t.current.lanes=f,on(t,f,l),ni(t,l),t}function Xl(t,i,o,l){var f=i.current,p=Xn(),M=ts(f);return o=cm(o),i.context===null?i.context=o:i.pendingContext=o,i=Mr(p,M),i.payload={element:t},l=l===void 0?null:l,l!==null&&(i.callback=l),t=Zr(f,i,M),t!==null&&(Gi(t,f,M,p),Ml(t,f,M)),M}function jl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function fm(t,i){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var o=t.retryLane;t.retryLane=o!==0&&o<i?o:i}}function hf(t,i){fm(t,i),(t=t.alternate)&&fm(t,i)}function Av(){return null}var dm=typeof reportError=="function"?reportError:function(t){console.error(t)};function pf(t){this._internalRoot=t}$l.prototype.render=pf.prototype.render=function(t){var i=this._internalRoot;if(i===null)throw Error(n(409));Xl(t,i,null,null)},$l.prototype.unmount=pf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var i=t.containerInfo;Us(function(){Xl(null,t,null,null)}),i[vr]=null}};function $l(t){this._internalRoot=t}$l.prototype.unstable_scheduleHydration=function(t){if(t){var i=oo();t={blockedOn:null,target:t,priority:i};for(var o=0;o<Ni.length&&i!==0&&i<Ni[o].priority;o++);Ni.splice(o,0,t),o===0&&da(t)}};function mf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function ql(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function hm(){}function Cv(t,i,o,l,f){if(f){if(typeof l=="function"){var p=l;l=function(){var re=jl(M);p.call(re)}}var M=um(i,l,t,0,null,!1,!1,"",hm);return t._reactRootContainer=M,t[vr]=M.current,ya(t.nodeType===8?t.parentNode:t),Us(),M}for(;f=t.lastChild;)t.removeChild(f);if(typeof l=="function"){var D=l;l=function(){var re=jl(O);D.call(re)}}var O=df(t,0,!1,null,null,!1,!1,"",hm);return t._reactRootContainer=O,t[vr]=O.current,ya(t.nodeType===8?t.parentNode:t),Us(function(){Xl(i,O,o,l)}),O}function Yl(t,i,o,l,f){var p=o._reactRootContainer;if(p){var M=p;if(typeof f=="function"){var D=f;f=function(){var O=jl(M);D.call(O)}}Xl(i,M,t,f)}else M=Cv(o,i,t,f,l);return jl(M)}tl=function(t){switch(t.tag){case 3:var i=t.stateNode;if(i.current.memoizedState.isDehydrated){var o=vt(i.pendingLanes);o!==0&&(Yt(i,o|1),ni(i,q()),(Rt&6)===0&&(Po=q()+500,Yr()))}break;case 13:Us(function(){var l=Sr(t,1);if(l!==null){var f=Xn();Gi(l,t,1,f)}}),hf(t,1)}},so=function(t){if(t.tag===13){var i=Sr(t,134217728);if(i!==null){var o=Xn();Gi(i,t,134217728,o)}hf(t,134217728)}},fa=function(t){if(t.tag===13){var i=ts(t),o=Sr(t,i);if(o!==null){var l=Xn();Gi(o,t,i,l)}hf(t,i)}},oo=function(){return wt},Ss=function(t,i){var o=wt;try{return wt=t,i()}finally{wt=o}},Y=function(t,i,o){switch(i){case"input":if(dt(t,o),i=o.name,o.type==="radio"&&i!=null){for(o=t;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var l=o[i];if(l!==t&&l.form===t.form){var f=dl(l);if(!f)throw Error(n(90));gt(l),dt(l,f)}}}break;case"textarea":_e(t,o);break;case"select":i=o.value,i!=null&&P(t,!!o.multiple,i,!1)}},Bt=of,Ht=Us;var Rv={usingClientEntryPoint:!1,Events:[Ea,vo,dl,Pe,st,of]},Oa={findFiberByHostInstance:As,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},bv={bundleType:Oa.bundleType,version:Oa.version,rendererPackageName:Oa.rendererPackageName,rendererConfig:Oa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:b.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=ys(t),t===null?null:t.stateNode},findFiberByHostInstance:Oa.findFiberByHostInstance||Av,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Kl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Kl.isDisabled&&Kl.supportsFiber)try{Je=Kl.inject(bv),Ge=Kl}catch{}}return ii.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Rv,ii.createPortal=function(t,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!mf(i))throw Error(n(200));return Tv(t,i,null,o)},ii.createRoot=function(t,i){if(!mf(t))throw Error(n(299));var o=!1,l="",f=dm;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onRecoverableError!==void 0&&(f=i.onRecoverableError)),i=df(t,1,!1,null,null,o,!1,l,f),t[vr]=i.current,ya(t.nodeType===8?t.parentNode:t),new pf(i)},ii.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var i=t._reactInternals;if(i===void 0)throw typeof t.render=="function"?Error(n(188)):(t=Object.keys(t).join(","),Error(n(268,t)));return t=ys(i),t=t===null?null:t.stateNode,t},ii.flushSync=function(t){return Us(t)},ii.hydrate=function(t,i,o){if(!ql(i))throw Error(n(200));return Yl(null,t,i,!0,o)},ii.hydrateRoot=function(t,i,o){if(!mf(t))throw Error(n(405));var l=o!=null&&o.hydratedSources||null,f=!1,p="",M=dm;if(o!=null&&(o.unstable_strictMode===!0&&(f=!0),o.identifierPrefix!==void 0&&(p=o.identifierPrefix),o.onRecoverableError!==void 0&&(M=o.onRecoverableError)),i=um(i,null,t,1,o??null,f,!1,p,M),t[vr]=i.current,ya(t),l)for(t=0;t<l.length;t++)o=l[t],f=o._getVersion,f=f(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,f]:i.mutableSourceEagerHydrationData.push(o,f);return new $l(i)},ii.render=function(t,i,o){if(!ql(i))throw Error(n(200));return Yl(null,t,i,!1,o)},ii.unmountComponentAtNode=function(t){if(!ql(t))throw Error(n(40));return t._reactRootContainer?(Us(function(){Yl(null,null,t,!1,function(){t._reactRootContainer=null,t[vr]=null})}),!0):!1},ii.unstable_batchedUpdates=of,ii.unstable_renderSubtreeIntoContainer=function(t,i,o,l){if(!ql(o))throw Error(n(200));if(t==null||t._reactInternals===void 0)throw Error(n(38));return Yl(t,i,o,!1,l)},ii.version="18.3.1-next-f1338f8080-20240426",ii}var Sm;function zv(){if(Sm)return _f.exports;Sm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),_f.exports=Ov(),_f.exports}var Mm;function Bv(){if(Mm)return Zl;Mm=1;var s=zv();return Zl.createRoot=s.createRoot,Zl.hydrateRoot=s.hydrateRoot,Zl}var kv=Bv();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wd="172",Hv=0,Em=1,Vv=2,zg=1,Gv=2,Pr=3,vs=0,si=1,gi=2,ms=0,Ko=1,Uc=2,wm=3,Tm=4,Wv=5,$s=100,Xv=101,jv=102,$v=103,qv=104,Yv=200,Kv=201,Zv=202,Qv=203,ed=204,td=205,Jv=206,e_=207,t_=208,n_=209,i_=210,r_=211,s_=212,o_=213,a_=214,nd=0,id=1,rd=2,Jo=3,sd=4,od=5,ad=6,ld=7,Xd=0,l_=1,c_=2,gs=0,u_=1,f_=2,d_=3,h_=4,p_=5,m_=6,g_=7,Bg=300,ea=301,ta=302,cd=303,ud=304,Vc=306,fd=1e3,Ks=1001,dd=1002,Yi=1003,v_=1004,Ql=1005,lr=1006,Sf=1007,Zs=1008,Nr=1009,kg=1010,Hg=1011,Ya=1012,jd=1013,eo=1014,Dr=1015,Ka=1016,$d=1017,qd=1018,na=1020,Vg=35902,Gg=1021,Wg=1022,qi=1023,Xg=1024,jg=1025,Zo=1026,ia=1027,$g=1028,Yd=1029,qg=1030,Kd=1031,Zd=1033,Cc=33776,Rc=33777,bc=33778,Pc=33779,hd=35840,pd=35841,md=35842,gd=35843,vd=36196,_d=37492,xd=37496,yd=37808,Sd=37809,Md=37810,Ed=37811,wd=37812,Td=37813,Ad=37814,Cd=37815,Rd=37816,bd=37817,Pd=37818,Ld=37819,Dd=37820,Id=37821,Lc=36492,Ud=36494,Nd=36495,Yg=36283,Fd=36284,Od=36285,zd=36286,__=3200,x_=3201,Kg=0,y_=1,hs="",Ci="srgb",ra="srgb-linear",Nc="linear",kt="srgb",Do=7680,Am=519,S_=512,M_=513,E_=514,Zg=515,w_=516,T_=517,A_=518,C_=519,Cm=35044,Rm="300 es",Ir=2e3,Fc=2001;class aa{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(n)===-1&&r[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const c=a.indexOf(n);c!==-1&&a.splice(c,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let c=0,u=a.length;c<u;c++)a[c].call(this,e);e.target=null}}}const zn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dc=Math.PI/180,Bd=180/Math.PI;function Za(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(zn[s&255]+zn[s>>8&255]+zn[s>>16&255]+zn[s>>24&255]+"-"+zn[e&255]+zn[e>>8&255]+"-"+zn[e>>16&15|64]+zn[e>>24&255]+"-"+zn[n&63|128]+zn[n>>8&255]+"-"+zn[n>>16&255]+zn[n>>24&255]+zn[r&255]+zn[r>>8&255]+zn[r>>16&255]+zn[r>>24&255]).toLowerCase()}function Tt(s,e,n){return Math.max(e,Math.min(n,s))}function R_(s,e){return(s%e+e)%e}function Mf(s,e,n){return(1-n)*s+n*e}function Ba(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ri(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Ct{constructor(e=0,n=0){Ct.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,r=this.y,a=e.elements;return this.x=a[0]*n+a[3]*r+a[6],this.y=a[1]*n+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Tt(this.x,e.x,n.x),this.y=Tt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Tt(this.x,e,n),this.y=Tt(this.y,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Tt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Tt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y;return n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const r=Math.cos(n),a=Math.sin(n),c=this.x-e.x,u=this.y-e.y;return this.x=c*r-u*a+e.x,this.y=c*a+u*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ft{constructor(e,n,r,a,c,u,d,h,m){ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,r,a,c,u,d,h,m)}set(e,n,r,a,c,u,d,h,m){const g=this.elements;return g[0]=e,g[1]=a,g[2]=d,g[3]=n,g[4]=c,g[5]=h,g[6]=r,g[7]=u,g[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],this}extractBasis(e,n,r){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,c=this.elements,u=r[0],d=r[3],h=r[6],m=r[1],g=r[4],_=r[7],x=r[2],S=r[5],E=r[8],w=a[0],y=a[3],v=a[6],I=a[1],L=a[4],b=a[7],H=a[2],F=a[5],N=a[8];return c[0]=u*w+d*I+h*H,c[3]=u*y+d*L+h*F,c[6]=u*v+d*b+h*N,c[1]=m*w+g*I+_*H,c[4]=m*y+g*L+_*F,c[7]=m*v+g*b+_*N,c[2]=x*w+S*I+E*H,c[5]=x*y+S*L+E*F,c[8]=x*v+S*b+E*N,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[1],a=e[2],c=e[3],u=e[4],d=e[5],h=e[6],m=e[7],g=e[8];return n*u*g-n*d*m-r*c*g+r*d*h+a*c*m-a*u*h}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],c=e[3],u=e[4],d=e[5],h=e[6],m=e[7],g=e[8],_=g*u-d*m,x=d*h-g*c,S=m*c-u*h,E=n*_+r*x+a*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/E;return e[0]=_*w,e[1]=(a*m-g*r)*w,e[2]=(d*r-a*u)*w,e[3]=x*w,e[4]=(g*n-a*h)*w,e[5]=(a*c-d*n)*w,e[6]=S*w,e[7]=(r*h-m*n)*w,e[8]=(u*n-r*c)*w,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,r,a,c,u,d){const h=Math.cos(c),m=Math.sin(c);return this.set(r*h,r*m,-r*(h*u+m*d)+u+e,-a*m,a*h,-a*(-m*u+h*d)+d+n,0,0,1),this}scale(e,n){return this.premultiply(Ef.makeScale(e,n)),this}rotate(e){return this.premultiply(Ef.makeRotation(-e)),this}translate(e,n){return this.premultiply(Ef.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,r,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<9;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<9;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ef=new ft;function Qg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Oc(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function b_(){const s=Oc("canvas");return s.style.display="block",s}const bm={};function $o(s){s in bm||(bm[s]=!0,console.warn(s))}function P_(s,e,n){return new Promise(function(r,a){function c(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(c,n);break;default:r()}}setTimeout(c,n)})}function L_(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function D_(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Pm=new ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lm=new ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function I_(){const s={enabled:!0,workingColorSpace:ra,spaces:{},convert:function(a,c,u){return this.enabled===!1||c===u||!c||!u||(this.spaces[c].transfer===kt&&(a.r=Ur(a.r),a.g=Ur(a.g),a.b=Ur(a.b)),this.spaces[c].primaries!==this.spaces[u].primaries&&(a.applyMatrix3(this.spaces[c].toXYZ),a.applyMatrix3(this.spaces[u].fromXYZ)),this.spaces[u].transfer===kt&&(a.r=Qo(a.r),a.g=Qo(a.g),a.b=Qo(a.b))),a},fromWorkingColorSpace:function(a,c){return this.convert(a,this.workingColorSpace,c)},toWorkingColorSpace:function(a,c){return this.convert(a,c,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===hs?Nc:this.spaces[a].transfer},getLuminanceCoefficients:function(a,c=this.workingColorSpace){return a.fromArray(this.spaces[c].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,c,u){return a.copy(this.spaces[c].toXYZ).multiply(this.spaces[u].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[ra]:{primaries:e,whitePoint:r,transfer:Nc,toXYZ:Pm,fromXYZ:Lm,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ci},outputColorSpaceConfig:{drawingBufferColorSpace:Ci}},[Ci]:{primaries:e,whitePoint:r,transfer:kt,toXYZ:Pm,fromXYZ:Lm,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ci}}}),s}const Dt=I_();function Ur(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Qo(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Io;class U_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Io===void 0&&(Io=Oc("canvas")),Io.width=e.width,Io.height=e.height;const r=Io.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=Io}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Oc("canvas");n.width=e.width,n.height=e.height;const r=n.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),c=a.data;for(let u=0;u<c.length;u++)c[u]=Ur(c[u]/255)*255;return r.putImageData(a,0,0),n}else if(e.data){const n=e.data.slice(0);for(let r=0;r<n.length;r++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[r]=Math.floor(Ur(n[r]/255)*255):n[r]=Ur(n[r]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let N_=0;class Jg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=Za(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let c;if(Array.isArray(a)){c=[];for(let u=0,d=a.length;u<d;u++)a[u].isDataTexture?c.push(wf(a[u].image)):c.push(wf(a[u]))}else c=wf(a);r.url=c}return n||(e.images[this.uuid]=r),r}}function wf(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?U_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let F_=0;class oi extends aa{constructor(e=oi.DEFAULT_IMAGE,n=oi.DEFAULT_MAPPING,r=Ks,a=Ks,c=lr,u=Zs,d=qi,h=Nr,m=oi.DEFAULT_ANISOTROPY,g=hs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:F_++}),this.uuid=Za(),this.name="",this.source=new Jg(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=c,this.minFilter=u,this.anisotropy=m,this.format=d,this.internalFormat=null,this.type=h,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),n||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fd:e.x=e.x-Math.floor(e.x);break;case Ks:e.x=e.x<0?0:1;break;case dd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fd:e.y=e.y-Math.floor(e.y);break;case Ks:e.y=e.y<0?0:1;break;case dd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}oi.DEFAULT_IMAGE=null;oi.DEFAULT_MAPPING=Bg;oi.DEFAULT_ANISOTROPY=1;class sn{constructor(e=0,n=0,r=0,a=1){sn.prototype.isVector4=!0,this.x=e,this.y=n,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,r,a){return this.x=e,this.y=n,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,c=this.w,u=e.elements;return this.x=u[0]*n+u[4]*r+u[8]*a+u[12]*c,this.y=u[1]*n+u[5]*r+u[9]*a+u[13]*c,this.z=u[2]*n+u[6]*r+u[10]*a+u[14]*c,this.w=u[3]*n+u[7]*r+u[11]*a+u[15]*c,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,r,a,c;const h=e.elements,m=h[0],g=h[4],_=h[8],x=h[1],S=h[5],E=h[9],w=h[2],y=h[6],v=h[10];if(Math.abs(g-x)<.01&&Math.abs(_-w)<.01&&Math.abs(E-y)<.01){if(Math.abs(g+x)<.1&&Math.abs(_+w)<.1&&Math.abs(E+y)<.1&&Math.abs(m+S+v-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const L=(m+1)/2,b=(S+1)/2,H=(v+1)/2,F=(g+x)/4,N=(_+w)/4,G=(E+y)/4;return L>b&&L>H?L<.01?(r=0,a=.707106781,c=.707106781):(r=Math.sqrt(L),a=F/r,c=N/r):b>H?b<.01?(r=.707106781,a=0,c=.707106781):(a=Math.sqrt(b),r=F/a,c=G/a):H<.01?(r=.707106781,a=.707106781,c=0):(c=Math.sqrt(H),r=N/c,a=G/c),this.set(r,a,c,n),this}let I=Math.sqrt((y-E)*(y-E)+(_-w)*(_-w)+(x-g)*(x-g));return Math.abs(I)<.001&&(I=1),this.x=(y-E)/I,this.y=(_-w)/I,this.z=(x-g)/I,this.w=Math.acos((m+S+v-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Tt(this.x,e.x,n.x),this.y=Tt(this.y,e.y,n.y),this.z=Tt(this.z,e.z,n.z),this.w=Tt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Tt(this.x,e,n),this.y=Tt(this.y,e,n),this.z=Tt(this.z,e,n),this.w=Tt(this.w,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Tt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this.w=e.w+(n.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class O_ extends aa{constructor(e=1,n=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new sn(0,0,e,n),this.scissorTest=!1,this.viewport=new sn(0,0,e,n);const a={width:e,height:n,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:lr,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const c=new oi(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);c.flipY=!1,c.generateMipmaps=r.generateMipmaps,c.internalFormat=r.internalFormat,this.textures=[];const u=r.count;for(let d=0;d<u;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,r=1){if(this.width!==e||this.height!==n||this.depth!==r){this.width=e,this.height=n,this.depth=r;for(let a=0,c=this.textures.length;a<c;a++)this.textures[a].image.width=e,this.textures[a].image.height=n,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;const n=Object.assign({},e.texture.image);return this.texture.source=new Jg(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class to extends O_{constructor(e=1,n=1,r={}){super(e,n,r),this.isWebGLRenderTarget=!0}}class e0 extends oi{constructor(e=null,n=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=Yi,this.minFilter=Yi,this.wrapR=Ks,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class z_ extends oi{constructor(e=null,n=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:r,depth:a},this.magFilter=Yi,this.minFilter=Yi,this.wrapR=Ks,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qa{constructor(e=0,n=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=r,this._w=a}static slerpFlat(e,n,r,a,c,u,d){let h=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];const x=c[u+0],S=c[u+1],E=c[u+2],w=c[u+3];if(d===0){e[n+0]=h,e[n+1]=m,e[n+2]=g,e[n+3]=_;return}if(d===1){e[n+0]=x,e[n+1]=S,e[n+2]=E,e[n+3]=w;return}if(_!==w||h!==x||m!==S||g!==E){let y=1-d;const v=h*x+m*S+g*E+_*w,I=v>=0?1:-1,L=1-v*v;if(L>Number.EPSILON){const H=Math.sqrt(L),F=Math.atan2(H,v*I);y=Math.sin(y*F)/H,d=Math.sin(d*F)/H}const b=d*I;if(h=h*y+x*b,m=m*y+S*b,g=g*y+E*b,_=_*y+w*b,y===1-d){const H=1/Math.sqrt(h*h+m*m+g*g+_*_);h*=H,m*=H,g*=H,_*=H}}e[n]=h,e[n+1]=m,e[n+2]=g,e[n+3]=_}static multiplyQuaternionsFlat(e,n,r,a,c,u){const d=r[a],h=r[a+1],m=r[a+2],g=r[a+3],_=c[u],x=c[u+1],S=c[u+2],E=c[u+3];return e[n]=d*E+g*_+h*S-m*x,e[n+1]=h*E+g*x+m*_-d*S,e[n+2]=m*E+g*S+d*x-h*_,e[n+3]=g*E-d*_-h*x-m*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,r,a){return this._x=e,this._y=n,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const r=e._x,a=e._y,c=e._z,u=e._order,d=Math.cos,h=Math.sin,m=d(r/2),g=d(a/2),_=d(c/2),x=h(r/2),S=h(a/2),E=h(c/2);switch(u){case"XYZ":this._x=x*g*_+m*S*E,this._y=m*S*_-x*g*E,this._z=m*g*E+x*S*_,this._w=m*g*_-x*S*E;break;case"YXZ":this._x=x*g*_+m*S*E,this._y=m*S*_-x*g*E,this._z=m*g*E-x*S*_,this._w=m*g*_+x*S*E;break;case"ZXY":this._x=x*g*_-m*S*E,this._y=m*S*_+x*g*E,this._z=m*g*E+x*S*_,this._w=m*g*_-x*S*E;break;case"ZYX":this._x=x*g*_-m*S*E,this._y=m*S*_+x*g*E,this._z=m*g*E-x*S*_,this._w=m*g*_+x*S*E;break;case"YZX":this._x=x*g*_+m*S*E,this._y=m*S*_+x*g*E,this._z=m*g*E-x*S*_,this._w=m*g*_-x*S*E;break;case"XZY":this._x=x*g*_-m*S*E,this._y=m*S*_-x*g*E,this._z=m*g*E+x*S*_,this._w=m*g*_+x*S*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const r=n/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,r=n[0],a=n[4],c=n[8],u=n[1],d=n[5],h=n[9],m=n[2],g=n[6],_=n[10],x=r+d+_;if(x>0){const S=.5/Math.sqrt(x+1);this._w=.25/S,this._x=(g-h)*S,this._y=(c-m)*S,this._z=(u-a)*S}else if(r>d&&r>_){const S=2*Math.sqrt(1+r-d-_);this._w=(g-h)/S,this._x=.25*S,this._y=(a+u)/S,this._z=(c+m)/S}else if(d>_){const S=2*Math.sqrt(1+d-r-_);this._w=(c-m)/S,this._x=(a+u)/S,this._y=.25*S,this._z=(h+g)/S}else{const S=2*Math.sqrt(1+_-r-d);this._w=(u-a)/S,this._x=(c+m)/S,this._y=(h+g)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let r=e.dot(n)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Tt(this.dot(e),-1,1)))}rotateTowards(e,n){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,n/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const r=e._x,a=e._y,c=e._z,u=e._w,d=n._x,h=n._y,m=n._z,g=n._w;return this._x=r*g+u*d+a*m-c*h,this._y=a*g+u*h+c*d-r*m,this._z=c*g+u*m+r*h-a*d,this._w=u*g-r*d-a*h-c*m,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const r=this._x,a=this._y,c=this._z,u=this._w;let d=u*e._w+r*e._x+a*e._y+c*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=u,this._x=r,this._y=a,this._z=c,this;const h=1-d*d;if(h<=Number.EPSILON){const S=1-n;return this._w=S*u+n*this._w,this._x=S*r+n*this._x,this._y=S*a+n*this._y,this._z=S*c+n*this._z,this.normalize(),this}const m=Math.sqrt(h),g=Math.atan2(m,d),_=Math.sin((1-n)*g)/m,x=Math.sin(n*g)/m;return this._w=u*_+this._w*x,this._x=r*_+this._x*x,this._y=a*_+this._y*x,this._z=c*_+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,n,r){return this.copy(e).slerp(n,r)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),c=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),c*Math.sin(n),c*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,n=0,r=0){j.prototype.isVector3=!0,this.x=e,this.y=n,this.z=r}set(e,n,r){return r===void 0&&(r=this.z),this.x=e,this.y=n,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Dm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Dm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,r=this.y,a=this.z,c=e.elements;return this.x=c[0]*n+c[3]*r+c[6]*a,this.y=c[1]*n+c[4]*r+c[7]*a,this.z=c[2]*n+c[5]*r+c[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,r=this.y,a=this.z,c=e.elements,u=1/(c[3]*n+c[7]*r+c[11]*a+c[15]);return this.x=(c[0]*n+c[4]*r+c[8]*a+c[12])*u,this.y=(c[1]*n+c[5]*r+c[9]*a+c[13])*u,this.z=(c[2]*n+c[6]*r+c[10]*a+c[14])*u,this}applyQuaternion(e){const n=this.x,r=this.y,a=this.z,c=e.x,u=e.y,d=e.z,h=e.w,m=2*(u*a-d*r),g=2*(d*n-c*a),_=2*(c*r-u*n);return this.x=n+h*m+u*_-d*g,this.y=r+h*g+d*m-c*_,this.z=a+h*_+c*g-u*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,r=this.y,a=this.z,c=e.elements;return this.x=c[0]*n+c[4]*r+c[8]*a,this.y=c[1]*n+c[5]*r+c[9]*a,this.z=c[2]*n+c[6]*r+c[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Tt(this.x,e.x,n.x),this.y=Tt(this.y,e.y,n.y),this.z=Tt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Tt(this.x,e,n),this.y=Tt(this.y,e,n),this.z=Tt(this.z,e,n),this}clampLength(e,n){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Tt(r,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,r){return this.x=e.x+(n.x-e.x)*r,this.y=e.y+(n.y-e.y)*r,this.z=e.z+(n.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const r=e.x,a=e.y,c=e.z,u=n.x,d=n.y,h=n.z;return this.x=a*h-c*d,this.y=c*u-r*h,this.z=r*d-a*u,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const r=e.dot(this)/n;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Tf.copy(this).projectOnVector(e),this.sub(Tf)}reflect(e){return this.sub(Tf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const r=this.dot(e)/n;return Math.acos(Tt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return n*n+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,r){const a=Math.sin(n)*e;return this.x=a*Math.sin(r),this.y=Math.cos(n)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,r){return this.x=e*Math.sin(n),this.y=r,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=r,this.z=a,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,r=Math.sqrt(1-n*n);return this.x=r*Math.cos(e),this.y=n,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Tf=new j,Dm=new Qa;class Ja{constructor(e=new j(1/0,1/0,1/0),n=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n+=3)this.expandByPoint(Wi.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,r=e.count;n<r;n++)this.expandByPoint(Wi.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,r=e.length;n<r;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const r=Wi.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const c=r.getAttribute("position");if(n===!0&&c!==void 0&&e.isInstancedMesh!==!0)for(let u=0,d=c.count;u<d;u++)e.isMesh===!0?e.getVertexPosition(u,Wi):Wi.fromBufferAttribute(c,u),Wi.applyMatrix4(e.matrixWorld),this.expandByPoint(Wi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Jl.copy(r.boundingBox)),Jl.applyMatrix4(e.matrixWorld),this.union(Jl)}const a=e.children;for(let c=0,u=a.length;c<u;c++)this.expandByObject(a[c],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wi),Wi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,r;return e.normal.x>0?(n=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),n<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ka),ec.subVectors(this.max,ka),Uo.subVectors(e.a,ka),No.subVectors(e.b,ka),Fo.subVectors(e.c,ka),ss.subVectors(No,Uo),os.subVectors(Fo,No),zs.subVectors(Uo,Fo);let n=[0,-ss.z,ss.y,0,-os.z,os.y,0,-zs.z,zs.y,ss.z,0,-ss.x,os.z,0,-os.x,zs.z,0,-zs.x,-ss.y,ss.x,0,-os.y,os.x,0,-zs.y,zs.x,0];return!Af(n,Uo,No,Fo,ec)||(n=[1,0,0,0,1,0,0,0,1],!Af(n,Uo,No,Fo,ec))?!1:(tc.crossVectors(ss,os),n=[tc.x,tc.y,tc.z],Af(n,Uo,No,Fo,ec))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Tr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Tr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Tr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Tr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Tr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Tr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Tr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Tr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Tr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Tr=[new j,new j,new j,new j,new j,new j,new j,new j],Wi=new j,Jl=new Ja,Uo=new j,No=new j,Fo=new j,ss=new j,os=new j,zs=new j,ka=new j,ec=new j,tc=new j,Bs=new j;function Af(s,e,n,r,a){for(let c=0,u=s.length-3;c<=u;c+=3){Bs.fromArray(s,c);const d=a.x*Math.abs(Bs.x)+a.y*Math.abs(Bs.y)+a.z*Math.abs(Bs.z),h=e.dot(Bs),m=n.dot(Bs),g=r.dot(Bs);if(Math.max(-Math.max(h,m,g),Math.min(h,m,g))>d)return!1}return!0}const B_=new Ja,Ha=new j,Cf=new j;class el{constructor(e=new j,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const r=this.center;n!==void 0?r.copy(n):B_.setFromPoints(e).getCenter(r);let a=0;for(let c=0,u=e.length;c<u;c++)a=Math.max(a,r.distanceToSquared(e[c]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const r=this.center.distanceToSquared(e);return n.copy(e),r>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ha.subVectors(e,this.center);const n=Ha.lengthSq();if(n>this.radius*this.radius){const r=Math.sqrt(n),a=(r-this.radius)*.5;this.center.addScaledVector(Ha,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ha.copy(e.center).add(Cf)),this.expandByPoint(Ha.copy(e.center).sub(Cf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ar=new j,Rf=new j,nc=new j,as=new j,bf=new j,ic=new j,Pf=new j;class Gc{constructor(e=new j,n=new j(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ar)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const r=n.dot(this.direction);return r<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ar.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ar.copy(this.origin).addScaledVector(this.direction,n),Ar.distanceToSquared(e))}distanceSqToSegment(e,n,r,a){Rf.copy(e).add(n).multiplyScalar(.5),nc.copy(n).sub(e).normalize(),as.copy(this.origin).sub(Rf);const c=e.distanceTo(n)*.5,u=-this.direction.dot(nc),d=as.dot(this.direction),h=-as.dot(nc),m=as.lengthSq(),g=Math.abs(1-u*u);let _,x,S,E;if(g>0)if(_=u*h-d,x=u*d-h,E=c*g,_>=0)if(x>=-E)if(x<=E){const w=1/g;_*=w,x*=w,S=_*(_+u*x+2*d)+x*(u*_+x+2*h)+m}else x=c,_=Math.max(0,-(u*x+d)),S=-_*_+x*(x+2*h)+m;else x=-c,_=Math.max(0,-(u*x+d)),S=-_*_+x*(x+2*h)+m;else x<=-E?(_=Math.max(0,-(-u*c+d)),x=_>0?-c:Math.min(Math.max(-c,-h),c),S=-_*_+x*(x+2*h)+m):x<=E?(_=0,x=Math.min(Math.max(-c,-h),c),S=x*(x+2*h)+m):(_=Math.max(0,-(u*c+d)),x=_>0?c:Math.min(Math.max(-c,-h),c),S=-_*_+x*(x+2*h)+m);else x=u>0?-c:c,_=Math.max(0,-(u*x+d)),S=-_*_+x*(x+2*h)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,_),a&&a.copy(Rf).addScaledVector(nc,x),S}intersectSphere(e,n){Ar.subVectors(e.center,this.origin);const r=Ar.dot(this.direction),a=Ar.dot(Ar)-r*r,c=e.radius*e.radius;if(a>c)return null;const u=Math.sqrt(c-a),d=r-u,h=r+u;return h<0?null:d<0?this.at(h,n):this.at(d,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/n;return r>=0?r:null}intersectPlane(e,n){const r=this.distanceToPlane(e);return r===null?null:this.at(r,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let r,a,c,u,d,h;const m=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,x=this.origin;return m>=0?(r=(e.min.x-x.x)*m,a=(e.max.x-x.x)*m):(r=(e.max.x-x.x)*m,a=(e.min.x-x.x)*m),g>=0?(c=(e.min.y-x.y)*g,u=(e.max.y-x.y)*g):(c=(e.max.y-x.y)*g,u=(e.min.y-x.y)*g),r>u||c>a||((c>r||isNaN(r))&&(r=c),(u<a||isNaN(a))&&(a=u),_>=0?(d=(e.min.z-x.z)*_,h=(e.max.z-x.z)*_):(d=(e.max.z-x.z)*_,h=(e.min.z-x.z)*_),r>h||d>a)||((d>r||r!==r)&&(r=d),(h<a||a!==a)&&(a=h),a<0)?null:this.at(r>=0?r:a,n)}intersectsBox(e){return this.intersectBox(e,Ar)!==null}intersectTriangle(e,n,r,a,c){bf.subVectors(n,e),ic.subVectors(r,e),Pf.crossVectors(bf,ic);let u=this.direction.dot(Pf),d;if(u>0){if(a)return null;d=1}else if(u<0)d=-1,u=-u;else return null;as.subVectors(this.origin,e);const h=d*this.direction.dot(ic.crossVectors(as,ic));if(h<0)return null;const m=d*this.direction.dot(bf.cross(as));if(m<0||h+m>u)return null;const g=-d*as.dot(Pf);return g<0?null:this.at(g/u,c)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class jt{constructor(e,n,r,a,c,u,d,h,m,g,_,x,S,E,w,y){jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,r,a,c,u,d,h,m,g,_,x,S,E,w,y)}set(e,n,r,a,c,u,d,h,m,g,_,x,S,E,w,y){const v=this.elements;return v[0]=e,v[4]=n,v[8]=r,v[12]=a,v[1]=c,v[5]=u,v[9]=d,v[13]=h,v[2]=m,v[6]=g,v[10]=_,v[14]=x,v[3]=S,v[7]=E,v[11]=w,v[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new jt().fromArray(this.elements)}copy(e){const n=this.elements,r=e.elements;return n[0]=r[0],n[1]=r[1],n[2]=r[2],n[3]=r[3],n[4]=r[4],n[5]=r[5],n[6]=r[6],n[7]=r[7],n[8]=r[8],n[9]=r[9],n[10]=r[10],n[11]=r[11],n[12]=r[12],n[13]=r[13],n[14]=r[14],n[15]=r[15],this}copyPosition(e){const n=this.elements,r=e.elements;return n[12]=r[12],n[13]=r[13],n[14]=r[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,r){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,n,r){return this.set(e.x,n.x,r.x,0,e.y,n.y,r.y,0,e.z,n.z,r.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,r=e.elements,a=1/Oo.setFromMatrixColumn(e,0).length(),c=1/Oo.setFromMatrixColumn(e,1).length(),u=1/Oo.setFromMatrixColumn(e,2).length();return n[0]=r[0]*a,n[1]=r[1]*a,n[2]=r[2]*a,n[3]=0,n[4]=r[4]*c,n[5]=r[5]*c,n[6]=r[6]*c,n[7]=0,n[8]=r[8]*u,n[9]=r[9]*u,n[10]=r[10]*u,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,r=e.x,a=e.y,c=e.z,u=Math.cos(r),d=Math.sin(r),h=Math.cos(a),m=Math.sin(a),g=Math.cos(c),_=Math.sin(c);if(e.order==="XYZ"){const x=u*g,S=u*_,E=d*g,w=d*_;n[0]=h*g,n[4]=-h*_,n[8]=m,n[1]=S+E*m,n[5]=x-w*m,n[9]=-d*h,n[2]=w-x*m,n[6]=E+S*m,n[10]=u*h}else if(e.order==="YXZ"){const x=h*g,S=h*_,E=m*g,w=m*_;n[0]=x+w*d,n[4]=E*d-S,n[8]=u*m,n[1]=u*_,n[5]=u*g,n[9]=-d,n[2]=S*d-E,n[6]=w+x*d,n[10]=u*h}else if(e.order==="ZXY"){const x=h*g,S=h*_,E=m*g,w=m*_;n[0]=x-w*d,n[4]=-u*_,n[8]=E+S*d,n[1]=S+E*d,n[5]=u*g,n[9]=w-x*d,n[2]=-u*m,n[6]=d,n[10]=u*h}else if(e.order==="ZYX"){const x=u*g,S=u*_,E=d*g,w=d*_;n[0]=h*g,n[4]=E*m-S,n[8]=x*m+w,n[1]=h*_,n[5]=w*m+x,n[9]=S*m-E,n[2]=-m,n[6]=d*h,n[10]=u*h}else if(e.order==="YZX"){const x=u*h,S=u*m,E=d*h,w=d*m;n[0]=h*g,n[4]=w-x*_,n[8]=E*_+S,n[1]=_,n[5]=u*g,n[9]=-d*g,n[2]=-m*g,n[6]=S*_+E,n[10]=x-w*_}else if(e.order==="XZY"){const x=u*h,S=u*m,E=d*h,w=d*m;n[0]=h*g,n[4]=-_,n[8]=m*g,n[1]=x*_+w,n[5]=u*g,n[9]=S*_-E,n[2]=E*_-S,n[6]=d*g,n[10]=w*_+x}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(k_,e,H_)}lookAt(e,n,r){const a=this.elements;return di.subVectors(e,n),di.lengthSq()===0&&(di.z=1),di.normalize(),ls.crossVectors(r,di),ls.lengthSq()===0&&(Math.abs(r.z)===1?di.x+=1e-4:di.z+=1e-4,di.normalize(),ls.crossVectors(r,di)),ls.normalize(),rc.crossVectors(di,ls),a[0]=ls.x,a[4]=rc.x,a[8]=di.x,a[1]=ls.y,a[5]=rc.y,a[9]=di.y,a[2]=ls.z,a[6]=rc.z,a[10]=di.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const r=e.elements,a=n.elements,c=this.elements,u=r[0],d=r[4],h=r[8],m=r[12],g=r[1],_=r[5],x=r[9],S=r[13],E=r[2],w=r[6],y=r[10],v=r[14],I=r[3],L=r[7],b=r[11],H=r[15],F=a[0],N=a[4],G=a[8],R=a[12],C=a[1],z=a[5],ie=a[9],Z=a[13],ue=a[2],me=a[6],ae=a[10],he=a[14],k=a[3],de=a[7],oe=a[11],U=a[15];return c[0]=u*F+d*C+h*ue+m*k,c[4]=u*N+d*z+h*me+m*de,c[8]=u*G+d*ie+h*ae+m*oe,c[12]=u*R+d*Z+h*he+m*U,c[1]=g*F+_*C+x*ue+S*k,c[5]=g*N+_*z+x*me+S*de,c[9]=g*G+_*ie+x*ae+S*oe,c[13]=g*R+_*Z+x*he+S*U,c[2]=E*F+w*C+y*ue+v*k,c[6]=E*N+w*z+y*me+v*de,c[10]=E*G+w*ie+y*ae+v*oe,c[14]=E*R+w*Z+y*he+v*U,c[3]=I*F+L*C+b*ue+H*k,c[7]=I*N+L*z+b*me+H*de,c[11]=I*G+L*ie+b*ae+H*oe,c[15]=I*R+L*Z+b*he+H*U,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],r=e[4],a=e[8],c=e[12],u=e[1],d=e[5],h=e[9],m=e[13],g=e[2],_=e[6],x=e[10],S=e[14],E=e[3],w=e[7],y=e[11],v=e[15];return E*(+c*h*_-a*m*_-c*d*x+r*m*x+a*d*S-r*h*S)+w*(+n*h*S-n*m*x+c*u*x-a*u*S+a*m*g-c*h*g)+y*(+n*m*_-n*d*S-c*u*_+r*u*S+c*d*g-r*m*g)+v*(-a*d*g-n*h*_+n*d*x+a*u*_-r*u*x+r*h*g)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=n,a[14]=r),this}invert(){const e=this.elements,n=e[0],r=e[1],a=e[2],c=e[3],u=e[4],d=e[5],h=e[6],m=e[7],g=e[8],_=e[9],x=e[10],S=e[11],E=e[12],w=e[13],y=e[14],v=e[15],I=_*y*m-w*x*m+w*h*S-d*y*S-_*h*v+d*x*v,L=E*x*m-g*y*m-E*h*S+u*y*S+g*h*v-u*x*v,b=g*w*m-E*_*m+E*d*S-u*w*S-g*d*v+u*_*v,H=E*_*h-g*w*h-E*d*x+u*w*x+g*d*y-u*_*y,F=n*I+r*L+a*b+c*H;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/F;return e[0]=I*N,e[1]=(w*x*c-_*y*c-w*a*S+r*y*S+_*a*v-r*x*v)*N,e[2]=(d*y*c-w*h*c+w*a*m-r*y*m-d*a*v+r*h*v)*N,e[3]=(_*h*c-d*x*c-_*a*m+r*x*m+d*a*S-r*h*S)*N,e[4]=L*N,e[5]=(g*y*c-E*x*c+E*a*S-n*y*S-g*a*v+n*x*v)*N,e[6]=(E*h*c-u*y*c-E*a*m+n*y*m+u*a*v-n*h*v)*N,e[7]=(u*x*c-g*h*c+g*a*m-n*x*m-u*a*S+n*h*S)*N,e[8]=b*N,e[9]=(E*_*c-g*w*c-E*r*S+n*w*S+g*r*v-n*_*v)*N,e[10]=(u*w*c-E*d*c+E*r*m-n*w*m-u*r*v+n*d*v)*N,e[11]=(g*d*c-u*_*c-g*r*m+n*_*m+u*r*S-n*d*S)*N,e[12]=H*N,e[13]=(g*w*a-E*_*a+E*r*x-n*w*x-g*r*y+n*_*y)*N,e[14]=(E*d*a-u*w*a-E*r*h+n*w*h+u*r*y-n*d*y)*N,e[15]=(u*_*a-g*d*a+g*r*h-n*_*h-u*r*x+n*d*x)*N,this}scale(e){const n=this.elements,r=e.x,a=e.y,c=e.z;return n[0]*=r,n[4]*=a,n[8]*=c,n[1]*=r,n[5]*=a,n[9]*=c,n[2]*=r,n[6]*=a,n[10]*=c,n[3]*=r,n[7]*=a,n[11]*=c,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,r,a))}makeTranslation(e,n,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,r,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,n,-r,0,0,r,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,0,r,0,0,1,0,0,-r,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),r=Math.sin(e);return this.set(n,-r,0,0,r,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const r=Math.cos(n),a=Math.sin(n),c=1-r,u=e.x,d=e.y,h=e.z,m=c*u,g=c*d;return this.set(m*u+r,m*d-a*h,m*h+a*d,0,m*d+a*h,g*d+r,g*h-a*u,0,m*h-a*d,g*h+a*u,c*h*h+r,0,0,0,0,1),this}makeScale(e,n,r){return this.set(e,0,0,0,0,n,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,n,r,a,c,u){return this.set(1,r,c,0,e,1,u,0,n,a,1,0,0,0,0,1),this}compose(e,n,r){const a=this.elements,c=n._x,u=n._y,d=n._z,h=n._w,m=c+c,g=u+u,_=d+d,x=c*m,S=c*g,E=c*_,w=u*g,y=u*_,v=d*_,I=h*m,L=h*g,b=h*_,H=r.x,F=r.y,N=r.z;return a[0]=(1-(w+v))*H,a[1]=(S+b)*H,a[2]=(E-L)*H,a[3]=0,a[4]=(S-b)*F,a[5]=(1-(x+v))*F,a[6]=(y+I)*F,a[7]=0,a[8]=(E+L)*N,a[9]=(y-I)*N,a[10]=(1-(x+w))*N,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,n,r){const a=this.elements;let c=Oo.set(a[0],a[1],a[2]).length();const u=Oo.set(a[4],a[5],a[6]).length(),d=Oo.set(a[8],a[9],a[10]).length();this.determinant()<0&&(c=-c),e.x=a[12],e.y=a[13],e.z=a[14],Xi.copy(this);const m=1/c,g=1/u,_=1/d;return Xi.elements[0]*=m,Xi.elements[1]*=m,Xi.elements[2]*=m,Xi.elements[4]*=g,Xi.elements[5]*=g,Xi.elements[6]*=g,Xi.elements[8]*=_,Xi.elements[9]*=_,Xi.elements[10]*=_,n.setFromRotationMatrix(Xi),r.x=c,r.y=u,r.z=d,this}makePerspective(e,n,r,a,c,u,d=Ir){const h=this.elements,m=2*c/(n-e),g=2*c/(r-a),_=(n+e)/(n-e),x=(r+a)/(r-a);let S,E;if(d===Ir)S=-(u+c)/(u-c),E=-2*u*c/(u-c);else if(d===Fc)S=-u/(u-c),E=-u*c/(u-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return h[0]=m,h[4]=0,h[8]=_,h[12]=0,h[1]=0,h[5]=g,h[9]=x,h[13]=0,h[2]=0,h[6]=0,h[10]=S,h[14]=E,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,n,r,a,c,u,d=Ir){const h=this.elements,m=1/(n-e),g=1/(r-a),_=1/(u-c),x=(n+e)*m,S=(r+a)*g;let E,w;if(d===Ir)E=(u+c)*_,w=-2*_;else if(d===Fc)E=c*_,w=-1*_;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return h[0]=2*m,h[4]=0,h[8]=0,h[12]=-x,h[1]=0,h[5]=2*g,h[9]=0,h[13]=-S,h[2]=0,h[6]=0,h[10]=w,h[14]=-E,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const n=this.elements,r=e.elements;for(let a=0;a<16;a++)if(n[a]!==r[a])return!1;return!0}fromArray(e,n=0){for(let r=0;r<16;r++)this.elements[r]=e[r+n];return this}toArray(e=[],n=0){const r=this.elements;return e[n]=r[0],e[n+1]=r[1],e[n+2]=r[2],e[n+3]=r[3],e[n+4]=r[4],e[n+5]=r[5],e[n+6]=r[6],e[n+7]=r[7],e[n+8]=r[8],e[n+9]=r[9],e[n+10]=r[10],e[n+11]=r[11],e[n+12]=r[12],e[n+13]=r[13],e[n+14]=r[14],e[n+15]=r[15],e}}const Oo=new j,Xi=new jt,k_=new j(0,0,0),H_=new j(1,1,1),ls=new j,rc=new j,di=new j,Im=new jt,Um=new Qa;class cr{constructor(e=0,n=0,r=0,a=cr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,r,a=this._order){return this._x=e,this._y=n,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,r=!0){const a=e.elements,c=a[0],u=a[4],d=a[8],h=a[1],m=a[5],g=a[9],_=a[2],x=a[6],S=a[10];switch(n){case"XYZ":this._y=Math.asin(Tt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,S),this._z=Math.atan2(-u,c)):(this._x=Math.atan2(x,m),this._z=0);break;case"YXZ":this._x=Math.asin(-Tt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,S),this._z=Math.atan2(h,m)):(this._y=Math.atan2(-_,c),this._z=0);break;case"ZXY":this._x=Math.asin(Tt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-_,S),this._z=Math.atan2(-u,m)):(this._y=0,this._z=Math.atan2(h,c));break;case"ZYX":this._y=Math.asin(-Tt(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(x,S),this._z=Math.atan2(h,c)):(this._x=0,this._z=Math.atan2(-u,m));break;case"YZX":this._z=Math.asin(Tt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,m),this._y=Math.atan2(-_,c)):(this._x=0,this._y=Math.atan2(d,S));break;case"XZY":this._z=Math.asin(-Tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(x,m),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-g,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,r){return Im.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Im,n,r)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Um.setFromEuler(this),this.setFromQuaternion(Um,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}cr.DEFAULT_ORDER="XYZ";class Qd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let V_=0;const Nm=new j,zo=new Qa,Cr=new jt,sc=new j,Va=new j,G_=new j,W_=new Qa,Fm=new j(1,0,0),Om=new j(0,1,0),zm=new j(0,0,1),Bm={type:"added"},X_={type:"removed"},Bo={type:"childadded",child:null},Lf={type:"childremoved",child:null};class _n extends aa{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:V_++}),this.uuid=Za(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_n.DEFAULT_UP.clone();const e=new j,n=new cr,r=new Qa,a=new j(1,1,1);function c(){r.setFromEuler(n,!1)}function u(){n.setFromQuaternion(r,void 0,!1)}n._onChange(c),r._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new jt},normalMatrix:{value:new ft}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=_n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return zo.setFromAxisAngle(e,n),this.quaternion.multiply(zo),this}rotateOnWorldAxis(e,n){return zo.setFromAxisAngle(e,n),this.quaternion.premultiply(zo),this}rotateX(e){return this.rotateOnAxis(Fm,e)}rotateY(e){return this.rotateOnAxis(Om,e)}rotateZ(e){return this.rotateOnAxis(zm,e)}translateOnAxis(e,n){return Nm.copy(e).applyQuaternion(this.quaternion),this.position.add(Nm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Fm,e)}translateY(e){return this.translateOnAxis(Om,e)}translateZ(e){return this.translateOnAxis(zm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cr.copy(this.matrixWorld).invert())}lookAt(e,n,r){e.isVector3?sc.copy(e):sc.set(e,n,r);const a=this.parent;this.updateWorldMatrix(!0,!1),Va.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cr.lookAt(Va,sc,this.up):Cr.lookAt(sc,Va,this.up),this.quaternion.setFromRotationMatrix(Cr),a&&(Cr.extractRotation(a.matrixWorld),zo.setFromRotationMatrix(Cr),this.quaternion.premultiply(zo.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Bm),Bo.child=e,this.dispatchEvent(Bo),Bo.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(X_),Lf.child=e,this.dispatchEvent(Lf),Lf.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Bm),Bo.child=e,this.dispatchEvent(Bo),Bo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let r=0,a=this.children.length;r<a;r++){const u=this.children[r].getObjectByProperty(e,n);if(u!==void 0)return u}}getObjectsByProperty(e,n,r=[]){this[e]===n&&r.push(this);const a=this.children;for(let c=0,u=a.length;c<u;c++)a[c].getObjectsByProperty(e,n,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Va,e,G_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Va,W_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].updateMatrixWorld(e)}updateWorldMatrix(e,n){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const a=this.children;for(let c=0,u=a.length;c<u;c++)a[c].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",r={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function c(d,h){return d[h.uuid]===void 0&&(d[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=c(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const h=d.shapes;if(Array.isArray(h))for(let m=0,g=h.length;m<g;m++){const _=h[m];c(e.shapes,_)}else c(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let h=0,m=this.material.length;h<m;h++)d.push(c(e.materials,this.material[h]));a.material=d}else a.material=c(e.materials,this.material);if(this.children.length>0){a.children=[];for(let d=0;d<this.children.length;d++)a.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let d=0;d<this.animations.length;d++){const h=this.animations[d];a.animations.push(c(e.animations,h))}}if(n){const d=u(e.geometries),h=u(e.materials),m=u(e.textures),g=u(e.images),_=u(e.shapes),x=u(e.skeletons),S=u(e.animations),E=u(e.nodes);d.length>0&&(r.geometries=d),h.length>0&&(r.materials=h),m.length>0&&(r.textures=m),g.length>0&&(r.images=g),_.length>0&&(r.shapes=_),x.length>0&&(r.skeletons=x),S.length>0&&(r.animations=S),E.length>0&&(r.nodes=E)}return r.object=a,r;function u(d){const h=[];for(const m in d){const g=d[m];delete g.metadata,h.push(g)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}_n.DEFAULT_UP=new j(0,1,0);_n.DEFAULT_MATRIX_AUTO_UPDATE=!0;_n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ji=new j,Rr=new j,Df=new j,br=new j,ko=new j,Ho=new j,km=new j,If=new j,Uf=new j,Nf=new j,Ff=new sn,Of=new sn,zf=new sn;class bi{constructor(e=new j,n=new j,r=new j){this.a=e,this.b=n,this.c=r}static getNormal(e,n,r,a){a.subVectors(r,n),ji.subVectors(e,n),a.cross(ji);const c=a.lengthSq();return c>0?a.multiplyScalar(1/Math.sqrt(c)):a.set(0,0,0)}static getBarycoord(e,n,r,a,c){ji.subVectors(a,n),Rr.subVectors(r,n),Df.subVectors(e,n);const u=ji.dot(ji),d=ji.dot(Rr),h=ji.dot(Df),m=Rr.dot(Rr),g=Rr.dot(Df),_=u*m-d*d;if(_===0)return c.set(0,0,0),null;const x=1/_,S=(m*h-d*g)*x,E=(u*g-d*h)*x;return c.set(1-S-E,E,S)}static containsPoint(e,n,r,a){return this.getBarycoord(e,n,r,a,br)===null?!1:br.x>=0&&br.y>=0&&br.x+br.y<=1}static getInterpolation(e,n,r,a,c,u,d,h){return this.getBarycoord(e,n,r,a,br)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(c,br.x),h.addScaledVector(u,br.y),h.addScaledVector(d,br.z),h)}static getInterpolatedAttribute(e,n,r,a,c,u){return Ff.setScalar(0),Of.setScalar(0),zf.setScalar(0),Ff.fromBufferAttribute(e,n),Of.fromBufferAttribute(e,r),zf.fromBufferAttribute(e,a),u.setScalar(0),u.addScaledVector(Ff,c.x),u.addScaledVector(Of,c.y),u.addScaledVector(zf,c.z),u}static isFrontFacing(e,n,r,a){return ji.subVectors(r,n),Rr.subVectors(e,n),ji.cross(Rr).dot(a)<0}set(e,n,r){return this.a.copy(e),this.b.copy(n),this.c.copy(r),this}setFromPointsAndIndices(e,n,r,a){return this.a.copy(e[n]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,n,r,a){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ji.subVectors(this.c,this.b),Rr.subVectors(this.a,this.b),ji.cross(Rr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return bi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return bi.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,r,a,c){return bi.getInterpolation(e,this.a,this.b,this.c,n,r,a,c)}containsPoint(e){return bi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return bi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const r=this.a,a=this.b,c=this.c;let u,d;ko.subVectors(a,r),Ho.subVectors(c,r),If.subVectors(e,r);const h=ko.dot(If),m=Ho.dot(If);if(h<=0&&m<=0)return n.copy(r);Uf.subVectors(e,a);const g=ko.dot(Uf),_=Ho.dot(Uf);if(g>=0&&_<=g)return n.copy(a);const x=h*_-g*m;if(x<=0&&h>=0&&g<=0)return u=h/(h-g),n.copy(r).addScaledVector(ko,u);Nf.subVectors(e,c);const S=ko.dot(Nf),E=Ho.dot(Nf);if(E>=0&&S<=E)return n.copy(c);const w=S*m-h*E;if(w<=0&&m>=0&&E<=0)return d=m/(m-E),n.copy(r).addScaledVector(Ho,d);const y=g*E-S*_;if(y<=0&&_-g>=0&&S-E>=0)return km.subVectors(c,a),d=(_-g)/(_-g+(S-E)),n.copy(a).addScaledVector(km,d);const v=1/(y+w+x);return u=w*v,d=x*v,n.copy(r).addScaledVector(ko,u).addScaledVector(Ho,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const t0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cs={h:0,s:0,l:0},oc={h:0,s:0,l:0};function Bf(s,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?s+(e-s)*6*n:n<1/2?e:n<2/3?s+(e-s)*6*(2/3-n):s}class St{constructor(e,n,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,r)}set(e,n,r){if(n===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,n,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Dt.toWorkingColorSpace(this,n),this}setRGB(e,n,r,a=Dt.workingColorSpace){return this.r=e,this.g=n,this.b=r,Dt.toWorkingColorSpace(this,a),this}setHSL(e,n,r,a=Dt.workingColorSpace){if(e=R_(e,1),n=Tt(n,0,1),r=Tt(r,0,1),n===0)this.r=this.g=this.b=r;else{const c=r<=.5?r*(1+n):r+n-r*n,u=2*r-c;this.r=Bf(u,c,e+1/3),this.g=Bf(u,c,e),this.b=Bf(u,c,e-1/3)}return Dt.toWorkingColorSpace(this,a),this}setStyle(e,n=Ci){function r(c){c!==void 0&&parseFloat(c)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let c;const u=a[1],d=a[2];switch(u){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,n);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,n);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const c=a[1],u=c.length;if(u===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,n);if(u===6)return this.setHex(parseInt(c,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ci){const r=t0[e.toLowerCase()];return r!==void 0?this.setHex(r,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ur(e.r),this.g=Ur(e.g),this.b=Ur(e.b),this}copyLinearToSRGB(e){return this.r=Qo(e.r),this.g=Qo(e.g),this.b=Qo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ci){return Dt.fromWorkingColorSpace(Bn.copy(this),e),Math.round(Tt(Bn.r*255,0,255))*65536+Math.round(Tt(Bn.g*255,0,255))*256+Math.round(Tt(Bn.b*255,0,255))}getHexString(e=Ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Dt.workingColorSpace){Dt.fromWorkingColorSpace(Bn.copy(this),n);const r=Bn.r,a=Bn.g,c=Bn.b,u=Math.max(r,a,c),d=Math.min(r,a,c);let h,m;const g=(d+u)/2;if(d===u)h=0,m=0;else{const _=u-d;switch(m=g<=.5?_/(u+d):_/(2-u-d),u){case r:h=(a-c)/_+(a<c?6:0);break;case a:h=(c-r)/_+2;break;case c:h=(r-a)/_+4;break}h/=6}return e.h=h,e.s=m,e.l=g,e}getRGB(e,n=Dt.workingColorSpace){return Dt.fromWorkingColorSpace(Bn.copy(this),n),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=Ci){Dt.fromWorkingColorSpace(Bn.copy(this),e);const n=Bn.r,r=Bn.g,a=Bn.b;return e!==Ci?`color(${e} ${n.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,n,r){return this.getHSL(cs),this.setHSL(cs.h+e,cs.s+n,cs.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,r){return this.r=e.r+(n.r-e.r)*r,this.g=e.g+(n.g-e.g)*r,this.b=e.b+(n.b-e.b)*r,this}lerpHSL(e,n){this.getHSL(cs),e.getHSL(oc);const r=Mf(cs.h,oc.h,n),a=Mf(cs.s,oc.s,n),c=Mf(cs.l,oc.l,n);return this.setHSL(r,a,c),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,r=this.g,a=this.b,c=e.elements;return this.r=c[0]*n+c[3]*r+c[6]*a,this.g=c[1]*n+c[4]*r+c[7]*a,this.b=c[2]*n+c[5]*r+c[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bn=new St;St.NAMES=t0;let j_=0;class no extends aa{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:j_++}),this.uuid=Za(),this.name="",this.type="Material",this.blending=Ko,this.side=vs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ed,this.blendDst=td,this.blendEquation=$s,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=Jo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Am,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Do,this.stencilZFail=Do,this.stencilZPass=Do,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const r=e[n];if(r===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const a=this[n];if(a===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[n]=r}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Ko&&(r.blending=this.blending),this.side!==vs&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==ed&&(r.blendSrc=this.blendSrc),this.blendDst!==td&&(r.blendDst=this.blendDst),this.blendEquation!==$s&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Jo&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Am&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Do&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Do&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Do&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(c){const u=[];for(const d in c){const h=c[d];delete h.metadata,u.push(h)}return u}if(n){const c=a(e.textures),u=a(e.images);c.length>0&&(r.textures=c),u.length>0&&(r.images=u)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let r=null;if(n!==null){const a=n.length;r=new Array(a);for(let c=0;c!==a;++c)r[c]=n[c].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ps extends no{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new cr,this.combine=Xd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const un=new j,ac=new Ct;class kn{constructor(e,n,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=r,this.usage=Cm,this.updateRanges=[],this.gpuType=Dr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,r){e*=this.itemSize,r*=n.itemSize;for(let a=0,c=this.itemSize;a<c;a++)this.array[e+a]=n.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,r=this.count;n<r;n++)ac.fromBufferAttribute(this,n),ac.applyMatrix3(e),this.setXY(n,ac.x,ac.y);else if(this.itemSize===3)for(let n=0,r=this.count;n<r;n++)un.fromBufferAttribute(this,n),un.applyMatrix3(e),this.setXYZ(n,un.x,un.y,un.z);return this}applyMatrix4(e){for(let n=0,r=this.count;n<r;n++)un.fromBufferAttribute(this,n),un.applyMatrix4(e),this.setXYZ(n,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let n=0,r=this.count;n<r;n++)un.fromBufferAttribute(this,n),un.applyNormalMatrix(e),this.setXYZ(n,un.x,un.y,un.z);return this}transformDirection(e){for(let n=0,r=this.count;n<r;n++)un.fromBufferAttribute(this,n),un.transformDirection(e),this.setXYZ(n,un.x,un.y,un.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let r=this.array[e*this.itemSize+n];return this.normalized&&(r=Ba(r,this.array)),r}setComponent(e,n,r){return this.normalized&&(r=ri(r,this.array)),this.array[e*this.itemSize+n]=r,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ba(n,this.array)),n}setX(e,n){return this.normalized&&(n=ri(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ba(n,this.array)),n}setY(e,n){return this.normalized&&(n=ri(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ba(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ri(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ba(n,this.array)),n}setW(e,n){return this.normalized&&(n=ri(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,r){return e*=this.itemSize,this.normalized&&(n=ri(n,this.array),r=ri(r,this.array)),this.array[e+0]=n,this.array[e+1]=r,this}setXYZ(e,n,r,a){return e*=this.itemSize,this.normalized&&(n=ri(n,this.array),r=ri(r,this.array),a=ri(a,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,n,r,a,c){return e*=this.itemSize,this.normalized&&(n=ri(n,this.array),r=ri(r,this.array),a=ri(a,this.array),c=ri(c,this.array)),this.array[e+0]=n,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=c,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cm&&(e.usage=this.usage),e}}class n0 extends kn{constructor(e,n,r){super(new Uint16Array(e),n,r)}}class i0 extends kn{constructor(e,n,r){super(new Uint32Array(e),n,r)}}class tn extends kn{constructor(e,n,r){super(new Float32Array(e),n,r)}}let $_=0;const Ai=new jt,kf=new _n,Vo=new j,hi=new Ja,Ga=new Ja,Tn=new j;class en extends aa{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$_++}),this.uuid=Za(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qg(e)?i0:n0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,r=0){this.groups.push({start:e,count:n,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const c=new ft().getNormalMatrix(e);r.applyNormalMatrix(c),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ai.makeRotationFromQuaternion(e),this.applyMatrix4(Ai),this}rotateX(e){return Ai.makeRotationX(e),this.applyMatrix4(Ai),this}rotateY(e){return Ai.makeRotationY(e),this.applyMatrix4(Ai),this}rotateZ(e){return Ai.makeRotationZ(e),this.applyMatrix4(Ai),this}translate(e,n,r){return Ai.makeTranslation(e,n,r),this.applyMatrix4(Ai),this}scale(e,n,r){return Ai.makeScale(e,n,r),this.applyMatrix4(Ai),this}lookAt(e){return kf.lookAt(e),kf.updateMatrix(),this.applyMatrix4(kf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vo).negate(),this.translate(Vo.x,Vo.y,Vo.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const r=[];for(let a=0,c=e.length;a<c;a++){const u=e[a];r.push(u.x,u.y,u.z||0)}this.setAttribute("position",new tn(r,3))}else{const r=Math.min(e.length,n.count);for(let a=0;a<r;a++){const c=e[a];n.setXYZ(a,c.x,c.y,c.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ja);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const c=n[r];hi.setFromBufferAttribute(c),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,hi.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,hi.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(hi.min),this.boundingBox.expandByPoint(hi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new el);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const r=this.boundingSphere.center;if(hi.setFromBufferAttribute(e),n)for(let c=0,u=n.length;c<u;c++){const d=n[c];Ga.setFromBufferAttribute(d),this.morphTargetsRelative?(Tn.addVectors(hi.min,Ga.min),hi.expandByPoint(Tn),Tn.addVectors(hi.max,Ga.max),hi.expandByPoint(Tn)):(hi.expandByPoint(Ga.min),hi.expandByPoint(Ga.max))}hi.getCenter(r);let a=0;for(let c=0,u=e.count;c<u;c++)Tn.fromBufferAttribute(e,c),a=Math.max(a,r.distanceToSquared(Tn));if(n)for(let c=0,u=n.length;c<u;c++){const d=n[c],h=this.morphTargetsRelative;for(let m=0,g=d.count;m<g;m++)Tn.fromBufferAttribute(d,m),h&&(Vo.fromBufferAttribute(e,m),Tn.add(Vo)),a=Math.max(a,r.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=n.position,a=n.normal,c=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kn(new Float32Array(4*r.count),4));const u=this.getAttribute("tangent"),d=[],h=[];for(let G=0;G<r.count;G++)d[G]=new j,h[G]=new j;const m=new j,g=new j,_=new j,x=new Ct,S=new Ct,E=new Ct,w=new j,y=new j;function v(G,R,C){m.fromBufferAttribute(r,G),g.fromBufferAttribute(r,R),_.fromBufferAttribute(r,C),x.fromBufferAttribute(c,G),S.fromBufferAttribute(c,R),E.fromBufferAttribute(c,C),g.sub(m),_.sub(m),S.sub(x),E.sub(x);const z=1/(S.x*E.y-E.x*S.y);isFinite(z)&&(w.copy(g).multiplyScalar(E.y).addScaledVector(_,-S.y).multiplyScalar(z),y.copy(_).multiplyScalar(S.x).addScaledVector(g,-E.x).multiplyScalar(z),d[G].add(w),d[R].add(w),d[C].add(w),h[G].add(y),h[R].add(y),h[C].add(y))}let I=this.groups;I.length===0&&(I=[{start:0,count:e.count}]);for(let G=0,R=I.length;G<R;++G){const C=I[G],z=C.start,ie=C.count;for(let Z=z,ue=z+ie;Z<ue;Z+=3)v(e.getX(Z+0),e.getX(Z+1),e.getX(Z+2))}const L=new j,b=new j,H=new j,F=new j;function N(G){H.fromBufferAttribute(a,G),F.copy(H);const R=d[G];L.copy(R),L.sub(H.multiplyScalar(H.dot(R))).normalize(),b.crossVectors(F,R);const z=b.dot(h[G])<0?-1:1;u.setXYZW(G,L.x,L.y,L.z,z)}for(let G=0,R=I.length;G<R;++G){const C=I[G],z=C.start,ie=C.count;for(let Z=z,ue=z+ie;Z<ue;Z+=3)N(e.getX(Z+0)),N(e.getX(Z+1)),N(e.getX(Z+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new kn(new Float32Array(n.count*3),3),this.setAttribute("normal",r);else for(let x=0,S=r.count;x<S;x++)r.setXYZ(x,0,0,0);const a=new j,c=new j,u=new j,d=new j,h=new j,m=new j,g=new j,_=new j;if(e)for(let x=0,S=e.count;x<S;x+=3){const E=e.getX(x+0),w=e.getX(x+1),y=e.getX(x+2);a.fromBufferAttribute(n,E),c.fromBufferAttribute(n,w),u.fromBufferAttribute(n,y),g.subVectors(u,c),_.subVectors(a,c),g.cross(_),d.fromBufferAttribute(r,E),h.fromBufferAttribute(r,w),m.fromBufferAttribute(r,y),d.add(g),h.add(g),m.add(g),r.setXYZ(E,d.x,d.y,d.z),r.setXYZ(w,h.x,h.y,h.z),r.setXYZ(y,m.x,m.y,m.z)}else for(let x=0,S=n.count;x<S;x+=3)a.fromBufferAttribute(n,x+0),c.fromBufferAttribute(n,x+1),u.fromBufferAttribute(n,x+2),g.subVectors(u,c),_.subVectors(a,c),g.cross(_),r.setXYZ(x+0,g.x,g.y,g.z),r.setXYZ(x+1,g.x,g.y,g.z),r.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,r=e.count;n<r;n++)Tn.fromBufferAttribute(e,n),Tn.normalize(),e.setXYZ(n,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function e(d,h){const m=d.array,g=d.itemSize,_=d.normalized,x=new m.constructor(h.length*g);let S=0,E=0;for(let w=0,y=h.length;w<y;w++){d.isInterleavedBufferAttribute?S=h[w]*d.data.stride+d.offset:S=h[w]*g;for(let v=0;v<g;v++)x[E++]=m[S++]}return new kn(x,g,_)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new en,r=this.index.array,a=this.attributes;for(const d in a){const h=a[d],m=e(h,r);n.setAttribute(d,m)}const c=this.morphAttributes;for(const d in c){const h=[],m=c[d];for(let g=0,_=m.length;g<_;g++){const x=m[g],S=e(x,r);h.push(S)}n.morphAttributes[d]=h}n.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let d=0,h=u.length;d<h;d++){const m=u[d];n.addGroup(m.start,m.count,m.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const m in h)h[m]!==void 0&&(e[m]=h[m]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const r=this.attributes;for(const h in r){const m=r[h];e.data.attributes[h]=m.toJSON(e.data)}const a={};let c=!1;for(const h in this.morphAttributes){const m=this.morphAttributes[h],g=[];for(let _=0,x=m.length;_<x;_++){const S=m[_];g.push(S.toJSON(e.data))}g.length>0&&(a[h]=g,c=!0)}c&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(n));const a=e.attributes;for(const m in a){const g=a[m];this.setAttribute(m,g.clone(n))}const c=e.morphAttributes;for(const m in c){const g=[],_=c[m];for(let x=0,S=_.length;x<S;x++)g.push(_[x].clone(n));this.morphAttributes[m]=g}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let m=0,g=u.length;m<g;m++){const _=u[m];this.addGroup(_.start,_.count,_.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Hm=new jt,ks=new Gc,lc=new el,Vm=new j,cc=new j,uc=new j,fc=new j,Hf=new j,dc=new j,Gm=new j,hc=new j;class An extends _n{constructor(e=new en,n=new ps){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,u=a.length;c<u;c++){const d=a[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(e,n){const r=this.geometry,a=r.attributes.position,c=r.morphAttributes.position,u=r.morphTargetsRelative;n.fromBufferAttribute(a,e);const d=this.morphTargetInfluences;if(c&&d){dc.set(0,0,0);for(let h=0,m=c.length;h<m;h++){const g=d[h],_=c[h];g!==0&&(Hf.fromBufferAttribute(_,e),u?dc.addScaledVector(Hf,g):dc.addScaledVector(Hf.sub(n),g))}n.add(dc)}return n}raycast(e,n){const r=this.geometry,a=this.material,c=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),lc.copy(r.boundingSphere),lc.applyMatrix4(c),ks.copy(e.ray).recast(e.near),!(lc.containsPoint(ks.origin)===!1&&(ks.intersectSphere(lc,Vm)===null||ks.origin.distanceToSquared(Vm)>(e.far-e.near)**2))&&(Hm.copy(c).invert(),ks.copy(e.ray).applyMatrix4(Hm),!(r.boundingBox!==null&&ks.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,n,ks)))}_computeIntersections(e,n,r){let a;const c=this.geometry,u=this.material,d=c.index,h=c.attributes.position,m=c.attributes.uv,g=c.attributes.uv1,_=c.attributes.normal,x=c.groups,S=c.drawRange;if(d!==null)if(Array.isArray(u))for(let E=0,w=x.length;E<w;E++){const y=x[E],v=u[y.materialIndex],I=Math.max(y.start,S.start),L=Math.min(d.count,Math.min(y.start+y.count,S.start+S.count));for(let b=I,H=L;b<H;b+=3){const F=d.getX(b),N=d.getX(b+1),G=d.getX(b+2);a=pc(this,v,e,r,m,g,_,F,N,G),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),w=Math.min(d.count,S.start+S.count);for(let y=E,v=w;y<v;y+=3){const I=d.getX(y),L=d.getX(y+1),b=d.getX(y+2);a=pc(this,u,e,r,m,g,_,I,L,b),a&&(a.faceIndex=Math.floor(y/3),n.push(a))}}else if(h!==void 0)if(Array.isArray(u))for(let E=0,w=x.length;E<w;E++){const y=x[E],v=u[y.materialIndex],I=Math.max(y.start,S.start),L=Math.min(h.count,Math.min(y.start+y.count,S.start+S.count));for(let b=I,H=L;b<H;b+=3){const F=b,N=b+1,G=b+2;a=pc(this,v,e,r,m,g,_,F,N,G),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,n.push(a))}}else{const E=Math.max(0,S.start),w=Math.min(h.count,S.start+S.count);for(let y=E,v=w;y<v;y+=3){const I=y,L=y+1,b=y+2;a=pc(this,u,e,r,m,g,_,I,L,b),a&&(a.faceIndex=Math.floor(y/3),n.push(a))}}}}function q_(s,e,n,r,a,c,u,d){let h;if(e.side===si?h=r.intersectTriangle(u,c,a,!0,d):h=r.intersectTriangle(a,c,u,e.side===vs,d),h===null)return null;hc.copy(d),hc.applyMatrix4(s.matrixWorld);const m=n.ray.origin.distanceTo(hc);return m<n.near||m>n.far?null:{distance:m,point:hc.clone(),object:s}}function pc(s,e,n,r,a,c,u,d,h,m){s.getVertexPosition(d,cc),s.getVertexPosition(h,uc),s.getVertexPosition(m,fc);const g=q_(s,e,n,r,cc,uc,fc,Gm);if(g){const _=new j;bi.getBarycoord(Gm,cc,uc,fc,_),a&&(g.uv=bi.getInterpolatedAttribute(a,d,h,m,_,new Ct)),c&&(g.uv1=bi.getInterpolatedAttribute(c,d,h,m,_,new Ct)),u&&(g.normal=bi.getInterpolatedAttribute(u,d,h,m,_,new j),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const x={a:d,b:h,c:m,normal:new j,materialIndex:0};bi.getNormal(cc,uc,fc,x.normal),g.face=x,g.barycoord=_}return g}class la extends en{constructor(e=1,n=1,r=1,a=1,c=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:r,widthSegments:a,heightSegments:c,depthSegments:u};const d=this;a=Math.floor(a),c=Math.floor(c),u=Math.floor(u);const h=[],m=[],g=[],_=[];let x=0,S=0;E("z","y","x",-1,-1,r,n,e,u,c,0),E("z","y","x",1,-1,r,n,-e,u,c,1),E("x","z","y",1,1,e,r,n,a,u,2),E("x","z","y",1,-1,e,r,-n,a,u,3),E("x","y","z",1,-1,e,n,r,a,c,4),E("x","y","z",-1,-1,e,n,-r,a,c,5),this.setIndex(h),this.setAttribute("position",new tn(m,3)),this.setAttribute("normal",new tn(g,3)),this.setAttribute("uv",new tn(_,2));function E(w,y,v,I,L,b,H,F,N,G,R){const C=b/N,z=H/G,ie=b/2,Z=H/2,ue=F/2,me=N+1,ae=G+1;let he=0,k=0;const de=new j;for(let oe=0;oe<ae;oe++){const U=oe*z-Z;for(let se=0;se<me;se++){const Fe=se*C-ie;de[w]=Fe*I,de[y]=U*L,de[v]=ue,m.push(de.x,de.y,de.z),de[w]=0,de[y]=0,de[v]=F>0?1:-1,g.push(de.x,de.y,de.z),_.push(se/N),_.push(1-oe/G),he+=1}}for(let oe=0;oe<G;oe++)for(let U=0;U<N;U++){const se=x+U+me*oe,Fe=x+U+me*(oe+1),te=x+(U+1)+me*(oe+1),pe=x+(U+1)+me*oe;h.push(se,Fe,pe),h.push(Fe,te,pe),k+=6}d.addGroup(S,k,R),S+=k,x+=he}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new la(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function sa(s){const e={};for(const n in s){e[n]={};for(const r in s[n]){const a=s[n][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][r]=null):e[n][r]=a.clone():Array.isArray(a)?e[n][r]=a.slice():e[n][r]=a}}return e}function jn(s){const e={};for(let n=0;n<s.length;n++){const r=sa(s[n]);for(const a in r)e[a]=r[a]}return e}function Y_(s){const e=[];for(let n=0;n<s.length;n++)e.push(s[n].clone());return e}function r0(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Dt.workingColorSpace}const s0={clone:sa,merge:jn};var K_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Z_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ur extends no{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=K_,this.fragmentShader=Z_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=sa(e.uniforms),this.uniformsGroups=Y_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const a in this.uniforms){const u=this.uniforms[a].value;u&&u.isTexture?n.uniforms[a]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?n.uniforms[a]={type:"c",value:u.getHex()}:u&&u.isVector2?n.uniforms[a]={type:"v2",value:u.toArray()}:u&&u.isVector3?n.uniforms[a]={type:"v3",value:u.toArray()}:u&&u.isVector4?n.uniforms[a]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?n.uniforms[a]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?n.uniforms[a]={type:"m4",value:u.toArray()}:n.uniforms[a]={value:u}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(n.extensions=r),n}}class o0 extends _n{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=Ir}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const us=new j,Wm=new Ct,Xm=new Ct;class Ri extends o0{constructor(e=50,n=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Bd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Dc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bd*2*Math.atan(Math.tan(Dc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,r){us.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(us.x,us.y).multiplyScalar(-e/us.z),us.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(us.x,us.y).multiplyScalar(-e/us.z)}getViewSize(e,n){return this.getViewBounds(e,Wm,Xm),n.subVectors(Xm,Wm)}setViewOffset(e,n,r,a,c,u){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=c,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Dc*.5*this.fov)/this.zoom,r=2*n,a=this.aspect*r,c=-.5*a;const u=this.view;if(this.view!==null&&this.view.enabled){const h=u.fullWidth,m=u.fullHeight;c+=u.offsetX*a/h,n-=u.offsetY*r/m,a*=u.width/h,r*=u.height/m}const d=this.filmOffset;d!==0&&(c+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+a,n,n-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Go=-90,Wo=1;class Q_ extends _n{constructor(e,n,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Ri(Go,Wo,e,n);a.layers=this.layers,this.add(a);const c=new Ri(Go,Wo,e,n);c.layers=this.layers,this.add(c);const u=new Ri(Go,Wo,e,n);u.layers=this.layers,this.add(u);const d=new Ri(Go,Wo,e,n);d.layers=this.layers,this.add(d);const h=new Ri(Go,Wo,e,n);h.layers=this.layers,this.add(h);const m=new Ri(Go,Wo,e,n);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[r,a,c,u,d,h]=n;for(const m of n)this.remove(m);if(e===Ir)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===Fc)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of n)this.add(m),m.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[c,u,d,h,m,g]=this.children,_=e.getRenderTarget(),x=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const w=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(n,c),e.setRenderTarget(r,1,a),e.render(n,u),e.setRenderTarget(r,2,a),e.render(n,d),e.setRenderTarget(r,3,a),e.render(n,h),e.setRenderTarget(r,4,a),e.render(n,m),r.texture.generateMipmaps=w,e.setRenderTarget(r,5,a),e.render(n,g),e.setRenderTarget(_,x,S),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class a0 extends oi{constructor(e,n,r,a,c,u,d,h,m,g){e=e!==void 0?e:[],n=n!==void 0?n:ea,super(e,n,r,a,c,u,d,h,m,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class J_ extends to{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new a0(a,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:lr}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new la(5,5,5),c=new ur({name:"CubemapFromEquirect",uniforms:sa(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:si,blending:ms});c.uniforms.tEquirect.value=n;const u=new An(a,c),d=n.minFilter;return n.minFilter===Zs&&(n.minFilter=lr),new Q_(1,10,this).update(e,u),n.minFilter=d,u.geometry.dispose(),u.material.dispose(),this}clear(e,n,r,a){const c=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(n,r,a);e.setRenderTarget(c)}}class ex extends _n{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new cr,this.environmentIntensity=1,this.environmentRotation=new cr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const Vf=new j,tx=new j,nx=new ft;class Xs{constructor(e=new j(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,r,a){return this.normal.set(e,n,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,r){const a=Vf.subVectors(r,n).cross(tx.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const r=e.delta(Vf),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/a;return c<0||c>1?null:n.copy(e.start).addScaledVector(r,c)}intersectsLine(e){const n=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return n<0&&r>0||r<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const r=n||nx.getNormalMatrix(e),a=this.coplanarPoint(Vf).applyMatrix4(e),c=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(c),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Hs=new el,mc=new j;class Jd{constructor(e=new Xs,n=new Xs,r=new Xs,a=new Xs,c=new Xs,u=new Xs){this.planes=[e,n,r,a,c,u]}set(e,n,r,a,c,u){const d=this.planes;return d[0].copy(e),d[1].copy(n),d[2].copy(r),d[3].copy(a),d[4].copy(c),d[5].copy(u),this}copy(e){const n=this.planes;for(let r=0;r<6;r++)n[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,n=Ir){const r=this.planes,a=e.elements,c=a[0],u=a[1],d=a[2],h=a[3],m=a[4],g=a[5],_=a[6],x=a[7],S=a[8],E=a[9],w=a[10],y=a[11],v=a[12],I=a[13],L=a[14],b=a[15];if(r[0].setComponents(h-c,x-m,y-S,b-v).normalize(),r[1].setComponents(h+c,x+m,y+S,b+v).normalize(),r[2].setComponents(h+u,x+g,y+E,b+I).normalize(),r[3].setComponents(h-u,x-g,y-E,b-I).normalize(),r[4].setComponents(h-d,x-_,y-w,b-L).normalize(),n===Ir)r[5].setComponents(h+d,x+_,y+w,b+L).normalize();else if(n===Fc)r[5].setComponents(d,_,w,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hs)}intersectsSprite(e){return Hs.center.set(0,0,0),Hs.radius=.7071067811865476,Hs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hs)}intersectsSphere(e){const n=this.planes,r=e.center,a=-e.radius;for(let c=0;c<6;c++)if(n[c].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const n=this.planes;for(let r=0;r<6;r++){const a=n[r];if(mc.x=a.normal.x>0?e.max.x:e.min.x,mc.y=a.normal.y>0?e.max.y:e.min.y,mc.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(mc)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let r=0;r<6;r++)if(n[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ds extends no{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const zc=new j,Bc=new j,jm=new jt,Wa=new Gc,gc=new el,Gf=new j,$m=new j;class Qs extends _n{constructor(e=new en,n=new ds){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,r=[0];for(let a=1,c=n.count;a<c;a++)zc.fromBufferAttribute(n,a-1),Bc.fromBufferAttribute(n,a),r[a]=r[a-1],r[a]+=zc.distanceTo(Bc);e.setAttribute("lineDistance",new tn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const r=this.geometry,a=this.matrixWorld,c=e.params.Line.threshold,u=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),gc.copy(r.boundingSphere),gc.applyMatrix4(a),gc.radius+=c,e.ray.intersectsSphere(gc)===!1)return;jm.copy(a).invert(),Wa.copy(e.ray).applyMatrix4(jm);const d=c/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,m=this.isLineSegments?2:1,g=r.index,x=r.attributes.position;if(g!==null){const S=Math.max(0,u.start),E=Math.min(g.count,u.start+u.count);for(let w=S,y=E-1;w<y;w+=m){const v=g.getX(w),I=g.getX(w+1),L=vc(this,e,Wa,h,v,I);L&&n.push(L)}if(this.isLineLoop){const w=g.getX(E-1),y=g.getX(S),v=vc(this,e,Wa,h,w,y);v&&n.push(v)}}else{const S=Math.max(0,u.start),E=Math.min(x.count,u.start+u.count);for(let w=S,y=E-1;w<y;w+=m){const v=vc(this,e,Wa,h,w,w+1);v&&n.push(v)}if(this.isLineLoop){const w=vc(this,e,Wa,h,E-1,S);w&&n.push(w)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,u=a.length;c<u;c++){const d=a[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}}function vc(s,e,n,r,a,c){const u=s.geometry.attributes.position;if(zc.fromBufferAttribute(u,a),Bc.fromBufferAttribute(u,c),n.distanceSqToSegment(zc,Bc,Gf,$m)>r)return;Gf.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Gf);if(!(h<e.near||h>e.far))return{distance:h,point:$m.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const qm=new j,Ym=new j;class Km extends Qs{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,r=[];for(let a=0,c=n.count;a<c;a+=2)qm.fromBufferAttribute(n,a),Ym.fromBufferAttribute(n,a+1),r[a]=a===0?0:r[a-1],r[a+1]=r[a]+qm.distanceTo(Ym);e.setAttribute("lineDistance",new tn(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ix extends Qs{constructor(e,n){super(e,n),this.isLineLoop=!0,this.type="LineLoop"}}class l0 extends no{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Zm=new jt,kd=new Gc,_c=new el,xc=new j;class Qm extends _n{constructor(e=new en,n=new l0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const r=this.geometry,a=this.matrixWorld,c=e.params.Points.threshold,u=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),_c.copy(r.boundingSphere),_c.applyMatrix4(a),_c.radius+=c,e.ray.intersectsSphere(_c)===!1)return;Zm.copy(a).invert(),kd.copy(e.ray).applyMatrix4(Zm);const d=c/((this.scale.x+this.scale.y+this.scale.z)/3),h=d*d,m=r.index,_=r.attributes.position;if(m!==null){const x=Math.max(0,u.start),S=Math.min(m.count,u.start+u.count);for(let E=x,w=S;E<w;E++){const y=m.getX(E);xc.fromBufferAttribute(_,y),Jm(xc,y,h,a,e,n,this)}}else{const x=Math.max(0,u.start),S=Math.min(_.count,u.start+u.count);for(let E=x,w=S;E<w;E++)xc.fromBufferAttribute(_,E),Jm(xc,E,h,a,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,r=Object.keys(n);if(r.length>0){const a=n[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,u=a.length;c<u;c++){const d=a[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}}function Jm(s,e,n,r,a,c,u){const d=kd.distanceSqToPoint(s);if(d<n){const h=new j;kd.closestPointToPoint(s,h),h.applyMatrix4(r);const m=a.ray.origin.distanceTo(h);if(m<a.near||m>a.far)return;c.push({distance:m,distanceToRay:Math.sqrt(d),point:h,index:e,face:null,faceIndex:null,barycoord:null,object:u})}}class qo extends _n{constructor(){super(),this.isGroup=!0,this.type="Group"}}class c0 extends oi{constructor(e,n,r,a,c,u,d,h,m,g=Zo){if(g!==Zo&&g!==ia)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&g===Zo&&(r=eo),r===void 0&&g===ia&&(r=na),super(null,a,c,u,d,h,g,r,m),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=d!==void 0?d:Yi,this.minFilter=h!==void 0?h:Yi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class eh extends en{constructor(e=1,n=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:r,thetaLength:a},n=Math.max(3,n);const c=[],u=[],d=[],h=[],m=new j,g=new Ct;u.push(0,0,0),d.push(0,0,1),h.push(.5,.5);for(let _=0,x=3;_<=n;_++,x+=3){const S=r+_/n*a;m.x=e*Math.cos(S),m.y=e*Math.sin(S),u.push(m.x,m.y,m.z),d.push(0,0,1),g.x=(u[x]/e+1)/2,g.y=(u[x+1]/e+1)/2,h.push(g.x,g.y)}for(let _=1;_<=n;_++)c.push(_,_+1,0);this.setIndex(c),this.setAttribute("position",new tn(u,3)),this.setAttribute("normal",new tn(d,3)),this.setAttribute("uv",new tn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new eh(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class th extends en{constructor(e=1,n=1,r=1,a=32,c=1,u=!1,d=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:r,radialSegments:a,heightSegments:c,openEnded:u,thetaStart:d,thetaLength:h};const m=this;a=Math.floor(a),c=Math.floor(c);const g=[],_=[],x=[],S=[];let E=0;const w=[],y=r/2;let v=0;I(),u===!1&&(e>0&&L(!0),n>0&&L(!1)),this.setIndex(g),this.setAttribute("position",new tn(_,3)),this.setAttribute("normal",new tn(x,3)),this.setAttribute("uv",new tn(S,2));function I(){const b=new j,H=new j;let F=0;const N=(n-e)/r;for(let G=0;G<=c;G++){const R=[],C=G/c,z=C*(n-e)+e;for(let ie=0;ie<=a;ie++){const Z=ie/a,ue=Z*h+d,me=Math.sin(ue),ae=Math.cos(ue);H.x=z*me,H.y=-C*r+y,H.z=z*ae,_.push(H.x,H.y,H.z),b.set(me,N,ae).normalize(),x.push(b.x,b.y,b.z),S.push(Z,1-C),R.push(E++)}w.push(R)}for(let G=0;G<a;G++)for(let R=0;R<c;R++){const C=w[R][G],z=w[R+1][G],ie=w[R+1][G+1],Z=w[R][G+1];(e>0||R!==0)&&(g.push(C,z,Z),F+=3),(n>0||R!==c-1)&&(g.push(z,ie,Z),F+=3)}m.addGroup(v,F,0),v+=F}function L(b){const H=E,F=new Ct,N=new j;let G=0;const R=b===!0?e:n,C=b===!0?1:-1;for(let ie=1;ie<=a;ie++)_.push(0,y*C,0),x.push(0,C,0),S.push(.5,.5),E++;const z=E;for(let ie=0;ie<=a;ie++){const ue=ie/a*h+d,me=Math.cos(ue),ae=Math.sin(ue);N.x=R*ae,N.y=y*C,N.z=R*me,_.push(N.x,N.y,N.z),x.push(0,C,0),F.x=me*.5+.5,F.y=ae*.5*C+.5,S.push(F.x,F.y),E++}for(let ie=0;ie<a;ie++){const Z=H+ie,ue=z+ie;b===!0?g.push(ue,ue+1,Z):g.push(ue+1,ue,Z),G+=3}m.addGroup(v,G,b===!0?1:2),v+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new th(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const yc=new j,Sc=new j,Wf=new j,Mc=new bi;class eg extends en{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const a=Math.pow(10,4),c=Math.cos(Dc*n),u=e.getIndex(),d=e.getAttribute("position"),h=u?u.count:d.count,m=[0,0,0],g=["a","b","c"],_=new Array(3),x={},S=[];for(let E=0;E<h;E+=3){u?(m[0]=u.getX(E),m[1]=u.getX(E+1),m[2]=u.getX(E+2)):(m[0]=E,m[1]=E+1,m[2]=E+2);const{a:w,b:y,c:v}=Mc;if(w.fromBufferAttribute(d,m[0]),y.fromBufferAttribute(d,m[1]),v.fromBufferAttribute(d,m[2]),Mc.getNormal(Wf),_[0]=`${Math.round(w.x*a)},${Math.round(w.y*a)},${Math.round(w.z*a)}`,_[1]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,_[2]=`${Math.round(v.x*a)},${Math.round(v.y*a)},${Math.round(v.z*a)}`,!(_[0]===_[1]||_[1]===_[2]||_[2]===_[0]))for(let I=0;I<3;I++){const L=(I+1)%3,b=_[I],H=_[L],F=Mc[g[I]],N=Mc[g[L]],G=`${b}_${H}`,R=`${H}_${b}`;R in x&&x[R]?(Wf.dot(x[R].normal)<=c&&(S.push(F.x,F.y,F.z),S.push(N.x,N.y,N.z)),x[R]=null):G in x||(x[G]={index0:m[I],index1:m[L],normal:Wf.clone()})}}for(const E in x)if(x[E]){const{index0:w,index1:y}=x[E];yc.fromBufferAttribute(d,w),Sc.fromBufferAttribute(d,y),S.push(yc.x,yc.y,yc.z),S.push(Sc.x,Sc.y,Sc.z)}this.setAttribute("position",new tn(S,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class oa extends en{constructor(e=1,n=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:r,heightSegments:a};const c=e/2,u=n/2,d=Math.floor(r),h=Math.floor(a),m=d+1,g=h+1,_=e/d,x=n/h,S=[],E=[],w=[],y=[];for(let v=0;v<g;v++){const I=v*x-u;for(let L=0;L<m;L++){const b=L*_-c;E.push(b,-I,0),w.push(0,0,1),y.push(L/d),y.push(1-v/h)}}for(let v=0;v<h;v++)for(let I=0;I<d;I++){const L=I+m*v,b=I+m*(v+1),H=I+1+m*(v+1),F=I+1+m*v;S.push(L,b,F),S.push(b,H,F)}this.setIndex(S),this.setAttribute("position",new tn(E,3)),this.setAttribute("normal",new tn(w,3)),this.setAttribute("uv",new tn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oa(e.width,e.height,e.widthSegments,e.heightSegments)}}class nh extends en{constructor(e=.5,n=1,r=32,a=1,c=0,u=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:r,phiSegments:a,thetaStart:c,thetaLength:u},r=Math.max(3,r),a=Math.max(1,a);const d=[],h=[],m=[],g=[];let _=e;const x=(n-e)/a,S=new j,E=new Ct;for(let w=0;w<=a;w++){for(let y=0;y<=r;y++){const v=c+y/r*u;S.x=_*Math.cos(v),S.y=_*Math.sin(v),h.push(S.x,S.y,S.z),m.push(0,0,1),E.x=(S.x/n+1)/2,E.y=(S.y/n+1)/2,g.push(E.x,E.y)}_+=x}for(let w=0;w<a;w++){const y=w*(r+1);for(let v=0;v<r;v++){const I=v+y,L=I,b=I+r+1,H=I+r+2,F=I+1;d.push(L,b,F),d.push(b,H,F)}}this.setIndex(d),this.setAttribute("position",new tn(h,3)),this.setAttribute("normal",new tn(m,3)),this.setAttribute("uv",new tn(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nh(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class kc extends en{constructor(e=1,n=32,r=16,a=0,c=Math.PI*2,u=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:r,phiStart:a,phiLength:c,thetaStart:u,thetaLength:d},n=Math.max(3,Math.floor(n)),r=Math.max(2,Math.floor(r));const h=Math.min(u+d,Math.PI);let m=0;const g=[],_=new j,x=new j,S=[],E=[],w=[],y=[];for(let v=0;v<=r;v++){const I=[],L=v/r;let b=0;v===0&&u===0?b=.5/n:v===r&&h===Math.PI&&(b=-.5/n);for(let H=0;H<=n;H++){const F=H/n;_.x=-e*Math.cos(a+F*c)*Math.sin(u+L*d),_.y=e*Math.cos(u+L*d),_.z=e*Math.sin(a+F*c)*Math.sin(u+L*d),E.push(_.x,_.y,_.z),x.copy(_).normalize(),w.push(x.x,x.y,x.z),y.push(F+b,1-L),I.push(m++)}g.push(I)}for(let v=0;v<r;v++)for(let I=0;I<n;I++){const L=g[v][I+1],b=g[v][I],H=g[v+1][I],F=g[v+1][I+1];(v!==0||u>0)&&S.push(L,b,F),(v!==r-1||h<Math.PI)&&S.push(b,H,F)}this.setIndex(S),this.setAttribute("position",new tn(E,3)),this.setAttribute("normal",new tn(w,3)),this.setAttribute("uv",new tn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kc(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class tg extends no{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new St(16777215),this.specular=new St(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Kg,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new cr,this.combine=Xd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class rx extends no{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=__,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sx extends no{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class u0 extends _n{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new St(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const Xf=new jt,ng=new j,ig=new j;class ox{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jd,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,r=this.matrix;ng.setFromMatrixPosition(e.matrixWorld),n.position.copy(ng),ig.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(ig),n.updateMatrixWorld(),Xf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xf),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Xf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class f0 extends o0{constructor(e=-1,n=1,r=1,a=-1,c=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=r,this.bottom=a,this.near=c,this.far=u,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,r,a,c,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=r,this.view.offsetY=a,this.view.width=c,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let c=r-e,u=r+e,d=a+n,h=a-n;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=m*this.view.offsetX,u=c+m*this.view.width,d-=g*this.view.offsetY,h=d-g*this.view.height}this.projectionMatrix.makeOrthographic(c,u,d,h,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class ax extends ox{constructor(){super(new f0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lx extends u0{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_n.DEFAULT_UP),this.updateMatrix(),this.target=new _n,this.shadow=new ax}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class cx extends u0{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class ux extends Ri{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}const rg=new jt;class fx{constructor(e,n,r=0,a=1/0){this.ray=new Gc(e,n),this.near=r,this.far=a,this.camera=null,this.layers=new Qd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return rg.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rg),this}intersectObject(e,n=!0,r=[]){return Hd(e,this,r,n),r.sort(sg),r}intersectObjects(e,n=!0,r=[]){for(let a=0,c=e.length;a<c;a++)Hd(e[a],this,r,n);return r.sort(sg),r}}function sg(s,e){return s.distance-e.distance}function Hd(s,e,n,r){let a=!0;if(s.layers.test(e.layers)&&s.raycast(e,n)===!1&&(a=!1),a===!0&&r===!0){const c=s.children;for(let u=0,d=c.length;u<d;u++)Hd(c[u],e,n,!0)}}const og=new j;let Ec,jf;class ag extends _n{constructor(e=new j(0,0,1),n=new j(0,0,0),r=1,a=16776960,c=r*.2,u=c*.2){super(),this.type="ArrowHelper",Ec===void 0&&(Ec=new en,Ec.setAttribute("position",new tn([0,0,0,0,1,0],3)),jf=new th(0,.5,1,5,1),jf.translate(0,-.5,0)),this.position.copy(n),this.line=new Qs(Ec,new ds({color:a,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new An(jf,new ps({color:a,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(r,c,u)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{og.set(e.z,0,-e.x).normalize();const n=Math.acos(e.y);this.quaternion.setFromAxisAngle(og,n)}}setLength(e,n=e*.2,r=n*.2){this.line.scale.set(1,Math.max(1e-4,e-n),1),this.line.updateMatrix(),this.cone.scale.set(r,n,r),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}function lg(s,e,n,r){const a=dx(r);switch(n){case Gg:return s*e;case Xg:return s*e;case jg:return s*e*2;case $g:return s*e/a.components*a.byteLength;case Yd:return s*e/a.components*a.byteLength;case qg:return s*e*2/a.components*a.byteLength;case Kd:return s*e*2/a.components*a.byteLength;case Wg:return s*e*3/a.components*a.byteLength;case qi:return s*e*4/a.components*a.byteLength;case Zd:return s*e*4/a.components*a.byteLength;case Cc:case Rc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case bc:case Pc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case pd:case gd:return Math.max(s,16)*Math.max(e,8)/4;case hd:case md:return Math.max(s,8)*Math.max(e,8)/2;case vd:case _d:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case xd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case yd:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Sd:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Md:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ed:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case wd:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Td:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Ad:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Cd:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Rd:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case bd:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Pd:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ld:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Dd:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Id:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Lc:case Ud:case Nd:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Yg:case Fd:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Od:case zd:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function dx(s){switch(s){case Nr:case kg:return{byteLength:1,components:1};case Ya:case Hg:case Ka:return{byteLength:2,components:1};case $d:case qd:return{byteLength:2,components:4};case eo:case jd:case Dr:return{byteLength:4,components:1};case Vg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wd);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function d0(){let s=null,e=!1,n=null,r=null;function a(c,u){n(c,u),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&n!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(c){n=c},setContext:function(c){s=c}}}function hx(s){const e=new WeakMap;function n(d,h){const m=d.array,g=d.usage,_=m.byteLength,x=s.createBuffer();s.bindBuffer(h,x),s.bufferData(h,m,g),d.onUploadCallback();let S;if(m instanceof Float32Array)S=s.FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)S=s.SHORT;else if(m instanceof Uint32Array)S=s.UNSIGNED_INT;else if(m instanceof Int32Array)S=s.INT;else if(m instanceof Int8Array)S=s.BYTE;else if(m instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:x,type:S,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:_}}function r(d,h,m){const g=h.array,_=h.updateRanges;if(s.bindBuffer(m,d),_.length===0)s.bufferSubData(m,0,g);else{_.sort((S,E)=>S.start-E.start);let x=0;for(let S=1;S<_.length;S++){const E=_[x],w=_[S];w.start<=E.start+E.count+1?E.count=Math.max(E.count,w.start+w.count-E.start):(++x,_[x]=w)}_.length=x+1;for(let S=0,E=_.length;S<E;S++){const w=_[S];s.bufferSubData(m,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const h=e.get(d);h&&(s.deleteBuffer(h.buffer),e.delete(d))}function u(d,h){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const g=e.get(d);(!g||g.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=e.get(d);if(m===void 0)e.set(d,n(d,h));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,d,h),m.version=d.version}}return{get:a,remove:c,update:u}}var px=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mx=`#ifdef USE_ALPHAHASH
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
#endif`,gx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_x=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yx=`#ifdef USE_AOMAP
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
#endif`,Sx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mx=`#ifdef USE_BATCHING
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
#endif`,Ex=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ax=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Cx=`#ifdef USE_IRIDESCENCE
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
#endif`,Rx=`#ifdef USE_BUMPMAP
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
#endif`,bx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Px=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Lx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ix=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ux=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Nx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Fx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ox=`#define PI 3.141592653589793
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
} // validated`,zx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bx=`vec3 transformedNormal = objectNormal;
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
#endif`,kx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,jx=`#ifdef USE_ENVMAP
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
#endif`,$x=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qx=`#ifdef USE_ENVMAP
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
#endif`,Yx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kx=`#ifdef USE_ENVMAP
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
#endif`,Zx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ey=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ty=`#ifdef USE_GRADIENTMAP
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
}`,ny=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,iy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ry=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sy=`uniform bool receiveShadow;
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
#endif`,oy=`#ifdef USE_ENVMAP
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
#endif`,ay=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ly=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,uy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fy=`PhysicalMaterial material;
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
#endif`,dy=`struct PhysicalMaterial {
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
}`,hy=`
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
#endif`,py=`#if defined( RE_IndirectDiffuse )
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
#endif`,my=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_y=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,yy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,My=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ey=`#if defined( USE_POINTS_UV )
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
#endif`,wy=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ty=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ay=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ry=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,by=`#ifdef USE_MORPHTARGETS
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
#endif`,Py=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ly=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Dy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Iy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ny=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fy=`#ifdef USE_NORMALMAP
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
#endif`,Oy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,By=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ky=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vy=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Gy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$y=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Yy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ky=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qy=`float getShadowMask() {
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
}`,Jy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,eS=`#ifdef USE_SKINNING
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
#endif`,tS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nS=`#ifdef USE_SKINNING
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
#endif`,iS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,oS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,aS=`#ifdef USE_TRANSMISSION
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
#endif`,lS=`#ifdef USE_TRANSMISSION
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
#endif`,cS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pS=`uniform sampler2D t2D;
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
}`,mS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_S=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xS=`#include <common>
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
}`,yS=`#if DEPTH_PACKING == 3200
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
}`,SS=`#define DISTANCE
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
}`,MS=`#define DISTANCE
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
}`,ES=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TS=`uniform float scale;
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
}`,AS=`uniform vec3 diffuse;
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
}`,CS=`#include <common>
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
}`,RS=`uniform vec3 diffuse;
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
}`,bS=`#define LAMBERT
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
}`,PS=`#define LAMBERT
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
}`,LS=`#define MATCAP
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
}`,DS=`#define MATCAP
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
}`,IS=`#define NORMAL
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
}`,US=`#define NORMAL
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
}`,NS=`#define PHONG
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
}`,FS=`#define PHONG
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
}`,OS=`#define STANDARD
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
}`,zS=`#define STANDARD
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
}`,BS=`#define TOON
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
}`,kS=`#define TOON
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
}`,HS=`uniform float size;
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
}`,VS=`uniform vec3 diffuse;
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
}`,GS=`#include <common>
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
}`,WS=`uniform vec3 color;
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
}`,XS=`uniform float rotation;
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
}`,jS=`uniform vec3 diffuse;
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
}`,pt={alphahash_fragment:px,alphahash_pars_fragment:mx,alphamap_fragment:gx,alphamap_pars_fragment:vx,alphatest_fragment:_x,alphatest_pars_fragment:xx,aomap_fragment:yx,aomap_pars_fragment:Sx,batching_pars_vertex:Mx,batching_vertex:Ex,begin_vertex:wx,beginnormal_vertex:Tx,bsdfs:Ax,iridescence_fragment:Cx,bumpmap_pars_fragment:Rx,clipping_planes_fragment:bx,clipping_planes_pars_fragment:Px,clipping_planes_pars_vertex:Lx,clipping_planes_vertex:Dx,color_fragment:Ix,color_pars_fragment:Ux,color_pars_vertex:Nx,color_vertex:Fx,common:Ox,cube_uv_reflection_fragment:zx,defaultnormal_vertex:Bx,displacementmap_pars_vertex:kx,displacementmap_vertex:Hx,emissivemap_fragment:Vx,emissivemap_pars_fragment:Gx,colorspace_fragment:Wx,colorspace_pars_fragment:Xx,envmap_fragment:jx,envmap_common_pars_fragment:$x,envmap_pars_fragment:qx,envmap_pars_vertex:Yx,envmap_physical_pars_fragment:oy,envmap_vertex:Kx,fog_vertex:Zx,fog_pars_vertex:Qx,fog_fragment:Jx,fog_pars_fragment:ey,gradientmap_pars_fragment:ty,lightmap_pars_fragment:ny,lights_lambert_fragment:iy,lights_lambert_pars_fragment:ry,lights_pars_begin:sy,lights_toon_fragment:ay,lights_toon_pars_fragment:ly,lights_phong_fragment:cy,lights_phong_pars_fragment:uy,lights_physical_fragment:fy,lights_physical_pars_fragment:dy,lights_fragment_begin:hy,lights_fragment_maps:py,lights_fragment_end:my,logdepthbuf_fragment:gy,logdepthbuf_pars_fragment:vy,logdepthbuf_pars_vertex:_y,logdepthbuf_vertex:xy,map_fragment:yy,map_pars_fragment:Sy,map_particle_fragment:My,map_particle_pars_fragment:Ey,metalnessmap_fragment:wy,metalnessmap_pars_fragment:Ty,morphinstance_vertex:Ay,morphcolor_vertex:Cy,morphnormal_vertex:Ry,morphtarget_pars_vertex:by,morphtarget_vertex:Py,normal_fragment_begin:Ly,normal_fragment_maps:Dy,normal_pars_fragment:Iy,normal_pars_vertex:Uy,normal_vertex:Ny,normalmap_pars_fragment:Fy,clearcoat_normal_fragment_begin:Oy,clearcoat_normal_fragment_maps:zy,clearcoat_pars_fragment:By,iridescence_pars_fragment:ky,opaque_fragment:Hy,packing:Vy,premultiplied_alpha_fragment:Gy,project_vertex:Wy,dithering_fragment:Xy,dithering_pars_fragment:jy,roughnessmap_fragment:$y,roughnessmap_pars_fragment:qy,shadowmap_pars_fragment:Yy,shadowmap_pars_vertex:Ky,shadowmap_vertex:Zy,shadowmask_pars_fragment:Qy,skinbase_vertex:Jy,skinning_pars_vertex:eS,skinning_vertex:tS,skinnormal_vertex:nS,specularmap_fragment:iS,specularmap_pars_fragment:rS,tonemapping_fragment:sS,tonemapping_pars_fragment:oS,transmission_fragment:aS,transmission_pars_fragment:lS,uv_pars_fragment:cS,uv_pars_vertex:uS,uv_vertex:fS,worldpos_vertex:dS,background_vert:hS,background_frag:pS,backgroundCube_vert:mS,backgroundCube_frag:gS,cube_vert:vS,cube_frag:_S,depth_vert:xS,depth_frag:yS,distanceRGBA_vert:SS,distanceRGBA_frag:MS,equirect_vert:ES,equirect_frag:wS,linedashed_vert:TS,linedashed_frag:AS,meshbasic_vert:CS,meshbasic_frag:RS,meshlambert_vert:bS,meshlambert_frag:PS,meshmatcap_vert:LS,meshmatcap_frag:DS,meshnormal_vert:IS,meshnormal_frag:US,meshphong_vert:NS,meshphong_frag:FS,meshphysical_vert:OS,meshphysical_frag:zS,meshtoon_vert:BS,meshtoon_frag:kS,points_vert:HS,points_frag:VS,shadow_vert:GS,shadow_frag:WS,sprite_vert:XS,sprite_frag:jS},Ue={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ft}},envmap:{envMap:{value:null},envMapRotation:{value:new ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ft},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0},uvTransform:{value:new ft}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ft},alphaMap:{value:null},alphaMapTransform:{value:new ft},alphaTest:{value:0}}},ar={basic:{uniforms:jn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:pt.meshbasic_vert,fragmentShader:pt.meshbasic_frag},lambert:{uniforms:jn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new St(0)}}]),vertexShader:pt.meshlambert_vert,fragmentShader:pt.meshlambert_frag},phong:{uniforms:jn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30}}]),vertexShader:pt.meshphong_vert,fragmentShader:pt.meshphong_frag},standard:{uniforms:jn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag},toon:{uniforms:jn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new St(0)}}]),vertexShader:pt.meshtoon_vert,fragmentShader:pt.meshtoon_frag},matcap:{uniforms:jn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:pt.meshmatcap_vert,fragmentShader:pt.meshmatcap_frag},points:{uniforms:jn([Ue.points,Ue.fog]),vertexShader:pt.points_vert,fragmentShader:pt.points_frag},dashed:{uniforms:jn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pt.linedashed_vert,fragmentShader:pt.linedashed_frag},depth:{uniforms:jn([Ue.common,Ue.displacementmap]),vertexShader:pt.depth_vert,fragmentShader:pt.depth_frag},normal:{uniforms:jn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:pt.meshnormal_vert,fragmentShader:pt.meshnormal_frag},sprite:{uniforms:jn([Ue.sprite,Ue.fog]),vertexShader:pt.sprite_vert,fragmentShader:pt.sprite_frag},background:{uniforms:{uvTransform:{value:new ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pt.background_vert,fragmentShader:pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ft}},vertexShader:pt.backgroundCube_vert,fragmentShader:pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pt.cube_vert,fragmentShader:pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pt.equirect_vert,fragmentShader:pt.equirect_frag},distanceRGBA:{uniforms:jn([Ue.common,Ue.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pt.distanceRGBA_vert,fragmentShader:pt.distanceRGBA_frag},shadow:{uniforms:jn([Ue.lights,Ue.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:pt.shadow_vert,fragmentShader:pt.shadow_frag}};ar.physical={uniforms:jn([ar.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ft},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ft},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ft},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ft},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ft},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ft}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag};const wc={r:0,b:0,g:0},Vs=new cr,$S=new jt;function qS(s,e,n,r,a,c,u){const d=new St(0);let h=c===!0?0:1,m,g,_=null,x=0,S=null;function E(L){let b=L.isScene===!0?L.background:null;return b&&b.isTexture&&(b=(L.backgroundBlurriness>0?n:e).get(b)),b}function w(L){let b=!1;const H=E(L);H===null?v(d,h):H&&H.isColor&&(v(H,1),b=!0);const F=s.xr.getEnvironmentBlendMode();F==="additive"?r.buffers.color.setClear(0,0,0,1,u):F==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,u),(s.autoClear||b)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(L,b){const H=E(b);H&&(H.isCubeTexture||H.mapping===Vc)?(g===void 0&&(g=new An(new la(1,1,1),new ur({name:"BackgroundCubeMaterial",uniforms:sa(ar.backgroundCube.uniforms),vertexShader:ar.backgroundCube.vertexShader,fragmentShader:ar.backgroundCube.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(F,N,G){this.matrixWorld.copyPosition(G.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(g)),Vs.copy(b.backgroundRotation),Vs.x*=-1,Vs.y*=-1,Vs.z*=-1,H.isCubeTexture&&H.isRenderTargetTexture===!1&&(Vs.y*=-1,Vs.z*=-1),g.material.uniforms.envMap.value=H,g.material.uniforms.flipEnvMap.value=H.isCubeTexture&&H.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4($S.makeRotationFromEuler(Vs)),g.material.toneMapped=Dt.getTransfer(H.colorSpace)!==kt,(_!==H||x!==H.version||S!==s.toneMapping)&&(g.material.needsUpdate=!0,_=H,x=H.version,S=s.toneMapping),g.layers.enableAll(),L.unshift(g,g.geometry,g.material,0,0,null)):H&&H.isTexture&&(m===void 0&&(m=new An(new oa(2,2),new ur({name:"BackgroundMaterial",uniforms:sa(ar.background.uniforms),vertexShader:ar.background.vertexShader,fragmentShader:ar.background.fragmentShader,side:vs,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=H,m.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,m.material.toneMapped=Dt.getTransfer(H.colorSpace)!==kt,H.matrixAutoUpdate===!0&&H.updateMatrix(),m.material.uniforms.uvTransform.value.copy(H.matrix),(_!==H||x!==H.version||S!==s.toneMapping)&&(m.material.needsUpdate=!0,_=H,x=H.version,S=s.toneMapping),m.layers.enableAll(),L.unshift(m,m.geometry,m.material,0,0,null))}function v(L,b){L.getRGB(wc,r0(s)),r.buffers.color.setClear(wc.r,wc.g,wc.b,b,u)}function I(){g!==void 0&&(g.geometry.dispose(),g.material.dispose()),m!==void 0&&(m.geometry.dispose(),m.material.dispose())}return{getClearColor:function(){return d},setClearColor:function(L,b=1){d.set(L),h=b,v(d,h)},getClearAlpha:function(){return h},setClearAlpha:function(L){h=L,v(d,h)},render:w,addToRenderList:y,dispose:I}}function YS(s,e){const n=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=x(null);let c=a,u=!1;function d(C,z,ie,Z,ue){let me=!1;const ae=_(Z,ie,z);c!==ae&&(c=ae,m(c.object)),me=S(C,Z,ie,ue),me&&E(C,Z,ie,ue),ue!==null&&e.update(ue,s.ELEMENT_ARRAY_BUFFER),(me||u)&&(u=!1,b(C,z,ie,Z),ue!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ue).buffer))}function h(){return s.createVertexArray()}function m(C){return s.bindVertexArray(C)}function g(C){return s.deleteVertexArray(C)}function _(C,z,ie){const Z=ie.wireframe===!0;let ue=r[C.id];ue===void 0&&(ue={},r[C.id]=ue);let me=ue[z.id];me===void 0&&(me={},ue[z.id]=me);let ae=me[Z];return ae===void 0&&(ae=x(h()),me[Z]=ae),ae}function x(C){const z=[],ie=[],Z=[];for(let ue=0;ue<n;ue++)z[ue]=0,ie[ue]=0,Z[ue]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:ie,attributeDivisors:Z,object:C,attributes:{},index:null}}function S(C,z,ie,Z){const ue=c.attributes,me=z.attributes;let ae=0;const he=ie.getAttributes();for(const k in he)if(he[k].location>=0){const oe=ue[k];let U=me[k];if(U===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(U=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(U=C.instanceColor)),oe===void 0||oe.attribute!==U||U&&oe.data!==U.data)return!0;ae++}return c.attributesNum!==ae||c.index!==Z}function E(C,z,ie,Z){const ue={},me=z.attributes;let ae=0;const he=ie.getAttributes();for(const k in he)if(he[k].location>=0){let oe=me[k];oe===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(oe=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(oe=C.instanceColor));const U={};U.attribute=oe,oe&&oe.data&&(U.data=oe.data),ue[k]=U,ae++}c.attributes=ue,c.attributesNum=ae,c.index=Z}function w(){const C=c.newAttributes;for(let z=0,ie=C.length;z<ie;z++)C[z]=0}function y(C){v(C,0)}function v(C,z){const ie=c.newAttributes,Z=c.enabledAttributes,ue=c.attributeDivisors;ie[C]=1,Z[C]===0&&(s.enableVertexAttribArray(C),Z[C]=1),ue[C]!==z&&(s.vertexAttribDivisor(C,z),ue[C]=z)}function I(){const C=c.newAttributes,z=c.enabledAttributes;for(let ie=0,Z=z.length;ie<Z;ie++)z[ie]!==C[ie]&&(s.disableVertexAttribArray(ie),z[ie]=0)}function L(C,z,ie,Z,ue,me,ae){ae===!0?s.vertexAttribIPointer(C,z,ie,ue,me):s.vertexAttribPointer(C,z,ie,Z,ue,me)}function b(C,z,ie,Z){w();const ue=Z.attributes,me=ie.getAttributes(),ae=z.defaultAttributeValues;for(const he in me){const k=me[he];if(k.location>=0){let de=ue[he];if(de===void 0&&(he==="instanceMatrix"&&C.instanceMatrix&&(de=C.instanceMatrix),he==="instanceColor"&&C.instanceColor&&(de=C.instanceColor)),de!==void 0){const oe=de.normalized,U=de.itemSize,se=e.get(de);if(se===void 0)continue;const Fe=se.buffer,te=se.type,pe=se.bytesPerElement,we=te===s.INT||te===s.UNSIGNED_INT||de.gpuType===jd;if(de.isInterleavedBufferAttribute){const xe=de.data,Le=xe.stride,ve=de.offset;if(xe.isInstancedInterleavedBuffer){for(let Ze=0;Ze<k.locationSize;Ze++)v(k.location+Ze,xe.meshPerAttribute);C.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let Ze=0;Ze<k.locationSize;Ze++)y(k.location+Ze);s.bindBuffer(s.ARRAY_BUFFER,Fe);for(let Ze=0;Ze<k.locationSize;Ze++)L(k.location+Ze,U/k.locationSize,te,oe,Le*pe,(ve+U/k.locationSize*Ze)*pe,we)}else{if(de.isInstancedBufferAttribute){for(let xe=0;xe<k.locationSize;xe++)v(k.location+xe,de.meshPerAttribute);C.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let xe=0;xe<k.locationSize;xe++)y(k.location+xe);s.bindBuffer(s.ARRAY_BUFFER,Fe);for(let xe=0;xe<k.locationSize;xe++)L(k.location+xe,U/k.locationSize,te,oe,U*pe,U/k.locationSize*xe*pe,we)}}else if(ae!==void 0){const oe=ae[he];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(k.location,oe);break;case 3:s.vertexAttrib3fv(k.location,oe);break;case 4:s.vertexAttrib4fv(k.location,oe);break;default:s.vertexAttrib1fv(k.location,oe)}}}}I()}function H(){G();for(const C in r){const z=r[C];for(const ie in z){const Z=z[ie];for(const ue in Z)g(Z[ue].object),delete Z[ue];delete z[ie]}delete r[C]}}function F(C){if(r[C.id]===void 0)return;const z=r[C.id];for(const ie in z){const Z=z[ie];for(const ue in Z)g(Z[ue].object),delete Z[ue];delete z[ie]}delete r[C.id]}function N(C){for(const z in r){const ie=r[z];if(ie[C.id]===void 0)continue;const Z=ie[C.id];for(const ue in Z)g(Z[ue].object),delete Z[ue];delete ie[C.id]}}function G(){R(),u=!0,c!==a&&(c=a,m(c.object))}function R(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:d,reset:G,resetDefaultState:R,dispose:H,releaseStatesOfGeometry:F,releaseStatesOfProgram:N,initAttributes:w,enableAttribute:y,disableUnusedAttributes:I}}function KS(s,e,n){let r;function a(m){r=m}function c(m,g){s.drawArrays(r,m,g),n.update(g,r,1)}function u(m,g,_){_!==0&&(s.drawArraysInstanced(r,m,g,_),n.update(g,r,_))}function d(m,g,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,g,0,_);let S=0;for(let E=0;E<_;E++)S+=g[E];n.update(S,r,1)}function h(m,g,_,x){if(_===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let E=0;E<m.length;E++)u(m[E],g[E],x[E]);else{S.multiDrawArraysInstancedWEBGL(r,m,0,g,0,x,0,_);let E=0;for(let w=0;w<_;w++)E+=g[w]*x[w];n.update(E,r,1)}}this.setMode=a,this.render=c,this.renderInstances=u,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function ZS(s,e,n,r){let a;function c(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const N=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function u(N){return!(N!==qi&&r.convert(N)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(N){const G=N===Ka&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(N!==Nr&&r.convert(N)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&N!==Dr&&!G)}function h(N){if(N==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=n.precision!==void 0?n.precision:"highp";const g=h(m);g!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",g,"instead."),m=g);const _=n.logarithmicDepthBuffer===!0,x=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=s.getParameter(s.MAX_TEXTURE_SIZE),y=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),I=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),L=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),H=E>0,F=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:h,textureFormatReadable:u,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:_,reverseDepthBuffer:x,maxTextures:S,maxVertexTextures:E,maxTextureSize:w,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:I,maxVaryings:L,maxFragmentUniforms:b,vertexTextures:H,maxSamples:F}}function QS(s){const e=this;let n=null,r=0,a=!1,c=!1;const u=new Xs,d=new ft,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(_,x){const S=_.length!==0||x||r!==0||a;return a=x,r=_.length,S},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,x){n=g(_,x,0)},this.setState=function(_,x,S){const E=_.clippingPlanes,w=_.clipIntersection,y=_.clipShadows,v=s.get(_);if(!a||E===null||E.length===0||c&&!y)c?g(null):m();else{const I=c?0:r,L=I*4;let b=v.clippingState||null;h.value=b,b=g(E,x,L,S);for(let H=0;H!==L;++H)b[H]=n[H];v.clippingState=b,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=I}};function m(){h.value!==n&&(h.value=n,h.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function g(_,x,S,E){const w=_!==null?_.length:0;let y=null;if(w!==0){if(y=h.value,E!==!0||y===null){const v=S+w*4,I=x.matrixWorldInverse;d.getNormalMatrix(I),(y===null||y.length<v)&&(y=new Float32Array(v));for(let L=0,b=S;L!==w;++L,b+=4)u.copy(_[L]).applyMatrix4(I,d),u.normal.toArray(y,b),y[b+3]=u.constant}h.value=y,h.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,y}}function JS(s){let e=new WeakMap;function n(u,d){return d===cd?u.mapping=ea:d===ud&&(u.mapping=ta),u}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===cd||d===ud)if(e.has(u)){const h=e.get(u).texture;return n(h,u.mapping)}else{const h=u.image;if(h&&h.height>0){const m=new J_(h.height);return m.fromEquirectangularTexture(s,u),e.set(u,m),u.addEventListener("dispose",a),n(m.texture,u.mapping)}else return null}}return u}function a(u){const d=u.target;d.removeEventListener("dispose",a);const h=e.get(d);h!==void 0&&(e.delete(d),h.dispose())}function c(){e=new WeakMap}return{get:r,dispose:c}}const Yo=4,cg=[.125,.215,.35,.446,.526,.582],qs=20,$f=new f0,ug=new St;let qf=null,Yf=0,Kf=0,Zf=!1;const js=(1+Math.sqrt(5))/2,Xo=1/js,fg=[new j(-js,Xo,0),new j(js,Xo,0),new j(-Xo,0,js),new j(Xo,0,js),new j(0,js,-Xo),new j(0,js,Xo),new j(-1,1,-1),new j(1,1,-1),new j(-1,1,1),new j(1,1,1)];class dg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,r=.1,a=100){qf=this._renderer.getRenderTarget(),Yf=this._renderer.getActiveCubeFace(),Kf=this._renderer.getActiveMipmapLevel(),Zf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,r,a,c),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qf,Yf,Kf),this._renderer.xr.enabled=Zf,e.scissorTest=!1,Tc(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ea||e.mapping===ta?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qf=this._renderer.getRenderTarget(),Yf=this._renderer.getActiveCubeFace(),Kf=this._renderer.getActiveMipmapLevel(),Zf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=n||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,r={magFilter:lr,minFilter:lr,generateMipmaps:!1,type:Ka,format:qi,colorSpace:ra,depthBuffer:!1},a=hg(e,n,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hg(e,n,r);const{_lodMax:c}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=eM(c)),this._blurMaterial=tM(c,e,n)}return a}_compileMaterial(e){const n=new An(this._lodPlanes[0],e);this._renderer.compile(n,$f)}_sceneToCubeUV(e,n,r,a){const d=new Ri(90,1,n,r),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],g=this._renderer,_=g.autoClear,x=g.toneMapping;g.getClearColor(ug),g.toneMapping=gs,g.autoClear=!1;const S=new ps({name:"PMREM.Background",side:si,depthWrite:!1,depthTest:!1}),E=new An(new la,S);let w=!1;const y=e.background;y?y.isColor&&(S.color.copy(y),e.background=null,w=!0):(S.color.copy(ug),w=!0);for(let v=0;v<6;v++){const I=v%3;I===0?(d.up.set(0,h[v],0),d.lookAt(m[v],0,0)):I===1?(d.up.set(0,0,h[v]),d.lookAt(0,m[v],0)):(d.up.set(0,h[v],0),d.lookAt(0,0,m[v]));const L=this._cubeSize;Tc(a,I*L,v>2?L:0,L,L),g.setRenderTarget(a),w&&g.render(E,d),g.render(e,d)}E.geometry.dispose(),E.material.dispose(),g.toneMapping=x,g.autoClear=_,e.background=y}_textureToCubeUV(e,n){const r=this._renderer,a=e.mapping===ea||e.mapping===ta;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=mg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pg());const c=a?this._cubemapMaterial:this._equirectMaterial,u=new An(this._lodPlanes[0],c),d=c.uniforms;d.envMap.value=e;const h=this._cubeSize;Tc(n,0,0,3*h,2*h),r.setRenderTarget(n),r.render(u,$f)}_applyPMREM(e){const n=this._renderer,r=n.autoClear;n.autoClear=!1;const a=this._lodPlanes.length;for(let c=1;c<a;c++){const u=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),d=fg[(a-c-1)%fg.length];this._blur(e,c-1,c,u,d)}n.autoClear=r}_blur(e,n,r,a,c){const u=this._pingPongRenderTarget;this._halfBlur(e,u,n,r,a,"latitudinal",c),this._halfBlur(u,e,r,r,a,"longitudinal",c)}_halfBlur(e,n,r,a,c,u,d){const h=this._renderer,m=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,_=new An(this._lodPlanes[a],m),x=m.uniforms,S=this._sizeLods[r]-1,E=isFinite(c)?Math.PI/(2*S):2*Math.PI/(2*qs-1),w=c/E,y=isFinite(c)?1+Math.floor(g*w):qs;y>qs&&console.warn(`sigmaRadians, ${c}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${qs}`);const v=[];let I=0;for(let N=0;N<qs;++N){const G=N/w,R=Math.exp(-G*G/2);v.push(R),N===0?I+=R:N<y&&(I+=2*R)}for(let N=0;N<v.length;N++)v[N]=v[N]/I;x.envMap.value=e.texture,x.samples.value=y,x.weights.value=v,x.latitudinal.value=u==="latitudinal",d&&(x.poleAxis.value=d);const{_lodMax:L}=this;x.dTheta.value=E,x.mipInt.value=L-r;const b=this._sizeLods[a],H=3*b*(a>L-Yo?a-L+Yo:0),F=4*(this._cubeSize-b);Tc(n,H,F,3*b,2*b),h.setRenderTarget(n),h.render(_,$f)}}function eM(s){const e=[],n=[],r=[];let a=s;const c=s-Yo+1+cg.length;for(let u=0;u<c;u++){const d=Math.pow(2,a);n.push(d);let h=1/d;u>s-Yo?h=cg[u-s+Yo-1]:u===0&&(h=0),r.push(h);const m=1/(d-2),g=-m,_=1+m,x=[g,g,_,g,_,_,g,g,_,_,g,_],S=6,E=6,w=3,y=2,v=1,I=new Float32Array(w*E*S),L=new Float32Array(y*E*S),b=new Float32Array(v*E*S);for(let F=0;F<S;F++){const N=F%3*2/3-1,G=F>2?0:-1,R=[N,G,0,N+2/3,G,0,N+2/3,G+1,0,N,G,0,N+2/3,G+1,0,N,G+1,0];I.set(R,w*E*F),L.set(x,y*E*F);const C=[F,F,F,F,F,F];b.set(C,v*E*F)}const H=new en;H.setAttribute("position",new kn(I,w)),H.setAttribute("uv",new kn(L,y)),H.setAttribute("faceIndex",new kn(b,v)),e.push(H),a>Yo&&a--}return{lodPlanes:e,sizeLods:n,sigmas:r}}function hg(s,e,n){const r=new to(s,e,n);return r.texture.mapping=Vc,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Tc(s,e,n,r,a){s.viewport.set(e,n,r,a),s.scissor.set(e,n,r,a)}function tM(s,e,n){const r=new Float32Array(qs),a=new j(0,1,0);return new ur({name:"SphericalGaussianBlur",defines:{n:qs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ih(),fragmentShader:`

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
		`,blending:ms,depthTest:!1,depthWrite:!1})}function pg(){return new ur({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ih(),fragmentShader:`

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
		`,blending:ms,depthTest:!1,depthWrite:!1})}function mg(){return new ur({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ih(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ms,depthTest:!1,depthWrite:!1})}function ih(){return`

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
	`}function nM(s){let e=new WeakMap,n=null;function r(d){if(d&&d.isTexture){const h=d.mapping,m=h===cd||h===ud,g=h===ea||h===ta;if(m||g){let _=e.get(d);const x=_!==void 0?_.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==x)return n===null&&(n=new dg(s)),_=m?n.fromEquirectangular(d,_):n.fromCubemap(d,_),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),_.texture;if(_!==void 0)return _.texture;{const S=d.image;return m&&S&&S.height>0||g&&S&&a(S)?(n===null&&(n=new dg(s)),_=m?n.fromEquirectangular(d):n.fromCubemap(d),_.texture.pmremVersion=d.pmremVersion,e.set(d,_),d.addEventListener("dispose",c),_.texture):null}}}return d}function a(d){let h=0;const m=6;for(let g=0;g<m;g++)d[g]!==void 0&&h++;return h===m}function c(d){const h=d.target;h.removeEventListener("dispose",c);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function u(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:u}}function iM(s){const e={};function n(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return n(r)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(r){const a=n(r);return a===null&&$o("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function rM(s,e,n,r){const a={},c=new WeakMap;function u(_){const x=_.target;x.index!==null&&e.remove(x.index);for(const E in x.attributes)e.remove(x.attributes[E]);x.removeEventListener("dispose",u),delete a[x.id];const S=c.get(x);S&&(e.remove(S),c.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,n.memory.geometries--}function d(_,x){return a[x.id]===!0||(x.addEventListener("dispose",u),a[x.id]=!0,n.memory.geometries++),x}function h(_){const x=_.attributes;for(const S in x)e.update(x[S],s.ARRAY_BUFFER)}function m(_){const x=[],S=_.index,E=_.attributes.position;let w=0;if(S!==null){const I=S.array;w=S.version;for(let L=0,b=I.length;L<b;L+=3){const H=I[L+0],F=I[L+1],N=I[L+2];x.push(H,F,F,N,N,H)}}else if(E!==void 0){const I=E.array;w=E.version;for(let L=0,b=I.length/3-1;L<b;L+=3){const H=L+0,F=L+1,N=L+2;x.push(H,F,F,N,N,H)}}else return;const y=new(Qg(x)?i0:n0)(x,1);y.version=w;const v=c.get(_);v&&e.remove(v),c.set(_,y)}function g(_){const x=c.get(_);if(x){const S=_.index;S!==null&&x.version<S.version&&m(_)}else m(_);return c.get(_)}return{get:d,update:h,getWireframeAttribute:g}}function sM(s,e,n){let r;function a(x){r=x}let c,u;function d(x){c=x.type,u=x.bytesPerElement}function h(x,S){s.drawElements(r,S,c,x*u),n.update(S,r,1)}function m(x,S,E){E!==0&&(s.drawElementsInstanced(r,S,c,x*u,E),n.update(S,r,E))}function g(x,S,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,S,0,c,x,0,E);let y=0;for(let v=0;v<E;v++)y+=S[v];n.update(y,r,1)}function _(x,S,E,w){if(E===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let v=0;v<x.length;v++)m(x[v]/u,S[v],w[v]);else{y.multiDrawElementsInstancedWEBGL(r,S,0,c,x,0,w,0,E);let v=0;for(let I=0;I<E;I++)v+=S[I]*w[I];n.update(v,r,1)}}this.setMode=a,this.setIndex=d,this.render=h,this.renderInstances=m,this.renderMultiDraw=g,this.renderMultiDrawInstances=_}function oM(s){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(c,u,d){switch(n.calls++,u){case s.TRIANGLES:n.triangles+=d*(c/3);break;case s.LINES:n.lines+=d*(c/2);break;case s.LINE_STRIP:n.lines+=d*(c-1);break;case s.LINE_LOOP:n.lines+=d*c;break;case s.POINTS:n.points+=d*c;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function a(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:a,update:r}}function aM(s,e,n){const r=new WeakMap,a=new sn;function c(u,d,h){const m=u.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,_=g!==void 0?g.length:0;let x=r.get(d);if(x===void 0||x.count!==_){let C=function(){G.dispose(),r.delete(d),d.removeEventListener("dispose",C)};var S=C;x!==void 0&&x.texture.dispose();const E=d.morphAttributes.position!==void 0,w=d.morphAttributes.normal!==void 0,y=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],I=d.morphAttributes.normal||[],L=d.morphAttributes.color||[];let b=0;E===!0&&(b=1),w===!0&&(b=2),y===!0&&(b=3);let H=d.attributes.position.count*b,F=1;H>e.maxTextureSize&&(F=Math.ceil(H/e.maxTextureSize),H=e.maxTextureSize);const N=new Float32Array(H*F*4*_),G=new e0(N,H,F,_);G.type=Dr,G.needsUpdate=!0;const R=b*4;for(let z=0;z<_;z++){const ie=v[z],Z=I[z],ue=L[z],me=H*F*4*z;for(let ae=0;ae<ie.count;ae++){const he=ae*R;E===!0&&(a.fromBufferAttribute(ie,ae),N[me+he+0]=a.x,N[me+he+1]=a.y,N[me+he+2]=a.z,N[me+he+3]=0),w===!0&&(a.fromBufferAttribute(Z,ae),N[me+he+4]=a.x,N[me+he+5]=a.y,N[me+he+6]=a.z,N[me+he+7]=0),y===!0&&(a.fromBufferAttribute(ue,ae),N[me+he+8]=a.x,N[me+he+9]=a.y,N[me+he+10]=a.z,N[me+he+11]=ue.itemSize===4?a.w:1)}}x={count:_,texture:G,size:new Ct(H,F)},r.set(d,x),d.addEventListener("dispose",C)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",u.morphTexture,n);else{let E=0;for(let y=0;y<m.length;y++)E+=m[y];const w=d.morphTargetsRelative?1:1-E;h.getUniforms().setValue(s,"morphTargetBaseInfluence",w),h.getUniforms().setValue(s,"morphTargetInfluences",m)}h.getUniforms().setValue(s,"morphTargetsTexture",x.texture,n),h.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}return{update:c}}function lM(s,e,n,r){let a=new WeakMap;function c(h){const m=r.render.frame,g=h.geometry,_=e.get(h,g);if(a.get(_)!==m&&(e.update(_),a.set(_,m)),h.isInstancedMesh&&(h.hasEventListener("dispose",d)===!1&&h.addEventListener("dispose",d),a.get(h)!==m&&(n.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&n.update(h.instanceColor,s.ARRAY_BUFFER),a.set(h,m))),h.isSkinnedMesh){const x=h.skeleton;a.get(x)!==m&&(x.update(),a.set(x,m))}return _}function u(){a=new WeakMap}function d(h){const m=h.target;m.removeEventListener("dispose",d),n.remove(m.instanceMatrix),m.instanceColor!==null&&n.remove(m.instanceColor)}return{update:c,dispose:u}}const h0=new oi,gg=new c0(1,1),p0=new e0,m0=new z_,g0=new a0,vg=[],_g=[],xg=new Float32Array(16),yg=new Float32Array(9),Sg=new Float32Array(4);function ca(s,e,n){const r=s[0];if(r<=0||r>0)return s;const a=e*n;let c=vg[a];if(c===void 0&&(c=new Float32Array(a),vg[a]=c),e!==0){r.toArray(c,0);for(let u=1,d=0;u!==e;++u)d+=n,s[u].toArray(c,d)}return c}function xn(s,e){if(s.length!==e.length)return!1;for(let n=0,r=s.length;n<r;n++)if(s[n]!==e[n])return!1;return!0}function yn(s,e){for(let n=0,r=e.length;n<r;n++)s[n]=e[n]}function Wc(s,e){let n=_g[e];n===void 0&&(n=new Int32Array(e),_g[e]=n);for(let r=0;r!==e;++r)n[r]=s.allocateTextureUnit();return n}function cM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1f(this.addr,e),n[0]=e)}function uM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(xn(n,e))return;s.uniform2fv(this.addr,e),yn(n,e)}}function fM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(xn(n,e))return;s.uniform3fv(this.addr,e),yn(n,e)}}function dM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(xn(n,e))return;s.uniform4fv(this.addr,e),yn(n,e)}}function hM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(xn(n,e))return;s.uniformMatrix2fv(this.addr,!1,e),yn(n,e)}else{if(xn(n,r))return;Sg.set(r),s.uniformMatrix2fv(this.addr,!1,Sg),yn(n,r)}}function pM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(xn(n,e))return;s.uniformMatrix3fv(this.addr,!1,e),yn(n,e)}else{if(xn(n,r))return;yg.set(r),s.uniformMatrix3fv(this.addr,!1,yg),yn(n,r)}}function mM(s,e){const n=this.cache,r=e.elements;if(r===void 0){if(xn(n,e))return;s.uniformMatrix4fv(this.addr,!1,e),yn(n,e)}else{if(xn(n,r))return;xg.set(r),s.uniformMatrix4fv(this.addr,!1,xg),yn(n,r)}}function gM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1i(this.addr,e),n[0]=e)}function vM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(xn(n,e))return;s.uniform2iv(this.addr,e),yn(n,e)}}function _M(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(xn(n,e))return;s.uniform3iv(this.addr,e),yn(n,e)}}function xM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(xn(n,e))return;s.uniform4iv(this.addr,e),yn(n,e)}}function yM(s,e){const n=this.cache;n[0]!==e&&(s.uniform1ui(this.addr,e),n[0]=e)}function SM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(xn(n,e))return;s.uniform2uiv(this.addr,e),yn(n,e)}}function MM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(xn(n,e))return;s.uniform3uiv(this.addr,e),yn(n,e)}}function EM(s,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(xn(n,e))return;s.uniform4uiv(this.addr,e),yn(n,e)}}function wM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let c;this.type===s.SAMPLER_2D_SHADOW?(gg.compareFunction=Zg,c=gg):c=h0,n.setTexture2D(e||c,a)}function TM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture3D(e||m0,a)}function AM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTextureCube(e||g0,a)}function CM(s,e,n){const r=this.cache,a=n.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),n.setTexture2DArray(e||p0,a)}function RM(s){switch(s){case 5126:return cM;case 35664:return uM;case 35665:return fM;case 35666:return dM;case 35674:return hM;case 35675:return pM;case 35676:return mM;case 5124:case 35670:return gM;case 35667:case 35671:return vM;case 35668:case 35672:return _M;case 35669:case 35673:return xM;case 5125:return yM;case 36294:return SM;case 36295:return MM;case 36296:return EM;case 35678:case 36198:case 36298:case 36306:case 35682:return wM;case 35679:case 36299:case 36307:return TM;case 35680:case 36300:case 36308:case 36293:return AM;case 36289:case 36303:case 36311:case 36292:return CM}}function bM(s,e){s.uniform1fv(this.addr,e)}function PM(s,e){const n=ca(e,this.size,2);s.uniform2fv(this.addr,n)}function LM(s,e){const n=ca(e,this.size,3);s.uniform3fv(this.addr,n)}function DM(s,e){const n=ca(e,this.size,4);s.uniform4fv(this.addr,n)}function IM(s,e){const n=ca(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,n)}function UM(s,e){const n=ca(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,n)}function NM(s,e){const n=ca(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,n)}function FM(s,e){s.uniform1iv(this.addr,e)}function OM(s,e){s.uniform2iv(this.addr,e)}function zM(s,e){s.uniform3iv(this.addr,e)}function BM(s,e){s.uniform4iv(this.addr,e)}function kM(s,e){s.uniform1uiv(this.addr,e)}function HM(s,e){s.uniform2uiv(this.addr,e)}function VM(s,e){s.uniform3uiv(this.addr,e)}function GM(s,e){s.uniform4uiv(this.addr,e)}function WM(s,e,n){const r=this.cache,a=e.length,c=Wc(n,a);xn(r,c)||(s.uniform1iv(this.addr,c),yn(r,c));for(let u=0;u!==a;++u)n.setTexture2D(e[u]||h0,c[u])}function XM(s,e,n){const r=this.cache,a=e.length,c=Wc(n,a);xn(r,c)||(s.uniform1iv(this.addr,c),yn(r,c));for(let u=0;u!==a;++u)n.setTexture3D(e[u]||m0,c[u])}function jM(s,e,n){const r=this.cache,a=e.length,c=Wc(n,a);xn(r,c)||(s.uniform1iv(this.addr,c),yn(r,c));for(let u=0;u!==a;++u)n.setTextureCube(e[u]||g0,c[u])}function $M(s,e,n){const r=this.cache,a=e.length,c=Wc(n,a);xn(r,c)||(s.uniform1iv(this.addr,c),yn(r,c));for(let u=0;u!==a;++u)n.setTexture2DArray(e[u]||p0,c[u])}function qM(s){switch(s){case 5126:return bM;case 35664:return PM;case 35665:return LM;case 35666:return DM;case 35674:return IM;case 35675:return UM;case 35676:return NM;case 5124:case 35670:return FM;case 35667:case 35671:return OM;case 35668:case 35672:return zM;case 35669:case 35673:return BM;case 5125:return kM;case 36294:return HM;case 36295:return VM;case 36296:return GM;case 35678:case 36198:case 36298:case 36306:case 35682:return WM;case 35679:case 36299:case 36307:return XM;case 35680:case 36300:case 36308:case 36293:return jM;case 36289:case 36303:case 36311:case 36292:return $M}}class YM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.setValue=RM(n.type)}}class KM{constructor(e,n,r){this.id=e,this.addr=r,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=qM(n.type)}}class ZM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,r){const a=this.seq;for(let c=0,u=a.length;c!==u;++c){const d=a[c];d.setValue(e,n[d.id],r)}}}const Qf=/(\w+)(\])?(\[|\.)?/g;function Mg(s,e){s.seq.push(e),s.map[e.id]=e}function QM(s,e,n){const r=s.name,a=r.length;for(Qf.lastIndex=0;;){const c=Qf.exec(r),u=Qf.lastIndex;let d=c[1];const h=c[2]==="]",m=c[3];if(h&&(d=d|0),m===void 0||m==="["&&u+2===a){Mg(n,m===void 0?new YM(d,s,e):new KM(d,s,e));break}else{let _=n.map[d];_===void 0&&(_=new ZM(d),Mg(n,_)),n=_}}}class Ic{constructor(e,n){this.seq=[],this.map={};const r=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const c=e.getActiveUniform(n,a),u=e.getUniformLocation(n,c.name);QM(c,u,this)}}setValue(e,n,r,a){const c=this.map[n];c!==void 0&&c.setValue(e,r,a)}setOptional(e,n,r){const a=n[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,n,r,a){for(let c=0,u=n.length;c!==u;++c){const d=n[c],h=r[d.id];h.needsUpdate!==!1&&d.setValue(e,h.value,a)}}static seqWithValue(e,n){const r=[];for(let a=0,c=e.length;a!==c;++a){const u=e[a];u.id in n&&r.push(u)}return r}}function Eg(s,e,n){const r=s.createShader(e);return s.shaderSource(r,n),s.compileShader(r),r}const JM=37297;let eE=0;function tE(s,e){const n=s.split(`
`),r=[],a=Math.max(e-6,0),c=Math.min(e+6,n.length);for(let u=a;u<c;u++){const d=u+1;r.push(`${d===e?">":" "} ${d}: ${n[u]}`)}return r.join(`
`)}const wg=new ft;function nE(s){Dt._getMatrix(wg,Dt.workingColorSpace,s);const e=`mat3( ${wg.elements.map(n=>n.toFixed(4))} )`;switch(Dt.getTransfer(s)){case Nc:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Tg(s,e,n){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const c=/ERROR: 0:(\d+)/.exec(a);if(c){const u=parseInt(c[1]);return n.toUpperCase()+`

`+a+`

`+tE(s.getShaderSource(e),u)}else return a}function iE(s,e){const n=nE(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function rE(s,e){let n;switch(e){case u_:n="Linear";break;case f_:n="Reinhard";break;case d_:n="Cineon";break;case h_:n="ACESFilmic";break;case m_:n="AgX";break;case g_:n="Neutral";break;case p_:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+s+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Ac=new j;function sE(){Dt.getLuminanceCoefficients(Ac);const s=Ac.x.toFixed(4),e=Ac.y.toFixed(4),n=Ac.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function oE(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($a).join(`
`)}function aE(s){const e=[];for(const n in s){const r=s[n];r!==!1&&e.push("#define "+n+" "+r)}return e.join(`
`)}function lE(s,e){const n={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const c=s.getActiveAttrib(e,a),u=c.name;let d=1;c.type===s.FLOAT_MAT2&&(d=2),c.type===s.FLOAT_MAT3&&(d=3),c.type===s.FLOAT_MAT4&&(d=4),n[u]={type:c.type,location:s.getAttribLocation(e,u),locationSize:d}}return n}function $a(s){return s!==""}function Ag(s,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Cg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const cE=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vd(s){return s.replace(cE,fE)}const uE=new Map;function fE(s,e){let n=pt[e];if(n===void 0){const r=uE.get(e);if(r!==void 0)n=pt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return Vd(n)}const dE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rg(s){return s.replace(dE,hE)}function hE(s,e,n,r){let a="";for(let c=parseInt(e);c<parseInt(n);c++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return a}function bg(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function pE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===zg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Gv?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Pr&&(e="SHADOWMAP_TYPE_VSM"),e}function mE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ea:case ta:e="ENVMAP_TYPE_CUBE";break;case Vc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function gE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ta:e="ENVMAP_MODE_REFRACTION";break}return e}function vE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Xd:e="ENVMAP_BLENDING_MULTIPLY";break;case l_:e="ENVMAP_BLENDING_MIX";break;case c_:e="ENVMAP_BLENDING_ADD";break}return e}function _E(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:r,maxMip:n}}function xE(s,e,n,r){const a=s.getContext(),c=n.defines;let u=n.vertexShader,d=n.fragmentShader;const h=pE(n),m=mE(n),g=gE(n),_=vE(n),x=_E(n),S=oE(n),E=aE(c),w=a.createProgram();let y,v,I=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(y=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter($a).join(`
`),y.length>0&&(y+=`
`),v=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E].filter($a).join(`
`),v.length>0&&(v+=`
`)):(y=[bg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+g:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($a).join(`
`),v=[bg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,E,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+m:"",n.envMap?"#define "+g:"",n.envMap?"#define "+_:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+h:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==gs?"#define TONE_MAPPING":"",n.toneMapping!==gs?pt.tonemapping_pars_fragment:"",n.toneMapping!==gs?rE("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",pt.colorspace_pars_fragment,iE("linearToOutputTexel",n.outputColorSpace),sE(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter($a).join(`
`)),u=Vd(u),u=Ag(u,n),u=Cg(u,n),d=Vd(d),d=Ag(d,n),d=Cg(d,n),u=Rg(u),d=Rg(d),n.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,y=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,v=["#define varying in",n.glslVersion===Rm?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Rm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const L=I+y+u,b=I+v+d,H=Eg(a,a.VERTEX_SHADER,L),F=Eg(a,a.FRAGMENT_SHADER,b);a.attachShader(w,H),a.attachShader(w,F),n.index0AttributeName!==void 0?a.bindAttribLocation(w,0,n.index0AttributeName):n.morphTargets===!0&&a.bindAttribLocation(w,0,"position"),a.linkProgram(w);function N(z){if(s.debug.checkShaderErrors){const ie=a.getProgramInfoLog(w).trim(),Z=a.getShaderInfoLog(H).trim(),ue=a.getShaderInfoLog(F).trim();let me=!0,ae=!0;if(a.getProgramParameter(w,a.LINK_STATUS)===!1)if(me=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,w,H,F);else{const he=Tg(a,H,"vertex"),k=Tg(a,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(w,a.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+ie+`
`+he+`
`+k)}else ie!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ie):(Z===""||ue==="")&&(ae=!1);ae&&(z.diagnostics={runnable:me,programLog:ie,vertexShader:{log:Z,prefix:y},fragmentShader:{log:ue,prefix:v}})}a.deleteShader(H),a.deleteShader(F),G=new Ic(a,w),R=lE(a,w)}let G;this.getUniforms=function(){return G===void 0&&N(this),G};let R;this.getAttributes=function(){return R===void 0&&N(this),R};let C=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=a.getProgramParameter(w,JM)),C},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(w),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=eE++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=H,this.fragmentShader=F,this}let yE=0;class SE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(n),c=this._getShaderStage(r),u=this._getShaderCacheForMaterial(e);return u.has(a)===!1&&(u.add(a),a.usedTimes++),u.has(c)===!1&&(u.add(c),c.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const r of n)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let r=n.get(e);return r===void 0&&(r=new Set,n.set(e,r)),r}_getShaderStage(e){const n=this.shaderCache;let r=n.get(e);return r===void 0&&(r=new ME(e),n.set(e,r)),r}}class ME{constructor(e){this.id=yE++,this.code=e,this.usedTimes=0}}function EE(s,e,n,r,a,c,u){const d=new Qd,h=new SE,m=new Set,g=[],_=a.logarithmicDepthBuffer,x=a.vertexTextures;let S=a.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(R){return m.add(R),R===0?"uv":`uv${R}`}function y(R,C,z,ie,Z){const ue=ie.fog,me=Z.geometry,ae=R.isMeshStandardMaterial?ie.environment:null,he=(R.isMeshStandardMaterial?n:e).get(R.envMap||ae),k=he&&he.mapping===Vc?he.image.height:null,de=E[R.type];R.precision!==null&&(S=a.getMaxPrecision(R.precision),S!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",S,"instead."));const oe=me.morphAttributes.position||me.morphAttributes.normal||me.morphAttributes.color,U=oe!==void 0?oe.length:0;let se=0;me.morphAttributes.position!==void 0&&(se=1),me.morphAttributes.normal!==void 0&&(se=2),me.morphAttributes.color!==void 0&&(se=3);let Fe,te,pe,we;if(de){const Et=ar[de];Fe=Et.vertexShader,te=Et.fragmentShader}else Fe=R.vertexShader,te=R.fragmentShader,h.update(R),pe=h.getVertexShaderID(R),we=h.getFragmentShaderID(R);const xe=s.getRenderTarget(),Le=s.state.buffers.depth.getReversed(),ve=Z.isInstancedMesh===!0,Ze=Z.isBatchedMesh===!0,bt=!!R.map,gt=!!R.matcap,zt=!!he,B=!!R.aoMap,Cn=!!R.lightMap,mt=!!R.bumpMap,dt=!!R.normalMap,Ye=!!R.displacementMap,It=!!R.emissiveMap,Xe=!!R.metalnessMap,P=!!R.roughnessMap,T=R.anisotropy>0,ee=R.clearcoat>0,_e=R.dispersion>0,Se=R.iridescence>0,ge=R.sheen>0,je=R.transmission>0,Ie=T&&!!R.anisotropyMap,ze=ee&&!!R.clearcoatMap,ct=ee&&!!R.clearcoatNormalMap,Ce=ee&&!!R.clearcoatRoughnessMap,ke=Se&&!!R.iridescenceMap,Qe=Se&&!!R.iridescenceThicknessMap,rt=ge&&!!R.sheenColorMap,He=ge&&!!R.sheenRoughnessMap,ht=!!R.specularMap,at=!!R.specularColorMap,Pt=!!R.specularIntensityMap,W=je&&!!R.transmissionMap,Y=je&&!!R.thicknessMap,Q=!!R.gradientMap,le=!!R.alphaMap,be=R.alphaTest>0,Pe=!!R.alphaHash,st=!!R.extensions;let Bt=gs;R.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(Bt=s.toneMapping);const Ht={shaderID:de,shaderType:R.type,shaderName:R.name,vertexShader:Fe,fragmentShader:te,defines:R.defines,customVertexShaderID:pe,customFragmentShaderID:we,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:S,batching:Ze,batchingColor:Ze&&Z._colorsTexture!==null,instancing:ve,instancingColor:ve&&Z.instanceColor!==null,instancingMorph:ve&&Z.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:xe===null?s.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:ra,alphaToCoverage:!!R.alphaToCoverage,map:bt,matcap:gt,envMap:zt,envMapMode:zt&&he.mapping,envMapCubeUVHeight:k,aoMap:B,lightMap:Cn,bumpMap:mt,normalMap:dt,displacementMap:x&&Ye,emissiveMap:It,normalMapObjectSpace:dt&&R.normalMapType===y_,normalMapTangentSpace:dt&&R.normalMapType===Kg,metalnessMap:Xe,roughnessMap:P,anisotropy:T,anisotropyMap:Ie,clearcoat:ee,clearcoatMap:ze,clearcoatNormalMap:ct,clearcoatRoughnessMap:Ce,dispersion:_e,iridescence:Se,iridescenceMap:ke,iridescenceThicknessMap:Qe,sheen:ge,sheenColorMap:rt,sheenRoughnessMap:He,specularMap:ht,specularColorMap:at,specularIntensityMap:Pt,transmission:je,transmissionMap:W,thicknessMap:Y,gradientMap:Q,opaque:R.transparent===!1&&R.blending===Ko&&R.alphaToCoverage===!1,alphaMap:le,alphaTest:be,alphaHash:Pe,combine:R.combine,mapUv:bt&&w(R.map.channel),aoMapUv:B&&w(R.aoMap.channel),lightMapUv:Cn&&w(R.lightMap.channel),bumpMapUv:mt&&w(R.bumpMap.channel),normalMapUv:dt&&w(R.normalMap.channel),displacementMapUv:Ye&&w(R.displacementMap.channel),emissiveMapUv:It&&w(R.emissiveMap.channel),metalnessMapUv:Xe&&w(R.metalnessMap.channel),roughnessMapUv:P&&w(R.roughnessMap.channel),anisotropyMapUv:Ie&&w(R.anisotropyMap.channel),clearcoatMapUv:ze&&w(R.clearcoatMap.channel),clearcoatNormalMapUv:ct&&w(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ce&&w(R.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&w(R.iridescenceMap.channel),iridescenceThicknessMapUv:Qe&&w(R.iridescenceThicknessMap.channel),sheenColorMapUv:rt&&w(R.sheenColorMap.channel),sheenRoughnessMapUv:He&&w(R.sheenRoughnessMap.channel),specularMapUv:ht&&w(R.specularMap.channel),specularColorMapUv:at&&w(R.specularColorMap.channel),specularIntensityMapUv:Pt&&w(R.specularIntensityMap.channel),transmissionMapUv:W&&w(R.transmissionMap.channel),thicknessMapUv:Y&&w(R.thicknessMap.channel),alphaMapUv:le&&w(R.alphaMap.channel),vertexTangents:!!me.attributes.tangent&&(dt||T),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!me.attributes.color&&me.attributes.color.itemSize===4,pointsUvs:Z.isPoints===!0&&!!me.attributes.uv&&(bt||le),fog:!!ue,useFog:R.fog===!0,fogExp2:!!ue&&ue.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:_,reverseDepthBuffer:Le,skinning:Z.isSkinnedMesh===!0,morphTargets:me.morphAttributes.position!==void 0,morphNormals:me.morphAttributes.normal!==void 0,morphColors:me.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:se,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:R.dithering,shadowMapEnabled:s.shadowMap.enabled&&z.length>0,shadowMapType:s.shadowMap.type,toneMapping:Bt,decodeVideoTexture:bt&&R.map.isVideoTexture===!0&&Dt.getTransfer(R.map.colorSpace)===kt,decodeVideoTextureEmissive:It&&R.emissiveMap.isVideoTexture===!0&&Dt.getTransfer(R.emissiveMap.colorSpace)===kt,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===gi,flipSided:R.side===si,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:st&&R.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&R.extensions.multiDraw===!0||Ze)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return Ht.vertexUv1s=m.has(1),Ht.vertexUv2s=m.has(2),Ht.vertexUv3s=m.has(3),m.clear(),Ht}function v(R){const C=[];if(R.shaderID?C.push(R.shaderID):(C.push(R.customVertexShaderID),C.push(R.customFragmentShaderID)),R.defines!==void 0)for(const z in R.defines)C.push(z),C.push(R.defines[z]);return R.isRawShaderMaterial===!1&&(I(C,R),L(C,R),C.push(s.outputColorSpace)),C.push(R.customProgramCacheKey),C.join()}function I(R,C){R.push(C.precision),R.push(C.outputColorSpace),R.push(C.envMapMode),R.push(C.envMapCubeUVHeight),R.push(C.mapUv),R.push(C.alphaMapUv),R.push(C.lightMapUv),R.push(C.aoMapUv),R.push(C.bumpMapUv),R.push(C.normalMapUv),R.push(C.displacementMapUv),R.push(C.emissiveMapUv),R.push(C.metalnessMapUv),R.push(C.roughnessMapUv),R.push(C.anisotropyMapUv),R.push(C.clearcoatMapUv),R.push(C.clearcoatNormalMapUv),R.push(C.clearcoatRoughnessMapUv),R.push(C.iridescenceMapUv),R.push(C.iridescenceThicknessMapUv),R.push(C.sheenColorMapUv),R.push(C.sheenRoughnessMapUv),R.push(C.specularMapUv),R.push(C.specularColorMapUv),R.push(C.specularIntensityMapUv),R.push(C.transmissionMapUv),R.push(C.thicknessMapUv),R.push(C.combine),R.push(C.fogExp2),R.push(C.sizeAttenuation),R.push(C.morphTargetsCount),R.push(C.morphAttributeCount),R.push(C.numDirLights),R.push(C.numPointLights),R.push(C.numSpotLights),R.push(C.numSpotLightMaps),R.push(C.numHemiLights),R.push(C.numRectAreaLights),R.push(C.numDirLightShadows),R.push(C.numPointLightShadows),R.push(C.numSpotLightShadows),R.push(C.numSpotLightShadowsWithMaps),R.push(C.numLightProbes),R.push(C.shadowMapType),R.push(C.toneMapping),R.push(C.numClippingPlanes),R.push(C.numClipIntersection),R.push(C.depthPacking)}function L(R,C){d.disableAll(),C.supportsVertexTextures&&d.enable(0),C.instancing&&d.enable(1),C.instancingColor&&d.enable(2),C.instancingMorph&&d.enable(3),C.matcap&&d.enable(4),C.envMap&&d.enable(5),C.normalMapObjectSpace&&d.enable(6),C.normalMapTangentSpace&&d.enable(7),C.clearcoat&&d.enable(8),C.iridescence&&d.enable(9),C.alphaTest&&d.enable(10),C.vertexColors&&d.enable(11),C.vertexAlphas&&d.enable(12),C.vertexUv1s&&d.enable(13),C.vertexUv2s&&d.enable(14),C.vertexUv3s&&d.enable(15),C.vertexTangents&&d.enable(16),C.anisotropy&&d.enable(17),C.alphaHash&&d.enable(18),C.batching&&d.enable(19),C.dispersion&&d.enable(20),C.batchingColor&&d.enable(21),R.push(d.mask),d.disableAll(),C.fog&&d.enable(0),C.useFog&&d.enable(1),C.flatShading&&d.enable(2),C.logarithmicDepthBuffer&&d.enable(3),C.reverseDepthBuffer&&d.enable(4),C.skinning&&d.enable(5),C.morphTargets&&d.enable(6),C.morphNormals&&d.enable(7),C.morphColors&&d.enable(8),C.premultipliedAlpha&&d.enable(9),C.shadowMapEnabled&&d.enable(10),C.doubleSided&&d.enable(11),C.flipSided&&d.enable(12),C.useDepthPacking&&d.enable(13),C.dithering&&d.enable(14),C.transmission&&d.enable(15),C.sheen&&d.enable(16),C.opaque&&d.enable(17),C.pointsUvs&&d.enable(18),C.decodeVideoTexture&&d.enable(19),C.decodeVideoTextureEmissive&&d.enable(20),C.alphaToCoverage&&d.enable(21),R.push(d.mask)}function b(R){const C=E[R.type];let z;if(C){const ie=ar[C];z=s0.clone(ie.uniforms)}else z=R.uniforms;return z}function H(R,C){let z;for(let ie=0,Z=g.length;ie<Z;ie++){const ue=g[ie];if(ue.cacheKey===C){z=ue,++z.usedTimes;break}}return z===void 0&&(z=new xE(s,C,R,c),g.push(z)),z}function F(R){if(--R.usedTimes===0){const C=g.indexOf(R);g[C]=g[g.length-1],g.pop(),R.destroy()}}function N(R){h.remove(R)}function G(){h.dispose()}return{getParameters:y,getProgramCacheKey:v,getUniforms:b,acquireProgram:H,releaseProgram:F,releaseShaderCache:N,programs:g,dispose:G}}function wE(){let s=new WeakMap;function e(u){return s.has(u)}function n(u){let d=s.get(u);return d===void 0&&(d={},s.set(u,d)),d}function r(u){s.delete(u)}function a(u,d,h){s.get(u)[d]=h}function c(){s=new WeakMap}return{has:e,get:n,remove:r,update:a,dispose:c}}function TE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Pg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Lg(){const s=[];let e=0;const n=[],r=[],a=[];function c(){e=0,n.length=0,r.length=0,a.length=0}function u(_,x,S,E,w,y){let v=s[e];return v===void 0?(v={id:_.id,object:_,geometry:x,material:S,groupOrder:E,renderOrder:_.renderOrder,z:w,group:y},s[e]=v):(v.id=_.id,v.object=_,v.geometry=x,v.material=S,v.groupOrder=E,v.renderOrder=_.renderOrder,v.z=w,v.group=y),e++,v}function d(_,x,S,E,w,y){const v=u(_,x,S,E,w,y);S.transmission>0?r.push(v):S.transparent===!0?a.push(v):n.push(v)}function h(_,x,S,E,w,y){const v=u(_,x,S,E,w,y);S.transmission>0?r.unshift(v):S.transparent===!0?a.unshift(v):n.unshift(v)}function m(_,x){n.length>1&&n.sort(_||TE),r.length>1&&r.sort(x||Pg),a.length>1&&a.sort(x||Pg)}function g(){for(let _=e,x=s.length;_<x;_++){const S=s[_];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:n,transmissive:r,transparent:a,init:c,push:d,unshift:h,finish:g,sort:m}}function AE(){let s=new WeakMap;function e(r,a){const c=s.get(r);let u;return c===void 0?(u=new Lg,s.set(r,[u])):a>=c.length?(u=new Lg,c.push(u)):u=c[a],u}function n(){s=new WeakMap}return{get:e,dispose:n}}function CE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new j,color:new St};break;case"SpotLight":n={position:new j,direction:new j,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new j,color:new St,distance:0,decay:0};break;case"HemisphereLight":n={direction:new j,skyColor:new St,groundColor:new St};break;case"RectAreaLight":n={color:new St,position:new j,halfWidth:new j,halfHeight:new j};break}return s[e.id]=n,n}}}function RE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=n,n}}}let bE=0;function PE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function LE(s){const e=new CE,n=RE(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new j);const a=new j,c=new jt,u=new jt;function d(m){let g=0,_=0,x=0;for(let R=0;R<9;R++)r.probe[R].set(0,0,0);let S=0,E=0,w=0,y=0,v=0,I=0,L=0,b=0,H=0,F=0,N=0;m.sort(PE);for(let R=0,C=m.length;R<C;R++){const z=m[R],ie=z.color,Z=z.intensity,ue=z.distance,me=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)g+=ie.r*Z,_+=ie.g*Z,x+=ie.b*Z;else if(z.isLightProbe){for(let ae=0;ae<9;ae++)r.probe[ae].addScaledVector(z.sh.coefficients[ae],Z);N++}else if(z.isDirectionalLight){const ae=e.get(z);if(ae.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){const he=z.shadow,k=n.get(z);k.shadowIntensity=he.intensity,k.shadowBias=he.bias,k.shadowNormalBias=he.normalBias,k.shadowRadius=he.radius,k.shadowMapSize=he.mapSize,r.directionalShadow[S]=k,r.directionalShadowMap[S]=me,r.directionalShadowMatrix[S]=z.shadow.matrix,I++}r.directional[S]=ae,S++}else if(z.isSpotLight){const ae=e.get(z);ae.position.setFromMatrixPosition(z.matrixWorld),ae.color.copy(ie).multiplyScalar(Z),ae.distance=ue,ae.coneCos=Math.cos(z.angle),ae.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),ae.decay=z.decay,r.spot[w]=ae;const he=z.shadow;if(z.map&&(r.spotLightMap[H]=z.map,H++,he.updateMatrices(z),z.castShadow&&F++),r.spotLightMatrix[w]=he.matrix,z.castShadow){const k=n.get(z);k.shadowIntensity=he.intensity,k.shadowBias=he.bias,k.shadowNormalBias=he.normalBias,k.shadowRadius=he.radius,k.shadowMapSize=he.mapSize,r.spotShadow[w]=k,r.spotShadowMap[w]=me,b++}w++}else if(z.isRectAreaLight){const ae=e.get(z);ae.color.copy(ie).multiplyScalar(Z),ae.halfWidth.set(z.width*.5,0,0),ae.halfHeight.set(0,z.height*.5,0),r.rectArea[y]=ae,y++}else if(z.isPointLight){const ae=e.get(z);if(ae.color.copy(z.color).multiplyScalar(z.intensity),ae.distance=z.distance,ae.decay=z.decay,z.castShadow){const he=z.shadow,k=n.get(z);k.shadowIntensity=he.intensity,k.shadowBias=he.bias,k.shadowNormalBias=he.normalBias,k.shadowRadius=he.radius,k.shadowMapSize=he.mapSize,k.shadowCameraNear=he.camera.near,k.shadowCameraFar=he.camera.far,r.pointShadow[E]=k,r.pointShadowMap[E]=me,r.pointShadowMatrix[E]=z.shadow.matrix,L++}r.point[E]=ae,E++}else if(z.isHemisphereLight){const ae=e.get(z);ae.skyColor.copy(z.color).multiplyScalar(Z),ae.groundColor.copy(z.groundColor).multiplyScalar(Z),r.hemi[v]=ae,v++}}y>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ue.LTC_FLOAT_1,r.rectAreaLTC2=Ue.LTC_FLOAT_2):(r.rectAreaLTC1=Ue.LTC_HALF_1,r.rectAreaLTC2=Ue.LTC_HALF_2)),r.ambient[0]=g,r.ambient[1]=_,r.ambient[2]=x;const G=r.hash;(G.directionalLength!==S||G.pointLength!==E||G.spotLength!==w||G.rectAreaLength!==y||G.hemiLength!==v||G.numDirectionalShadows!==I||G.numPointShadows!==L||G.numSpotShadows!==b||G.numSpotMaps!==H||G.numLightProbes!==N)&&(r.directional.length=S,r.spot.length=w,r.rectArea.length=y,r.point.length=E,r.hemi.length=v,r.directionalShadow.length=I,r.directionalShadowMap.length=I,r.pointShadow.length=L,r.pointShadowMap.length=L,r.spotShadow.length=b,r.spotShadowMap.length=b,r.directionalShadowMatrix.length=I,r.pointShadowMatrix.length=L,r.spotLightMatrix.length=b+H-F,r.spotLightMap.length=H,r.numSpotLightShadowsWithMaps=F,r.numLightProbes=N,G.directionalLength=S,G.pointLength=E,G.spotLength=w,G.rectAreaLength=y,G.hemiLength=v,G.numDirectionalShadows=I,G.numPointShadows=L,G.numSpotShadows=b,G.numSpotMaps=H,G.numLightProbes=N,r.version=bE++)}function h(m,g){let _=0,x=0,S=0,E=0,w=0;const y=g.matrixWorldInverse;for(let v=0,I=m.length;v<I;v++){const L=m[v];if(L.isDirectionalLight){const b=r.directional[_];b.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),_++}else if(L.isSpotLight){const b=r.spot[S];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),b.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),S++}else if(L.isRectAreaLight){const b=r.rectArea[E];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),u.identity(),c.copy(L.matrixWorld),c.premultiply(y),u.extractRotation(c),b.halfWidth.set(L.width*.5,0,0),b.halfHeight.set(0,L.height*.5,0),b.halfWidth.applyMatrix4(u),b.halfHeight.applyMatrix4(u),E++}else if(L.isPointLight){const b=r.point[x];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),x++}else if(L.isHemisphereLight){const b=r.hemi[w];b.direction.setFromMatrixPosition(L.matrixWorld),b.direction.transformDirection(y),w++}}}return{setup:d,setupView:h,state:r}}function Dg(s){const e=new LE(s),n=[],r=[];function a(g){m.camera=g,n.length=0,r.length=0}function c(g){n.push(g)}function u(g){r.push(g)}function d(){e.setup(n)}function h(g){e.setupView(n,g)}const m={lightsArray:n,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:d,setupLightsView:h,pushLight:c,pushShadow:u}}function DE(s){let e=new WeakMap;function n(a,c=0){const u=e.get(a);let d;return u===void 0?(d=new Dg(s),e.set(a,[d])):c>=u.length?(d=new Dg(s),u.push(d)):d=u[c],d}function r(){e=new WeakMap}return{get:n,dispose:r}}const IE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,UE=`uniform sampler2D shadow_pass;
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
}`;function NE(s,e,n){let r=new Jd;const a=new Ct,c=new Ct,u=new sn,d=new rx({depthPacking:x_}),h=new sx,m={},g=n.maxTextureSize,_={[vs]:si,[si]:vs,[gi]:gi},x=new ur({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:IE,fragmentShader:UE}),S=x.clone();S.defines.HORIZONTAL_PASS=1;const E=new en;E.setAttribute("position",new kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new An(E,x),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zg;let v=this.type;this.render=function(F,N,G){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||F.length===0)return;const R=s.getRenderTarget(),C=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),ie=s.state;ie.setBlending(ms),ie.buffers.color.setClear(1,1,1,1),ie.buffers.depth.setTest(!0),ie.setScissorTest(!1);const Z=v!==Pr&&this.type===Pr,ue=v===Pr&&this.type!==Pr;for(let me=0,ae=F.length;me<ae;me++){const he=F[me],k=he.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",he,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;a.copy(k.mapSize);const de=k.getFrameExtents();if(a.multiply(de),c.copy(k.mapSize),(a.x>g||a.y>g)&&(a.x>g&&(c.x=Math.floor(g/de.x),a.x=c.x*de.x,k.mapSize.x=c.x),a.y>g&&(c.y=Math.floor(g/de.y),a.y=c.y*de.y,k.mapSize.y=c.y)),k.map===null||Z===!0||ue===!0){const U=this.type!==Pr?{minFilter:Yi,magFilter:Yi}:{};k.map!==null&&k.map.dispose(),k.map=new to(a.x,a.y,U),k.map.texture.name=he.name+".shadowMap",k.camera.updateProjectionMatrix()}s.setRenderTarget(k.map),s.clear();const oe=k.getViewportCount();for(let U=0;U<oe;U++){const se=k.getViewport(U);u.set(c.x*se.x,c.y*se.y,c.x*se.z,c.y*se.w),ie.viewport(u),k.updateMatrices(he,U),r=k.getFrustum(),b(N,G,k.camera,he,this.type)}k.isPointLightShadow!==!0&&this.type===Pr&&I(k,G),k.needsUpdate=!1}v=this.type,y.needsUpdate=!1,s.setRenderTarget(R,C,z)};function I(F,N){const G=e.update(w);x.defines.VSM_SAMPLES!==F.blurSamples&&(x.defines.VSM_SAMPLES=F.blurSamples,S.defines.VSM_SAMPLES=F.blurSamples,x.needsUpdate=!0,S.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new to(a.x,a.y)),x.uniforms.shadow_pass.value=F.map.texture,x.uniforms.resolution.value=F.mapSize,x.uniforms.radius.value=F.radius,s.setRenderTarget(F.mapPass),s.clear(),s.renderBufferDirect(N,null,G,x,w,null),S.uniforms.shadow_pass.value=F.mapPass.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,s.setRenderTarget(F.map),s.clear(),s.renderBufferDirect(N,null,G,S,w,null)}function L(F,N,G,R){let C=null;const z=G.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(z!==void 0)C=z;else if(C=G.isPointLight===!0?h:d,s.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0){const ie=C.uuid,Z=N.uuid;let ue=m[ie];ue===void 0&&(ue={},m[ie]=ue);let me=ue[Z];me===void 0&&(me=C.clone(),ue[Z]=me,N.addEventListener("dispose",H)),C=me}if(C.visible=N.visible,C.wireframe=N.wireframe,R===Pr?C.side=N.shadowSide!==null?N.shadowSide:N.side:C.side=N.shadowSide!==null?N.shadowSide:_[N.side],C.alphaMap=N.alphaMap,C.alphaTest=N.alphaTest,C.map=N.map,C.clipShadows=N.clipShadows,C.clippingPlanes=N.clippingPlanes,C.clipIntersection=N.clipIntersection,C.displacementMap=N.displacementMap,C.displacementScale=N.displacementScale,C.displacementBias=N.displacementBias,C.wireframeLinewidth=N.wireframeLinewidth,C.linewidth=N.linewidth,G.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const ie=s.properties.get(C);ie.light=G}return C}function b(F,N,G,R,C){if(F.visible===!1)return;if(F.layers.test(N.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&C===Pr)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,F.matrixWorld);const Z=e.update(F),ue=F.material;if(Array.isArray(ue)){const me=Z.groups;for(let ae=0,he=me.length;ae<he;ae++){const k=me[ae],de=ue[k.materialIndex];if(de&&de.visible){const oe=L(F,de,R,C);F.onBeforeShadow(s,F,N,G,Z,oe,k),s.renderBufferDirect(G,null,Z,oe,F,k),F.onAfterShadow(s,F,N,G,Z,oe,k)}}}else if(ue.visible){const me=L(F,ue,R,C);F.onBeforeShadow(s,F,N,G,Z,me,null),s.renderBufferDirect(G,null,Z,me,F,null),F.onAfterShadow(s,F,N,G,Z,me,null)}}const ie=F.children;for(let Z=0,ue=ie.length;Z<ue;Z++)b(ie[Z],N,G,R,C)}function H(F){F.target.removeEventListener("dispose",H);for(const G in m){const R=m[G],C=F.target.uuid;C in R&&(R[C].dispose(),delete R[C])}}}const FE={[nd]:id,[rd]:ad,[sd]:ld,[Jo]:od,[id]:nd,[ad]:rd,[ld]:sd,[od]:Jo};function OE(s,e){function n(){let W=!1;const Y=new sn;let Q=null;const le=new sn(0,0,0,0);return{setMask:function(be){Q!==be&&!W&&(s.colorMask(be,be,be,be),Q=be)},setLocked:function(be){W=be},setClear:function(be,Pe,st,Bt,Ht){Ht===!0&&(be*=Bt,Pe*=Bt,st*=Bt),Y.set(be,Pe,st,Bt),le.equals(Y)===!1&&(s.clearColor(be,Pe,st,Bt),le.copy(Y))},reset:function(){W=!1,Q=null,le.set(-1,0,0,0)}}}function r(){let W=!1,Y=!1,Q=null,le=null,be=null;return{setReversed:function(Pe){if(Y!==Pe){const st=e.get("EXT_clip_control");Y?st.clipControlEXT(st.LOWER_LEFT_EXT,st.ZERO_TO_ONE_EXT):st.clipControlEXT(st.LOWER_LEFT_EXT,st.NEGATIVE_ONE_TO_ONE_EXT);const Bt=be;be=null,this.setClear(Bt)}Y=Pe},getReversed:function(){return Y},setTest:function(Pe){Pe?xe(s.DEPTH_TEST):Le(s.DEPTH_TEST)},setMask:function(Pe){Q!==Pe&&!W&&(s.depthMask(Pe),Q=Pe)},setFunc:function(Pe){if(Y&&(Pe=FE[Pe]),le!==Pe){switch(Pe){case nd:s.depthFunc(s.NEVER);break;case id:s.depthFunc(s.ALWAYS);break;case rd:s.depthFunc(s.LESS);break;case Jo:s.depthFunc(s.LEQUAL);break;case sd:s.depthFunc(s.EQUAL);break;case od:s.depthFunc(s.GEQUAL);break;case ad:s.depthFunc(s.GREATER);break;case ld:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}le=Pe}},setLocked:function(Pe){W=Pe},setClear:function(Pe){be!==Pe&&(Y&&(Pe=1-Pe),s.clearDepth(Pe),be=Pe)},reset:function(){W=!1,Q=null,le=null,be=null,Y=!1}}}function a(){let W=!1,Y=null,Q=null,le=null,be=null,Pe=null,st=null,Bt=null,Ht=null;return{setTest:function(Et){W||(Et?xe(s.STENCIL_TEST):Le(s.STENCIL_TEST))},setMask:function(Et){Y!==Et&&!W&&(s.stencilMask(Et),Y=Et)},setFunc:function(Et,Rn,Zt){(Q!==Et||le!==Rn||be!==Zt)&&(s.stencilFunc(Et,Rn,Zt),Q=Et,le=Rn,be=Zt)},setOp:function(Et,Rn,Zt){(Pe!==Et||st!==Rn||Bt!==Zt)&&(s.stencilOp(Et,Rn,Zt),Pe=Et,st=Rn,Bt=Zt)},setLocked:function(Et){W=Et},setClear:function(Et){Ht!==Et&&(s.clearStencil(Et),Ht=Et)},reset:function(){W=!1,Y=null,Q=null,le=null,be=null,Pe=null,st=null,Bt=null,Ht=null}}}const c=new n,u=new r,d=new a,h=new WeakMap,m=new WeakMap;let g={},_={},x=new WeakMap,S=[],E=null,w=!1,y=null,v=null,I=null,L=null,b=null,H=null,F=null,N=new St(0,0,0),G=0,R=!1,C=null,z=null,ie=null,Z=null,ue=null;const me=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ae=!1,he=0;const k=s.getParameter(s.VERSION);k.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(k)[1]),ae=he>=1):k.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),ae=he>=2);let de=null,oe={};const U=s.getParameter(s.SCISSOR_BOX),se=s.getParameter(s.VIEWPORT),Fe=new sn().fromArray(U),te=new sn().fromArray(se);function pe(W,Y,Q,le){const be=new Uint8Array(4),Pe=s.createTexture();s.bindTexture(W,Pe),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let st=0;st<Q;st++)W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?s.texImage3D(Y,0,s.RGBA,1,1,le,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(Y+st,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return Pe}const we={};we[s.TEXTURE_2D]=pe(s.TEXTURE_2D,s.TEXTURE_2D,1),we[s.TEXTURE_CUBE_MAP]=pe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[s.TEXTURE_2D_ARRAY]=pe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),we[s.TEXTURE_3D]=pe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),c.setClear(0,0,0,1),u.setClear(1),d.setClear(0),xe(s.DEPTH_TEST),u.setFunc(Jo),mt(!1),dt(Em),xe(s.CULL_FACE),B(ms);function xe(W){g[W]!==!0&&(s.enable(W),g[W]=!0)}function Le(W){g[W]!==!1&&(s.disable(W),g[W]=!1)}function ve(W,Y){return _[W]!==Y?(s.bindFramebuffer(W,Y),_[W]=Y,W===s.DRAW_FRAMEBUFFER&&(_[s.FRAMEBUFFER]=Y),W===s.FRAMEBUFFER&&(_[s.DRAW_FRAMEBUFFER]=Y),!0):!1}function Ze(W,Y){let Q=S,le=!1;if(W){Q=x.get(Y),Q===void 0&&(Q=[],x.set(Y,Q));const be=W.textures;if(Q.length!==be.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let Pe=0,st=be.length;Pe<st;Pe++)Q[Pe]=s.COLOR_ATTACHMENT0+Pe;Q.length=be.length,le=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,le=!0);le&&s.drawBuffers(Q)}function bt(W){return E!==W?(s.useProgram(W),E=W,!0):!1}const gt={[$s]:s.FUNC_ADD,[Xv]:s.FUNC_SUBTRACT,[jv]:s.FUNC_REVERSE_SUBTRACT};gt[$v]=s.MIN,gt[qv]=s.MAX;const zt={[Yv]:s.ZERO,[Kv]:s.ONE,[Zv]:s.SRC_COLOR,[ed]:s.SRC_ALPHA,[i_]:s.SRC_ALPHA_SATURATE,[t_]:s.DST_COLOR,[Jv]:s.DST_ALPHA,[Qv]:s.ONE_MINUS_SRC_COLOR,[td]:s.ONE_MINUS_SRC_ALPHA,[n_]:s.ONE_MINUS_DST_COLOR,[e_]:s.ONE_MINUS_DST_ALPHA,[r_]:s.CONSTANT_COLOR,[s_]:s.ONE_MINUS_CONSTANT_COLOR,[o_]:s.CONSTANT_ALPHA,[a_]:s.ONE_MINUS_CONSTANT_ALPHA};function B(W,Y,Q,le,be,Pe,st,Bt,Ht,Et){if(W===ms){w===!0&&(Le(s.BLEND),w=!1);return}if(w===!1&&(xe(s.BLEND),w=!0),W!==Wv){if(W!==y||Et!==R){if((v!==$s||b!==$s)&&(s.blendEquation(s.FUNC_ADD),v=$s,b=$s),Et)switch(W){case Ko:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Uc:s.blendFunc(s.ONE,s.ONE);break;case wm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Tm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Ko:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Uc:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case wm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Tm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}I=null,L=null,H=null,F=null,N.set(0,0,0),G=0,y=W,R=Et}return}be=be||Y,Pe=Pe||Q,st=st||le,(Y!==v||be!==b)&&(s.blendEquationSeparate(gt[Y],gt[be]),v=Y,b=be),(Q!==I||le!==L||Pe!==H||st!==F)&&(s.blendFuncSeparate(zt[Q],zt[le],zt[Pe],zt[st]),I=Q,L=le,H=Pe,F=st),(Bt.equals(N)===!1||Ht!==G)&&(s.blendColor(Bt.r,Bt.g,Bt.b,Ht),N.copy(Bt),G=Ht),y=W,R=!1}function Cn(W,Y){W.side===gi?Le(s.CULL_FACE):xe(s.CULL_FACE);let Q=W.side===si;Y&&(Q=!Q),mt(Q),W.blending===Ko&&W.transparent===!1?B(ms):B(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),u.setFunc(W.depthFunc),u.setTest(W.depthTest),u.setMask(W.depthWrite),c.setMask(W.colorWrite);const le=W.stencilWrite;d.setTest(le),le&&(d.setMask(W.stencilWriteMask),d.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),d.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),It(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?xe(s.SAMPLE_ALPHA_TO_COVERAGE):Le(s.SAMPLE_ALPHA_TO_COVERAGE)}function mt(W){C!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),C=W)}function dt(W){W!==Hv?(xe(s.CULL_FACE),W!==z&&(W===Em?s.cullFace(s.BACK):W===Vv?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Le(s.CULL_FACE),z=W}function Ye(W){W!==ie&&(ae&&s.lineWidth(W),ie=W)}function It(W,Y,Q){W?(xe(s.POLYGON_OFFSET_FILL),(Z!==Y||ue!==Q)&&(s.polygonOffset(Y,Q),Z=Y,ue=Q)):Le(s.POLYGON_OFFSET_FILL)}function Xe(W){W?xe(s.SCISSOR_TEST):Le(s.SCISSOR_TEST)}function P(W){W===void 0&&(W=s.TEXTURE0+me-1),de!==W&&(s.activeTexture(W),de=W)}function T(W,Y,Q){Q===void 0&&(de===null?Q=s.TEXTURE0+me-1:Q=de);let le=oe[Q];le===void 0&&(le={type:void 0,texture:void 0},oe[Q]=le),(le.type!==W||le.texture!==Y)&&(de!==Q&&(s.activeTexture(Q),de=Q),s.bindTexture(W,Y||we[W]),le.type=W,le.texture=Y)}function ee(){const W=oe[de];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function _e(){try{s.compressedTexImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Se(){try{s.compressedTexImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ge(){try{s.texSubImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function je(){try{s.texSubImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ie(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ze(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ct(){try{s.texStorage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ce(){try{s.texStorage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ke(){try{s.texImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Qe(){try{s.texImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function rt(W){Fe.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),Fe.copy(W))}function He(W){te.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),te.copy(W))}function ht(W,Y){let Q=m.get(Y);Q===void 0&&(Q=new WeakMap,m.set(Y,Q));let le=Q.get(W);le===void 0&&(le=s.getUniformBlockIndex(Y,W.name),Q.set(W,le))}function at(W,Y){const le=m.get(Y).get(W);h.get(Y)!==le&&(s.uniformBlockBinding(Y,le,W.__bindingPointIndex),h.set(Y,le))}function Pt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),u.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),g={},de=null,oe={},_={},x=new WeakMap,S=[],E=null,w=!1,y=null,v=null,I=null,L=null,b=null,H=null,F=null,N=new St(0,0,0),G=0,R=!1,C=null,z=null,ie=null,Z=null,ue=null,Fe.set(0,0,s.canvas.width,s.canvas.height),te.set(0,0,s.canvas.width,s.canvas.height),c.reset(),u.reset(),d.reset()}return{buffers:{color:c,depth:u,stencil:d},enable:xe,disable:Le,bindFramebuffer:ve,drawBuffers:Ze,useProgram:bt,setBlending:B,setMaterial:Cn,setFlipSided:mt,setCullFace:dt,setLineWidth:Ye,setPolygonOffset:It,setScissorTest:Xe,activeTexture:P,bindTexture:T,unbindTexture:ee,compressedTexImage2D:_e,compressedTexImage3D:Se,texImage2D:ke,texImage3D:Qe,updateUBOMapping:ht,uniformBlockBinding:at,texStorage2D:ct,texStorage3D:Ce,texSubImage2D:ge,texSubImage3D:je,compressedTexSubImage2D:Ie,compressedTexSubImage3D:ze,scissor:rt,viewport:He,reset:Pt}}function zE(s,e,n,r,a,c,u){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new Ct,g=new WeakMap;let _;const x=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(P,T){return S?new OffscreenCanvas(P,T):Oc("canvas")}function w(P,T,ee){let _e=1;const Se=Xe(P);if((Se.width>ee||Se.height>ee)&&(_e=ee/Math.max(Se.width,Se.height)),_e<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const ge=Math.floor(_e*Se.width),je=Math.floor(_e*Se.height);_===void 0&&(_=E(ge,je));const Ie=T?E(ge,je):_;return Ie.width=ge,Ie.height=je,Ie.getContext("2d").drawImage(P,0,0,ge,je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Se.width+"x"+Se.height+") to ("+ge+"x"+je+")."),Ie}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Se.width+"x"+Se.height+")."),P;return P}function y(P){return P.generateMipmaps}function v(P){s.generateMipmap(P)}function I(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function L(P,T,ee,_e,Se=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ge=T;if(T===s.RED&&(ee===s.FLOAT&&(ge=s.R32F),ee===s.HALF_FLOAT&&(ge=s.R16F),ee===s.UNSIGNED_BYTE&&(ge=s.R8)),T===s.RED_INTEGER&&(ee===s.UNSIGNED_BYTE&&(ge=s.R8UI),ee===s.UNSIGNED_SHORT&&(ge=s.R16UI),ee===s.UNSIGNED_INT&&(ge=s.R32UI),ee===s.BYTE&&(ge=s.R8I),ee===s.SHORT&&(ge=s.R16I),ee===s.INT&&(ge=s.R32I)),T===s.RG&&(ee===s.FLOAT&&(ge=s.RG32F),ee===s.HALF_FLOAT&&(ge=s.RG16F),ee===s.UNSIGNED_BYTE&&(ge=s.RG8)),T===s.RG_INTEGER&&(ee===s.UNSIGNED_BYTE&&(ge=s.RG8UI),ee===s.UNSIGNED_SHORT&&(ge=s.RG16UI),ee===s.UNSIGNED_INT&&(ge=s.RG32UI),ee===s.BYTE&&(ge=s.RG8I),ee===s.SHORT&&(ge=s.RG16I),ee===s.INT&&(ge=s.RG32I)),T===s.RGB_INTEGER&&(ee===s.UNSIGNED_BYTE&&(ge=s.RGB8UI),ee===s.UNSIGNED_SHORT&&(ge=s.RGB16UI),ee===s.UNSIGNED_INT&&(ge=s.RGB32UI),ee===s.BYTE&&(ge=s.RGB8I),ee===s.SHORT&&(ge=s.RGB16I),ee===s.INT&&(ge=s.RGB32I)),T===s.RGBA_INTEGER&&(ee===s.UNSIGNED_BYTE&&(ge=s.RGBA8UI),ee===s.UNSIGNED_SHORT&&(ge=s.RGBA16UI),ee===s.UNSIGNED_INT&&(ge=s.RGBA32UI),ee===s.BYTE&&(ge=s.RGBA8I),ee===s.SHORT&&(ge=s.RGBA16I),ee===s.INT&&(ge=s.RGBA32I)),T===s.RGB&&ee===s.UNSIGNED_INT_5_9_9_9_REV&&(ge=s.RGB9_E5),T===s.RGBA){const je=Se?Nc:Dt.getTransfer(_e);ee===s.FLOAT&&(ge=s.RGBA32F),ee===s.HALF_FLOAT&&(ge=s.RGBA16F),ee===s.UNSIGNED_BYTE&&(ge=je===kt?s.SRGB8_ALPHA8:s.RGBA8),ee===s.UNSIGNED_SHORT_4_4_4_4&&(ge=s.RGBA4),ee===s.UNSIGNED_SHORT_5_5_5_1&&(ge=s.RGB5_A1)}return(ge===s.R16F||ge===s.R32F||ge===s.RG16F||ge===s.RG32F||ge===s.RGBA16F||ge===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ge}function b(P,T){let ee;return P?T===null||T===eo||T===na?ee=s.DEPTH24_STENCIL8:T===Dr?ee=s.DEPTH32F_STENCIL8:T===Ya&&(ee=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===eo||T===na?ee=s.DEPTH_COMPONENT24:T===Dr?ee=s.DEPTH_COMPONENT32F:T===Ya&&(ee=s.DEPTH_COMPONENT16),ee}function H(P,T){return y(P)===!0||P.isFramebufferTexture&&P.minFilter!==Yi&&P.minFilter!==lr?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function F(P){const T=P.target;T.removeEventListener("dispose",F),G(T),T.isVideoTexture&&g.delete(T)}function N(P){const T=P.target;T.removeEventListener("dispose",N),C(T)}function G(P){const T=r.get(P);if(T.__webglInit===void 0)return;const ee=P.source,_e=x.get(ee);if(_e){const Se=_e[T.__cacheKey];Se.usedTimes--,Se.usedTimes===0&&R(P),Object.keys(_e).length===0&&x.delete(ee)}r.remove(P)}function R(P){const T=r.get(P);s.deleteTexture(T.__webglTexture);const ee=P.source,_e=x.get(ee);delete _e[T.__cacheKey],u.memory.textures--}function C(P){const T=r.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),r.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let _e=0;_e<6;_e++){if(Array.isArray(T.__webglFramebuffer[_e]))for(let Se=0;Se<T.__webglFramebuffer[_e].length;Se++)s.deleteFramebuffer(T.__webglFramebuffer[_e][Se]);else s.deleteFramebuffer(T.__webglFramebuffer[_e]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[_e])}else{if(Array.isArray(T.__webglFramebuffer))for(let _e=0;_e<T.__webglFramebuffer.length;_e++)s.deleteFramebuffer(T.__webglFramebuffer[_e]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let _e=0;_e<T.__webglColorRenderbuffer.length;_e++)T.__webglColorRenderbuffer[_e]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[_e]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const ee=P.textures;for(let _e=0,Se=ee.length;_e<Se;_e++){const ge=r.get(ee[_e]);ge.__webglTexture&&(s.deleteTexture(ge.__webglTexture),u.memory.textures--),r.remove(ee[_e])}r.remove(P)}let z=0;function ie(){z=0}function Z(){const P=z;return P>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+a.maxTextures),z+=1,P}function ue(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function me(P,T){const ee=r.get(P);if(P.isVideoTexture&&Ye(P),P.isRenderTargetTexture===!1&&P.version>0&&ee.__version!==P.version){const _e=P.image;if(_e===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(_e.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(ee,P,T);return}}n.bindTexture(s.TEXTURE_2D,ee.__webglTexture,s.TEXTURE0+T)}function ae(P,T){const ee=r.get(P);if(P.version>0&&ee.__version!==P.version){te(ee,P,T);return}n.bindTexture(s.TEXTURE_2D_ARRAY,ee.__webglTexture,s.TEXTURE0+T)}function he(P,T){const ee=r.get(P);if(P.version>0&&ee.__version!==P.version){te(ee,P,T);return}n.bindTexture(s.TEXTURE_3D,ee.__webglTexture,s.TEXTURE0+T)}function k(P,T){const ee=r.get(P);if(P.version>0&&ee.__version!==P.version){pe(ee,P,T);return}n.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture,s.TEXTURE0+T)}const de={[fd]:s.REPEAT,[Ks]:s.CLAMP_TO_EDGE,[dd]:s.MIRRORED_REPEAT},oe={[Yi]:s.NEAREST,[v_]:s.NEAREST_MIPMAP_NEAREST,[Ql]:s.NEAREST_MIPMAP_LINEAR,[lr]:s.LINEAR,[Sf]:s.LINEAR_MIPMAP_NEAREST,[Zs]:s.LINEAR_MIPMAP_LINEAR},U={[S_]:s.NEVER,[C_]:s.ALWAYS,[M_]:s.LESS,[Zg]:s.LEQUAL,[E_]:s.EQUAL,[A_]:s.GEQUAL,[w_]:s.GREATER,[T_]:s.NOTEQUAL};function se(P,T){if(T.type===Dr&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===lr||T.magFilter===Sf||T.magFilter===Ql||T.magFilter===Zs||T.minFilter===lr||T.minFilter===Sf||T.minFilter===Ql||T.minFilter===Zs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,de[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,de[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,de[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,oe[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,U[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Yi||T.minFilter!==Ql&&T.minFilter!==Zs||T.type===Dr&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||r.get(T).__currentAnisotropy){const ee=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy}}}function Fe(P,T){let ee=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",F));const _e=T.source;let Se=x.get(_e);Se===void 0&&(Se={},x.set(_e,Se));const ge=ue(T);if(ge!==P.__cacheKey){Se[ge]===void 0&&(Se[ge]={texture:s.createTexture(),usedTimes:0},u.memory.textures++,ee=!0),Se[ge].usedTimes++;const je=Se[P.__cacheKey];je!==void 0&&(Se[P.__cacheKey].usedTimes--,je.usedTimes===0&&R(T)),P.__cacheKey=ge,P.__webglTexture=Se[ge].texture}return ee}function te(P,T,ee){let _e=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(_e=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(_e=s.TEXTURE_3D);const Se=Fe(P,T),ge=T.source;n.bindTexture(_e,P.__webglTexture,s.TEXTURE0+ee);const je=r.get(ge);if(ge.version!==je.__version||Se===!0){n.activeTexture(s.TEXTURE0+ee);const Ie=Dt.getPrimaries(Dt.workingColorSpace),ze=T.colorSpace===hs?null:Dt.getPrimaries(T.colorSpace),ct=T.colorSpace===hs||Ie===ze?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);let Ce=w(T.image,!1,a.maxTextureSize);Ce=It(T,Ce);const ke=c.convert(T.format,T.colorSpace),Qe=c.convert(T.type);let rt=L(T.internalFormat,ke,Qe,T.colorSpace,T.isVideoTexture);se(_e,T);let He;const ht=T.mipmaps,at=T.isVideoTexture!==!0,Pt=je.__version===void 0||Se===!0,W=ge.dataReady,Y=H(T,Ce);if(T.isDepthTexture)rt=b(T.format===ia,T.type),Pt&&(at?n.texStorage2D(s.TEXTURE_2D,1,rt,Ce.width,Ce.height):n.texImage2D(s.TEXTURE_2D,0,rt,Ce.width,Ce.height,0,ke,Qe,null));else if(T.isDataTexture)if(ht.length>0){at&&Pt&&n.texStorage2D(s.TEXTURE_2D,Y,rt,ht[0].width,ht[0].height);for(let Q=0,le=ht.length;Q<le;Q++)He=ht[Q],at?W&&n.texSubImage2D(s.TEXTURE_2D,Q,0,0,He.width,He.height,ke,Qe,He.data):n.texImage2D(s.TEXTURE_2D,Q,rt,He.width,He.height,0,ke,Qe,He.data);T.generateMipmaps=!1}else at?(Pt&&n.texStorage2D(s.TEXTURE_2D,Y,rt,Ce.width,Ce.height),W&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,Ce.width,Ce.height,ke,Qe,Ce.data)):n.texImage2D(s.TEXTURE_2D,0,rt,Ce.width,Ce.height,0,ke,Qe,Ce.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){at&&Pt&&n.texStorage3D(s.TEXTURE_2D_ARRAY,Y,rt,ht[0].width,ht[0].height,Ce.depth);for(let Q=0,le=ht.length;Q<le;Q++)if(He=ht[Q],T.format!==qi)if(ke!==null)if(at){if(W)if(T.layerUpdates.size>0){const be=lg(He.width,He.height,T.format,T.type);for(const Pe of T.layerUpdates){const st=He.data.subarray(Pe*be/He.data.BYTES_PER_ELEMENT,(Pe+1)*be/He.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,Pe,He.width,He.height,1,ke,st)}T.clearLayerUpdates()}else n.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,He.width,He.height,Ce.depth,ke,He.data)}else n.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,rt,He.width,He.height,Ce.depth,0,He.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else at?W&&n.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,He.width,He.height,Ce.depth,ke,Qe,He.data):n.texImage3D(s.TEXTURE_2D_ARRAY,Q,rt,He.width,He.height,Ce.depth,0,ke,Qe,He.data)}else{at&&Pt&&n.texStorage2D(s.TEXTURE_2D,Y,rt,ht[0].width,ht[0].height);for(let Q=0,le=ht.length;Q<le;Q++)He=ht[Q],T.format!==qi?ke!==null?at?W&&n.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,He.width,He.height,ke,He.data):n.compressedTexImage2D(s.TEXTURE_2D,Q,rt,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?W&&n.texSubImage2D(s.TEXTURE_2D,Q,0,0,He.width,He.height,ke,Qe,He.data):n.texImage2D(s.TEXTURE_2D,Q,rt,He.width,He.height,0,ke,Qe,He.data)}else if(T.isDataArrayTexture)if(at){if(Pt&&n.texStorage3D(s.TEXTURE_2D_ARRAY,Y,rt,Ce.width,Ce.height,Ce.depth),W)if(T.layerUpdates.size>0){const Q=lg(Ce.width,Ce.height,T.format,T.type);for(const le of T.layerUpdates){const be=Ce.data.subarray(le*Q/Ce.data.BYTES_PER_ELEMENT,(le+1)*Q/Ce.data.BYTES_PER_ELEMENT);n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,le,Ce.width,Ce.height,1,ke,Qe,be)}T.clearLayerUpdates()}else n.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ce.width,Ce.height,Ce.depth,ke,Qe,Ce.data)}else n.texImage3D(s.TEXTURE_2D_ARRAY,0,rt,Ce.width,Ce.height,Ce.depth,0,ke,Qe,Ce.data);else if(T.isData3DTexture)at?(Pt&&n.texStorage3D(s.TEXTURE_3D,Y,rt,Ce.width,Ce.height,Ce.depth),W&&n.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ce.width,Ce.height,Ce.depth,ke,Qe,Ce.data)):n.texImage3D(s.TEXTURE_3D,0,rt,Ce.width,Ce.height,Ce.depth,0,ke,Qe,Ce.data);else if(T.isFramebufferTexture){if(Pt)if(at)n.texStorage2D(s.TEXTURE_2D,Y,rt,Ce.width,Ce.height);else{let Q=Ce.width,le=Ce.height;for(let be=0;be<Y;be++)n.texImage2D(s.TEXTURE_2D,be,rt,Q,le,0,ke,Qe,null),Q>>=1,le>>=1}}else if(ht.length>0){if(at&&Pt){const Q=Xe(ht[0]);n.texStorage2D(s.TEXTURE_2D,Y,rt,Q.width,Q.height)}for(let Q=0,le=ht.length;Q<le;Q++)He=ht[Q],at?W&&n.texSubImage2D(s.TEXTURE_2D,Q,0,0,ke,Qe,He):n.texImage2D(s.TEXTURE_2D,Q,rt,ke,Qe,He);T.generateMipmaps=!1}else if(at){if(Pt){const Q=Xe(Ce);n.texStorage2D(s.TEXTURE_2D,Y,rt,Q.width,Q.height)}W&&n.texSubImage2D(s.TEXTURE_2D,0,0,0,ke,Qe,Ce)}else n.texImage2D(s.TEXTURE_2D,0,rt,ke,Qe,Ce);y(T)&&v(_e),je.__version=ge.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function pe(P,T,ee){if(T.image.length!==6)return;const _e=Fe(P,T),Se=T.source;n.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+ee);const ge=r.get(Se);if(Se.version!==ge.__version||_e===!0){n.activeTexture(s.TEXTURE0+ee);const je=Dt.getPrimaries(Dt.workingColorSpace),Ie=T.colorSpace===hs?null:Dt.getPrimaries(T.colorSpace),ze=T.colorSpace===hs||je===Ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);const ct=T.isCompressedTexture||T.image[0].isCompressedTexture,Ce=T.image[0]&&T.image[0].isDataTexture,ke=[];for(let le=0;le<6;le++)!ct&&!Ce?ke[le]=w(T.image[le],!0,a.maxCubemapSize):ke[le]=Ce?T.image[le].image:T.image[le],ke[le]=It(T,ke[le]);const Qe=ke[0],rt=c.convert(T.format,T.colorSpace),He=c.convert(T.type),ht=L(T.internalFormat,rt,He,T.colorSpace),at=T.isVideoTexture!==!0,Pt=ge.__version===void 0||_e===!0,W=Se.dataReady;let Y=H(T,Qe);se(s.TEXTURE_CUBE_MAP,T);let Q;if(ct){at&&Pt&&n.texStorage2D(s.TEXTURE_CUBE_MAP,Y,ht,Qe.width,Qe.height);for(let le=0;le<6;le++){Q=ke[le].mipmaps;for(let be=0;be<Q.length;be++){const Pe=Q[be];T.format!==qi?rt!==null?at?W&&n.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be,0,0,Pe.width,Pe.height,rt,Pe.data):n.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be,ht,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):at?W&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be,0,0,Pe.width,Pe.height,rt,He,Pe.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be,ht,Pe.width,Pe.height,0,rt,He,Pe.data)}}}else{if(Q=T.mipmaps,at&&Pt){Q.length>0&&Y++;const le=Xe(ke[0]);n.texStorage2D(s.TEXTURE_CUBE_MAP,Y,ht,le.width,le.height)}for(let le=0;le<6;le++)if(Ce){at?W&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ke[le].width,ke[le].height,rt,He,ke[le].data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,ht,ke[le].width,ke[le].height,0,rt,He,ke[le].data);for(let be=0;be<Q.length;be++){const st=Q[be].image[le].image;at?W&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be+1,0,0,st.width,st.height,rt,He,st.data):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be+1,ht,st.width,st.height,0,rt,He,st.data)}}else{at?W&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,rt,He,ke[le]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,ht,rt,He,ke[le]);for(let be=0;be<Q.length;be++){const Pe=Q[be];at?W&&n.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be+1,0,0,rt,He,Pe.image[le]):n.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,be+1,ht,rt,He,Pe.image[le])}}}y(T)&&v(s.TEXTURE_CUBE_MAP),ge.__version=Se.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function we(P,T,ee,_e,Se,ge){const je=c.convert(ee.format,ee.colorSpace),Ie=c.convert(ee.type),ze=L(ee.internalFormat,je,Ie,ee.colorSpace),ct=r.get(T),Ce=r.get(ee);if(Ce.__renderTarget=T,!ct.__hasExternalTextures){const ke=Math.max(1,T.width>>ge),Qe=Math.max(1,T.height>>ge);Se===s.TEXTURE_3D||Se===s.TEXTURE_2D_ARRAY?n.texImage3D(Se,ge,ze,ke,Qe,T.depth,0,je,Ie,null):n.texImage2D(Se,ge,ze,ke,Qe,0,je,Ie,null)}n.bindFramebuffer(s.FRAMEBUFFER,P),dt(T)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,_e,Se,Ce.__webglTexture,0,mt(T)):(Se===s.TEXTURE_2D||Se>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Se<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,_e,Se,Ce.__webglTexture,ge),n.bindFramebuffer(s.FRAMEBUFFER,null)}function xe(P,T,ee){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer){const _e=T.depthTexture,Se=_e&&_e.isDepthTexture?_e.type:null,ge=b(T.stencilBuffer,Se),je=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ie=mt(T);dt(T)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ie,ge,T.width,T.height):ee?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ie,ge,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,ge,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,je,s.RENDERBUFFER,P)}else{const _e=T.textures;for(let Se=0;Se<_e.length;Se++){const ge=_e[Se],je=c.convert(ge.format,ge.colorSpace),Ie=c.convert(ge.type),ze=L(ge.internalFormat,je,Ie,ge.colorSpace),ct=mt(T);ee&&dt(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,ze,T.width,T.height):dt(T)?d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,ze,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,ze,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Le(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const _e=r.get(T.depthTexture);_e.__renderTarget=T,(!_e.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),me(T.depthTexture,0);const Se=_e.__webglTexture,ge=mt(T);if(T.depthTexture.format===Zo)dt(T)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Se,0,ge):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Se,0);else if(T.depthTexture.format===ia)dt(T)?d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Se,0,ge):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Se,0);else throw new Error("Unknown depthTexture format")}function ve(P){const T=r.get(P),ee=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const _e=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),_e){const Se=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,_e.removeEventListener("dispose",Se)};_e.addEventListener("dispose",Se),T.__depthDisposeCallback=Se}T.__boundDepthTexture=_e}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(ee)throw new Error("target.depthTexture not supported in Cube render targets");Le(T.__webglFramebuffer,P)}else if(ee){T.__webglDepthbuffer=[];for(let _e=0;_e<6;_e++)if(n.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[_e]),T.__webglDepthbuffer[_e]===void 0)T.__webglDepthbuffer[_e]=s.createRenderbuffer(),xe(T.__webglDepthbuffer[_e],P,!1);else{const Se=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ge=T.__webglDepthbuffer[_e];s.bindRenderbuffer(s.RENDERBUFFER,ge),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,ge)}}else if(n.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),xe(T.__webglDepthbuffer,P,!1);else{const _e=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Se),s.framebufferRenderbuffer(s.FRAMEBUFFER,_e,s.RENDERBUFFER,Se)}n.bindFramebuffer(s.FRAMEBUFFER,null)}function Ze(P,T,ee){const _e=r.get(P);T!==void 0&&we(_e.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),ee!==void 0&&ve(P)}function bt(P){const T=P.texture,ee=r.get(P),_e=r.get(T);P.addEventListener("dispose",N);const Se=P.textures,ge=P.isWebGLCubeRenderTarget===!0,je=Se.length>1;if(je||(_e.__webglTexture===void 0&&(_e.__webglTexture=s.createTexture()),_e.__version=T.version,u.memory.textures++),ge){ee.__webglFramebuffer=[];for(let Ie=0;Ie<6;Ie++)if(T.mipmaps&&T.mipmaps.length>0){ee.__webglFramebuffer[Ie]=[];for(let ze=0;ze<T.mipmaps.length;ze++)ee.__webglFramebuffer[Ie][ze]=s.createFramebuffer()}else ee.__webglFramebuffer[Ie]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){ee.__webglFramebuffer=[];for(let Ie=0;Ie<T.mipmaps.length;Ie++)ee.__webglFramebuffer[Ie]=s.createFramebuffer()}else ee.__webglFramebuffer=s.createFramebuffer();if(je)for(let Ie=0,ze=Se.length;Ie<ze;Ie++){const ct=r.get(Se[Ie]);ct.__webglTexture===void 0&&(ct.__webglTexture=s.createTexture(),u.memory.textures++)}if(P.samples>0&&dt(P)===!1){ee.__webglMultisampledFramebuffer=s.createFramebuffer(),ee.__webglColorRenderbuffer=[],n.bindFramebuffer(s.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let Ie=0;Ie<Se.length;Ie++){const ze=Se[Ie];ee.__webglColorRenderbuffer[Ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,ee.__webglColorRenderbuffer[Ie]);const ct=c.convert(ze.format,ze.colorSpace),Ce=c.convert(ze.type),ke=L(ze.internalFormat,ct,Ce,ze.colorSpace,P.isXRRenderTarget===!0),Qe=mt(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Qe,ke,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ie,s.RENDERBUFFER,ee.__webglColorRenderbuffer[Ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(ee.__webglDepthRenderbuffer=s.createRenderbuffer(),xe(ee.__webglDepthRenderbuffer,P,!0)),n.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ge){n.bindTexture(s.TEXTURE_CUBE_MAP,_e.__webglTexture),se(s.TEXTURE_CUBE_MAP,T);for(let Ie=0;Ie<6;Ie++)if(T.mipmaps&&T.mipmaps.length>0)for(let ze=0;ze<T.mipmaps.length;ze++)we(ee.__webglFramebuffer[Ie][ze],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ie,ze);else we(ee.__webglFramebuffer[Ie],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Ie,0);y(T)&&v(s.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(je){for(let Ie=0,ze=Se.length;Ie<ze;Ie++){const ct=Se[Ie],Ce=r.get(ct);n.bindTexture(s.TEXTURE_2D,Ce.__webglTexture),se(s.TEXTURE_2D,ct),we(ee.__webglFramebuffer,P,ct,s.COLOR_ATTACHMENT0+Ie,s.TEXTURE_2D,0),y(ct)&&v(s.TEXTURE_2D)}n.unbindTexture()}else{let Ie=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Ie=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),n.bindTexture(Ie,_e.__webglTexture),se(Ie,T),T.mipmaps&&T.mipmaps.length>0)for(let ze=0;ze<T.mipmaps.length;ze++)we(ee.__webglFramebuffer[ze],P,T,s.COLOR_ATTACHMENT0,Ie,ze);else we(ee.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,Ie,0);y(T)&&v(Ie),n.unbindTexture()}P.depthBuffer&&ve(P)}function gt(P){const T=P.textures;for(let ee=0,_e=T.length;ee<_e;ee++){const Se=T[ee];if(y(Se)){const ge=I(P),je=r.get(Se).__webglTexture;n.bindTexture(ge,je),v(ge),n.unbindTexture()}}}const zt=[],B=[];function Cn(P){if(P.samples>0){if(dt(P)===!1){const T=P.textures,ee=P.width,_e=P.height;let Se=s.COLOR_BUFFER_BIT;const ge=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,je=r.get(P),Ie=T.length>1;if(Ie)for(let ze=0;ze<T.length;ze++)n.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ze,s.RENDERBUFFER,null),n.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ze,s.TEXTURE_2D,null,0);n.bindFramebuffer(s.READ_FRAMEBUFFER,je.__webglMultisampledFramebuffer),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let ze=0;ze<T.length;ze++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Se|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Se|=s.STENCIL_BUFFER_BIT)),Ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,je.__webglColorRenderbuffer[ze]);const ct=r.get(T[ze]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ct,0)}s.blitFramebuffer(0,0,ee,_e,0,0,ee,_e,Se,s.NEAREST),h===!0&&(zt.length=0,B.length=0,zt.push(s.COLOR_ATTACHMENT0+ze),P.depthBuffer&&P.resolveDepthBuffer===!1&&(zt.push(ge),B.push(ge),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,B)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,zt))}if(n.bindFramebuffer(s.READ_FRAMEBUFFER,null),n.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Ie)for(let ze=0;ze<T.length;ze++){n.bindFramebuffer(s.FRAMEBUFFER,je.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ze,s.RENDERBUFFER,je.__webglColorRenderbuffer[ze]);const ct=r.get(T[ze]).__webglTexture;n.bindFramebuffer(s.FRAMEBUFFER,je.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ze,s.TEXTURE_2D,ct,0)}n.bindFramebuffer(s.DRAW_FRAMEBUFFER,je.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&h){const T=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function mt(P){return Math.min(a.maxSamples,P.samples)}function dt(P){const T=r.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ye(P){const T=u.render.frame;g.get(P)!==T&&(g.set(P,T),P.update())}function It(P,T){const ee=P.colorSpace,_e=P.format,Se=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||ee!==ra&&ee!==hs&&(Dt.getTransfer(ee)===kt?(_e!==qi||Se!==Nr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ee)),T}function Xe(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(m.width=P.naturalWidth||P.width,m.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(m.width=P.displayWidth,m.height=P.displayHeight):(m.width=P.width,m.height=P.height),m}this.allocateTextureUnit=Z,this.resetTextureUnits=ie,this.setTexture2D=me,this.setTexture2DArray=ae,this.setTexture3D=he,this.setTextureCube=k,this.rebindTextures=Ze,this.setupRenderTarget=bt,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=Cn,this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=we,this.useMultisampledRTT=dt}function BE(s,e){function n(r,a=hs){let c;const u=Dt.getTransfer(a);if(r===Nr)return s.UNSIGNED_BYTE;if(r===$d)return s.UNSIGNED_SHORT_4_4_4_4;if(r===qd)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Vg)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===kg)return s.BYTE;if(r===Hg)return s.SHORT;if(r===Ya)return s.UNSIGNED_SHORT;if(r===jd)return s.INT;if(r===eo)return s.UNSIGNED_INT;if(r===Dr)return s.FLOAT;if(r===Ka)return s.HALF_FLOAT;if(r===Gg)return s.ALPHA;if(r===Wg)return s.RGB;if(r===qi)return s.RGBA;if(r===Xg)return s.LUMINANCE;if(r===jg)return s.LUMINANCE_ALPHA;if(r===Zo)return s.DEPTH_COMPONENT;if(r===ia)return s.DEPTH_STENCIL;if(r===$g)return s.RED;if(r===Yd)return s.RED_INTEGER;if(r===qg)return s.RG;if(r===Kd)return s.RG_INTEGER;if(r===Zd)return s.RGBA_INTEGER;if(r===Cc||r===Rc||r===bc||r===Pc)if(u===kt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(r===Cc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Rc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===bc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Pc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(r===Cc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Rc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===bc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Pc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===hd||r===pd||r===md||r===gd)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(r===hd)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===pd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===md)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===gd)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===vd||r===_d||r===xd)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(r===vd||r===_d)return u===kt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(r===xd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===yd||r===Sd||r===Md||r===Ed||r===wd||r===Td||r===Ad||r===Cd||r===Rd||r===bd||r===Pd||r===Ld||r===Dd||r===Id)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(r===yd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Sd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Md)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ed)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===wd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Td)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ad)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Cd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Rd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===bd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Pd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ld)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Dd)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Id)return u===kt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Lc||r===Ud||r===Nd)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(r===Lc)return u===kt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ud)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Nd)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Yg||r===Fd||r===Od||r===zd)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(r===Lc)return c.COMPRESSED_RED_RGTC1_EXT;if(r===Fd)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Od)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===zd)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===na?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:n}}const kE={type:"move"};class Jf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const r of e.hand.values())this._getHandJoint(n,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,r){let a=null,c=null,u=null;const d=this._targetRay,h=this._grip,m=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(m&&e.hand){u=!0;for(const w of e.hand.values()){const y=n.getJointPose(w,r),v=this._getHandJoint(m,w);y!==null&&(v.matrix.fromArray(y.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=y.radius),v.visible=y!==null}const g=m.joints["index-finger-tip"],_=m.joints["thumb-tip"],x=g.position.distanceTo(_.position),S=.02,E=.005;m.inputState.pinching&&x>S+E?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&x<=S-E&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(c=n.getPose(e.gripSpace,r),c!==null&&(h.matrix.fromArray(c.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,c.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(c.linearVelocity)):h.hasLinearVelocity=!1,c.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(c.angularVelocity)):h.hasAngularVelocity=!1));d!==null&&(a=n.getPose(e.targetRaySpace,r),a===null&&c!==null&&(a=c),a!==null&&(d.matrix.fromArray(a.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,a.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(a.linearVelocity)):d.hasLinearVelocity=!1,a.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(a.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(kE)))}return d!==null&&(d.visible=a!==null),h!==null&&(h.visible=c!==null),m!==null&&(m.visible=u!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const r=new qo;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[n.jointName]=r,e.add(r)}return e.joints[n.jointName]}}const HE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,VE=`
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

}`;class GE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,r){if(this.texture===null){const a=new oi,c=e.properties.get(a);c.__webglTexture=n.texture,(n.depthNear!==r.depthNear||n.depthFar!==r.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,r=new ur({vertexShader:HE,fragmentShader:VE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new An(new oa(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WE extends aa{constructor(e,n){super();const r=this;let a=null,c=1,u=null,d="local-floor",h=1,m=null,g=null,_=null,x=null,S=null,E=null;const w=new GE,y=n.getContextAttributes();let v=null,I=null;const L=[],b=[],H=new Ct;let F=null;const N=new Ri;N.viewport=new sn;const G=new Ri;G.viewport=new sn;const R=[N,G],C=new ux;let z=null,ie=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let pe=L[te];return pe===void 0&&(pe=new Jf,L[te]=pe),pe.getTargetRaySpace()},this.getControllerGrip=function(te){let pe=L[te];return pe===void 0&&(pe=new Jf,L[te]=pe),pe.getGripSpace()},this.getHand=function(te){let pe=L[te];return pe===void 0&&(pe=new Jf,L[te]=pe),pe.getHandSpace()};function Z(te){const pe=b.indexOf(te.inputSource);if(pe===-1)return;const we=L[pe];we!==void 0&&(we.update(te.inputSource,te.frame,m||u),we.dispatchEvent({type:te.type,data:te.inputSource}))}function ue(){a.removeEventListener("select",Z),a.removeEventListener("selectstart",Z),a.removeEventListener("selectend",Z),a.removeEventListener("squeeze",Z),a.removeEventListener("squeezestart",Z),a.removeEventListener("squeezeend",Z),a.removeEventListener("end",ue),a.removeEventListener("inputsourceschange",me);for(let te=0;te<L.length;te++){const pe=b[te];pe!==null&&(b[te]=null,L[te].disconnect(pe))}z=null,ie=null,w.reset(),e.setRenderTarget(v),S=null,x=null,_=null,a=null,I=null,Fe.stop(),r.isPresenting=!1,e.setPixelRatio(F),e.setSize(H.width,H.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){c=te,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){d=te,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||u},this.setReferenceSpace=function(te){m=te},this.getBaseLayer=function(){return x!==null?x:S},this.getBinding=function(){return _},this.getFrame=function(){return E},this.getSession=function(){return a},this.setSession=async function(te){if(a=te,a!==null){if(v=e.getRenderTarget(),a.addEventListener("select",Z),a.addEventListener("selectstart",Z),a.addEventListener("selectend",Z),a.addEventListener("squeeze",Z),a.addEventListener("squeezestart",Z),a.addEventListener("squeezeend",Z),a.addEventListener("end",ue),a.addEventListener("inputsourceschange",me),y.xrCompatible!==!0&&await n.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(H),a.enabledFeatures!==void 0&&a.enabledFeatures.includes("layers")){let we=null,xe=null,Le=null;y.depth&&(Le=y.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,we=y.stencil?ia:Zo,xe=y.stencil?na:eo);const ve={colorFormat:n.RGBA8,depthFormat:Le,scaleFactor:c};_=new XRWebGLBinding(a,n),x=_.createProjectionLayer(ve),a.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),I=new to(x.textureWidth,x.textureHeight,{format:qi,type:Nr,depthTexture:new c0(x.textureWidth,x.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1})}else{const we={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:c};S=new XRWebGLLayer(a,n,we),a.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),I=new to(S.framebufferWidth,S.framebufferHeight,{format:qi,type:Nr,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil})}I.isXRRenderTarget=!0,this.setFoveation(h),m=null,u=await a.requestReferenceSpace(d),Fe.setContext(a),Fe.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function me(te){for(let pe=0;pe<te.removed.length;pe++){const we=te.removed[pe],xe=b.indexOf(we);xe>=0&&(b[xe]=null,L[xe].disconnect(we))}for(let pe=0;pe<te.added.length;pe++){const we=te.added[pe];let xe=b.indexOf(we);if(xe===-1){for(let ve=0;ve<L.length;ve++)if(ve>=b.length){b.push(we),xe=ve;break}else if(b[ve]===null){b[ve]=we,xe=ve;break}if(xe===-1)break}const Le=L[xe];Le&&Le.connect(we)}}const ae=new j,he=new j;function k(te,pe,we){ae.setFromMatrixPosition(pe.matrixWorld),he.setFromMatrixPosition(we.matrixWorld);const xe=ae.distanceTo(he),Le=pe.projectionMatrix.elements,ve=we.projectionMatrix.elements,Ze=Le[14]/(Le[10]-1),bt=Le[14]/(Le[10]+1),gt=(Le[9]+1)/Le[5],zt=(Le[9]-1)/Le[5],B=(Le[8]-1)/Le[0],Cn=(ve[8]+1)/ve[0],mt=Ze*B,dt=Ze*Cn,Ye=xe/(-B+Cn),It=Ye*-B;if(pe.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(It),te.translateZ(Ye),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Le[10]===-1)te.projectionMatrix.copy(pe.projectionMatrix),te.projectionMatrixInverse.copy(pe.projectionMatrixInverse);else{const Xe=Ze+Ye,P=bt+Ye,T=mt-It,ee=dt+(xe-It),_e=gt*bt/P*Xe,Se=zt*bt/P*Xe;te.projectionMatrix.makePerspective(T,ee,_e,Se,Xe,P),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function de(te,pe){pe===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(pe.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(a===null)return;let pe=te.near,we=te.far;w.texture!==null&&(w.depthNear>0&&(pe=w.depthNear),w.depthFar>0&&(we=w.depthFar)),C.near=G.near=N.near=pe,C.far=G.far=N.far=we,(z!==C.near||ie!==C.far)&&(a.updateRenderState({depthNear:C.near,depthFar:C.far}),z=C.near,ie=C.far),N.layers.mask=te.layers.mask|2,G.layers.mask=te.layers.mask|4,C.layers.mask=N.layers.mask|G.layers.mask;const xe=te.parent,Le=C.cameras;de(C,xe);for(let ve=0;ve<Le.length;ve++)de(Le[ve],xe);Le.length===2?k(C,N,G):C.projectionMatrix.copy(N.projectionMatrix),oe(te,C,xe)};function oe(te,pe,we){we===null?te.matrix.copy(pe.matrixWorld):(te.matrix.copy(we.matrixWorld),te.matrix.invert(),te.matrix.multiply(pe.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(pe.projectionMatrix),te.projectionMatrixInverse.copy(pe.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Bd*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(x===null&&S===null))return h},this.setFoveation=function(te){h=te,x!==null&&(x.fixedFoveation=te),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=te)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(C)};let U=null;function se(te,pe){if(g=pe.getViewerPose(m||u),E=pe,g!==null){const we=g.views;S!==null&&(e.setRenderTargetFramebuffer(I,S.framebuffer),e.setRenderTarget(I));let xe=!1;we.length!==C.cameras.length&&(C.cameras.length=0,xe=!0);for(let ve=0;ve<we.length;ve++){const Ze=we[ve];let bt=null;if(S!==null)bt=S.getViewport(Ze);else{const zt=_.getViewSubImage(x,Ze);bt=zt.viewport,ve===0&&(e.setRenderTargetTextures(I,zt.colorTexture,x.ignoreDepthValues?void 0:zt.depthStencilTexture),e.setRenderTarget(I))}let gt=R[ve];gt===void 0&&(gt=new Ri,gt.layers.enable(ve),gt.viewport=new sn,R[ve]=gt),gt.matrix.fromArray(Ze.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(Ze.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(bt.x,bt.y,bt.width,bt.height),ve===0&&(C.matrix.copy(gt.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),xe===!0&&C.cameras.push(gt)}const Le=a.enabledFeatures;if(Le&&Le.includes("depth-sensing")){const ve=_.getDepthInformation(we[0]);ve&&ve.isValid&&ve.texture&&w.init(e,ve,a.renderState)}}for(let we=0;we<L.length;we++){const xe=b[we],Le=L[we];xe!==null&&Le!==void 0&&Le.update(xe,pe,m||u)}U&&U(te,pe),pe.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:pe}),E=null}const Fe=new d0;Fe.setAnimationLoop(se),this.setAnimationLoop=function(te){U=te},this.dispose=function(){}}}const Gs=new cr,XE=new jt;function jE(s,e){function n(y,v){y.matrixAutoUpdate===!0&&y.updateMatrix(),v.value.copy(y.matrix)}function r(y,v){v.color.getRGB(y.fogColor.value,r0(s)),v.isFog?(y.fogNear.value=v.near,y.fogFar.value=v.far):v.isFogExp2&&(y.fogDensity.value=v.density)}function a(y,v,I,L,b){v.isMeshBasicMaterial||v.isMeshLambertMaterial?c(y,v):v.isMeshToonMaterial?(c(y,v),_(y,v)):v.isMeshPhongMaterial?(c(y,v),g(y,v)):v.isMeshStandardMaterial?(c(y,v),x(y,v),v.isMeshPhysicalMaterial&&S(y,v,b)):v.isMeshMatcapMaterial?(c(y,v),E(y,v)):v.isMeshDepthMaterial?c(y,v):v.isMeshDistanceMaterial?(c(y,v),w(y,v)):v.isMeshNormalMaterial?c(y,v):v.isLineBasicMaterial?(u(y,v),v.isLineDashedMaterial&&d(y,v)):v.isPointsMaterial?h(y,v,I,L):v.isSpriteMaterial?m(y,v):v.isShadowMaterial?(y.color.value.copy(v.color),y.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function c(y,v){y.opacity.value=v.opacity,v.color&&y.diffuse.value.copy(v.color),v.emissive&&y.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(y.map.value=v.map,n(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,n(v.alphaMap,y.alphaMapTransform)),v.bumpMap&&(y.bumpMap.value=v.bumpMap,n(v.bumpMap,y.bumpMapTransform),y.bumpScale.value=v.bumpScale,v.side===si&&(y.bumpScale.value*=-1)),v.normalMap&&(y.normalMap.value=v.normalMap,n(v.normalMap,y.normalMapTransform),y.normalScale.value.copy(v.normalScale),v.side===si&&y.normalScale.value.negate()),v.displacementMap&&(y.displacementMap.value=v.displacementMap,n(v.displacementMap,y.displacementMapTransform),y.displacementScale.value=v.displacementScale,y.displacementBias.value=v.displacementBias),v.emissiveMap&&(y.emissiveMap.value=v.emissiveMap,n(v.emissiveMap,y.emissiveMapTransform)),v.specularMap&&(y.specularMap.value=v.specularMap,n(v.specularMap,y.specularMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest);const I=e.get(v),L=I.envMap,b=I.envMapRotation;L&&(y.envMap.value=L,Gs.copy(b),Gs.x*=-1,Gs.y*=-1,Gs.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Gs.y*=-1,Gs.z*=-1),y.envMapRotation.value.setFromMatrix4(XE.makeRotationFromEuler(Gs)),y.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=v.reflectivity,y.ior.value=v.ior,y.refractionRatio.value=v.refractionRatio),v.lightMap&&(y.lightMap.value=v.lightMap,y.lightMapIntensity.value=v.lightMapIntensity,n(v.lightMap,y.lightMapTransform)),v.aoMap&&(y.aoMap.value=v.aoMap,y.aoMapIntensity.value=v.aoMapIntensity,n(v.aoMap,y.aoMapTransform))}function u(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,v.map&&(y.map.value=v.map,n(v.map,y.mapTransform))}function d(y,v){y.dashSize.value=v.dashSize,y.totalSize.value=v.dashSize+v.gapSize,y.scale.value=v.scale}function h(y,v,I,L){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.size.value=v.size*I,y.scale.value=L*.5,v.map&&(y.map.value=v.map,n(v.map,y.uvTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,n(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function m(y,v){y.diffuse.value.copy(v.color),y.opacity.value=v.opacity,y.rotation.value=v.rotation,v.map&&(y.map.value=v.map,n(v.map,y.mapTransform)),v.alphaMap&&(y.alphaMap.value=v.alphaMap,n(v.alphaMap,y.alphaMapTransform)),v.alphaTest>0&&(y.alphaTest.value=v.alphaTest)}function g(y,v){y.specular.value.copy(v.specular),y.shininess.value=Math.max(v.shininess,1e-4)}function _(y,v){v.gradientMap&&(y.gradientMap.value=v.gradientMap)}function x(y,v){y.metalness.value=v.metalness,v.metalnessMap&&(y.metalnessMap.value=v.metalnessMap,n(v.metalnessMap,y.metalnessMapTransform)),y.roughness.value=v.roughness,v.roughnessMap&&(y.roughnessMap.value=v.roughnessMap,n(v.roughnessMap,y.roughnessMapTransform)),v.envMap&&(y.envMapIntensity.value=v.envMapIntensity)}function S(y,v,I){y.ior.value=v.ior,v.sheen>0&&(y.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),y.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(y.sheenColorMap.value=v.sheenColorMap,n(v.sheenColorMap,y.sheenColorMapTransform)),v.sheenRoughnessMap&&(y.sheenRoughnessMap.value=v.sheenRoughnessMap,n(v.sheenRoughnessMap,y.sheenRoughnessMapTransform))),v.clearcoat>0&&(y.clearcoat.value=v.clearcoat,y.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(y.clearcoatMap.value=v.clearcoatMap,n(v.clearcoatMap,y.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,n(v.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(y.clearcoatNormalMap.value=v.clearcoatNormalMap,n(v.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===si&&y.clearcoatNormalScale.value.negate())),v.dispersion>0&&(y.dispersion.value=v.dispersion),v.iridescence>0&&(y.iridescence.value=v.iridescence,y.iridescenceIOR.value=v.iridescenceIOR,y.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(y.iridescenceMap.value=v.iridescenceMap,n(v.iridescenceMap,y.iridescenceMapTransform)),v.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=v.iridescenceThicknessMap,n(v.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),v.transmission>0&&(y.transmission.value=v.transmission,y.transmissionSamplerMap.value=I.texture,y.transmissionSamplerSize.value.set(I.width,I.height),v.transmissionMap&&(y.transmissionMap.value=v.transmissionMap,n(v.transmissionMap,y.transmissionMapTransform)),y.thickness.value=v.thickness,v.thicknessMap&&(y.thicknessMap.value=v.thicknessMap,n(v.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=v.attenuationDistance,y.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(y.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(y.anisotropyMap.value=v.anisotropyMap,n(v.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=v.specularIntensity,y.specularColor.value.copy(v.specularColor),v.specularColorMap&&(y.specularColorMap.value=v.specularColorMap,n(v.specularColorMap,y.specularColorMapTransform)),v.specularIntensityMap&&(y.specularIntensityMap.value=v.specularIntensityMap,n(v.specularIntensityMap,y.specularIntensityMapTransform))}function E(y,v){v.matcap&&(y.matcap.value=v.matcap)}function w(y,v){const I=e.get(v).light;y.referencePosition.value.setFromMatrixPosition(I.matrixWorld),y.nearDistance.value=I.shadow.camera.near,y.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function $E(s,e,n,r){let a={},c={},u=[];const d=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(I,L){const b=L.program;r.uniformBlockBinding(I,b)}function m(I,L){let b=a[I.id];b===void 0&&(E(I),b=g(I),a[I.id]=b,I.addEventListener("dispose",y));const H=L.program;r.updateUBOMapping(I,H);const F=e.render.frame;c[I.id]!==F&&(x(I),c[I.id]=F)}function g(I){const L=_();I.__bindingPointIndex=L;const b=s.createBuffer(),H=I.__size,F=I.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,H,F),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,L,b),b}function _(){for(let I=0;I<d;I++)if(u.indexOf(I)===-1)return u.push(I),I;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(I){const L=a[I.id],b=I.uniforms,H=I.__cache;s.bindBuffer(s.UNIFORM_BUFFER,L);for(let F=0,N=b.length;F<N;F++){const G=Array.isArray(b[F])?b[F]:[b[F]];for(let R=0,C=G.length;R<C;R++){const z=G[R];if(S(z,F,R,H)===!0){const ie=z.__offset,Z=Array.isArray(z.value)?z.value:[z.value];let ue=0;for(let me=0;me<Z.length;me++){const ae=Z[me],he=w(ae);typeof ae=="number"||typeof ae=="boolean"?(z.__data[0]=ae,s.bufferSubData(s.UNIFORM_BUFFER,ie+ue,z.__data)):ae.isMatrix3?(z.__data[0]=ae.elements[0],z.__data[1]=ae.elements[1],z.__data[2]=ae.elements[2],z.__data[3]=0,z.__data[4]=ae.elements[3],z.__data[5]=ae.elements[4],z.__data[6]=ae.elements[5],z.__data[7]=0,z.__data[8]=ae.elements[6],z.__data[9]=ae.elements[7],z.__data[10]=ae.elements[8],z.__data[11]=0):(ae.toArray(z.__data,ue),ue+=he.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ie,z.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(I,L,b,H){const F=I.value,N=L+"_"+b;if(H[N]===void 0)return typeof F=="number"||typeof F=="boolean"?H[N]=F:H[N]=F.clone(),!0;{const G=H[N];if(typeof F=="number"||typeof F=="boolean"){if(G!==F)return H[N]=F,!0}else if(G.equals(F)===!1)return G.copy(F),!0}return!1}function E(I){const L=I.uniforms;let b=0;const H=16;for(let N=0,G=L.length;N<G;N++){const R=Array.isArray(L[N])?L[N]:[L[N]];for(let C=0,z=R.length;C<z;C++){const ie=R[C],Z=Array.isArray(ie.value)?ie.value:[ie.value];for(let ue=0,me=Z.length;ue<me;ue++){const ae=Z[ue],he=w(ae),k=b%H,de=k%he.boundary,oe=k+de;b+=de,oe!==0&&H-oe<he.storage&&(b+=H-oe),ie.__data=new Float32Array(he.storage/Float32Array.BYTES_PER_ELEMENT),ie.__offset=b,b+=he.storage}}}const F=b%H;return F>0&&(b+=H-F),I.__size=b,I.__cache={},this}function w(I){const L={boundary:0,storage:0};return typeof I=="number"||typeof I=="boolean"?(L.boundary=4,L.storage=4):I.isVector2?(L.boundary=8,L.storage=8):I.isVector3||I.isColor?(L.boundary=16,L.storage=12):I.isVector4?(L.boundary=16,L.storage=16):I.isMatrix3?(L.boundary=48,L.storage=48):I.isMatrix4?(L.boundary=64,L.storage=64):I.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",I),L}function y(I){const L=I.target;L.removeEventListener("dispose",y);const b=u.indexOf(L.__bindingPointIndex);u.splice(b,1),s.deleteBuffer(a[L.id]),delete a[L.id],delete c[L.id]}function v(){for(const I in a)s.deleteBuffer(a[I]);u=[],a={},c={}}return{bind:h,update:m,dispose:v}}class qE{constructor(e={}){const{canvas:n=b_(),context:r=null,depth:a=!0,stencil:c=!1,alpha:u=!1,antialias:d=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:m=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1,reverseDepthBuffer:x=!1}=e;this.isWebGLRenderer=!0;let S;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=r.getContextAttributes().alpha}else S=u;const E=new Uint32Array(4),w=new Int32Array(4);let y=null,v=null;const I=[],L=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ci,this.toneMapping=gs,this.toneMappingExposure=1;const b=this;let H=!1,F=0,N=0,G=null,R=-1,C=null;const z=new sn,ie=new sn;let Z=null;const ue=new St(0);let me=0,ae=n.width,he=n.height,k=1,de=null,oe=null;const U=new sn(0,0,ae,he),se=new sn(0,0,ae,he);let Fe=!1;const te=new Jd;let pe=!1,we=!1;this.transmissionResolutionScale=1;const xe=new jt,Le=new jt,ve=new j,Ze=new sn,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function zt(){return G===null?k:1}let B=r;function Cn(A,X){return n.getContext(A,X)}try{const A={alpha:!0,depth:a,stencil:c,antialias:d,premultipliedAlpha:h,preserveDrawingBuffer:m,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Wd}`),n.addEventListener("webglcontextlost",le,!1),n.addEventListener("webglcontextrestored",be,!1),n.addEventListener("webglcontextcreationerror",Pe,!1),B===null){const X="webgl2";if(B=Cn(X,A),B===null)throw Cn(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let mt,dt,Ye,It,Xe,P,T,ee,_e,Se,ge,je,Ie,ze,ct,Ce,ke,Qe,rt,He,ht,at,Pt,W;function Y(){mt=new iM(B),mt.init(),at=new BE(B,mt),dt=new ZS(B,mt,e,at),Ye=new OE(B,mt),dt.reverseDepthBuffer&&x&&Ye.buffers.depth.setReversed(!0),It=new oM(B),Xe=new wE,P=new zE(B,mt,Ye,Xe,dt,at,It),T=new JS(b),ee=new nM(b),_e=new hx(B),Pt=new YS(B,_e),Se=new rM(B,_e,It,Pt),ge=new lM(B,Se,_e,It),rt=new aM(B,dt,P),Ce=new QS(Xe),je=new EE(b,T,ee,mt,dt,Pt,Ce),Ie=new jE(b,Xe),ze=new AE,ct=new DE(mt),Qe=new qS(b,T,ee,Ye,ge,S,h),ke=new NE(b,ge,dt),W=new $E(B,It,dt,Ye),He=new KS(B,mt,It),ht=new sM(B,mt,It),It.programs=je.programs,b.capabilities=dt,b.extensions=mt,b.properties=Xe,b.renderLists=ze,b.shadowMap=ke,b.state=Ye,b.info=It}Y();const Q=new WE(b,B);this.xr=Q,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const A=mt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=mt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(A){A!==void 0&&(k=A,this.setSize(ae,he,!1))},this.getSize=function(A){return A.set(ae,he)},this.setSize=function(A,X,ne=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ae=A,he=X,n.width=Math.floor(A*k),n.height=Math.floor(X*k),ne===!0&&(n.style.width=A+"px",n.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(ae*k,he*k).floor()},this.setDrawingBufferSize=function(A,X,ne){ae=A,he=X,k=ne,n.width=Math.floor(A*ne),n.height=Math.floor(X*ne),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(z)},this.getViewport=function(A){return A.copy(U)},this.setViewport=function(A,X,ne,q){A.isVector4?U.set(A.x,A.y,A.z,A.w):U.set(A,X,ne,q),Ye.viewport(z.copy(U).multiplyScalar(k).round())},this.getScissor=function(A){return A.copy(se)},this.setScissor=function(A,X,ne,q){A.isVector4?se.set(A.x,A.y,A.z,A.w):se.set(A,X,ne,q),Ye.scissor(ie.copy(se).multiplyScalar(k).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(A){Ye.setScissorTest(Fe=A)},this.setOpaqueSort=function(A){de=A},this.setTransparentSort=function(A){oe=A},this.getClearColor=function(A){return A.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor.apply(Qe,arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha.apply(Qe,arguments)},this.clear=function(A=!0,X=!0,ne=!0){let q=0;if(A){let $=!1;if(G!==null){const Te=G.texture.format;$=Te===Zd||Te===Kd||Te===Yd}if($){const Te=G.texture.type,De=Te===Nr||Te===eo||Te===Ya||Te===na||Te===$d||Te===qd,Ne=Qe.getClearColor(),Be=Qe.getClearAlpha(),it=Ne.r,Je=Ne.g,Ge=Ne.b;De?(E[0]=it,E[1]=Je,E[2]=Ge,E[3]=Be,B.clearBufferuiv(B.COLOR,0,E)):(w[0]=it,w[1]=Je,w[2]=Ge,w[3]=Be,B.clearBufferiv(B.COLOR,0,w))}else q|=B.COLOR_BUFFER_BIT}X&&(q|=B.DEPTH_BUFFER_BIT),ne&&(q|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",le,!1),n.removeEventListener("webglcontextrestored",be,!1),n.removeEventListener("webglcontextcreationerror",Pe,!1),Qe.dispose(),ze.dispose(),ct.dispose(),Xe.dispose(),T.dispose(),ee.dispose(),ge.dispose(),Pt.dispose(),W.dispose(),je.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",Fr),Q.removeEventListener("sessionend",vi),$n.stop()};function le(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),H=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),H=!1;const A=It.autoReset,X=ke.enabled,ne=ke.autoUpdate,q=ke.needsUpdate,$=ke.type;Y(),It.autoReset=A,ke.enabled=X,ke.autoUpdate=ne,ke.needsUpdate=q,ke.type=$}function Pe(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function st(A){const X=A.target;X.removeEventListener("dispose",st),Bt(X)}function Bt(A){Ht(A),Xe.remove(A)}function Ht(A){const X=Xe.get(A).programs;X!==void 0&&(X.forEach(function(ne){je.releaseProgram(ne)}),A.isShaderMaterial&&je.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,ne,q,$,Te){X===null&&(X=bt);const De=$.isMesh&&$.matrixWorld.determinant()<0,Ne=_s(A,X,ne,q,$);Ye.setMaterial(q,De);let Be=ne.index,it=1;if(q.wireframe===!0){if(Be=Se.getWireframeAttribute(ne),Be===void 0)return;it=2}const Je=ne.drawRange,Ge=ne.attributes.position;let xt=Je.start*it,lt=(Je.start+Je.count)*it;Te!==null&&(xt=Math.max(xt,Te.start*it),lt=Math.min(lt,(Te.start+Te.count)*it)),Be!==null?(xt=Math.max(xt,0),lt=Math.min(lt,Be.count)):Ge!=null&&(xt=Math.max(xt,0),lt=Math.min(lt,Ge.count));const $t=lt-xt;if($t<0||$t===1/0)return;Pt.setup($,q,Ne,ne,Be);let Vt,Mt=He;if(Be!==null&&(Vt=_e.get(Be),Mt=ht,Mt.setIndex(Vt)),$.isMesh)q.wireframe===!0?(Ye.setLineWidth(q.wireframeLinewidth*zt()),Mt.setMode(B.LINES)):Mt.setMode(B.TRIANGLES);else if($.isLine){let Ke=q.linewidth;Ke===void 0&&(Ke=1),Ye.setLineWidth(Ke*zt()),$.isLineSegments?Mt.setMode(B.LINES):$.isLineLoop?Mt.setMode(B.LINE_LOOP):Mt.setMode(B.LINE_STRIP)}else $.isPoints?Mt.setMode(B.POINTS):$.isSprite&&Mt.setMode(B.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Mt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(mt.get("WEBGL_multi_draw"))Mt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Ke=$._multiDrawStarts,qt=$._multiDrawCounts,vt=$._multiDrawCount,fn=Be?_e.get(Be).bytesPerElement:1,Zi=Xe.get(q).currentProgram.getUniforms();for(let bn=0;bn<vt;bn++)Zi.setValue(B,"_gl_DrawID",bn),Mt.render(Ke[bn]/fn,qt[bn])}else if($.isInstancedMesh)Mt.renderInstances(xt,$t,$.count);else if(ne.isInstancedBufferGeometry){const Ke=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,qt=Math.min(ne.instanceCount,Ke);Mt.renderInstances(xt,$t,qt)}else Mt.render(xt,$t)};function Et(A,X,ne){A.transparent===!0&&A.side===gi&&A.forceSinglePass===!1?(A.side=si,A.needsUpdate=!0,Or(A,X,ne),A.side=vs,A.needsUpdate=!0,Or(A,X,ne),A.side=gi):Or(A,X,ne)}this.compile=function(A,X,ne=null){ne===null&&(ne=A),v=ct.get(ne),v.init(X),L.push(v),ne.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(v.pushLight($),$.castShadow&&v.pushShadow($))}),A!==ne&&A.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(v.pushLight($),$.castShadow&&v.pushShadow($))}),v.setupLights();const q=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Te=$.material;if(Te)if(Array.isArray(Te))for(let De=0;De<Te.length;De++){const Ne=Te[De];Et(Ne,ne,$),q.add(Ne)}else Et(Te,ne,$),q.add(Te)}),L.pop(),v=null,q},this.compileAsync=function(A,X,ne=null){const q=this.compile(A,X,ne);return new Promise($=>{function Te(){if(q.forEach(function(De){Xe.get(De).currentProgram.isReady()&&q.delete(De)}),q.size===0){$(A);return}setTimeout(Te,10)}mt.get("KHR_parallel_shader_compile")!==null?Te():setTimeout(Te,10)})};let Rn=null;function Zt(A){Rn&&Rn(A)}function Fr(){$n.stop()}function vi(){$n.start()}const $n=new d0;$n.setAnimationLoop(Zt),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(A){Rn=A,Q.setAnimationLoop(A),A===null?$n.stop():$n.start()},Q.addEventListener("sessionstart",Fr),Q.addEventListener("sessionend",vi),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(H===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(X),X=Q.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,X,G),v=ct.get(A,L.length),v.init(X),L.push(v),Le.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),te.setFromProjectionMatrix(Le),we=this.localClippingEnabled,pe=Ce.init(this.clippingPlanes,we),y=ze.get(A,I.length),y.init(),I.push(y),Q.enabled===!0&&Q.isPresenting===!0){const Te=b.xr.getDepthSensingMesh();Te!==null&&qn(Te,X,-1/0,b.sortObjects)}qn(A,X,0,b.sortObjects),y.finish(),b.sortObjects===!0&&y.sort(de,oe),gt=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,gt&&Qe.addToRenderList(y,A),this.info.render.frame++,pe===!0&&Ce.beginShadows();const ne=v.state.shadowsArray;ke.render(ne,A,X),pe===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=y.opaque,$=y.transmissive;if(v.setupLights(),X.isArrayCamera){const Te=X.cameras;if($.length>0)for(let De=0,Ne=Te.length;De<Ne;De++){const Be=Te[De];fr(q,$,A,Be)}gt&&Qe.render(A);for(let De=0,Ne=Te.length;De<Ne;De++){const Be=Te[De];Pi(y,A,Be,Be.viewport)}}else $.length>0&&fr(q,$,A,X),gt&&Qe.render(A),Pi(y,A,X);G!==null&&N===0&&(P.updateMultisampleRenderTarget(G),P.updateRenderTargetMipmap(G)),A.isScene===!0&&A.onAfterRender(b,A,X),Pt.resetDefaultState(),R=-1,C=null,L.pop(),L.length>0?(v=L[L.length-1],pe===!0&&Ce.setGlobalState(b.clippingPlanes,v.state.camera)):v=null,I.pop(),I.length>0?y=I[I.length-1]:y=null};function qn(A,X,ne,q){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)ne=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)v.pushLight(A),A.castShadow&&v.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||te.intersectsSprite(A)){q&&Ze.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Le);const De=ge.update(A),Ne=A.material;Ne.visible&&y.push(A,De,Ne,ne,Ze.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||te.intersectsObject(A))){const De=ge.update(A),Ne=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ze.copy(A.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),Ze.copy(De.boundingSphere.center)),Ze.applyMatrix4(A.matrixWorld).applyMatrix4(Le)),Array.isArray(Ne)){const Be=De.groups;for(let it=0,Je=Be.length;it<Je;it++){const Ge=Be[it],xt=Ne[Ge.materialIndex];xt&&xt.visible&&y.push(A,De,xt,ne,Ze.z,Ge)}}else Ne.visible&&y.push(A,De,Ne,ne,Ze.z,null)}}const Te=A.children;for(let De=0,Ne=Te.length;De<Ne;De++)qn(Te[De],X,ne,q)}function Pi(A,X,ne,q){const $=A.opaque,Te=A.transmissive,De=A.transparent;v.setupLightsView(ne),pe===!0&&Ce.setGlobalState(b.clippingPlanes,ne),q&&Ye.viewport(z.copy(q)),$.length>0&&Ki($,X,ne),Te.length>0&&Ki(Te,X,ne),De.length>0&&Ki(De,X,ne),Ye.buffers.depth.setTest(!0),Ye.buffers.depth.setMask(!0),Ye.buffers.color.setMask(!0),Ye.setPolygonOffset(!1)}function fr(A,X,ne,q){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[q.id]===void 0&&(v.state.transmissionRenderTarget[q.id]=new to(1,1,{generateMipmaps:!0,type:mt.has("EXT_color_buffer_half_float")||mt.has("EXT_color_buffer_float")?Ka:Nr,minFilter:Zs,samples:4,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Dt.workingColorSpace}));const Te=v.state.transmissionRenderTarget[q.id],De=q.viewport||z;Te.setSize(De.z*b.transmissionResolutionScale,De.w*b.transmissionResolutionScale);const Ne=b.getRenderTarget();b.setRenderTarget(Te),b.getClearColor(ue),me=b.getClearAlpha(),me<1&&b.setClearColor(16777215,.5),b.clear(),gt&&Qe.render(ne);const Be=b.toneMapping;b.toneMapping=gs;const it=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),v.setupLightsView(q),pe===!0&&Ce.setGlobalState(b.clippingPlanes,q),Ki(A,ne,q),P.updateMultisampleRenderTarget(Te),P.updateRenderTargetMipmap(Te),mt.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let Ge=0,xt=X.length;Ge<xt;Ge++){const lt=X[Ge],$t=lt.object,Vt=lt.geometry,Mt=lt.material,Ke=lt.group;if(Mt.side===gi&&$t.layers.test(q.layers)){const qt=Mt.side;Mt.side=si,Mt.needsUpdate=!0,dr($t,ne,q,Vt,Mt,Ke),Mt.side=qt,Mt.needsUpdate=!0,Je=!0}}Je===!0&&(P.updateMultisampleRenderTarget(Te),P.updateRenderTargetMipmap(Te))}b.setRenderTarget(Ne),b.setClearColor(ue,me),it!==void 0&&(q.viewport=it),b.toneMapping=Be}function Ki(A,X,ne){const q=X.isScene===!0?X.overrideMaterial:null;for(let $=0,Te=A.length;$<Te;$++){const De=A[$],Ne=De.object,Be=De.geometry,it=q===null?De.material:q,Je=De.group;Ne.layers.test(ne.layers)&&dr(Ne,X,ne,Be,it,Je)}}function dr(A,X,ne,q,$,Te){A.onBeforeRender(b,X,ne,q,$,Te),A.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(b,X,ne,q,A,Te),$.transparent===!0&&$.side===gi&&$.forceSinglePass===!1?($.side=si,$.needsUpdate=!0,b.renderBufferDirect(ne,X,q,$,A,Te),$.side=vs,$.needsUpdate=!0,b.renderBufferDirect(ne,X,q,$,A,Te),$.side=gi):b.renderBufferDirect(ne,X,q,$,A,Te),A.onAfterRender(b,X,ne,q,$,Te)}function Or(A,X,ne){X.isScene!==!0&&(X=bt);const q=Xe.get(A),$=v.state.lights,Te=v.state.shadowsArray,De=$.state.version,Ne=je.getParameters(A,$.state,Te,X,ne),Be=je.getProgramCacheKey(Ne);let it=q.programs;q.environment=A.isMeshStandardMaterial?X.environment:null,q.fog=X.fog,q.envMap=(A.isMeshStandardMaterial?ee:T).get(A.envMap||q.environment),q.envMapRotation=q.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,it===void 0&&(A.addEventListener("dispose",st),it=new Map,q.programs=it);let Je=it.get(Be);if(Je!==void 0){if(q.currentProgram===Je&&q.lightsStateVersion===De)return ai(A,Ne),Je}else Ne.uniforms=je.getUniforms(A),A.onBeforeCompile(Ne,b),Je=je.acquireProgram(Ne,Be),it.set(Be,Je),q.uniforms=Ne.uniforms;const Ge=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ge.clippingPlanes=Ce.uniform),ai(A,Ne),q.needsLights=ua(A),q.lightsStateVersion=De,q.needsLights&&(Ge.ambientLightColor.value=$.state.ambient,Ge.lightProbe.value=$.state.probe,Ge.directionalLights.value=$.state.directional,Ge.directionalLightShadows.value=$.state.directionalShadow,Ge.spotLights.value=$.state.spot,Ge.spotLightShadows.value=$.state.spotShadow,Ge.rectAreaLights.value=$.state.rectArea,Ge.ltc_1.value=$.state.rectAreaLTC1,Ge.ltc_2.value=$.state.rectAreaLTC2,Ge.pointLights.value=$.state.point,Ge.pointLightShadows.value=$.state.pointShadow,Ge.hemisphereLights.value=$.state.hemi,Ge.directionalShadowMap.value=$.state.directionalShadowMap,Ge.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Ge.spotShadowMap.value=$.state.spotShadowMap,Ge.spotLightMatrix.value=$.state.spotLightMatrix,Ge.spotLightMap.value=$.state.spotLightMap,Ge.pointShadowMap.value=$.state.pointShadowMap,Ge.pointShadowMatrix.value=$.state.pointShadowMatrix),q.currentProgram=Je,q.uniformsList=null,Je}function io(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=Ic.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function ai(A,X){const ne=Xe.get(A);ne.outputColorSpace=X.outputColorSpace,ne.batching=X.batching,ne.batchingColor=X.batchingColor,ne.instancing=X.instancing,ne.instancingColor=X.instancingColor,ne.instancingMorph=X.instancingMorph,ne.skinning=X.skinning,ne.morphTargets=X.morphTargets,ne.morphNormals=X.morphNormals,ne.morphColors=X.morphColors,ne.morphTargetsCount=X.morphTargetsCount,ne.numClippingPlanes=X.numClippingPlanes,ne.numIntersection=X.numClipIntersection,ne.vertexAlphas=X.vertexAlphas,ne.vertexTangents=X.vertexTangents,ne.toneMapping=X.toneMapping}function _s(A,X,ne,q,$){X.isScene!==!0&&(X=bt),P.resetTextureUnits();const Te=X.fog,De=q.isMeshStandardMaterial?X.environment:null,Ne=G===null?b.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:ra,Be=(q.isMeshStandardMaterial?ee:T).get(q.envMap||De),it=q.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,Je=!!ne.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ge=!!ne.morphAttributes.position,xt=!!ne.morphAttributes.normal,lt=!!ne.morphAttributes.color;let $t=gs;q.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&($t=b.toneMapping);const Vt=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,Mt=Vt!==void 0?Vt.length:0,Ke=Xe.get(q),qt=v.state.lights;if(pe===!0&&(we===!0||A!==C)){const ln=A===C&&q.id===R;Ce.setState(q,A,ln)}let vt=!1;q.version===Ke.__version?(Ke.needsLights&&Ke.lightsStateVersion!==qt.state.version||Ke.outputColorSpace!==Ne||$.isBatchedMesh&&Ke.batching===!1||!$.isBatchedMesh&&Ke.batching===!0||$.isBatchedMesh&&Ke.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Ke.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Ke.instancing===!1||!$.isInstancedMesh&&Ke.instancing===!0||$.isSkinnedMesh&&Ke.skinning===!1||!$.isSkinnedMesh&&Ke.skinning===!0||$.isInstancedMesh&&Ke.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Ke.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Ke.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Ke.instancingMorph===!1&&$.morphTexture!==null||Ke.envMap!==Be||q.fog===!0&&Ke.fog!==Te||Ke.numClippingPlanes!==void 0&&(Ke.numClippingPlanes!==Ce.numPlanes||Ke.numIntersection!==Ce.numIntersection)||Ke.vertexAlphas!==it||Ke.vertexTangents!==Je||Ke.morphTargets!==Ge||Ke.morphNormals!==xt||Ke.morphColors!==lt||Ke.toneMapping!==$t||Ke.morphTargetsCount!==Mt)&&(vt=!0):(vt=!0,Ke.__version=q.version);let fn=Ke.currentProgram;vt===!0&&(fn=Or(q,X,$));let Zi=!1,bn=!1,Li=!1;const Ft=fn.getUniforms(),dn=Ke.uniforms;if(Ye.useProgram(fn.program)&&(Zi=!0,bn=!0,Li=!0),q.id!==R&&(R=q.id,bn=!0),Zi||C!==A){Ye.buffers.depth.getReversed()?(xe.copy(A.projectionMatrix),L_(xe),D_(xe),Ft.setValue(B,"projectionMatrix",xe)):Ft.setValue(B,"projectionMatrix",A.projectionMatrix),Ft.setValue(B,"viewMatrix",A.matrixWorldInverse);const Yt=Ft.map.cameraPosition;Yt!==void 0&&Yt.setValue(B,ve.setFromMatrixPosition(A.matrixWorld)),dt.logarithmicDepthBuffer&&Ft.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Ft.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),C!==A&&(C=A,bn=!0,Li=!0)}if($.isSkinnedMesh){Ft.setOptional(B,$,"bindMatrix"),Ft.setOptional(B,$,"bindMatrixInverse");const ln=$.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),Ft.setValue(B,"boneTexture",ln.boneTexture,P))}$.isBatchedMesh&&(Ft.setOptional(B,$,"batchingTexture"),Ft.setValue(B,"batchingTexture",$._matricesTexture,P),Ft.setOptional(B,$,"batchingIdTexture"),Ft.setValue(B,"batchingIdTexture",$._indirectTexture,P),Ft.setOptional(B,$,"batchingColorTexture"),$._colorsTexture!==null&&Ft.setValue(B,"batchingColorTexture",$._colorsTexture,P));const on=ne.morphAttributes;if((on.position!==void 0||on.normal!==void 0||on.color!==void 0)&&rt.update($,ne,fn),(bn||Ke.receiveShadow!==$.receiveShadow)&&(Ke.receiveShadow=$.receiveShadow,Ft.setValue(B,"receiveShadow",$.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(dn.envMap.value=Be,dn.flipEnvMap.value=Be.isCubeTexture&&Be.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&X.environment!==null&&(dn.envMapIntensity.value=X.environmentIntensity),bn&&(Ft.setValue(B,"toneMappingExposure",b.toneMappingExposure),Ke.needsLights&&xs(dn,Li),Te&&q.fog===!0&&Ie.refreshFogUniforms(dn,Te),Ie.refreshMaterialUniforms(dn,q,k,he,v.state.transmissionRenderTarget[A.id]),Ic.upload(B,io(Ke),dn,P)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Ic.upload(B,io(Ke),dn,P),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Ft.setValue(B,"center",$.center),Ft.setValue(B,"modelViewMatrix",$.modelViewMatrix),Ft.setValue(B,"normalMatrix",$.normalMatrix),Ft.setValue(B,"modelMatrix",$.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const ln=q.uniformsGroups;for(let Yt=0,wt=ln.length;Yt<wt;Yt++){const li=ln[Yt];W.update(li,fn),W.bind(li,fn)}}return fn}function xs(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function ua(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return N},this.getRenderTarget=function(){return G},this.setRenderTargetTextures=function(A,X,ne){Xe.get(A.texture).__webglTexture=X,Xe.get(A.depthTexture).__webglTexture=ne;const q=Xe.get(A);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=ne===void 0,q.__autoAllocateDepthBuffer||mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,X){const ne=Xe.get(A);ne.__webglFramebuffer=X,ne.__useDefaultFramebuffer=X===void 0};const ys=B.createFramebuffer();this.setRenderTarget=function(A,X=0,ne=0){G=A,F=X,N=ne;let q=!0,$=null,Te=!1,De=!1;if(A){const Be=Xe.get(A);if(Be.__useDefaultFramebuffer!==void 0)Ye.bindFramebuffer(B.FRAMEBUFFER,null),q=!1;else if(Be.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(Be.__hasExternalTextures)P.rebindTextures(A,Xe.get(A.texture).__webglTexture,Xe.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ge=A.depthTexture;if(Be.__boundDepthTexture!==Ge){if(Ge!==null&&Xe.has(Ge)&&(A.width!==Ge.image.width||A.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const it=A.texture;(it.isData3DTexture||it.isDataArrayTexture||it.isCompressedArrayTexture)&&(De=!0);const Je=Xe.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Je[X])?$=Je[X][ne]:$=Je[X],Te=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?$=Xe.get(A).__webglMultisampledFramebuffer:Array.isArray(Je)?$=Je[ne]:$=Je,z.copy(A.viewport),ie.copy(A.scissor),Z=A.scissorTest}else z.copy(U).multiplyScalar(k).floor(),ie.copy(se).multiplyScalar(k).floor(),Z=Fe;if(ne!==0&&($=ys),Ye.bindFramebuffer(B.FRAMEBUFFER,$)&&q&&Ye.drawBuffers(A,$),Ye.viewport(z),Ye.scissor(ie),Ye.setScissorTest(Z),Te){const Be=Xe.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+X,Be.__webglTexture,ne)}else if(De){const Be=Xe.get(A.texture),it=X;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Be.__webglTexture,ne,it)}else if(A!==null&&ne!==0){const Be=Xe.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Be.__webglTexture,ne)}R=-1},this.readRenderTargetPixels=function(A,X,ne,q,$,Te,De){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=Xe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne){Ye.bindFramebuffer(B.FRAMEBUFFER,Ne);try{const Be=A.texture,it=Be.format,Je=Be.type;if(!dt.textureFormatReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(Je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-q&&ne>=0&&ne<=A.height-$&&B.readPixels(X,ne,q,$,at.convert(it),at.convert(Je),Te)}finally{const Be=G!==null?Xe.get(G).__webglFramebuffer:null;Ye.bindFramebuffer(B.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(A,X,ne,q,$,Te,De){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=Xe.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne){const Be=A.texture,it=Be.format,Je=Be.type;if(!dt.textureFormatReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(Je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(X>=0&&X<=A.width-q&&ne>=0&&ne<=A.height-$){Ye.bindFramebuffer(B.FRAMEBUFFER,Ne);const Ge=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ge),B.bufferData(B.PIXEL_PACK_BUFFER,Te.byteLength,B.STREAM_READ),B.readPixels(X,ne,q,$,at.convert(it),at.convert(Je),0);const xt=G!==null?Xe.get(G).__webglFramebuffer:null;Ye.bindFramebuffer(B.FRAMEBUFFER,xt);const lt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await P_(B,lt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ge),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Te),B.deleteBuffer(Ge),B.deleteSync(lt),Te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,X=null,ne=0){A.isTexture!==!0&&($o("WebGLRenderer: copyFramebufferToTexture function signature has changed."),X=arguments[0]||null,A=arguments[1]);const q=Math.pow(2,-ne),$=Math.floor(A.image.width*q),Te=Math.floor(A.image.height*q),De=X!==null?X.x:0,Ne=X!==null?X.y:0;P.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,ne,0,0,De,Ne,$,Te),Ye.unbindTexture()};const zr=B.createFramebuffer(),ro=B.createFramebuffer();this.copyTextureToTexture=function(A,X,ne=null,q=null,$=0,Te=null){A.isTexture!==!0&&($o("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,A=arguments[1],X=arguments[2],Te=arguments[3]||0,ne=null),Te===null&&($!==0?($o("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Te=$,$=0):Te=0);let De,Ne,Be,it,Je,Ge,xt,lt,$t;const Vt=A.isCompressedTexture?A.mipmaps[Te]:A.image;if(ne!==null)De=ne.max.x-ne.min.x,Ne=ne.max.y-ne.min.y,Be=ne.isBox3?ne.max.z-ne.min.z:1,it=ne.min.x,Je=ne.min.y,Ge=ne.isBox3?ne.min.z:0;else{const on=Math.pow(2,-$);De=Math.floor(Vt.width*on),Ne=Math.floor(Vt.height*on),A.isDataArrayTexture?Be=Vt.depth:A.isData3DTexture?Be=Math.floor(Vt.depth*on):Be=1,it=0,Je=0,Ge=0}q!==null?(xt=q.x,lt=q.y,$t=q.z):(xt=0,lt=0,$t=0);const Mt=at.convert(X.format),Ke=at.convert(X.type);let qt;X.isData3DTexture?(P.setTexture3D(X,0),qt=B.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(P.setTexture2DArray(X,0),qt=B.TEXTURE_2D_ARRAY):(P.setTexture2D(X,0),qt=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,X.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,X.unpackAlignment);const vt=B.getParameter(B.UNPACK_ROW_LENGTH),fn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Zi=B.getParameter(B.UNPACK_SKIP_PIXELS),bn=B.getParameter(B.UNPACK_SKIP_ROWS),Li=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Vt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Vt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,it),B.pixelStorei(B.UNPACK_SKIP_ROWS,Je),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ge);const Ft=A.isDataArrayTexture||A.isData3DTexture,dn=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){const on=Xe.get(A),ln=Xe.get(X),Yt=Xe.get(on.__renderTarget),wt=Xe.get(ln.__renderTarget);Ye.bindFramebuffer(B.READ_FRAMEBUFFER,Yt.__webglFramebuffer),Ye.bindFramebuffer(B.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let li=0;li<Be;li++)Ft&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Xe.get(A).__webglTexture,$,Ge+li),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Xe.get(X).__webglTexture,Te,$t+li)),B.blitFramebuffer(it,Je,De,Ne,xt,lt,De,Ne,B.DEPTH_BUFFER_BIT,B.NEAREST);Ye.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ye.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if($!==0||A.isRenderTargetTexture||Xe.has(A)){const on=Xe.get(A),ln=Xe.get(X);Ye.bindFramebuffer(B.READ_FRAMEBUFFER,zr),Ye.bindFramebuffer(B.DRAW_FRAMEBUFFER,ro);for(let Yt=0;Yt<Be;Yt++)Ft?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,on.__webglTexture,$,Ge+Yt):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,on.__webglTexture,$),dn?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ln.__webglTexture,Te,$t+Yt):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ln.__webglTexture,Te),$!==0?B.blitFramebuffer(it,Je,De,Ne,xt,lt,De,Ne,B.COLOR_BUFFER_BIT,B.NEAREST):dn?B.copyTexSubImage3D(qt,Te,xt,lt,$t+Yt,it,Je,De,Ne):B.copyTexSubImage2D(qt,Te,xt,lt,it,Je,De,Ne);Ye.bindFramebuffer(B.READ_FRAMEBUFFER,null),Ye.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else dn?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(qt,Te,xt,lt,$t,De,Ne,Be,Mt,Ke,Vt.data):X.isCompressedArrayTexture?B.compressedTexSubImage3D(qt,Te,xt,lt,$t,De,Ne,Be,Mt,Vt.data):B.texSubImage3D(qt,Te,xt,lt,$t,De,Ne,Be,Mt,Ke,Vt):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,Te,xt,lt,De,Ne,Mt,Ke,Vt.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,Te,xt,lt,Vt.width,Vt.height,Mt,Vt.data):B.texSubImage2D(B.TEXTURE_2D,Te,xt,lt,De,Ne,Mt,Ke,Vt);B.pixelStorei(B.UNPACK_ROW_LENGTH,vt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,fn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Zi),B.pixelStorei(B.UNPACK_SKIP_ROWS,bn),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Li),Te===0&&X.generateMipmaps&&B.generateMipmap(qt),Ye.unbindTexture()},this.copyTextureToTexture3D=function(A,X,ne=null,q=null,$=0){return A.isTexture!==!0&&($o("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ne=arguments[0]||null,q=arguments[1]||null,A=arguments[2],X=arguments[3],$=arguments[4]||0),$o('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,X,ne,q,$)},this.initRenderTarget=function(A){Xe.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),Ye.unbindTexture()},this.resetState=function(){F=0,N=0,G=null,Ye.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ir}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Dt._getDrawingBufferColorSpace(e),n.unpackColorSpace=Dt._getUnpackColorSpace()}}const sr=-4.5,Hc=0,Ys=6,Ig=2.4,YE=1.2,Lr=.38,or=2,mi=130,jo=230,Xa=55,ja=20,v0=3.5,Ug=1;function KE(s,e,n){return e*Math.sqrt(1+((s-sr)/n)**2)}function ZE(s,e,n,r,a){const{pP:c,pM:u}=Js(n,r),d=rh(r),h=[];let m=s,g=e;const _=or*a,x=Hc-a/2,S=Hc+a/2;for(let E=0;E<=mi;E++){const w=pi(sr,Ys,E/mi);if(h.push(new j(m,g,w)),w>x){const v=$i((w-x)/(S-x+.001),0,1)*_,I=KE(w,Lr,v0),L=((m-d.x*v)**2+(g-d.y*v)**2)/I**2,b=((m+d.x*v)**2+(g+d.y*v)**2)/I**2,H=c*Math.exp(-L),F=u*Math.exp(-b),N=(H-F)/(H+F+1e-12)*_/mi;m+=d.x*N,g+=d.y*N}}return h}function pi(s,e,n){return s+(e-s)*n}function $i(s,e,n){return Math.max(e,Math.min(n,s))}function rh(s){const e=s*Math.PI/180;return new j(Math.sin(e),Math.cos(e),0)}function Js(s,e){const n=(s-e)*Math.PI/180,r=Math.cos(n/2),a=Math.sin(n/2);return{pP:r*r,pM:a*a}}function QE(s,e,n,r){const{pP:a,pM:c}=Js(n,r),u=rh(r),d=[];let h=s,m=e;for(let g=0;g<=mi;g++){const _=g/mi;if(d.push(new j(h,m,pi(sr,Ys,_))),_>=.5){const x=(_-.5)/.5,S=x*or,E=Lr*(1+x*.5),w=((h-u.x*S)**2+(m-u.y*S)**2)/E**2,y=((h+u.x*S)**2+(m+u.y*S)**2)/E**2,v=a*Math.exp(-w),I=c*Math.exp(-y),L=(v-I)/(v+I+1e-12)*or/mi;h+=u.x*L,m+=u.y*L}}return d}function JE(s,e,n){const{pP:r}=Js(s,e);if(Math.abs(r-.5)<1e-6)return 0;const a=e*Math.PI/180,c=Math.sin(a),u=Math.cos(a),d=g=>{const _=n(g*c,g*u),x=_[_.length-1];return x.x*c+x.y*u};let h=-3,m=3;for(let g=0;g<40;g++){const _=(h+m)/2;if(d(_)>0?m=_:h=_,m-h<.001)break}return(h+m)/2}function e1(s,e,n,r){const a=e*Math.PI/180,c=Math.sin(a),u=Math.cos(a),d=[];for(let h=0;h<s;h++){const m=Math.random()<n;let g,_;do{const x=Math.random(),S=Math.random(),E=Lr*.7*Math.sqrt(-2*Math.log(Math.max(x,1e-10))),w=2*Math.PI*S;g=E*Math.cos(w),_=E*Math.sin(w)}while(m?g*c+_*u<r+.04:g*c+_*u>r-.04);d.push({x:g,y:_,isUp:m})}return d}const Ng=[4521898,16737843,6728447,16763955,15615231,4508927,16755268,11158783,4521966,16729224,8978244,16746564,4491519,16772676,16729292,4521932,13387007,16729156,4521796,4474111],Fg=["collapse","pilot","manyworlds"],t1={collapse:"Collapse",pilot:"Pilot Wave",manyworlds:"Many Worlds"},n1={collapse:"#ff9966",pilot:"#44ddff",manyworlds:"#bb88ff"},i1={collapse:"Copenhagen: wave collapses to one outcome on detection.",pilot:"de Broglie-Bohm: particles follow definite trajectories guided by the wave.",manyworlds:"Everett: all outcomes occur in branching parallel worlds. Wave only."};function r1(s){if(s===0)return"1";const e=s*Math.log10(2),n=Math.floor(e),r=Math.pow(10,e-n),a={0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹","-":"⁻"},c=String(n).split("").map(u=>a[u]||u).join("");return n<2?Math.round(Math.pow(10,e)).toLocaleString():r.toFixed(2)+" × 10"+c}const fs=({text:s,children:e})=>{const[n,r]=qa.useState(!1),[a,c]=qa.useState({x:0,y:0}),u=qa.useRef(null);return fe.jsxs("span",{ref:u,style:{position:"relative",display:"block"},onMouseEnter:d=>{r(!0)},onMouseLeave:()=>r(!1),children:[e,n&&fe.jsx("span",{style:{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:"rgba(8,20,55,0.97)",border:"1px solid rgba(80,140,255,0.4)",borderRadius:5,padding:"5px 9px",fontSize:11,color:"#b8d4ff",whiteSpace:"pre-wrap",maxWidth:200,lineHeight:1.5,zIndex:999,pointerEvents:"none",fontFamily:"'Courier New',monospace",boxShadow:"0 4px 16px rgba(0,0,30,0.7)"},children:s})]})};function s1({up:s,down:e,pP:n,pM:r}){const a=s+e,c=a||1,u=s/c,d=e/c,h=Math.round(u*100),m=Math.round(d*100),g=Math.round(n*100),_=Math.round(r*100),x=a>0?Math.sqrt(u*d/a)*100:0,S=a>0?" ±"+(x<.5?x.toFixed(1):Math.round(x))+"%":"";return fe.jsxs("div",{style:{fontFamily:"'Courier New',monospace",fontSize:11,color:"#b8d4ff",minWidth:158},children:[fe.jsxs("div",{style:{fontSize:10,color:"#4a6a9a",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8},children:["Detector ",fe.jsxs("span",{style:{color:"#506080"},children:["n=",a]})]}),[{label:"▲ +n̂",color:"#44ee66",grad:"#22aa44,#44ee66",pct:h,expPct:g,count:s},{label:"▼ −n̂",color:"#ff5533",grad:"#aa2211,#ff5533",pct:m,expPct:_,count:e}].map(({label:E,color:w,grad:y,pct:v,expPct:I,count:L})=>fe.jsxs("div",{style:{marginBottom:9},children:[fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"baseline"},children:[fe.jsx("span",{style:{color:w},children:E}),fe.jsxs("span",{style:{color:"#b8d4ff"},children:[L," · ",v,"%",S]})]}),fe.jsxs("div",{style:{height:7,background:"rgba(15,30,70,0.6)",borderRadius:3,position:"relative",overflow:"visible"},children:[fe.jsx("div",{style:{height:"100%",borderRadius:3,transition:"width 0.35s",width:v+"%",background:"linear-gradient(90deg,"+y+")"}}),a>0&&fe.jsx("div",{style:{position:"absolute",top:0,bottom:0,left:Math.max(0,v-x)+"%",width:Math.min(100,2*x)+"%",background:"rgba(255,255,255,0.09)",borderLeft:"1px solid rgba(255,255,255,0.28)",borderRight:"1px solid rgba(255,255,255,0.28)",borderRadius:2,pointerEvents:"none"}}),fe.jsx("div",{style:{position:"absolute",top:-2,bottom:-2,width:2,borderRadius:1,background:"rgba(200,210,255,0.50)",left:I+"%",boxShadow:"0 0 4px rgba(180,200,255,0.3)"}})]})]},E)),fe.jsx("div",{style:{borderTop:"1px solid rgba(60,100,200,0.20)",paddingTop:4,fontSize:9,color:"#334e7a"},children:"│ Born rule  ±σ bracket"})]})}const Og=({vals:s,cur:e,onSel:n,ac:r,ab:a,ic:c})=>fe.jsx("div",{style:{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5},children:s.map(u=>fe.jsxs("button",{onClick:()=>n(u),style:{flex:1,padding:"3px 0",fontSize:11,background:e===u?"rgba("+r+",0.25)":"rgba(10,22,55,0.6)",border:"1px solid "+(e===u?a:"rgba(60,100,200,0.25)"),borderRadius:4,color:e===u?c:"#7090b8",cursor:"pointer",fontFamily:"monospace"},children:[u,"°"]},u))}),Ws=({label:s,tip:e,children:n})=>fe.jsxs("div",{style:{marginBottom:10},children:[fe.jsx(fs,{text:e||null,children:fe.jsx("div",{style:{fontSize:13,color:"#7ab8ff",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em",cursor:e?"help":"default",borderBottom:e?"1px dotted rgba(100,160,255,0.4)":"none",display:"inline-block"},children:s})}),n]}),o1=qa.memo(({interp:s,setInterp:e,worlds:n,theta:r,setTheta:a,thetaRef:c,phi:u,setPhi:d,phiRef:h,nPart:m,setNPart:g,nPartRef:_,speed:x,setSpeed:S,speedRef:E,pP:w,pM:y,running:v,setRunning:I,showWave:L,setShowWave:b,showParticles:H,setShowParticles:F,resetHits:N,showExpert:G,setShowExpert:R,wSig:C,setWSig:z,wSigRef:ie,wMode:Z,setWMode:ue,wBright:me,setWBright:ae,wBrightRef:he,wAlpha:k,setWAlpha:de,wAlphaRef:oe,fieldModel:U,setFieldModel:se,magL:Fe,setMagL:te,magLRef:pe})=>{const we=n1[s],[xe,Le]=qa.useState("controls");return fe.jsxs("div",{style:{display:"flex",flexDirection:"row",boxSizing:"border-box",fontFamily:"'Courier New',monospace",color:"#e8f2ff",height:"100%"},children:[fe.jsx("div",{style:{display:"flex",flexDirection:"column",flexShrink:0,width:22,background:"rgba(4,10,30,0.7)",borderRight:"1px solid rgba(40,80,180,0.35)"},children:["controls","expert"].map(ve=>fe.jsx("button",{onClick:()=>Le(ve),style:{writingMode:"vertical-rl",transform:"rotate(180deg)",padding:"12px 4px",fontSize:10,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer",border:"none",background:xe===ve?"rgba(40,80,200,0.3)":"transparent",color:xe===ve?"#88bbff":"#4a6a9a",borderLeft:xe===ve?"2px solid #5588ff":"2px solid transparent",flex:"none"},children:ve},ve))}),fe.jsxs("div",{style:{display:xe==="controls"?"flex":"none",flexDirection:"column",gap:10,padding:"10px 9px",overflowY:"auto",flex:1},children:[fe.jsxs(Ws,{label:"View",tip:`Quantum interpretation:
Collapse: wavefunction collapses on measurement
Pilot Wave: particles follow definite trajectories
Many Worlds: all outcomes happen in parallel`,children:[fe.jsx(fs,{text:`Click to cycle views:
Collapse → Pilot Wave → Many Worlds`,children:fe.jsxs("button",{onClick:()=>e(Fg[(Fg.indexOf(s)+1)%3]),style:{display:"block",width:"100%",padding:"7px 10px",marginBottom:5,background:"rgba("+(s==="collapse"?"200,80,40":s==="pilot"?"30,160,220":"120,70,220")+",0.18)",border:"2px solid "+we,borderRadius:6,color:we,cursor:"pointer",fontSize:13,fontFamily:"monospace",fontWeight:700,textAlign:"center"},children:[">"," ",t1[s]]})}),fe.jsx("div",{style:{fontSize:12,color:"#99b8e8",lineHeight:1.6},children:i1[s]})]}),s==="manyworlds"&&fe.jsxs("div",{style:{background:"rgba(100,60,220,0.12)",border:"1px solid rgba(140,100,255,0.4)",borderRadius:7,padding:"8px 10px"},children:[fe.jsx("div",{style:{fontSize:12,color:"#d0b8ff",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4},children:"Parallel worlds"}),fe.jsx("div",{style:{fontSize:22,fontWeight:700,color:"#e0c8ff"},children:r1(n)}),fe.jsxs("div",{style:{fontSize:11,color:"#c0a8ee",marginTop:3},children:[Math.round(n/Math.max(m,1))," cycles × ",m," particles"]})]}),fe.jsxs(Ws,{label:"Spin θ = "+r+"°",tip:`Initial spin direction of the particle
θ=0°: spin-up |+z⟩
θ=90°: equal superposition
θ=180°: spin-down |-z⟩`,children:[fe.jsx("input",{type:"range",min:0,max:180,step:1,defaultValue:r,ref:c,onInput:ve=>a(+ve.target.value),style:{width:"100%",accentColor:"#5090f0",marginBottom:5}}),fe.jsx(Og,{vals:[0,45,90,135,180],cur:r,onSel:a,ac:"60,100,255",ab:"rgba(80,140,255,0.7)",ic:"#aaccff"}),fe.jsx("div",{style:{fontSize:12,color:"#a0c0ee"},children:r===0?"|+z⟩ - spin up":r===180?"|-z⟩ - spin down":r===90?"Equal superposition":"cos("+(r/2).toFixed(0)+"°)|+⟩ + sin("+(r/2).toFixed(0)+"°)|-⟩"})]}),fe.jsxs(Ws,{label:"Magnet φ = "+u+"°",tip:`Orientation of the Stern-Gerlach magnet
gradient axis in the XY plane
φ=0°: splits along +y
φ=90°: splits along +x`,children:[fe.jsx("input",{type:"range",min:0,max:180,step:1,defaultValue:u,ref:h,onInput:ve=>d(+ve.target.value),style:{width:"100%",accentColor:"#ff8844",marginBottom:5}}),fe.jsx(Og,{vals:[0,45,90,135,180],cur:u,onSel:d,ac:"255,136,68",ab:"rgba(255,136,68,0.7)",ic:"#ffaa66"})]}),fe.jsxs(Ws,{label:"Particles N = "+m,tip:`Number of particles per simulation cycle
Each particle follows a Bohmian trajectory
determined by its initial position in |ψ|²`,children:[fe.jsx("input",{type:"range",min:1,max:20,step:1,defaultValue:m,ref:_,onInput:ve=>g(+ve.target.value),style:{width:"100%",accentColor:"#44ffaa"}}),fe.jsx("div",{style:{fontSize:12,color:"#e0eeff",marginTop:2},children:s==="pilot"?"trajectories shown":s==="manyworlds"?"2^"+m+" branches/cycle":m+" hits per cycle"})]}),fe.jsxs(Ws,{label:"Speed ×"+x.toFixed(1),tip:`Simulation playback speed
×1 = normal  ×3 = fast  ×0.25 = slow motion`,children:[fe.jsx("input",{type:"range",min:.25,max:4,step:.25,defaultValue:x,ref:E,onInput:ve=>S(+ve.target.value),style:{width:"100%",accentColor:"#ffcc44"}}),fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[fe.jsx("span",{children:"slow"}),fe.jsx("span",{children:"normal"}),fe.jsx("span",{children:"fast"})]})]}),fe.jsxs(Ws,{label:"Beam split",tip:`Born rule probabilities
P(±n̂) = cos²/sin²((θ-φ)/2)
Fraction of particles landing
on each detector`,children:[fe.jsxs("div",{style:{fontSize:13,lineHeight:1.9},children:[fe.jsx("span",{style:{color:"rgba(50,220,120,0.9)"},children:"P(+n̂) "}),fe.jsxs("b",{children:[Math.round(w*100),"%"]}),"  ",fe.jsx("span",{style:{color:"rgba(255,80,40,0.9)"},children:"P(-n̂) "}),fe.jsxs("b",{children:[Math.round(y*100),"%"]})]}),fe.jsx("div",{style:{height:5,background:"rgba(20,40,100,0.5)",borderRadius:3},children:fe.jsx("div",{style:{height:"100%",borderRadius:3,transition:"width 0.2s",width:Math.round(w*100)+"%",background:"linear-gradient(90deg,#22cc66,#44ff88)"}})}),fe.jsx("div",{style:{fontSize:11,color:"#88aadd",marginTop:2},children:"cos²((θ-φ)/2)"})]}),fe.jsxs(Ws,{label:"Controls",tip:`Simulation controls:
Play/Pause the animation
Toggle wave and trajectory display
Clear detector hits`,children:[fe.jsxs("div",{style:{display:"flex",gap:4,marginBottom:4},children:[fe.jsx(fs,{text:"Pause or resume the animation",children:fe.jsx("button",{onClick:()=>I(!v),style:{flex:1,padding:"6px 4px",textAlign:"center",background:v?"rgba(20,55,130,0.6)":"rgba(25,80,40,0.6)",border:"1px solid "+(v?"rgba(70,130,255,0.4)":"rgba(60,200,80,0.35)"),borderRadius:5,color:v?"#88bbff":"#66dd88",cursor:"pointer",fontSize:13,fontFamily:"monospace"},children:v?"⏸ Pause":"▶ Play"})}),fe.jsx(fs,{text:`Clear all detector hits
and reset world counter`,children:fe.jsx("button",{onClick:N,style:{flex:1,padding:"6px 4px",textAlign:"center",background:"rgba(15,30,70,0.5)",border:"1px solid #334466",borderRadius:5,color:"#b0ccee",cursor:"pointer",fontSize:13,fontFamily:"monospace"},children:"✕ Clear"})})]}),fe.jsxs("div",{style:{display:"flex",gap:4},children:[fe.jsx(fs,{text:`Show/hide the |ψ|² wave packet
visualization (volumetric slab)`,children:fe.jsxs("button",{onClick:()=>b(!L),style:{flex:1,padding:"5px 4px",textAlign:"center",background:L?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(L?"#5588cc":"#334466"),borderRadius:5,color:L?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"monospace"},children:[L?"◉":"○"," Wave"]})}),s==="pilot"&&fe.jsx(fs,{text:`Show/hide Bohmian particle
trajectories guided by the wave`,children:fe.jsxs("button",{onClick:()=>F(!H),style:{flex:1,padding:"5px 4px",textAlign:"center",background:H?"rgba(40,80,180,0.5)":"rgba(15,30,70,0.5)",border:"1px solid "+(H?"#5588cc":"#334466"),borderRadius:5,color:H?"#c8e8ff":"#7090b8",cursor:"pointer",fontSize:12,fontFamily:"monospace"},children:[H?"◉":"○"," Trajectories"]})})]})]}),fe.jsx("div",{style:{fontSize:11,color:"#9ab8dd",lineHeight:1.8,marginTop:"auto",borderTop:"1px solid rgba(50,80,180,0.15)",paddingTop:8},children:fe.jsx("div",{style:{color:"#7890b0"},children:"Drag: orbit  Right: pan  Scroll: zoom"})})]}),fe.jsxs("div",{style:{display:xe==="expert"?"flex":"none",flexDirection:"column",gap:14,padding:"10px 9px",overflowY:"auto",flex:1},children:[fe.jsxs("div",{children:[fe.jsx("div",{style:{fontSize:11,color:"#7ab8ff",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"},children:"Wave style"}),fe.jsx("div",{style:{display:"flex",gap:4,marginBottom:4},children:["old","new"].map(ve=>fe.jsx(fs,{text:ve==="old"?`Bright core, alpha ∝ dens²
Sharp Gaussian falloff`:`Uniform brightness
Phase ripples clearly visible`,children:fe.jsx("button",{onClick:()=>ue(ve),style:{flex:1,padding:"5px 0",fontSize:11,fontFamily:"monospace",background:Z===ve?"rgba(60,100,255,0.3)":"rgba(10,22,55,0.6)",border:"1px solid "+(Z===ve?"rgba(80,140,255,0.8)":"rgba(60,100,200,0.25)"),borderRadius:4,color:Z===ve?"#aaccff":"#7090b8",cursor:"pointer"},children:ve==="old"?"⬛ Dense":"〰 Wavefront"})},ve))}),fe.jsx("div",{style:{fontSize:10,color:"#506080"},children:Z==="old"?"Bright core, sharp falloff":"Uniform — phase ripples visible"})]}),fe.jsxs("div",{children:[fe.jsx("div",{style:{fontSize:11,color:"#7ab8ff",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"},children:"Field model"}),fe.jsx("div",{style:{display:"flex",gap:4,marginBottom:4},children:[["delta","δ Delta"],["finite","▬ Finite"]].map(([ve,Ze])=>fe.jsx(fs,{text:ve==="delta"?`Impulsive kick at z=0
(Norsen 2014 model)
Instant separation`:`Finite magnet length L
+ free Gaussian spreading
Gradual separation + dispersion`,children:fe.jsx("button",{onClick:()=>se(ve),style:{flex:1,padding:"5px 0",fontSize:11,fontFamily:"monospace",background:U===ve?"rgba(60,100,255,0.3)":"rgba(10,22,55,0.6)",border:"1px solid "+(U===ve?"rgba(80,140,255,0.8)":"rgba(60,100,200,0.25)"),borderRadius:4,color:U===ve?"#aaccff":"#7090b8",cursor:"pointer"},children:Ze})},ve))}),U==="finite"&&fe.jsxs("div",{style:{marginTop:6},children:[fe.jsxs("div",{style:{fontSize:11,color:"#aaccff",marginBottom:3},children:["Magnet length L = ",Fe.toFixed(1)]}),fe.jsx("input",{type:"range",min:.2,max:4,step:.1,defaultValue:Fe,ref:pe,onInput:ve=>te(+ve.target.value),style:{width:"100%",accentColor:"#ffcc44"}}),fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080"},children:[fe.jsx("span",{children:"short"}),fe.jsx("span",{children:"long"})]})]})]}),fe.jsxs("div",{children:[fe.jsxs("div",{style:{fontSize:11,color:"#7ab8ff",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.07em"},children:["Wave packet σ = ",C.toFixed(2)]}),fe.jsx("input",{type:"range",min:.2,max:1.2,step:.05,defaultValue:C,ref:ie,onInput:ve=>z(+ve.target.value),style:{width:"100%",accentColor:"#88aaff"}}),fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[fe.jsx("span",{children:"narrow"}),fe.jsx("span",{children:"wide"})]})]}),fe.jsxs("div",{children:[fe.jsxs("div",{style:{fontSize:11,color:"#7ab8ff",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.07em"},children:["Brightness = ",me.toFixed(2)]}),fe.jsx("input",{type:"range",min:.1,max:3,step:.05,defaultValue:.45,ref:he,onInput:ve=>ae(+ve.target.value),style:{width:"100%",accentColor:"#ffaa44"}}),fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[fe.jsx("span",{children:"dim"}),fe.jsx("span",{children:"bright"})]})]}),fe.jsxs("div",{children:[fe.jsxs("div",{style:{fontSize:11,color:"#7ab8ff",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.07em"},children:["Max opacity = ",k.toFixed(2)]}),fe.jsx("input",{type:"range",min:.05,max:.95,step:.05,defaultValue:.2,ref:oe,onInput:ve=>de(+ve.target.value),style:{width:"100%",accentColor:"#44ffaa"}}),fe.jsxs("div",{style:{display:"flex",justifyContent:"space-between",fontSize:10,color:"#506080",marginTop:2},children:[fe.jsx("span",{children:"ghost"}),fe.jsx("span",{children:"solid"})]})]}),fe.jsx("div",{style:{fontSize:11,color:"#9ab8dd",lineHeight:1.8,marginTop:"auto",borderTop:"1px solid rgba(50,80,180,0.15)",paddingTop:8},children:fe.jsx("div",{style:{color:"#7890b0"},children:"Drag: orbit  Right: pan  Scroll: zoom"})})]})]})});function a1(){const s=yt.useRef(null),e=yt.useRef(null),n=yt.useRef(null),r=yt.useRef(null),a=yt.useRef(null),c=yt.useRef(null),u=yt.useRef(null),d=yt.useRef(null),h=yt.useRef(null),m=yt.useRef(null),g=yt.useRef({theta:90,phi:0,nPart:6,wSig:.55,wMode:"old",wBright:.45,wAlpha:.2,fieldModel:"delta",magL:1,speed:1,showWave:!0,showParticles:!0,running:!0,interp:"pilot",tick:0,dirty:!0,camR:15,camTheta:-2.5,camPhi:.22,target:new j(0,0,0),drag:null,hits:[],hitStats:{up:0,down:0},worlds:0}),[_,x]=yt.useState(90),[S,E]=yt.useState(0),[w,y]=yt.useState(6),[v,I]=yt.useState(!0),[L,b]=yt.useState(!0),[H,F]=yt.useState("pilot"),[N,G]=yt.useState(!0),[R,C]=yt.useState({pP:.5,pM:.5}),[z,ie]=yt.useState(0),[Z,ue]=yt.useState(.55),[me,ae]=yt.useState("old"),[he,k]=yt.useState("delta"),[de,oe]=yt.useState(1),[U,se]=yt.useState(.45),[Fe,te]=yt.useState(.2),[pe,we]=yt.useState("sim"),[xe,Le]=yt.useState(!1),[ve,Ze]=yt.useState({up:0,down:0}),[bt,gt]=yt.useState("3d"),[zt,B]=yt.useState(1),Cn=Y=>{g.current.theta=Y,g.current.dirty=!0,x(Y),C(Js(Y,g.current.phi)),m.current&&m.current.clearHits(),e.current&&(e.current.value=Y)},mt=Y=>{g.current.phi=Y,g.current.dirty=!0,E(Y),C(Js(g.current.theta,Y)),m.current&&m.current.clearHits(),n.current&&(n.current.value=Y)},dt=Y=>{g.current.nPart=Y,g.current.dirty=!0,y(Y),r.current&&(r.current.value=Y)},Ye=Y=>{g.current.wSig=Y,ue(Y)},It=Y=>{g.current.wMode=Y,ae(Y)},Xe=Y=>{g.current.fieldModel=Y,k(Y),g.current.dirty=!0},P=Y=>{g.current.magL=Y,oe(Y),g.current.dirty=!0},T=Y=>{g.current.wBright=Y,se(Y)},ee=Y=>{g.current.wAlpha=Y,te(Y)},_e=Y=>{g.current.showWave=Y,I(Y)},Se=Y=>{g.current.showParticles=Y,b(Y)},ge=Y=>{g.current.interp=Y,F(Y),g.current.worlds=0,ie(0),m.current&&(m.current.clearHits(),m.current.fDots.forEach(Q=>{Q.visible=!1}),m.current.fGlows.forEach(Q=>{Q.visible=!1}),m.current.fLines.forEach(Q=>{Q.line.visible=!1}))},je=Y=>{g.current.running=Y,G(Y)},Ie=Y=>{g.current.speed=Y,B(Y),h.current&&(h.current.value=Y)},ze=()=>{g.current.hits=[],g.current.hitStats={up:0,down:0},g.current.worlds=0,ie(0),Ze({up:0,down:0}),m.current&&m.current.clearHits()},ct={"3d":{camR:15,camTheta:-2.5,camPhi:.22},xy:{camR:14,camTheta:0,camPhi:0},xz:{camR:14,camTheta:0,camPhi:Math.PI/2-.01},yz:{camR:14,camTheta:-Math.PI/2,camPhi:0}},Ce=Y=>{var le;const Q=ct[Y];Q&&(Object.assign(g.current,Q),(le=m.current)!=null&&le.updateCam&&m.current.updateCam(),gt(Y))};yt.useEffect(()=>{const Y=s.current;if(!Y)return;const Q=new qE({antialias:!0});Q.setClearColor(462878,1),Q.domElement.style.cssText="display:block;width:100%;height:100%;",Y.appendChild(Q.domElement);const le=new ex,be=new Ri(46,1,.1,200);le.add(new cx(16777215,.55));const Pe=new lx(8956671,.9);Pe.position.set(3,5,3),le.add(Pe);function st(){const ce=Y.clientWidth||700,ye=Y.clientHeight||440;Q.setSize(ce,ye,!1),Q.setPixelRatio(Math.min(window.devicePixelRatio,2)),be.aspect=ce/ye,be.updateProjectionMatrix()}st();const Bt=new ResizeObserver(st);Bt.observe(Y);function Ht(){const ce=g.current,{camR:ye,camTheta:et,camPhi:ut,target:Ut}=ce;be.position.set(Ut.x+ye*Math.sin(et)*Math.cos(ut),Ut.y+ye*Math.sin(ut),Ut.z+ye*Math.cos(et)*Math.cos(ut)),be.lookAt(Ut)}Ht(),le.add(new Qs(new en().setFromPoints([new j(0,0,sr),new j(0,0,Ys)]),new ds({color:1718894,transparent:!0,opacity:.4})));const Et=new j(0,1,0),Rn=new ag(Et,new j(0,0,sr),.9,16777215,.22,.12);le.add(Rn);const Zt=new qo;Zt.position.z=Ys,le.add(Zt),Zt.add(new An(new oa(5,5),new ps({color:530480,transparent:!0,opacity:.55,side:gi,depthWrite:!1})));const Fr=new ix(new en().setFromPoints([new j(-2.5,-2.5,0),new j(2.5,-2.5,0),new j(2.5,2.5,0),new j(-2.5,2.5,0)]),new ds({color:2245802,transparent:!0,opacity:.7}));Zt.add(Fr),[[[-2,0],[2,0]],[[0,-2],[0,2]]].forEach(([ce,ye])=>{Zt.add(new Qs(new en().setFromPoints([new j(...ce,0),new j(...ye,0)]),new ds({color:1122884,transparent:!0,opacity:.4})))});const vi=60,$n=Array.from({length:vi},()=>{const ce=new An(new nh(.05,.22,24),new ps({color:16777215,transparent:!0,opacity:0,side:gi,depthWrite:!1}));return Zt.add(ce),ce}),qn=Array.from({length:vi},()=>{const ce=new An(new eh(.07,16),new ps({color:16777215,transparent:!0,opacity:0,side:gi}));return Zt.add(ce),ce});let Pi=0;function fr(ce,ye,et){const ut=Pi%vi;$n[ut].position.set(ce,ye,.01),$n[ut].material.color.set(et),$n[ut].material.opacity=.75,qn[ut].position.set(ce,ye,.02),qn[ut].material.color.set(et),qn[ut].material.opacity=.95,Pi++}function Ki(){$n.forEach(ce=>ce.material.opacity=0),qn.forEach(ce=>ce.material.opacity=0),Pi=0,g.current.hitStats={up:0,down:0},Ze({up:0,down:0})}const dr=new qo;le.add(dr);const Or=new tg({color:1127372,transparent:!0,opacity:.92}),io=new tg({color:13373730,transparent:!0,opacity:.92}),ai=new ds({color:7838156,transparent:!0,opacity:.35}),_s=2.2,xs=YE,ua=1.1,ys=new la(_s,ua,xs),zr=new An(ys,io);zr.position.set(0,-2.95,0),zr.add(new Km(new eg(ys),ai)),dr.add(zr);const ro=1.6,A=_s/2,X=xs/2,ne=Ig,q=Ig+ro,$=new Float32Array([0,ne,X,0,ne,-X,-A,q,X,-A,q,-X,A,q,X,A,q,-X]),Te=[0,2,4,1,5,3,0,1,3,0,3,2,0,4,5,0,5,1,2,3,5,2,5,4],De=new en;De.setAttribute("position",new kn($,3)),De.setIndex(Te),De.computeVertexNormals();const Ne=new An(De,Or);Ne.add(new Km(new eg(De),ai)),dr.add(Ne);const Be=new ag(new j(0,1,0),new j(0,0,.5),1.2,6728447,.26,.14);le.add(Be);const it=40,Je=3.2,Ge=3.5,xt={uSigXY:{value:.55},uSigZ:{value:.88},uCx:{value:0},uCy:{value:0},uCx2:{value:0},uCy2:{value:0},uPp:{value:.5},uPm:{value:.5},uWz:{value:0},uSlabZ:{value:0},uPhase:{value:0},uIsPost:{value:0},uOpacity:{value:.9},uMode:{value:1},uBright:{value:1},uAlphaMax:{value:.38}},lt=`
      varying vec2 vUv;
      varying vec3 vPos;
      void main(){
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,$t=`
      uniform float uSigXY, uSigZ, uCx, uCy, uCx2, uCy2;
      uniform float uPp, uPm, uWz, uSlabZ, uPhase, uIsPost, uOpacity;
      uniform float uMode, uBright, uAlphaMax;
      varying vec2 vUv;
      varying vec3 vPos;

      float gauss2(float x, float y, float cx, float cy, float sig){
        float dx=(x-cx)/sig, dy=(y-cy)/sig;
        return exp(-0.5*(dx*dx+dy*dy));
      }
      float gaussZ(float z, float cz, float sigz){
        float dz=(z-cz)/sigz;
        return exp(-0.5*dz*dz);
      }

      void main(){
        float x = vPos.x, y = vPos.y, z = uSlabZ;
        float gz = gaussZ(z, uWz, uSigZ);

        vec3 col;
        float dens;
        float phase = cos(${Ge.toFixed(1)} * (z - uWz));
        float cp = phase * 0.5 + 0.5;

        if(uIsPost < 0.5){
          // Pre-split: single packet
          float g = gauss2(x, y, uCx, uCy, uSigXY);
          dens = g * gz;
          // Colour: dark blue trough → cyan peak, phase in colour only not brightness
          col = vec3(mix(0.02, 0.40, cp),
                     mix(0.20, 0.85, cp),
                     mix(0.50, 1.00, cp));
        } else {
          // Post-split: two arms, each weighted by its Born-rule probability.
          // Arm brightness ∝ pP or pM so a near-zero arm is nearly invisible.
          // Colours are pure (no mixing): green for +n̂, red for -n̂.
          float gp = gauss2(x, y, uCx,  uCy,  uSigXY) * gz;
          float gm = gauss2(x, y, uCx2, uCy2, uSigXY) * gz;
          float densP = gp * uPp;   // arm + weighted by P(+n̂)
          float densM = gm * uPm;   // arm − weighted by P(-n̂)
          // Colour: assign pure arm colour at each pixel based on which arm dominates
          vec3 colP = vec3(mix(0.0,0.25,cp), mix(0.4,1.0,cp), mix(0.0,0.35,cp));
          vec3 colM = vec3(mix(0.4,1.0,cp), mix(0.0,0.2,cp), mix(0.0,0.08,cp));
          // Blend colour only enough to smooth the boundary, keep arms visually pure
          float tBlend = densP / (densP + densM + 1e-6);
          col = mix(colM, colP, smoothstep(0.4, 0.6, tBlend));
          dens = (densP + densM);
        }

        vec2 uvC = vUv - 0.5;
        float vig = 1.0 - smoothstep(0.38, 0.50, length(uvC));
        float alpha;
        vec3 finalCol;
        if(uMode < 0.5){
          // OLD style: dense glowing cloud, brighter core
          if(dens < 0.08) discard;
          float d2 = dens * dens;
          alpha = d2 * vig * uOpacity * uBright * 8.0;
          alpha = clamp(alpha, 0.0, uAlphaMax * 1.8);
          finalCol = col * (0.5 + 0.5 * dens) * uBright;
        } else {
          // NEW style: translucent, particles visible through wave
          if(dens < 0.12) discard;
          alpha = sqrt(dens) * gz * vig * uOpacity * uBright * 3.5;
          alpha = clamp(alpha, 0.0, uAlphaMax);
          finalCol = col * 0.85 * uBright;
        }
        if(alpha < 0.006) discard;
        gl_FragColor = vec4(finalCol, alpha);
      }
    `,Vt=[],Mt=new oa(Je*2,Je*2,1,1);for(let ce=0;ce<it;ce++){const ye=new ur({vertexShader:lt,fragmentShader:$t,uniforms:s0.clone(xt),transparent:!0,depthWrite:!1,blending:Uc,side:gi}),et=new An(Mt,ye),ut=sr+(ce+.5)/it*(Ys-sr);et.position.z=ut,ye.uniforms.uSlabZ.value=ut,le.add(et),Vt.push(et)}const Ke=[],qt=new Float32Array(0),vt=new Float32Array(0),fn=new en,Zi=new l0({size:.001}),bn=new Qm(fn,Zi),Li=Array.from({length:65},(ce,ye)=>{const et=ye/64*Math.PI*2;return new j(Math.cos(et)*.9,Math.sin(et)*.9,0)}),Ft=new Qs(new en().setFromPoints(Li),new ds({color:16772676,transparent:!0,opacity:0}));le.add(Ft);const dn=new Float32Array(Xa*3),on=new Float32Array(Xa*3),ln=new Float32Array(Xa),Yt=new en;Yt.setAttribute("position",new kn(dn,3)),Yt.setAttribute("aColor",new kn(on,3)),Yt.setAttribute("size",new kn(ln,1));const wt=new ur({vertexShader:`
        attribute float size; attribute vec3 aColor; varying vec3 vColor;
        void main(){
          vColor=aColor;
          vec4 mv=modelViewMatrix*vec4(position,1.0);
          gl_PointSize=size*(280.0/-mv.z);
          gl_Position=projectionMatrix*mv;
        }`,fragmentShader:`
        varying vec3 vColor;
        void main(){
          float d=length(gl_PointCoord-vec2(0.5));
          if(d>0.5)discard;
          gl_FragColor=vec4(vColor,(1.0-smoothstep(0.15,0.5,d))*0.82);
        }`,transparent:!0,vertexColors:!0,depthWrite:!1,blending:Uc}),li=new Qm(Yt,wt);le.add(li);const tl=Array.from({length:Xa},(ce,ye)=>({phase:ye/Xa,x0:(Math.random()-.5)*Lr*1.4,y0:(Math.random()-.5)*Lr*1.4,dx:0,dy:0})),so=Array.from({length:ja},(ce,ye)=>{const et=new An(new kc(.1,10,10),new ps({color:Ng[ye],transparent:!0,opacity:0}));return le.add(et),et}),fa=Array.from({length:ja},(ce,ye)=>{const et=new An(new kc(.23,10,10),new ps({color:Ng[ye],transparent:!0,opacity:0,depthWrite:!1}));return le.add(et),et}),oo=Array.from({length:ja},()=>{const ce=new Float32Array((mi+1)*3),ye=new Float32Array((mi+1)*3),et=new en;et.setAttribute("position",new kn(ce,3)),et.setAttribute("color",new kn(ye,3));const ut=new Qs(et,new ds({vertexColors:!0,transparent:!0,opacity:.55}));return le.add(ut),{geo:et,pos:ce,col:ye,line:ut}}),Ss=new Array(ja).fill(!1);let ao=-1,Br=[];function Di(){const ce=g.current,ye=(Ot,hn)=>ce.fieldModel==="finite"?ZE(Ot,hn,ce.theta,ce.phi,ce.magL||Ug):QE(Ot,hn,ce.theta,ce.phi),{pP:et}=Js(ce.theta,ce.phi),ut=JE(ce.theta,ce.phi,ye);Br=e1(ce.nPart,ce.phi,et,ut).map(({x:Ot,y:hn,isUp:pn})=>({pts:ye(Ot,hn),isUp:pn}));const Fi=Math.round(mi*.5);Br.forEach(({pts:Ot,isUp:hn},pn)=>{const nn=oo[pn],pr=hn?1:-1,[Hn,Es,_i]=pr>0?[34/255,238/255,102/255]:[1,68/255,34/255];Ot.forEach((mr,Yn)=>{nn.pos[Yn*3]=mr.x,nn.pos[Yn*3+1]=mr.y,nn.pos[Yn*3+2]=mr.z;const Qi=$i((Yn-Fi)/15,0,1);nn.col[Yn*3]=pi(.67,Hn,Qi),nn.col[Yn*3+1]=pi(.8,Es,Qi),nn.col[Yn*3+2]=pi(1,_i,Qi)}),nn.geo.attributes.position.needsUpdate=!0,nn.geo.attributes.color.needsUpdate=!0,nn.geo.setDrawRange(0,Ot.length),nn.line.visible=ce.interp==="pilot",Ss[pn]=!1});for(let Ot=ce.nPart;Ot<ja;Ot++)oo[Ot].line.visible=!1,so[Ot].visible=!1,fa[Ot].visible=!1}Di();function Ii(ce){g.current.drag={btn:ce.button??0,x:ce.clientX,y:ce.clientY},Y.setPointerCapture(ce.pointerId)}function Ui(ce){const ye=g.current;if(!ye.drag)return;const et=ce.clientX-ye.drag.x,ut=ce.clientY-ye.drag.y;if(ye.drag.x=ce.clientX,ye.drag.y=ce.clientY,ye.drag.btn===0)ye.camTheta-=et*.007,ye.camPhi=$i(ye.camPhi+ut*.007,-1.2,1.2);else{const Ut=new j().subVectors(ye.target,be.position).normalize(),Fi=new j().crossVectors(Ut,new j(0,1,0)).normalize(),Ot=new j().crossVectors(Fi,Ut).normalize(),hn=ye.camR*.001;ye.target.addScaledVector(Fi,-et*hn),ye.target.addScaledVector(Ot,ut*hn)}Ht()}function kr(ce){g.current.drag=null,Y.hasPointerCapture(ce.pointerId)&&Y.releasePointerCapture(ce.pointerId)}function Hr(ce){ce.preventDefault();const ye=g.current,et=ce.deltaY>0?1.12:.89,ut=Y.getBoundingClientRect(),Ut=(ce.clientX-ut.left)/ut.width*2-1,Fi=(ce.clientY-ut.top)/ut.height*-2+1,Ot=new fx;Ot.setFromCamera(new Ct(Ut,Fi),be);const pn=Ot.ray.origin.clone().sub(ye.target).dot(Ot.ray.direction),nn=Ot.ray.origin.clone().addScaledVector(Ot.ray.direction,-pn);et<1&&ye.target.lerp(nn,$i(1-et,0,.2)),ye.camR=$i(ye.camR*et,2,45),Ht()}const Ni=ce=>ce.preventDefault();Y.addEventListener("pointerdown",Ii),Y.addEventListener("pointermove",Ui),Y.addEventListener("pointerup",kr),Y.addEventListener("wheel",Hr,{passive:!1}),Y.addEventListener("contextmenu",Ni);let hr=null,Vr=null;const Gr=ce=>{if(ce.touches.length===1&&(hr={x:ce.touches[0].clientX,y:ce.touches[0].clientY}),ce.touches.length===2){const ye=ce.touches[0].clientX-ce.touches[1].clientX,et=ce.touches[0].clientY-ce.touches[1].clientY;Vr=Math.sqrt(ye*ye+et*et),hr=null}},nl=ce=>{if(ce.touches.length===1&&hr){const ye=ce.touches[0].clientX-hr.x,et=ce.touches[0].clientY-hr.y;g.current.camTheta-=ye*.007,g.current.camPhi=$i(g.current.camPhi+et*.007,-1.2,1.2),hr={x:ce.touches[0].clientX,y:ce.touches[0].clientY},Ht()}else if(ce.touches.length===2&&Vr){const ye=ce.touches[0].clientX-ce.touches[1].clientX,et=ce.touches[0].clientY-ce.touches[1].clientY,ut=Math.sqrt(ye*ye+et*et);g.current.camR=$i(g.current.camR*(Vr/ut),2,45),Vr=ut,Ht()}},da=()=>{hr=null,Vr=null};Y.addEventListener("touchstart",Gr,{passive:!0}),window.addEventListener("touchmove",nl,{passive:!0}),window.addEventListener("touchend",da),m.current={scene:le,camera:be,renderer:Q,magGrp:dr,arrow:Be,spinArrow:Rn,wSlabMeshes:Vt,wPoints:bn,wPos:qt,wCol:vt,wGeo:fn,wSamples:Ke,cRing:Ft,bgSt:tl,bgPos:dn,bgCol:on,bgSz:ln,bgGeo:Yt,bgPoints:li,fDots:so,fGlows:fa,fLines:oo,addHit:fr,clearHits:Ki,rebuild:Di,trajs:()=>Br,updateCam:Ht,setHitCounts:ce=>Ze({...ce})};let Ms;function ha(){Ms=requestAnimationFrame(ha);const ce=g.current,ye=m.current;if(!ye)return;ce.dirty&&(ye.rebuild(),ce.dirty=!1),ce.running&&(ce.tick+=ce.speed),Ht();const{pP:et,pM:ut}=Js(ce.theta,ce.phi),Ut=rh(ce.phi),Fi=ce.phi*Math.PI/180,Ot=ce.tick%jo/jo,hn=pi(sr,Ys,Ot),pn=Ot>=.5,nn=pn?(Ot-.5)/.5:0,pr=$i(Math.round(Ot*mi),0,mi),Hn=ce.showWave;ye.bgPoints.visible=Hn,ye.magGrp.rotation.z=-Fi;const Es=ce.fieldModel==="finite"?(ce.magL||1)/Ug:1;ye.magGrp.scale.z=Es;const _i=Ut.clone();Math.abs(_i.x)<.001&&Math.abs(_i.z)<.001&&(_i.x=.001),_i.normalize(),ye.arrow.setDirection(_i);const mr=ce.theta*Math.PI/180,Yn=new j(Math.sin(mr),Math.cos(mr),0).normalize();if(ye.spinArrow.setDirection(Yn),!Hn)ye.wSlabMeshes.forEach(Nt=>{Nt.visible=!1});else{const Nt=ce.wSig||.55,Sn=ce.fieldModel==="finite",At=Sn?Math.sqrt(1+((hn-sr)/v0)**2):1,Vn=Nt*At,Gn=Nt*1.6*At,Pn=Sn?$i((hn-(Hc-(ce.magL||1)/2))/((ce.magL||1)+.001),0,1):pn?nn:0,Oi=Nt*At*(1+Pn*.4),Ji=Nt*1.6*At,lo=ye.trajs();let Kn=0,er=0,xi=0,gr=0,Zn=0,ws=0;lo.forEach(({pts:co,isUp:mn})=>{const Ts=mn?1:-1,uo=co[pr];Ts>0?(Kn+=uo.x,er+=uo.y,Zn++):(xi+=uo.x,gr+=uo.y,ws++)});const Xc=Zn>0?Kn/Zn:Ut.x*nn*or,jc=Zn>0?er/Zn:Ut.y*nn*or,rl=ws>0?xi/ws:-Ut.x*nn*or,$c=ws>0?gr/ws:-Ut.y*nn*or,qc=1;ye.wSlabMeshes.forEach(co=>{const mn=co.material.uniforms;mn.uSigXY.value=pn?Oi:Vn,mn.uSigZ.value=pn?Ji:Gn,mn.uCx.value=pn?Xc:0,mn.uCy.value=pn?jc:0,mn.uCx2.value=rl,mn.uCy2.value=$c,mn.uPp.value=et,mn.uPm.value=ut,mn.uWz.value=hn,mn.uPhase.value=0;const Ts=ce.fieldModel==="finite"?hn>Hc-(ce.magL||1)/2:pn;mn.uIsPost.value=Ts?1:0,mn.uOpacity.value=qc,mn.uMode.value=ce.wMode==="old"?0:1,mn.uBright.value=ce.wBright||1,mn.uAlphaMax.value=ce.wAlpha||.38,co.visible=!0})}const Qi=Math.max(0,.8-Math.abs(Ot-.5)*13);ye.cRing.material.opacity=Hn?Qi*.65:0,ye.cRing.rotation.z=-Fi,ye.bgSt.forEach((Nt,Sn)=>{ce.running&&(Nt.phase=(Nt.phase+ce.speed/jo)%1);const At=Nt.phase>.5?(Nt.phase-.5)/.5:0;let Vn=Nt.x0,Gn=Nt.y0;if(Nt.phase>=.5){const Kn=At*or,er=Lr*(1+At*.5),xi=((Vn-Ut.x*Kn)**2+(Gn-Ut.y*Kn)**2)/er**2,gr=((Vn+Ut.x*Kn)**2+(Gn+Ut.y*Kn)**2)/er**2,Zn=(et*Math.exp(-xi)-ut*Math.exp(-gr))/(et*Math.exp(-xi)+ut*Math.exp(-gr)+1e-12)*or*ce.speed/jo;Nt.dx+=Ut.x*Zn,Nt.dy+=Ut.y*Zn,Vn+=Nt.dx,Gn+=Nt.dy}Nt.phase<1/jo&&(Nt.x0=(Math.random()-.5)*Lr*1.4,Nt.y0=(Math.random()-.5)*Lr*1.4,Nt.dx=0,Nt.dy=0),ye.bgPos[Sn*3]=Vn,ye.bgPos[Sn*3+1]=Gn,ye.bgPos[Sn*3+2]=pi(sr,Ys,Nt.phase);const Pn=$i(At*3,0,1);let Oi=.55,Ji=.8,lo=1;if(At>0){const Kn=At*or,er=Lr*(1+At*.5),xi=((Vn-Ut.x*Kn)**2+(Gn-Ut.y*Kn)**2)/er**2,gr=((Vn+Ut.x*Kn)**2+(Gn+Ut.y*Kn)**2)/er**2,Zn=et*Math.exp(-xi)/(et*Math.exp(-xi)+ut*Math.exp(-gr)+1e-12);Oi=pi(.55,pi(1,.15,Zn),Pn),Ji=pi(.8,pi(.28,.92,Zn),Pn),lo=pi(1,pi(.12,.45,Zn),Pn)}ye.bgCol[Sn*3]=Oi,ye.bgCol[Sn*3+1]=Ji,ye.bgCol[Sn*3+2]=lo,ye.bgSz[Sn]=Hn?.2+At*.1:0}),ye.bgGeo.attributes.position.needsUpdate=!0,ye.bgGeo.attributes.aColor.needsUpdate=!0,ye.bgGeo.attributes.size.needsUpdate=!0;const il=ye.trajs(),In=Math.floor(ce.tick/jo);In!==ao&&(ao=In,Ss.fill(!1),ce.dirty=!0);const Wr=ce.showParticles&&ce.interp==="pilot";il.forEach(({pts:Nt,isUp:Sn},At)=>{const Vn=At<ce.nPart?Sn?1:-1:1,Gn=Vn>0?2289254:16729122;if(At>=ce.nPart||!Wr)ye.fDots[At].visible=!1,ye.fGlows[At].visible=!1,At<ce.nPart&&(ye.fLines[At].line.visible=!1);else{ye.fLines[At].line.visible=!0;const Pn=Nt[pr];ye.fDots[At].visible=!0,ye.fGlows[At].visible=!0,ye.fDots[At].position.copy(Pn),ye.fGlows[At].position.copy(Pn),ye.fDots[At].material.opacity=.95,ye.fGlows[At].material.opacity=.18;const Oi=$i((Ot-.5)/.12,0,1),Ji=new St().lerpColors(new St(11193599),new St(Gn),Oi);ye.fDots[At].material.color.copy(Ji),ye.fGlows[At].material.color.copy(Ji),ye.fLines[At].geo.setDrawRange(0,pr+1)}if(At<ce.nPart&&pr>=mi-2&&!Ss[At]){Ss[At]=!0;const Pn=Nt[mi];ye.addHit(Pn.x,Pn.y,Gn),Vn>0?ce.hitStats.up++:ce.hitStats.down++,ye.setHitCounts(ce.hitStats),ce.interp==="manyworlds"&&(ce.worlds+=1,ie(ce.worlds))}}),ye.renderer.render(ye.scene,ye.camera)}return ha(),()=>{cancelAnimationFrame(Ms),Bt.disconnect(),Y.removeEventListener("pointerdown",Ii),Y.removeEventListener("pointermove",Ui),Y.removeEventListener("pointerup",kr),Y.removeEventListener("wheel",Hr),Y.removeEventListener("contextmenu",Ni),Y.removeEventListener("touchstart",Gr),window.removeEventListener("touchmove",nl),window.removeEventListener("touchend",da),Q.dispose(),Y.contains(Q.domElement)&&Y.removeChild(Q.domElement)}},[]);const{pP:ke,pM:Qe}=R,rt=fe.jsx(o1,{interp:H,setInterp:ge,worlds:z,theta:_,setTheta:Cn,thetaRef:e,phi:S,setPhi:mt,phiRef:n,nPart:w,setNPart:dt,nPartRef:r,speed:zt,setSpeed:Ie,speedRef:h,pP:ke,pM:Qe,running:N,setRunning:je,showWave:v,setShowWave:_e,showParticles:L,setShowParticles:Se,resetHits:ze,showExpert:xe,setShowExpert:Le,wSig:Z,setWSig:Ye,wSigRef:a,wMode:me,setWMode:It,wBright:U,setWBright:T,wBrightRef:c,wAlpha:Fe,setWAlpha:ee,wAlphaRef:u,fieldModel:he,setFieldModel:Xe,magL:de,setMagL:P,magLRef:d}),ht=fe.jsx("iframe",{srcDoc:`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  body { margin:0; padding:22px 26px; background:#040a1c; color:#cce0ff;
    font-family:'Georgia',serif; font-size:14px; line-height:1.9; }
  h1 { font-size:20px; color:#aaccff; margin-bottom:4px; }
  .ref { font-size:12px; color:#5878a0; font-style:italic; margin-bottom:24px; }
  h2 { font-size:15px; color:#7ab8ff; font-weight:700; margin:24px 0 8px;
    border-bottom:1px solid rgba(60,120,255,0.25); padding-bottom:5px; }
  h3 { font-size:13px; color:#88ccff; font-weight:700; margin:16px 0 6px; }
  p { margin:8px 0 12px; }
  .eq { margin:12px 0; padding:10px 20px; text-align:center;
    background:rgba(20,45,110,0.5); border:1px solid rgba(80,140,255,0.25);
    border-radius:7px; font-size:15px; overflow-x:auto; }
  .model-box { border-radius:8px; padding:12px 16px; margin:14px 0; }
  .delta-box { background:rgba(20,60,40,0.4); border:1px solid rgba(60,180,100,0.3); }
  .finite-box { background:rgba(20,40,80,0.4); border:1px solid rgba(80,140,255,0.3); }
  .model-label { font-size:11px; font-weight:700; text-transform:uppercase;
    letter-spacing:0.1em; margin-bottom:6px; }
  .delta-label { color:#66dd88; }
  .finite-label { color:#66aaff; }
  a { color:#4488aa; }
  b.collapse { color:#ff9966; }
  b.pilot    { color:#44ddff; }
  b.manyworlds { color:#bb88ff; }
</style>
<script>
MathJax = {
  tex: { inlineMath: [['$','$']], displayMath: [['$$','$$']] },
  options: { skipHtmlTags: ['script','noscript','style','textarea'] }
};
<\/script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"><\/script>
</head>
<body>
<h1>Theory of the Stern&ndash;Gerlach Effect</h1>
<div class="ref">Based on Norsen (2014), <em>Am. J. Phys.</em> 82, 337</div>

<h2>1. The Quantum State</h2>
<p>A spin-&frac12; particle entering the magnet is prepared in a superposition of spin
eigenstates along the measurement axis $\\hat{n}(\\varphi) = (\\sin\\varphi, \\cos\\varphi, 0)$:</p>
<div class="eq">$$|\\Psi\\rangle = \\cos\\tfrac{\\theta}{2}\\,|{+}\\hat{n}\\rangle + \\sin\\tfrac{\\theta}{2}\\,|{-}\\hat{n}\\rangle$$</div>

<h3>Initial wave packet</h3>
<div class="model-box delta-box">
<div class="model-label delta-label">&#x03B4; Delta model</div>
<p style="margin:0">The spatial part is a Gaussian with <em>constant</em> width $\\sigma$, moving rigidly along $z$:</p>
<div class="eq">$$\\psi_0(\\mathbf{r}) \\propto \\exp\\!\\left[-\\frac{x^2+y^2}{4\\sigma^2} - \\frac{(z-z_0)^2}{4\\sigma_z^2}\\right] e^{ikz}$$</div>
</div>

<div class="model-box finite-box">
<div class="model-label finite-label">&#x25AC; Finite field model</div>
<p style="margin:0">The packet spreads freely during propagation. With waist $\\sigma_0$ at the source $z_0$ and Rayleigh length $z_R = m\\sigma_0^2/\\hbar$, the transverse width grows as:</p>
<div class="eq">$$\\sigma(z) = \\sigma_0\\,\\sqrt{1 + \\left(\\frac{z - z_0}{z_R}\\right)^{\\!2}}$$</div>
<p style="margin:4px 0 0">So the full pre-magnet wavefunction is:</p>
<div class="eq">$$\\psi(\\mathbf{r},t) \\propto \\frac{1}{\\sigma(z)}\\exp\\!\\left[-\\frac{x^2+y^2}{4\\sigma(z)^2} - \\frac{(z-vt)^2}{4\\sigma_z^2}\\right] e^{ikz}$$</div>
</div>

<h2>2. The Magnetic Field</h2>

<div class="model-box delta-box">
<div class="model-label delta-label">&#x03B4; Delta model</div>
<p style="margin:0">Following Norsen (2014), the field is an impulsive delta function at $z=0$:</p>
<div class="eq">$$\\mathbf{B}(\\mathbf{r}) = B_0\\,\\delta(z)\\,\\hat{n}$$</div>
<p style="margin:4px 0 0">This imparts an <em>instantaneous</em> momentum kick to each spin component:</p>
<div class="eq">$$\\Delta p_{\\hat{n}} = \\begin{cases} +\\hbar\\kappa & |{+}\\hat{n}\\rangle \\ -\\hbar\\kappa & |{-}\\hat{n}\\rangle \\end{cases}$$</div>
</div>

<div class="model-box finite-box">
<div class="model-label finite-label">&#x25AC; Finite field model</div>
<p style="margin:0">The field has a constant gradient $\\alpha$ over a finite length $L$ centred at $z=0$:</p>
<div class="eq">$$\\mathbf{B}(\\mathbf{r}) = \\alpha\\,(\\hat{n}\\cdot\\mathbf{r}_\\perp)\\,\\hat{n}\\cdot\\mathbf{1}_{|z| \\leq L/2}$$</div>
<p style="margin:4px 0 0">The transverse momentum kick accumulates <em>continuously</em> as the particle traverses the field. The total kick after full traversal equals $\\hbar\\kappa$ (same as delta model), but is spread over length $L$:</p>
<div class="eq">$$\\frac{dp_{\\hat{n}}}{dz} = \\pm\\frac{\\hbar\\kappa}{L}, \\quad |z| \\leq \\tfrac{L}{2}$$</div>
<p style="margin:4px 0 0">The packet width $\\sigma(z)$ continues to grow through and beyond the magnet,
so the two arms emerge broadened and with a smooth continuous separation.</p>
</div>

<h2>3. Post-Magnet Wavefunction</h2>
<p>In both models, after the magnet the state is a superposition of two separating arms:</p>
<div class="eq">$$\\Psi(\\mathbf{r},t) = \\cos\\tfrac{\\theta}{2}\\;\\psi_+(\\mathbf{r},t)\\,|{+}\\hat{n}\\rangle + \\sin\\tfrac{\\theta}{2}\\;\\psi_-(\\mathbf{r},t)\\,|{-}\\hat{n}\\rangle$$</div>

<div class="model-box delta-box">
<div class="model-label delta-label">&#x03B4; Delta model &mdash; arm centres</div>
<div class="eq">$$\\langle\\hat{n}\\rangle_\\pm(t) = \\pm\\frac{\\hbar\\kappa}{m}\\,(t - t_{\\rm mag})$$</div>
<p style="margin:4px 0 0">Width $\\sigma$ remains constant (no free spreading).</p>
</div>

<div class="model-box finite-box">
<div class="model-label finite-label">&#x25AC; Finite model &mdash; arm centres</div>
<div class="eq">$$\\langle\\hat{n}\\rangle_\\pm(z) = \\pm\\kappa\\,\\frac{\\min(z,\\,L/2)}{1}\\cdot\\frac{z - z_{\\rm entry}}{L}$$</div>
<p style="margin:4px 0 0">Width $\\sigma(z)$ keeps growing after the magnet via free evolution.</p>
</div>

<h2>4. Born Rule Probabilities</h2>
<div class="eq">$$P(+\\hat{n}) = \\cos^2\\!\\tfrac{\\theta-\\varphi}{2}, \\qquad P(-\\hat{n}) = \\sin^2\\!\\tfrac{\\theta-\\varphi}{2}$$</div>
<p>These probabilities are <em>identical</em> in both field models &mdash; the Born rule
depends only on the initial spin state and measurement axis, not on field details.</p>

<h2>5. Pilot-Wave (Bohmian) Trajectories</h2>
<p>In the de Broglie&ndash;Bohm interpretation each particle has a definite position
$\\mathbf{Q}(t)$ at all times, evolving under the <em>guidance equation</em>:</p>
<div class="eq">$$\\dot{\\mathbf{Q}} = \\frac{\\hbar}{m}\\,\\operatorname{Im}\\!\\left[\\frac{\\Psi^*\\nabla\\Psi}{|\\Psi|^2}\\right]_{\\mathbf{r}=\\mathbf{Q}}$$</div>
<p>For the two-component state this reduces along $\\hat{n}$ to:</p>
<div class="eq">$$\\dot{Q}_{\\hat{n}} = \\frac{\\rho_+\\, v_+ + \\rho_-\\, v_-}{\\rho_+ + \\rho_-}$$</div>
<p>where $\\rho_\\pm(\\mathbf{Q},t) = |\\psi_\\pm(\\mathbf{Q},t)|^2$.</p>

<div class="model-box delta-box">
<div class="model-label delta-label">&#x03B4; Delta model</div>
<p style="margin:0">Guidance begins at $z=0$. Before the magnet trajectories are straight lines.
The critical boundary is a sharp ring in the $z=0$ plane.</p>
</div>

<div class="model-box finite-box">
<div class="model-label finite-label">&#x25AC; Finite model</div>
<p style="margin:0">Guidance begins at $z = -L/2$ (magnet entry). Because $\\sigma(z)$ grows
continuously and the separation builds gradually, trajectories curve more gently.
The spreading arms overlap for longer, so the critical boundary is a <em>fuzzy zone</em>
rather than a sharp ring.</p>
</div>

<h2>6. The Critical Boundary</h2>
<p>The yellow ring marks where $\\rho_+ = \\rho_-$:</p>
<div class="eq">$$P_+\\,|\\psi_+(\\mathbf{Q})|^2 = P_-\\,|\\psi_-(\\mathbf{Q})|^2$$</div>
<p>Particles on the $+\\hat{n}$ side reach the $+\\hat{n}$ detector. Because initial positions
are $|\\Psi|^2$-distributed (quantum equilibrium), the Born rule is reproduced exactly
in both models.</p>

<h2>7. The Three Interpretations</h2>
<p><b class="collapse">Collapse (Copenhagen):</b> Wavefunction collapses on measurement.
No trajectory prior to detection. The field model affects the <em>shape</em> of collapse
but not its probability.</p>
<p><b class="pilot">Pilot Wave (de Broglie&ndash;Bohm):</b> Both arms evolve; the particle
follows one trajectory. In the finite model the trajectory curves gradually through the
magnet rather than kinking sharply at $z=0$.</p>
<p><b class="manyworlds">Many Worlds (Everett):</b> Both branches are real. After $n$ particles:</p>
<div class="eq">$$N_{\\rm worlds} = 2^n$$</div>

<p style="font-size:12px; color:#445566; border-top:1px solid rgba(40,70,140,0.25);
  padding-top:12px; margin-top:16px;">
  <strong style="color:#607090">References:</strong>
  T. Norsen, &ldquo;The pilot-wave perspective on spin,&rdquo;
  <em>Am. J. Phys.</em> <strong>82</strong>, 337 (2014).
  <a href="https://doi.org/10.1119/1.4848217" target="_blank">doi:10.1119/1.4848217</a>
  &nbsp;&mdash;&nbsp;
  J. D&iacute;az Bulnes &amp; I.S. Oliveira,
  &ldquo;Construction of exact solutions for the Stern-Gerlach effect,&rdquo;
  <em>Braz. J. Phys.</em> <strong>31</strong>, 4 (2001).
</p>
</body>
</html>`,style:{width:"100%",height:"100%",border:"none"},title:"Theory"}),[at,Pt]=yt.useState(254);yt.useRef(!1);const W=yt.useRef(null);return yt.useEffect(()=>{const Y=W.current;if(!Y)return;const Q=Pe=>Pt(Math.max(180,Math.min(520,Pe.clientX))),le=Pe=>{Y.releasePointerCapture(Pe.pointerId),Y.removeEventListener("pointermove",Q)},be=Pe=>{Pe.preventDefault(),Y.setPointerCapture(Pe.pointerId),Y.addEventListener("pointermove",Q),Y.addEventListener("pointerup",le,{once:!0})};return Y.addEventListener("pointerdown",be),()=>Y.removeEventListener("pointerdown",be)},[]),fe.jsxs("div",{style:{width:"100%",height:"100%",overflow:"hidden",background:"#07101e",display:"flex",flexDirection:"column"},children:[fe.jsx("style",{children:`
        .tbb{padding:8px 18px;cursor:pointer;font-family:monospace;font-size:13px;
          border:none;border-bottom:3px solid transparent;background:transparent;color:#6888aa;}
        .tba{color:#aaddff;border-bottom-color:#4488ff;}
        .tbb:hover{color:#cce0ff;}
        .rh{width:5px;cursor:col-resize;background:rgba(40,80,200,0.15);flex-shrink:0;
          transition:background 0.15s;touch-action:none;user-select:none;}
        .rh:hover,.rh:active{background:rgba(80,140,255,0.4);}
        input[type=range]{touch-action:auto;pointer-events:auto;cursor:pointer;}
      `}),fe.jsxs("div",{style:{display:"flex",alignItems:"center",height:38,flexShrink:0,background:"rgba(4,10,30,0.98)",borderBottom:"1px solid rgba(40,80,180,0.3)",paddingLeft:12,gap:4},children:[fe.jsx("span",{style:{fontSize:11,color:"#4060a0",fontFamily:"monospace",letterSpacing:"0.08em",marginRight:12},children:"STERN-GERLACH 3D"}),fe.jsx("button",{className:"tbb"+(pe==="sim"?" tba":""),onClick:()=>we("sim"),children:"Simulation"}),fe.jsx("button",{className:"tbb"+(pe==="theory"?" tba":""),onClick:()=>we("theory"),children:"Theory"})]}),fe.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"row",overflow:"hidden",minHeight:0},children:[fe.jsx("div",{style:{width:at,minWidth:180,flexShrink:0,background:"rgba(8,18,45,0.98)",overflowY:"auto",height:"100%"},children:rt}),fe.jsx("div",{className:"rh",ref:W}),fe.jsxs("div",{style:{flex:1,minWidth:0,position:"relative",height:"100%"},children:[fe.jsx("div",{ref:s,style:{width:"100%",height:"100%",cursor:"grab",display:pe==="sim"?"block":"none"}}),pe==="sim"&&fe.jsx("div",{style:{position:"absolute",top:10,left:10,display:"flex",gap:4,zIndex:10},children:[["3d","3D"],["xy","XY"],["xz","XZ"],["yz","YZ"]].map(([Y,Q])=>fe.jsx("button",{onClick:()=>Ce(Y),style:{padding:"3px 10px",fontSize:11,fontFamily:"monospace",background:bt===Y?"rgba(80,140,255,0.30)":"rgba(4,10,30,0.75)",border:"1px solid "+(bt===Y?"#5588ff":"rgba(80,140,255,0.28)"),borderRadius:4,color:bt===Y?"#aaddff":"#6888aa",cursor:"pointer",backdropFilter:"blur(6px)",transition:"all 0.13s"},children:Q},Y))}),pe==="sim"&&fe.jsx("div",{style:{position:"absolute",top:10,right:12,zIndex:10,background:"rgba(4,10,30,0.88)",border:"1px solid rgba(80,140,255,0.28)",borderRadius:7,padding:"8px 12px",backdropFilter:"blur(10px)",boxShadow:"0 4px 18px rgba(0,0,20,0.65)"},children:fe.jsx(s1,{up:ve.up,down:ve.down,pP:R.pP,pM:R.pM})}),pe==="theory"&&fe.jsx("div",{style:{position:"absolute",inset:0,overflowY:"auto"},children:ht})]})]})]})}kv.createRoot(document.getElementById("root")).render(fe.jsx(a1,{}));
