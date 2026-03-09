const fs=require('fs');
const c=fs.readFileSync('C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html','utf8');

// 1. Check version/cache
const verMatch=c.match(/v=(\d+)/);
console.log('1. Cache ver:',verMatch?verMatch[1]:'NOT FOUND');

// 2. Find loadData / init function
const i=c.indexOf('async function loadData');
console.log('2. loadData at:',i,i>0?c.substring(i,i+300):'NOT FOUND');

// 3. Find syncEntry - how saves work
const j=c.indexOf('async function syncEntry');
console.log('3. syncEntry at:',j,j>0?c.substring(j,j+300):'NOT FOUND');

// 4. Check for connection error handling
const k=c.indexOf('supabase') !== -1;
console.log('4. Supabase ref:',k);

// 5. Find renderPage/renderSidebar
const l=c.indexOf('function renderPage');
console.log('5. renderPage:',l>0?'found':'NOT FOUND');

// 6. Check topbar - user info display
const m=c.indexOf('topbar-user');
console.log('6. topbar-user at:',m,m>0?c.substring(m,m+100):'NOT FOUND');

// 7. Count ?-containing toasts (broken emoji)
const badToasts=(c.match(/toast\('[^']*\?[^']*'/g)||[]).filter(t=>!t.includes('Silme')).length;
console.log('7. Bad ? toasts:',badToasts);

// 8. SKT section
const n=c.indexOf('skt_takip');
console.log('8. SKT table:',n>0?'exists':'NOT FOUND');

// 9. Monthly lock
const o=c.indexOf('acikGunler');
console.log('9. acikGunler:',o>0?'exists at '+o:'NOT FOUND');
