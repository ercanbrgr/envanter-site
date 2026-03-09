const fs=require("fs");
const src="C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html";
let c=fs.readFileSync(src,"utf8");
const startMark="async function renderAdminUrunler(){";
const endMark="\nasync function adminUrunSil";
const idx=c.indexOf(startMark);
const end=c.indexOf(endMark,idx);
if(idx<0||end<0){console.log("NOT FOUND idx:"+idx+" end:"+end);process.exit(1);}
const oldFunc=c.substring(idx,end);
console.log("oldLen:"+oldFunc.length);
const newFunc=`async function renderAdminUrunler(){
const pc=document.getElementById("page-content");
pc.innerHTML="<div class=\\"empty\\"><p>Yukleniyor...</p></div>";
let profiller=adminData.profiller||[];
let urunler=adminData.urunler||[];
if(!profiller.length){const r2=await sb.from("sube_profiller").select("*");profiller=r2.data||[];}
if(!urunler.length&&profiller.length){const r3=await sb.from("urunler").select("*").order("sira");urunler=r3.data||[];}
if(!profiller.length){pc.innerHTML="<div class=\\"empty\\"><p>Sube bulunamadi</p></div>";return;}
const ilkSube=profiller[0];
const subeUrunler=urunler.filter(u=>u.user_id===ilkSube.user_id);
window._adminUrunlerList=subeUrunler;
let html="<div class=\\"admin-panel\\"><h2>Admin Paneli <span class=\\"admin-badge\\">TUM SUBELER</span></h2>";
html+="<div style=\\"display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap\\">";
html+="<button onclick=\\"renderAdminAnaSayfa()\\" style=\\"padding:8px 14px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Subeler</button>";
html+="<button onclick=\\"renderAdminUrunler()\\" style=\\"padding:8px 14px;background:#e67e22;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Urunler</button>";
html+="<button onclick=\\"renderAdminAylikRapor()\\" style=\\"padding:8px 14px;background:var(--dark);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Aylik Rapor</button>";
html+="<button onclick=\\"renderAdminKarsilastirma()\\" style=\\"padding:8px 14px;background:#0891b2;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Kiyaslama</button>";
html+="<button onclick=\\"adminTumExcel()\\" style=\\"padding:8px 14px;background:#27ae60;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Excel</button>";
html+="<button onclick=\\"renderAdminYonetimi()\\" style=\\"padding:8px 14px;background:#8e44ad;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Adminler</button>";
html+="<button onclick=\\"renderAdminSubeYonetimi()\\" style=\\"padding:8px 14px;background:#0f766e;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer\\">Sube Yonetimi</button>";
html+="</div>";
html+="<div style=\\"background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);\\">";
html+="<div style=\\"display:flex;align-items:center;justify-content:space-between;margin-bottom:14px\\">";
html+="<div><div style=\\"font-size:16px;font-weight:800\\">Urun Listesi ("+subeUrunler.length+" urun)</div>";
html+="<div style=\\"font-size:11px;color:#aaa\\">Yeni urun eklenince tum subelere gider</div></div>";
html+="<button onclick=\\"adminYeniUrunEkle()\\" style=\\"padding:10px 18px;background:var(--orange);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer\\">+ Yeni Urun Ekle</button>";
html+="</div><div style=\\"overflow-x:auto\\"><table style=\\"width:100%;border-collapse:collapse;font-size:13px\\">";
html+="<thead><tr style=\\"background:#f8f8f8\\"><th style=\\"padding:10px;text-align:left;border-bottom:2px solid #eee\\">Sira</th>";
html+="<th style=\\"padding:10px;text-align:left;border-bottom:2px solid #eee\\">Urun Adi</th>";
html+="<th style=\\"padding:10px;text-align:left;border-bottom:2px solid #eee\\">Birim</th>";
html+="<th style=\\"padding:10px;text-align:center;border-bottom:2px solid #eee\\">Sube</th>";
html+="<th style=\\"padding:10px;text-align:center;border-bottom:2px solid #eee\\">Sil</th></tr></thead><tbody>";
subeUrunler.forEach((u,i2)=>{
  html+="<tr style=\\"border-bottom:1px solid #f0f0f0\\">";
  html+="<td style=\\"padding:10px;color:#aaa;font-size:12px\\">"+(u.sira+1)+"</td>";
  html+="<td style=\\"padding:10px;font-weight:700\\">"+u.ad+"</td>";
  html+="<td style=\\"padding:10px\\"><span style=\\"background:#f0f0f0;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700\\">"+(u.birim||"Adet")+"</span></td>";
  html+="<td style=\\"padding:10px;text-align:center\\"><span style=\\"background:#e8f5e9;color:#27ae60;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700\\">"+profiller.length+" sube</span></td>";
  html+="<td style=\\"padding:10px;text-align:center\\"><button onclick=\\"adminUrunSilByIdx("+i2+")\\" style=\\"padding:5px 12px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer\\">Sil</button></td>";
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
}`;
c=c.substring(0,idx)+newFunc+c.substring(idx+oldFunc.length);
fs.writeFileSync(src,c,"utf8");
console.log("Saved OK. Length:"+c.length);
