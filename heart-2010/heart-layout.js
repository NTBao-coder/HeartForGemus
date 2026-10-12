/* Screen-space packing: touch targets first, then names in remaining space. */
(function (root) {
  function overlaps(a, b, gap = 4) {
    return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;
  }
  function packStars(points, width, height, nameWidth = 124) {
    const dots = [], names = [];
    const sorted = points.slice().sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.depth - a.depth || a.id - b.id);
    for (const p of sorted) {
      const rect = {x:p.x-22, y:p.y-22, w:44, h:44};
      if (rect.x < 2 || rect.y < 2 || rect.x + rect.w > width-2 || rect.y + rect.h > height-2) continue;
      if (dots.some(d => overlaps(rect, d.rect, 2))) continue;
      dots.push({...p, rect, label:null});
    }
    for (const p of dots) {
      const x = Math.max(3, Math.min(width-nameWidth-3, p.x-nameWidth/2));
      const options = [p.y+24, p.y-60];
      for (const y of options) {
        const r = {x, y, w:nameWidth, h:34};
        if (y < 3 || y + r.h > height-3) continue;
        if (dots.some(d => overlaps(r,d.rect,1)) || names.some(n => overlaps(r,n,4))) continue;
        p.label = r; names.push(r); break;
      }
    }
    return dots;
  }
  root.GemusLayout = {packStars, overlaps};
})(globalThis);
