const fs = require("fs");
const current = fs.readFileSync("C:\\Users\\yapic\\OneDrive\\Belgeler\\GitHub\\index.html", "utf8");
const FFFD = "\uFFFD";
let idx = 0;
while ((idx = current.indexOf(FFFD, idx)) >= 0) {
  const ctx = current.substring(Math.max(0,idx-20), Math.min(current.length,idx+20));
  console.log(`pos ${idx}: "${ctx.replace(/\uFFFD/g,"??")}"`);
  idx++;
}
