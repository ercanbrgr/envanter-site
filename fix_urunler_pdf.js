const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  const cnt=(c.split(from)).length-1;
  if(cnt>0){c=c.split(from).join(to);console.log('FIX('+cnt+'x): '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// ===== 1. FIX renderAdminUrunler: profiller.length -> adminData.profiller?.length||0 =====
rep(
  '${profiller.length} şube</span></td>',
  '${adminData?.profiller?.length||0} şube</span></td>',
  'profiller.length fix'
);

// ===== 2. FIX admin panel kart in drawer: display:none duplicated =====
rep(
  'style="display:none;margin:0 0 8px;padding:12px 14px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;cursor:pointer;display:none;align-items:center',
  'style="display:none;margin:0 0 8px;padding:12px 14px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;cursor:pointer;align-items:center',
  'fix duplicate display:none in drawer kart'
);

// ===== 3. Add Aylık PDF function - find renderAdminAylikRapor and add PDF button =====
const aylikIdx=c.indexOf('async function renderAdminAylikRapor');
const aylikEnd=c.indexOf('\nasync function ',aylikIdx+50);
console.log('renderAdminAylikRapor at:',aylikIdx,'end:',aylikEnd);
const aylikFunc=c.substring(aylikIdx,aylikEnd);

// Find PDF button in aylık rapor
const pdfBtnIdx=aylikFunc.indexOf('PDF Al');
console.log('PDF Al button in aylık rapor:',pdfBtnIdx>0?'EXISTS':'NOT FOUND');

// Check if there's onclick for PDF
const pdfOnclick=aylikFunc.indexOf('aylikPdfAl');
console.log('aylikPdfAl onclick:',pdfOnclick>0?c.substring(aylikIdx+pdfOnclick,aylikIdx+pdfOnclick+80):'NOT FOUND');

// ===== 4. Check the full aylik rapor function =====
console.log('\n--- First 800 chars of renderAdminAylikRapor ---');
console.log(aylikFunc.substring(0,800));
