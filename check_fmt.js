const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// Find table row rendering with mallara
const i=c.indexOf('mallara}</td>');
if(i>0) console.log('mallara td:',c.substring(i-100,i+20));

const j=c.indexOf('sayima}</td>');
if(j>0) console.log('sayima td:',c.substring(j-100,j+20));

// Find how numbers are formatted for display in table
// Look for the cell rendering function
const k=c.indexOf('fark}</td>');
if(k>0) console.log('fark td:',c.substring(k-100,k+20));

// Find the full table row template
const l=c.indexOf('class="tbl-row"');
if(l>0) console.log('row:',c.substring(l,l+400));

// Find fmt or format function
const m=c.indexOf('function fmt(');
if(m>0) console.log('fmt func:',c.substring(m,m+100));
else console.log('NO fmt function found');

// Find how display values are shown (maybe just raw numbers without formatting)
const n2=c.indexOf('.toFixed(');
if(n2>0) console.log('toFixed:',c.substring(n2-30,n2+50));
else console.log('NO toFixed found');
