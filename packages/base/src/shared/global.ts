export const g = (function () {
  let local: any;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('global object is unavailable in this environment');
    }
  }
  return local;
})();
