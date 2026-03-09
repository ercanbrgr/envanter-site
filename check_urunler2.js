const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const i=c.indexOf('async function renderAdminUrunler');
console.log('function at:',i);
console.log(c.substring(i,i+2000));
