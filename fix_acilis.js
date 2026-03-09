const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Current code: last entry kapanış -> nextAcilis
const oldStr=`const last=p.entries.length?p.entries[p.entries.length-1]:null;const nextAcilis=last&&last.kapanis!==''?last.kapanis:'';`;

// New: search backwards for last non-empty kapanis
const newStr=`let nextAcilis='';for(let _i=p.entries.length-1;_i>=0;_i--){if(p.entries[_i].kapanis!==''&&p.entries[_i].kapanis!==null&&p.entries[_i].kapanis!==undefined){nextAcilis=p.entries[_i].kapanis;break;}}`;

if(c.includes(oldStr)){
  c=c.replace(oldStr,newStr);
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
  console.log('fixed - now searches backwards for last non-empty kapanis');
} else {
  console.log('NOT FOUND');
  const i=c.indexOf('nextAcilis');
  console.log(c.substring(Math.max(0,i-100),i+150));
}
