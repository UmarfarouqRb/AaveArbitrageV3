import{m as c,o as m,x as f}from"./index-KtYfjFzp.js";import{n as h,c as l}from"./index-Dsnd9KZS.js";const p=c`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundSecondary} 0%,
      ${({tokens:e})=>e.theme.foregroundTertiary} 50%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var n=function(e,r,i,s){var d=arguments.length,t=d<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,i):s,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(e,r,i,s);else for(var u=e.length-1;u>=0;u--)(a=e[u])&&(t=(d<3?a(t):d>3?a(r,i,t):a(r,i))||t);return d>3&&t&&Object.defineProperty(r,i,t),t};let o=class extends m{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",f`<slot></slot>`}};o.styles=[p];n([h()],o.prototype,"width",void 0);n([h()],o.prototype,"height",void 0);n([h()],o.prototype,"variant",void 0);n([h({type:Boolean})],o.prototype,"rounded",void 0);o=n([l("wui-shimmer")],o);
