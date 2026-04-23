import{bH as y,bC as M,e5 as Z,aX as d,aZ as j,aY as H,a_ as X,a$ as Y,bh as q,bg as J,b2 as _,b0 as K,bt as Q,bx as ee,bV as te,e6 as ae,b3 as re,bm as ne,bv as ie}from"./index-DFhKk_SS.js";import{p as se}from"./chunk-4BX2VUAB-DHFU7Juy.js";import{p as le}from"./treemap-75Q7IDZK-B-AOFh2F.js";import{d as P}from"./arc-DAm-OEAi.js";import"./_baseUniq-CD49yyar.js";import"./_basePickBy-DkwDcqPd.js";import"./clone-C_gRS2bf.js";try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},a=new e.Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="15770cac-13fb-4c08-9579-8fbe2b95f351",e._sentryDebugIdIdentifier="sentry-dbid-15770cac-13fb-4c08-9579-8fbe2b95f351")})()}catch{}function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=oe,f=null,b=y(0),s=y(M),o=y(0);function l(t){var n,c=(t=Z(t)).length,p,S,m=0,u=new Array(c),i=new Array(c),v=+b.apply(this,arguments),w=Math.min(M,Math.max(-M,s.apply(this,arguments)-v)),h,A=Math.min(Math.abs(w)/c,o.apply(this,arguments)),C=A*(w<0?-1:1),g;for(n=0;n<c;++n)(g=i[u[n]=n]=+e(t[n],n,t))>0&&(m+=g);for(a!=null?u.sort(function(x,D){return a(i[x],i[D])}):f!=null&&u.sort(function(x,D){return f(t[x],t[D])}),n=0,S=m?(w-c*C)/m:0;n<c;++n,v=h)p=u[n],g=i[p],h=v+(g>0?g*S:0)+C,i[p]={data:t[p],index:n,value:g,startAngle:v,endAngle:h,padAngle:A};return i}return l.value=function(t){return arguments.length?(e=typeof t=="function"?t:y(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,f=null,l):a},l.sort=function(t){return arguments.length?(f=t,a=null,l):f},l.startAngle=function(t){return arguments.length?(b=typeof t=="function"?t:y(+t),l):b},l.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:y(+t),l):s},l.padAngle=function(t){return arguments.length?(o=typeof t=="function"?t:y(+t),l):o},l}var de=ie.pie,z={sections:new Map,showData:!1},$=z.sections,F=z.showData,pe=structuredClone(de),ge=d(()=>structuredClone(pe),"getConfig"),fe=d(()=>{$=new Map,F=z.showData,ne()},"clear"),he=d(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);$.has(e)||($.set(e,a),_.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),me=d(()=>$,"getSections"),ve=d(e=>{F=e},"setShowData"),ye=d(()=>F,"getShowData"),R={getConfig:ge,clear:fe,setDiagramTitle:J,getDiagramTitle:q,setAccTitle:Y,getAccTitle:X,setAccDescription:H,getAccDescription:j,addSection:he,getSections:me,setShowData:ve,getShowData:ye},be=d((e,a)=>{se(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),Se={parse:d(async e=>{const a=await le("pie",e);_.debug(a),be(a,R)},"parse")},we=d(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),xe=we,De=d(e=>{const a=[...e.values()].reduce((s,o)=>s+o,0),f=[...e.entries()].map(([s,o])=>({label:s,value:o})).filter(s=>s.value/a*100>=1).sort((s,o)=>o.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),Ae=d((e,a,f,b)=>{_.debug(`rendering pie chart
`+e);const s=b.db,o=K(),l=Q(s.getConfig(),o.pie),t=40,n=18,c=4,p=450,S=p,m=ee(a),u=m.append("g");u.attr("transform","translate("+S/2+","+p/2+")");const{themeVariables:i}=o;let[v]=te(i.pieOuterStrokeWidth);v??=2;const w=l.textPosition,h=Math.min(S,p)/2-t,A=P().innerRadius(0).outerRadius(h),C=P().innerRadius(h*w).outerRadius(h*w);u.append("circle").attr("cx",0).attr("cy",0).attr("r",h+v/2).attr("class","pieOuterCircle");const g=s.getSections(),x=De(g),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let T=0;g.forEach(r=>{T+=r});const G=x.filter(r=>(r.data.value/T*100).toFixed(0)!=="0"),E=ae(D);u.selectAll("mySlices").data(G).enter().append("path").attr("d",A).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(G).enter().append("text").text(r=>(r.data.value/T*100).toFixed(0)+"%").attr("transform",r=>"translate("+C.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const N=[...g.entries()].map(([r,I])=>({label:r,value:I})),k=u.selectAll(".legend").data(N).enter().append("g").attr("class","legend").attr("transform",(r,I)=>{const O=n+c,V=O*N.length/2,B=12*n,U=I*O-V;return"translate("+B+","+U+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const L=Math.max(...k.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),W=S+t+n+c+L;m.attr("viewBox",`0 0 ${W} ${p}`),re(m,p,W,l.useMaxWidth)},"draw"),Ce={draw:Ae},ze={parser:Se,db:R,renderer:Ce,styles:xe};export{ze as diagram};
