import numpy as np, json
from PIL import Image
raw = np.asarray(Image.open('folio-raw.png').convert('RGBA')).astype(np.float32)
H, W = raw.shape[:2]
rgb, a = raw[..., :3] / 255.0, raw[..., 3:] / 255.0
rs = np.random.RandomState(1611)
yy, xx = np.mgrid[0:H, 0:W]

def lum(c): return (c[..., 0] * .299 + c[..., 1] * .587 + c[..., 2] * .114)[..., None]

# classic: gentle grain, a touch more saturation
grain = (rs.rand(H, W)[..., None] - .5) * .07
cl = np.clip(lum(rgb) + (rgb - lum(rgb)) * 1.06 + grain, 0, 1)

# carta: desaturate toward paper, mottle, and hatch the darker tones
paper = np.array([239, 228, 200]) / 255.0
L = lum(rgb)
ca = L + (rgb - L) * .78
ca = ca * .9 + paper * .1 * (L > .25)
mott = np.asarray(Image.fromarray((rs.rand(H // 6 + 1, W // 6 + 1) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)).astype(np.float32)[..., None] / 255.0
ca = ca * (.93 + mott * .1)
hatch = ((xx + yy) % 6 < 1.2).astype(np.float32)[..., None]
hatch2 = ((xx - yy) % 7 < 1.0).astype(np.float32)[..., None]
dark = np.clip((.62 - L) / .5, 0, 1)
ca = ca * (1 - hatch * dark * .32 - hatch2 * np.clip((.4 - L) / .4, 0, 1) * .25)
ca = np.clip(ca + (rs.rand(H, W)[..., None] - .5) * .05, 0, 1)
# warm ink
ink = (L < .2).astype(np.float32)
ca = ca * (1 - ink * .3) + np.array([43, 33, 24]) / 255.0 * ink * .3

def save(c, name):
    out = np.concatenate([c, a], -1)
    im = Image.fromarray((out * 255).round().astype(np.uint8), 'RGBA')
    im.save(name + '-full.png')
    im.resize((1536, 960), Image.LANCZOS).save(name + '.webp', quality=88, method=6)
save(cl, 'classic-folio'); save(ca, 'carta-folio')

# tight rects (nominal 2048 x 1280) and occlusion bands for the house sprites
alpha = raw[..., 3]
rects, bands = [], {}
for i in range(37):
    cx, cy = (i % 8) * 256, (i // 8) * 256
    m = alpha[cy:cy + 256, cx:cx + 256] > 12
    ys, xs = np.where(m)
    x0, x1, y0, y1 = max(0, xs.min() - 2), min(255, xs.max() + 2), max(0, ys.min() - 2), min(255, ys.max() + 2)
    rects.append([cx + int(x0), cy + int(y0), int(x1 - x0 + 1), int(y1 - y0 + 1)])
    if i >= 33:
        sub = m[y0:y1 + 1, x0:x1 + 1]
        h, w = sub.shape
        rows = []
        for k in range(1, 28):
            y = min(h - 1, int(k / 28 * h))
            xs2 = np.where(sub[y])[0]
            if len(xs2): rows.append([round(k / 28, 3), round(xs2.min() / w, 3), round(xs2.max() / w, 3)])
        bands[i] = rows
json.dump({'rects': rects, 'bands': bands}, open('folio-meta.json', 'w'))
print(rects)
