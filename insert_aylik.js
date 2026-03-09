const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const newFuncs=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/verdent-projects/new-project/envanter-site/aylik_funcs.js','utf8');

const insertBefore='function pdfAc(html)';
const idx=c.indexOf(insertBefore);
if(idx<0){console.log('NOT FOUND: pdfAc');process.exit(1);}

c=c.substring(0,idx)+newFuncs+'\n'+c.substring(idx);
console.log('Inserted',newFuncs.length,'chars');
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
