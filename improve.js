const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;

function rep(from,to,desc){
  if(c.includes(from)){
    c=c.split(from).join(to);
    console.log('FIX '+desc);
    fixes++;
  } else {
    console.log('SKIP (not found): '+desc);
  }
}

// 1. Fix broken emoji toasts (? -> proper emoji)
rep("toast('? Silme yetkisi sadece adminde!'","toast('\uD83D\uDD12 Silme yetkisi sadece adminde!'","sil yetki toast");
rep("toast('Silindi ?'","toast('Silindi \u2705'","silindi toast");
rep("toast('Excel dosyası indirildi ?'","toast('Excel dosyası indirildi \u2705'","excel indir toast 1");
rep("toast('Excel indirildi ?'","toast('Excel indirildi \u2705'","excel indir toast 2");
rep("toast('Tüm veriler Excel olarak indirildi ?'","toast('Tüm veriler Excel olarak indirildi \u2705'","excel indir toast 3");
rep("toast('Şube adı güncellendi ?'","toast('Şube adı güncellendi \u2705'","sube adi toast");
rep("toast('? Yanlış şifre! Silme iptal edildi.'","toast('\u26A0\uFE0F Yanlış şifre! Silme iptal edildi.'","yanlis sifre toast");

// 2. Update version/cache buster to current date
const oldVer='v=202602230935';
const newVer='v=202602240001';
rep(oldVer,newVer,'cache version update');

// 3. Update app-version meta
rep('content="202602220345"','content="202602240001"','app-version meta');

// 4. Improve connection error in app init - find where Supabase errors are silently swallowed
// Find the main init/load function
const initIdx=c.indexOf('async function init(');
if(initIdx>0){
  console.log('init function found at',initIdx);
  console.log(c.substring(initIdx,initIdx+200));
}

// 5. Add null safety on SKT badge - check if skt renders on sidebar
const sktBadge=c.indexOf('sktData.filter');
if(sktBadge>0){
  console.log('SKT badge found, checking...',c.substring(sktBadge-50,sktBadge+100));
}

// 6. Fix: when no entries exist yet, show helpful empty state
const emptyCheck=c.indexOf('Henüz giriş yok');
console.log('Empty state:',emptyCheck>0?'exists':'missing');

console.log('\nTotal fixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
