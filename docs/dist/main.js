(()=>{"use strict";function e(e){let t=new Uint16Array(e.length);for(let n=0;n<t.length;n++)t[n]=e.charCodeAt(n);let n=2166136261;for(let e of t)n=16777619*n^e;return n}function t(e,t){return function(n){return customElements.define(e,n,t)}}function n(e,...t){return new s(e,t)}class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get styles(){return[new CSSStyleSheet]}connectedCallback(){this.state=this.init();const{strings:e,values:t}=this.render(this.state);null==this.template&&(this.template=new c(e),this.shadowRoot.appendChild(this.template.fragment),this.template.fragment=this.shadowRoot,this.shadowRoot.adoptedStyleSheets=this.constructor.styles),this.template._update(...t)}init(){}render(){return n``}dispatch(e,...t){this.state=this[e](this.state,...t);const{values:n}=this.render(this.state);this.template._update(...n)}}class s{constructor(e,t){this.strings=e,this.values=t}}class a{constructor(e){this.template=e}hash(){return this.template.temp_hash}}class o extends a{constructor(e,t){super(e),this.args=t}update(e=null){e&&(this.args=e),this.template._update(...this.args)}}class i extends a{constructor(e){super(e)}}class d{constructor(e,t,n=null){this.values=new Array,this.container=t,this.hash=n;for(const t of e)if(t instanceof s){let e=new c(t.strings);this.values.push(new o(e,t.values))}else{let e=new h(t);this.values.push(new i(e))}}diff(e){let t=this.values.length,n=e.values.length,r=new Array(t+1);for(let e=0;e<=t;e++){r[e]=new Array(n+1);for(let t=0;t<=n;t++)r[e][t]={d:t,from:[0,t-1]};r[e][0]={d:e,from:[e-1,0]}}for(let s=1;s<=t;s++)for(let t=1;t<=n;t++)if(this.values[s-1].hash()===e.values[t-1].hash())switch(Math.min(r[s-1][t].d+1,r[s][t-1].d+1,r[s-1][t-1].d)){case r[s-1][t].d:r[s][t]={d:r[s-1][t].d+1,from:[s-1,t]};break;case r[s][t-1].d:r[s][t]={d:r[s][t-1].d+1,from:[s,t-1]};break;case r[s-1][t-1].d:r[s][t]={d:r[s][t].d+1,from:[s-1,t-1]}}else r[s-1][t]+1?r[s][t]={d:r[s-1][t].d+1,from:[s-1,t]}:r[s][t]={d:r[s][t-1].d+1,from:[s,t-1]};let s=this.values.length,a=e.values.length;const i=[];for(;s>0||a>0;){const t=r[s][a].from[0],n=r[s][a].from[1];if(s-1==t&&a-1==n)s--,a--,i.unshift(this.values[s]),i[0]instanceof o&&i[0].update(e.values[a].args);else if(s-1==t&&a==n)s--,this.values[s].template.remove();else{if(s!=t||a-1!=n)break;if(a--,0==i.length){const t=document.createTreeWalker(this.container.fragment);do{let n=t.currentNode;if(n instanceof Comment&&n.data.trim()=="node-"+this.hash+"-end"){n.parentNode.insertBefore(e.values[a].template.fragment,n),e.values[a].template.fragment=n.parentNode,e.values[s]instanceof o&&e.values[a].update();break}}while(t.nextNode());e.values[a].fragment=t.currentNode.parentNode}else i[0].template.insertBefore(e.values[a].template),e.values[a].template.fragment=i[0].template.fragment,e.values[s]instanceof o&&e.values[a].update(e.values[a].args);i.unshift(e.values[a])}}this.values=i}}class l{constructor(e,t,n){this.hash=e,this.temp_hash=t,this.arg_hash=n}remove(){const e=document.createTreeWalker(this.fragment),t=document.createRange();do{if(e.currentNode instanceof Comment&&e.currentNode.data.trim()=="node-"+this.hash+"-start"){e.currentNode.parentNode?t.setStart(e.currentNode.parentNode,[].slice.call(e.currentNode.parentNode.childNodes).indexOf(e.currentNode)):t.setStart(this.fragment,[].slice.call(this.fragment.childNodes).indexOf(e.currentNode));do{if(e.currentNode instanceof Comment&&e.currentNode.data.trim()=="node-"+this.hash+"-end"){e.currentNode.parentNode?t.setEnd(e.currentNode.parentNode,[].slice.call(e.currentNode.parentNode.childNodes).indexOf(e.currentNode)+1):t.setEnd(this.fragment,[].slice.call(this.fragment.childNodes).indexOf(e.currentNode)+1);break}}while(e.nextNode());t.deleteContents();break}}while(e.nextNode())}insertBefore(e){const t=document.createTreeWalker(this.fragment);for(;t.nextNode();){let n=t.currentNode;if(n instanceof Comment&&n.data.trim()=="node-"+this.hash+"-start"){n.parentNode?n.parentNode.insertBefore(e.fragment,n):this.fragment.insertBefore(e.fragment,n);break}}}}class c extends l{constructor(t){null==t&&(t=[]);let n=e(t.join("")+Math.random());super(n,e("temp"+t.join("")),n),this.strings=t;let r="\x3c!-- node-"+n+"-start --\x3e";this.placeholder=[];for(const n in t){const s=t[n];r+=s;const a=s.trim();if("="==a[a.length-1]||"="==a[a.length-2]){let t="";if("'"==a[a.length-1]||'"'==a[a.length-1]||"`"==a[a.length-1]){r+=a[a.length];for(let e=a.length-3;e>=0&&" "!=a[e];e--)t=a[e]+t}else{r+='""';for(let e=a.length-2;e>=0&&" "!=a[e];e--)t=a[e]+t}const s=e(t+n+Math.random());r+=" data-attr"+s+"="+t,this.placeholder.push({hash:s,type:"attr",attr:t})}else if(n!=t.length-1){const t=e(n+r+Math.random());r+="\x3c!-- node-"+t+"-start --\x3e\x3c!-- node-"+t+"-end --\x3e",this.placeholder.push({type:"temp",hash:t,temp_arr:new d([""],this,t)})}}r+="\x3c!-- node-"+n+"-end --\x3e";const s=document.createElement("template");s.innerHTML=r,this.fragment=s.content;const a=document.createTreeWalker(this.fragment,NodeFilter.SHOW_COMMENT);for(const e of this.placeholder)if("attr"!=e.type)for(;a.nextNode();)a.currentNode.data.trim()=="node-"+e.hash+"-start"&&(a.nextNode(),a.currentNode.parentNode.insertBefore(e.temp_arr.values[0].template.fragment,a.currentNode),e.temp_arr.values[0].template.fragment=a.currentNode.parentNode,a.nextNode())}_update(...t){this.arg_hash=e(this.strings.join("")+t.map((e=>String(e))).join(""));const n=document.createTreeWalker(this.fragment);for(const e in this.placeholder){const r=this.placeholder[e],{type:s,hash:a}=r;for(;n.nextNode();)if(!(n.currentNode instanceof Text)){if(n.currentNode instanceof Comment&&n.currentNode.data.trim()=="node-"+a+"-start")break;if("attr"==s&&n.currentNode instanceof HTMLElement&&n.currentNode.hasAttribute("data-attr"+a))break}if("attr"==s){const s=n.currentNode,a=r.attr;switch(a[0]){case"@":s["on"+a.slice(1)]=t[e];break;case".":s[a.slice(1)]=t[e];break;case"?":let n=a.slice(1);t[e]?s.setAttribute(n,""):p.element.hasAttribute(n)&&s.removeAttribute(n);break;default:s.setAttribute(a,String(t[e]))}}else{n.nextNode();const s=document.createRange();let o=n.currentNode,i=o.parentNode?o.parentNode:this.fragment;s.setStart(i,[].slice.call(i.childNodes).indexOf(o));do{let e=n.currentNode;if(e instanceof Comment&&e.data.trim()=="node-"+a+"-end")break;s.setEnd(e.parentNode,[].slice.call(e.parentNode.childNodes).indexOf(e))}while(n.nextNode());Array.isArray(t[e])||(t[e]=[t[e]]);const l=new d(t[e]);r.temp_arr.diff(l)}n.nextNode()}}}class h extends l{constructor(t){let n=e(t),r=e("text"+String(t));super(e(t+Math.random()),r,n);const s=document.createElement("template");s.innerHTML="\x3c!-- node-"+this.hash+"-start --\x3e"+String(t)+"\x3c!-- node-"+this.hash+"-end --\x3e",this.fragment=s.content}}const u=new CSSStyleSheet;u.replaceSync("header #inner{\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        padding: 64px 0;\n    }\n    header #logo{\n        width: 200px;\n        height: auto;\n    }\n");const m=u;t("om-header")(class extends r{static get styles(){return[m]}render(){return n`
      <header>
        <div id='inner'>
          <img src='/img/omusubi.svg' id='logo' />
          <h1>Omusubi.js</h1>
          <p>Ball your WebComponents</p>
        </div>
      </header>
    `}});const f=new CSSStyleSheet;f.replaceSync("footer {\n    padding: 32px;\n    font-size: 0.9rem;\n    text-align: center;\n    color: #fff;\n    background: #111;\n}\n");const g=f;t("om-footer")(class extends r{static get styles(){return[g]}render(){return n`
      <footer>
        <div id='inner'>
          Released under the MIT License<br>
          Copyright © 2020 - 木瓜丸
        </div>
      </footer>
    `}});const N=new CSSStyleSheet;N.replaceSync("#features #feature-list{\n        display: grid;\n        grid-template-columns: 1fr 1fr 1fr;\n        grid-gap: 24px;\n    }\n");const x=N;t("om-features")(class extends r{static get styles(){return[x]}render(){return n`
      <div id='features'>
        <h2>Features</h2>
        <div id='feature-list'>
          <om-feature>
            <h3 slot='title'>Cooperate with Vanilla</h3>
            <p slot='content'>
              You do not need any compile process to define component. The components you defined are able to be used in native HTML.
            </p>
          </om-feature>
          <om-feature>
            <h3 slot='title'>No Virtual DOM</h3>
            <p slot='content'>
              Insted of Virtual DOM diffing, Omusubi.js uses Value diffing; check diff if there is possibility of changing.
            </p>
          </om-feature>
          <om-feature>
            <h3 slot='title'>The Elm Architecture</h3>
            <p slot='content'>
              Omusubi.js is desined while respecting The Elm Architecture. You can make components which have less side-effects.
            </p>
          </om-feature>
        </div>
      </div>
    `}});const v=new CSSStyleSheet;v.replaceSync("#install {\n    display: block;\n    padding: 32px 0;\n}\n    #install div.code {\n        padding: 16px;\n        background: #f6f6f6;\n    }\n\n");const S=v;t("om-install")(class extends r{static get styles(){return[S]}render(){return n`
      <div id='install'>
        <h2>Getting started</h2>
        <div>
          <p>Use npm:</p>
          <div class='code'>
            <code>
              $ npm install omusubi
            </code>
          </div>
          <p>Or, use CDN:</p>
          <div class='code'>
            <code>
              &lt;script type='module'&gt;<br>
                import {Component, html, defineComponent} from '//unpkg.com/omusubi/omusubi.min.js';<br>
              &lt;/script&gt;
            </code>
          </div>
        </div>
      </div>
    `}});const y=new CSSStyleSheet;y.replaceSync("");const b=y;t("om-feature")(class extends r{static get styles(){return[b]}render(){return n`
      <slot name='title'></slot>
      <slot name='content'></slot>
    `}});const w=new CSSStyleSheet;w.replaceSync("main{\n    max-width: 720px;\n    margin: 0 auto;\n    padding: 0 24px;\n}\n");const k=w;t("om-page")(class extends r{static get styles(){return[k]}render(){return n`
      <om-header></om-header>
      <main>
        <om-features></om-features>
        <om-install></om-install>
      </main>
      <om-footer></om-footer>
    `}})})();