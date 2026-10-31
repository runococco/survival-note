// sitemap.xml を作り直す: python3 -m http.server 8765 を起動してから node tools/sitemap.js
// ページを追加・名前を変えたら実行してコミットする。
const {chromium}=require('playwright'),fs=require('fs');
const BASE='https://runococco.github.io/survival-note/';
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);
const L=await p.evaluate(()=>{const o=[];KEYS.forEach(k=>{o.push([k]);if(k!="mim"&&k!="calc"&&k!="core")(DATA[k].items||[]).forEach(x=>{if(!(k=="item"&&HIDX.indexOf(x.n)>=0))o.push([k,x.n])})});return o});
await b.close();
const day=new Date().toISOString().slice(0,10),x=s=>s.replace(/&/g,'&amp;');
const u=[BASE].concat(L.map(([k,n])=>BASE+'?p='+k+(n?'&n='+encodeURIComponent(n):'')));
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...new Set(u)].map(s=>'<url><loc>'+x(s)+'</loc><lastmod>'+day+'</lastmod></url>').join('\n')+'\n</urlset>\n');
console.log(u.length,'urls')})();
