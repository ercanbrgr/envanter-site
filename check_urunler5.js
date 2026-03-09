const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
// Find the table row rendering in renderAdminUrunler
const i=c.indexOf('async function renderAdminUrunler');
const end=c.indexOf('\nasync function ',i+100);
const funcBody=c.substring(i,end);
// Find table row part
const trIdx=funcBody.indexOf('<tr>');
const tr2=funcBody.indexOf('urun.ad');
console.log('table row (urun.ad):',funcBody.substring(tr2-100,tr2+300));
console.log('---');
// Check adminYeniUrunEkle
const j=c.indexOf('async function adminYeniUrunEkle');
console.log('adminYeniUrunEkle:',c.substring(j,j+600));
