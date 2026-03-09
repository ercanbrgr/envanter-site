const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

const old=`const urunler=appData?.products||[];`;
const fix=`const urunler=(appData?.products||[]).map(p=>({ad:p.name||p.ad,birim:p.birim,sira:p.sira,min_stok:p.min_stok}));`;

if(c.includes(old)){
  c=c.replace(old,fix);
  console.log('FIXED');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  console.log('NOT FOUND');
  const i=c.indexOf('renderAdminUrunler');
  console.log(c.substring(i,i+200));
}
