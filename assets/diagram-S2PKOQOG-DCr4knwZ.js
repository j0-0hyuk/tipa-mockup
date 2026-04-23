import{aX as k,bt as u,bx as $,b3 as B,b2 as m,a$ as C,a_ as D,bg as S,bh as T,aZ as E,aY as P,bu as z,bv as F,bm as _}from"./index-DFhKk_SS.js";import{p as A}from"./chunk-4BX2VUAB-DHFU7Juy.js";import{p as W}from"./treemap-75Q7IDZK-B-AOFh2F.js";import"./_baseUniq-CD49yyar.js";import"./_basePickBy-DkwDcqPd.js";import"./clone-C_gRS2bf.js";try{(function(){var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="f71c27a1-3fc1-4a7b-a9ca-c649f1ab757e",t._sentryDebugIdIdentifier="sentry-dbid-f71c27a1-3fc1-4a7b-a9ca-c649f1ab757e")})()}catch{}var I=F.packet,w=class{constructor(){this.packet=[],this.setAccTitle=C,this.getAccTitle=D,this.setDiagramTitle=S,this.getDiagramTitle=T,this.getAccDescription=E,this.setAccDescription=P}static{k(this,"PacketDB")}getConfig(){const t=u({...I,...z().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){_(),this.packet=[]}},N=1e4,Y=k((t,e)=>{A(t,e);let r=-1,o=[],n=1;const{bitsPerRow:l}=e.getConfig();for(let{start:a,end:i,bits:d,label:c}of t.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??=a+(d??1)-1,d??=i-a+1,r=i,m.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=l+1&&e.getPacket().length<N;){const[p,s]=L({start:a,end:i,bits:d,label:c},n,l);if(o.push(p),p.end+1===n*l&&(e.pushWord(o),o=[],n++),!s)break;({start:a,end:i,bits:d,label:c}=s)}}e.pushWord(o)},"populate"),L=k((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const o=e*r-1,n=e*r;return[{start:t.start,end:o,label:t.label,bits:o-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),y={parser:{yy:void 0},parse:k(async t=>{const e=await W("packet",t),r=y.parser?.yy;if(!(r instanceof w))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");m.debug(e),Y(e,r)},"parse")},M=k((t,e,r,o)=>{const n=o.db,l=n.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),s=n.getDiagramTitle(),g=a+i,f=g*(p.length+1)-(s?0:a),b=d*c+2,h=$(e);h.attr("viewbox",`0 0 ${b} ${f}`),B(h,f,b,l.useMaxWidth);for(const[v,x]of p.entries())O(h,x,v,l);h.append("text").text(s).attr("x",b/2).attr("y",f-g/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),O=k((t,e,r,{rowHeight:o,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=t.append("g"),p=r*(o+l)+l;for(const s of e){const g=s.start%i*a+1,f=(s.end-s.start+1)*a-n;if(c.append("rect").attr("x",g).attr("y",p).attr("width",f).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",g+f/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!d)continue;const b=s.end===s.start,h=p-2;c.append("text").attr("x",g+(b?f/2:0)).attr("y",h).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(s.start),b||c.append("text").attr("x",g+f).attr("y",h).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),X={draw:M},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},G=k(({packet:t}={})=>{const e=u(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),J={parser:y,get db(){return new w},renderer:X,styles:G};export{J as diagram};
