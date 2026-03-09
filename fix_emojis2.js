const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixed=0;
function rep(from,to){
  let idx=0,cnt=0;
  while((idx=c.indexOf(from,idx))>=0){c=c.substring(0,idx)+to+c.substring(idx+from.length);cnt++;idx+=to.length;}
  if(cnt>0) console.log(' '+cnt+'x: '+from.substring(0,50));
  fixed+=cnt;
}

rep('splash-burger\">??</div>','splash-burger\">\uD83C\uDF54</div>');
rep('durumu\">??</span>','durumu\">\uD83D\uDD04</span>');
rep('title="Yaz\u0131r">??</button>','title="Yaz\u0131r">\uD83D\uDDA8\uFE0F</button>');
rep('>?? \xDCR\xDCNLER</span>','>\uD83D\uDCE6 \xDCR\xDCNLER</span>');
rep('>?? Min Stok Uya','>⚠️ Min Stok Uya');
rep('>?? G\xFCnl\xFCk Rapor (','>\uD83D\uDCCB G\xFCnl\xFCk Rapor (');
rep('>?? Sat\u0131\u015F Raporu Y\xFCkle</button>','>\uD83D\uDCCA Sat\u0131\u015F Raporu Y\xFCkle</button>');
rep('>?? Sat\u0131\u015F Raporu Analizi</h3>','>\uD83D\uDCCA Sat\u0131\u015F Raporu Analizi</h3>');
rep('>?? AZ</span>','>⚠️ AZ</span>');
rep('class="ico">??</div><p>Hen\xFCz','class="ico">\uD83D\uDCCB</div><p>Hen\xFCz');
rep('class="ico">??</div><p>${ayLabel}','class="ico">\uD83D\uDCCB</div><p>${ayLabel}');
rep("font-weight:700;flex:1\">?? '+s.urun_adi",'font-weight:700;flex:1">\uD83D\uDCE6 \'+s.urun_adi');
rep("(state==='ok')el.textContent='??';",'(state===\'ok\')el.textContent=\'✅\';');
rep("==='saving')el.textContent='??';",'===\'saving\')el.textContent=\'\uD83D\uDD04\';');
rep("==='err')el.textContent='??';",'===\'err\')el.textContent=\'⚠️\';');

// Handle edit button ?? 
rep("teEntry(${idx})\">?</button>`:'??'}",'teEntry(${idx})\">✏️</button>`:\'-\'}');

// Remaining ?? - show context for any still there
const remaining=(c.match(/\?\?/g)||[]).length;
console.log('Total fixed:',fixed,'Remaining ??:',remaining);

// Show remaining for manual review
if(remaining>0){
  const re=/\?\?/g;let m;
  while((m=re.exec(c))!==null){
    const ctx=c.substring(Math.max(0,m.index-40),m.index+40);
    if(!ctx.includes('null??') && !ctx.includes('acilis??') && !ctx.includes('gelen??') && !ctx.includes('minStok:u.min_stok??')){
      console.log(' UNFIXED @ '+m.index+': '+JSON.stringify(ctx));
    }
  }
}

fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Done. Written to index.html');
