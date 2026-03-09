const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const i=c.indexOf('renderAdminUrunler');
console.log(c.substring(i,i+1500));
