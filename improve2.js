const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// 1. Fix ico div with ? -> proper icon
rep('class="ico">?</div>','class="ico">\uD83D\uDCCB</div>','ico div fix');

// 2. When saving fails, show actual error
const oldSync=`async function syncEntry(idx){const p=appData.products[currentProduct];const e=p.entries[idx];`;
const newSync=`async function syncEntry(idx){try{const p=appData.products[currentProduct];const e=p.entries[idx];`;
if(c.includes(oldSync)){
  // Find end of syncEntry to add catch
  const syncEnd=c.indexOf('function syncEntry');
  const nextFunc=c.indexOf('\nasync function ',syncEnd+100);
  console.log('syncEntry: from',syncEnd,'to',nextFunc);
}

// 3. Improve: Add visual feedback when sync is in progress
// Find scheduleSave and add saving indicator
const schedIdx=c.indexOf('function scheduleSave(');
if(schedIdx>0)console.log('scheduleSave found at',schedIdx,c.substring(schedIdx,schedIdx+200));

// 4. Fix month label in add form header - show Şubat 2026 instead of just number
const gunEkleH=c.indexOf('Yeni Gün Ekle');
if(gunEkleH>0){
  console.log('Add form header:',c.substring(gunEkleH-20,gunEkleH+100));
}

// 5. Check if PDF download is working - find gunlukPdfIndir
const pdfIdx=c.indexOf('function gunlukPdfIndir');
if(pdfIdx>0)console.log('PDF func found at',pdfIdx);

// 6. Check admin yearly summary
const yilIdx=c.indexOf('yıllık');
console.log('yearly report:',yilIdx>0?'found':'not found');

// 7. Add title to browser tab when product selected
rep('<title>Ercan BRGR - Envanter</title>','<title>Ercan BRGR Envanter Sistemi</title>','page title');

// 8. Fix: entries table - show month name not number in "Gün" column header
// Currently shows "Gün" number, which keeps incrementing - verify it resets
const gunColIdx=c.indexOf('gunSayac++');
console.log('gunSayac at:',gunColIdx,c.substring(gunColIdx-100,gunColIdx+200));

console.log('\nFixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
