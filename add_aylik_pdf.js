const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Find where to insert the new functions - before the closing </script>
const insertBefore='function pdfAc(html)';
const insertIdx=c.indexOf(insertBefore);
if(insertIdx<0){console.log('NOT FOUND: pdfAc');process.exit(1);}

const newFunctions=`
async function renderAdminAylikRapor(){
  const pc=document.getElementById('page-content');
  const now=new Date();
  const defaultAy=now.toISOString().slice(0,7);
  const profiller=adminData?.profiller||[];
  const subeOptions=profiller.map((p,i)=>`<option value="${i}">${p.sube_adi||p.email}</option>`).join('');
  pc.innerHTML=\`<div style="padding:4px 0 16px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <button onclick="renderAdminAnaSayfa()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#e85d04">←</button>
      <h2 style="margin:0;font-size:18px">📊 Aylık Rapor</h2>
    </div>
    <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end">
        <div>
          <label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">ŞUBE</label>
          <select id="aylik-sube" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none">${subeOptions}</select>
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:#999;display:block;margin-bottom:4px">AY</label>
          <input type="month" id="aylik-ay" value="${defaultAy}" style="width:100%;padding:10px;border:2px solid #eee;border-radius:8px;font-size:13px;outline:none">
        </div>
        <button onclick="aylikRaporGoster()" style="padding:11px 18px;background:var(--orange);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap">Göster →</button>
      </div>
    </div>
    <div id="aylik-rapor-icerik"></div>
  </div>\`;
}

async function aylikRaporGoster(){
  const subeIdx=parseInt(document.getElementById('aylik-sube')?.value)||0;
  const ay=document.getElementById('aylik-ay')?.value;
  if(!ay){toast('Ay seçin');return;}
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('Şube bulunamadı');return;}
  const el=document.getElementById('aylik-rapor-icerik');
  el.innerHTML='<div style="text-align:center;padding:30px;color:#aaa">⏳ Yükleniyor...</div>';
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([
    sb.from('urunler').select('*').eq('user_id',userId).order('sira'),
    sb.from('gunluk_girdiler').select('*').eq('user_id',userId)
  ]);
  if(!urunler||!girdiler){el.innerHTML='<div style="color:#e74c3c;padding:20px">Veri alınamadı.</div>';return;}
  const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
  if(!ayGirdiler.length){el.innerHTML='<div style="background:#fff;border-radius:12px;padding:30px;text-align:center;color:#aaa">Bu ay için veri bulunamadı.</div>';return;}
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  let html=\`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
    <div style="font-size:15px;font-weight:700;color:#1a1a2e">📊 \${profil.sube_adi||profil.email} — \${monthName}</div>
    <button onclick="aylikPdfAl(\${subeIdx},'\${ay}')" style="padding:9px 16px;background:#27ae60;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer">📋 PDF Al</button>
  </div>\`;
  urunler.forEach(u=>{
    const uGirdiler=ayGirdiler.filter(g=>g.urun_sira===u.sira).sort((a,b)=>(a.gun||0)-(b.gun||0));
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    let satirlar=uGirdiler.map((g,idx)=>{
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const{sayima,fark}=calcEntry(e);
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60;font-weight:700':fark<0?'color:#e74c3c;font-weight:700':'color:#999';
      return \`<tr style="\${idx%2?'background:#f9f9f9':''}">
        <td style="text-align:center;color:#999;font-size:11px">\${g.gun||idx+1}</td>
        <td style="text-align:center;font-size:11px">\${g.tarih||''}</td>
        <td style="text-align:center">\${fmt(g.acilis)}</td>
        <td style="text-align:center">\${fmt(g.gelen)}</td>
        <td style="text-align:center">\${fmt(g.kapanis)}</td>
        <td style="text-align:center">\${fmt(sayima)}</td>
        <td style="text-align:center">\${fmt(g.mallara_gore)}</td>
        <td style="text-align:center">\${fmt(g.zayi)}</td>
        <td style="text-align:center;\${fc}">\${fark!==0?(fark>0?'+':'')+fmt(fark):''}</td>
      </tr>\`;
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    html+=\`<div style="background:#fff;border-radius:12px;margin-bottom:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.07)">
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:14px;font-weight:800">📦 \${u.ad}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.6)">\${u.birim||''} · \${uGirdiler.length} gün</span>
      </div>
      <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:#f5f5f5">
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">GÜN#</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">TARİH</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">AÇILIŞ</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">GELEN</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">KAPANIŞ</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">SAYIMA</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">MALLARA</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">ZAYİ</th>
          <th style="padding:6px 8px;text-align:center;font-size:10px;color:#999">FARK</th>
        </tr></thead>
        <tbody>\${satirlar}</tbody>
        <tfoot><tr style="background:#f0f4ff;font-weight:800;border-top:2px solid #e0e0e0">
          <td colspan="8" style="padding:8px 12px;text-align:right;font-size:12px;color:#666">
            TOPLAM FARK &nbsp;|&nbsp; 
            <span style="color:#27ae60">+\${artiGun} gün</span> &nbsp;
            <span style="color:#e74c3c">-\${eksiGun} gün</span>
          </td>
          <td style="padding:8px 10px;text-align:center;font-size:14px;color:\${toplamRenk}">\${toplamFark>0?'+':''}\${fmt(toplamFark)||'0'}</td>
        </tr></tfoot>
      </table>
      </div>
    </div>\`;
  });
  el.innerHTML=html;
}

async function aylikPdfAl(subeIdx,ay){
  const profil=adminData?.profiller?.[subeIdx];
  if(!profil){toast('Şube bulunamadı');return;}
  const userId=profil.user_id;
  const [{data:urunler},{data:girdiler}]=await Promise.all([
    sb.from('urunler').select('*').eq('user_id',userId).order('sira'),
    sb.from('gunluk_girdiler').select('*').eq('user_id',userId)
  ]);
  if(!urunler||!girdiler){toast('Veri alınamadı');return;}
  const ayGirdiler=girdiler.filter(g=>g.tarih&&g.tarih.startsWith(ay));
  const monthName=new Date(ay+'-01').toLocaleDateString('tr-TR',{year:'numeric',month:'long'});
  const subeBilgi=profil.sube_adi||profil.email;
  let icerik='';
  urunler.forEach(u=>{
    const uGirdiler=ayGirdiler.filter(g=>g.urun_sira===u.sira).sort((a,b)=>(a.gun||0)-(b.gun||0));
    if(!uGirdiler.length)return;
    let toplamFark=0,artiGun=0,eksiGun=0;
    let satirlar=uGirdiler.map((g,idx)=>{
      const e={acilis:g.acilis,gelen:g.gelen,gelenIade:g.gelen_iade,transfer:g.transfer,kapanis:g.kapanis,mallara:g.mallara_gore,zayi:g.zayi,odenmez:g.odenmez};
      const{sayima,fark}=calcEntry(e);
      toplamFark+=fark;if(fark>0)artiGun++;else if(fark<0)eksiGun++;
      const fc=fark>0?'color:#27ae60':fark<0?'color:#e74c3c':'';
      return \`<tr style="\${idx%2?'background:#f9f9f9':''}"><td>\${g.gun||idx+1}</td><td>\${g.tarih||''}</td><td>\${fmt(g.acilis)}</td><td>\${fmt(g.gelen)}</td><td>\${fmt(g.kapanis)}</td><td>\${fmt(sayima)}</td><td>\${fmt(g.mallara_gore)}</td><td>\${fmt(g.zayi)}</td><td style="font-weight:700;\${fc}">\${fark!==0?(fark>0?'+':'')+fmt(fark):''}</td></tr>\`;
    }).join('');
    const toplamRenk=toplamFark>0?'#27ae60':toplamFark<0?'#e74c3c':'#999';
    icerik+=\`<div class="urun-blok">
      <div class="urun-baslik">📦 \${u.ad} <span class="birim">\${u.birim||''} &nbsp;·&nbsp; \${uGirdiler.length} gün</span></div>
      <table><thead><tr><th>GÜN#</th><th>TARİH</th><th>AÇILIŞ</th><th>GELEN</th><th>KAPANIŞ</th><th>SAYIMA</th><th>MALLARA</th><th>ZAYİ</th><th>FARK</th></tr></thead>
      <tbody>\${satirlar}</tbody>
      <tfoot><tr class="toplam-row"><td colspan="8" style="text-align:right">TOPLAM FARK &nbsp;·&nbsp; <span style="color:#27ae60">+\${artiGun} gün</span> <span style="color:#e74c3c"> -\${eksiGun} gün</span></td><td style="color:\${toplamRenk};font-weight:800;font-size:13px">\${toplamFark>0?'+':''}\${fmt(toplamFark)||'0'}</td></tr></tfoot>
      </table></div>\`;
  });
  const html=\`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Aylık Rapor - \${subeBilgi} - \${monthName}</title><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:9px;color:#222;background:#fff}
    .header{background:#1a1a2e;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .header h1{font-size:16px;color:#e85d04;margin:0}
    .header .meta{font-size:10px;color:rgba(255,255,255,0.6)}
    .urun-blok{margin:0 8px 16px;border:1px solid #e0e0e0;border-radius:6px;overflow:hidden;page-break-inside:avoid}
    .urun-baslik{background:#1a1a2e;color:#fff;padding:7px 12px;font-size:12px;font-weight:800}
    .birim{font-size:9px;color:rgba(255,255,255,0.5);font-weight:400}
    table{width:100%;border-collapse:collapse}
    th{background:#f0f0f0;padding:4px 6px;text-align:center;font-size:8px;color:#666;font-weight:700;border-bottom:2px solid #ddd}
    td{padding:3px 6px;text-align:center;border-bottom:1px solid #eee;font-size:9px}
    .toplam-row{background:#f5f8ff;border-top:2px solid #ddd;font-weight:700}
    .footer{margin:16px 8px 8px;font-size:8px;color:#aaa;border-top:1px solid #eee;padding-top:6px;display:flex;justify-content:space-between}
    @media print{@page{size:A4 portrait;margin:0.5cm}body{font-size:8px}.urun-blok{page-break-inside:avoid}}
  </style></head><body>
  <div class="header">
    <div><h1>Aylık Envanter Raporu</h1><div class="meta">\${subeBilgi} &nbsp;·&nbsp; \${monthName}</div></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.4)">Ercan BRGR | YPC.TECNO</div>
  </div>
  \${icerik}
  <div class="footer"><span>Ercan BRGR Envanter Sistemi — YPC.TECNO | Ufuk Yapıcı</span><span>Oluşturuldu: \${new Date().toLocaleString('tr-TR')}</span></div>
  </body></html>\`;
  pdfAc(html);
}

`;

c=c.substring(0,insertIdx)+newFunctions+c.substring(insertIdx);
console.log('Inserted',newFunctions.length,'chars before pdfAc');
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
