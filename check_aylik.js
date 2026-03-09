const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');
// Find renderAdminAylikRapor
const i=c.indexOf('async function renderAdminAylikRapor');
const end=c.indexOf('\nasync function ',i+50);
console.log(c.substring(i,end));
