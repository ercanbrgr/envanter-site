const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Find adminSubeSil function and fix error message to show real error
const old=`if(r1.error||r2.error||r3.error){toast('Silme hatası',4000);return;}`;
const newStr=`if(r1.error||r2.error||r3.error){const errmsg=(r1.error||r2.error||r3.error).message;toast('Silme hatası: '+errmsg,6000);console.error('sil r1:',r1.error,'r2:',r2.error,'r3:',r3.error);return;}`;

if(c.includes(old)){
  c=c.replace(old,newStr);
  console.log('fixed');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  console.log('NOT FOUND');
  const i=c.indexOf('adminSubeSil');
  console.log(c.substring(i,i+600));
}
