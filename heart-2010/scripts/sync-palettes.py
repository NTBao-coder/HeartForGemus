"""Precompute soft portrait palettes. Requires Pillow: python3 -m pip install Pillow."""
import colorsys
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]


def portrait_palette(path):
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert('RGBA')
        image.thumbnail((96, 96))
        # Ignore transparent margins instead of treating them as black pixels.
        data = image.get_flattened_data() if hasattr(image, 'get_flattened_data') else image.getdata()
        pixels = [rgb[:3] for rgb in data if rgb[3] >= 128]
    if not pixels:
        return ['#edb69e', '#d995b5']
    sample = Image.new('RGB', (len(pixels), 1))
    sample.putdata(pixels)
    quantized = sample.quantize(colors=8)
    palette = quantized.getpalette()
    candidates = []
    for count, index in quantized.getcolors():
        rgb = tuple(palette[index * 3:index * 3 + 3])
        h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in rgb))
        # Favor visible color over black shadows and white image borders.
        score = count * (0.2 + s) * (0.2 if v < .12 or v > .96 and s < .1 else 1)
        candidates.append((score, h, s, rgb))
    candidates.sort(reverse=True)
    first = candidates[0]
    second = max(candidates[1:] or candidates, key=lambda c: c[0] * (0.1 + min(abs(c[1] - first[1]), 1 - abs(c[1] - first[1]))))
    def soften(color):
        _, hue, saturation, _ = color
        # Fixed lightness bounds make every palette safe beneath dark text.
        rgb = colorsys.hls_to_rgb(hue, .86, min(.38, max(.12, saturation * .55)))
        return '#' + ''.join(f'{round(c * 255):02x}' for c in rgb)
    return [soften(first), soften(second)]


if __name__ == '__main__':
    manifest = ROOT / 'members.json'
    members = json.loads(manifest.read_text())
    for member in members:
        member['palette'] = portrait_palette(ROOT / member['avatar'])
    manifest.write_text(json.dumps(members, ensure_ascii=False, indent=2) + '\n')
    print(f'Updated portrait palettes for {len(members)} members.')
