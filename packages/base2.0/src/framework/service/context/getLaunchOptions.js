/*
 * @Author: YufJ
 * @Date: 2021-07-04 00:02:07
 * @LastEditTime: 2021-07-12 01:51:29
 * @Description:
 * @FilePath: /tiny-v1/packages/base2.0/src/framework/service/context/getLaunchOptions.js
 */
import { memoize, isString, isObject } from 'lodash';

import { invokeNative } from '../bridge';
import { error, debug } from '../utils/log';

const getLaunchOptions = memoize(() => {
  try {
    const res = invokeNative('getLaunchOptionsSync');
    debug('launchOptions', res);
    let query;

    if (isString(res.query)) {
      // NOTE: 客户端传递的query是字符串格式，需要手动解析成object
      query = querystring.parse(res.query);
    } else if (isObject(res.query)) {
      query = res.query;
      Object.entries(query).forEach(([key, value = '']) => {
        query[key] = decodeURIComponent(value.toString());
      });
    } else {
      query = {};
    }

    return {
      query,
      path: res.path,
      scene: res.scene,
      refererInfo: res.refererInfo,
    };
  } catch (e) {
    error(e);
    return {};
  }
});

export default getLaunchOptions;
