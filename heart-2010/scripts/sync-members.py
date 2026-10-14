"""Sync avatars into members.json; preserve edited names/wishes by sourceAvatar.
Run on macOS: python3 heart-2010/scripts/sync-members.py
"""
import hashlib
import json
import re
import subprocess
import unicodedata
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = root / 'members.json'
old = {m['sourceAvatar']: m for m in json.loads(manifest.read_text())}
output = root / 'assets/members'
output.mkdir(parents=True, exist_ok=True)
files = sorted(p for p in (root / 'avatars').iterdir() if p.suffix.lower() in {'.png', '.jpg', '.jpeg'})
assert files, 'No member photos found; refusing to empty the member list.'
result, keep = [], set()
for photo in files:
    source = photo.relative_to(root).as_posix()
    member = dict(old.get(source, {}))
    stem = unicodedata.normalize('NFC', photo.stem).split('_')[0]
    name = re.sub(r'(?<=[a-zâăêôơưđ])(?=[A-ZĐ])', ' ', stem)
    identity = hashlib.sha256(source.encode()).hexdigest()[:12]
    member.setdefault('id', identity)
    member.setdefault('name', name)
    member.setdefault('wish', '')
    member['sourceAvatar'] = source
    digest = hashlib.sha256(photo.read_bytes()).hexdigest()[:12]
    for key, size in [('avatar', 1000), ('thumbnail', 180)]:
        dest = output / f'{identity}-{digest}-{size}{photo.suffix.lower()}'
        if not dest.exists():
            subprocess.run(['sips', '-Z', str(size), str(photo), '--out', str(dest)], check=True, capture_output=True)
        keep.add(dest)
        member[key] = dest.relative_to(root).as_posix()
    result.append(member)
assert len({m['id'] for m in result}) == len(result), 'Duplicate member IDs'
manifest.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
# Only generated images in this dedicated output directory are pruned.
for path in output.iterdir():
    if path.is_file() and path.suffix.lower() in {'.png', '.jpg', '.jpeg'} and path not in keep:
        path.unlink()
print(f'Synced {len(result)} photos; existing names and wishes preserved.')
