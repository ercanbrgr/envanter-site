const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

const partialIdx=c.indexOf("profiller[0].user_id).order('sira');");
if(partialIdx<0){console.log('NOT FOUND');process.exit(1);}

// Find start of the block - go back to find const{data:profiller}
const blockStart=c.lastIndexOf("const{data:profiller}=await sb.from('sube_profiller')",partialIdx);
console.log('blockStart:',blockStart);

const blockEnd=partialIdx+"profiller[0].user_id).order('sira');".length;
const oldStr=c.substring(blockStart,blockEnd);
console.log('oldStr:',JSON.stringify(oldStr));

const newStr="const uid=(await sb.auth.getUser()).data.user?.id;const{data:urunler}=await sb.from('urunler').select('*').eq('user_id',uid).order('sira');";

c=c.substring(0,blockStart)+newStr+c.substring(blockEnd);
console.log('done, saved');
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
