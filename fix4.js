const fs=require("fs");
let c=fs.readFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html","utf8");
const F="\uFFFD";
const fixes=[
  ["Sat\uFFFD\u015F","Sat\u0131\u015F"],
  ["\u00FCr\u00FCn ad\uFFFD\uFFFD","\u00FCr\u00FCn ad\u0131"],
  ["\u00FCr\u00FCn ad\uFFFD","\u00FCr\u00FCn ad\u0131"],
  ["Yukar\uFFFD","Yukar\u0131"],
  ["'^':'\uFFFD\uFFFD\uFFFD'","'^':'v'"],
  ["'^':'\uFFFD'","'^':'v'"],
  ["tarih||'\uFFFD\uFFFD\uFFFD'","tarih||'?'"],
  ["tarih||'\uFFFD'","tarih||'?'"],
  ["tarih:'\uFFFD\uFFFD\uFFFD'","tarih:'?'"],
  ["tarih:'\uFFFD'","tarih:'?'"],
  ["G\uFFFDn Kilid","G\u00FCn Kilid"],
  ["A\uFFFD'}</button>","A\u00E7'}</button>"],
  ["Say\u0131s\uFFFD","Say\u0131s\u0131"],
  ["T\uFFFDm Kullan","T\u00FCm Kullan"],
  ["\uFFFDr\u00FCnler","\u00DCr\u00FCnler"],
  ["Kar\uFFFD\u0131la\u015F","Kar\u015F\u0131la\u015F"],
  ["\uFFFDr\uFFFDn Listesi","\u00DCr\u00FCn Listesi"],
  ["yap\u0131\u015Ft\u0131r\uFFFDn","yap\u0131\u015Ft\u0131r\u0131n"],
  ["\uFFFD\uFFFD Sat\u0131\u015F","\uD83D\uDCCA Sat\u0131\u015F"],
  ["\uFFFD\uFFFD \uFFFDr\u00FCn ad\u0131","\u270F\uFE0F \u00DCr\u00FCn ad\u0131"],
  ["\uFFFD\uFFFD G\u00FCn Kilid","\uD83D\uDCC5 G\u00FCn Kilid"],
  ["\uFFFD\uFFFD T\u00FCm Kullan","\uD83D\uDC65 T\u00FCm Kullan"],
  ["\uFFFD\uFFFD \u00DCr\u00FCnler","\uD83D\uDCE6 \u00DCr\u00FCnler"],
  ["\uFFFD\uFFFD Kar\u015F\u0131la\u015F","\uD83D\uDCCA Kar\u015F\u0131la\u015F"],
  ["\uFFFD\uFFFD \u00DCr\u00FCn Listesi","\uD83D\uDCE6 \u00DCr\u00FCn Listesi"],
];
let cnt=0;
for(const[from,to]of fixes){
  let idx=0;
  while((idx=c.indexOf(from,idx))>=0){
    c=c.substring(0,idx)+to+c.substring(idx+from.length);
    cnt++;idx+=to.length;
  }
}
const rem=(c.match(/\uFFFD/g)||[]).length;
console.log("Fixed:",cnt,"Remaining FFFD:",rem);
fs.writeFileSync("C:/Users/yapic/OneDrive/Belgeler/GitHub/index.html",c,"utf8");
