const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;
function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// Fix totalFark display
rep(
  '${stats.totalFark>0?\'+\':\'\'}\${stats.totalFark}',
  '${stats.totalFark>0?\'+\':\'\'}\${fmt(stats.totalFark)||\'0\'}',
  'totalFark fmt'
);

// Fix gelenIade and transfer - different pattern
const tblIdx=c.indexOf('class="tbl-row"');
if(tblIdx>0) console.log('tbl row:',c.substring(tblIdx,tblIdx+500));

// Look for the actual pattern
const gi=c.indexOf('gelenIade');
console.log('gelenIade ctx:',c.substring(gi,gi+100));

// Toplam fire display
const fire=c.indexOf('totalFire}');
if(fire>0) console.log('fire:',c.substring(fire-60,fire+20));

// Stats cards with raw numbers
const statsArea=c.indexOf('stat-card');
if(statsArea>0) console.log('stats area:',c.substring(statsArea,statsArea+400));

console.log('\nFixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
