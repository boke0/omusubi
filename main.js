const FNV_OFFSET_BASIS_32 = 2166136261;
const FNV_PRIME_32 = 16777619;

function hash(str){
  if(typeof str != 'string') {
    str = String(str);
  }
  let arr = new Uint16Array(str.length);
  for(let i = 0; i<arr.length; i++) arr[i] = str.charCodeAt(i);
  let hash = FNV_OFFSET_BASIS_32;
  for(let c of arr) {
    hash = (FNV_PRIME_32 * hash) ^ c;
  }
  return hash;
}

export function defineComponent(tagname, options) {
  return function (wrapped) {
    return customElements.define(
      tagname,
      wrapped,
      options
    )
  }
}

export function html(strings, ...values){
  return new RawHTMLTagFuncOutput(strings, values)
}

export class Dispatcher extends Function {
  constructor(element, store) {
    super();
    this.element = element;
    this.store = store;
    return new Proxy(this, {
      apply(target, thisArg, args) {
        return target.dispatch(...args);
      }
    });
  }
  async dispatch(action, ...args) {
    this.store.update(await this[action](this.store.proxy(), ...args));
  }
  init(){
    return {}
  }
  updatecontext(state){
    return {...state}
  }
  prop(key, default_value){
    return this.element[key] ? this.element[key] : default_value;
  }
  attr(key, default_value){
    return this.element.hasAttribute(key) ? this.element.getAttribute(key) : default_value;
  }
  proxy() {
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if(prop == '$context'){
          return this.element.context ? this.element.context.dispatcher.proxy() : null;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
}

export class Store{
  constructor(element, state = {}) {
    this.context = null;
    this.state = state;
    this.element = element;
  }
  setContext(store) {
    this.context = store;
  }
  update(state) {
    this.state = state;
    this.element.update();
  }
  proxy() {
    return new Proxy(this.state, {
      get: (target, prop, receiver) => {
        if(prop == '$context'){
          return this.element.context ? this.element.context.store.proxy() : null;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
}

export class Component extends HTMLElement{
  static get dispatcher() { return Dispatcher; }
  constructor() {
    super();
    this.store = new Store(this);
    this.dispatcher = new this.constructor.dispatcher(this, this.store);
    this.attachShadow({mode: 'open'});
  }
  static get styles() {
    return [];
  }
  async connectedCallback(){
    await this.dispatcher('init');
    if(this.afterFirstUpdate) this.afterFirstUpdate();
  }
  setContext(template) {
    const walker = document.createTreeWalker(template);
    while(walker.nextNode()){
      walker.currentNode.context = this.context;
      if(walker.currentNode.childNodes.length > 0){
        this.setContext(walker.currentNode);
      }
      if(walker.currentNode instanceof Component) {
        walker.currentNode.setContext(walker.currentNode.shadowRoot);
      }
    }
  }
  get $contextStore() {
    return this.context.store.proxy();
  }
  get $contextDispatch() {
    return this.context.dispatch.proxy();
  }
  render(){ return html``; }
  async update(){
    const {strings, values} = this.render(this.store.proxy(), this.dispatcher.proxy());
    if(this.template == null) {
      this.template = new Template(strings);
      this.shadowRoot.appendChild(this.template.fragment);
      this.template.fragment = this.shadowRoot;
      /** Recoverly code until adoptedStyleSheet support will come in firefox. */
      for(const s of this.constructor.styles){
        const style = document.createElement('style');
        style.innerHTML = s;
        this.shadowRoot.appendChild(style);
      }
      /** Recoverly code until adoptedStyleSheet support will come in firefox. */
      /**
      this.shadowRoot.adoptedStyleSheets = this.constructor.styles;
      */
    }
    if(this.beforeUpdate) this.beforeUpdate();
    this.template._update(...values);
    this.setContext(this.shadowRoot);
    if(this.afterUpdate) this.afterUpdate();
  }
}

export class ProviderComponent extends Component {
  setContext(template) {
    const walker = document.createTreeWalker(template);
    while(walker.nextNode()){
      walker.currentNode.context = this;
      if(walker.currentNode.childNodes.length > 0){
        this.setContext(walker.currentNode);
      }
      if(walker.currentNode instanceof Component) {
        walker.currentNode.setContext(walker.currentNode.shadowRoot);
      }
    }
  }
}

class RawHTMLTagFuncOutput {
  constructor(strings, values){
    this.strings = strings;
    this.values = values;
  }
}

class Value{
  constructor(template){
    this.template = template;
  }
  hash(){
    return this.template.temp_hash;
  }
}

class TemplateValue extends Value {
  constructor(template, args){
    super(template);
    this.args = args;
  }
  update(args = null){
    if(args) this.args = args;
    this.template._update(...(this.args));
  }
}

class TextValue extends Value {
  constructor(template){
    super(template);
  }
}

class ValueArray {
  constructor(values, container_template, h=null){
    this.values = new Array();
    this.container = container_template;
    this.hash = h;
    for(const t of values) {
      if(t instanceof RawHTMLTagFuncOutput){
        let template = new Template(t.strings);
        this.values.push(new TemplateValue(template, t.values));
      }else{
        let template = new TextNode(t);
        this.values.push(new TextValue(template));
      }
    }
  }
  diff(value_arr){
    let m = this.values.length;
    let n = value_arr.values.length;
    let D = new Array(m + 1);
    for(let i = 0; i <= m; i++){
      D[i] = new Array(n + 1);
      for(let j = 0; j <= n; j++) D[i][j] = { d: j, from:[i, j-1] };
      D[i][0] = {
        d: i,
        from: [i-1, 0]
      };
    }
    for(let i = 1; i <= m; i++){
      for(let j = 1; j <= n; j++){
        if(this.values[i - 1].hash() === value_arr.values[j - 1].hash()){
          switch(Math.min(D[i - 1][j].d + 1, D[i][j - 1].d + 1, D[i - 1][j - 1].d)){
            case D[i - 1][j].d:
              D[i][j] = {
                d: D[i-1][j].d + 1,
                from: [i-1, j],
              }
              break;
            case D[i][j - 1].d:
              D[i][j] = {
                d: D[i][j-1].d + 1,
                from: [i, j-1],
              }
              break;
            case D[i - 1][j - 1].d:
              D[i][j] = {
                d: D[i][j].d,
                from: [i - 1, j - 1]
              }
              break;
          }
        }else{
          if(D[i-1][j].d + 1 < D[i][j - 1].d + 1){
            D[i][j] = {
              d: D[i-1][j].d + 1,
              from: [i - 1, j]
            }
          }else{
            D[i][j] = {
              d: D[i][j-1].d + 1,
              from: [i, j - 1],
            }
          }
        }
      }
    }
    let i = this.values.length; 
    let j = value_arr.values.length;
    while(i>0||j>0){
      const m = D[i][j].from[0];
      const n = D[i][j].from[1];
      D[m][n].next = [i, j];
      i = m;
      j = n;
    }
    i=0; j=0;
    const new_temp = [];
    while(i<this.values.length || j<value_arr.values.length){

      const m = D[i][j].next[0];
      const n = D[i][j].next[1];
      if(i + 1 == m && j + 1 == n){
        new_temp.push(this.values[i]);
        if(new_temp[new_temp.length - 1] instanceof TemplateValue) {
          let tmp = new_temp[new_temp.length - 1];
          tmp.update(value_arr.values[j].args);
          if(tmp.fragment instanceof Node){
            const walker = document.createTreeWalker(tmp.fragment);
            while(walker.nextNode()) {
              if(walker.currentNode instanceof Component) {
                walker.currentNode.dispatcher('updatecontext');
              }
            }
          }
        }
        i++;
        j++;
      }else if(i + 1 == m && j == n){
        this.values[i].template.remove();
        i++;
      }else if(i == m && j + 1 == n){
        if(new_temp.length == 0){
          const walker = document.createTreeWalker(this.container.fragment);
          do{
            let current = walker.currentNode;
            if(current instanceof Comment && current.data.trim() == 'node-'+this.hash+'-end'){
              current.parentNode.insertBefore(
                value_arr.values[j].template.fragment,
                current
              );
              value_arr.values[j].template.fragment = current.parentNode;
              if(value_arr.values[j] instanceof TemplateValue) value_arr.values[j].update();
              break;
            }
          }while(walker.nextNode());
          value_arr.values[j].fragment = walker.currentNode.parentNode;
        }else{
          new_temp[new_temp.length - 1].template.insertAfter(value_arr.values[j].template);
          value_arr.values[j].template.fragment = new_temp[0].template.fragment;
          if(value_arr.values[j] instanceof TemplateValue) value_arr.values[j].update(value_arr.values[j].args);
        }
        new_temp.push(value_arr.values[j]);
        j++;
      }else{
        break;
      }
    }
    this.values = new_temp;
  }
}

class RenderPart {
  constructor(hash, temp_hash, arg_hash){
    this.hash = hash;
    this.temp_hash = temp_hash;
    this.arg_hash = arg_hash;
  }
  remove(){
    const walker = document.createTreeWalker(this.fragment);
    const range = document.createRange();
    do{
      if(walker.currentNode instanceof Comment && walker.currentNode.data.trim() == 'node-'+this.hash+'-start'){
        if(walker.currentNode.parentNode){
          range.setStart(
            walker.currentNode.parentNode,
            [].slice.call(walker.currentNode.parentNode.childNodes).indexOf(walker.currentNode)
          )
        }else{
          range.setStart(
            this.fragment,
            [].slice.call(this.fragment.childNodes).indexOf(walker.currentNode)
          )
        }
        do{
          if(walker.currentNode instanceof Comment && walker.currentNode.data.trim() == 'node-'+this.hash+'-end'){
            if(walker.currentNode.parentNode){
              range.setEnd(
                walker.currentNode.parentNode,
                [].slice.call(walker.currentNode.parentNode.childNodes).indexOf(walker.currentNode) + 1
              )
            }else{
              range.setEnd(
                this.fragment,
                [].slice.call(this.fragment.childNodes).indexOf(walker.currentNode) + 1
              )
            }
            break;
          }
        }while(walker.nextNode());
        range.deleteContents();
        break;
      }
    } while(walker.nextNode());
  }
  insertAfter(template){
    const walker = document.createTreeWalker(this.fragment);
    while(walker.nextNode()){
      let current = walker.currentNode;
      if(current instanceof Comment && current.data.trim() == 'node-'+this.hash+'-end'){
        if(current.parentNode){
          current.parentNode.insertBefore(template.fragment, current.nextSibling);
        }else{
          this.fragment.insertBefore(template.fragment, current.nextSibling);
        }
        break;
      }
    }
  }
}

class Template extends RenderPart {
  constructor(strings){
    if(strings == null) strings = [];
    let whole_hash = hash(strings.join('')+Math.random());
    let temp_hash = hash('temp'+strings.join(''));
    super(whole_hash, temp_hash, whole_hash);
    this.strings = strings;
    let html = '<!-- node-'+whole_hash+'-start -->';
    this.placeholder = [];
    for(const i in strings){
      const s = strings[i];
      html += s;
      const s_ = s.trim();
      if(s_[s_.length-1]=='=' || s_[s_.length-2]=='='){
        //属性だった場合
        let attr = '';
        if (s_[s_.length-1] == '\'' || s_[s_.length-1] == '\"' || s_[s_.length-1] == '\`') {
          html += s_[s_.length];
          for(let j = s_.length-3; j>=0; j--) {
            if (s_[j] == ' ') break;
            attr = s_[j] + attr;
          }
        }else{
          html += '\"\"';
          for(let j = s_.length-2; j>=0; j--) {
            if (s_[j] == ' ') break;
            attr = s_[j] + attr;
          }
        }
        const h = hash(attr+i+Math.random());
        html += (' data-attr'+h+'='+attr);
        this.placeholder.push({
          hash: h,
          type: 'attr',
          attr: attr,
          value: null
        });
      }else if (i != strings.length - 1){
        //Nodeだった場合
        const h = hash(i+html+Math.random());
        html += ('<!-- node-'+h+'-start --><!-- node-'+h+'-end -->');
        this.placeholder.push({
          type: 'temp',
          hash: h,
          temp_arr: new ValueArray([''], this, h)
        });
      }
    }
    html += '<!-- node-'+whole_hash+'-end -->';
    const temp = document.createElement('template');
    temp.innerHTML = html;
    this.fragment = temp.content;
    const walker = document.createTreeWalker(this.fragment, NodeFilter.SHOW_COMMENT);
    for(const p of this.placeholder){
      if(p.type == 'attr') continue;
      while(walker.nextNode()){
        if(walker.currentNode.data.trim() == 'node-'+p.hash+'-start'){
          walker.nextNode();
          walker.currentNode.parentNode.insertBefore(
            p.temp_arr.values[0].template.fragment,
            walker.currentNode
          );
          p.temp_arr.values[0].template.fragment = walker.currentNode.parentNode;
          walker.nextNode();
        }

      }
    }
  }
  _update(...values){
    const walker = document.createTreeWalker(this.fragment);
    for(let i = 0; i<this.placeholder.length; i++){
      const placeholder = this.placeholder[i];
      const {type, hash} = placeholder;
      if(type == 'attr'){
        const element = this.fragment.querySelector('[data-attr'+hash+']');
        const a = placeholder.attr;
        switch(a[0]) {
            case "@":
                element.removeEventListener(a.slice(1), placeholder.value);
                element.addEventListener(a.slice(1), values[i]);
                break;
            case ".":
                element[a.slice(1)] = values[i];
                break;
            case "?":
                let attr = a.slice(1);
                if(values[i]){
                    element.setAttribute(attr, '');
                }else if(element.hasAttribute(attr)){
                    element.removeAttribute(attr);
                }
                break;
            default:
                element.setAttribute(a, String(values[i]));
                break;
        }
        placeholder.value = values[i];
      }else{
        do{
          if(walker.currentNode instanceof Text) continue;
          if(walker.currentNode instanceof Comment && walker.currentNode.data.trim() == 'node-'+hash+'-start'){
            break;
          }
        } while(walker.nextNode());
        const range = document.createRange();
        let current = walker.currentNode;
        let container = current.parentNode ? current.parentNode : this.fragment;
        range.setStart(
          container,
          [].slice.call(
            container.childNodes
          ).indexOf(current)
        );
        do {
          let current = walker.currentNode;
          if(current instanceof Comment && current.data.trim() == 'node-'+hash+'-end'){
            break;
          }
          range.setEnd(
            current.parentNode,
            [].slice.call(
              current.parentNode.childNodes
            ).indexOf(current)
          );
        } while(walker.nextNode());
        if(!Array.isArray(values[i])) values[i] = [values[i]];
        const temp_arr = new ValueArray(values[i]);
        placeholder.temp_arr.diff(temp_arr);
      }
      walker.nextNode();
    }
  }
}

class TextNode extends RenderPart {
  constructor(value){
    let arg_hash = hash(value);
    let temp_hash = hash('text'+String(value));
    let h = hash(value + Math.random());
    super(h, temp_hash, arg_hash);
    const template = document.createElement('template');
    template.innerHTML = '<!-- node-'+this.hash+'-start -->'+String(value)+'<!-- node-'+this.hash+'-end -->';
    this.fragment = template.content;
  }
}
