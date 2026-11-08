// Class public-field helper kept from the original build output.
export const __publicField = (obj, key, value) =>
  Object.defineProperty(obj, typeof key !== 'symbol' ? key + '' : key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value,
  });
