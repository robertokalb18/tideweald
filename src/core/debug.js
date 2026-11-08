// Developer API, loaded only when globalThis.__twDebug is set before the game starts.
import { serializeWorld, serializeWorldAsync, readIslandText } from '../persistence/save.js';
import { encodeStoredSave, encodeStoredSaveOffThread } from '../persistence/compression.js';
import { advanceWorld } from './simulation.js';
import { staticsFor } from '../render/world-draw.js';
import { CHAPTERS } from '../progression/campaign.js';
import { COUNCIL_DECISIONS } from '../progression/council.js';
import { CATALOG } from '../world/catalog.js';

export function installDebugApi() {
  globalThis.__twx = {
    ps: advanceWorld,
    IM: staticsFor,
    ser: serializeWorld,
    serAsync: serializeWorldAsync,
    pack: encodeStoredSave,
    packOffThread: encodeStoredSaveOffThread,
    read: readIslandText,
    chapters: CHAPTERS,
    council: COUNCIL_DECISIONS,
    catalog: CATALOG,
  };
}
