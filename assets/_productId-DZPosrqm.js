import{r as d,t as y,bw as H,j as r,F as w,et as Te,df as Ie,bc as ce,bd as Pe,be as B,bf as ot,a as A,b as at,k as it,l as ct,dz as lt,gu as dt,bo as ut,gv as pt,bZ as ht,gw as z,B as V,cw as mt,u as _,cq as gt,bX as ft,dw as Ae,g as le,d as K,i as U,ex as yt,cF as F,gx as xt,gq as Y,gy as J,er as _e,gs as $e,gz as De,gA as ge,gB as bt,gC as te,dk as fe,gt as vt,d1 as Ne,x as wt,D as ye,gD as Ct,gE as jt,dL as St,gF as xe}from"./index-v1D2pbK4.js";import{P as kt,A as Mt,C as Oe,u as Et,a as Rt,b as Tt,c as be,S as It,M as Pt}from"./useDidUpdate-Dj1x0gfd.js";import{a as At}from"./zod-LjJ5Pw42.js";import{F as _t}from"./file-DVQZGkv_.js";import{S as $t}from"./square-CH2HBTrh.js";import{p as ve}from"./utils-D7NePrGt.js";import{S as Z}from"./Spinner-roSAbI_V.js";import{p as Dt}from"./terms-DaDv2sWr.js";import{T as Nt}from"./Tally-D_pDCMII.js";import{P as Le}from"./PricingPlanModal-smwHw9XK.js";import{T as ze}from"./Toolbar-CzBezMic.js";import{c as Ot}from"./index-D_fwaimP.js";import{T as Lt}from"./Toggle-Bw2zWP5q.js";import"./purchaseTrack-DZZwS9hT.js";import"./useModal-dWm6yN0z.js";import"./referral-BYMO7ji6.js";import"./hook-pFjZxGc0.js";import"./capture-DRra8-Z3.js";import"./blobDownload-Be_UIMX-.js";import"./message-circle-D0xEsgMU.js";import"./shield-B55aWBxM.js";import"./arrow-left-DxbS0Ma0.js";import"./download-CzykxB7v.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"4ec8814b09863b6c7639bd810d013f7e613e7ea1"}}catch{}})();try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="c176d0d1-4589-45d6-8d5b-2cab92f9980f",e._sentryDebugIdIdentifier="sentry-dbid-c176d0d1-4589-45d6-8d5b-2cab92f9980f")})()}catch{}function zt(e){return Ft(e)||Bt(e)||Fe(e)||Vt()}function Ft(e){if(Array.isArray(e))return re(e)}function Bt(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Fe(e,t){if(e){if(typeof e=="string")return re(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return re(e,t)}}function re(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,s=new Array(t);n<t;n++)s[n]=e[n];return s}function Vt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function qt(e,t){var n=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=Fe(e))||t){n&&(e=n);var s=0,o=function(){};return{s:o,n:function(){return s>=e.length?{done:!0}:{done:!1,value:e[s++]}},e:function(h){throw h},f:o}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a=!0,i=!1,u;return{s:function(){n=n.call(e)},n:function(){var h=n.next();return a=h.done,h},e:function(h){i=!0,u=h},f:function(){try{!a&&n.return!=null&&n.return()}finally{if(i)throw u}}}}var we=function(){};function Ht(e){var t=d.useRef(e);return d.useEffect(function(){t.current=e},[e]),d.useCallback(function(){return t.current.apply(t,arguments)},[])}function Ut(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return d.useCallback(function(s){var o=qt(t),a;try{for(o.s();!(a=o.n()).done;){var i=a.value;typeof i=="function"?i(s):i!=null&&(i.current=s)}}catch(u){o.e(u)}finally{o.f()}},t)}function Ce(e,t){var n=Ht(e),s=d.useRef(we),o=d.useCallback(function(a){if(s.current(),s.current=we,a!=null){var i=e(a);typeof i=="function"&&(s.current=i)}},[n].concat(zt(t)));return o}const Be=y("main",{target:"e11dylwz0"})("display:flex;flex-direction:row;width:100vw;height:100vh;background-color:",({theme:e})=>e.color.bgGray,";-ms-overflow-style:none;scrollbar-width:none;scrollbar-height:none;&::-webkit-scrollbar{display:none;}@media (max-width:1199px){flex-direction:column;}"),Ve=y("div",{target:"e11dylwz1"})("width:100%;height:100%;display:flex;flex-direction:column;align-items:",({$isMobile:e})=>e?"center":"start",";flex:1;min-height:0;overflow:hidden;"),Gt=y("div",{target:"e11dylwz2"})("display:flex;align-items:center;justify-content:center;width:100%;height:fit-content;padding:8px 0px;border-bottom:1px solid ",({theme:e})=>e.color.borderGray,";background-color:",({theme:e})=>e.color.white,";"),Kt=y(kt,{target:"e11dylwz3"})("width:2px;background-color:",({theme:e})=>e.color.borderGray,";&[data-resize-handle-state='hover']{outline:2px solid ",({theme:e})=>e.color.borderGray,";}"),Jt=y("div",{target:"e11dylwz4"})("width:100%;height:100%;overflow:hidden;position:relative;"),Qt=y("div",{target:"e11dylwz5"})(`display:flex;width:200%;height:100%;transform:translateX(
    `,({$toggleValue:e})=>e==="left"?"0%":"-50%","  );transition:transform 0.3s ease-in-out;"),je=y("div",{target:"e11dylwz6"})("width:50%;flex-shrink:0;height:100%;overflow:hidden;"),Xt=y("section",{target:"e11dhoup0"})("display:flex;flex-direction:column;min-width:100%;flex:1;height:100%;"),Wt=y("div",{target:"e11dhoup1"})("display:flex;flex:1;overflow-y:hidden;"),Yt=y("div",{target:"e11dhoup2"})("flex-direction:column;display:flex;overflow-y:auto;gap:8px;padding:20px;width:100%;-ms-overflow-style:none;scrollbar-width:none;::-webkit-scrollbar{display:none;}"),Zt=y("div",{target:"e11dhoup3"})(`position:relative;padding:0 20px 20px 20px;background:transparent;z-index:0;::before{content:'';position:absolute;top:-30px;bottom:0;inset-inline-start:0;width:100%;height:100px;pointer-events:none;z-index:0;background:linear-gradient(
      180deg,color(from `,({theme:e})=>e.color.bgGray," srgb r g b / 0),color(from ",({theme:e})=>e.color.bgGray,` srgb r g b / 1) 40%
    );}`),er=y("span",{target:"eotqq870"})("white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;"),tr=({fileName:e,onRemove:t})=>{const n=H(),s=d.useCallback(()=>{t(e)},[e,t]);return r.jsxs(w,{maxWidth:"100%",$typo:"Md_16",height:32,padding:"0 12px",alignItems:"center",gap:4,$bgColor:"bgBlueGray",$borderRadius:"full",$color:"textGray",children:[r.jsx(_t,{size:20,color:n.color.textGray}),r.jsx(er,{children:e}),r.jsx(Te,{type:"button",variant:"text",size:"small",onClick:s,children:r.jsx(Ie,{size:20,color:n.color.textGray})})]})},rr=ce({prompt:B().trim().nonempty(),files:Pe(ot(File))}),nr=y("div",{target:"eqauroa0"})("position:relative;display:flex;flex-direction:column;padding:12px;gap:12px;box-shadow:0 4px 12px 0 rgba(0,27,55,0.1);border-radius:10px;border:none;background:",({theme:e})=>e.color.white,";z-index:0;"),sr=({onSubmit:e,chatStatus:t,stop:n})=>{const s=H(),{t:o}=A("main"),a=at({resolver:At(rr),defaultValues:{prompt:"",files:[]}}),i=d.useRef(null),u=d.useMemo(()=>t==="streaming"||t==="submitted",[t]),{getValues:h,reset:v,setValue:g,formState:{isValid:k}}=a,T=a.watch("files"),j=d.useCallback(l=>{const C=(h("files")||[]).filter(D=>D.name!==l);g("files",C)},[h,g]),M=d.useCallback(l=>{u||(e(l),v())},[e,v,u]),E=d.useMemo(()=>u?{children:r.jsx($t,{size:16,fill:s.color.black}),variant:"filled",type:"button",onClick:n}:{children:r.jsx(Mt,{size:20,color:s.color.white}),type:"submit",variant:"filled",disabled:!k},[u,s.color.black,s.color.white,n,k]),f=d.useCallback(l=>{l.key==="Enter"&&!l.shiftKey&&!l.nativeEvent.isComposing&&(l.preventDefault(),i.current?.requestSubmit())},[]);return r.jsx(nr,{children:r.jsxs(it,{form:a,onSubmit:M,ref:i,children:[r.jsx(ct,{control:a.control,name:"prompt",render:({field:l})=>r.jsx(lt,{id:"prompt",$borderColor:"none",$padding:0,$borderRadius:"none",$bgColor:"none",placeholder:o("chat.input.placeholder"),$placeholderColor:"textGray",minRows:1,maxRows:7,onKeyDown:f,...l})}),T.length>0&&r.jsx(w,{wrap:"wrap",gap:8,children:T.map(l=>r.jsx(tr,{fileName:l.name,onRemove:j},l.name))}),r.jsxs(w,{justify:"space-between",children:[r.jsx("div",{}),r.jsx(Te,{type:E.type,variant:E.variant,size:"medium",disabled:E.disabled,onClick:E.onClick,children:E.children})]})]})})};var qe="vercel.ai.error",or=Symbol.for(qe),He,ar=class Ue extends Error{constructor({name:t,message:n,cause:s}){super(n),this[He]=!0,this.name=t,this.cause=s}static isInstance(t){return Ue.hasMarker(t,qe)}static hasMarker(t,n){const s=Symbol.for(n);return t!=null&&typeof t=="object"&&s in t&&typeof t[s]=="boolean"&&t[s]===!0}};He=or;var q=ar;function Ge(e){return e==null?"unknown error":typeof e=="string"?e:e instanceof Error?e.message:JSON.stringify(e)}var Ke="AI_InvalidArgumentError",Je=`vercel.ai.error.${Ke}`,ir=Symbol.for(Je),Qe,cr=class extends q{constructor({message:e,cause:t,argument:n}){super({name:Ke,message:e,cause:t}),this[Qe]=!0,this.argument=n}static isInstance(e){return q.hasMarker(e,Je)}};Qe=ir;var Xe="AI_JSONParseError",We=`vercel.ai.error.${Xe}`,lr=Symbol.for(We),Ye,Se=class extends q{constructor({text:e,cause:t}){super({name:Xe,message:`JSON parsing failed: Text: ${e}.
Error message: ${Ge(t)}`,cause:t}),this[Ye]=!0,this.text=e}static isInstance(e){return q.hasMarker(e,We)}};Ye=lr;var Ze="AI_TypeValidationError",et=`vercel.ai.error.${Ze}`,dr=Symbol.for(et),tt,ur=class ne extends q{constructor({value:t,cause:n}){super({name:Ze,message:`Type validation failed: Value: ${JSON.stringify(t)}.
Error message: ${Ge(n)}`,cause:n}),this[tt]=!0,this.value=t}static isInstance(t){return q.hasMarker(t,et)}static wrap({value:t,cause:n}){return ne.isInstance(n)&&n.value===t?n:new ne({value:t,cause:n})}};tt=dr;var se=ur,pr=({prefix:e,size:t=16,alphabet:n="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",separator:s="-"}={})=>{const o=()=>{const a=n.length,i=new Array(t);for(let u=0;u<t;u++)i[u]=n[Math.random()*a|0];return i.join("")};if(e==null)return o;if(n.includes(s))throw new cr({argument:"separator",message:`The separator "${s}" must not be part of the alphabet "${n}".`});return()=>`${e}${s}${o()}`};pr();var hr=/"__proto__"\s*:/,mr=/"constructor"\s*:/;function gr(e){const t=JSON.parse(e);return t===null||typeof t!="object"||hr.test(e)===!1&&mr.test(e)===!1?t:fr(t)}function fr(e){let t=[e];for(;t.length;){const n=t;t=[];for(const s of n){if(Object.prototype.hasOwnProperty.call(s,"__proto__"))throw new SyntaxError("Object contains forbidden prototype property");if(Object.prototype.hasOwnProperty.call(s,"constructor")&&Object.prototype.hasOwnProperty.call(s.constructor,"prototype"))throw new SyntaxError("Object contains forbidden prototype property");for(const o in s){const a=s[o];a&&typeof a=="object"&&t.push(a)}}}return e}function yr(e){const{stackTraceLimit:t}=Error;Error.stackTraceLimit=0;try{return gr(e)}finally{Error.stackTraceLimit=t}}var oe=Symbol.for("vercel.ai.validator");function xr(e){return{[oe]:!0,validate:e}}function br(e){return typeof e=="object"&&e!==null&&oe in e&&e[oe]===!0&&"validate"in e}function vr(e){return br(e)?e:wr(e)}function wr(e){return xr(async t=>{const n=await e["~standard"].validate(t);return n.issues==null?{success:!0,value:n.value}:{success:!1,error:new se({value:t,cause:n.issues})}})}async function Cr({value:e,schema:t}){const n=vr(t);try{if(n.validate==null)return{success:!0,value:e,rawValue:e};const s=await n.validate(e);return s.success?{success:!0,value:s.value,rawValue:e}:{success:!1,error:se.wrap({value:e,cause:s.error}),rawValue:e}}catch(s){return{success:!1,error:se.wrap({value:e,cause:s}),rawValue:e}}}async function jr({text:e,schema:t}){try{const n=yr(e);return t==null?{success:!0,value:n,rawValue:n}:await Cr({value:n,schema:t})}catch(n){return{success:!1,error:Se.isInstance(n)?n:new Se({text:e,cause:n}),rawValue:void 0}}}function Sr({stream:e,schema:t}){return e.pipeThrough(new TextDecoderStream).pipeThrough(new dt).pipeThrough(new TransformStream({async transform({data:n},s){n!=="[DONE]"&&s.enqueue(await jr({text:n,schema:t}))}}))}new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");const kr=ut(["chat-respond","canvas-edit","final-chat-respond"]),Mr=B().regex(/^on_(chat_model|llm|chain|tool|retriever|prompt)_(start|stream|end)$/,{message:"Invalid event name format"}),Er=ce({userMessage:B(),chatHistory:Pe(B()),productContext:B()}),Rr=ce({name:kr,event:Mr,value:B()}),Tr=({id:e,messages:t,body:n})=>{const s=localStorage.getItem("accessToken");if(typeof s!="string"||!s)throw new Error("Access token is not found");const o=Er.parse({userMessage:ve(t[t.length-1].parts),chatHistory:t.slice(0,-1).map(a=>ve(a.parts))??[],productContext:n?.productContext});return{headers:{"X-Session-ID":e,Authorization:`Bearer ${s}`},body:o}};class Ir extends pt{constructor(t={}){super(t)}processResponseStream(t){return Sr({stream:t,schema:Rr}).pipeThrough(new TransformStream({async transform(n,s){if(!n.success){s.enqueue({type:"error",errorText:"Stream parsing error"});return}Pr(n.value,s)}}))}}const Pr=(e,t)=>{switch(e.event){case"on_chat_model_start":{switch(e.name){case"chat-respond":{t.enqueue({type:"text-start",id:"1"});break}case"canvas-edit":{t.enqueue({type:"data-markdown",data:{value:e.value,status:"thinking"},id:"1"});break}}break}case"on_chat_model_stream":{switch(e.name){case"chat-respond":{t.enqueue({type:"text-delta",delta:e.value,id:"1"});break}case"canvas-edit":{t.enqueue({type:"data-markdown",data:{value:e.value,status:"streaming"},id:"1"});break}}break}case"on_chat_model_end":switch(e.name){case"chat-respond":{t.enqueue({type:"text-end",id:"1"});break}}break;case"on_tool_end":{switch(e.name){case"canvas-edit":{t.enqueue({type:"data-markdown",data:{value:e.value,status:"review"},id:"1"});break}}break}}};class Ar{prompt;role;parts;constructor(t){this.prompt=t,this.role="user",this.parts=[{type:"text",text:t}]}}const rt=()=>{const t=ht()({from:"/c/$productId"});if(!t)throw new Error("Product ID is available in /c/$productId");return t.productId},_r=({data:e,markdown:t,messageId:n,onApplyAll:s,onCancelAll:o,onReviewDone:a,reviewCount:i})=>{const u=H(),{t:h}=A("main"),v=d.useMemo(()=>e.status==="abort"?"error":"main",[e.status]),g=rt(),k=d.useCallback(()=>{s({markdown:z.from(t).applyAll().markdown,productId:Number(g)})},[t,s,g]),T=d.useCallback(()=>{o({markdown:z.from(t).cancelAll().markdown,productId:Number(g)})},[t,o,g]);return d.useEffect(()=>{e.status==="review"&&i===0&&a(n)},[e.status,i,n,a,e.value,t]),r.jsxs(w,{alignItems:"center",$typo:"Md_16",$color:v,gap:8,children:[e.status==="thinking"&&r.jsxs(r.Fragment,{children:[r.jsx(Z,{size:20}),r.jsx("span",{children:h("chat.status.thinking")})]}),e.status==="streaming"&&r.jsxs(r.Fragment,{children:[r.jsx(Z,{size:20}),r.jsx("span",{children:h("chat.status.streaming")})]}),e.status==="abort"&&r.jsxs(r.Fragment,{children:[r.jsx(Ie,{size:20,color:u.color.error}),r.jsx("span",{children:h("chat.status.abort")})]}),e.status==="review"&&r.jsxs(w,{direction:"column",gap:8,width:"100%",$color:"black",$typo:"Rg_16",children:[r.jsx("span",{children:"수정 사항이 있습니다. 검토를 진행하세요."}),r.jsxs(w,{$borderColor:"borderGray",$borderRadius:"xl",padding:"0 10px 0 12px",$bgColor:"white",height:50,justify:"space-between",alignItems:"center",width:"100%",children:[r.jsxs(w,{alignItems:"center",gap:6,$typo:"Md_15",children:[r.jsx("span",{children:"수정 사항"}),r.jsx(w,{$color:"main",$typo:"Sb_16",children:i})]}),r.jsxs(w,{alignItems:"center",gap:6,children:[r.jsxs(V,{variant:"text",size:"small",onClick:T,children:[i,"개 모두 취소"]}),r.jsxs(V,{variant:"filled",size:"small",onClick:k,children:[i,"개 모두 적용"]})]})]})]}),e.status==="done"&&r.jsxs(r.Fragment,{children:[r.jsx(Oe,{size:20,color:u.color.main}),r.jsx("span",{children:h("chat.status.done")})]})]})},$r=y("div",{target:"e1ar56ry0"})("white-space:pre-wrap;"),Dr=({part:e,message:t})=>r.jsx(w,{justify:t.role==="user"?"flex-end":"flex-start",children:r.jsxs(w,{direction:"column",$borderColor:t.role==="user"?"borderGray":"none",padding:t.role==="user"?12:0,$borderRadius:"lg",$typo:"Rg_16",$bgColor:t.role==="user"?"white":"none",children:[e.state==="streaming"&&t.role==="assistant"&&e.text.length===0&&r.jsx(Z,{size:20}),t.role==="assistant"&&r.jsx(mt,{children:e.text}),t.role==="user"&&r.jsx($r,{children:e.text})]})}),Nr=({onRegenerate:e})=>{const t=H(),{t:n}=A("main"),{sm:s}=_(),o=d.useCallback(()=>{e()},[e]);return r.jsxs(w,{$borderRadius:"xxl",padding:"12px 14px",$bgColor:"errorBg",$borderColor:"error",alignItems:"center",justify:"space-between",$color:"error",$typo:s?"Rg_14":"Md_16",children:[r.jsxs(w,{alignItems:"center",gap:6,children:[r.jsx(gt,{size:s?16:20,color:t.color.error}),n("chat.error.failed")]}),r.jsx(V,{variant:"outlined",size:s?"small":"medium",onClick:o,children:r.jsxs(w,{alignItems:"center",gap:4,children:[r.jsx(ft,{size:s?12:16}),n("chat.error.retry")]})})]})},ke=e=>{e&&(e.scrollTop=e.scrollHeight)},Or=(e,t=!1,n)=>{const s=Ce(a=>{const i=new ResizeObserver(()=>{e&&ke(a)}),u=new MutationObserver(h=>{for(const v of h)v.type==="childList"&&(v.addedNodes.forEach(g=>{g instanceof Element&&i.observe(g)}),v.removedNodes.forEach(g=>{g instanceof Element&&i.unobserve(g)}))});return u.observe(a,{childList:!0}),()=>{i.disconnect(),u.disconnect()}},[e]),o=Ce(a=>{t&&ke(a)},[t,n]);return Ut(s,o)},Lr=y("div",{target:"e1sb8mtl0"})(({theme:e})=>e.typo.Rg_16,"  color:",({theme:e})=>e.color.black,";text-align:start;"),zr=y("div",{target:"eg47rrj0"})("width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;border-radius:12px;border:1px solid ",({theme:e})=>e.color.borderGray,";background-color:",({theme:e})=>e.color.white,";padding:7px 8px 7px 16px;"),Fr=y("span",{target:"eg47rrj1"})(({theme:e})=>e.typo.Md_15,"  color:",({theme:e})=>e.color.black,";");function Br(){const e=H(),{t}=A("main"),n=Ae(),s=le(),{mutate:o,isPending:a}=K({mutationFn:Dt,onSuccess:()=>{s.invalidateQueries(U()),n.open({content:t("chat.marketingAgree.notificationEnabled"),duration:3e3})}}),i=()=>{o({termsAgreements:[{termsCode:"MARKETING_CONSENT",agreed:!0}]})};return r.jsxs(zr,{children:[r.jsxs(w,{alignItems:"center",gap:4,children:[r.jsx(Fr,{children:t("chat.marketingAgree.title")}),r.jsx(yt,{size:16,color:e.color.textPlaceholder})]}),r.jsx(V,{variant:"filled",size:"medium",onClick:i,disabled:a,children:t("chat.marketingAgree.button")})]})}const Vr=y("div",{target:"ehwbk9u0"})("width:100%;border-radius:12px;overflow:hidden;border:1px solid ",({theme:e})=>e.color.borderGray,";"),qr=y("p",{target:"ehwbk9u1"})(({theme:e})=>e.typo.Rg_15,";color:",({theme:e})=>e.color.main,";text-align:center;padding:16px 0 0 0;");function Hr(){const{data:e}=F(U()),{t}=A("main"),n=e.hasProAccess?`https://tally.so/embed/rjD4bM?transparentBackground=1&dynamicHeight=1&hideTitle=1&userId=${e.id}&email=${e.email}`:`https://tally.so/embed/44B8bA?transparentBackground=1&dynamicHeight=1&hideTitle=1&userId=${e.id}&email=${e.email}`;return r.jsxs(Vr,{children:[r.jsx(qr,{children:t("chat.tally.description")}),r.jsx(Nt,{tallyUrl:n})]})}const Ur=({data:e})=>{const t=H(),{t:n}=A("main"),{data:s}=F(U()),o=s?.termsConsents[2].agreed;return r.jsxs(r.Fragment,{children:[e.status==="generating"&&r.jsxs(w,{direction:"column",alignItems:"start",justify:"center",gap:8,children:[r.jsxs(w,{alignItems:"center",$typo:"Md_16",$color:"main",gap:8,children:[r.jsx(Z,{size:20}),r.jsx("span",{children:n("chat.status.documentGenerating")})]}),r.jsx(Lr,{dangerouslySetInnerHTML:{__html:n("chat.status.emailNotification")}}),o?r.jsx(Hr,{}):r.jsx(Br,{})]}),e.status==="done"&&r.jsxs(w,{alignItems:"center",$typo:"Md_16",$color:"main",gap:8,children:[r.jsx(Oe,{size:20,color:t.color.main}),r.jsx("span",{children:n("chat.status.documentDone")})]})]})};class Q{_messages;constructor(t){this._messages=t}get messages(){return this._messages}get lastMessage(){if(this.messages.length===0)throw new Error("No messages");return this.messages[this.messages.length-1]}get isEdited(){return this.lastMessage.parts.some(t=>t.type==="data-markdown"&&t.data.status==="review")}static from(t){return new Q(t)}finishReview(t){return this._messages=this._messages.map(n=>!t||n.id===t?{...n,parts:n.parts.map(s=>s.type==="data-markdown"&&s.data.status==="review"?{...s,data:{...s.data,status:"done"}}:s)}:n),this}finishReviewExceptLastMessage(){return this._messages=[...Q.from(this.messages.slice(0,-1)).finishReview().messages,this.lastMessage],this}abort(){const t=this.lastMessage.parts.map(n=>n.type==="data-markdown"&&n.data.status!=="done"&&n.data.status!=="review"?{...n,data:{...n.data,status:"abort"}}:n.type==="text"&&n.state==="streaming"?{...n,state:"done"}:n);return this._messages=[...this._messages.slice(0,-1),{...this.lastMessage,parts:t}],this}}const Gr=y("div",{target:"e1de3fr60"})("position:relative;padding:1.2px;border-radius:12px;background:",({theme:e})=>e.gradient.blueGlassGradient,";max-width:448px;"),Kr=y("div",{target:"e1de3fr61"})("display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 16px;border-radius:10px;background:",({theme:e})=>e.color.white,";"),Jr=y("div",{target:"e1de3fr62"})(({theme:e})=>e.typo.Sb_18,"  color:",({theme:e})=>e.color.black,";text-align:center;"),Qr=y("div",{target:"e1de3fr63"})(({theme:e})=>e.typo.Rg_16,"  color:",({theme:e})=>e.color.black,";white-space:pre-line;text-align:center;"),Xr=y("p",{target:"e1de3fr64"})(({theme:e})=>e.typo.Sb_18);function Wr(){const{data:e}=F(U()),{t}=A("main"),n=e.role==="FREE";return r.jsxs(r.Fragment,{children:[r.jsx(Gr,{children:r.jsxs(Kr,{children:[r.jsx(Jr,{children:t(n?"chat.noCredit.title.free":"chat.noCredit.title.pro")}),r.jsx(Qr,{children:t(n?"chat.noCredit.description.free":"chat.noCredit.description.pro")}),r.jsx(Le,{children:r.jsx(V,{variant:"filled",size:"medium",width:"100%",onClick:()=>{},children:t(n?"chat.noCredit.button.free":"chat.noCredit.button.pro")})})]})}),n&&r.jsx(Xr,{children:t("chat.noCredit.subTitle")})]})}function de(){const{isMobile:e}=_(),t=rt(),[{data:n},{data:{messages:s}}]=xt({queries:[Y(Number(t)),J(Number(t))]}),{content:o}=n,a=d.useRef(o),i=le(),{mutate:u}=K({mutationFn:({productId:b,chatMessage:c})=>_e(b,{chatMessage:c}),onSuccess:(b,{productId:c})=>{i.invalidateQueries({queryKey:J(Number(c)).queryKey})}}),h=d.useCallback((b,c)=>{i.setQueryData(Y(b).queryKey,{...n,content:c})},[n,i]),v=$e(b=>b.setIds),{mutate:g}=K({mutationFn:({productId:b,markdown:c})=>De(b,c),onMutate:({productId:b,markdown:c})=>{h(b,c)},onSuccess:()=>{v([])}}),k=Et({id:`chat-${t}`,transport:new Ir({api:`/products/${t}/chat/messages:stream`,prepareSendMessagesRequest:Tr}),messages:s,onError:b=>{console.error(b)},onData:({type:b,data:c})=>{switch(b){case"data-markdown":if(c.status==="review"){if(!a.current)throw new Error("Markdown is not found");const m=z.from(a.current).applyAll().markdown,S=z.from(c.value).applyAll().markdown,p=z.from(m).diff(S).markdown;g({productId:Number(t),markdown:p}),h(Number(t),p)}break}},onFinish:({isAbort:b,messages:c})=>{i.invalidateQueries(U());const m=Q.from(c);b&&m.abort(),m.isEdited&&m.finishReviewExceptLastMessage(),u({productId:Number(t),chatMessage:m.messages.map(S=>JSON.stringify(S))})}}),{messages:T,sendMessage:j,status:M,stop:E,error:f,setMessages:l,regenerate:x}=k;Rt(()=>{l(s)},[s,l]);const C=d.useCallback(b=>{const c=Q.from(T).finishReview(b).messages;l(c),u({productId:Number(t),chatMessage:c.map(m=>JSON.stringify(m))})},[l,T,u,t]),D=d.useCallback(b=>{if(f!=null&&l(T.slice(0,-1)),!o)throw new Error("Markdown is not found");a.current=o;const c=z.from(o).applyAll().markdown;j(new Ar(b.prompt),{body:{productContext:c}})},[j,f,l,T,o]),N=d.useCallback(()=>{x({body:{productContext:o}})},[x,o]),O=Or(M==="streaming"||M==="submitted",!0,t),G=d.useMemo(()=>z.from(o??"").getAllDiffNodeIds().length,[o]),$=f?.message?.includes("크레딧이 부족합니다.");return r.jsxs(Xt,{$isMobile:e,children:[r.jsx(Wt,{children:r.jsxs(Yt,{ref:O,children:[T.map(b=>r.jsx(w,{direction:"column",gap:8,children:b.parts.map((c,m)=>{switch(c.type){case"data-document":return r.jsx(Ur,{data:c.data},m);case"data-markdown":return r.jsx(_r,{data:c.data,markdown:o??"",reviewCount:G,messageId:b.id,onReviewDone:C,onApplyAll:g,onCancelAll:g},m);case"text":return r.jsx(Dr,{part:c,message:b},m)}})},b.id)),f&&!$&&r.jsx(Nr,{onRegenerate:N}),$&&r.jsx(d.Suspense,{children:r.jsx(Wr,{})})]})}),o!==null&&r.jsx(Zt,{children:r.jsx(sr,{onSubmit:D,chatStatus:M,stop:E})})]})}const nt=y("div",{target:"e1y05qfv0"})("min-height:100%;width:",({$isSm:e})=>e?"100%":"768px",";position:relative;width:fit-content;.pagedjs_page{border:1px solid #b5b9c4;margin-bottom:",({$isSm:e})=>e?"10px":"20px",";box-shadow:0px 4px 12px 0px #001b371a;background-color:",({theme:e})=>e.color.white,";}"),Yr=y("div",{target:"e1y05qfv1"})("position:absolute;height:100%;width:100%;pointer-events:auto;z-index:0;isolation:isolate;z-index:10;"),Zr=y("div",{target:"e1y05qfv3"})("position:sticky;z-index:1;top:30%;transform:",({$isSm:e})=>e?"translateY(100%)":"translateY(150%)",";width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:9px;h2{",({theme:e,$isSm:t})=>t?e.typo.Sb_16:e.typo.Sb_24,"    color:",({theme:e})=>e.color.black,";}p{",({theme:e,$isSm:t})=>t?e.typo.Rg_12:e.typo.Md_15,"    color:",({theme:e})=>e.color.black,";}"),en=y("div",{target:"e1y05qfv4"})("position:relative;display:flex;flex-direction:column;"),tn=y("div",{target:"e1y05qfv5"})("width:",({$isSm:e})=>e?"100%":"768px",";height:",({$isSm:e})=>e?"480px":"1150px",";padding:",({$isSm:e})=>e?"30px":"75px",";background-color:",({theme:e})=>e.color.white,";border:1px solid #b5b9c4;margin-bottom:",({$isSm:e})=>e?"10px":"20px",";box-shadow:0px 4px 12px 0px #001b371a;display:flex;flex-direction:column;gap:",({$isSm:e})=>e?"6px":"9px",";"),ae=(e,t,n)=>{const s=v=>typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(v):v.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g,"\\$1"),o=d.useRef(null),a=d.useRef(null),i=d.useRef(!1),{sm:u}=_(),h=Ot(async()=>{const v=u?.45:1,g=u?"345.6px":"768px",k=u?"517.5px":"1150px",j=Math.round((u?10:20)*3.7795275591),M=u?"10px":"16px",E=Number.parseFloat(g),f=Number.parseFloat(k),l=a.current,x=o.current;if(!l||!x||!l.innerHTML.trim())return;const C=x.closest('[data-canvas-scroll-container="true"]'),D=i.current;i.current=!1;const N=C?.scrollTop??0,O=x.getBoundingClientRect().height;O>0&&(x.style.minHeight=`${Math.ceil(O)}px`);const G=c=>{const m=window.document.createElement("div");m.className="pagedjs_page",m.id=`page-${c}`,m.dataset.pageNumber=String(c),m.style.width=`${E}px`,m.style.height=`${f}px`,m.style.position="relative",m.style.boxSizing="border-box",m.style.fontSize=M,m.style.overflow="hidden";const S=window.document.createElement("div");S.className="pagedjs_page_content",S.style.position="absolute",S.style.left=`${j}px`,S.style.right=`${j}px`,S.style.top=`${j}px`,S.style.bottom=`${j+24}px`,S.style.overflow="hidden";const p=window.document.createElement("div");return p.className="pagedjs_page_footer",p.style.position="absolute",p.style.left="0",p.style.right="0",p.style.bottom=`${Math.max(6,Math.floor(j*.35))}px`,p.style.textAlign="center",p.style.fontSize=u?"10px":"12px",p.style.color="#6F7580",p.textContent=`- ${c} -`,m.appendChild(S),m.appendChild(p),{page:m,content:S}},$=c=>c.nodeType!==Node.TEXT_NODE?!0:(c.textContent??"").trim().length>0,b=()=>{const c=window.document.createElement("div");for(const R of Array.from(l.childNodes))c.appendChild(R.cloneNode(!0));const m=[];let S=c;for(;;){const R=Array.from(S.childNodes).filter($);if(R.length!==1)break;const I=R[0];if(!(I instanceof HTMLElement))break;const X=I.cloneNode(!1);u&&m.length===0&&(X.style.height="auto"),m.push(X),S=I}let p=Array.from(S.childNodes).filter($);if(p.length===0&&l.innerHTML.trim().length>0){const R=window.document.createElement("div");for(const I of Array.from(l.childNodes))R.appendChild(I.cloneNode(!0));return p=[R],{wrapperTemplates:[],blocks:p}}return{wrapperTemplates:m,blocks:p}};try{x.innerHTML="";const{wrapperTemplates:c,blocks:m}=b();if(m.length===0){x.dispatchEvent(new CustomEvent("pagedjs-rendered"));return}let S=1,p=G(S++),R=p.content;if(c.length>0)for(const L of c){const P=L.cloneNode(!1);R.appendChild(P),R=P}x.appendChild(p.page);const I=()=>{const L=p.content.clientHeight||f-j*2-24;return v<1?L/v:L},X=()=>{for(let P=0;P<6;P+=1){const ee=I(),W=p.content.scrollHeight-(ee+1);if(W<=0)return!0;const ue=p.page.getBoundingClientRect().height||Number.parseFloat(p.page.style.height)||f,pe=v<1?W*v:W;p.page.style.height=`${Math.ceil(ue+pe+2)}px`}return p.content.scrollHeight<=I()+1};for(const L of m){const P=L.cloneNode(!0);R.appendChild(P);const ee=I();if(!(p.content.scrollHeight>ee+1))continue;if(R.removeChild(P),R.childNodes.length>0&&(p=G(S++),x.appendChild(p.page),R=p.content,c.length>0))for(const he of c){const me=he.cloneNode(!1);R.appendChild(me),R=me}R.appendChild(P),p.content.scrollHeight>I()+1&&(X()||(p.content.style.overflow="visible"))}x.dispatchEvent(new CustomEvent("pagedjs-rendered")),C&&!D&&requestAnimationFrame(()=>{C.scrollTop=N,window.setTimeout(()=>{C.scrollTop<N-2&&(C.scrollTop=N)},120)})}finally{x.style.minHeight=""}},500);return d.useEffect(()=>{const v=a.current,g=o.current;if(!v)return;n?.blur&&g?(g.style.filter="blur(8px)",g.style.webkitFilter="blur(8px)"):g&&(g.style.filter="",g.style.webkitFilter="");const k=new MutationObserver(()=>h());return k.observe(v,{childList:!0,subtree:!0,characterData:!0}),h(),()=>{k.disconnect(),h.cancel()}},[e,h,n?.blur]),d.useEffect(()=>{const v=o.current,g=a.current;if(!v||!g)return;const k=j=>{const M=j.target,E=M.closest('button[id$="-apply"], button[id$="-cancel"]');if(E?.id){j.preventDefault(),i.current=!0,g.querySelector(`button#${s(E.id)}`)?.click();return}const f=M.closest(".popover-trigger-wrapper");if(f){const l=f.querySelector("button[id]");if(l&&(M===l||l.contains(M))){j.preventDefault(),j.stopPropagation();const x=f.classList.contains("active");if(f.classList.toggle("active"),!x)requestAnimationFrame(()=>{const C=f.querySelector(".popover-content");if(!C||!f.classList.contains("active"))return;const D=C.style.display;C.style.display="flex",C.style.visibility="hidden";const N=C.getBoundingClientRect(),O=f.getBoundingClientRect(),$=window.innerHeight-O.bottom,b=O.top;N.height+8>$&&b>$?C.classList.add("bottom"):C.classList.remove("bottom"),C.style.display=D,C.style.visibility=""});else{const C=f.querySelector(".popover-content");C&&C.classList.remove("bottom")}return}}},T=j=>{const M=j.target,E=M.closest(".popover-trigger-wrapper"),f=M.closest(".popover-content");!E&&!f&&v.querySelectorAll(".popover-trigger-wrapper.active").forEach(l=>{l.classList.remove("active")})};return v.addEventListener("click",k),window.document.addEventListener("click",T),()=>{v.removeEventListener("click",k),window.document.removeEventListener("click",T)}},[]),{contentRef:o,previewRef:a}},Me=`
<ComposedChartComponent>{"title":"국내 양식/파스타 밀키트 시장 성장 추이","labels":["2021","2022","2023","2024","2025"],"datasets":[{"key":"시장규모","label":"시장 규모","type":"bar","unit":"억 원","data":[3200.5,3800.2,4300.8,4750.5,5000]}]}</ComposedChartComponent>

### [**시장/정책: HMR 산업의 구조적 성장과 푸드테크 발전**]
1. 시장/정책적 요인
- HMR 산업의 지속적인 성장
- 온라인 유통 채널의 다변화
- 푸드테크 스타트업의 부상

2. 기술/환경적 요인
- 첨단 식품 가공 기술
- 친환경 패키징 기술
- 스마트 키친 가전 보급

3. 고객/수요 요인
- 가치 소비 트렌드
- 경험 중시 문화
- 건강과 재료에 대한 관심 증대
# 2. 실현 가능성 (Solution)
---
## 2-1. 솔루션 개요
### [셰프의 레시피를 당신의 주방으로: 실패 없는 까르보나라 경험]
- **표준화된 셰프의 레시피**: 수십 번의 테스트를 거쳐 완성된 최적의 재료 배합과 조리 순서를 제공하여, 요리 초보자도 불 조절이나 타이밍 실수 없이 완벽한 까르보나라를 만들 수 있도록 함.
- **엄선된 핵심 재료 올인원 키트**: 이탈리아산 관찰레, 페코리노 로마노 치즈, 브론즈 다이스 파스타면 등 구하기 어려운 핵심 재료들을 1인분씩 소분하여 제공, 재료 준비의 번거로움과 낭비를 없앰.
- **크림 없이 구현한 정통의 맛**: 신선한 무항생제 계란 노른자와 치즈, 관찰레 기름만으로 만드는 정통 로마식 레시피를 적용하여, 느끼함 없이 고소하고 깊은 풍미를 극대화함.
- **15분 완성 초간편 조리 과정**: 꼭 필요한 재료 손질을 모두 마친 상태로 제공, 복잡한 과정 없이 15분 만에 레스토랑급 요리를 완성하여 시간과 에너지를 획기적으로 절약함.

### [가치 전달 프로세스]
- 밀키트 주문 및 배송
- 재료 확인 및 조리 준비
- 가이드에 따른 15분 조리
- 레스토랑급 까르보나라 완성

<Mermaid>
flowchart LR
A[밀키트 주문 및 배송] --> B[재료 확인 및 조리 준비]
B --> C[가이드에 따른 15분 조리]
C --> D[레스토랑급 까르보나라 완성]
</Mermaid>

## 2-2. 핵심 기능
- **정통 이탈리안 재료 패키지**: 이탈리아산 관찰레, 페코리노 로마노 치즈, 세몰리나 듀럼밀 100% 브론즈 다이스 파스타면 등 현지의 맛을 내는 핵심 재료만을 엄선하여 제공함.
- **셰프의 황금 비율 소스**: 무항생제 계란 노른자와 페코리노 로마노 치즈, 흑후추를 최적의 비율로 배합한 소스를 별도 포장하여 제공, 소스 농도 조절의 실패 확률을 원천 차단함.
- **QR코드 동영상 가이드**: 각 조리 단계별 상세한 설명을 담은 동영상 가이드를 QR코드로 제공하여, 요리 초보자도 쉽게 따라 할 수 있도록 지원함.
- **1인분 최적화 포장**: 모든 재료를 1인분 기준으로 정량 소분 포장하여, 재료가 남거나 부족할 걱정 없이 합리적인 소비가 가능하도록 함.
- **친환경 패키지**: 재활용이 가능한 종이 포장재와 생분해성 플라스틱을 사용하여 환경에 미치는 영향을 최소화함.
## 2-3. 기대 효과
### [요리하는 즐거움의 발견]
- 더 이상 레시피를 찾아 헤맬 필요 없음
- 요리 실패에 대한 두려움 해소
- 나도 셰프가 될 수 있다는 자신감 획득
- 가족, 친구에게 멋진 요리를 대접하는 뿌듯함

### [시간과 비용의 혁신적인 절약]
- 장보기, 재료 손질, 설거지 시간의 획기적인 단축
- 외식 대비 50% 이상 저렴한 비용
- 불필요한 식재료 낭비 방지
- 남는 시간을 온전히 나를 위해 활용

### [미식 경험의 일상화]
- 레스토랑에 가지 않아도 즐기는 현지의 맛
- 언제 어디서든 보장된 품질의 식사 가능
- 평범한 하루를 특별하게 만드는 미식 경험
- 음식에 대한 새로운 지식과 즐거움 발견
## 2-4. 진행 현황 및 구체화 계획
### [제품 개발 및 생산 안정화]
- 정통 까르보나라 레시피 최종 확정
- 핵심 원재료 공급망 확보
- HACCP 인증 생산 시설 계약 및 초도 물량 생산

### [브랜드 론칭 및 초기 시장 진입]
- 브랜드 아이덴티티 및 패키지 디자인 개발
- 자사몰(D2C) 웹사이트 및 SNS 채널 구축
- 온라인 론칭 및 인플루언서 협업 마케팅 진행

### [판매 채널 확장 및 고객 피드백 수집]
- 주요 온라인 식품 플랫폼 입점
- 고객 만족도 조사 및 제품 개선 데이터 수집
- 구독 서비스 모델 개발 및 베타 테스트

### [제품 라인업 강화 및 시장 점유율 확대]
- 까르보나라 외 신규 파스타 밀키트 2종 출시
- 오프라인 채널(백화점, 프리미엄 마켓) 입점 추진

| 항목이름 | 항목 설명 | 기간 |
| --- | --- | --- |
| 정통 까르보나라 레시피 최종 확정 | 이탈리안 셰프 자문을 통해 최종 레시피를 확정하고, 대량생산을 위한 표준 조리 공정 매뉴얼을 개발함. | 2025-10-15 ~ 2025-11-14 |
| 핵심 원재료 공급망 확보 | 관찰레, 페코리노 로마노 치즈 등 핵심 재료의 안정적인 수급을 위해 이탈리아 현지 및 국내 수입사와 공급 계약을 체결함. | 2025-11-15 ~ 2025-12-14 |
| HACCP 인증 생산 시설 계약 | 안전하고 위생적인 제품 생산을 위해 HACCP 인증을 받은 식품 제조 시설과 OEM 계약을 체결함. | 2025-12-15 ~ 2026-01-14 |
| 브랜드 아이덴티티 및 패키지 디자인 개발 | 프리미엄 제품의 가치를 담은 브랜드 로고, 패키지 디자인을 확정하고 친환경 포장재를 발주함. | 2026-01-15 ~ 2026-02-14 |
| 자사몰(D2C) 웹사이트 구축 | 제품 판매 및 고객 관리를 위한 자체 온라인 쇼핑몰을 개발하고 결제 시스템을 연동함. | 2026-02-15 ~ 2026-03-14 |
| 초도 물량 생산 및 품질 검수 | 자사몰 론칭을 위한 초도 물량 1,000개를 생산하고, 최종 품질 검수를 진행함. | 2026-03-15 ~ 2026-04-14 |
| 온라인 론칭 및 인플루언서 마케팅 | 자사몰을 통해 제품을 공식 론칭하고, 푸드 전문 인플루언서와 협업하여 초기 인지도를 확보함. | 2026-04-15 ~ 2026-05-14 |
| 주요 온라인 식품 플랫폼 입점 | 마켓컬리, 쿠팡 등 주요 온라인 식품 유통 채널에 입점하여 판매 채널을 다각화함. | 2026-05-15 ~ 2026-06-14 |
| 고객 피드백 기반 제품 개선 | 구매 고객 대상 설문조사 및 리뷰 분석을 통해 제품의 맛, 구성, 가격 등에 대한 피드백을 수집하고 개선점을 도출함. | 2026-06-15 ~ 2026-07-14 |
| 신규 파스타 밀키트 2종 개발 착수 | 고객 데이터 분석을 바탕으로 알리오 올리오, 카초 에 페페 등 후속 제품 개발에 착수함. | 2026-07-15 ~ 2026-08-14 |
## 2-5. 경쟁 우위 분석
### [경쟁 환경 분석]
| 항목/서비스 | 자사 서비스 | 경쟁사 |
| --- | --- | --- |
| 정통성 구현 수준 | 크림 없이 계란 노른자와 치즈만으로 맛을 내는 로마 정통 방식을 완벽히 구현함. | 대중적인 입맛을 고려하여 크림을 베이스로 한 레시피가 다수임. / 유명 셰프나 레스토랑과 협업한 RMR 제품으로 정통성을 일부 구현함. / 한국인의 입맛에 맞게 변형된 퓨전 스타일의 레시피가 주를 이룸. |
| 조리 편의성 | 셰프의 레시피와 소분된 재료로 15분 내외 조리가 가능하여 편의성이 매우 높음. | 재료 손질이 대부분 되어 있어 조리가 간편한 편임. / 다양한 메뉴를 제공하나, 조리 과정이 다소 복잡한 제품도 있음. / 조리 편의성은 높으나, 정형화된 공정으로 요리의 재미는 다소 부족함. |
| 재료의 신선도 및 품질 | 이탈리아산 관찰레, 페코리노 로마노 치즈 등 최상급 수입 식재료를 사용함. | 대중적인 식재료를 사용하여 품질은 보통 수준임. / 협력사 레시피에 따라 재료 품질의 편차가 존재함. / CJ의 유통망을 활용하여 신선한 재료를 공급받으나, 특수 식재료는 부족함. |
| 가격 경쟁력 | 프리미엄 제품군에 속하지만, 외식 대비 50% 이상 저렴하여 합리적임. | 다양한 가격대의 제품 라인업을 갖추고 있어 가격 경쟁력이 높음. / RMR 제품의 경우 가격대가 다소 높은 편임. / 대량 생산을 통해 합리적인 가격대를 유지하고 있음. |
| 타겟 고객 적합도 | 미식 경험을 중시하고 정통의 맛을 추구하는 2040 고객에게 최적화됨. | 요리 초보자 및 대중적인 맛을 선호하는 가족 단위 고객에게 적합함. / 새로운 미식 경험을 원하는 2030 고객층을 주로 공략함. / 간편한 한 끼 식사를 원하는 모든 연령대의 고객을 타겟으로 함. |
## 차별화된 경쟁력
### [우리가 아니면 맛볼 수 없는 단 하나의 경험]
- **크림 'ZERO', 진짜 로마의 맛**: 시중의 크림 파스타와는 차원이 다른, 계란 노른자와 치즈, 관찰레의 풍미가 어우러진 진짜 까르보나라를 구현함. 이는 단순한 맛의 차이를 넘어, 고객에게 새로운 미식의 기준을 제시하는 경험임.
- **셰프의 노하우를 담은 '실패 제로' 레시피**: 수십 번의 테스트를 거친 황금 비율 소스와 동영상 가이드는 요리 경험이 전무한 고객도 셰프의 결과물을 만들 수 있도록 보장함. 고객은 요리의 즐거움과 성취감을 동시에 느낄 수 있음.
- **타협 없는 재료 퀄리티**: 까르보나라의 맛을 결정하는 핵심 재료인 관찰레와 페코리노 로마노 치즈는 이탈리아 현지에서 직접 공수한 최상급 제품만을 고집함. 이는 맛에 대한 우리의 확고한 철학을 보여줌.
- **가치 소비를 위한 'All-in-One' 키트**: 구하기 어려운 재료들을 찾아 헤맬 필요 없이, 1인분에 맞춰 낭비 없이 제공되는 구성은 고객의 시간과 비용을 모두 아껴줌. 이는 단순한 제품 구매를 넘어선 합리적이고 똑똑한 소비 경험임.
### [포지셔닝 맵]
<PositioningMap>{"title":"프리미엄 파스타 밀키트 시장 포지셔닝 맵","negativeXName":"대중적/퓨전 스타일","positiveXName":"전문적/정통 스타일","negativeYName":"낮은 조리 편의성","positiveYName":"높은 조리 편의성","data":[{"name":"진짜 까르보나라","x":8,"y":9},{"name":"마이셰프","x":-7,"y":7},{"name":"프레시지","x":5,"y":-5},{"name":"CJ 쿡킷","x":-8,"y":8}]}</PositioningMap>
# 3. 성장 전략 (Scale-up)
---
## 3-1. 비즈니스 모델
### [수익모델]
**프리미엄 밀키트 직접 판매**<Mermaid>
flowchart LR
CUSTOMER[고객]
ITEM[까르보나라]
PAYMENT[결제 시스템]
CUSTOMER -- 밀키트 주문 --> ITEM
ITEM -- 결제 요청 --> PAYMENT
PAYMENT -- 결제 완료 --> ITEM
ITEM -- 상품 배송 --> CUSTOMER

</Mermaid>

- 자사 온라인 쇼핑몰을 통해 최종 소비자에게 직접 프리미엄 까르보나라 밀키트를 판매하는 비즈니스 모델임.
- 소비자는 집에서 간편하게 레스토랑 수준의 맛을 즐기고 싶어함.
- 공식 웹사이트와 소셜 미디어를 통해 제품의 가치를 알리고, 온라인 주문 및 결제를 통해 직접 판매함.
- 매출이 개별 거래 단위로 발생하여, 초기 고객 데이터 확보 및 시장 반응 분석에 유리함.

**정기 구독 서비스**<Mermaid>
flowchart LR
SUBSCRIBER[구독 고객]
ITEM[까르보나라]
SUBSCRIBER -- 구독 신청 --> ITEM
ITEM -- 정기 결제 및 배송 --> SUBSCRIBER
SUBSCRIBER -- 구독료 납부 --> ITEM

</Mermaid>

- 고객이 정기적으로 제품을 배송받는 대가로 월간 또는 연간 구독료를 지불하는 모델임.
- 매번 주문해야 하는 번거로움을 줄이고, 꾸준히 고품질의 식사를 즐기고 싶어함.
- 웹사이트 내 구독 전용 페이지를 통해 신청하며, 자동 결제 및 정기 배송 서비스를 제공함.
- 반복 매출(Recurring Revenue)을 통해 안정적이고 예측 가능한 수익 구조를 확보할 수 있음.

**기업 및 리테일 제휴**<Mermaid>
flowchart LR
PARTNER[제휴 기업]
ITEM[까르보나라]
ENDUSER[최종 소비자]
PARTNER -- 대량 주문 --> ITEM
ITEM -- 제품 공급 --> PARTNER
PARTNER -- 상품 판매 및 제공 --> ENDUSER

</Mermaid>

- 기업 특식, 복지몰, 프리미엄 리테일 채널 등에 대량으로 제품을 공급하는 B2B 모델임.
- 제휴사는 직원 복지나 고객 유치를 위해 차별화되고 품질 좋은 상품을 필요로 함.
- 영업 및 제안을 통해 파트너십을 체결하고, 맞춤형 구성 또는 대량 패키지로 제품을 공급함.
- 건당 거래 규모가 크고 계약 기반으로 진행되어, 장기적으로 안정적인 매출 확보가 가능함.
### 가격 전략
| 수익모델 | 과금 기준 | 과금 구조 |
| --- | --- | --- |
| 프리미엄 밀키트 직접 판매 | 밀키트 1세트 (2인분 기준) | 단품 판매. 2인분, 4인분 옵션 제공으로 고객 선택의 폭을 넓힘. |
| 정기 구독 서비스 | 월 구독료 | 주 1회 또는 2주 1회 배송 플랜 제공. 구독 기간(3개월/6개월)에 따른 추가 할인 적용. |
| 기업 및 리테일 제휴 | 기업별 최소 주문 수량(MOQ) 단위 | 최소주문수량(MOQ) 이상 주문 시, 주문량 규모에 따라 가격을 차등 적용하는 볼륨 디스카운트(Volume Discount) 방식. |
## 3-2. 사업화 전략
### [북극성 지표]

**월간 활성 구독자 수 (Monthly Active Subscribers)**
단순 매출을 넘어, 고객이 우리 브랜드에 얼마나 깊이 관여하고 있는지를 보여주는 핵심 지표임. 안정적인 구독자 기반은 예측 가능한 반복 매출을 발생시켜 비즈니스의 지속가능성을 증명하고, 이는 기업가치 평가에도 긍정적인 영향을 미침.

### [타겟 고객]

**2040 직장인 및 아이가 있는 맞벌이 가구**
- 바쁜 일상으로 요리할 시간이 절대적으로 부족함.
- 배달 음식의 반복되는 메뉴와 떨어지는 품질에 싫증을 느낌.
- 집에서도 레스토랑처럼 특별하고 맛있는 식사를 즐기고 싶음.

### [포지셔닝 전략]

**단 15분 투자로 로마 현지의 맛을 그대로 재현하는 프리미엄 까르보나라 밀키트**
- 이탈리아산 그라나 파다노 치즈, 판체타, 유기농 계란 등 최고급 식재료만을 고집하여 맛의 차별화를 이룸.
- 화학조미료나 불필요한 첨가물 없이, 신선한 재료 본연의 맛을 살린 건강한 레시피를 제공함.
- 복잡한 조리 과정을 최소화하고, 누구나 15분 안에 레스토랑 수준의 까르보나라를 완성할 수 있는 최적의 사용자 경험을 설계함.

### [마케팅 퍼널]

| 단계 | 채널 | KPI 목표 | 전략 |
| --- | --- | --- | --- |
| Acquisition | 인스타그램, 유튜브, 틱톡 등 비주얼 중심의 소셜 미디어 | 월간 순 방문자(UV) 10만 명 달성, 핵심 콘텐츠 누적 조회수 50만 회 달성 | 유명 셰프 또는 푸드 인플루언서와 협업하여 '15분 레스토랑 챌린지'와 같은 바이럴 콘텐츠를 제작하고, 시즐(Sizzle) 광고 캠페인을 통해 잠재 고객의 시각과 미각을 자극함. |
| Activation | 자사몰(웹사이트) 및 모바일 앱 | 신규 방문자 구매 전환율 5% 달성, 첫 구매 경험 만족도 90% 이상 기록 | 첫 구매 고객에게 20% 할인 쿠폰 및 무료 배송 혜택을 제공하고, 누구나 쉽게 따라 할 수 있는 고품질의 조리법 안내 영상(튜토리얼)을 제공하여 긍정적인 첫 경험을 유도함. |
| Retention | 이메일 뉴스레터, 카카오톡 알림톡 | 기존 고객 재구매율 40% 달성, 단품 구매 고객의 구독 전환율 15% 달성 | 고객의 구매 주기를 분석하여 개인화된 재구매 유도 메시지를 발송하고, 구독자에게만 제공되는 신메뉴 선공개 및 독점 혜택을 통해 충성도를 높임. |
| Revenue | 자사몰 내 구독 신청 페이지 | 월간 활성 구독자 수 1,000명 확보, 전체 매출 중 구독 비중 30% 달성 | 단순 반복 구매가 아닌, 구독 전용 메뉴, 맞춤형 식단 제안 등 추가적인 가치를 제공하는 '프리미엄 구독 모델'을 설계하여 객단가(ARPU) 및 LTV를 극대화함. |
| Referral | 친구 추천 프로그램 (Referral Program) | 바이럴 계수(K-factor) 0.2 달성, 추천을 통한 신규 가입 비중 10% 달성 | 기존 고객이 친구에게 추천할 경우, 추천인과 피추천인 모두에게 즉시 사용 가능한 적립금 또는 할인 쿠폰을 지급하여 자발적인 바이럴 마케팅을 활성화함. |
## 글로벌 진출 전략
### [글로벌 진출의 필요성 및 기회]

- K-푸드 세계화 트렌드: 전 세계적으로 불고 있는 K-푸드 및 한식의 인기는 까르보나라와 같은 퓨전 메뉴에도 긍정적 영향을 미쳐, 한국의 프리미엄 브랜드에 대한 높은 관심으로 이어짐.
- 고품질 간편식 시장의 성장: 건강과 편의성을 동시에 추구하는 글로벌 소비자 트렌드에 따라, 고품질의 식재료를 사용한 간편식(HMR) 시장이 빠르게 성장하고 있음.
- 온라인 D2C 모델의 확장성: 국내에서 검증된 D2C(Direct-to-Consumer) 모델은 중간 유통 없이 직접 고객과 소통하며 브랜드를 알릴 수 있어, 초기 해외 시장 진출에 효과적임.

### [진출 국가 및 선정 기준]

| 국가 | 선정 기준 | 설명 |
| --- | --- | --- |
| 미국, 캐나다 | 높은 1인당 GDP 및 간편식 소비 규모 | 세계 최대 시장이자 다양한 인종이 공존하여 새로운 음식 문화에 개방적이며, D2C 비즈니스 모델이 가장 활성화된 국가임. |
| 싱가포르 | 한류 문화에 대한 높은 수용도 | 동남아 시장 진출의 허브 국가이며, 트렌드에 민감하고 소득 수준이 높아 프리미엄 제품에 대한 수요가 높음. |
| 영국, 프랑스 | 발달된 콜드체인 물류 인프라 | 이탈리아 음식에 대한 이해도가 높고, 온라인 식료품 시장이 발달하여 콜드체인 배송 시스템이 안정적으로 구축되어 있음. |

### [진입 전략 구조]

| 전략 | 실행 방안 |
| --- | --- |
| 1단계: 시장 조사 및 현지화 | 현지 식문화 및 경쟁 환경 리서치, 식품 관련 법규 및 라벨링 규정 검토 |
| 2단계: 온라인 직접 수출 (D2C) | 현지 언어 지원 D2C 웹사이트 구축, 국제 배송이 가능한 콜드체인 물류 파트너십 체결 |
| 3단계: 현지 리테일 채널 입점 | 현지 프리미엄 식료품점 및 백화점 입점 추진, 아마존(Amazon) 등 대형 이커머스 플랫폼 활용 |
| 4단계: 현지 생산 거점 확보 | 현지 OEM/ODM 파트너 발굴을 통한 생산 비용 절감, 판매량 급증 시, 현지 법인 및 생산 시설 설립 검토 |
## 3-3. 마일스톤 및 로드맵
### [3개년 마일스톤]

| 추진 기간 | 추진 내용 | 세부 내용 요약 |
| --- | --- | --- |
| 2026년 상반기 | 초기 시장 안착 및 브랜드 인지도 확보 | 자사몰(D2C) 사이트 오픈 및 결제 시스템 구축, 월간 순 방문자(UV) 10만 명 달성, 초기 구매 전환율 5% 달성 |
| 2026년 하반기 | 구독 모델 활성화 및 재구매율 증대 | 구독 모델 공식 론칭, 월간 활성 구독자(MAS) 1,000명 확보, 기존 고객 재구매율 40% 달성 |
| 2027년 상반기 | 제품 라인업 확장 및 고객 LTV 극대화 | 까르보나라 외 신규 파스타 밀키트 3종 출시, 객단가(ARPU) 10% 상승, 월간 활성 구독자 5,000명 돌파 |
| 2027년 하반기 | 흑자 전환 및 운영 효율화 | 손익분기점(BEP) 달성 및 흑자 전환, 구독 매출 비중 50% 달성, 물류 자동화 시스템 일부 도입 |
| 2028년 상반기 | 글로벌 시장 진출 및 스케일업 | 미국, 싱가포르 등 타겟 국가 D2C 수출 개시, 해외 매출 비중 10% 달성, 월간 활성 구독자 10,000명 돌파 |
| 2028년 하반기 | 안정적 성장 및 해외 시장 확장 | 현지 리테일 채널 입점 및 파트너십 강화, 연간 매출 50억 원 달성, 차기 투자 라운드(Series A) 준비 착수 |
### [1개년 상세 로드맵]

| 추진 기간 | 추진 내용 | 세부 내용 요약 |
| --- | --- | --- |
| 2026년 상반기 | 초기 시장 안착 및 브랜드 인지도 확보 | 자사몰(D2C) 사이트 오픈 및 결제 시스템 구축, 월간 순 방문자(UV) 10만 명 달성, 초기 구매 전환율 5% 달성 |
| 2026년 하반기 | 구독 모델 활성화 및 재구매율 증대 | 구독 모델 공식 론칭, 월간 활성 구독자(MAS) 1,000명 확보, 기존 고객 재구매율 40% 달성 |
| 2027년 상반기 | 제품 라인업 확장 및 고객 LTV 극대화 | 까르보나라 외 신규 파스타 밀키트 3종 출시, 객단가(ARPU) 10% 상승, 월간 활성 구독자 5,000명 돌파 |
| 2027년 하반기 | 흑자 전환 및 운영 효율화 | 손익분기점(BEP) 달성 및 흑자 전환, 구독 매출 비중 50% 달성, 물류 자동화 시스템 일부 도입 |
| 2028년 상반기 | 글로벌 시장 진출 및 스케일업 | 미국, 싱가포르 등 타겟 국가 D2C 수출 개시, 해외 매출 비중 10% 달성, 월간 활성 구독자 10,000명 돌파 |
| 2028년 하반기 | 안정적 성장 및 해외 시장 확장 | 현지 리테일 채널 입점 및 파트너십 강화, 연간 매출 50억 원 달성, 차기 투자 라운드(Series A) 준비 착수 |
### [1개년 상세 로드맵]

| 추진 기간 | 추진 내용 | 세부 내용 요약 |
| --- | --- | --- |
| 2026년 1분기 | 브랜드 론칭 및 초기 고객 확보 | 브랜드 아이덴티티(BI, CI) 확립 및 자사몰(D2C) 웹사이트 오픈, 핵심 타겟 고객 대상 소셜 미디어(인스타그램, 유튜브) 광고 집행, 푸드 인플루언서와 협업하여 초기 바이럴 콘텐츠 제작 및 배포, 월간 순 방문자(UV) 5만 명, 초기 구매 전환율 3% |
| 2026년 2분기 | 고객 경험 최적화 및 구매 전환율 개선 | 고객 피드백 기반의 웹사이트 사용자 경험(UX/UI) 개선, 구매 후기 작성 시 리워드 제공 이벤트 진행, 상세 조리법 안내 및 플레이팅 제안 영상 콘텐츠 제작, 구매 전환율 5% 달성, 고객 만족도 90점 이상 |
| 2026년 3분기 | 재구매 유도 및 고객 관계 강화 | 첫 구매 고객 대상 재구매 유도(Retargeting) 광고 캠페인 실행, 카카오톡 채널을 활용한 CRM(고객 관계 관리) 마케팅 시작, 구매 주기 분석을 통한 개인화된 프로모션 메시지 발송, 재구매율 30% 달성, 카카오톡 채널 친구 수 1만 명 확보 |
| 2026년 4분기 | 정기 구독 모델 출시 및 핵심 고객 록인(Lock-in) | 정기 구독 모델 상세 설계 및 웹사이트 내 기능 개발 완료, 기존 고객 대상 구독 모델 사전 예약 프로모션 진행, 구독자 전용 혜택(예: 신메뉴 선공개) 기획 및 발표, 사전 예약 구독자 500명 확보, 구독 전환율 15% 달성 |
## 3-4. 재무 목표 및 추정
### [매출 가정]

| 항목 | 세부내용 |
| --- | --- |
| 월 평균 유료 고객 수 | 1차년도 월 평균 1,500명의 유료 고객을 확보하고, 3차년도까지 8,000명으로 확대하는 것을 목표로 함. |
| 객단가(ARPPU) | 구독 모델 할인 및 프로모션을 고려하여 1인당 월 평균 구매액(ARPPU)을 50,000원으로 설정함. |
| 연간 목표 매출 | 1차년도 9억 원, 2차년도 25억 원, 3차년도 50억 원의 매출 달성을 목표로 함. |

| 항목 | 세부내용 |
| --- | --- |
| 월 평균 유료 고객 수 | 1차년도 월 평균 1,500명의 유료 고객을 확보하고, 3차년도까지 8,000명으로 확대하는 것을 목표로 함. |
| 객단가(ARPPU) | 구독 모델 할인 및 프로모션을 고려하여 1인당 월 평균 구매액(ARPPU)을 50,000원으로 설정함. |
| 연간 목표 매출 | 1차년도 9억 원, 2차년도 25억 원, 3차년도 50억 원의 매출 달성을 목표로 함. |

### [비용 가정]

| 항목 | 세부내용 |
| --- | --- |
| 매출원가 | 매출액의 45% 수준으로 가정함. (원재료비 35%, 포장비 10%) |
| 인건비 | 초기 5명(셰프 2, 마케터 1, 운영 2)으로 시작하여 3차년도 15명까지 확장 계획을 반영함. |
| 마케팅비 | 초기 시장 진입을 위해 매출액 대비 25% 수준의 공격적인 마케팅 비용을 집행하고, 점진적으로 15%까지 안정화시킴. |
| 지급수수료 | 매출액의 3%로 가정함. (PG 수수료 등) |
| 운반비 | 매출 증가에 따른 물류비 증가를 반영하여 매출액의 5%로 가정함. |
| 임차료 | 중앙 조리 시설(Central Kitchen) 임차료 및 관리비를 연간 6천만 원으로 가정함. |
| 감가상각비 | 초기 투자한 주방 설비에 대한 5년 정액법 상각을 가정함. |

### [단위 경제성]

| 항목 | 세부내용 |
| --- | --- |
| 고객 획득 비용 (CAC) | 콘텐츠 마케팅 및 초기 프로모션 비용을 고려하여 1인당 30,000원으로 가정함. |
| 고객 생애 가치 (LTV) | 평균 구독 유지 기간(6개월)과 월 평균 공헌이익을 기반으로 90,000원으로 추정함. |
| LTV/CAC 비율 | 초기 3배수(3.0x)를 목표로 하며, 마케팅 효율화 및 리텐션 강화를 통해 4배수(4.0x)까지 개선 목표. |
## 3-5. 핵심 재무 지표 시각화

<ComposedChartComponent>{"title":"매출 성장 및 영업이익률 추이","labels":["2026년","2027년","2028년"],"datasets":[{"key":"매출액","label":"매출액","type":"bar","unit":"백만 원","data":[900,2500,5000]},{"key":"영업이익률","label":"영업이익률","type":"line","unit":"%","data":[-15.6,4,10]}]}</ComposedChartComponent>

<ComposedChartComponent>{"title":"비용 구조 변화 추이","labels":["2026년","2027년","2028년"],"datasets":[{"key":"매출원가","label":"매출원가","type":"bar","unit":"백만 원","data":[405,1125,2250]},{"key":"인건비","label":"인건비","type":"bar","unit":"백만 원","data":[300,600,900]},{"key":"마케팅비","label":"마케팅비","type":"bar","unit":"백만 원","data":[225,500,750]}]}</ComposedChartComponent>

<ComposedChartComponent>{"title":"손익분기점(BEP) 분석","labels":["2026년","2027년","2028년"],"datasets":[{"key":"매출액","label":"매출액","type":"line","unit":"백만 원","data":[900,2500,5000]},{"key":"총비용","label":"총비용","type":"line","unit":"백만 원","data":[1040,2400,4100]}]}</ComposedChartComponent>

<ComposedChartComponent>{"title":"단위 경제성 분석","labels":["2026년","2027년","2028년"],"datasets":[{"key":"고객_생애_가치_(ltv)","label":"고객 생애 가치 (LTV)","type":"line","unit":"원","data":[90000,110000,130000]},{"key":"고객_획득_비용_(cac)","label":"고객 획득 비용 (CAC)","type":"line","unit":"원","data":[30000,28000,26000]},{"key":"ltv/cac_비율","label":"LTV/CAC 비율","type":"line","unit":"배","data":[3,3.9,5]}]}</ComposedChartComponent>

<ComposedChartComponent>{"title":"단위 경제성 분석","labels":["2026년","2027년","2028년"],"datasets":[{"key":"고객_생애_가치_(ltv)","label":"고객 생애 가치 (LTV)","type":"line","unit":"원","data":[90000,110000,130000]},{"key":"고객_획득_비용_(cac)","label":"고객 획득 비용 (CAC)","type":"line","unit":"원","data":[30000,28000,26000]},{"key":"ltv/cac_비율","label":"LTV/CAC 비율","type":"line","unit":"배","data":[3,3.9,5]}]}</ComposedChartComponent>

## 3-6. 추정 재무제표
### [추정 손익계산서]

| 구분 | 2026 | 2027 | 2028 |
| --- | --- | --- | --- |
| 매출액 | 900 백만 원 | 2,500 백만 원 | 5,000 백만 원 |
| 매출원가 | 405 백만 원 | 1,125 백만 원 | 2,250 백만 원 |
| 매출총이익 | 495 백만 원 | 1,375 백만 원 | 2,750 백만 원 |
| 판매비와 관리비 | 677 백만 원 | 1,380 백만 원 | 2,130 백만 원 |
| 영업이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |
| 법인세차감전순이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |
| 당기순이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |

| 구분 | 2026 | 2027 | 2028 |
| --- | --- | --- | --- |
| 매출액 | 900 백만 원 | 2,500 백만 원 | 5,000 백만 원 |
| 매출원가 | 405 백만 원 | 1,125 백만 원 | 2,250 백만 원 |
| 매출총이익 | 495 백만 원 | 1,375 백만 원 | 2,750 백만 원 |
| 판매비와 관리비 | 677 백만 원 | 1,380 백만 원 | 2,130 백만 원 |
| 영업이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |
| 법인세차감전순이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |
| 당기순이익 | -182 백만 원 | -5 백만 원 | 620 백만 원 |

### [추정 현금흐름표]

| 구분 | 2026 | 2027 | 2028 |
| --- | --- | --- | --- |
| 영업활동 현금흐름 (CFO) | -140 백만 원 | 100 백만 원 | 500 백만 원 |
| 투자활동 현금흐름 (CFI) | -100 백만 원 | 0 백만 원 | 0 백만 원 |
| 재무활동 현금흐름 (CFF) | 500 백만 원 | 0 백만 원 | 0 백만 원 |
| 현금의 순증가/감소 | 260 백만 원 | 100 백만 원 | 500 백만 원 |
| 기초 현금 | 0 백만 원 | 260 백만 원 | 360 백만 원 |
| 기말 현금 | 260 백만 원 | 360 백만 원 | 860 백만 원 |

### [전략적 시사점]

사업 초기(1차년도)에는 브랜드 인지도 확보와 시장 점유율 확대를 위한 공격적인 마케팅 투자로 영업손실이 발생함. 하지만 매출이 빠르게 성장하며 2차년도에 손익분기점(BEP)에 도달하고, 3차년도부터는 구독 모델 안정화와 운영 효율화를 통해 본격적인 수익 창출 및 안정적인 현금흐름 창출이 가능할 것으로 전망됨. 초기 투자 유치(5억 원)가 1차년도의 현금흐름 안정성에 핵심적인 역할을 함.
## 3-7. 자금 조달 및 사용 계획
### [자금 조달 목표]

- 목표 금액: 500 백만 원
- 자금 조달 방법: 시드 투자 유치 (엔젤 투자자, 초기 단계 전문 벤처캐피탈)
- 투자 목적: 초기 브랜드 인지도 확보, 공격적인 마케TJs을 통한 시장 점유율 확대 및 구독 시스템 고도화를 위한 자금 확보

<DonutChartComponent>{"title":"자금 사용 계획","distribution":[{"category":"마케팅 및 브랜딩","percentage":40},{"category":"운영 자금","percentage":30},{"category":"설비 투자 및 시스템 개발","percentage":20},{"category":"예비비","percentage":10}]}</DonutChartComponent>

- 마케팅 및 브랜딩 (40%): 인지도 확대를 위한 인플루언서 협업, 디지털 광고, 콘텐츠 제작 등
- 운영 자금 (30%): 초기 인력 채용(인건비), 주방 임차료, 관리비 등 안정적인 운영을 위함.
- 설비 투자 및 시스템 개발 (20%): 조리 효율 증대를 위한 주방 설비 투자 및 구독 시스템 고도화
- 예비비 (10%): 예상치 못한 비용 발생에 대비하기 위한 예비 자금
## 3-8. EXIT 전략
### [목표 및 경로]

- 최종 목표: 프리미엄 간편식(HMR) 시장의 선도 기업으로 성장 후, 성공적인 투자금 회수(EXIT) 달성
- 주요 경로: 전략적 투자자(SI)에 의한 M&A. 국내외 대형 식품 기업 또는 대형 유통 플랫폼이 가장 유력한 인수 주체로 판단됨.
- 목표 시기: 설립 5~7년 차. 안정적인 구독자 기반과 지속적인 흑자 구조를 증명하며 기업가치가 극대화된 시점을 목표로 함.

### [잠재적 인수 기업]

- CJ제일제당, 프레시지 등 대형 식품 기업: 프리미엄 밀키트 라인업 강화 및 D2C 채널의 고객 데이터와 운영 노하우 확보 동기
- 쿠팡, 마켓컬리 등 대형 이커머스 플랫폼: 충성도 높은 고객층을 보유한 독점적 PB(Private Brand) 상품 확보 및 신선식품 카테고리 경쟁력 강화 동기
- 네슬레, 다농 등 글로벌 식품 기업: 아시아 시장 진출을 위한 교두보로 활용하고, K-푸드 트렌드에 맞는 고품질 제품 포트폴리오 확보 동기

### [가치 및 극대화]

**목표 기업가치: 300억 원**

**평가 근거:**
- 계산 방식: 3차년도 예상 매출액 50억 원에 고성장 푸드테크 기업에 적용되는 평균 PSR(매출액 대비 기업가치 배수) 6.0x를 적용하여 산출함.
- 근거: 단순 D2C 커머스가 아닌, 높은 록인(Lock-in) 효과를 가진 구독 모델 기반의 IT 기술이 결합된 푸드테크 기업임을 강조함. 또한, K-푸드 트렌드에 힘입은 해외 시장 진출 잠재력과 차별화된 브랜드 가치가 높은 기업가치 평가의 근거임.

**극대화 계획:**
구독자 기반의 구매 데이터를 분석하여 개인화 추천 및 신제품 개발에 활용함으로써 LTV를 극대화함. 또한, 성공적인 해외 D2C 채널 안착을 통해 추가적인 성장 모멘텀을 확보하고, 원가 구조 개선 및 자동화 설비 도입으로 수익성을 강화하여 기업가치를 지속적으로 증대시킬 계획임.
# 4. 팀 (Team)
---
## 4-1. 비전/미션
### [비전]

누구나 자신의 주방에서 최고의 셰프가 되어, 특별한 미식의 즐거움을 일상처럼 누리는 세상을 만듦.

### [미션]

우리는 복잡하고 어려운 요리의 장벽을 허무는 혁신적인 푸드 솔루션을 통해, 시간과 공간의 제약 없이 최상의 미식 경험을 제공함.
## 4-2. 대표자/팀원 프로필
### [테이블 원]

| 이름 | 직위 | 담당 업무 | 보유 역량 | 기여도 |
| --- | --- | --- | --- | --- |
| OOO | 대표 / 제품 총괄 | 사업 전략 수립 및 총괄, 제품 기획 및 레시피 개발, 핵심 원재료 소싱 및 공급망 관리 | 이탈리안 요리 전문성, 푸드 비즈니스 기획, 데이터 기반 의사결정 | 이탈리안 레스토랑 셰프 출신으로, 까르보나라 본연의 맛을 구현하는 핵심 레시피 개발과 제품의 전체적인 방향성을 결정하며, 사업의 미식 철학을 중심에서 이끌어감. |
| OOO | 운영 / 마케팅 총괄 | 온라인 플랫폼(D2C) 구축 및 운영, 디지털 마케팅 전략 수립 및 실행, 고객 데이터 분석 및 관리 | E-commerce 플랫폼 운영, 퍼포먼스 마케팅, CRM 전략 | 푸드 스타트업에서의 성공적인 온라인 론칭 및 성장 경험을 바탕으로, 우리 제품의 디지털 채널 구축과 초기 시장 안착을 위한 데이터 기반 마케팅을 책임짐. |
| OOO | 디자인 / 브랜드 총괄 | 브랜드 아이덴티티(BI/BX) 구축, 제품 패키지 및 상세 페이지 디자인, SNS 콘텐츠 기획 및 제작 | 브랜드 디자인, UX/UI 디자인, 콘텐츠 크리에이션 | 식품 브랜드 디자인 프로젝트 경험을 바탕으로, 제품의 프리미엄 가치를 시각적으로 구현하고 고객에게 일관된 브랜드 경험을 제공하여, 단순한 식품이 아닌 라이프스타일 브랜드로 포지셔닝하는 데 기여함. |
## 4-3. 팀 핵심 역량 및 시너지
### [미식과 비즈니스의 완벽한 조화]

- **제품력: 셰프의 손끝에서 나오는 '진짜'의 가치**: 이탈리안 요리 전문가가 직접 제품 개발을 총괄하여, 맛과 품질에 있어 타협 없는 결과물을 보장함.
- **실행력: 아이디어를 현실로 만드는 '성공'의 경험**: 푸드테크 분야에서 실제 성공 경험을 보유한 마케터가 합류하여, 데이터 기반의 정교한 실행 전략으로 시장에 안착함.
- **브랜딩: 가치를 눈으로 보여주는 '매력'의 디자인**: 제품의 철학을 시각적으로 완벽하게 구현하는 전문 디자이너를 통해, 고객의 마음을 사로잡는 강력한 브랜드를 구축함.

### [하나의 목표를 향한 전문성의 시너지]

- **제품 기획과 브랜딩의 선순환**: 제품 총괄(셰프)이 구현한 맛의 철학을 브랜드 총괄(디자이너)이 시각적 언어로 완벽하게 번역하여 고객에게 전달하고, 이는 다시 제품의 가치를 높이는 선순환 구조를 만들어냄.
- **데이터 기반 제품-마케팅 고도화**: 마케팅 총괄이 수집한 고객 데이터를 제품 총괄에게 전달하여 레시피와 구성을 개선하고, 개선된 제품은 다시 마케팅의 강력한 무기가 되어 시장 반응을 극대화함.
`;function rn(){const e=$e(s=>s.ids),t=d.useRef(0),n=d.useRef(null);return d.useLayoutEffect(()=>{const s=document.querySelector(".pagedjs-preview-area");ge(s??document)},[]),d.useEffect(()=>{const s=document.querySelector(".pagedjs-preview-area");if(!s)return;const o=()=>{n.current&&clearTimeout(n.current),n.current=setTimeout(()=>{ge(s)},50)},a=()=>{o()};s.addEventListener("pagedjs-rendered",a);const i=new MutationObserver(()=>{o()});return i.observe(s,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["id","data-diffwrap"]}),o(),()=>{s.removeEventListener("pagedjs-rendered",a),i.disconnect(),n.current&&clearTimeout(n.current)}},[]),d.useLayoutEffect(()=>{if(t.current===0&&e.length>0){const s=document.querySelector(".pagedjs-preview-area");bt(e[0],{root:s,mode:"instant"})}t.current=e.length},[e.length]),null}function nn({document:e}){const{data:t}=F(U()),n=t.hasProAccess,{isMobile:s}=_();return r.jsx(nt,{id:"markdown-canvas",$isSm:s,children:n?r.jsx(sn,{document:e}):r.jsx(on,{document:e})})}function Ee(){const{sm:e}=_();return r.jsx(nt,{$isSm:e,children:Array.from({length:5}).map((t,n)=>r.jsx(tn,{$isSm:e,children:Array.from({length:2}).map((s,o)=>r.jsxs(w,{width:"100%",gap:e?6:9,direction:"column",children:[r.jsx(fe,{width:"50%",height:e?"10px":"20px",loading:!0}),Array.from({length:e?12:16}).map((a,i)=>r.jsx(fe,{width:"100%",height:e?"10px":"20px",loading:!0},i))]},o))},n))})}function sn({document:e}){const{contentRef:t,previewRef:n}=ae(e);return r.jsxs(r.Fragment,{children:[r.jsx(rn,{}),r.jsx("div",{ref:t,className:"pagedjs-preview-area"}),r.jsx("div",{ref:n,style:{display:"none"},children:r.jsx(te,{children:e})})]})}function on({document:e}){const{contentRef:t,previewRef:n}=ae(e),{contentRef:s,previewRef:o}=ae(Me,void 0,{blur:!0}),{t:a}=A(["creditPlan"]),i=e.split(`
`).slice(0,50).join(`
`),{sm:u}=_();return r.jsxs(r.Fragment,{children:[r.jsx("div",{ref:t,className:"pagedjs-preview-area"}),r.jsx("div",{ref:n,style:{display:"none"},children:r.jsx(te,{children:i})}),r.jsxs(en,{children:[r.jsx("div",{ref:s,className:"pagedjs-preview-blur"}),r.jsx("div",{ref:o,style:{display:"none"},children:r.jsx(te,{children:Me})}),r.jsx(Yr,{children:r.jsxs(Zr,{$isSm:u,children:[r.jsx("h2",{children:a("creditPlan:blurContent.title")}),r.jsx("p",{children:a("creditPlan:blurContent.description")}),r.jsx(w,{justify:"center",alignItems:"center",children:r.jsx(Le,{children:r.jsx(V,{variant:"filled",size:"medium",children:a("creditPlan:blurContent.upgradeButton")})})})]})})]})]})}const an=y("section",{target:"e1n582nl0"})("width:100%;height:100%;display:flex;flex-direction:column;flex:1;min-height:0;"),ie=y("div",{target:"e1n582nl1"})("width:100%;display:flex;align-items:start;min-height:0;background-color:",({theme:e})=>e.color.bgGray,";padding:",({$isMobile:e})=>e?"12px":"30px",";padding-bottom:",({$isMobile:e})=>e?"2px":"10px",";overflow:auto;justify-content:center;"),cn=vt(e=>({value:"left",setValue:t=>e({value:t})}));function Re({data:e}){const{productId:t}=Ne({from:"/_authenticated/c/$productId"}),n=Number(t),s=e.content,o=e.generationStatus,a=le(),{value:i,setValue:u}=cn(),{data:h}=F(J(n)),v=Ae(),{isMobile:g}=_(),{mutate:k,isPending:T}=K({mutationFn:f=>_e(n,{chatMessage:f}),onSuccess:()=>{a.invalidateQueries(J(n)),a.invalidateQueries(wt()),u("right"),v.open({content:`사업계획서가 완성되었습니다!
수정하려면 상단의 '채팅'탭을 눌러 진행하세요.`,duration:2e3})}}),{mutate:j,isPending:M}=K({mutationFn:f=>De(n,f),onSuccess:()=>{const f=h.messages[h.messages.length-1],l=[...h.messages.slice(0,-1),{...f,parts:[...f.parts.map(x=>x.type==="data-document"?{...x,data:{...x.data,status:"done"}}:x),{type:"text",text:ye.t("main:chat.completion.message1")},{type:"text",text:ye.t("main:chat.completion.message2")}]}];k(l.map(x=>JSON.stringify(x)))},onError:f=>{console.error("문서 테이블 패치 실패:",f)}}),E=T||M;return d.useEffect(()=>{if(E||o!=="COMPLETED"||h.messages.length===0||s===null)return;const l=h.messages[h.messages.length-1].parts.find(x=>x.type==="data-document");if(l&&l.data.status==="generating")try{const x=Ct(s);if(!x)return;j(x)}catch(x){console.error("마크다운 테이블 파싱 실패:",x)}},[o,h.messages,E,n,k,s,j]),g?i==="left"?r.jsx(de,{}):r.jsx(ie,{children:r.jsx(Ee,{})}):r.jsx(ie,{children:r.jsx(Ee,{})})}function st(){const{productId:e}=Ne({from:"/_authenticated/c/$productId"}),t=Number(e),{data:n}=F(Y(t)),{data:s}=F(J(t)),{isMobile:o}=_(),i=(s.messages.length>0?s.messages[s.messages.length-1]:null)?.parts.find(u=>u.type==="data-document");if(n.generationStatus==="FAILED")throw new Error("FAILED");return n.generationStatus==="PENDING"||n.generationStatus==="PROGRESS"?r.jsx(Re,{data:n}):n.generationStatus==="COMPLETED"&&i?.data.status==="generating"?r.jsx(Re,{data:n}):r.jsx(an,{$isMobile:o,children:r.jsx(ie,{$isMobile:o,"data-canvas-scroll-container":"true",children:r.jsx(nn,{document:n.content})})})}function _n(){const{isMobile:e}=_(),{productId:t}=jt.useParams(),{data:n}=St({...Y(Number(t)),enabled:!!t}),s=n?.themeColor??"GRAY";return e?r.jsx(xe.Provider,{value:{colorKey:s},children:r.jsx(ln,{})}):r.jsx(Be,{children:r.jsxs(Tt,{direction:"horizontal",children:[r.jsx(be,{defaultSize:40,children:r.jsx(de,{})}),r.jsx(Kt,{}),r.jsx(be,{defaultSize:60,children:r.jsxs(Ve,{children:[r.jsx(ze,{}),r.jsx(xe.Provider,{value:{colorKey:s},children:r.jsx(st,{})})]})})]})})}function ln(){const{t:e}=A("common"),[t,n]=d.useState("left");return d.useEffect(()=>{n("left"),requestIdleCallback(()=>(window.ChannelIO?.("hideMessenger"),window.ChannelIO?.("hideChannelButton"),()=>{window.ChannelIO?.("showChannelButton")}))},[]),r.jsxs(Be,{children:[r.jsx(ze,{}),r.jsx(Gt,{children:r.jsx(Lt,{value:t,onValueChange:s=>{s&&n(s)},leftContent:r.jsxs(w,{direction:"row",gap:4,alignItems:"center",children:[r.jsx(Pt,{size:16,strokeWidth:1.5}),r.jsx("p",{children:e("toggle.chat")})]}),rightContent:r.jsxs(w,{direction:"row",gap:4,alignItems:"center",children:[r.jsx(It,{size:16,strokeWidth:1.5}),r.jsx("p",{children:e("toggle.document")})]})})}),r.jsx(Jt,{$toggleValue:t,children:r.jsxs(Qt,{$toggleValue:t,children:[r.jsx(je,{children:r.jsx(de,{})}),r.jsx(je,{children:r.jsx(Ve,{$isMobile:!0,children:r.jsx(st,{})})})]})})]})}export{_n as component};
