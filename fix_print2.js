const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const from='??</button>\r\n  </div';
const to='\uD83D\uDDA8\uFE0F</button>\r\n  </div';
const idx=c.indexOf(from);
if(idx>=0){
  c=c.substring(0,idx)+to+c.substring(idx+from.length);
  console.log('fixed at',idx);
} else console.log('not found');
const rem=(c.match(/\?\?/g)||[]).length;
console.log('remaining ?? (including JS operators):',rem);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('done');
