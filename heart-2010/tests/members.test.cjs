const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'), members=JSON.parse(fs.readFileSync(path.join(root,'members.json')));
class Element {
 constructor(){this.hidden=false;this.value='';this.children=[];this.events={};this.dataset={};this.classList={add(){},remove(){}};this.parentElement={classList:this.classList};}
 addEventListener(event,fn){this.events[event]=fn;} append(...nodes){nodes.forEach(n=>n.parentElement=this);this.children.push(...nodes);} replaceChildren(){this.children=[];}setAttribute(){}focus(){}
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const elements=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
let selectStar; const body=new Element();
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),{
 document:{body,getElementById:id=>{assert.ok(elements[id],id);return elements[id]},createElement:()=>new Element(),addEventListener(){}},
 window:{scrollTo(){},gemusHeart:{setMembers(data,select){assert.equal(data.length,members.length);selectStar=select;}}},
 fetch:async file=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,file)))})
});
setImmediate(()=>{
 const files=fs.readdirSync(path.join(root,'avatars')).filter(f=>/\.(png|jpe?g)$/i.test(f));
 assert.equal(members.length,files.length);assert.equal(elements.members.children.length,files.length);
 const sources=new Set(members.map(m=>m.sourceAvatar));assert.equal(sources.size,files.length);
 assert.deepEqual([...sources].sort(),files.map(f=>'avatars/'+f).sort());
 members.forEach(m=>{
  for(const key of ['avatar','thumbnail','sourceAvatar']) assert.ok(fs.existsSync(path.join(root,m[key])),m[key]);
  selectStar(m); assert.equal(body.dataset.view,'letter');assert.equal(elements['letter-title'].textContent,m.name);assert.equal(elements['letter-photo'].src,m.avatar);assert.equal(elements['personal-note'].hidden,!m.wish.trim());
  elements['letter-photo'].onerror();assert.equal(elements['letter-photo'].src,m.sourceAvatar);
  elements['close-letter'].events.click();assert.equal(body.dataset.view,'heart');
 });
 elements.search.value='Pham Huu Phuong Anh';elements.search.events.input();assert.equal(elements.members.children.length,1);
 selectStar(members[0]);assert.equal(elements['letter-photo'].hidden,false);
 console.log(`PASS: all ${files.length} sources covered; each star opens its own name/photo, fallback, empty wish, close, search, and next selection.`);
});
