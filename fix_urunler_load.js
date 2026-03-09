const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Find and replace the loading+fetch part with direct appData usage
const oldFetch=`pc.innerHTML='<div class="empty"><div class="ico">📋</div><p>Ürünler yükleniyor...</p></div>';const uid=(await sb.auth.getUser()).data.user?.id;const{data:urunler}=await sb.from('urunler').select('*').eq('user_id',uid).order('sira');`;
const newFetch=`const urunler=appData?.products||[];`;

if(c.includes(oldFetch)){
  c=c.replace(oldFetch,newFetch);
  console.log('FIXED: use appData.products instead of fresh fetch');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  // try partial match
  const i=c.indexOf('Ürünler yükleniyor');
  console.log('partial:',c.substring(i-30,i+300));
}
