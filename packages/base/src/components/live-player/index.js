
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _framework_dev__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/framework/ */ "./src/framework/dev.tsx");
/* harmony import */ var create_react_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! create-react-class */ "./node_modules/create-react-class/index.js");
/* harmony import */ var create_react_class__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(create_react_class__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/utils/system */ "./src/utils/system.tsx");
/* harmony import */ var _utils_addEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/utils/addEvents */ "./src/utils/addEvents.tsx");
/* harmony import */ var _utils_callBridge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/utils/callBridge */ "./src/utils/callBridge.tsx");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./index.less */ "./src/live-player/index.less");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_6__);







var id = 0;
var cacheLivePlayerId = {};
var LivePlayer = Object(_framework_dev__WEBPACK_IMPORTED_MODULE_1__["createComponent"])({
    name: 'live-player',
    trackPageUpdateForIOS: true
})(create_react_class__WEBPACK_IMPORTED_MODULE_2___default()({
    displayName: 'LivePlayer',
    getDefaultProps: function getDefaultProps() {
        return {
            src: undefined,
            mode: 'live',
            autoplay: false,
            muted: false,
            orientation: 'vertical',
            objectFit: 'contain',
            backgroundMute: false,
            minCache: 1,
            maxCache: 3,
            onStateChange: function onStateChange() {},
            onNetStatus: function onNetStatus() {},
            onFullscreenChange: function onFullscreenChange() {},
            onError: function onError() {}
        };
    },
    componentDidMount: function componentDidMount() {
        // android bug
        if (_utils_system__WEBPACK_IMPORTED_MODULE_3__["isAndroid"] && !cacheLivePlayerId[this.getId()]) {
            this.readyForRender = false;
            this.detachLivePlayerReady = Object(_utils_addEvents__WEBPACK_IMPORTED_MODULE_4__["default"])(document, {
                'nbcomponent.canrender': this.onNativeReady
            });
        } else {
            this.readyForRender = true;
            this.renderLivePlayer();
        }
        this.detachEvents = Object(_utils_addEvents__WEBPACK_IMPORTED_MODULE_4__["default"])(document, {
            'nbcomponent.live-player.onChangeState': this.onStateChange,
            'nbcomponent.live-player.onTimeUpdate': this.onNetStatus,
            'nbcomponent.live-player.onFullscreenChange': this.onFullscreenChange,
            'nbcomponent.live-player.onError': this.onError
        });
    },
    componentDidUpdate: function componentDidUpdate() {
        this.renderLivePlayer();
    },
    componentWillUnmount: function componentWillUnmount() {
        Object(_utils_callBridge__WEBPACK_IMPORTED_MODULE_5__["default"])('NBComponent.remove', {
            element: this.getId()
        });
        this.detachEvents.remove();
    },
    onNativeReady: function onNativeReady(e) {
        if (!e || e.elementid === this.getId()) {
            this.readyForRender = true;
            cacheLivePlayerId[this.getId()] = true;
            this.renderLivePlayer();
        }
    },
    clearRenderDelay: function clearRenderDelay() {
        if (this.detachLivePlayerReady) {
            this.detachLivePlayerReady.remove();
            this.detachLivePlayerReady = null;
        }
    },
    renderLivePlayer: function renderLivePlayer() {
        if (!this.readyForRender || !_utils_system__WEBPACK_IMPORTED_MODULE_3__["isNativeComponent"]) {
            return;
        }
        this.clearRenderDelay();
        var src = this.src,
            mode = this.mode,
            autoplay = this.autoplay,
            muted = this.muted,
            orientation = this.orientation,
            objectFit = this.objectFit,
            backgroundMute = this.backgroundMute,
            minCache = this.minCache,
            maxCache = this.maxCache;

        Object(_utils_callBridge__WEBPACK_IMPORTED_MODULE_5__["default"])('NBComponent.render', {
            element: this.getId(),
            data: {
                src: src,
                mode: mode,
                autoplay: autoplay,
                muted: muted,
                orientation: orientation,
                objectFit: objectFit,
                backgroundMute: backgroundMute,
                minCache: minCache,
                maxCache: maxCache
            }
        });
    },
    getId: function getId() {
        if (this.id) {
            return this.id;
        }
        this.id = this.props.id || 'mp_live_player_' + ++id;
        return this.id;
    },
    onChangeState: function onChangeState(e) {
        var _e$data = e.data,
            element = _e$data.element,
            code = _e$data.code;
        var _props = this.props,
            onChangeState = _props.onChangeState,
            $mp = _props.$mp;

        if (this.getId() === element) {
            if (onChangeState) {
                onChangeState($mp.getNormalizedEvent('changeState', {
                    detail: {
                        code: code
                    }
                }));
            }
        }
    },
    onNetStatus: function onNetStatus(e) {
        var _e$data2 = e.data,
            element = _e$data2.element,
            info = _e$data2.info;
        var _props2 = this.props,
            onNetStatus = _props2.onNetStatus,
            $mp = _props2.$mp;

        if (this.getId() === element) {
            if (onNetStatus) {
                onNetStatus($mp.getNormalizedEvent('netStatus', {
                    detail: {
                        info: info
                    }
                }));
            }
        }
    },
    onFullscreenChange: function onFullscreenChange(e) {
        var _e$data3 = e.data,
            element = _e$data3.element,
            direction = _e$data3.direction,
            fullScreen = _e$data3.fullScreen;
        var _props3 = this.props,
            onFullscreenChange = _props3.onFullscreenChange,
            $mp = _props3.$mp;

        if (this.getId() === element) {
            if (onFullscreenChange) {
                onFullscreenChange($mp.getNormalizedEvent('fullscreenChange', {
                    detail: {
                        direction: direction,
                        fullScreen: fullScreen
                    }
                }));
            }
        }
    },
    onError: function onError(e) {
        var _e$data4 = e.data,
            element = _e$data4.element,
            errMsg = _e$data4.errMsg,
            errCode = _e$data4.errCode;
        var _props4 = this.props,
            onError = _props4.onError,
            $mp = _props4.$mp;

        if (this.getId() === element) {
            if (onError) {
                onError($mp.getNormalizedEvent('error', {
                    detail: {
                        errMsg: errMsg,
                        errCode: errCode
                    }
                }));
            }
        }
    },
    render: function render() {
        var _props5 = this.props,
            style = _props5.style,
            className = _props5.className,
            id = _props5.id;

        if (!_utils_system__WEBPACK_IMPORTED_MODULE_3__["isNativeComponent"]) {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                'div',
                { className: className, style: style, id: id },
                '\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301live-player\u7EC4\u4EF6'
            );
        }
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'object',
            { className: className + ' nbcomponentanimation-' + this.getId(), style: style, id: id, type: 'application/view', role: 'application' },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('param', { name: 'type', value: 'live-player' }),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement('param', { name: 'id', value: this.getId() })
        );
    }
}));
/* harmony default export */ __webpack_exports__["default"] = (LivePlayer);

