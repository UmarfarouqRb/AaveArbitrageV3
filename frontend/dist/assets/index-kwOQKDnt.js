import{m as c,r as l,o as u,x as f}from"./index-Ca0hgeA-.js";import{n as p,c as m}from"./index-CSwjhkjy.js";const g=c`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${r=>r.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var h=function(r,e,a,s){var o=arguments.length,t=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,a):s,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,a,s);else for(var d=r.length-1;d>=0;d--)(n=r[d])&&(t=(o<3?n(t):o>3?n(e,a,t):n(e,a))||t);return o>3&&t&&Object.defineProperty(e,a,t),t};let i=class extends u{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const e=this.radius>50?50:this.radius,s=36-e,o=116+s,t=245+s,n=360+s*1.75;return f`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${o} ${t}"
          stroke-dashoffset=${n}
        />
      </svg>
    `}};i.styles=[l,g];h([p({type:Number})],i.prototype,"radius",void 0);i=h([m("wui-loading-thumbnail")],i);
