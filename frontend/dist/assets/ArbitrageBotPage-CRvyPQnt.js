import{cX as e,cW as i,d0 as l}from"./index-ZNJTT0gP.js";const p=({status:s})=>{const r=s==="Online"?"green":s==="Connecting..."||s==="Error"?"gray":"red";return e.jsx("div",{className:"arbitrage-bot-controller-centered",children:e.jsxs("div",{className:"bot-container",style:{textAlign:"center"},children:[e.jsx("div",{className:"controller-header",children:e.jsx("h3",{children:"Automated Arbitrage Bot"})}),e.jsxs("div",{className:"status-section",children:[e.jsx("p",{children:"The automated arbitrage bot runs 24/7 on our secure backend server."}),e.jsx("p",{children:"You do not need to start, stop, or configure anything here."})]}),e.jsx("div",{className:"status-indicator",children:e.jsxs("h4",{children:["Backend Server Status:",e.jsx("span",{style:{color:r,marginLeft:"10px"},children:s})]})}),e.jsx("div",{className:"log-info",children:e.jsx("p",{children:"All trading activity and profit reports are logged in real-time below."})})]})})},u=({logs:s})=>{const r=i.useRef(null);return i.useEffect(()=>{var t;(t=r.current)==null||t.scrollIntoView({behavior:"smooth"})},[s]),e.jsxs("div",{className:"bot-logs-container",children:[e.jsx("h4",{className:"logs-header",children:"Live Bot Logs"}),e.jsxs("div",{className:"logs-content",children:[s.map((t,o)=>e.jsxs("div",{className:"log-entry",children:[e.jsxs("span",{className:"log-timestamp",children:[new Date().toLocaleTimeString(),":"]}),e.jsx("span",{className:"log-message",children:t})]},o)),e.jsx("div",{ref:r})]})]})},j=l.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`,m=l.h2`
  color: #333;
  text-align: center;
`,b=l.ul`
  list-style: none;
  padding: 0;
`,f=l.li`
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
`,v=l.pre`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85em;
  margin-top: 10px;
`,N=({trades:s})=>e.jsxs(j,{children:[e.jsx(m,{children:"Trade History"}),s.length>0?e.jsx(b,{children:s.map((r,t)=>e.jsxs(f,{children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Profit:"})," ",r.profit]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Route:"})," ",r.route]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Transaction:"})," ",e.jsx("a",{href:r.transactionUrl,target:"_blank",rel:"noopener noreferrer",children:"View on Basescan"})]}),r.input&&e.jsxs(e.Fragment,{children:[e.jsx("strong",{children:"Input Data:"}),e.jsx(v,{children:r.input})]})]},t))}):e.jsx("p",{children:"No trades recorded yet."})]}),k=()=>{const[s,r]=i.useState("Connecting..."),[t,o]=i.useState([]),[x,h]=i.useState([]);return i.useEffect(()=>{const g=`ws://${window.location.host}`,c=new WebSocket(g);return c.onopen=()=>{r("Online"),o(n=>[...n,"Connected to bot server."])},c.onmessage=n=>{const a=JSON.parse(n.data);switch(a.type){case"status":r(a.data.isOnline?"Online":"Offline");break;case"log":o(d=>[...d,a.data]);break;case"trade":h(d=>[a.data,...d]);break}},c.onclose=()=>{r("Offline"),o(n=>[...n,"Disconnected from bot server."])},c.onerror=n=>{r("Error"),o(a=>[...a,`WebSocket Error: ${n.message}`])},()=>{c.close()}},[]),e.jsxs("div",{className:"arbitrage-bot-container",children:[e.jsxs("div",{className:"controller-header",children:[e.jsx("h3",{children:"Arbitrage Bot"}),e.jsx("p",{className:"page-description",children:"Live status and activity of the automated arbitrage bot."})]}),e.jsx(p,{status:s}),e.jsx(u,{logs:t}),e.jsx(N,{trades:x})]})};export{k as default};
