const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
let fixes=0;
function rep(from,to,desc){
  const cnt=(c.split(from)).length-1;
  if(cnt>0){c=c.split(from).join(to);console.log('FIX('+cnt+'x): '+desc);fixes++;}
  else console.log('SKIP: '+desc);
}

// Current n() function - WRONG: dot is treated as decimal
// function n(v){return parseFloat(String(v).replace(',','.'))||0;}
// This makes 1.050 → 1.05 (WRONG if user meant 1050)
// Also makes 1,050 → 1.050 → 1.05 (WRONG if user meant 1050)

// FIX: In Turkish context:
// - comma (,) = decimal separator: "1,5" = 1.5
// - dot (.) = thousands separator: "1.050" = 1050
// So we must: remove dots (thousands), replace comma with dot (decimal)
// "1.050,5" → remove dots → "1050,5" → replace comma → "1050.5" → 1050.5

const oldN='function n(v){return parseFloat(String(v).replace(\',\',\'.\'))||0;}';
const newN=`function n(v){
  if(v===''||v===null||v===undefined)return 0;
  let s=String(v).trim();
  // Handle Turkish number format: 1.050,5 -> 1050.5
  // If both dot and comma exist: dot=thousands, comma=decimal
  if(s.indexOf('.')!==-1&&s.indexOf(',')!==-1){
    s=s.replace(/\\./g,'').replace(',','.');
  } else if(s.indexOf(',')!==-1){
    // Only comma: could be decimal (1,5) or thousands (1,050)
    // If comma has exactly 3 digits after it, treat as thousands separator
    const afterComma=s.split(',')[1];
    if(afterComma&&afterComma.length===3&&!afterComma.match(/[^0-9]/)){
      s=s.replace(',',''); // 1,050 → 1050
    } else {
      s=s.replace(',','.'); // 1,5 → 1.5
    }
  }
  // Only dot: could be decimal (1.5) or thousands (1.050)
  else if(s.indexOf('.')!==-1){
    const afterDot=s.split('.')[1];
    if(afterDot&&afterDot.length===3&&!afterDot.match(/[^0-9]/)){
      s=s.replace('.',''); // 1.050 → 1050
    }
    // else keep as is: 1.5 → 1.5
  }
  return parseFloat(s)||0;
}`;

rep(oldN,newN,'n() function - Turkish number format fix');

// Also update fmt() to handle large numbers with dot thousands separator
const oldFmt=`function fmt(v){if(v===''||v===null||v===undefined||v===0)return '';const num=parseFloat(String(v).replace(',','.'));if(isNaN(num)||num===0)return '';const s=(Math.round(num*1000)/1000).toString().replace('.',',');return s;}`;
const newFmt=`function fmt(v){if(v===''||v===null||v===undefined)return '';const num=n(v);if(isNaN(num)||num===0)return '';let s=(Math.round(num*1000)/1000).toFixed(3);// Remove trailing zeros after decimal
s=s.replace(/\\.?0+$/,'');if(s.indexOf('.')!==-1)s=s.replace('.',',');// Add thousands dot for numbers >= 1000
if(Math.abs(num)>=1000){const parts=s.split(',');parts[0]=parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g,'.');s=parts.join(',');}return s;}`;
rep(oldFmt,newFmt,'fmt() function - Turkish thousands format');

const oldFmtOr0=`function fmtOr0(v){const num=parseFloat(String(v).replace(',','.'));if(isNaN(num))return '0';return (Math.round(num*1000)/1000).toString().replace('.',',');}`;
const newFmtOr0=`function fmtOr0(v){const num=n(v);if(isNaN(num))return '0';let s=(Math.round(num*1000)/1000).toFixed(3);s=s.replace(/\\.?0+$/,'');if(s.indexOf('.')!==-1)s=s.replace('.',',');if(Math.abs(num)>=1000){const parts=s.split(',');parts[0]=parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g,'.');s=parts.join(',');}return s||'0';}`;
rep(oldFmtOr0,newFmtOr0,'fmtOr0() function update');

rep('v=202602240300','v=202602240400','ver');
rep('content="202602240300"','content="202602240400"','ver meta');

console.log('\nTotal fixes:',fixes);
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
console.log('Saved.');
