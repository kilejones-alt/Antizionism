(()=>{'use strict';
const beats=[
{start:0,end:10,bg:'assets/a01.webp',fg:'assets/n01.webp',side:'right',bgCam:[1.05,-.03,.014,-.45,1.11,.018,-.012,.22],fgCam:[.28,.88,.31,-4,.33,.82,.34,1],seed:1.1,density:.20,shape:'sliver',bgGrade:[1.12,1.16,1.10],fgGrade:[1.14,1.18,1.10]},
{start:10,end:15,bg:'assets/a04.webp',fg:'assets/n10.webp',side:'left',bgCam:[1.08,.022,.02,.35,1.15,-.024,-.018,-.24],fgCam:[.31,.16,.70,4,.38,.23,.62,-2],seed:2.0,density:.27,shape:'corner',bgGrade:[1.12,1.18,1.10],fgGrade:[1.16,1.22,1.12]},
{start:15,end:20,bg:'assets/a03.webp',fg:'assets/n07.webp',side:'right',bgCam:[1.08,-.03,.02,-.32,1.15,.026,-.018,.28],fgCam:[.36,.84,.27,-2,.44,.76,.35,2],seed:2.9,density:.36,shape:'vertical',bgGrade:[1.13,1.20,1.11],fgGrade:[1.17,1.24,1.12]},
{start:20,end:25,bg:'assets/n03.webp',fg:'assets/n06.webp',side:'left',bgCam:[1.10,.02,.021,.40,1.18,-.022,-.02,-.36],fgCam:[.37,.17,.68,2,.47,.25,.61,-2],seed:3.8,density:.45,shape:'low',bgGrade:[1.13,1.20,1.11],fgGrade:[1.17,1.26,1.12]},
{start:25,end:30,bg:'assets/a08.webp',fg:'assets/a11.webp',side:'right',bgCam:[1.06,-.022,.018,-.26,1.14,.022,-.015,.22],fgCam:[.35,.84,.72,-2,.43,.77,.63,2],seed:4.7,density:.56,shape:'diagonal',bgGrade:[1.14,1.24,1.12],fgGrade:[1.18,1.28,1.13]},
{start:30,end:35,bg:'assets/n02.webp',fg:'assets/n05.webp',side:'left',bgCam:[1.09,.022,.018,.30,1.17,-.024,-.02,-.28],fgCam:[.41,.15,.29,2,.50,.25,.37,-2],seed:5.6,density:.68,shape:'island',bgGrade:[1.15,1.28,1.13],fgGrade:[1.20,1.32,1.14]},
{start:35,end:40,bg:'assets/n11.webp',fg:'assets/n09.webp',side:'right',bgCam:[1.12,-.024,.018,-.32,1.22,.026,-.018,.24],fgCam:[.46,.83,.70,-2,.58,.74,.62,2],seed:6.5,density:.82,shape:'poster',bgGrade:[1.18,1.36,1.15],fgGrade:[1.22,1.40,1.16]},
{start:40,end:44,bg:'assets/a13.webp',fg:'assets/n04.webp',side:'left',bgCam:[1.24,.018,.012,.18,1.42,-.022,-.012,-.14],fgCam:[.66,.15,.24,1,.82,.23,.32,-1],seed:7.4,density:1.00,shape:'monolith',bgGrade:[1.22,1.46,1.17],fgGrade:[1.26,1.50,1.18]},
{start:44,end:48,bg:'assets/a20.webp',fg:'assets/n12.webp',side:'right',bgCam:[1.28,-.016,.010,-.16,1.48,.018,-.010,.12],fgCam:[.70,.85,.66,-1,.90,.76,.58,1],seed:8.3,density:1.08,shape:'split',bgGrade:[1.24,1.52,1.19],fgGrade:[1.28,1.54,1.19]},
{start:48,end:52,bg:'assets/a02.webp',fg:'assets/n08.webp',side:'left',bgCam:[1.34,.014,.008,.12,1.56,-.016,-.010,-.10],fgCam:[.78,.16,.28,1,.98,.25,.35,-1],seed:9.2,density:1.16,shape:'full',bgGrade:[1.26,1.56,1.20],fgGrade:[1.30,1.58,1.20]}];
const script=[{start:10,end:15,text:'None of it fell from the sky.',kind:'sentence',size:.087},{start:15,end:20,text:'A placard in London.',kind:'sentence',size:.098},{start:20,end:25,text:'A pamphlet from Moscow.',kind:'sentence',size:.091},{start:25,end:30,text:'A university reading list.',kind:'sentence',size:.086},{start:30,end:35,text:'Set them beside one another.',kind:'sentence',size:.084},{start:35,end:40,text:'The words give out.',kind:'sentence',size:.104},{start:40,end:44,text:'SETTLER-\nCOLONIALISM',kind:'term',size:.050},{start:44,end:48,text:'APARTHEID',kind:'term',size:.058},{start:48,end:52,text:'GENOCIDE',kind:'term',size:.066}];
const FINAL_AT=52,CONTROL_AT=60;
const app=document.getElementById('app'),imageCanvas=document.getElementById('imageCanvas'),imageCtx=imageCanvas.getContext('2d',{alpha:false}),oilFallback=document.getElementById('oilFallback'),fallbackCtx=oilFallback.getContext('2d'),oilCanvas=document.getElementById('oilCanvas'),maskCanvas=document.createElement('canvas'),maskCtx=maskCanvas.getContext('2d'),fgCanvas=document.createElement('canvas'),fgCtx=fgCanvas.getContext('2d'),fgMaskCanvas=document.createElement('canvas'),fgMaskCtx=fgMaskCanvas.getContext('2d'),edgeCanvas=document.createElement('canvas'),edgeCtx=edgeCanvas.getContext('2d'),refractCanvas=document.createElement('canvas'),refractCtx=refractCanvas.getContext('2d');
const intro=document.getElementById('intro'),introTitle=document.getElementById('introTitle'),enterBtn=document.getElementById('enterBtn'),filmText=document.getElementById('filmText'),textInner=document.getElementById('textInner'),finalFrame=document.getElementById('finalFrame'),finalTitle=document.getElementById('finalTitle'),finalControls=document.getElementById('finalControls'),encoreField=document.getElementById('encoreField'),encoreBtn=document.getElementById('encoreBtn'),music=document.getElementById('music'),musicBtn=document.getElementById('musicBtn'),cursorOrb=document.getElementById('cursorOrb');
let W=innerWidth,H=innerHeight,DPR=Math.min(2,devicePixelRatio||1),ready=false,started=false,finished=false,startTime=0,currentScript=-1,animations=[],timers=[],pointerTarget={x:W*.5,y:H*.5},pointerTrail={x:W*.5,y:H*.5},lastPointer={x:W*.5,y:H*.5,t:performance.now()},images=new Map(),fluidCutCanvas,fluidCutCtx,fluidCutImage,maskCutCanvas=document.createElement('canvas'),maskCutCtx=maskCutCanvas.getContext('2d');
const fluidCanvas=document.createElement('canvas'),fluidCtx=fluidCanvas.getContext('2d',{willReadFrequently:true});
let FW=180,FH=100,fluidDensity=new Float32Array(FW*FH),fluidNext=new Float32Array(FW*FH),fluidVX=new Float32Array(FW*FH),fluidVY=new Float32Array(FW*FH),fluidVX2=new Float32Array(FW*FH),fluidVY2=new Float32Array(FW*FH),fluidImage=fluidCtx.createImageData(FW,FH),lastFluidTime=performance.now(),autoPhase=0;
const clamp=v=>Math.max(0,Math.min(1,v)),lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t),ease=t=>clamp(t);
let gl,program,sceneTex,maskTex,uTime,uResolution,uScene,uMask,uVelocity,uPointer,webglOK=false,lastTrail={x:W*.5,y:H*.5};
const VERT=`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}`;
const FRAG=`precision highp float;varying vec2 v_uv;uniform sampler2D u_scene;uniform sampler2D u_mask;uniform vec2 u_resolution;uniform float u_time;uniform vec2 u_velocity;uniform vec2 u_pointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
void main(){
 vec2 uv=v_uv; vec2 px=1.0/u_resolution; float t=u_time;
 float m=texture2D(u_mask,uv).r;
 float ml=texture2D(u_mask,uv-vec2(px.x*3.0,0.)).r, mr=texture2D(u_mask,uv+vec2(px.x*3.0,0.)).r;
 float md=texture2D(u_mask,uv-vec2(0.,px.y*3.0)).r, mu=texture2D(u_mask,uv+vec2(0.,px.y*3.0)).r;
 vec2 normal=normalize(vec2(ml-mr,md-mu)+vec2(.00001));
 float coarse=fbm(uv*vec2(3.1,2.4)+vec2(t*.018,-t*.014));
 float fine=fbm(uv*vec2(10.0,7.0)-vec2(t*.026,t*.019));
 float threshold=.010+(coarse-.5)*.004+(fine-.5)*.0015;
 float reveal=smoothstep(threshold-.004,threshold+.004,m);
 float edge=1.0-smoothstep(.0,.009,abs(m-threshold));
 float speed=clamp(length(u_velocity)*1.4,0.,1.);
 vec2 refraction=normal*(.00003+.00016*edge)+u_velocity*.00008*speed*edge;
 vec3 scene=texture2D(u_scene,clamp(uv+refraction,0.,1.)).rgb;
 vec3 chroma=vec3(texture2D(u_scene,clamp(uv+refraction+normal*.004,0.,1.)).r,scene.g,texture2D(u_scene,clamp(uv+refraction-normal*.004,0.,1.)).b);
 scene=mix(scene,chroma,.0008*edge);
 vec2 q=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);
 vec2 lightDir=normalize(vec2(-.7,.45));
 float spec=pow(max(dot(normal,lightDir),0.),10.0)*(.0025+.004*edge);
 float broad=pow(max(0.,1.-length(q-vec2(.18*sin(t*.05),.14*cos(t*.043)))),4.0)*.00010;
 float cursorGlow=pow(max(0.,1.-distance(uv,u_pointer)*.92),1.6)*(.0008+.0015*speed);
 float micro=(fine-.5)*.001+(coarse-.5)*.0015;
 vec3 oil=vec3(.00003+.00010*coarse+.00004*fine+micro*.03+broad+cursorGlow);
 oil+=vec3(.0025,.0025,.0025)*spec;
 vec3 rim=vec3(.009,.009,.009)*edge*(.008+.008*spec+.0015*fine);
 vec3 col=mix(oil,scene,reveal); col+=rim*(1.0-reveal*.996); float clear=smoothstep(.14,.24,reveal); col=mix(col,scene,min(1.0,clear*1.45));
 gl_FragColor=vec4(col,1.0);
}`;
function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
function initWebGL(){try{gl=oilCanvas.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false})||oilCanvas.getContext('experimental-webgl');if(!gl)return;const ext=gl.getExtension('OES_standard_derivatives');if(!ext)throw new Error('OES_standard_derivatives unavailable');const frag=FRAG.replace('precision highp float;','#extension GL_OES_standard_derivatives : enable\nprecision highp float;\n');program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,VERT));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);sceneTex=gl.createTexture();maskTex=gl.createTexture();for(const tex of [sceneTex,maskTex]){gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}uTime=gl.getUniformLocation(program,'u_time');uResolution=gl.getUniformLocation(program,'u_resolution');uScene=gl.getUniformLocation(program,'u_scene');uMask=gl.getUniformLocation(program,'u_mask');uVelocity=gl.getUniformLocation(program,'u_velocity');uPointer=gl.getUniformLocation(program,'u_pointer');webglOK=true}catch(e){console.error('WebGL oil unavailable',e);webglOK=false}}
function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(2,devicePixelRatio||1);for(const c of [imageCanvas,oilFallback,oilCanvas,maskCanvas,maskCutCanvas,fgCanvas,fgMaskCanvas,edgeCanvas,refractCanvas]){c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);c.style.width=W+'px';c.style.height=H+'px'}for(const c of [imageCtx,fallbackCtx,maskCtx,maskCutCtx,fgCtx,fgMaskCtx,edgeCtx,refractCtx])c.setTransform(DPR,0,0,DPR,0,0);if(gl)gl.viewport(0,0,oilCanvas.width,oilCanvas.height);initFluid();fitTitles();fitText()}
function fitTitles(){let s=Math.min(W*.125,216);introTitle.style.fontSize=s+'px';while(s>38&&introTitle.scrollWidth>W*.94){s-=2;introTitle.style.fontSize=s+'px'}let f=Math.min(W*.275,560);finalTitle.style.fontSize=f+'px';while(f>38&&(finalTitle.scrollWidth>W*.92||finalTitle.scrollHeight>H*.62)){f-=2;finalTitle.style.fontSize=f+'px'}}
function preload(){const paths=new Set(['assets/surface.webp']);beats.forEach(b=>{paths.add(b.bg);paths.add(b.fg)});return Promise.all([...paths].map(src=>new Promise((res,rej)=>{const img=new Image();img.decoding='async';img.onload=()=>{images.set(src,img);res()};img.onerror=rej;img.src=src})))}
function drawCover(ctx,img,scale,px,py,rot,alpha,grade){if(!img||alpha<=0)return;const base=Math.max(W/img.width,H/img.height)*scale,dw=img.width*base,dh=img.height*base,[brightness,saturation,contrast]=grade||[1.12,1.22,1.10];ctx.save();ctx.translate(W/2+px*W,H/2+py*H);ctx.rotate(rot*Math.PI/180);ctx.globalAlpha=alpha;ctx.filter=`contrast(${contrast}) brightness(${brightness}) saturate(${saturation})`;ctx.drawImage(img,-dw/2,-dh/2,dw,dh);ctx.restore()}
function organicPath(ctx,cx,cy,rx,ry,seed,w){ctx.beginPath();for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,r=1+.11*Math.sin(a*3+seed+w)+.07*Math.sin(a*7-seed*.7-w*.8),x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath()}
function drawForeground(b,t,a){const img=images.get(b.fg);if(!img)return;fgCtx.clearRect(0,0,W,H);fgMaskCtx.clearRect(0,0,W,H);const [s0,x0,y0,r0,s1,x1,y1,r1]=b.fgCam,e=ease(t),s=lerp(s0,s1,e),x=lerp(x0,x1,e)*W*1.20,y=lerp(y0,y1,e)*H*1.16,rot=lerp(r0,r1,e),progress=b.density||.65,geom={sliver:[.12,.22],corner:[.16,.28],vertical:[.19,.42],low:[.25,.26],diagonal:[.24,.36],island:[.29,.42],poster:[.46,.66],monolith:[.58,.84],split:[.62,.88],full:[.72,1.02]}[b.shape]||[.30,.48],maxW=W*geom[0],maxH=H*geom[1],base=Math.min(maxW/img.width,maxH/img.height)*s,dw=img.width*base,dh=img.height*base;fgCtx.save();fgCtx.translate(x,y);fgCtx.rotate(rot*Math.PI/180);fgCtx.globalAlpha=a*.97;const [fgBrightness,fgSaturation,fgContrast]=b.fgGrade||[1.18,1.24,1.10];fgCtx.filter=`contrast(${fgContrast}) brightness(${fgBrightness}) saturate(${fgSaturation})`;fgCtx.drawImage(img,-dw/2,-dh/2,dw,dh);fgCtx.restore();const maskScale={sliver:[.32,.62],corner:[.42,.72],vertical:[.40,.92],low:[.58,.52],diagonal:[.56,.78],island:[.72,.84],poster:[.84,1.02],monolith:[.96,1.18],split:[1.04,1.10],full:[1.14,1.22]}[b.shape]||[.6,.8];organicPath(fgMaskCtx,x,y,Math.max(dw*maskScale[0],W*(.06+.05*progress)),Math.max(dh*maskScale[1],H*(.08+.06*progress)),b.seed,t*3.3);fgMaskCtx.filter='blur(.18px)';fgMaskCtx.fillStyle='rgba(255,255,255,.98)';fgMaskCtx.fill();fgMaskCtx.filter='none';fgCtx.globalCompositeOperation='destination-in';fgCtx.drawImage(fgMaskCanvas,0,0,W,H);fgCtx.globalCompositeOperation='source-over';imageCtx.save();imageCtx.globalAlpha=a;imageCtx.drawImage(fgCanvas,0,0,W,H);imageCtx.restore()}
function drawBeat(b,local,alpha){const [s0,x0,y0,r0,s1,x1,y1,r1]=b.bgCam,e=ease(local),mx=1.46,my=1.34;drawCover(imageCtx,images.get(b.bg),lerp(s0,s1,e),lerp(x0,x1,e)*mx,lerp(y0,y1,e)*my,lerp(r0,r1,e),alpha,b.bgGrade);drawForeground(b,local,alpha)}
function renderScene(t){imageCtx.clearRect(0,0,W,H);imageCtx.fillStyle='#000';imageCtx.fillRect(0,0,W,H);if(!ready)return;let i=beats.findIndex(b=>t>=b.start&&t<b.end);if(i<0)i=0;const b=beats[i],local=clamp((t-b.start)/(b.end-b.start));drawBeat(b,local,1);const cross=1.55;if(i<beats.length-1&&t>b.end-cross){const q=smooth(clamp((t-(b.end-cross))/cross));drawBeat(beats[i+1],0,q)}}
function initFluid(){
 const aspect=Math.max(.7,Math.min(2.2,W/Math.max(H,1))); FW=Math.max(140,Math.round(178*aspect)); FH=112;
 fluidCanvas.width=FW;fluidCanvas.height=FH;fluidDensity=new Float32Array(FW*FH);fluidNext=new Float32Array(FW*FH);fluidVX=new Float32Array(FW*FH);fluidVY=new Float32Array(FW*FH);fluidVX2=new Float32Array(FW*FH);fluidVY2=new Float32Array(FW*FH);fluidImage=fluidCtx.createImageData(FW,FH);
 fluidCutCanvas=document.createElement('canvas');fluidCutCanvas.width=FW;fluidCutCanvas.height=FH;fluidCutCtx=fluidCutCanvas.getContext('2d');fluidCutImage=fluidCutCtx.createImageData(FW,FH);
 for(let y=0;y<FH;y++)for(let x=0;x<FW;x++){const nx=x/FW-.5,ny=y/FH-.5;fluidDensity[y*FW+x]=0;}
}
function sample(a,x,y){x=Math.max(0,Math.min(FW-1,x));y=Math.max(0,Math.min(FH-1,y));const x0=x|0,y0=y|0,x1=Math.min(FW-1,x0+1),y1=Math.min(FH-1,y0+1),tx=x-x0,ty=y-y0;return lerp(lerp(a[y0*FW+x0],a[y0*FW+x1],tx),lerp(a[y1*FW+x0],a[y1*FW+x1],tx),ty)}
function injectFluid(px,py,dx,dy,amount=1,radius=.07){const gx=px/W*FW,gy=py/H*FH,rr=Math.max(4,radius*Math.min(FW,FH)),x0=Math.max(1,Math.floor(gx-rr*2)),x1=Math.min(FW-2,Math.ceil(gx+rr*2)),y0=Math.max(1,Math.floor(gy-rr*2)),y1=Math.min(FH-2,Math.ceil(gy+rr*2));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ox=(x-gx)/rr,oy=(y-gy)/rr,d2=ox*ox+oy*oy,w=Math.exp(-d2*2.15);if(w<.002)continue;const i=y*FW+x;fluidDensity[i]=Math.min(1.35,fluidDensity[i]+w*amount);fluidVX[i]+=dx/W*FW*w*1.6;fluidVY[i]+=dy/H*FH*w*1.6;}}
function autoFluid(t,now){
 autoPhase=now*0.00330;
 const beatIndex=Math.max(0,beats.findIndex(b=>t>=b.start&&t<b.end));
 const b=started?(beats[beatIndex]||beats[0]):beats[0];
 const d=b.density||.55;
 const a=autoPhase+(beatIndex+1)*1.31;
 const emit=(rx,ry,dx,dy,amt,rad)=>injectFluid(W*(.5+rx),H*(.5+ry),dx*W*.004,dy*H*.004,amt,rad);
 if(!started){
  [[-.30,-.16,.12,.02,0.01260,.105],[.31,.17,-.10,-.03,0.01380,.11],[0,.42,.06,-.08,0.01020,.065]].forEach(p=>emit(...p));
 }else switch(b.shape){
  case 'sliver':
   emit(.33+.04*Math.sin(a*1.3),-.04+.03*Math.cos(a*.9),-.22,.08,0.00540,.05);
   emit(.26+.03*Math.sin(a*1.15+.8),.12+.02*Math.cos(a*1.1),-.18,.05,0.00450,.038);
   break;
  case 'corner':
   emit(-.36+.04*Math.sin(a),-.23+.03*Math.cos(a*.8),.16,.12,0.00720,.075);
   emit(-.26+.03*Math.sin(a*1.3),-.11+.02*Math.cos(a),.12,.10,0.00540,.05);
   break;
  case 'vertical':
   emit(.28,.00+.18*Math.sin(a*.75),-.06,.18,0.00780,.06);
   emit(.24,.18*Math.cos(a*.75),-.04,.16,0.00660,.05);
   emit(.31,-.18*Math.cos(a*.75),-.03,.15,0.00540,.042);
   break;
  case 'low':
   emit(-.12+.18*Math.sin(a*.65),.28,.12,-.16,0.00900,.068);
   emit(.16+.14*Math.cos(a*.7),.31,-.10,-.14,0.00840,.06);
   break;
  case 'diagonal':
   emit(-.26+.16*Math.sin(a*.7),-.18+.16*Math.sin(a*.7),.16,.13,0.00960,.073);
   emit(.04+.16*Math.sin(a*.7),.12+.16*Math.sin(a*.7),.12,.10,0.00660,.052);
   break;
  case 'island':
   emit(.00+.12*Math.sin(a*.9),-.02+.08*Math.cos(a*.6),.10,.04,0.01020,.085);
   emit(-.16+.06*Math.sin(a),.10,-.06,.02,0.00540,.045);
   emit(.17+.05*Math.cos(a*.8),-.10,.05,.04,0.00540,.045);
   break;
  case 'poster':
   emit(.26,.02+.08*Math.sin(a*.55),-.12,.05,0.01320,.11);
   emit(.18,-.16+.05*Math.cos(a*.6),-.10,.03,0.00840,.075);
   emit(.21,.18+.04*Math.sin(a*.8),-.08,.02,0.00720,.068);
   break;
  case 'monolith':
   emit(-.24,.00+.10*Math.sin(a*.48),.13,.02,0.01560,.14);
   emit(-.10,.00+.08*Math.cos(a*.6),.10,.01,0.01020,.11);
   break;
  case 'split':
   emit(-.24,.02+.10*Math.sin(a*.56),.14,.00,0.01440,.13);
   emit(.24,-.02+.10*Math.cos(a*.52),-.14,.00,0.01440,.13);
   emit(.00,.00,.00,.00,0.00480,.06);
   break;
  case 'full':
   emit(-.18,.00+.10*Math.sin(a*.48),.12,.00,0.01560,.14);
   emit(.20,.02+.10*Math.cos(a*.45),-.12,.00,0.01560,.14);
   emit(.00,-.16+.08*Math.sin(a*.62),.00,.10,0.00900,.095);
   emit(.00,.18+.06*Math.cos(a*.58),.00,-.08,0.00720,.08);
   break;
  default:
   [[-.34,.02,.10],[.34,.25,.078],[.02,-.39,.052]].forEach((p,k)=>{const [bx,by,r]=p;const ph=a*(.65+k*.17);emit(bx+.055*Math.sin(ph+k),by+.06*Math.cos(ph-k),Math.cos(ph)*.22,Math.sin(ph*.83)*.18,(0.01020+0.00660*d)*(k?1:.92),r*(.85+.36*d));});
 }
 if(currentScript>=0){const r=textInner.getBoundingClientRect(),cx=r.left+r.width*.5,cy=r.top+r.height*.5,rr=Math.min(.22,Math.max(.11,r.width/W*.40));injectFluid(cx,cy,0,0,.0056,rr);injectFluid(cx-r.width*.20,cy,0,0,.0022,rr*.68);injectFluid(cx+r.width*.20,cy,0,0,.0022,rr*.68);}
}
function stepFluid(now,t){const dt=Math.min(1.35,Math.max(.35,(now-lastFluidTime)/16.667));lastFluidTime=now;autoFluid(t,now);for(let y=1;y<FH-1;y++)for(let x=1;x<FW-1;x++){const i=y*FW+x,vx=fluidVX[i],vy=fluidVY[i],sx=x-vx*dt,sy=y-vy*dt;fluidNext[i]=sample(fluidDensity,sx,sy);fluidVX2[i]=sample(fluidVX,sx,sy);fluidVY2[i]=sample(fluidVY,sx,sy);}for(let y=1;y<FH-1;y++)for(let x=1;x<FW-1;x++){const i=y*FW+x,blur=(fluidNext[i]+fluidNext[i-1]+fluidNext[i+1]+fluidNext[i-FW]+fluidNext[i+FW])*.2;fluidDensity[i]=Math.max(0,lerp(fluidNext[i],blur,.19)*Math.pow(.982,dt));fluidVX[i]=lerp(fluidVX2[i],(fluidVX2[i-1]+fluidVX2[i+1]+fluidVX2[i-FW]+fluidVX2[i+FW])*.25,.16)*Math.pow(.955,dt);fluidVY[i]=lerp(fluidVY2[i],(fluidVY2[i-1]+fluidVY2[i+1]+fluidVY2[i-FW]+fluidVY2[i+FW])*.25,.16)*Math.pow(.955,dt);}const data=fluidImage.data;const cutData=webglOK?null:fluidCutImage.data;const cutLo=.0035,cutHi=.040;for(let i=0;i<fluidDensity.length;i++){const dv=Math.max(0,Math.min(1,fluidDensity[i]));const v=Math.round(255*dv);const j=i*4;data[j]=data[j+1]=data[j+2]=255;data[j+3]=v;if(cutData){let c=(dv-cutLo)/(cutHi-cutLo);c=c<0?0:c>1?1:c;c=c*c*(3-2*c);const cv=Math.round(255*c);cutData[j]=cutData[j+1]=cutData[j+2]=255;cutData[j+3]=cv;}}fluidCtx.putImageData(fluidImage,0,0);maskCtx.clearRect(0,0,W,H);maskCtx.save();maskCtx.imageSmoothingEnabled=true;maskCtx.filter='blur(.08px)';maskCtx.drawImage(fluidCanvas,0,0,W,H);maskCtx.filter='blur(0px)';maskCtx.globalAlpha=1;maskCtx.drawImage(fluidCanvas,0,0,W,H);maskCtx.restore();if(cutData){fluidCutCtx.putImageData(fluidCutImage,0,0);maskCutCtx.clearRect(0,0,W,H);maskCutCtx.save();maskCutCtx.imageSmoothingEnabled=true;maskCutCtx.filter='blur(.08px)';maskCutCtx.drawImage(fluidCutCanvas,0,0,W,H);maskCutCtx.filter='blur(0px)';maskCutCtx.globalAlpha=1;maskCutCtx.drawImage(fluidCutCanvas,0,0,W,H);maskCutCtx.restore();}}
function renderMask(now,t){stepFluid(now,t)}
function renderFallback(now){
 fallbackCtx.clearRect(0,0,W,H);
 const base=fallbackCtx.createLinearGradient(0,0,W,H);
 base.addColorStop(0,'rgba(0,0,0,.975)');base.addColorStop(.5,'rgba(2,2,2,.955)');base.addColorStop(1,'rgba(0,0,0,.975)');
 fallbackCtx.fillStyle=base;fallbackCtx.fillRect(0,0,W,H);
 edgeCtx.clearRect(0,0,W,H);edgeCtx.save();edgeCtx.filter='blur(0px)';edgeCtx.globalAlpha=.42;edgeCtx.drawImage(maskCanvas,0,0,W,H);edgeCtx.filter='none';edgeCtx.globalCompositeOperation='destination-out';edgeCtx.globalAlpha=1;edgeCtx.drawImage(maskCanvas,0,0,W,H);edgeCtx.restore();
 fallbackCtx.save();fallbackCtx.globalCompositeOperation='screen';fallbackCtx.globalAlpha=.005;fallbackCtx.drawImage(edgeCanvas,0,0,W,H);fallbackCtx.restore();
 fallbackCtx.globalCompositeOperation='destination-out';fallbackCtx.filter='blur(0px)';fallbackCtx.globalAlpha=1;fallbackCtx.drawImage(maskCanvas,0,0,W,H);fallbackCtx.filter='none';fallbackCtx.globalCompositeOperation='source-over';fallbackCtx.globalAlpha=1;
}
function renderWebGL(now){if(!webglOK){oilCanvas.style.display='none';oilFallback.style.display='block';renderFallback(now);return;}oilFallback.style.display='none';oilCanvas.style.display='block';gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sceneTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imageCanvas);gl.uniform1i(uScene,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,maskTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,gl.LUMINANCE,gl.UNSIGNED_BYTE,maskCanvas);gl.uniform1i(uMask,1);const vx=(pointerTrail.x-lastTrail.x)/Math.max(W,1),vy=(lastTrail.y-pointerTrail.y)/Math.max(H,1);lastTrail={x:pointerTrail.x,y:pointerTrail.y};gl.uniform1f(uTime,now/1000);gl.uniform2f(uResolution,oilCanvas.width,oilCanvas.height);gl.uniform2f(uVelocity,vx*22,vy*22);gl.uniform2f(uPointer,pointerTrail.x/W,1-pointerTrail.y/H);gl.drawArrays(gl.TRIANGLES,0,6)}
function split(text){textInner.innerHTML='';for(const ch of text){if(ch==='\n')textInner.appendChild(document.createElement('br'));else{const s=document.createElement('span');s.className='char';s.textContent=ch;textInner.appendChild(s)}}}
function fitText(){if(!textInner.textContent.trim()||currentScript<0)return;const b=script[currentScript],term=b.kind==='term';let s=Math.min(W*b.size,term?H*.18:H*.145);textInner.style.fontSize=s+'px';while(s>30&&(textInner.scrollWidth>W*.82||textInner.scrollHeight>H*.52)){s-=2;textInner.style.fontSize=s+'px'}}
function clearAnimations(){animations.forEach(a=>{try{a.cancel()}catch{}});animations=[];timers.forEach(clearTimeout);timers=[]}
function showScript(i){clearAnimations();currentScript=i;const b=script[i];filmText.classList.add('visible');textInner.className=b.kind;split(b.text);fitText();const chars=[...textInner.querySelectorAll('.char')],term=b.kind==='term';if(term){chars.forEach((ch,n)=>animations.push(ch.animate([{opacity:0,transform:'translateY(24px) scale(1.08)',filter:'blur(2px)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)',clipPath:'inset(0 0 0 0)'}],{duration:560,delay:n*18,easing:'cubic-bezier(.18,.74,.2,1)',fill:'both'})))}else if(i%3===0){chars.forEach(ch=>ch.style.opacity=1);animations.push(textInner.animate([{opacity:0,transform:'translateY(34px)',filter:'blur(2px)',clipPath:'inset(100% 0 0 0)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)',clipPath:'inset(0 0 0 0)'}],{duration:820,easing:'cubic-bezier(.16,.78,.22,1)',fill:'both'}))}else if(i%3===1){chars.forEach((ch,n)=>animations.push(ch.animate([{opacity:0,transform:'translateY(18px)',filter:'blur(1.5px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:520,delay:Math.floor(n/6)*62,easing:'cubic-bezier(.2,.72,.2,1)',fill:'both'})))}else{chars.forEach(ch=>ch.style.opacity=1);animations.push(textInner.animate([{opacity:0,transform:'scale(.985)',filter:'blur(2px)'},{opacity:1,transform:'scale(1)',filter:'blur(0)'}],{duration:900,easing:'cubic-bezier(.2,.72,.2,1)',fill:'both'}))}}
function hideScript(){clearAnimations();filmText.classList.remove('visible');textInner.innerHTML='';currentScript=-1}
function scriptAt(t){return script.findIndex(b=>t>=b.start&&t<b.end)}
function revealEndControls(){finalControls.classList.add('visible');finalControls.setAttribute('aria-hidden','false');encoreField.classList.add('visible');encoreField.setAttribute('aria-hidden','false');encoreField.innerHTML='';const cx=W/2,cy=H*.64;for(let i=0;i<20;i++){const n=document.createElement('span');n.className='encoreNode';const sx=Math.random()*W,sy=Math.random()*H,ex=cx+Math.cos(i/20*Math.PI*2)*(110+(i%5)*16),ey=cy+Math.sin(i/20*Math.PI*2)*(58+(i%4)*14);n.style.left=sx+'px';n.style.top=sy+'px';encoreField.appendChild(n);n.animate([{opacity:0,left:sx+'px',top:sy+'px',transform:'translate(-50%,-50%) scale(.2)'},{opacity:1,left:ex+'px',top:ey+'px',transform:'translate(-50%,-50%) scale(1)'}],{duration:980+i*26,fill:'forwards',easing:'cubic-bezier(.2,.75,.2,1)'})}setTimeout(()=>{encoreBtn.classList.add('visible');encoreBtn.setAttribute('aria-hidden','false')},1120)}
function finish(){if(finished)return;finished=true;hideScript();intro.style.display='none';oilCanvas.style.opacity='0';oilFallback.style.opacity='0';finalFrame.classList.add('visible');finalFrame.setAttribute('aria-hidden','false');app.style.cursor='none';cursorOrb.style.opacity=0;document.body.classList.add('frozen');setTimeout(revealEndControls,(CONTROL_AT-FINAL_AT)*1000)}
function trail(now){const dx=pointerTarget.x-pointerTrail.x,dy=pointerTarget.y-pointerTrail.y;pointerTrail.x+=dx*.18;pointerTrail.y+=dy*.18;const dt=Math.max(8,now-lastPointer.t),mx=pointerTrail.x-lastPointer.x,my=pointerTrail.y-lastPointer.y,speed=Math.hypot(mx,my)/dt;if(Math.hypot(dx,dy)>.08)injectFluid(pointerTrail.x,pointerTrail.y,mx*2.8,my*2.8,Math.min(.92,.52+speed*.58),Math.min(.44,.28+speed*.28));lastPointer={x:pointerTrail.x,y:pointerTrail.y,t:now};cursorOrb.style.transform=`translate(${pointerTrail.x-9}px,${pointerTrail.y-9}px)`;cursorOrb.style.opacity=finished?0:.96;if(!started)introTitle.style.backgroundPosition=`${50+(pointerTrail.x/W-.5)*18}% ${50+(pointerTrail.y/H-.5)*12}%`}
function frame(now){if(!finished){trail(now);const t=started?(now-startTime)/1000:0;if(started){music.volume=t<=60?1:Math.max(0,1-(t-60)/18)}const sceneTime=started?Math.min(t,FINAL_AT-.001):((now*.00018)%8)+1;renderScene(sceneTime);renderMask(now,t);renderWebGL(now);if(started){const i=scriptAt(t);if(i!==currentScript){if(i<0)hideScript();else showScript(i)}if(t>=FINAL_AT)finish()}}requestAnimationFrame(frame)}
function pointer(e){const p=e.touches?.[0]||e;pointerTarget.x=p.clientX;pointerTarget.y=p.clientY}
enterBtn.addEventListener('click',()=>{if(!ready||started)return;started=true;document.body.classList.add('playing');startTime=performance.now();music.currentTime=0;music.volume=.02;music.play().catch(()=>{});let sv=0;const sid=setInterval(()=>{sv=Math.min(1,sv+.18);music.volume=sv;if(sv>=1)clearInterval(sid)},60)});musicBtn.addEventListener('click',()=>{if(music.paused)music.play().catch(()=>{});else music.pause()});encoreBtn.addEventListener('click',()=>location.reload());addEventListener('mousemove',pointer,{passive:true});addEventListener('touchstart',pointer,{passive:true});addEventListener('touchmove',e=>{pointer(e);e.preventDefault()},{passive:false});addEventListener('wheel',e=>{if(!finished)e.preventDefault()},{passive:false});addEventListener('keydown',e=>{if(!finished&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' '].includes(e.key))e.preventDefault()});addEventListener('resize',resize);
initWebGL();music.load();preload().then(()=>{ready=true;enterBtn.disabled=false;resize()}).catch(()=>{ready=true;enterBtn.disabled=false;resize()});resize();requestAnimationFrame(frame)})();
