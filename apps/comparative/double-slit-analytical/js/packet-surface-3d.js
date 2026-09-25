import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {dragSurfaceGeometry} from './packet-interaction.js?v=2.104';
import {surfaceZeroLevel} from './packet-model.js?v=2.104';

const X_MIN=-2,X_MAX=2,Y_MIN=-1.5,Y_MAX=1.5,SURFACE_HEIGHT=.72;

function color(value,fallback='#ffffff'){
 try{return new THREE.Color(value||fallback);}catch{return new THREE.Color(fallback);}
}

function line(points,material){
 const geometry=new THREE.BufferGeometry().setFromPoints(points);
 return new THREE.Line(geometry,material);
}

function lines(positions,colors=null,opacity=1){
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 if(colors)geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 return new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:colors?0xffffff:0xb9dbe7,vertexColors:!!colors,transparent:opacity<1,opacity}));
}

function disposeObject(object){
 object.traverse(child=>{
  child.geometry?.dispose();
  if(Array.isArray(child.material))child.material.forEach(item=>item.dispose());
  else child.material?.dispose();
 });
 object.removeFromParent();
}

export function mountPacketSurface3D({host}){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
 renderer.setClearColor(0x0a1723,1);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.className='packet-surface-webgl';
 renderer.domElement.setAttribute('aria-label','Interactive three-dimensional wave graph');
 host.append(renderer.domElement);

 const scene=new THREE.Scene();
 scene.fog=new THREE.Fog(0x0a1723,6.5,12);
 const camera=new THREE.PerspectiveCamera(38,4/3,.01,50);
 camera.up.set(0,0,1);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=3;controls.maxDistance=12;
 controls.target.set(.15,0,.18);
 let visible=false,lastState=null,frame=0,recordObjects=[];

 const resetCamera=()=>{camera.position.set(5.25,-4.9,3.65);controls.target.set(.15,0,.18);controls.update();render();};
 resetCamera();

 scene.add(new THREE.HemisphereLight(0xcceeff,0x102532,1.9));
 const key=new THREE.DirectionalLight(0xffffff,1.35);key.position.set(-3,-4,7);scene.add(key);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(4.45,3.35),new THREE.MeshPhongMaterial({color:0x173344,transparent:true,opacity:.76,side:THREE.DoubleSide}));
 floor.position.set(.12,0,-.025);scene.add(floor);
 const grid=new THREE.GridHelper(4.4,16,0x4a7c90,0x294e60);grid.rotation.x=Math.PI/2;grid.position.set(.1,0,-.018);grid.material.transparent=true;grid.material.opacity=.46;scene.add(grid);

 const dynamic=new THREE.Group();scene.add(dynamic);
 const overlay=document.createElement('div');overlay.className='packet-surface-help';overlay.innerHTML='<span>Drag: rotate · Wheel/pinch: zoom · Right-drag: pan</span><label>Height <select aria-label="3D surface height" title="Choose the wave quantity graphed as height. Amplitude-based heights use a monotonic contrast boost so the transmitted wave remains visible; zeros and ordering are preserved. cos φ avoids the artificial ±π wrap cliff. Carrier motion is slowed for a smooth 3D display only."><option value="psi2">|Ψ|²</option><option value="phase">cos φ</option><option value="real">Re Ψ</option><option value="imag">Im Ψ</option></select></label><button type="button" title="Reset 3D camera">Reset view</button>';
 overlay.querySelector('button').addEventListener('click',resetCamera);host.append(overlay);
 const heightSelect=overlay.querySelector('select');let heightChange=null;heightSelect.addEventListener('change',()=>heightChange?.(heightSelect.value));
 const editor=document.createElement('div');editor.className='packet-surface-editor';editor.hidden=true;
 editor.innerHTML='<button type="button" data-kind="wall" title="Move slit wall">↔ Wall</button><button type="button" data-kind="distance" title="Change wall-to-detector distance">↔ Distance</button><button type="button" data-kind="height" title="Change screen length">↕ Length</button><button type="button" data-kind="width" title="Change both slit widths">↕ Width</button><button type="button" data-kind="separation" title="Change slit separation">↕ Sep</button><output hidden></output>';
 host.append(editor);
 renderer.domElement.addEventListener('dblclick',resetCamera);
 let editorCallbacks=null,editDrag=null;

 function screenPoint(point){const projected=point.clone().project(camera),width=host.clientWidth,height=host.clientHeight;return {x:(projected.x+1)*width/2,y:(1-projected.y)*height/2};}
 function editorAnchors(){
  if(!lastState)return {};
  const zero=surfaceZeroLevel(lastState.heightMode,SURFACE_HEIGHT),wallX=X_MIN+lastState.wallFraction*(X_MAX-X_MIN),openings=[...lastState.openings].sort((a,b)=>a[0]-b[0]),upper=openings[0]||[.36,.44],lower=openings[1]||upper,lowerCenter=(lower[0]+lower[1])/2;
  return {wall:new THREE.Vector3(wallX,Y_MIN+.12,zero+.2),distance:new THREE.Vector3(X_MAX,Y_MIN+.12,zero+.2),height:new THREE.Vector3(X_MAX,Y_MAX,zero+.2),width:new THREE.Vector3(wallX,Y_MAX-upper[0]*(Y_MAX-Y_MIN),zero+.24),separation:new THREE.Vector3(wallX,Y_MAX-lowerCenter*(Y_MAX-Y_MIN),zero+.24)};
 }
 function positionEditor(){if(editor.hidden||!lastState)return;const anchors=editorAnchors();for(const button of editor.querySelectorAll('button[data-kind]')){const point=screenPoint(anchors[button.dataset.kind]);if(editDrag?.kind===button.dataset.kind){point.x+=editDrag.axisX*(editDrag.scalar||0);point.y+=editDrag.axisY*(editDrag.scalar||0);}button.style.left=point.x+'px';button.style.top=point.y+'px';}}
 function render(){if(!visible)return;renderer.render(scene,camera);positionEditor();}
 controls.addEventListener('change',render);
 function animate(){frame=0;if(!visible)return;controls.update();render();if(controls.enableDamping)frame=requestAnimationFrame(animate);}
 function resize(){const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();}
 const observer=new ResizeObserver(resize);observer.observe(host);resize();

 function sampleHeight(state,u,v){
  if(!state.heights)return 0;
  const i=Math.max(0,Math.min(state.gridWidth-1,Math.round(u*state.fieldFraction*(state.gridWidth-1))));
  const j=Math.max(0,Math.min(state.gridHeight-1,Math.round(v*(state.gridHeight-1))));
  return state.heights[j*state.gridWidth+i]||0;
 }
 const world=(u,v,z=0)=>new THREE.Vector3(X_MIN+u*(X_MAX-X_MIN),Y_MAX-v*(Y_MAX-Y_MIN),z);

 function addWave(state){
  if(!state.showWave||!state.heights)return;
  const cols=96,rows=64,geometry=new THREE.PlaneGeometry(X_MAX-X_MIN,Y_MAX-Y_MIN,cols,rows);
  const positions=geometry.attributes.position,colors=new Float32Array(positions.count*3),rgba=state.rgba;
  for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
   const n=row*(cols+1)+col,u=col/cols,v=row/rows;
   const i=Math.min(state.gridWidth-1,Math.round(u*state.fieldFraction*(state.gridWidth-1))),j=Math.min(state.gridHeight-1,Math.round(v*(state.gridHeight-1))),source=j*state.gridWidth+i;
   positions.setZ(n,sampleHeight(state,u,v)*SURFACE_HEIGHT);
   const visibility=Math.min(1,Math.pow((rgba[4*source+3]||0)/255,.68)*1.18),base=[.035,.095,.135];
   colors[3*n]=base[0]+visibility*((rgba[4*source]||75)/255-base[0]);colors[3*n+1]=base[1]+visibility*((rgba[4*source+1]||150)/255-base[1]);colors[3*n+2]=base[2]+visibility*((rgba[4*source+2]||190)/255-base[2]);
  }
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.98,side:THREE.DoubleSide}));
  mesh.userData.wave=true;
  dynamic.add(mesh);
  const wire=new THREE.Mesh(geometry.clone(),new THREE.MeshBasicMaterial({color:0xd8f5ff,wireframe:true,transparent:true,opacity:.075}));wire.userData.wave=true;dynamic.add(wire);
 }

 function addWall(state){
  if(!state.showScreen)return;
  const zero=surfaceZeroLevel(state.heightMode,SURFACE_HEIGHT),x=X_MIN+state.wallFraction*(X_MAX-X_MIN),openings=[...state.openings].sort((a,b)=>a[0]-b[0]);let cursor=0;
  const addSegment=(top,bottom,opacity=1)=>{
   if(bottom<=top)return;
   const yTop=Y_MAX-top*(Y_MAX-Y_MIN),yBottom=Y_MAX-bottom*(Y_MAX-Y_MIN),height=.18;
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(.055,yTop-yBottom,height),new THREE.MeshPhongMaterial({color:0xd9edf4,transparent:opacity<1,opacity}));
   mesh.position.set(x,(yTop+yBottom)/2,zero+height/2);dynamic.add(mesh);
  };
  openings.forEach(([top,bottom],index)=>{addSegment(cursor,top);const transmission=state.apertureWeights[index]??1;if(transmission<1)addSegment(top,bottom,1-transmission);cursor=Math.max(cursor,bottom);});addSegment(cursor,1);
  const edgePositions=[];for(const [top,bottom] of openings)for(const v of [top,bottom]){const y=Y_MAX-v*(Y_MAX-Y_MIN);edgePositions.push(x-.12,y,zero+.185,x+.12,y,zero+.185);}dynamic.add(lines(edgePositions,null,.9));
  if(state.whichPathFraction!==null){const marker=new THREE.Mesh(new THREE.BoxGeometry(.13,.13,.22),new THREE.MeshPhongMaterial({color:0xffd54a}));marker.position.set(x-.10,Y_MAX-state.whichPathFraction*(Y_MAX-Y_MIN),zero+.18);dynamic.add(marker);}
 }

 function addDetector(state){
  if(!state.showDetector)return;
  const zero=surfaceZeroLevel(state.heightMode,SURFACE_HEIGHT),x=X_MAX+.04,base=zero+.08;
  const wall=new THREE.Mesh(new THREE.BoxGeometry(.075,Y_MAX-Y_MIN,.16),new THREE.MeshPhongMaterial({color:color(state.detectorColor),transparent:true,opacity:.68}));wall.position.set(x,0,base);dynamic.add(wall);
  if(state.showProbability&&state.probability.length){
   const step=Math.max(1,Math.ceil(state.probability.length/300)),points=[];
   for(let i=0;i<state.probability.length;i+=step){const v=i/(state.probability.length-1);points.push(world(1.015,v,base+.9*state.probability[i]));}
   const probability=line(points,new THREE.LineBasicMaterial({color:color(state.probabilityColor),linewidth:2}));dynamic.add(probability);recordObjects.push(probability);
  }
  if(!state.showHits)return;
  const pointPositions=[],pointColors=[],errorPositions=[],errorColors=[];
  for(let i=0;i<state.hits.length;i++){
   if(!state.hits[i])continue;
   const v=(i+.5)/state.hits.length,y=Y_MAX-v*(Y_MAX-Y_MIN),z=base+.9*state.hitHeights[i],e=.9*state.hitErrors[i],c=color(state.hitColors[i]);
   pointPositions.push(x+.055,y,z);pointColors.push(c.r,c.g,c.b);
   errorPositions.push(x+.055,y,Math.max(base,z-e),x+.055,y,z+e);errorColors.push(c.r,c.g,c.b,c.r,c.g,c.b);
  }
  if(pointPositions.length){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(pointPositions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(pointColors,3));const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.065,sizeAttenuation:true,vertexColors:true}));dynamic.add(points);recordObjects.push(points);}
  if(errorPositions.length){const errors=lines(errorPositions,errorColors,.95);dynamic.add(errors);recordObjects.push(errors);}
 }

 function addParticles(state){
  const fixedZ=surfaceZeroLevel(state.heightMode,SURFACE_HEIGHT),particleZ=(u,v,lift)=>state.showWave&&state.heights?sampleHeight(state,u,v)*SURFACE_HEIGHT+lift:fixedZ+lift;
  const trailPositions=[],trailColors=[],pointPositions=[],pointColors=[];
  if(state.showTrajectories)for(const trail of state.trails){const c=color(trail.color);for(let i=1;i<trail.points.length;i++){
   const a=trail.points[i-1],b=trail.points[i],az=particleZ(a[0],a[1],.035),bz=particleZ(b[0],b[1],.035);
   trailPositions.push(...world(a[0],a[1],az).toArray(),...world(b[0],b[1],bz).toArray());trailColors.push(c.r,c.g,c.b,c.r,c.g,c.b);
  }}
  if(trailPositions.length)dynamic.add(lines(trailPositions,trailColors,.8));
  if(state.showParticles)for(const particle of state.particles){const c=color(particle.color),z=particleZ(particle.u,particle.v,.06);pointPositions.push(...world(particle.u,particle.v,z).toArray());pointColors.push(c.r,c.g,c.b);}
  if(pointPositions.length){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(pointPositions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(pointColors,3));dynamic.add(new THREE.Points(geometry,new THREE.PointsMaterial({size:.075,sizeAttenuation:true,vertexColors:true})))}
 }

 function update(state){
  lastState=state;const zero=surfaceZeroLevel(state.heightMode,SURFACE_HEIGHT),signed=zero>0;floor.position.z=zero-.025;floor.material.opacity=signed?.12:.76;floor.material.depthWrite=!signed;grid.position.z=zero-.018;grid.material.opacity=signed?.36:.46;recordObjects=[];while(dynamic.children.length)disposeObject(dynamic.children[0]);
  addWave(state);addWall(state);addDetector(state);addParticles(state);render();
 }
 function setVisible(next){visible=!!next;renderer.domElement.hidden=!visible;overlay.hidden=!visible;if(visible){resize();if(lastState)update(lastState);cancelAnimationFrame(frame);frame=requestAnimationFrame(animate);}else cancelAnimationFrame(frame);}
 function capture(context,width,height,{includeWave=true,includeRecords=false}={}){
  const hidden=[];
  for(const object of dynamic.children){if(!includeWave&&object.userData.wave){hidden.push(object);object.visible=false;}}
  if(!includeRecords)for(const object of recordObjects){hidden.push(object);object.visible=false;}
  renderer.render(scene,camera);context.drawImage(renderer.domElement,0,0,width,height);
  for(const object of hidden)object.visible=true;renderer.render(scene,camera);
 }
 function projectDetector(v,z,width,height){
  const point=new THREE.Vector3(X_MAX+.095,Y_MAX-v*(Y_MAX-Y_MIN),surfaceZeroLevel(lastState?.heightMode,SURFACE_HEIGHT)+z).project(camera);
  return {x:(point.x+1)*width/2,y:(1-point.y)*height/2};
 }
 function editorValue(kind,start,worldDelta){
  return dragSurfaceGeometry(start,kind,worldDelta);
 }
 function finishEditor(commit){if(!editDrag)return;const drag=editDrag;editDrag=null;controls.enabled=true;editor.querySelector('output').hidden=true;try{if(commit)editorCallbacks?.commit(drag.kind,drag.value);else editorCallbacks?.cancel(drag.kind);}finally{editorCallbacks?.resume(drag.running);}}
 for(const button of editor.querySelectorAll('button[data-kind]')){
  button.addEventListener('pointerdown',event=>{if(event.button!==0||editDrag||!editorCallbacks)return;event.preventDefault();event.stopPropagation();const kind=button.dataset.kind,start=editorCallbacks.getState(),anchor=editorAnchors()[kind],axis=['wall','distance'].includes(kind)?new THREE.Vector3(.5,0,0):new THREE.Vector3(0,.5,0),a=screenPoint(anchor),b=screenPoint(anchor.clone().add(axis)),dx=b.x-a.x,dy=b.y-a.y,length=Math.max(1,Math.hypot(dx,dy));editDrag={kind,start,x:event.clientX,y:event.clientY,axisX:dx/length,axisY:dy/length,pixelsPerWorld:length/.5,value:kind==='width'?start.width:kind==='separation'?start.separation:{wall:start.wall,distance:start.distance,height:start.height},running:editorCallbacks.pause()};controls.enabled=false;button.setPointerCapture(event.pointerId);});
  button.addEventListener('pointermove',event=>{if(!editDrag||editDrag.kind!==button.dataset.kind)return;const scalar=(event.clientX-editDrag.x)*editDrag.axisX+(event.clientY-editDrag.y)*editDrag.axisY,worldDelta=scalar/editDrag.pixelsPerWorld;editDrag.scalar=scalar;editDrag.value=editorValue(editDrag.kind,editDrag.start,worldDelta);const value=editor.querySelector('output');value.hidden=false;value.textContent=editDrag.kind==='width'?`Slit width: ${editDrag.value} nm`:editDrag.kind==='separation'?`Slit separation: ${editDrag.value} nm`:editDrag.kind==='height'?`Screen length: ${editDrag.value.height} nm`:editDrag.kind==='wall'?`Slit wall: ${editDrag.value.wall} nm`:`Detector distance: ${editDrag.value.distance} nm`;positionEditor();editorCallbacks.preview(editDrag.kind,editDrag.value);});
  button.addEventListener('pointerup',()=>finishEditor(true));button.addEventListener('pointercancel',()=>finishEditor(false));button.addEventListener('lostpointercapture',()=>finishEditor(false));
 }
 function configureEditor(callbacks){editorCallbacks=callbacks;}
 function configureHeight(value,onChange){heightSelect.value=value;heightChange=onChange;}
 function setEditing(active){if(!active)finishEditor(false);editor.hidden=!active;controls.enabled=!active;positionEditor();}
 function dispose(){cancelAnimationFrame(frame);observer.disconnect();controls.dispose();while(dynamic.children.length)disposeObject(dynamic.children[0]);renderer.dispose();renderer.domElement.remove();overlay.remove();editor.remove();}
 setVisible(false);
 return {update,setVisible,resetCamera,capture,projectDetector,configureEditor,configureHeight,setEditing,cancelEditor:()=>finishEditor(false),dispose};
}
