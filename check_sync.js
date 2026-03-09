const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// 1. syncEntry - add error handling and retry
const oldSyncBody=`async function syncEntry(idx){const p=appData.products[currentProduct];const e=p.entries[idx];const row={user_id:currentUser.id,urun_sira:p.sira,gun:e.gun||'',tarih:e.tarih||null,acilis:e.acilis||'',gelen:e.gelen||'',gelen_iade:e.gelenIade||'',transfer:e.transfer||'',kapanis:e.kapanis||'',mallara_gore:e.mallara||'',zayi:e.zayi||'',odenmez:e.odenmez||''`;
if(c.includes(oldSyncBody)){
  console.log('syncEntry body found');
}

// Actually find the full syncEntry to understand it
const sIdx=c.indexOf('async function syncEntry(idx)');
const sEnd=c.indexOf('\nasync function ',sIdx+50);
console.log('syncEntry body:');
console.log(c.substring(sIdx,Math.min(sEnd,sIdx+800)));
