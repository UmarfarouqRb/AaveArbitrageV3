import{m as $,r as I,n as W,o as f,x as l,C as u,O as b,a3 as De,H as A,a as g,M as P,q as oe,E as S,J as Te,F as y,u as k,R as h,e as D,S as T,y as Ie,W as ce,t as x,a4 as Xi,ae as $e,af as Ae,ag as te,Z as Qi,V as C,ah as dt,A as Oi,Y as Ji,X as Zi,U as en,T as Ct,a5 as ii,a6 as ni,ai as tn,a8 as Kt,aj as nn}from"./index-Ca0hgeA-.js";import{n as c,c as p,U as z,r as d,a as Pi}from"./index-CSwjhkjy.js";import{o as w}from"./if-defined-CLmeCaqV.js";import"./index-BNjwA57_.js";import"./index-jnrqVTOY.js";import"./index-Rm7XCRvA.js";import"./index-D2W6HKFg.js";import{a as Rs,W as Ws}from"./index-Bsdgr3t3.js";import"./index-oOGsUe89.js";import"./index-BRGIx5XS.js";import"./index-By5NCZ9E.js";import{H as oi}from"./HelpersUtil-DEQtT62A.js";import{E as ee}from"./ExchangeController-B63LCDtw.js";import"./index-D37x2S6i.js";import"./index-DFo9C1OG.js";import{M as St}from"./index-BEAC-vDq.js";import"./index-eeUoQZm4.js";import"./index-CNUjH4y7.js";import"./index-CbhlGOwA.js";import{e as ri,n as si}from"./ref-BiZMQDS7.js";import"./index-lxie9RS6.js";import{n as on}from"./index-DqrP8twf.js";import"./index-BBgIzmdE.js";import"./index-D_OA_JVX.js";import"./index-C_fVykzw.js";import{O as Et}from"./index-DtqGgX7K.js";import{e as rn}from"./index-4RTInxPH.js";import"./index-CVCz195-.js";import"./index-kwOQKDnt.js";import"./index-SIiLpQUt.js";import{N as sn}from"./NavigationUtil-DmfK5sOV.js";import"./index-CF4d1xHf.js";import"./index-LR5GKwfl.js";import"./index-Cn5aGd7v.js";const an=$`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[20]};
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[1]};
    color: ${({tokens:t})=>t.theme.textSecondary};
    border-radius: ${({borderRadius:t})=>t[16]};
    height: 32px;
    transition: box-shadow ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: box-shadow;
  }

  button wui-flex.avatar-container {
    width: 28px;
    height: 24px;
    position: relative;

    wui-flex.network-image-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
    }

    wui-flex.network-image-container wui-icon {
      background: ${({tokens:t})=>t.theme.foregroundPrimary};
    }

    wui-avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }

    wui-icon {
      width: 12px;
      height: 12px;
    }
  }

  wui-image,
  wui-icon {
    border-radius: ${({borderRadius:t})=>t[16]};
  }

  wui-text {
    white-space: nowrap;
  }

  button wui-flex.balance-container {
    height: 100%;
    border-radius: ${({borderRadius:t})=>t[16]};
    padding-left: ${({spacing:t})=>t[1]};
    padding-right: ${({spacing:t})=>t[1]};
    background: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textPrimary};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:focus-visible:enabled,
  button:active:enabled {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

    wui-flex.balance-container {
      background: ${({tokens:t})=>t.theme.foregroundTertiary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled wui-text,
  button:disabled wui-flex.avatar-container {
    opacity: 0.3;
  }
`;var he=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Y=class extends f{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return l`
      <button
        ?disabled=${this.disabled}
        class=${w(this.balance?void 0:"local-no-balance")}
        data-error=${w(this.isUnsupportedChain)}
      >
        ${this.imageTemplate()} ${this.addressTemplate()} ${this.balanceTemplate()}
      </button>
    `}imageTemplate(){const e=this.networkSrc?l`<wui-image src=${this.networkSrc}></wui-image>`:l` <wui-icon size="inherit" color="inherit" name="networkPlaceholder"></wui-icon> `;return l`<wui-flex class="avatar-container">
      <wui-avatar
        .imageSrc=${this.avatarSrc}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>

      <wui-flex class="network-image-container">${e}</wui-flex>
    </wui-flex>`}addressTemplate(){return l`<wui-text variant="md-regular" color="inherit">
      ${this.address?z.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
    </wui-text>`}balanceTemplate(){if(this.balance){const e=this.loading?l`<wui-loading-spinner size="md" color="inherit"></wui-loading-spinner>`:l`<wui-text variant="md-regular" color="inherit"> ${this.balance}</wui-text>`;return l`<wui-flex alignItems="center" justifyContent="center" class="balance-container"
        >${e}</wui-flex
      >`}return null}};Y.styles=[I,W,an];he([c()],Y.prototype,"networkSrc",void 0);he([c()],Y.prototype,"avatarSrc",void 0);he([c()],Y.prototype,"balance",void 0);he([c({type:Boolean})],Y.prototype,"isUnsupportedChain",void 0);he([c({type:Boolean})],Y.prototype,"disabled",void 0);he([c({type:Boolean})],Y.prototype,"loading",void 0);he([c()],Y.prototype,"address",void 0);he([c()],Y.prototype,"profileName",void 0);he([c()],Y.prototype,"charsStart",void 0);he([c()],Y.prototype,"charsEnd",void 0);Y=he([p("wui-account-button")],Y);var M=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};class V extends f{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=b.state.allowUnsupportedChain?!0:u.state.activeChain?u.checkIfSupportedNetwork(u.state.activeChain):!0}connectedCallback(){super.connectedCallback(),this.setAccountData(u.getAccountData(this.namespace)),this.setNetworkData(u.getNetworkData(this.namespace))}firstUpdated(){const e=this.namespace;e?this.unsubscribe.push(u.subscribeChainProp("accountState",i=>{this.setAccountData(i)},e),u.subscribeChainProp("networkState",i=>{var o;this.setNetworkData(i),this.isSupported=u.checkIfSupportedNetwork(e,(o=i==null?void 0:i.caipNetwork)==null?void 0:o.caipNetworkId)},e)):this.unsubscribe.push(De.subscribeNetworkImages(()=>{this.networkImage=A.getNetworkImage(this.network)}),u.subscribeKey("activeCaipAddress",i=>{this.caipAddress=i}),u.subscribeChainProp("accountState",i=>{this.setAccountData(i)}),u.subscribeKey("activeCaipNetwork",i=>{this.network=i,this.networkImage=A.getNetworkImage(i),this.isSupported=i!=null&&i.chainNamespace?u.checkIfSupportedNetwork(i==null?void 0:i.chainNamespace):!0,this.fetchNetworkImage(i)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!u.state.activeChain)return null;const e=this.balance==="show",i=typeof this.balanceVal!="string",{formattedText:o}=g.parseBalance(this.balanceVal,this.balanceSymbol);return l`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${b.state.allowUnsupportedChain?!1:!this.isSupported}
        address=${w(g.getPlainAddress(this.caipAddress))}
        profileName=${w(this.profileName)}
        networkSrc=${w(this.networkImage)}
        avatarSrc=${w(this.profileImage)}
        balance=${e?o:""}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:""}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${i}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||b.state.allowUnsupportedChain?P.open({namespace:this.namespace}):P.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){var i,o;(i=e==null?void 0:e.assets)!=null&&i.imageId&&(this.networkImage=await A.fetchNetworkImage((o=e==null?void 0:e.assets)==null?void 0:o.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=A.getNetworkImage(e.caipNetwork))}}M([c({type:Boolean})],V.prototype,"disabled",void 0);M([c()],V.prototype,"balance",void 0);M([c()],V.prototype,"charsStart",void 0);M([c()],V.prototype,"charsEnd",void 0);M([c()],V.prototype,"namespace",void 0);M([d()],V.prototype,"caipAddress",void 0);M([d()],V.prototype,"balanceVal",void 0);M([d()],V.prototype,"balanceSymbol",void 0);M([d()],V.prototype,"profileName",void 0);M([d()],V.prototype,"profileImage",void 0);M([d()],V.prototype,"network",void 0);M([d()],V.prototype,"networkImage",void 0);M([d()],V.prototype,"isSupported",void 0);let fi=class extends V{};fi=M([p("w3m-account-button")],fi);let mi=class extends V{};mi=M([p("appkit-account-button")],mi);const ln=oe`
  :host {
    display: block;
    width: max-content;
  }
`;var pe=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};class re extends f{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){var e;this.caipAddress=this.namespace?(e=u.getAccountData(this.namespace))==null?void 0:e.caipAddress:u.state.activeCaipAddress,this.namespace?this.unsubscribe.push(u.subscribeChainProp("accountState",i=>{this.caipAddress=i==null?void 0:i.caipAddress},this.namespace)):this.unsubscribe.push(u.subscribeKey("activeCaipAddress",i=>this.caipAddress=i))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?l`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${w(this.balance)}
            .charsStart=${w(this.charsStart)}
            .charsEnd=${w(this.charsEnd)}
            namespace=${w(this.namespace)}
          >
          </appkit-account-button>
        `:l`
          <appkit-connect-button
            size=${w(this.size)}
            label=${w(this.label)}
            loadingLabel=${w(this.loadingLabel)}
            namespace=${w(this.namespace)}
          ></appkit-connect-button>
        `}}re.styles=ln;pe([c({type:Boolean})],re.prototype,"disabled",void 0);pe([c()],re.prototype,"balance",void 0);pe([c()],re.prototype,"size",void 0);pe([c()],re.prototype,"label",void 0);pe([c()],re.prototype,"loadingLabel",void 0);pe([c()],re.prototype,"charsStart",void 0);pe([c()],re.prototype,"charsEnd",void 0);pe([c()],re.prototype,"namespace",void 0);pe([d()],re.prototype,"caipAddress",void 0);let bi=class extends re{};bi=pe([p("w3m-button")],bi);let gi=class extends re{};gi=pe([p("appkit-button")],gi);const cn=$`
  :host {
    position: relative;
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='sm'] {
    padding: ${({spacing:t})=>t[2]};
  }

  button[data-size='md'] {
    padding: ${({spacing:t})=>t[3]};
  }

  button[data-size='lg'] {
    padding: ${({spacing:t})=>t[4]};
  }

  button[data-variant='primary'] {
    background: ${({tokens:t})=>t.core.backgroundAccentPrimary};
  }

  button[data-variant='secondary'] {
    background: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button:hover:enabled {
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  button:disabled {
    cursor: not-allowed;
  }

  button[data-loading='true'] {
    cursor: not-allowed;
  }

  button[data-loading='true'][data-size='sm'] {
    border-radius: ${({borderRadius:t})=>t[32]};
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
  }

  button[data-loading='true'][data-size='md'] {
    border-radius: ${({borderRadius:t})=>t[20]};
    padding: ${({spacing:t})=>t[3]} ${({spacing:t})=>t[4]};
  }

  button[data-loading='true'][data-size='lg'] {
    border-radius: ${({borderRadius:t})=>t[16]};
    padding: ${({spacing:t})=>t[4]} ${({spacing:t})=>t[5]};
  }
`;var ft=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Le=class extends f{constructor(){super(...arguments),this.size="md",this.variant="primary",this.loading=!1,this.text="Connect Wallet"}render(){return l`
      <button
        data-loading=${this.loading}
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.loading}
      >
        ${this.contentTemplate()}
      </button>
    `}contentTemplate(){const e={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},i={primary:"invert",secondary:"accent-primary"};return this.loading?l`<wui-loading-spinner
      color=${i[this.variant]}
      size=${this.size}
    ></wui-loading-spinner>`:l` <wui-text variant=${e[this.size]} color=${i[this.variant]}>
        ${this.text}
      </wui-text>`}};Le.styles=[I,W,cn];ft([c()],Le.prototype,"size",void 0);ft([c()],Le.prototype,"variant",void 0);ft([c({type:Boolean})],Le.prototype,"loading",void 0);ft([c()],Le.prototype,"text",void 0);Le=ft([p("wui-connect-button")],Le);var We=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};class Ne extends f{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=P.state.open,this.loading=this.namespace?P.state.loadingNamespaceMap.get(this.namespace):P.state.loading,this.unsubscribe.push(P.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-connect-button
        size=${w(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:""}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?P.close():this.loading||P.open({view:"Connect",namespace:this.namespace})}}We([c()],Ne.prototype,"size",void 0);We([c()],Ne.prototype,"label",void 0);We([c()],Ne.prototype,"loadingLabel",void 0);We([c()],Ne.prototype,"namespace",void 0);We([d()],Ne.prototype,"open",void 0);We([d()],Ne.prototype,"loading",void 0);let yi=class extends Ne{};yi=We([p("w3m-connect-button")],yi);let xi=class extends Ne{};xi=We([p("appkit-connect-button")],xi);const dn=$`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[32]};
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]}
      ${({spacing:t})=>t[1]} ${({spacing:t})=>t[1]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button[data-size='sm'] > wui-icon-box,
  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-icon-box,
  button[data-size='md'] > wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-icon-box,
  button[data-size='lg'] > wui-image {
    width: 24px;
    height: 24px;
  }

  wui-image,
  wui-icon-box {
    border-radius: ${({borderRadius:t})=>t[32]};
  }
`;var mt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let je=class extends f{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.size="lg"}render(){const e={sm:"sm-regular",md:"md-regular",lg:"lg-regular"};return l`
      <button data-size=${this.size} data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant=${e[this.size]} color="primary">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?l` <wui-icon-box color="error" icon="warningCircle"></wui-icon-box> `:this.imageSrc?l`<wui-image src=${this.imageSrc}></wui-image>`:l` <wui-icon size="xl" color="default" name="networkPlaceholder"></wui-icon> `}};je.styles=[I,W,dn];mt([c()],je.prototype,"imageSrc",void 0);mt([c({type:Boolean})],je.prototype,"isUnsupportedChain",void 0);mt([c({type:Boolean})],je.prototype,"disabled",void 0);mt([c()],je.prototype,"size",void 0);je=mt([p("wui-network-button")],je);const un=oe`
  :host {
    display: block;
    width: max-content;
  }
`;var Ee=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};class ge extends f{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=u.state.activeCaipNetwork,this.networkImage=A.getNetworkImage(this.network),this.caipAddress=u.state.activeCaipAddress,this.loading=P.state.loading,this.isSupported=b.state.allowUnsupportedChain?!0:u.state.activeChain?u.checkIfSupportedNetwork(u.state.activeChain):!0,this.unsubscribe.push(De.subscribeNetworkImages(()=>{this.networkImage=A.getNetworkImage(this.network)}),u.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),u.subscribeKey("activeCaipNetwork",e=>{var i;this.network=e,this.networkImage=A.getNetworkImage(e),this.isSupported=e!=null&&e.chainNamespace?u.checkIfSupportedNetwork(e.chainNamespace):!0,A.fetchNetworkImage((i=e==null?void 0:e.assets)==null?void 0:i.imageId)}),P.subscribeKey("loading",e=>this.loading=e))}firstUpdated(){var e,i;A.fetchNetworkImage((i=(e=this.network)==null?void 0:e.assets)==null?void 0:i.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.network?u.checkIfSupportedNetwork(this.network.chainNamespace):!0;return l`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${b.state.allowUnsupportedChain?!1:!e}
        imageSrc=${w(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?!this.isSupported&&!b.state.allowUnsupportedChain?"Switch Network":this.network.name:this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(S.sendEvent({type:"track",event:"CLICK_NETWORKS"}),P.open({view:"Networks"}))}}ge.styles=un;Ee([c({type:Boolean})],ge.prototype,"disabled",void 0);Ee([c({type:String})],ge.prototype,"label",void 0);Ee([d()],ge.prototype,"network",void 0);Ee([d()],ge.prototype,"networkImage",void 0);Ee([d()],ge.prototype,"caipAddress",void 0);Ee([d()],ge.prototype,"loading",void 0);Ee([d()],ge.prototype,"isSupported",void 0);let vi=class extends ge{};vi=Ee([p("w3m-network-button")],vi);let $i=class extends ge{};$i=Ee([p("appkit-network-button")],$i);const hn=$`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[4]};
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  wui-flex > wui-icon {
    padding: ${({spacing:t})=>t[2]};
    color: ${({tokens:t})=>t.theme.textInvert};
    background-color: ${({tokens:t})=>t.core.backgroundAccentPrimary};
    border-radius: ${({borderRadius:t})=>t[2]};
    align-items: normal;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.core.foregroundAccent020};
    }
  }
`;var Bt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Xe=class extends f{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return l`
      <button>
        <wui-flex gap="2" alignItems="center">
          <wui-icon weight="fill" size="md" name=${this.icon} color="inherit"></wui-icon>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.label}</wui-text>
            <wui-text variant="md-regular" color="tertiary">${this.description}</wui-text>
          </wui-flex>
        </wui-flex>
        <wui-icon size="lg" color="accent-primary" name="chevronRight"></wui-icon>
      </button>
    `}};Xe.styles=[I,W,hn];Bt([c()],Xe.prototype,"label",void 0);Bt([c()],Xe.prototype,"description",void 0);Bt([c()],Xe.prototype,"icon",void 0);Xe=Bt([p("wui-notice-card")],Xe);var Di=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let qt=class extends f{constructor(){super(),this.unsubscribe=[],this.socialProvider=Te.getConnectedSocialProvider(),this.socialUsername=Te.getConnectedSocialUsername(),this.namespace=u.state.activeChain,this.unsubscribe.push(u.subscribeKey("activeChain",e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=y.getConnectorId(this.namespace),i=y.getAuthConnector();if(!i||e!==k.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;const o=i.provider.getEmail()??"";return!o&&!this.socialUsername?(this.style.cssText="display: none",null):l`
      <wui-list-item
        ?rounded=${!0}
        icon=${this.socialProvider??"mail"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(o,this.socialProvider)}}
      >
        <wui-text variant="lg-regular" color="primary">${this.getAuthName(o)}</wui-text>
      </wui-list-item>
    `}onGoToUpdateEmail(e,i){i||h.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?this.socialProvider==="discord"&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};Di([d()],qt.prototype,"namespace",void 0);qt=Di([p("w3m-account-auth-button")],qt);var ye=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let de=class extends f{constructor(){var e,i,o;super(),this.usubscribe=[],this.networkImages=De.state.networkImages,this.address=(e=u.getAccountData())==null?void 0:e.address,this.profileImage=(i=u.getAccountData())==null?void 0:i.profileImage,this.profileName=(o=u.getAccountData())==null?void 0:o.profileName,this.network=u.state.activeCaipNetwork,this.disconnecting=!1,this.loading=!1,this.switched=!1,this.text="",this.remoteFeatures=b.state.remoteFeatures,this.usubscribe.push(u.subscribeChainProp("accountState",r=>{r&&(this.address=r.address,this.profileImage=r.profileImage,this.profileName=r.profileName)}),u.subscribeKey("activeCaipNetwork",r=>{r!=null&&r.id&&(this.network=r)}),b.subscribeKey("remoteFeatures",r=>{this.remoteFeatures=r}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){var i,o,r;if(!this.address)throw new Error("w3m-account-settings-view: No account provided");const e=this.networkImages[((o=(i=this.network)==null?void 0:i.assets)==null?void 0:o.imageId)??""];return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["0","5","3","5"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${w(this.profileImage)}
          size="lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="1" alignItems="center" justifyContent="center">
            <wui-text variant="h5-medium" color="primary" data-testid="account-settings-address">
              ${z.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="default"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            imageSrc=${w(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            ?fullSize=${!0}
            ?rounded=${!0}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="lg-regular" color="primary">
              ${((r=this.network)==null?void 0:r.name)??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.togglePreferredAccountBtnTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            ?rounded=${!0}
            icon="power"
            iconColor="error"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){var n;const e=(n=this.network)==null?void 0:n.chainNamespace,i=y.getConnectorId(e),o=y.getAuthConnector();return!u.checkIfNamesSupported()||!o||i!==k.CONNECTOR_ID.AUTH||this.profileName?null:l`
      <wui-list-item
        icon="id"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="lg-regular" color="primary">Choose account name </wui-text>
      </wui-list-item>
    `}authCardTemplate(){var r;const e=y.getConnectorId((r=this.network)==null?void 0:r.chainNamespace),i=y.getAuthConnector(),{origin:o}=location;return!i||e!==k.CONNECTOR_ID.AUTH||o.includes(D.SECURE_SITE)?null:l`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){const e=u.getAllRequestedCaipNetworks(),i=e?e.length>1:!1,o=e==null?void 0:e.find(({id:r})=>{var n;return r===((n=this.network)==null?void 0:n.id)});return i||!o}onCopyAddress(){try{this.address&&(g.copyToClopboard(this.address),T.showSuccess("Address copied"))}catch{T.showError("Failed to copy")}}togglePreferredAccountBtnTemplate(){var n;const e=(n=this.network)==null?void 0:n.chainNamespace,i=u.checkIfSmartAccountEnabled(),o=y.getConnectorId(e);return!y.getAuthConnector()||o!==k.CONNECTOR_ID.AUTH||!i?null:(this.switched||(this.text=Ie(e)===ce.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),l`
      <wui-list-item
        icon="swapHorizontal"
        ?rounded=${!0}
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      </wui-list-item>
    `)}onChooseName(){h.push("ChooseAccountName")}async changePreferredAccountType(){var n;const e=(n=this.network)==null?void 0:n.chainNamespace,i=u.checkIfSmartAccountEnabled(),o=Ie(e)===ce.ACCOUNT_TYPES.SMART_ACCOUNT||!i?ce.ACCOUNT_TYPES.EOA:ce.ACCOUNT_TYPES.SMART_ACCOUNT;y.getAuthConnector()&&(this.loading=!0,await x.setPreferredAccountType(o,e),this.text=o===ce.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,Xi.resetSend(),this.loading=!1,this.requestUpdate())}onNetworks(){this.isAllowedNetworkSwitch()&&h.push("Networks")}async onDisconnect(){var e,i;try{this.disconnecting=!0;const o=(e=this.network)==null?void 0:e.chainNamespace,n=x.getConnections(o).length>0,s=o&&y.state.activeConnectorIds[o],a=(i=this.remoteFeatures)==null?void 0:i.multiWallet;await x.disconnect(a?{id:s,namespace:o}:{}),n&&a&&(h.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{S.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){S.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),h.push("UpgradeEmailWallet")}};ye([d()],de.prototype,"address",void 0);ye([d()],de.prototype,"profileImage",void 0);ye([d()],de.prototype,"profileName",void 0);ye([d()],de.prototype,"network",void 0);ye([d()],de.prototype,"disconnecting",void 0);ye([d()],de.prototype,"loading",void 0);ye([d()],de.prototype,"switched",void 0);ye([d()],de.prototype,"text",void 0);ye([d()],de.prototype,"remoteFeatures",void 0);de=ye([p("w3m-account-settings-view")],de);const pn=$`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    color: ${({tokens:t})=>t.theme.textSecondary};
    border-radius: ${({borderRadius:t})=>t[20]};
    background-color: transparent;
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:t})=>t.theme.textPrimary};
    background-color: ${({tokens:t})=>t.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:t})=>t.theme.textPrimary};
    }
  }
`;var bt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const wn={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},fn={lg:"md",md:"sm",sm:"sm"};let Be=class extends f{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return l`
      <button data-active=${this.active}>
        ${this.icon?l`<wui-icon size=${fn[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${wn[this.size]}> ${this.label} </wui-text>
      </button>
    `}};Be.styles=[I,W,pn];bt([c()],Be.prototype,"icon",void 0);bt([c()],Be.prototype,"size",void 0);bt([c()],Be.prototype,"label",void 0);bt([c({type:Boolean})],Be.prototype,"active",void 0);Be=bt([p("wui-tab-item")],Be);const mn=$`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    border-radius: ${({borderRadius:t})=>t[32]};
    padding: ${({spacing:t})=>t["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var gt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ue=class extends f{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,i)=>{var r;const o=i===this.activeTab;return l`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${o}
          data-active=${o}
          data-testid="tab-${(r=e.label)==null?void 0:r.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};Ue.styles=[I,W,mn];gt([c({type:Array})],Ue.prototype,"tabs",void 0);gt([c()],Ue.prototype,"onTabChange",void 0);gt([c()],Ue.prototype,"size",void 0);gt([d()],Ue.prototype,"activeTab",void 0);Ue=gt([p("wui-tabs")],Ue);const bn=$`
  button {
    display: flex;
    align-items: center;
    height: 40px;
    padding: ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[4]};
    column-gap: ${({spacing:t})=>t[1]};
    background-color: transparent;
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  wui-image,
  .icon-box {
    width: ${({spacing:t})=>t[6]};
    height: ${({spacing:t})=>t[6]};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: 8px;
    height: 8px;
    background-color: ${({tokens:t})=>t.core.textSuccess};
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: 50%;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }
`;var xe=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ie=class extends f{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){const e=this.icon?l`<wui-icon
          size=${w(this.iconSize)}
          color="default"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:l`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return l`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${!!this.icon}
      >
        ${e}
        <wui-flex class="circle"></wui-flex>
      </wui-flex>
    `}textTemplate(){return l`
      <wui-text variant="lg-regular" color="primary">
        ${z.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return l`<wui-icon name="chevronBottom" size="sm" color="default"></wui-icon>`}};ie.styles=[I,W,bn];xe([c()],ie.prototype,"address",void 0);xe([c()],ie.prototype,"profileName",void 0);xe([c()],ie.prototype,"alt",void 0);xe([c()],ie.prototype,"imageSrc",void 0);xe([c()],ie.prototype,"icon",void 0);xe([c()],ie.prototype,"iconSize",void 0);xe([c({type:Boolean})],ie.prototype,"loading",void 0);xe([c({type:Number})],ie.prototype,"charsStart",void 0);xe([c({type:Number})],ie.prototype,"charsEnd",void 0);ie=xe([p("wui-wallet-switch")],ie);const gn=$`
  wui-icon-link {
    margin-right: calc(${({spacing:t})=>t[8]} * -1);
  }

  wui-notice-card {
    margin-bottom: ${({spacing:t})=>t[1]};
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .balance-container {
    display: inline;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .symbol {
    transform: translateY(-2px);
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:t})=>t[3]};
    height: 48px;
    padding: ${({spacing:t})=>t[2]};
    padding-right: ${({spacing:t})=>t[3]};
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.theme.foregroundPrimary};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[6]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
  }

  .account-button:hover {
    background-color: ${({tokens:t})=>t.core.glass010};
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.core.glass010};
  }

  wui-wallet-switch {
    margin-top: ${({spacing:t})=>t[2]};
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.core.glass010};
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color ${({durations:t})=>t.md}
        ${({easings:t})=>t["ease-out-power-1"]},
      opacity ${({durations:t})=>t.md} ${({easings:t})=>t["ease-out-power-1"]};
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`;var se=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let H=class extends f{constructor(){var e,i,o,r,n,s;super(),this.unsubscribe=[],this.caipAddress=(e=u.getAccountData())==null?void 0:e.caipAddress,this.address=g.getPlainAddress((i=u.getAccountData())==null?void 0:i.caipAddress),this.profileImage=(o=u.getAccountData())==null?void 0:o.profileImage,this.profileName=(r=u.getAccountData())==null?void 0:r.profileName,this.disconnecting=!1,this.balance=(n=u.getAccountData())==null?void 0:n.balance,this.balanceSymbol=(s=u.getAccountData())==null?void 0:s.balanceSymbol,this.features=b.state.features,this.remoteFeatures=b.state.remoteFeatures,this.namespace=u.state.activeChain,this.activeConnectorIds=y.state.activeConnectorIds,this.unsubscribe.push(u.subscribeChainProp("accountState",a=>{this.address=g.getPlainAddress(a==null?void 0:a.caipAddress),this.caipAddress=a==null?void 0:a.caipAddress,this.balance=a==null?void 0:a.balance,this.balanceSymbol=a==null?void 0:a.balanceSymbol,this.profileName=a==null?void 0:a.profileName,this.profileImage=a==null?void 0:a.profileImage}),b.subscribeKey("features",a=>this.features=a),b.subscribeKey("remoteFeatures",a=>this.remoteFeatures=a),y.subscribeKey("activeConnectorIds",a=>{this.activeConnectorIds=a}),u.subscribeKey("activeChain",a=>this.namespace=a),u.subscribeKey("activeCaipNetwork",a=>{a!=null&&a.chainNamespace&&(this.namespace=a==null?void 0:a.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;const e=this.activeConnectorIds[this.namespace],i=e?y.getConnectorById(e):void 0,o=A.getConnectorImage(i),{value:r,decimals:n,symbol:s}=g.parseBalance(this.balance,this.balanceSymbol);return l`<wui-flex
        flexDirection="column"
        .padding=${["0","5","4","5"]}
        alignItems="center"
        gap="3"
      >
        <wui-avatar
          alt=${w(this.caipAddress)}
          address=${w(g.getPlainAddress(this.caipAddress))}
          imageSrc=${w(this.profileImage===null?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${o}
          alt=${i==null?void 0:i.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <div class="balance-container">
          <wui-text variant="h3-regular" color="primary">${r}</wui-text>
          <wui-text variant="h3-regular" color="secondary">.${n}</wui-text>
          <wui-text variant="h6-medium" color="primary" class="symbol">${s}</wui-text>
        </div>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="2" .padding=${["0","3","3","3"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          .rounded=${!0}
          icon="power"
          iconColor="error"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          .rightIcon=${!1}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){var n,s;if(!this.namespace)return null;const e=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),i=!!((n=this.features)!=null&&n.receive),o=((s=this.remoteFeatures)==null?void 0:s.onramp)&&e,r=ee.isPayWithExchangeEnabled();return!o&&!i&&!r?null:l`
      <wui-list-item
        .rounded=${!0}
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="lg-regular" color="primary">Fund wallet</wui-text>
      </wui-list-item>
    `}orderedFeaturesTemplate(){var i;return(((i=this.features)==null?void 0:i.walletFeaturesOrder)||D.DEFAULT_FEATURES.walletFeaturesOrder).map(o=>{switch(o){case"onramp":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){var i;return this.namespace&&((i=this.remoteFeatures)==null?void 0:i.activity)&&D.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?l` <wui-list-item
          .rounded=${!0}
          icon="clock"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="lg-regular" color="primary">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){var o;const e=(o=this.remoteFeatures)==null?void 0:o.swaps,i=u.state.activeChain===k.CHAIN.EVM;return!e||!i?null:l`
      <wui-list-item
        .rounded=${!0}
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="lg-regular" color="primary">Swap</wui-text>
      </wui-list-item>
    `}sendTemplate(){var r;const e=(r=this.features)==null?void 0:r.send,i=u.state.activeChain;if(!i)throw new Error("SendController:sendTemplate - namespace is required");const o=D.SEND_SUPPORTED_NAMESPACES.includes(i);return!e||!o?null:l`
      <wui-list-item
        .rounded=${!0}
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="lg-regular" color="primary">Send</wui-text>
      </wui-list-item>
    `}authCardTemplate(){const e=u.state.activeChain;if(!e)throw new Error("AuthCardTemplate:authCardTemplate - namespace is required");const i=y.getConnectorId(e),o=y.getAuthConnector(),{origin:r}=location;return!o||i!==k.CONNECTOR_ID.AUTH||r.includes(D.SECURE_SITE)?null:l`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){h.push("FundWallet")}handleClickSwap(){h.push("Swap")}handleClickSend(){h.push("WalletSend")}explorerBtnTemplate(){var i;return((i=u.getAccountData())==null?void 0:i.addressExplorerUrl)?l`
      <wui-button size="md" variant="accent-primary" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){S.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:Ie(u.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),h.push("Transactions")}async onDisconnect(){var e;try{this.disconnecting=!0;const o=x.getConnections(this.namespace).length>0,r=this.namespace&&y.state.activeConnectorIds[this.namespace],n=(e=this.remoteFeatures)==null?void 0:e.multiWallet;await x.disconnect(n?{id:r,namespace:this.namespace}:{}),o&&n&&(h.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{S.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){var i;const e=(i=u.getAccountData())==null?void 0:i.addressExplorerUrl;e&&g.openHref(e,"_blank")}onGoToUpgradeView(){S.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),h.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){h.push("ProfileWallets")}};H.styles=gn;se([d()],H.prototype,"caipAddress",void 0);se([d()],H.prototype,"address",void 0);se([d()],H.prototype,"profileImage",void 0);se([d()],H.prototype,"profileName",void 0);se([d()],H.prototype,"disconnecting",void 0);se([d()],H.prototype,"balance",void 0);se([d()],H.prototype,"balanceSymbol",void 0);se([d()],H.prototype,"features",void 0);se([d()],H.prototype,"remoteFeatures",void 0);se([d()],H.prototype,"namespace",void 0);se([d()],H.prototype,"activeConnectorIds",void 0);H=se([p("w3m-account-default-widget")],H);const yn=$`
  span {
    font-weight: 500;
    font-size: 38px;
    color: ${({tokens:t})=>t.theme.textPrimary};
    line-height: 38px;
    letter-spacing: -2%;
    text-align: center;
    font-family: var(--apkt-fontFamily-regular);
  }

  .pennies {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }
`;var ai=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ut=class extends f{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return l`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};ut.styles=[I,yn];ai([c()],ut.prototype,"dollars",void 0);ai([c()],ut.prototype,"pennies",void 0);ut=ai([p("wui-balance")],ut);const xn=$`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  /* -- Variants --------------------------------------------------------- */
  :host([data-variant='fill']) {
    background-color: ${({colors:t})=>t.neutrals100};
  }

  :host([data-variant='shade']) {
    background-color: ${({colors:t})=>t.neutrals900};
  }

  :host([data-variant='fill']) > wui-text {
    color: ${({colors:t})=>t.black};
  }

  :host([data-variant='shade']) > wui-text {
    color: ${({colors:t})=>t.white};
  }

  :host([data-variant='fill']) > wui-icon {
    color: ${({colors:t})=>t.neutrals100};
  }

  :host([data-variant='shade']) > wui-icon {
    color: ${({colors:t})=>t.neutrals900};
  }

  /* -- Sizes --------------------------------------------------------- */
  :host([data-size='sm']) {
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='md']) {
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  /* -- Placements --------------------------------------------------------- */
  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var yt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const vn={sm:"sm-regular",md:"md-regular"};let ze=class extends f{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.size="md",this.message=""}render(){return this.dataset.variant=this.variant,this.dataset.size=this.size,l`<wui-icon data-placement=${this.placement} size="inherit" name="cursor"></wui-icon>
      <wui-text variant=${vn[this.size]}>${this.message}</wui-text>`}};ze.styles=[I,W,xn];yt([c()],ze.prototype,"placement",void 0);yt([c()],ze.prototype,"variant",void 0);yt([c()],ze.prototype,"size",void 0);yt([c()],ze.prototype,"message",void 0);ze=yt([p("wui-tooltip")],ze);const $n=oe`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`;var Cn=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Gt=class extends f{render(){return l`<w3m-activity-list page="account"></w3m-activity-list>`}};Gt.styles=$n;Gt=Cn([p("w3m-account-activity-widget")],Gt);const Sn=$`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({spacing:t})=>t[4]};
    padding: ${({spacing:t})=>t[4]};
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    max-width: 174px;
  }

  .tag-container {
    width: fit-content;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }
`;var it=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let _e=class extends f{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.disabled=!1}render(){return l`
      <button ?disabled=${this.disabled}>
        <wui-flex alignItems="center" gap="3">
          <wui-icon-box padding="2" color="secondary" icon=${this.icon} size="lg"></wui-icon-box>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.text}</wui-text>
            ${this.description?l`<wui-text variant="md-regular" color="secondary">
                  ${this.description}</wui-text
                >`:null}
          </wui-flex>
        </wui-flex>

        <wui-flex class="tag-container" alignItems="center" gap="1" justifyContent="flex-end">
          ${this.tag?l`<wui-tag tagType="main" size="sm">${this.tag}</wui-tag>`:null}
          <wui-icon size="md" name="chevronRight" color="default"></wui-icon>
        </wui-flex>
      </button>
    `}};_e.styles=[I,W,Sn];it([c()],_e.prototype,"icon",void 0);it([c()],_e.prototype,"text",void 0);it([c()],_e.prototype,"description",void 0);it([c()],_e.prototype,"tag",void 0);it([c({type:Boolean})],_e.prototype,"disabled",void 0);_e=it([p("wui-list-description")],_e);const En=oe`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`;var li=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ht=class extends f{constructor(){var e;super(),this.unsubscribe=[],this.tokenBalance=(e=u.getAccountData())==null?void 0:e.tokenBalance,this.remoteFeatures=b.state.remoteFeatures,this.unsubscribe.push(u.subscribeChainProp("accountState",i=>{this.tokenBalance=i==null?void 0:i.tokenBalance}),b.subscribeKey("remoteFeatures",i=>{this.remoteFeatures=i}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`${this.tokenTemplate()}`}tokenTemplate(){var e;return this.tokenBalance&&((e=this.tokenBalance)==null?void 0:e.length)>0?l`<wui-flex class="contentContainer" flexDirection="column" gap="2">
        ${this.tokenItemTemplate()}
      </wui-flex>`:l` <wui-flex flexDirection="column">
      ${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){var e;return(e=this.remoteFeatures)!=null&&e.onramp?l`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:l``}tokenItemTemplate(){var e;return(e=this.tokenBalance)==null?void 0:e.map(i=>l`<wui-list-token
          tokenName=${i.name}
          tokenImageUrl=${i.iconUrl}
          tokenAmount=${i.quantity.numeric}
          tokenValue=${i.value}
          tokenCurrency=${i.symbol}
        ></wui-list-token>`)}onReceiveClick(){h.push("WalletReceive")}onBuyClick(){S.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:Ie(u.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),h.push("OnRampProviders")}};ht.styles=En;li([d()],ht.prototype,"tokenBalance",void 0);li([d()],ht.prototype,"remoteFeatures",void 0);ht=li([p("w3m-account-tokens-widget")],ht);const kn=$`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * ${({spacing:t})=>t[4]});
  }

  wui-promo + wui-profile-button {
    margin-top: ${({spacing:t})=>t[4]};
  }

  wui-tabs {
    width: 100%;
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
`;var we=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let X=class extends f{constructor(){var e,i,o,r;super(...arguments),this.unsubscribe=[],this.network=u.state.activeCaipNetwork,this.profileName=(e=u.getAccountData())==null?void 0:e.profileName,this.address=(i=u.getAccountData())==null?void 0:i.address,this.currentTab=(o=u.getAccountData())==null?void 0:o.currentTab,this.tokenBalance=(r=u.getAccountData())==null?void 0:r.tokenBalance,this.features=b.state.features,this.namespace=u.state.activeChain,this.activeConnectorIds=y.state.activeConnectorIds,this.remoteFeatures=b.state.remoteFeatures}firstUpdated(){u.fetchTokenBalance(),this.unsubscribe.push(u.subscribeChainProp("accountState",e=>{e!=null&&e.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):P.close()}),y.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),u.subscribeKey("activeChain",e=>this.namespace=e),u.subscribeKey("activeCaipNetwork",e=>this.network=e),b.subscribeKey("features",e=>this.features=e),b.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}render(){if(!this.address)throw new Error("w3m-account-features-widget: No account provided");if(!this.namespace)return null;const e=this.activeConnectorIds[this.namespace],i=e?y.getConnectorById(e):void 0,{icon:o,iconSize:r}=this.getAuthData();return l`<wui-flex
      flexDirection="column"
      .padding=${["0","3","4","3"]}
      alignItems="center"
      gap="4"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="2">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${o}
          iconSize=${r}
          alt=${i==null?void 0:i.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){var n;const e=((n=this.features)==null?void 0:n.walletFeaturesOrder)||D.DEFAULT_FEATURES.walletFeaturesOrder;if(e.every(s=>{var a,m;return s==="send"||s==="receive"?!((a=this.features)!=null&&a[s]):s==="swaps"||s==="onramp"?!((m=this.remoteFeatures)!=null&&m[s]):!0}))return null;const o=e.map(s=>s==="receive"||s==="onramp"?"fund":s),r=[...new Set(o)];return l`<wui-flex gap="2">
      ${r.map(s=>{switch(s){case"fund":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){var n,s;if(!this.namespace)return null;const e=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),i=(n=this.features)==null?void 0:n.receive,o=((s=this.remoteFeatures)==null?void 0:s.onramp)&&e,r=ee.isPayWithExchangeEnabled();return!o&&!i&&!r?null:l`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          variant="accent-secondary"
          size="lg"
          fullWidth
        >
          <wui-icon name="dollar"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}swapsTemplate(){var o;const e=(o=this.remoteFeatures)==null?void 0:o.swaps,i=u.state.activeChain===k.CHAIN.EVM;return!e||!i?null:l`
      <w3m-tooltip-trigger text="Swap">
        <wui-button
          fullWidth
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="recycleHorizontal"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}sendTemplate(){var r;const e=(r=this.features)==null?void 0:r.send,i=u.state.activeChain,o=D.SEND_SUPPORTED_NAMESPACES.includes(i);return!e||!o?null:l`
      <w3m-tooltip-trigger text="Send">
        <wui-button
          fullWidth
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="send"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}watchSwapValues(){this.watchTokenBalance=setInterval(()=>u.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){e instanceof Error&&e.cause instanceof Response&&e.cause.status===k.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return this.currentTab===0?l`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:this.currentTab===1?l`<w3m-account-activity-widget></w3m-account-activity-widget>`:l`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){var e;if(this.tokenBalance&&((e=this.tokenBalance)==null?void 0:e.length)>=0){const i=g.calculateBalance(this.tokenBalance),{dollars:o="0",pennies:r="00"}=g.formatTokenBalance(i);return l`<wui-balance dollars=${o} pennies=${r}></wui-balance>`}return l`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){const e=oi.getTabsByNamespace(u.state.activeChain);return e.length===0?null:l`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){u.setAccountProp("currentTab",e,this.namespace)}onFundWalletClick(){h.push("FundWallet")}onSwapClick(){var e,i,o;(e=this.network)!=null&&e.caipNetworkId&&!D.SWAP_SUPPORTED_NETWORKS.includes((i=this.network)==null?void 0:i.caipNetworkId)?h.push("UnsupportedChain",{swapUnsupportedChain:!0}):(S.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:((o=this.network)==null?void 0:o.caipNetworkId)||"",isSmartAccount:Ie(u.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),h.push("Swap"))}getAuthData(){const e=Te.getConnectedSocialProvider(),i=Te.getConnectedSocialUsername(),o=y.getAuthConnector(),r=(o==null?void 0:o.provider.getEmail())??"";return{name:$e.getAuthName({email:r,socialUsername:i,socialProvider:e}),icon:e??"mail",iconSize:e?"xl":"md"}}onGoToProfileWalletsView(){h.push("ProfileWallets")}onSendClick(){var e;S.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:((e=this.network)==null?void 0:e.caipNetworkId)||"",isSmartAccount:Ie(u.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}}),h.push("WalletSend")}};X.styles=kn;we([d()],X.prototype,"watchTokenBalance",void 0);we([d()],X.prototype,"network",void 0);we([d()],X.prototype,"profileName",void 0);we([d()],X.prototype,"address",void 0);we([d()],X.prototype,"currentTab",void 0);we([d()],X.prototype,"tokenBalance",void 0);we([d()],X.prototype,"features",void 0);we([d()],X.prototype,"namespace",void 0);we([d()],X.prototype,"activeConnectorIds",void 0);we([d()],X.prototype,"remoteFeatures",void 0);X=we([p("w3m-account-wallet-features-widget")],X);var Li=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Yt=class extends f{constructor(){super(),this.unsubscribe=[],this.namespace=u.state.activeChain,this.unsubscribe.push(u.subscribeKey("activeChain",e=>{this.namespace=e}))}render(){if(!this.namespace)return null;const e=y.getConnectorId(this.namespace),i=y.getAuthConnector();return l`
      ${i&&e===k.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return l`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return l`<w3m-account-default-widget></w3m-account-default-widget>`}};Li([d()],Yt.prototype,"namespace",void 0);Yt=Li([p("w3m-account-view")],Yt);const An=$`
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    border-radius: ${({borderRadius:t})=>t[2]};
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:t})=>t["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var G=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let L=class extends f{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral-primary",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <wui-flex flexDirection="column" rowgap="2">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return l`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?l`<wui-icon-link
              variant="secondary"
              size="md"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return l` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?l`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?l`<wui-icon
                  color="accent-primary"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:l`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return this.content.length===0?null:l`
      <wui-flex flexDirection="column" rowgap="3">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:i,label:o,description:r,enableButton:n,buttonType:s,buttonLabel:a,buttonVariant:m,tagVariant:v,tagLabel:E,alignItems:_="flex-end"}){return l`
      <wui-flex justifyContent="space-between" alignItems=${_} columngap="1">
        <wui-flex flexDirection="column" rowgap="01">
          ${o?l`<wui-text variant="sm-medium" color="secondary">${o}</wui-text>`:null}

          <wui-flex alignItems="center" columngap="1">
            <wui-text variant="md-regular" color="primary">
              ${z.getTruncateString({string:i||e,charsStart:i?16:this.charsStart,charsEnd:i?0:this.charsEnd,truncate:i?"end":"middle"})}
            </wui-text>

            ${v&&E?l`<wui-tag variant=${v} size="sm">${E}</wui-tag>`:null}
          </wui-flex>

          ${r?l`<wui-text variant="sm-regular" color="secondary">${r}</wui-text>`:null}
        </wui-flex>

        ${n?this.buttonTemplate({buttonType:s,buttonLabel:a,buttonVariant:m}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:i,buttonVariant:o}){return l`
      <wui-button
        size="sm"
        variant=${o}
        @click=${e==="disconnect"?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${e==="disconnect"?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${i}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};L.styles=[I,W,An];G([c()],L.prototype,"address",void 0);G([c()],L.prototype,"profileName",void 0);G([c({type:Array})],L.prototype,"content",void 0);G([c()],L.prototype,"alt",void 0);G([c()],L.prototype,"imageSrc",void 0);G([c()],L.prototype,"icon",void 0);G([c()],L.prototype,"iconSize",void 0);G([c()],L.prototype,"iconBadge",void 0);G([c()],L.prototype,"iconBadgeSize",void 0);G([c()],L.prototype,"buttonVariant",void 0);G([c({type:Boolean})],L.prototype,"enableMoreButton",void 0);G([c({type:Number})],L.prototype,"charsStart",void 0);G([c({type:Number})],L.prototype,"charsEnd",void 0);L=G([p("wui-active-profile-wallet-item")],L);const Tn=$`
  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:t})=>t["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var j=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let N=class extends f{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent-primary",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="signOut",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <wui-flex alignItems="center" columngap="2">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?l`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?l`<wui-icon
                  color="default"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:l`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return l`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="lg-regular" color="primary">
          ${z.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return l`
      <wui-flex columngap="1" alignItems="center" justifyContent="center">
        <wui-button
          size="sm"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          variant="secondary"
          size="md"
          icon=${w(this.rightIcon)}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};N.styles=[I,W,Tn];j([c()],N.prototype,"address",void 0);j([c()],N.prototype,"profileName",void 0);j([c()],N.prototype,"alt",void 0);j([c()],N.prototype,"buttonLabel",void 0);j([c()],N.prototype,"buttonVariant",void 0);j([c()],N.prototype,"imageSrc",void 0);j([c()],N.prototype,"icon",void 0);j([c()],N.prototype,"iconSize",void 0);j([c()],N.prototype,"iconBadge",void 0);j([c()],N.prototype,"iconBadgeSize",void 0);j([c()],N.prototype,"rightIcon",void 0);j([c()],N.prototype,"rightIconSize",void 0);j([c({type:Boolean})],N.prototype,"loading",void 0);j([c({type:Number})],N.prototype,"charsStart",void 0);j([c({type:Number})],N.prototype,"charsEnd",void 0);N=j([p("wui-inactive-profile-wallet-item")],N);const Ht={getAuthData(t){var s,a;const e=t.connectorId===k.CONNECTOR_ID.AUTH;if(!e)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};const i=((s=t==null?void 0:t.auth)==null?void 0:s.name)??Te.getConnectedSocialProvider(),o=((a=t==null?void 0:t.auth)==null?void 0:a.username)??Te.getConnectedSocialUsername(),r=y.getAuthConnector(),n=(r==null?void 0:r.provider.getEmail())??"";return{isAuth:!0,icon:i??"mail",iconSize:i?"xl":"md",name:e?$e.getAuthName({email:n,socialUsername:o,socialProvider:i}):void 0}}},In=$`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: ${({spacing:t})=>t[4]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-separator {
    margin: ${({spacing:t})=>t[2]} 0 ${({spacing:t})=>t[2]} 0;
  }

  .active-connection {
    padding: ${({spacing:t})=>t[2]};
  }

  .recent-connection {
    padding: ${({spacing:t})=>t[2]} 0 ${({spacing:t})=>t[2]} 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var Q=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const Z={ADDRESS_DISPLAY:{START:4,END:6},BADGE:{SIZE:"md",ICON:"lightbulb"},SCROLL_THRESHOLD:50,OPACITY_RANGE:[0,1]},ct={eip155:"ethereum",solana:"solana",bip122:"bitcoin"},_n=[{namespace:"eip155",icon:ct.eip155,label:"EVM"},{namespace:"solana",icon:ct.solana,label:"Solana"},{namespace:"bip122",icon:ct.bip122,label:"Bitcoin"}],Rn={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"}};let F=class extends f{constructor(){var e,i,o;super(),this.unsubscribers=[],this.currentTab=0,this.namespace=u.state.activeChain,this.namespaces=Array.from(u.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=y.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=u.state.activeCaipNetwork,this.user=(e=u.getAccountData())==null?void 0:e.user,this.remoteFeatures=b.state.remoteFeatures,this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=(i=u.getAccountData(this.namespace))==null?void 0:i.caipAddress,this.profileName=(o=u.getAccountData(this.namespace))==null?void 0:o.profileName,this.unsubscribers.push(x.subscribeKey("connections",()=>this.onConnectionsChange()),x.subscribeKey("recentConnections",()=>this.requestUpdate()),y.subscribeKey("activeConnectorIds",r=>{this.activeConnectorIds=r}),u.subscribeKey("activeCaipNetwork",r=>this.caipNetwork=r),u.subscribeChainProp("accountState",r=>{this.user=r==null?void 0:r.user}),b.subscribeKey("remoteFeatures",r=>this.remoteFeatures=r)),this.chainListener=u.subscribeChainProp("accountState",r=>{this.caipAddress=r==null?void 0:r.caipAddress,this.profileName=r==null?void 0:r.profileName},this.namespace)}disconnectedCallback(){var e,i;this.unsubscribers.forEach(o=>o()),(e=this.resizeObserver)==null||e.disconnect(),this.removeScrollListener(),(i=this.chainListener)==null||i.call(this)}firstUpdated(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".wallet-list");if(!e)return;const i=()=>this.updateScrollOpacity(e);requestAnimationFrame(i),e.addEventListener("scroll",i),this.resizeObserver=new ResizeObserver(i),this.resizeObserver.observe(e),i()}render(){const e=this.namespace;if(!e)throw new Error("Namespace is not set");return l`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="4">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){const e=_n.filter(o=>this.namespaces.includes(o.namespace));return e.length>1?l`
        <wui-tabs
          .onTabChange=${o=>this.handleTabChange(o)}
          .activeTab=${this.currentTab}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){const o=this.getActiveConnections(e).flatMap(({accounts:r})=>r).length+(this.caipAddress?1:0);return l`
      <wui-flex alignItems="center" columngap="1">
        <wui-icon
          size="sm"
          name=${ct[e]??ct.eip155}
        ></wui-icon>
        <wui-text color="secondary" variant="lg-regular"
          >${o>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="primary"
          variant="lg-regular"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${o}
        </wui-text>
        <wui-link
          color="secondary"
          variant="secondary"
          @click=${()=>x.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){const i=this.hasAnyConnections(e);return l`
      <wui-flex flexDirection="column" class=${Pi({"wallet-list":!0,"active-wallets-box":i,"empty-wallet-list-box":!i})} rowgap="3">
        ${i?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){const i=this.getActiveConnections(e),o=this.activeConnectorIds[e],r=this.getPlainAddress();return l`
      ${r||o||i.length>0?l`<wui-flex
            flexDirection="column"
            .padding=${["4","0","4","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){const i=this.activeConnectorIds[e];if(!i)return null;const{connections:o}=Ae.getConnectionsData(e),r=y.getConnectorById(i),n=A.getConnectorImage(r),s=this.getPlainAddress();if(!s)return null;const a=e===k.CHAIN.BITCOIN,m=Ht.getAuthData({connectorId:i,accounts:[]}),v=this.getActiveConnections(e).flatMap(R=>R.accounts).length>0,E=o.find(R=>R.connectorId===i),_=E==null?void 0:E.accounts.filter(R=>!te.isLowerCaseMatch(R.address,s));return l`
      <wui-flex flexDirection="column" .padding=${["0","4","0","4"]}>
        <wui-active-profile-wallet-item
          address=${s}
          alt=${r==null?void 0:r.name}
          .content=${this.getProfileContent({address:s,connections:o,connectorId:i,namespace:e})}
          .charsStart=${Z.ADDRESS_DISPLAY.START}
          .charsEnd=${Z.ADDRESS_DISPLAY.END}
          .icon=${m.icon}
          .iconSize=${m.iconSize}
          .iconBadge=${this.isSmartAccount(s)?Z.BADGE.ICON:void 0}
          .iconBadgeSize=${this.isSmartAccount(s)?Z.BADGE.SIZE:void 0}
          imageSrc=${n}
          ?enableMoreButton=${m.isAuth}
          @copy=${()=>this.handleCopyAddress(s)}
          @disconnect=${()=>this.handleDisconnect(e,i)}
          @switch=${()=>{a&&E&&(_!=null&&_[0])&&this.handleSwitchWallet(E,_[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(s)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${v?l`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){const i=this.getActiveConnections(e);return i.length===0?null:l`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
        ${this.renderConnectionList(i,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){const{recentConnections:i}=Ae.getConnectionsData(e);return i.flatMap(r=>r.accounts).length===0?null:l`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]} rowGap="2">
        <wui-text color="secondary" variant="sm-medium" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
          ${this.renderConnectionList(i,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,i,o){return e.filter(r=>r.accounts.length>0).map((r,n)=>{const s=y.getConnectorById(r.connectorId),a=A.getConnectorImage(s)??"",m=Ht.getAuthData(r);return r.accounts.map((v,E)=>{const _=n!==0||E!==0,R=this.isAccountLoading(r.connectorId,v.address);return l`
            <wui-flex flexDirection="column">
              ${_?l`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${v.address}
                alt=${r.connectorId}
                buttonLabel=${i?"Connect":"Switch"}
                buttonVariant=${i?"neutral-secondary":"accent-secondary"}
                rightIcon=${i?"bin":"power"}
                rightIconSize="sm"
                class=${i?"recent-connection":"active-connection"}
                data-testid=${i?"recent-connection":"active-connection"}
                imageSrc=${a}
                .iconBadge=${this.isSmartAccount(v.address)?Z.BADGE.ICON:void 0}
                .iconBadgeSize=${this.isSmartAccount(v.address)?Z.BADGE.SIZE:void 0}
                .icon=${m.icon}
                .iconSize=${m.iconSize}
                .loading=${R}
                .showBalance=${!1}
                .charsStart=${Z.ADDRESS_DISPLAY.START}
                .charsEnd=${Z.ADDRESS_DISPLAY.END}
                @buttonClick=${()=>this.handleSwitchWallet(r,v.address,o)}
                @iconClick=${()=>this.handleWalletAction({connection:r,address:v.address,isRecentConnection:i,namespace:o})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(e))return null;const{title:i}=this.getChainLabelInfo(e);return l`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="md-medium" color="secondary">${i}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){const{title:i,description:o}=this.getChainLabelInfo(e);return l`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowgap="3"
          class="empty-box"
        >
          <wui-icon-box size="xl" icon="wallet" color="secondary"></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="1">
            <wui-text color="primary" variant="lg-regular" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="secondary" variant="md-regular" data-testid="empty-state-description"
              >${o}</wui-text
            >
          </wui-flex>

          <wui-link
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
            icon="plus"
          >
            ${i}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){var o,r,n;const i=this.namespaces[e];i&&((o=this.chainListener)==null||o.call(this),this.currentTab=this.namespaces.indexOf(i),this.namespace=i,this.caipAddress=(r=u.getAccountData(i))==null?void 0:r.caipAddress,this.profileName=(n=u.getAccountData(i))==null?void 0:n.profileName,this.chainListener=u.subscribeChainProp("accountState",s=>{this.caipAddress=s==null?void 0:s.caipAddress},i))}async handleSwitchWallet(e,i,o){var r;try{this.isSwitching=!0,this.lastSelectedConnectorId=e.connectorId,this.lastSelectedAddress=i,((r=this.caipNetwork)==null?void 0:r.chainNamespace)!==o&&(e!=null&&e.caipNetwork)&&(y.setFilterByNamespace(o),await u.switchActiveNetwork(e==null?void 0:e.caipNetwork)),await x.switchConnection({connection:e,address:i,namespace:o,closeModalOnConnect:!1,onChange({hasSwitchedAccount:s,hasSwitchedWallet:a}){a?T.showSuccess("Wallet switched"):s&&T.showSuccess("Account switched")}})}catch{T.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(e){const{connection:i,address:o,isRecentConnection:r,namespace:n}=e;r?(Te.deleteAddressFromConnection({connectorId:i.connectorId,address:o,namespace:n}),x.syncStorageConnections(),T.showSuccess("Wallet deleted")):this.handleDisconnect(n,i.connectorId)}async handleDisconnect(e,i){try{await x.disconnect({id:i,namespace:e}),T.showSuccess("Wallet disconnected")}catch{T.showError("Failed to disconnect wallet")}}handleCopyAddress(e){g.copyToClopboard(e),T.showSuccess("Address copied")}handleMore(){h.push("AccountSettings")}handleExternalLink(e){var o,r;const i=(r=(o=this.caipNetwork)==null?void 0:o.blockExplorers)==null?void 0:r.default.url;i&&g.openHref(`${i}/address/${e}`,"_blank")}handleAddConnection(e){y.setFilterByNamespace(e),h.push("Connect",{addWalletForNamespace:e})}getChainLabelInfo(e){return Rn[e]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(e){var o,r;if(!this.namespace)return!1;const i=(r=(o=this.user)==null?void 0:o.accounts)==null?void 0:r.find(n=>n.type==="smartAccount");return i&&e?te.isLowerCaseMatch(i.address,e):!1}getPlainAddress(){return this.caipAddress?g.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){const i=this.activeConnectorIds[e],{connections:o}=Ae.getConnectionsData(e),[r]=o.filter(m=>te.isLowerCaseMatch(m.connectorId,i));if(!i)return o;const n=e===k.CHAIN.BITCOIN,{address:s}=this.caipAddress?Qi.parseCaipAddress(this.caipAddress):{};let a=[...s?[s]:[]];return n&&r&&(a=r.accounts.map(m=>m.address)||[]),Ae.excludeConnectorAddressFromConnections({connectorId:i,addresses:a,connections:o})}hasAnyConnections(e){const i=this.getActiveConnections(e),{recentConnections:o}=Ae.getConnectionsData(e);return!!this.caipAddress||i.length>0||o.length>0}isAccountLoading(e,i){return te.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&te.isLowerCaseMatch(this.lastSelectedAddress,i)&&this.isSwitching}getProfileContent(e){const{address:i,connections:o,connectorId:r,namespace:n}=e,[s]=o.filter(m=>te.isLowerCaseMatch(m.connectorId,r));if(n===k.CHAIN.BITCOIN&&(s!=null&&s.accounts.every(m=>typeof m.type=="string")))return this.getBitcoinProfileContent(s.accounts,i);const a=Ht.getAuthData({connectorId:r,accounts:[]});return[{address:i,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary",...a.isAuth?{description:this.isSmartAccount(i)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(e,i){const o=e.length>1,r=this.getPlainAddress();return e.map(n=>{const s=te.isLowerCaseMatch(n.address,r);let a="PAYMENT";return n.type==="ordinal"&&(a="ORDINALS"),{address:n.address,tagLabel:te.isLowerCaseMatch(n.address,i)?"Active":void 0,tagVariant:te.isLowerCaseMatch(n.address,i)?"success":void 0,enableButton:!0,...o?{label:a,alignItems:"flex-end",buttonType:s?"disconnect":"switch",buttonLabel:s?"Disconnect":"Switch",buttonVariant:s?"neutral-secondary":"accent-secondary"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary"}}})}removeScrollListener(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".wallet-list");e&&e.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".wallet-list");e&&this.updateScrollOpacity(e)}isMultiWalletEnabled(){var e;return!!((e=this.remoteFeatures)!=null&&e.multiWallet)}updateScrollOpacity(e){e.style.setProperty("--connect-scroll--top-opacity",St.interpolate([0,Z.SCROLL_THRESHOLD],Z.OPACITY_RANGE,e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",St.interpolate([0,Z.SCROLL_THRESHOLD],Z.OPACITY_RANGE,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){const{connections:e}=Ae.getConnectionsData(this.namespace);e.length===0&&h.reset("ProfileWallets")}this.requestUpdate()}};F.styles=In;Q([d()],F.prototype,"currentTab",void 0);Q([d()],F.prototype,"namespace",void 0);Q([d()],F.prototype,"namespaces",void 0);Q([d()],F.prototype,"caipAddress",void 0);Q([d()],F.prototype,"profileName",void 0);Q([d()],F.prototype,"activeConnectorIds",void 0);Q([d()],F.prototype,"lastSelectedAddress",void 0);Q([d()],F.prototype,"lastSelectedConnectorId",void 0);Q([d()],F.prototype,"isSwitching",void 0);Q([d()],F.prototype,"caipNetwork",void 0);Q([d()],F.prototype,"user",void 0);Q([d()],F.prototype,"remoteFeatures",void 0);F=Q([p("w3m-profile-wallets-view")],F);var nt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Fe=class extends f{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=u.state.activeCaipNetwork,this.features=b.state.features,this.remoteFeatures=b.state.remoteFeatures,this.exchangesLoading=ee.state.isLoading,this.exchanges=ee.state.exchanges,this.unsubscribe.push(b.subscribeKey("features",e=>this.features=e),b.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),u.subscribeKey("activeCaipNetwork",e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),ee.subscribeKey("isLoading",e=>this.exchangesLoading=e),ee.subscribeKey("exchanges",e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){ee.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await ee.fetchExchanges())}render(){return l`
      <wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;const e=await ee.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),i=e.find(o=>o.metadata.symbol==="USDC")||e[0];i&&ee.setPaymentAsset(i)}onrampTemplate(){var o;if(!this.activeCaipNetwork)return null;const e=(o=this.remoteFeatures)==null?void 0:o.onramp,i=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return!e||!i?null:l`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `}depositFromExchangeTemplate(){return!this.activeCaipNetwork||!ee.isPayWithExchangeSupported()?null:l`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="arrowBottomCircle"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `}receiveTemplate(){var i;return!((i=this.features)!=null&&i.receive)?null:l`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `}onBuyCrypto(){h.push("OnRampProviders")}onReceive(){h.push("WalletReceive")}onDepositFromExchange(){var e;ee.reset(),h.push("PayWithExchange",{redirectView:(e=h.state.data)==null?void 0:e.redirectView})}};nt([d()],Fe.prototype,"activeCaipNetwork",void 0);nt([d()],Fe.prototype,"features",void 0);nt([d()],Fe.prototype,"remoteFeatures",void 0);nt([d()],Fe.prototype,"exchangesLoading",void 0);nt([d()],Fe.prototype,"exchanges",void 0);Fe=nt([p("w3m-fund-wallet-view")],Fe);const Wn=$`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      border ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      box-shadow ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      width ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      height ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({colors:t})=>t.neutrals300};
    border-radius: ${({borderRadius:t})=>t.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      border ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      box-shadow ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      width ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      height ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:t})=>t.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:t})=>t.core.iconAccentPrimary};
    background-color: ${({tokens:t})=>t.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:t})=>t.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:t})=>t.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:t})=>t.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:t})=>t.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:t})=>t.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:t})=>t.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:t})=>t.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:t})=>t.theme.textTertiary};
  }
`;var Ut=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Qe=class extends f{constructor(){super(...arguments),this.inputElementRef=ri(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return l`
      <label data-size=${this.size}>
        <input
          ${si(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){var e;this.dispatchEvent(new CustomEvent("switchChange",{detail:(e=this.inputElementRef.value)==null?void 0:e.checked,bubbles:!0,composed:!0}))}};Qe.styles=[I,W,Wn];Ut([c({type:Boolean})],Qe.prototype,"checked",void 0);Ut([c({type:Boolean})],Qe.prototype,"disabled",void 0);Ut([c()],Qe.prototype,"size",void 0);Qe=Ut([p("wui-toggle")],Qe);const Nn=$`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.theme.foregroundPrimary};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var ji=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let kt=class extends f{constructor(){super(...arguments),this.checked=!1}render(){return l`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};kt.styles=[I,W,Nn];ji([c({type:Boolean})],kt.prototype,"checked",void 0);kt=ji([p("wui-certified-switch")],kt);const On=$`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:t})=>t[3]};
    color: ${({tokens:t})=>t.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:t})=>t[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }
`;var Bi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let At=class extends f{constructor(){super(...arguments),this.inputComponentRef=ri(),this.inputValue=""}render(){return l`
      <wui-input-text
        ${si(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?l`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){const e=this.inputComponentRef.value,i=e==null?void 0:e.inputElementRef.value;i&&(i.value="",this.inputValue="",i.focus(),i.dispatchEvent(new Event("input")))}};At.styles=[I,On];Bi([c()],At.prototype,"inputValue",void 0);At=Bi([p("wui-search-bar")],At);const Pn=$`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:t})=>t[2]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:t})=>t.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Ui=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Tt=class extends f{constructor(){super(...arguments),this.type="wallet"}render(){return l`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?l` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${on}`:l`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Tt.styles=[I,W,Pn];Ui([c()],Tt.prototype,"type",void 0);Tt=Ui([p("wui-card-select-loader")],Tt);const Dn=oe`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var ae=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let K=class extends f{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&z.getSpacingStyles(this.margin,3)};
    `,l`<slot></slot>`}};K.styles=[I,Dn];ae([c()],K.prototype,"gridTemplateRows",void 0);ae([c()],K.prototype,"gridTemplateColumns",void 0);ae([c()],K.prototype,"justifyItems",void 0);ae([c()],K.prototype,"alignItems",void 0);ae([c()],K.prototype,"justifyContent",void 0);ae([c()],K.prototype,"alignContent",void 0);ae([c()],K.prototype,"columnGap",void 0);ae([c()],K.prototype,"rowGap",void 0);ae([c()],K.prototype,"gap",void 0);ae([c()],K.prototype,"padding",void 0);ae([c()],K.prototype,"margin",void 0);K=ae([p("wui-grid")],K);const Ln=$`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[3]} ${({spacing:t})=>t[0]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:t})=>t[4]}, 20px);
    transition:
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-1"]},
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-1"]},
      border-radius ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:t})=>t.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:t})=>t.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:t})=>t.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:t})=>t.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:t})=>t.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var ve=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ne=class extends f{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(i=>{i.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){var i,o;const e=((i=this.wallet)==null?void 0:i.badge_type)==="certified";return l`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${w(e?"certified":void 0)}
            >${(o=this.wallet)==null?void 0:o.name}</wui-text
          >
          ${e?l`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){var e,i;return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():l`
      <wui-wallet-image
        size="lg"
        imageSrc=${w(this.imageSrc)}
        name=${w((e=this.wallet)==null?void 0:e.name)}
        .installed=${((i=this.wallet)==null?void 0:i.installed)??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return l`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=A.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await A.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){!this.wallet||this.isImpressed||(this.isImpressed=!0,S.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:h.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};ne.styles=Ln;ve([d()],ne.prototype,"visible",void 0);ve([d()],ne.prototype,"imageSrc",void 0);ve([d()],ne.prototype,"imageLoading",void 0);ve([d()],ne.prototype,"isImpressed",void 0);ve([c()],ne.prototype,"explorerId",void 0);ve([c()],ne.prototype,"walletQuery",void 0);ve([c()],ne.prototype,"certified",void 0);ve([c()],ne.prototype,"displayIndex",void 0);ve([c({type:Object})],ne.prototype,"wallet",void 0);ne=ve([p("w3m-all-wallets-list-item")],ne);const jn=$`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:t})=>t[4]};
    padding-bottom: ${({spacing:t})=>t[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var Oe=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const Ci="local-paginator";let me=class extends f{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!C.state.wallets.length,this.wallets=C.state.wallets,this.recommended=C.state.recommended,this.featured=C.state.featured,this.filteredWallets=C.state.filteredWallets,this.mobileFullScreen=b.state.enableMobileFullScreen,this.unsubscribe.push(C.subscribeKey("wallets",e=>this.wallets=e),C.subscribeKey("recommended",e=>this.recommended=e),C.subscribeKey("featured",e=>this.featured=e),C.subscribeKey("filteredWallets",e=>this.filteredWallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){var e;this.unsubscribe.forEach(i=>i()),(e=this.paginationObserver)==null||e.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),l`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){var i;this.loading=!0;const e=(i=this.shadowRoot)==null?void 0:i.querySelector("wui-grid");e&&(await C.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,i){return[...Array(e)].map(()=>l`
        <wui-card-select-loader type="wallet" id=${w(i)}></wui-card-select-loader>
      `)}getWallets(){var r;const e=[...this.featured,...this.recommended];((r=this.filteredWallets)==null?void 0:r.length)>0?e.push(...this.filteredWallets):e.push(...this.wallets);const i=g.uniqueBy(e,"id"),o=dt.markWalletsAsInstalled(i);return dt.markWalletsWithDisplayIndex(o)}walletsTemplate(){return this.getWallets().map((i,o)=>l`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${i.id}"
          @click=${()=>this.onConnectWallet(i)}
          .wallet=${i}
          explorerId=${i.id}
          certified=${this.badge==="certified"}
          displayIndex=${o}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){const{wallets:e,recommended:i,featured:o,count:r,mobileFilteredOutWalletsLength:n}=C.state,s=window.innerWidth<352?3:4,a=e.length+i.length;let v=Math.ceil(a/s)*s-a+s;return v-=e.length?o.length%s:0,r===0&&o.length>0?null:r===0||[...o,...e,...i].length<r-(n??0)?this.shimmerTemplate(v,Ci):null}createPaginationObserver(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(`#${Ci}`);e&&(this.paginationObserver=new IntersectionObserver(([o])=>{if(o!=null&&o.isIntersecting&&!this.loading){const{page:r,count:n,wallets:s}=C.state;s.length<n&&C.fetchWalletsByPage({page:r+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){y.selectWalletConnector(e)}};me.styles=jn;Oe([d()],me.prototype,"loading",void 0);Oe([d()],me.prototype,"wallets",void 0);Oe([d()],me.prototype,"recommended",void 0);Oe([d()],me.prototype,"featured",void 0);Oe([d()],me.prototype,"filteredWallets",void 0);Oe([d()],me.prototype,"badge",void 0);Oe([d()],me.prototype,"mobileFullScreen",void 0);me=Oe([p("w3m-all-wallets-list")],me);const Bn=oe`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var xt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Me=class extends f{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=b.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?l`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await C.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:e}=C.state,i=dt.markWalletsAsInstalled(e);return e.length?l`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${i.map((o,r)=>l`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(o)}
              .wallet=${o}
              data-testid="wallet-search-item-${o.id}"
              explorerId=${o.id}
              certified=${this.badge==="certified"}
              walletQuery=${this.query}
              displayIndex=${r}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:l`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){y.selectWalletConnector(e)}};Me.styles=Bn;xt([d()],Me.prototype,"loading",void 0);xt([d()],Me.prototype,"mobileFullScreen",void 0);xt([c()],Me.prototype,"query",void 0);xt([c()],Me.prototype,"badge",void 0);Me=xt([p("w3m-all-wallets-search")],Me);var ci=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let It=class extends f{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=g.debounce(e=>{this.search=e})}render(){const e=this.search.length>=2;return l`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge==="certified"}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?l`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:l`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",T.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return g.isMobile()?l`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){h.push("ConnectingWalletConnect")}};ci([d()],It.prototype,"search",void 0);ci([d()],It.prototype,"badge",void 0);It=ci([p("w3m-all-wallets-view")],It);const Un=$`
  button {
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[4]};
    width: 100%;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    justify-content: center;
    align-items: center;
  }

  :host([data-size='sm']) button {
    padding: ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='md']) button {
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  button:hover {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var ot=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Re=class extends f{constructor(){super(...arguments),this.text="",this.disabled=!1,this.size="lg",this.icon="copy",this.tabIdx=void 0}render(){this.dataset.size=this.size;const e=`${this.size}-regular`;return l`
      <button ?disabled=${this.disabled} tabindex=${w(this.tabIdx)}>
        <wui-icon name=${this.icon} size=${this.size} color="default"></wui-icon>
        <wui-text align="center" variant=${e} color="primary">${this.text}</wui-text>
      </button>
    `}};Re.styles=[I,W,Un];ot([c()],Re.prototype,"text",void 0);ot([c({type:Boolean})],Re.prototype,"disabled",void 0);ot([c()],Re.prototype,"size",void 0);ot([c()],Re.prototype,"icon",void 0);ot([c()],Re.prototype,"tabIdx",void 0);Re=ot([p("wui-list-button")],Re);const zn=$`
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: ${({spacing:t})=>t[2]};
  }

  wui-loading-spinner {
    right: ${({spacing:t})=>t[3]};
  }

  wui-text {
    margin: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]}
      ${({spacing:t})=>t[0]} ${({spacing:t})=>t[3]};
  }
`;var Ge=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ce=class extends f{constructor(){super(),this.unsubscribe=[],this.formRef=ri(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=b.state.remoteFeatures,this.hasExceededUsageLimit=C.state.plan.hasExceededUsageLimit,this.unsubscribe.push(b.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}),C.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){var e;(e=this.formRef.value)==null||e.addEventListener("keydown",i=>{i.key==="Enter"&&this.onSubmitEmail(i)})}render(){const e=x.hasAnyConnection(k.CONNECTOR_ID.AUTH);return l`
      <form ${si(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${w(this.tabIdx)}
          ?disabled=${e||this.hasExceededUsageLimit}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?l`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?l`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:null}templateError(){return this.error?l`<wui-text variant="sm-medium" color="error">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){var o;if(!oi.isValidEmail(this.email)){Oi.open({displayMessage:Ji.ALERT_WARNINGS.INVALID_EMAIL.displayMessage},"warning");return}if(!k.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(r=>r===u.state.activeChain)){const r=u.getFirstCaipNetworkSupportsAuthConnector();if(r){h.push("SwitchNetwork",{network:r});return}}try{if(this.loading)return;this.loading=!0,e.preventDefault();const r=y.getAuthConnector();if(!r)throw new Error("w3m-email-login-widget: Auth connector not found");const{action:n}=await r.provider.connectEmail({email:this.email});if(S.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),n==="VERIFY_OTP")S.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),h.push("EmailVerifyOtp",{email:this.email});else if(n==="VERIFY_DEVICE")h.push("EmailVerifyDevice",{email:this.email});else if(n==="CONNECT"){const s=(o=this.remoteFeatures)==null?void 0:o.multiWallet;await x.connectExternal(r,u.state.activeChain),s?(h.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):h.replace("Account")}}catch(r){const n=g.parseError(r);n!=null&&n.includes("Invalid email")?this.error="Invalid email. Try again.":T.showError(r)}finally{this.loading=!1}}onFocusEvent(){S.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};Ce.styles=zn;Ge([c()],Ce.prototype,"tabIdx",void 0);Ge([d()],Ce.prototype,"email",void 0);Ge([d()],Ce.prototype,"loading",void 0);Ge([d()],Ce.prototype,"error",void 0);Ge([d()],Ce.prototype,"remoteFeatures",void 0);Ge([d()],Ce.prototype,"hasExceededUsageLimit",void 0);Ce=Ge([p("w3m-email-login-widget")],Ce);const Fn=$`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;var zt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Je=class extends f{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${w(this.tabIdx)}>
        <wui-icon size="xxl" name=${this.logo}></wui-icon>
      </button>
    `}};Je.styles=[I,W,Fn];zt([c()],Je.prototype,"logo",void 0);zt([c({type:Boolean})],Je.prototype,"disabled",void 0);zt([c()],Je.prototype,"tabIdx",void 0);Je=zt([p("wui-logo-select")],Je);const Mn=$`
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var Pe=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const Si=2,Ei=6;let be=class extends f{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=y.state.connectors,this.remoteFeatures=b.state.remoteFeatures,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.isPwaLoading=!1,this.hasExceededUsageLimit=C.state.plan.hasExceededUsageLimit,this.unsubscribe.push(y.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(i=>i.type==="AUTH")}),b.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),C.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="2"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){var o;const e=this.walletGuide==="explore";let i=(o=this.remoteFeatures)==null?void 0:o.socials;return!i&&e?(i=D.DEFAULT_SOCIALS,this.renderTopViewContent(i)):i?this.renderTopViewContent(i):null}renderTopViewContent(e){return e.length===2?l` <wui-flex gap="2">
        ${e.slice(0,Si).map(i=>l`<wui-logo-select
              data-testid=${`social-selector-${i}`}
              @click=${()=>{this.onSocialClick(i)}}
              logo=${i}
              tabIdx=${w(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:l` <wui-list-button
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      size="lg"
      icon=${w(e[0])}
      text=${`Continue with ${z.capitalize(e[0])}`}
      tabIdx=${w(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-button>`}bottomViewTemplate(){var r;let e=(r=this.remoteFeatures)==null?void 0:r.socials;const i=this.walletGuide==="explore";return(!this.authConnector||!e||e.length===0)&&i&&(e=D.DEFAULT_SOCIALS),!e||e.length<=Si?null:e&&e.length>Ei?l`<wui-flex gap="2">
        ${e.slice(1,Ei-1).map(n=>l`<wui-logo-select
              data-testid=${`social-selector-${n}`}
              @click=${()=>{this.onSocialClick(n)}}
              logo=${n}
              tabIdx=${w(this.tabIdx)}
              ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${w(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:e?l`<wui-flex gap="2">
      ${e.slice(1,e.length).map(n=>l`<wui-logo-select
            data-testid=${`social-selector-${n}`}
            @click=${()=>{this.onSocialClick(n)}}
            logo=${n}
            tabIdx=${w(this.tabIdx)}
            ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){h.push("ConnectSocials")}async onSocialClick(e){if(this.hasExceededUsageLimit){h.push("UsageExceeded");return}if(!k.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===u.state.activeChain)){const o=u.getFirstCaipNetworkSupportsAuthConnector();if(o){h.push("SwitchNetwork",{network:o});return}}e&&await rn(e)}async handlePwaFrameLoad(){var e;if(g.isPWA()){this.isPwaLoading=!0;try{((e=this.authConnector)==null?void 0:e.provider)instanceof Zi&&await this.authConnector.provider.init()}catch(i){Oi.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:i.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return x.hasAnyConnection(k.CONNECTOR_ID.AUTH)}};be.styles=Mn;Pe([c()],be.prototype,"walletGuide",void 0);Pe([c()],be.prototype,"tabIdx",void 0);Pe([d()],be.prototype,"connectors",void 0);Pe([d()],be.prototype,"remoteFeatures",void 0);Pe([d()],be.prototype,"authConnector",void 0);Pe([d()],be.prototype,"isPwaLoading",void 0);Pe([d()],be.prototype,"hasExceededUsageLimit",void 0);be=Pe([p("w3m-social-login-widget")],be);var rt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ve=class extends f{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=y.state.connectors,this.count=C.state.count,this.filteredCount=C.state.filteredWallets.length,this.isFetchingRecommendedWallets=C.state.isFetchingRecommendedWallets,this.unsubscribe.push(y.subscribeKey("connectors",e=>this.connectors=e),C.subscribeKey("count",e=>this.count=e),C.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),C.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.connectors.find(v=>v.id==="walletConnect"),{allWallets:i}=b.state;if(!e||i==="HIDE"||i==="ONLY_MOBILE"&&!g.isMobile())return null;const o=C.state.featured.length,r=this.count+o,n=r<10?r:Math.floor(r/10)*10,s=this.filteredCount>0?this.filteredCount:n;let a=`${s}`;this.filteredCount>0?a=`${this.filteredCount}`:s<r&&(a=`${s}+`);const m=x.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${a}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${w(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${m}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){var e;S.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),h.push("AllWallets",{redirectView:(e=h.state.data)==null?void 0:e.redirectView})}};rt([c()],Ve.prototype,"tabIdx",void 0);rt([d()],Ve.prototype,"connectors",void 0);rt([d()],Ve.prototype,"count",void 0);rt([d()],Ve.prototype,"filteredCount",void 0);rt([d()],Ve.prototype,"isFetchingRecommendedWallets",void 0);Ve=rt([p("w3m-all-wallets-widget")],Ve);const Vn=$`
  :host {
    margin-top: ${({spacing:t})=>t[1]};
  }
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[2]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var ke=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ue=class extends f{constructor(){super(),this.unsubscribe=[],this.connectors=y.state.connectors,this.recommended=C.state.recommended,this.featured=C.state.featured,this.explorerWallets=C.state.explorerWallets,this.connections=x.state.connections,this.connectorImages=De.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(y.subscribeKey("connectors",e=>this.connectors=e),x.subscribeKey("connections",e=>this.connections=e),De.subscribeKey("connectorImages",e=>this.connectorImages=e),C.subscribeKey("recommended",e=>this.recommended=e),C.subscribeKey("featured",e=>this.featured=e),C.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e!=null&&e.length?e:C.state.explorerWallets}),C.subscribeKey("explorerWallets",e=>{var i;(i=this.explorerWallets)!=null&&i.length||(this.explorerWallets=e)})),g.isTelegram()&&g.isIos()&&(this.loadingTelegram=!x.state.wcUri,this.unsubscribe.push(x.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}mapConnectorsToExplorerWallets(e,i){return e.map(o=>{if(o.type==="MULTI_CHAIN"&&o.connectors){const n=o.connectors.map(v=>v.id),s=o.connectors.map(v=>v.name),a=o.connectors.map(v=>{var E;return(E=v.info)==null?void 0:E.rdns}),m=i==null?void 0:i.find(v=>n.includes(v.id)||s.includes(v.name)||v.rdns&&(a.includes(v.rdns)||n.includes(v.rdns)));return o.explorerWallet=m??o.explorerWallet,o}const r=i==null?void 0:i.find(n=>{var s;return n.id===o.id||n.rdns===((s=o.info)==null?void 0:s.rdns)||n.name===o.name});return o.explorerWallet=r??o.explorerWallet,o})}processConnectorsByType(e,i=!0){const o=$e.sortConnectorsByExplorerWallet([...e]);return i?o.filter($e.showConnector):o}connectorListTemplate(){const e=this.mapConnectorsToExplorerWallets(this.connectors,this.explorerWallets??[]),i=$e.getConnectorsByType(e,this.recommended,this.featured),o=this.processConnectorsByType(i.announced.filter(B=>B.id!=="walletConnect")),r=this.processConnectorsByType(i.injected),n=this.processConnectorsByType(i.multiChain.filter(B=>B.name!=="WalletConnect"),!1),s=i.custom,a=i.recent,m=this.processConnectorsByType(i.external.filter(B=>B.id!==k.CONNECTOR_ID.COINBASE_SDK&&B.id!==k.CONNECTOR_ID.BASE_ACCOUNT)),v=i.recommended,E=i.featured,_=$e.getConnectorTypeOrder({custom:s,recent:a,announced:o,injected:r,multiChain:n,recommended:v,featured:E,external:m}),R=this.connectors.find(B=>B.id==="walletConnect"),at=g.isMobile(),J=[];for(const B of _)switch(B){case"walletConnect":{!at&&R&&J.push({kind:"connector",subtype:"walletConnect",connector:R});break}case"recent":{$e.getFilteredRecentWallets().forEach(lt=>J.push({kind:"wallet",subtype:"recent",wallet:lt}));break}case"injected":{n.forEach(U=>J.push({kind:"connector",subtype:"multiChain",connector:U})),o.forEach(U=>J.push({kind:"connector",subtype:"announced",connector:U})),r.forEach(U=>J.push({kind:"connector",subtype:"injected",connector:U}));break}case"featured":{E.forEach(U=>J.push({kind:"wallet",subtype:"featured",wallet:U}));break}case"custom":{$e.getFilteredCustomWallets(s??[]).forEach(lt=>J.push({kind:"wallet",subtype:"custom",wallet:lt}));break}case"external":{m.forEach(U=>J.push({kind:"connector",subtype:"external",connector:U}));break}case"recommended":{$e.getCappedRecommendedWallets(v).forEach(lt=>J.push({kind:"wallet",subtype:"recommended",wallet:lt}));break}default:console.warn(`Unknown connector type: ${B}`)}return J.map((B,U)=>B.kind==="connector"?this.renderConnector(B,U):this.renderWallet(B,U))}getConnectorNamespaces(e){var i;return e.subtype==="walletConnect"?[]:e.subtype==="multiChain"?((i=e.connector.connectors)==null?void 0:i.map(o=>o.chain))||[]:[e.connector.chain]}renderConnector(e,i){var _,R;const o=e.connector,r=A.getConnectorImage(o)||this.connectorImages[(o==null?void 0:o.imageId)??""],s=(this.connections.get(o.chain)??[]).some(at=>te.isLowerCaseMatch(at.connectorId,o.id));let a,m;e.subtype==="walletConnect"?(a="qr code",m="accent"):e.subtype==="injected"||e.subtype==="announced"?(a=s?"connected":"installed",m=s?"info":"success"):(a=void 0,m=void 0);const v=x.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT),E=e.subtype==="walletConnect"||e.subtype==="external"?v:!1;return l`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${w(r)}
        .installed=${!0}
        name=${o.name??"Unknown"}
        .tagVariant=${m}
        tagLabel=${w(a)}
        data-testid=${`wallet-selector-${o.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${w(this.tabIdx)}
        ?disabled=${E}
        rdnsId=${w(((_=o.explorerWallet)==null?void 0:_.rdns)||void 0)}
        walletRank=${w((R=o.explorerWallet)==null?void 0:R.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){var o;const i=(o=h.state.data)==null?void 0:o.redirectView;if(e.subtype==="walletConnect"){y.setActiveConnector(e.connector),g.isMobile()?h.push("AllWallets"):h.push("ConnectingWalletConnect",{redirectView:i});return}if(e.subtype==="multiChain"){y.setActiveConnector(e.connector),h.push("ConnectingMultiChain",{redirectView:i});return}if(e.subtype==="injected"){y.setActiveConnector(e.connector),h.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet});return}if(e.subtype==="announced"){if(e.connector.id==="walletConnect"){g.isMobile()?h.push("AllWallets"):h.push("ConnectingWalletConnect",{redirectView:i});return}h.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet});return}h.push("ConnectingExternal",{connector:e.connector,redirectView:i})}renderWallet(e,i){const o=e.wallet,r=A.getWalletImage(o),s=x.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,m=e.subtype==="recent"?"recent":void 0,v=e.subtype==="recent"?"info":void 0;return l`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${w(r)}
        name=${o.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${o.id}`}
        tabIdx=${w(this.tabIdx)}
        ?loading=${a}
        ?disabled=${s}
        rdnsId=${w(o.rdns||void 0)}
        walletRank=${w(o.order)}
        tagLabel=${w(m)}
        .tagVariant=${v}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){var r;const i=(r=h.state.data)==null?void 0:r.redirectView;if(e.subtype==="featured"){y.selectWalletConnector(e.wallet);return}if(e.subtype==="recent"){if(this.loadingTelegram)return;y.selectWalletConnector(e.wallet);return}if(e.subtype==="custom"){if(this.loadingTelegram)return;h.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i});return}if(this.loadingTelegram)return;const o=y.getConnector({id:e.wallet.id,rdns:e.wallet.rdns});o?h.push("ConnectingExternal",{connector:o,redirectView:i}):h.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i})}};ue.styles=Vn;ke([c({type:Number})],ue.prototype,"tabIdx",void 0);ke([d()],ue.prototype,"connectors",void 0);ke([d()],ue.prototype,"recommended",void 0);ke([d()],ue.prototype,"featured",void 0);ke([d()],ue.prototype,"explorerWallets",void 0);ke([d()],ue.prototype,"connections",void 0);ke([d()],ue.prototype,"connectorImages",void 0);ke([d()],ue.prototype,"loadingTelegram",void 0);ue=ke([p("w3m-connector-list")],ue);var zi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Xt=class extends f{constructor(){super(...arguments),this.tabIdx=void 0}render(){return l`
      <wui-flex flexDirection="column" gap="2">
        <w3m-connector-list tabIdx=${w(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${w(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};zi([c()],Xt.prototype,"tabIdx",void 0);Xt=zi([p("w3m-wallet-login-list")],Xt);const Hn=$`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var le=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const Kn=470;let q=class extends f{constructor(){var e,i;super(),this.unsubscribe=[],this.connectors=y.state.connectors,this.authConnector=this.connectors.find(o=>o.type==="AUTH"),this.features=b.state.features,this.remoteFeatures=b.state.remoteFeatures,this.enableWallets=b.state.enableWallets,this.noAdapters=u.state.noAdapters,this.walletGuide="get-started",this.checked=Et.state.isLegalCheckboxChecked,this.isEmailEnabled=((e=this.remoteFeatures)==null?void 0:e.email)&&!u.state.noAdapters,this.isSocialEnabled=((i=this.remoteFeatures)==null?void 0:i.socials)&&this.remoteFeatures.socials.length>0&&!u.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(y.subscribeKey("connectors",o=>{this.connectors=o,this.authConnector=this.connectors.find(r=>r.type==="AUTH"),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),b.subscribeKey("features",o=>{this.features=o}),b.subscribeKey("remoteFeatures",o=>{this.remoteFeatures=o,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),b.subscribeKey("enableWallets",o=>this.enableWallets=o),u.subscribeKey("noAdapters",o=>this.setEmailAndSocialEnableCheck(o,this.remoteFeatures)),Et.subscribeKey("isLegalCheckboxChecked",o=>this.checked=o))}disconnectedCallback(){var i,o;this.unsubscribe.forEach(r=>r()),(i=this.resizeObserver)==null||i.disconnect();const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".connect");e==null||e.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){var i,o;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".connect");e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e==null||e.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),(o=this.resizeObserver)==null||o.observe(e),this.handleConnectListScroll())}render(){var R;const{termsConditionsUrl:e,privacyPolicyUrl:i}=b.state,o=(R=b.state.features)==null?void 0:R.legalCheckbox,s=!!(e||i)&&!!o&&this.walletGuide==="get-started"&&!this.checked,a={connect:!0,disabled:s},m=b.state.enableWalletGuide,v=this.enableWallets,E=this.isSocialEnabled||this.authConnector,_=s?-1:void 0;return l`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          .padding=${["0","0","4","0"]}
          class=${Pi(a)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="2"
            .padding=${E&&v&&m&&this.walletGuide==="get-started"?["0","3","0","3"]:["0","3","3","3"]}
          >
            ${this.renderConnectMethod(_)}
          </wui-flex>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}reownBrandingTemplate(){var e;return oi.hasFooter()||!((e=this.remoteFeatures)!=null&&e.reownBranding)?null:l`<wui-ux-by-reown></wui-ux-by-reown>`}setEmailAndSocialEnableCheck(e,i){this.isEmailEnabled=(i==null?void 0:i.email)&&!e,this.isSocialEnabled=(i==null?void 0:i.socials)&&i.socials.length>0&&!e,this.remoteFeatures=i,this.noAdapters=e}checkIfAuthEnabled(e){const i=e.filter(r=>r.type===en.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return k.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>i.includes(r))}renderConnectMethod(e){const i=dt.getConnectOrderMethod(this.features,this.connectors);return l`${i.map((o,r)=>{switch(o){case"email":return l`${this.emailTemplate(e)} ${this.separatorTemplate(r,"email")}`;case"social":return l`${this.socialListTemplate(e)}
          ${this.separatorTemplate(r,"social")}`;case"wallet":return l`${this.walletListTemplate(e)}
          ${this.separatorTemplate(r,"wallet")}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){const o=dt.getConnectOrderMethod(this.features,this.connectors)[e+1];return o?this.checkMethodEnabled(o)?o:this.checkIsThereNextMethod(e+1):void 0}separatorTemplate(e,i){const o=this.checkIsThereNextMethod(e),r=this.walletGuide==="explore";switch(i){case"wallet":return this.enableWallets&&o&&!r?l`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":{const n=o==="social";return this.isAuthEnabled&&this.isEmailEnabled&&!n&&o?l`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case"social":{const n=o==="email";return this.isAuthEnabled&&this.isSocialEnabled&&!n&&o?l`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(e){return!this.isEmailEnabled||!this.isAuthEnabled?null:l`<w3m-email-login-widget tabIdx=${w(e)}></w3m-email-login-widget>`}socialListTemplate(e){return!this.isSocialEnabled||!this.isAuthEnabled?null:l`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${w(e)}
    ></w3m-social-login-widget>`}walletListTemplate(e){var a,m;const i=this.enableWallets,o=((a=this.features)==null?void 0:a.emailShowWallets)===!1,r=(m=this.features)==null?void 0:m.collapseWallets,n=o||r;return!i||(g.isTelegram()&&(g.isSafari()||g.isIos())&&x.connectWalletConnect().catch(v=>({})),this.walletGuide==="explore")?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&n?l`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${w(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
      ></wui-list-button>`:l`<w3m-wallet-login-list tabIdx=${w(e)}></w3m-wallet-login-list>`}legalCheckboxTemplate(){return this.walletGuide==="explore"?null:l`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){var o;const e=(o=this.shadowRoot)==null?void 0:o.querySelector(".connect");if(!e)return;e.scrollHeight>Kn?(e.style.setProperty("--connect-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 100px,
          black calc(100% - 100px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--connect-scroll--top-opacity",St.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",St.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--connect-mask-image","none"),e.style.setProperty("--connect-scroll--top-opacity","0"),e.style.setProperty("--connect-scroll--bottom-opacity","0"))}onContinueWalletClick(){h.push("ConnectWallets")}};q.styles=Hn;le([d()],q.prototype,"connectors",void 0);le([d()],q.prototype,"authConnector",void 0);le([d()],q.prototype,"features",void 0);le([d()],q.prototype,"remoteFeatures",void 0);le([d()],q.prototype,"enableWallets",void 0);le([d()],q.prototype,"noAdapters",void 0);le([c()],q.prototype,"walletGuide",void 0);le([d()],q.prototype,"checked",void 0);le([d()],q.prototype,"isEmailEnabled",void 0);le([d()],q.prototype,"isSocialEnabled",void 0);le([d()],q.prototype,"isAuthEnabled",void 0);q=le([p("w3m-connect-view")],q);const qn=$`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[5]};
    padding-left: ${({spacing:t})=>t[3]};
    padding-right: ${({spacing:t})=>t[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:t})=>t[6]};
  }

  wui-text {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var Ft=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ze=class extends f{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return l`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Ze.styles=[I,W,qn];Ft([c({type:Boolean})],Ze.prototype,"disabled",void 0);Ft([c()],Ze.prototype,"label",void 0);Ft([c()],Ze.prototype,"buttonLabel",void 0);Ze=Ft([p("wui-cta-button")],Ze);const Gn=$`
  :host {
    display: block;
    padding: 0 ${({spacing:t})=>t[5]} ${({spacing:t})=>t[5]};
  }
`;var Fi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let _t=class extends f{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:i,play_store:o,chrome_store:r,homepage:n}=this.wallet,s=g.isMobile(),a=g.isIos(),m=g.isAndroid(),v=[i,o,n,r].filter(Boolean).length>1,E=z.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return v&&!s?l`
        <wui-cta-button
          label=${`Don't have ${E}?`}
          buttonLabel="Get"
          @click=${()=>h.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!v&&n?l`
        <wui-cta-button
          label=${`Don't have ${E}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&a?l`
        <wui-cta-button
          label=${`Don't have ${E}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&m?l`
        <wui-cta-button
          label=${`Don't have ${E}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){var e;(e=this.wallet)!=null&&e.app_store&&g.openHref(this.wallet.app_store,"_blank")}onPlayStore(){var e;(e=this.wallet)!=null&&e.play_store&&g.openHref(this.wallet.play_store,"_blank")}onHomePage(){var e;(e=this.wallet)!=null&&e.homepage&&g.openHref(this.wallet.homepage,"_blank")}};_t.styles=[Gn];Fi([c({type:Object})],_t.prototype,"wallet",void 0);_t=Fi([p("w3m-mobile-download-links")],_t);const Yn=$`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-wallet-image {
    width: 56px;
    height: 56px;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:t})=>t.lg};
    transition-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:t})=>t[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:t})=>t["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var fe=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};class O extends f{constructor(){var e,i,o,r,n;super(),this.wallet=(e=h.state.data)==null?void 0:e.wallet,this.connector=(i=h.state.data)==null?void 0:i.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=A.getConnectorImage(this.connector)??A.getWalletImage(this.wallet),this.name=((o=this.wallet)==null?void 0:o.name)??((r=this.connector)==null?void 0:r.name)??"Wallet",this.isRetrying=!1,this.uri=x.state.wcUri,this.error=x.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(x.subscribeKey("wcUri",s=>{var a;this.uri=s,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,(a=this.onConnect)==null||a.call(this))}),x.subscribeKey("wcError",s=>this.error=s)),(g.isTelegram()||g.isSafari())&&g.isIos()&&x.state.wcUri&&((n=this.onConnect)==null||n.call(this))}firstUpdated(){var e;(e=this.onAutoConnect)==null||e.call(this),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),x.setWcError(!1),clearTimeout(this.timeout)}render(){var o;(o=this.onRender)==null||o.call(this),this.onShowRetry();const e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),l`
      <wui-flex
        data-error=${w(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${w(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${i}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?l`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?l`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){var e;if(this.error&&!this.showRetry){this.showRetry=!0;const i=(e=this.shadowRoot)==null?void 0:e.querySelector("wui-button");i==null||i.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){var e,i;x.setWcError(!1),this.onRetry?(this.isRetrying=!0,(e=this.onRetry)==null||e.call(this)):(i=this.onConnect)==null||i.call(this)}loaderTemplate(){const e=Ct.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return l`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(g.copyToClopboard(this.uri),T.showSuccess("Link copied"))}catch{T.showError("Failed to copy")}}}O.styles=Yn;fe([d()],O.prototype,"isRetrying",void 0);fe([d()],O.prototype,"uri",void 0);fe([d()],O.prototype,"error",void 0);fe([d()],O.prototype,"ready",void 0);fe([d()],O.prototype,"showRetry",void 0);fe([d()],O.prototype,"label",void 0);fe([d()],O.prototype,"secondaryBtnLabel",void 0);fe([d()],O.prototype,"secondaryLabel",void 0);fe([d()],O.prototype,"isLoading",void 0);fe([c({type:Boolean})],O.prototype,"isMobile",void 0);fe([c()],O.prototype,"onRetry",void 0);var Xn=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ki=class extends O{constructor(){var i,o,r,n,s;if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=x.getConnections((i=this.connector)==null?void 0:i.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=b.state.remoteFeatures,this.currentActiveConnectorId=y.state.activeConnectorIds[(o=this.connector)==null?void 0:o.chain],!this.connector)throw new Error("w3m-connecting-view: No connector provided");const e=(r=this.connector)==null?void 0:r.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser",displayIndex:(n=this.wallet)==null?void 0:n.display_index,walletRank:(s=this.wallet)==null?void 0:s.order,view:h.state.view}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(y.subscribeKey("activeConnectorIds",a=>{var _;const m=a[e],v=(_=this.remoteFeatures)==null?void 0:_.multiWallet,{redirectView:E}=h.state.data??{};m!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&v?(h.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):E?h.replace(E):P.close())}),x.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){var e;try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;(this.connector.id!==k.CONNECTOR_ID.COINBASE_SDK||!this.error)&&(await x.connectExternal(this.connector,this.connector.chain),S.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.connector.name||"Unknown",view:h.state.view,walletRank:(e=this.wallet)==null?void 0:e.order}}))}}catch(i){i instanceof ii&&i.originalName===ni.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?S.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:i.message}}):S.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(i==null?void 0:i.message)??"Unknown"}}),this.error=!0}}onConnectionsChange(e){var i,o;if((i=this.connector)!=null&&i.chain&&e.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){const r=e.get(this.connector.chain)??[],n=(o=this.remoteFeatures)==null?void 0:o.multiWallet;if(r.length===0)h.replace("Connect");else{const s=Ae.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(m=>m.accounts),a=Ae.getConnectionsByConnectorId(r,this.connector.id).flatMap(m=>m.accounts);a.length===0?this.hasMultipleConnections&&n?(h.replace("ProfileWallets"),T.showSuccess("Wallet deleted")):P.close():!s.every(v=>a.some(E=>te.isLowerCaseMatch(v.address,E.address)))&&n&&h.replace("ProfileWallets")}}}isAlreadyConnected(e){return!!e&&this.connectionsByNamespace.some(i=>te.isLowerCaseMatch(i.connectorId,e.id))}};ki=Xn([p("w3m-connecting-external-view")],ki);const Qn=oe`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var Mi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Rt=class extends f{constructor(){super(),this.unsubscribe=[],this.activeConnector=y.state.activeConnector,this.unsubscribe.push(y.subscribeKey("activeConnector",e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var e;return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${w(A.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["0","3","0","3"]}
        >
          <wui-text variant="lg-medium" color="primary">
            Select Chain for ${(e=this.activeConnector)==null?void 0:e.name}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","2","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){var e,i;return(i=(e=this.activeConnector)==null?void 0:e.connectors)==null?void 0:i.map((o,r)=>{var n;return o.name?l`
            <w3m-list-wallet
              displayIndex=${r}
              imageSrc=${w(A.getChainImage(o.chain))}
              name=${k.CHAIN_NAME_MAP[o.chain]}
              @click=${()=>this.onConnector(o)}
              size="sm"
              data-testid="wui-list-chain-${o.chain}"
              rdnsId=${(n=o.explorerWallet)==null?void 0:n.rdns}
            ></w3m-list-wallet>
          `:null})}onConnector(e){var r,n,s,a;const i=(n=(r=this.activeConnector)==null?void 0:r.connectors)==null?void 0:n.find(m=>m.chain===e.chain),o=(s=h.state.data)==null?void 0:s.redirectView;if(!i){T.showError("Failed to find connector");return}i.id==="walletConnect"?g.isMobile()?h.push("AllWallets"):h.push("ConnectingWalletConnect",{redirectView:o}):h.push("ConnectingExternal",{connector:i,redirectView:o,wallet:(a=this.activeConnector)==null?void 0:a.explorerWallet})}};Rt.styles=Qn;Mi([d()],Rt.prototype,"activeConnector",void 0);Rt=Mi([p("w3m-connecting-multi-chain-view")],Rt);var di=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Wt=class extends f{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.generateTabs();return l`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map(i=>i==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:i==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:i==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:i==="web"?{label:"Webapp",icon:"browser",platform:"web"}:i==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:i})=>i),e}onTabChange(e){var o;const i=this.platformTabs[e];i&&((o=this.onSelectPlatfrom)==null||o.call(this,i))}};di([c({type:Array})],Wt.prototype,"platforms",void 0);di([c()],Wt.prototype,"onSelectPlatfrom",void 0);Wt=di([p("w3m-connecting-header")],Wt);var Jn=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ai=class extends O{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:(e=this.wallet)==null?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}async onConnectProxy(){var e,i;try{this.error=!1;const{connectors:o}=y.state,r=o.find(n=>{var s,a,m;return n.type==="ANNOUNCED"&&((s=n.info)==null?void 0:s.rdns)===((a=this.wallet)==null?void 0:a.rdns)||n.type==="INJECTED"||n.name===((m=this.wallet)==null?void 0:m.name)});if(r)await x.connectExternal(r,r.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");P.close(),S.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:((e=this.wallet)==null?void 0:e.name)||"Unknown",view:h.state.view,walletRank:(i=this.wallet)==null?void 0:i.order}})}catch(o){o instanceof ii&&o.originalName===ni.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?S.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:o.message}}):S.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(o==null?void 0:o.message)??"Unknown"}}),this.error=!0}}};Ai=Jn([p("w3m-connecting-wc-browser")],Ai);var Zn=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ti=class extends O{constructor(){var e;if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:(e=this.wallet)==null?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}onRenderProxy(){var e;!this.ready&&this.uri&&(this.ready=!0,(e=this.onConnect)==null||e.call(this))}onConnectProxy(){var e;if((e=this.wallet)!=null&&e.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:i,name:o}=this.wallet,{redirect:r,href:n}=g.formatNativeUrl(i,this.uri);x.setWcLinking({name:o,href:n}),x.setRecentWallet(this.wallet),g.openHref(r,"_blank")}catch{this.error=!0}}};Ti=Zn([p("w3m-connecting-wc-desktop")],Ti);var st=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let He=class extends O{constructor(){var e;if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=b.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{var i;if((i=this.wallet)!=null&&i.mobile_link&&this.uri)try{this.error=!1;const{mobile_link:o,link_mode:r,name:n}=this.wallet,{redirect:s,redirectUniversalLink:a,href:m}=g.formatNativeUrl(o,this.uri,r);this.redirectDeeplink=s,this.redirectUniversalLink=a,this.target=g.isIframe()?"_top":"_self",x.setWcLinking({name:n,href:m}),x.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?g.openHref(this.redirectUniversalLink,this.target):g.openHref(this.redirectDeeplink,this.target)}catch(o){S.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:o instanceof Error?o.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=D.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(x.subscribeKey("wcUri",()=>{this.onHandleURI()})),S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:(e=this.wallet)==null?void 0:e.display_index,walletRank:this.wallet.order,view:h.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){var e;this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,(e=this.onConnect)==null||e.call(this))}onTryAgain(){var e;x.setWcError(!1),(e=this.onConnect)==null||e.call(this)}};st([d()],He.prototype,"redirectDeeplink",void 0);st([d()],He.prototype,"redirectUniversalLink",void 0);st([d()],He.prototype,"target",void 0);st([d()],He.prototype,"preferUniversalLinks",void 0);st([d()],He.prototype,"isLoading",void 0);He=st([p("w3m-connecting-wc-mobile")],He);const eo=$`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var Vi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Nt=class extends O{constructor(){super(),this.basic=!1}firstUpdated(){var e,i,o;this.basic||S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:((e=this.wallet)==null?void 0:e.name)??"WalletConnect",platform:"qrcode",displayIndex:(i=this.wallet)==null?void 0:i.display_index,walletRank:(o=this.wallet)==null?void 0:o.order,view:h.state.view}})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.unsubscribe)==null||e.forEach(i=>i())}render(){return this.onRenderProxy(),l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.wallet?this.wallet.name:void 0;x.setWcLinking(void 0),x.setRecentWallet(this.wallet);const i=Ct.state.themeVariables["--apkt-qr-color"]??Ct.state.themeVariables["--w3m-qr-color"];return l` <wui-qr-code
      theme=${Ct.state.themeMode}
      uri=${this.uri}
      imageSrc=${w(A.getWalletImage(this.wallet))}
      color=${w(i)}
      alt=${w(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const e=!this.uri||!this.ready;return l`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};Nt.styles=eo;Vi([c({type:Boolean})],Nt.prototype,"basic",void 0);Nt=Vi([p("w3m-connecting-wc-qrcode")],Nt);var to=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ii=class extends f{constructor(){var e,i,o;if(super(),this.wallet=(e=h.state.data)==null?void 0:e.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:(i=this.wallet)==null?void 0:i.display_index,walletRank:(o=this.wallet)==null?void 0:o.order,view:h.state.view}})}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${w(A.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};Ii=to([p("w3m-connecting-wc-unsupported")],Ii);var Hi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Qt=class extends O{constructor(){var e,i;if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=D.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(x.subscribeKey("wcUri",()=>{this.updateLoadingState()})),S.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:(e=this.wallet)==null?void 0:e.display_index,walletRank:(i=this.wallet)==null?void 0:i.order,view:h.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){var e;if((e=this.wallet)!=null&&e.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:i,name:o}=this.wallet,{redirect:r,href:n}=g.formatUniversalUrl(i,this.uri);x.setWcLinking({name:o,href:n}),x.setRecentWallet(this.wallet),g.openHref(r,"_blank")}catch{this.error=!0}}};Hi([d()],Qt.prototype,"isLoading",void 0);Qt=Hi([p("w3m-connecting-wc-web")],Qt);const io=$`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var Ye=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Se=class extends f{constructor(){var e;super(),this.wallet=(e=h.state.data)==null?void 0:e.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!b.state.siwx,this.remoteFeatures=b.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(b.subscribeKey("remoteFeatures",i=>this.remoteFeatures=i))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return b.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),l`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){var e;return!((e=this.remoteFeatures)!=null&&e.reownBranding)||!this.displayBranding?null:l`<wui-ux-by-reown></wui-ux-by-reown>`}async initializeConnection(e=!1){var i,o;if(!(this.platform==="browser"||b.state.manualWCControl&&!e))try{const{wcPairingExpiry:r,status:n}=x.state,{redirectView:s}=h.state.data??{};if(e||b.state.enableEmbedded||g.isPairingExpired(r)||n==="connecting"){const a=x.getConnections(u.state.activeChain),m=(i=this.remoteFeatures)==null?void 0:i.multiWallet,v=a.length>0;await x.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(v&&m?(h.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):s?h.replace(s):P.close())}}catch(r){if(r instanceof Error&&r.message.includes("An error occurred when attempting to switch chain")&&!b.state.enableNetworkSwitch&&u.state.activeChain){u.setActiveCaipNetwork(tn.getUnsupportedNetwork(`${u.state.activeChain}:${(o=u.state.activeCaipNetwork)==null?void 0:o.id}`)),u.showUnsupportedChainUI();return}r instanceof ii&&r.originalName===ni.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?S.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:r.message}}):S.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:(r==null?void 0:r.message)??"Unknown"}}),x.setWcError(!0),T.showError(r.message??"Connection error"),x.resetWcConnection(),h.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;const{mobile_link:e,desktop_link:i,webapp_link:o,injected:r,rdns:n}=this.wallet,s=r==null?void 0:r.map(({injected_id:J})=>J).filter(Boolean),a=[...n?[n]:s??[]],m=b.state.isUniversalProvider?!1:a.length,v=e,E=o,_=x.checkInstalled(a),R=m&&_,at=i&&!g.isMobile();R&&!u.state.noAdapters&&this.platforms.push("browser"),v&&this.platforms.push(g.isMobile()?"mobile":"qrcode"),E&&this.platforms.push("web"),at&&this.platforms.push("desktop"),!R&&m&&!u.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return l`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return l`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return l`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return l`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return l`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return l`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?l`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){var o;const i=(o=this.shadowRoot)==null?void 0:o.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};Se.styles=io;Ye([d()],Se.prototype,"platform",void 0);Ye([d()],Se.prototype,"platforms",void 0);Ye([d()],Se.prototype,"isSiwxEnabled",void 0);Ye([d()],Se.prototype,"remoteFeatures",void 0);Ye([c({type:Boolean})],Se.prototype,"displayBranding",void 0);Ye([c({type:Boolean})],Se.prototype,"basic",void 0);Se=Ye([p("w3m-connecting-wc-view")],Se);var ui=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ot=class extends f{constructor(){super(),this.unsubscribe=[],this.isMobile=g.isMobile(),this.remoteFeatures=b.state.remoteFeatures,this.unsubscribe.push(b.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){const{featured:e,recommended:i}=C.state,{customWallets:o}=b.state,r=Te.getRecentWallets(),n=e.length||i.length||(o==null?void 0:o.length)||r.length;return l`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${n?l`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return l`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){var e;return(e=this.remoteFeatures)!=null&&e.reownBranding?l` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};ui([d()],Ot.prototype,"isMobile",void 0);ui([d()],Ot.prototype,"remoteFeatures",void 0);Ot=ui([p("w3m-connecting-wc-basic-view")],Ot);const no=oe`
  .continue-button-container {
    width: 100%;
  }
`;var Ki=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Pt=class extends f{constructor(){super(...arguments),this.loading=!1}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{g.openHref(sn.URLS.FAQ,"_blank")}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return l` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${["0","6","0","6"]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box icon="id" size="xl" iconSize="xxl" color="default"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="lg-medium" color="primary">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return l`<wui-flex
      .padding=${["0","8","0","8"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){h.push("RegisterAccountName"),S.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:Ie(u.state.activeChain)===ce.ACCOUNT_TYPES.SMART_ACCOUNT}})}};Pt.styles=no;Ki([d()],Pt.prototype,"loading",void 0);Pt=Ki([p("w3m-choose-account-name-view")],Pt);var oo=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let _i=class extends f{constructor(){var e;super(...arguments),this.wallet=(e=h.state.data)==null?void 0:e.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return l`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){var e;return(e=this.wallet)!=null&&e.chrome_store?l`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){var e;return(e=this.wallet)!=null&&e.app_store?l`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){var e;return(e=this.wallet)!=null&&e.play_store?l`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){var e;return(e=this.wallet)!=null&&e.homepage?l`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(S.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),g.openHref(e.href,"_blank"))}onChromeStore(){var e;(e=this.wallet)!=null&&e.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){var e;(e=this.wallet)!=null&&e.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){var e;(e=this.wallet)!=null&&e.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){var e;(e=this.wallet)!=null&&e.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};_i=oo([p("w3m-downloads-view")],_i);var ro=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const so="https://walletconnect.com/explorer";let Ri=class extends f{render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.recommendedWalletsTemplate()}
        <w3m-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          size="sm"
          @click=${()=>{g.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></w3m-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){const{recommended:e,featured:i}=C.state,{customWallets:o}=b.state;return[...i,...o??[],...e].slice(0,4).map((n,s)=>l`
        <w3m-list-wallet
          displayIndex=${s}
          name=${n.name??"Unknown"}
          tagVariant="accent"
          size="sm"
          imageSrc=${w(A.getWalletImage(n))}
          @click=${()=>{this.onWalletClick(n)}}
        ></w3m-list-wallet>
      `)}onWalletClick(e){S.sendEvent({type:"track",event:"GET_WALLET",properties:{name:e.name,walletRank:void 0,explorerId:e.id,type:"homepage"}}),g.openHref(e.homepage??so,"_blank")}};Ri=ro([p("w3m-get-wallet-view")],Ri);var qi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Jt=class extends f{constructor(){super(...arguments),this.data=[]}render(){return l`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        ${this.data.map(e=>l`
            <wui-flex flexDirection="column" alignItems="center" gap="5">
              <wui-flex flexDirection="row" justifyContent="center" gap="1">
                ${e.images.map(i=>l`<wui-visual size="sm" name=${i}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="1">
              <wui-text variant="md-regular" color="primary" align="center">${e.title}</wui-text>
              <wui-text variant="sm-regular" color="secondary" align="center"
                >${e.text}</wui-text
              >
            </wui-flex>
          `)}
      </wui-flex>
    `}};qi([c({type:Array})],Jt.prototype,"data",void 0);Jt=qi([p("w3m-help-widget")],Jt);var ao=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const lo=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}];let Wi=class extends f{render(){return l`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${lo}></w3m-help-widget>
        <wui-button variant="accent-primary" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){S.sendEvent({type:"track",event:"CLICK_GET_WALLET_HELP"}),h.push("GetWallet")}};Wi=ao([p("w3m-what-is-a-wallet-view")],Wi);const co=$`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var Gi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Dt=class extends f{constructor(){super(),this.unsubscribe=[],this.checked=Et.state.isLegalCheckboxChecked,this.unsubscribe.push(Et.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var m;const{termsConditionsUrl:e,privacyPolicyUrl:i}=b.state,o=(m=b.state.features)==null?void 0:m.legalCheckbox,n=!!(e||i)&&!!o,s=n&&!this.checked,a=s?-1:void 0;return l`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${n?["0","3","3","3"]:"3"}
        gap="2"
        class=${w(s?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${w(a)}></w3m-wallet-login-list>
      </wui-flex>
    `}};Dt.styles=co;Gi([d()],Dt.prototype,"checked",void 0);Dt=Gi([p("w3m-connect-wallets-view")],Dt);const uo=$`
  :host {
    display: block;
    width: 120px;
    height: 120px;
  }

  svg {
    width: 120px;
    height: 120px;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: ${t=>t.colors.accent100};
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var ho=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Zt=class extends f{render(){return l`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};Zt.styles=[I,uo];Zt=ho([p("wui-loading-hexagon")],Zt);const po=oe`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var hi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let pt=class extends f{constructor(){var e;super(),this.network=(e=h.state.data)==null?void 0:e.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();const e=this.getLabel(),i=this.getSubLabel();return l`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","10","5"]}
        gap="7"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${w(A.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:l`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="h6-regular" color="primary">${e}</wui-text>
          <wui-text align="center" variant="md-regular" color="secondary">${i}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent-primary"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){const e=y.getConnectorId(u.state.activeChain);return y.getAuthConnector()&&e===k.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){var o;const e=y.getConnectorId(u.state.activeChain);return y.getAuthConnector()&&e===k.CONNECTOR_ID.AUTH?`Switching to ${((o=this.network)==null?void 0:o.name)??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){var e;if(this.error&&!this.showRetry){this.showRetry=!0;const i=(e=this.shadowRoot)==null?void 0:e.querySelector("wui-button");i==null||i.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){var e;try{this.error=!1,u.state.activeChain!==((e=this.network)==null?void 0:e.chainNamespace)&&u.setIsSwitchingNamespace(!0),this.network&&(await u.switchActiveNetwork(this.network),await Kt.isAuthenticated()&&h.goBack())}catch{this.error=!0}}};pt.styles=po;hi([d()],pt.prototype,"showRetry",void 0);hi([d()],pt.prototype,"error",void 0);pt=hi([p("w3m-network-switch-view")],pt);const wo=$`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var vt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let Ke=class extends f{constructor(){super(...arguments),this.imageSrc=void 0,this.name="Ethereum",this.disabled=!1}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${w(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          ${this.imageTemplate()}
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}imageTemplate(){return this.imageSrc?l`<wui-image ?boxed=${!0} src=${this.imageSrc}></wui-image>`:l`<wui-image
      ?boxed=${!0}
      icon="networkPlaceholder"
      size="lg"
      iconColor="default"
    ></wui-image>`}};Ke.styles=[I,W,wo];vt([c()],Ke.prototype,"imageSrc",void 0);vt([c()],Ke.prototype,"name",void 0);vt([c()],Ke.prototype,"tabIdx",void 0);vt([c({type:Boolean})],Ke.prototype,"disabled",void 0);Ke=vt([p("wui-list-network")],Ke);const fo=oe`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var $t=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let qe=class extends f{constructor(){super(),this.unsubscribe=[],this.network=u.state.activeCaipNetwork,this.requestedCaipNetworks=u.getCaipNetworks(),this.search="",this.onDebouncedSearch=g.debounce(e=>{this.search=e},100),this.unsubscribe.push(De.subscribeNetworkImages(()=>this.requestUpdate()),u.subscribeKey("activeCaipNetwork",e=>this.network=e),u.subscribe(()=>{this.requestedCaipNetworks=u.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","3","3","3"]}
        flexDirection="column"
        gap="2"
      >
        ${this.networksTemplate()}
      </wui-flex>
    `}templateSearchInput(){return l`
      <wui-flex gap="2" .padding=${["0","3","3","3"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}networksTemplate(){var o;const e=u.getAllApprovedCaipNetworkIds(),i=g.sortRequestedNetworks(e,this.requestedCaipNetworks);return this.search?this.filteredNetworks=i==null?void 0:i.filter(r=>{var n;return(n=r==null?void 0:r.name)==null?void 0:n.toLowerCase().includes(this.search.toLowerCase())}):this.filteredNetworks=i,(o=this.filteredNetworks)==null?void 0:o.map(r=>{var n;return l`
        <wui-list-network
          .selected=${((n=this.network)==null?void 0:n.id)===r.id}
          imageSrc=${w(A.getNetworkImage(r))}
          type="network"
          name=${r.name??r.id}
          @click=${()=>this.onSwitchNetwork(r)}
          .disabled=${u.isCaipNetworkDisabled(r)}
          data-testid=${`w3m-network-switch-${r.name??r.id}`}
        ></wui-list-network>
      `})}onSwitchNetwork(e){nn.onSwitchNetwork({network:e})}};qe.styles=fo;$t([d()],qe.prototype,"network",void 0);$t([d()],qe.prototype,"requestedCaipNetworks",void 0);$t([d()],qe.prototype,"filteredNetworks",void 0);$t([d()],qe.prototype,"search",void 0);qe=$t([p("w3m-networks-view")],qe);const mo=$`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.core.glass010};
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:t})=>t[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:t})=>t["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:t})=>t["01"]} ${({spacing:t})=>t[2]};
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var Yi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const bo={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0};let Lt=class extends f{constructor(){var e,i;super(...arguments),this.unsubscribe=[],this.switchToChain=(e=h.state.data)==null?void 0:e.switchToChain,this.caipNetwork=(i=h.state.data)==null?void 0:i.network,this.activeChain=u.state.activeChain}firstUpdated(){this.unsubscribe.push(u.subscribeKey("activeChain",e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){const e=this.switchToChain?k.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;const i=k.CHAIN_NAME_MAP[this.switchToChain];return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","2","2","2"]}
        gap="4"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="2">
          <wui-visual
            size="md"
            name=${w(bo[this.switchToChain])}
          ></wui-visual>
          <wui-flex gap="2" flexDirection="column" alignItems="center">
            <wui-text
              data-testid=${`w3m-switch-active-chain-to-${i}`}
              variant="lg-regular"
              color="primary"
              align="center"
              >Switch to <span class="capitalize">${i}</span></wui-text
            >
            <wui-text variant="md-regular" color="secondary" align="center">
              Connected wallet doesn't support connecting to ${e} chain. You
              need to connect with a different wallet.
            </wui-text>
          </wui-flex>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(u.setIsSwitchingNamespace(!0),y.setFilterByNamespace(this.switchToChain),this.caipNetwork?await u.switchActiveNetwork(this.caipNetwork):u.setActiveNamespace(this.switchToChain),h.reset("Connect"))}};Lt.styles=mo;Yi([c()],Lt.prototype,"activeChain",void 0);Lt=Yi([p("w3m-switch-active-chain-view")],Lt);var go=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const yo=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}];let Ni=class extends f{render(){return l`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${yo}></w3m-help-widget>
        <wui-button
          variant="accent-primary"
          size="md"
          @click=${()=>{g.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Ni=go([p("w3m-what-is-a-network-view")],Ni);const xo=oe`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var pi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let wt=class extends f{constructor(){var e;super(),this.swapUnsupportedChain=(e=h.state.data)==null?void 0:e.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=b.state.remoteFeatures,this.unsubscribe.push(De.subscribeNetworkImages(()=>this.requestUpdate()),b.subscribeKey("remoteFeatures",i=>{this.remoteFeatures=i}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["3","5","2","5"]}
          alignItems="center"
          gap="5"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="3" gap="2"> ${this.networksTemplate()} </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="3" gap="2">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="signOut"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="md-medium" color="secondary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?l`
        <wui-text variant="sm-regular" color="secondary" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:l`
      <wui-text variant="sm-regular" color="secondary" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){const e=u.getAllRequestedCaipNetworks(),i=u.getAllApprovedCaipNetworkIds(),o=g.sortRequestedNetworks(i,e);return(this.swapUnsupportedChain?o.filter(n=>D.SWAP_SUPPORTED_NETWORKS.includes(n.caipNetworkId)):o).map(n=>l`
        <wui-list-network
          imageSrc=${w(A.getNetworkImage(n))}
          name=${n.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(n)}
        >
        </wui-list-network>
      `)}async onDisconnect(){var e;try{this.disconnecting=!0;const i=u.state.activeChain,r=x.getConnections(i).length>0,n=i&&y.state.activeConnectorIds[i],s=(e=this.remoteFeatures)==null?void 0:e.multiWallet;await x.disconnect(s?{id:n,namespace:i}:{}),r&&s&&(h.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{S.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(e){const i=u.getActiveCaipAddress(),o=u.getAllApprovedCaipNetworkIds(),r=u.getNetworkProp("supportsAllNetworks",e.chainNamespace),n=h.state.data;i?o!=null&&o.includes(e.caipNetworkId)?await u.switchActiveNetwork(e):r?h.push("SwitchNetwork",{...n,network:e}):h.push("SwitchNetwork",{...n,network:e}):i||(u.setActiveCaipNetwork(e),h.push("Connect"))}};wt.styles=xo;pi([d()],wt.prototype,"disconnecting",void 0);pi([d()],wt.prototype,"remoteFeatures",void 0);wt=pi([p("w3m-unsupported-chain-view")],wt);const vo=$`
  wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
  }

  /* -- Types --------------------------------------------------------- */
  wui-flex[data-type='info'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  wui-flex[data-type='success'] {
    color: ${({tokens:t})=>t.core.textSuccess};
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] {
    color: ${({tokens:t})=>t.core.textError};
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  wui-flex[data-type='warning'] {
    color: ${({tokens:t})=>t.core.textWarning};
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  wui-flex[data-type='info'] wui-icon-box {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  wui-flex[data-type='success'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  wui-flex[data-type='warning'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  wui-text {
    flex: 1;
  }
`;var Mt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let et=class extends f{constructor(){super(...arguments),this.icon="externalLink",this.text="",this.type="info"}render(){return l`
      <wui-flex alignItems="center" data-type=${this.type}>
        <wui-icon-box size="sm" color="inherit" icon=${this.icon}></wui-icon-box>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
      </wui-flex>
    `}};et.styles=[I,W,vo];Mt([c()],et.prototype,"icon",void 0);Mt([c()],et.prototype,"text",void 0);Mt([c()],et.prototype,"type",void 0);et=Mt([p("wui-banner")],et);const $o=oe`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var Co=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ei=class extends f{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l` <wui-flex flexDirection="column" .padding=${["2","3","3","3"]} gap="2">
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=u.getAllRequestedCaipNetworks(),i=u.getAllApprovedCaipNetworkIds(),o=u.state.activeCaipNetwork,r=u.checkIfSmartAccountEnabled();let n=g.sortRequestedNetworks(i,e);if(r&&Ie(o==null?void 0:o.chainNamespace)===ce.ACCOUNT_TYPES.SMART_ACCOUNT){if(!o)return null;n=[o]}return n.filter(a=>a.chainNamespace===(o==null?void 0:o.chainNamespace)).map(a=>l`
        <wui-list-network
          imageSrc=${w(A.getNetworkImage(a))}
          name=${a.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};ei.styles=$o;ei=Co([p("w3m-wallet-compatible-networks-view")],ei);const So=$`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    box-shadow: 0 0 0 8px ${({tokens:t})=>t.theme.borderPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    overflow: hidden;
  }

  :host([data-border-radius-full='true']) {
    border-radius: 50px;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var Vt=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let tt=class extends f{render(){return this.dataset.borderRadiusFull=this.borderRadiusFull?"true":"false",l`${this.templateVisual()}`}templateVisual(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:l`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};tt.styles=[I,So];Vt([c()],tt.prototype,"imageSrc",void 0);Vt([c()],tt.prototype,"alt",void 0);Vt([c({type:Boolean})],tt.prototype,"borderRadiusFull",void 0);tt=Vt([p("wui-visual-thumbnail")],tt);const Eo=$`
  :host {
    display: flex;
    justify-content: center;
    gap: ${({spacing:t})=>t[4]};
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;var ko=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let ti=class extends f{constructor(){var e,i,o;super(...arguments),this.dappImageUrl=(e=b.state.metadata)==null?void 0:e.icons,this.walletImageUrl=(o=(i=u.getAccountData())==null?void 0:i.connectedWalletInfo)==null?void 0:o.icon}firstUpdated(){var i;const e=(i=this.shadowRoot)==null?void 0:i.querySelectorAll("wui-visual-thumbnail");e!=null&&e[0]&&this.createAnimation(e[0],"translate(18px)"),e!=null&&e[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){var e;return l`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${(e=this.dappImageUrl)==null?void 0:e[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,i){e.animate([{transform:"translateX(0px)"},{transform:i}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};ti.styles=Eo;ti=ko([p("w3m-siwx-sign-message-thumbnails")],ti);var wi=function(t,e,i,o){var r=arguments.length,n=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let jt=class extends f{constructor(){var e;super(...arguments),this.dappName=(e=b.state.metadata)==null?void 0:e.name,this.isCancelling=!1,this.isSigning=!1}render(){return l`
      <wui-flex justifyContent="center" .padding=${["8","0","6","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex .padding=${["0","20","5","20"]} gap="3" justifyContent="space-between">
        <wui-text variant="lg-medium" align="center" color="primary"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["0","10","4","10"]} gap="3" justifyContent="space-between">
        <wui-text variant="md-regular" align="center" color="secondary"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["4","5","5","5"]} gap="3" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-secondary"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-primary"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await Kt.requestSignMessage()}catch(e){if(e instanceof Error&&e.message.includes("OTP is required")){T.showError({message:"Something went wrong. We need to verify your account again."}),h.replace("DataCapture");return}throw e}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await Kt.cancelSignMessage().finally(()=>this.isCancelling=!1)}};wi([d()],jt.prototype,"isCancelling",void 0);wi([d()],jt.prototype,"isSigning",void 0);jt=wi([p("w3m-siwx-sign-message-view")],jt);export{mi as AppKitAccountButton,gi as AppKitButton,xi as AppKitConnectButton,$i as AppKitNetworkButton,fi as W3mAccountButton,de as W3mAccountSettingsView,Yt as W3mAccountView,It as W3mAllWalletsView,bi as W3mButton,Pt as W3mChooseAccountNameView,yi as W3mConnectButton,q as W3mConnectView,Dt as W3mConnectWalletsView,ki as W3mConnectingExternalView,Rt as W3mConnectingMultiChainView,Ot as W3mConnectingWcBasicView,Se as W3mConnectingWcView,_i as W3mDownloadsView,Rs as W3mFooter,Fe as W3mFundWalletView,Ri as W3mGetWalletView,vi as W3mNetworkButton,pt as W3mNetworkSwitchView,qe as W3mNetworksView,F as W3mProfileWalletsView,Ws as W3mRouter,jt as W3mSIWXSignMessageView,Lt as W3mSwitchActiveChainView,wt as W3mUnsupportedChainView,ei as W3mWalletCompatibleNetworksView,Ni as W3mWhatIsANetworkView,Wi as W3mWhatIsAWalletView};
