__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'default', () => { return OptionMenuItemAP; });
/* harmony import */ const babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ './node_modules/babel-runtime-loose/helpers/extends.js');
/* harmony import */ const babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /* #__PURE__ */__webpack_require__.n(babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ const _utils_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/system */ './src/utils/system.tsx');
/* harmony import */ const _ap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ap */ './src/bridge/ap.worker.tsx');
/* harmony import */ const _framework_dev__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../framework/dev */ './src/framework/dev.tsx');

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

function onPopMenuClick() {
  const data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const { index } = data;
  const rest = __rest(data, ['index']);
  const page = Object(_framework_dev__WEBPACK_IMPORTED_MODULE_3__.getCurrentPageImpl)();
  if (page && page.publicInstance.onPopMenuClick) {
    page.publicInstance.onPopMenuClick({ index: Number(index), ...rest });
  }
}
const g10135 = Object(_utils_system__WEBPACK_IMPORTED_MODULE_1__.compareSystemVersion)('10.1.35') >= 0;
let v10135Api = {};
if (g10135) {
  _ap__WEBPACK_IMPORTED_MODULE_2__.default.onUserEventData('customPopMenuClicked', onPopMenuClick);
  v10135Api = {
    setCustomPopMenu: {
      b: function b(opt) {
        const page = Object(_framework_dev__WEBPACK_IMPORTED_MODULE_3__.getCurrentPageImpl)();
        opt.viewId = page.getViewId();
      },
    },
  };
}
function OptionMenuItemAP() {
  return { hideAddToDesktopMenu: {
    m: 'hideOptionMenuItem',
    b: function b(opt) {
      opt.scope = 'single';
      opt.name = 'add2Desktop';
    },
  },
  hideAllAddToDesktopMenu: {
    m: 'hideOptionMenuItem',
    b: function b(opt) {
      opt.scope = 'all';
      opt.name = 'add2Desktop';
    },
  },
  hideFavoriteMenu: {
    m: 'hideOptionMenuItem',
    b: function b(opt) {
      opt.scope = 'single';
      opt.name = 'favorite';
    },
  },
  hideAllFavoriteMenu: {
    m: 'hideOptionMenuItem',
    b: function b(opt) {
      opt.scope = 'all';
      opt.name = 'favorite';
    },
  },
  ...v10135Api };
}
