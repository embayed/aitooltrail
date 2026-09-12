import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','dist');
const files=JSON.parse(fs.readFileSync(path.join(root,'.generated.json'),'utf8'));
const titles=new Set(),descriptions=new Set();let refs=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+': one H1');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/name="description" content="([^"]+)"/)?.[1];
 assert(title&&!titles.has(title),file+': unique title');titles.add(title);
 assert(description&&!descriptions.has(description),file+': unique description');descriptions.add(description);
 for(const token of ['rel="canonical"','property="og:title"','property="og:description"','name="twitter:title"','name="robots"','lang="en"'])assert(html.includes(token),file+': missing '+token);
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(data['@graph'].length>=2);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?]*)(?:\?[^"]*)?"/g)){
   const url=match[1],target=path.join(root,url.endsWith('/')?url+'index.html':url);
   assert(fs.existsSync(target),file+': broken local reference '+url);refs++;
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g))assert(/alt="[^"]+"/.test(img[0]),file+': image missing ALT');
}
assert(fs.existsSync(path.join(root,'sitemap.xml')));assert(fs.existsSync(path.join(root,'robots.txt')));
console.log(`PASS: ${files.length} pages; ${refs} local references; unique metadata, H1, JSON-LD, and image ALT checks.`);
