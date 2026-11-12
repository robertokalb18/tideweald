#!/usr/bin/env python3
"""Measures how much of each sprite's box on its sheet the drawing fills, and writes
art-source/sprite-extents.json. tests/scale.test.js multiplies these by the sizes in src/render/scale.js to hold
every map object to the proportion rules in docs/SCALE.md.

Run after changing a sheet in public/art/carta or a sprite rectangle:
    node tools/sprite-rects.mjs > /tmp/rects.json && python3 tools/measure-sprites.py /tmp/rects.json
Needs Pillow with WebP support and numpy.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent.parent
rects = json.load(open(sys.argv[1]))
files = {'units': 'units-v13', 'villagers': 'villagers-v9'}
out = {}
for atlas, rs in rects.items():
    im = Image.open(root / 'public/art/carta' / f'{files.get(atlas, atlas)}.webp').convert('RGBA')
    alpha = np.array(im)[:, :, 3]
    out[atlas] = []
    for r in rs:
        k = im.size[0] / r['iw']
        x0, y0, x1, y1 = [int(round(v * k)) for v in (r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])]
        solid = alpha[y0:y1, x0:x1] > 40
        if not solid.any():
            out[atlas].append(None)
            continue
        ys = np.where(solid.any(axis=1))[0]
        xs = np.where(solid.any(axis=0))[0]
        longer = max(r['w'], r['h']) * k
        # w, h: the drawing's width and height as a share of the box's longer side (what `size` scales).
        out[atlas].append({'w': round(float(xs[-1] - xs[0] + 1) / longer, 3), 'h': round(float(ys[-1] - ys[0] + 1) / longer, 3)})
    while out[atlas] and out[atlas][-1] is None:
        out[atlas].pop()
(root / 'art-source/sprite-extents.json').write_text(json.dumps(out, indent=0).replace('\n"', ' "').replace('{ ', '{').replace('\n}', '}') + '\n')
print({a: len(v) for a, v in out.items()})
