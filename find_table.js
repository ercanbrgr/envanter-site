const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;
function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// Find the row template with gelenIade in it
const idx=c.indexOf('e.gelenIade');
while(true){
  const i=c.indexOf('e.gelenIade',idx+1);
  if(i<0) break;
  const ctx=c.substring(i-20,i+100);
  console.log('gelenIade ctx:',ctx);
  break;
}

// Simpler: find ${e.gelenIade in template strings
const re=/\$\{[eg]\.(gelenIade|transfer|odenmez)[^}]*\}/g;
let m;
while((m=re.exec(c))!==null){
  console.log('template:',m[0],'at',m.index);
}

// Fix Toplam Fire display 
const fireIdx=c.indexOf('Toplam Fire');
if(fireIdx>0){
  console.log('fire area:',c.substring(fireIdx,fireIdx+200));
}

// Fix stats numeric displays - find all ${stats. patterns
const statsRe=/\$\{stats\.[^}]+\}/g;
while((m=statsRe.exec(c))!==null){
  if(!m[0].includes('fmt') && !m[0].includes('Count') && !m[0].includes('last'))
    console.log('unfmt stats:',m[0],'at',m.index);
}

console.log('\nFixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
