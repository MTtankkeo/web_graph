class t extends HTMLElement{redraw(){this.redrawId&&cancelAnimationFrame(this.redrawId),this.redrawId=requestAnimationFrame((t=>{console.assert(void 0!==this.raw),this._drawCallback(this.getContext2D(),this.raw.getBoundingClientRect())}))}get draw(){return this._drawCallback}set draw(t){this._drawCallback=t,void 0!==this.raw&&this._drawCallback(this.getContext2D(),this.raw.getBoundingClientRect())}getContext2D(){return this.raw.getContext("2d")}createRaw(){const t=document.createElement("canvas");return t.style.width=this.style.width,t.style.height=this.style.height,t}disconnectedCallback(){this.observer.disconnect()}connectedCallback(){this.style.display="flex",this.observer=new ResizeObserver((t=>{const e=this.getContext2D(),s=this.raw.getBoundingClientRect(),i=devicePixelRatio||1;this.raw.width=s.width*i,this.raw.height=s.height*i,e.scale(i,i),this.draw&&this.draw(e,s)})),this.observer.observe(this.raw=this.createRaw());this.attachShadow({mode:"closed"}).appendChild(this.raw)}}customElements.define("sharp-canvas",t);class e extends HTMLElement{}class s{constructor(t){this.callback=t,this.isDisposed=!1,this.id=requestAnimationFrame(this.handle=this.handle.bind(this))}handle(t){var e;if(this.isDisposed)return;const s=t-(null!==(e=this.previousElapsed)&&void 0!==e?e:t);this.previousElapsed=t,this.callback(s),this.id=requestAnimationFrame(this.handle)}dispose(){this.isDisposed=!0,cancelAnimationFrame(this.id)}}var i;!function(t){t[t.NONE=0]="NONE",t[t.FORWARD=1]="FORWARD",t[t.FORWARDED=2]="FORWARDED",t[t.BACKWARD=3]="BACKWARD",t[t.BACKWARDED=4]="BACKWARDED"}(i||(i={}));class n{}class a extends n{constructor(){super(...arguments),this.listeners=[],this.statusListeners=[]}addListener(t){console.assert(!this.listeners.includes(t),"Already a given listener does exist."),this.listeners.push(t)}removeListener(t){console.assert(this.listeners.includes(t),"Already a given listener does not exist."),this.listeners=this.listeners.filter((e=>e!=t))}addStatusListener(t){console.assert(!this.statusListeners.includes(t),"Already a given status listener does exist."),this.statusListeners.push(t)}removeStatusListener(t){console.assert(this.statusListeners.includes(t),"Already a given status listener does not exist."),this.statusListeners=this.statusListeners.filter((e=>e!=t))}notifyListeners(t){this.listeners.forEach((e=>e(t)))}notifyStatusListeners(t){this.statusListeners.forEach((e=>e(t)))}}class r extends a{get status(){return this._status}set status(t){this._status!=t&&this.notifyStatusListeners(this._status=t)}get value(){return this._value}set value(t){this._value!=t&&this.notifyListeners(this._value=t)}constructor(t,e=0,s=1,n=e){if(super(),this.duration=t,this.lowerValue=e,this.upperValue=s,this._status=i.NONE,this.lowerValue>this.upperValue)throw new Error("The lowerValue must be less than the upperValue.");this._value=n}get range(){return this.upperValue-this.lowerValue}get relValue(){return(this.value-this.lowerValue)/this.range}get progressValue(){const t=this.tween.begin,e=this.tween.end-t;return(this.relValue-t)/e}forward(t){this.animateTo(this.upperValue,t)}backward(t){this.animateTo(this.lowerValue,t)}repeat(){this.addStatusListener((t=>{t==i.FORWARDED&&this.backward(),t==i.BACKWARDED&&this.forward()})),this.status!=i.NONE&&this.status!=i.BACKWARDED||this.forward()}animateTo(t,e){this.animate(this.value,t,e)}animate(t,e,n=this.duration){var a;if(e==t)return;console.assert(t>=this.lowerValue,"A given [from] is less than the min-range."),console.assert(e<=this.upperValue,"A given [to] is larger than the max-range."),this.value=t,this.tween={begin:t,end:e};const r=e>t;this.status=r?i.FORWARD:i.BACKWARD;const h=n/this.range;null===(a=this.activeTicker)||void 0===a||a.dispose(),this.activeTicker=new s((s=>{const n=s/h,a=r?n:-n,o=this.consume(t,e,a);if(Math.abs(a-o)>1e-10)return this.value=e,this.dispose(),void(this.status=r?i.FORWARDED:i.BACKWARDED);this.value+=o}))}consume(t,e,s){const i=e-(this.value+s);return e>t?i<=0?i:s:i>=0?i:s}dispose(){var t;null===(t=this.activeTicker)||void 0===t||t.dispose(),this.activeTicker=null}reset(){this.status=i.NONE,this.value=this.lowerValue,this.tween=null}}class h{}class o extends h{constructor(t,e){super(),this.begin=t,this.end=e}transform(t){return this.begin+(this.end-this.begin)*t}}class l extends a{constructor(t,e,s){super(),this.curve=e,this.status=i.NONE,this.value=null!=s?s:0,this.parent=new r(t,0,1),this.parent.addListener((t=>{const s=this.parent.progressValue;if(null==e)return void this.notifyListeners(this.value=this.tween.transform(s));const i=e.transform(s),n=this.tween.end-this.tween.begin,a=this.tween.begin+n*i;this.notifyListeners(this.value=a)})),this.parent.addStatusListener((t=>{if(t==i.NONE)return;const e=this.tween.end>this.tween.begin;t==i.FORWARD?this.notifyStatusListeners(this.status=e?i.FORWARD:i.BACKWARD):this.notifyStatusListeners(this.status=e?i.FORWARDED:i.BACKWARDED)}))}animateTo(t){t!=this.value&&this.animate(this.value,t)}animate(t,e){this.tween=new o(t,e),this.parent.reset(),this.parent.forward()}dispose(){this.tween=null,this.parent.dispose(),this.parent=null}}class u{constructor(t,e){this.x=t,this.y=e}lerp(t,e){const s=this.x+(t.x-this.x)*e,i=this.y+(t.y-this.y)*e;return new u(s,i)}}class d{constructor(t,e,s,i,n=new u(0,0),a=new u(1,1),r=1e-4){this.errorBound=r,this.p1=n,this.p2=new u(t,e),this.p3=new u(s,i),this.p4=a}get flipped(){return new d(1-this.p2.x,1-this.p2.y,1-this.p3.x,1-this.p3.y,this.p1,this.p4,this.errorBound)}at(t){const e=this.p1,s=this.p2,i=this.p3,n=this.p4,a=e.lerp(s,t),r=s.lerp(i,t),h=i.lerp(n,t),o=a.lerp(r,t),l=r.lerp(h,t);return o.lerp(l,t)}transform(t){if(t<0||t>1)throw new Error("In the transform function of the Cubic, t must be given from 0 to 1.");if(0==t)return this.p1.y;if(1==t)return this.p4.y;let e=0,s=1;for(;;){const i=(e+s)/2,n=this.at(i);if(Math.abs(t-n.x)<this.errorBound)return n.y;n.x<t?e=i:s=i}}createAnimation(t){return new l(t,this)}static var(t,e){const s=window.getComputedStyle(e||document.documentElement).getPropertyValue(t).trim();if(""===s)throw new Error("The cubic format value of the given name could not be found.");return this.parse(s)}static parse(t){const e=t.match(/([0-9.]+)/g).map(Number);if(4!=e.length)throw new Error("The given [str] format is invalid. (ex: cubic-bezier(0,1,0,1))");return new d(e[0],e[1],e[2],e[3])}toString(){return`Cubic(${this.p2.x}, ${this.p2.y}, ${this.p3.x}, ${this.p3.y})`}}const c={Linear:new d(0,0,1,1),Ease:new d(.25,.1,.25,1),EaseIn:new d(.42,0,1,1),EaseOut:new d(0,0,.58,1),EaseInOut:new d(.42,0,.58,1),EaseInSine:new d(.12,0,.39,0),EaseOutSine:new d(.61,1,.88,1),EaseInQuad:new d(.11,0,.5,0),EaseOutQuad:new d(.5,1,.89,1),EaseInOutQuad:new d(.45,0,.55,1),EaseInOutSine:new d(.37,0,.63,1),EaseInCubic:new d(.32,0,.67,0),EaseOutCubic:new d(.33,1,.68,1),EaseInOutCubic:new d(.65,0,.35,1),EaseInQuart:new d(.5,0,.75,0),EaseOutQuart:new d(.25,1,.5,1),EaseInOutQuart:new d(.76,0,.24,1),EaseInQuint:new d(.64,0,.78,0),EaseOutQuint:new d(.22,1,.36,1),EaseInOutQuint:new d(.83,0,.17,1),EaseInExpo:new d(.7,0,.84,0),EaseOutExpo:new d(.16,1,.3,1),EaseInOutExpo:new d(.87,0,.13,1),EaseInCirc:new d(.55,0,1,.45),EaseOutCirc:new d(0,.55,.45,1),EaseInOutCirc:new d(.85,0,.15,1),EaseInBack:new d(.36,0,.66,-.56),EaseOutBack:new d(.34,1.56,.64,1),EaseInOutBack:new d(.68,-.6,.32,1.6)};class w{get value(){return this.animation.value}constructor(t,e){this.data=t,this.index=e,this.animation=new l(1e3,c.Ease),this.animation.value=t.value,t.addListener((t=>{this.animation.animateTo(t)}))}addListener(t){this.animation.addListener(t)}removeListener(t){this.animation.removeListener(t)}addStatusListener(t){this.addStatusListener(t)}removeStatusListener(t){this.removeStatusListener(t)}dispose(){this.animation.dispose(),this.animation=null}}class p{constructor(t,e){this.key=t,this.listeners=[],this._value=e}set value(t){this.notifyListeners(this._value=t)}get value(){return this._value}addListener(t){if(this.listeners.includes(t))throw new Error("A given listener is already registered.");this.listeners.push(t)}removeListener(t){if(!this.listeners.includes(t))throw new Error("A given listener is already not registered.");this.listeners=this.listeners.filter((e=>e!==t))}notifyListeners(t){this.listeners.forEach((e=>e(t)))}createState(t){return new w(this,t)}}class v extends HTMLElement{connectedCallback(){const t=this.getAttribute("key"),e=Number(this.getAttribute("value"));if(null==e)throw new Error("Required attribute 'value' not defined in <graph-data> element.");this.data=new p(t,e)}attributeChangedCallback(t,e,s){if(null!=e&&e!=s){if("key"==t)throw new Error("The key, which is a unique identifier of the graph data cannot be changed.");this.data.value=s}}}v.observedAttributes=["key","value"],customElements.define("graph-data",v);class m extends w{constructor(t){super(t.data,t.index)}lerp(t,e,s){return t+(e-t)*s}draw(t,e,s,i){t.canvas.width;const n=t.canvas.height,a=this.value/i;t.lineTo(this.lerp(e,s,.5),n*(1-a))}}class g extends e{constructor(){super(...arguments),this.states=[]}get stateLength(){return this.states.length}attach(t){const e=this.stateLength,s=new m(t.createState(e));s.addListener((t=>{this.canvas.redraw()})),this.states.push(s)}detech(t){this.states=this.states.filter((e=>e.data!==t))}draw(t,e){if(this.stateLength<1)throw new Error("The attached graph-data states for a line must be at least one.");const s=e.width/this.stateLength,i=Math.max(...this.states.map((t=>t.value)));t.clearRect(0,0,t.canvas.width,t.canvas.height),t.beginPath(),t.strokeStyle="rgb(0, 100, 255)",t.lineWidth=3,t.lineCap="round",t.lineJoin="round",this.states.reduce(((e,n)=>{const a=e,r=e+s;return n.draw(t,a,r,i),a+s}),0),t.stroke()}createCanvas(){var t,e;const s=document.createElement("sharp-canvas");return s.style.width=null!==(t=this.getAttribute("width"))&&void 0!==t?t:"100%",s.style.height=null!==(e=this.getAttribute("height"))&&void 0!==e?e:"250px",s.draw=(t,e)=>this.draw(t,e),s}disconnectedCallback(){this.observer.disconnect()}connectedCallback(){var t;let e=null!==(t=this.getAttribute("initstate"))&&void 0!==t?t:this.getAttribute("initState");null!=e&&new Function(e)(),this.style.display="flex";this.attachShadow({mode:"open"}).appendChild(this.canvas=this.createCanvas());for(const t of this.children){if(t instanceof v==0)throw"All children of graph elements must only <graph-data> elements defined.";this.attach(t.data)}this.observer=new MutationObserver(((t,e)=>{const s=t=>{if(t instanceof Element!=0){if(t instanceof v==0)throw new Error("The element attached to this element is not a <graph-data> element.");this.attach(t.data)}},i=t=>{if(t instanceof Element!=0){if(t instanceof v==0)throw new Error("The element detached to this element is not a <graph-data> element.");this.detech(t.data)}};for(const e of t){const t=e.addedNodes,n=e.removedNodes;0!=t.length&&t.forEach(s),0!=n.length&&n.forEach(i)}})),this.observer.observe(this,{childList:!0})}}customElements.define("line-graph",g);export{p as GraphData,v as GraphDataElement,w as GraphDataState,e as GraphElement,m as LineGraphDataState,g as LineGraphElement,t as SharpCanvasElement};
//# sourceMappingURL=index.esm.js.map
