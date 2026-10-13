/** Res_UCN Research Lab — standalone static JavaScript. No backend or build tools. */
'use strict';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

// Navigation: reliable anchor positioning, scroll tracking, browser history,
// and an accessible mobile drawer. Sections are tracked by their visible headings,
// not by whichever oversized section intersects most of the viewport.
const sidebar = $('#sidebar');
const menuButton = $('#menu-toggle');
const closeButton = $('#sidebar-close');
const backdrop = $('#sidebar-backdrop');
const topbar = $('.topbar');
const navLinks = $$('.nav-link');
const sections = $$('[data-section]');
const sectionMap = new Map(sections.map(section => [section.id, section]));
const mobileQuery = window.matchMedia('(max-width: 780px)');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let navigationLock = null;
let releaseNavigationTimer = null;
let scrollUpdatePending = false;

function setActiveSection(id) {
  navLinks.forEach(link => {
    const active = link.dataset.nav === id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function setMenuOpen(open, returnFocus = false) {
  const nextOpen = !!open && mobileQuery.matches;
  sidebar.classList.toggle('open', nextOpen);
  backdrop.hidden = !nextOpen;
  document.body.classList.toggle('menu-open', nextOpen);
  menuButton.setAttribute('aria-expanded', String(nextOpen));
  menuButton.setAttribute('aria-label', nextOpen ? 'Close navigation menu' : 'Open navigation menu');
  menuButton.textContent = nextOpen ? '✕' : '☰';
  sidebar.inert = mobileQuery.matches && !nextOpen;
  if (nextOpen) closeButton.focus({preventScroll:true});
  else if (returnFocus && mobileQuery.matches) menuButton.focus({preventScroll:true});
}
function sectionHeading(section) {
  return $('.section-heading', section) || section;
}
function sectionScrollY(section) {
  if(section.id === 'home') return 0;
  const heading = sectionHeading(section);
  const viewportTop = topbar.getBoundingClientRect().height + 20;
  return Math.max(0, Math.round(window.scrollY + heading.getBoundingClientRect().top - viewportTop));
}
function updateSectionFromScroll() {
  if(navigationLock) return;
  const marker = topbar.getBoundingClientRect().height + 44;
  let current = sections[0].id;
  for(const section of sections) {
    if(sectionHeading(section).getBoundingClientRect().top <= marker) current = section.id;
  }
  if (window.scrollY < 45) current = 'home';
  else if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) current = sections[sections.length - 1].id;
  setActiveSection(current);
}
function requestScrollUpdate(){
  if(scrollUpdatePending) return;
  scrollUpdatePending=true;
  requestAnimationFrame(() => { scrollUpdatePending=false; updateSectionFromScroll(); });
}
function navigateToSection(id, {saveHistory=true, behavior=null}={}) {
  const target = sectionMap.get(id);
  if(!target) return;
  // Lock the highlight to the clicked section during smooth scrolling.
  const cameFromMobileDrawer = sidebar.classList.contains('open');
  navigationLock = id;
  setActiveSection(id);
  setMenuOpen(false);
  if (cameFromMobileDrawer) {
    const focusTarget = $('h1, h2', target);
    if (focusTarget) {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({preventScroll:true});
    }
  }
  clearTimeout(releaseNavigationTimer);
  if (saveHistory && window.location.hash !== `#${id}`) {
    // Browser history remains functional for back/forward navigation.
    try { window.history.pushState({section:id}, '', `#${id}`); } catch (e) { /* sandbox preview */ }
  }
  const scrollBehavior = behavior || (motionQuery.matches ? 'instant' : 'smooth');
  window.scrollTo({top:sectionScrollY(target),behavior:scrollBehavior});
  releaseNavigationTimer = setTimeout(() => {
    navigationLock=null;
    updateSectionFromScroll();
  }, scrollBehavior === 'smooth' ? 1450 : 90);
}
menuButton.addEventListener('click', () => setMenuOpen(!sidebar.classList.contains('open')));
closeButton.addEventListener('click', () => setMenuOpen(false, true));
backdrop.addEventListener('click', () => setMenuOpen(false, true));
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && sidebar.classList.contains('open')) setMenuOpen(false, true);
});
// All internal links use consistent anchor positioning (not just sidebar links).
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    if(!sectionMap.has(id)) return;
    event.preventDefault();
    navigateToSection(id);
  });
});
window.addEventListener('scroll',requestScrollUpdate,{passive:true});
window.addEventListener('resize', () => {setMenuOpen(false);requestScrollUpdate();},{passive:true});
window.addEventListener('popstate', () => {
  const id = decodeURIComponent(window.location.hash.slice(1)) || 'home';
  navigateToSection(sectionMap.has(id) ? id : 'home', {saveHistory:false,behavior:'instant'});
});
window.addEventListener('hashchange', () => {
  const id = decodeURIComponent(window.location.hash.slice(1)) || 'home';
  if(sectionMap.has(id)) navigateToSection(id,{saveHistory:false,behavior:'instant'});
});
// Handle bookmarked deep links after fonts/layout have loaded.
window.addEventListener('load', () => {
  const hashId = decodeURIComponent(window.location.hash.slice(1));
  if(sectionMap.has(hashId)) navigateToSection(hashId,{saveHistory:false,behavior:'instant'});
  else updateSectionFromScroll();
});
setMenuOpen(false);
requestScrollUpdate();

// Architecture Inspector: descriptions intentionally high-level, as in presentation/README.
const stages = [
  {name:'Early feature extraction',channels:64, desc:'Processes image textures and low-level structures through adaptive-scale convolutions, channel weighting, weighted normalization, and Quinsh activation.'},
  {name:'Mid-level feature composition',channels:128,desc:'Builds more expressive representations using a repeated residual design and increases the available feature channels.'},
  {name:'High-level semantic features',channels:256,desc:'Learns increasingly abstract representations while combining local context, channel reweighting, and residual information flow.'},
  {name:'Final residual representation',channels:256,desc:'Refines the final deep feature representation before global pooling, dropout, and the ten-class output layer.'},
];
$$('[data-stage]').forEach(button => button.addEventListener('click',()=>{
  const index=Number(button.dataset.stage); const st=stages[index];
  $$('.stage').forEach(b=>b.classList.toggle('selected',b===button));
  $('#inspector-kicker').textContent=`STAGE ${String(index+1).padStart(2,'0')} / 04`;
  $('#inspector-title').textContent=st.name;
  $('#inspector-desc').textContent=st.desc;
  $('#inspector-channels').textContent=st.channels;
}));

// Interactive Quinsh activation plotting, fully client-side mathematics
const defaults = {gamma:1,delta:0,alpha:.1,w:1};
const presets = {
  balanced:{gamma:1,delta:0,alpha:.1,w:1},
  shifted:{gamma:1.25,delta:1.3,alpha:.1,w:1.2},
  residual:{gamma:.65,delta:0,alpha:.55,w:1},
  sharp:{gamma:1.1,delta:-.5,alpha:.05,w:3.2},
};
const state = {...defaults, mode:'output'};
const sigmoid = x => x>=0 ? 1/(1+Math.exp(-x)) : Math.exp(x)/(1+Math.exp(x));
const quinsh = x => {
  const t=x-state.delta, s=sigmoid(state.w*t);
  return state.gamma*t*s+state.alpha*x;
};
const quinshGrad = x => {
  const t=x-state.delta, s=sigmoid(state.w*t);
  return state.gamma*(s+state.w*t*s*(1-s))+state.alpha;
};
const swish = x => x*sigmoid(x);
const swishGrad = x => {const s=sigmoid(x);return s+x*s*(1-s)};
const relu = x => Math.max(0,x);
const reluGrad = x => x>0 ? 1: x<0?0:.5;
const NS='http://www.w3.org/2000/svg';
function node(name, attrs={}, parent=null, content=null) {
  const e=document.createElementNS(NS,name);
  Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));
  if(content!==null) e.textContent=String(content);
  if(parent) parent.append(e);
  return e;
}
const svg = $('#quinsh-chart'); const tooltip=$('#chart-tooltip');
const plot={left:57,right:715,top:24,bottom:354,xMin:-6,xMax:6};
let yMin=-4,yMax=7;
const xToPx=x=>plot.left+(x-plot.xMin)/(plot.xMax-plot.xMin)*(plot.right-plot.left);
const yToPx=y=>plot.bottom-(y-yMin)/(yMax-yMin)*(plot.bottom-plot.top);
function setPreset(name){
  Object.assign(state,presets[name]);
  ['gamma','delta','alpha','w'].forEach(id=>{$('#'+id).value=state[id];$('#'+id+'-value').textContent=state[id].toFixed(2)});
  $$('.preset').forEach(button=>button.classList.toggle('active',button.dataset.preset===name));
  drawChart();
}
function svgPath(fn){
  const points=[];
  for(let i=0;i<=300;i++){
    const x=plot.xMin+(plot.xMax-plot.xMin)*i/300;
    points.push(`${i===0?'M':'L'}${xToPx(x).toFixed(2)},${yToPx(fn(x)).toFixed(2)}`);
  }
  return points.join(' ');
}
function drawChart(){
  svg.replaceChildren();
  const gradient=node('defs',{},svg);
  const g=node('linearGradient',{id:'plot-line',x1:'0%',y1:'0%',x2:'100%',y2:'0%'},gradient);
  node('stop',{offset:'0%','stop-color':'#60d9c9'},g);
  node('stop',{offset:'100%','stop-color':'#9a9bfa'},g);
  const curves=state.mode==='output'?[{fn:relu,color:'#ffb779',label:'ReLU'},{fn:swish,color:'#b2a1f7',label:'Swish'},{fn:quinsh,color:'url(#plot-line)',label:'Quinsh'}]:[{fn:reluGrad,color:'#ffb779',label:'ReLU'},{fn:swishGrad,color:'#b2a1f7',label:'Swish'},{fn:quinshGrad,color:'url(#plot-line)',label:'Quinsh'}];
  let vals=[];
  for(const c of curves) for(let i=0;i<=120;i++) vals.push(c.fn(-6+i/10));
  const minimum=Math.min(...vals),maximum=Math.max(...vals);
  const extent=Math.max(2,maximum-minimum);
  yMin=Math.floor((minimum-.11*extent)*2)/2;
  yMax=Math.ceil((maximum+.11*extent)*2)/2;
  const groupGrid=node('g',{},svg);
  for(let i=0;i<=6;i++){
    const y=yMin+(yMax-yMin)*i/6;const py=yToPx(y);
    node('line',{x1:plot.left,x2:plot.right,y1:py,y2:py,stroke:'#354660','stroke-width':'1','stroke-dasharray':'3 5',opacity:'.8'},groupGrid);
    node('text',{x:plot.left-13,y:py+4,'text-anchor':'end',fill:'#7e9ab2','font-size':'11','font-family':'DM Sans'},groupGrid,y.toFixed(1));
  }
  for(let x=-6;x<=6;x+=2){const px=xToPx(x);node('line',{x1:px,x2:px,y1:plot.top,y2:plot.bottom,stroke:'#33445d','stroke-width':'1','stroke-dasharray':'3 5',opacity:'.8'},groupGrid);node('text',{x:px,y:plot.bottom+24,'text-anchor':'middle',fill:'#839fb8','font-size':'11','font-family':'DM Sans'},groupGrid,x);}
  if(yMin<0 && yMax>0)node('line',{x1:plot.left,x2:plot.right,y1:yToPx(0),y2:yToPx(0),stroke:'#7990a8','stroke-width':'1.2',opacity:'.75'},svg);
  node('line',{x1:xToPx(0),x2:xToPx(0),y1:plot.top,y2:plot.bottom,stroke:'#7990a8','stroke-width':'1.2',opacity:'.75'},svg);
  curves.forEach(c=>node('path',{d:svgPath(c.fn),fill:'none',stroke:c.color,'stroke-width':c.label==='Quinsh'?'3.8':'2.1','stroke-linecap':'round','stroke-linejoin':'round',opacity:c.label==='Quinsh'?'1':'.86'},svg));
  node('text',{x:plot.right,y:plot.bottom+40,fill:'#92afc4','font-size':'11','text-anchor':'end'},svg,'Input x');
  node('text',{x:plot.left,y:13,fill:'#92afc4','font-size':'11'},svg,state.mode==='output'?'Activation value':'Derivative (d/dx)');
  const capture=node('rect',{x:plot.left,y:plot.top,width:plot.right-plot.left,height:plot.bottom-plot.top,fill:'transparent'},svg);
  capture.addEventListener('pointermove',onPlotHover);
  capture.addEventListener('pointerleave',()=>{tooltip.hidden=true; const m=$('#plot-cursor');if(m)m.remove()});
  $('#chart-title').textContent=state.mode==='output'?'Activation output':'Gradient / derivative';
}
function onPlotHover(event){
  const rect=svg.getBoundingClientRect();
  const scale=740/rect.width;
  const svgX=(event.clientX-rect.left)*scale;
  const x=plot.xMin+Math.max(0,Math.min(1,(svgX-plot.left)/(plot.right-plot.left)))*(plot.xMax-plot.xMin);
  const fn=state.mode==='output'?quinsh:quinshGrad;const y=fn(x);
  const old=$('#plot-cursor');if(old)old.remove();
  const g=node('g',{id:'plot-cursor','pointer-events':'none'},svg);
  node('line',{x1:xToPx(x),x2:xToPx(x),y1:plot.top,y2:plot.bottom,stroke:'#9cefe1','stroke-dasharray':'5 4',opacity:'.65'},g);
  node('circle',{cx:xToPx(x),cy:yToPx(y),r:6,fill:'#78ead7',stroke:'#122d3b','stroke-width':3},g);
  tooltip.hidden=false;
  tooltip.textContent=`x: ${x.toFixed(2)}   •   Quinsh: ${y.toFixed(3)}`;
  tooltip.style.left=`${Math.min(rect.width-176,Math.max(9,(xToPx(x)/740)*rect.width-75))}px`;
  tooltip.style.top=`${Math.max(13,Math.min(rect.height-38,(yToPx(y)/405)*rect.height-49))}px`;
}
['gamma','delta','alpha','w'].forEach(id => $('#'+id).addEventListener('input',e=>{
  state[id]=Number(e.target.value);$('#'+id+'-value').textContent=state[id].toFixed(2);
  $$('.preset').forEach(b=>b.classList.remove('active'));drawChart();
}));
$$('[data-preset]').forEach(button => button.addEventListener('click',()=>setPreset(button.dataset.preset)));
$('#reset-quinsh').addEventListener('click',()=>setPreset('balanced'));
$$('[data-plot]').forEach(button=>button.addEventListener('click',()=>{
  state.mode=button.dataset.plot;
  $$('[data-plot]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button?'true':'false')});
  drawChart();
}));
drawChart();

// Module browser: grounded in group slide descriptions. Each graphic is explanatory.
const M={
  quinsh:{index:1,type:'ACTIVATION',title:'Quinsh activation',overline:'YOUR CONTRIBUTION',author:'Wilbert Andrew Yonathan',description:'A parametric activation with learnable shifting and gating, plus a residual linear path.',mechanism:'Compute γ·(x−δ)·sigmoid(w·(x−δ)) + αx. The gated nonlinear path can adapt to feature distributions, while αx retains a direct linear contribution.',graphic:'curve'},
  adsgc:{index:2,type:'CONVOLUTION',title:'Adaptive Dynamic-Scale Gated Convolution',overline:'GROUP COMPONENT',author:'Derol Chong Chun Kit',description:'Combines local and wider-context features through an adaptive scale selection mechanism.',mechanism:'Blend a standard convolution result with a dilated-convolution result, using a gate to weight local detail against the larger receptive field. The presentation motivates a learnable balance between fine texture and context.',graphic:'branches'},
  ciac:{index:3,type:'CONVOLUTION',title:'Channel Importance Assignment Convolution',overline:'GROUP COMPONENT',author:'Edward Ooi Wee Xue',description:'Reweights input feature channels before convolution to emphasize potentially informative channels.',mechanism:'Estimate channel importance through global average pooling, normalization, temperature scaling and sigmoid gating, then apply the channel weights before convolution.',graphic:'channels'},
  wbn:{index:4,type:'NORMALIZATION',title:'Weighted Batch Normalization',overline:'GROUP COMPONENT',author:'Wang XinYi',description:'Uses Gaussian weighting to reduce the influence of unusually distant activations when computing batch statistics.',mechanism:'Compute standardized deviations (z-scores), down-weight outliers with a Gaussian weighting function, and derive weighted estimates of the mean and variance.',graphic:'weights'},
  destop:{index:5,type:'TRAINING STRATEGY',title:'DE-Stopping',overline:'GROUP COMPONENT',author:'Chua Kian Hoong',description:'Energy-entropy early stopping combines loss stagnation with confidence-oriented training signals.',mechanism:'When validation loss stalls, a halting function uses energy and Tsallis entropy. Slide 18 shows a 0.55 halting threshold: confident states advance patience, while confused states pause the counter.',graphic:'stop'},
};
function moduleGraphic(type){
 const common=`<svg viewBox="0 0 520 166" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="modg" x1="0" x2="1"><stop stop-color="#72ead9"/><stop offset="1" stop-color="#a69bff"/></linearGradient></defs><g stroke="#30465f" opacity=".33"><path d="M0 33H520M0 66H520M0 99H520M0 132H520M65 0V166M130 0V166M195 0V166M260 0V166M325 0V166M390 0V166M455 0V166"/></g>`;
 const end='</svg>';
 const box=(x,y,w,h,t,color='#7be2d4')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#172b41" stroke="${color}" stroke-opacity=".85"/><text x="${x+w/2}" y="${y+h/2+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#deefff">${t}</text>`;
 const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="url(#modg)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 if(type==='curve'){
   let d=''; for(let i=0;i<=140;i++){let x=-4+i*8/140,y=quinsh(x);d+=`${i?'L':'M'}${40+i*(440/140)} ${Math.max(20,Math.min(146,115-y*20))} `}
   return common+`<path d="M40 111H480 M260 20V146" stroke="#55657a" stroke-width="1.2"/>`+`<path d="${d}" fill="none" stroke="url(#modg)" stroke-width="4"/><text x="41" y="29" font-size="12" fill="#9baac8">Q(x) = γ(x−δ)σ(w(x−δ)) + αx</text>`+end;
 }
 if(type==='branches') return common+box(28,58,84,49,'Input')+line(112,82,154,82)+line(154,82,154,45)+line(154,82,154,122)+box(173,17,136,54,'Standard 3×3')+box(173,97,136,54,'Dilated 3×3','#a299f5')+line(309,44,366,81)+line(309,125,366,81)+box(367,58,118,47,'Gated mix')+end;
 if(type==='channels') return common+box(28,58,106,50,'Features')+line(135,82,167,82)+box(166,58,87,50,'GAP')+line(253,82,281,82)+box(281,58,98,50,'Gate σ')+line(378,82,407,82)+box(408,58,89,50,'Conv')+end;
 if(type==='weights') return common+`<g>`+[...Array(21)].map((_,i)=>{const x=50+i*20,center=260,weight=Math.exp(-Math.pow((x-center)/119,2)*2);return `<rect x="${x}" y="${130-weight*100}" width="13" height="${weight*100}" rx="4" fill="${weight>.5?'#7ce5d9':'#9581db'}" opacity="${(.35+weight*.6).toFixed(2)}"/>`}).join('')+`</g><text x="260" y="26" font-size="13" text-anchor="middle" fill="#d6e4f8">Gaussian weighting emphasizes central values</text>`+end;
 return common+box(23,59,108,48,'Val. loss')+line(131,83,169,83)+box(168,44,160,76,'Energy + entropy','#a295f7')+line(328,83,366,83)+box(365,59,131,48,'Halting gate')+`<text x="250" y="143" text-anchor="middle" fill="#9caecd" font-size="11">Confident + stalled → patience increments</text>`+end;
}
function showModule(key){
 const m=M[key]; if(!m)return;
 $$('.module-tab').forEach(b=>b.classList.toggle('active',b.dataset.module===key));
 $('#module-eyebrow').textContent=`MODULE ${String(m.index).padStart(2,'0')} · ${m.type}`;
 $('#module-overline').textContent=m.overline;
 $('#module-title').textContent=m.title;
 $('#module-description').textContent=m.description;
 $('#module-mechanism').textContent=m.mechanism;
 $('#module-author').textContent=m.author;
 $('#module-graphic').innerHTML=moduleGraphic(m.graphic);
}
$$('[data-module]').forEach(b=>b.addEventListener('click',()=>showModule(b.dataset.module)));
showModule('quinsh');

// Real, opt-in ONNX Runtime Web client-side classification; never substitute random predictions.
// No checkpoint is supplied or loaded automatically because repository does not publish weights.
const CIFAR10=['Airplane','Automobile','Bird','Cat','Deer','Dog','Frog','Horse','Ship','Truck'];
const NORM_MEAN=[.49,.48,.44],NORM_STD=[.20,.19,.20];
const runtimeURL='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.min.js';
let modelFile=null, imageFile=null, session=null, loadingRuntime=null, previewObjectURL=null;
const runButton=$('#run-inference');
function feedback(message,kind=''){const el=$('#runner-feedback');el.textContent=message;el.className='runner-feedback'+(kind?' '+kind:'')}
function updateRunnerState(){runButton.disabled=!(modelFile&&imageFile);$('#runner-state').textContent=session?'ONNX SESSION READY':modelFile?'MODEL SELECTED':'NO MODEL LOADED'}
$('#model-file').addEventListener('change',e=>{
  const f=e.target.files?.[0]||null;
  if(f && !f.name.toLowerCase().endsWith('.onnx')){feedback('Please select a .onnx model file.','error');return}
  modelFile=f;session=null;$('#model-filename').textContent=f?f.name:'No file selected';updateRunnerState();
  if(f)feedback(`Selected ${f.name} (${(f.size/1024/1024).toFixed(1)} MB). The model will load after you click Run.`);
});
function setImage(file){
  if(!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type))return feedback('Please use a PNG, JPEG, or WebP image.','error');
  imageFile=file;
  if(previewObjectURL)URL.revokeObjectURL(previewObjectURL);
  previewObjectURL=URL.createObjectURL(file);
  const im=$('#image-preview');im.src=previewObjectURL;im.hidden=false;im.alt=`Selected image: ${file.name}`;
  updateRunnerState();feedback(`Selected ${file.name}. ${modelFile?'Ready for inference.':'Now select the ONNX model.'}`);
}
$('#image-file').addEventListener('change',e=>setImage(e.target.files?.[0]));
const zone=$('#upload-zone');
zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover')});
zone.addEventListener('dragleave',()=>zone.classList.remove('dragover'));
zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragover');setImage(e.dataTransfer.files?.[0])});
function ensureORT(){
 if(window.ort)return Promise.resolve(window.ort);
 if(!loadingRuntime)loadingRuntime=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src=runtimeURL;script.async=true;
   script.onload=()=>window.ort?resolve(window.ort):reject(new Error('ONNX Runtime did not load.'));
   script.onerror=()=>reject(new Error('Could not download the ONNX Runtime Web library. Please check the connection.'));
   document.head.append(script);
 });
 return loadingRuntime;
}
async function preprocessImage(file,ort){
 const img=await createImageBitmap(file);
 const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(img,0,0,32,32);if(img.close)img.close();
 const rgba=ctx.getImageData(0,0,32,32).data;
 const input=new Float32Array(3*32*32);
 for(let c=0;c<3;c++)for(let px=0;px<1024;px++)input[c*1024+px]=(rgba[px*4+c]/255-NORM_MEAN[c])/NORM_STD[c];
 return new ort.Tensor('float32',input,[1,3,32,32]);
}
function softmax(arr){
 const max=Math.max(...arr);const exp=arr.map(v=>Math.exp(v-max));const sum=exp.reduce((a,b)=>a+b,0);
 return exp.map(v=>v/sum);
}
function displayPredictions(scores){
 const sorted=scores.map((p,i)=>({label:CIFAR10[i],p})).sort((a,b)=>b.p-a.p);
 $('#empty-predictions').hidden=true;$('#prediction-results').hidden=false;
 $('#top-class').textContent=sorted[0].label;$('#top-confidence').textContent=(sorted[0].p*100).toFixed(2)+'% confidence';
 const bars=$('#prediction-bars');bars.replaceChildren();
 sorted.forEach(r=>{
   const row=document.createElement('div');row.className='pred-row';
   const head=document.createElement('div');head.className='pred-header';
   const name=document.createElement('span');name.textContent=r.label;
   const value=document.createElement('span');value.textContent=(r.p*100).toFixed(1)+'%';
   head.append(name,value);row.append(head);
   const track=document.createElement('div');track.className='pred-bar';
   const bar=document.createElement('span');bar.style.width=(r.p*100).toFixed(3)+'%';
   track.append(bar);row.append(track);bars.append(row);
 });
}
runButton.addEventListener('click',async()=>{
 if(!modelFile||!imageFile)return;
 runButton.disabled=true;runButton.textContent='Running in browser…';feedback('Loading model and preparing input…');
 try{
   const ort=await ensureORT();
   ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
   if(!session){
     const bytes=await modelFile.arrayBuffer();
     session=await ort.InferenceSession.create(bytes,{executionProviders:['wasm']});
   }
   const input=await preprocessImage(imageFile,ort);
   const meta=session.inputMetadata?.[session.inputNames[0]];
   const dims=meta?.dimensions||meta?.dims||[];
   const shapeCorrect=!dims.length||dims.length===4&&(+dims[1]===3||!Number.isFinite(+dims[1]))&&(+dims[2]===32||!Number.isFinite(+dims[2]))&&(+dims[3]===32||!Number.isFinite(+dims[3]));
   if(!shapeCorrect)throw new Error(`This model expects input ${JSON.stringify(dims)} rather than [1,3,32,32]. Export your trained CIFAR-10 model with an NCHW 32×32 input.`);
   const outputs=await session.run({[session.inputNames[0]]:input});
   const tensor=outputs[session.outputNames[0]];
   const raw=Array.from(tensor.data);
   if(raw.length!==10||raw.some(v=>!Number.isFinite(v)))throw new Error(`Expected exactly 10 finite CIFAR-10 logits; found ${raw.length} values.`);
   displayPredictions(softmax(raw));
   feedback('Inference complete. Processed locally in your browser; results come from the ONNX model you selected.','success');
   updateRunnerState();
 }catch(err){feedback(`Could not run inference: ${err.message||String(err)}`,'error')}
 finally{runButton.disabled=!(modelFile&&imageFile);runButton.innerHTML='Run image classification <span>↗</span>'}
});
