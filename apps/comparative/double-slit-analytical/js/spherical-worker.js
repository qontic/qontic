import {createPacketCache} from './packet-cache.js?v=45';
import {build,detectorProfile,synthesize} from './spherical-field.js?v=45';
// Keep only the most recent geometry. Storage failure never prevents playback.
async function savedField(mode,record){
 let db;
 try{
  db=await new Promise((resolve,reject)=>{
   const r=indexedDB.open('qontic-spherical-field',1);
   r.onupgradeneeded=()=>r.result.createObjectStore('fields');
   r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });
  return await new Promise((resolve,reject)=>{
   const tx=db.transaction('fields',mode==='read'?'readonly':'readwrite'),store=tx.objectStore('fields');
   const r=mode==='read'?store.get('latest'):store.put(record,'latest');
   tx.oncomplete=()=>resolve(r.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
 }catch{return null;}finally{db?.close();}
}
self.onmessage=async({data})=>{
 try{
  const {p,options}=data;
  // Particle count, bin count and cone sampling do not alter this wave field.
  const key=JSON.stringify({model:45,sx:p.sx,sy:p.sy,k:p.k,wall:p.wall,screen:p.screen,
   centers:p.centers,radius:p.radius,emission:p.emission,duration:p.duration,options});
  let table,profile;
  const saved=await savedField('read');
  if(saved?.key===key){table=saved.table;profile=saved.profile;table.p=p;self.postMessage({progress:'Restoring saved spherical field…'});}
  else{
   self.postMessage({progress:'Preparing diffraction spectrum (new geometry)…'});
   table=build(p,options);profile=detectorProfile(table);
   if(profile.negativeFraction>.001)throw new Error('Appreciable detector backflow: this geometry needs a detector model beyond first outward crossings.');
   delete profile.timeFlux;
   self.postMessage({progress:'Caching packet playback…'});
   table.cache=createPacketCache(table,synthesize);table.components=null;
   self.postMessage({progress:'Saving prepared field for reuse…'});
   await savedField('write',{key,table,profile});
  }
  const buffers=[...table.edge,...table.screen,...table.radial,table.xs,table.ys];
  for(const f of table.cache.frames)for(const key of ['values','radial','edge','screen'])buffers.push(...f[key]);
  self.postMessage({table,profile},buffers.map(a=>a.buffer));
 }catch(error){self.postMessage({error:error.message});}
};
