import{aX as l,aY as _,aZ as S,bh as k,bg as D,a_ as R,a$ as E,bx as F,bm as G,bt as b,bu as $,bv as P,b2 as z,bO as V}from"./index-DFhKk_SS.js";import{p as W}from"./chunk-4BX2VUAB-DHFU7Juy.js";import{p as B}from"./treemap-75Q7IDZK-B-AOFh2F.js";import"./_baseUniq-CD49yyar.js";import"./_basePickBy-DkwDcqPd.js";import"./clone-C_gRS2bf.js";try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="50605806-22d8-48a7-bf2d-5414203019c1",e._sentryDebugIdIdentifier="sentry-dbid-50605806-22d8-48a7-bf2d-5414203019c1")})()}catch{}var m={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w={axes:[],curves:[],options:m},h=structuredClone(w),H=P.radar,j=l(()=>b({...H,...$().radar}),"getConfig"),C=l(()=>h.axes,"getAxes"),X=l(()=>h.curves,"getCurves"),Y=l(()=>h.options,"getOptions"),Z=l(e=>{h.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),N=l(e=>{h.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:U(t.entries)}))},"setCurves"),U=l(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(n=>n.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),q=l(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});h.options={showLegend:t.showLegend?.value??m.showLegend,ticks:t.ticks?.value??m.ticks,max:t.max?.value??m.max,min:t.min?.value??m.min,graticule:t.graticule?.value??m.graticule}},"setOptions"),J=l(()=>{G(),h=structuredClone(w)},"clear"),f={getAxes:C,getCurves:X,getOptions:Y,setAxes:Z,setCurves:N,setOptions:q,getConfig:j,clear:J,setAccTitle:E,getAccTitle:R,setDiagramTitle:D,getDiagramTitle:k,getAccDescription:S,setAccDescription:_},K=l(e=>{W(e,f);const{axes:t,curves:a,options:r}=e;f.setAxes(t),f.setCurves(a),f.setOptions(r)},"populate"),Q={parse:l(async e=>{const t=await B("radar",e);z.debug(t),K(t)},"parse")},tt=l((e,t,a,r)=>{const n=r.db,o=n.getAxes(),i=n.getCurves(),s=n.getOptions(),c=n.getConfig(),d=n.getDiagramTitle(),p=F(t),u=et(p,c),g=s.max??Math.max(...i.map(y=>Math.max(...y.entries))),x=s.min,v=Math.min(c.width,c.height)/2;at(u,o,v,s.ticks,s.graticule),rt(u,o,v,c),M(u,o,i,x,g,s.graticule,c),T(u,i,s.showLegend,c),u.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),et=l((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,n={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${n.x}, ${n.y})`)},"drawFrame"),at=l((e,t,a,r,n)=>{if(n==="circle")for(let o=0;o<r;o++){const i=a*(o+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if(n==="polygon"){const o=t.length;for(let i=0;i<r;i++){const s=a*(i+1)/r,c=t.map((d,p)=>{const u=2*p*Math.PI/o-Math.PI/2,g=s*Math.cos(u),x=s*Math.sin(u);return`${g},${x}`}).join(" ");e.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),rt=l((e,t,a,r)=>{const n=t.length;for(let o=0;o<n;o++){const i=t[o].label,s=2*o*Math.PI/n-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),e.append("text").text(i).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function M(e,t,a,r,n,o,i){const s=t.length,c=Math.min(i.width,i.height)/2;a.forEach((d,p)=>{if(d.entries.length!==s)return;const u=d.entries.map((g,x)=>{const v=2*Math.PI*x/s-Math.PI/2,y=A(g,r,n,c),I=y*Math.cos(v),O=y*Math.sin(v);return{x:I,y:O}});o==="circle"?e.append("path").attr("d",L(u,i.curveTension)).attr("class",`radarCurve-${p}`):o==="polygon"&&e.append("polygon").attr("points",u.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}l(M,"drawCurves");function A(e,t,a,r){const n=Math.min(Math.max(e,t),a);return r*(n-t)/(a-t)}l(A,"relativeRadius");function L(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let n=0;n<a;n++){const o=e[(n-1+a)%a],i=e[n],s=e[(n+1)%a],c=e[(n+2)%a],d={x:i.x+(s.x-o.x)*t,y:i.y+(s.y-o.y)*t},p={x:s.x-(c.x-i.x)*t,y:s.y-(c.y-i.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`}return`${r} Z`}l(L,"closedRoundCurve");function T(e,t,a,r){if(!a)return;const n=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,i=20;t.forEach((s,c)=>{const d=e.append("g").attr("transform",`translate(${n}, ${o+c*i})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}l(T,"drawLegend");var nt={draw:tt},st=l((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const n=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${n};
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${n};
			fill-opacity: ${t.curveOpacity};
			stroke: ${n};
		}
		`}return a},"genIndexStyles"),ot=l(e=>{const t=V(),a=$(),r=b(t,a.themeVariables),n=b(r.radar,e);return{themeVariables:r,radarOptions:n}},"buildRadarStyleOptions"),it=l(({radar:e}={})=>{const{themeVariables:t,radarOptions:a}=ot(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${st(t,a)}
	`},"styles"),ht={parser:Q,db:f,renderer:nt,styles:it};export{ht as diagram};
