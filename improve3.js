const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  if(c.includes(from)){c=c.split(from).join(to);console.log('FIX: '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// ===== 1. Veri Gir formunda tarih seçince otomatik ay/gün no hesapla =====
// When user changes date in add form, auto-update the gun (day number)
const oldDateInput=`<input type="date" id="f-tarih" value="\${new Date().toISOString().split('T')[0]}">`;
const newDateInput=`<input type="date" id="f-tarih" value="\${new Date().toISOString().split('T')[0]}" onchange="updateGunNo(this.value)">`;
rep(oldDateInput,newDateInput,'tarih input onchange');

// Add updateGunNo function near addEntry
const oldAddEntry=`function addEntry(){`;
const newAddEntry=`function updateGunNo(tarih){if(!tarih)return;const ay=tarih.slice(0,7);const p=appData.products[currentProduct];if(!p)return;const sayisi=p.entries.filter(e=>e.tarih&&e.tarih.startsWith(ay)).length;const el=document.getElementById('f-gun');if(el)el.value=sayisi+1;}
function addEntry(){`;
rep(oldAddEntry,newAddEntry,'updateGunNo function');

// ===== 2. Add form - show which month we are adding for =====
const oldFormHeader=`<h3 style="margin:0">Yeni Gün Ekle</h3>`;
const newFormHeader=`<h3 style="margin:0">Yeni Gün Ekle <span id="form-ay-label" style="font-size:11px;color:#aaa;font-weight:400"></span></h3>`;
rep(oldFormHeader,newFormHeader,'form header ay label');

// ===== 3. Better empty state messages =====
rep(
  '<p>Henüz giriş yok.<br>',
  '<p style="margin:8px 0">Henüz veri girilmemiş.<br>',
  'empty state msg'
);

// ===== 4. Add keyboard shortcut hint on save =====
// Already has save button - no change needed

// ===== 5. Sync error - also try to re-sync on next edit =====
// Already good in syncEntry

// ===== 6. Fix: When admin views a branch, show branch name in title =====
const oldSubeH2=`>\uD83C\uDFEA \${profil?.sube_adi||'Şube'}</h2>`;
const newSubeH2=`>\uD83C\uDFEA \${profil?.sube_adi||'Şube'}</h2>`;
// Already correct, skip

// ===== 7. Add loading indicator to admin sections =====
rep(
  `pc.innerHTML='<div class="empty"><div class="ico">?</div><p>Yükleniyor...</p></div>';`,
  `pc.innerHTML='<div class="empty"><div class="ico">\u23F3</div><p>Yükleniyor...</p></div>';`,
  'loading spinner icon'
);

// ===== 8. Fix: confirm dialogs - make them more descriptive =====
rep(
  `if(!confirm('"'+subeAdi+'" şubesini silmek istediğinizden emin misiniz?\\n\\nTÜM VERİLER (kayıtlar, ürünler) SİLİNECEK!'))return;`,
  `if(!confirm('\u26A0\uFE0F SON UYARI!\\n\\n"'+subeAdi+'" şubesi ve TÜM verileri kalıcı olarak silinecek!\\n\\nBu işlem GERİ ALINAMAZ!\\n\\nDevam etmek için Tamam\'a basın.'))return;`,
  'sil confirm msg'
);

// ===== 9. Admin badge - show count of branches =====
// Already showing in admin panel

// ===== 10. Fix table: "Gün" column shows sequential number, make it clearer =====
// In table header, rename "Gün" to "Gün #" for clarity
rep(
  '<th>Gün</th><th>Tarih</th>',
  '<th>Gün #</th><th>Tarih</th>',
  'gun column header'
);

// ===== 11. PDF: Update version in PDF header =====
rep(
  'Ercan BRGR Envanter Sistemi</title>',
  'Ercan BRGR | Envanter Sistemi</title>',
  'page title format'
);

// ===== 12. Sidebar search - improve placeholder =====
rep(
  'placeholder="Ürün ara..."',
  'placeholder="\uD83D\uDD0D Ürün ara..."',
  'search placeholder'
);

// ===== 13. Better sync status messages =====
rep(
  "setSyncIcon('ok');toast('Kaydedildi \u2705');",
  "setSyncIcon('ok');toast('\u2705 Kaydedildi!');",
  'save toast'
);

// ===== 14. Add total row count info in sidebar =====
// Already shows count badges on products

// ===== 15. Fix: version timestamp =====
rep('v=202602240001','v=202602240100','version bump');
rep('content="202602240001"','content="202602240100"','app-version bump');

console.log('\n=== Total fixes:',fixes,'===');
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
