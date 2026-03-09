const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixed=0;

function rep(from,to){
  let idx=0,cnt=0;
  while((idx=c.indexOf(from,idx))>=0){
    c=c.substring(0,idx)+to+c.substring(idx+from.length);
    cnt++;idx+=to.length;
  }
  if(cnt>0) console.log(' '+cnt+'x: '+from.substring(0,30).replace(/\n/g,' '));
  fixed+=cnt; return cnt;
}

// Splash screen burger emoji
rep('splash-burger">??</div>','splash-burger">\uD83C\uDF54</div>');

// Sync indicator initial state and states
rep('durumu">\uD83D\uDD04</span>','durumu">\uD83D\uDD04</span>');  // already ok? check below
rep('durumu">??</span>','durumu">\uD83D\uDD04</span>');  // 🔄 = U+1F504

// Sync state textContent (ok/syncing/err)
// Find the three states
const syncIdx=c.indexOf("el.textContent='??';else if(state==='");
if(syncIdx>=0){
  // Three consecutive states - replace all
  // ok -> ✅, syncing -> 🔄, err -> ⚠️
  rep("ok')el.textContent='??';","ok')el.textContent='\u2705';");
  rep("ng')el.textContent='??';","ng')el.textContent='\uD83D\uDD04';");
  rep("rr')el.textContent='??';","rr')el.textContent='\u26A0\uFE0F';");
  rep("ok')el.textContent='??';}","ok')el.textContent='\u2705';}");
}

// Print/Yazdır button
rep('title="Yazdır">??</button>','title="Yazdır">\uD83D\uDDA8\uFE0F</button>');  // 🖨️

// ÜRÜNLER in drawer
rep('">[??] ÜRÜNLER</span>','">\uD83D\uDCE6 ÜRÜNLER</span>');

// Drawer buttons
rep('>[??] Min Stok Uyar','>⚠️ Min Stok Uyar');
rep('>[??] Günlük Rapor (T','>\uD83D\uDCCB Günlük Rapor (T');
rep('>[??] Satış Raporu Yükl','>\uD83D\uDCCA Satış Raporu Yükl');
rep('>[??] Satış Raporu Anal','>\uD83D\uDCCA Satış Raporu Anal');

// AZ badge
rep('>[??] AZ</span>'>⚠️ AZ</span>');  // syntax err fix below
rep('>?? AZ</span>','>⚠️ AZ</span>');

// ico div  
rep('<div class="ico">??</div>','<div class="ico">📊</div>');

// Product list items
rep('">[??] \'+s.urun_adi','">\uD83D\uDCE6 \'+s.urun_adi');

// PDF headings
rep('>[??] Günlük Envanter R','>\uD83D\uDCCB Günlük Envanter R');
rep('>[??] ${p.name}','>📦 ${p.name}');

// Toast messages
rep("toast('Kaydedildi ??')","toast('Kaydedildi \u2705')");
rep("toast('[??] Geçmiş ay kapand","toast('\uD83D\uDD12 Geçmiş ay kapand");
rep("toast('[??] Geçmiş ay veriler","toast('\u26A0\uFE0F Geçmiş ay veriler");

// Admin alert
rep('`[??] ADMİN UYARISI','`⚠️ ADMİN UYARISI');

// Şubeler heading
rep('>[??] Şubeler <span','>\uD83C\uDFEA Şubeler <span');

// Detay and edit buttons
rep('>[??] Detay</button>','>\uD83D\uDCCA Detay</button>');
rep('>[??] Adı Düzenle</b','>\u270F\uFE0F Adı Düzenle</b');

// Sil button - has extra ?
rep('>[??]? Sil</button>','>🗑 Sil</button>');
rep('>[??] Sil</button>','>🗑 Sil</button>');

// Analytics
rep('>[??] En çok Kayıp','>\uD83D\uDCC9 En çok Kayıp');
rep('>[??] En çok Fazla','>\uD83D\uDCC8 En çok Fazla');

// Sync state sets
rep("el.textContent='??';","el.textContent='\uD83D\uDD04';");

console.log('\nTotal fixed:',fixed);
const remaining=(c.match(/\?\?/g)||[]).length;
console.log('Remaining ?? sequences:',remaining);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
