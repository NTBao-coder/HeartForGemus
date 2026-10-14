const assert = require('node:assert/strict');
require('../heart-layout.js');
const {packStars, overlaps} = globalThis.GemusLayout;
// Dense phone-sized clusters and long-label dimensions must retain disjoint tap targets.
for (const [width,height] of [[320,280],[390,480],[768,540],[1440,600]]) {
  for (const zoom of [0.7,1.08,1.5,2.6]) {
    const points=Array.from({length:33},(_,id)=>({id,x:width/2+Math.cos(id*2.4)*(20+id*4)*zoom,y:height/2+Math.sin(id*2.4)*(20+id*4)*zoom,depth:33-id,priority:id===12?100:0}));
    const packed=packStars(points,width,height,144);
    assert.ok(packed.length>0);
    for (let i=0;i<packed.length;i++) {
      const p=packed[i];
      assert.ok(p.rect.x>=0 && p.rect.y>=0 && p.rect.x+44<=width && p.rect.y+44<=height);
      for(let j=i+1;j<packed.length;j++) assert.ok(!overlaps(p.rect,packed[j].rect,0),'touch targets overlap');
      if(p.label) {
        assert.ok(p.label.x>=0 && p.label.y>=0 && p.label.x+p.label.w<=width && p.label.y+34<=height);
        for(const q of packed) assert.ok(!overlaps(p.label,q.rect,0),'name overlaps touch target');
        for(let j=i+1;j<packed.length;j++) if(packed[j].label) assert.ok(!overlaps(p.label,packed[j].label,0),'names overlap');
      }
    }
  }
}
assert.equal(packStars([{id:0,x:100,y:100,depth:5},{id:1,x:100,y:100,depth:1,priority:100}],320,400)[0].id,1);
console.log('PASS: 33 stars, 4 viewports × 4 zoom levels, non-overlapping labels/tap targets, bounds and search priority.');
