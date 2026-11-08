// Recovered from the Tideweald v16.11 build. Module: ui/cn
import { clsx } from '../vendor/clsx.js';
import { Tp } from '../vendor/tailwind-merge.js';

function pt(...e) {
  return Tp(clsx(e));
}

export { pt };
