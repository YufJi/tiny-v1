/* eslint-disable import/no-cycle */
/*
 * @Author: YufJ
 * @Date: 2021-07-07 11:51:58
 * @LastEditTime: 2021-07-10 03:20:42
 * @Description:
 * @FilePath: /tiny-v1/packages/base2.0/src/framework/webview/hooks.js
 */
import { forOwn, hasIn, kebabCase } from 'lodash';
import { Deferred, mergeData } from '@utils';
import { getPageInfoFromUrl } from '@utils/pageInfoAndUrl';
import { useState, useRef, useContext, useLayoutEffect, useEffect, useMemo } from './nerv';
import { FieldsContext, ConfigContext, ComponentHubContext } from './context';
import {
  onComponentDataChange,
  onDisableScroll,
  onPageScrollTo,
  onRequestComponentObserver,
  onSelectComponent,
  onSelectComponentInPage,
  onTriggerComponentEvent,
} from './api';
import { registerCustomComponents, createComponentResolve } from './CustomComponent';
import { filterDataset, normalizeProps } from './util';

export function usePageFields() {
  const fields = useContext(FieldsContext);
  return fields;
}

export function useJSBridge() {
  return usePageFields().bridge;
}

export function useJSBridgeFn(callback) {
  const { bridge } = usePageFields();
  useCreation(() => {
    return callback(bridge);
  });
}

export function useConfigContext() {
  return useContext(ConfigContext);
}

export function useComponentHubContext() {
  return useContext(ComponentHubContext);
}

export function useInitPageConfig(bridge) {
  const [config, setConfig] = useState();

  useCreation(() => {
    bridge.subscribe('INIT_DATA_READY', (data) => {
      if (data.config) {
        setConfig(data.config);
      }
    });
  });

  return config;
}

export function usePrevious(o) {
  const ref = useRef();

  useEffect(() => {
    ref.current = o;
  }, [o]);

  return ref.current;
}

export function useCreation(callback) {
  const ref = useRef({
    result: undefined,
    initialized: false,
  }).current;

  if (!ref.initialized) {
    ref.result = callback();
    ref.initialized = true;
  }

  return ref.result;
}

export function useCompileResult() {
  const { route } = getPageInfoFromUrl(location.href);
  const [result, setResult] = useState({});

  useCreation(() => {
    const compiled = window.app[route];
    setResult((prev) => (prev.render ? prev : compiled));
  });

  return result;
}

export function usePageData(render) {
  const [data, setData] = useState({});
  const ref = useRef(new Deferred());

  useJSBridgeFn((bridge) => {
    const { subscribe, replyService } = bridge;

    subscribe('INIT_DATA_READY', (e) => {
      const { data } = e;
      setData(data);
    });

    replyService('appDataChange')(async (params) => {
      const { data, options } = params;
      setData((prev) => mergeData(prev, data));

      return ref.current.promise;
    });
  });

  useLayoutEffect(() => {
    if (render) {
      ref.current.resolve();
      ref.current = new Deferred();
    }
  });

  return data;
}

export function useRenderContext() {
  const { publish } = useJSBridge();
  const config = useConfigContext();
  const fields = usePageFields();
  const resolveComponent = useResolveComponent(config);

  return {
    $$eventBinder: useCreation(() => {
      return memoize((type) => {
        const handler = function (data) {
          return publish('PAGE_EVENT', { type, data, nodeId: 0 });
        };
        handler.displayName = type;

        return handler;
      });
    }),
    $$resolveComponent: resolveComponent,
    __fields: fields,
    __dirname: (config && config.route) || '',
  };
}

export function useResolveComponent(config) {
  return useMemo(() => {
    if (!config) {
      return function () {
        return null;
      };
    }

    const { __allConfig__, customComponents, route } = config;

    /* 注册自定义组件 */
    const getCustomComponents = registerCustomComponents(__allConfig__, customComponents);
    const findHandler = function (is) {
      return !!__allConfig__[is];
    };

    return function (name) {
      const is = __allConfig__[route].usingComponents && __allConfig__[route].usingComponents[name];

      if (!is) return null;

      const cpath = createComponentResolve(route, findHandler)(is);
      const CC = getCustomComponents(cpath); // 真正调用vdom render

      CC.displayName = name;
      return CC;
    };
  }, [config]);
}

export function useComponentHub() {
  const instances = useInstanceHub();
  const events = useEventHub();

  return useCreation(() => {
    return { events, instances };
  });
}

export function useInstanceHub() {
  return useCreation(() => {
    const instanceMap = new Map();
    return {
      remove(is) {
        instanceMap.delete(is);
      },
      set(is, instance) {
        instanceMap.set(is, instance);
      },
      get(is) {
        return instanceMap.get(is) || null;
      },
    };
  });
}

const getDispatchKey = function (nodeId, t) {
  return `${t}:${nodeId}`;
};

export function useEventHub() {
  return useCreation(() => {
    const eventMap = new Map();

    return {
      subscribe(t, n, callback) {
        const key = getDispatchKey(n, t);
        eventMap.set(key, callback);

        return {
          remove() {
            eventMap.delete(key);
          },
        };
      },
      dispatch(t, n) {
        const { nodeId } = n;
        const fn = eventMap.get(getDispatchKey(nodeId, t));
        return fn ? fn(n) : null;
      },
    };
  });
}

export function useJSCoreEvent(componentHub) {
  const { bridge, emitter, root } = usePageFields();

  return useCreation(() => {
    onComponentDataChange(bridge, componentHub);
    onTriggerComponentEvent(bridge, componentHub);
    onRequestComponentObserver(bridge, componentHub, emitter, root);
    onSelectComponentInPage(bridge, root);
    onSelectComponent(bridge, componentHub);
    onRequestComponentInfo(bridge, componentHub, root);
    onGetRelationNode(bridge, componentHub);
    onAnimationStatusChange(emitter);
    onAppLoadStatusChange(bridge);
    onDisableScroll(bridge);
    onPageScrollTo(bridge);
  });
}

export function useInitAction() {
  const fields = usePageFields();
  const config = useConfigContext();

  useLayoutEffect(() => {
    initBodyScrollGetter();
  }, []);

  useEffect(() => {
    if (config) {
      enableScroll(config, fields);
      initSwipeBackPatch(config);
      initSupportRTL(config);
    }
  }, [config, fields]);
}

const toggleReducer = function (state, action) {
  return isBoolean(action) ? action : !state;
};

const useBoolean = function (initial) {
  return useReducer(toggleReducer, initial);
};

export function useRenderMode() {
  const [mode, setMode] = useState('Fallback');

  const normalState = useNormalState();
  const snapshotState = useSnapshotState();

  mode === 'Fallback'
    ? normalState
      ? setMode('Normal')
      : snapshotState && setMode('Snapshot')
    : mode === 'Snapshot' && normalState && !snapshotState && setMode('Normal');

  return mode;
}

export function useNormalState() {
  const ref = useRef(false);
  const [bool, setBool] = useState(false);

  useJSBridgeFn((bridge) => {
    bridge.subscribe('INIT_DATA_READY', () => {
      if (ref.current) {
        setBool(true);
      }
    });
  });

  return bool;
}

export function useSnapshotState() {
  const ref = useRef(0);
  const [bool, dispatch] = useBoolean(false);

  return (
    useJSBridgeFn((bridge) => {
      const { onNative, subscribe } = bridge;

      onNative('onRenderSnapshot', (e) => {
        const { extra_data } = e;
        dispatch(true);
        ref.current = (extra_data && extra_data.snapshot_render_timeout) || 0;
      });

      subscribe('triggerSnapshotDiff', () => {
        setTimeout(() => {
          return dispatch(false);
        }, ref.current);
      });
    }),
    bool
  );
}

export function useFirstRendered(render) {
  const { publish } = useJSBridge();
  const config = useConfigContext();

  useEffect(() => {
    if (render && config && !config.isPageReload) {
      publish('DOCUMENT_READY', {});
    }
  }, [config, publish, render]);
}

let seed = 1;
export function useNodeId() {
  return useCreation(() => {
    return seed += 1;
  });
}

export function useComponentRenderContext(props, nodeId, is, config, resolveComponent) {
  const { publish } = useJSBridge();
  const fields = usePageFields();

  const eventBinder = useCreation(() => {
    return memoize((type) => {
      const handler = function (data) {
        return publish('PAGE_EVENT', { type, data, nodeId });
      };
      handler.displayName = type;
      return handler;
    });
  });

  return {
    $$eventBinder: eventBinder,
    $$resolveComponent: resolveComponent,
    __fields: fields,
    __dirname: is,
  };
}

export function useRefinedProps(props, properties) {
  const _props = normalizeProps(props, properties);
  const prevProps = usePrevious(_props);

  if (prevProps === undefined) return [_props, true];

  const obj = {};
  forOwn(_props, (val, key) => {
    if (!isEqual(prevProps[key], val)) {
      obj[key] = val;
    }
  });

  return [obj, false];
}

export function useRefinedDataset(props) {
  const _dataset = filterDataset(props);
  const prevDataset = usePrevious(_dataset);
  if (prevDataset === undefined) return [_dataset, true];

  const obj = {};
  forOwn(_dataset, (val, key) => {
    if (!isEqual(prevDataset[key], val)) {
      obj[key] = val;
    }
  });

  return [obj, false];
}

export function useDataChange(nodeId, _data, _props) {
  const { emitter } = usePageFields();
  const { events } = useComponentHubContext();
  const [data, setData] = useState(() => {
    return cloneJSON(_data);
  });

  Object.keys(_props).length > 0 && setData((prevData) => {
    return mergeData(prevData, _props);
  });

  const subscriber = useCreation(() => {
    return events.subscribe('componentDataChange', nodeId, (e) => {
      const { data } = e;
      setData((prevData) => {
        return mergeData(prevData, data);
      });
    });
  });

  useLayoutEffect(() => {
    emitter.emit('RE_RENDER', 'deprecated');
  }, [data]);

  useEffect(() => {
    return function () {
      return subscriber.remove();
    };
  }, [subscriber]);

  return data;
}

const LIFE_CYCLE = ['created', 'attached', 'ready', 'detached'];
export function useLifeCycleHooks(nodeId, route) {
  const { publish } = useJSBridge();
  return useCreation(() => {
    return LIFE_CYCLE.map((eventName) => {
      return function () {
        publish('COMPONENT_EVENT', { route, nodeId, eventName });
      };
    });
  });
}

export function useSyncChangedProps(props, nodeId, initial) {
  const { publish } = useJSBridge();
  useEffect(() => {
    initial || Object.keys(props).length === 0 || publish('COMPONENT_DATA_CHANGE', {
      datatype: 'properties',
      data: props,
      nodeId,
    });
  }, [props]);
}

export function useSyncChangedDataset(dataset, nodeId, initial) {
  const { publish } = useJSBridge();
  useEffect(() => {
    initial || Object.keys(dataset).length <= 0 || publish('COMPONENT_DATA_CHANGE', {
      datatype: 'dataset',
      data: dataset,
      nodeId,
    });
  }, [dataset]);
}
