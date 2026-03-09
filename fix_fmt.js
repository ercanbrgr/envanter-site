const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// 1. Add fmt() function after r() function for consistent number display
// fmt: shows Turkish format (comma), trims trailing zeros, max 3 decimal
const oldR='function r(v){return Math.round(v*1000)/1000;}';
const newR=`function r(v){return Math.round(v*1000)/1000;}
function fmt(v){if(v===''||v===null||v===undefined||v===0)return '';const num=parseFloat(String(v).replace(',','.'));if(isNaN(num)||num===0)return '';const s=(Math.round(num*1000)/1000).toString().replace('.',',');return s;}
function fmtOr0(v){const num=parseFloat(String(v).replace(',','.'));if(isNaN(num))return '0';return (Math.round(num*1000)/1000).toString().replace('.',',');}`;
rep(oldR,newR,'add fmt function');

// 2. Fix table cells - use fmt() for all numeric columns
// acilis, gelen, gelenIade, transfer, kapanis - user entered values
rep(
  '><td>${e.acilis??\'\'}</td><td>${e.gelen??\'\'}</td>',
  '><td>${fmt(e.acilis)}</td><td>${fmt(e.gelen)}</td>',
  'acilis/gelen fmt'
);
rep(
  '</td><td>${e.kapanis??\'\'}</td><td>${sayima}</td>',
  '</td><td>${fmt(e.kapanis)}</td><td>${fmt(sayima)}</td>',
  'kapanis/sayima fmt'
);
rep(
  '</td><td>${g.mallara_gore??\'\'}</td><td>${g.zayi??\'\'}</td>',
  '</td><td>${fmt(g.mallara_gore)}</td><td>${fmt(g.zayi)}</td>',
  'mallara/zayi fmt'
);

// fark - always show with sign, use fmt
rep(
  'style="${fc}">${fark>0?\'+\':\'\'}\${fark}</td>',
  'style="${fc}">${fark>0?\'+\':\'\'}\${fmt(fark)||\'0\'}</td>',
  'fark fmt'
);

// gelenIade and transfer in table
rep(
  'td>${e.gelenIade??\'\'}</td><td>${e.transfer??\'\'}</td>',
  'td>${fmt(e.gelenIade)}</td><td>${fmt(e.transfer)}</td>',
  'gelenIade/transfer fmt'
);

// odenmez in table
rep(
  '</td><td>${g.odenmez??\'\'}</td>',
  '</td><td>${fmt(g.odenmez)}</td>',
  'odenmez fmt'
);

// 3. Fix stats display - toplam values
// Find where totalFark, totals are displayed
const statIdx=c.indexOf('totalFark.toFixed');
if(statIdx>0) console.log('totalFark display:',c.substring(statIdx-30,statIdx+60));
else {
  const si=c.indexOf('${stats.totalFark}');
  if(si>0) console.log('totalFark at:',c.substring(si-50,si+80));
}

// 4. Fix: Toplam Fire display
const fireIdx=c.indexOf('totalFire');
if(fireIdx>0) console.log('fire:',c.substring(fireIdx,fireIdx+200));

// 5. Update version
rep('v=202602240100','v=202602240200','version bump');
rep('content="202602240100"','content="202602240200"','app-version bump');

console.log('\nTotal fixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
