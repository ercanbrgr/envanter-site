const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const i=c.indexOf('async function renderAdminUrunler');
// Find the add/delete section
const addIdx=c.indexOf('adminUrunEkle',i);
const delIdx=c.indexOf('adminUrunSil',i);
console.log('addFunc:',addIdx>0?'found':'NOT FOUND');
console.log('delFunc:',delIdx>0?'found':'NOT FOUND');
if(addIdx>0) console.log(c.substring(addIdx-50,addIdx+300));
