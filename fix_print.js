const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
const idx=c.indexOf('title="Yaz\u0131r">??</button>');
if(idx>=0){
  c=c.substring(0,idx)+'title="Yaz\u0131r">\uD83D\uDDA8\uFE0F</button>'+c.substring(idx+'title="Yaz\u0131r">??</button>'.length);
  console.log('fixed');
} else console.log('not found');
const rem=(c.match(/\?\?/g)||[]).length;
console.log('remaining:',rem);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
