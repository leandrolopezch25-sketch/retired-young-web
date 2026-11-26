import {readData,sourceDefaults} from "./utils.mjs";
const reply=(statusCode,data)=>({statusCode,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(data)});
export async function handler(e){
 if(e.httpMethod!=='POST')return reply(405,{success:false});
 if(!e.body||e.body.length>4096)return reply(400,{success:false});
 let d;try{d=JSON.parse(e.body)}catch{return reply(400,{success:false})}
 if(!d||d.website||d.consentimiento!==true)return reply(400,{success:false});
 const clean={};for(const [k,max] of Object.entries({nombre:100,email:250,pais:80,whatsapp:30,experiencia:30})){if(typeof d[k]!=='string'||!d[k].trim()||d[k].length>max)return reply(400,{success:false});clean[k]=d[k].trim()}
 if(/^[0-9 ()-]+$/.test(clean.whatsapp))clean.whatsapp='+'+clean.whatsapp;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||!/^\+[0-9 ()-]+$/.test(clean.whatsapp)||clean.whatsapp.replace(/\D/g,'').length<7||clean.whatsapp.replace(/\D/g,'').length>15||!['Sin experiencia','Principiante','Intermedio','Avanzado'].includes(clean.experiencia))return reply(400,{success:false});
 if(typeof d.procedencia!=="string"||d.procedencia.length>120)return reply(400,{success:false});
 try{const {data}=await readData();if(!(data.leadSources||sourceDefaults).some(x=>x.active&&x.label===d.procedencia))return reply(400,{success:false});}catch{return reply(503,{success:false})}
 clean.procedencia=d.procedencia;if(d.procedencia==="Otro"){if(typeof d.procedenciaOtra!=="string"||!d.procedenciaOtra.trim()||d.procedenciaOtra.length>120)return reply(400,{success:false});clean.procedencia="Otro: "+d.procedenciaOtra.trim()}
 if(d.otraRedSocial!==undefined&&(typeof d.otraRedSocial!=="string"||d.otraRedSocial.length>80))return reply(400,{success:false});
 if(d.otraRedSocial?.trim())clean.procedencia+=" | Otra red social: "+d.otraRedSocial.trim();
 const url=process.env.GOOGLE_SCRIPT_URL,secret=process.env.GOOGLE_SCRIPT_SECRET;
 if(!secret||!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url||''))return reply(503,{success:false});
 try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...clean,consentimiento:true,secret}),signal:AbortSignal.timeout(8000)});const j=await r.json();if(r.ok&&j.code==='DUPLICATE')return reply(409,{success:false,code:'DUPLICATE'});return r.ok&&j.success===true?reply(200,{success:true}):reply(502,{success:false})}catch{return reply(502,{success:false})}
}
