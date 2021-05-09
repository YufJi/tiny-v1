__webpack_require__.r(__webpack_exports__);
/* harmony import */ const babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ './node_modules/babel-runtime-loose/helpers/extends.js');
/* harmony import */ const babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /* #__PURE__ */__webpack_require__.n(babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ const _ap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ap */ './src/bridge/ap.worker.tsx');

const __rest = undefined && undefined.__rest || function (s, e) {
  const t = {};
  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  } if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }
  } return t;
};

function LivePlayerContext(params) {
  Object.assign(this, params);
}
const contextPrototype = LivePlayerContext.prototype = {};
function callAction(action, params) {
  _ap__WEBPACK_IMPORTED_MODULE_1__.default.call('NBComponent.sendMessage', { ...params, element: this.element, actionType: action, viewId: this.page.getViewId() });
}
function noop() {}
['play', 'stop', 'mute', 'pause', 'resume', 'requestFullScreen', 'exitFullScreen'].forEach((action) => {
  contextPrototype[action] = function livePlayerAction(params) {
    const _a = params || {};
    const _a$success = _a.success;
    const success = _a$success === undefined ? noop : _a$success;
    const _a$fail = _a.fail;
    const fail = _a$fail === undefined ? noop : _a$fail;
    const _a$complete = _a.complete;
    const complete = _a$complete === undefined ? noop : _a$complete;
    const rest = __rest(_a, ['success', 'fail', 'complete']);
    callAction.call(this, action, {
      data: rest,
      success,
      fail,
      complete,
    });
  };
});
/* harmony default export */ __webpack_exports__.default = (LivePlayerContext);
