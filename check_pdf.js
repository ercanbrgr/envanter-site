const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const i=c.indexOf('function gunlukPdfIndir');
console.log('gunlukPdfIndir at:',i);
const end=c.indexOf('\nasync function ',i+50);
console.log(c.substring(i,end>i?end:i+600));
console.log('\n---');
// also check pdfAc
const j=c.indexOf('function pdfAc(');
console.log('pdfAc:',c.substring(j,j+200));
