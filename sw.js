// サバイバルノート service worker
// ページ本体は毎回ネットから最新を取り（オフライン時だけキャッシュ）、
// 名前にハッシュが付いた画像 img/xxxxxxxxxxxx.webp は中身が変わらないのでキャッシュから即表示する。
var C="sn-v1";
self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!=C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function put(req,res){if(res&&res.ok&&res.type=="basic"){var c=res.clone();caches.open(C).then(function(x){x.put(req,c)})}return res}
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!="GET")return;var u=new URL(r.url);if(u.origin!=location.origin)return;
if(r.mode=="navigate"){e.respondWith(fetch(r).then(function(res){return put(r,res)}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match("./")})}));return}
if(/\/img\/[0-9a-f]{12}\.webp$/.test(u.pathname)){e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){return put(r,res)})}));return}
if(/\/img\//.test(u.pathname)){e.respondWith(caches.match(r).then(function(m){var f=fetch(r).then(function(res){return put(r,res)});if(m){f.catch(function(){});return m}return f}))}
});
