const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Find calcEntry function
const i=c.indexOf('function calcEntry');
console.log('calcEntry:',c.substring(i,i+500));
console.log('---');

// Find how mallara is displayed in table
const j=c.indexOf('mallara_gore');
console.log('mallara_gore display:',c.substring(j-50,j+200));
console.log('---');

// Find number formatting - toFixed, toLocaleString etc
const k=c.indexOf('toLocaleString');
if(k>0) console.log('toLocaleString at:',c.substring(k-50,k+100));

// Find sayima calculation
const l=c.indexOf('sayima');
console.log('sayima:',c.substring(l,l+200));
