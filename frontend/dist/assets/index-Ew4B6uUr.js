import{m as rt,o as ot,x as w,r as Dt,C as pt,a7 as N,a as gt,R as It,O as At,E as Ct,y as Nt,W as Rt}from"./index-KtYfjFzp.js";import{U as bt,n as M,c as st,r as at}from"./index-Dsnd9KZS.js";import{dn as mt,dp as ft}from"./index-ZNJTT0gP.js";import"./index-CISeOXvL.js";import"./index-DMpduBC9.js";import{o as kt}from"./if-defined-B_dLUKzc.js";import"./index-DNihObrw.js";import"./index-BtWhSigt.js";var _t={exports:{}};(function(t,e){(function(i,n){t.exports=n()})(ft,function(){var i=1e3,n=6e4,o=36e5,r="millisecond",s="second",u="minute",g="hour",p="day",y="week",v="month",F="quarter",T="year",R="date",E="Invalid Date",Q=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,X=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,tt={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(h){var l=["th","st","nd","rd"],a=h%100;return"["+h+(l[(a-20)%10]||l[a]||l[0])+"]"}},et=function(h,l,a){var d=String(h);return!d||d.length>=l?h:""+Array(l+1-d.length).join(a)+h},U={s:et,z:function(h){var l=-h.utcOffset(),a=Math.abs(l),d=Math.floor(a/60),c=a%60;return(l<=0?"+":"-")+et(d,2,"0")+":"+et(c,2,"0")},m:function h(l,a){if(l.date()<a.date())return-h(a,l);var d=12*(a.year()-l.year())+(a.month()-l.month()),c=l.clone().add(d,v),m=a-c<0,f=l.clone().add(d+(m?-1:1),v);return+(-(d+(a-c)/(m?c-f:f-c))||0)},a:function(h){return h<0?Math.ceil(h)||0:Math.floor(h)},p:function(h){return{M:v,y:T,w:y,d:p,D:R,h:g,m:u,s,ms:r,Q:F}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(h){return h===void 0}},O="en",I={};I[O]=tt;var q="$isDayjsObject",B=function(h){return h instanceof lt||!(!h||!h[q])},ct=function h(l,a,d){var c;if(!l)return O;if(typeof l=="string"){var m=l.toLowerCase();I[m]&&(c=m),a&&(I[m]=a,c=m);var f=l.split("-");if(!c&&f.length>1)return h(f[0])}else{var $=l.name;I[$]=l,c=$}return!d&&c&&(O=c),c||!d&&O},D=function(h,l){if(B(h))return h.clone();var a=typeof l=="object"?l:{};return a.date=h,a.args=arguments,new lt(a)},x=U;x.l=ct,x.i=B,x.w=function(h,l){return D(h,{locale:l.$L,utc:l.$u,x:l.$x,$offset:l.$offset})};var lt=function(){function h(a){this.$L=ct(a.locale,null,!0),this.parse(a),this.$x=this.$x||a.x||{},this[q]=!0}var l=h.prototype;return l.parse=function(a){this.$d=function(d){var c=d.date,m=d.utc;if(c===null)return new Date(NaN);if(x.u(c))return new Date;if(c instanceof Date)return new Date(c);if(typeof c=="string"&&!/Z$/i.test(c)){var f=c.match(Q);if(f){var $=f[2]-1||0,b=(f[7]||"0").substring(0,3);return m?new Date(Date.UTC(f[1],$,f[3]||1,f[4]||0,f[5]||0,f[6]||0,b)):new Date(f[1],$,f[3]||1,f[4]||0,f[5]||0,f[6]||0,b)}}return new Date(c)}(a),this.init()},l.init=function(){var a=this.$d;this.$y=a.getFullYear(),this.$M=a.getMonth(),this.$D=a.getDate(),this.$W=a.getDay(),this.$H=a.getHours(),this.$m=a.getMinutes(),this.$s=a.getSeconds(),this.$ms=a.getMilliseconds()},l.$utils=function(){return x},l.isValid=function(){return this.$d.toString()!==E},l.isSame=function(a,d){var c=D(a);return this.startOf(d)<=c&&c<=this.endOf(d)},l.isAfter=function(a,d){return D(a)<this.startOf(d)},l.isBefore=function(a,d){return this.endOf(d)<D(a)},l.$g=function(a,d,c){return x.u(a)?this[d]:this.set(c,a)},l.unix=function(){return Math.floor(this.valueOf()/1e3)},l.valueOf=function(){return this.$d.getTime()},l.startOf=function(a,d){var c=this,m=!!x.u(d)||d,f=x.p(a),$=function(H,A){var z=x.w(c.$u?Date.UTC(c.$y,A,H):new Date(c.$y,A,H),c);return m?z:z.endOf(p)},b=function(H,A){return x.w(c.toDate()[H].apply(c.toDate("s"),(m?[0,0,0,0]:[23,59,59,999]).slice(A)),c)},_=this.$W,S=this.$M,C=this.$D,J="set"+(this.$u?"UTC":"");switch(f){case T:return m?$(1,0):$(31,11);case v:return m?$(1,S):$(0,S+1);case y:var W=this.$locale().weekStart||0,it=(_<W?_+7:_)-W;return $(m?C-it:C+(6-it),S);case p:case R:return b(J+"Hours",0);case g:return b(J+"Minutes",1);case u:return b(J+"Seconds",2);case s:return b(J+"Milliseconds",3);default:return this.clone()}},l.endOf=function(a){return this.startOf(a,!1)},l.$set=function(a,d){var c,m=x.p(a),f="set"+(this.$u?"UTC":""),$=(c={},c[p]=f+"Date",c[R]=f+"Date",c[v]=f+"Month",c[T]=f+"FullYear",c[g]=f+"Hours",c[u]=f+"Minutes",c[s]=f+"Seconds",c[r]=f+"Milliseconds",c)[m],b=m===p?this.$D+(d-this.$W):d;if(m===v||m===T){var _=this.clone().set(R,1);_.$d[$](b),_.init(),this.$d=_.set(R,Math.min(this.$D,_.daysInMonth())).$d}else $&&this.$d[$](b);return this.init(),this},l.set=function(a,d){return this.clone().$set(a,d)},l.get=function(a){return this[x.p(a)]()},l.add=function(a,d){var c,m=this;a=Number(a);var f=x.p(d),$=function(S){var C=D(m);return x.w(C.date(C.date()+Math.round(S*a)),m)};if(f===v)return this.set(v,this.$M+a);if(f===T)return this.set(T,this.$y+a);if(f===p)return $(1);if(f===y)return $(7);var b=(c={},c[u]=n,c[g]=o,c[s]=i,c)[f]||1,_=this.$d.getTime()+a*b;return x.w(_,this)},l.subtract=function(a,d){return this.add(-1*a,d)},l.format=function(a){var d=this,c=this.$locale();if(!this.isValid())return c.invalidDate||E;var m=a||"YYYY-MM-DDTHH:mm:ssZ",f=x.z(this),$=this.$H,b=this.$m,_=this.$M,S=c.weekdays,C=c.months,J=c.meridiem,W=function(A,z,nt,dt){return A&&(A[z]||A(d,m))||nt[z].slice(0,dt)},it=function(A){return x.s($%12||12,A,"0")},H=J||function(A,z,nt){var dt=A<12?"AM":"PM";return nt?dt.toLowerCase():dt};return m.replace(X,function(A,z){return z||function(nt){switch(nt){case"YY":return String(d.$y).slice(-2);case"YYYY":return x.s(d.$y,4,"0");case"M":return _+1;case"MM":return x.s(_+1,2,"0");case"MMM":return W(c.monthsShort,_,C,3);case"MMMM":return W(C,_);case"D":return d.$D;case"DD":return x.s(d.$D,2,"0");case"d":return String(d.$W);case"dd":return W(c.weekdaysMin,d.$W,S,2);case"ddd":return W(c.weekdaysShort,d.$W,S,3);case"dddd":return S[d.$W];case"H":return String($);case"HH":return x.s($,2,"0");case"h":return it(1);case"hh":return it(2);case"a":return H($,b,!0);case"A":return H($,b,!1);case"m":return String(b);case"mm":return x.s(b,2,"0");case"s":return String(d.$s);case"ss":return x.s(d.$s,2,"0");case"SSS":return x.s(d.$ms,3,"0");case"Z":return f}return null}(A)||f.replace(":","")})},l.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},l.diff=function(a,d,c){var m,f=this,$=x.p(d),b=D(a),_=(b.utcOffset()-this.utcOffset())*n,S=this-b,C=function(){return x.m(f,b)};switch($){case T:m=C()/12;break;case v:m=C();break;case F:m=C()/3;break;case y:m=(S-_)/6048e5;break;case p:m=(S-_)/864e5;break;case g:m=S/o;break;case u:m=S/n;break;case s:m=S/i;break;default:m=S}return c?m:x.a(m)},l.daysInMonth=function(){return this.endOf(v).$D},l.$locale=function(){return I[this.$L]},l.locale=function(a,d){if(!a)return this.$L;var c=this.clone(),m=ct(a,d,!0);return m&&(c.$L=m),c},l.clone=function(){return x.w(this.$d,this)},l.toDate=function(){return new Date(this.valueOf())},l.toJSON=function(){return this.isValid()?this.toISOString():null},l.toISOString=function(){return this.$d.toISOString()},l.toString=function(){return this.$d.toUTCString()},h}(),vt=lt.prototype;return D.prototype=vt,[["$ms",r],["$s",s],["$m",u],["$H",g],["$W",p],["$M",v],["$y",T],["$D",R]].forEach(function(h){vt[h[1]]=function(l){return this.$g(l,h[0],h[1])}}),D.extend=function(h,l){return h.$i||(h(l,lt,D),h.$i=!0),D},D.locale=ct,D.isDayjs=B,D.unix=function(h){return D(1e3*h)},D.en=I[O],D.Ls=I,D.p={},D})})(_t);var Ft=_t.exports;const K=mt(Ft);var Mt={exports:{}};(function(t,e){(function(i,n){t.exports=n()})(ft,function(){return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(i){var n=["th","st","nd","rd"],o=i%100;return"["+i+(n[(o-20)%10]||n[o]||n[0])+"]"}}})})(Mt);var Lt=Mt.exports;const jt=mt(Lt);var St={exports:{}};(function(t,e){(function(i,n){t.exports=n()})(ft,function(){return function(i,n,o){i=i||{};var r=n.prototype,s={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function u(p,y,v,F){return r.fromToBase(p,y,v,F)}o.en.relativeTime=s,r.fromToBase=function(p,y,v,F,T){for(var R,E,Q,X=v.$locale().relativeTime||s,tt=i.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],et=tt.length,U=0;U<et;U+=1){var O=tt[U];O.d&&(R=F?o(p).diff(v,O.d,!0):v.diff(p,O.d,!0));var I=(i.rounding||Math.round)(Math.abs(R));if(Q=R>0,I<=O.r||!O.r){I<=1&&U>0&&(O=tt[U-1]);var q=X[O.l];T&&(I=T(""+I)),E=typeof q=="string"?q.replace("%d",I):q(I,y,O.l,Q);break}}if(y)return E;var B=Q?X.future:X.past;return typeof B=="function"?B(E):B.replace("%s",E)},r.to=function(p,y){return u(p,y,this,!0)},r.from=function(p,y){return u(p,y,this)};var g=function(p){return p.$u?o.utc():o()};r.toNow=function(p){return this.to(g(this),p)},r.fromNow=function(p){return this.from(g(this),p)}}})})(St);var zt=St.exports;const Yt=mt(zt);var Ot={exports:{}};(function(t,e){(function(i,n){t.exports=n()})(ft,function(){return function(i,n,o){o.updateLocale=function(r,s){var u=o.Ls[r];if(u)return(s?Object.keys(s):[]).forEach(function(g){u[g]=s[g]}),u}}})})(Ot);var Et=Ot.exports;const Ut=mt(Et);K.extend(Yt);K.extend(Ut);const Bt={...jt,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Wt=["January","February","March","April","May","June","July","August","September","October","November","December"];K.locale("en-web3-modal",Bt);const yt={getMonthNameByIndex(t){return Wt[t]},getYear(t=new Date().toISOString()){return K(t).year()},getRelativeDateFromNow(t){return K(t).locale("en-web3-modal").fromNow(!0)},formatDate(t,e="DD MMM"){return K(t).format(e)}},Ht=3,ht=.1,Gt=["receive","deposit","borrow","claim"],Pt=["withdraw","repay","burn"],Z={getTransactionGroupTitle(t,e){const i=yt.getYear(),n=yt.getMonthNameByIndex(e);return t===i?n:`${n} ${t}`},getTransactionImages(t){const[e]=t;return(t==null?void 0:t.length)>1?t.map(n=>this.getTransactionImage(n)):[this.getTransactionImage(e)]},getTransactionImage(t){return{type:Z.getTransactionTransferTokenType(t),url:Z.getTransactionImageURL(t)}},getTransactionImageURL(t){var o,r,s,u,g;let e;const i=!!(t!=null&&t.nft_info),n=!!(t!=null&&t.fungible_info);return t&&i?e=(s=(r=(o=t==null?void 0:t.nft_info)==null?void 0:o.content)==null?void 0:r.preview)==null?void 0:s.url:t&&n&&(e=(g=(u=t==null?void 0:t.fungible_info)==null?void 0:u.icon)==null?void 0:g.url),e},getTransactionTransferTokenType(t){if(t!=null&&t.fungible_info)return"FUNGIBLE";if(t!=null&&t.nft_info)return"NFT"},getTransactionDescriptions(t,e){var F;const i=(F=t==null?void 0:t.metadata)==null?void 0:F.operationType,n=e||(t==null?void 0:t.transfers),o=(n==null?void 0:n.length)>0,r=(n==null?void 0:n.length)>1,s=o&&(n==null?void 0:n.every(T=>!!(T!=null&&T.fungible_info))),[u,g]=n;let p=this.getTransferDescription(u),y=this.getTransferDescription(g);if(!o)return(i==="send"||i==="receive")&&s?(p=bt.getTruncateString({string:t==null?void 0:t.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),y=bt.getTruncateString({string:t==null?void 0:t.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[p,y]):[t.metadata.status];if(r)return n.map(T=>this.getTransferDescription(T));let v="";return Gt.includes(i)?v="+":Pt.includes(i)&&(v="-"),p=v.concat(p),[p]},getTransferDescription(t){var i;let e="";return t&&(t!=null&&t.nft_info?e=((i=t==null?void 0:t.nft_info)==null?void 0:i.name)||"-":t!=null&&t.fungible_info&&(e=this.getFungibleTransferDescription(t)||"-")),e},getFungibleTransferDescription(t){var n;return t?[this.getQuantityFixedValue(t==null?void 0:t.quantity.numeric),(n=t==null?void 0:t.fungible_info)==null?void 0:n.symbol].join(" ").trim():null},mergeTransfers(t){if((t==null?void 0:t.length)<=1)return t;const i=this.filterGasFeeTransfers(t).reduce((o,r)=>{var g;const s=(g=r==null?void 0:r.fungible_info)==null?void 0:g.name,u=o.find(({fungible_info:p,direction:y})=>s&&s===(p==null?void 0:p.name)&&y===r.direction);if(u){const p=Number(u.quantity.numeric)+Number(r.quantity.numeric);u.quantity.numeric=p.toString(),u.value=(u.value||0)+(r.value||0)}else o.push(r);return o},[]);let n=i;return i.length>2&&(n=i.sort((o,r)=>(r.value||0)-(o.value||0)).slice(0,2)),n=n.sort((o,r)=>o.direction==="out"&&r.direction==="in"?-1:o.direction==="in"&&r.direction==="out"?1:0),n},filterGasFeeTransfers(t){const e=t.reduce((n,o)=>{var s;const r=(s=o==null?void 0:o.fungible_info)==null?void 0:s.name;return r&&(n[r]||(n[r]=[]),n[r].push(o)),n},{}),i=[];return Object.values(e).forEach(n=>{if(n.length===1){const o=n[0];o&&i.push(o)}else{const o=n.filter(s=>s.direction==="in"),r=n.filter(s=>s.direction==="out");if(o.length===1&&r.length===1){const s=o[0],u=r[0];let g=!1;if(s&&u){const p=Number(s.quantity.numeric),y=Number(u.quantity.numeric);y<p*ht?(i.push(s),g=!0):p<y*ht&&(i.push(u),g=!0)}g||i.push(...n)}else{const s=this.filterGasFeesFromTokenGroup(n);i.push(...s)}}}),t.forEach(n=>{var o;(o=n==null?void 0:n.fungible_info)!=null&&o.name||i.push(n)}),i},filterGasFeesFromTokenGroup(t){if(t.length<=1)return t;const e=t.map(u=>Number(u.quantity.numeric)),i=Math.max(...e),n=Math.min(...e),o=.01;if(n<i*o)return t.filter(g=>Number(g.quantity.numeric)>=i*o);const r=t.filter(u=>u.direction==="in"),s=t.filter(u=>u.direction==="out");if(r.length===1&&s.length===1){const u=r[0],g=s[0];if(u&&g){const p=Number(u.quantity.numeric),y=Number(g.quantity.numeric);if(y<p*ht)return[u];if(p<y*ht)return[g]}}return t},getQuantityFixedValue(t){return t?parseFloat(t).toFixed(Ht):null}};var xt;(function(t){t.approve="approved",t.bought="bought",t.borrow="borrowed",t.burn="burnt",t.cancel="canceled",t.claim="claimed",t.deploy="deployed",t.deposit="deposited",t.execute="executed",t.mint="minted",t.receive="received",t.repay="repaid",t.send="sent",t.sell="sold",t.stake="staked",t.trade="swapped",t.unstake="unstaked",t.withdraw="withdrawn"})(xt||(xt={}));const Vt=rt`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.core.glass010};
    background-color: ${({tokens:t})=>t.core.glass010};
  }

  :host([data-no-images='true']) > wui-flex {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[3]} !important;
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  wui-flex.status-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
    border-radius: ${({borderRadius:t})=>t[4]};
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.theme.backgroundPrimary};
    overflow: hidden;
    width: 16px;
    height: 16px;
  }
`;var P=function(t,e,i,n){var o=arguments.length,r=o<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,n);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let L=class extends ot{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[e,i]=this.images;this.images.length||(this.dataset.noImages="true");const n=(e==null?void 0:e.type)==="NFT",o=i!=null&&i.url?i.type==="NFT":n,r=n?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)",s=o?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)";return this.style.cssText=`
    --local-left-border-radius: ${r};
    --local-right-border-radius: ${s};
    `,w`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[e,i]=this.images,n=e==null?void 0:e.type;return this.images.length===2&&(e!=null&&e.url||i!=null&&i.url)?w`<div class="swap-images-container">
        ${e!=null&&e.url?w`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
        ${i!=null&&i.url?w`<wui-image src=${i.url} alt="Transaction image"></wui-image>`:null}
      </div>`:e!=null&&e.url?w`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:n==="NFT"?w`<wui-icon size="inherit" color="default" name="nftPlaceholder"></wui-icon>`:w`<wui-icon size="inherit" color="default" name="coinPlaceholder"></wui-icon>`}templateIcon(){let e="accent-primary",i;return i=this.getIcon(),this.status&&(e=this.getStatusColor()),i?w`
      <wui-flex alignItems="center" justifyContent="center" class="status-box">
        <wui-icon-box size="sm" color=${e} icon=${i}></wui-icon-box>
      </wui-flex>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontal":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success";case"failed":return"error";case"pending":return"inverse";default:return"accent-primary"}}};L.styles=[Vt];P([M()],L.prototype,"type",void 0);P([M()],L.prototype,"status",void 0);P([M()],L.prototype,"direction",void 0);P([M({type:Boolean})],L.prototype,"onlyDirectionIcon",void 0);P([M({type:Array})],L.prototype,"images",void 0);P([M({type:Object})],L.prototype,"secondImage",void 0);L=P([st("wui-transaction-visual")],L);const qt=rt`
  :host {
    width: 100%;
  }

  :host > wui-flex:first-child {
    align-items: center;
    column-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var Y=function(t,e,i,n){var o=arguments.length,r=o<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,n);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let k=class extends ot{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[]}render(){return w`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${kt(this.direction)}
          type=${this.type}
          .onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="lg-medium" color="primary">
            ${xt[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="sm-medium" color="secondary"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){var i;const e=(i=this.descriptions)==null?void 0:i[0];return e?w`
          <wui-text variant="md-regular" color="secondary">
            <span>${e}</span>
          </wui-text>
        `:null}templateSecondDescription(){var i;const e=(i=this.descriptions)==null?void 0:i[1];return e?w`
          <wui-icon class="description-separator-icon" size="sm" name="arrowRight"></wui-icon>
          <wui-text variant="md-regular" color="secondary">
            <span>${e}</span>
          </wui-text>
        `:null}};k.styles=[Dt,qt];Y([M()],k.prototype,"type",void 0);Y([M({type:Array})],k.prototype,"descriptions",void 0);Y([M()],k.prototype,"date",void 0);Y([M({type:Boolean})],k.prototype,"onlyDirectionIcon",void 0);Y([M()],k.prototype,"status",void 0);Y([M()],k.prototype,"direction",void 0);Y([M({type:Array})],k.prototype,"images",void 0);k=Y([st("wui-transaction-list-item")],k);const Jt=rt`
  wui-flex {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t[128]};
  }

  .fallback-icon {
    color: ${({tokens:t})=>t.theme.iconInverse};
    border-radius: ${({borderRadius:t})=>t[3]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .direction-icon,
  .status-image {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: ${({borderRadius:t})=>t[128]};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  .direction-icon {
    padding: ${({spacing:t})=>t["01"]};
    color: ${({tokens:t})=>t.core.iconSuccess};

    background-color: color-mix(
      in srgb,
      ${({tokens:t})=>t.core.textSuccess} 30%,
      ${({tokens:t})=>t.theme.backgroundPrimary} 70%
    );
  }

  /* -- Sizes --------------------------------------------------- */
  :host([data-size='sm']) > wui-image:not(.status-image),
  :host([data-size='sm']) > wui-flex {
    width: 24px;
    height: 24px;
  }

  :host([data-size='lg']) > wui-image:not(.status-image),
  :host([data-size='lg']) > wui-flex {
    width: 40px;
    height: 40px;
  }

  :host([data-size='sm']) .fallback-icon {
    height: 16px;
    width: 16px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='lg']) .fallback-icon {
    height: 32px;
    width: 32px;
    padding: ${({spacing:t})=>t[1]};
  }

  :host([data-size='sm']) .direction-icon,
  :host([data-size='sm']) .status-image {
    transform: translate(40%, 30%);
  }

  :host([data-size='lg']) .direction-icon,
  :host([data-size='lg']) .status-image {
    transform: translate(40%, 10%);
  }

  :host([data-size='sm']) .status-image {
    height: 14px;
    width: 14px;
  }

  :host([data-size='lg']) .status-image {
    height: 20px;
    width: 20px;
  }

  /* -- Crop effects --------------------------------------------------- */
  .swap-crop-left-image,
  .swap-crop-right-image {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .swap-crop-left-image {
    left: 0;
    clip-path: inset(0px calc(50% + 1.5px) 0px 0%);
  }

  .swap-crop-right-image {
    right: 0;
    clip-path: inset(0px 0px 0px calc(50% + 1.5px));
  }
`;var ut=function(t,e,i,n){var o=arguments.length,r=o<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,n);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};const wt={sm:"xxs",lg:"md"};let G=class extends ot{constructor(){super(...arguments),this.type="approve",this.size="lg",this.statusImageUrl="",this.images=[]}render(){return w`<wui-flex>${this.templateVisual()} ${this.templateIcon()}</wui-flex>`}templateVisual(){switch(this.dataset.size=this.size,this.type){case"trade":return this.swapTemplate();case"fiat":return this.fiatTemplate();case"unknown":return this.unknownTemplate();default:return this.tokenTemplate()}}swapTemplate(){const[e,i]=this.images;return this.images.length===2&&(e||i)?w`
        <wui-image class="swap-crop-left-image" src=${e} alt="Swap image"></wui-image>
        <wui-image class="swap-crop-right-image" src=${i} alt="Swap image"></wui-image>
      `:e?w`<wui-image src=${e} alt="Swap image"></wui-image>`:null}fiatTemplate(){return w`<wui-icon
      class="fallback-icon"
      size=${wt[this.size]}
      name="dollar"
    ></wui-icon>`}unknownTemplate(){return w`<wui-icon
      class="fallback-icon"
      size=${wt[this.size]}
      name="questionMark"
    ></wui-icon>`}tokenTemplate(){const[e]=this.images;return e?w`<wui-image src=${e} alt="Token image"></wui-image> `:w`<wui-icon
      class="fallback-icon"
      name=${this.type==="nft"?"image":"coinPlaceholder"}
    ></wui-icon>`}templateIcon(){return this.statusImageUrl?w`<wui-image
        class="status-image"
        src=${this.statusImageUrl}
        alt="Status image"
      ></wui-image>`:w`<wui-icon
      class="direction-icon"
      size=${wt[this.size]}
      name=${this.getTemplateIcon()}
    ></wui-icon>`}getTemplateIcon(){return this.type==="trade"?"arrowClockWise":"arrowBottom"}};G.styles=[Jt];ut([M()],G.prototype,"type",void 0);ut([M()],G.prototype,"size",void 0);ut([M()],G.prototype,"statusImageUrl",void 0);ut([M({type:Array})],G.prototype,"images",void 0);G=ut([st("wui-transaction-thumbnail")],G);const Zt=rt`
  :host > wui-flex:first-child {
    gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var Kt=function(t,e,i,n){var o=arguments.length,r=o<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,n);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let $t=class extends ot{render(){return w`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px" rounded></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="124px" height="16px" rounded></wui-shimmer>
          <wui-shimmer width="60px" height="14px" rounded></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" rounded></wui-shimmer>
      </wui-flex>
    `}};$t.styles=[Dt,Zt];$t=Kt([st("wui-transaction-list-item-loader")],$t);const Qt=rt`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: ${({spacing:t})=>t[3]};
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var V=function(t,e,i,n){var o=arguments.length,r=o<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,n);else for(var u=t.length-1;u>=0;u--)(s=t[u])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};const Tt="last-transaction",Xt=7;let j=class extends ot{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=pt.state.activeCaipAddress,this.transactionsByYear=N.state.transactionsByYear,this.loading=N.state.loading,this.empty=N.state.empty,this.next=N.state.next,N.clearCursor(),this.unsubscribe.push(pt.subscribeKey("activeCaipAddress",e=>{e&&this.caipAddress!==e&&(N.resetTransactions(),N.fetchTransactions(e)),this.caipAddress=e}),pt.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),N.subscribe(e=>{this.transactionsByYear=e.transactionsByYear,this.loading=e.loading,this.empty=e.empty,this.next=e.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return w` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){N.resetTransactions(),this.caipAddress&&N.fetchTransactions(gt.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{const n=parseInt(i,10),o=new Array(12).fill(null).map((r,s)=>{var p;const u=Z.getTransactionGroupTitle(n,s),g=(p=this.transactionsByYear[n])==null?void 0:p[s];return{groupTitle:u,transactions:g}}).filter(({transactions:r})=>r).reverse();return o.map(({groupTitle:r,transactions:s},u)=>{const g=u===o.length-1;return s?w`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${g?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["2","3","3","3"]}
            >
              <wui-text variant="md-medium" color="secondary" data-testid="group-title">
                ${r}
              </wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="2">
              ${this.templateTransactions(s,g)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(e,i){const{date:n,descriptions:o,direction:r,images:s,status:u,type:g,transfers:p,isAllNFT:y}=this.getTransactionListItemProps(e);return w`
      <wui-transaction-list-item
        date=${n}
        .direction=${r}
        id=${i&&this.next?Tt:""}
        status=${u}
        type=${g}
        .images=${s}
        .onlyDirectionIcon=${y||p.length===1}
        .descriptions=${o}
      ></wui-transaction-list-item>
    `}templateTransactions(e,i){return e.map((n,o)=>{const r=i&&o===e.length-1;return w`${this.templateRenderTransaction(n,r)}`})}emptyStateActivity(){return w`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["10","5","10","5"]}
      gap="5"
      data-testid="empty-activity-state"
    >
      <wui-icon-box color="default" icon="wallet" size="xl"></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="lg-medium" color="primary">No Transactions yet</wui-text>
        <wui-text align="center" variant="lg-regular" color="secondary"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return w`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
      data-testid="empty-account-state"
    >
      <wui-icon-box icon="swapHorizontal" size="lg" color="default"></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="2"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="md-regular" align="center" color="primary">No activity yet</wui-text>
        <wui-text variant="sm-regular" align="center" color="secondary"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?w`${this.emptyStateAccount()}`:w`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(Xt).fill(w` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(e=>e):null}onReceiveClick(){It.push("WalletReceive")}createPaginationObserver(){const{projectId:e}=At.state;this.paginationObserver=new IntersectionObserver(([i])=>{i!=null&&i.isIntersecting&&!this.loading&&(N.fetchTransactions(gt.getPlainAddress(this.caipAddress)),Ct.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:gt.getPlainAddress(this.caipAddress),projectId:e,cursor:this.next,isSmartAccount:Nt(pt.state.activeChain)===Rt.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){var i,n,o;(i=this.paginationObserver)==null||i.disconnect();const e=(n=this.shadowRoot)==null?void 0:n.querySelector(`#${Tt}`);e&&((o=this.paginationObserver)==null||o.observe(e))}getTransactionListItemProps(e){var g,p,y;const i=yt.formatDate((g=e==null?void 0:e.metadata)==null?void 0:g.minedAt),n=Z.mergeTransfers(e==null?void 0:e.transfers),o=Z.getTransactionDescriptions(e,n),r=n==null?void 0:n[0],s=!!r&&(n==null?void 0:n.every(v=>!!v.nft_info)),u=Z.getTransactionImages(n);return{date:i,direction:r==null?void 0:r.direction,descriptions:o,isAllNFT:s,images:u,status:(p=e.metadata)==null?void 0:p.status,transfers:n,type:(y=e.metadata)==null?void 0:y.operationType}}};j.styles=Qt;V([M()],j.prototype,"page",void 0);V([at()],j.prototype,"caipAddress",void 0);V([at()],j.prototype,"transactionsByYear",void 0);V([at()],j.prototype,"loading",void 0);V([at()],j.prototype,"empty",void 0);V([at()],j.prototype,"next",void 0);j=V([st("w3m-activity-list")],j);
