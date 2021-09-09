/* eslint-disable */
import each from 'lodash/each';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

import request from 'superagent';

const noop = () => {};
const apiBase = `${window.location.origin}/api`;

const callApi = ({
  custom = false,
  api = '',
  type = 'POST',
  data = {},
  success = noop,
  error = noop
}) => {
  return new Promise((resolve, reject) => {
    request(type, custom?`${api}`:apiBase + api)
      .timeout(200000)
      .type('form')
      .withCredentials()
      .send(toFlattenMap(data))
      .end((err, res) => {
        if (err || !res.ok) {
          // not alert, console log
          console.log(`not 200 error msg:${err}`);
          error(err);
          reject(err);
        } else {
          // http res code is 200
          // if (res.body.errorCode === 200) {
          //   // normal
          //   const stringifiedBigNumber = res.text.replace(
          //     /([^\\])":(\d{15,})/g,
          //     '$1":"$2"'
          //   );
          //   const body = JSON.parse(stringifiedBigNumber);
          //   success(body.response);
          //   resolve(body.response);
          // } else if (error) {
          //   error(res.body);
          //   reject(res.body);
          // } else {
          //   console.warn(res.body.errorDescription);
          // }
          const stringifiedBigNumber = res.text.replace(
              /([^\\])":(\d{15,})/g,
              '$1":"$2"'
            );
          const body = JSON.parse(stringifiedBigNumber);
          success(body.response);
        }
      });
  });
};

export default callApi;

function prepend(prefix, name, separator) {
  if (prefix) {
    if (separator) {
      return `${prefix}.${name}`;
    }
    return prefix + name;
  }
  return name;
}

function flatten(prefix, obj, map) {
  if (obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        flatten(prepend(prefix, `[${i}]`, false), item, map);
      }
    } else if (isPlainObject(obj)) {
      if (obj.__type__ === 'map') {
        each(obj, function (propertyObject, propertyName) {
          if (propertyName !== '__type__') {
            flatten(
              prepend(prefix, `[${propertyName}]`, false),
              propertyObject,
              map
            );
          }
        });
      } else {
        each(obj, function (propertyObject, propertyName) {
          flatten(prepend(prefix, propertyName, true), propertyObject, map);
        });
      }
    } else {
      map[prefix] = obj;
    }
  }
}

function toFlattenMap(obj) {
  const map = {};

  flatten(null, obj, map);
  return map;
}
