const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Fix: addEntry must be async
const old='function addEntry(){';
const fix='async function addEntry(){';

if(c.includes(old)){
  c=c.replace(old,fix);
  console.log('FIXED: addEntry is now async');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  console.log('NOT FOUND - checking what exists:');
  const i=c.indexOf('addEntry');
  console.log(c.substring(i-10,i+60));
}
