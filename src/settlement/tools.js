// Recovered from the Tideweald v16.11 build. Module: settlement/tools
import { placementPreview } from '../progression/campaign.js';
import { isBridge } from './bridge-catalog.js';
import { bridgeAt, bridgePlan, bridgeTiles, removeBridge } from './bridges.js';
import {
  BUILDING_SIZES,
  Br,
  CATALOG,
  GRID_H,
  GRID_W,
  Hr,
  Ia,
  MAP_LIMIT,
  MAX_POPULATION,
  Ur,
  clamp,
  fs,
  isBuildingItem,
  jp,
  uf,
  wn,
} from '../world/catalog.js';
import { canStand, habitatOk, isWater } from '../world/ecosystem.js';
import { df } from '../world/wildlife.js';
import { announce, cellAt, islandTime, nearby, random, strokeTotal } from '../world/world.js';

function addItem(e, t, a, n, r = 0) {
  let o = CATALOG[t],
    l = cellAt(e, a, n),
    s = (p) => (announce(e, p), { ok: !1, message: p });
  if (!o) return s('Choose something from Supplies first.');
  if (!l || !Number.isFinite(a) || !Number.isFinite(n)) return s('Drop inside the map boundary.');
  if (
    !l.land &&
    ![
      'ocean',
      'land',
      'fish',
      'duck',
      'otter',
      'cleanup',
      'timber_bridge',
      'stone_bridge',
      'remove_bridge',
    ].includes(t)
  )
    return s('This needs dry land. Reclaim land first or choose a spot inside the coast.');
  let c = placementPreview(e, t, a, n, r);
  if ((isBuildingItem(o) || o.category === 'roads') && !c.ok) return s(c.reason);
  let u = c.cost;
  if (e.wallet.gold < u)
    return s(
      `Not enough gold. ${o.name} costs ${o.cost}; you have ${Math.floor(e.wallet.gold)}. Collect and trade goods in the Market.`,
    );
  let d =
      BUILDING_SIZES[t]?.radius ??
      {
        river: 1.25,
        ocean: 1.9,
        land: 1.3,
        mountain: 1.8,
        snowpeak: 1.8,
        hill: 1.8,
        pond: 1.7,
        rock: 1.2,
        erase: 2.5,
      }[t] ??
      0.7,
    m = e.buildings.some((p) => Math.hypot(p.x - a, p.y - n) < (BUILDING_SIZES[p.kind]?.radius ?? 1.2) + d);
  if (m && ['ocean', 'river', 'pond', 'land', 'mountain', 'snowpeak', 'hill', 'rock'].includes(t))
    return s('A building occupies this patch. Clear it before reshaping the terrain.');
  let h = bridgeAt(e, a, n);
  if (h && t === 'remove_bridge') {
    let p = h.buildProgress < 1;
    return (
      removeBridge(e, h.id),
      announce(
        e,
        p
          ? 'Crossing cancelled. Half of its materials and gold recovered.'
          : 'Bridge removed. River restored.',
      ),
      { ok: !0, message: e.message }
    );
  }
  if (
    ['ocean', 'river', 'pond', 'land', 'mountain', 'snowpeak', 'hill', 'rock', 'erase'].includes(t) &&
    (e.bridges ?? []).some((p) =>
      bridgeTiles(p).some((g) => Math.hypot(g.x + 0.5 - a, g.y + 0.5 - n) < d + 1),
    )
  )
    return s('Remove the bridge before reshaping its river or approaches.');
  if (h && (isBuildingItem(o) || o.category === 'plants' || (o.category === 'roads' && !isBridge(t))))
    return s('This is a bridge approach. Keep it clear or use Remove bridge.');
  if (isBridge(t)) {
    let p = bridgePlan(e, t, a, n, r);
    if (!p.ok || !p.bridge) return s(p.reason);
    (e.bridges ?? (e.bridges = []),
      e.bridges.push({ ...p.bridge, id: e.nextId++ }),
      announce(e, `${o.name}: ${p.reason}. Construction started.`));
  } else if (isBuildingItem(o)) {
    if (e.buildings.length >= MAX_POPULATION) return s('The settlement has room for 960 buildings.');
    if (l.pond || l.rock || l.elevation > 12) return s('Buildings need flat, dry ground.');
    if (m) return s('Leave a little more room between buildings.');
    if (e.plants.some((p) => p.health > 0 && Math.hypot(p.x - a, p.y - n) < 1.1))
      return s('Clear these plants before building here.');
    if (
      ['fishery', 'harbor', 'watermill', 'shipyard', 'pier'].includes(t) &&
      !nearby(e, a, n, 4, !1).some((p) => isWater(p) && (t !== 'watermill' || (p.land && p.pond)))
    )
      return s('This building needs suitable water within four tiles.');
    if (
      (e.buildings.push({
        id: e.nextId++,
        kind: t,
        x: a,
        y: n,
        orientation: r,
        progress: 0,
        buildProgress: 0,
        stored: 0,
      }),
      t === 'farm')
    )
      for (let p of nearby(e, a, n, 1.3))
        ((p.soil = Math.max(p.soil, 0.6)), (p.moisture = Math.max(p.moisture, 0.45)));
    announce(
      e,
      `${o.name}: construction started. Ready in ${islandTime(Ia[t])}. Pause stops work; fast-forward speeds it up.`,
    );
  } else if (o.category === 'roads') {
    l.road = t === 'remove_road' ? !1 : t;
    let p = strokeTotal(t, u);
    announce(
      e,
      `${o.name} \xB7 ${p.tiles} tile${p.tiles === 1 ? '' : 's'} \xB7 ${p.gold} gold spent. ${t === 'remove_road' ? 'Cleared.' : 'Nearby production +' + Math.round(jp[t] * 100) + '%.'}`,
    );
  } else if (['river', 'ocean', 'land', 'mountain', 'snowpeak', 'hill', 'road'].includes(t)) {
    let g = nearby(
      e,
      a,
      n,
      t === 'ocean' ? 1.9 : t === 'land' ? 1.3 : t === 'road' ? 0.76 : t === 'river' ? 1.25 : 1.8,
      t !== 'ocean' && t !== 'land',
    );
    if (t === 'road' && (l.pond || l.rock)) return s('Roads need dry, clear ground.');
    if (
      Hr.includes(t) &&
      g.every((v) =>
        t === 'road'
          ? v.road
          : t === 'river'
            ? v.waterType === 'river'
            : t === 'ocean'
              ? !v.land
              : v.land && !v.pond && v.elevation === 0,
      )
    )
      return s('That section is already shaped this way. No gold spent.');
    if (
      ['mountain', 'snowpeak', 'hill'].includes(t) &&
      e.features.some((v) => Math.hypot(v.x - a, v.y - n) < 2.2)
    )
      return s('Leave more room between peaks and hills.');
    for (let v of g)
      ((t === 'river' || t === 'ocean') &&
        ((v.pond = t === 'river'),
        (v.land = t !== 'ocean'),
        (v.waterType = t === 'river' ? 'river' : 'ocean'),
        (v.moisture = 1),
        (v.rock = !1),
        (v.road = !1),
        (v.elevation = 0)),
        t === 'land' &&
          ((v.land = !0),
          (v.pond = !1),
          (v.waterType = null),
          (v.elevation = 0),
          (v.rock = !1),
          (v.soil = 0.2),
          (v.moisture = 0.25)),
        t === 'road' && (v.road = 'road'),
        ['mountain', 'snowpeak', 'hill'].includes(t) &&
          ((v.pond = !1),
          (v.waterType = null),
          (v.rock = t !== 'hill'),
          (v.elevation = t === 'hill' ? 18 : 12),
          (v.road = !1),
          t === 'snowpeak' && (v.snow = 1)));
    if (
      ((t === 'ocean' || t === 'land' || t === 'river') &&
        ((e.features = e.features.filter(
          (v) => !g.some((M) => Math.floor(v.x) === M.x && Math.floor(v.y) === M.y),
        )),
        (e.plants = e.plants.filter(
          (v) => !g.some((M) => Math.floor(v.x) === M.x && Math.floor(v.y) === M.y),
        ))),
      ['mountain', 'snowpeak', 'hill'].includes(t) &&
        e.features.push({ id: e.nextId++, kind: t, x: a, y: n }),
      Hr.includes(t))
    ) {
      let v = strokeTotal(t, u);
      announce(
        e,
        `${o.name} \xB7 ${v.tiles} section${v.tiles === 1 ? '' : 's'} \xB7 ${v.gold} gold spent. Keep dragging to continue.`,
      );
    } else announce(e, `${o.name} placed. ${o.description}`);
  } else if (o.category === 'plants') {
    if (m) return s('Plant a little farther from this building.');
    if (l.rock || (l.pond && !uf.has(t)))
      return s('Choose soil for this plant. Reeds and sedge can grow in fresh water.');
    if (e.plants.length >= MAP_LIMIT)
      return s('This island has room for 2000 plants. Clear a patch before adding more.');
    let p = Math.min(
        MAP_LIMIT - e.plants.length,
        [
          'grass',
          'flowers',
          'clover',
          'fern',
          'heather',
          'lupine',
          'bluebells',
          'bracken',
          'reeds',
          'sedge',
        ].includes(t)
          ? 5
          : 1,
      ),
      g = 0;
    for (let v = 0; v < p; v++) {
      let M = p === 1 ? a : clamp(a + (random(e) - 0.5) * 1.8, 0.1, GRID_W - 0.1),
        w = p === 1 ? n : clamp(n + (random(e) - 0.5) * 1.8, 0.1, GRID_H - 0.1),
        y = cellAt(e, M, w);
      y?.land &&
        (!y.pond || uf.has(t)) &&
        !y.rock &&
        !e.buildings.some(
          (k) => (k.x - M) ** 2 + (k.y - w) ** 2 < ((BUILDING_SIZES[k.kind]?.radius ?? 1.2) + 0.35) ** 2,
        ) &&
        (e.plants.push({
          id: e.nextId++,
          kind: t,
          x: M,
          y: w,
          growth: 0.02,
          health: 1,
          age: 0,
          variant: random(e),
        }),
        g++);
    }
    if (!g) return s('This patch is too close to the shoreline. Try farther inland.');
    announce(
      e,
      `${o.name} planted. ${l.moisture < 0.2 ? 'Add water here to wake the seeds.' : l.soil < 0.3 ? 'Add rich soil or compost to help them grow.' : 'Let time pass and watch the seedlings grow.'}`,
    );
  } else if (o.category === 'animals') {
    if (e.animals.length >= wn) return s(`The island has room for ${wn} animals.`);
    let p = e.animals.filter((M) => M.kind === t).length;
    if (p >= Br)
      return s(
        `The island supports ${Br} ${o.name.toLowerCase()} at most. Try another species: a varied island is healthier.`,
      );
    if (!canStand(t, l)) return s(t === 'fish' ? df.fish : 'This animal needs dry land beside the water.');
    if (!habitatOk(e, t, a, n)) return s(df[t] ?? 'This spot cannot support this animal.');
    let g = Math.min(fs[t] ?? 1, wn - e.animals.length, Br - p),
      v = 0;
    for (let M = 0; M < g; M++) {
      let w = M ? clamp(a + (random(e) - 0.5) * 1.6, 0.1, GRID_W - 0.1) : a,
        y = M ? clamp(n + (random(e) - 0.5) * 1.6, 0.1, GRID_H - 0.1) : n,
        k = cellAt(e, w, y);
      (M && !canStand(t, k)) ||
        (e.animals.push({
          id: e.nextId++,
          kind: t,
          x: w,
          y,
          tx: w,
          ty: y,
          age: 0,
          health: 1,
          direction: M && random(e) < 0.5 ? -1 : 1,
          cooldown: M * 0.15,
        }),
        v++);
    }
    ((e.arrival = { x: a, y: n, kind: t, at: Date.now() }),
      announce(
        e,
        `${v > 1 ? `${v} ${o.name.toLowerCase()}` : o.name} added.${v < g ? ` Only room for ${v} here.` : ''} ${o.description.replace(/ ?Arrives as (a family of \d+|a pair)\.?/, '')}`,
      ));
  } else {
    if ((t === 'nuclear' || t === 'trash') && e.objects.length >= 150)
      return s('Clear some waste before adding more. This island holds 150 objects.');
    let p = nearby(
      e,
      a,
      n,
      t === 'pond' ? 1.7 : t === 'rock' ? 1.2 : t === 'nuclear' ? 1 : t === 'erase' ? 1.3 : 2.3,
    );
    if (
      t === 'fire' &&
      !p.some(
        (g) => g.fuel > 0.1 || e.plants.some((v) => v.health > 0 && Math.hypot(v.x - g.x, v.y - g.y) < 1.7),
      )
    )
      return s('There is nothing to burn here. A spark needs fuel or vegetation.');
    for (let g of p)
      (t === 'water' && ((g.moisture = clamp(g.moisture + 0.7)), (g.fire = Math.max(0, g.fire - 0.85))),
        t === 'soil' && ((g.soil = clamp(g.soil + 0.62)), (g.rock = !1), (g.pond = !1), (g.waterType = null)),
        t === 'compost' && ((g.soil = clamp(g.soil + 0.48)), (g.moisture = clamp(g.moisture + 0.1))),
        t === 'pond' &&
          ((g.pond = !0), (g.waterType = 'pond'), (g.rock = !1), (g.moisture = 1), (g.elevation = 0)),
        t === 'sand' &&
          ((g.soil = 0.08), (g.moisture *= 0.25), (g.pond = !1), (g.waterType = null), (g.rock = !1)),
        t === 'rock' && ((g.rock = !0), (g.pond = !1)),
        t === 'oil' && ((g.oil = clamp(g.oil + 0.8)), (g.toxicity = clamp(g.toxicity + 0.65))),
        t === 'gasoline' && ((g.fuel = clamp(g.fuel + 0.9)), (g.toxicity = clamp(g.toxicity + 0.4))),
        t === 'nuclear' && (g.radiation = clamp(g.radiation + 0.5)),
        t === 'acid' && ((g.toxicity = clamp(g.toxicity + 0.92)), (g.soil *= 0.4)),
        t === 'trash' && ((g.toxicity = clamp(g.toxicity + 0.16)), (g.soil *= 0.85)),
        t === 'fire' && (g.fire = 0.8),
        t === 'cleanup' && ((g.oil = 0), (g.fuel = 0), (g.toxicity *= 0.15), (g.fire = 0)),
        t === 'biochar' && ((g.toxicity *= 0.4), (g.soil = clamp(g.soil + 0.25))));
    if (
      ((t === 'nuclear' || t === 'trash') && e.objects.push({ id: e.nextId++, kind: t, x: a, y: n }),
      (t === 'cleanup' || t === 'erase') &&
        (e.objects = e.objects.filter((g) => Math.hypot(g.x - a, g.y - n) > 2.4)),
      t === 'erase')
    ) {
      ((e.plants = e.plants.filter((g) => Math.hypot(g.x - a, g.y - n) > 1.8)),
        (e.animals = e.animals.filter((g) => Math.hypot(g.x - a, g.y - n) > 1.8)),
        (e.buildings = e.buildings.filter((g) => Math.hypot(g.x - a, g.y - n) > 1.8)),
        (e.features = e.features.filter((g) => Math.hypot(g.x - a, g.y - n) > 2.4)));
      for (let g of nearby(e, a, n, 2.5))
        ((g.rock = !1), (g.pond = !1), (g.waterType = null), (g.elevation = 0), (g.road = !1), (g.fire = 0));
    }
    announce(
      e,
      t === 'nuclear'
        ? 'Tanner\u2019s vat placed. Its taint will seep into nearby ground.'
        : t === 'cleanup'
          ? 'Spills and waste removed. The lingering taint takes time to fade.'
          : `${o.name} added. ${o.description}`,
    );
  }
  e.wallet.gold -= u;
  for (let [p, g] of Object.entries(c.materials ?? o.materials ?? {})) e.wallet[p] -= g;
  return (
    e.revision++,
    (e.spent += u),
    e.placements++,
    (CATALOG[t]?.category === 'ground' ||
      ['river', 'pond', 'ocean', 'land', 'erase', 'mountain', 'snowpeak', 'hill'].includes(t)) &&
      (e.terrainRevision = (e.terrainRevision ?? 0) + 1),
    { ok: !0, message: e.message }
  );
}
function setWeather(e, t) {
  if (e.story.mode === 'campaign') {
    announce(
      e,
      'The voyage follows its forecast. Open the journal to see the seasons, or continue in Free build to choose weather.',
    );
    return;
  }
  if (t === 'auto') {
    ((e.autoWeather = !0),
      (e.nextWeather = e.time + 0.65),
      announce(e, 'Weather will now change naturally as island days pass.'));
    return;
  }
  ((e.autoWeather = !1),
    (e.weather = t),
    announce(e, `${Ur.find((a) => a.id === t)?.name}. ${Ur.find((a) => a.id === t)?.description}.`));
}

export { addItem, setWeather };
