const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
// find adminUrunSil function
const i=c.indexOf('async function adminUrunSil');
console.log(c.substring(i,i+600));
// find where urun add form is
const j=c.indexOf('urun-ekle-form');
console.log('form at:',j,j>0?c.substring(j-100,j+300):'NOT FOUND');
// find yeni urun ekle button
const k=c.indexOf('Yeni Ürün Ekle');
console.log('add btn at:',k,k>0?c.substring(k-100,k+100):'NOT FOUND');
