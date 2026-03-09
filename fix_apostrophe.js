const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

const old=`if(!confirm('\u26A0\uFE0F SON UYARI!\\n\\n"'+subeAdi+'" \u015fubesi ve T\xDCM verileri kal\u0131c\u0131 olarak silinecek!\\n\\nBu i\u015flem GER\u0130 ALINAMAZ!\\n\\nDevam etmek i\xE7in Tamam'a bas\u0131n.'))return;`;
const fix=`if(!confirm('\u26A0\uFE0F SON UYARI!\\n\\n"'+subeAdi+'" \u015fubesi ve T\xDCM verileri kal\u0131c\u0131 olarak silinecek!\\n\\nBu i\u015flem GER\u0130 ALINAMAZ!\\n\\nDevam etmek i\xE7in TAMAM bas\u0131n.'))return;`;

if(c.includes(old)){
  c=c.replace(old,fix);
  console.log('FIXED: apostrophe in confirm');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  // Try finding the pattern differently
  const i=c.indexOf("SON UYARI");
  if(i>0) console.log('confirm text:',JSON.stringify(c.substring(i-20,i+200)));
  else console.log('NOT FOUND');
}
