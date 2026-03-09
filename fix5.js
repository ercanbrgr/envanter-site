const fs=require("fs");
let c=fs.readFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html","utf8");
const F="\uFFFD";
c=c.replace(F,"\u26A0\uFE0F \u00DC");
const rem=(c.match(/\uFFFD/g)||[]).length;
console.log("Remaining FFFD:",rem);
fs.writeFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html",c,"utf8");
