const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Check renderAdminUrunler full body
const i=c.indexOf('async function renderAdminUrunler');
const end=c.indexOf('\nasync function ',i+50);
console.log('=== renderAdminUrunler ===');
console.log(c.substring(i,end));

// Check aylik PDF function
const j=c.indexOf('aylikPdf');
const k=c.indexOf('AylikPdf');
const l=c.indexOf('pdfAl');
console.log('\n=== PDF funcs ===');
if(j>0) console.log('aylikPdf at:',j,c.substring(j,j+100));
if(k>0) console.log('AylikPdf at:',k,c.substring(k,k+100));
if(l>0) console.log('pdfAl at:',l,c.substring(l,l+100));

// Find monthly report pdf
const m=c.indexOf('Aylık Rapor PDF');
const n2=c.indexOf('aylikRaporPdf');
const o=c.indexOf('adminAylikPdf');
console.log('Aylık Rapor PDF:',m>0?c.substring(m-50,m+200):'NOT FOUND');
console.log('aylikRaporPdf:',n2>0?c.substring(n2,n2+200):'NOT FOUND');
console.log('adminAylikPdf:',o>0?c.substring(o,o+200):'NOT FOUND');
