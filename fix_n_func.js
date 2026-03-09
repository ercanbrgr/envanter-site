const fs=require('fs');
let c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

const oldN=`function n(v){
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

const newN=`function n(v){
  if(v===''||v===null||v===undefined)return 0;
  let s=String(v).trim();
  if(s.indexOf('.')!==-1&&s.indexOf(',')!==-1){
    // Both exist: dot=thousands, comma=decimal  e.g. 1.050,5 -> 1050.5
    s=s.replace(/\\./g,'').replace(',','.');
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
}`;

if(c.includes(oldN)){
  c=c.replace(oldN,newN);
  console.log('FIXED n() function');
  fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html',c,'utf8');
} else {
  console.log('NOT FOUND - searching...');
  const i=c.indexOf('function n(v)');
  console.log(c.substring(i,i+200));
}
