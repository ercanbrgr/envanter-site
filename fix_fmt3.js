const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;
function rep(from,to,desc){
  const cnt=(c.split(from)).length-1;
  if(cnt>0){c=c.split(from).join(to);console.log('FIX('+cnt+'x): '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// Fix table cell templates for gelenIade, transfer, odenmez
rep("${e.gelenIade||''}",'${fmt(e.gelenIade)}','gelenIade fmt');
rep("${e.transfer||''}",'${fmt(e.transfer)}','transfer fmt');
rep("${e.odenmez||''}",'${fmt(e.odenmez)}','odenmez fmt');
rep("${g.transfer||''}",'${fmt(g.transfer)}','g.transfer fmt');
rep("${g.odenmez||''}",'${fmt(g.odenmez)}','g.odenmez fmt');

// Fix Toplam Fire display (toplamFire raw number)
rep(
  '>${toplamFire} <span style="font-size:11px',
  '>${fmtOr0(toplamFire)} <span style="font-size:11px',
  'toplamFire fmt'
);

// Fix stats.totalFark in stat card display
rep(
  "${stats.totalFark>0?'+':''}\${stats.totalFark}",
  "${stats.totalFark>0?'+':''}\${fmt(stats.totalFark)||'0'}",
  'totalFark stat card fmt'
);

// Stats - lastFark
rep(
  "${stats.totalFark>0?'+':''}${stats.totalFark}</div>",
  "${stats.totalFark>0?'+':''}${fmt(stats.totalFark)||'0'}</div>",
  'totalFark display'
);

// Version bump
rep('v=202602240200','v=202602240300','ver');
rep('content="202602240200"','content="202602240300"','ver meta');

console.log('\nTotal fixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
