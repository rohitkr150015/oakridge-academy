const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4177);
const types = {'.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let requested;
 try { requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400).end('Bad request');return;}
 let file=path.resolve(root,'.'+requested);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end('Forbidden');return;}
 try {if(fs.statSync(file).isDirectory())file=path.join(file,'index.html'); const stat=fs.statSync(file);if(!stat.isFile())throw Error();res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});fs.createReadStream(file).pipe(res);}catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Page not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Oakridge Academy preview: http://127.0.0.1:${port}`));
