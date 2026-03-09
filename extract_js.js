const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
// Extract all script content
const scripts=[];const re=/<script[^>]*>([\s\S]*?)<\/script>/g;let m;
while((m=re.exec(c))!==null){if(m[1].trim())scripts.push(m[1]);}
const allJs=scripts.join('\n');
fs.writeFileSync('C:/Users/yapic/OneDrive/Belgeler/verdent-projects/new-project/envanter-site/test_js.js',allJs,'utf8');
console.log('JS extracted, size:',allJs.length);
