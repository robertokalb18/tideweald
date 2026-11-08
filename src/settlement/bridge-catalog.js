// Recovered from the Tideweald v16.11 build. Module: settlement/bridge-catalog

var BRIDGE_ITEMS = [
  {
    id: 'timber_bridge',
    name: 'Timber bridge',
    category: 'roads',
    icon: 'route',
    color: '#be8a48',
    atlas: 'bridges',
    sprite: 0,
    cost: 20,
    materials: { timber: 8 },
    description:
      'Span a river between two clear banks. 20 gold + 8 timber per section. Tap water, Turn to align, then confirm the full cost.',
  },
  {
    id: 'stone_bridge',
    name: 'Stone bridge',
    category: 'roads',
    icon: 'route',
    color: '#d7c897',
    atlas: 'bridges',
    sprite: 2,
    cost: 30,
    materials: { timber: 4, stone: 8 },
    description:
      'A stone crossing with cobbled approaches. 30 gold + 4 timber + 8 stone per section. Up to 12 water tiles; takes longer to build.',
  },
  {
    id: 'remove_bridge',
    name: 'Remove bridge',
    category: 'roads',
    icon: 'eraser',
    color: '#9c7953',
    cost: 0,
    description:
      'Tap a crossing to remove the whole bridge. Unfinished work returns 50% of its resources; completed bridges have no refund.',
  },
];
var isBridge = (e) => e === 'timber_bridge' || e === 'stone_bridge';

export { BRIDGE_ITEMS, isBridge };
