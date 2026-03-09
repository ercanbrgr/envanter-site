if(window.location.search.indexOf('v=202602241200')===-1){window.location.replace(window.location.pathname+'?v=202602241200');}
window.onerror=function(msg,src,line,col,err){var d=document.getElementById('giris-err');if(d){d.style.color='#e74c3c';d.textContent='JS HATA: '+msg+' (satir:'+line+')';d.style.display='block';}return false;};if(typeof supabase==='undefined'){document.addEventListener('DOMContentLoaded',function(){var d=document.getElementById('giris-err');if(d){d.style.color='#e74c3c';d.textContent='CDN yuklenemedi - internet baglantinizi kontrol edin';d.style.display='block';}});}

const SUPA_URL='https://gqhfxpczgxksbfybfesz.supabase.co';
const SUPA_KEY='sb_publishable_0L6Pcm4GYzaEyIQ8Dup-6A_LqT-Z-FS';
const {createClient}=supabase;
const sb=createClient(SUPA_URL,SUPA_KEY);
let currentUser=null,isAdmin=false,isSuperAdmin=false,appData={products:[]},currentProduct=0,showAddForm=false,syncTimeout=null,acikGunler=new Set();
const DEFAULT_PRODUCTS=[
  {name:'Mini Et Burger',birim:'Kg'},{name:'Joker Burger',birim:'Kg'},
  {name:'Super Burger',birim:'Kg'},{name:'Tasty Burger',birim:'Kg'},
  {name:'Special',birim:'Kg'},{name:'Mini Tavuk',birim:'Kg'},
  {name:'Tavuk Burger',birim:'Kg'},{name:'Tenders',birim:'Kg'},
  {name:'Patates',birim:'Kg'},{name:'Nugget',birim:'Kg'},
  {name:'Soğan Halkası',birim:'Kg'},{name:'Çıtır Tavuk',birim:'Kg'},
  {name:'Stick Peynir',birim:'Kg'},{name:'Karamelize Soğan',birim:'Kg'},
  {name:'Füme',birim:'Kg'},{name:'Kızartma Yağı',birim:'Lt'},
  {name:'80 gr Ekmek',birim:'Adet'},{name:'Mini Ekmek',birim:'Adet'},
  {name:'Kutu İçecekler',birim:'Adet'},{name:'Soda Grubu',birim:'Adet'},
  {name:'1 Litrelik İçecekler',birim:'Adet'},{name:'Ürün 22',birim:'Adet'},
  {name:'Ürün 23',birim:'Adet'},{name:'Ürün 24',birim:'Adet'},{name:'Ürün 25',birim:'Adet'}
];
function toast(msg,dur=2500){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}
function switchTab(tab){document.getElementById('tab-giris').classList.toggle('active',tab==='giris');document.getElementById('tab-kayit').classList.toggle('active',tab==='kayit');document.getElementById('form-giris').style.display=tab==='giris'?'':'none';document.getElementById('form-kayit').style.display=tab==='kayit'?'':'none';}
async function doGiris(){
  const email=document.getElementById('giris-email').value.trim();
  const pass=document.getElementById('giris-sifre').value;
  const errEl=document.getElementById('giris-err');
  const btn=document.getElementById('giris-btn');
  const card=document.querySelector('.auth-card');
  if(card)card.style.border='3px solid orange';
  if(!email||!pass){if(errEl)errEl.textContent='Email ve sifre girin';return;}
  if(btn){btn.disabled=true;btn.textContent='1/3 Giris...';}
  if(errEl){errEl.style.color='#888';errEl.textContent='Adim 1: Supabase baglantiyor...';}
  const{data,error}=await sb.auth.signInWithPassword({email,password:pass});
  if(btn){btn.disabled=false;btn.textContent='Giris Yap';}
  if(error){
    if(errEl){errEl.style.color='#e74c3c';errEl.textContent='GIRIS HATASI: '+error.message+' ['+error.status+']';}
    if(card)card.style.border='3px solid red';
    return;
  }
  if(errEl){errEl.style.color='#27ae60';errEl.textContent='Adim 2: Giris basarili! Profil yukleniyor...';}
  if(card)card.style.border='3px solid green';
  await onSignedIn(data.user);
}

async function doKayit(){const email=document.getElementById('kayit-email').value.trim(),pass=document.getElementById('kayit-sifre').value,pass2=document.getElementById('kayit-sifre2').value,errEl=document.getElementById('kayit-err'),btn=document.getElementById('kayit-btn');if(!email||!pass){errEl.textContent='E-posta ve şifre girin';return;}if(pass.length<6){errEl.textContent='Şifre en az 6 karakter olmalı';return;}if(pass!==pass2){errEl.textContent='Şifreler eşleşmiyor';return;}btn.disabled=true;btn.textContent='Kayıt olunuyor...';errEl.textContent='';const{data,error}=await sb.auth.signUp({email,password:pass});btn.disabled=false;btn.textContent='Kayıt Ol';if(error){let msg='Kayıt başarısız';if(error.message.includes('already registered'))msg='Bu e-posta zaten kayıtlı, giriş yapın';else if(error.message.includes('invalid'))msg='Geçerli bir e-posta girin';errEl.textContent=msg;return;}if(data.user&&!data.session){errEl.style.color='#27ae60';errEl.textContent='Onay e-postası gönderildi! Gelen kutunuzu kontrol edin.';return;}await onSignedIn(data.user);}
async function doSifreSifirla(){const email=document.getElementById('giris-email').value.trim();if(!email){document.getElementById('giris-err').textContent='Önce e-posta adresinizi girin';return;}const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:'https://ercanbrgr.github.io/envanter-site'});if(error){document.getElementById('giris-err').textContent='Hata: '+error.message;return;}document.getElementById('giris-err').style.color='#27ae60';document.getElementById('giris-err').textContent='Şifre sıfırlama linki e-postanıza gönderildi!';}
async function doSignOut(){if(!confirm('Çıkış yapmak istediğinize emin misiniz?'))return;await sb.auth.signOut();currentUser=null;isAdmin=false;isSuperAdmin=false;appData={products:[]};showScreen('auth-screen');}
function showScreen(id){['auth-screen','sube-screen','loading-screen','app'].forEach(s=>{const el=document.getElementById(s);if(s==='app'){el.style.display=s===id?'flex':'none';if(s===id)el.style.flexDirection='column';}else{el.style.display=s===id?'flex':'none';}});if(id==='loading-screen')initSplashLetters();}
function initSplashLetters(){const el=document.getElementById('splash-brand-letters');if(!el||el._inited)return;el._inited=true;const letters=[{c:'E',o:false},{c:'R',o:false},{c:'C',o:false},{c:'A',o:false},{c:'N',o:false},{c:' ',gap:true},{c:'B',o:true},{c:'R',o:true},{c:'G',o:true},{c:'R',o:true}];el.innerHTML='';letters.forEach((l,i)=>{if(l.gap){const g=document.createElement('span');g.className='gap';el.appendChild(g);return;}const s=document.createElement('span');s.className='letter'+(l.o?' orange':'');s.textContent=l.c;el.appendChild(s);const delay=2800+(i*320);setTimeout(()=>{s.style.animation='letterIn 1s cubic-bezier(0.22,1.6,0.5,1) forwards';},delay);});const burger=document.getElementById('splash-burger');if(burger)setTimeout(()=>burger.classList.add('landed'),3000);}
async function onSignedIn(user){const errEl=document.getElementById('giris-err');try{currentUser=user;if(errEl){errEl.style.color='#888';errEl.textContent='Yukleniyor...';}const profil=await loadProfil();if(!profil){if(errEl)errEl.textContent='';showScreen('sube-screen');setTimeout(()=>document.getElementById('sube-input').focus(),300);return;}isSuperAdmin=(profil.rol==='super_admin');isAdmin=(profil.rol==='admin'||isSuperAdmin);await loadAllData();loadSktData();if(errEl)errEl.textContent='';openApp();}catch(err){showScreen('auth-screen');if(errEl){errEl.style.color='#e74c3c';errEl.textContent='HATA: '+err.message;}}}
async function loadProfil(){const{data}=await sb.from('sube_profiller').select('*').eq('user_id',currentUser.id).single();return data;}
async function saveSube(){const sube=document.getElementById('sube-input').value.trim();if(!sube){document.getElementById('sube-err').textContent='Şube adı girin';return;}document.getElementById('sube-err').textContent='';const{error}=await sb.from('sube_profiller').upsert({user_id:currentUser.id,sube_adi:sube,email:currentUser.email});if(error){document.getElementById('sube-err').textContent='Kaydedilemedi: '+error.message;return;}await initDefaultProducts();await loadAllData();openApp();}
async function addNewProduct(){const ad=prompt('Yeni ürün adı:');if(!ad||!ad.trim())return;const birim=prompt('Birimi (Adet / Kg / Lt / Paket / Kutu):','Adet')||'Adet';const sira=appData.products.length;const{data,error}=await sb.from('urunler').insert({user_id:currentUser.id,sira,ad:ad.trim(),birim,koli:'',adet_koli:''}).select().single();if(error){toast('Eklenemedi: '+error.message,4000);return;}appData.products.push({id:data.id,sira,name:ad.trim(),birim,koli:'',adet:'',entries:[]});currentProduct=appData.products.length-1;showAddForm=false;renderSidebar();renderPage();closeDrawer();toast('Ürün eklendi: '+ad.trim());}
async function openSubeModal(){const profil=await loadProfil();const yeni=prompt('Yeni şube adı:',profil?.sube_adi||'');if(yeni&&yeni.trim()){await sb.from('sube_profiller').upsert({user_id:currentUser.id,sube_adi:yeni.trim()});document.getElementById('topbar-user').textContent=yeni.trim();const dsi=document.getElementById('drawer-sube-info');if(dsi)dsi.textContent=yeni.trim();toast('Şube adı güncellendi');}}
async function loadAllData(){const{data:urunler}=await sb.from('urunler').select('*').eq('user_id',currentUser.id).order('sira');const{data:girdiler}=await sb.from('gunluk_girdiler').select('*').eq('user_id',currentUser.id).order('tarih',{ascending:true});const{data:agData}=await sb.from('acik_gunler').select('tarih').eq('user_id',currentUser.id);acikGunler=new Set((agData||[]).map(r=>r.tarih));appData.products=(urunler||[]).map(u=>({id:u.id,sira:u.sira,name:u.ad,birim:u.birim||'Adet',koli:u.koli||'',adet:u.adet_koli||'',minStok:u.min_stok??null,birimFiyat:u.birim_fiyat||0,entries:(girdiler||[]).filter(g=>g.urun_sira===u.sira).map(g=>({dbId:g.id,gun:g.gun||'',tarih:g.tarih||'',acilis:g.acilis||'',gelen:g.gelen||'',gelenIade:g.gelen_iade||'',transfer:g.transfer||'',kapanis:g.kapanis||'',mallara:g.mallara_gore||'',zayi:g.zayi||'',odenmez:g.odenmez||'',not:g.gun_notu||''}))}))}
async function initDefaultProducts(){const inserts=DEFAULT_PRODUCTS.map((p,i)=>({user_id:currentUser.id,sira:i,ad:p.name,birim:p.birim,koli:'',adet_koli:''}));await sb.from('urunler').upsert(inserts,{onConflict:'user_id,sira'});}
async function openApp(){showScreen('app');let cachedProfil=null;try{cachedProfil=await loadProfil();}catch(e){}const subeAdi=cachedProfil?.sube_adi||currentUser.email;document.getElementById('topbar-user').textContent=subeAdi;const dsi=document.getElementById('drawer-sube-info');if(dsi)dsi.textContent=subeAdi;const dui=document.getElementById('drawer-user-info');if(dui)dui.textContent=currentUser.email;setSyncIcon('ok');if(isAdmin){const badge=isSuperAdmin?'SÜPER ADMİN':'ADMİN';document.getElementById('topbar-user').innerHTML=subeAdi+' <span class="admin-badge">'+badge+'</span>';const subeBtn=document.getElementById('sube-adi-btn');if(subeBtn)subeBtn.style.display='none';const adminKart=document.getElementById('admin-panel-kart');if(adminKart)adminKart.style.display='flex';}renderSidebar();if(isAdmin)renderAdminPanel();else renderPage();}
function setSyncIcon(state){const el=document.getElementById('sync-indicator');if(state==='ok')el.textContent='✅';else if(state==='saving')el.textContent='🔄';else if(state==='err')el.textContent='⚠️';}
function toggleDrawer(){document.getElementById('drawer').classList.toggle('open');document.getElementById('drawer-overlay').classList.toggle('open');setTimeout(()=>{const a=document.querySelector('.product-item.active');if(a)a.scrollIntoView({block:'center',behavior:'smooth'});},150);}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawer-overlay').classList.remove('open');}
function renderSidebar(filter=''){const list=document.getElementById('product-list');list.innerHTML='';appData.products.forEach((p,i)=>{if(filter&&!p.name.toLowerCase().includes(filter.toLowerCase()))return;const lastKapanis=p.entries.length?parseFloat(p.entries[p.entries.length-1].kapanis||''):null;const uyari=p.minStok!==null&&lastKapanis!==null&&lastKapanis<p.minStok;const div=document.createElement('div');div.className='product-item'+(i===currentProduct?' active':'');div.style.display='flex';div.style.alignItems='center';div.style.gap='4px';const moveHtml=isAdmin?`<span style="display:flex;flex-direction:column;gap:1px;flex-shrink:0"><button onclick="event.stopPropagation();moveProduct(${i},-1)" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:10px;padding:0;line-height:1" title="Yukarı">^</button><button onclick="event.stopPropagation();moveProduct(${i},1)" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:10px;padding:0;line-height:1" title="Aşağı">▼</button></span>`:'';div.innerHTML=moveHtml+`<span class="num">${i+1}</span><span class="pname">${p.name}${uyari?` <span style="color:#e74c3c;font-size:10px;font-weight:700">⚠️ AZ</span>`:''}</span>${p.entries.length?`<span class="badge">${p.entries.length}</span>`:''}`;div.onclick=()=>{currentProduct=i;showAddForm=false;renderSidebar(document.getElementById('search-input').value);renderPage();closeDrawer();};list.appendChild(div);});}
async function moveProduct(i,dir){const j=i+dir;if(j<0||j>=appData.products.length)return;const a=appData.products[i],b=appData.products[j];const tmpSira=a.sira;a.sira=b.sira;b.sira=tmpSira;appData.products[i]=b;appData.products[j]=a;await sb.from('urunler').update({sira:a.sira}).eq('id',a.id);await sb.from('urunler').update({sira:b.sira}).eq('id',b.id);if(currentProduct===i)currentProduct=j;else if(currentProduct===j)currentProduct=i;renderSidebar(document.getElementById('search-input').value);renderPage();}
function toggleProductList(){const list=document.getElementById('product-list');const arrow=document.getElementById('product-list-arrow');const hidden=list.style.display==='none';list.style.display=hidden?'':'none';arrow.textContent=hidden?'^':'v';}
function filterProducts(){renderSidebar(document.getElementById('search-input').value);}
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(e.key==='/'||e.key==='f'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();const s=document.getElementById('search-input');if(s){s.focus();s.select();}}
  if(e.key==='ArrowDown'&&currentProduct<appData.products.length-1){currentProduct++;showAddForm=false;renderSidebar(document.getElementById('search-input').value);renderPage();}
  if(e.key==='ArrowUp'&&currentProduct>0){currentProduct--;showAddForm=false;renderSidebar(document.getElementById('search-input').value);renderPage();}
  if(e.key==='Escape'){const s=document.getElementById('search-input');if(s){s.value='';filterProducts();}}
});
function n(v){
  if(v===''||v===null||v===undefined)return 0;
  let s=String(v).trim();
  if(s.indexOf('.')!==-1&&s.indexOf(',')!==-1){
    // Both exist: dot=thousands, comma=decimal  e.g. 1.050,5 -> 1050.5
    s=s.replace(/\./g,'').replace(',','.');
  } else if(s.indexOf(',')!==-1){
    const parts=s.split(',');
    const intPart=parts[0];
    const afterComma=parts[1];
    // Thousands: integer part >= 1 AND exactly 3 digits after comma e.g. 1,050
    if(parseInt(intPart)>=1&&afterComma&&afterComma.length===3&&!afterComma.match(/[^0-9]/)){
      s=s.replace(',',''); // 1,050 -> 1050
    } else {
      s=s.replace(',','.'); // 0,088 -> 0.088, 1,5 -> 1.5
    }
  } else if(s.indexOf('.')!==-1){
    const parts=s.split('.');
    const intPart=parts[0];
    const afterDot=parts[1];
    // Thousands: integer part >= 1 AND exactly 3 digits after dot e.g. 1.050
    if(parseInt(intPart)>=1&&afterDot&&afterDot.length===3&&!afterDot.match(/[^0-9]/)){
      s=s.replace('.',''); // 1.050 -> 1050
    }
    // else decimal: 1.5, 0.088 -> keep
  }
  return parseFloat(s)||0;
}
function r(v){return Math.round(v*1000)/1000;}
function fmt(v){if(v===''||v===null||v===undefined)return '';const num=n(v);if(isNaN(num)||num===0)return '';let s=(Math.round(num*1000)/1000).toFixed(3);// Remove trailing zeros after decimal
s=s.replace(/\.?0+$/,'');if(s.indexOf('.')!==-1)s=s.replace('.',',');// Add thousands dot for numbers >= 1000
if(Math.abs(num)>=1000){const parts=s.split(',');parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');s=parts.join(',');}return s;}
function fmtOr0(v){const num=n(v);if(isNaN(num))return '0';let s=(Math.round(num*1000)/1000).toFixed(3);s=s.replace(/\.?0+$/,'');if(s.indexOf('.')!==-1)s=s.replace('.',',');if(Math.abs(num)>=1000){const parts=s.split(',');parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');s=parts.join(',');}return s||'0';}
function calcEntry(e){const a=n(e.acilis),g=n(e.gelen),gi=n(e.gelenIade),t=n(e.transfer),k=n(e.kapanis),m=n(e.mallara),z=n(e.zayi),o=n(e.odenmez);const sayima=r(a+g-gi-t-k);return{sayima,fark:r(m-sayima+z+o)};}
function getStats(entries){if(!entries.length)return{last:'-',totalFark:0,posCount:0,negCount:0};let totalFark=0,posCount=0,negCount=0;entries.forEach(e=>{const{fark}=calcEntry(e);totalFark+=fark;if(fark>0)posCount++;else if(fark<0)negCount++;});const last=entries[entries.length-1];return{last:last.kapanis!==''?last.kapanis:'-',totalFark:r(totalFark),posCount,negCount};}
let selectedMonth=new Date().toISOString().slice(0,7);
function getMonthOptions(entries){const months=new Set();entries.forEach(e=>{if(e.tarih&&e.tarih.length>=7)months.add(e.tarih.slice(0,7));});return[...months].sort().reverse();}
function monthLabel(ym){if(!ym)return'Tümü';const[y,m]=ym.split('-');const adlar=['','Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];return adlar[parseInt(m)]+' '+y;}
function changeMonth(val){selectedMonth=val;renderPage();}
function renderPage(){if(!appData.products.length){document.getElementById('page-content').innerHTML='<div class="empty"><div class="ico">📋</div><p>Veriler yükleniyor...</p></div>';return;}const p=appData.products[currentProduct];if(!p)return;const birim=p.birim||'Adet';document.getElementById('product-name-display').textContent=p.name;const tsubEl=document.getElementById('topbar-sub');if(tsubEl)tsubEl.textContent=`${birim} • Ada tıkla değiştir`;const birimEl=document.getElementById('topbar-birim');if(birimEl)birimEl.value=birim;const months=getMonthOptions(p.entries);if(months.length&&!months.includes(selectedMonth))selectedMonth=months[0]||selectedMonth;const filtered=selectedMonth==='tumu'?p.entries:p.entries.filter(e=>e.tarih&&e.tarih.startsWith(selectedMonth));const stats=getStats(filtered);const fc=stats.totalFark>0?'green':stats.totalFark<0?'red':'';let monthBar=`<div style="background:#fff;border-radius:12px;padding:10px 14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase">Ay Filtresi</span><select onchange="changeMonth(this.value)" style="padding:7px 12px;border:2px solid #eee;border-radius:8px;font-size:13px;font-weight:700;outline:none;color:#333"><option value="tumu" ${selectedMonth==='tumu'?'selected':''}>Tümü</option>${months.map(m=>`<option value="${m}" ${m===selectedMonth?'selected':''}>${monthLabel(m)}</option>`).join('')}</select><span style="font-size:12px;color:#aaa">${filtered.length} giriş</span></div>`;
// --- Ayın Ürünü & Top 3 ---
const topKartHtml='';
let html=monthBar+topKartHtml;if(showAddForm){let nextAcilis='';for(let _i=p.entries.length-1;_i>=0;_i--){if(p.entries[_i].kapanis!==''&&p.entries[_i].kapanis!==null&&p.entries[_i].kapanis!==undefined){nextAcilis=p.entries[_i].kapanis;break;}}const buAyStr=new Date().toISOString().slice(0,7);const buAyGunSayisi=p.entries.filter(e=>e.tarih&&e.tarih.startsWith(buAyStr)).length;const subeAdiGoster=document.getElementById('topbar-user')?.textContent||'';html+=`<div class="add-card" id="add-form"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><h3 style="margin:0">Yeni Gün Ekle <span id="form-ay-label" style="font-size:11px;color:#aaa;font-weight:400"></span></h3><div style="text-align:right"><div style="font-size:13px;font-weight:800;color:var(--orange)">${p.name}</div><div style="font-size:11px;color:#aaa">${subeAdiGoster}</div></div></div><div class="form-grid"><div class="ff"><label>Gün</label><input type="number" id="f-gun" value="${buAyGunSayisi+1}" inputmode="numeric"></div><div class="ff"><label>Tarih</label><input type="date" id="f-tarih" value="${new Date().toISOString().split('T')[0]}" onchange="updateGunNo(this.value)"></div><div class="ff"><label>Açılış (${birim})</label><input type="number" id="f-acilis" value="${nextAcilis}" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Gelen (${birim})</label><input type="number" id="f-gelen" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Gelen İade</label><input type="number" id="f-gelenIade" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Transfer</label><input type="number" id="f-transfer" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Kapanış (${birim})</label><input type="number" id="f-kapanis" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Sayıma Göre Kullanılan</label><input type="number" id="f-sayima" class="calc" readonly placeholder="Otomatik"></div><div class="ff"><label>Mallara Göre Satılan</label><input type="number" id="f-mallara" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Zayi</label><input type="number" id="f-zayi" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>Ödenmez</label><input type="number" id="f-odenmez" oninput="liveCalc()" step="0.01" placeholder="0" inputmode="decimal"></div><div class="ff"><label>FARK +/-</label><input type="number" id="f-fark" class="calc" readonly placeholder="Otomatik"></div><div class="ff" style="grid-column:1/-1"><label>Not (isteğe bağlı)</label><input type="text" id="f-not" placeholder="Örn: fırın arızası, stok sayım hatası..." style="font-size:13px"></div></div><div class="form-actions"><button class="btn btn-primary" onclick="addEntry()">Kaydet</button><button class="btn btn-outline" onclick="toggleAddForm()">İptal</button></div></div>`;}const ayLabel=selectedMonth==='tumu'?'Tümü':monthLabel(selectedMonth);html+=`<div class="stats-row"><div class="stat-card"><div class="sl">Son Kapanış</div><div class="sv">${stats.last}</div></div><div class="stat-card orange"><div class="sl">${ayLabel} Gün</div><div class="sv">${filtered.length}</div></div><div class="stat-card ${fc}"><div class="sl">${ayLabel} Fark</div><div class="sv">${stats.totalFark>0?'+':''}${fmt(stats.totalFark)||'0'}</div></div><div class="stat-card"><div class="sl">+ / - Gün</div><div class="sv" style="font-size:16px"><span style="color:#27ae60">+${stats.posCount}</span> / <span style="color:#e74c3c">${stats.negCount}</span></div></div></div>`;if(!p.entries.length){html+=`<div class="empty"><div class="ico">📋</div><p style="margin:8px 0">Henüz veri girilmemiş.<br><strong>+ Ekle</strong> butonuna basın.</p></div>`;}else if(!filtered.length){html+=`<div class="empty"><div class="ico">📋</div><p>${ayLabel} için giriş yok.</p></div>`;}else{html+=renderIzeka(p);html+=renderChart(p,filtered);html+=`<div class="table-card"><div class="table-scroll"><table><thead><tr><th>#</th><th>Gün #</th><th>Tarih</th><th>Açılış<br>(${birim})</th><th>Gelen<br>(${birim})</th><th>G.İade</th><th>Transfer</th><th>Kapanış<br>(${birim})</th><th>Sayıma Göre<br>Kullanılan</th><th>Mallara Göre<br>Satılan</th><th>Zayi</th><th>Ödenmez</th><th>Not</th><th>FARK +/-</th></tr></thead><tbody>`;let gunSayac=0;filtered.forEach(e=>{gunSayac++;const idx=p.entries.indexOf(e);const{sayima,fark}=calcEntry(e);const ayKilitli=!isAdmin&&e.tarih&&e.tarih.slice(0,7)<new Date().toISOString().slice(0,7)&&!acikGunler.has(e.tarih);const fc2=fark>0?'fp':fark<0?'fn':'fz';const hasData=e.acilis!==''||e.kapanis!=='';const readonly=ayKilitli?'readonly style="background:#f5f5f5;color:#aaa;cursor:not-allowed"':'';html+=`<tr${ayKilitli?' style="opacity:0.7"':''}><td>${isAdmin?`<button class="del-btn" onclick="deleteEntry(${idx})">✏️</button>`:'-'}</td><td><input type="number" value="${gunSayac}" onchange="${ayKilitli?'':` updateEntry(${idx},'gun',this.value)`}" inputmode="numeric" ${readonly}></td><td><input type="date" value="${e.tarih||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'tarih',this.value)`}" style="width:130px" ${readonly}></td><td><input type="number" value="${e.acilis||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'acilis',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${e.gelen||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'gelen',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${fmt(e.gelenIade)}" onchange="${ayKilitli?'':` updateEntry(${idx},'gelenIade',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${fmt(e.transfer)}" onchange="${ayKilitli?'':` updateEntry(${idx},'transfer',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${e.kapanis||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'kapanis',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td class="calc">${hasData?sayima:''}</td><td><input type="number" value="${e.mallara||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'mallara',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${e.zayi||''}" onchange="${ayKilitli?'':` updateEntry(${idx},'zayi',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="number" value="${fmt(e.odenmez)}" onchange="${ayKilitli?'':` updateEntry(${idx},'odenmez',this.value)`}" step="0.01" inputmode="decimal" ${readonly}></td><td><input type="text" value="${(e.not||'').replace(/"/g,'&quot;')}" onchange="${ayKilitli?'':` updateEntry(${idx},'not',this.value)`}" placeholder="${ayKilitli?'kilitli':'not...'}" style="width:90px;font-size:11px" ${readonly}></td><td class="${fc2}">${hasData?(fark>0?'+':'')+fark:''}</td></tr>`;});html+=`</tbody></table></div><div class="scroll-hint">← kaydırın →</div></div>`;}document.getElementById('page-content').innerHTML=html;setTimeout(()=>initChart(p,filtered),50);}
function liveCalc(){const g=id=>n(document.getElementById(id)?.value);const sayima=r(g('f-acilis')+g('f-gelen')-g('f-gelenIade')-g('f-transfer')-g('f-kapanis'));const fark=r(g('f-mallara')-sayima+g('f-zayi')+g('f-odenmez'));const se=document.getElementById('f-sayima'),fe=document.getElementById('f-fark');if(se)se.value=sayima;if(fe){fe.value=(fark>0?'+':'')+fark;fe.className='calc '+(fark>0?'fpos':fark<0?'fneg':'');}}
function scheduleSave(idx){setSyncIcon('saving');clearTimeout(syncTimeout);syncTimeout=setTimeout(()=>syncEntry(idx),800);}
async function syncEntry(idx){const p=appData.products[currentProduct];const e=p.entries[idx];const row={user_id:currentUser.id,urun_sira:p.sira,gun:e.gun||'',tarih:e.tarih||null,acilis:e.acilis||'',gelen:e.gelen||'',gelen_iade:e.gelenIade||'',transfer:e.transfer||'',kapanis:e.kapanis||'',mallara_gore:e.mallara||'',zayi:e.zayi||'',odenmez:e.odenmez||'',gun_notu:e.not||''};let res;if(e.dbId){res=await sb.from('gunluk_girdiler').update(row).eq('id',e.dbId);}else{res=await sb.from('gunluk_girdiler').insert(row).select().single();if(res.data)e.dbId=res.data.id;}if(res.error){setSyncIcon('err');toast('Kayıt hatası: '+res.error.message,4000);}else{setSyncIcon('ok');}}
async function syncMinStok(sira,minStok){await sb.from('urunler').update({min_stok:minStok}).eq('user_id',currentUser.id).eq('sira',sira);}
async function setBirimFiyat(){const p=appData.products[currentProduct];if(!p)return;const mevcut=p.birimFiyat>0?p.birimFiyat:'';const val=prompt(p.name+' birim fiyatı (?/'+p.birim+'):\nFire maliyetini TL olarak hesaplar. Boş bırakırsanız kapatılır.',mevcut);if(val===null)return;const v=val.trim()===''?0:parseFloat(val.replace(',','.'))||0;p.birimFiyat=v;await sb.from('urunler').update({birim_fiyat:v}).eq('user_id',currentUser.id).eq('sira',p.sira);renderPage();toast(v===0?'Birim fiyat kaldırıldı':'Birim fiyat '+v+'\u20ba/'+p.birim+' olarak ayarland\u0131 \u2713');}
let sktData=[];
function sktGunFark(tarih){if(!tarih)return 999;const today=new Date();today.setHours(0,0,0,0);const d=new Date(tarih+'T00:00:00');return Math.round((d-today)/86400000);}
function renderSktBanner(){const el=document.getElementById('skt-banner');if(!el)return;const kritik=sktData.filter(s=>sktGunFark(s.son_tarih)<=5);if(!kritik.length){el.innerHTML='';el.style.display='none';return;}const gecmis=kritik.filter(s=>sktGunFark(s.son_tarih)<0);const bugun=kritik.filter(s=>sktGunFark(s.son_tarih)===0);const yakin=kritik.filter(s=>sktGunFark(s.son_tarih)>0);let html='<div style="background:#fff3cd;border:2px solid #ffc107;border-radius:10px;padding:10px 14px;margin:8px 0 4px;font-size:12px">';html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span style="font-weight:800;color:#856404;font-size:13px">? SKT UYARILARI ('+kritik.length+')</span><button onclick="openSktModal()" style="padding:4px 10px;background:#ffc107;color:#333;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">Yönet</button></div>';gecmis.forEach(s=>{html+='<div style="display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #ffe8a1;gap:6px"><span style="color:#e74c3c;font-weight:700;flex:1">📦 '+s.urun_adi+(s.miktar?' ('+s.miktar+')':'')+'</span><span style="color:#e74c3c;font-size:10px;font-weight:700;background:#fde;padding:2px 6px;border-radius:4px">SÜRESİ GEÇTİ</span></div>';});bugun.forEach(s=>{html+='<div style="display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #ffe8a1;gap:6px"><span style="color:#e74c3c;font-weight:700;flex:1">📦 '+s.urun_adi+(s.miktar?' ('+s.miktar+')':'')+'</span><span style="color:#e74c3c;font-size:10px;font-weight:700;background:#fde;padding:2px 6px;border-radius:4px">BUGÜN SON GÜN!</span></div>';});yakin.forEach(s=>{const g=sktGunFark(s.son_tarih);const c=g<=2?'#e74c3c':'#856404';html+='<div style="display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #ffe8a1;gap:6px"><span style="color:'+c+';font-weight:700;flex:1">📦 '+s.urun_adi+(s.miktar?' ('+s.miktar+')':'')+'</span><span style="color:'+c+';font-size:10px;font-weight:700">'+g+' gün kaldı ('+s.son_tarih+')</span></div>';});html+='</div>';el.innerHTML=html;el.style.display='block';}
async function loadSktData(){if(!currentUser)return;const{data,error}=await sb.from('skt_takip').select('*').eq('user_id',currentUser.id).order('son_tarih');if(!error)sktData=data||[];renderSktBanner();}
function openSktModal(){document.getElementById('skt-modal').classList.add('show');const d=new Date();d.setDate(d.getDate()+5);document.getElementById('skt-tarih').value=d.toISOString().slice(0,10);renderSktList();}
function closeSktModal(){document.getElementById('skt-modal').classList.remove('show');}
function renderSktList(){const list=document.getElementById('skt-list');if(!sktData.length){list.innerHTML='<div style="text-align:center;padding:20px;color:#aaa;font-size:13px">Henüz kayıt yok.<br>Yukarıdan ürün ekleyin.</div>';return;}let html='<div style="border:1px solid #eee;border-radius:8px;overflow:hidden">';[...sktData].sort((a,b)=>a.son_tarih.localeCompare(b.son_tarih)).forEach(s=>{const g=sktGunFark(s.son_tarih);const bgc=g<0?'#fde8e8':g===0?'#ffe8e8':g<=2?'#fff3cd':g<=5?'#fffde7':'#f9f9f9';const badge=g<0?'<span style="background:#e74c3c;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700">GEÇTİ</span>':g===0?'<span style="background:#e74c3c;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700">BUGÜN!</span>':'<span style="background:'+(g<=2?'#e74c3c':g<=5?'#ffc107':'#27ae60')+';color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700">'+g+' gün</span>';html+='<div style="display:flex;align-items:center;padding:10px 12px;background:'+bgc+';border-bottom:1px solid #eee;gap:8px"><div style="flex:1"><div style="font-size:13px;font-weight:700;color:#333">'+s.urun_adi+'</div><div style="font-size:11px;color:#888">'+(s.miktar?s.miktar+' &bull; ':'')+' SKT: '+s.son_tarih+'</div></div>'+badge+'<button onclick="deleteSktEntry(\''+s.id+'\')" style="padding:4px 8px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-size:11px;cursor:pointer;font-weight:700">Sil</button></div>';});html+='</div>';list.innerHTML=html;}
async function addSktEntry(){const urunAdi=document.getElementById('skt-urun').value.trim();const tarih=document.getElementById('skt-tarih').value;const miktar=document.getElementById('skt-miktar').value.trim();if(!urunAdi||!tarih){toast('Ürün adı ve tarih zorunlu');return;}const{data,error}=await sb.from('skt_takip').insert({user_id:currentUser.id,urun_adi:urunAdi,son_tarih:tarih,miktar}).select().single();if(error){toast('Hata: '+error.message,4000);return;}sktData.push(data);document.getElementById('skt-urun').value='';document.getElementById('skt-miktar').value='';renderSktList();renderSktBanner();toast('SKT kaydı eklendi \u2713');}
async function deleteSktEntry(id){const{error}=await sb.from('skt_takip').delete().eq('id',id);if(error){toast('Silme hatası',4000);return;}sktData=sktData.filter(s=>s.id!==id);renderSktList();renderSktBanner();toast('Silindi \u2713');}
async function renderAdminAylikRapor(){
  const pc=document.getElementById('page-content');
  const now=new Date();
  const defaultAy=now.toISOString().slice(0,7);
  const profiller=adminData?.profiller||[];
  const subeOptions=profiller.map((p,i)=>'<option value="'+i+'">'+(p.sube_adi||p.email)+'</option>').join('');
  pc.innerHTML='<div style="padding:4px 0 16px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#e85d04">\u2190</button><h2 style="margin:0;font-size:18px">\uD83D\uDCCA Ayl\u0131k Rapor</h2></div><div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08)"><div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end"><div><label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">\u015EUBE</label><select id="aylik-sube" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none">'+subeOptions+'</select></div><div><label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">AY</label><input type="month" id="aylik-ay" value="'+defaultAy+'" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none"></div><button onclick="aylikRaporGoster()" style="padding:11px 18px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap">G\xF6ster \u2192</button></div></div><div id="aylik-rapor-icerik"></div></div>';
}
async function aylikRaporGoster(){
  const subeIdx=parseInt(document.getElementById('aylik-sube')?.value)||0;
  const ay=document.getElementById('aylik-ay')?.value;
  if(!ay){toast('Ay se\xE7in');return;}
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('\u015Eube bulunamad\u0131');return;}
  const el=document.getElementById('aylik-rapor-icerik');
  el.innerHTML='<div style="text-align:center;padding:30px;color:#aaa">\u23F3 Y\xFCkleniyor...</div>';
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([sb.from('urunler').select('*').eq('user_id',userId).order('sira'),sb.from('gunluk_girdiler').select('*').eq('user_id',userId)]);
  if(!urunler||!girdiler){el.innerHTML='<div style="color:#e74c3c;padding:20px">Veri al\u0131namad\u0131.</div>';return;}
  const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
  if(!ayGirdiler.length){el.innerHTML='<div style="background:#fff;border-radius:12px;padding:30px;text-align:center;color:#aaa">Bu ay i\xE7in veri bulunamad\u0131.</div>';return;}
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  const subeBilgi=profil.sube_adi||profil.email;
  let html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px"><div style="font-size:15px;font-weight:700;color:#1a1a2e">\uD83D\uDCCA '+subeBilgi+' \u2014 '+monthName+'</div><button onclick="aylikPdfAl('+subeIdx+',\''+ay+'\')" style="padding:9px 16px;background:#27ae60;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">\uD83D\uDCCB PDF Al</button></div>';
  urunler.forEach(function(u){
    const uGirdiler=ayGirdiler.filter(function(g){return g.urun_sira===u.sira;}).sort(function(a,b){return (a.gun||0)-(b.gun||0);});
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    var satirlar=uGirdiler.map(function(g,idx){
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const res=calcEntry(e);const sayima=res.sayima;const fark=res.fark;
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60;font-weight:700':fark<0?'color:#e74c3c;font-weight:700':'color:#999';
      return '<tr style="'+(idx%2?'background:#f9f9f9':'')+'">'
        +'<td style="text-align:center;color:#999;font-size:11px">'+(g.gun||idx+1)+'</td>'
        +'<td style="text-align:center;font-size:11px">'+(g.tarih||'')+'</td>'
        +'<td style="text-align:center">'+fmt(g.acilis)+'</td>'
        +'<td style="text-align:center">'+fmt(g.gelen)+'</td>'
        +'<td style="text-align:center">'+fmt(g.kapanis)+'</td>'
        +'<td style="text-align:center">'+fmt(sayima)+'</td>'
        +'<td style="text-align:center">'+fmt(g.mallara_gore)+'</td>'
        +'<td style="text-align:center">'+fmt(g.zayi)+'</td>'
        +'<td style="text-align:center;'+fc+'">'+(fark!==0?(fark>0?'+':'')+fmt(fark):'')+'</td>'
        +'</tr>';
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    html+='<div style="background:#fff;border-radius:12px;margin-bottom:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.07)">'
      +'<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">'
      +'<span style="font-size:14px;font-weight:800">\uD83D\uDCE6 '+u.ad+'</span>'
      +'<span style="font-size:11px;color:rgba(255,255,255,0.6)">'+(u.birim||'')+' \xB7 '+uGirdiler.length+' g\xFCn</span></div>'
      +'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'
      +'<thead><tr style="background:#f5f5f5">'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">G\xDCN#</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">TAR\u0130H</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">A\xC7ILI\u015E</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">GELEN</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">KAPANI\u015E</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">SAYIMA</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">MALLARA</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">ZAY\u0130</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">FARK</th>'
      +'</tr></thead><tbody>'+satirlar+'</tbody>'
      +'<tfoot><tr style="background:#f0f4ff;font-weight:800;border-top:2px solid #e0e0e0">'
      +'<td colspan="8" style="padding:8px 12px;text-align:right;font-size:12px;color:#666">'
      +'TOPLAM FARK &nbsp;| <span style="color:#27ae60">+'+artiGun+' g\xFCn</span> <span style="color:#e74c3c"> -'+eksiGun+' g\xFCn</span></td>'
      +'<td style="padding:8px 10px;text-align:center;font-size:14px;color:'+toplamRenk+'">'+(toplamFark>0?'+':'')+fmt(toplamFark)+'</td>'
      +'</tr></tfoot></table></div></div>';
  });
  el.innerHTML=html;
}
async function aylikPdfAl(subeIdx,ay){
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('\u015Eube bulunamad\u0131');return;}
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([sb.from('urunler').select('*').eq('user_id',userId).order('sira'),sb.from('gunluk_girdiler').select('*').eq('user_id',userId)]);
  if(!urunler||!girdiler){toast('Veri al\u0131namad\u0131');return;}
  const ayGirdiler=girdiler.filter(function(g){return g.tarih&&g.tarih.startsWith(ay);});
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  const subeBilgi=profil.sube_adi||profil.email;
  let icerik='';
  urunler.forEach(function(u){
    const uGirdiler=ayGirdiler.filter(function(g){return g.urun_sira===u.sira;}).sort(function(a,b){return (a.gun||0)-(b.gun||0);});
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    var satirlar=uGirdiler.map(function(g,idx){
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const res=calcEntry(e);const sayima=res.sayima;const fark=res.fark;
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60':fark<0?'color:#e74c3c':'';
      return '<tr style="'+(idx%2?'background:#f9f9f9':'')+'">'
        +'<td>'+(g.gun||idx+1)+'</td><td>'+(g.tarih||'')+'</td>'
        +'<td>'+fmt(g.acilis)+'</td><td>'+fmt(g.gelen)+'</td>'
        +'<td>'+fmt(g.kapanis)+'</td><td>'+fmt(sayima)+'</td>'
        +'<td>'+fmt(g.mallara_gore)+'</td><td>'+fmt(g.zayi)+'</td>'
        +'<td style="font-weight:700;'+fc+'">'+(fark!==0?(fark>0?'+':'')+fmt(fark):'')+'</td></tr>';
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    icerik+='<div class="urun-blok">'
      +'<div class="urun-baslik">\uD83D\uDCE6 '+u.ad+' <span class="birim">'+(u.birim||'')+' &middot; '+uGirdiler.length+' g\xFCn</span></div>'
      +'<table><thead><tr><th>G\xDCN#</th><th>TAR\u0130H</th><th>A\xC7ILI\u015E</th><th>GELEN</th><th>KAPANI\u015E</th><th>SAYIMA</th><th>MALLARA</th><th>ZAY\u0130</th><th>FARK</th></tr></thead>'
      +'<tbody>'+satirlar+'</tbody>'
      +'<tfoot><tr class="toplam-row"><td colspan="8" style="text-align:right">TOPLAM FARK &middot; <span style="color:#27ae60">+'+artiGun+' g\xFCn</span> <span style="color:#e74c3c"> -'+eksiGun+' g\xFCn</span></td>'
      +'<td style="color:'+toplamRenk+';font-weight:800;font-size:13px">'+(toplamFark>0?'+':'')+fmt(toplamFark)+'</td></tr></tfoot>'
      +'</table></div>';
  });
  var html='<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Ayl\u0131k Rapor - '+subeBilgi+' - '+monthName+'</title><style>'
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Arial,sans-serif;font-size:9px;color:#222;background:#fff}'
    +'.header{background:#1a1a2e;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}'
    +'.header h1{font-size:16px;color:#e85d04}'
    +'.header .meta{font-size:10px;color:rgba(255,255,255,0.6)}'
    +'.urun-blok{margin:0 8px 16px;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;page-break-inside:avoid}'
    +'.urun-baslik{background:#1a1a2e;color:#fff;padding:7px 12px;font-size:12px;font-weight:800}'
    +'.birim{font-size:9px;color:rgba(255,255,255,0.5);font-weight:400}'
    +'table{width:100%;border-collapse:collapse}'
    +'th{background:#f0f0f0;padding:4px 6px;text-align:center;font-size:8px;color:#666;font-weight:700;border-bottom:2px solid #ddd}'
    +'td{padding:3px 6px;text-align:center;border-bottom:1px solid #eee;font-size:9px}'
    +'.toplam-row{background:#f5f8ff;border-top:2px solid #ddd;font-weight:700}'
    +'.footer{margin:16px 8px 8px;font-size:8px;color:#aaa;border-top:1px solid #eee;padding-top:6px;display:flex;justify-content:space-between}'
    +'@media print{@page{size:A4 portrait;margin:0.5cm}body{font-size:8px}.urun-blok{page-break-inside:avoid}}'
    +'</style></head><body>'
    +'<div class="header"><div><h1>Ayl\u0131k Envanter Raporu</h1><div class="meta">'+subeBilgi+' &middot; '+monthName+'</div></div>'
    +'<div style="font-size:9px;color:rgba(255,255,255,0.4)">Ercan BRGR | YPC.TECNO</div></div>'
    +icerik
    +'<div class="footer"><span>Ercan BRGR Envanter Sistemi \u2014 YPC.TECNO | Ufuk Yap\u0131c\u0131</span><span>Olu\u015Fturuldu: '+new Date().toLocaleString('tr-TR')+'</span></div>'
    +'</body></html>';
  pdfAc(html);
}

async function renderAdminAylikRapor(){
  const pc=document.getElementById('page-content');
  const now=new Date();
  const defaultAy=now.toISOString().slice(0,7);
  const profiller=adminData?.profiller||[];
  const subeOptions=profiller.map((p,i)=>'<option value="'+i+'">'+(p.sube_adi||p.email)+'</option>').join('');
  pc.innerHTML='<div style="padding:4px 0 16px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#e85d04">\u2190</button><h2 style="margin:0;font-size:18px">\uD83D\uDCCA Ayl\u0131k Rapor</h2></div><div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08)"><div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end"><div><label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">\u015EUBE</label><select id="aylik-sube" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none">'+subeOptions+'</select></div><div><label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">AY</label><input type="month" id="aylik-ay" value="'+defaultAy+'" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none"></div><button onclick="aylikRaporGoster()" style="padding:11px 18px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap">G\xF6ster \u2192</button></div></div><div id="aylik-rapor-icerik"></div></div>';
}
async function aylikRaporGoster(){
  const subeIdx=parseInt(document.getElementById('aylik-sube')?.value)||0;
  const ay=document.getElementById('aylik-ay')?.value;
  if(!ay){toast('Ay se\xE7in');return;}
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('\u015Eube bulunamad\u0131');return;}
  const el=document.getElementById('aylik-rapor-icerik');
  el.innerHTML='<div style="text-align:center;padding:30px;color:#aaa">\u23F3 Y\xFCkleniyor...</div>';
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([sb.from('urunler').select('*').eq('user_id',userId).order('sira'),sb.from('gunluk_girdiler').select('*').eq('user_id',userId)]);
  if(!urunler||!girdiler){el.innerHTML='<div style="color:#e74c3c;padding:20px">Veri al\u0131namad\u0131.</div>';return;}
  const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
  if(!ayGirdiler.length){el.innerHTML='<div style="background:#fff;border-radius:12px;padding:30px;text-align:center;color:#aaa">Bu ay i\xE7in veri bulunamad\u0131.</div>';return;}
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  const subeBilgi=profil.sube_adi||profil.email;
  let html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px"><div style="font-size:15px;font-weight:700;color:#1a1a2e">\uD83D\uDCCA '+subeBilgi+' \u2014 '+monthName+'</div><button onclick="aylikPdfAl('+subeIdx+',\''+ay+'\')" style="padding:9px 16px;background:#27ae60;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">\uD83D\uDCCB PDF Al</button></div>';
  urunler.forEach(function(u){
    const uGirdiler=ayGirdiler.filter(function(g){return g.urun_sira===u.sira;}).sort(function(a,b){return (a.gun||0)-(b.gun||0);});
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    var satirlar=uGirdiler.map(function(g,idx){
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const res=calcEntry(e);const sayima=res.sayima;const fark=res.fark;
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60;font-weight:700':fark<0?'color:#e74c3c;font-weight:700':'color:#999';
      return '<tr style="'+(idx%2?'background:#f9f9f9':'')+'">'
        +'<td style="text-align:center;color:#999;font-size:11px">'+(g.gun||idx+1)+'</td>'
        +'<td style="text-align:center;font-size:11px">'+(g.tarih||'')+'</td>'
        +'<td style="text-align:center">'+fmt(g.acilis)+'</td>'
        +'<td style="text-align:center">'+fmt(g.gelen)+'</td>'
        +'<td style="text-align:center">'+fmt(g.kapanis)+'</td>'
        +'<td style="text-align:center">'+fmt(sayima)+'</td>'
        +'<td style="text-align:center">'+fmt(g.mallara_gore)+'</td>'
        +'<td style="text-align:center">'+fmt(g.zayi)+'</td>'
        +'<td style="text-align:center;'+fc+'">'+(fark!==0?(fark>0?'+':'')+fmt(fark):'')+'</td>'
        +'</tr>';
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    html+='<div style="background:#fff;border-radius:12px;margin-bottom:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.07)">'
      +'<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">'
      +'<span style="font-size:14px;font-weight:800">\uD83D\uDCE6 '+u.ad+'</span>'
      +'<span style="font-size:11px;color:rgba(255,255,255,0.6)">'+(u.birim||'')+' \xB7 '+uGirdiler.length+' g\xFCn</span></div>'
      +'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">'
      +'<thead><tr style="background:#f5f5f5">'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">G\xDCN#</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">TAR\u0130H</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">A\xC7ILI\u015E</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">GELEN</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">KAPANI\u015E</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">SAYIMA</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">MALLARA</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">ZAY\u0130</th>'
      +'<th style="padding:6px 8px;font-size:10px;color:#999">FARK</th>'
      +'</tr></thead><tbody>'+satirlar+'</tbody>'
      +'<tfoot><tr style="background:#f0f4ff;font-weight:800;border-top:2px solid #e0e0e0">'
      +'<td colspan="8" style="padding:8px 12px;text-align:right;font-size:12px;color:#666">'
      +'TOPLAM FARK &nbsp;| <span style="color:#27ae60">+'+artiGun+' g\xFCn</span> <span style="color:#e74c3c"> -'+eksiGun+' g\xFCn</span></td>'
      +'<td style="padding:8px 10px;text-align:center;font-size:14px;color:'+toplamRenk+'">'+(toplamFark>0?'+':'')+fmt(toplamFark)+'</td>'
      +'</tr></tfoot></table></div></div>';
  });
  el.innerHTML=html;
}
async function aylikPdfAl(subeIdx,ay){
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('\u015Eube bulunamad\u0131');return;}
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([sb.from('urunler').select('*').eq('user_id',userId).order('sira'),sb.from('gunluk_girdiler').select('*').eq('user_id',userId)]);
  if(!urunler||!girdiler){toast('Veri al\u0131namad\u0131');return;}
  const ayGirdiler=girdiler.filter(function(g){return g.tarih&&g.tarih.startsWith(ay);});
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  const subeBilgi=profil.sube_adi||profil.email;
  let icerik='';
  urunler.forEach(function(u){
    const uGirdiler=ayGirdiler.filter(function(g){return g.urun_sira===u.sira;}).sort(function(a,b){return (a.gun||0)-(b.gun||0);});
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    var satirlar=uGirdiler.map(function(g,idx){
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const res=calcEntry(e);const sayima=res.sayima;const fark=res.fark;
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60':fark<0?'color:#e74c3c':'';
      return '<tr style="'+(idx%2?'background:#f9f9f9':'')+'">'
        +'<td>'+(g.gun||idx+1)+'</td><td>'+(g.tarih||'')+'</td>'
        +'<td>'+fmt(g.acilis)+'</td><td>'+fmt(g.gelen)+'</td>'
        +'<td>'+fmt(g.kapanis)+'</td><td>'+fmt(sayima)+'</td>'
        +'<td>'+fmt(g.mallara_gore)+'</td><td>'+fmt(g.zayi)+'</td>'
        +'<td style="font-weight:700;'+fc+'">'+(fark!==0?(fark>0?'+':'')+fmt(fark):'')+'</td></tr>';
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    icerik+='<div class="urun-blok">'
      +'<div class="urun-baslik">\uD83D\uDCE6 '+u.ad+' <span class="birim">'+(u.birim||'')+' &middot; '+uGirdiler.length+' g\xFCn</span></div>'
      +'<table><thead><tr><th>G\xDCN#</th><th>TAR\u0130H</th><th>A\xC7ILI\u015E</th><th>GELEN</th><th>KAPANI\u015E</th><th>SAYIMA</th><th>MALLARA</th><th>ZAY\u0130</th><th>FARK</th></tr></thead>'
      +'<tbody>'+satirlar+'</tbody>'
      +'<tfoot><tr class="toplam-row"><td colspan="8" style="text-align:right">TOPLAM FARK &middot; <span style="color:#27ae60">+'+artiGun+' g\xFCn</span> <span style="color:#e74c3c"> -'+eksiGun+' g\xFCn</span></td>'
      +'<td style="color:'+toplamRenk+';font-weight:800;font-size:13px">'+(toplamFark>0?'+':'')+fmt(toplamFark)+'</td></tr></tfoot>'
      +'</table></div>';
  });
  var html='<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Ayl\u0131k Rapor - '+subeBilgi+' - '+monthName+'</title><style>'
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{font-family:Arial,sans-serif;font-size:9px;color:#222;background:#fff}'
    +'.header{background:#1a1a2e;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}'
    +'.header h1{font-size:16px;color:#e85d04}'
    +'.header .meta{font-size:10px;color:rgba(255,255,255,0.6)}'
    +'.urun-blok{margin:0 8px 16px;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;page-break-inside:avoid}'
    +'.urun-baslik{background:#1a1a2e;color:#fff;padding:7px 12px;font-size:12px;font-weight:800}'
    +'.birim{font-size:9px;color:rgba(255,255,255,0.5);font-weight:400}'
    +'table{width:100%;border-collapse:collapse}'
    +'th{background:#f0f0f0;padding:4px 6px;text-align:center;font-size:8px;color:#666;font-weight:700;border-bottom:2px solid #ddd}'
    +'td{padding:3px 6px;text-align:center;border-bottom:1px solid #eee;font-size:9px}'
    +'.toplam-row{background:#f5f8ff;border-top:2px solid #ddd;font-weight:700}'
    +'.footer{margin:16px 8px 8px;font-size:8px;color:#aaa;border-top:1px solid #eee;padding-top:6px;display:flex;justify-content:space-between}'
    +'@media print{@page{size:A4 portrait;margin:0.5cm}body{font-size:8px}.urun-blok{page-break-inside:avoid}}'
    +'</style></head><body>'
    +'<div class="header"><div><h1>Ayl\u0131k Envanter Raporu</h1><div class="meta">'+subeBilgi+' &middot; '+monthName+'</div></div>'
    +'<div style="font-size:9px;color:rgba(255,255,255,0.4)">Ercan BRGR | YPC.TECNO</div></div>'
    +icerik
    +'<div class="footer"><span>Ercan BRGR Envanter Sistemi \u2014 YPC.TECNO | Ufuk Yap\u0131c\u0131</span><span>Olu\u015Fturuldu: '+new Date().toLocaleString('tr-TR')+'</span></div>'
    +'</body></html>';
  pdfAc(html);
}

function pdfAc(html){const w=window.open('','_blank');if(w){w.document.open();w.document.write(html);w.document.close();w.onload=()=>setTimeout(()=>w.print(),300);}else{const blob=new Blob([html],{type:'text/html;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.target='_blank';document.body.appendChild(a);a.click();setTimeout(()=>document.body.removeChild(a),500);}}
function gunlukPdfIndir(){const bugun=new Date().toISOString().slice(0,10);const tarih=prompt('Rapor tarihi (YYYY-AA-GG):',bugun);if(!tarih)return;const products=appData.products||[];const subeBilgi=document.getElementById('drawer-sube-info')?.textContent||'';let rows='';let ozet={arti:0,eksi:0,notr:0,girilmemis:0};products.forEach(p=>{const e=p.entries&&p.entries.find(e=>e.tarih===tarih);if(!e){ozet.girilmemis++;rows+=`<tr style="background:#fff9f0"><td style="text-align:left;color:#999">${p.name}</td><td style="color:#999">${p.birim||'—'}</td><td colspan="7" style="color:#ccc;font-style:italic">Giriş yapılmadı</td></tr>`;return;}const{sayima,fark}=calcEntry(e);const fc=fark>0?'color:#27ae60;font-weight:800':fark<0?'color:#e74c3c;font-weight:800':'color:#999';if(fark>0)ozet.arti++;else if(fark<0)ozet.eksi++;else ozet.notr++;rows+=`<tr><td style="text-align:left;font-weight:600">${p.name}</td><td>${p.birim||'—'}</td><td>${fmt(e.acilis)}</td><td>${fmt(e.gelen)}</td><td>${fmt(e.kapanis)}</td><td>${fmt(sayima)}</td><td>${e.mallara??''}</td><td>${e.zayi??''}</td><td style="${fc}">${e.acilis!==undefined||e.kapanis!==undefined?(fark>0?'+':'')+fark:''}</td></tr>`;});const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Günlük Rapor - ${tarih}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:9px;color:#222;margin:0.7cm}h1{font-size:14px;color:#e85d04;margin:0 0 2px}h2{font-size:10px;color:#555;font-weight:400;margin:0 0 10px}.ozet{display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap}.oz{padding:5px 12px;border-radius:6px;font-size:9px;text-align:center;border:1px solid #eee}.oz b{display:block;font-size:15px;font-weight:800}table{width:100%;border-collapse:collapse}th{background:#1a1a2e;color:#fff;padding:4px 6px;text-align:center;font-size:8px}th:first-child{text-align:left}td{padding:3px 6px;text-align:center;border-bottom:1px solid #eee}td:first-child{text-align:left}tr:nth-child(even):not([style]){background:#f9f9f9}.footer{margin-top:8px;font-size:8px;color:#bbb;border-top:1px solid #eee;padding-top:5px;display:flex;justify-content:space-between}@media print{@page{size:A4 portrait;margin:0.7cm}}</style></head><body><h1>📋 Günlük Envanter Raporu</h1><h2>⚙️ ${tarih} | ${subeBilgi}</h2><div class="ozet"><div class="oz" style="border-color:#27ae60"><b style="color:#27ae60">${ozet.arti}</b>Fazla</div><div class="oz" style="border-color:#e74c3c"><b style="color:#e74c3c">${ozet.eksi}</b>Eksik</div><div class="oz"><b style="color:#999">${ozet.notr}</b>Sıfır</div><div class="oz" style="border-color:#f0a500"><b style="color:#f0a500">${ozet.girilmemis}</b>Girilmemiş</div></div><table><thead><tr><th>Ürün</th><th>Birim</th><th>Açılış</th><th>Gelen</th><th>Kapanış</th><th>Sayıma</th><th>Mallara</th><th>Zayi</th><th>FARK</th></tr></thead><tbody>${rows}</tbody></table><div class="footer"><span>Ercan BRGR Envanter — YPC.TECNO</span><span>Oluşturuldu: ${new Date().toLocaleString('tr-TR')}</span></div></body></html>`;pdfAc(html);}
function printUrunRaporu(){const p=appData.products[currentProduct];if(!p){toast('Önce bir ürün seçin');return;}const doFilter=selectedMonth&&selectedMonth!=='tumu';const entries=doFilter?p.entries.filter(e=>e.tarih&&e.tarih.startsWith(selectedMonth)):p.entries;const birim=p.birim||'Adet';const stats=getStats(entries);const ayLabel=doFilter?monthLabel(selectedMonth):'Tüm Aylar';const profil=document.getElementById('drawer-sube-info').textContent||'';const fireTL=p.birimFiyat>0&&stats.totalFark<0?'? '+(Math.round(Math.abs(stats.totalFark)*p.birimFiyat*100)/100)+'? kayıp':'';let rows='';entries.forEach(e=>{const{sayima,fark}=calcEntry(e);const fc=fark>0?'color:#27ae60':fark<0?'color:#e74c3c':'color:#999';rows+=`<tr><td>${e.gun||''}</td><td>${e.tarih||''}</td><td>${e.acilis||''}</td><td>${e.gelen||''}</td><td>${e.kapanis||''}</td><td>${sayima}</td><td>${e.mallara||''}</td><td>${e.zayi||''}</td><td style="font-weight:800;${fc}">${e.acilis!==''||e.kapanis!==''?(fark>0?'+':'')+fark:''}</td><td style="font-size:10px;color:#888">${e.not||''}</td></tr>`;});const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${p.name} - ${ayLabel}</title><style>body{font-family:Arial,sans-serif;font-size:11px;color:#333;margin:1cm}h1{font-size:16px;color:#e85d04;margin-bottom:4px}h2{font-size:12px;color:#666;margin-bottom:12px;font-weight:400}table{width:100%;border-collapse:collapse;margin-bottom:16px}th{background:#1a1a2e;color:#fff;padding:6px 8px;text-align:center;font-size:10px}td{padding:5px 8px;text-align:center;border-bottom:1px solid #eee}tr:nth-child(even){background:#f9f9f9}.stat-box{display:inline-block;background:#f5f5f5;padding:8px 14px;border-radius:6px;margin-right:8px;margin-bottom:10px;border-left:3px solid #e85d04}.stat-label{font-size:9px;color:#999;text-transform:uppercase}.stat-val{font-size:18px;font-weight:800;color:#1a1a2e}.footer{margin-top:16px;font-size:9px;color:#bbb;border-top:1px solid #eee;padding-top:8px}@media print{@page{size:A4 landscape;margin:1cm}}</style></head><body><h1>📦 ${p.name}</h1><h2>${profil} &nbsp;|&nbsp; ${ayLabel} &nbsp;|&nbsp; ${birim}</h2><div><div class="stat-box"><div class="stat-label">Toplam Gün</div><div class="stat-val">${entries.length}</div></div><div class="stat-box"><div class="stat-label">${ayLabel} Fark</div><div class="stat-val" style="color:${stats.totalFark>0?'#27ae60':stats.totalFark<0?'#e74c3c':'#999'}">${stats.totalFark>0?'+':''}${fmt(stats.totalFark)||'0'} ${birim}</div></div><div class="stat-box"><div class="stat-label">+ / - Gün</div><div class="stat-val"><span style="color:#27ae60">+${stats.posCount}</span> / <span style="color:#e74c3c">${stats.negCount}</span></div></div>${fireTL?'<div class="stat-box"><div class="stat-label">Fire Maliyet</div><div class="stat-val" style="color:#e74c3c">'+fireTL+'</div></div>':''}</div><table><thead><tr><th>Gün #</th><th>Tarih</th><th>Açılış (${birim})</th><th>Gelen</th><th>Kapanış (${birim})</th><th>Sayıma Göre</th><th>Mallara Göre</th><th>Zayi</th><th>FARK</th><th>Not</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">Ercan BRGR Envanter — ${new Date().toLocaleString('tr-TR')}</div></body></html>`;pdfAc(html);}
async function setMinStok(){const p=appData.products[currentProduct];const val=prompt(`${p.name} için minimum stok uyarı seviyesi (${p.birim}):\n(Kapanış bu seviyenin altına düşünce uyarı verir. Boş bırakırsanız uyarı kapatılır)`,p.minStok??'');if(val===null)return;const v=val.trim()===''?null:parseFloat(val);p.minStok=v;await syncMinStok(p.sira,v);renderSidebar();renderPage();toast(v===null?'Uyarı kapatıldı':`Min stok ${v} ${p.birim} olarak ayarlandı ?`);}
async function syncBirim(sira,birim){await sb.from('urunler').update({birim}).eq('user_id',currentUser.id).eq('sira',sira);}
async function syncProductName(sira,ad){await sb.from('urunler').update({ad}).eq('user_id',currentUser.id).eq('sira',sira);}
function toggleAddForm(){showAddForm=!showAddForm;renderPage();if(showAddForm){setTimeout(()=>{const el=document.getElementById('add-form');if(el)el.scrollIntoView({behavior:'smooth'})},50);}}
async function updateGunNo(tarih){if(!tarih)return;const ay=tarih.slice(0,7);const p=appData.products[currentProduct];if(!p)return;const sayisi=p.entries.filter(e=>e.tarih&&e.tarih.startsWith(ay)).length;const el=document.getElementById('f-gun');if(el)el.value=sayisi+1;}
async function addEntry(){const v=x=>document.getElementById(x)?.value||'';const p=appData.products[currentProduct];const entry={gun:v('f-gun'),tarih:v('f-tarih'),acilis:v('f-acilis'),gelen:v('f-gelen'),gelenIade:v('f-gelenIade'),transfer:v('f-transfer'),kapanis:v('f-kapanis'),mallara:v('f-mallara'),zayi:v('f-zayi'),odenmez:v('f-odenmez'),not:v('f-not')};p.entries.push(entry);showAddForm=false;renderSidebar(document.getElementById('search-input').value);renderPage();await syncEntry(p.entries.length-1);toast('Kaydedildi ✅');}
async function updateEntry(idx,field,val){const p=appData.products[currentProduct];const e=p.entries[idx];const bugun=new Date().toISOString().slice(0,10);const buAy=bugun.slice(0,7);const eAy=e.tarih?e.tarih.slice(0,7):'';const gunAcik=e.tarih&&acikGunler.has(e.tarih);if(!isAdmin&&!gunAcik&&eAy&&eAy<buAy){toast('🔒 Geçmiş ay kapandı! Değiştirilemez. Admin açabilir.',3000);renderPage();return;}p.entries[idx][field]=val;renderPage();scheduleSave(idx);}
async function deleteEntry(idx){if(!isAdmin){toast('🔒 Silme yetkisi sadece adminde!',3000);return;}const p=appData.products[currentProduct];const e=p.entries[idx];const ay=e.tarih?e.tarih.slice(0,7):'';const buAy=new Date().toISOString().slice(0,7);if(ay&&ay<buAy){toast('⚠️ Geçmiş ay verileri silinemez!',3000);return;}if(!confirm(`⚠️ ADMİN UYARISI\n\n"${p.name}" ürününün ${e.tarih||'?'} tarihli kaydı silinecek!\n\nBu işlem geri alınamaz. Emin misiniz?`))return;if(e.dbId){const{error}=await sb.from('gunluk_girdiler').delete().eq('id',e.dbId);if(error){toast('Silme hatası');return;}}p.entries.splice(idx,1);renderSidebar(document.getElementById('search-input').value);renderPage();toast('Silindi ✅');}
async function saveBirim(){const p=appData.products[currentProduct];p.birim=document.getElementById('topbar-birim').value;renderPage();await syncBirim(p.sira,p.birim);}
function openRenameModal(){if(!isAdmin){toast('⚠️ Ürün adı değiştirme yetkisi sadece adminde!',3000);return;}document.getElementById('rename-input').value=appData.products[currentProduct].name;document.getElementById('rename-modal').classList.add('show');setTimeout(()=>document.getElementById('rename-input').focus(),100);}
function closeRenameModal(){document.getElementById('rename-modal').classList.remove('show');}
async function confirmRename(){const v=document.getElementById('rename-input').value.trim();if(v){const p=appData.products[currentProduct];p.name=v;renderSidebar();renderPage();await syncProductName(p.sira,v);toast('Ürün adı güncellendi');}closeRenameModal();}
document.getElementById('rename-input').addEventListener('keydown',e=>{if(e.key==='Enter')confirmRename();if(e.key==='Escape')closeRenameModal();});
function exportData(){const p=appData.products[currentProduct];if(!p)return;const doFilter=selectedMonth&&selectedMonth!=='tumu';const entries=doFilter?p.entries.filter(e=>e.tarih&&e.tarih.startsWith(selectedMonth)):p.entries;if(!entries.length){toast('Bu dönemde giriş yok');return;}const ayLabel=doFilter?monthLabel(selectedMonth):'Tüm_Aylar';const esc=v=>{const s=String(v??'');return(s.includes(',')||s.includes('"'))?'"'+s.replace(/"/g,'""')+'"':s;};const cols=['Gun','Tarih','Acilis','Gelen','Gelen_Iade','Transfer','Kapanis','Sayima_Gore_Kullanilan','Mallara_Gore_Satilan','Zayi','Odenmez','FARK'];let csv=cols.join(';')+'\n';entries.forEach(e=>{const{sayima,fark}=calcEntry(e);csv+=[e.gun,e.tarih,e.acilis||0,e.gelen||0,e.gelenIade||0,e.transfer||0,e.kapanis||0,sayima,e.mallara||0,e.zayi||0,e.odenmez||0,fark].map(esc).join(';')+'\n';});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));a.download=(p.name+'_'+ayLabel).replace(/[\s\/\\:*?"<>|]/g,'_')+'.csv';a.click();toast('Excel dosyası indirildi ✅');}
let adminData={profiller:[],urunler:[],girdiler:[],skt:[]},adminSecilenSube=null,adminSecilenUrun=null;
async function renderAdminPanel(){currentProduct=-1;document.getElementById('product-name-display').textContent='Admin Paneli';const tsubAdm=document.getElementById('topbar-sub');if(tsubAdm)tsubAdm.textContent='Tüm şubeler';document.getElementById('page-content').innerHTML='<div class="empty"><div class="ico">📋</div><p>Şubeler yükleniyor...</p></div>';const{data:profiller,error}=await sb.from('sube_profiller').select('*');if(error){document.getElementById('page-content').innerHTML='<div class="empty"><p>Veri yüklenemedi: '+error.message+'</p></div>';return;}if(!profiller||!profiller.length){document.getElementById('page-content').innerHTML='<div class="empty"><div class="ico">📋</div><p>Henüz kayıtlı şube yok.</p></div>';return;}const{data:tumGirdiler,error:ge}=await sb.from('gunluk_girdiler').select('*');const{data:tumUrunler,error:ue}=await sb.from('urunler').select('*').order('sira');if(ge){toast('Girdiler yüklenemedi: '+ge.message,5000);}if(ue){toast('Ürünler yüklenemedi: '+ue.message,5000);}adminData={profiller,urunler:tumUrunler||[],girdiler:tumGirdiler||[]};adminSecilenSube=null;adminSecilenUrun=null;const{data:tumSkt}=await sb.from('skt_takip').select('*').order('son_tarih');adminData.skt=tumSkt||[];renderAdminAnaSayfa();}
function renderAdminSubeler(){const{profiller,urunler,girdiler}=adminData;const buAy=new Date().toISOString().slice(0,7);let html=`<div class="admin-panel"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h2 style="margin:0">🏪 Şubeler <span style="font-size:13px;color:#aaa;font-weight:400">(${profiller.length} şube)</span></h2></div>`;profiller.forEach(p=>{const pGirdiler=girdiler.filter(g=>g.user_id===p.user_id);const pUrunler=urunler.filter(u=>u.user_id===p.user_id);const buAyFark=r(pGirdiler.filter(g=>g.tarih&&g.tarih.startsWith(buAy)).reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));const topFark=r(pGirdiler.reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));const sonGiris=pGirdiler.filter(g=>g.tarih).sort((a,b)=>b.tarih.localeCompare(a.tarih))[0]?.tarih||'—';const fc=topFark>0?'s-green':topFark<0?'s-red':'';const fcAy=buAyFark>0?'#27ae60':buAyFark<0?'#e74c3c':'#aaa';html+=`<div class="sube-card-admin" onclick="adminAcSube('${p.user_id}')"><h3>⚙️ ${p.sube_adi} <span style="font-size:11px;color:#aaa;font-weight:400">→ tıkla</span></h3><div class="sube-stats"><div class="sube-stat">${pUrunler.length} ürün</div><div class="sube-stat">${pGirdiler.length} kayıt</div><div class="sube-stat" style="color:${fcAy}">Bu ay: ${buAyFark>0?'+':''}${buAyFark}</div><div class="sube-stat ${fc}">Toplam: ${topFark>0?'+':''}${topFark}</div><div class="sube-stat" style="color:#aaa">Son: ${sonGiris}</div></div><div style="margin-top:8px;display:flex;gap:6px" onclick="event.stopPropagation()"><button onclick="adminAcSube('${p.user_id}')" style="padding:5px 12px;background:var(--orange);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📊 Detay</button>${isSuperAdmin?`<button onclick="adminSubeAdiDegistir('${p.user_id}','${p.sube_adi.replace(/'/g,"&#39;")}')" style="padding:5px 12px;background:#3498db;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">✏️ Adı Düzenle</button>`:''} ${isSuperAdmin?`<button onclick="adminSubeSil('${p.user_id}','${p.sube_adi.replace(/'/g,"&#39;")}')" style="padding:5px 12px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">🗑 Sil</button>`:''}</div></div>`;});html+=`</div>`;document.getElementById('page-content').innerHTML=html;}
function renderAdminAnaSayfa(){
  const{profiller,urunler,girdiler}=adminData;
  // Genel istatistikler
  const bugun=new Date().toISOString().slice(0,10);
  const bugunGiris=girdiler.filter(g=>g.tarih===bugun).length;
  const buAy=new Date().toISOString().slice(0,7);
  const buAyGiris=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(buAy)).length;
  // En çok kayıp ürünler
  const urunFarklar={};
  girdiler.forEach(g=>{
    const key=g.user_id+'_'+g.urun_sira;
    const urun=urunler.find(u=>u.user_id===g.user_id&&u.sira===g.urun_sira);
    if(!urun)return;
    const f=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark;
    if(!urunFarklar[urun.ad])urunFarklar[urun.ad]=0;
    urunFarklar[urun.ad]+=f;
  });
  const topKayip=Object.entries(urunFarklar).filter(([,f])=>f<0).sort(([,a],[,b])=>a-b).slice(0,5);
  const topArtis=Object.entries(urunFarklar).filter(([,f])=>f>0).sort(([,a],[,b])=>b-a).slice(0,5);
  let html=`<div class="admin-panel">
  <h2>⚙️ Admin Paneli <span class="admin-badge">TÜM ŞUBELER</span></h2>
  <div class="admin-kart-grid">
    <button onclick="renderAdminSubeler()" class="admin-kart" style="background:linear-gradient(135deg,#e85d04,#f39c12)">
      <span class="kart-ikon">🏪</span><span class="kart-baslik">Şubeler</span><span class="kart-aciklama">Tüm şubeleri gör</span>
    </button>
    <button onclick="renderAdminUrunler()" class="admin-kart" style="background:linear-gradient(135deg,#e67e22,#f0a500)">
      <span class="kart-ikon">📦</span><span class="kart-baslik">Ürünler</span><span class="kart-aciklama">Ekle / Sil</span>
    </button>
    <button onclick="renderAdminAylikRapor()" class="admin-kart" style="background:linear-gradient(135deg,#1e293b,#334155)">
      <span class="kart-ikon">📊</span><span class="kart-baslik">Aylık Rapor</span><span class="kart-aciklama">Ay bazlı analiz</span>
    </button>
    <button onclick="renderAdminKarsilastirma()" class="admin-kart" style="background:linear-gradient(135deg,#0891b2,#06b6d4)">
      <span class="kart-ikon">📈</span><span class="kart-baslik">Karşılaştırma</span><span class="kart-aciklama">Şube karşılaştır</span>
    </button>
    <button onclick="adminTumExcel()" class="admin-kart" style="background:linear-gradient(135deg,#27ae60,#2ecc71)">
      <span class="kart-ikon">📥</span><span class="kart-baslik">Excel İndir</span><span class="kart-aciklama">Tüm veriyi aktar</span>
    </button>
    <button onclick="renderAdminSubeYonetimi()" class="admin-kart" style="background:linear-gradient(135deg,#0f766e,#0d9488)">
      <span class="kart-ikon">🏗️</span><span class="kart-baslik">Şube Yönetimi</span><span class="kart-aciklama">Düzenle / Yönet</span>
    </button>
    <button onclick="renderAdminYonetimi()" class="admin-kart" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">
      <span class="kart-ikon">👑</span><span class="kart-baslik">Admin Yönetimi</span><span class="kart-aciklama">Rol ata / kaldır</span>
    </button>
    <button onclick="renderAdminAylikRapor()" class="admin-kart" style="background:linear-gradient(135deg,#c0392b,#e74c3c)">
      <span class="kart-ikon">📄</span><span class="kart-baslik">PDF Rapor</span><span class="kart-aciklama">Şube & ürün yazdır</span>
    </button>
    ${isSuperAdmin?`<button onclick="renderSuperKullanicilar()" class="admin-kart" style="background:linear-gradient(135deg,#b91c1c,#dc2626)">
      <span class="kart-ikon">👥</span><span class="kart-baslik">Kullanıcılar</span><span class="kart-aciklama">Loglar & Mailleri</span>
    </button>`:''}
  </div>
  <div class="stats-row" style="margin-bottom:16px">
    <div class="stat-card orange"><div class="sl">Toplam Şube</div><div class="sv">${profiller.length}</div></div>
    <div class="stat-card"><div class="sl">Bugün Giriş</div><div class="sv">${bugunGiris}</div></div>
    <div class="stat-card"><div class="sl">Bu Ay Giriş</div><div class="sv">${buAyGiris}</div></div>
    <div class="stat-card"><div class="sl">Toplam Kayıt</div><div class="sv">${girdiler.length}</div></div>
  </div>
  ${(()=>{const allSkt=adminData.skt||[];const kritik=allSkt.filter(s=>sktGunFark(s.son_tarih)<=5);if(!kritik.length)return '';let shtml='<div style="background:#fff3cd;border:2px solid #ffc107;border-radius:10px;padding:10px 14px;margin-bottom:16px"><div style="font-weight:800;color:#856404;font-size:13px;margin-bottom:8px">? TÜM ŞUBLERDE SKT UYARILARI ('+kritik.length+')</div>';[...kritik].sort((a,b)=>a.son_tarih.localeCompare(b.son_tarih)).forEach(s=>{const p=adminData.profiller.find(pr=>pr.user_id===s.user_id);const g=sktGunFark(s.son_tarih);const c=g<0?'#e74c3c':g===0?'#e74c3c':g<=2?'#e67e22':'#856404';const badge=g<0?'SÜRESİ GEÇTİ':g===0?'BUGÜN!':g+' gün kaldı';shtml+='<div style="display:flex;align-items:center;padding:5px 0;border-bottom:1px solid #ffe8a1;gap:8px"><span style="color:#aaa;font-size:11px;min-width:90px">'+(p?.sube_adi||'?')+'</span><span style="font-weight:700;color:#333;flex:1">'+s.urun_adi+(s.miktar?' ('+s.miktar+')':'')+'</span><span style="color:'+c+';font-weight:700;font-size:11px">'+badge+'</span></div>';});shtml+='</div>';return shtml;})()}`;
  // En çok satan ürünler kaldırıldı
  // Kayıp/Artı Özeti
  if(topKayip.length||topArtis.length){
    html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
    <div style="background:#fff5f5;border:1px solid #fcc;border-radius:10px;padding:12px">
      <div style="font-size:12px;font-weight:700;color:#e74c3c;margin-bottom:8px">📉 En çok Kayıp ürünler</div>
      ${topKayip.map(([ad,f])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #fee"><span>${ad}</span><span style="color:#e74c3c;font-weight:700">${r(f)}</span></div>`).join('')}
    </div>
    <div style="background:#f0fff4;border:1px solid #9f9;border-radius:10px;padding:12px">
      <div style="font-size:12px;font-weight:700;color:#27ae60;margin-bottom:8px">📈 En çok Fazla Ürünler</div>
      ${topArtis.map(([ad,f])=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #dfd"><span>${ad}</span><span style="color:#27ae60;font-weight:700">+${r(f)}</span></div>`).join('')}
    </div></div>`;
  }
  html+=`<div style="font-size:12px;color:#999;margin-bottom:10px">${profiller.length} şube — şubeye tıklayın</div>`;
  profiller.forEach(p=>{
    const pGirdiler=girdiler.filter(g=>g.user_id===p.user_id);
    const pUrunler=urunler.filter(u=>u.user_id===p.user_id);
    const buAyFark=r(pGirdiler.filter(g=>g.tarih&&g.tarih.startsWith(buAy)).reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));
    const topFark=r(pGirdiler.reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));
    const sonGiris=pGirdiler.filter(g=>g.tarih).sort((a,b)=>b.tarih.localeCompare(a.tarih))[0]?.tarih||'?';
    const fc=topFark>0?'s-green':topFark<0?'s-red':'';
    const fcAy=buAyFark>0?'#27ae60':buAyFark<0?'#e74c3c':'#aaa';
    html+=`<div class="sube-card-admin" onclick="adminAcSube('${p.user_id}')">
      <h3>⚙️ ${p.sube_adi} <span style="font-size:11px;color:#aaa;font-weight:400">→ tıkla</span></h3>
      <div class="sube-stats">
        <div class="sube-stat">${pUrunler.length} ürün</div>
        <div class="sube-stat">${pGirdiler.length} kayıt</div>
        <div class="sube-stat" style="color:${fcAy}">Bu ay: ${buAyFark>0?'+':''}${buAyFark}</div>
        <div class="sube-stat ${fc}">Toplam: ${topFark>0?'+':''}${topFark}</div>
        <div class="sube-stat" style="color:#aaa">Son: ${sonGiris}</div>
      </div>
      <div style="margin-top:8px;display:flex;gap:6px" onclick="event.stopPropagation()">
        <button onclick="adminAcSube('${p.user_id}')" style="padding:5px 12px;background:var(--orange);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📊 Detay</button>
        ${isSuperAdmin?`<button onclick="adminSubeAdiDegistir('${p.user_id}','${p.sube_adi.replace(/'/g,'&#39;')}')" style="padding:5px 12px;background:#3498db;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">✏️ Adı Düzenle</button>`:''}
        ${isSuperAdmin?`<button onclick="adminSubeSil('${p.user_id}','${p.sube_adi.replace(/'/g,"&#39;")}')" style="padding:5px 12px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">🗑 Sil</button>`:''}
      </div>
    </div>`;
  });
  html+=`</div>`;
  document.getElementById('page-content').innerHTML=html;
}
function adminAcSube(userId){adminSecilenSube=userId;adminSecilenUrun=null;const profil=adminData.profiller.find(p=>p.user_id===userId);const urunler=adminData.urunler.filter(u=>u.user_id===userId);const girdiler=adminData.girdiler.filter(g=>g.user_id===userId);const bugun=new Date().toISOString().slice(0,10);const gunler=[...new Set(girdiler.filter(g=>g.tarih).map(g=>g.tarih))].sort().reverse();let html=`<div class="admin-panel"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="background:var(--dark);color:#fff;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;font-weight:700">← Geri</button><h2 style="margin:0;flex:1">🏪 ${profil?.sube_adi||'Şube'}</h2><div style="display:flex;gap:6px;align-items:center"><select id="admin-gun-sec" style="padding:7px 10px;border:2px solid #eee;border-radius:8px;font-size:12px"><option value="${bugun}">Bugün (${bugun})</option>${gunler.filter(g=>g!==bugun).map(g=>`<option value="${g}">${g}</option>`).join('')}</select><button onclick="adminSubeGunPdf('${userId}')" style="padding:8px 12px;background:#c0392b;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">📋 Günlük PDF</button><button onclick="adminGunYonetimi('${userId}')" style="padding:8px 12px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">📅 Günleri Yönet</button></div></div><div style="font-size:12px;color:#999;margin-bottom:12px">${urunler.length} ürün — bir ürüne tıklayarak tüm girişleri görün</div>`;urunler.forEach(u=>{const uGirdiler=girdiler.filter(g=>g.urun_sira===u.sira);let toplamFark=0;uGirdiler.forEach(g=>{const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};toplamFark+=calcEntry(e).fark;});toplamFark=r(toplamFark);const fc=toplamFark>0?'s-green':toplamFark<0?'s-red':'';const bugunG=uGirdiler.find(g=>g.tarih===bugun);const bugunFark=bugunG?calcEntry({acilis:bugunG.acilis,gelen:bugunG.gelen,gelenIade:bugunG.gelen_iade,transfer:bugunG.transfer,kapanis:bugunG.kapanis,mallara:bugunG.mallara_gore,zayi:bugunG.zayi,odenmez:bugunG.odenmez}).fark:null;const bfc=bugunFark===null?'':bugunFark>0?'color:#27ae60':bugunFark<0?'color:#e74c3c':'color:#999';html+=`<div class="sube-card-admin" onclick="adminAcUrun('${userId}',${u.sira})"><h3>${u.sira+1}. ${u.ad} <span style="font-size:10px;color:#aaa">(${u.birim})</span></h3><div class="sube-stats"><div class="sube-stat">${uGirdiler.length} gün kayıt</div>${bugunFark!==null?`<div class="sube-stat" style="${bfc}">Bugün: ${bugunFark>0?'+':''}${bugunFark}</div>`:''}<div class="sube-stat ${fc}">${toplamFark>0?'+':''}${toplamFark} toplam</div></div></div>`;});html+=`</div>`;document.getElementById('page-content').innerHTML=html;}
async function adminGunYonetimi(userId){const profil=adminData.profiller.find(p=>p.user_id===userId);const girdiler=adminData.girdiler.filter(g=>g.user_id===userId);const gunler=[...new Set(girdiler.filter(g=>g.tarih).map(g=>g.tarih))].sort().reverse();const bugun=new Date().toISOString().slice(0,10);const gecmisGunler=gunler.filter(g=>g<bugun);const{data:aciklar}=await sb.from('acik_gunler').select('tarih').eq('user_id',userId);const acikSet=new Set((aciklar||[]).map(r=>r.tarih));let html=`<div class="admin-panel"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button onclick="adminAcSube('${userId}')" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h2 style="margin:0">🔒 Gün Kilidi — ${profil?.sube_adi||'Şube'}</h2></div>`;if(!gecmisGunler.length){html+=`<div style="color:#aaa;font-size:13px">Henüz geçmiş gün kaydı yok.</div>`;}else{html+=`<div style="font-size:12px;color:#666;margin-bottom:12px;background:#f0f4ff;padding:10px;border-radius:8px">ℹ️ Kilitli günler değiştirilemez. Açık günleri şube düzenleyebilir. İşiniz bitince tekrar kilitleyin.</div>`;gecmisGunler.forEach(g=>{const acik=acikSet.has(g);html+=`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border:2px solid ${acik?'#27ae60':'#eee'};border-radius:10px;margin-bottom:8px;background:${acik?'#f0fff4':'#fff'}"><div><span style="font-weight:700;font-size:14px">${g}</span><span style="margin-left:10px;font-size:12px;color:${acik?'#27ae60':'#aaa'}">${acik?'✅ Açık — düzenlenebilir':'🔒 Kilitli'}</span></div><button onclick="adminToggleGun('${userId}','${g}',${acik})" style="padding:7px 16px;background:${acik?'#e74c3c':'#27ae60'};color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">${acik?'🔒 Kilitle':'✅ Aç'}</button></div>`;});} html+=`</div>`;document.getElementById('page-content').innerHTML=html;}
async function adminToggleGun(userId,tarih,acikMi){if(acikMi){const{error}=await sb.from('acik_gunler').delete().eq('user_id',userId).eq('tarih',tarih);if(error){toast('Hata: '+error.message,4000);return;}toast('🔒 '+tarih+' kilitlendi');}else{const{error}=await sb.from('acik_gunler').insert({user_id:userId,tarih,acik_yapan:currentUser?.email||'admin'});if(error){toast('Hata: '+error.message,4000);return;}toast('🔒 '+tarih+' açıldı — şube düzenleyebilir');}adminGunYonetimi(userId);}
function adminSubeGunPdf(userId){const tarih=document.getElementById('admin-gun-sec')?.value||new Date().toISOString().slice(0,10);const profil=adminData.profiller.find(p=>p.user_id===userId);const urunler=adminData.urunler.filter(u=>u.user_id===userId);const girdiler=adminData.girdiler.filter(g=>g.user_id===userId&&g.tarih===tarih);if(!girdiler.length){toast('Bu tarihte giriş yok: '+tarih,3000);return;}let rows='';let ozet={artis:0,eksi:0,notr:0};urunler.forEach(u=>{const g=girdiler.find(g=>g.urun_sira===u.sira);if(!g)return;const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};const{sayima,fark}=calcEntry(e);const fc=fark>0?'color:#27ae60;font-weight:800':fark<0?'color:#e74c3c;font-weight:800':'color:#999';if(fark>0)ozet.artis++;else if(fark<0)ozet.eksi++;else ozet.notr++;rows+=`<tr><td style="text-align:left;font-weight:600">${u.ad}</td><td>${u.birim}</td><td>${g.acilis??''}</td><td>${g.gelen??''}</td><td>${g.kapanis??''}</td><td>${sayima}</td><td>${fmt(g.mallara_gore)}</td><td>${fmt(g.zayi)}</td><td style="${fc}">${fark>0?'+':''}${fmt(fark)||'0'}</td></tr>`;});const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${profil?.sube_adi} - ${tarih}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10px;color:#222;margin:0.8cm}h1{font-size:15px;color:#e85d04;margin:0 0 2px}h2{font-size:11px;color:#555;font-weight:400;margin:0 0 12px}.ozet{display:flex;gap:12px;margin-bottom:10px;flex-wrap:wrap}.oz{padding:6px 14px;border-radius:6px;font-size:10px;text-align:center;border:1px solid #eee}.oz b{display:block;font-size:16px;font-weight:800}table{width:100%;border-collapse:collapse}th{background:#1a1a2e;color:#fff;padding:5px 7px;text-align:center;font-size:9px}th:first-child{text-align:left}td{padding:4px 7px;text-align:center;border-bottom:1px solid #eee;font-size:9px}td:first-child{text-align:left}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:10px;font-size:8px;color:#bbb;border-top:1px solid #eee;padding-top:5px;display:flex;justify-content:space-between}@media print{@page{size:A4 portrait;margin:0.8cm}}</style></head><body><h1>📋 ${profil?.sube_adi||'Şube'} — Günlük Envanter Raporu</h1><h2>⚙️ ${tarih}</h2><div class="ozet"><div class="oz" style="border-color:#27ae60"><b style="color:#27ae60">${ozet.artis}</b>Fazla</div><div class="oz" style="border-color:#e74c3c"><b style="color:#e74c3c">${ozet.eksi}</b>Eksik</div><div class="oz"><b style="color:#999">${ozet.notr}</b>Sıfır</div></div><table><thead><tr><th>Ürün</th><th>Birim</th><th>Açılış</th><th>Gelen</th><th>Kapanış</th><th>Sayıma</th><th>Mallara</th><th>Zayi</th><th>FARK</th></tr></thead><tbody>${rows}</tbody></table><div class="footer"><span>Ercan BRGR Envanter — YPC.TECNO</span><span>Oluşturuldu: ${new Date().toLocaleString('tr-TR')}</span></div></body></html>`;pdfAc(html);}
function renderAdminAylikRapor(){const{profiller,urunler,girdiler}=adminData;const months=[...new Set(girdiler.filter(g=>g.tarih).map(g=>g.tarih.slice(0,7)))].sort().reverse();let html=`<div class="admin-panel"><div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h2 style="margin:0;align-self:center">📊 Aylık Rapor</h2></div>`;if(!months.length){html+=`<div class="empty"><div class="ico">📋</div><p>Henüz tarihli giriş yok.</p></div>`;}else{months.forEach(ay=>{const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));let toplamFark=0,toplamSatilan=0,toplamSayima=0;ayGirdiler.forEach(g=>{const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};const{sayima,fark}=calcEntry(e);toplamFark+=fark;toplamSatilan+=n(g.mallara_gore);toplamSayima+=sayima;});toplamFark=r(toplamFark);toplamSatilan=r(toplamSatilan);toplamSayima=r(toplamSayima);const subeSet=new Set(ayGirdiler.map(g=>g.user_id));const fc=toplamFark>0?'s-green':toplamFark<0?'s-red':'';html+=`<div class="sube-card-admin" style="cursor:default"><h3>⚙️ ${monthLabel(ay)}</h3><div class="sube-stats"><div class="sube-stat">${subeSet.size} şube aktif</div><div class="sube-stat">${ayGirdiler.length} giriş</div><div class="sube-stat">Satılan: ${toplamSatilan}</div><div class="sube-stat">Sayıma: ${toplamSayima}</div><div class="sube-stat ${fc}">${toplamFark>0?'+':''}${toplamFark} fark</div></div><div style="margin-top:8px;display:flex;gap:6px"><button onclick="adminAyCSV('${ay}')" style="padding:5px 12px;background:var(--orange);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📊 Excel İndir</button><button onclick="adminAyPdf('${ay}')" style="padding:5px 12px;background:#c0392b;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">📋 PDF Al</button></div></div>`;});}html+=`</div>`;document.getElementById('page-content').innerHTML=html;}
function adminAyCSV(ay){adminAyExcel(ay);}
function adminTumCSV(){adminTumExcel();}
function adminAyPdf(ay){const{profiller,urunler,girdiler}=adminData;const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));if(!ayGirdiler.length){toast('Bu ayda giriş yok');return;}const ayLab=monthLabel(ay);let icerik='';const subeler=[...new Set(ayGirdiler.map(g=>g.user_id))].map(id=>profiller.find(p=>p.user_id===id)).filter(Boolean);subeler.forEach(profil=>{const pUrunler=urunler.filter(u=>u.user_id===profil.user_id);const pGirdiler=ayGirdiler.filter(g=>g.user_id===profil.user_id);if(!pGirdiler.length)return;icerik+=`<div style="page-break-before:auto;margin-bottom:28px"><div style="background:#1a1a2e;color:#fff;padding:8px 14px;border-radius:8px 8px 0 0;font-size:13px;font-weight:800">🏪 ${profil.sube_adi}</div>`;pUrunler.forEach(urun=>{const uGirdiler=pGirdiler.filter(g=>g.urun_sira===urun.sira).sort((a,b)=>a.tarih>b.tarih?1:-1);if(!uGirdiler.length)return;let rows='';let topFark=0;uGirdiler.forEach(g=>{const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};const{sayima,fark}=calcEntry(e);topFark=r(topFark+fark);const fc=fark>0?'#27ae60':fark<0?'#e74c3c':'#999';rows+=`<tr><td style="color:#555">${g.tarih||''}</td><td>${g.acilis??''}</td><td>${g.gelen??''}</td><td>${g.kapanis??''}</td><td>${sayima}</td><td>${fmt(g.mallara_gore)}</td><td>${fmt(g.zayi)}</td><td style="font-weight:800;color:${fc}">${fark>0?'+':''}${fark}</td></tr>`;});const tfColor=topFark>0?'#27ae60':topFark<0?'#e74c3c':'#555';icerik+=`<div style="margin-bottom:14px;page-break-inside:avoid"><div style="display:flex;justify-content:space-between;align-items:center;background:#f8f4ff;border-left:4px solid #e85d04;padding:5px 10px;margin-top:10px"><span style="font-weight:800;font-size:11px;color:#1a1a2e">${urun.ad} <span style="font-weight:400;color:#aaa">(${urun.birim})</span></span><span style="font-size:10px;font-weight:800;color:${tfColor}">Toplam: ${topFark>0?'+':''}${topFark}</span></div><table><thead><tr><th>Tarih</th><th>Açılış</th><th>Gelen</th><th>Kapanış</th><th>Sayıma</th><th>Mallara</th><th>Zayi</th><th>FARK</th></tr></thead><tbody>${rows}</tbody></table></div>`;});icerik+=`</div>`;});const html=`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Rapor - ${ayLab}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:9px;color:#333;margin:1cm}h1{font-size:14px;color:#e85d04;margin:0 0 2px}h2{font-size:10px;color:#666;font-weight:400;margin:0 0 14px}table{width:100%;border-collapse:collapse;margin:0}th{background:#2d3748;color:#fff;padding:4px 6px;text-align:center;font-size:8px}th:first-child{text-align:left}td{padding:3px 6px;text-align:center;border-bottom:1px solid #f0f0f0;font-size:9px}td:first-child{text-align:left}tr:nth-child(even){background:#fafafa}.footer{margin-top:14px;font-size:8px;color:#bbb;border-top:1px solid #eee;padding-top:5px;display:flex;justify-content:space-between}@media print{@page{size:A4 portrait;margin:1cm}}</style></head><body><h1>📄 Admin Aylık Envanter Raporu — ${ayLab}</h1><h2>Tüm şubeler — Ürün bazlı, gün gün</h2>${icerik}<div class="footer"><span>Ercan BRGR Envanter — YPC.TECNO</span><span>Oluşturuldu: ${new Date().toLocaleString('tr-TR')}</span></div></body></html>`;pdfAc(html);}
function xlsxHdr(ws,row,cols){cols.forEach((v,c)=>{const ref=XLSX.utils.encode_cell({r:row,c});ws[ref]={v,t:'s',s:{font:{bold:true,color:{rgb:'FFFFFF'},sz:11},fill:{fgColor:{rgb:'E8590C'}},alignment:{horizontal:'center',wrapText:true},border:{bottom:{style:'thin',color:{rgb:'999999'}}}}}});if(!ws['!ref']){ws['!ref']=XLSX.utils.encode_range({s:{r:0,c:0},e:{r:row,c:cols.length-1}});}return row+1;}
function xlsxRow(ws,row,vals,isTotal){vals.forEach((v,c)=>{const ref=XLSX.utils.encode_cell({r:row,c});const isNum=typeof v==='number';const isFark=c===vals.length-1;const farkColor=isNum&&isFark?(v>0?'1E8449':v<0?'C0392B':'333333'):'333333';ws[ref]={v:v??'',t:isNum?'n':'s',s:{font:{bold:isTotal||false,color:{rgb:isFark?farkColor:'333333'},sz:10},fill:{fgColor:{rgb:isTotal?'FFF3CD':row%2===0?'FFFFFF':'F9F9F9'}},alignment:{horizontal:isNum?'center':'left'}}};});if(ws['!ref']){const r=XLSX.utils.decode_range(ws['!ref']);r.e.r=Math.max(r.e.r,row);r.e.c=Math.max(r.e.c,vals.length-1);ws['!ref']=XLSX.utils.encode_range(r);}return row+1;}
function adminAyExcel(ay){
  const{profiller,urunler,girdiler}=adminData;
  const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
  if(!ayGirdiler.length){toast('Bu ayda giriş yok');return;}
  const wb=XLSX.utils.book_new();
  const basliklar=['Şube','Ürün','Birim','Gün','Tarih','Açılış','Gelen','G.İade','Transfer','Kapanış','Sayıma Göre','Mallara Göre','Zayi','Ödenmez','FARK'];
  // Özet sayfası
  const ozWs={};let ozRow=0;
  ozRow=xlsxHdr(ozWs,ozRow,['Şube','Ürün','Toplam Fark','Gün Sayısı']);
  let ozTopFark=0;
  profiller.forEach(p=>{
    const pG=ayGirdiler.filter(g=>g.user_id===p.user_id);
    if(!pG.length)return;
    urunler.filter(u=>u.user_id===p.user_id).forEach(u=>{
      const uG=pG.filter(g=>g.urun_sira===u.sira);
      if(!uG.length)return;
      const fark=r(uG.reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));
      ozRow=xlsxRow(ozWs,ozRow,[p.sube_adi,u.ad,fark,uG.length]);
      ozTopFark+=fark;
    });
  });
  ozRow=xlsxRow(ozWs,ozRow,['','TOPLAM',r(ozTopFark),''],true);
  ozWs['!cols']=[{wch:20},{wch:22},{wch:14},{wch:10}];
  XLSX.utils.book_append_sheet(wb,ozWs,'ÖZET');
  // Her şube ayrı sayfa
  profiller.forEach(p=>{
    const pG=ayGirdiler.filter(g=>g.user_id===p.user_id);
    if(!pG.length)return;
    const ws={};let row=0;
    row=xlsxHdr(ws,row,basliklar);
    let topFark=0;
    pG.forEach(g=>{
      const urun=urunler.find(u=>u.user_id===p.user_id&&u.sira===g.urun_sira);
      const{sayima,fark}=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez});
      topFark+=fark;
      row=xlsxRow(ws,row,[p.sube_adi,urun?.ad||'',urun?.birim||'',g.gun,g.tarih,n(g.acilis),n(g.gelen),n(g.gelen_iade),n(g.transfer),n(g.kapanis),sayima,n(g.mallara_gore),n(g.zayi),n(g.odenmez),fark]);
    });
    row=xlsxRow(ws,row,['','','','','','','','','','','','','','TOPLAM FARK',r(topFark)],true);
    ws['!cols']=basliklar.map((_,i)=>({wch:[16,22,8,6,12,10,10,8,10,10,12,12,8,10,10][i]||10}));
    const sheetName=(p.sube_adi||'Sube').slice(0,31).replace(/[\/\\?*\[\]]/g,'');
    XLSX.utils.book_append_sheet(wb,ws,sheetName);
  });
  XLSX.writeFile(wb,`BRGR_${monthLabel(ay).replace(/\s/g,'_')}.xlsx`);
  toast('Excel indirildi ✅');
}
function adminTumExcel(){
  const{profiller,urunler,girdiler}=adminData;
  if(!girdiler.length){toast('Veri yok');return;}
  const months=[...new Set(girdiler.filter(g=>g.tarih).map(g=>g.tarih.slice(0,7)))].sort().reverse();
  if(months.length===1){adminAyExcel(months[0]);return;}
  const wb=XLSX.utils.book_new();
  const basliklar=['Şube','Ürün','Birim','Gün','Tarih','Açılış','Gelen','G.İade','Transfer','Kapanış','Sayıma Göre','Mallara Göre','Zayi','Ödenmez','FARK'];
  // Özet sayfası
  const ozWs={};let ozRow=0;
  ozRow=xlsxHdr(ozWs,ozRow,['Ay','Şube Sayısı','Toplam Giriş','Toplam Fark']);
  months.forEach(ay=>{
    const ayG=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
    const fark=r(ayG.reduce((s,g)=>s+calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark,0));
    const subeSet=new Set(ayG.map(g=>g.user_id));
    ozRow=xlsxRow(ozWs,ozRow,[monthLabel(ay),subeSet.size,ayG.length,fark]);
  });
  ozWs['!cols']=[{wch:16},{wch:12},{wch:14},{wch:14}];
  XLSX.utils.book_append_sheet(wb,ozWs,'ÖZET');
  // Her ay ayrı sayfa
  months.slice(0,12).forEach(ay=>{
    const ayG=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
    if(!ayG.length)return;
    const ws={};let row=0;
    row=xlsxHdr(ws,row,basliklar);
    let topFark=0;
    ayG.forEach(g=>{
      const profil=profiller.find(p=>p.user_id===g.user_id);
      const urun=urunler.find(u=>u.user_id===g.user_id&&u.sira===g.urun_sira);
      const{sayima,fark}=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez});
      topFark+=fark;
      row=xlsxRow(ws,row,[profil?.sube_adi||'',urun?.ad||'',urun?.birim||'',g.gun,g.tarih,n(g.acilis),n(g.gelen),n(g.gelen_iade),n(g.transfer),n(g.kapanis),sayima,n(g.mallara_gore),n(g.zayi),n(g.odenmez),fark]);
    });
    row=xlsxRow(ws,row,['','','','','','','','','','','','','','TOPLAM FARK',r(topFark)],true);
    ws['!cols']=basliklar.map((_,i)=>({wch:[16,22,8,6,12,10,10,8,10,10,12,12,8,10,10][i]||10}));
    XLSX.utils.book_append_sheet(wb,ws,monthLabel(ay).replace(/\s/g,'_').slice(0,31));
  });
  XLSX.writeFile(wb,'BRGR_Tum_Veriler_'+new Date().toISOString().slice(0,10)+'.xlsx');
  toast('Tüm veriler Excel olarak indirildi ✅');
}
let prodChartInstance=null;
function renderIzeka(p){const birim=p.birim||'Adet';const sonGirisler=p.entries.filter(e=>n(e.mallara)>0||n(e.kapanis)>0).slice(-14);if(!sonGirisler.length)return '';const mallaraList=sonGirisler.filter(e=>n(e.mallara)>0);const ortMallara=mallaraList.length?r(mallaraList.reduce((s,e)=>s+n(e.mallara),0)/mallaraList.length):null;const sonKapanis=p.entries.length?n(p.entries[p.entries.length-1].kapanis||''):null;const gunYeter=ortMallara&&ortMallara>0&&sonKapanis!==null?Math.floor(sonKapanis/ortMallara):null;const toplamFire=r(p.entries.reduce((s,e)=>s+Math.min(0,calcEntry(e).fark),0));const fireMaliyet=toplamFire<0&&p.birimFiyat>0?r(Math.abs(toplamFire)*p.birimFiyat):null;const gunRenk=gunYeter===null?'#aaa':gunYeter<=1?'#e74c3c':gunYeter<=3?'#e67e22':'#27ae60';let html=`<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06)"><div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:10px">💡 İş Zekası</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:10px">`;if(ortMallara!==null)html+=`<div style="background:#f8f8f8;border-radius:8px;padding:10px"><div style="font-size:10px;color:#999;margin-bottom:4px">Ort. Günlük Satış (son ${mallaraList.length} gün)</div><div style="font-size:20px;font-weight:800;color:#333">${ortMallara} <span style="font-size:11px;font-weight:400">${birim}</span></div></div>`;if(gunYeter!==null)html+=`<div style="background:#f8f8f8;border-radius:8px;padding:10px;border-left:3px solid ${gunRenk}"><div style="font-size:10px;color:#999;margin-bottom:4px">Mevcut Stok Yeter</div><div style="font-size:20px;font-weight:800;color:${gunRenk}">${gunYeter} gün</div></div>`;if(ortMallara!==null)html+=`<div style="background:#e8f4fd;border-radius:8px;padding:10px"><div style="font-size:10px;color:#2980b9;margin-bottom:4px">Yarın Tahmini Kullanım</div><div style="font-size:20px;font-weight:800;color:#2980b9">${ortMallara} <span style="font-size:11px;font-weight:400">${birim}</span></div></div>`;html+=`<div style="background:#f8f8f8;border-radius:8px;padding:10px;border-left:3px solid ${toplamFire<0?'#e74c3c':'#27ae60'}"><div style="font-size:10px;color:#999;margin-bottom:4px">Toplam Fire</div><div style="font-size:20px;font-weight:800;color:${toplamFire<0?'#e74c3c':'#27ae60'}">${fmtOr0(toplamFire)} <span style="font-size:11px;font-weight:400">${birim}</span></div>${fireMaliyet!==null?`<div style="font-size:12px;color:#e74c3c;font-weight:700;margin-top:4px">? ${fireMaliyet}? kayıp</div>`:''}</div>`;html+=`</div>`;if(gunYeter!==null&&gunYeter<=3)html+=`<div style="background:#fdf2e9;border-radius:8px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px"><span style="font-size:20px">💡</span><div><div style="font-size:12px;font-weight:700;color:#e67e22">SİPARİŞ VER!</div><div style="font-size:11px;color:#aaa">${gunYeter<=0?'Stok tükendi!':gunYeter+' gün kaldı — hemen sipariş ver'}</div></div></div>`;if(p.minStok!==null&&sonKapanis!==null&&sonKapanis<p.minStok)html+=`<div style="background:#fdf2e9;border-radius:8px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px"><span>📈</span><span style="font-size:12px;color:#e67e22;font-weight:700">Min stok uyarısı! Mevcut: ${sonKapanis} — Min: ${p.minStok} ${birim}</span></div>`;html+=`</div>`;return html;}
function renderChart(p,filtered){const chartEntries=filtered.filter(e=>e.tarih).slice(-30);if(chartEntries.length<2)return '';return `<div style="background:#fff;border-radius:12px;padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06)"><div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:10px">📈 Trend Grafiği (son ${chartEntries.length} gün)</div><canvas id="prod-chart" style="max-height:180px"></canvas></div>`;}
function initChart(p,filtered){const ctx=document.getElementById('prod-chart');if(!ctx)return;if(prodChartInstance){prodChartInstance.destroy();prodChartInstance=null;}const chartEntries=filtered.filter(e=>e.tarih).slice(-30);if(chartEntries.length<2)return;const labels=chartEntries.map(e=>e.tarih.slice(5));const kapanisData=chartEntries.map(e=>e.kapanis!==''?n(e.kapanis):null);const mallara=chartEntries.map(e=>e.mallara!==''?n(e.mallara):null);prodChartInstance=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Kapanış',data:kapanisData,borderColor:'#e8590c',backgroundColor:'rgba(232,89,12,0.08)',tension:0.3,pointRadius:3,fill:true},{label:'Satılan',data:mallara,borderColor:'#3498db',backgroundColor:'rgba(52,152,219,0.08)',tension:0.3,pointRadius:3,fill:false}]},options:{responsive:true,plugins:{legend:{labels:{font:{size:11},boxWidth:12}}},scales:{y:{beginAtZero:false,ticks:{font:{size:10}}},x:{ticks:{font:{size:10},maxRotation:45}}}}});}
let adminSecAy='tumu';
function adminAcUrun(userId,sira,secAy){adminSecAy=secAy||'tumu';const profil=adminData.profiller.find(p=>p.user_id===userId);const urun=adminData.urunler.find(u=>u.user_id===userId&&u.sira===sira);const tumGirdiler=adminData.girdiler.filter(g=>g.user_id===userId&&g.urun_sira===sira);const birim=urun?.birim||'Adet';const months=[...new Set(tumGirdiler.filter(g=>g.tarih).map(g=>g.tarih.slice(0,7)))].sort().reverse();const girdiler=adminSecAy==='tumu'?tumGirdiler:tumGirdiler.filter(g=>g.tarih&&g.tarih.startsWith(adminSecAy));const ayLabel=adminSecAy==='tumu'?'Tümü':monthLabel(adminSecAy);let html=`<div class="admin-panel"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap"><button onclick="adminAcSube('${userId}')" style="background:var(--dark);color:#fff;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:13px;font-weight:700">← Geri</button><h2 style="margin:0;font-size:14px">📋 ${profil?.sube_adi} › ${urun?.ad}</h2></div><div style="background:#f8f8f8;border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase">Ay Filtresi</span><select onchange="adminAcUrun('${userId}',${sira},this.value)" style="padding:7px 12px;border:2px solid #eee;border-radius:8px;font-size:13px;font-weight:700;outline:none"><option value="tumu" ${adminSecAy==='tumu'?'selected':''}>Tümü</option>${months.map(m=>`<option value="${m}" ${m===adminSecAy?'selected':''}>${monthLabel(m)}</option>`).join('')}</select><button id="admin-csv-btn" style="padding:7px 14px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">CSV İndir</button><button onclick="window.print()" style="padding:7px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">Yazdır</button><span style="font-size:12px;color:#aaa">${girdiler.length} giriş</span></div>`;if(!tumGirdiler.length){html+=`<div class="empty"><div class="ico">📋</div><p>Bu ürün için henüz giriş yok.</p></div>`;}else if(!girdiler.length){html+=`<div class="empty"><div class="ico">📋</div><p>${ayLabel} için giriş yok.</p></div>`;}else{let toplamFark=0,posC=0,negC=0;girdiler.forEach(g=>{const f=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark;toplamFark+=f;if(f>0)posC++;else if(f<0)negC++;});toplamFark=r(toplamFark);const fc=toplamFark>0?'green':toplamFark<0?'red':'';html+=`<div class="stats-row" style="margin-bottom:12px"><div class="stat-card orange"><div class="sl">${ayLabel} Gün</div><div class="sv">${girdiler.length}</div></div><div class="stat-card ${fc}"><div class="sl">${ayLabel} Fark</div><div class="sv">${toplamFark>0?'+':''}${toplamFark}</div></div><div class="stat-card"><div class="sl">+ / - Gün</div><div class="sv" style="font-size:16px"><span style="color:#27ae60">+${posC}</span> / <span style="color:#e74c3c">${negC}</span></div></div></div><div class="table-card"><div class="table-scroll"><table><thead><tr><th>Gün #</th><th>Tarih</th><th>Açılış<br>(${birim})</th><th>Gelen</th><th>G.İade</th><th>Transfer</th><th>Kapanış<br>(${birim})</th><th>Sayıma Göre<br>Kullanılan</th><th>Mallara Göre<br>Satılan</th><th>Zayi</th><th>Ödenmez</th><th>FARK</th></tr></thead><tbody>`;girdiler.forEach(g=>{const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};const{sayima,fark}=calcEntry(e);const fc2=fark>0?'fp':fark<0?'fn':'fz';html+=`<tr><td>${g.gun||''}</td><td>${g.tarih||''}</td><td>${g.acilis||''}</td><td>${g.gelen||''}</td><td>${g.gelen_iade||''}</td><td>${fmt(g.transfer)}</td><td>${g.kapanis||''}</td><td class="calc">${sayima}</td><td>${g.mallara_gore||''}</td><td>${g.zayi||''}</td><td>${fmt(g.odenmez)}</td><td class="${fc2}">${fark>0?'+':''}${fark}</td></tr>`;});html+=`</tbody></table></div></div>`;}html+=`</div>`;document.getElementById('page-content').innerHTML=html;const csvBtn=document.getElementById('admin-csv-btn');if(csvBtn)csvBtn.onclick=()=>adminExportCSV(userId,sira,adminSecAy);}
function adminExportCSV(userId,sira,secAy){const profil=adminData.profiller.find(p=>p.user_id===userId);const urun=adminData.urunler.find(u=>u.user_id===userId&&u.sira===sira);const tumGirdiler=adminData.girdiler.filter(g=>g.user_id===userId&&g.urun_sira===sira);const girdiler=secAy==='tumu'?tumGirdiler:tumGirdiler.filter(g=>g.tarih&&g.tarih.startsWith(secAy));if(!girdiler.length){toast('Bu dönemde giriş yok');return;}const ayLabel=secAy==='tumu'?'Tüm_Aylar':monthLabel(secAy).replace(/\s/g,'_');const esc=v=>{const s=String(v??'');return(s.includes(';')||s.includes('"'))?'"'+s.replace(/"/g,'""')+'"':s;};const cols=['Sube','Urun','Gun','Tarih','Acilis','Gelen','Gelen_Iade','Transfer','Kapanis','Sayima_Gore_Kullanilan','Mallara_Gore_Satilan','Zayi','Odenmez','FARK'];let csv=cols.join(';')+'\n';girdiler.forEach(g=>{const{sayima,fark}=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez});csv+=[profil?.sube_adi,urun?.ad,g.gun,g.tarih,g.acilis||0,g.gelen||0,g.gelen_iade||0,g.transfer||0,g.kapanis||0,sayima,g.mallara_gore||0,g.zayi||0,g.odenmez||0,fark].map(esc).join(';')+'\n';});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));a.download=((profil?.sube_adi||'')+'_'+(urun?.ad||'')+'_'+ayLabel).replace(/[\s\/\\:*?"<>|]/g,'_')+'.csv';a.click();toast('Excel dosyası indirildi ✅');}
let faturaAnalizSonucu=[];
async function adminSubeAdiDegistir(userId,mevcutAd){const yeni=prompt('Yeni şube adı:',mevcutAd);if(!yeni||!yeni.trim()||yeni.trim()===mevcutAd)return;const{error}=await sb.from('sube_profiller').update({sube_adi:yeni.trim()}).eq('user_id',userId);if(error){toast('Hata: '+error.message,4000);return;}const profil=adminData.profiller.find(p=>p.user_id===userId);if(profil)profil.sube_adi=yeni.trim();renderAdminAnaSayfa();toast('Şube adı güncellendi ✅');}
async function adminSubeSil(userId,subeAdi){const sifre=prompt('🔒 "'+subeAdi+'" şubesini silmek için süper admin şifrenizi girin:');if(!sifre)return;const{data,error}=await sb.auth.signInWithPassword({email:currentUser.email,password:sifre});if(error){toast('⚠️ Yanlış şifre! Silme iptal edildi.',4000);return;}if(!confirm('⚠️ SON UYARI!\n\n"'+subeAdi+'" şubesi ve TÜM verileri kalıcı olarak silinecek!\n\nBu işlem GERİ ALINAMAZ!\n\nDevam etmek için TAMAM basın.'))return;const[r1,r2,r3]=await Promise.all([sb.from('gunluk_girdiler').delete().eq('user_id',userId),sb.from('urunler').delete().eq('user_id',userId),sb.from('sube_profiller').delete().eq('user_id',userId)]);if(r1.error||r2.error||r3.error){const errmsg=(r1.error||r2.error||r3.error).message;toast('Silme hatası: '+errmsg,6000);console.error('sil r1:',r1.error,'r2:',r2.error,'r3:',r3.error);return;}adminData.profiller=adminData.profiller.filter(p=>p.user_id!==userId);adminData.urunler=adminData.urunler.filter(u=>u.user_id!==userId);adminData.girdiler=adminData.girdiler.filter(g=>g.user_id!==userId);renderAdminAnaSayfa();toast(subeAdi+' silindi ?');}
async function renderSuperKullanicilar(){
  const pc=document.getElementById('page-content');
  pc.innerHTML='<div class="empty"><div class="ico">📋</div><p>Yükleniyor...</p></div>';
  const{data:profiller}=await sb.from('sube_profiller').select('*');
  const{data:girdiler}=await sb.from('gunluk_girdiler').select('*').order('tarih',{ascending:false});
  const{data:urunler}=await sb.from('urunler').select('*');
  if(!profiller){pc.innerHTML='<div class="empty"><p>Veri yüklenemedi</p></div>';return;}
  // Her kullanıcı için Özet
  const kullanicilar=profiller.map(p=>{
    const uGirdiler=girdiler.filter(g=>g.user_id===p.user_id);
    const sonGiris=uGirdiler.length?uGirdiler[0].tarih:'?';
    const hatalar=uGirdiler.filter(g=>{
      const f=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark;
      return f<-0.01;
    });
    return{...p,toplamGiris:uGirdiler.length,sonGiris,hatalar,urunSayisi:(urunler||[]).filter(u=>u.user_id===p.user_id).length};
  });
  const toplamHata=kullanicilar.reduce((s,k)=>s+k.hatalar.length,0);
  let html=`<div class="admin-panel">
  <h2>🔴 Süper Admin <span class="admin-badge">KULLANICILAR & LOGLAR</span></h2>
  <div style="margin-bottom:14px"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button></div>
  <div class="stats-row" style="margin-bottom:16px">
    <div class="stat-card orange"><div class="sl">Toplam Kullanıcı</div><div class="sv">${profiller.length}</div></div>
    <div class="stat-card"><div class="sl">Toplam Girdi</div><div class="sv">${(girdiler||[]).length}</div></div>
    <div class="stat-card" style="background:#fff3cd"><div class="sl">Negatif Fark (Hata)</div><div class="sv" style="color:#e74c3c">${toplamHata}</div></div>
  </div>
  <div style="background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:16px">
    <div style="font-size:15px;font-weight:800;margin-bottom:14px">👥 Tüm Kullanıcılar</div>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr style="background:#f8f8f8">
      <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Şube</th>
      <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Email</th>
      <th style="padding:10px;text-align:left;border-bottom:2px solid #eee">Rol</th>
      <th style="padding:10px;text-align:center;border-bottom:2px solid #eee">Ürün</th>
      <th style="padding:10px;text-align:center;border-bottom:2px solid #eee">Toplam Girdi</th>
      <th style="padding:10px;text-align:center;border-bottom:2px solid #eee">Son Giriş</th>
      <th style="padding:10px;text-align:center;border-bottom:2px solid #eee">⚠️ Hata</th>
    </tr></thead>
    <tbody>${kullanicilar.map(k=>`<tr style="border-bottom:1px solid #f0f0f0;cursor:pointer" onclick="superAdminHatalar('${k.user_id}','${(k.sube_adi||'').replace(/'/g,'')}')" title="Detay için tıkla">
      <td style="padding:10px;font-weight:700">${k.sube_adi||'—'}</td>
      <td style="padding:10px;color:#555;font-size:11px">${k.email||'—'}</td>
      <td style="padding:10px"><span style="background:${k.rol==='super_admin'?'#e74c3c':k.rol==='admin'?'#8e44ad':'#27ae60'};color:#fff;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700">${k.rol==='super_admin'?'SÜPER ADMİN':k.rol==='admin'?'ADMİN':'KULLANICI'}</span></td>
      <td style="padding:10px;text-align:center">${k.urunSayisi}</td>
      <td style="padding:10px;text-align:center">${k.toplamGiris}</td>
      <td style="padding:10px;text-align:center;font-size:11px;color:#888">${k.sonGiris}</td>
      <td style="padding:10px;text-align:center">${k.hatalar.length>0?`<span style="background:#e74c3c;color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700">${k.hatalar.length}</span>`:'<span style="color:#27ae60;font-size:11px">?</span>'}</td>
    </tr>`).join('')}</tbody></table></div>
  </div></div>`;
  pc.innerHTML=html;
}
function superAdminHatalar(userId,subeAdi){
  const girdiler=adminData.girdiler.filter(g=>g.user_id===userId);
  const hatali=girdiler.filter(g=>{
    const f=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark;
    return f<-0.01;
  });
  if(!hatali.length){toast(subeAdi+' için hata kaydı yok ?',3000);return;}
  const profil=adminData.profiller.find(p=>p.user_id===userId);
  const urunler=adminData.urunler.filter(u=>u.user_id===userId);
  let rows=hatali.sort((a,b)=>b.tarih.localeCompare(a.tarih)).map(g=>{
    const urun=urunler.find(u=>u.sira===g.urun_sira);
    const f=calcEntry({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez}).fark;
    return`<tr style="border-bottom:1px solid #f0f0f0">
      <td style="padding:8px;font-size:12px">${g.tarih}</td>
      <td style="padding:8px;font-weight:700;font-size:12px">${urun?.ad||'Ürün#'+g.urun_sira}</td>
      <td style="padding:8px;font-size:12px">Açılış:${g.acilis||0} / Kapanış:${g.kapanis||0} / Satış:${g.mallara_gore||0}</td>
      <td style="padding:8px;text-align:right"><span style="color:#e74c3c;font-weight:800">${f.toFixed(2)}</span></td>
    </tr>`;
  }).join('');
  const pc=document.getElementById('page-content');
  pc.innerHTML=`<div class="admin-panel">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <button onclick="renderSuperKullanicilar()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button>
      <div><div style="font-size:15px;font-weight:800">📊 ${subeAdi} — Negatif Fark Kayıtları</div><div style="font-size:11px;color:#aaa">${profil?.email||''} • ${hatali.length} hatalı girdi</div></div>
    </div>
    <div style="background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#fff3f3">
          <th style="padding:8px;text-align:left;font-size:12px;border-bottom:2px solid #eee">Tarih</th>
          <th style="padding:8px;text-align:left;font-size:12px;border-bottom:2px solid #eee">Ürün</th>
          <th style="padding:8px;text-align:left;font-size:12px;border-bottom:2px solid #eee">Değerler</th>
          <th style="padding:8px;text-align:right;font-size:12px;border-bottom:2px solid #eee">Fark</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}
async function renderAdminUrunler(){
const pc=document.getElementById("page-content");
pc.innerHTML="<div class=\"empty\"><p>Yukleniyor...</p></div>";
let profiller=adminData.profiller||[];
let urunler=adminData.urunler||[];
if(!profiller.length){const r2=await sb.from("sube_profiller").select("*");profiller=r2.data||[];}
if(!urunler.length&&profiller.length){const r3=await sb.from("urunler").select("*").order("sira");urunler=r3.data||[];}
if(!profiller.length){pc.innerHTML="<div class=\"empty\"><p>Sube bulunamadi</p></div>";return;}
const ilkSube=profiller[0];
const subeUrunler=urunler.filter(u=>u.user_id===ilkSube.user_id);
window._adminUrunlerList=subeUrunler;
let html="<div class=\"admin-panel\"><h2>Admin Paneli <span class=\"admin-badge\">TUM SUBELER</span></h2>";
html+="<div style=\"display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap\">";
html+="<button onclick=\"renderAdminAnaSayfa()\" style=\"padding:8px 14px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Subeler</button>";
html+="<button onclick=\"renderAdminUrunler()\" style=\"padding:8px 14px;background:#e67e22;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Urunler</button>";
html+="<button onclick=\"renderAdminAylikRapor()\" style=\"padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Aylik Rapor</button>";
html+="<button onclick=\"renderAdminKarsilastirma()\" style=\"padding:8px 14px;background:#0891b2;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Kiyaslama</button>";
html+="<button onclick=\"adminTumExcel()\" style=\"padding:8px 14px;background:#27ae60;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Excel</button>";
html+="<button onclick=\"renderAdminYonetimi()\" style=\"padding:8px 14px;background:#8e44ad;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Adminler</button>";
html+="<button onclick=\"renderAdminSubeYonetimi()\" style=\"padding:8px 14px;background:#0f766e;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\">Sube Yonetimi</button>";
html+="</div>";
html+="<div style=\"background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);\">";
html+="<div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:14px\">";
html+="<div><div style=\"font-size:16px;font-weight:800\">Urun Listesi ("+subeUrunler.length+" urun)</div>";
html+="<div style=\"font-size:11px;color:#aaa\">Yeni urun eklenince tum subelere gider</div></div>";
html+="<button onclick=\"adminYeniUrunEkle()\" style=\"padding:10px 18px;background:var(--orange);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer\">+ Yeni Urun Ekle</button>";
html+="</div><div style=\"overflow-x:auto\"><table style=\"width:100%;border-collapse:collapse;font-size:13px\">";
html+="<thead><tr style=\"background:#f8f8f8\"><th style=\"padding:10px;text-align:left;border-bottom:2px solid #eee\">Sira</th>";
html+="<th style=\"padding:10px;text-align:left;border-bottom:2px solid #eee\">Urun Adi</th>";
html+="<th style=\"padding:10px;text-align:left;border-bottom:2px solid #eee\">Birim</th>";
html+="<th style=\"padding:10px;text-align:center;border-bottom:2px solid #eee\">Sube</th>";
html+="<th style=\"padding:10px;text-align:center;border-bottom:2px solid #eee\">Sil</th></tr></thead><tbody>";
subeUrunler.forEach((u,i2)=>{
  html+="<tr style=\"border-bottom:1px solid #f0f0f0\">";
  html+="<td style=\"padding:10px;color:#aaa;font-size:12px\">"+(u.sira+1)+"</td>";
  html+="<td style=\"padding:10px;font-weight:700\">"+u.ad+"</td>";
  html+="<td style=\"padding:10px\"><span style=\"background:#f0f0f0;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700\">"+(u.birim||"Adet")+"</span></td>";
  html+="<td style=\"padding:10px;text-align:center\"><span style=\"background:#e8f5e9;color:#27ae60;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700\">"+profiller.length+" sube</span></td>";
  html+="<td style=\"padding:10px;text-align:center\"><button onclick=\"adminUrunSilByIdx("+i2+")\" style=\"padding:5px 12px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer\">Sil</button></td>";
  html+="</tr>";
});
html+="</tbody></table></div></div></div>";
document.getElementById("page-content").innerHTML=html;
}
async function adminUrunSilByIdx(idx2){
const liste=window._adminUrunlerList||[];
const u=liste[idx2];
if(!u){toast("Urun bulunamadi");return;}
if(!confirm('"'+u.ad+'" urununu TUM subelerden silmek istediginizden emin misiniz?'))return;
const profiller=adminData.profiller.length?adminData.profiller:(await sb.from("sube_profiller").select("user_id")).data||[];
let basarili=0;
for(const p of profiller){const{error}=await sb.from("urunler").delete().eq("user_id",p.user_id).eq("ad",u.ad);if(!error)basarili++;}
adminData.urunler=[];
toast(basarili+" subeden silindi!",4000);
renderAdminUrunler();
}
async function adminUrunSil(ad,sira){if(!confirm('"'+ad+'" ürününü TÜM şubelerden silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!'))return;const{data:profiller}=await sb.from('sube_profiller').select('user_id');if(!profiller||!profiller.length){toast('Şube bulunamadı');return;}let basarili=0;for(const p of profiller){const{error}=await sb.from('urunler').delete().eq('user_id',p.user_id).eq('ad',ad);if(!error)basarili++;}toast('🗑 "'+ad+'" '+basarili+' şubeden silindi!',4000);renderAdminUrunler();}
async function adminYeniUrunEkle(){const ad=prompt('Yeni ürün adı (tüm şubelere eklenecek):');if(!ad||!ad.trim())return;const birim=prompt('Birimi (Adet / Kg / Lt / Paket / Kutu):','Adet')||'Adet';const{data:profiller}=await sb.from('sube_profiller').select('user_id');if(!profiller||!profiller.length){toast('Şube bulunamadı');return;}// Her şube için en yüksek sırayı bul ve ekle
let basarili=0;for(const p of profiller){const{data:mevcutlar}=await sb.from('urunler').select('sira').eq('user_id',p.user_id).order('sira',{ascending:false}).limit(1);const yeniSira=(mevcutlar&&mevcutlar.length)?mevcutlar[0].sira+1:0;const{error}=await sb.from('urunler').insert({user_id:p.user_id,sira:yeniSira,ad:ad.trim(),birim,koli:'',adet_koli:''});if(!error)basarili++;}toast(`? "${ad.trim()}" ${basarili} şubeye eklendi!`,4000);renderAdminUrunler();}
function renderAdminYonetimi(){const profiller=adminData.profiller;const admins=profiller.filter(p=>p.rol==='admin');const subeler=profiller.filter(p=>p.rol!=='admin');let html='<div class="admin-panel">';html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h3 style="margin:0;font-size:16px">👑 Admin Yönetimi</h3></div>';html+='<div style="background:#f3e8ff;border:1px solid #c084fc;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#7e22ce">Admin olan kullanıcılar tüm şubelerin verilerini görebilir, raporlarını indirebilir. Dikkatli kullanın.</div>';html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Adminler ('+admins.length+')</div>';html+='<div style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:20px">';if(!admins.length){html+='<div style="padding:14px;text-align:center;color:#aaa;font-size:13px">Henüz admin yok</div>';}admins.forEach(p=>{const isSelf=p.user_id===currentUser.id;html+='<div style="display:flex;align-items:center;padding:12px 14px;border-bottom:1px solid #f0f0f0;gap:10px;background:#fff9f0"><span style="font-size:22px">⚠️</span><div style="flex:1"><div style="font-size:13px;font-weight:700;color:#333">'+p.sube_adi+'</div><div style="font-size:11px;color:#aaa">'+(p.email||'e-posta yok')+'</div></div><span style="background:#e85d04;color:#fff;font-size:10px;padding:3px 8px;border-radius:10px;font-weight:700">ADMİN</span>'+(isSelf?'<span style="font-size:10px;color:#aaa;padding:0 6px">(sen)</span>':'<button onclick="adminRolDegistir(\''+p.user_id+'\',\'sube\')" style="padding:6px 12px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">Kaldır</button>')+'</div>';});html+='</div>';html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Şubeler ('+subeler.length+')</div>';html+='<div style="border:1px solid #eee;border-radius:10px;overflow:hidden">';if(!subeler.length){html+='<div style="padding:14px;text-align:center;color:#aaa;font-size:13px">Tüm kullanıcılar admin</div>';}subeler.forEach(p=>{html+='<div style="display:flex;align-items:center;padding:12px 14px;border-bottom:1px solid #f0f0f0;gap:10px;background:#fff"><span style="font-size:22px">⚠️</span><div style="flex:1"><div style="font-size:13px;font-weight:700;color:#333">'+p.sube_adi+'</div><div style="font-size:11px;color:#aaa">'+(p.email||'e-posta yok')+'</div></div><span style="background:#eee;color:#999;font-size:10px;padding:3px 8px;border-radius:10px;font-weight:700">ŞUBE</span><button onclick="adminRolDegistir(\''+p.user_id+'\',\'admin\')" style="padding:6px 12px;background:#f3e8ff;color:#7e22ce;border:1px solid #c084fc;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer">👑 Admin Yap</button></div>';});html+='</div></div>';document.getElementById('page-content').innerHTML=html;}
async function adminRolDegistir(userId,yeniRol){const profil=adminData.profiller.find(p=>p.user_id===userId);const onay=yeniRol==='admin'?'"'+profil?.sube_adi+'" kullanıcısını ADMİN yapmak istediğinizden emin misiniz?\n\nTüm şubelerin verilerini görebilecek.':'"'+profil?.sube_adi+'" kullanıcısının ADMİN yetkisini kaldırmak istediğinizden emin misiniz?';if(!confirm(onay))return;const{error}=await sb.from('sube_profiller').update({rol:yeniRol}).eq('user_id',userId);if(error){toast('Hata: '+error.message,4000);return;}if(profil)profil.rol=yeniRol;renderAdminYonetimi();toast(yeniRol==='admin'?profil.sube_adi+' artisk Admin ?':profil.sube_adi+' artisk Şube kullanıcısı ?');}
function renderAdminSubeYonetimi(){const{profiller,girdiler}=adminData;let html='<div class="admin-panel">';html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h3 style="margin:0;font-size:16px">🏪 Şube Yönetimi</h3><span style="background:#e0f2fe;color:#0369a1;font-size:11px;padding:4px 10px;border-radius:20px;font-weight:700">'+profiller.length+' Şube</span></div>';html+='<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#166534">Şube adını değiştirebilir, şubenin ürünlerini ve giriş sayısını görebilirsiniz.</div>';profiller.forEach(p=>{const pGirdiler=girdiler.filter(g=>g.user_id===p.user_id);const sonGiris=pGirdiler.filter(g=>g.tarih).sort((a,b)=>b.tarih.localeCompare(a.tarih))[0];const buAy=new Date().toISOString().slice(0,7);const buAyG=pGirdiler.filter(g=>g.tarih&&g.tarih.startsWith(buAy));const rolBadge=p.rol==='super_admin'?'<span style="background:#7e22ce;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700">SÜPER</span>':p.rol==='admin'?'<span style="background:#e85d04;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700">ADMİN</span>':'<span style="background:#eee;color:#666;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700">ŞUBE</span>';html+='<div style="background:#fff;border:1px solid #eee;border-radius:12px;padding:14px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">';html+='<div style="display:flex;align-items:flex-start;gap:10px">';html+='<span style="font-size:28px">🏪</span>';html+='<div style="flex:1;min-width:0">';html+='<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px"><span style="font-size:14px;font-weight:800;color:#1a1a1a">'+p.sube_adi+'</span>'+rolBadge+'</div>';html+='<div style="font-size:11px;color:#aaa;margin-bottom:8px">📧 '+(p.email||'e-posta yok')+'</div>';html+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><div style="background:#f8f8f8;border-radius:8px;padding:6px 10px;font-size:11px"><span style="color:#aaa">Bu Ay</span><br><b style="color:#333">'+buAyG.length+' giriş</b></div><div style="background:#f8f8f8;border-radius:8px;padding:6px 10px;font-size:11px"><span style="color:#aaa">Toplam</span><br><b style="color:#333">'+pGirdiler.length+' giriş</b></div><div style="background:#f8f8f8;border-radius:8px;padding:6px 10px;font-size:11px"><span style="color:#aaa">Son Giriş</span><br><b style="color:#333">'+(sonGiris?sonGiris.tarih:'—')+'</b></div></div>';html+='<div style="display:flex;gap:8px;flex-wrap:wrap">';html+='<button onclick="adminSubeAdiDegistir(\''+p.user_id+'\',\''+p.sube_adi+'\')" style="padding:7px 14px;background:#fff;border:2px solid var(--orange);color:var(--orange);border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">✏️ Adı Değiştir</button>';html+='<button onclick="adminAcSube(\''+p.user_id+'\')" style="padding:7px 14px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer">📊 Verileri Gör</button>';html+='</div>';html+='</div></div></div>';});html+='</div>';document.getElementById('page-content').innerHTML=html;}
function renderAdminKarsilastirma(){const buAy=new Date().toISOString().slice(0,7);const branches=adminData.profiller.map(p=>{const pg=adminData.girdiler.filter(g=>g.user_id===p.user_id);const buAyG=pg.filter(g=>g.tarih&&g.tarih.startsWith(buAy));const toEntry=g=>({acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez});const topFark=r(pg.reduce((s,g)=>s+calcEntry(toEntry(g)).fark,0));const buAyFark=r(buAyG.reduce((s,g)=>s+calcEntry(toEntry(g)).fark,0));const topFire=r(pg.reduce((s,g)=>s+Math.min(0,calcEntry(toEntry(g)).fark),0));return{sube_adi:p.sube_adi,topFark,buAyFark,topFire,kayit:pg.length};});const maxAbs=Math.max(1,...branches.map(b=>Math.abs(b.topFark)));let html='<div class="admin-panel">';html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h3 style="margin:0;font-size:16px">📈 Şubeler Karşılaştırma</h3></div>';html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Toplam Fark (tüm zamanlar)</div>';html+='<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">';[...branches].sort((a,b)=>b.topFark-a.topFark).forEach(b=>{const pct=Math.round((Math.abs(b.topFark)/maxAbs)*100);const c=b.topFark>0?'#27ae60':b.topFark<0?'#e74c3c':'#aaa';html+='<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:700;color:#333">🏪 '+b.sube_adi+'</span><span style="font-size:13px;font-weight:800;color:'+c+'">'+(b.topFark>0?'+':'')+b.topFark+'</span></div><div style="height:14px;background:#f0f0f0;border-radius:7px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+c+';border-radius:7px;transition:width 0.8s ease"></div></div></div>';});html+='</div>';html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Bu Ay Fark ('+monthLabel(buAy)+')</div>';const maxAy=Math.max(1,...branches.map(b=>Math.abs(b.buAyFark)));html+='<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">';[...branches].sort((a,b)=>b.buAyFark-a.buAyFark).forEach(b=>{const pct=Math.round((Math.abs(b.buAyFark)/maxAy)*100);const c=b.buAyFark>0?'#27ae60':b.buAyFark<0?'#e74c3c':'#aaa';html+='<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:700;color:#333">🏪 '+b.sube_adi+'</span><span style="font-size:13px;font-weight:800;color:'+c+'">'+(b.buAyFark>0?'+':'')+b.buAyFark+'</span></div><div style="height:14px;background:#f0f0f0;border-radius:7px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+c+';border-radius:7px;transition:width 0.8s ease"></div></div></div>';});html+='</div>';html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Toplam Fire Miktarı</div>';const maxFire=Math.max(1,...branches.map(b=>Math.abs(b.topFire)));html+='<div style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">';[...branches].sort((a,b)=>a.topFire-b.topFire).forEach(b=>{const pct=Math.round((Math.abs(b.topFire)/maxFire)*100);html+='<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:700;color:#333">🏪 '+b.sube_adi+'</span><span style="font-size:13px;font-weight:800;color:#e74c3c">'+b.topFire+' ('+b.kayit+' kayıt)</span></div><div style="height:14px;background:#f0f0f0;border-radius:7px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:#e74c3c;border-radius:7px"></div></div></div>';});html+='</div></div>';document.getElementById('page-content').innerHTML=html;}
function renderMailOtomasyon(){let html='<div class="admin-panel">';html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><button onclick="renderAdminAnaSayfa()" style="padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">← Geri</button><h3 style="margin:0;font-size:16px">📧 Mail Otomasyonu</h3></div>';html+='<div style="background:#e0f2fe;border:1px solid #7dd3fc;border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:13px;color:#0c4a6e"><strong>Nasıl çalışır?</strong><br>Google Apps Script, Gmail\'deki ariapos raporlarını her gece otomatik okuyup sisteme ekler. Kurulum <strong>bir kez</strong> yapılır, sonra tamamen otomatik çalışır.</div>';html+='<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:8px">📋 Kurulum Adımları:</div>';html+='<div style="background:#fff;border-radius:10px;padding:14px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);font-size:13px;line-height:1.8"><div style="margin-bottom:6px">1️⃣ <a href="https://script.google.com" target="_blank" style="color:#0891b2;font-weight:700">script.google.com</a> adresine git</div><div style="margin-bottom:6px">2️⃣ <strong>Yeni Proje</strong> oluştur</div><div style="margin-bottom:6px">3️⃣ Aşağıdaki kodu yapıştır</div><div style="margin-bottom:6px">4️⃣ Üstteki <strong>Çalıştır</strong> butonuna bas (izin ver)</div><div>5️⃣ <strong>Tetikleyiciler</strong> → Her gece saat 23:30 için zamanlayıcı ekle</div></div>';const code=`// Ercan BRGR - Ariapos Mail Otomasyonu
const SUPA_URL = '${document.querySelector&&'https://gqhfxpczgxksbfybfesz.supabase.co'}';
const SUPA_KEY = 'SUPABASE_ANON_KEY_BURAYA';
const KULLANICI_EMAIL = 'SUBE_MAIL_ADRESI_BURAYA'; // hangi şubenin maili

function ariaposMailOku() {
  const threads = GmailApp.search('from:rapor11@ariapos.com is:unread', 0, 10);
  threads.forEach(thread => {
    const msgs = thread.getMessages();
    msgs.forEach(msg => {
      const body = msg.getPlainBody();
      const tarih = msg.getDate().toISOString().split('T')[0];
      const satirlar = body.split('\\n');
      const parsed = parseSatirlar(satirlar, tarih);
      if (parsed.length > 0) {
        supabaseGonder(parsed);
        msg.markRead();
      }
    });
  });
}

function parseSatirlar(satirlar, tarih) {
  // Satır formatı: URUN ADI   ADET   FIYAT
  const kayitlar = [];
  satirlar.forEach(s => {
    const m = s.match(/^(.+?)\\s{2,}(\\d+)\\s+([\\d.,]+)/);
    if (m) kayitlar.push({ urun: m[1].trim(), adet: parseInt(m[2]), tarih });
  });
  return kayitlar;
}

function supabaseGonder(kayitlar) {
  const url = SUPA_URL + '/rest/v1/rpc/mail_rapor_ekle';
  const options = {
    method: 'POST',
    headers: { 'apikey': SUPA_KEY, 'Content-Type': 'application/json' },
    payload: JSON.stringify({ kayitlar, email: KULLANICI_EMAIL })
  };
  UrlFetchApp.fetch(url, options);
}`;html+='<div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:6px">Apps Script Kodu:</div>';html+='<div style="position:relative"><button onclick="navigator.clipboard.writeText(document.getElementById(\'apps-script-code\').textContent).then(()=>toast(\'Kopyalandı ?\'))" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:#0891b2;color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;z-index:1">📋 Kopyala</button>';html+='<pre id="apps-script-code" style="background:#1a1a2e;color:#a5f3fc;border-radius:10px;padding:16px;font-size:11px;overflow-x:auto;white-space:pre-wrap;margin:0;line-height:1.6">'+code.replace(/</g,'&lt;')+'</pre></div>';html+='<div style="background:#fef9c3;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:12px;color:#854d0e">⚠️ <strong>SUPA_KEY</strong> ve <strong>KULLANICI_EMAIL</strong> alanlarını doldurmayı unutma.</div>';html+='</div>';document.getElementById('page-content').innerHTML=html;}
async function faturaFotoOku(input){
  const file=input.files[0];
  if(!file)return;
  const status=document.getElementById('fatura-ocr-status');
  status.innerHTML='? Fotoğraf okunuyor...';
  status.style.color='#e67e22';
  try{
    const{data:{text}}=await Tesseract.recognize(file,'tur+eng',{
      logger:m=>{if(m.status==='recognizing text'){status.innerHTML=`? %${Math.round(m.progress*100)} okunuyor...`;}}
    });
    document.getElementById('fatura-text').value=text;
    status.innerHTML='? Metin okundu — analiz ediliyor...';
    status.style.color='#27ae60';
    analizFatura();
  }catch(e){
    status.innerHTML='? Okuma başarısız, metni elle yapıştırın';
    status.style.color='#e74c3c';
  }
}
let satisAnalizSonucu={};
let satisRaporTarih=null;
function openSatisModal(){document.getElementById('satis-modal').classList.add('show');document.getElementById('analiz-sonuc').innerHTML='';document.getElementById('satis-text').value='';satisAnalizSonucu={};satisRaporTarih=null;}
function closeSatisModal(){document.getElementById('satis-modal').classList.remove('show');}
function parseSatisLines(text){const items=[];let cat='';text.split('\n').forEach(line=>{if(/^\s*\*/.test(line)){cat=line.replace(/[* ]/g,'').toUpperCase();return;}const m=line.match(/^(.+?)\s{2,}(\d+)\s+([\d.,]+)/);if(m){const adet=parseInt(m[2]);const tutar=parseFloat(m[3].replace('.','').replace(',','.'));const birimFiyat=adet>0?tutar/adet:0;items.push({ad:m[1].trim().toUpperCase(),adet,kat:cat,birimFiyat});}});return items;}
function parseOzetToplam(text){let toplam=0;const lines=text.split('\n');let ozetBasladi=false;lines.forEach(line=>{if(/Ozet Urun Tip|Özet Ürün Tip/i.test(line)){ozetBasladi=true;return;}if(ozetBasladi){const m=line.match(/:\s*(\d+)/);if(m)toplam+=parseInt(m[1]);}});return toplam;}
function gunAdiFromTarih(tarih){if(!tarih)return '';const d=new Date(tarih);return ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][d.getDay()]||'';}
function extractPieces(ad){const m=ad.match(/(\d+)'?[LlİiuU]/);return m?parseInt(m[1]):1;}
function menuBilgi(item){const{ad,kat}=item;if(/GURME.*IKIL|IKIL.*GURME/.test(ad))return{bc:2,pat:2,kutu:2,litre:0,smoky:true};if(/IKILI/.test(kat)||/2 ?LI/.test(ad))return{bc:2,pat:2,kutu:2,litre:0};if(/UCLU/.test(kat)||/3 ?LU/.test(ad))return{bc:3,pat:3,kutu:0,litre:1};if(/DORTLU/.test(kat)||/4 ?LU/.test(ad))return{bc:4,pat:4,kutu:0,litre:2};if(/PIZZA.*MEN|MEN.*PIZZA/.test(ad))return{bc:0,pat:0,kutu:1,litre:0};if(/MENU/.test(kat)||/MEN[UÜ]?$/.test(ad)||/PAKET|RAMAZAN/.test(ad))return{bc:1,pat:1,kutu:1,litre:0};return{bc:1,pat:0,kutu:0,litre:0};}
function parseTarihFromText(text){const m=text.match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/);if(!m)return null;const gun=m[1].padStart(2,'0'),ay=m[2].padStart(2,'0'),yil=m[3];return `${yil}-${ay}-${gun}`;}
function analizEt(){const text=document.getElementById('satis-text').value.trim();if(!text){toast('Rapor metnini yapıştırın');return;}satisRaporTarih=parseTarihFromText(text);const lines=parseSatisLines(text);if(!lines.length){document.getElementById('analiz-sonuc').innerHTML='<div style="color:#e74c3c;font-size:13px;padding:10px">Ürün bulunamadı.</div>';return;}const totals={};let etBurger=0,tumBurger=0,smokyBurger=0;const add=(sira,val,birim='Kg')=>{if(!totals[sira])totals[sira]={val:0,birim};totals[sira].val=r(totals[sira].val+val);totals[sira].birim=birim;};lines.forEach(item=>{const{ad,adet}=item;const mb=menuBilgi(item);const isDouble=/DOUBLE/.test(ad)&&!/2 ?LI/.test(ad);let bSira=-1,bGr=0,isTavuk=false,isMiniEkmek=false;if(/RAMAZAN CORBALI/.test(ad)){bSira=7;bGr=110;isTavuk=true;}
else if(/JUNIOR.*TAVUK|TAVUK.*JUNIOR/.test(ad)){bSira=5;bGr=65;isTavuk=true;isMiniEkmek=true;mb.pat=mb.pat||1;mb.kutu=mb.kutu||1;}
else if(/JUNIOR|MINI ET/.test(ad)){bSira=0;bGr=50;isMiniEkmek=true;mb.pat=mb.pat||1;mb.kutu=mb.kutu||1;}
else if(/LEZZET/.test(ad)){if(item.birimFiyat>220){bSira=1;bGr=85;}else{bSira=6;bGr=120;isTavuk=true;}mb.pat=mb.pat||1;mb.kutu=mb.kutu||1;}
else if(/JOKE|ALGIDA JOKER|KAMPANYA.*JOKE/.test(ad)){bSira=1;bGr=85;}
else if(/SUPPER|SUPER|MISS CRISPY/.test(ad)){bSira=2;bGr=120;}
else if(/TASTY|RAMAZAN(?!.*CORBALI)/.test(ad)){bSira=3;bGr=150;}
else if(/SPECIAL|BIG SPECIAL/.test(ad)){bSira=4;bGr=150;}
else if(/TENDERS/.test(ad)){bSira=7;bGr=110;isTavuk=true;}
else if(/MINI TAVUK/.test(ad)){bSira=5;bGr=65;isTavuk=true;}
else if(/CHICKEN|CHEDDAR|RED ZONE/.test(ad)){bSira=6;bGr=120;isTavuk=true;}
else if(/CITIR|ÇITIR/.test(ad)){add(11,adet*160/1000);return;}if(bSira>=0){const etAdet=isDouble?2:1;add(bSira,adet*mb.bc*etAdet*bGr/1000);add(isMiniEkmek?17:16,adet*mb.bc,'Adet');if(!isTavuk)etBurger+=adet*mb.bc;tumBurger+=adet*mb.bc;if(mb.pat>0)add(8,adet*mb.pat*130/1000);if(mb.kutu>0)add(18,adet*mb.kutu,'Adet');if(mb.litre>0)add(20,adet*mb.litre,'Adet');if(/SMOKY/.test(ad)||mb.smoky)smokyBurger+=adet*mb.bc;return;}if(/PATATES/.test(ad))add(8,adet*130/1000);else if(/NUGGET/.test(ad))add(9,extractPieces(ad)*adet*24/1000);else if(/SOGAN|SOĞAN|ONION/.test(ad))add(10,extractPieces(ad)*adet*14/1000);else if(/STICK/.test(ad))add(12,r(extractPieces(ad)*adet*22/1000));else if(/SODA|MEYVELI SODA|MADEN/.test(ad))add(19,adet,'Adet');else if(/1 ?LT/.test(ad))add(20,adet,'Adet');else if(/SU|COLA|FUSE|ICE|AYRAN|MEYVE|SPRITE/.test(ad)&&!/SODA|1 ?LT/.test(ad))add(18,adet,'Adet');});if(etBurger>0)add(13,r(etBurger*20/1000));if(smokyBurger>0)add(14,r(smokyBurger*3*13/1000));
// Ekmek direkt ürün parse'ından hesaplandı (totals[16]=80gr, totals[17]=mini)
satisAnalizSonucu=totals;const siraNamMap={};appData.products.forEach((p,idx)=>{siraNamMap[idx]=p;});const tarihLabel=satisRaporTarih?`<span style="background:#eafaf1;color:#27ae60;padding:3px 10px;border-radius:8px;font-weight:700">📊 ${satisRaporTarih}</span>`:`<span style="background:#fff3cd;color:#856404;padding:3px 10px;border-radius:8px;font-weight:700">⚠️ Tarih bulunamadı — bugün kullanılacak</span>`;let html=`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">${tarihLabel}<span style="font-size:11px;color:#999">${lines.length} satır • ${tumBurger} burger</span></div><div style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:10px">`;let hasAny=false;Object.entries(totals).forEach(([sira,{val,birim}])=>{const p=siraNamMap[parseInt(sira)];if(!p||!val)return;html+=`<div style="display:flex;align-items:center;padding:9px 12px;border-bottom:1px solid #f5f5f5;gap:10px"><span style="flex:1;font-size:13px;font-weight:600;color:#333">${p.name}</span><input type="number" id="srv-${sira}" value="${val}" step="0.001" style="width:80px;padding:6px 8px;border:2px solid #eee;border-radius:6px;text-align:center;font-size:13px;font-weight:700;outline:none" onfocus="this.style.borderColor='#e85d04'" onblur="this.style.borderColor='#eee'"><span style="font-size:11px;color:#aaa;min-width:28px">${birim}</span></div>`;hasAny=true;});html+=`</div>`;if(hasAny){html+=`<div style="font-size:11px;color:#aaa;margin-bottom:8px">Değerleri kontrol edip onaylayın — her ürüne yeni giriş açılır</div><button onclick="uygulaRapor()" style="width:100%;padding:13px;background:#27ae60;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">? Kaydet ve Girişleri Oluştur</button>`;}else{html+=`<div style="text-align:center;padding:16px;color:#aaa;font-size:13px">Eşleşen ürün bulunamadı.</div>`;}document.getElementById('analiz-sonuc').innerHTML=html;}
async function uygulaRapor(){const totals=satisAnalizSonucu;if(!Object.keys(totals).length)return;const siraNamMap={};appData.products.forEach((p,idx)=>{siraNamMap[idx]=p;});const tarih=satisRaporTarih||new Date().toISOString().slice(0,10);const gunAdi=gunAdiFromTarih(tarih)||['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][new Date().getDay()];let updated=0,created=0;for(const[sira]of Object.entries(totals)){const inputEl=document.getElementById(`srv-${sira}`);const finalVal=inputEl?parseFloat(inputEl.value):0;if(!finalVal)continue;const p=siraNamMap[parseInt(sira)];if(!p)continue;const mevcutIdx=p.entries.findIndex(e=>e.tarih===tarih);if(mevcutIdx>=0){p.entries[mevcutIdx].mallara=String(finalVal);const e=p.entries[mevcutIdx];if(e.dbId){await sb.from('gunluk_girdiler').update({mallara_gore:String(finalVal)}).eq('id',e.dbId);}updated++;}else{const oncekiKapanis=p.entries.length?p.entries[p.entries.length-1].kapanis||'':'';const newEntry={gun:String(p.entries.length+1),tarih,acilis:oncekiKapanis,gelen:'',gelenIade:'',transfer:'',kapanis:'',mallara:String(finalVal),zayi:'',odenmez:''};p.entries.push(newEntry);const row={user_id:currentUser.id,urun_sira:parseInt(sira),gun:String(p.entries.length),tarih,acilis:oncekiKapanis||null,gelen:null,gelen_iade:null,transfer:null,kapanis:null,mallara_gore:String(finalVal),zayi:null,odenmez:null};const res=await sb.from('gunluk_girdiler').insert(row).select().single();if(res.data)p.entries[p.entries.length-1].dbId=res.data.id;created++;}}toast(`? ${created} yeni giriş (${tarih}), ${updated} güncellendi`,3500);closeSatisModal();selectedMonth=tarih.slice(0,7);renderPage();}
// SW tamamen kaldır + otomatik versiyon kontrolü
if('serviceWorker'in navigator&&location.protocol!=='file:'){
  navigator.serviceWorker.getRegistrations().then(regs=>{regs.forEach(r=>r.unregister());});
  caches.keys().then(keys=>keys.forEach(k=>caches.delete(k)));
}
(function(){
  const LOCAL_VER=document.querySelector('meta[name="app-version"]')?.content||'0';
  const STORED=localStorage.getItem('app_version');
  if(!STORED){localStorage.setItem('app_version',LOCAL_VER);return;}
  fetch('version.json?t='+Date.now(),{cache:'no-store'})
    .then(r=>r.json()).then(data=>{
      if(data.v&&data.v!==STORED){
        localStorage.setItem('app_version',data.v);
        location.reload(true);
      }
    }).catch(()=>{});
})();
// PWA install devre disi - cache sorunu onlemek icin
window.addEventListener('load',async()=>{showScreen('auth-screen');const{data:{session}}=await sb.auth.getSession();if(session){await onSignedIn(session.user);}else{showScreen('auth-screen');}sb.auth.onAuthStateChange(async(event,session)=>{if(event==='SIGNED_OUT')showScreen('auth-screen');});});
