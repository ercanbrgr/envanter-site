const fs=require("fs");
let c=fs.readFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html","utf8");
const fixes=[
  ["\uFFFD\uFFFD Sat\uFFFD\uFFFDs","📊 Satış"],
  ["\uFFFD Sat\uFFFD\uFFFDs","📊 Satış"],
  ["ürün ad\uFFFD\uFFFD","ürün adı"],
  ["Yukar\uFFFD\uFFFD","Yukarı"],
  ["'^':'?\uFFFD\uFFFD'","'^':'?'"],
  ["\uFFFD\uFFFD \uFFFDrün adı","✏️ Ürün adı"],
  ["\uFFFD\uFFFD \uFFFDrünler","📦 Ürünler"],
  ["tarih||'\uFFFD\uFFFD'","tarih||'?'"],
  ["\uFFFD\uFFFD G\uFFFDn Kilid","📅 Gün Kilid"],
  ["A\uFFFD\uFFFD\uFFFD\uFFFDk","Açık"],
  ["A\uFFFD\uFFFDk","Açık"],
  ["'\uFFFD A\uFFFD'","'🔓 Aç'"],
  ["Gün Say\uFFFD\uFFFDs","Gün Sayısı"],
  ["tarih:'\uFFFD\uFFFD'","tarih:'?'"],
  ["\uFFFD\uFFFD T\uFFFDm Kullan","👥 Tüm Kullan"],
  ["\uFFFD\uFFFD \uFFFDr\uFFFDnl","📦 Ürünl"],
  ["\uFFFD\uFFFD \uFFFDr\uFFFDn L","📦 Ürün L"],
  ["\uFFFD\uFFFD Kar\uFFFD\uFFFD","📊 Karşı"],
  ["Kar\uFFFD\uFFFDılaş","Karşılaş"],
  ["\uFFFD\uFFFD \uFFFDr\uFFFDn Listesi","📦 Ürün Listesi"],
  ["yapıştır\uFFFD\uFFFDn","yapıştırın"],
  ["\uFFFD\uFFFD G\uFFFDnl","📋 Günl"],
  ["Sat\uFFFD\uFFFDs","Satış"],
];
let cnt=0;
for(const[from,to]of fixes){
  let idx=0;
  while((idx=c.indexOf(from,idx))>=0){c=c.substring(0,idx)+to+c.substring(idx+from.length);cnt++;idx+=to.length;}
}
const rem=(c.match(/\uFFFD/g)||[]).length;
console.log("Fixed:",cnt,"Remaining:",rem);
fs.writeFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html",c,"utf8");
