import{m as g,r as f,o as p,x as m,R as v,G as c,O as u,u as $}from"./index-Ca0hgeA-.js";import{n as h,c as y}from"./index-CSwjhkjy.js";const b=g`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({spacing:t})=>t[1]};
    text-transform: uppercase;
    white-space: nowrap;
  }

  :host([data-variant='accent']) {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  :host([data-variant='info']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-variant='success']) {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
    color: ${({tokens:t})=>t.core.textSuccess};
  }

  :host([data-variant='warning']) {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
    color: ${({tokens:t})=>t.core.textWarning};
  }

  :host([data-variant='error']) {
    background-color: ${({tokens:t})=>t.core.backgroundError};
    color: ${({tokens:t})=>t.core.textError};
  }

  :host([data-variant='certified']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-size='md']) {
    height: 30px;
    padding: 0 ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='sm']) {
    height: 20px;
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
  }
`;var d=function(t,e,r,a){var n=arguments.length,o=n<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,r):a,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,r,a);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(o=(n<3?s(o):n>3?s(e,r,o):s(e,r))||o);return n>3&&o&&Object.defineProperty(e,r,o),o};let i=class extends p{constructor(){super(...arguments),this.variant="accent",this.size="md",this.icon=void 0}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const e=this.size==="md"?"md-medium":"sm-medium",r=this.size==="md"?"md":"sm";return m`
      ${this.icon?m`<wui-icon size=${r} name=${this.icon}></wui-icon>`:null}
      <wui-text
        display="inline"
        data-variant=${this.variant}
        variant=${e}
        color="inherit"
      >
        <slot></slot>
      </wui-text>
    `}};i.styles=[f,b];d([h()],i.prototype,"variant",void 0);d([h()],i.prototype,"size",void 0);d([h()],i.prototype,"icon",void 0);i=d([y("wui-tag")],i);const C={getTabsByNamespace(t){var r;return!!t&&t===$.CHAIN.EVM?((r=u.state.remoteFeatures)==null?void 0:r.activity)===!1?c.ACCOUNT_TABS.filter(a=>a.label!=="Activity"):c.ACCOUNT_TABS:[]},isValidReownName(t){return/^[a-zA-Z0-9]+$/gu.test(t)},isValidEmail(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(t)},validateReownName(t){return t.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,"")},hasFooter(){var e;const t=v.state.view;if(c.VIEWS_WITH_LEGAL_FOOTER.includes(t)){const{termsConditionsUrl:r,privacyPolicyUrl:a}=u.state,n=(e=u.state.features)==null?void 0:e.legalCheckbox;return!(!r&&!a||n)}return c.VIEWS_WITH_DEFAULT_FOOTER.includes(t)}};export{C as H};
