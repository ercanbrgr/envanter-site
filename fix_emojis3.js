const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixed=0;
function rep(from,to){
  let idx=0,cnt=0;
  while((idx=c.indexOf(from,idx))>=0){c=c.substring(0,idx)+to+c.substring(idx+from.length);cnt++;idx+=to.length;}
  fixed+=cnt;return cnt;
}

// Print button
rep('title="Yaz\u0131r">??</button>','title="Yaz\u0131r">\uD83D\uDDA8\uFE0F</button>');

// PDF headings
rep('>?? G\xFCnl\xFCk Envanter Raporu</h1>','>\uD83D\uDCCB G\xFCnl\xFCk Envanter Raporu</h1>');
rep('>?? ${p.name}</h1>','>\uD83D\uDCE6 ${p.name}</h1>');
rep('>?? ${profil?.sube_adi||\'Şube\'} — G\xFCnl\xFCk ','>\uD83D\uDCCB ${profil?.sube_adi||\'Şube\'} — G\xFCnl\xFCk ');

// Toast messages
rep("toast('Kaydedildi ??')","toast('Kaydedildi \u2705')");
rep("toast('?? Ge\xE7mi\u015F ay kapand","toast('\uD83D\uDD12 Ge\xE7mi\u015F ay kapand");
rep("toast('?? Ge\xE7mi\u015F ay verileri","toast('\u26A0\uFE0F Ge\xE7mi\u015F ay verileri");
rep('`?? ADM\u0130N UYARISI','`\u26A0\uFE0F ADM\u0130N UYARISI');

// Şubeler heading
rep('>?? \u015Eubeler <span','>\uD83C\uDFEA \u015Eubeler <span');

// Detay/edit/sil buttons (multiple occurrences)
rep('>?? Detay</button>','>\uD83D\uDCCA Detay</button>');
rep('>?? Ad\u0131 D\xFCzenle</button>','>✏️ Ad\u0131 D\xFCzenle</button>');
rep('>??? Sil</button>','>🗑 Sil</button>');

// Analytics
rep('>?? En \xE7ok Kay\u0131p ','>\uD83D\uDCC9 En \xE7ok Kay\u0131p ');
rep('>?? En \xE7ok Fazla ','>\uD83D\uDCC8 En \xE7ok Fazla ');

// Şube detail page headings
rep('>?? ${profil?.sube_adi||\'Şube\'}</h2>','>\uD83C\uDFEA ${profil?.sube_adi||\'Şube\'}</h2>');
rep('>?? G\xFCnl\xFCk PDF</button>','>\uD83D\uDCCB G\xFCnl\xFCk PDF</button>');
rep('>?? G\xFCnleri Y\xF6net</button>','>\uD83D\uDCC5 G\xFCnleri Y\xF6net</button>');

// Gün kilidi page
rep('>?? G\xFCn Kilidi','>\uD83D\uDD12 G\xFCn Kilidi');
rep('>?? Kilitli g\xFCnler','>\u2139\uFE0F Kilitli g\xFCnler');
rep("'?? A\xE7\u0131k \u2014 d\xFCzenlenebilir'",'\'✅ A\xE7\u0131k \u2014 d\xFCzenlenebilir\'');
rep("'?? Kilitli'","'\uD83D\uDD12 Kilitli'");
rep("'?? Kilitle'","'\uD83D\uDD12 Kilitle'");
rep("'?? A\xE7'","'✅ A\xE7'");
rep("toast('?? '","toast('\uD83D\uDD12 '");
rep("toast('?? '+tarih+' a\xE7\u0131ld\u0131","toast('✅ '+tarih+' a\xE7\u0131ld\u0131");

// Product detail page
rep('>?? ${profil?.sube_adi} \u203A ${urun?.ad}</h2>','>\uD83D\uDCCB ${profil?.sube_adi} \u203A ${urun?.ad}</h2>');
rep('class="ico">??</div><p>Bu \xFCr\xFCn','class="ico">\uD83D\uDCCB</div><p>Bu \xFCr\xFCn');

// Sube sil prompt
rep("prompt('?? \"'","prompt('\uD83D\uDD12 \"'");

// Super admin sections
rep('>?? T\xFCm Kullan\u0131c\u0131lar</div>','>\uD83D\uDC65 T\xFCm Kullan\u0131c\u0131lar</div>');
rep('>?? Hata</th>','>\u26A0\uFE0F Hata</th>');
rep('>?? ${subeAdi} \u2014 Negatif','>\uD83D\uDCCA ${subeAdi} \u2014 Negatif');

// Admin nav buttons
rep('>?? \u015Eubeler</button>','>\uD83C\uDFEA \u015Eubeler</button>');
rep('>?? \xDCr\xFCnler</button>','>\uD83D\uDCE6 \xDCr\xFCnler</button>');
rep('>?? Ayl\u0131k Rapor</button>','>\uD83D\uDCCA Ayl\u0131k Rapor</button>');
rep('>?? Kar\u015F\u0131la\u015Ft\u0131rma</button>','>\uD83D\uDCC8 Kar\u015F\u0131la\u015Ft\u0131rma</button>');
rep('>?? Excel \u0130ndir</button>','>\uD83D\uDCCA Excel \u0130ndir</button>');
rep('>?? \u015Eube Y\xF6netimi</button>','>\uD83C\uDFEA \u015Eube Y\xF6netimi</button>');

// Admin ürün listesi
rep('>?? \xDCr\xFCn Listesi</div>','>\uD83D\uDCE6 \xDCr\xFCn Listesi</div>');
rep('>??? Sil</button></td></tr>','>🗑 Sil</button></td></tr>');
rep("toast('??? \"'","toast('🗑 \"'");

// Notification cards  
rep('<span style="font-size:22px">??</span><div style="flex:1"><div style="font-size','<span style="font-size:22px">\u26A0\uFE0F</span><div style="flex:1"><div style="font-size');

// Şube yönetimi page heading
rep('>?? \u015Eube Y\xF6netimi</h3>','>\uD83C\uDFEA \u015Eube Y\xF6netimi</h3>');

// Şube kartı
rep('<span style="font-size:28px">??</span>','<span style="font-size:28px">\uD83C\uDFEA</span>');
rep('>?? \'+(p.email','>\uD83D\uDCE7 \'+(p.email');
rep('>?? Ad\u0131 De\u011Fi\u015Ftir</button>','>✏️ Ad\u0131 De\u011Fi\u015Ftir</button>');
rep('>?? Verileri G\xF6r</button>','>\uD83D\uDCCA Verileri G\xF6r</button>');

// Karşılaştırma headings
rep('>?? \u015Eubeler Kar\u015F\u0131la\u015Ft\u0131rma</h3>','>\uD83D\uDCC8 \u015Eubeler Kar\u015F\u0131la\u015Ft\u0131rma</h3>');
rep('>?? \'+(b.sube_adi)','>\uD83C\uDFEA \'+(b.sube_adi');
rep(">?? '+b.sube_adi+'</span>",">\uD83C\uDFEA '+b.sube_adi+'</span>");

// Mail otomasyonu
rep('>?? Mail Otomasyonu</h3>','>\uD83D\uDCE7 Mail Otomasyonu</h3>');
rep('>?? Kurulum Ad\u0131mlar\u0131:</div>','>\uD83D\uDCCB Kurulum Ad\u0131mlar\u0131:</div>');
rep('>1?? <a href=','>1️⃣ <a href=');
rep('>2?? <strong>Yeni','>2️⃣ <strong>Yeni');
rep('>3?? A\u015Fa\u011F\u0131daki','>3️⃣ A\u015Fa\u011F\u0131daki');
rep('>4?? \xDCstteki','>4️⃣ \xDCstteki');
rep('>5?? <strong>','>5️⃣ <strong>');
rep('>?? Kopyala</button>','>📋 Kopyala</button>');
rep('>?? <strong>SUPA_KEY','>⚠️ <strong>SUPA_KEY');

// Aylık rapor heading
rep('>?? Ayl\u0131k Rapor</h2>','>\uD83D\uDCCA Ayl\u0131k Rapor</h2>');
rep('>?? Excel \u0130ndir</button>\u003cbutton','>\uD83D\uDCCA Excel \u0130ndir</button><button');
rep('>?? PDF Al</button>','>\uD83D\uDCCB PDF Al</button>');
rep('>?? ${profil.sube_adi}</div>','>\uD83C\uDFEA ${profil.sube_adi}</div>');

// İş zekası
rep('>?? \u0130\u015F Zekas\u0131</div>','>\uD83D\uDCA1 \u0130\u015F Zekas\u0131</div>');
rep('<span style="font-size:20px">??</span>','<span style="font-size:20px">\uD83D\uDCA1</span>');
rep('<span>??</span><span style="font-size:12px;col','<span>\uD83D\uDCC8</span><span style="font-size:12px;col');
rep('>?? Trend Grafi\u011Fi','>\uD83D\uDCC8 Trend Grafi\u011Fi');

// Satış raporu tarih badge
rep('>?? ${satisRaporTarih}</span>','>\uD83D\uDCCA ${satisRaporTarih}</span>');
rep('>?? Tarih bulunamad\u0131','>\u26A0\uFE0F Tarih bulunamad\u0131');

// mallara?? and zayi?? - these are JS null coalescing, skip them

const remaining=(c.match(/\?\?/g)||[]).length;
// Count non-js-operator remaining
let jsOps=0;
const re2=/\?\?/g;let m;
while((m=re2.exec(c))!==null){
  const ctx=c.substring(Math.max(0,m.index-10),m.index+10);
  if(ctx.match(/[a-z\u00e0-\u024f\w]\?\?['"]|null\?\?|\?\?''|\?\?null/)) jsOps++;
}
console.log('Fixed:',fixed,'Remaining ??:',remaining,'(JS operators ~'+jsOps+')');

fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Done.');
