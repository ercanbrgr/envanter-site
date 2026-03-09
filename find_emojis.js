const fs=require('fs');
const current=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
// Find kart-ikon spans and show bytes
let idx=0;
let count=0;
while((idx=current.indexOf('kart-ikon">',idx))>=0&&count<10){
  const seg=current.substring(idx,idx+30);
  const bytes=[];
  for(let i=0;i<seg.length;i++) bytes.push(seg.charCodeAt(i).toString(16));
  console.log('pos '+idx+': '+bytes.join(' '));
  count++;idx++;
}
