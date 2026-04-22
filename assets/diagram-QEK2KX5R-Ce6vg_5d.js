import{_ as l,Q as _,T as E,ac as O,ab as R,U as k,V as D,as as F,ah as G,ao as b,ap as $,aq as P,Y as z,aJ as V}from"./index-v1D2pbK4.js";import{p as W}from"./chunk-4BX2VUAB-BqZp1vSk.js";import{p as B}from"./treemap-75Q7IDZK-BzUr3n3U.js";import"./_baseUniq-C7W30dsk.js";import"./_basePickBy-CM_6Egx2.js";import"./clone-OB29KNrw.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};e.SENTRY_RELEASE={id:"4ec8814b09863b6c7639bd810d013f7e613e7ea1"}}catch{}})();try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="18614278-02ac-4c07-aa5a-ed092c67fa83",e._sentryDebugIdIdentifier="sentry-dbid-18614278-02ac-4c07-aa5a-ed092c67fa83")})()}catch{}var m={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},w={axes:[],curves:[],options:m},h=structuredClone(w),H=P.radar,Y=l(()=>b({...H,...$().radar}),"getConfig"),C=l(()=>h.axes,"getAxes"),j=l(()=>h.curves,"getCurves"),N=l(()=>h.options,"getOptions"),U=l(e=>{h.axes=e.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),q=l(e=>{h.curves=e.map(t=>({name:t.name,label:t.label??t.name,entries:J(t.entries)}))},"setCurves"),J=l(e=>{if(e[0].axis==null)return e.map(a=>a.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(a=>{const r=e.find(n=>n.axis?.$refText===a.name);if(r===void 0)throw new Error("Missing entry for axis "+a.label);return r.value})},"computeCurveEntries"),Q=l(e=>{const t=e.reduce((a,r)=>(a[r.name]=r,a),{});h.options={showLegend:t.showLegend?.value??m.showLegend,ticks:t.ticks?.value??m.ticks,max:t.max?.value??m.max,min:t.min?.value??m.min,graticule:t.graticule?.value??m.graticule}},"setOptions"),X=l(()=>{G(),h=structuredClone(w)},"clear"),v={getAxes:C,getCurves:j,getOptions:N,setAxes:U,setCurves:q,setOptions:Q,getConfig:Y,clear:X,setAccTitle:D,getAccTitle:k,setDiagramTitle:R,getDiagramTitle:O,getAccDescription:E,setAccDescription:_},Z=l(e=>{W(e,v);const{axes:t,curves:a,options:r}=e;v.setAxes(t),v.setCurves(a),v.setOptions(r)},"populate"),K={parse:l(async e=>{const t=await B("radar",e);z.debug(t),Z(t)},"parse")},tt=l((e,t,a,r)=>{const n=r.db,o=n.getAxes(),i=n.getCurves(),s=n.getOptions(),c=n.getConfig(),d=n.getDiagramTitle(),p=F(t),u=et(p,c),g=s.max??Math.max(...i.map(y=>Math.max(...y.entries))),x=s.min,f=Math.min(c.width,c.height)/2;at(u,o,f,s.ticks,s.graticule),rt(u,o,f,c),M(u,o,i,x,g,s.graticule,c),L(u,i,s.showLegend,c),u.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),et=l((e,t)=>{const a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,n={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr("viewbox",`0 0 ${a} ${r}`).attr("width",a).attr("height",r),e.append("g").attr("transform",`translate(${n.x}, ${n.y})`)},"drawFrame"),at=l((e,t,a,r,n)=>{if(n==="circle")for(let o=0;o<r;o++){const i=a*(o+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if(n==="polygon"){const o=t.length;for(let i=0;i<r;i++){const s=a*(i+1)/r,c=t.map((d,p)=>{const u=2*p*Math.PI/o-Math.PI/2,g=s*Math.cos(u),x=s*Math.sin(u);return`${g},${x}`}).join(" ");e.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),rt=l((e,t,a,r)=>{const n=t.length;for(let o=0;o<n;o++){const i=t[o].label,s=2*o*Math.PI/n-Math.PI/2;e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*Math.cos(s)).attr("y2",a*r.axisScaleFactor*Math.sin(s)).attr("class","radarAxisLine"),e.append("text").text(i).attr("x",a*r.axisLabelFactor*Math.cos(s)).attr("y",a*r.axisLabelFactor*Math.sin(s)).attr("class","radarAxisLabel")}},"drawAxes");function M(e,t,a,r,n,o,i){const s=t.length,c=Math.min(i.width,i.height)/2;a.forEach((d,p)=>{if(d.entries.length!==s)return;const u=d.entries.map((g,x)=>{const f=2*Math.PI*x/s-Math.PI/2,y=T(g,r,n,c),I=y*Math.cos(f),S=y*Math.sin(f);return{x:I,y:S}});o==="circle"?e.append("path").attr("d",A(u,i.curveTension)).attr("class",`radarCurve-${p}`):o==="polygon"&&e.append("polygon").attr("points",u.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}l(M,"drawCurves");function T(e,t,a,r){const n=Math.min(Math.max(e,t),a);return r*(n-t)/(a-t)}l(T,"relativeRadius");function A(e,t){const a=e.length;let r=`M${e[0].x},${e[0].y}`;for(let n=0;n<a;n++){const o=e[(n-1+a)%a],i=e[n],s=e[(n+1)%a],c=e[(n+2)%a],d={x:i.x+(s.x-o.x)*t,y:i.y+(s.y-o.y)*t},p={x:s.x-(c.x-i.x)*t,y:s.y-(c.y-i.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`}return`${r} Z`}l(A,"closedRoundCurve");function L(e,t,a,r){if(!a)return;const n=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,i=20;t.forEach((s,c)=>{const d=e.append("g").attr("transform",`translate(${n}, ${o+c*i})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}l(L,"drawLegend");var nt={draw:tt},st=l((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){const n=e[`cScale${r}`];a+=`
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
	`},"styles"),ht={parser:K,db:v,renderer:nt,styles:it};export{ht as diagram};
