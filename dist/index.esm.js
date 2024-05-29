class t extends HTMLElement{get draw(){return this._drawCallback}set draw(t){this._drawCallback=t,void 0!==this.raw&&this._drawCallback(this.getContext2D(),this.raw.getBoundingClientRect())}getContext2D(){return this.raw.getContext("2d")}createRaw(){const t=document.createElement("canvas");return t.style.width=this.style.width,t.style.height=this.style.height,t}disconnectedCallback(){this.observer.disconnect()}connectedCallback(){this.style.display="flex",this.observer=new ResizeObserver((t=>{const e=this.getContext2D(),s=this.raw.getBoundingClientRect(),i=devicePixelRatio||1;this.raw.width=s.width*i,this.raw.height=s.height*i,e.scale(i,i),this.draw&&this.draw(e,s)})),this.observer.observe(this.raw=this.createRaw());this.attachShadow({mode:"closed"}).appendChild(this.raw)}}customElements.define("sharp-canvas",t);class e extends HTMLElement{}class s{constructor(t){this.callback=t,this.isDisposed=!1,this.id=requestAnimationFrame(this.handle=this.handle.bind(this))}handle(t){var e;if(this.isDisposed)return;const s=t-(null!==(e=this.previousElapsed)&&void 0!==e?e:t);this.previousElapsed=t,this.callback(s),this.id=requestAnimationFrame(this.handle)}dispose(){this.isDisposed=!0,cancelAnimationFrame(this.id)}}var i;!function(t){t[t.NONE=0]="NONE",t[t.FORWARD=1]="FORWARD",t[t.FORWARDED=2]="FORWARDED",t[t.BACKWARD=3]="BACKWARD",t[t.BACKWARDED=4]="BACKWARDED"}(i||(i={}));class a{}class n extends a{constructor(){super(...arguments),this.listeners=[],this.statusListeners=[]}addListener(t){console.assert(!this.listeners.includes(t),"Already a given listener does exist."),this.listeners.push(t)}removeListener(t){console.assert(this.listeners.includes(t),"Already a given listener does not exist."),this.listeners=this.listeners.filter((e=>e!=t))}addStatusListener(t){console.assert(!this.statusListeners.includes(t),"Already a given status listener does exist."),this.statusListeners.push(t)}removeStatusListener(t){console.assert(this.statusListeners.includes(t),"Already a given status listener does not exist."),this.statusListeners=this.statusListeners.filter((e=>e!=t))}notifyListeners(t){this.listeners.forEach((e=>e(t)))}notifyStatusListeners(t){this.statusListeners.forEach((e=>e(t)))}}class r extends n{get status(){return this._status}set status(t){this._status!=t&&this.notifyStatusListeners(this._status=t)}get value(){return this._value}set value(t){this._value!=t&&this.notifyListeners(this._value=t)}constructor(t,e=0,s=1,a=e){if(super(),this.duration=t,this.lowerValue=e,this.upperValue=s,this._status=i.NONE,this.lowerValue>this.upperValue)throw new Error("The lowerValue must be less than the upperValue.");this._value=a}get range(){return this.upperValue-this.lowerValue}get relValue(){return(this.value-this.lowerValue)/this.range}get progressValue(){const t=this.tween.begin,e=this.tween.end-t;return(this.relValue-t)/e}forward(t){this.animateTo(this.upperValue,t)}backward(t){this.animateTo(this.lowerValue,t)}repeat(){this.addStatusListener((t=>{t==i.FORWARDED&&this.backward(),t==i.BACKWARDED&&this.forward()})),this.status!=i.NONE&&this.status!=i.BACKWARDED||this.forward()}animateTo(t,e){this.animate(this.value,t,e)}animate(t,e,a=this.duration){var n;if(e==t)return;console.assert(t>=this.lowerValue,"A given [from] is less than the min-range."),console.assert(e<=this.upperValue,"A given [to] is larger than the max-range."),this.value=t,this.tween={begin:t,end:e};const r=e>t;this.status=r?i.FORWARD:i.BACKWARD;const h=a/this.range;null===(n=this.activeTicker)||void 0===n||n.dispose(),this.activeTicker=new s((s=>{const a=s/h,n=r?a:-a,l=this.consume(t,e,n);if(Math.abs(n-l)>1e-10)return this.value=e,this.dispose(),void(this.status=r?i.FORWARDED:i.BACKWARDED);this.value+=l}))}consume(t,e,s){const i=e-(this.value+s);return e>t?i<=0?i:s:i>=0?i:s}dispose(){var t;null===(t=this.activeTicker)||void 0===t||t.dispose(),this.activeTicker=null}reset(){this.status=i.NONE,this.value=this.lowerValue,this.tween=null}}class h{}class l extends h{constructor(t,e){super(),this.begin=t,this.end=e}transform(t){return this.begin+(this.end-this.begin)*t}}class o extends n{constructor(t,e,s){super(),this.curve=e,this.status=i.NONE,this.value=null!=s?s:0,this.parent=new r(t,0,1),this.parent.addListener((t=>{const s=this.parent.progressValue;if(null==e)return void this.notifyListeners(this.value=this.tween.transform(s));const i=e.transform(s),a=this.tween.end-this.tween.begin,n=this.tween.begin+a*i;this.notifyListeners(this.value=n)})),this.parent.addStatusListener((t=>{if(t==i.NONE)return;const e=this.tween.end>this.tween.begin;t==i.FORWARD?this.notifyStatusListeners(this.status=e?i.FORWARD:i.BACKWARD):this.notifyStatusListeners(this.status=e?i.FORWARDED:i.BACKWARDED)}))}animateTo(t){t!=this.value&&this.animate(this.value,t)}animate(t,e){this.tween=new l(t,e),this.parent.reset(),this.parent.forward()}dispose(){this.tween=null,this.parent.dispose(),this.parent=null}}class d{constructor(t,e){this.data=t,this.index=e,this.animation=new o(1e3),this.animation.value=t.value,t.addListener((t=>{this.animation.animateTo(t)}))}addListener(t){this.animation.addListener(t)}removeListener(t){this.animation.removeListener(t)}addStatusListener(t){this.addStatusListener(t)}removeStatusListener(t){this.removeStatusListener(t)}dispose(){this.animation.dispose(),this.animation=null}}class u{constructor(t,e){this.key=t,this.listeners=[],this._value=e}set value(t){this.notifyListeners(this._value=t)}get value(){return this._value}addListener(t){if(this.listeners.includes(t))throw new Error("A given listener is already registered.");this.listeners.push(t)}removeListener(t){if(!this.listeners.includes(t))throw new Error("A given listener is already not registered.");this.listeners=this.listeners.filter((e=>e!==t))}notifyListeners(t){this.listeners.forEach((e=>e(t)))}createState(t){return new d(this,t)}}class c extends HTMLElement{connectedCallback(){const t=this.getAttribute("key"),e=Number(this.getAttribute("value"));if(null==e)throw new Error("Required attribute 'value' not defined in <graph-data> element.");this.data=new u(t,e)}attributeChangedCallback(t,e,s){if(null!=e&&e!=s){if("key"==t)throw new Error("The key, which is a unique identifier of the graph data cannot be changed.");this.data.value=s}}}c.observedAttributes=["key","value"],customElements.define("graph-data",c);class v extends d{constructor(t){super(t.data,t.index)}draw(t,e,s,i){t.canvas.width,t.canvas.height}}class w extends e{constructor(){super(...arguments),this.states=[]}get stateLength(){return this.states.length}attach(t){const e=this.stateLength,s=new v(t.createState(e));s.data.addListener((t=>{console.log(s.data.key+" = "+t)})),this.states.push(s)}detech(t){this.states=this.states.filter((e=>e.data!==t))}draw(t,e){if(this.stateLength<1)throw new Error("The attached graph-data states for a line must be at least one.");e.width,this.stateLength,t.beginPath(),t.strokeStyle="rgb(0, 100, 255)",t.lineWidth=3,t.lineCap="round",t.lineJoin="round",t.moveTo(15,15),t.lineTo(e.width/2-15,e.height-15),t.lineTo(e.width-15,e.height/2),t.stroke()}createCanvas(){var t,e;const s=document.createElement("sharp-canvas");return s.style.width=null!==(t=this.getAttribute("width"))&&void 0!==t?t:"100%",s.style.height=null!==(e=this.getAttribute("height"))&&void 0!==e?e:"250px",s.draw=(t,e)=>this.draw(t,e),s}disconnectedCallback(){this.observer.disconnect()}connectedCallback(){var t;let e=null!==(t=this.getAttribute("initstate"))&&void 0!==t?t:this.getAttribute("initState");null!=e&&new Function(e)(),this.style.display="flex";this.attachShadow({mode:"open"}).appendChild(this.canvas=this.createCanvas());for(const t of this.children){if(t instanceof c==0)throw"All children of graph elements must only <graph-data> elements defined.";this.attach(t.data)}this.observer=new MutationObserver(((t,e)=>{const s=t=>{if(t instanceof c==0)throw new Error("The element attached to this element is not a <graph-data> element.");this.attach(t.data)},i=t=>{if(t instanceof c==0)throw new Error("The element detached to this element is not a <graph-data> element.");this.detech(t.data)};for(const e of t){const t=e.addedNodes,a=e.removedNodes;0!=t.length&&t.forEach(s),0!=a.length&&a.forEach(i)}})),this.observer.observe(this,{childList:!0})}}customElements.define("line-graph",w);export{u as GraphData,c as GraphDataElement,d as GraphDataState,e as GraphElement,v as LineGraphDataState,w as LineGraphElement,t as SharpCanvasElement};
//# sourceMappingURL=index.esm.js.map